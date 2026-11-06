/* RASLAN PYTHON ACADEMY — المستوى 4: أنواع البيانات */
(function (L) {
  'use strict';
  L[4] = {
    n: 4,
    bot: {
      hello: 'كل قيمة في Python ليها "نوع"، زي ما كل حاجة في البيت ليها درج. النهارده هنعرف الأنواع ونحوّل بينها 🔄',
      done: 'ممتاز! بقيت تعرف int و float و str و bool، وتحوّل بينهم من غير أخطاء 👏'
    },
    goals: [
      'تعرف الأنواع الأساسية: int و float و str و bool.',
      'تستخدم type() عشان تعرف نوع أي قيمة.',
      'تحوّل بين الأنواع بـ int() و float() و str().',
      'تحل مشكلة دمج نص مع رقم.'
    ],
    sections: [
      {
        id: 's1', title: 'الأرقام: int و float',
        text: [
          '`int` يعني رقم صحيح من غير كسور، زي `7` و `-3` و `2026`.',
          '`float` يعني رقم عشري فيه نقطة، زي `3.14` و `0.5` و `10.0`.',
          'لاحظ إن `10` نوعه int، لكن `10.0` نوعه float، حتى لو القيمة واحدة.'
        ],
        analogy: 'int زي عدد الطلاب في الفصل (مفيش نص طالب!)، وfloat زي درجة الحرارة 37.5 أو طولك 1.65 متر.',
        example: {
          code: 'students = 30\ntemperature = 37.5\nprint(students)\nprint(temperature)\nprint(type(students))\nprint(type(temperature))\n',
          lines: [
            ['students = 30', 'رقم صحيح: int.'],
            ['temperature = 37.5', 'رقم عشري: float.'],
            ['type(students)', 'الدالة type() بتقولك نوع القيمة: <class \'int\'>']
          ],
          tip: 'جرّب print(type(10.0)) و print(type(10)).'
        }
      },
      {
        id: 's2', title: 'النصوص str والقيم المنطقية bool',
        text: [
          '`str` هو النص اللي بين علامات تنصيص، حتى لو جواه أرقام: `"123"` نوعه str.',
          '`bool` نوع ليه قيمتين بس: `True` (صح) و `False` (غلط) — بحرف أول كبير. هنستخدمه كتير جدًا في الشروط.'
        ],
        analogy: 'bool زي مفتاح النور: يا منوّر (True) يا مطفي (False)، مفيش حاجة في النص.',
        example: {
          code: 'code = "123"\nis_online = True\nprint(type(code))\nprint(type(is_online))\n',
          lines: [
            ['code = "123"', 'شكله رقم، بس علامات التنصيص خلته نص str.'],
            ['is_online = True', 'قيمة منطقية bool. لاحظ True بحرف T كبير.']
          ],
          tip: 'جرّب تكتب true بحرف صغير وشوف الخطأ.'
        }
      },
      {
        id: 's3', title: 'التحويل بين الأنواع',
        text: [
          '`int("25")` بتحوّل النص "25" لرقم صحيح 25 تقدر تحسب بيه.',
          '`float("2.5")` بتحوّل لنص لرقم عشري، و`str(25)` بتحوّل الرقم لنص.',
          'التحويل لازم يكون منطقي: `int("abc")` هيطلع خطأ `ValueError` لأن abc مش رقم أصلًا.'
        ],
        analogy: 'التحويل زي ما تحوّل الفلوس من دولار لجنيه: نفس القيمة بس في شكل تاني ينفع تستخدمه هنا.',
        example: {
          code: 'text = "25"\nnumber = int(text)\nprint(number + 5)\nprice = float("2.5")\nprint(price * 2)\n',
          lines: [
            ['number = int(text)', 'النص "25" بقى رقم 25.'],
            ['print(number + 5)', 'دلوقتي ينفع نحسب: 30.'],
            ['float("2.5")', 'نص اتحوّل لرقم عشري 2.5، ولما نضربه في 2 يطلع 5.0.']
          ],
          tip: 'جرّب print(text + 5) وشوف ليه لازم نحوّل الأول.'
        }
      },
      {
        id: 's4', title: 'حل مشكلة "Age: " + 15',
        text: [
          'فاكر الخطأ اللي شفناه في المستوى التاني لما دمجنا نص مع رقم؟ الحل إننا نحوّل الرقم لنص بـ `str()` الأول.',
          '`"Age: " + str(15)` كده الاتنين نصوص، والدمج يشتغل تمام.'
        ],
        analogy: 'زي ما تكون عايز تلصق صورة في ألبوم ورق: لازم تطبعها على ورق الأول، مينفعش تلصق الموبايل نفسه!',
        example: {
          code: 'age = 15\nmessage = "Age: " + str(age)\nprint(message)\n',
          lines: [
            ['str(age)', 'حوّلنا 15 لنص "15".'],
            ['"Age: " + str(age)', 'دمج نصين: "Age: 15"']
          ],
          tip: 'شيل str() وشغّل عشان تشوف الخطأ وشرحه.'
        }
      }
    ],
    exercises: [
      {
        id: 'l4-e1', tier: 'veryEasy', title: 'نوع الرقم',
        prompt: 'اطبع نوع الرقم `10` باستخدام `type()`.\nالنتيجة المتوقعة:\n`<class \'int\'>`',
        starter: '',
        hints: ['print(type(10))'],
        tests: [{ exact: "<class 'int'>" }],
        src: [{ re: /type\s*\(/, msg: 'استخدم الدالة type().' }],
        solution: 'print(type(10))\n'
      },
      {
        id: 'l4-e2', tier: 'easy', title: 'تلات أنواع',
        prompt: 'اطبع نوع كل قيمة من دول في سطر لوحده بالترتيب: `3.14` ثم `"hi"` ثم `True`.',
        starter: '',
        hints: ['3 أوامر print وكل واحد جواه type().'],
        tests: [{ exact: "<class 'float'>\n<class 'str'>\n<class 'bool'>" }],
        src: [{ re: /type[\s\S]*type[\s\S]*type/, msg: 'استخدم type() 3 مرات.' }],
        solution: 'print(type(3.14))\nprint(type("hi"))\nprint(type(True))\n'
      },
      {
        id: 'l4-e3', tier: 'medium', title: 'من نص لرقم',
        prompt: 'عندك `x = "5"` (نص).\nاعمل متغير `y` يساوي x بعد تحويله لرقم صحيح + 10، واطبع y.\nالمتوقع: `15` — ولازم y يكون رقم (int) مش نص.',
        starter: 'x = "5"\n',
        hints: ['y = int(x) + 10'],
        tests: [{ exact: '15', vars: { y: '15', x: "'5'" } }],
        src: [{ re: /int\s*\(\s*x\s*\)/, msg: 'حوّل x بـ int(x).' }],
        solution: 'x = "5"\ny = int(x) + 10\nprint(y)\n'
      },
      {
        id: 'l4-e4', tier: 'challenge', title: 'عشري ونص',
        prompt: 'عندك `a = "3.5"` و `b = 42`.\nاطبع في السطر الأول ناتج a بعد تحويله لـ float مضروب في 2.\nوفي السطر التاني اطبع نص مدموج بعلامة + كده:\n`Value: 42`',
        starter: 'a = "3.5"\nb = 42\n',
        hints: ['print(float(a) * 2) هتطبع 7.0', 'print("Value: " + str(b))'],
        tests: [{ exact: '7.0\nValue: 42' }],
        src: [
          { re: /float\s*\(\s*a\s*\)/, msg: 'حوّل a بـ float(a).' },
          { re: /\+\s*str\s*\(\s*b\s*\)/, msg: 'ادمج النص مع str(b) بعلامة +.' }
        ],
        solution: 'a = "3.5"\nb = 42\nprint(float(a) * 2)\nprint("Value: " + str(b))\n'
      }
    ],
    final: {
      id: 'l4-final', title: 'التحدي النهائي: السنة الجاية',
      prompt: 'عندك العمر كنص: `age_text = "15"`.\nاعمل متغير `age` فيه العمر كرقم صحيح، ومتغير `next_age` فيه age + 1.\nاطبع بالدمج (+) وليس الفاصلة:\n`Next year: 16`',
      starter: 'age_text = "15"\n',
      hints: ['age = int(age_text)', 'next_age = age + 1', 'print("Next year: " + str(next_age))'],
      tests: [{ exact: 'Next year: 16', vars: { age: '15', next_age: '16' } }],
      src: [
        { re: /int\s*\(\s*age_text\s*\)/, msg: 'حوّل age_text بـ int().' },
        { re: /\+\s*str\s*\(/, msg: 'استخدم الدمج بـ + مع str().' }
      ],
      solution: 'age_text = "15"\nage = int(age_text)\nnext_age = age + 1\nprint("Next year: " + str(next_age))\n'
    },
    quiz: [
      { q: 'إيه نوع القيمة 7.0 ؟', options: ['int', 'float', 'str', 'bool'], answer: 1, why: 'فيها نقطة عشرية، يبقى float.' },
      { q: 'إيه نوع القيمة "42" ؟', options: ['int', 'float', 'str', 'bool'], answer: 2, why: 'بين علامات تنصيص، يبقى نص.' },
      { q: 'إيه ناتج الكود ده؟', code: 'print(int("8") + 2)', options: ['82', '10', '"10"', 'خطأ'], answer: 1, why: 'حوّلنا "8" لرقم 8 وجمعنا 2.' },
      { q: 'أنهي سطر هيطلع خطأ ValueError؟', options: ['int("12")', 'float("1.5")', 'int("abc")', 'str(5)'], answer: 2, why: 'abc مش رقم فمش ممكن يتحوّل لـ int.' },
      { q: 'إزاي نطبع "Score: 90" بالدمج لو score = 90 ؟', options: ['"Score: " + score', '"Score: " + str(score)', 'str("Score: ") + score', '"Score: " + int(score)'], answer: 1, why: 'لازم نحوّل الرقم لنص قبل الدمج.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
