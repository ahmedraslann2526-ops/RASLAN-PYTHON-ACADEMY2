/* RASLAN PYTHON ACADEMY — المستوى 19: الأخطاء والاستثناءات Error Handling */
(function (L) {
  'use strict';
  L[19] = {
    n: 19,
    bot: {
      hello: 'الأخطاء مش عيب، العيب إن البرنامج يقع منها! 😄 النهارده هنعلّم برنامجك يتعامل مع المشاكل بهدوء بـ try و except.',
      done: 'عظيم! برامجك بقت قوية ومبتقعش من أول غلطة. فاضل مستوى واحد وتوصل لمشروع التخرج 💪'
    },
    goals: [
      'تمسك الأخطاء بـ try و except وتحدد نوعها.',
      'تستخدم else و finally وتعرف إمتى بيتنفذوا.',
      'تطلّع خطأ بنفسك بـ raise برسالة واضحة.',
      'تتحقق من مدخلات المستخدم وتطلب منه يعيد لحد ما يدخل قيمة صح.'
    ],
    sections: [
      {
        id: 's1', title: 'try و except',
        text: [
          'لما يحصل خطأ، البرنامج بيقف فورًا. بـ `try` بنقول: "جرّب الكود ده"، و`except` بتقول: "لو حصل خطأ، اعمل ده بدل ما تقع".',
          'الأفضل تحدد نوع الخطأ: `except ValueError:` بدل `except:` لوحدها، عشان متخبيش أخطاء تانية مكنتش متوقعها.',
          'وتقدر تكتب أكتر من except لأنواع مختلفة.'
        ],
        analogy: 'try و except زي شبكة الأمان تحت لاعب السيرك: لو وقع، الشبكة بتمسكه والعرض بيكمّل.',
        example: {
          code: 'values = ["10", "abc", "0"]\nfor v in values:\n    try:\n        n = int(v)\n        print(100 / n)\n    except ValueError:\n        print(v, "is not a number")\n    except ZeroDivisionError:\n        print("Cannot divide by zero")\nprint("Program continues")\n',
          lines: [
            ['try:', 'الكود اللي ممكن يطلع خطأ.'],
            ['except ValueError:', 'لو int() فشلت.'],
            ['except ZeroDivisionError:', 'لو القسمة على صفر.'],
            ['print("Program continues")', 'البرنامج كمّل ومقعش.']
          ],
          tip: 'ضيف "5" للقائمة.'
        }
      },
      {
        id: 's2', title: 'else و finally',
        text: [
          '`else` بعد except: بتتنفذ **بس** لو مفيش خطأ حصل.',
          '`finally`: بتتنفذ **دايمًا** سواء حصل خطأ أو لأ، ومناسبة لحاجات زي "انتهينا" أو قفل ملف.',
          'وتقدر تحتفظ برسالة الخطأ: `except ValueError as e:` وبعدين `print(e)`.'
        ],
        analogy: 'else زي "لو الامتحان عدّى على خير، روح العب"، و finally زي "في كل الأحوال، ارجع البيت".',
        example: {
          code: 'def safe_int(text):\n    try:\n        n = int(text)\n    except ValueError as e:\n        print("Error:", e)\n        return None\n    else:\n        print("Converted OK")\n        return n\n    finally:\n        print("Checked:", text)\n\nprint(safe_int("42"))\nprint(safe_int("4x"))\n',
          lines: [
            ['except ValueError as e:', 'e فيها رسالة الخطأ الأصلية.'],
            ['else:', 'لو التحويل نجح.'],
            ['finally:', 'بتتنفذ في الحالتين، حتى مع return.']
          ],
          tip: 'لاحظ ترتيب السطور في المخرجات.'
        }
      },
      {
        id: 's3', title: 'raise: طلّع خطأ بنفسك',
        text: [
          'أحيانًا القيمة صح من ناحية النوع لكنها مش منطقية، زي سحب مبلغ سالب. هنا تقدر تطلّع خطأ بنفسك: `raise ValueError("Invalid amount")`.',
          'كده اللي بيستخدم دالتك يعرف بالظبط إيه المشكلة، ويقدر يمسكها بـ try.'
        ],
        analogy: 'raise زي الحكم لما يصفّر ويرفع الكارت: "في مخالفة هنا، ووقف اللعب".',
        example: {
          code: 'def set_age(age):\n    if age < 0:\n        raise ValueError("Age cannot be negative")\n    return age\n\nfor a in [15, -3]:\n    try:\n        print("Age set to", set_age(a))\n    except ValueError as e:\n        print("Problem:", e)\n',
          lines: [
            ['raise ValueError("…")', 'نطلّع خطأ برسالة واضحة.'],
            ['except ValueError as e:', 'نمسكه ونعرض رسالته.']
          ],
          tip: 'استدعي set_age(-1) من غير try وشوف المحرر بيشرح الخطأ إزاي.'
        }
      },
      {
        id: 's4', title: 'التحقق من مدخلات المستخدم',
        text: [
          'مع `while True` و `try` نقدر نطلب من المستخدم يعيد الإدخال لحد ما يكتب قيمة صحيحة.',
          'لما التحويل ينجح نخرج بـ `break`.'
        ],
        analogy: 'زي ماكينة الصراف لما تكتب رقم سري غلط: بتقولك "حاول تاني" بدل ما تقفل.',
        example: {
          code: 'while True:\n    text = input("Enter your age: ")\n    try:\n        age = int(text)\n        break\n    except ValueError:\n        print("Please enter a number")\nprint("Thanks! Age:", age)\n',
          lines: [
            ['while True:', 'نفضل نسأل.'],
            ['int(text) ثم break', 'لو نجح نخرج.'],
            ['except ValueError:', 'لو فشل نطبع رسالة ونسأل تاني.']
          ],
          tip: 'جرّب تكتب abc الأول وبعدين 15.'
        }
      }
    ],
    exercises: [
      {
        id: 'l19-e1', tier: 'veryEasy', title: 'أول try',
        prompt: 'عندك `text = "abc"`. جرّب تحوّله لرقم بـ `int()` جوه try:\n- لو التحويل نجح اطبع الرقم\n- لو طلع ValueError اطبع `Invalid number`\n(هنجرّب كودك كمان بنص فيه رقم صحيح.)',
        starter: 'text = "abc"\n',
        hints: ['try: n = int(text) ثم print(n)', 'except ValueError: print("Invalid number")'],
        tests: [
          { exact: 'Invalid number' },
          { exact: '25', replace: [/\btext\s*=\s*"abc"/, 'text = "25"'], hidden: true }
        ],
        src: [{ re: /\btry\s*:/, msg: 'استخدم try.' }, { re: /\bexcept\s+ValueError\b/, msg: 'امسك ValueError بالتحديد.' }],
        solution: 'text = "abc"\ntry:\n    n = int(text)\n    print(n)\nexcept ValueError:\n    print("Invalid number")\n'
      },
      {
        id: 'l19-e2', tier: 'easy', title: 'قسمة آمنة',
        prompt: 'اعمل دالة `safe_divide(a, b)` بترجّع `a / b`، ولو b صفر ترجّع `None` (باستخدام try و except ZeroDivisionError، مش if).',
        starter: '',
        hints: ['try: return a / b', 'except ZeroDivisionError: return None'],
        tests: [{ calls: [{ expr: 'safe_divide(10, 2)', expect: '5.0' }, { expr: 'safe_divide(1, 0)', expect: 'None' }, { expr: 'safe_divide(-9, 3)', expect: '-3.0' }] }],
        src: [{ re: /\bexcept\s+ZeroDivisionError\b/, msg: 'امسك ZeroDivisionError.' }],
        forbid: [{ re: /\bif\b[^\n]*==\s*0/, msg: 'التمرين عن try/except، فمتفحصش الصفر بـ if.' }],
        solution: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n'
      },
      {
        id: 'l19-e3', tier: 'medium', title: 'اسأل لحد ما يكتب رقم',
        prompt: 'اطلب رقم صحيح من المستخدم. لو كتب حاجة مش رقم صحيح اطبع `Not a number` واسأله تاني، ولما يكتب رقم صحيح اطبع `Got: <الرقم>`.\nمثال: x ثم 3.5 ثم 7 ←\n`Not a number`\n`Not a number`\n`Got: 7`',
        starter: '',
        hints: ['while True: + try: n = int(input("Number: ")); break', 'except ValueError: print("Not a number")'],
        tests: [
          { inputs: ['x', '3.5', '7'], exact: 'Not a number\nNot a number\nGot: 7' },
          { inputs: ['12'], exact: 'Got: 12' },
          { inputs: ['', 'ten', '-4'], exact: 'Not a number\nNot a number\nGot: -4', hidden: true }
        ],
        src: [{ re: /\bexcept\s+ValueError\b/, msg: 'امسك ValueError.' }, { re: /\bwhile\b/, msg: 'استخدم while عشان تسأل تاني.' }],
        solution: 'while True:\n    try:\n        n = int(input("Number: "))\n        break\n    except ValueError:\n        print("Not a number")\nprint("Got:", n)\n'
      },
      {
        id: 'l19-e4', tier: 'challenge', title: 'السحب من الحساب',
        prompt: 'اعمل دالة `withdraw(balance, amount)`:\n- لو amount أقل من أو يساوي صفر ← `raise ValueError("Invalid amount")`\n- لو amount أكبر من balance ← `raise ValueError("Not enough balance")`\n- غير كده ترجّع الرصيد بعد الخصم.',
        starter: '',
        hints: ['if amount <= 0: raise ValueError("Invalid amount")', 'return balance - amount'],
        tests: [{ calls: [
          { expr: 'withdraw(100, 30)', expect: '70' },
          { expr: 'withdraw(100, 100)', expect: '0' },
          { expr: 'withdraw(100, 150)', err: 'ValueError: Not enough balance' },
          { expr: 'withdraw(100, 0)', err: 'ValueError: Invalid amount' },
          { expr: 'withdraw(100, -5)', err: 'ValueError: Invalid amount' }
        ] }],
        src: [{ re: /\braise\s+ValueError\b/, msg: 'استخدم raise ValueError.' }],
        solution: 'def withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError("Invalid amount")\n    if amount > balance:\n        raise ValueError("Not enough balance")\n    return balance - amount\n'
      }
    ],
    final: {
      id: 'l19-final', title: 'التحدي النهائي: آلة حاسبة آمنة',
      prompt: 'اقرأ 3 مدخلات بالترتيب: رقم أول، عملية (`+` أو `-` أو `*` أو `/`)، رقم تاني.\n- لو أي رقم مش رقم صالح (استخدم float) ← `Error: invalid number`\n- لو قسمة على صفر ← `Error: division by zero`\n- لو العملية مش من الأربعة ← `Error: unknown operator`\n- غير كده اطبع `Result: <الناتج>`\nوفي كل الحالات اطبع في الآخر `Done` (باستخدام finally).',
      starter: '',
      hints: ['اقرا المدخلات التلاتة الأول كنصوص.', 'جوه try: a = float(...) و b = float(...)', 'except ValueError / ZeroDivisionError، و finally: print("Done")', 'للعملية المجهولة: استخدم else جوه try واطبع Error: unknown operator (متطلّعش ValueError عشان الرسالة متتلخبطش مع الرقم الغلط).'],
      tests: [
        { inputs: ['6', '*', '7'], exact: 'Result: 42.0\nDone' },
        { inputs: ['1', '/', '0'], exact: 'Error: division by zero\nDone' },
        { inputs: ['x', '+', '2'], exact: 'Error: invalid number\nDone' },
        { inputs: ['3', '%', '2'], exact: 'Error: unknown operator\nDone' },
        { inputs: ['10', '-', '2.5'], exact: 'Result: 7.5\nDone', hidden: true },
        { inputs: ['9', '/', '3'], exact: 'Result: 3.0\nDone', hidden: true }
      ],
      src: [{ re: /\bfinally\s*:/, msg: 'استخدم finally عشان تطبع Done.' }, { re: /\bexcept\s+ZeroDivisionError\b/, msg: 'امسك ZeroDivisionError.' }, { re: /\bexcept\s+ValueError\b/, msg: 'امسك ValueError.' }],
      solution: 'a_text = input("First: ")\nop = input("Operator: ")\nb_text = input("Second: ")\ntry:\n    a = float(a_text)\n    b = float(b_text)\n    if op == "+":\n        print("Result:", a + b)\n    elif op == "-":\n        print("Result:", a - b)\n    elif op == "*":\n        print("Result:", a * b)\n    elif op == "/":\n        print("Result:", a / b)\n    else:\n        print("Error: unknown operator")\nexcept ValueError:\n    print("Error: invalid number")\nexcept ZeroDivisionError:\n    print("Error: division by zero")\nfinally:\n    print("Done")\n'
    },
    quiz: [
      { q: 'إمتى بيتنفذ الكود اللي تحت except ؟', options: ['دايمًا', 'لما يحصل الخطأ اللي محدد في try', 'لما مفيش خطأ', 'مبيتنفذش'], answer: 1, why: 'except بتشتغل بس لو حصل خطأ من النوع ده.' },
      { q: 'إمتى بيتنفذ finally ؟', options: ['لو حصل خطأ بس', 'لو محصلش خطأ بس', 'دايمًا', 'مع else بس'], answer: 2, why: 'finally بتتنفذ في كل الأحوال.' },
      { q: 'إيه ناتج الكود ده؟', code: 'try:\n    x = int("5")\nexcept ValueError:\n    print("A")\nelse:\n    print("B")', options: ['A', 'B', 'A و B', 'مفيش'], answer: 1, why: 'التحويل نجح فاتنفذت else.' },
      { q: 'إيه اللي بتعمله raise ValueError("bad") ؟', options: ['بتطبع bad', 'بتطلّع خطأ برسالة bad', 'بتتجاهل الخطأ', 'بترجّع bad'], answer: 1, why: 'raise بتطلّع خطأ بنفسك.' },
      { q: 'ليه الأفضل نكتب except ValueError بدل except لوحدها؟', options: ['أسرع', 'عشان منخبيش أخطاء تانية مش متوقعة', 'لازم في Python', 'مفيش فرق'], answer: 1, why: 'تحديد النوع بيخلي أخطاء البرمجة التانية تبان.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
