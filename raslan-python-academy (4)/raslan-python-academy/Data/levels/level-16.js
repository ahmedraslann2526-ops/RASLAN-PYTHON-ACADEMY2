/* RASLAN PYTHON ACADEMY — المستوى 16: المعاملات والإرجاع Parameters & Return */
(function (L) {
  'use strict';
  L[16] = {
    n: 16,
    bot: {
      hello: 'أهلًا بيك في المرحلة المتقدمة! 🚀 النهارده الدالة مش هتطبع بس… هترجّع لك نتيجة تستخدمها زي ما تحب.',
      done: 'ممتاز جدًا! return من أهم الأفكار في البرمجة، ودلوقتي دوالك بقت أدوات حقيقية قابلة لإعادة الاستخدام 🧰'
    },
    goals: [
      'تكتب دوال بأكثر من معامل، وتستخدم القيم الافتراضية.',
      'تستخدم return عشان الدالة ترجّع نتيجة، وتفرّق بينها وبين print.',
      'ترجّع أكتر من قيمة مرة واحدة (Tuple).',
      'تستخدم split و join في دوال بتعالج النصوص.'
    ],
    sections: [
      {
        id: 's1', title: 'أكتر من معامل وقيم افتراضية',
        text: [
          'الدالة ممكن تاخد أكتر من معامل بينهم فواصل: `def area(width, height):`.',
          'القيم بتتوزع بالترتيب وقت الاستدعاء: `area(3, 4)` يعني width = 3 و height = 4.',
          'وتقدر تدّي معامل قيمة افتراضية: `def area(width, height=1):` فلو منادتش height هياخد 1.',
          'وتقدر تسمّي المعامل وقت الاستدعاء: `area(height=2, width=5)` والترتيب ساعتها مش مهم.'
        ],
        analogy: 'زي طلب الأكل: "ساندوتش، والحجم افتراضيًا وسط". لو مقولتش الحجم، بيجيلك وسط.',
        example: {
          code: 'def describe(name, age, city="Cairo"):\n    print(f"{name}, {age} years, from {city}")\n\ndescribe("Ali", 15)\ndescribe("Sara", 14, "Alex")\ndescribe(age=16, name="Omar")\n',
          lines: [
            ['city="Cairo"', 'قيمة افتراضية.'],
            ['describe("Ali", 15)', 'city أخدت Cairo لوحدها.'],
            ['describe(age=16, name="Omar")', 'بأسماء المعاملات، فالترتيب مش مهم.']
          ],
          tip: 'جرّب describe("Mona") من غير السن وشوف الخطأ.'
        }
      },
      {
        id: 's2', title: 'return: الدالة ترجّع نتيجة',
        text: [
          '`print` بتعرض القيمة على الشاشة وخلاص. لكن `return` بترجّع القيمة لمكان الاستدعاء عشان تخزنها أو تحسب بيها.',
          'أول ما الدالة توصل لـ `return` بتخرج فورًا، وأي كود بعدها في نفس الدالة مبيتنفذش.',
          'الدالة اللي مفيهاش return بترجّع `None`.'
        ],
        analogy: 'print زي إنك تقول الإجابة بصوت عالي في الفصل. return زي إنك تكتبها في ورقة وتسلّمها للي سألك يستخدمها.',
        example: {
          code: 'def add(a, b):\n    return a + b\n\ndef show_add(a, b):\n    print(a + b)\n\nresult = add(2, 3)\nprint("Result x 10 =", result * 10)\n\nx = show_add(2, 3)\nprint("x is", x)\n',
          lines: [
            ['return a + b', 'بترجّع 5 لمكان الاستدعاء.'],
            ['result * 10', 'نقدر نحسب بالنتيجة: 50.'],
            ['x = show_add(2, 3)', 'بتطبع 5، لكن مبترجّعش حاجة، فـ x = None.']
          ],
          tip: 'جرّب print(add(1, 2) + add(3, 4)).'
        }
      },
      {
        id: 's3', title: 'إرجاع أكتر من قيمة',
        text: [
          'تقدر ترجّع أكتر من قيمة بفاصلة: `return low, high`، وPython بتجمعهم في Tuple.',
          'وتفكهم وقت الاستدعاء: `small, big = min_max(nums)`.'
        ],
        analogy: 'زي ما الدكتور يسلّمك نتيجة التحليل: ورقة واحدة فيها أكتر من رقم.',
        example: {
          code: 'def stats(nums):\n    total = 0\n    for n in nums:\n        total += n\n    return total, total / len(nums)\n\ns, avg = stats([10, 20, 30])\nprint("Sum:", s, "Average:", avg)\n',
          lines: [
            ['return total, total / len(nums)', 'بترجّع قيمتين مع بعض.'],
            ['s, avg = stats(…)', 'فك القيمتين في متغيرين.']
          ],
          tip: 'اطبع stats([1, 2]) نفسها من غير فك.'
        }
      },
      {
        id: 's4', title: 'split و join مع الدوال',
        text: [
          '`"I love Python".split()` بتقسم النص عند المسافات وترجّع قائمة كلمات: `[\'I\', \'love\', \'Python\']`.',
          'وتقدر تقسم عند حاجة تانية: `"a,b,c".split(",")`.',
          '`", ".join(words)` العكس: بتلزّق عناصر قائمة نصوص في نص واحد وبينها الفاصل اللي تختاره.'
        ],
        analogy: 'split زي ما تقطّع رغيف لشرايح، و join زي ما تحط الشرايح جنب بعض في طبق بترتيب.',
        example: {
          code: 'def count_words(sentence):\n    return len(sentence.split())\n\ndef initials(full_name):\n    parts = full_name.split()\n    letters = []\n    for p in parts:\n        letters.append(p[0].upper())\n    return ".".join(letters)\n\nprint(count_words("I love Python a lot"))\nprint(initials("ahmed mohamed raslan"))\n',
          lines: [
            ['sentence.split()', 'قائمة كلمات، و len بتعدّها.'],
            ['p[0].upper()', 'أول حرف من كل كلمة كبير.'],
            ['".".join(letters)', 'A.M.R']
          ],
          tip: 'جرّب "2026-11-06".split("-").'
        }
      }
    ],
    exercises: [
      {
        id: 'l16-e1', tier: 'veryEasy', title: 'دالة الجمع',
        prompt: 'اعمل دالة `add(a, b)` بترجّع (return) مجموع الرقمين. متطبعش جوه الدالة.\nمثال: `add(2, 3)` ترجّع `5`.',
        starter: '',
        hints: ['def add(a, b):', '    return a + b'],
        tests: [{ calls: [
          { expr: 'add(2, 3)', expect: '5' }, { expr: 'add(-1, 1)', expect: '0' }, { expr: 'add(100, 250)', expect: '350' }
        ] }],
        src: [{ re: /\breturn\b/, msg: 'استخدم return.' }],
        solution: 'def add(a, b):\n    return a + b\n'
      },
      {
        id: 'l16-e2', tier: 'easy', title: 'المساحة بقيمة افتراضية',
        prompt: 'اعمل دالة `area(width, height=1)` بترجّع حاصل الضرب.\n`area(3, 4)` ← `12` و `area(5)` ← `5`',
        starter: '',
        hints: ['def area(width, height=1):'],
        tests: [{ calls: [
          { expr: 'area(3, 4)', expect: '12' }, { expr: 'area(5)', expect: '5' }, { expr: 'area(height=2, width=7)', expect: '14' }
        ] }],
        src: [{ re: /def\s+area\s*\(\s*\w+\s*,\s*\w+\s*=\s*1\s*\)/, msg: 'خلي القيمة الافتراضية للمعامل التاني 1: def area(width, height=1):' }],
        solution: 'def area(width, height=1):\n    return width * height\n'
      },
      {
        id: 'l16-e3', tier: 'medium', title: 'عدّاد الكلمات',
        prompt: 'اعمل دالة `count_words(sentence)` بترجّع عدد الكلمات في الجملة (باستخدام split).\n`count_words("I love Python")` ← `3`\nالمسافات الزيادة متتحسبش كلمات.',
        starter: '',
        hints: ['split() من غير معاملات بتتجاهل المسافات الزيادة.', 'return len(sentence.split())'],
        tests: [{ calls: [
          { expr: 'count_words("I love Python")', expect: '3' }, { expr: 'count_words("   hi    there ")', expect: '2' }, { expr: 'count_words("")', expect: '0' }, { expr: 'count_words("one")', expect: '1' }
        ] }],
        src: [{ re: /\.split\s*\(/, msg: 'استخدم split().' }, { re: /\breturn\b/, msg: 'رجّع النتيجة بـ return.' }],
        solution: 'def count_words(sentence):\n    return len(sentence.split())\n'
      },
      {
        id: 'l16-e4', tier: 'challenge', title: 'الأصغر والأكبر',
        prompt: 'اعمل دالة `min_max(nums)` بترجّع أصغر وأكبر رقم في القائمة مع بعض (Tuple) بالترتيب ده.\nممنوع تستخدم `min()` أو `max()` أو `sorted()`.\n`min_max([3, 9, 1])` ← `(1, 9)`',
        starter: '',
        hints: ['ابدأ low و high بأول عنصر: low = high = nums[0]', 'لف على الباقي وحدّثهم.', 'return low, high'],
        tests: [{ calls: [
          { expr: 'min_max([3, 9, 1])', expect: '(1, 9)' }, { expr: 'min_max([5])', expect: '(5, 5)' }, { expr: 'min_max([-2, -8, 4, 0])', expect: '(-8, 4)' }
        ] }],
        src: [{ re: /\breturn\b/, msg: 'رجّع النتيجة بـ return.' }],
        forbid: [{ re: /\b(min|max|sorted)\s*\(/, msg: 'ممنوع min و max و sorted في التمرين ده. لف على القائمة بنفسك.' }, { re: /\.sort\s*\(/, msg: 'ممنوع sort هنا.' }],
        solution: 'def min_max(nums):\n    low = nums[0]\n    high = nums[0]\n    for n in nums:\n        if n < low:\n            low = n\n        if n > high:\n            high = n\n    return low, high\n'
      }
    ],
    final: {
      id: 'l16-final', title: 'التحدي النهائي: تقرير الدرجات',
      prompt: 'اعمل دالة `grade_report(scores)` بترجّع قاموس فيه:\n- `"average"`: المتوسط مقرّب لرقم عشري واحد\n- `"best"`: أعلى درجة\n- `"passed"`: عدد الدرجات اللي 50 أو أكتر\nمثال: `grade_report([80, 45, 90])` ←\n`{\'average\': 71.7, \'best\': 90, \'passed\': 2}`\nواعمل كمان دالة `names_line(names)` بترجّع الأسماء مترتبة أبجديًا ومفصولة بـ `", "`.\n`names_line(["Sara", "Ali"])` ← `"Ali, Sara"`',
      starter: '',
      hints: ['round(sum(scores) / len(scores), 1)', 'return {"average": …, "best": …, "passed": …}', '", ".join(sorted(names))'],
      tests: [{ calls: [
        { expr: 'grade_report([80, 45, 90])', expect: "{'average': 71.7, 'best': 90, 'passed': 2}" },
        { expr: 'grade_report([50])', expect: "{'average': 50.0, 'best': 50, 'passed': 1}" },
        { expr: 'grade_report([10, 20, 49])', expect: "{'average': 26.3, 'best': 49, 'passed': 0}" },
        { expr: 'names_line(["Sara", "Ali"])', expect: "'Ali, Sara'" },
        { expr: 'names_line(["Omar", "Mona", "Ziad"])', expect: "'Mona, Omar, Ziad'" }
      ] }],
      src: [{ re: /\.join\s*\(/, msg: 'استخدم join في names_line.' }, { re: /\breturn\b/, msg: 'استخدم return.' }],
      solution: 'def grade_report(scores):\n    passed = 0\n    for s in scores:\n        if s >= 50:\n            passed += 1\n    return {"average": round(sum(scores) / len(scores), 1), "best": max(scores), "passed": passed}\n\ndef names_line(names):\n    return ", ".join(sorted(names))\n'
    },
    quiz: [
      { q: 'إيه الفرق بين return و print ؟', options: ['مفيش فرق', 'return بترجّع القيمة للي استدعى الدالة، وprint بتعرضها بس', 'print أسرع', 'return بتطبع مرتين'], answer: 1, why: 'القيمة المرجعة تقدر تخزنها وتحسب بيها.' },
      { q: 'إيه ناتج الكود ده؟', code: 'def f(a, b=10):\n    return a + b\n\nprint(f(5))', options: ['5', '10', '15', 'خطأ'], answer: 2, why: 'b أخدت القيمة الافتراضية 10.' },
      { q: 'إيه اللي بترجّعه دالة مفيهاش return ؟', options: ['0', '""', 'None', 'خطأ'], answer: 2, why: 'أي دالة من غير return بترجّع None.' },
      { q: 'إيه ناتج "a-b-c".split("-") ؟', options: ["['a-b-c']", "['a', 'b', 'c']", "'abc'", "['a', '-', 'b']"], answer: 1, why: 'بتقسم عند كل -.' },
      { q: 'إيه ناتج الكود ده؟', code: 'def g():\n    return 1\n    print("hi")\n\nprint(g())', options: ['hi ثم 1', '1', 'hi', 'None'], answer: 1, why: 'return بتخرج من الدالة فورًا، فـ print("hi") متتنفذش.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
