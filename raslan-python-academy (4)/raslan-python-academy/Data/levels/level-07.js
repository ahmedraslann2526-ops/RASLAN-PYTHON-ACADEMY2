/* RASLAN PYTHON ACADEMY — المستوى 7: الشرط if / else */
(function (L) {
  'use strict';
  L[7] = {
    n: 7,
    bot: {
      hello: 'النهارده برنامجك هيبدأ "يفكر" ويختار! بـ if و else هيعمل حاجة لو الشرط صح، وحاجة تانية لو غلط 🔀',
      done: 'مبروك! برنامجك بقى بياخد قرارات. ده من أقوى الأدوات اللي اتعلمتها لحد دلوقتي 🏆'
    },
    goals: [
      'تكتب جملة if تنفّذ كود لما الشرط يكون True.',
      'تستخدم else للحالة التانية.',
      'تفهم المسافات البادئة (Indentation) وعلامة :.',
      'تربط الشروط بـ input() والمقارنات.'
    ],
    sections: [
      {
        id: 's1', title: 'if: لو الشرط صح… اعمل كذا',
        text: [
          '`if` معناها "لو". بنكتب بعدها شرط (مقارنة)، وبعدين علامة النقطتين `:`.',
          'الكود اللي هيتنفذ لو الشرط True بنكتبه تحت، ومزاح لجوّه بـ 4 مسافات.',
          'لو الشرط False، Python بتعدّي الكود المزاح ده كأنه مش موجود.'
        ],
        analogy: 'زي ما مامتك تقولك: "لو خلّصت المذاكرة، العب ساعة". اللعب بيحصل بس لو الشرط اتحقق.',
        example: {
          code: 'temperature = 35\nif temperature > 30:\n    print("It is hot!")\n    print("Drink water")\nprint("Done")\n',
          lines: [
            ['if temperature > 30:', 'الشرط: هل الحرارة أكبر من 30؟ ولاحظ : في الآخر.'],
            ['    print("It is hot!")', 'مزاح 4 مسافات: بيتنفذ بس لو الشرط True.'],
            ['    print("Drink water")', 'برضه جوّه الـ if.'],
            ['print("Done")', 'مش مزاح: بيتنفذ في كل الأحوال.']
          ],
          tip: 'غيّر الحرارة لـ 20 وشغّل. هتلاقي "Done" بس.'
        }
      },
      {
        id: 's2', title: 'else: وإلا…',
        text: [
          '`else` معناها "وإلا". بتيجي بعد if، والكود اللي تحتها بيتنفذ لو شرط if طلع False.',
          '`else` مبتاخدش شرط، بس لازم تنتهي بـ `:` ويكون الكود اللي تحتها مزاح.',
          'في كل مرة بيتنفذ واحد بس من الاتنين: يا جزء if يا جزء else.'
        ],
        analogy: 'زي إشارة المرور: لو خضرا اعدّي، وإلا استنى. مستحيل الاتنين يحصلوا مع بعض.',
        example: {
          code: 'age = 15\nif age >= 18:\n    print("You can drive")\nelse:\n    print("Not yet")\n    print("Wait", 18 - age, "years")\n',
          lines: [
            ['if age >= 18:', '15 أكبر من أو يساوي 18؟ لأ.'],
            ['else:', 'يبقى نروح هنا.'],
            ['    print("Wait", 18 - age, "years")', 'نقدر نحسب جوّه else عادي.']
          ],
          tip: 'جرّب age = 20.'
        }
      },
      {
        id: 's3', title: 'المسافات البادئة مهمة جدًا',
        text: [
          'في Python المسافات في أول السطر مش للزينة، هي اللي بتحدد أنهي كود جوّه if وأنهي برّه.',
          'استخدم 4 مسافات دايمًا. المحرر هنا بيزيحلك تلقائي بعد : ، وتقدر تستخدم Tab.',
          'لو نسيت الإزاحة هيطلع `IndentationError`، ولو نسيت : هيطلع `SyntaxError`.'
        ],
        analogy: 'الإزاحة زي الفقرات في الموضوع: الكلام اللي داخل لجوّه تابع للعنوان اللي فوقه.',
        example: {
          code: 'password = "python123"\nif password == "python123":\n    print("Welcome!")\nelse:\n    print("Wrong password")\n',
          lines: [
            ['password == "python123"', 'مقارنة نصوص بـ ==.'],
            ['    print("Welcome!")', 'مزاح = تابع للـ if.']
          ],
          tip: 'امسح المسافات قبل print("Welcome!") وشغّل عشان تشوف الخطأ وشرحه.'
        }
      },
      {
        id: 's4', title: 'if مع input()',
        text: [
          'دلوقتي نجمع كل اللي اتعلمناه: ناخد رقم من المستخدم، ونقرر على أساسه.',
          'افتكر: لازم تحوّل الإدخال لرقم بـ int() قبل ما تقارنه بأرقام.'
        ],
        analogy: 'زي ماكينة التذاكر: تسألك عن سنك، وعلى حسب إجابتك تقرر السعر.',
        example: {
          code: 'n = int(input("Enter a number: "))\nif n % 2 == 0:\n    print(n, "is even")\nelse:\n    print(n, "is odd")\n',
          lines: [
            ['n % 2 == 0', 'الباقي على 2 صفر؟ يبقى زوجي.'],
            ['else:', 'غير كده فردي.']
          ],
          tip: 'جرّب 0 و 7 و 12.'
        }
      }
    ],
    exercises: [
      {
        id: 'l7-e1', tier: 'veryEasy', title: 'الجو حر؟',
        prompt: 'عندك `temperature = 35`.\nلو الحرارة أكبر من 30 اطبع `Hot`، وإلا اطبع `OK`.\n(البرنامج لازم يستخدم if و else، ولو غيّرنا الحرارة لـ 20 يطبع OK.)',
        starter: 'temperature = 35\n',
        hints: ['if temperature > 30:', 'متنساش الإزاحة و else:'],
        tests: [
          { exact: 'Hot' },
          { exact: 'OK', replace: [/\btemperature\s*=\s*35\b/, 'temperature = 20'], hidden: true },
          { exact: 'OK', replace: [/\btemperature\s*=\s*35\b/, 'temperature = 30'], hidden: true }
        ],
        src: [{ re: /\bif\b[^\n]*:/, msg: 'استخدم if مع : في الآخر.' }, { re: /\belse\s*:/, msg: 'استخدم else:.' }],
        solution: 'temperature = 35\nif temperature > 30:\n    print("Hot")\nelse:\n    print("OK")\n'
      },
      {
        id: 'l7-e2', tier: 'easy', title: 'موجب ولا لأ',
        prompt: 'اسأل عن رقم. لو أكبر من 0 اطبع `Positive`، وإلا اطبع `Not positive`.',
        starter: '',
        hints: ['n = int(input("n: "))', 'if n > 0:'],
        tests: [{ inputs: ['5'], tail: ['Positive'] }, { inputs: ['-3'], tail: ['Not positive'] }, { inputs: ['0'], tail: ['Not positive'], hidden: true }],
        src: [{ re: /\bif\b/, msg: 'استخدم if.' }],
        solution: 'n = int(input("n: "))\nif n > 0:\n    print("Positive")\nelse:\n    print("Not positive")\n'
      },
      {
        id: 'l7-e3', tier: 'medium', title: 'زوجي أو فردي',
        prompt: 'اسأل عن رقم واطبع `Even` لو زوجي، أو `Odd` لو فردي.',
        starter: '',
        hints: ['if n % 2 == 0:'],
        tests: [{ inputs: ['4'], tail: ['Even'] }, { inputs: ['7'], tail: ['Odd'] }, { inputs: ['0'], tail: ['Even'], hidden: true }, { inputs: ['101'], tail: ['Odd'], hidden: true }],
        src: [{ re: /\bif\b/, msg: 'استخدم if.' }, { re: /%/, msg: 'استخدم باقي القسمة %.' }],
        solution: 'n = int(input("n: "))\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")\n'
      },
      {
        id: 'l7-e4', tier: 'challenge', title: 'كلمة السر',
        prompt: 'اسأل المستخدم عن كلمة السر. لو كتب `python123` بالظبط اطبع `Access granted`، وإلا اطبع `Access denied`.',
        starter: '',
        hints: ['متحوّلش لـ int هنا، كلمة السر نص.', 'if password == "python123":'],
        tests: [{ inputs: ['python123'], tail: ['Access granted'] }, { inputs: ['hello'], tail: ['Access denied'] }, { inputs: ['Python123'], tail: ['Access denied'], hidden: true }],
        src: [{ re: /==/, msg: 'قارن بـ ==.' }],
        solution: 'password = input("Password: ")\nif password == "python123":\n    print("Access granted")\nelse:\n    print("Access denied")\n'
      }
    ],
    final: {
      id: 'l7-final', title: 'التحدي النهائي: ماكينة التذاكر',
      prompt: 'اسأل عن السن. لو السن أقل من 12 اطبع `Price: 20` وإلا اطبع `Price: 50`.\nوبعد كده (في كل الحالات) اطبع `Enjoy the movie!`\nمثال: 8 ←\n`Price: 20`\n`Enjoy the movie!`',
      starter: '',
      hints: ['if age < 12: ... else: ...', 'آخر print برّه الـ if (من غير إزاحة).'],
      tests: [
        { inputs: ['8'], tail: ['Price: 20', 'Enjoy the movie!'] },
        { inputs: ['12'], tail: ['Price: 50', 'Enjoy the movie!'] },
        { inputs: ['30'], tail: ['Price: 50', 'Enjoy the movie!'], hidden: true },
        { inputs: ['11'], tail: ['Price: 20', 'Enjoy the movie!'], hidden: true }
      ],
      src: [{ re: /\bif\b/, msg: 'استخدم if.' }, { re: /\belse\s*:/, msg: 'استخدم else:.' }],
      solution: 'age = int(input("Age: "))\nif age < 12:\n    print("Price: 20")\nelse:\n    print("Price: 50")\nprint("Enjoy the movie!")\n'
    },
    quiz: [
      { q: 'إيه ناتج الكود ده؟', code: 'x = 5\nif x > 3:\n    print("A")\nelse:\n    print("B")', options: ['A', 'B', 'A و B', 'مفيش'], answer: 0, why: '5 > 3 صح، فبيتنفذ جزء if بس.' },
      { q: 'إيه اللي ناقص في السطر ده؟', code: 'if x == 10\n    print("ten")', options: ['أقواس', 'علامة : في آخر سطر if', 'else', 'علامات تنصيص'], answer: 1, why: 'سطر if لازم ينتهي بـ : .' },
      { q: 'إيه ناتج الكود ده؟', code: 'n = 4\nif n % 2 == 0:\n    print("even")\nprint("end")', options: ['even', 'end', 'even ثم end', 'مفيش'], answer: 2, why: 'الشرط صح فيطبع even، و end برّه if فبيتطبع دايمًا.' },
      { q: 'إيه الخطأ اللي بيطلع لو نسينا إزاحة السطر اللي تحت if؟', options: ['NameError', 'IndentationError', 'TypeError', 'مفيش خطأ'], answer: 1, why: 'Python محتاجة الإزاحة عشان تعرف الكود التابع للـ if.' },
      { q: 'إمتى بيتنفذ الكود اللي تحت else؟', options: ['دايمًا', 'لما شرط if يكون True', 'لما شرط if يكون False', 'مبيتنفذش'], answer: 2, why: 'else هي الحالة التانية لما الشرط ميتحققش.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
