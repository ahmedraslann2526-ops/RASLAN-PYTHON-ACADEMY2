/* RASLAN PYTHON ACADEMY — المستوى 15: الدوال Functions (+ أهم طرق النصوص) */
(function (L) {
  'use strict';
  L[15] = {
    n: 15,
    bot: {
      hello: 'النهارده هتبقى "مصنّع" أوامر! هتعمل دوالك الخاصة بـ def، وكمان هنتعلم أهم طرق النصوص 🛠️',
      done: 'رائع! بقيت تكتب دوال وتنسّق النصوص زي المحترفين. خلّصت المرحلة المتوسطة كلها 🎓'
    },
    goals: [
      'تعرّف دالة بـ def وتستدعيها أكتر من مرة.',
      'تعمل دالة بتاخد معامل (Parameter) وتستخدمه.',
      'تستخدم أهم طرق النصوص: upper و lower و strip و replace و title.',
      'تنسّق النصوص بـ f-string.'
    ],
    sections: [
      {
        id: 's1', title: 'يعني إيه دالة؟ def والاستدعاء',
        text: [
          'الدالة (Function) مجموعة أوامر ليها اسم. بتكتبها مرة واحدة، وتشغّلها في أي وقت باسمها.',
          'بنعرّفها بـ `def` وبعدها الاسم وأقواس و`:`، والكود اللي جواها مزاح: `def say_hello():`.',
          'التعريف لوحده مبيشغّلش حاجة! لازم "تستدعي" الدالة باسمها وأقواس: `say_hello()`.',
          'إنت أصلًا استخدمت دوال كتير جاهزة زي `print()` و `len()`. النهارده هتعمل دوالك إنت.'
        ],
        analogy: 'الدالة زي زرار "قهوة" في الماكينة: الخطوات كلها متسجلة جواه، وكل ما تدوس عليه بيعمل نفس الشغل من غير ما تشرح من الأول.',
        example: {
          code: 'def say_hello():\n    print("Hello!")\n    print("Welcome to the academy")\n\nsay_hello()\nprint("---")\nsay_hello()\n',
          lines: [
            ['def say_hello():', 'تعريف دالة اسمها say_hello. لسه محدش شغّلها.'],
            ['    print("Hello!")', 'الأوامر المزاحة دي جسم الدالة.'],
            ['say_hello()', 'الاستدعاء: دلوقتي بس الأوامر بتتنفذ.'],
            ['say_hello() التانية', 'نفس الشغل تاني من غير ما نكرر الكود.']
          ],
          tip: 'امسح سطري الاستدعاء وشغّل. هتلاقي مفيش حاجة اتطبعت!'
        }
      },
      {
        id: 's2', title: 'دالة بمعامل (Parameter)',
        text: [
          'المعامل متغير بيتكتب جوه أقواس الدالة: `def greet(name):`. بيستقبل قيمة وقت الاستدعاء.',
          'لما تكتب `greet("Ali")` المعامل `name` بياخد القيمة "Ali" جوه الدالة.',
          'كده نفس الدالة تشتغل مع بيانات مختلفة كل مرة.'
        ],
        analogy: 'زي ماكينة العصير: الماكينة نفسها واحدة، بس على حسب الفاكهة اللي تحطها (المعامل) يطلع عصير مختلف.',
        example: {
          code: 'def greet(name):\n    print(f"Welcome, {name}!")\n\ngreet("Ali")\ngreet("Sara")\n',
          lines: [
            ['def greet(name):', 'name معامل هيستقبل قيمة.'],
            ['f"Welcome, {name}!"', 'f-string: بنحط المتغير جوه النص بين { }.'],
            ['greet("Ali")', 'name = "Ali" جوه الدالة.']
          ],
          tip: 'استدعي greet باسمك.'
        }
      },
      {
        id: 's3', title: 'أهم طرق النصوص',
        text: [
          'النص في Python ليه "طرق" (Methods) جاهزة بنستخدمها بنقطة بعد النص:',
          '`upper()` كله حروف كبيرة، `lower()` كله صغيرة، `title()` أول حرف من كل كلمة كبير.',
          '`strip()` بتشيل المسافات الزيادة من الأول والآخر، و`replace("a", "b")` بتبدّل حاجة بحاجة.',
          'الطرق دي مبتغيّرش النص الأصلي، بترجّع نص جديد. عشان كده بنخزنه أو نطبعه على طول.'
        ],
        analogy: 'زي فلاتر الصور: نفس الصورة، بس كل فلتر بيطلّع نسخة بشكل مختلف والأصل زي ما هو.',
        example: {
          code: 'text = "  hello python  "\nclean = text.strip()\nprint(clean.upper())\nprint(clean.title())\nprint(clean.replace("python", "world"))\nprint(len(text), len(clean))\n',
          lines: [
            ['text.strip()', 'تشيل المسافات اللي في الأطراف: "hello python".'],
            ['clean.upper()', 'HELLO PYTHON'],
            ['clean.title()', 'Hello Python'],
            ['replace("python", "world")', 'hello world']
          ],
          tip: 'جرّب "Ahmed".lower() و "cairo".title().'
        }
      },
      {
        id: 's4', title: 'f-string: نصوص منسّقة',
        text: [
          'بدل ما تدمج نصوص وأرقام بـ + و str()، حط حرف `f` قبل علامة التنصيص واكتب المتغيرات بين `{ }`.',
          'وتقدر تكتب عمليات جوه الأقواس: `f"{a + b}"`، أو تستدعي طرق: `f"{name.upper()}"`.'
        ],
        analogy: 'f-string زي استمارة فيها خانات فاضية، وPython بتملاها بالقيم أوتوماتيك.',
        example: {
          code: 'name = "sara"\nage = 15\nprint(f"Name: {name.title()}")\nprint(f"Age next year: {age + 1}")\n\ndef badge(name, level):\n    print(f"[{name.upper()}] Level {level}")\n\nbadge("omar", 7)\n',
          lines: [
            ['f"Name: {name.title()}"', 'Name: Sara'],
            ['{age + 1}', 'حساب جوه الخانة: 16'],
            ['def badge(name, level):', 'دالة بمعاملين بتستخدم f-string.']
          ],
          tip: 'غيّر الأسماء والأرقام.'
        }
      }
    ],
    exercises: [
      {
        id: 'l15-e1', tier: 'veryEasy', title: 'أول دالة',
        prompt: 'اعمل دالة اسمها `say_hello` بتطبع `Hello!`، واستدعيها مرتين.\nالمتوقع:\n`Hello!`\n`Hello!`',
        starter: 'def say_hello():\n    # اكتب هنا\n',
        hints: ['جوه الدالة: print("Hello!")', 'تحت الدالة (من غير إزاحة): say_hello() مرتين.'],
        tests: [{ exact: 'Hello!\nHello!', calls: [{ expr: 'say_hello()', out: 'Hello!', expect: 'None', label: 'say_hello()' }] }],
        src: [{ re: /\bdef\s+say_hello\s*\(/, msg: 'عرّف الدالة بـ def say_hello():' }],
        solution: 'def say_hello():\n    print("Hello!")\n\nsay_hello()\nsay_hello()\n'
      },
      {
        id: 'l15-e2', tier: 'easy', title: 'دالة الترحيب',
        prompt: 'اعمل دالة `greet(name)` بتطبع:\n`Welcome, <name>!`\nمثال: `greet("Ali")` تطبع `Welcome, Ali!`\n(هنستدعيها بأسماء مختلفة.)',
        starter: '',
        hints: ['def greet(name):', 'print(f"Welcome, {name}!")'],
        tests: [{ calls: [
          { expr: 'greet("Ali")', out: 'Welcome, Ali!', label: 'greet("Ali")' },
          { expr: 'greet("Mona")', out: 'Welcome, Mona!', label: 'greet("Mona")' }
        ] }],
        src: [{ re: /\bdef\s+greet\s*\(\s*\w+\s*\)/, msg: 'عرّف الدالة بمعامل واحد: def greet(name):' }],
        solution: 'def greet(name):\n    print(f"Welcome, {name}!")\n'
      },
      {
        id: 'l15-e3', tier: 'medium', title: 'صوت عالي',
        prompt: 'اعمل دالة `shout(text)` بتشيل المسافات الزيادة من أطراف النص، وتحوله لحروف كبيرة، وتطبعه وبعده علامة `!`.\nمثال: `shout("  hi there ")` تطبع `HI THERE!`',
        starter: '',
        hints: ['text.strip() ثم .upper()', 'print(text.strip().upper() + "!")'],
        tests: [{ calls: [
          { expr: 'shout("  hi there ")', out: 'HI THERE!', label: 'shout("  hi there ")' },
          { expr: 'shout("python")', out: 'PYTHON!', label: 'shout("python")' }
        ] }],
        src: [{ re: /\.strip\s*\(/, msg: 'استخدم strip().' }, { re: /\.upper\s*\(/, msg: 'استخدم upper().' }],
        solution: 'def shout(text):\n    print(text.strip().upper() + "!")\n'
      },
      {
        id: 'l15-e4', tier: 'challenge', title: 'صندوق الكلمة',
        prompt: 'اعمل دالة `print_box(word)` بترسم صندوق حوالين الكلمة:\n`print_box("Hi")` تطبع:\n`******`\n`* Hi *`\n`******`\nعرض السطر الأول والأخير = طول الكلمة + 4.',
        starter: '',
        hints: ['line = "*" * (len(word) + 4)', 'السطر الأوسط: f"* {word} *"'],
        tests: [{ calls: [
          { expr: 'print_box("Hi")', out: '******\n* Hi *\n******', label: 'print_box("Hi")' },
          { expr: 'print_box("Python")', out: '**********\n* Python *\n**********', label: 'print_box("Python")' },
          { expr: 'print_box("A")', out: '*****\n* A *\n*****', label: 'print_box("A")' }
        ] }],
        src: [{ re: /\blen\s*\(/, msg: 'احسب العرض من len(word).' }],
        solution: 'def print_box(word):\n    line = "*" * (len(word) + 4)\n    print(line)\n    print(f"* {word} *")\n    print(line)\n'
      }
    ],
    final: {
      id: 'l15-final', title: 'التحدي النهائي: بطاقة العضوية',
      prompt: 'اعمل دالة `member_card(name, city)` بتطبع بطاقة كده:\n`Name: <الاسم بأول حرف كبير لكل كلمة>`\n`City: <المدينة كلها حروف كبيرة>`\nوتشيل المسافات الزيادة من الاتنين.\nبعدين البرنامج يسأل المستخدم عن الاسم ثم المدينة ويستدعي الدالة.\nمثال: `  ali hassan ` و `cairo` ←\n`Name: Ali Hassan`\n`City: CAIRO`',
      starter: '',
      hints: ['name.strip().title()', 'city.strip().upper()', 'في الآخر: member_card(input("Name: "), input("City: "))'],
      tests: [
        { inputs: ['  ali hassan ', 'cairo'], exact: 'Name: Ali Hassan\nCity: CAIRO' },
        { inputs: ['x', 'y'], calls: [{ expr: 'member_card("sara", " giza ")', out: 'Name: Sara\nCity: GIZA', label: 'member_card("sara", " giza ")' }], hidden: true }
      ],
      src: [{ re: /\bdef\s+member_card\s*\(/, msg: 'عرّف الدالة member_card.' }, { re: /\.title\s*\(/, msg: 'استخدم title() للاسم.' }],
      solution: 'def member_card(name, city):\n    print(f"Name: {name.strip().title()}")\n    print(f"City: {city.strip().upper()}")\n\nname = input("Name: ")\ncity = input("City: ")\nmember_card(name, city)\n'
    },
    quiz: [
      { q: 'إيه اللي بيحصل لما نعرّف دالة بـ def ومن غير ما نستدعيها؟', options: ['بتتنفذ مرة', 'مفيش حاجة بتتنفذ', 'خطأ', 'بتتنفذ مرتين'], answer: 1, why: 'التعريف بيسجل الدالة بس، والتنفيذ بيحصل عند الاستدعاء.' },
      { q: 'إيه ناتج الكود ده؟', code: 'def f(x):\n    print(x * 2)\n\nf(4)', options: ['4', '8', 'x * 2', 'خطأ'], answer: 1, why: 'x بقت 4، و4 × 2 = 8.' },
      { q: 'إيه ناتج print("  Hi  ".strip()) ؟', options: ['"  Hi  "', 'Hi', 'HI', 'خطأ'], answer: 1, why: 'strip بتشيل المسافات من الطرفين.' },
      { q: 'إيه ناتج print("ahmed raslan".title()) ؟', options: ['AHMED RASLAN', 'Ahmed raslan', 'Ahmed Raslan', 'ahmed raslan'], answer: 2, why: 'title بتكبّر أول حرف من كل كلمة.' },
      { q: 'لو n = 3، إيه ناتج print(f"Total: {n * 2}") ؟', options: ['Total: {n * 2}', 'Total: 6', 'Total: n * 2', 'خطأ'], answer: 1, why: 'f-string بتحسب اللي بين { }.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
