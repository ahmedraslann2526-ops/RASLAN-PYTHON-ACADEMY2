/* RASLAN PYTHON ACADEMY — المستوى 11: التكرار while */
(function (L) {
  'use strict';
  L[11] = {
    n: 11,
    bot: {
      hello: 'for بتكرر عدد مرات معروف. لكن لو مش عارف هتكرر كام مرة؟ هنا ييجي دور while 🔄',
      done: 'ممتاز! بقيت تتحكم في الحلقات وتعرف إمتى توقفها. وكمان عملت أول لعبة تخمين ليك 🎮'
    },
    goals: [
      'تكتب حلقة while بتتكرر طالما الشرط صح.',
      'تتجنب الحلقة اللانهائية بتحديث المتغير جوه الحلقة.',
      'تستخدم break للخروج و continue لتخطي لفة.',
      'تقرأ مدخلات متكررة لحد ما المستخدم يكتب قيمة توقف.'
    ],
    sections: [
      {
        id: 's1', title: 'while: كرر طالما الشرط صح',
        text: [
          '`while الشرط:` بتسأل الشرط، ولو `True` تنفذ الكود المزاح، وترجع تسأل تاني… لحد ما الشرط يبقى `False`.',
          'الفرق عن for: في while إنت المسؤول إنك تغيّر حاجة جوه الحلقة عشان الشرط يتغير في يوم ما.'
        ],
        analogy: 'زي ما تقول: "طول ما الكوباية مش مليانة، صب مية". مش عارف هتصب كام مرة، بس عارف إمتى تقف.',
        example: {
          code: 'count = 3\nwhile count > 0:\n    print("Count:", count)\n    count = count - 1\nprint("Liftoff!")\n',
          lines: [
            ['while count > 0:', 'طول ما count أكبر من صفر كمّل.'],
            ['    count = count - 1', 'أهم سطر! بيقرّب الحلقة من النهاية.'],
            ['print("Liftoff!")', 'بعد ما الشرط يبقى False.']
          ],
          tip: 'غيّر count الأولاني لـ 5.'
        }
      },
      {
        id: 's2', title: 'خطر الحلقة اللانهائية',
        text: [
          'لو نسيت تغيّر المتغير جوه الحلقة، الشرط هيفضل `True` للأبد والبرنامج مش هيخلص.',
          'المحرر هنا بيحميك: بيوقف البرنامج تلقائي بعد 8 ثواني، وعندك زرار «إيقاف». بس في البرامج الحقيقية لازم تاخد بالك بنفسك.',
          'اسأل نفسك دايمًا: "إيه اللي هيخلي الشرط ده يبقى False؟"'
        ],
        analogy: 'زي عربية من غير فرامل: لازم يكون عندك خطة توقف بيها.',
        example: {
          code: 'n = 1\nwhile n < 100:\n    print(n)\n    n = n * 2\nprint("Stopped at", n)\n',
          lines: [
            ['n = n * 2', 'n بتكبر كل مرة: 1، 2، 4… فأكيد هتعدّي 100 في الآخر.'],
            ['print("Stopped at", n)', 'أول قيمة خلت الشرط False هي 128.']
          ],
          tip: 'امسح سطر n = n * 2 وشغّل… وشوف المحرر بيوقف الحلقة اللانهائية إزاي.'
        }
      },
      {
        id: 's3', title: 'break و continue',
        text: [
          '`break` بتخرجك من الحلقة فورًا، حتى لو الشرط لسه صح.',
          '`continue` بتسيب باقي اللفة الحالية وتروح على اللفة اللي بعدها.',
          'شكل مشهور جدًا: `while True:` حلقة "دايمة" وجواها `break` لما يحصل شرط معين.'
        ],
        analogy: 'break زي ما تقوم من الأكل لما تشبع. continue زي ما تسيب لقمة مش عاجباك وتاخد اللي بعدها.',
        example: {
          code: 'i = 0\nwhile True:\n    i += 1\n    if i == 3:\n        continue\n    if i > 5:\n        break\n    print(i)\nprint("Out of the loop")\n',
          lines: [
            ['while True:', 'حلقة مش هتقف لوحدها…'],
            ['if i == 3: continue', '…3 مش هتتطبع.'],
            ['if i > 5: break', '…ولما i تعدّي 5 نخرج.']
          ],
          tip: 'غيّر 5 لـ 8.'
        }
      },
      {
        id: 's4', title: 'while مع input(): لحد ما المستخدم يقول كفاية',
        text: [
          'while مثالية لما تقرا من المستخدم أكتر من مرة ومتعرفش كام مرة.',
          'بنختار قيمة "توقف" زي `0` أو `"done"`، ونخرج لما المستخدم يكتبها.'
        ],
        analogy: 'زي الكاشير: يفضل يعدّي منتجات لحد ما تقوله "خلاص كده".',
        example: {
          code: 'total = 0\nwhile True:\n    x = int(input("Number (0 to stop): "))\n    if x == 0:\n        break\n    total += x\nprint("Total:", total)\n',
          lines: [
            ['x = int(input(…))', 'كل لفة بنسأل عن رقم جديد.'],
            ['if x == 0: break', 'الصفر هو قيمة التوقف.'],
            ['total += x', 'نجمع الرقم.']
          ],
          tip: 'جرّب تدخل 5 ثم 10 ثم 0.'
        }
      }
    ],
    exercises: [
      {
        id: 'l11-e1', tier: 'veryEasy', title: 'العد التنازلي',
        prompt: 'باستخدام while (مش for) اطبع العد التنازلي من 5 لـ 1، وبعدها `Go!`:\n`5`\n`4`\n`3`\n`2`\n`1`\n`Go!`',
        starter: 'n = 5\n',
        hints: ['while n > 0:', 'متنساش n = n - 1 جوه الحلقة.'],
        tests: [{ exact: '5\n4\n3\n2\n1\nGo!' }],
        src: [{ re: /\bwhile\b/, msg: 'استخدم while.' }],
        forbid: [{ re: /\bfor\b/, msg: 'التمرين ده لـ while، متستخدمش for.' }],
        solution: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("Go!")\n'
      },
      {
        id: 'l11-e2', tier: 'easy', title: 'مضاعفات 2',
        prompt: 'اسأل عن رقم n واطبع كل قوى الرقم 2 اللي أقل من أو تساوي n، بادئًا من 1.\nمثال: 20 ←\n`1`\n`2`\n`4`\n`8`\n`16`',
        starter: '',
        hints: ['x = 1', 'while x <= n: اطبع x ثم x = x * 2'],
        tests: [{ inputs: ['20'], exact: '1\n2\n4\n8\n16' }, { inputs: ['1'], exact: '1' }, { inputs: ['100'], exact: '1\n2\n4\n8\n16\n32\n64', hidden: true }, { inputs: ['64'], exact: '1\n2\n4\n8\n16\n32\n64', hidden: true }],
        src: [{ re: /\bwhile\b/, msg: 'استخدم while.' }],
        solution: 'n = int(input("n: "))\nx = 1\nwhile x <= n:\n    print(x)\n    x = x * 2\n'
      },
      {
        id: 'l11-e3', tier: 'medium', title: 'اجمع لحد الصفر',
        prompt: 'اقرأ أرقام من المستخدم (كل رقم بـ input) لحد ما يكتب `0`، وبعدين اطبع مجموعهم بس.\nمثال: 5 ثم 3 ثم 2 ثم 0 ← `10`',
        starter: '',
        hints: ['total = 0 ثم while True:', 'x = int(input()) ثم if x == 0: break'],
        tests: [{ inputs: ['5', '3', '2', '0'], exact: '10' }, { inputs: ['0'], exact: '0' }, { inputs: ['10', '-4', '0'], exact: '6', hidden: true }, { inputs: ['1', '1', '1', '1', '1', '0'], exact: '5', hidden: true }],
        src: [{ re: /\bwhile\b/, msg: 'استخدم while.' }],
        solution: 'total = 0\nwhile True:\n    x = int(input("Number: "))\n    if x == 0:\n        break\n    total += x\nprint(total)\n'
      },
      {
        id: 'l11-e4', tier: 'challenge', title: 'لعبة التخمين',
        prompt: 'الرقم السري `secret = 7`. اقرأ تخمينات من اللاعب لحد ما يخمن صح:\n- لو التخمين أقل ← `Higher`\n- لو أكبر ← `Lower`\n- لو صح ← `Correct!` واخرج من الحلقة\nبعد الحلقة اطبع عدد المحاولات: `Tries: 3`\nمتطبعش أي حاجة تانية غير كده (السؤال جوه input عادي).',
        starter: 'secret = 7\n',
        hints: ['tries = 0 ثم while True:', 'كل لفة: guess = int(input("Guess: ")) و tries += 1', 'لما guess == secret: print("Correct!") ثم break'],
        tests: [
          { inputs: ['3', '9', '7'], exact: 'Higher\nLower\nCorrect!\nTries: 3' },
          { inputs: ['7'], exact: 'Correct!\nTries: 1' },
          { inputs: ['1', '2', '10', '8', '7'], exact: 'Higher\nHigher\nLower\nLower\nCorrect!\nTries: 5', hidden: true }
        ],
        src: [{ re: /\bwhile\b/, msg: 'استخدم while.' }, { re: /\bbreak\b|while\s+[^\n:]*!=/, msg: 'اخرج من الحلقة بـ break (أو اعمل شرط الحلقة guess != secret).' }],
        solution: 'secret = 7\ntries = 0\nwhile True:\n    guess = int(input("Guess: "))\n    tries += 1\n    if guess < secret:\n        print("Higher")\n    elif guess > secret:\n        print("Lower")\n    else:\n        print("Correct!")\n        break\nprint("Tries:", tries)\n'
      }
    ],
    final: {
      id: 'l11-final', title: 'التحدي النهائي: ماكينة الصراف',
      prompt: 'الرصيد يبدأ بـ `balance = 100`. اقرأ أوامر بشكل متكرر:\n- `d` ← اقرأ مبلغ بعده وضيفه على الرصيد\n- `w` ← اقرأ مبلغ؛ لو أكبر من الرصيد اطبع `Not enough`، وإلا اخصمه\n- `q` ← اخرج من الحلقة\nبعد الخروج اطبع `Balance: <الرصيد>`.\nمتطبعش أي حاجة تانية.\nمثال: d ثم 50 ثم w ثم 30 ثم q ← `Balance: 120`',
      starter: 'balance = 100\n',
      hints: ['while True: ثم cmd = input("Command: ")', 'if cmd == "q": break', 'elif cmd == "d": amount = int(input("Amount: ")) …'],
      tests: [
        { inputs: ['d', '50', 'w', '30', 'q'], exact: 'Balance: 120' },
        { inputs: ['w', '500', 'q'], exact: 'Not enough\nBalance: 100' },
        { inputs: ['q'], exact: 'Balance: 100', hidden: true },
        { inputs: ['w', '100', 'w', '1', 'd', '5', 'q'], exact: 'Not enough\nBalance: 5', hidden: true }
      ],
      src: [{ re: /\bwhile\b/, msg: 'استخدم while.' }, { re: /\bbreak\b|while\s+[^\n:]*!=/, msg: 'اخرج من الحلقة عند q.' }],
      solution: 'balance = 100\nwhile True:\n    cmd = input("Command (d/w/q): ")\n    if cmd == "q":\n        break\n    elif cmd == "d":\n        amount = int(input("Amount: "))\n        balance += amount\n    elif cmd == "w":\n        amount = int(input("Amount: "))\n        if amount > balance:\n            print("Not enough")\n        else:\n            balance -= amount\nprint("Balance:", balance)\n'
    },
    quiz: [
      { q: 'إمتى حلقة while بتقف؟', options: ['بعد 10 مرات', 'لما الشرط يبقى False', 'لما الشرط يبقى True', 'مبتقفش'], answer: 1, why: 'بتتكرر طالما الشرط True.' },
      { q: 'إيه مشكلة الكود ده؟', code: 'x = 1\nwhile x < 5:\n    print(x)', options: ['مفيش مشكلة', 'حلقة لا نهائية لأن x مبتتغيرش', 'خطأ في print', 'هيطبع 5 مرات'], answer: 1, why: 'x فاضلة 1 للأبد فالشرط دايمًا True.' },
      { q: 'إيه اللي بتعمله break ؟', options: ['بتعيد اللفة', 'بتخرج من الحلقة فورًا', 'بتوقف البرنامج كله', 'بتتخطى سطر'], answer: 1, why: 'break بتنهي الحلقة.' },
      { q: 'إيه ناتج الكود ده؟', code: 'i = 0\nwhile i < 5:\n    i += 1\n    if i == 2:\n        continue\n    print(i, end=" ")', options: ['1 2 3 4 5', '1 3 4 5', '1 3 4', '2'], answer: 1, why: 'continue بتتخطى طباعة 2 بس.' },
      { q: 'أنهي حلقة أنسب لما نقرا أرقام لحد ما المستخدم يكتب 0؟', options: ['for i in range(10)', 'while مع break', 'if', 'مفيش'], answer: 1, why: 'مش عارفين عدد المرات مسبقًا.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
