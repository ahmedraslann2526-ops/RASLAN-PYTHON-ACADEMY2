/* RASLAN PYTHON ACADEMY — المستوى 14: القواميس Dictionaries */
(function (L) {
  'use strict';
  L[14] = {
    n: 14,
    bot: {
      hello: 'القاموس في Python زي دفتر التليفونات: تدوّر بالاسم وتلاقي الرقم. النهارده هنخزّن البيانات بشكل مفتاح وقيمة 📒',
      done: 'عظمة! خلّصت آخر مستوى في المرحلة المتوسطة تقريبًا، والقواميس هتفرق معاك جدًا في المشاريع الحقيقية 🏅'
    },
    goals: [
      'تعمل قاموس بأزواج مفتاح: قيمة وتقرأ القيم بالمفتاح.',
      'تضيف وتعدّل وتحذف عناصر، وتستخدم get() و in.',
      'تلف على القاموس بـ keys() و values() و items().',
      'تستخدم القاموس في العدّ (عدد مرات تكرار كل حاجة).'
    ],
    sections: [
      {
        id: 's1', title: 'المفتاح والقيمة',
        text: [
          'القاموس بيتكتب بين `{ }` وكل عنصر عبارة عن `مفتاح: قيمة`: `student = {"name": "Ali", "age": 15}`.',
          'بنقرا القيمة بالمفتاح مش بالرقم: `student["name"]` بتدّي "Ali".',
          'لو طلبت مفتاح مش موجود هيطلع `KeyError`.'
        ],
        analogy: 'زي القاموس الإنجليزي-عربي: الكلمة (المفتاح) بتوصلك لمعناها (القيمة).',
        example: {
          code: 'student = {"name": "Ali", "age": 15, "level": 3}\nprint(student)\nprint(student["name"])\nprint("Age:", student["age"])\nprint("Keys count:", len(student))\n',
          lines: [
            ['{"name": "Ali", …}', '3 أزواج مفتاح وقيمة.'],
            ['student["name"]', 'القيمة اللي مفتاحها name.'],
            ['len(student)', 'عدد الأزواج: 3.']
          ],
          tip: 'جرّب student["city"] وشوف الخطأ.'
        }
      },
      {
        id: 's2', title: 'إضافة وتعديل وحذف',
        text: [
          'لو المفتاح جديد، `d["key"] = value` بيضيفه. ولو موجود، بيغيّر قيمته.',
          '`del d["key"]` بتحذف. و`d.get("key")` بتقرا من غير خطأ: لو مش موجود بترجّع `None` أو القيمة الافتراضية اللي تحددها `d.get("key", 0)`.',
          '`"key" in d` بتسأل هل المفتاح موجود.'
        ],
        analogy: 'زي دفتر الحضور: تضيف اسم طالب جديد، تعدّل درجة، أو تشطب اسم.',
        example: {
          code: 'prices = {"bread": 5, "milk": 20}\nprices["juice"] = 12\nprices["bread"] = 6\ndel prices["milk"]\nprint(prices)\n\nprint(prices.get("rice"))\nprint(prices.get("rice", 0))\nprint("juice" in prices)\n',
          lines: [
            ['prices["juice"] = 12', 'مفتاح جديد: إضافة.'],
            ['prices["bread"] = 6', 'مفتاح موجود: تعديل.'],
            ['prices.get("rice", 0)', 'مش موجود ← 0 بدل الخطأ.']
          ],
          tip: 'استخدم get بدل [] لما مش متأكد إن المفتاح موجود.'
        }
      },
      {
        id: 's3', title: 'اللف على القاموس',
        text: [
          '`for key in d:` بتلف على المفاتيح.',
          '`d.values()` القيم بس، و`d.items()` بتدّي كل زوج كـ Tuple فتقدر تفكه: `for k, v in d.items():`.',
          'القاموس بيحافظ على ترتيب الإضافة.'
        ],
        analogy: 'زي ما تقلّب صفحات دفتر التليفونات: كل صفحة فيها اسم ورقم.',
        example: {
          code: 'scores = {"Ali": 80, "Sara": 95, "Omar": 70}\nfor name, score in scores.items():\n    print(name, "->", score)\n\nprint("Average:", sum(scores.values()) / len(scores))\n',
          lines: [
            ['scores.items()', 'كل لفة: (الاسم، الدرجة).'],
            ['sum(scores.values())', 'مجموع القيم بس.']
          ],
          tip: 'اطبع المفاتيح بس بـ for name in scores:'
        }
      },
      {
        id: 's4', title: 'العدّ بالقاموس',
        text: [
          'استخدام مشهور جدًا: نعدّ كل حاجة اتكررت كام مرة.',
          'الفكرة: لو العنصر مش موجود في القاموس نحطه بـ 1، ولو موجود نزوّد عليه 1. أو باختصار: `counts[x] = counts.get(x, 0) + 1`.'
        ],
        analogy: 'زي ما تعدّ الأصوات في انتخابات الفصل: كل ما اسم يتقال، تزود علامة قدامه.',
        example: {
          code: 'votes = ["Ali", "Sara", "Ali", "Omar", "Ali", "Sara"]\ncounts = {}\nfor name in votes:\n    counts[name] = counts.get(name, 0) + 1\nprint(counts)\nfor name, c in counts.items():\n    print(name + ":", c)\n',
          lines: [
            ['counts = {}', 'قاموس فاضي.'],
            ['counts.get(name, 0) + 1', 'لو أول مرة يبقى 0 + 1، وإلا العدد القديم + 1.']
          ],
          tip: 'عدّ الحروف في كلمة بنفس الطريقة.'
        }
      }
    ],
    exercises: [
      {
        id: 'l14-e1', tier: 'veryEasy', title: 'بيانات الطالب',
        prompt: 'عندك `student = {"name": "Ali", "age": 15}`.\nاطبع الاسم في سطر والسن في السطر اللي بعده باستخدام المفاتيح:\n`Ali`\n`15`',
        starter: 'student = {"name": "Ali", "age": 15}\n',
        hints: ['print(student["name"])'],
        tests: [
          { exact: 'Ali\n15' },
          { exact: 'Mona\n12', replace: [/\bstudent\s*=\s*\{[^}]*\}/, 'student = {"name": "Mona", "age": 12}'], hidden: true }
        ],
        src: [{ re: /student\s*\[\s*["']name["']\s*\]|student\.get\s*\(\s*["']name/, msg: 'اقرا الاسم بالمفتاح: student["name"]' }],
        solution: 'student = {"name": "Ali", "age": 15}\nprint(student["name"])\nprint(student["age"])\n'
      },
      {
        id: 'l14-e2', tier: 'easy', title: 'تحديث الأسعار',
        prompt: 'عندك `prices = {"bread": 5, "milk": 20}`.\nضيف `"juice"` بسعر 12، وغيّر سعر `"bread"` لـ 6، واطبع القاموس:\n`{\'bread\': 6, \'milk\': 20, \'juice\': 12}`',
        starter: 'prices = {"bread": 5, "milk": 20}\n',
        hints: ['prices["juice"] = 12', 'prices["bread"] = 6'],
        tests: [{ exact: "{'bread': 6, 'milk': 20, 'juice': 12}", vars: { prices: "{'bread': 6, 'milk': 20, 'juice': 12}" } }],
        src: [{ re: /prices\s*\[\s*["']juice["']\s*\]\s*=/, msg: 'ضيف juice بـ prices["juice"] = 12' }],
        solution: 'prices = {"bread": 5, "milk": 20}\nprices["juice"] = 12\nprices["bread"] = 6\nprint(prices)\n'
      },
      {
        id: 'l14-e3', tier: 'medium', title: 'دفتر التليفونات',
        prompt: 'عندك `contacts = {"Ali": "0100", "Sara": "0111", "Omar": "0122"}`.\nاسأل عن اسم واطبع رقمه، ولو الاسم مش موجود اطبع `Not found`.',
        starter: 'contacts = {"Ali": "0100", "Sara": "0111", "Omar": "0122"}\n',
        hints: ['name = input("Name: ")', 'if name in contacts: print(contacts[name]) else: print("Not found")', 'أو: print(contacts.get(name, "Not found"))'],
        tests: [{ inputs: ['Sara'], exact: '0111' }, { inputs: ['Mona'], exact: 'Not found' }, { inputs: ['Omar'], exact: '0122', hidden: true }, { inputs: ['ali'], exact: 'Not found', hidden: true }],
        src: [{ re: /\bin\s+contacts\b|contacts\.get\s*\(/, msg: 'استخدم in أو get() عشان تتأكد إن الاسم موجود.' }],
        solution: 'contacts = {"Ali": "0100", "Sara": "0111", "Omar": "0122"}\nname = input("Name: ")\nif name in contacts:\n    print(contacts[name])\nelse:\n    print("Not found")\n'
      },
      {
        id: 'l14-e4', tier: 'challenge', title: 'عدّاد الحروف',
        prompt: 'اسأل عن كلمة، وعدّ كل حرف اتكرر كام مرة باستخدام قاموس، واطبع كل حرف وعدده بترتيب أول ظهور:\n`banana` ←\n`b: 1`\n`a: 3`\n`n: 2`',
        starter: '',
        hints: ['counts = {}', 'for ch in word: counts[ch] = counts.get(ch, 0) + 1', 'for ch, c in counts.items(): print(ch + ":", c)'],
        tests: [{ inputs: ['banana'], exact: 'b: 1\na: 3\nn: 2' }, { inputs: ['aab'], exact: 'a: 2\nb: 1' }, { inputs: ['xyz'], exact: 'x: 1\ny: 1\nz: 1', hidden: true }, { inputs: ['mississippi'], exact: 'm: 1\ni: 4\ns: 4\np: 2', hidden: true }],
        src: [{ re: /\{\s*\}|\bdict\s*\(/, msg: 'استخدم قاموس للعد.' }],
        forbid: [{ re: /\.count\s*\(/, msg: 'التمرين عن القواميس، فممنوع .count(). اعمل العدّ بنفسك.' }],
        solution: 'word = input("Word: ")\ncounts = {}\nfor ch in word:\n    counts[ch] = counts.get(ch, 0) + 1\nfor ch, c in counts.items():\n    print(ch + ":", c)\n'
      }
    ],
    final: {
      id: 'l14-final', title: 'التحدي النهائي: دفتر الدرجات',
      prompt: 'اقرأ بشكل متكرر: اسم طالب، وبعده درجته (رقم صحيح)، لحد ما الاسم يبقى `done`. خزّنهم في قاموس اسمه `grades`.\nبعدها اطبع:\n`Students: <العدد>`\n`Top: <صاحب أعلى درجة>`\n`Average: <المتوسط مقرّب لرقم عشري واحد>`\nمثال: Ali، 80، Sara، 95، done ←\n`Students: 2`\n`Top: Sara`\n`Average: 87.5`\n(افترض إن في طالب واحد على الأقل.)',
      starter: 'grades = {}\n',
      hints: ['name = input("Name: ") ثم if name == "done": break', 'grades[name] = int(input("Score: "))', 'المتوسط: round(sum(grades.values()) / len(grades), 1)', 'صاحب الأعلى: لف على grades.items() واحفظ الأكبر.'],
      tests: [
        { inputs: ['Ali', '80', 'Sara', '95', 'done'], exact: 'Students: 2\nTop: Sara\nAverage: 87.5', vars: { grades: "{'Ali': 80, 'Sara': 95}" } },
        { inputs: ['Omar', '70', 'done'], exact: 'Students: 1\nTop: Omar\nAverage: 70.0', vars: { grades: "{'Omar': 70}" } },
        { inputs: ['A', '90', 'B', '60', 'C', '75', 'done'], exact: 'Students: 3\nTop: A\nAverage: 75.0', vars: { grades: "{'A': 90, 'B': 60, 'C': 75}" }, hidden: true }
      ],
      src: [{ re: /grades\s*\[[^\]]+\]\s*=/, msg: 'خزّن كل طالب في القاموس: grades[name] = score' }],
      solution: 'grades = {}\nwhile True:\n    name = input("Name: ")\n    if name == "done":\n        break\n    grades[name] = int(input("Score: "))\nprint("Students:", len(grades))\ntop = ""\nbest = -1\nfor name, score in grades.items():\n    if score > best:\n        best = score\n        top = name\nprint("Top:", top)\nprint("Average:", round(sum(grades.values()) / len(grades), 1))\n'
    },
    quiz: [
      { q: 'لو d = {"a": 1, "b": 2}، إيه قيمة d["b"] ؟', options: ['1', '2', '"b"', 'خطأ'], answer: 1, why: 'القيمة اللي مفتاحها b.' },
      { q: 'إيه اللي يحصل لو كتبنا d["c"] = 3 والمفتاح c مش موجود؟', options: ['خطأ KeyError', 'يضيف المفتاح c بقيمة 3', 'يتجاهل السطر', 'يحذف القاموس'], answer: 1, why: 'الإسناد لمفتاح جديد بيضيفه.' },
      { q: 'إيه ناتج d.get("z", 0) لو z مش موجود؟', options: ['None', '0', 'خطأ', '"z"'], answer: 1, why: 'get بترجّع القيمة الافتراضية اللي حددناها.' },
      { q: 'أنهي طريقة بتدّينا المفتاح والقيمة مع بعض في الحلقة؟', options: ['d.keys()', 'd.values()', 'd.items()', 'd.get()'], answer: 2, why: 'items() بتدّي أزواج (مفتاح، قيمة).' },
      { q: 'إيه ناتج الكود ده؟', code: 'c = {}\nfor x in "aba":\n    c[x] = c.get(x, 0) + 1\nprint(c)', options: ["{'a': 1, 'b': 1}", "{'a': 2, 'b': 1}", "{'a': 3}", 'خطأ'], answer: 1, why: 'a اتكررت مرتين و b مرة.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
