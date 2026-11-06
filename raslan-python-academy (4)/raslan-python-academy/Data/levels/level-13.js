/* RASLAN PYTHON ACADEMY — المستوى 13: Tuples و Sets */
(function (L) {
  'use strict';
  L[13] = {
    n: 13,
    bot: {
      hello: 'عندنا نوعين مجموعات تانيين: الـ Tuple اللي مبيتغيرش، والـ Set اللي مبيقبلش تكرار. يلا نتعرف عليهم 🧩',
      done: 'برافو! بقيت تعرف تختار المجموعة المناسبة لكل موقف: List ولا Tuple ولا Set 👌'
    },
    goals: [
      'تعمل Tuple وتفهم إنه مبيتغيرش بعد ما يتعمل.',
      'تفك الـ Tuple في متغيرات (Unpacking).',
      'تستخدم Set عشان تشيل التكرار وتسأل عن الوجود بسرعة.',
      'تستخدم عمليات المجموعات: التقاطع & والاتحاد | والفرق -.'
    ],
    sections: [
      {
        id: 's1', title: 'الـ Tuple: قائمة مقفولة',
        text: [
          'الـ Tuple بيتكتب بين قوسين عاديين `( )`: `point = (3, 7)`.',
          'تقدر تقرا عناصره بالفهرس زي القائمة `point[0]`، لكن **مينفعش** تغيّرها أو تضيف عليها. لو حاولت `point[0] = 5` هيطلع `TypeError`.',
          'بنستخدمه للبيانات اللي مش المفروض تتغير، زي الإحداثيات أو تاريخ الميلاد.'
        ],
        analogy: 'الـ Tuple زي شهادة الميلاد: البيانات مكتوبة ومختومة ومحدش يقدر يعدّل فيها.',
        example: {
          code: 'point = (3, 7)\nprint(point)\nprint("x =", point[0])\nprint("Length:", len(point))\n\nbirthday = (2010, 5, 21)\nprint("Year:", birthday[0])\n',
          lines: [
            ['point = (3, 7)', 'Tuple فيه عنصرين.'],
            ['point[0]', 'القراءة بالفهرس عادي.'],
            ['birthday[0]', 'أول عنصر: السنة.']
          ],
          tip: 'جرّب point[0] = 5 وشوف الخطأ.'
        }
      },
      {
        id: 's2', title: 'فك الـ Tuple (Unpacking)',
        text: [
          'تقدر تحط كل عنصر في متغير لوحده في سطر واحد: `x, y = point`.',
          'عدد المتغيرات على الشمال لازم يساوي عدد العناصر.',
          'وده بيخليك تبدّل قيمتين بسهولة: `a, b = b, a`.'
        ],
        analogy: 'زي ما تفتح علبة فيها قلم وأستيكة وتحط كل واحد في مكانه على المكتب مرة واحدة.',
        example: {
          code: 'point = (3, 7)\nx, y = point\nprint("x:", x, "y:", y)\n\na = 1\nb = 2\na, b = b, a\nprint(a, b)\n',
          lines: [
            ['x, y = point', 'x بقت 3 و y بقت 7.'],
            ['a, b = b, a', 'تبديل القيمتين.']
          ],
          tip: 'جرّب x, y, z = point وشوف الخطأ.'
        }
      },
      {
        id: 's3', title: 'الـ Set: من غير تكرار',
        text: [
          'الـ Set بيتكتب بين قوسين معقوفين `{ }`: `colors = {"red", "blue", "red"}` — والتكرار بيتشال تلقائيًا.',
          'الـ Set ملوش ترتيب ثابت، فمفيش فهرس. لو عايز ترتيب استخدم `sorted(my_set)`.',
          '`set(my_list)` بتحوّل قائمة لـ Set وتشيل المكرر. و`add` بتضيف، و`in` بتسأل عن الوجود بسرعة جدًا.',
          'خلي بالك: `{}` فاضية دي قاموس مش Set؛ الـ Set الفاضي بيتعمل بـ `set()`.'
        ],
        analogy: 'الـ Set زي كشف الحضور: اسم كل طالب بيتكتب مرة واحدة حتى لو قال "أفندم" مرتين!',
        example: {
          code: 'nums = [4, 2, 4, 1, 2, 9]\nunique = set(nums)\nprint(sorted(unique))\nprint("Unique count:", len(unique))\n\ntags = set()\ntags.add("python")\ntags.add("python")\nprint(len(tags), "python" in tags)\n',
          lines: [
            ['set(nums)', 'بيشيل التكرار.'],
            ['sorted(unique)', 'قائمة مترتبة من عناصر الـ Set.'],
            ['tags.add("python") مرتين', 'العنصر بيتسجل مرة واحدة.']
          ],
          tip: 'اطبع unique نفسها من غير sorted ولاحظ إن ترتيبها ممكن يختلف.'
        }
      },
      {
        id: 's4', title: 'عمليات المجموعات',
        text: [
          '`a & b` التقاطع: العناصر الموجودة في الاتنين.',
          '`a | b` الاتحاد: كل العناصر من غير تكرار.',
          '`a - b` الفرق: الموجود في a ومش موجود في b.'
        ],
        analogy: 'عندك قائمة أصحابك وقائمة أصحاب أخوك: التقاطع هما الأصحاب المشتركين، والاتحاد هما كل الناس اللي هتعزموهم.',
        example: {
          code: 'mine = {"Ali", "Sara", "Omar"}\nbrother = {"Sara", "Mona", "Omar"}\nprint("Both:", sorted(mine & brother))\nprint("All:", sorted(mine | brother))\nprint("Only mine:", sorted(mine - brother))\n',
          lines: [
            ['mine & brother', 'Omar و Sara'],
            ['mine | brother', 'الأربعة'],
            ['mine - brother', 'Ali بس']
          ],
          tip: 'جرّب brother - mine.'
        }
      }
    ],
    exercises: [
      {
        id: 'l13-e1', tier: 'veryEasy', title: 'فك النقطة',
        prompt: 'عندك `point = (3, 7)`.\nفك الـ Tuple في متغيرين `x` و `y` في سطر واحد، واطبع:\n`x = 3`\n`y = 7`',
        starter: 'point = (3, 7)\n',
        hints: ['x, y = point', 'print("x =", x)'],
        tests: [
          { exact: 'x = 3\ny = 7', vars: { x: '3', y: '7' } },
          { exact: 'x = 10\ny = -2', vars: { x: '10', y: '-2' }, replace: [/\bpoint\s*=\s*\([^)]*\)/, 'point = (10, -2)'], hidden: true }
        ],
        src: [{ re: /\bx\s*,\s*y\s*=\s*point\b/, msg: 'فك الـ Tuple بالشكل: x, y = point' }],
        solution: 'point = (3, 7)\nx, y = point\nprint("x =", x)\nprint("y =", y)\n'
      },
      {
        id: 'l13-e2', tier: 'easy', title: 'شيل التكرار',
        prompt: 'عندك `nums = [4, 2, 4, 1, 2, 9]`.\nاستخدم set عشان تشيل التكرار، واطبع القيم المترتبة ثم عددها:\n`[1, 2, 4, 9]`\n`4`',
        starter: 'nums = [4, 2, 4, 1, 2, 9]\n',
        hints: ['unique = set(nums)', 'print(sorted(unique))'],
        tests: [
          { exact: '[1, 2, 4, 9]\n4' },
          { exact: '[3, 5]\n2', replace: [/\bnums\s*=\s*\[[^\]]*\]/, 'nums = [5, 5, 3, 5]'], hidden: true }
        ],
        src: [{ re: /\bset\s*\(/, msg: 'استخدم set().' }],
        solution: 'nums = [4, 2, 4, 1, 2, 9]\nunique = set(nums)\nprint(sorted(unique))\nprint(len(unique))\n'
      },
      {
        id: 'l13-e3', tier: 'medium', title: 'الأصحاب المشتركين',
        prompt: 'عندك:\n`a = {"Ali", "Sara", "Omar"}`\n`b = {"Sara", "Mona", "Omar"}`\nاطبع التقاطع مترتب ثم الاتحاد مترتب:\n`[\'Omar\', \'Sara\']`\n`[\'Ali\', \'Mona\', \'Omar\', \'Sara\']`',
        starter: 'a = {"Ali", "Sara", "Omar"}\nb = {"Sara", "Mona", "Omar"}\n',
        hints: ['print(sorted(a & b))', 'print(sorted(a | b))'],
        tests: [
          { exact: "['Omar', 'Sara']\n['Ali', 'Mona', 'Omar', 'Sara']" },
          { exact: "['Zed']\n['Amr', 'Nour', 'Zed']", replace: [/\bb\s*=\s*\{[^}]*\}/, 'b = {"Zed", "Nour"}\na = {"Zed", "Amr"}'], hidden: true }
        ],
        src: [{ re: /&/, msg: 'استخدم & للتقاطع.' }, { re: /\|/, msg: 'استخدم | للاتحاد.' }],
        solution: 'a = {"Ali", "Sara", "Omar"}\nb = {"Sara", "Mona", "Omar"}\nprint(sorted(a & b))\nprint(sorted(a | b))\n'
      },
      {
        id: 'l13-e4', tier: 'challenge', title: 'الكلمات المختلفة',
        prompt: 'اقرأ كلمات من المستخدم (كلمة في كل input) لحد ما يكتب `end`.\nاطبع عدد الكلمات **المختلفة** ثم قائمتها مترتبة:\n`Unique: 2`\n`[\'hello\', \'hi\']`\n(مثال للمدخلات: hi، hello، hi، end)',
        starter: 'words = set()\n',
        hints: ['while True: w = input("Word: ")', 'if w == "end": break', 'words.add(w)'],
        tests: [
          { inputs: ['hi', 'hello', 'hi', 'end'], exact: "Unique: 2\n['hello', 'hi']" },
          { inputs: ['end'], exact: 'Unique: 0\n[]' },
          { inputs: ['b', 'a', 'c', 'a', 'b', 'end'], exact: "Unique: 3\n['a', 'b', 'c']", hidden: true }
        ],
        src: [{ re: /\bset\s*\(|\.add\s*\(/, msg: 'استخدم Set عشان تشيل التكرار.' }],
        solution: 'words = set()\nwhile True:\n    w = input("Word: ")\n    if w == "end":\n        break\n    words.add(w)\nprint("Unique:", len(words))\nprint(sorted(words))\n'
      }
    ],
    final: {
      id: 'l13-final', title: 'التحدي النهائي: أوائل الفصل',
      prompt: 'عندك قائمة Tuples، كل واحد فيه (الاسم، الدرجة):\n`students = [("Ali", 80), ("Sara", 95), ("Omar", 70)]`\nلف عليها بـ for مع فك الـ Tuple، واطبع كل طالب بالشكل `Ali: 80`، وفي الآخر اطبع صاحب أعلى درجة:\n`Best: Sara`',
      starter: 'students = [("Ali", 80), ("Sara", 95), ("Omar", 70)]\n',
      hints: ['for name, score in students:', 'احتفظ بأعلى درجة واسمها في متغيرين: best_name و best_score.'],
      tests: [
        { exact: 'Ali: 80\nSara: 95\nOmar: 70\nBest: Sara' },
        { exact: 'Mona: 60\nZiad: 99\nBest: Ziad', replace: [/\bstudents\s*=\s*\[[^\]]*\]/, 'students = [("Mona", 60), ("Ziad", 99)]'], hidden: true },
        { exact: 'Amr: 50\nBest: Amr', replace: [/\bstudents\s*=\s*\[[^\]]*\]/, 'students = [("Amr", 50)]'], hidden: true }
      ],
      src: [{ re: /for\s+\w+\s*,\s*\w+\s+in\b/, msg: 'لف بـ for مع فك الـ Tuple: for name, score in students:' }],
      solution: 'students = [("Ali", 80), ("Sara", 95), ("Omar", 70)]\nbest_name = ""\nbest_score = -1\nfor name, score in students:\n    print(name + ": " + str(score))\n    if score > best_score:\n        best_score = score\n        best_name = name\nprint("Best: " + best_name)\n'
    },
    quiz: [
      { q: 'إيه الفرق الأساسي بين List و Tuple؟', options: ['الـ Tuple أسرع في الطباعة', 'الـ Tuple مبيتغيرش بعد ما يتعمل', 'الـ List مبتقبلش أرقام', 'مفيش فرق'], answer: 1, why: 'الـ Tuple ثابت (immutable).' },
      { q: 'إيه ناتج len({1, 2, 2, 3, 3}) ؟', options: ['5', '3', '2', 'خطأ'], answer: 1, why: 'الـ Set بيشيل التكرار: {1, 2, 3}.' },
      { q: 'بعد x, y = (4, 9) إيه قيمة y ؟', options: ['4', '9', '(4, 9)', 'خطأ'], answer: 1, why: 'فك الـ Tuple: x = 4 و y = 9.' },
      { q: 'إيه ناتج sorted({1, 2, 3} & {2, 3, 4}) ؟', options: ['[1, 2, 3, 4]', '[2, 3]', '[1]', '[4]'], answer: 1, why: '& بتجيب المشترك.' },
      { q: 'إزاي نعمل Set فاضي؟', options: ['{}', 'set()', '[]', '()'], answer: 1, why: '{} فاضية بتعمل قاموس، فالـ Set الفاضي بـ set().' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
