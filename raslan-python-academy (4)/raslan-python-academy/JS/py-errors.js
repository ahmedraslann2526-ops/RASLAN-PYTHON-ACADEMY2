/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/py-errors.js  (Phase 3 / Batch 1)
   يحوّل خطأ Python (النوع + الرسالة + رقم السطر) إلى شرح عربي مبسّط وتلميح.
   دالة نقية بدون اعتماديات (تعمل في المتصفح وفي Node للاختبار).
   الإدخال:  { type, msg, line, text }
   الإخراج:  { title, explain, hint, line, type, original }
   ===================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RPAPyErrors = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function q(msg, re) { var m = re.exec(msg); return m ? m[1] : ''; }

  var FIX = {
    // [نمط الرسالة، دالة تبني الشرح والتلميح]
    SyntaxError: [
      [/Missing parentheses in call to 'print'/i, function () { return ['في Python 3 الدالة print لازم تتكتب بأقواس.', 'اكتبها هكذا: print("مرحبا")']; }],
      [/unterminated string literal/i, function () { return ['النص (String) بدأ بعلامة تنصيص ولم يُغلق بنفس العلامة في نفس السطر.', 'تأكد أن كل " أو \' لها علامة إغلاق مطابقة.']; }],
      [/unterminated triple-quoted/i, function () { return ['النص بين ثلاث علامات تنصيص لم يُغلق.', 'أضف """ في النهاية.']; }],
      [/'(\(|\[|\{)' was never closed/i, function (m) { return ['فتحت القوس ' + q(m, /'(.)' was never closed/) + ' ولم تغلقه.', 'ابحث عن القوس المفتوح وأضف القوس المقابل له.']; }],
      [/unmatched '(.)'/i, function (m) { return ['القوس ' + q(m, /unmatched '(.)'/) + ' زائد وليس له قوس فتح مقابل.', 'احذفه أو أضف قوس الفتح الناقص.']; }],
      [/closing parenthesis '.' does not match opening parenthesis/i, function () { return ['الأقواس غير متطابقة (فتحت نوعًا وأغلقت نوعًا آخر).', 'راجع الأقواس () [] {} وتأكد أن كل واحد يُغلق بما يناسبه.']; }],
      [/expected ':'/i, function () { return ['ناقص علامة النقطتين : في نهاية السطر.', 'جمل if وelse وelif وfor وwhile وdef وclass لازم ينتهي سطرها بـ :']; }],
      [/invalid syntax\. Maybe you meant '==' or ':=' instead of '='\?/i, function () { return ['استخدمت = (إسناد قيمة) في مكان المقارنة.', 'للمقارنة اكتب == ، مثال: if x == 5:']; }],
      [/cannot assign to (.+)/i, function (m) { return ['لا يمكن إسناد قيمة إلى ' + q(m, /cannot assign to (.+?)( here|$)/) + '.', 'الطرف الأيسر من = لازم يكون اسم متغير.']; }],
      [/invalid decimal literal|invalid character/i, function () { return ['يوجد رمز أو اسم غير صالح (مثل اسم متغير يبدأ برقم أو رمز غريب منسوخ).', 'اسم المتغير لا يبدأ برقم، وتأكد من علامات التنصيص أنها " أو \' عادية.']; }],
      [/f-string/i, function () { return ['خطأ داخل f-string.', 'تأكد أن كل { تُغلق بـ } وأن التعبير داخلها صحيح.']; }],
      [/invalid syntax/i, function () { return ['في Python لم تفهم هذا السطر لأن طريقة كتابته غير صحيحة.', 'راجع السطر المحدد والسطر الذي قبله: ناقص قوس؟ علامة تنصيص؟ نقطتان؟ أو كلمة مكتوبة غلط؟']; }]
    ],
    IndentationError: [
      [/expected an indented block/i, function () { return ['بعد السطر الذي ينتهي بـ : لازم يجي سطر مُزاح (مسافات في بدايته).', 'اترك 4 مسافات قبل الكود الذي يتبع if أو for أو while أو def.']; }],
      [/unexpected indent/i, function () { return ['هذا السطر فيه مسافات في بدايته بدون داعٍ.', 'احذف المسافات الزائدة ليبدأ السطر من الحافة (أو بنفس مسافة السطر السابق).']; }],
      [/unindent does not match/i, function () { return ['المسافات في هذا السطر لا تطابق أي مستوى سابق.', 'استخدم نفس عدد المسافات (4) في كل مستوى، ولا تخلط Tab بالمسافات.']; }],
      [/.*/, function () { return ['مشكلة في المسافات البادئة (Indentation).', 'Python تعتمد على المسافات في بداية السطر لتحديد الكتل؛ اجعلها منتظمة (4 مسافات).']; }]
    ],
    TabError: [[/.*/, function () { return ['خلطت بين Tab والمسافات في بداية السطور.', 'استخدم المسافات فقط (4 مسافات لكل مستوى).']; }]],
    NameError: [
      [/name '(.+?)' is not defined/i, function (m) { var n = q(m, /name '(.+?)'/); return ['الاسم «' + n + '» غير معرّف: Python لا تعرفه حتى الآن.', 'تأكد أنك أعطيته قيمة قبل استخدامه، وأنك كتبته بنفس الحروف تمامًا (Python تفرّق بين الحرف الكبير والصغير). ولو كان نصًا فضعه بين علامتي تنصيص: "' + n + '"']; }],
      [/.*/, function () { return ['استخدمت اسمًا لم يُعرَّف.', 'عرّف المتغير أو الدالة قبل استخدامها.']; }]
    ],
    UnboundLocalError: [[/.*/, function () { return ['استخدمت متغيرًا داخل دالة قبل أن تعطيه قيمة.', 'أعطِ المتغير قيمة داخل الدالة قبل قراءته، أو مرّره كمعامل.']; }]],
    TypeError: [
      [/can only concatenate str \(not "(\w+)"\) to str/i, function (m) { return ['حاولت تجمع نصًا مع ' + typeAr(q(m, /not "(\w+)"/)) + '.', 'حوّل الرقم إلى نص بـ str(...) أو استخدم f-string: f"العمر {age}"']; }],
      [/unsupported operand type\(s\) for (.+?): '(\w+)' and '(\w+)'/i, function (m) { var r = /for (.+?): '(\w+)' and '(\w+)'/.exec(m); return ['لا يمكن تطبيق العملية ' + r[1] + ' بين ' + typeAr(r[2]) + ' و' + typeAr(r[3]) + '.', 'تأكد من أنواع القيم. استخدم int() أو float() لتحويل النص إلى رقم قبل الحساب.']; }],
      [/can't multiply sequence by non-int/i, function () { return ['حاولت تضرب نصًا في عدد غير صحيح.', 'الضرب النصي يكون بعدد صحيح فقط، مثل "ab" * 3']; }],
      [/'(\w+)' object is not callable/i, function (m) { return ['حاولت تستدعي ' + typeAr(q(m, /'(\w+)' object/)) + ' كأنه دالة (بأقواس).', 'ربما سمّيت متغيرًا باسم دالة (مثل print أو str) أو نسيت عملية بين القوسين.']; }],
      [/'(\w+)' object is not subscriptable/i, function (m) { return [typeAr(q(m, /'(\w+)' object/)) + ' لا يمكن الوصول لعناصره بـ [ ].', 'تأكد أن المتغير قائمة أو نص أو قاموس.']; }],
      [/'(\w+)' object is not iterable/i, function (m) { return ['لا يمكن التكرار على ' + typeAr(q(m, /'(\w+)' object/)) + '.', 'للتكرار استخدم for مع قائمة أو نص أو range(...). للرقم استخدم range(n).']; }],
      [/(\w+)\(\) missing (\d+) required positional argument/i, function (m) { var r = /(\w+)\(\) missing/.exec(m); return ['الدالة ' + r[1] + ' تحتاج قيمًا (معاملات) لم تمرّرها.', 'مرّر كل المعاملات المطلوبة عند الاستدعاء.']; }],
      [/(\w+)\(\) takes (\d+) positional arguments? but (\d+) (?:were|was) given/i, function (m) { var r = /(\w+)\(\) takes (\d+) .* but (\d+)/.exec(m); return ['الدالة ' + r[1] + ' تنتظر ' + r[2] + ' قيمة لكنك مرّرت ' + r[3] + '.', 'طابق عدد القيم في الاستدعاء مع عدد المعاملات في تعريف الدالة.']; }],
      [/.*/, function () { return ['استخدمت نوع بيانات في مكان لا يناسبه.', 'راجع أنواع القيم في السطر المحدد (نص؟ رقم؟ قائمة؟).']; }]
    ],
    ValueError: [
      [/invalid literal for int\(\) with base 10: (.+)/i, function (m) { return ['لا يمكن تحويل ' + q(m, /base 10: (.+)$/) + ' إلى رقم صحيح.', 'تأكد أن النص يحتوي أرقامًا فقط (بدون حروف أو مسافات أو فاصلة عشرية).']; }],
      [/could not convert string to float: (.+)/i, function (m) { return ['لا يمكن تحويل ' + q(m, /float: (.+)$/) + ' إلى رقم عشري.', 'تأكد أن النص رقم صحيح مثل 3.5']; }],
      [/not enough values to unpack|too many values to unpack/i, function () { return ['عدد المتغيرات على اليسار لا يساوي عدد القيم على اليمين.', 'طابق العددين.']; }],
      [/math domain error/i, function () { return ['قيمة خارج المجال المسموح للدالة الرياضية (مثل جذر رقم سالب).', 'تأكد من القيمة المُمرَّرة.']; }],
      [/.*/, function () { return ['القيمة من النوع الصحيح لكنها غير مقبولة.', 'راجع القيمة التي مرّرتها للدالة.']; }]
    ],
    ZeroDivisionError: [[/.*/, function () { return ['حاولت تقسم على صفر، وهذا مستحيل رياضيًا.', 'تأكد أن المقسوم عليه ليس صفرًا (يمكنك فحصه بـ if قبل القسمة).']; }]],
    IndexError: [[/.*/, function () { return ['طلبت عنصرًا برقم (فهرس) أكبر من عدد العناصر الموجودة.', 'الترقيم يبدأ من 0؛ فالقائمة التي فيها 3 عناصر آخر فهرس فيها 2. استخدم len(...) للتحقق.']; }]],
    KeyError: [[/.*/, function (m) { return ['المفتاح ' + m + ' غير موجود في القاموس.', 'تأكد من كتابة المفتاح بنفس الحروف، أو استخدم .get(المفتاح) لتجنب الخطأ.']; }]],
    AttributeError: [
      [/'(\w+)' object has no attribute '(\w+)'/i, function (m) { var r = /'(\w+)' object has no attribute '(\w+)'/.exec(m); return [typeAr(r[1]) + ' ليس له خاصية أو دالة اسمها ' + r[2] + '.', 'تأكد من اسم الدالة ومن نوع المتغير (وحالة الأحرف).']; }],
      [/.*/, function () { return ['حاولت تستخدم خاصية أو دالة غير موجودة.', 'راجع اسمها ونوع الكائن.']; }]
    ],
    ModuleNotFoundError: [[/No module named '(.+?)'/i, function (m) { return ['المكتبة «' + q(m, /No module named '(.+?)'/) + '» غير متاحة في هذا المحرر.', 'المتاح هنا مكتبات Python القياسية مثل math وrandom وdatetime وjson.']; }], [/.*/, function () { return ['مكتبة غير متاحة.', 'استخدم المكتبات القياسية فقط.']; }]],
    ImportError: [[/.*/, function () { return ['تعذّر الاستيراد.', 'تأكد من اسم المكتبة أو الدالة التي تستوردها.']; }]],
    RecursionError: [[/.*/, function () { return ['الدالة تستدعي نفسها بلا توقف.', 'أضف شرط توقف (حالة أساسية) داخل الدالة.']; }]],
    FileNotFoundError: [[/.*/, function () { return ['الملف المطلوب غير موجود.', 'في المحرر ملفات مؤقتة فقط؛ أنشئ الملف بالكتابة فيه أولًا (open(..., "w")).']; }]],
    EOFError: [[/.*/, function () { return ['البرنامج طلب إدخالًا ولم يجد بيانات.', 'اكتب القيمة في خانة الإدخال عند طلبها.']; }]],
    OverflowError: [[/.*/, function () { return ['الرقم كبير جدًا لهذه العملية.', 'قلّل القيمة.']; }]],
    AssertionError: [[/.*/, function () { return ['شرط assert لم يتحقق.', 'راجع الشرط الذي تتوقع أن يكون صحيحًا.']; }]],
    StopIteration: [[/.*/, function () { return ['لا توجد عناصر أخرى في next(...).', 'تحقق من وجود عناصر قبل الاستدعاء.']; }]],
    MemoryError: [[/.*/, function () { return ['البرنامج استهلك ذاكرة كبيرة.', 'قلّل حجم البيانات.']; }]]
  };

  var TYPE_AR = { str: 'نص (str)', int: 'رقم صحيح (int)', float: 'رقم عشري (float)', list: 'قائمة (list)', dict: 'قاموس (dict)', tuple: 'Tuple', set: 'Set', bool: 'قيمة منطقية (bool)', NoneType: 'None (لا قيمة)', function: 'دالة', method: 'دالة', 'builtin_function_or_method': 'دالة' };
  function typeAr(t) { return TYPE_AR[t] || t; }

  var TITLES = {
    SyntaxError: 'خطأ في كتابة الكود (SyntaxError)',
    IndentationError: 'خطأ في المسافات البادئة (IndentationError)',
    TabError: 'خلط Tab والمسافات (TabError)',
    NameError: 'اسم غير معرّف (NameError)',
    UnboundLocalError: 'متغير بلا قيمة (UnboundLocalError)',
    TypeError: 'نوع بيانات غير مناسب (TypeError)',
    ValueError: 'قيمة غير مقبولة (ValueError)',
    ZeroDivisionError: 'القسمة على صفر (ZeroDivisionError)',
    IndexError: 'فهرس خارج الحدود (IndexError)',
    KeyError: 'مفتاح غير موجود (KeyError)',
    AttributeError: 'خاصية غير موجودة (AttributeError)',
    ModuleNotFoundError: 'مكتبة غير موجودة (ModuleNotFoundError)',
    ImportError: 'خطأ في الاستيراد (ImportError)',
    RecursionError: 'تكرار ذاتي بلا نهاية (RecursionError)',
    FileNotFoundError: 'ملف غير موجود (FileNotFoundError)',
    EOFError: 'لا يوجد إدخال (EOFError)',
    OverflowError: 'رقم أكبر من المسموح (OverflowError)',
    AssertionError: 'فشل assert (AssertionError)',
    StopIteration: 'انتهت العناصر (StopIteration)',
    MemoryError: 'نفاد الذاكرة (MemoryError)'
  };

  // أخطاء المحرر نفسه (ليست من Python)
  var SPECIAL = {
    Timeout: function (sec) { return { title: 'توقف البرنامج لأنه استغرق وقتًا طويلًا', explain: 'البرنامج ظل يعمل أكثر من ' + sec + ' ثانية فأوقفناه لحماية الصفحة من التجمّد. غالبًا السبب حلقة لا نهائية.', hint: 'في while تأكد أن الشرط سيصبح False في وقت ما (هل غيّرت قيمة المتغير داخل الحلقة؟). وفي for تأكد من حدود range().' }; },
    OutputLimit: function () { return { title: 'المخرجات كثيرة جدًا', explain: 'البرنامج طبع كمية ضخمة من النص فأوقفناه.', hint: 'غالبًا print داخل حلقة لا تنتهي. راجع شرط الحلقة.' }; },
    Stopped: function () { return { title: 'تم إيقاف البرنامج', explain: 'أوقفتَ التشغيل يدويًا.', hint: '' }; },
    EngineError: function (msg) { return { title: 'تعذّر تشغيل المحرك', explain: msg || 'حدث خطأ داخل محرك Python.', hint: 'جرّب إعادة تحميل الصفحة.' }; }
  };

  function translate(err) {
    err = err || {};
    var type = String(err.type || 'Error');
    var msg = String(err.msg || '');
    var line = err.line > 0 ? err.line : 0;
    var out = { type: type, original: msg, line: line, title: '', explain: '', hint: '' };

    var rules = FIX[type];
    // أنواع فرعية: IndentationError/TabError تتبع SyntaxError في Python
    if (!rules && /Error$/.test(type)) rules = null;
    if (rules) {
      for (var i = 0; i < rules.length; i++) {
        if (rules[i][0].test(msg)) {
          var r = rules[i][1](msg);
          out.explain = r[0]; out.hint = r[1] || '';
          break;
        }
      }
    }
    out.title = TITLES[type] || ('خطأ في البرنامج (' + type + ')');
    if (!out.explain) {
      out.explain = 'حدث خطأ أثناء تشغيل الكود.';
      out.hint = 'اقرأ الرسالة الأصلية بالأسفل (بالإنجليزية) وراجع السطر المحدد.';
    }
    return out;
  }

  function special(kind, arg) { return SPECIAL[kind] ? SPECIAL[kind](arg) : SPECIAL.EngineError(arg); }

  return { translate: translate, special: special, typeAr: typeAr };
});
