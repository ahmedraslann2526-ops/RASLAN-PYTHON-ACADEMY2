/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/grader.js  (Phase 3 / Batch 2)
   التصحيح الفعلي للتمارين: يشغّل كود الطالب على محرك Python الحقيقي
   عدة مرات بحالات اختبار مختلفة (مدخلات مختلفة)، ويتحقق من:
     1) المخرجات (كاملة exact أو آخر الأسطر tail أو احتواء has)
     2) قيم المتغيرات وأنواعها بعد انتهاء البرنامج (vars) — يكشف الحلول التي تطبع النتيجة "حفظًا" بدل حسابها
     3) بنية الكود (src / forbid) — مثل: لازم تستخدم if أو متغير أو input()
   الحالة تُعتبر ناجحة فقط إذا نجحت كل الحالات وكل الشروط.

   شكل التمرين:
     { id, tier, tests: [ { inputs:[...], exact | tail:[...] | has:[...], vars:{ name: "repr" },
                            replace:[/regex/, 'بديل'], hidden:true } ],
     files:{ 'name.txt': 'content' }  ملفات بيانات تُنشأ قبل تشغيل كود الطالب (مستوى الملفات والمشروع)
     calls:[ { code:'جمل تمهيدية', expr:'تعبير', expect:"repr", out:'المطبوع أثناء الاستدعاء', err:'ValueError…', label } ]
            يستدعي دوال/كلاسات الطالب مباشرة بعد تشغيل برنامجه ويقارن القيمة المرجعة أو المطبوع أو الخطأ.
     replace: يعيد تشغيل نفس كود الطالب بعد تغيير قيمة متغير (مثل الحرارة 35 → 20) للتأكد إن البرنامج
              بيحسب فعلًا ومش بيطبع إجابة محفوظة.
       src: [ { re: /.../, msg: '...' } ], forbid: [ { re: /.../, msg: '...' } ] }
   الواجهة: window.RPAGrader.check(exercise, code) => Promise<report>
            window.RPAGrader.evaluate(test, runResult)  (دالة نقية للاختبارات)
   ===================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(root);
  else root.RPAGrader = factory(root);
})(typeof window !== 'undefined' ? window : this, function (root) {
  'use strict';

  var MARK = '\u0001RPAV:';

  function normalize(s) {
    return String(s == null ? '' : s).replace(/\r/g, '').split('\n')
      .map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').replace(/\n+$/, '');
  }
  function linesOf(s) { var n = normalize(s); return n === '' ? [] : n.split('\n'); }

  // إزالة التعليقات (تقريبية: تتجاهل # داخل النصوص البسيطة) قبل فحص بنية الكود
  function stripComments(code) {
    return String(code).split('\n').map(function (line) {
      var out = '', q = null;
      for (var i = 0; i < line.length; i++) {
        var c = line[i];
        if (q) { out += c; if (c === '\\') { out += line[i + 1] || ''; i++; } else if (c === q) q = null; }
        else if (c === '"' || c === "'") { q = c; out += c; }
        else if (c === '#') break;
        else out += c;
      }
      return out;
    }).join('\n');
  }

  // كود يُلحق بعد كود الطالب لقراءة قيم المتغيرات بعد التنفيذ
  function varsProbe(names) {
    return '\n' + names.map(function (n) {
      return 'try:\n    print(' + JSON.stringify(MARK + n + ':') + ' + repr(' + n + '))\nexcept NameError:\n    print(' + JSON.stringify(MARK + n + ':') + ' + "<undefined>")';
    }).join('\n') + '\n';
  }

  // كود يُلحق بعد كود الطالب لاستدعاء دواله ومقارنة النتائج (القيمة المرجعة، المطبوع، الخطأ)
  function indent(code) { return String(code || '').split('\n').map(function (l) { return '    ' + l; }).join('\n'); }
  function callsProbe(calls) {
    var out = '\nimport io as _rpa_io, sys as _rpa_sys, json as _rpa_json\n';
    calls.forEach(function (c, i) {
      out += '_rpa_buf = _rpa_io.StringIO()\n_rpa_old = _rpa_sys.stdout\n_rpa_sys.stdout = _rpa_buf\n' +
        'try:\n' + (c.code ? indent(c.code) + '\n' : '') +
        '    _rpa_r = repr(' + (c.expr || 'None') + ')\n    _rpa_e = ""\n' +
        'except Exception as _rpa_x:\n    _rpa_r = ""\n    _rpa_e = type(_rpa_x).__name__ + ": " + str(_rpa_x)\n' +
        'finally:\n    _rpa_sys.stdout = _rpa_old\n' +
        'print(' + JSON.stringify(MARK + 'C' + i + ':') + ' + _rpa_json.dumps([_rpa_r, _rpa_e, _rpa_buf.getvalue()]))\n';
    });
    return out;
  }

  // يحذف سطور الإدخال (السؤال + الإجابة) المعلَّمة بـ \x02 … \x03 في وضع التصحيح
  function stripInputs(output) {
    return String(output || '').replace(/\u0002[\s\S]*?\u0003\n?/g, '').replace(/\u0002[\s\S]*$/, '');
  }

  // يفصل مخرجات الطالب عن سطور فحص المتغيرات (بعد حذف سطور الإدخال)
  function splitProbe(output) {
    var vars = {}, keep = [];
    stripInputs(output).split('\n').forEach(function (l) {
      var i = l.indexOf(MARK);
      if (i >= 0) {
        var rest = l.slice(i + MARK.length), c = rest.indexOf(':');
        vars[rest.slice(0, c)] = rest.slice(c + 1);
        if (i > 0) keep.push(l.slice(0, i));
      } else keep.push(l);
    });
    return { output: keep.join('\n'), vars: vars };
  }

  function show(s) { return s === '' ? '(لا شيء)' : s; }

  /* يقيّم نتيجة تشغيل واحدة مقابل حالة اختبار واحدة (دالة نقية) */
  function evaluate(test, run) {
    if (!run) return { pass: false, kind: 'engine', msg: 'لم يتم التشغيل.' };
    if (run.timedOut) return { pass: false, kind: 'timeout', msg: 'البرنامج لم ينتهِ في الوقت المسموح (غالبًا حلقة لا تنتهي).', error: run.error };
    if (run.engineError) return { pass: false, kind: 'engine', msg: (run.error && run.error.explain) || 'تعذّر تشغيل المحرك.' };
    if (run.needInput || run.canceled) return { pass: false, kind: 'input', msg: 'البرنامج طلب إدخالات أكتر من المطلوب في التمرين (' + (test.inputs || []).length + ').' };
    if (run.limit) return { pass: false, kind: 'limit', msg: 'البرنامج طبع كمية ضخمة من المخرجات.' };
    var parts = splitProbe(run.output);
    if (run.error) return { pass: false, kind: 'error', msg: run.error.title, error: run.error, got: parts.output };

    var got = normalize(parts.output);
    if (test.exact !== undefined) {
      var want = normalize(test.exact);
      if (got !== want) return { pass: false, kind: 'output', expected: want, got: got, msg: 'المخرجات مش مطابقة للمطلوب.' };
    }
    if (test.tail) {
      var L = linesOf(parts.output), T = test.tail.map(normalize);
      var tailGot = L.slice(Math.max(0, L.length - T.length));
      if (tailGot.join('\n') !== T.join('\n')) {
        return { pass: false, kind: 'output', expected: T.join('\n'), got: tailGot.join('\n'), msg: 'آخر سطور في المخرجات مش مطابقة للمطلوب.' };
      }
    }
    if (test.has) {
      for (var i = 0; i < test.has.length; i++) {
        if (got.indexOf(test.has[i]) < 0) return { pass: false, kind: 'output', expected: test.has[i], got: got, msg: 'المخرجات لازم تحتوي: ' + test.has[i] };
      }
    }
    if (test.calls) {
      for (var ci = 0; ci < test.calls.length; ci++) {
        var c = test.calls[ci], raw = parts.vars['C' + ci], label = c.label || c.expr || c.code;
        var res;
        try { res = JSON.parse(raw); } catch (e) { res = null; }
        if (!res) return { pass: false, kind: 'calls', msg: 'تعذّر اختبار: ' + label + ' — تأكد إن البرنامج بيخلص من غير ما يقف.' };
        var r = res[0], err = res[1], printed = res[2];
        if (c.err !== undefined) {
          if (err.indexOf(c.err) !== 0) {
            return { pass: false, kind: 'calls', msg: 'الاختبار: ' + label + ' — كان المفروض يطلّع خطأ ' + c.err.split(':')[0] + '.', expected: c.err, got: err || ('بدون خطأ، رجّع ' + r) };
          }
          continue;
        }
        if (err) {
          if (/^NameError/.test(err)) return { pass: false, kind: 'calls', msg: 'الاختبار: ' + label + ' — في اسم مش موجود في برنامجك (دالة أو كلاس أو متغير). اتأكد من الاسم بالظبط.', expected: label, got: err };
          return { pass: false, kind: 'calls', msg: 'الاختبار: ' + label + ' — حصل خطأ أثناء التشغيل.', expected: c.expect !== undefined ? c.expect : '(بدون خطأ)', got: err };
        }
        if (c.expect !== undefined && r !== c.expect) {
          return { pass: false, kind: 'calls', msg: 'الاختبار: ' + label + ' — القيمة اللي رجعت مش صح.', expected: c.expect, got: r };
        }
        if (c.out !== undefined && normalize(printed) !== normalize(c.out)) {
          return { pass: false, kind: 'calls', msg: 'الاختبار: ' + label + ' — اللي اتطبع مش زي المطلوب.', expected: normalize(c.out), got: normalize(printed) };
        }
      }
    }
    if (test.vars) {
      var names = Object.keys(test.vars);
      for (var j = 0; j < names.length; j++) {
        var n = names[j], v = parts.vars[n];
        if (v === undefined || v === '<undefined>') return { pass: false, kind: 'vars', msg: 'المتغير ' + n + ' مش موجود في برنامجك. لازم تعمله بنفس الاسم بالظبط.' };
        if (v !== test.vars[n]) return { pass: false, kind: 'vars', msg: 'قيمة المتغير ' + n + ' في آخر البرنامج مش صح.', expected: n + ' = ' + test.vars[n], got: n + ' = ' + v };
      }
    }
    return { pass: true };
  }

  function checkSource(ex, code) {
    var src = ex.srcRaw ? String(code) : stripComments(code);
    var i;
    for (i = 0; ex.src && i < ex.src.length; i++) if (!ex.src[i].re.test(src)) return ex.src[i].msg;
    for (i = 0; ex.forbid && i < ex.forbid.length; i++) if (ex.forbid[i].re.test(src)) return ex.forbid[i].msg;
    return null;
  }

  /* التصحيح الكامل: يعيد
     { ok, total, passed, failIndex, fail:{...test result}, inputs, srcMsg, hidden } */
  function check(ex, code, runner) {
    var Py = runner || root.RPAPython;
    code = String(code || '');
    if (!code.replace(/#[^\n]*/g, '').trim()) {
      return Promise.resolve({ ok: false, total: ex.tests.length, passed: 0, empty: true, msg: 'اكتب الكود الأول في المحرر.' });
    }
    var tests = ex.tests, idx = 0, passed = 0;
    function next() {
      if (idx >= tests.length) {
        var srcMsg = checkSource(ex, code);
        if (srcMsg) return { ok: false, total: tests.length, passed: passed, srcMsg: srcMsg, msg: srcMsg };
        return { ok: true, total: tests.length, passed: passed };
      }
      var t = tests[idx];
      var body = code;
      if (t.replace) {
        var re = t.replace[0] instanceof RegExp ? t.replace[0] : new RegExp(String(t.replace[0]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        if (!re.test(body)) {
          return Promise.resolve({ ok: false, total: tests.length, passed: passed, failIndex: idx, fail: { pass: false, kind: 'src' },
            msg: 'متغيّرش سطر البداية اللي في التمرين (' + String(t.replace[1]).split('=')[0].trim() + ' = …). سيبه زي ما هو وخلي الشرط هو اللي يقرر.' });
        }
        body = body.replace(re, t.replace[1]);
      }
      var full = body + (t.vars ? varsProbe(Object.keys(t.vars)) : '') + (t.calls ? callsProbe(t.calls) : '');
      return Py.execute(full, { inputs: t.inputs || [], timeoutMs: ex.timeoutMs || 5000, markInputs: true, files: t.files || null }).then(function (run) {
        var r = evaluate(t, run);
        if (!r.pass) {
          return { ok: false, total: tests.length, passed: passed, failIndex: idx, fail: r, inputs: (t.inputs || []).slice(), hidden: !!t.hidden, msg: r.msg };
        }
        passed++; idx++;
        return next();
      });
    }
    return next();
  }

  return { callsProbe: callsProbe, stripInputs: stripInputs, check: check, evaluate: evaluate, normalize: normalize, stripComments: stripComments, varsProbe: varsProbe, splitProbe: splitProbe, checkSource: checkSource, show: show };
});
