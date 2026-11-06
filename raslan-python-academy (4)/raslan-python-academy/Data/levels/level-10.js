/* RASLAN PYTHON ACADEMY — المستوى 10: التكرار for */
(function (L) {
  'use strict';
  L[10] = {
    n: 10,
    bot: {
      hello: 'تخيّل تطبع الأرقام من 1 لـ 1000 بإيدك! 😅 النهارده هنخلي الكمبيوتر يكرر الشغل بدالنا بـ for.',
      done: 'رهيب! الحلقات من أقوى أدوات البرمجة، ودلوقتي بقت في إيدك 🔁'
    },
    goals: [
      'تكتب حلقة for تكرر كود عدد مرات محدد.',
      'تستخدم range() بأشكالها: range(n) و range(start, stop) و range(start, stop, step).',
      'تجمع وتعدّ داخل الحلقة باستخدام متغير تراكمي.',
      'تكرر على حروف النص.'
    ],
    sections: [
      {
        id: 's1', title: 'for و range()',
        text: [
          '`for i in range(5):` معناها: كرر الكود اللي تحت 5 مرات، وفي كل مرة المتغير `i` ياخد رقم جديد.',
          '`range(5)` بتدّي الأرقام 0, 1, 2, 3, 4 — بتبدأ من صفر وبتقف **قبل** 5.',
          'الكود اللي هيتكرر بيتكتب مزاح تحت سطر for اللي بينتهي بـ `:`.'
        ],
        analogy: 'زي المدرّس لما يقول "كل واحد في الصف يقف ويقول اسمه": نفس الأمر بيتكرر لكل طالب بالدور.',
        example: {
          code: 'for i in range(5):\n    print("Round", i)\nprint("Done!")\n',
          lines: [
            ['for i in range(5):', 'i هتاخد 0 ثم 1 ثم 2 ثم 3 ثم 4.'],
            ['    print("Round", i)', 'بيتكرر 5 مرات.'],
            ['print("Done!")', 'مش مزاح، فبيتنفذ مرة واحدة بعد الحلقة.']
          ],
          tip: 'غيّر 5 لـ 3 وشوف الفرق.'
        }
      },
      {
        id: 's2', title: 'range(start, stop, step)',
        text: [
          '`range(1, 6)` بتبدأ من 1 وتقف قبل 6: يعني 1, 2, 3, 4, 5.',
          '`range(0, 20, 5)` الرقم التالت هو الخطوة: 0, 5, 10, 15.',
          'وتقدر تعد تنازلي بخطوة سالبة: `range(5, 0, -1)` تدّي 5, 4, 3, 2, 1.'
        ],
        analogy: 'range زي السلّم: بتحدد بتبدأ من أنهي درجة، وتقف عند أنهي درجة، وبتطلع كام درجة في الخطوة.',
        example: {
          code: 'for n in range(1, 6):\n    print(n)\n\nfor n in range(0, 20, 5):\n    print("step", n)\n\nfor n in range(3, 0, -1):\n    print("countdown", n)\n',
          lines: [
            ['range(1, 6)', 'من 1 لحد 5.'],
            ['range(0, 20, 5)', 'كل 5: 0, 5, 10, 15.'],
            ['range(3, 0, -1)', 'تنازلي: 3, 2, 1.']
          ],
          tip: 'اطبع الأرقام الزوجية من 2 لـ 10 بـ range(2, 11, 2).'
        }
      },
      {
        id: 's3', title: 'المتغير التراكمي: الجمع والعد',
        text: [
          'عشان تجمع أرقام بحلقة، اعمل متغير قبل الحلقة يبدأ بصفر: `total = 0`.',
          'وجوه الحلقة زوّد عليه: `total = total + i` (أو الاختصار `total += i`).',
          'بعد ما الحلقة تخلص، اطبع النتيجة **برّه** الحلقة (من غير إزاحة)، وإلا هتتطبع كل مرة.'
        ],
        analogy: 'زي الحصّالة: بتبدأ فاضية (صفر)، وكل يوم تحط فيها جنيه، وفي آخر الشهر تعدّ اللي فيها.',
        example: {
          code: 'total = 0\nfor i in range(1, 11):\n    total += i\nprint("Sum 1..10 =", total)\n\ncount = 0\nfor i in range(1, 21):\n    if i % 3 == 0:\n        count += 1\nprint("Multiples of 3:", count)\n',
          lines: [
            ['total = 0', 'الحصّالة فاضية في الأول.'],
            ['total += i', 'نفس معنى total = total + i.'],
            ['if i % 3 == 0:', 'شرط جوه الحلقة: نعدّ بس مضاعفات 3.']
          ],
          tip: 'حرّك print الأولى جوه الحلقة (زيح لها 4 مسافات) وشوف الفرق.'
        }
      },
      {
        id: 's4', title: 'التكرار على النص',
        text: [
          'for مش للأرقام بس. تقدر تلف على حروف نص: `for ch in "Python":` وكل لفة `ch` بتبقى حرف.',
          'ده مفيد في عد حروف معينة أو فحص كلمة.'
        ],
        analogy: 'زي ما تقرا كلمة حرف حرف بصباعك.',
        example: {
          code: 'word = "banana"\ncount = 0\nfor ch in word:\n    if ch == "a":\n        count += 1\nprint("Letter a appears", count, "times")\n',
          lines: [
            ['for ch in word:', 'ch بتاخد b ثم a ثم n …'],
            ['if ch == "a":', 'لو الحرف a نعدّه.']
          ],
          tip: 'خلي البرنامج يعد حرف n بدل a.'
        }
      }
    ],
    exercises: [
      {
        id: 'l10-e1', tier: 'veryEasy', title: 'من 1 لـ 5',
        prompt: 'استخدم for و range عشان تطبع الأرقام من 1 لحد 5، كل رقم في سطر.',
        starter: '',
        hints: ['for i in range(1, 6):'],
        tests: [{ exact: '1\n2\n3\n4\n5' }],
        src: [{ re: /\bfor\b[^\n]*\brange\s*\(/, msg: 'استخدم for مع range().' }],
        solution: 'for i in range(1, 6):\n    print(i)\n'
      },
      {
        id: 'l10-e2', tier: 'easy', title: 'مجموع من 1 لـ n',
        prompt: 'اسأل عن رقم n واطبع مجموع الأرقام من 1 لحد n باستخدام حلقة for.\nمثال: 5 ← `15`',
        starter: '',
        hints: ['total = 0 قبل الحلقة.', 'for i in range(1, n + 1):', 'اطبع total بعد الحلقة.'],
        tests: [{ inputs: ['5'], exact: '15' }, { inputs: ['10'], exact: '55' }, { inputs: ['1'], exact: '1', hidden: true }, { inputs: ['100'], exact: '5050', hidden: true }],
        src: [{ re: /\bfor\b/, msg: 'استخدم حلقة for.' }],
        forbid: [{ re: /\bsum\s*\(/, msg: 'اجمع بنفسك جوه الحلقة بدل sum().' }],
        solution: 'n = int(input("n: "))\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)\n'
      },
      {
        id: 'l10-e3', tier: 'medium', title: 'جدول الضرب',
        prompt: 'اسأل عن رقم n واطبع جدول ضربه من 1 لـ 10 بالشكل ده:\n`3 x 1 = 3`\n`3 x 2 = 6`\n… لحد `3 x 10 = 30`',
        starter: '',
        hints: ['for i in range(1, 11):', 'print(n, "x", i, "=", n * i)'],
        tests: [
          { inputs: ['3'], exact: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30' },
          { inputs: ['7'], exact: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70', hidden: true }
        ],
        src: [{ re: /\bfor\b/, msg: 'استخدم حلقة for.' }],
        solution: 'n = int(input("n: "))\nfor i in range(1, 11):\n    print(n, "x", i, "=", n * i)\n'
      },
      {
        id: 'l10-e4', tier: 'challenge', title: 'عدّ الحروف المتحركة',
        prompt: 'اسأل عن كلمة إنجليزي بحروف صغيرة، واطبع عدد الحروف المتحركة فيها (a e i o u).\nمثال: `education` ← `5`',
        starter: '',
        hints: ['count = 0 ثم for ch in word:', 'if ch in "aeiou":  (in بتسأل هل الحرف موجود في النص)'],
        tests: [{ inputs: ['python'], exact: '1' }, { inputs: ['education'], exact: '5' }, { inputs: ['sky'], exact: '0', hidden: true }, { inputs: ['aeiou'], exact: '5', hidden: true }],
        src: [{ re: /\bfor\b/, msg: 'استخدم حلقة for على حروف الكلمة.' }],
        solution: 'word = input("Word: ")\ncount = 0\nfor ch in word:\n    if ch in "aeiou":\n        count += 1\nprint(count)\n'
      }
    ],
    final: {
      id: 'l10-final', title: 'التحدي النهائي: مثلث النجوم',
      prompt: 'اسأل عن رقم n واطبع مثلث نجوم من n سطور، وبعده سطر فيه إجمالي النجوم.\nمثال: 3 ←\n`*`\n`**`\n`***`\n`Total stars: 6`',
      starter: '',
      hints: ['"*" * 3 بتدّي "***".', 'for i in range(1, n + 1): print("*" * i)', 'اجمع i في متغير total.'],
      tests: [
        { inputs: ['3'], exact: '*\n**\n***\nTotal stars: 6' },
        { inputs: ['1'], exact: '*\nTotal stars: 1' },
        { inputs: ['5'], exact: '*\n**\n***\n****\n*****\nTotal stars: 15', hidden: true }
      ],
      src: [{ re: /\bfor\b/, msg: 'استخدم حلقة for.' }],
      solution: 'n = int(input("n: "))\ntotal = 0\nfor i in range(1, n + 1):\n    print("*" * i)\n    total += i\nprint("Total stars:", total)\n'
    },
    quiz: [
      { q: 'إيه الأرقام اللي بتطلعها range(4) ؟', options: ['1, 2, 3, 4', '0, 1, 2, 3', '0, 1, 2, 3, 4', '4'], answer: 1, why: 'بتبدأ من صفر وتقف قبل 4.' },
      { q: 'إيه الأرقام اللي بتطلعها range(2, 10, 3) ؟', options: ['2, 5, 8', '2, 5, 8, 11', '3, 6, 9', '2, 3, 4'], answer: 0, why: 'تبدأ من 2 وتزود 3 لحد ما توصل قبل 10.' },
      { q: 'كام مرة هيتطبع Hi ؟', code: 'for i in range(1, 4):\n    print("Hi")', options: ['1', '3', '4', '0'], answer: 1, why: 'i هتاخد 1 و 2 و 3.' },
      { q: 'إيه ناتج الكود ده؟', code: 't = 0\nfor i in range(4):\n    t += i\nprint(t)', options: ['4', '6', '10', '0'], answer: 1, why: '0 + 1 + 2 + 3 = 6.' },
      { q: 'إيه ناتج الكود ده؟', code: 'for ch in "abc":\n    print(ch, end="")', options: ['abc', 'a b c', 'cba', 'خطأ'], answer: 0, why: 'بنلف على الحروف بالترتيب، و end="" بتخلي الطباعة في نفس السطر.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
