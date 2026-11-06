/* RASLAN PYTHON ACADEMY — المستوى 9: العمليات المنطقية and / or / not */
(function (L) {
  'use strict';
  L[9] = {
    n: 9,
    bot: {
      hello: 'أهلًا بيك في أول مستوى متوسط! 🎉 النهارده هتربط أكتر من شرط في قرار واحد بـ and و or و not.',
      done: 'عظيم! بقيت تكتب شروط مركبة زي المحترفين 🔗'
    },
    goals: [
      'تستخدم and عشان تشترط إن كل الشروط تتحقق.',
      'تستخدم or عشان يكفي إن شرط واحد يتحقق.',
      'تستخدم not عشان تعكس الشرط.',
      'تكتب شروط مركبة بالأقواس صح.'
    ],
    sections: [
      {
        id: 's1', title: 'and: لازم الاتنين يكونوا صح',
        text: [
          '`and` بتربط شرطين، والنتيجة `True` بس لو الشرطين صح. لو واحد بس غلط، النتيجة كلها `False`.',
          'مثال: الطالب ينجح لو `score >= 50 and attendance >= 75` — لازم يكون جايب درجة كويسة وحاضر كمان.'
        ],
        analogy: 'عشان تدخل السينما لازم تكون معاك تذكرة and يكون الفيلم مناسب لسنك. واحدة من غير التانية متنفعش.',
        example: {
          code: 'age = 15\nhas_ticket = True\n\nprint(age >= 12 and has_ticket)\nprint(age >= 18 and has_ticket)\n\nif age >= 12 and has_ticket:\n    print("Enjoy the movie")\n',
          lines: [
            ['age >= 12 and has_ticket', 'True and True ← True'],
            ['age >= 18 and has_ticket', 'False and True ← False'],
            ['if … and …:', 'الكود اللي تحتها بيتنفذ لأن الشرط المركب كله True.']
          ],
          tip: 'غيّر has_ticket لـ False وشغّل.'
        }
      },
      {
        id: 's2', title: 'or: يكفي واحد صح',
        text: [
          '`or` بتدّي `True` لو على الأقل شرط واحد صح، وبتدّي `False` بس لو الاتنين غلط.',
          'مفيدة لما يكون عندك أكتر من طريقة لنفس النتيجة، زي إن الإجازة يوم الجمعة `or` يوم السبت.'
        ],
        analogy: 'تقدر تدفع كاش or فيزا. أي واحدة فيهم تكفي عشان تشتري.',
        example: {
          code: 'day = "Saturday"\n\nif day == "Friday" or day == "Saturday":\n    print("Weekend!")\nelse:\n    print("School day")\n',
          lines: [
            ['day == "Friday"', 'False'],
            ['or day == "Saturday"', 'True — وده كفاية عشان الشرط كله يبقى True.']
          ],
          tip: 'خلي بالك: day == "Friday" or "Saturday" غلط! لازم تكتب day == قبل كل قيمة.'
        }
      },
      {
        id: 's3', title: 'not: اعكس الشرط',
        text: [
          '`not` بتقلب القيمة: `not True` تبقى `False`، و`not False` تبقى `True`.',
          'مفيدة لما تحب تسأل "لو مش كذا": `if not is_raining:`.'
        ],
        analogy: 'not زي زرار "عكس" في الريموت: اللي كان شغال يطفي، واللي كان مطفي يشتغل.',
        example: {
          code: 'is_raining = False\n\nif not is_raining:\n    print("Let\'s play outside")\n\nprint(not True)\nprint(not (5 > 3))\n',
          lines: [
            ['not is_raining', 'is_raining = False فـ not بتخليها True.'],
            ['not (5 > 3)', '5 > 3 = True، والـ not بتقلبها False.']
          ],
          tip: 'غيّر is_raining لـ True.'
        }
      },
      {
        id: 's4', title: 'شروط مركبة والأقواس',
        text: [
          'تقدر تجمع and و or و not في نفس الشرط. Python بتنفذ `not` الأول، بعدها `and`، وفي الآخر `or`.',
          'عشان متتلخبطش استخدم الأقواس `( )` توضّح إيه اللي يتحسب مع إيه.',
          'وفي Python تقدر تكتب المدى بشكل مختصر: `13 <= age <= 19` بدل `age >= 13 and age <= 19`.'
        ],
        analogy: 'الأقواس زي ما تحط الكلام المهم بين قوسين في جملة عشان محدش يفهمه غلط.',
        example: {
          code: 'age = 9\nwith_parent = True\n\nallowed = age >= 12 or (age >= 7 and with_parent)\nprint("Allowed:", allowed)\n\nprint(13 <= 15 <= 19)\n',
          lines: [
            ['(age >= 7 and with_parent)', 'True and True ← True'],
            ['age >= 12 or (…)', 'False or True ← True'],
            ['13 <= 15 <= 19', 'طريقة مختصرة للمدى: هل 15 بين 13 و 19؟ True']
          ],
          tip: 'غيّر with_parent لـ False.'
        }
      }
    ],
    exercises: [
      {
        id: 'l9-e1', tier: 'veryEasy', title: 'جدول الحقيقة',
        prompt: 'اطبع ناتج التلات عمليات دول، كل واحدة في سطر:\n`True and False`\n`True or False`\n`not True`',
        starter: '',
        hints: ['print(True and False)'],
        tests: [{ exact: 'False\nTrue\nFalse' }],
        src: [{ re: /\band\b/, msg: 'استخدم and.' }, { re: /\bor\b/, msg: 'استخدم or.' }, { re: /\bnot\b/, msg: 'استخدم not.' }],
        solution: 'print(True and False)\nprint(True or False)\nprint(not True)\n'
      },
      {
        id: 'l9-e2', tier: 'easy', title: 'مراهق؟',
        prompt: 'اسأل عن السن. لو من 13 لحد 19 (الاتنين داخلين) اطبع `Teen`، وإلا اطبع `Not teen`.\nاستخدم `and` (أو المقارنة المتسلسلة).',
        starter: '',
        hints: ['if age >= 13 and age <= 19:'],
        tests: [{ inputs: ['15'], exact: 'Teen' }, { inputs: ['10'], exact: 'Not teen' }, { inputs: ['13'], exact: 'Teen', hidden: true }, { inputs: ['19'], exact: 'Teen', hidden: true }, { inputs: ['20'], exact: 'Not teen', hidden: true }, { inputs: ['12'], exact: 'Not teen', hidden: true }],
        src: [{ re: /\band\b|<=?\s*\w+\s*<=?/, msg: 'استخدم and أو المقارنة المتسلسلة 13 <= age <= 19.' }],
        solution: 'age = int(input("Age: "))\nif age >= 13 and age <= 19:\n    print("Teen")\nelse:\n    print("Not teen")\n'
      },
      {
        id: 'l9-e3', tier: 'medium', title: 'إجازة ولا شغل؟',
        prompt: 'اسأل عن اسم اليوم بالإنجليزي. لو `Friday` أو `Saturday` اطبع `Weekend`، وإلا اطبع `Workday`.',
        starter: '',
        hints: ['if day == "Friday" or day == "Saturday":'],
        tests: [{ inputs: ['Friday'], exact: 'Weekend' }, { inputs: ['Monday'], exact: 'Workday' }, { inputs: ['Saturday'], exact: 'Weekend', hidden: true }, { inputs: ['Sunday'], exact: 'Workday', hidden: true }],
        src: [{ re: /\bor\b/, msg: 'استخدم or.' }],
        solution: 'day = input("Day: ")\nif day == "Friday" or day == "Saturday":\n    print("Weekend")\nelse:\n    print("Workday")\n'
      },
      {
        id: 'l9-e4', tier: 'challenge', title: 'تسجيل الدخول',
        prompt: 'اسأل عن اسم المستخدم ثم كلمة السر.\n- لو الاسم `admin` وكلمة السر `1234` ← `Welcome`\n- لو الاسم `admin` بس كلمة السر غلط ← `Wrong password`\n- غير كده ← `Unknown user`',
        starter: '',
        hints: ['if user == "admin" and password == "1234":', 'elif user == "admin":'],
        tests: [
          { inputs: ['admin', '1234'], exact: 'Welcome' }, { inputs: ['admin', '0000'], exact: 'Wrong password' }, { inputs: ['sara', '1234'], exact: 'Unknown user' },
          { inputs: ['Admin', '1234'], exact: 'Unknown user', hidden: true }
        ],
        src: [{ re: /\band\b/, msg: 'استخدم and.' }, { re: /\belif\b/, msg: 'استخدم elif.' }],
        solution: 'user = input("User: ")\npassword = input("Password: ")\nif user == "admin" and password == "1234":\n    print("Welcome")\nelif user == "admin":\n    print("Wrong password")\nelse:\n    print("Unknown user")\n'
      }
    ],
    final: {
      id: 'l9-final', title: 'التحدي النهائي: لعبة الملاهي',
      prompt: 'اسأل عن 3 حاجات بالترتيب: السن (رقم)، الطول بالسنتيمتر (رقم)، وهل معاه شخص كبير (`yes` أو `no`).\nمسموح له يركب لو:\n- سنه 10 أو أكتر **و** طوله 140 أو أكتر\n- **أو** معاه شخص كبير **و** طوله 120 أو أكتر\nاطبع `Allowed` أو `Not allowed`.',
      starter: '',
      hints: ['adult = input("With adult? ")', 'allowed = (age >= 10 and height >= 140) or (adult == "yes" and height >= 120)'],
      tests: [
        { inputs: ['12', '150', 'no'], exact: 'Allowed' }, { inputs: ['8', '125', 'yes'], exact: 'Allowed' }, { inputs: ['8', '125', 'no'], exact: 'Not allowed' },
        { inputs: ['12', '130', 'no'], exact: 'Not allowed', hidden: true }, { inputs: ['15', '115', 'yes'], exact: 'Not allowed', hidden: true }, { inputs: ['10', '140', 'no'], exact: 'Allowed', hidden: true }
      ],
      src: [{ re: /\band\b/, msg: 'استخدم and.' }, { re: /\bor\b/, msg: 'استخدم or.' }],
      solution: 'age = int(input("Age: "))\nheight = int(input("Height: "))\nadult = input("With adult? ")\nif (age >= 10 and height >= 140) or (adult == "yes" and height >= 120):\n    print("Allowed")\nelse:\n    print("Not allowed")\n'
    },
    quiz: [
      { q: 'إيه ناتج True and False ؟', options: ['True', 'False', 'خطأ', 'None'], answer: 1, why: 'and محتاجة الاتنين True.' },
      { q: 'إيه ناتج False or True ؟', options: ['True', 'False', 'خطأ', 'None'], answer: 0, why: 'or يكفيها واحد True.' },
      { q: 'إيه ناتج not (3 > 1) ؟', options: ['True', 'False', '3', 'خطأ'], answer: 1, why: '3 > 1 = True، وnot بتقلبها.' },
      { q: 'أنهي طريقة صح عشان نسأل هل اليوم جمعة أو سبت؟', options: ['day == "Friday" or "Saturday"', 'day == "Friday" or day == "Saturday"', 'day == ("Friday" and "Saturday")', 'day or "Friday"'], answer: 1, why: 'لازم نكتب المقارنة كاملة في كل ناحية من or.' },
      { q: 'لو x = 15، إيه ناتج 10 <= x <= 20 ؟', options: ['True', 'False', 'خطأ', '15'], answer: 0, why: 'دي مقارنة متسلسلة: x بين 10 و 20.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
