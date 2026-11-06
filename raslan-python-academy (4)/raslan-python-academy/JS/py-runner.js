/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/py-runner.js  (Phase 3 / Batch 1)
   مشغّل Python الحقيقي (Pyodide) داخل Web Worker.

   - Pyodide الحقيقي يُحمَّل من CDN داخل Worker (نحو 10 ميجابايت أول مرة، ثم يُخزَّن في المتصفح).
     لاستخدام نسخة محلية: ضع مجلد pyodide في Assets/vendor/pyodide/ وعرّف قبل تحميل هذا الملف:
       window.RPA_PYODIDE_URL = 'Assets/vendor/pyodide/';
   - الـ Worker يُنشأ من Blob فيعمل حتى عند فتح الملفات مباشرة (file://).
   - الحلقة اللانهائية: البرنامج يعمل في Worker منفصل، وعند تجاوز المهلة يُنهى الـ Worker
     (terminate) ويُعاد تشغيل المحرك تلقائيًا، فلا تتجمد الصفحة أبدًا.
   - input(): بدون SharedArrayBuffer (غير متاح من file://) نستخدم "إعادة التشغيل بالمدخلات":
     عند أول input() بلا قيمة جاهزة يتوقف البرنامج ويرجع للواجهة لتسأل الطالب، ثم يُعاد تشغيل
     البرنامج بكل المدخلات (مع seed ثابت للأرقام العشوائية ليبقى السلوك متطابقًا).
     ملاحظة: البرامج التي لها آثار جانبية خارجية (مثل الكتابة لملف) تتكرر بين التشغيلات؛ وهذا
     مناسب للتعلم لأن الملفات مؤقتة داخل المحرك.
   الواجهة: window.RPAPython  (load / execute / run / stop / status / onStatus)
   ===================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(root, require('./py-errors.js'));
  else root.RPAPython = factory(root, root.RPAPyErrors);
})(typeof window !== 'undefined' ? window : this, function (root, Err) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* كود Python المنفّذ داخل Pyodide (يُعرَّف مرة واحدة عند التحميل)       */
  /* ------------------------------------------------------------------ */
  var HARNESS = String.raw`
import sys, os, json, builtins, random, linecache, traceback, shutil

def _rpa_snapshot():
    mods = {}
    for name, m in list(sys.modules.items()):
        d = getattr(m, '__dict__', None)
        if isinstance(d, dict):
            mods[name] = (m, dict(d))
    try:
        cwd = os.getcwd()
        files = set(os.listdir(cwd))
    except BaseException:
        cwd, files = None, set()
    return {'mods': mods, 'rl': sys.getrecursionlimit(), 'path': list(sys.path), 'cwd': cwd, 'files': files}

def _rpa_restore(s, _len=len, _list=list, _set=set, _isdir=os.path.isdir, _islink=os.path.islink,
                 _join=os.path.join, _listdir=os.listdir, _chdir=os.chdir, _remove=os.remove,
                 _rmtree=shutil.rmtree, _BE=BaseException, _sys=sys, _mods=sys.modules):
    # عزل: كل تشغيل يبدأ من نفس الحالة ولا يترك أثرًا للتشغيل التالي.
    # كل الدوال المستخدمة هنا مربوطة مسبقًا، فلا يستطيع كود الطالب تعطيلها بتعديل builtins.
    mods = s['mods']
    order = ['builtins', 'sys', 'os', 'posixpath', 'shutil'] + [n for n in mods if n not in ('builtins', 'sys', 'os', 'posixpath', 'shutil')]
    for name in order:
        if name not in mods:
            continue
        m, d = mods[name]
        try:
            _mods[name] = m
            md = m.__dict__
            changed = _len(md) != _len(d)
            if not changed:
                for k in d:
                    if k not in md or md[k] is not d[k]:
                        changed = True
                        break
            if changed:
                for k in _list(md):
                    if k not in d:
                        try:
                            del md[k]
                        except _BE:
                            pass
                for k in d:
                    try:
                        md[k] = d[k]
                    except _BE:
                        pass
        except _BE:
            pass
    for name in _list(_mods):
        if name not in mods:
            try:
                del _mods[name]
            except _BE:
                pass
    try:
        _sys.settrace(None)
        _sys.setprofile(None)
    except _BE:
        pass
    try:
        _sys.path[:] = s['path']
        _sys.setrecursionlimit(s['rl'])
    except _BE:
        pass
    if s['cwd'] is not None:
        try:
            _chdir(s['cwd'])
            for f in _set(_listdir(s['cwd'])) - s['files']:
                p = _join(s['cwd'], f)
                try:
                    if _isdir(p) and not _islink(p):
                        _rmtree(p, ignore_errors=True)
                    else:
                        _remove(p)
                except _BE:
                    pass
        except _BE:
            pass

class _RPAInput(BaseException):
    pass

class _RPALimit(BaseException):
    pass

class _Out:
    def __init__(self, limit):
        self.parts = []
        self.n = 0
        self.limit = limit
    def write(self, s):
        if not isinstance(s, str):
            s = str(s)
        self.n += len(s)
        if self.n > self.limit:
            raise _RPALimit()
        self.parts.append(s)
        return len(s)
    def flush(self):
        pass
    def isatty(self):
        return False
    def getvalue(self):
        return ''.join(self.parts)

def _rpa_exec(code, inputs_json, seed, limit, mark=False, files_json='{}'):
    # mark=True (وضع التصحيح فقط): سطور الإدخال تُحاط بعلامتين \x02 … \x03 ليحذفها المصحح
    inputs = json.loads(inputs_json)
    out = _Out(limit)
    pos = [0]
    res = {'ok': False, 'output': '', 'needInput': False, 'limit': False, 'error': None}

    def _input(prompt=''):
        out.write(('\x02' if mark else '') + str(prompt))
        if pos[0] < len(inputs):
            v = str(inputs[pos[0]])
            pos[0] += 1
            out.write(v + ('\x03' if mark else '') + '\n')
            return v
        raise _RPAInput()

    b = dict(vars(builtins))
    b['input'] = _input
    ns = {'__name__': '__main__', '__builtins__': b}
    snap = _rpa_snapshot()
    old_out, old_err, old_in = sys.stdout, sys.stderr, sys.stdin
    sys.stdout = out
    sys.stderr = out
    try:
        random.seed(seed)
        # ملفات بيانات جاهزة للتمرين (تُنشأ بعد لقطة الحالة، فتُحذف تلقائيًا بعد التشغيل)
        for _fn, _content in json.loads(files_json or '{}').items():
            if isinstance(_fn, str) and '/' not in _fn and _fn not in ('', '.', '..'):
                with open(_fn, 'w') as _fh:
                    _fh.write(str(_content))
        linecache.cache['<student>'] = (len(code), None, code.splitlines(True), '<student>')
        co = compile(code, '<student>', 'exec')
        exec(co, ns)
        res['ok'] = True
    except _RPAInput:
        res['needInput'] = True
    except _RPALimit:
        res['limit'] = True
    except SystemExit:
        res['ok'] = True
    except BaseException as e:
        line = 0
        tb = e.__traceback__
        first = None
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == '<student>':
                if first is None:
                    first = tb
                line = tb.tb_lineno
            tb = tb.tb_next
        if isinstance(e, SyntaxError):
            line = e.lineno or 0
            msg = e.msg or ''
            text = (e.text or '').rstrip('\n')
            offset = e.offset or 0
        else:
            msg = str(e)
            text = ''
            offset = 0
        try:
            trace = ''.join(traceback.format_exception(type(e), e, first))
        except BaseException:
            trace = ''
        res['error'] = {'type': type(e).__name__, 'msg': msg, 'line': line, 'text': text, 'offset': offset, 'trace': trace}
    finally:
        _rpa_restore(snap)
        sys.stdout, sys.stderr, sys.stdin = old_out, old_err, old_in
        res['output'] = out.getvalue()
        linecache.cache.pop('<student>', None)
        ns.clear()
    return json.dumps(res)
`;

  /* ------------------------------------------------------------------ */
  /* كود الـ Worker (يُحوَّل إلى نص ويُشغَّل من Blob)                       */
  /* ------------------------------------------------------------------ */
  function workerMain() {
    var py = null;
    self.onmessage = function (e) {
      var m = e.data;
      if (m.type === 'init') {
        (async function () {
          try {
            importScripts(m.indexURL + 'pyodide.js');
            py = await self.loadPyodide({ indexURL: m.indexURL });
            py.runPython(m.harness);
            self.postMessage({ type: 'ready', version: String(py.version || '') });
          } catch (err) {
            self.postMessage({ type: 'initError', message: String((err && err.message) || err) });
          }
        })();
        return;
      }
      if (m.type === 'run') {
        try {
          var fn = py.globals.get('_rpa_exec');
          var raw = fn(m.code, JSON.stringify(m.inputs), m.seed, m.limit, !!m.mark, JSON.stringify(m.files || {}));
          if (fn && fn.destroy) fn.destroy();
          self.postMessage({ type: 'result', id: m.id, result: JSON.parse(raw) });
        } catch (err) {
          self.postMessage({ type: 'result', id: m.id, result: { ok: false, engine: true, message: String((err && err.message) || err) } });
        }
      }
    };
  }
  var WORKER_SOURCE = '(' + workerMain.toString() + ')();';

  /* ------------------------------------------------------------------ */
  /* الحالة والإعدادات                                                   */
  /* ------------------------------------------------------------------ */
  var VERSION = '0.26.4';
  var config = {
    indexURL: (root && root.RPA_PYODIDE_URL) || ('https://cdn.jsdelivr.net/pyodide/v' + VERSION + '/full/'),
    timeoutMs: 8000,          // أقصى زمن تشغيل لبرنامج الطالب
    loadTimeoutMs: 180000,    // أقصى زمن لتحميل المحرك أول مرة
    outputLimit: 200000,      // أقصى عدد حروف للمخرجات
    maxInputs: 100
  };

  var worker = null, blobUrl = null;
  var status = 'idle';        // idle | loading | ready | error
  var loadError = '';
  var engineVersion = '';
  var loadPromise = null;
  var pending = null;         // {id, resolve, timer}
  var listeners = [];
  var seq = 0;

  function absURL(u) {
    if (/^(https?:|file:|blob:)/i.test(u)) return u;
    try { return new URL(u, root.location.href).href; } catch (e) { return u; }
  }
  function setStatus(s, extra) {
    status = s;
    listeners.slice().forEach(function (f) { try { f(s, extra || {}); } catch (e) { /* ignore */ } });
  }
  function onStatus(fn) { listeners.push(fn); fn(status, { error: loadError }); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; }

  function killWorker() {
    if (worker) { try { worker.terminate(); } catch (e) { /* ignore */ } worker = null; }
    if (blobUrl) { try { root.URL.revokeObjectURL(blobUrl); } catch (e) { /* ignore */ } blobUrl = null; }
  }

  function friendlyLoadError(msg) {
    msg = String(msg || '');
    if (/importScripts|NetworkError|Failed to fetch|network|load failed|Script error/i.test(msg)) {
      return 'تعذّر تحميل محرك Python (Pyodide). تأكد من اتصالك بالإنترنت ثم أعد المحاولة. (أول تحميل نحو 10 ميجابايت.)';
    }
    return 'تعذّر تشغيل محرك Python: ' + msg;
  }

  /* ------------------------------------------------------------------ */
  /* تحميل المحرك                                                        */
  /* ------------------------------------------------------------------ */
  function load() {
    if (status === 'ready') return Promise.resolve();
    if (loadPromise) return loadPromise;
    loadPromise = new Promise(function (resolve, reject) {
      killWorker();
      loadError = '';
      setStatus('loading');
      var timer = null;
      var finished = false;
      function fail(msg) {
        if (finished) return; finished = true;
        clearTimeout(timer); killWorker();
        loadError = friendlyLoadError(msg);
        loadPromise = null;
        setStatus('error', { error: loadError });
        reject(new Error(loadError));
      }
      try {
        blobUrl = root.URL.createObjectURL(new root.Blob([WORKER_SOURCE], { type: 'application/javascript' }));
        worker = new root.Worker(blobUrl);
      } catch (e) {
        fail('المتصفح لا يسمح بإنشاء Web Worker هنا (' + (e && e.message) + ')');
        return;
      }
      var w = worker;
      w.onerror = function (ev) { if (w === worker) fail((ev && ev.message) || 'Script error'); };
      w.onmessage = function (ev) {
        var m = ev.data || {};
        if (m.type === 'ready') {
          if (finished) return; finished = true; clearTimeout(timer);
          engineVersion = m.version || '';
          w.onmessage = onRunMessage;
          w.onerror = onWorkerCrash;
          loadPromise = null;
          setStatus('ready', { version: engineVersion });
          resolve();
        } else if (m.type === 'initError') {
          fail(m.message);
        }
      };
      timer = setTimeout(function () { fail('استغرق التحميل وقتًا أطول من المتوقع (network timeout)'); }, config.loadTimeoutMs);
      w.postMessage({ type: 'init', indexURL: absURL(config.indexURL), harness: HARNESS });
    });
    loadPromise.catch(function () { /* تُعالج عند المستدعي */ });
    return loadPromise;
  }

  /* ------------------------------------------------------------------ */
  /* طابور تشغيل مشترك: محرك واحد في الصفحة، وكل محرر ينتظر دوره، ولا يُوقف  */
  /* محررٌ تشغيلَ محررٍ آخر.                                               */
  /* ------------------------------------------------------------------ */
  var queue = [];
  var starting = false;

  function finishPending(result) {
    if (!pending) return;
    var p = pending; pending = null;
    clearTimeout(p.timer);
    p.job.resolve(result);
    pump();
  }
  function onRunMessage(ev) {
    var m = ev.data || {};
    if (m.type !== 'result' || !pending || pending.id !== m.id) return;
    finishPending(m.result);
  }
  function onWorkerCrash(ev) {
    var msg = (ev && ev.message) || 'crash';
    killWorker(); setStatus('idle'); loadPromise = null;
    finishPending({ ok: false, engine: true, message: msg });
  }

  /* يوقف ما يعمل الآن ويعيد تشغيل المحرك في الخلفية */
  function restartInBackground() {
    killWorker(); loadPromise = null; setStatus('idle');
    load().catch(function () { /* الحالة تظهر في onStatus */ });
  }

  function pump() {
    if (pending || starting || !queue.length) return;
    starting = true;
    load().then(function () {
      starting = false;
      if (pending) return;
      var job = queue.shift();
      if (!job) return;
      var id = ++seq, t0 = Date.now();
      pending = { id: id, job: job, t0: t0 };
      pending.timer = setTimeout(function () {
        if (!pending || pending.id !== id) return;
        var p = pending; pending = null;
        restartInBackground();
        p.job.resolve({ timedOut: true, ms: Date.now() - t0 });
        pump();
      }, job.timeoutMs);
      worker.postMessage({ type: 'run', id: id, code: job.code, inputs: job.inputs, seed: job.seed, limit: config.outputLimit, mark: !!job.mark, files: job.files || {} });
    }, function (e) {
      starting = false;
      // فشل التحميل: كل من ينتظر يحصل على نفس الخطأ
      var jobs = queue.splice(0, queue.length);
      jobs.forEach(function (j) { j.resolve({ ok: false, engine: true, message: (e && e.message) || String(e) }); });
    });
  }

  // تشغيل واحد (بدون التعامل مع input)
  function runOnce(code, inputs, seed, timeoutMs, owner, mark, files) {
    return new Promise(function (resolve) {
      if (owner.canceled) { resolve({ stopped: true }); return; }
      var job = { code: code, inputs: inputs, seed: seed, timeoutMs: timeoutMs, owner: owner, resolve: resolve, mark: !!mark, files: files || null };
      owner.job = job;
      queue.push(job);
      pump();
    });
  }

  // إلغاء تشغيل بعينه (سواء كان في الطابور أو يعمل الآن)
  function cancelOwner(owner) {
    owner.canceled = true;
    var job = owner.job;
    if (!job) return false;
    var i = queue.indexOf(job);
    if (i >= 0) { queue.splice(i, 1); job.resolve({ stopped: true }); return true; }
    if (pending && pending.job === job) {
      var p = pending; pending = null; clearTimeout(p.timer);
      restartInBackground();
      p.job.resolve({ stopped: true });
      pump();
      return true;
    }
    return false;
  }

  // إيقاف أي برنامج يعمل الآن (للتوافق مع الاستخدام السابق)
  function stop() {
    if (!pending) return false;
    return cancelOwner(pending.job.owner);
  }

  /* تنفيذ كامل مع دعم input():
     opts.getInput(prompt, outputSoFar) => Promise<string|null>   (null = إلغاء)
     opts.inputs = مدخلات جاهزة مسبقًا (للتصحيح الآلي لاحقًا)
     opts.timeoutMs
     يعيد: { ok, output, error, timedOut, stopped, limit, canceled, engineError, inputs, ms } */
  function execute(code, opts) {
    opts = opts || {};
    code = String(code == null ? '' : code);
    var inputs = (opts.inputs || []).map(String);
    var seed = (Date.now() % 2147483647) | 0;
    var timeout = opts.timeoutMs || config.timeoutMs;
    var t0 = Date.now();
    var rounds = 0;
    var owner = { canceled: false, job: null };

    function finish(r) { r.inputs = inputs.slice(); r.ms = Date.now() - t0; return r; }

    function step() {
      rounds++;
      return runOnce(code, inputs, seed, timeout, owner, opts.markInputs, opts.files).then(function (r) {
        if (r.timedOut) return finish({ ok: false, output: '', timedOut: true, error: Err.special('Timeout', Math.round(timeout / 1000)) });
        if (r.stopped) return finish({ ok: false, output: '', stopped: true, error: Err.special('Stopped') });
        if (r.engine) return finish({ ok: false, output: '', engineError: true, error: Err.special('EngineError', r.message) });
        if (r.limit) return finish({ ok: false, output: r.output, limit: true, error: Err.special('OutputLimit') });
        if (r.needInput) {
          if (typeof opts.getInput !== 'function' || inputs.length >= config.maxInputs) {
            return finish({ ok: false, output: r.output, canceled: true, needInput: true, error: Err.special('EngineError', 'البرنامج يطلب إدخالًا ولا توجد طريقة لإدخاله هنا.') });
          }
          return Promise.resolve(opts.getInput(lastPrompt(r.output), r.output)).then(function (ans) {
            if (owner.canceled) return finish({ ok: false, output: r.output, stopped: true, error: Err.special('Stopped') });
            if (ans === null || ans === undefined) return finish({ ok: false, output: r.output, canceled: true });
            inputs.push(String(ans));
            return step();
          });
        }
        if (r.error) {
          var tr = Err.translate(r.error);
          tr.trace = r.error.trace || '';
          tr.text = r.error.text || '';
          return finish({ ok: false, output: r.output, error: tr });
        }
        return finish({ ok: true, output: r.output });
      });
    }
    var promise = step().catch(function (e) {
      return finish({ ok: false, output: '', engineError: true, loadFailed: true, error: Err.special('EngineError', (e && e.message) || String(e)) });
    });
    // كل تشغيل له مقبض إيقاف خاص به
    promise.cancel = function () { return cancelOwner(owner); };
    return promise;
  }
  function lastPrompt(output) { var i = output.lastIndexOf('\n'); return i >= 0 ? output.slice(i + 1) : output; }

  return {
    config: config,
    load: load,
    retry: function () { loadPromise = null; if (status === 'error') setStatus('idle'); return load(); },
    execute: execute,
    stop: stop,
    get busy() { return !!pending || queue.length > 0; },
    onStatus: onStatus,
    get status() { return status; },
    get error() { return loadError; },
    get version() { return engineVersion; },
    pyodideVersion: VERSION,
    HARNESS: HARNESS,
    WORKER_SOURCE: WORKER_SOURCE
  };
});
