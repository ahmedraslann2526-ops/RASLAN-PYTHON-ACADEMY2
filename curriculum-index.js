/* =====================================================================
   RASLAN PYTHON ACADEMY — Data/curriculum-index.js  (Phase 2)
   فهرس المستويات العشرين (بيانات وصفية فقط).
   محتوى الدروس نفسه (الشرح، التمارين، الاختبارات) يُبنى في المرحلة الثالثة.
   ===================================================================== */
(function (root) {
  'use strict';

  var GROUPS = {
    beginner:     { key: 'beginner',     label: 'مبتدئ', from: 1,  to: 8  },
    intermediate: { key: 'intermediate', label: 'متوسط', from: 9,  to: 15 },
    advanced:     { key: 'advanced',     label: 'متقدم', from: 16, to: 20 }
  };

  var LEVELS = [
    { n: 1,  group: 'beginner',     title: 'أول أمر في Python: print()‎',
      desc: 'اكتب أول سطر كود وشاهد النتيجة على الشاشة.',
      topics: ['ما هي Python وأين تُستخدم', 'الدالة print()‎ وطباعة أول رسالة', 'الأقواس وعلامات التنصيص', 'التعليقات وقواعد الكتابة'] },
    { n: 2,  group: 'beginner',     title: 'النصوص والأرقام والجمع والطرح',
      desc: 'اطبع نصوصًا وأرقامًا وجرّب أول العمليات الحسابية.',
      topics: ['الفرق بين النص والرقم', 'طباعة أكثر من قيمة', 'الجمع والطرح بالأرقام', 'دمج النصوص'] },
    { n: 3,  group: 'beginner',     title: 'المتغيرات',
      desc: 'خزّن المعلومات في أسماء تستخدمها وقتما تشاء.',
      topics: ['إنشاء متغير وإعطاؤه قيمة', 'قواعد تسمية المتغيرات', 'تغيير قيمة المتغير', 'استخدام المتغيرات داخل print()‎'] },
    { n: 4,  group: 'beginner',     title: 'أنواع البيانات',
      desc: 'تعرّف على int وfloat وstr وbool وكيف تحوّل بينها.',
      topics: ['int وfloat', 'str وbool', 'الدالة type()‎', 'التحويل بين الأنواع'] },
    { n: 5,  group: 'beginner',     title: 'إدخال البيانات: input()‎',
      desc: 'خلّي برنامجك يسأل المستخدم ويتفاعل معه.',
      topics: ['الدالة input()‎', 'حفظ إجابة المستخدم في متغير', 'تحويل المدخل إلى رقم', 'برنامج ترحيب تفاعلي'] },
    { n: 6,  group: 'beginner',     title: 'العمليات الحسابية والمقارنات',
      desc: 'الضرب والقسمة والأس والباقي، ثم مقارنة القيم.',
      topics: ['+ - * / // % **', 'أولوية العمليات', 'مقارنات == != > < >= <=', 'النتيجة True أو False'] },
    { n: 7,  group: 'beginner',     title: 'الشرط if / else',
      desc: 'خلّي البرنامج يتخذ قرارًا حسب الحالة.',
      topics: ['جملة if', 'else والمسافات البادئة', 'الشروط المتداخلة البسيطة', 'أمثلة من الحياة اليومية'] },
    { n: 8,  group: 'beginner',     title: 'الشرط المتعدد elif',
      desc: 'اختر من بين أكثر من احتمال بوضوح وترتيب.',
      topics: ['if وelif وelse', 'ترتيب الشروط', 'برنامج تقدير الدرجات', 'أخطاء شائعة في الشروط'] },
    { n: 9,  group: 'intermediate', title: 'العمليات المنطقية: and / or / not',
      desc: 'اربط أكثر من شرط في قرار واحد.',
      topics: ['and', 'or', 'not', 'جداول الصواب وأمثلة عملية'] },
    { n: 10, group: 'intermediate', title: 'التكرار for',
      desc: 'كرّر العمل عدة مرات بدون كتابة الكود من جديد.',
      topics: ['حلقة for', 'الدالة range()‎', 'العدّاد والمجموع', 'تكرار على نص'] },
    { n: 11, group: 'intermediate', title: 'التكرار while',
      desc: 'كرّر طالما الشرط صحيح، وتعلم متى توقف.',
      topics: ['حلقة while', 'break وcontinue', 'تجنب الحلقات اللانهائية', 'لعبة تخمين بسيطة'] },
    { n: 12, group: 'intermediate', title: 'القوائم Lists',
      desc: 'احفظ مجموعة من القيم في مكان واحد.',
      topics: ['إنشاء قائمة والوصول لعناصرها', 'append وremove وpop', 'التكرار على القائمة', 'len وsum وsorted'] },
    { n: 13, group: 'intermediate', title: 'Tuples و Sets',
      desc: 'مجموعات لا تتغير ومجموعات بلا تكرار.',
      topics: ['الـ Tuple وخصائصه', 'الـ Set وإزالة التكرار', 'عمليات المجموعات', 'متى أستخدم كل نوع'] },
    { n: 14, group: 'intermediate', title: 'القواميس Dictionaries',
      desc: 'خزّن البيانات على شكل مفتاح وقيمة.',
      topics: ['إنشاء قاموس', 'قراءة وتعديل القيم', 'keys وvalues وitems', 'التكرار على القاموس'] },
    { n: 15, group: 'intermediate', title: 'الدوال Functions',
      desc: 'اكتب كودًا مرة واحدة واستخدمه في أي مكان، ومعاه أهم طرق النصوص.',
      topics: ['def والاستدعاء', 'دالة بمعامل واحد', 'طرق النصوص: upper وlower وstrip وreplace', 'تنسيق النصوص f-string'] },
    { n: 16, group: 'advanced',     title: 'المعاملات والإرجاع Parameters & Return',
      desc: 'مرّر بيانات للدالة وخليها ترجّع لك نتيجة تستخدمها.',
      topics: ['أكثر من معامل وقيم افتراضية', 'return والفرق بينها وبين print', 'إرجاع أكثر من قيمة', 'split وjoin مع الدوال'] },
    { n: 17, group: 'advanced',     title: 'النطاق والمكتبات Scope & Modules',
      desc: 'افهم أين يعيش المتغير، واستخدم مكتبات Python الجاهزة.',
      topics: ['المتغيرات المحلية والعامة', 'الكلمة global ومتى نتجنبها', 'import وfrom وas', 'math وrandom وstring'] },
    { n: 18, group: 'advanced',     title: 'التعامل مع الملفات File Handling',
      desc: 'اقرأ البيانات من ملفات واكتب فيها واحفظ شغلك.',
      topics: ['open() وأوضاع r وw وa', 'with وإغلاق الملف تلقائيًا', 'القراءة سطرًا بسطر', 'معالجة بيانات الملف'] },
    { n: 19, group: 'advanced',     title: 'الأخطاء والاستثناءات Error Handling',
      desc: 'تعامل مع الأخطاء بدل ما البرنامج يقف فجأة.',
      topics: ['try وexcept لأنواع محددة', 'else وfinally', 'raise ورسائل خطأ واضحة', 'التحقق من مدخلات المستخدم'] },
    { n: 20, group: 'advanced',     title: 'البرمجة الكائنية OOP',
      desc: 'صمّم أشياء لها خصائص وسلوك، وجهّز نفسك لمشروع التخرج.',
      topics: ['الكلاس والكائن و__init__', 'الدوال داخل الكلاس (Methods)', 'الوراثة بشكل مبسط', '__str__ وتمثيل الكائن كنص'] }
  ];

  var QUIZ_PASS_PERCENT = 70;
  // المستويات التي اكتمل محتواها التعليمي (Data/levels/level-NN.js). يزيد مع كل دفعة.
  var READY_UP_TO = 20;

  function byN(n) { n = Number(n); return LEVELS[n - 1] && LEVELS[n - 1].n === n ? LEVELS[n - 1] : null; }
  function isReady(n) { n = Number(n); return n >= 1 && n <= READY_UP_TO; }
  function inGroup(key) { return LEVELS.filter(function (l) { return l.group === key; }); }

  root.RPA_CURRICULUM = {
    version: 1,
    total: LEVELS.length,
    quizPassPercent: QUIZ_PASS_PERCENT,
    readyUpTo: READY_UP_TO,
    isReady: isReady,
    groups: GROUPS,
    levels: LEVELS,
    byN: byN,
    inGroup: inGroup
  };
})(window);
