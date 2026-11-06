/* RASLAN PYTHON ACADEMY — المستوى 17: النطاق والمكتبات Scope & Modules */
(function (L) {
  'use strict';
  L[17] = {
    n: 17,
    bot: {
      hello: 'فين بيعيش المتغير؟ جوه الدالة ولا برّه؟ 🤔 وكمان هنفتح صندوق المكتبات الجاهزة اللي جاية مع Python.',
      done: 'برافو! بقيت فاهم النطاق، وبتستخدم math و random و string زي المحترفين 📦'
    },
    goals: [
      'تفرّق بين المتغير المحلي (Local) والعام (Global).',
      'تعرف إمتى تستخدم global وليه الأفضل تتجنبها.',
      'تستورد المكتبات بـ import و from و as.',
      'تستخدم math و random و string في برامج حقيقية.'
    ],
    sections: [
      {
        id: 's1', title: 'المتغير المحلي والعام',
        text: [
          'المتغير اللي بيتعمل **جوه** دالة اسمه محلي (Local): بيعيش جوه الدالة بس، وبيختفي لما تخلص.',
          'المتغير اللي بيتعمل **برّه** أي دالة اسمه عام (Global): تقدر تقراه من أي مكان.',
          'لو عملت متغير جوه الدالة بنفس اسم متغير عام، ده بيبقى متغير جديد محلي، ومبيغيّرش العام.'
        ],
        analogy: 'المتغير المحلي زي ورقة ملاحظات جوه أوضتك: محدش برّه يشوفها. المتغير العام زي السبورة في الصالة: كل البيت يقدر يقراها.',
        example: {
          code: 'school = "Raslan Academy"   # عام\n\ndef show():\n    room = "Lab 3"          # محلي\n    print(school, "-", room)\n\nshow()\nprint(school)\n\ntry:\n    print(room)\nexcept NameError:\n    print("room is local: not visible outside")\n',
          lines: [
            ['school = …', 'متغير عام: نقدر نقراه جوه الدالة وبرّاها.'],
            ['room = "Lab 3"', 'محلي: موجود جوه show بس.'],
            ['print(room) برّه', 'هيطلع NameError، فمسكناه بـ try (هنتعلمها بالتفصيل في المستوى 19).']
          ],
          tip: 'اعمل جوه show سطر school = "X" واطبع school برّه بعد الاستدعاء. هتلاقيه متغيّرش!'
        }
      },
      {
        id: 's2', title: 'global: ومتى نتجنبها',
        text: [
          'لو عايز تغيّر متغير عام من جوه دالة، لازم تقول لـ Python الأول: `global count`.',
          'من غيرها، `count = count + 1` جوه الدالة هيطلع خطأ `UnboundLocalError` لأن Python فاكرة إنه متغير محلي جديد.',
          'لكن الأفضل غالبًا إن الدالة تاخد القيمة كمعامل وترجّع النتيجة بـ return. ده بيخلي الكود أوضح وأسهل في الاختبار.'
        ],
        analogy: 'global زي إنك تكتب على السبورة اللي في الصالة: مسموح، بس لو كل واحد كتب عليها من غير ما يقول، البيت كله هيتلخبط.',
        example: {
          code: 'count = 0\n\ndef increase():\n    global count\n    count = count + 1\n\nincrease()\nincrease()\nprint("count:", count)\n\n# الطريقة الأفضل غالبًا:\ndef add_one(n):\n    return n + 1\n\nscore = 5\nscore = add_one(score)\nprint("score:", score)\n',
          lines: [
            ['global count', 'بنقول إننا هنعدّل المتغير العام.'],
            ['def add_one(n): return n + 1', 'من غير global: بتاخد وترجّع.']
          ],
          tip: 'امسح سطر global count وشغّل عشان تشوف الخطأ وشرحه.'
        }
      },
      {
        id: 's3', title: 'المكتبات: import و from و as',
        text: [
          'المكتبة (Module) ملف Python فيه دوال جاهزة. Python جاية معاها مكتبات كتير زي `math` و `random`.',
          '`import math` وبعدها تستخدم `math.sqrt(16)`.',
          '`from math import sqrt, pi` تستورد حاجات معينة وتستخدمها من غير اسم المكتبة.',
          '`import random as rnd` بتدّي المكتبة اسم مختصر.',
          'وأي ملف .py بتكتبه ممكن يبقى مكتبة تستوردها في ملف تاني بـ `import اسم_الملف`. في المحرر هنا بنشتغل في ملف واحد، فهنستخدم المكتبات الجاهزة.'
        ],
        analogy: 'المكتبة زي صندوق عدّة: import بتجيب الصندوق كله، و from بتطلّع منه المفك بس اللي محتاجه.',
        example: {
          code: 'import math\nfrom math import sqrt, pi\nimport random as rnd\n\nprint(math.sqrt(81))\nprint(sqrt(16), round(pi, 2))\nprint(math.floor(3.7), math.ceil(3.2))\n\nrnd.seed(1)\nprint(rnd.randint(1, 6) in [1, 2, 3, 4, 5, 6])\n',
          lines: [
            ['math.sqrt(81)', 'الجذر التربيعي: 9.0'],
            ['from math import sqrt, pi', 'نستخدمهم على طول من غير math.'],
            ['math.floor / math.ceil', 'تقريب لتحت ولفوق.'],
            ['rnd.randint(1, 6)', 'رقم عشوائي من 1 لـ 6.']
          ],
          tip: 'جرّب math.pow(2, 5) و math.factorial(5).'
        }
      },
      {
        id: 's4', title: 'random و string في برامج حقيقية',
        text: [
          '`random.choice(items)` بتختار عنصر عشوائي من قائمة أو نص، و`random.shuffle(lst)` بتلخبط ترتيب القائمة.',
          'مكتبة `string` فيها نصوص جاهزة زي `string.ascii_letters` (كل الحروف الإنجليزي) و `string.digits` (الأرقام).',
          'مع بعض تقدر تعمل مولّد كلمات سر!'
        ],
        analogy: 'random زي إنك تسحب ورقة من قبعة السحر من غير ما تبص.',
        example: {
          code: 'import random\nimport string\n\nchars = string.ascii_letters + string.digits\nparts = []\nfor i in range(10):\n    parts.append(random.choice(chars))\npassword = "".join(parts)\nprint(password, len(password))\n',
          lines: [
            ['string.ascii_letters + string.digits', 'كل الحروف والأرقام.'],
            ['random.choice(chars)', 'حرف عشوائي.'],
            ['"".join(parts)', 'نلزّق الحروف في كلمة سر.']
          ],
          tip: 'شغّل أكتر من مرة، كل مرة كلمة سر مختلفة.'
        }
      }
    ],
    exercises: [
      {
        id: 'l17-e1', tier: 'veryEasy', title: 'مكتبة math',
        prompt: 'استورد `math` واطبع:\n- الجذر التربيعي لـ 81\n- قيمة pi مقرّبة لرقمين عشريين\nالمتوقع:\n`9.0`\n`3.14`',
        starter: '',
        hints: ['import math', 'print(math.sqrt(81))', 'print(round(math.pi, 2))'],
        tests: [{ exact: '9.0\n3.14' }],
        src: [{ re: /\bimport\s+math\b|\bfrom\s+math\s+import\b/, msg: 'استورد مكتبة math.' }, { re: /\bsqrt\s*\(/, msg: 'استخدم sqrt.' }],
        solution: 'import math\nprint(math.sqrt(81))\nprint(round(math.pi, 2))\n'
      },
      {
        id: 'l17-e2', tier: 'easy', title: 'مساحة الدائرة',
        prompt: 'اعمل دالة `circle_area(r)` بترجّع مساحة الدائرة (pi × r × r) مقرّبة لرقمين عشريين، باستخدام `math.pi`.\n`circle_area(1)` ← `3.14`',
        starter: 'import math\n\n',
        hints: ['return round(math.pi * r * r, 2)'],
        tests: [{ calls: [{ expr: 'circle_area(1)', expect: '3.14' }, { expr: 'circle_area(2.5)', expect: '19.63' }, { expr: 'circle_area(0)', expect: '0.0' }] }],
        src: [{ re: /\bpi\b/, msg: 'استخدم pi من مكتبة math.' }],
        forbid: [{ re: /3\.14/, msg: 'متكتبش 3.14 بإيدك، استخدم math.pi.' }],
        solution: 'import math\n\ndef circle_area(r):\n    return round(math.pi * r * r, 2)\n'
      },
      {
        id: 'l17-e3', tier: 'medium', title: 'صلّح العدّاد',
        prompt: 'الكود اللي في المحرر بيطلّع خطأ `UnboundLocalError`. صلّحه بحيث الدالة `increase()` تزوّد المتغير العام `count` بواحد كل مرة تتنادى.\n(هنناديها 3 مرات ونتأكد إن count بقت 3.)',
        starter: 'count = 0\n\ndef increase():\n    count = count + 1\n',
        hints: ['ضيف سطر global count في أول الدالة.'],
        tests: [{ calls: [
          { code: 'count = 0\nincrease()\nincrease()\nincrease()', expr: 'count', expect: '3', label: 'من 0: increase() × 3 ثم count' },
          { code: 'count = 10\nincrease()', expr: 'count', expect: '11', label: 'من 10: increase() مرة' }
        ] }],
        src: [{ re: /\bglobal\s+count\b/, msg: 'استخدم global count جوه الدالة.' }],
        solution: 'count = 0\n\ndef increase():\n    global count\n    count = count + 1\n'
      },
      {
        id: 'l17-e4', tier: 'challenge', title: 'زهر الطاولة',
        prompt: 'اعمل دالة `roll_dice(n)` بترجّع قائمة فيها n رقم عشوائي، كل رقم من 1 لـ 6، باستخدام `random.randint`.\nمثال: `roll_dice(3)` ممكن ترجّع `[4, 1, 6]`.',
        starter: 'import random\n\n',
        hints: ['results = []', 'for i in range(n): results.append(random.randint(1, 6))', 'return results'],
        tests: [{ calls: [
          { expr: 'len(roll_dice(7))', expect: '7', label: 'طول roll_dice(7)' },
          { expr: 'all(1 <= x <= 6 for x in roll_dice(300))', expect: 'True', label: 'كل الأرقام بين 1 و 6' },
          { expr: 'sorted(set(roll_dice(300)))', expect: '[1, 2, 3, 4, 5, 6]', label: 'كل الأوجه بتظهر' },
          { expr: 'roll_dice(0)', expect: '[]' }
        ] }],
        src: [{ re: /\brandint\s*\(/, msg: 'استخدم random.randint.' }],
        solution: 'import random\n\ndef roll_dice(n):\n    results = []\n    for i in range(n):\n        results.append(random.randint(1, 6))\n    return results\n'
      }
    ],
    final: {
      id: 'l17-final', title: 'التحدي النهائي: مولّد كلمات السر',
      prompt: 'اعمل دالة `make_password(length)` بترجّع كلمة سر عشوائية طولها length، من حروف إنجليزي وأرقام بس، باستخدام مكتبتي `random` و `string`.\nالتصحيح هيتأكد من: الطول، وإنها حروف وأرقام بس، وإنها بتتغير كل مرة، وإنها بتستخدم حروف وأرقام.',
      starter: '',
      hints: ['import random و import string', 'chars = string.ascii_letters + string.digits', 'استخدم random.choice في حلقة و "".join'],
      tests: [{ calls: [
        { expr: 'len(make_password(12))', expect: '12', label: 'طول make_password(12)' },
        { expr: 'make_password(30).isalnum()', expect: 'True', label: 'حروف وأرقام بس' },
        { expr: 'make_password(20) != make_password(20)', expect: 'True', label: 'كل مرة مختلفة' },
        { expr: 'any(c.isdigit() for c in "".join(make_password(50) for _ in range(5)))', expect: 'True', label: 'بتستخدم أرقام' },
        { expr: 'any(c.isalpha() for c in make_password(50))', expect: 'True', label: 'بتستخدم حروف' },
        { expr: 'make_password(0)', expect: "''" }
      ] }],
      src: [{ re: /\bimport\s+string\b|\bfrom\s+string\s+import\b/, msg: 'استخدم مكتبة string.' }, { re: /\bimport\s+random\b|\bfrom\s+random\s+import\b/, msg: 'استخدم مكتبة random.' }],
      solution: 'import random\nimport string\n\ndef make_password(length):\n    chars = string.ascii_letters + string.digits\n    parts = []\n    for i in range(length):\n        parts.append(random.choice(chars))\n    return "".join(parts)\n'
    },
    quiz: [
      { q: 'متغير اتعمل جوه دالة، نقدر نستخدمه برّاها؟', options: ['أيوه دايمًا', 'لأ، لأنه محلي', 'لو اسمه قصير', 'بعد return بس'], answer: 1, why: 'المتغير المحلي بيعيش جوه الدالة بس.' },
      { q: 'إيه الكلمة اللي بتسمح للدالة تعدّل متغير عام؟', options: ['local', 'global', 'public', 'return'], answer: 1, why: 'global count بتقول إننا هنستخدم المتغير العام.' },
      { q: 'بعد from math import sqrt، إزاي نستخدم الدالة؟', options: ['math.sqrt(9)', 'sqrt(9)', 'math(sqrt)(9)', 'import sqrt(9)'], answer: 1, why: 'from بتجيب الدالة نفسها من غير اسم المكتبة.' },
      { q: 'إيه اللي بيعمله import random as r ؟', options: ['بيحذف random', 'بيدّي المكتبة اسم مختصر r', 'بيستورد دالة اسمها r', 'خطأ'], answer: 1, why: 'as بتدّي اسم بديل.' },
      { q: 'إيه ناتج الكود ده؟', code: 'x = 5\n\ndef f():\n    x = 10\n\nf()\nprint(x)', options: ['5', '10', 'خطأ', 'None'], answer: 0, why: 'x = 10 جوه الدالة متغير محلي جديد، ومغيّرش x العام.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
