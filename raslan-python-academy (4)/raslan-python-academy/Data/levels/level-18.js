/* RASLAN PYTHON ACADEMY — المستوى 18: التعامل مع الملفات File Handling */
(function (L) {
  'use strict';
  L[18] = {
    n: 18,
    bot: {
      hello: 'لحد دلوقتي كل حاجة بتتمسح لما البرنامج يخلص. النهارده هنحفظ البيانات في ملفات ونقراها تاني 💾',
      done: 'جامد! برامجك بقت تفتكر البيانات في ملفات. ده اللي هتحتاجه بالظبط في مشروع التخرج 📁'
    },
    goals: [
      'تفتح ملف بـ open() وتعرف الفرق بين أوضاع r و w و a.',
      'تستخدم with عشان الملف يتقفل لوحده.',
      'تقرا ملف كله أو سطر بسطر وتعالج السطور (strip و split).',
      'تحفظ قائمة في ملف وتحمّلها تاني.'
    ],
    sections: [
      {
        id: 's1', title: 'الكتابة في ملف: open و w',
        text: [
          '`open("notes.txt", "w")` بتفتح ملف للكتابة. لو مش موجود بيتعمل، ولو موجود **بيتمسح محتواه** ويبدأ من جديد.',
          'بنكتب بـ `f.write("…")`. خلي بالك: write مبتحطش سطر جديد لوحدها، فلازم تكتب `"\\n"` بنفسك.',
          'أحسن طريقة هي `with open(…) as f:` لأنها بتقفل الملف لوحدها بعد ما الكود المزاح يخلص.',
          'ملاحظة: الملفات في المحرر هنا مؤقتة، بتعيش طول ما البرنامج شغال وبعدين بتتمسح.'
        ],
        analogy: 'الوضع w زي إنك تمسح السبورة وتكتب من أول وجديد.',
        example: {
          code: 'with open("notes.txt", "w") as f:\n    f.write("First line\\n")\n    f.write("Second line\\n")\n\nwith open("notes.txt", "r") as f:\n    content = f.read()\n\nprint(content)\n',
          lines: [
            ['open("notes.txt", "w")', 'فتح للكتابة.'],
            ['f.write("First line\\n")', '\\n = سطر جديد.'],
            ['f.read()', 'بتقرا الملف كله كنص واحد.']
          ],
          tip: 'شيل \\n من أول write وشوف السطرين بيلزقوا في بعض.'
        }
      },
      {
        id: 's2', title: 'القراءة سطر بسطر',
        text: [
          '`for line in f:` بتلف على سطور الملف واحد واحد.',
          'كل سطر بيكون في آخره `\\n`، فبنستخدم `line.strip()` نشيله.',
          'لو السطر فيه أرقام، حوّلها بـ `int()`. ولو فيه بيانات مفصولة بفاصلة استخدم `split(",")`.'
        ],
        analogy: 'زي ما تقرا جدول الحصص سطر سطر: كل سطر فيه يوم ومادة.',
        example: {
          code: 'with open("scores.txt", "w") as f:\n    f.write("Ali,80\\nSara,95\\nOmar,70\\n")\n\ntotal = 0\nwith open("scores.txt") as f:\n    for line in f:\n        name, score = line.strip().split(",")\n        total += int(score)\n        print(name, "->", score)\nprint("Total:", total)\n',
          lines: [
            ['for line in f:', 'سطر سطر.'],
            ['line.strip().split(",")', '"Ali,80\\n" ← ["Ali", "80"]'],
            ['int(score)', 'نحوّل النص لرقم عشان نجمع.']
          ],
          tip: 'open من غير "r" معناها قراءة برضه (ده الافتراضي).'
        }
      },
      {
        id: 's3', title: 'الإضافة بـ a وقراءة السطور كقائمة',
        text: [
          'الوضع `"a"` (append) بيضيف في آخر الملف من غير ما يمسح القديم.',
          '`f.readlines()` بترجّع قائمة كل عنصر فيها سطر.',
          'لو حاولت تقرا ملف مش موجود هيطلع `FileNotFoundError` (هنتعلم نمسكه في المستوى الجاي).'
        ],
        analogy: 'a زي دفتر اليوميات: كل يوم بتكتب صفحة جديدة في الآخر ومبتقطعش القديم.',
        example: {
          code: 'with open("log.txt", "w") as f:\n    f.write("Day 1\\n")\n\nwith open("log.txt", "a") as f:\n    f.write("Day 2\\n")\n    f.write("Day 3\\n")\n\nwith open("log.txt") as f:\n    lines = f.readlines()\n\nprint(lines)\nprint("Days:", len(lines))\n',
          lines: [
            ['open("log.txt", "a")', 'إضافة في الآخر.'],
            ['f.readlines()', "['Day 1\\n', 'Day 2\\n', 'Day 3\\n']"]
          ],
          tip: 'غيّر "a" لـ "w" ولاحظ إن Day 1 هتختفي.'
        }
      },
      {
        id: 's4', title: 'دوال للحفظ والتحميل',
        text: [
          'الأحسن نحط شغل الملفات جوه دوال: دالة تحفظ قائمة، ودالة تحمّلها.',
          'ده بالظبط اللي هتعمله في مشروع التخرج عشان مهامك تتحفظ.'
        ],
        analogy: 'زي زرار "حفظ" و"فتح" في أي برنامج.',
        example: {
          code: 'def save_list(items, filename):\n    with open(filename, "w") as f:\n        for item in items:\n            f.write(item + "\\n")\n\ndef load_list(filename):\n    result = []\n    with open(filename) as f:\n        for line in f:\n            result.append(line.strip())\n    return result\n\nsave_list(["milk", "bread", "eggs"], "shop.txt")\nprint(load_list("shop.txt"))\n',
          lines: [
            ['save_list', 'كل عنصر في سطر.'],
            ['load_list', 'بنقرا السطور ونشيل \\n ونرجّع قائمة.']
          ],
          tip: 'ضيف عنصر للقائمة وشغّل تاني.'
        }
      }
    ],
    exercises: [
      {
        id: 'l18-e1', tier: 'veryEasy', title: 'أول ملف',
        prompt: 'اكتب `Hello File` في ملف اسمه `hello.txt` باستخدام with، وبعدين اقرا الملف واطبع محتواه.\nالمتوقع: `Hello File`',
        starter: '',
        hints: ['with open("hello.txt", "w") as f: f.write("Hello File")', 'وبعدها with open("hello.txt") as f: print(f.read())'],
        tests: [{ exact: 'Hello File' }],
        src: [{ re: /\bwith\s+open\s*\(/, msg: 'استخدم with open(...).' }, { re: /["']w["']/, msg: 'افتح الملف للكتابة بـ "w".' }, { re: /\.read\s*\(/, msg: 'اقرا الملف بـ read().' }],
        solution: 'with open("hello.txt", "w") as f:\n    f.write("Hello File")\n\nwith open("hello.txt") as f:\n    print(f.read())\n'
      },
      {
        id: 'l18-e2', tier: 'easy', title: 'مجموع من ملف',
        prompt: 'في ملف جاهز اسمه `numbers.txt` فيه رقم في كل سطر.\nاقرا الملف واطبع مجموع الأرقام.\n(الملف هيكون موجود وقت التصحيح؛ للتجربة في المحرر اعمله بنفسك الأول بـ "w".)',
        starter: '# الملف numbers.txt موجود وقت التصحيح\n',
        hints: ['total = 0 ثم with open("numbers.txt") as f: for line in f:', 'total += int(line.strip())'],
        tests: [
          { files: { 'numbers.txt': '4\n8\n15\n' }, exact: '27' },
          { files: { 'numbers.txt': '100\n-30\n5\n0\n' }, exact: '75', hidden: true }
        ],
        src: [{ re: /open\s*\(\s*["']numbers\.txt["']/, msg: 'افتح الملف numbers.txt.' }],
        forbid: [{ re: /open\s*\(\s*["']numbers\.txt["']\s*,\s*["']w/, msg: 'متكتبش في numbers.txt، اقراه بس (هو موجود وقت التصحيح).' }],
        solution: 'total = 0\nwith open("numbers.txt") as f:\n    for line in f:\n        total += int(line.strip())\nprint(total)\n'
      },
      {
        id: 'l18-e3', tier: 'medium', title: 'حفظ وتحميل قائمة',
        prompt: 'اعمل دالتين:\n- `save_list(items, filename)` تكتب كل عنصر في سطر.\n- `load_list(filename)` ترجّع قائمة السطور من غير `\\n`.\nمثال: بعد `save_list(["a", "b"], "t.txt")` يبقى `load_list("t.txt")` ← `[\'a\', \'b\']`',
        starter: '',
        hints: ['f.write(item + "\\n")', 'result.append(line.strip())'],
        tests: [{ calls: [
          { code: 'save_list(["a", "b"], "t.txt")', expr: 'load_list("t.txt")', expect: "['a', 'b']", label: 'save ثم load لـ ["a", "b"]' },
          { code: 'save_list(["milk", "bread", "tea"], "shop.txt")', expr: 'open("shop.txt").read()', expect: "'milk\\nbread\\ntea\\n'", label: 'محتوى الملف بعد save_list' },
          { code: 'save_list([], "e.txt")', expr: 'load_list("e.txt")', expect: '[]', label: 'قائمة فاضية' }
        ] }],
        src: [{ re: /\bdef\s+save_list\b/, msg: 'عرّف save_list.' }, { re: /\bdef\s+load_list\b/, msg: 'عرّف load_list.' }],
        solution: 'def save_list(items, filename):\n    with open(filename, "w") as f:\n        for item in items:\n            f.write(item + "\\n")\n\ndef load_list(filename):\n    result = []\n    with open(filename) as f:\n        for line in f:\n            result.append(line.strip())\n    return result\n'
      },
      {
        id: 'l18-e4', tier: 'challenge', title: 'تحليل ملف الدرجات',
        prompt: 'في ملف جاهز `students.txt`، كل سطر فيه `الاسم,الدرجة`.\nاطبع صاحب أعلى درجة ودرجته، ثم المتوسط مقرّب لرقم عشري واحد:\n`Best: Sara 95`\n`Average: 81.7`',
        starter: '# الملف students.txt موجود وقت التصحيح\n',
        hints: ['name, score = line.strip().split(",")', 'خزّن الدرجات في قائمة واحفظ الأعلى واسمه.', 'round(total / count, 1)'],
        tests: [
          { files: { 'students.txt': 'Ali,80\nSara,95\nOmar,70\n' }, exact: 'Best: Sara 95\nAverage: 81.7' },
          { files: { 'students.txt': 'Mona,60\nZiad,61\n' }, exact: 'Best: Ziad 61\nAverage: 60.5', hidden: true }
        ],
        src: [{ re: /\.split\s*\(\s*["'],["']\s*\)/, msg: 'قسّم كل سطر بـ split(",").' }],
        solution: 'best_name = ""\nbest = -1\ntotal = 0\ncount = 0\nwith open("students.txt") as f:\n    for line in f:\n        name, score = line.strip().split(",")\n        score = int(score)\n        total += score\n        count += 1\n        if score > best:\n            best = score\n            best_name = name\nprint("Best:", best_name, best)\nprint("Average:", round(total / count, 1))\n'
      }
    ],
    final: {
      id: 'l18-final', title: 'التحدي النهائي: دفتر الملاحظات',
      prompt: 'في ملف جاهز `notes.txt` فيه ملاحظات قديمة (سطر لكل ملاحظة).\nاقرا ملاحظات جديدة من المستخدم لحد ما يكتب `done`، وضيف كل واحدة في آخر الملف (وضع `"a"`).\nبعدها اقرا الملف كله واطبع كل الملاحظات مترقمة، وفي الآخر العدد:\n`1. old note`\n`2. new 1`\n`3. new 2`\n`Total: 3`',
      starter: '# الملف notes.txt موجود وقت التصحيح\n',
      hints: ['with open("notes.txt", "a") as f: جواها while True', 'بعدها with open("notes.txt") as f: lines = f.readlines()', 'for i in range(len(lines)): print(f"{i + 1}. {lines[i].strip()}")'],
      tests: [
        { files: { 'notes.txt': 'old note\n' }, inputs: ['new 1', 'new 2', 'done'], exact: '1. old note\n2. new 1\n3. new 2\nTotal: 3' },
        { files: { 'notes.txt': 'a\nb\n' }, inputs: ['done'], exact: '1. a\n2. b\nTotal: 2', hidden: true },
        { files: { 'notes.txt': '' }, inputs: ['x', 'done'], exact: '1. x\nTotal: 1', hidden: true }
      ],
      src: [{ re: /["']a["']/, msg: 'استخدم وضع الإضافة "a".' }],
      solution: 'with open("notes.txt", "a") as f:\n    while True:\n        note = input("Note: ")\n        if note == "done":\n            break\n        f.write(note + "\\n")\n\nwith open("notes.txt") as f:\n    lines = f.readlines()\n\nfor i in range(len(lines)):\n    print(f"{i + 1}. {lines[i].strip()}")\nprint("Total:", len(lines))\n'
    },
    quiz: [
      { q: 'إيه اللي بيحصل لو فتحنا ملف موجود بالوضع "w"؟', options: ['بيضيف في الآخر', 'بيمسح محتواه ويكتب من جديد', 'خطأ', 'بيقراه'], answer: 1, why: 'w بتبدأ الملف من الصفر.' },
      { q: 'أنهي وضع بيضيف في آخر الملف من غير ما يمسح؟', options: ['"r"', '"w"', '"a"', '"x"'], answer: 2, why: 'a = append.' },
      { q: 'ليه بنستخدم with open(...) as f ؟', options: ['أسرع في الكتابة', 'بتقفل الملف لوحدها', 'بتمنع الأخطاء كلها', 'لازم عشان القراءة بس'], answer: 1, why: 'with بتضمن قفل الملف بعد ما الكود يخلص.' },
      { q: 'إيه ناتج "Ali,80\\n".strip().split(",") ؟', options: ["['Ali,80']", "['Ali', '80']", "['Ali', 80]", "('Ali', '80')"], answer: 1, why: 'strip تشيل \\n و split تقسم عند الفاصلة، والنتيجة نصوص.' },
      { q: 'إيه الخطأ اللي بيطلع لما نقرا ملف مش موجود؟', options: ['NameError', 'FileNotFoundError', 'ValueError', 'IndexError'], answer: 1, why: 'الملف مش موجود.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
