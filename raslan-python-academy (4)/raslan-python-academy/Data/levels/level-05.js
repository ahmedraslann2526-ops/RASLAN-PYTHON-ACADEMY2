/* RASLAN PYTHON ACADEMY — المستوى 5: إدخال البيانات input() */
(function (L) {
  'use strict';
  L[5] = {
    n: 5,
    bot: {
      hello: 'لحد دلوقتي برنامجك بيتكلم لوحده. النهارده هيبدأ يسأل ويسمع! هنستخدم input() عشان ناخد كلام من المستخدم 🎤',
      done: 'رائع! برنامجك بقى تفاعلي: بيسأل، بيستنى، وبيرد. ده أساس أي تطبيق حقيقي 🚀'
    },
    goals: [
      'تستخدم input() عشان تسأل المستخدم وتاخد إجابته.',
      'تخزّن الإجابة في متغير وتستخدمها.',
      'تعرف إن input() دايمًا بترجع نص، وتحوّله لرقم بـ int().',
      'تعمل برنامج تفاعلي كامل.'
    ],
    sections: [
      {
        id: 's1', title: 'input(): البرنامج بيسأل',
        text: [
          '`input()` بتوقف البرنامج وتستنى المستخدم يكتب حاجة ويدوس Enter.',
          'النص اللي بتحطه جوّه الأقواس هو السؤال اللي بيظهر: `input("What is your name? ")`.',
          'الإجابة بترجع لك، فبنخزّنها في متغير: `name = input("…")`.',
          'في المحرر هنا، لما البرنامج يوصل لـ input() هتظهر لك خانة تحت المخرجات تكتب فيها.'
        ],
        analogy: 'input() زي الكاشير لما يسألك "تحب تدفع كاش ولا فيزا؟" ويستنى إجابتك قبل ما يكمّل.',
        example: {
          code: 'name = input("What is your name? ")\nprint("Hello", name)\n',
          lines: [
            ['input("What is your name? ")', 'بيطبع السؤال ويستنى إجابتك.'],
            ['name = …', 'الإجابة بتتخزن في المتغير name.'],
            ['print("Hello", name)', 'بنرد على المستخدم باسمه.']
          ],
          tip: 'شغّل واكتب اسمك في الخانة اللي هتظهر.'
        }
      },
      {
        id: 's2', title: 'input() دايمًا بترجع نص!',
        text: [
          'حتى لو المستخدم كتب رقم زي 15، `input()` بترجعه نص `"15"`.',
          'عشان كده لو عايز تحسب بيه، لازم تحوّله الأول: `age = int(input("Age? "))`.',
          'لو نسيت التحويل، `"15" + 1` هيطلع خطأ TypeError.'
        ],
        analogy: 'الإجابة بتوصلك مكتوبة على ورقة. عشان تحسب بيها لازم "تقرا" الرقم وتحوّله في دماغك لرقم حقيقي — ده اللي int() بتعمله.',
        example: {
          code: 'age = int(input("How old are you? "))\nprint("Next year you will be", age + 1)\n',
          lines: [
            ['input("How old are you? ")', 'بترجع نص زي "15".'],
            ['int(…)', 'بتحوّل النص لرقم 15.'],
            ['age + 1', 'دلوقتي ينفع نحسب.']
          ],
          tip: 'شيل int() وشغّل وشوف الخطأ اللي هيطلع.'
        }
      },
      {
        id: 's3', title: 'أكتر من سؤال',
        text: [
          'تقدر تسأل أكتر من سؤال، وكل input() بتستنى إجابة لوحدها بالترتيب.',
          'وتقدر تستخدم الإجابات مع بعض في حساب واحد.'
        ],
        analogy: 'زي استمارة: خانة للاسم، وبعدها خانة للسن، وفي الآخر بتتجمع كل البيانات.',
        example: {
          code: 'a = int(input("First number: "))\nb = int(input("Second number: "))\nprint("Sum:", a + b)\nprint("Difference:", a - b)\n',
          lines: [
            ['a = int(input(…))', 'الرقم الأول.'],
            ['b = int(input(…))', 'الرقم التاني.'],
            ['print("Sum:", a + b)', 'بنستخدم الاتنين في الحساب.']
          ],
          tip: 'جرّب أرقام سالبة كمان.'
        }
      }
    ],
    exercises: [
      {
        id: 'l5-e1', tier: 'veryEasy', title: 'رد التحية',
        prompt: 'اسأل المستخدم عن اسمه بـ input()، وبعدين اطبع:\n`Hello <الاسم>`\nمثال: لو كتب Ali يطبع `Hello Ali`.',
        starter: '',
        hints: ['name = input("Name? ")', 'print("Hello", name)'],
        tests: [{ inputs: ['Ali'], tail: ['Hello Ali'] }, { inputs: ['Sara'], tail: ['Hello Sara'], hidden: true }],
        src: [{ re: /input\s*\(/, msg: 'لازم تستخدم input().' }],
        solution: 'name = input("Name? ")\nprint("Hello", name)\n'
      },
      {
        id: 'l5-e2', tier: 'easy', title: 'السنة الجاية',
        prompt: 'اسأل المستخدم عن عمره، واطبع عمره بعد سنة (رقم بس).\nمثال: لو كتب 10 يطبع `11`.',
        starter: '',
        hints: ['age = int(input("Age? "))', 'print(age + 1)'],
        tests: [{ inputs: ['10'], tail: ['11'] }, { inputs: ['25'], tail: ['26'], hidden: true }, { inputs: ['0'], tail: ['1'], hidden: true }],
        src: [{ re: /int\s*\(/, msg: 'حوّل الإجابة لرقم بـ int().' }],
        solution: 'age = int(input("Age? "))\nprint(age + 1)\n'
      },
      {
        id: 'l5-e3', tier: 'medium', title: 'جمع رقمين',
        prompt: 'اسأل عن رقمين (كل واحد بـ input منفصل) واطبع مجموعهم بس.\nمثال: 3 و 4 ← `7`',
        starter: '',
        hints: ['اعمل a و b كل واحد بـ int(input(...)).', 'print(a + b)'],
        tests: [{ inputs: ['3', '4'], tail: ['7'] }, { inputs: ['10', '20'], tail: ['30'], hidden: true }, { inputs: ['-5', '5'], tail: ['0'], hidden: true }],
        src: [{ re: /input[\s\S]*input/, msg: 'استخدم input() مرتين.' }],
        solution: 'a = int(input("a: "))\nb = int(input("b: "))\nprint(a + b)\n'
      },
      {
        id: 'l5-e4', tier: 'challenge', title: 'نتيجة اللاعب',
        prompt: 'اسأل عن اسم اللاعب، وبعدين عن نقط الجولة الأولى، وبعدين نقط الجولة التانية.\nاطبع سطر واحد بالدمج (+) بالشكل ده:\n`<الاسم> scored <المجموع>`\nمثال: Ali و 5 و 7 ← `Ali scored 12`',
        starter: '',
        hints: ['النقط لازم تتحوّل بـ int() عشان تتجمع.', 'في الطباعة: name + " scored " + str(total)'],
        tests: [{ inputs: ['Ali', '5', '7'], tail: ['Ali scored 12'] }, { inputs: ['Mona', '10', '0'], tail: ['Mona scored 10'], hidden: true }],
        src: [{ re: /str\s*\(/, msg: 'استخدم str() عشان تدمج المجموع مع النص.' }],
        solution: 'name = input("Player: ")\nr1 = int(input("Round 1: "))\nr2 = int(input("Round 2: "))\ntotal = r1 + r2\nprint(name + " scored " + str(total))\n'
      }
    ],
    final: {
      id: 'l5-final', title: 'التحدي النهائي: برنامج الترحيب',
      prompt: 'اعمل برنامج يسأل عن الاسم وبعدين العمر، ويطبع سطرين بالظبط في الآخر:\n`Hi <الاسم>!`\n`Next year you will be <العمر + 1>`\nمثال: Ali و 16 ←\n`Hi Ali!`\n`Next year you will be 17`',
      starter: '',
      hints: ['السطر الأول: print("Hi " + name + "!")', 'السطر التاني: print("Next year you will be", age + 1)'],
      tests: [{ inputs: ['Ali', '16'], tail: ['Hi Ali!', 'Next year you will be 17'] }, { inputs: ['Nour', '9'], tail: ['Hi Nour!', 'Next year you will be 10'], hidden: true }],
      src: [{ re: /input[\s\S]*input/, msg: 'محتاج input() مرتين: للاسم وللعمر.' }],
      solution: 'name = input("Name: ")\nage = int(input("Age: "))\nprint("Hi " + name + "!")\nprint("Next year you will be", age + 1)\n'
    },
    quiz: [
      { q: 'إيه نوع القيمة اللي بترجعها input() ؟', options: ['int دايمًا', 'str دايمًا', 'حسب اللي اتكتب', 'bool'], answer: 1, why: 'input() بترجع نص دايمًا.' },
      { q: 'لو المستخدم كتب 4، إيه ناتج الكود ده؟', code: 'x = input()\nprint(x + x)', options: ['8', '44', 'خطأ', '4 4'], answer: 1, why: 'x نص "4"، ودمج نصين بيدي "44".' },
      { q: 'أنهي سطر صح عشان ناخد رقم ونحسب بيه؟', options: ['n = input(int("N: "))', 'n = int(input("N: "))', 'n = int("input")', 'n = input("N: ") + 0'], answer: 1, why: 'بناخد النص بـ input وبعدين نحوّله بـ int.' },
      { q: 'النص اللي جوّه أقواس input("…") بيعمل إيه؟', options: ['بيبقى الإجابة', 'بيظهر كسؤال للمستخدم', 'بيتجاهل', 'بيتخزن في متغير'], answer: 1, why: 'ده السؤال اللي بيظهر قبل ما المستخدم يكتب.' },
      { q: 'لو المستخدم كتب abc والبرنامج فيه int(input()) هيحصل إيه؟', options: ['هيطبع abc', 'خطأ ValueError', 'هيطبع 0', 'هيعيد السؤال'], answer: 1, why: 'abc مش رقم فمش ممكن يتحوّل لـ int.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
