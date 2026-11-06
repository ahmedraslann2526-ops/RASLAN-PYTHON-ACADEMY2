/* RASLAN PYTHON ACADEMY — المستوى 3: المتغيرات */
(function (L) {
  'use strict';
  L[3] = {
    n: 3,
    bot: {
      hello: 'النهارده هنتعلم أهم فكرة في البرمجة: المتغيرات! هتخلي برنامجك يفتكر المعلومات ويستخدمها تاني 📦',
      done: 'جامد جدًا! دلوقتي برنامجك عنده ذاكرة، وبقيت تقدر تخزّن وتغيّر وتحسب بالمتغيرات 💪'
    },
    goals: [
      'تعرف يعني إيه متغير وإزاي تعمله بعلامة =.',
      'تستخدم المتغير في print وفي الحسابات.',
      'تغيّر قيمة المتغير وتفهم إن آخر قيمة هي اللي بتفضل.',
      'تسمّي المتغيرات صح وتتجنب الأسماء الممنوعة.'
    ],
    sections: [
      {
        id: 's1', title: 'المتغير = علبة عليها اسم',
        text: [
          'المتغير (Variable) مكان في ذاكرة الكمبيوتر بنحط فيه قيمة، وبنديله اسم عشان نرجع له بعدين.',
          'بنعمل المتغير كده: الاسم، بعدين علامة `=`، بعدين القيمة: `name = "Ahmed"`.',
          'علامة `=` هنا مش معناها "يساوي" زي الرياضيات، معناها "خزّن": خزّن القيمة اللي على اليمين في الاسم اللي على الشمال.'
        ],
        analogy: 'تخيّل علبة مكتوب عليها "name" وحاطط جواها ورقة مكتوب فيها Ahmed. كل ما تقول name، الكمبيوتر يفتح العلبة ويطلّع اللي جواها.',
        example: {
          code: 'name = "Ahmed"\nage = 16\nprint(name)\nprint(age)\n',
          lines: [
            ['name = "Ahmed"', 'عملنا متغير اسمه name وخزّنا فيه النص Ahmed.'],
            ['age = 16', 'متغير اسمه age فيه الرقم 16.'],
            ['print(name)', 'من غير علامات تنصيص! بنطبع اللي جوّه العلبة: Ahmed.'],
            ['print(age)', 'بيطبع 16.']
          ],
          tip: 'غيّر Ahmed لاسمك و 16 لعمرك وشغّل.'
        }
      },
      {
        id: 's2', title: 'print(name) غير print("name")',
        text: [
          'لما تكتب `print(name)` Python بتطبع القيمة اللي جوّه المتغير.',
          'لكن `print("name")` بتطبع كلمة name نفسها، لأنها بقت نص.',
          'وتقدر تخلط المتغيرات مع الكلام بالفاصلة: `print("My name is", name)`.'
        ],
        analogy: 'الفرق زي إنك تقول "هات العلبة اللي اسمها name" مقابل إنك تكتب كلمة "name" على ورقة.',
        example: {
          code: 'city = "Cairo"\nprint(city)\nprint("city")\nprint("I live in", city)\n',
          lines: [
            ['print(city)', 'بيطبع القيمة: Cairo'],
            ['print("city")', 'بيطبع الكلمة نفسها: city'],
            ['print("I live in", city)', 'نص + قيمة المتغير: I live in Cairo']
          ],
          tip: 'لو كتبت اسم متغير مش موجود، هيطلع لك NameError. جرّب print(town).'
        }
      },
      {
        id: 's3', title: 'تغيير قيمة المتغير والحساب بيه',
        text: [
          'تقدر تحط قيمة جديدة في نفس المتغير في أي وقت، والقيمة القديمة بتتمسح.',
          'وتقدر تحسب بالمتغيرات: `total = a + b`.',
          'وفي سطر مشهور جدًا: `score = score + 5` ومعناه: "خد القيمة القديمة، زوّد عليها 5، وخزّن الناتج في نفس العلبة".'
        ],
        analogy: 'زي عداد النقط في لعبة: كل ما تكسب، العداد يزيد على الرقم اللي كان فيه.',
        example: {
          code: 'score = 10\nprint("Start:", score)\nscore = score + 5\nprint("After bonus:", score)\na = 7\nb = 3\ntotal = a + b\nprint("Total:", total)\n',
          lines: [
            ['score = 10', 'البداية: 10.'],
            ['score = score + 5', 'Python تحسب اليمين الأول: 10 + 5 = 15، وبعدين تخزّن 15 في score.'],
            ['total = a + b', 'بنجمع قيمتين متغيرين ونخزن الناتج في متغير جديد.']
          ],
          tip: 'جرّب تكرر سطر score = score + 5 مرتين وشوف النتيجة.'
        }
      },
      {
        id: 's4', title: 'قواعد تسمية المتغيرات',
        text: [
          'الاسم ممكن يكون فيه حروف إنجليزي وأرقام و `_` بس، ومينفعش يبدأ برقم: `player1` صح، `1player` غلط.',
          'مينفعش مسافات: بدل `my age` اكتب `my_age`.',
          'Python بتفرّق بين الحروف الكبيرة والصغيرة: `Age` و `age` متغيرين مختلفين.',
          'ومينفعش تستخدم كلمات Python المحجوزة زي `if` و `for` و `print` كأسماء. اختار أسماء واضحة بتوصف اللي جواها.'
        ],
        analogy: 'الاسم الواضح زي ما تكتب على علبة "سكر" بدل "علبة 3". بعد شهر هتفهم الكود في ثانية.',
        example: {
          code: 'first_name = "Mona"\nplayer2 = "Omar"\nmy_age = 14\nprint(first_name, player2, my_age)\n',
          lines: [
            ['first_name', 'كلمتين بينهم _ — اسم واضح وصحيح.'],
            ['player2', 'الرقم في الآخر عادي جدًا.'],
            ['my_age', 'بدل المسافة استخدمنا _.']
          ],
          tip: 'جرّب تكتب 2player = "x" وشوف رسالة الخطأ.'
        }
      }
    ],
    exercises: [
      {
        id: 'l3-e1', tier: 'veryEasy', title: 'أول متغير',
        prompt: 'اعمل متغير اسمه `name` وخزّن فيه النص `Ahmed`، وبعدين اطبع المتغير (من غير علامات تنصيص حوالين name).',
        starter: '',
        hints: ['name = "Ahmed"', 'بعدها print(name)'],
        tests: [{ exact: 'Ahmed', vars: { name: "'Ahmed'" } }],
        src: [{ re: /print\s*\(\s*name\s*\)/, msg: 'اطبع المتغير نفسه: print(name).' }],
        solution: 'name = "Ahmed"\nprint(name)\n'
      },
      {
        id: 'l3-e2', tier: 'easy', title: 'العمر',
        prompt: 'اعمل متغير `age` قيمته الرقم `15` (رقم مش نص)، واطبع:\n`Age: 15`\nباستخدام المتغير.',
        starter: '',
        hints: ['age = 15 من غير علامات تنصيص.', 'print("Age:", age)'],
        tests: [{ exact: 'Age: 15', vars: { age: '15' } }],
        src: [{ re: /print\s*\([^)]*\bage\b/, msg: 'استخدم المتغير age جوّه print.' }],
        solution: 'age = 15\nprint("Age:", age)\n'
      },
      {
        id: 'l3-e3', tier: 'medium', title: 'جمع وطرح بالمتغيرات',
        prompt: 'اعمل متغيرين: `x = 10` و `y = 4`.\nبعدين اعمل متغير `total` فيه مجموعهم، ومتغير `diff` فيه x ناقص y.\nاطبع total في سطر وdiff في السطر اللي بعده.',
        starter: 'x = 10\ny = 4\n',
        hints: ['total = x + y', 'diff = x - y'],
        tests: [{ exact: '14\n6', vars: { total: '14', diff: '6' } }],
        src: [
          { re: /total\s*=\s*x\s*\+\s*y|total\s*=\s*y\s*\+\s*x/, msg: 'احسب total من المتغيرين: total = x + y' },
          { re: /diff\s*=\s*x\s*-\s*y/, msg: 'احسب diff من المتغيرين: diff = x - y' }
        ],
        solution: 'x = 10\ny = 4\ntotal = x + y\ndiff = x - y\nprint(total)\nprint(diff)\n'
      },
      {
        id: 'l3-e4', tier: 'challenge', title: 'عدّاد النقط',
        prompt: 'ابدأ بـ `score = 10`.\nزوّد عليه 5 مرتين باستخدام `score = score + 5` (سطرين)، وبعدين اطبع:\n`Score: 20`',
        starter: 'score = 10\n',
        hints: ['اكتب السطر score = score + 5 مرتين.', 'في الآخر print("Score:", score)'],
        tests: [{ exact: 'Score: 20', vars: { score: '20' } }],
        src: [{ re: /score\s*=\s*score\s*\+\s*5[\s\S]*score\s*=\s*score\s*\+\s*5/, msg: 'استخدم score = score + 5 مرتين بدل ما تكتب 20 على طول.' }],
        solution: 'score = 10\nscore = score + 5\nscore = score + 5\nprint("Score:", score)\n'
      }
    ],
    final: {
      id: 'l3-final', title: 'التحدي النهائي: بطاقة التعريف',
      prompt: 'اعمل المتغيرات دي:\n`name = "Sara"` و `age = 16`\nواعمل متغير `future` فيه العمر بعد 10 سنين (احسبه من age).\nاطبع بالظبط:\n`Name: Sara`\n`Age: 16`\n`In 10 years: 26`',
      starter: 'name = "Sara"\nage = 16\n',
      hints: ['future = age + 10', 'استخدم الفاصلة في print: print("Name:", name)'],
      tests: [{ exact: 'Name: Sara\nAge: 16\nIn 10 years: 26', vars: { name: "'Sara'", age: '16', future: '26' } }],
      src: [
        { re: /future\s*=\s*age\s*\+\s*10/, msg: 'احسب future من age: future = age + 10' },
        { re: /print\s*\([^)]*\bfuture\b/, msg: 'اطبع future نفسه.' }
      ],
      solution: 'name = "Sara"\nage = 16\nfuture = age + 10\nprint("Name:", name)\nprint("Age:", age)\nprint("In 10 years:", future)\n'
    },
    quiz: [
      { q: 'إيه ناتج الكود ده؟', code: 'x = 5\nx = 9\nprint(x)', options: ['5', '9', '14', 'خطأ'], answer: 1, why: 'آخر قيمة اتخزنت هي اللي بتفضل.' },
      { q: 'إيه ناتج الكود ده؟', code: 'color = "red"\nprint("color")', options: ['red', 'color', '"red"', 'خطأ'], answer: 1, why: 'علامات التنصيص خلت color كلمة عادية مش متغير.' },
      { q: 'أنهي اسم متغير صحيح؟', options: ['my age', '2name', 'my_age', 'for'], answer: 2, why: 'my_age مفيهوش مسافة ومش بيبدأ برقم ومش كلمة محجوزة.' },
      { q: 'إيه قيمة n بعد الكود ده؟', code: 'n = 3\nn = n + 4', options: ['3', '4', '7', 'n + 4'], answer: 2, why: 'بنحسب 3 + 4 ونخزن 7 في n.' },
      { q: 'ليه الكود ده بيطلع NameError؟', code: 'Total = 50\nprint(total)', options: ['عشان 50 رقم', 'عشان Total غير total', 'عشان print غلط', 'مش هيطلع خطأ'], answer: 1, why: 'Python بتفرّق بين الحروف الكبيرة والصغيرة.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
