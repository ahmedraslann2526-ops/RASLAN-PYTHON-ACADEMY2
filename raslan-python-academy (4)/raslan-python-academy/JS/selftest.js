/* RASLAN PYTHON ACADEMY — JS/selftest.js (Phase 2): اختبار ذاتي داخل المتصفح */
(function (root) {
  'use strict';
  var doc = root.document, S = root.RPAStore;
  var envList = doc.getElementById('env'), resList = doc.getElementById('res'), sum = doc.getElementById('sum');

  function row(list, cls, label, text, note) {
    var li = doc.createElement('li'); li.className = cls;
    var b = doc.createElement('b'); b.textContent = label;
    var d = doc.createElement('div'); d.appendChild(doc.createTextNode(text));
    if (note) { var e = doc.createElement('em'); e.textContent = note; d.appendChild(e); }
    li.appendChild(b); li.appendChild(d); list.appendChild(li);
  }

  function env() {
    envList.textContent = '';
    var c = root.crypto && root.crypto.subtle;
    row(envList, c ? 'pass' : 'warn', c ? 'متاح' : 'غير متاح', 'التشفير القوي لكلمة المرور (crypto.subtle / PBKDF2)', c ? '' : 'سيُستخدم بديل أضعف. افتح الموقع من https أو localhost أو متصفح أحدث.');
    var ls = false; try { root.localStorage.setItem('__t', '1'); root.localStorage.removeItem('__t'); ls = true; } catch (e) { /* */ }
    row(envList, ls ? 'pass' : 'fail', ls ? 'متاح' : 'محظور', 'LocalStorage (الحفظ الدائم)', ls ? '' : 'لن يُحفظ حسابك. قد تكون في الوضع الخاص أو المتصفح يمنع التخزين.');
    row(envList, typeof root.Worker === 'function' ? 'pass' : 'warn', typeof root.Worker === 'function' ? 'متاح' : 'غير متاح', 'Web Workers (لتشغيل محرر Python)');
    row(envList, typeof root.WebAssembly === 'object' ? 'pass' : 'warn', typeof root.WebAssembly === 'object' ? 'متاح' : 'غير متاح', 'WebAssembly (لتشغيل Pyodide)');
    var tts = 'speechSynthesis' in root;
    row(envList, tts ? 'pass' : 'warn', tts ? 'متاح' : 'غير متاح', 'Speech Synthesis (الشرح الصوتي في المرحلة 3)');
    if (tts) {
      var vs = root.speechSynthesis.getVoices() || [];
      var ar = vs.filter(function (v) { return /^ar/i.test(v.lang); });
      row(envList, 'info', 'معلومة', 'أصوات عربية مثبّتة: ' + ar.length, ar.length ? ar.map(function (v) { return v.lang; }).join(' ، ') : 'قد تتأخر قائمة الأصوات في الظهور؛ جودة النطق تختلف حسب الجهاز.');
    }
    var gl = false; try { var cv = doc.createElement('canvas'); gl = !!(cv.getContext('webgl2') || cv.getContext('webgl')); } catch (e) { /* */ }
    row(envList, gl ? 'pass' : 'warn', gl ? 'متاح' : 'غير متاح', 'WebGL (شخصية PYTHON BOT ثلاثية الأبعاد؛ بديل SVG تلقائي عند غيابه)');
    row(envList, 'info', 'معلومة', 'الصفحة تعمل من: ' + root.location.protocol + '//');
  }

  var pass = 0, fail = 0;
  function t(name, ok, detail) {
    if (ok) pass++; else fail++;
    row(resList, ok ? 'pass' : 'fail', ok ? 'نجح' : 'فشل', name, ok ? '' : (detail || ''));
  }
  var DAY = 24 * 3600e3;

  async function run() {
    pass = 0; fail = 0; resList.textContent = ''; sum.className = 'st__sum'; sum.textContent = 'جارٍ التشغيل…';
    env();
    var T = Date.parse('2026-03-01T10:00:00');
    S._test.setNow(function () { return T; });
    try {
      t('رفض اسم قصير', (await S.register({ name: 'a', email: 'a@b.co', password: '123456' })).error === 'name');
      t('رفض بريد غير صحيح', (await S.register({ name: 'علي', email: 'x', password: '123456' })).error === 'email');
      t('رفض كلمة مرور قصيرة', (await S.register({ name: 'علي', email: 'a@b.co', password: '123' })).error === 'password');
      var r = await S.register({ name: ' <b>أحمد</b>  علي ', email: ' Test@Example.COM ', password: 'secret1' });
      t('إنشاء حساب وتنقية الاسم والبريد', r.ok && r.user.email === 'test@example.com' && !/[<>]/.test(r.user.name));
      t('منع تكرار نفس البريد', (await S.register({ name: 'علي', email: 'test@example.com', password: 'secret1' })).error === 'exists');
      t('أول شارة عند التسجيل', !!S.getProgress().badges.welcome);
      t('المستوى 1 مفتوح و2 مقفل', S.levelState(1) === 'open' && S.levelState(2) === 'locked');
      t('رفض تسجيل تقدم في مستوى مقفل', S.recordExercise(2, 'a', 'easy').error === 'locked');
      t('رفض مستوى غير موجود', S.recordQuiz(21, 80).error === 'level' && S.recordQuiz(0, 80).error === 'level');
      var e1 = S.recordExercise(1, 'ex1', 'veryEasy'), e2 = S.recordExercise(1, 'ex1', 'veryEasy');
      t('نقاط التمرين تُحسب مرة واحدة فقط', e1.xpGained === 10 && e2.already && e2.xpGained === 0 && S.summary().xp === 10);
      t('نقاط التحدي 80 مرة واحدة', S.recordChallenge(1).xpGained === 80 && S.recordChallenge(1).already);
      var q = S.recordQuiz(1, 69);
      t('اختبار 69% لا يفتح المستوى التالي', q.ok && !q.passed && S.levelState(2) === 'locked');
      q = S.recordQuiz(1, 70);
      t('اختبار 70% يفتح المستوى التالي (+150 XP)', q.passed && q.justCompleted && q.xpGained === 150 && S.levelState(2) === 'open' && S.levelState(1) === 'done');
      q = S.recordQuiz(1, 100);
      t('مكافأة الدرجة الكاملة مرة واحدة (+25)', q.xpGained === 25 && S.recordQuiz(1, 100).xpGained === 0);
      T += DAY; q = S.recordExercise(2, 'x1', 'easy');
      t('سلسلة يومين متتاليين + مكافأة اليوم', q.xpGained === 30 && S.summary().streak === 2);
      T += 3 * DAY; S.recordExercise(2, 'x2', 'easy');
      t('انقطاع السلسلة يعيدها إلى 1 ويحفظ الأفضل', S.summary().streak === 1 && S.summary().bestStreak === 2);
      var ok = true;
      for (var n = 2; n <= 20; n++) { var x = S.recordQuiz(n, 90); if (!x.ok || !x.passed) { ok = false; break; } }
      var s = S.summary(), p = S.getProgress();
      t('إكمال المستويات العشرين بالترتيب + شارة الخريج', ok && s.finished && s.percent === 100 && !!p.badges.graduate);
      S.logout();
      t('تسجيل الخروج يمنع التسجيل والقراءة', !S.isLoggedIn() && S.summary() === null && S.recordQuiz(1, 90).error === 'auth');
      t('رفض كلمة مرور خاطئة', (await S.login('test@example.com', 'wrong')).error === 'credentials');
      t('الدخول (البريد غير حساس لحالة الأحرف)', (await S.login('TEST@example.com', 'secret1')).ok && S.summary().completed === 20);
      S.logout();
      for (var i = 0; i < 5; i++) await S.login('test@example.com', 'bad' + i);
      var lk = await S.login('test@example.com', 'secret1');
      t('قفل مؤقت بعد 5 محاولات خاطئة', lk.error === 'locked' && lk.wait > 0);
      T += 31000;
      t('فك القفل بعد المهلة', (await S.login('test@example.com', 'secret1')).ok);
      var b = S.exportBackup();
      t('النسخة الاحتياطية لا تحتوي كلمة المرور', b.format === 'rpa-backup' && !JSON.stringify(b).includes('secret1') && !!b.user.hash);
      var txt = JSON.stringify(b);
      t('رفض ملف JSON تالف', S.importBackup('{{').error === 'json');
      t('رفض ملف ليس نسخة احتياطية', S.importBackup('{"a":1}').error === 'format');
      t('استيراد يطلب تأكيدًا عند وجود نفس الحساب', S.importBackup(txt).error === 'exists');
      t('استيراد مع الاستبدال ينجح ويحفظ التقدم', S.importBackup(txt, true).ok && S.summary().completed === 20);
      var forged = JSON.parse(txt);
      forged.progress.xp = 1e12; forged.progress.levels = { '5': { done: true, exercises: { 'a b': 'easy' } } }; forged.progress.badges = { nope: 1 };
      var fp = S._test.sanitizeProgress(forged.progress);
      t('تنقية بيانات مزوّرة (نقاط ضخمة/مستوى بلا سابق/شارة وهمية)', fp.xp === 1e7 && !(fp.levels[5] && fp.levels[5].done) && Object.keys(fp.badges).length === 0);
      t('تغيير الاسم', S.updateName('سارة').ok && S.currentUser().name === 'سارة' && S.updateName('x').error === 'name');
      t('تغيير كلمة المرور يتطلب القديمة', (await S.changePassword('bad', 'newpass1')).error === 'credentials' && (await S.changePassword('secret1', 'newpass1')).ok);
      S.logout();
      t('الدخول بكلمة المرور الجديدة فقط', (await S.login('test@example.com', 'secret1')).error === 'credentials' && (await S.login('test@example.com', 'newpass1')).ok);
      t('إعادة ضبط التقدم بكلمة المرور', (await S.resetProgress('x')).error === 'credentials' && (await S.resetProgress('newpass1')).ok && S.summary().completed === 0 && S.summary().xp === 0);
      t('حذف الحساب بكلمة المرور', (await S.deleteAccount('x')).error === 'credentials' && (await S.deleteAccount('newpass1')).ok && !S.isLoggedIn());
    } catch (err) {
      t('خطأ غير متوقع أثناء الاختبار', false, String(err && err.stack || err));
    }
    S._test.setNow(null);
    sum.className = 'st__sum ' + (fail ? 'bad' : 'ok');
    sum.textContent = fail ? 'فشل ' + fail + ' اختبار من أصل ' + (pass + fail) : 'نجحت كل الاختبارات (' + pass + '/' + pass + ')';
  }

  /* ------------------------------------------------------------------ */
  /* اختبار محرك Python الحقيقي (Pyodide) — يعمل عند الضغط على الزر فقط     */
  /* ------------------------------------------------------------------ */
  var pyList = doc.getElementById('pyres'), pySum = doc.getElementById('pysum');
  var pyBtn = doc.getElementById('pyrun'), pyCopy = doc.getElementById('pycopy');
  var report = [];

  function pyRow(ok, name, detail) {
    row(pyList, ok === null ? 'info' : ok ? 'pass' : 'fail', ok === null ? 'معلومة' : ok ? 'نجح' : 'فشل', name, detail);
    report.push((ok === null ? '[INFO] ' : ok ? '[PASS] ' : '[FAIL] ') + name + (detail ? ' — ' + detail : ''));
  }

  async function runPy() {
    var P = root.RPAPython;
    pyBtn.disabled = true; pyCopy.disabled = true; pyList.textContent = ''; report = [];
    pySum.hidden = false; pySum.className = 'st__sum'; pySum.textContent = 'جارٍ تحميل المحرك…';
    report.push('RASLAN PYTHON ACADEMY — Pyodide self-test');
    report.push('UA: ' + root.navigator.userAgent);
    report.push('Page: ' + root.location.protocol + '//');
    var ok = 0, bad = 0;
    function chk(c, name, detail) { if (c) ok++; else bad++; pyRow(!!c, name, c ? '' : detail); }

    if (!P) { pyRow(false, 'تحميل py-runner.js', 'الملف غير محمّل'); pyBtn.disabled = false; return; }
    var t0 = Date.now();
    try {
      await P.load();
      chk(true, 'تحميل Pyodide داخل Web Worker (من Blob)');
      pyRow(null, 'الإصدار: Python ' + P.version + ' / Pyodide ' + P.pyodideVersion, 'زمن التحميل ' + ((Date.now() - t0) / 1000).toFixed(1) + ' ث');
    } catch (e) {
      chk(false, 'تحميل Pyodide داخل Web Worker', (e && e.message) || String(e));
      pySum.className = 'st__sum bad'; pySum.textContent = 'فشل تحميل المحرك — راجع التفاصيل بالأسفل';
      pyBtn.disabled = false; pyCopy.disabled = false; return;
    }
    async function ex(code, o) { return P.execute(code, o || {}); }
    var r;
    r = await ex('print("Hello")\nprint(1 + 2)');
    chk(r.ok && r.output === 'Hello\n3\n', 'تشغيل print وحساب بسيط', JSON.stringify(r.output));
    r = await ex('def fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)\n\nclass A:\n    def __init__(self): self.v = 5\n\nfor i in range(3):\n    print(i, fact(i + 3))\nprint(A().v)');
    chk(r.ok && r.output === '0 6\n1 24\n2 120\n5\n', 'كود متعدد الأسطر: حلقة ودالة وكلاس', JSON.stringify(r.output) + ' ' + JSON.stringify(r.error));
    r = await ex('print("مرحبًا", "😀")');
    chk(r.ok && r.output.indexOf('مرحبًا') === 0, 'طباعة نص عربي', JSON.stringify(r.output));
    r = await ex('import math, random, json\nprint(math.sqrt(49), json.dumps({"a": 1}), 0 <= random.random() < 1)');
    chk(r.ok && r.output.trim() === '7.0 {"a": 1} True', 'المكتبات القياسية (math, random, json)', JSON.stringify(r.output) + ' ' + JSON.stringify(r.error));
    r = await ex('a = input("a? ")\nb = int(input("b? "))\nprint(a * b)', { inputs: ['ab', '3'] });
    chk(r.ok && r.output === 'a? ab\nb? 3\nababab\n', 'input() بمدخلات جاهزة', JSON.stringify(r.output));
    var asked = [];
    r = await ex('n = input("name: ")\nprint("Hi", n)', { getInput: function (p) { asked.push(p); return Promise.resolve('Sara'); } });
    chk(r.ok && asked.length === 1 && asked[0] === 'name: ' && r.output.indexOf('Hi Sara') >= 0, 'input() تفاعلي (يسأل الواجهة ثم يكمل)', JSON.stringify({ asked: asked, out: r.output }));
    r = await ex('print(nmae)');
    chk(!r.ok && r.error && r.error.type === 'NameError' && r.error.line === 1 && /غير معرّف/.test(r.error.title), 'خطأ NameError بشرح عربي ورقم السطر', JSON.stringify(r.error));
    r = await ex('print("a"');
    chk(!r.ok && r.error && r.error.type === 'SyntaxError' && /[\u0600-\u06FF]/.test(r.error.explain), 'خطأ SyntaxError بشرح عربي', JSON.stringify(r.error));
    r = await ex('x = 1\ny = 0\nprint(x / y)');
    chk(!r.ok && r.error && r.error.type === 'ZeroDivisionError' && r.error.line === 3, 'خطأ ZeroDivisionError في السطر 3', JSON.stringify(r.error));
    r = await ex('while True:\n    print("x" * 1000)');
    chk(!r.ok && r.limit === true, 'إيقاف الفيضان في المخرجات', JSON.stringify({ limit: r.limit, len: r.output && r.output.length }));
    // الحلقة اللانهائية: يجب أن تتوقف بالمهلة دون تجميد الصفحة
    var ticks = 0, tk = setInterval(function () { ticks++; }, 100);
    var t1 = Date.now();
    r = await ex('i = 0\nwhile True:\n    i += 1', { timeoutMs: 3000 });
    clearInterval(tk);
    var took = Date.now() - t1;
    chk(r.timedOut === true && took < 6000, 'حلقة لا نهائية: أُوقفت بالمهلة', 'timedOut=' + r.timedOut + ' took=' + took + 'ms');
    chk(ticks >= 15, 'الصفحة لم تتجمد أثناء الحلقة اللانهائية (مؤقت الصفحة استمر)', 'ticks=' + ticks + ' (المتوقع ≥ 15)');
    var t2 = Date.now();
    r = await ex('print("alive")');
    chk(r.ok && r.output === 'alive\n', 'المحرك يعمل بعد إعادة تشغيله تلقائيًا', JSON.stringify(r) );
    pyRow(null, 'زمن إعادة تشغيل المحرك بعد الإيقاف', ((Date.now() - t2) / 1000).toFixed(1) + ' ث');
    // إيقاف يدوي
    var pr = ex('while True:\n    pass', { timeoutMs: 20000 });
    setTimeout(function () { P.stop(); }, 700);
    r = await pr;
    chk(r.stopped === true, 'الإيقاف اليدوي (Stop)', JSON.stringify(r));
    r = await ex('print("after stop")');
    chk(r.ok && r.output === 'after stop\n', 'المحرك يعمل بعد الإيقاف اليدوي', JSON.stringify(r));

    // ---- الدفعة 2: العزل والطابور والتصحيح الفعلي ----
    await ex('import math, builtins\nmath.pi = 3\nbuiltins.len = None\nsecret = 1\nopen("leak.txt", "w").write("x")');
    r = await ex('import math, os\nprint(math.pi > 3.1, len([1, 2]), os.path.exists("leak.txt"))\ntry:\n    print(secret)\nexcept NameError:\n    print("isolated")');
    chk(r.ok && r.output === 'True 2 False\nisolated\n', 'عزل التشغيلات: لا يبقى أثر لبرنامج سابق (مكتبات، builtins، متغيرات، ملفات)', JSON.stringify(r.output) + ' ' + JSON.stringify(r.error));
    var a1 = P.execute('while True:\n    pass', { timeoutMs: 20000 });
    var a2 = P.execute('print("second")');
    setTimeout(function () { a1.cancel(); }, 600);
    var ra = await a1, rb = await a2;
    chk(ra.stopped === true && rb.ok && rb.output === 'second\n', 'طابور المحررات: إيقاف برنامج لا يوقف برنامجًا آخر ينتظر دوره', JSON.stringify({ a: ra.stopped, b: rb.output }));
    var G = root.RPAGrader, LV = root.RPA_LEVELS || {};
    if (G && LV[3] && LV[5]) {
      var e3 = LV[3].exercises[2], e5 = LV[5].exercises[2];
      var g1 = await G.check(e5, e5.solution);
      chk(g1.ok && g1.total === e5.tests.length, 'التصحيح الفعلي: الحل الصحيح لتمرين «جمع رقمين» ينجح في ' + e5.tests.length + ' حالات اختبار', JSON.stringify(g1));
      var g2 = await G.check(e5, 'a = input()\nb = input()\nprint(a + b)');
      chk(!g2.ok && g2.failIndex === 0, 'التصحيح الفعلي: حل خاطئ (دمج نصوص بدل الجمع) يُرفض', JSON.stringify(g2));
      var g3 = await G.check(e3, 'x = 10\ny = 4\nprint(14)\nprint(6)');
      chk(!g3.ok && g3.fail && g3.fail.kind === 'vars', 'التصحيح الفعلي: طباعة الناتج حفظًا بدون متغيرات تُرفض', JSON.stringify(g3));
    } else {
      chk(false, 'تحميل ملفات التصحيح والدروس', 'grader.js أو ملفات المستويات غير محمّلة');
    }

    // ---- الدفعة 4: الملفات واستدعاء الدوال ومشروع التخرج والشهادة ----
    r = await ex('t = 0\nwith open("n.txt") as f:\n    for line in f:\n        t += int(line)\nprint(t)', { files: { 'n.txt': '4\n8\n15\n' } });
    chk(r.ok && r.output === '27\n', 'ملفات بيانات جاهزة للتمرين (قراءة ملف على Pyodide)', JSON.stringify(r.output) + ' ' + JSON.stringify(r.error));
    r = await ex('import os\nprint(os.path.exists("n.txt"))');
    chk(r.ok && r.output === 'False\n', 'ملفات التمرين تُحذف بعد التشغيل (عزل)', JSON.stringify(r.output));
    if (G && LV[19]) {
      var w4 = LV[19].exercises[3];
      var g4 = await G.check(w4, w4.solution);
      chk(g4.ok, 'التصحيح باستدعاء الدوال وتوقّع الأخطاء (تمرين السحب من الحساب)', JSON.stringify(g4));
      var g5 = await G.check(w4, 'def withdraw(balance, amount):\n    return balance - amount');
      chk(!g5.ok && g5.fail && g5.fail.kind === 'calls', 'التصحيح يرفض دالة لا تطلّع الخطأ المطلوب', JSON.stringify(g5));
    }
    var PJ = root.RPA_PROJECT;
    if (G && PJ) {
      var okAll = true, det = '';
      for (var si = 0; si < PJ.stages.length; si++) {
        var gs = await G.check(PJ.stages[si], PJ.solution);
        if (!gs.ok) { okAll = false; det = PJ.stages[si].id + ': ' + JSON.stringify(gs); break; }
      }
      chk(okAll, 'مشروع التخرج: الحل المرجعي ينجح في المراحل الخمس على Pyodide (ملفات + أوامر تفاعلية)', det);
      var gw = await G.check(PJ.stages[0], PJ.starter);
      chk(!gw.ok, 'مشروع التخرج: الكود الابتدائي لا ينجح في المرحلة 1', JSON.stringify(gw));
    }
    if (root.RPACert && root.RPAPdf) {
      try {
        var cv = root.RPACert.render({ id: 'RPA-F-TEST-TEST-T', name: 'أحمد محمد رسلان', course: root.RPA_GAME.certificates.full.course, heading: 'CERTIFICATE OF COMPLETION', issuedAt: Date.now(), type: 'full' }, 1123);
        var bytes = root.RPAPdf.fromJpeg(root.RPAPdf.dataUrlToBytes(cv.toDataURL('image/jpeg', 0.9)), cv.width, cv.height, { title: 'test' });
        var head = String.fromCharCode.apply(null, Array.prototype.slice.call(bytes, 0, 8));
        chk(head === '%PDF-1.4' && bytes.length > 20000, 'إنشاء ملف PDF لشهادة باسم عربي على هذا المتصفح', 'header=' + head + ' size=' + bytes.length);
        pyRow(null, 'لمعاينة الشهادة بعينك: افتح صفحة الشهادات بعد إكمال 10 مستويات، أو انظر ملف المراجعة المرفق.');
      } catch (e) { chk(false, 'إنشاء ملف PDF لشهادة باسم عربي على هذا المتصفح', String(e)); }
    }

    pySum.className = 'st__sum ' + (bad ? 'bad' : 'ok');
    pySum.textContent = bad ? 'فشل ' + bad + ' اختبار من أصل ' + (ok + bad) : 'المحرك الحقيقي يعمل بنجاح (' + ok + '/' + ok + ')';
    report.push('RESULT: ' + (bad ? bad + ' failed of ' + (ok + bad) : 'all ' + ok + ' passed'));
    pyBtn.disabled = false; pyCopy.disabled = false;
  }
  pyBtn.addEventListener('click', function () { runPy(); });
  pyCopy.addEventListener('click', function () {
    var txt = report.join('\n');
    function done() { pyCopy.textContent = 'تم النسخ ✓'; setTimeout(function () { pyCopy.textContent = 'نسخ التقرير'; }, 2000); }
    if (root.navigator.clipboard && root.navigator.clipboard.writeText) root.navigator.clipboard.writeText(txt).then(done, function () { root.prompt('انسخ التقرير:', txt); });
    else root.prompt('انسخ التقرير:', txt);
  });

  doc.getElementById('again').addEventListener('click', run);
  run();
})(window);
