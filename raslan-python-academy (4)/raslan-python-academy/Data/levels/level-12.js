/* RASLAN PYTHON ACADEMY — المستوى 12: القوائم Lists */
(function (L) {
  'use strict';
  L[12] = {
    n: 12,
    bot: {
      hello: 'لحد دلوقتي كل متغير شايل قيمة واحدة. النهارده هنعرف القائمة: متغير واحد شايل قيم كتير 📋',
      done: 'جامد! القوائم من أكتر حاجات بتتستخدم في Python، وإنت دلوقتي بتضيف وتحذف وتلف عليها بسهولة 💪'
    },
    goals: [
      'تعمل قائمة وتوصل لعناصرها بالفهرس (يبدأ من 0).',
      'تضيف وتحذف وتعدّل العناصر بـ append و insert و remove و pop.',
      'تلف على القائمة بـ for وتستخدم len و sum و min و max و sorted.',
      'تسأل هل عنصر موجود بـ in، وتاخد جزء من القائمة.'
    ],
    sections: [
      {
        id: 's1', title: 'إنشاء قائمة والوصول لعناصرها',
        text: [
          'القائمة بتتكتب بين قوسين مربعين `[ ]` والعناصر بينها فواصل: `fruits = ["apple", "banana", "cherry"]`.',
          'كل عنصر ليه رقم اسمه فهرس (index)، وأول عنصر رقمه **0** مش 1: `fruits[0]` هو "apple".',
          'الفهرس السالب بيعدّ من الآخر: `fruits[-1]` آخر عنصر. و`len(fruits)` بتدّيك عدد العناصر.'
        ],
        analogy: 'القائمة زي قطر فيه عربيات مترقمة، وأول عربية رقمها 0. عايز عربية معينة؟ قول رقمها.',
        example: {
          code: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits)\nprint(fruits[0])\nprint(fruits[-1])\nprint("Count:", len(fruits))\n',
          lines: [
            ['fruits[0]', 'أول عنصر: apple'],
            ['fruits[-1]', 'آخر عنصر: cherry'],
            ['len(fruits)', 'عدد العناصر: 3']
          ],
          tip: 'جرّب fruits[3] وشوف خطأ IndexError وشرحه.'
        }
      },
      {
        id: 's2', title: 'تعديل القائمة: append و insert و remove و pop',
        text: [
          '`append(x)` بتضيف عنصر في الآخر. `insert(i, x)` بتضيفه في مكان معين.',
          '`remove(x)` بتحذف أول عنصر قيمته x. و`pop()` بتشيل آخر عنصر وترجّعه.',
          'وتقدر تغيّر عنصر مباشرة: `fruits[1] = "mango"`.'
        ],
        analogy: 'زي قائمة المشتريات على التلاجة: تكتب حاجة جديدة في الآخر، أو تشطب حاجة اشتريتها.',
        example: {
          code: 'items = ["milk", "bread"]\nitems.append("eggs")\nitems.insert(0, "water")\nprint(items)\n\nitems.remove("bread")\nlast = items.pop()\nprint("Removed:", last)\nitems[0] = "juice"\nprint(items)\n',
          lines: [
            ['items.append("eggs")', 'تضيف eggs في الآخر.'],
            ['items.insert(0, "water")', 'تحط water في أول القائمة.'],
            ['items.pop()', 'تشيل آخر عنصر (eggs) وترجّعه.'],
            ['items[0] = "juice"', 'تغيّر أول عنصر.']
          ],
          tip: 'جرّب items.remove("cheese") وشوف رسالة الخطأ.'
        }
      },
      {
        id: 's3', title: 'اللف على القائمة والدوال المفيدة',
        text: [
          '`for x in numbers:` بتلف على العناصر نفسها واحد واحد.',
          '`sum(numbers)` المجموع، `min` و `max` أصغر وأكبر قيمة، و`sorted(numbers)` نسخة مترتبة من القائمة.',
          'وتقدر تبني قائمة جديدة جوه الحلقة: تبدأ بقائمة فاضية `[]` وتعمل append للي ينطبق عليه شرط.'
        ],
        analogy: 'زي المدرس وهو بيصحح كراسات الفصل: يمسك كراسة كراسة، ويكتب أسماء الناجحين في ورقة جديدة.',
        example: {
          code: 'scores = [70, 45, 90, 60]\nprint("Sum:", sum(scores))\nprint("Max:", max(scores), "Min:", min(scores))\nprint("Sorted:", sorted(scores))\n\npassed = []\nfor s in scores:\n    if s >= 60:\n        passed.append(s)\nprint("Passed:", passed)\n',
          lines: [
            ['sum / max / min', 'دوال جاهزة على القائمة.'],
            ['passed = []', 'قائمة فاضية هنملاها.'],
            ['passed.append(s)', 'نضيف بس الدرجات الناجحة.']
          ],
          tip: 'اعمل قائمة للراسبين كمان.'
        }
      },
      {
        id: 's4', title: 'in والتقطيع (Slicing)',
        text: [
          '`"apple" in fruits` بتسأل: هل العنصر موجود؟ وبترجّع True أو False.',
          '`numbers[1:3]` بتاخد جزء من القائمة: من فهرس 1 لحد قبل 3.',
          '`numbers[:2]` أول عنصرين، و`numbers[2:]` من التالت للآخر.'
        ],
        analogy: 'التقطيع زي ما تاخد شريحة من الكيكة: من هنا لحد هنا.',
        example: {
          code: 'nums = [10, 20, 30, 40, 50]\nprint(30 in nums)\nprint(99 in nums)\nprint(nums[1:3])\nprint(nums[:2])\nprint(nums[3:])\n',
          lines: [
            ['30 in nums', 'True'],
            ['nums[1:3]', '[20, 30]'],
            ['nums[3:]', '[40, 50]']
          ],
          tip: 'جرّب nums[::-1] واكتشف بتعمل إيه.'
        }
      }
    ],
    exercises: [
      {
        id: 'l12-e1', tier: 'veryEasy', title: 'الأول والأخير',
        prompt: 'عندك `fruits = ["apple", "banana", "cherry"]`.\nاطبع أول عنصر في سطر، وآخر عنصر في السطر اللي بعده، باستخدام الفهرس.\n(هنجرب كودك بقائمة تانية كمان.)',
        starter: 'fruits = ["apple", "banana", "cherry"]\n',
        hints: ['print(fruits[0])', 'آخر عنصر: fruits[-1]'],
        tests: [
          { exact: 'apple\ncherry' },
          { exact: 'kiwi\nmango', replace: [/\bfruits\s*=\s*\[[^\]]*\]/, 'fruits = ["kiwi", "lemon", "fig", "mango"]'], hidden: true }
        ],
        src: [{ re: /fruits\s*\[\s*0\s*\]/, msg: 'استخدم fruits[0].' }],
        solution: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])\nprint(fruits[-1])\n'
      },
      {
        id: 'l12-e2', tier: 'easy', title: 'إضافة عنصر',
        prompt: 'عندك `nums = [3, 8, 1]`.\nضيف الرقم 10 في آخر القائمة بـ append، ثم اطبع القائمة، ثم اطبع عدد عناصرها.\nالمتوقع:\n`[3, 8, 1, 10]`\n`4`',
        starter: 'nums = [3, 8, 1]\n',
        hints: ['nums.append(10)', 'print(len(nums))'],
        tests: [{ exact: '[3, 8, 1, 10]\n4', vars: { nums: '[3, 8, 1, 10]' } }],
        src: [{ re: /\.append\s*\(/, msg: 'استخدم append.' }, { re: /\blen\s*\(/, msg: 'استخدم len().' }],
        solution: 'nums = [3, 8, 1]\nnums.append(10)\nprint(nums)\nprint(len(nums))\n'
      },
      {
        id: 'l12-e3', tier: 'medium', title: '4 أرقام في قائمة',
        prompt: 'اقرأ 4 أرقام من المستخدم (حلقة فيها input)، وخزّنهم في قائمة اسمها `numbers`.\nاطبع المجموع في سطر وأكبر رقم في السطر اللي بعده.\nمثال: 4، 9، 1، 6 ←\n`20`\n`9`',
        starter: 'numbers = []\n',
        hints: ['for i in range(4):', 'numbers.append(int(input("Number: ")))', 'print(sum(numbers)) ثم print(max(numbers))'],
        tests: [
          { inputs: ['4', '9', '1', '6'], exact: '20\n9', vars: { numbers: '[4, 9, 1, 6]' } },
          { inputs: ['-1', '-5', '0', '2'], exact: '-4\n2', vars: { numbers: '[-1, -5, 0, 2]' }, hidden: true }
        ],
        src: [{ re: /\.append\s*\(/, msg: 'خزّن الأرقام في القائمة بـ append.' }],
        solution: 'numbers = []\nfor i in range(4):\n    numbers.append(int(input("Number: ")))\nprint(sum(numbers))\nprint(max(numbers))\n'
      },
      {
        id: 'l12-e4', tier: 'challenge', title: 'الناجحين',
        prompt: 'عندك `scores = [55, 90, 72, 40, 88]`.\nاعمل قائمة جديدة اسمها `passed` فيها الدرجات اللي 60 أو أكتر بنفس ترتيبها (باستخدام حلقة).\nاطبع عددهم ثم القائمة:\n`3`\n`[90, 72, 88]`',
        starter: 'scores = [55, 90, 72, 40, 88]\n',
        hints: ['passed = []', 'for s in scores: if s >= 60: passed.append(s)', 'print(len(passed)) ثم print(passed)'],
        tests: [
          { exact: '3\n[90, 72, 88]', vars: { passed: '[90, 72, 88]' } },
          { exact: '2\n[100, 60]', vars: { passed: '[100, 60]' }, replace: [/\bscores\s*=\s*\[[^\]]*\]/, 'scores = [100, 59, 60]'], hidden: true },
          { exact: '0\n[]', vars: { passed: '[]' }, replace: [/\bscores\s*=\s*\[[^\]]*\]/, 'scores = [1, 2]'], hidden: true }
        ],
        src: [{ re: /\bfor\b/, msg: 'استخدم حلقة for.' }],
        solution: 'scores = [55, 90, 72, 40, 88]\npassed = []\nfor s in scores:\n    if s >= 60:\n        passed.append(s)\nprint(len(passed))\nprint(passed)\n'
      }
    ],
    final: {
      id: 'l12-final', title: 'التحدي النهائي: قائمة المشتريات',
      prompt: 'اقرأ أسماء منتجات من المستخدم لحد ما يكتب `done`، وخزّنها في قائمة.\nبعدها اطبع `Items: <العدد>` ثم كل منتج مترقّم من 1:\n`Items: 2`\n`1. milk`\n`2. bread`\n(لو مفيش منتجات، اطبع `Items: 0` بس.)',
      starter: 'items = []\n',
      hints: ['while True: ثم name = input("Item: ")', 'if name == "done": break', 'للترقيم: for i in range(len(items)): print(str(i + 1) + ". " + items[i])'],
      tests: [
        { inputs: ['milk', 'bread', 'done'], exact: 'Items: 2\n1. milk\n2. bread' },
        { inputs: ['done'], exact: 'Items: 0' },
        { inputs: ['eggs', 'rice', 'tea', 'done'], exact: 'Items: 3\n1. eggs\n2. rice\n3. tea', hidden: true }
      ],
      src: [{ re: /\.append\s*\(/, msg: 'خزّن المنتجات في القائمة بـ append.' }],
      solution: 'items = []\nwhile True:\n    name = input("Item: ")\n    if name == "done":\n        break\n    items.append(name)\nprint("Items:", len(items))\nfor i in range(len(items)):\n    print(str(i + 1) + ". " + items[i])\n'
    },
    quiz: [
      { q: 'لو a = [5, 8, 2]، إيه قيمة a[1] ؟', options: ['5', '8', '2', 'خطأ'], answer: 1, why: 'الفهرس بيبدأ من صفر، فـ a[1] هو العنصر التاني.' },
      { q: 'إيه اللي بيعمله a.append(4) ؟', options: ['يضيف 4 في الأول', 'يضيف 4 في الآخر', 'يحذف 4', 'يغيّر أول عنصر لـ 4'], answer: 1, why: 'append بتضيف في آخر القائمة.' },
      { q: 'لو a = [1, 2, 3]، إيه ناتج a[-1] ؟', options: ['1', '3', '-1', 'خطأ'], answer: 1, why: 'الفهرس السالب بيبدأ من الآخر.' },
      { q: 'إيه ناتج الكود ده؟', code: 'a = [10, 20, 30, 40]\nprint(a[1:3])', options: ['[10, 20]', '[20, 30]', '[20, 30, 40]', '[10, 20, 30]'], answer: 1, why: 'من فهرس 1 لحد قبل 3.' },
      { q: 'إيه ناتج print(4 in [1, 2, 3]) ؟', options: ['True', 'False', '4', 'خطأ'], answer: 1, why: '4 مش موجودة في القائمة.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
