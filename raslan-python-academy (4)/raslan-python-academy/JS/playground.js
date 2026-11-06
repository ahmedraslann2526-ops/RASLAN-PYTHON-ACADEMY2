/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/playground.js  (Phase 3 / Batch 1)
   RASLAN PYTHON PLAYGROUND — مكوّن محرر Python تفاعلي قابل للتضمين.

   الاستخدام:
     var pg = RPAPlayground.create(containerElement, {
        code: 'print("hi")',        // الكود الابتدائي (يُستخدم أيضًا لزر Reset)
        examples: true | false,     // قائمة الأمثلة
        persistKey: 'مفتاح',         // حفظ الكود تلقائيًا في LocalStorage (اختياري)
        minLines: 12,
        onResult: function (result, code) {}   // تُستدعى بعد كل تشغيل
     });
     pg.run(); pg.getCode(); pg.setCode(code); pg.clearOutput(); pg.reset(); pg.destroy();

   خيارات إضافية للتضمين داخل الدروس:
     compact: true    — شكل مختصر (المحرر فوق المخرجات، بدون زر النسخ، حالة المحرك تظهر فقط عند الحاجة)
     autoHeight: true — ارتفاع المحرر يتبع عدد الأسطر
     fileName: 'example.py'
   كل محرر يملك مقبض إيقاف خاص به، فإيقاف محرر لا يوقف محررًا آخر في نفس الصفحة.

   يعتمد على: JS/py-errors.js و JS/py-runner.js (و RPAUI اختياريًا للحوارات والإشعارات).
   كل ما يكتبه الطالب أو يطبعه البرنامج يُعرض بـ textContent فقط.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document;
  var Py = root.RPAPython;

  /* ------------------------------------------------------------------ */
  /* أمثلة جاهزة (كلها أكواد حقيقية تعمل)                                   */
  /* ------------------------------------------------------------------ */
  var EXAMPLES = [
    { id: 'hello', title: 'أول برنامج: print()\u200E', code: '# أول برنامج في Python\nprint("Hello, World!")\nprint("مرحبًا بك في RASLAN PYTHON ACADEMY")\n' },
    { id: 'vars', title: 'المتغيرات والجمع', code: 'name = "Ahmed"\nage = 16\nnext_year = age + 1\n\nprint("الاسم:", name)\nprint("العمر:", age)\nprint("بعد سنة سيكون عمرك", next_year)\n' },
    { id: 'input', title: 'إدخال من المستخدم: input()\u200E', code: 'name = input("ما اسمك؟ ")\nage = int(input("كم عمرك؟ "))\n\nprint(f"أهلًا {name}!")\nprint(f"بعد 10 سنوات سيكون عمرك {age + 10}")\n' },
    { id: 'if', title: 'الشروط: if / elif / else', code: 'score = int(input("اكتب درجتك من 100: "))\n\nif score >= 90:\n    print("ممتاز")\nelif score >= 75:\n    print("جيد جدًا")\nelif score >= 50:\n    print("ناجح")\nelse:\n    print("حاول مرة أخرى")\n' },
    { id: 'for', title: 'التكرار: جدول الضرب', code: 'n = 7\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")\n' },
    { id: 'while', title: 'التكرار: while', code: 'count = 3\nwhile count > 0:\n    print("العد التنازلي:", count)\n    count = count - 1\nprint("انطلق!")\n' },
    { id: 'list', title: 'القوائم', code: 'fruits = ["تفاح", "موز", "برتقال"]\nfruits.append("عنب")\n\nfor f in fruits:\n    print("-", f)\n\nprint("عدد الفواكه:", len(fruits))\n' },
    { id: 'dict', title: 'القواميس', code: 'student = {"name": "Sara", "age": 15, "level": 3}\n\nfor key, value in student.items():\n    print(key, "=", value)\n' },
    { id: 'func', title: 'الدوال: def', code: 'def greet(name, times=1):\n    for _ in range(times):\n        print("مرحبًا يا", name)\n\ndef add(a, b):\n    return a + b\n\ngreet("Ali", 2)\nprint("3 + 4 =", add(3, 4))\n' },
    { id: 'class', title: 'الكلاسات (OOP)', code: 'class Student:\n    def __init__(self, name):\n        self.name = name\n        self.xp = 0\n\n    def add_xp(self, amount):\n        self.xp += amount\n        print(self.name, "معه", self.xp, "XP")\n\ns = Student("Omar")\ns.add_xp(50)\ns.add_xp(25)\n' },
    { id: 'try', title: 'معالجة الأخطاء: try / except', code: 'text = input("اكتب رقمًا: ")\n\ntry:\n    number = int(text)\n    print("ضعف الرقم =", number * 2)\nexcept ValueError:\n    print("هذا ليس رقمًا صحيحًا!")\n' },
    { id: 'error', title: 'كود فيه خطأ (لرؤية الشرح العربي)', code: 'name = "Ahmed"\nprint("الاسم هو", nmae)\n' },
    { id: 'infinite', title: 'حلقة لا نهائية (اختبار الإيقاف الآمن)', code: '# هذا البرنامج لا ينتهي أبدًا.\n# المحرر سيوقفه تلقائيًا بعد 8 ثوانٍ دون تجميد الصفحة،\n# ويمكنك إيقافه يدويًا بزر «إيقاف».\ni = 0\nwhile True:\n    i = i + 1\n' }
  ];

  /* ------------------------------------------------------------------ */
  /* تلوين الكود                                                          */
  /* ------------------------------------------------------------------ */
  var KEYWORDS = {}; ('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield').split(' ').forEach(function (k) { KEYWORDS[k] = 1; });
  var BUILTINS = {}; ('print input int float str bool list dict set tuple len range type sum min max abs round sorted reversed enumerate zip map filter open isinstance super self').split(' ').forEach(function (k) { BUILTINS[k] = 1; });
  var TOKEN_RE = /(#[^\n]*)|("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$))|((?:[rRbBfFuU]{1,2})?"(?:\\.|[^"\\\n])*(?:"|$))|((?:[rRbBfFuU]{1,2})?'(?:\\.|[^'\\\n])*(?:'|$))|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\.\d+)|(@[A-Za-z_]\w*)|([A-Za-z_]\w*)|([\s\S])/g;

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // يعيد مصفوفة أسطر، كل سطر نص HTML (بدون حرف السطر الجديد)
  function highlightLines(code) {
    var lines = [[]];
    function push(cls, text) {
      var parts = text.split('\n');
      for (var i = 0; i < parts.length; i++) {
        if (i > 0) lines.push([]);
        if (parts[i] !== '') lines[lines.length - 1].push(cls ? '<span class="' + cls + '">' + esc(parts[i]) + '</span>' : esc(parts[i]));
      }
    }
    var m, prev = '';
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
      if (m[1] !== undefined) push('t-cm', m[1]);
      else if (m[2] !== undefined || m[3] !== undefined || m[4] !== undefined) push('t-str', m[0]);
      else if (m[5] !== undefined) push('t-num', m[0]);
      else if (m[6] !== undefined) push('t-dec', m[0]);
      else if (m[7] !== undefined) {
        var w = m[7];
        if (prev === 'def' || prev === 'class') push('t-def', w);
        else if (KEYWORDS[w]) push('t-kw', w);
        else if (BUILTINS[w]) push('t-bi', w);
        else push('', w);
        prev = w; continue;
      } else push('', m[0]);
      if (!/^\s+$/.test(m[0])) prev = '';
    }
    return lines.map(function (l) { return l.join(''); });
  }

  /* ------------------------------------------------------------------ */
  /* مكوّن المحرر                                                         */
  /* ------------------------------------------------------------------ */
  var uid = 0;

  function create(container, opts) {
    opts = opts || {};
    var id = 'pg' + (++uid);
    var initial = typeof opts.code === 'string' ? opts.code : EXAMPLES[0].code;
    var baseCode = initial;               // الكود الذي يعود إليه Reset
    var running = false, destroyed = false, errLine = 0;
    var loadTimer = null, loadStart = 0;
    var pendingInput = null;
    var currentRun = null;
    var compact = !!opts.compact;

    var UI = root.RPAUI;
    function toast(msg, type, ico) { if (UI && UI.toast) UI.toast(msg, type, ico); }
    function ask(o) { return UI && UI.confirmDialog ? UI.confirmDialog(o) : Promise.resolve(root.confirm(o.text || o.title)); }

    /* ---------- الهيكل ---------- */
    container.classList.add('pg');
    if (compact) container.classList.add('pg--compact');
    container.innerHTML =
      '<div class="pg__bar">' +
        '<div class="pg__btns">' +
          '<button type="button" class="btn btn--primary btn--sm pg__run" data-a="run"><svg class="icon"><use href="#i-play"/></svg><span>تشغيل</span></button>' +
          '<button type="button" class="btn btn--glass btn--sm pg__stop" data-a="stop" disabled><svg class="icon"><use href="#i-x"/></svg><span>إيقاف</span></button>' +
          '<button type="button" class="btn btn--glass btn--sm" data-a="clear"><svg class="icon"><use href="#i-trash"/></svg><span>مسح المخرجات</span></button>' +
          '<button type="button" class="btn btn--glass btn--sm" data-a="reset"><svg class="icon"><use href="#i-edit"/></svg><span>إعادة الكود</span></button>' +
          (compact ? '' : '<button type="button" class="btn btn--glass btn--sm pg__copy" data-a="copy"><svg class="icon"><use href="#i-save"/></svg><span>نسخ الكود</span></button>') +
        '</div>' +
        (opts.examples === false ? '' :
        '<label class="pg__ex"><span>مثال:</span><select class="input pg__select" aria-label="اختر مثالًا جاهزًا"><option value="">— اختر مثالًا —</option>' +
          EXAMPLES.map(function (e) { return '<option value="' + e.id + '">' + esc(e.title) + '</option>'; }).join('') + '</select></label>') +
      '</div>' +
      '<div class="pg__status" role="status" aria-live="polite"><span class="pg__dot"></span><span class="pg__stext"></span><button type="button" class="link pg__retry" data-a="retry" hidden>إعادة المحاولة</button></div>' +
      '<div class="pg__grid">' +
        '<section class="pg__pane pg__editor" aria-label="محرر الكود">' +
          '<header class="pg__head"><span class="pg__file"></span><span class="pg__hint">Ctrl + Enter للتشغيل</span></header>' +
          '<div class="ed" dir="ltr">' +
            '<div class="ed__gutter" aria-hidden="true"><div class="ed__gin"></div></div>' +
            '<div class="ed__wrap">' +
              '<pre class="ed__hl" aria-hidden="true"><code class="ed__code"></code></pre>' +
              '<textarea class="ed__ta" id="' + id + '-ta" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" wrap="off" aria-label="اكتب كود Python هنا"></textarea>' +
            '</div>' +
          '</div>' +
          (compact ? '' : '<footer class="pg__foot"><span>اضغط Esc ثم Tab للخروج من المحرر بلوحة المفاتيح.</span></footer>') +
        '</section>' +
        '<section class="pg__pane pg__output" aria-label="المخرجات">' +
          '<header class="pg__head"><span>المخرجات</span><span class="pg__meta" aria-live="polite"></span></header>' +
          '<div class="out" dir="ltr">' +
            '<pre class="out__text" tabindex="0"></pre>' +
            '<form class="out__input" hidden autocomplete="off"><span class="out__caret" aria-hidden="true">›</span><input type="text" class="out__field" dir="auto" aria-label="اكتب قيمة الإدخال ثم اضغط Enter" spellcheck="false"><button type="submit" class="btn btn--primary btn--sm">إرسال</button><button type="button" class="btn btn--glass btn--sm" data-a="cancelInput">إلغاء</button></form>' +
          '</div>' +
          '<div class="out__empty" hidden></div>' +
          '<div class="err" role="alert" hidden></div>' +
        '</section>' +
      '</div>';

    var $ = function (s) { return container.querySelector(s); };
    var ta = $('.ed__ta'), codeEl = $('.ed__code'), gin = $('.ed__gin'), edBox = $('.ed');
    var outText = $('.out__text'), outEmpty = $('.out__empty'), errBox = $('.err'), meta = $('.pg__meta');
    var inForm = $('.out__input'), inField = $('.out__field');
    var btnRun = $('.pg__run'), btnStop = $('.pg__stop');
    var sText = $('.pg__stext'), sBox = $('.pg__status'), retryBtn = $('.pg__retry');
    var select = $('.pg__select');
    $('.pg__file').textContent = opts.fileName || 'main.py';

    /* ---------- رسم المحرر ---------- */
    var minLines = opts.minLines || 12;
    function render() {
      var lines = highlightLines(ta.value);
      var n = Math.max(lines.length, 1);
      var html = '', nums = '';
      var total = Math.max(n, minLines);
      for (var i = 0; i < total; i++) {
        var isErr = errLine === i + 1;
        html += '<span class="ln' + (isErr ? ' ln--err' : '') + '">' + (lines[i] !== undefined && lines[i] !== '' ? lines[i] : '&#8203;') + '</span>';
        nums += '<span class="gn' + (isErr ? ' gn--err' : '') + (i >= n ? ' gn--pad' : '') + '">' + (i + 1) + '</span>';
      }
      codeEl.innerHTML = html;
      gin.innerHTML = nums;
      if (opts.autoHeight) {
        var lhPx = parseFloat(root.getComputedStyle(edBox).getPropertyValue('--lh')) || 24;
        edBox.style.height = Math.min(Math.max(n, minLines) * lhPx + 30, opts.maxHeight || 420) + 'px';
      }
      // ارتفاع المحتوى لأن textarea لا يعرف عن الأسطر الإضافية
      ta.style.minHeight = '';
      sync();
    }
    function sync() {
      var t = 'translate(' + (-ta.scrollLeft) + 'px,' + (-ta.scrollTop) + 'px)';
      codeEl.style.transform = t;
      gin.style.transform = 'translateY(' + (-ta.scrollTop) + 'px)';
    }
    ta.addEventListener('scroll', sync);
    ta.addEventListener('input', function () {
      if (errLine) { errLine = 0; }
      render(); save();
    });

    /* ---------- حفظ تلقائي ---------- */
    var saveT = null;
    function save() {
      if (!opts.persistKey) return;
      clearTimeout(saveT);
      saveT = setTimeout(function () { try { root.localStorage.setItem(opts.persistKey, ta.value); } catch (e) { /* ignore */ } }, 250);
    }
    var startCode = initial;
    if (opts.persistKey) { try { var saved = root.localStorage.getItem(opts.persistKey); if (typeof saved === 'string' && saved.length <= 100000) startCode = saved; } catch (e) { /* ignore */ } }
    ta.value = startCode;
    render();

    /* ---------- لوحة المفاتيح داخل المحرر ---------- */
    var escPressed = false;
    function insertText(text) {
      ta.focus();
      var ok = false;
      try { ok = doc.execCommand('insertText', false, text); } catch (e) { ok = false; }
      if (!ok) {
        var s = ta.selectionStart, e2 = ta.selectionEnd;
        ta.setRangeText(text, s, e2, 'end');
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    function lineStart(v, pos) { return v.lastIndexOf('\n', pos - 1) + 1; }
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { escPressed = true; return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return; }
      if (e.key === 'Tab') {
        if (escPressed) { escPressed = false; return; }
        e.preventDefault();
        var v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
        if (s !== en && v.slice(s, en).indexOf('\n') >= 0 || e.shiftKey) {
          // إزاحة/إلغاء إزاحة عدة أسطر
          var a = lineStart(v, s), b = en > s && v[en - 1] === '\n' ? en - 1 : en;
          var block = v.slice(a, b), out;
          if (e.shiftKey) out = block.split('\n').map(function (l) { return l.replace(/^( {1,4}|\t)/, ''); }).join('\n');
          else out = block.split('\n').map(function (l) { return '    ' + l; }).join('\n');
          ta.setSelectionRange(a, b);
          insertText(out);
          ta.setSelectionRange(a, a + out.length);
        } else {
          insertText('    ');
        }
        return;
      }
      escPressed = false;
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var v2 = ta.value, pos = ta.selectionStart;
        var ls = lineStart(v2, pos);
        var cur = v2.slice(ls, pos);
        var indent = (/^[ \t]*/.exec(cur) || [''])[0];
        var codePart = cur.replace(/#.*$/, '').replace(/\s+$/, '');
        if (/:$/.test(codePart)) indent += '    ';
        e.preventDefault();
        insertText('\n' + indent);
      }
    });

    /* ---------- حالة المحرك ---------- */
    var engineOff = null;
    function paintStatus(s, extra) {
      clearInterval(loadTimer);
      sBox.setAttribute('data-s', s);
      sBox.hidden = compact && s === 'ready';
      retryBtn.hidden = true;
      if (s === 'loading') {
        loadStart = Date.now();
        var upd = function () { sText.textContent = 'جارٍ تحميل محرك Python الحقيقي (Pyodide)… ' + Math.round((Date.now() - loadStart) / 1000) + ' ث — أول مرة فقط (نحو 10 ميجابايت)'; };
        upd(); loadTimer = setInterval(upd, 1000);
      } else if (s === 'ready') {
        sText.textContent = 'المحرك جاهز' + (extra && extra.version ? ' — Python ' + extra.version + ' (Pyodide ' + Py.pyodideVersion + ')' : '');
      } else if (s === 'error') {
        sText.textContent = (extra && extra.error) || Py.error || 'تعذّر تحميل المحرك.';
        retryBtn.hidden = false;
      } else {
        sText.textContent = 'المحرك في وضع الانتظار — سيبدأ عند أول تشغيل.';
      }
    }
    if (Py) {
      engineOff = Py.onStatus(function (s, extra) { if (!destroyed) paintStatus(s, extra); });
      if (opts.autoLoad !== false) Py.load().catch(function () { /* الحالة معروضة */ });
    } else {
      paintStatus('error', { error: 'ملف py-runner.js لم يُحمَّل.' });
    }

    /* ---------- المخرجات ---------- */
    function setBusy(b) {
      running = b;
      btnRun.disabled = b;
      btnStop.disabled = !b;
      btnRun.querySelector('span').textContent = b ? 'يعمل…' : 'تشغيل';
      container.classList.toggle('is-running', b);
    }
    function clearOutput() {
      outText.textContent = ''; errBox.hidden = true; errBox.textContent = '';
      outEmpty.hidden = true; meta.textContent = ''; meta.removeAttribute('data-k');
      if (errLine) { errLine = 0; render(); }
    }
    function showInput(prompt) {
      return new Promise(function (resolve) {
        inForm.hidden = false; inField.value = '';
        inField.setAttribute('placeholder', 'اكتب ثم Enter');
        pendingInput = resolve;
        setTimeout(function () { inField.focus(); inForm.scrollIntoView && inForm.scrollIntoView({ block: 'nearest' }); }, 0);
      });
    }
    function finishInput(val) {
      if (!pendingInput) return;
      var r = pendingInput; pendingInput = null;
      inForm.hidden = true;
      r(val);
    }
    inForm.addEventListener('submit', function (e) { e.preventDefault(); finishInput(inField.value); });

    var bidi = (UI && UI.bidi) || function (x) { return x; };
    function el(tag, cls, text) { var n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = bidi(text); return n; }

    function goToLine(n) {
      var lines = ta.value.split('\n'), pos = 0;
      for (var i = 0; i < n - 1 && i < lines.length; i++) pos += lines[i].length + 1;
      ta.focus(); ta.setSelectionRange(pos, pos + (lines[n - 1] || '').length);
      var lh = parseFloat(root.getComputedStyle(ta).lineHeight) || 24;
      ta.scrollTop = Math.max(0, (n - 3) * lh);
      sync();
    }

    function showError(r) {
      var e = r.error;
      errBox.textContent = '';
      var head = el('div', 'err__head');
      head.appendChild(el('strong', 'err__title', e.title));
      if (e.line) {
        var b = el('button', 'link err__go', 'اذهب إلى السطر ' + e.line);
        b.type = 'button';
        b.addEventListener('click', function () { goToLine(e.line); });
        head.appendChild(b);
      }
      errBox.appendChild(head);
      errBox.appendChild(el('p', 'err__explain', e.explain));
      if (e.line && e.text) {
        var codeBox = el('pre', 'err__code'); codeBox.setAttribute('dir', 'ltr');
        codeBox.textContent = 'السطر ' + e.line + ':  ' + e.text.trim();
        errBox.appendChild(codeBox);
      } else if (e.line) {
        var src = ta.value.split('\n')[e.line - 1];
        if (src !== undefined) { var cb = el('pre', 'err__code'); cb.setAttribute('dir', 'ltr'); cb.textContent = e.line + ' |  ' + src.trim(); errBox.appendChild(cb); }
      }
      if (e.hint) { var h = el('p', 'err__hint'); h.appendChild(el('b', null, 'تلميح: ')); h.appendChild(doc.createTextNode(bidi(e.hint))); errBox.appendChild(h); }
      if (e.original || e.trace) {
        var d = el('details', 'err__det');
        d.appendChild(el('summary', null, 'الرسالة الأصلية من Python (بالإنجليزية)'));
        var pre = el('pre', 'err__orig'); pre.setAttribute('dir', 'ltr');
        pre.textContent = e.trace || (e.type + ': ' + e.original);
        d.appendChild(pre); errBox.appendChild(d);
      }
      errBox.hidden = false;
      if (e.line && !r.timedOut) { errLine = e.line; render(); }
    }

    function showResult(r) {
      outText.textContent = r.output || '';
      errBox.hidden = true;
      outEmpty.hidden = true;
      var sec = r.ms != null ? (r.ms / 1000).toFixed(2) : '';
      if (r.ok) {
        meta.textContent = '✓ انتهى بنجاح' + (sec ? ' (' + sec + ' ث)' : ''); meta.setAttribute('data-k', 'ok');
        if (!r.output) { outEmpty.textContent = 'البرنامج انتهى بدون مخرجات. استخدم print() لعرض نتيجة.'; outEmpty.hidden = false; }
      } else if (r.canceled && !r.error) {
        meta.textContent = 'أُلغي الإدخال'; meta.setAttribute('data-k', 'warn');
        outEmpty.textContent = 'ألغيت إدخال البيانات فتوقف البرنامج.'; outEmpty.hidden = false;
      } else {
        meta.textContent = r.timedOut ? '⏱ أُوقف بعد المهلة' : r.stopped ? '■ تم الإيقاف' : '✗ انتهى بخطأ';
        meta.setAttribute('data-k', r.stopped ? 'warn' : 'err');
        if (r.error) showError(r);
      }
    }

    /* ---------- التشغيل ---------- */
    function run() {
      if (running || destroyed || !Py) return Promise.resolve(null);
      var code = ta.value;
      clearOutput(); setBusy(true);
      meta.textContent = Py.status === 'ready' ? 'يعمل…' : 'بانتظار تحميل المحرك…';
      if (Py.busy) meta.textContent = 'في الدور: ينتظر انتهاء برنامج آخر…';
      currentRun = Py.execute(code, {
        getInput: function (prompt, outSoFar) { outText.textContent = outSoFar; meta.textContent = 'ينتظر إدخالك…'; return showInput(prompt); },
        timeoutMs: opts.timeoutMs
      });
      return currentRun.then(function (r) {
        currentRun = null;
        if (destroyed) return r;
        setBusy(false); finishInput(null); showResult(r);
        if (typeof opts.onResult === 'function') { try { opts.onResult(r, code); } catch (e) { /* ignore */ } }
        return r;
      });
    }
    function stop() {
      if (pendingInput) { var run = currentRun; finishInput(null); if (run) run.cancel(); return; }
      if (currentRun) currentRun.cancel();
    }
    function reset() {
      var changed = ta.value !== baseCode;
      var go = function () { ta.value = baseCode; errLine = 0; render(); save(); clearOutput(); select && (select.value = ''); toast('تمت إعادة الكود الأصلي.', 'ok'); };
      if (!changed) { clearOutput(); return; }
      ask({ title: 'إعادة الكود الأصلي؟', text: 'سيُستبدل ما كتبته بالكود الابتدائي.', confirmText: 'إعادة الكود', danger: true }).then(function (yes) { if (yes) go(); });
    }
    function copy() {
      var txt = ta.value;
      var done = function () { toast('تم نسخ الكود.', 'ok', 'i-check'); };
      if (root.navigator.clipboard && root.navigator.clipboard.writeText) {
        root.navigator.clipboard.writeText(txt).then(done, fallback);
      } else fallback();
      function fallback() {
        ta.focus(); ta.select();
        var ok = false; try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
        ta.setSelectionRange(ta.value.length, ta.value.length);
        if (ok) done(); else toast('تعذّر النسخ تلقائيًا. حدّد الكود وانسخه يدويًا.', 'error');
      }
    }

    container.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-a]');
      if (!b || !container.contains(b)) return;
      var a = b.getAttribute('data-a');
      if (a === 'run') run();
      else if (a === 'stop') stop();
      else if (a === 'clear') clearOutput();
      else if (a === 'reset') reset();
      else if (a === 'copy') copy();
      else if (a === 'cancelInput') finishInput(null);
      else if (a === 'retry') { Py.retry().catch(function () { /* معروض */ }); }
    });

    if (select) {
      select.addEventListener('change', function () {
        var ex = EXAMPLES.filter(function (x) { return x.id === select.value; })[0];
        if (!ex) return;
        var load = function () { baseCode = ex.code; ta.value = ex.code; errLine = 0; render(); save(); clearOutput(); ta.scrollTop = 0; };
        var pristine = ta.value === baseCode || ta.value.trim() === '';
        if (pristine) load();
        else ask({ title: 'استبدال الكود الحالي؟', text: 'سيُستبدل الكود الموجود في المحرر بالمثال «' + ex.title + '».', confirmText: 'استبدال' }).then(function (yes) { if (yes) load(); else select.value = ''; });
      });
    }

    function destroy() {
      destroyed = true; clearInterval(loadTimer); clearTimeout(saveT);
      if (currentRun) currentRun.cancel();
      if (engineOff) engineOff();
      finishInput(null);
      container.textContent = ''; container.classList.remove('pg');
    }

    return {
      run: run, stop: stop, reset: reset, destroy: destroy,
      clearOutput: clearOutput,
      getCode: function () { return ta.value; },
      setCode: function (c, asBase) { ta.value = String(c); if (asBase) baseCode = String(c); errLine = 0; render(); save(); },
      focus: function () { ta.focus(); },
      get running() { return running; }
    };
  }

  root.RPAPlayground = { create: create, examples: EXAMPLES, highlightLines: highlightLines };

  /* ---------- تشغيل تلقائي في صفحة playground.html ---------- */
  function auto() {
    var host = doc.getElementById('playgroundRoot');
    if (!host) return;
    root.RPAPlaygroundPage = create(host, { examples: true, persistKey: 'rpa.v1.playground.code', code: EXAMPLES[0].code });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', auto); else auto();
})(window);
