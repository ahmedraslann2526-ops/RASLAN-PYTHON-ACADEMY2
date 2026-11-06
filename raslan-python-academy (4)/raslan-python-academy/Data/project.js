/* =====================================================================
   RASLAN PYTHON ACADEMY — Data/project.js  (Phase 3 / Batch 4)
   RASLAN PYTHON GRADUATION PROJECT: برنامج إدارة المهام To-Do List
   ملف واحد (todo.py) يكبر مرحلة بعد مرحلة. كل مرحلة تُصحَّح بتشغيل فعلي لدوال الطالب.
   ملاحظة للتصحيح: اختبارات المراحل 1–4 تمرر الإدخال "quit" حتى لو كانت الدالة main()
   (من المرحلة 5) موجودة وتُستدعى في آخر الملف، فيخرج البرنامج فورًا ثم تُختبر الدوال.
   ===================================================================== */
(function (root) {
  'use strict';

  var Q = ['quit'];

  var STARTER = [
    '# RASLAN PYTHON GRADUATION PROJECT',
    '# برنامج إدارة المهام To-Do List',
    '# كل مهمة عبارة عن قاموس: {"title": "Buy milk", "done": False}',
    '',
    '# ---------- المرحلة 1 ----------',
    'def add_task(tasks, title):',
    '    # 1) شيل المسافات الزيادة من العنوان',
    '    # 2) لو العنوان فاضي: raise ValueError("Empty title")',
    '    # 3) اعمل قاموس المهمة وضيفه للقائمة ورجّعه',
    '    pass',
    '',
    '# ---------- المرحلة 2 ----------',
    '',
    '# ---------- المرحلة 3 ----------',
    '',
    '# ---------- المرحلة 4 ----------',
    '',
    '# ---------- المرحلة 5 ----------',
    ''
  ].join('\n');

  var SOLUTION = [
    'def add_task(tasks, title):',
    '    title = title.strip()',
    '    if title == "":',
    '        raise ValueError("Empty title")',
    '    task = {"title": title, "done": False}',
    '    tasks.append(task)',
    '    return task',
    '',
    'def format_tasks(tasks):',
    '    if len(tasks) == 0:',
    '        return "No tasks yet."',
    '    lines = []',
    '    for i in range(len(tasks)):',
    '        task = tasks[i]',
    '        mark = "x" if task["done"] else " "',
    '        lines.append(f"{i + 1}. [{mark}] {task[\'title\']}")',
    '    return "\\n".join(lines)',
    '',
    'def pending_count(tasks):',
    '    count = 0',
    '    for task in tasks:',
    '        if not task["done"]:',
    '            count += 1',
    '    return count',
    '',
    'def check_number(tasks, number):',
    '    if number < 1 or number > len(tasks):',
    '        raise IndexError("Invalid task number")',
    '',
    'def complete_task(tasks, number):',
    '    check_number(tasks, number)',
    '    tasks[number - 1]["done"] = True',
    '',
    'def delete_task(tasks, number):',
    '    check_number(tasks, number)',
    '    task = tasks.pop(number - 1)',
    '    return task["title"]',
    '',
    'def save_tasks(tasks, filename):',
    '    with open(filename, "w") as f:',
    '        for task in tasks:',
    '            flag = "1" if task["done"] else "0"',
    '            f.write(flag + "|" + task["title"] + "\\n")',
    '',
    'def load_tasks(filename):',
    '    tasks = []',
    '    try:',
    '        with open(filename) as f:',
    '            for line in f:',
    '                line = line.strip()',
    '                if line == "":',
    '                    continue',
    '                flag, title = line.split("|", 1)',
    '                tasks.append({"title": title, "done": flag == "1"})',
    '    except FileNotFoundError:',
    '        return []',
    '    return tasks',
    '',
    'def main():',
    '    tasks = load_tasks("tasks.txt")',
    '    while True:',
    '        command = input("Command: ").strip().lower()',
    '        if command == "add":',
    '            title = input("Title: ")',
    '            try:',
    '                add_task(tasks, title)',
    '                print("Added.")',
    '            except ValueError:',
    '                print("Error: Empty title")',
    '        elif command == "list":',
    '            print(format_tasks(tasks))',
    '        elif command == "done" or command == "delete":',
    '            try:',
    '                number = int(input("Number: "))',
    '                if command == "done":',
    '                    complete_task(tasks, number)',
    '                    print("Completed.")',
    '                else:',
    '                    title = delete_task(tasks, number)',
    '                    print("Deleted: " + title)',
    '            except ValueError:',
    '                print("Error: Invalid task number")',
    '            except IndexError:',
    '                print("Error: Invalid task number")',
    '        elif command == "save":',
    '            save_tasks(tasks, "tasks.txt")',
    '            print("Saved.")',
    '        elif command == "quit":',
    '            print("Bye! Pending tasks: " + str(pending_count(tasks)))',
    '            break',
    '        else:',
    '            print("Unknown command")',
    '',
    'main()',
    ''
  ].join('\n');

  var STAGES = [
    {
      id: 'p1', title: 'المرحلة 1: هيكل البيانات وإضافة مهمة',
      concepts: ['القواميس', 'القوائم', 'الدوال و return', 'strip', 'raise'],
      intro: 'كل مهمة هتبقى قاموس فيه العنوان وحالتها، وكل المهام في قائمة. أول دالة: إضافة مهمة.',
      requirements: [
        'دالة `add_task(tasks, title)`.',
        'تشيل المسافات الزيادة من أول وآخر العنوان (`strip`).',
        'لو العنوان فاضي بعد التنظيف: `raise ValueError("Empty title")`.',
        'تعمل قاموس `{"title": العنوان, "done": False}` وتضيفه في آخر القائمة.',
        'ترجّع القاموس اللي اتضاف.'
      ],
      hints: ['title = title.strip()', 'if title == "": raise ValueError("Empty title")', 'task = {"title": title, "done": False} ثم tasks.append(task) ثم return task'],
      tests: [
        { inputs: Q, calls: [
          { code: 'T = []', expr: 'add_task(T, "Buy milk")', expect: "{'title': 'Buy milk', 'done': False}", label: 'add_task(T, "Buy milk") بترجّع المهمة' },
          { code: 'T = []\nadd_task(T, "A")\nadd_task(T, "  B  ")', expr: 'T', expect: "[{'title': 'A', 'done': False}, {'title': 'B', 'done': False}]", label: 'إضافة مهمتين وتنظيف المسافات' },
          { code: 'T = []', expr: 'add_task(T, "   ")', err: 'ValueError: Empty title', label: 'عنوان فاضي يطلّع ValueError' },
          { code: 'T = []\ntry:\n    add_task(T, "")\nexcept ValueError:\n    pass', expr: 'T', expect: '[]', label: 'العنوان الفاضي ميتضافش' }
        ] }
      ],
      src: [{ re: /\bdef\s+add_task\s*\(/, msg: 'عرّف الدالة add_task.' }, { re: /\braise\s+ValueError\b/, msg: 'استخدم raise ValueError للعنوان الفاضي.' }]
    },
    {
      id: 'p2', title: 'المرحلة 2: عرض المهام وعدّ المتبقي',
      concepts: ['الحلقات', 'f-string', 'join', 'الشروط'],
      intro: 'المستخدم محتاج يشوف مهامه مترقمة وعليها علامة اللي خلص.',
      requirements: [
        'دالة `format_tasks(tasks)` ترجّع نص (مش تطبع).',
        'لو مفيش مهام ترجّع: `No tasks yet.`',
        'غير كده كل مهمة في سطر: `1. [ ] Buy milk` للي لسه، و `2. [x] Study` للي خلصت.',
        'السطور بينها `\\n` ومفيش سطر فاضي في الآخر.',
        'دالة `pending_count(tasks)` ترجّع عدد المهام اللي لسه مخلصتش.'
      ],
      hints: ['mark = "x" if task["done"] else " "', 'lines.append(f"{i + 1}. [{mark}] {task[\'title\']}")', 'return "\\n".join(lines)'],
      tests: [
        { inputs: Q, calls: [
          { expr: 'format_tasks([])', expect: "'No tasks yet.'", label: 'format_tasks([])' },
          { expr: 'format_tasks([{"title": "Buy milk", "done": False}, {"title": "Study", "done": True}])', expect: "'1. [ ] Buy milk\\n2. [x] Study'", label: 'format_tasks لمهمتين' },
          { expr: 'pending_count([{"title": "A", "done": False}, {"title": "B", "done": True}, {"title": "C", "done": False}])', expect: '2', label: 'pending_count' },
          { expr: 'pending_count([])', expect: '0', label: 'pending_count([])' },
          { code: 'T = []\nadd_task(T, "X")\nT[0]["done"] = True', expr: 'format_tasks(T)', expect: "'1. [x] X'", label: 'مع add_task' }
        ] }
      ],
      src: [{ re: /\bdef\s+format_tasks\s*\(/, msg: 'عرّف format_tasks.' }, { re: /\bdef\s+pending_count\s*\(/, msg: 'عرّف pending_count.' }]
    },
    {
      id: 'p3', title: 'المرحلة 3: إنهاء وحذف المهام بأمان',
      concepts: ['الفهرس', 'pop', 'raise', 'التحقق من القيم'],
      intro: 'المستخدم بيختار المهمة برقمها (من 1). لازم نتأكد إن الرقم صح قبل أي تعديل.',
      requirements: [
        'دالة `complete_task(tasks, number)` تخلّي المهمة رقم number (من 1) تبقى `done = True`.',
        'دالة `delete_task(tasks, number)` تحذف المهمة رقم number وترجّع عنوانها.',
        'لو الرقم أقل من 1 أو أكبر من عدد المهام: `raise IndexError("Invalid task number")` في الدالتين، ومن غير ما القائمة تتغير.'
      ],
      hints: ['if number < 1 or number > len(tasks): raise IndexError("Invalid task number")', 'tasks[number - 1]["done"] = True', 'tasks.pop(number - 1) بترجّع القاموس المحذوف'],
      tests: [
        { inputs: Q, calls: [
          { code: 'T = [{"title": "A", "done": False}, {"title": "B", "done": False}]\ncomplete_task(T, 2)', expr: 'T', expect: "[{'title': 'A', 'done': False}, {'title': 'B', 'done': True}]", label: 'complete_task(T, 2)' },
          { code: 'T = [{"title": "A", "done": False}, {"title": "B", "done": False}]', expr: '(delete_task(T, 1), T)', expect: "('A', [{'title': 'B', 'done': False}])", label: 'delete_task(T, 1)' },
          { code: 'T = [{"title": "A", "done": False}]', expr: 'complete_task(T, 2)', err: 'IndexError: Invalid task number', label: 'complete_task برقم أكبر من العدد' },
          { code: 'T = [{"title": "A", "done": False}]', expr: 'delete_task(T, 0)', err: 'IndexError: Invalid task number', label: 'delete_task برقم 0' },
          { code: 'T = [{"title": "A", "done": False}]', expr: 'complete_task(T, -1)', err: 'IndexError: Invalid task number', label: 'رقم سالب (مينفعش يعدّل آخر مهمة)' },
          { code: 'T = [{"title": "A", "done": False}]\ntry:\n    delete_task(T, 5)\nexcept IndexError:\n    pass', expr: 'T', expect: "[{'title': 'A', 'done': False}]", label: 'القائمة متتغيرش مع رقم غلط' }
        ] }
      ],
      src: [{ re: /\bdef\s+complete_task\s*\(/, msg: 'عرّف complete_task.' }, { re: /\bdef\s+delete_task\s*\(/, msg: 'عرّف delete_task.' }, { re: /\braise\s+IndexError\b/, msg: 'استخدم raise IndexError للرقم الغلط.' }]
    },
    {
      id: 'p4', title: 'المرحلة 4: الحفظ في ملف والتحميل منه',
      concepts: ['الملفات', 'with', 'split', 'try/except FileNotFoundError'],
      intro: 'عشان المهام متضيعش، هنحفظها في ملف نصي ونحمّلها تاني.',
      requirements: [
        'دالة `save_tasks(tasks, filename)` تكتب كل مهمة في سطر بالشكل: `1|العنوان` لو خلصت أو `0|العنوان` لو لسه.',
        'دالة `load_tasks(filename)` تقرا الملف وترجّع قائمة القواميس بنفس الشكل الأصلي.',
        'تتجاهل السطور الفاضية.',
        'لو الملف مش موجود ترجّع قائمة فاضية `[]` (امسك `FileNotFoundError`).',
        'العنوان ممكن يكون فيه `|`، فقسّم عند أول `|` بس: `line.split("|", 1)`.'
      ],
      hints: ['flag = "1" if task["done"] else "0"', 'with open(filename, "w") as f: f.write(flag + "|" + task["title"] + "\\n")', 'flag, title = line.strip().split("|", 1) ثم done = flag == "1"', 'try: … except FileNotFoundError: return []'],
      tests: [
        { inputs: Q, calls: [
          { code: 'save_tasks([{"title": "A", "done": False}, {"title": "B", "done": True}], "t.txt")', expr: 'open("t.txt").read()', expect: "'0|A\\n1|B\\n'", label: 'شكل الملف بعد save_tasks' },
          { code: 'T = [{"title": "Buy milk", "done": True}, {"title": "a|b", "done": False}]\nsave_tasks(T, "r.txt")', expr: 'load_tasks("r.txt") == T', expect: 'True', label: 'حفظ ثم تحميل يرجّع نفس المهام (حتى لو العنوان فيه |)' },
          { expr: 'load_tasks("no_such_file.txt")', expect: '[]', label: 'ملف مش موجود' }
        ] },
        { inputs: Q, files: { 'old.txt': '1|Old task\n\n0|New task\n' }, calls: [
          { expr: 'load_tasks("old.txt")', expect: "[{'title': 'Old task', 'done': True}, {'title': 'New task', 'done': False}]", label: 'تحميل ملف جاهز فيه سطر فاضي' }
        ], hidden: true }
      ],
      src: [{ re: /\bwith\s+open\s*\(/, msg: 'استخدم with open(...).' }, { re: /\bexcept\s+FileNotFoundError\b/, msg: 'امسك FileNotFoundError في load_tasks.' }]
    },
    {
      id: 'p5', title: 'المرحلة 5: البرنامج الكامل بقائمة الأوامر',
      concepts: ['while', 'input', 'if/elif', 'try/except', 'كل الدوال السابقة'],
      intro: 'آخر مرحلة: نجمع كل حاجة في برنامج تفاعلي حقيقي.',
      requirements: [
        'دالة `main()` وتستدعيها في آخر الملف: `main()`.',
        'أول حاجة: `tasks = load_tasks("tasks.txt")`.',
        'حلقة تقرا أمر بـ `input` (شيل المسافات وحوّله لحروف صغيرة):',
        '`add` ← تقرا عنوان وتضيفه وتطبع `Added.` — ولو فاضي تطبع `Error: Empty title`',
        '`list` ← تطبع `format_tasks(tasks)`',
        '`done` ← تقرا رقم وتطبع `Completed.` — `delete` ← تقرا رقم وتطبع `Deleted: <العنوان>`',
        'لو الرقم مش رقم أو غلط في done/delete: `Error: Invalid task number`',
        '`save` ← تحفظ في `tasks.txt` وتطبع `Saved.`',
        '`quit` ← تطبع `Bye! Pending tasks: <العدد>` وتخرج',
        'أي أمر تاني ← `Unknown command`',
        'متطبعش أي حاجة غير الرسائل دي (الأسئلة جوه input عادي).'
      ],
      hints: ['while True: command = input("Command: ").strip().lower()', 'استخدم try حوالين int(input(...)) و complete_task/delete_task، وامسك ValueError و IndexError.', 'في quit: print("Bye! Pending tasks: " + str(pending_count(tasks))) ثم break'],
      tests: [
        { inputs: ['add', 'Buy milk', 'add', 'Study Python', 'list', 'done', '2', 'list', 'quit'],
          exact: 'Added.\nAdded.\n1. [ ] Buy milk\n2. [ ] Study Python\nCompleted.\n1. [ ] Buy milk\n2. [x] Study Python\nBye! Pending tasks: 1' },
        { inputs: ['add', '   ', 'done', '5', 'done', 'abc', 'delete', '1', 'fly', 'LIST', 'quit'],
          exact: 'Error: Empty title\nError: Invalid task number\nError: Invalid task number\nError: Invalid task number\nUnknown command\nNo tasks yet.\nBye! Pending tasks: 0' },
        { files: { 'tasks.txt': '1|Old task\n0|New task\n' }, inputs: ['list', 'delete', '1', 'save', 'quit'],
          exact: '1. [x] Old task\n2. [ ] New task\nDeleted: Old task\nSaved.\nBye! Pending tasks: 1',
          calls: [{ expr: 'open("tasks.txt").read()', expect: "'0|New task\\n'", label: 'محتوى tasks.txt بعد save' }] },
        { inputs: [' Add ', 'Read a book', 'done', '1', 'add', 'Sleep', 'save', 'quit'],
          exact: 'Added.\nCompleted.\nAdded.\nSaved.\nBye! Pending tasks: 1',
          calls: [{ expr: 'open("tasks.txt").read()', expect: "'1|Read a book\\n0|Sleep\\n'", label: 'الحفظ بعد إضافة وإنهاء' }], hidden: true }
      ],
      src: [{ re: /\bdef\s+main\s*\(/, msg: 'عرّف الدالة main.' }, { re: /^main\s*\(\s*\)/m, msg: 'استدعي main() في آخر الملف (من غير إزاحة).' }, { re: /\bwhile\b/, msg: 'استخدم حلقة while.' }]
    }
  ];

  root.RPA_PROJECT = {
    title: 'RASLAN PYTHON GRADUATION PROJECT',
    subtitle: 'برنامج إدارة المهام To-Do List',
    fileName: 'todo.py',
    starter: STARTER,
    solution: SOLUTION,
    stages: STAGES
  };
})(typeof window !== 'undefined' ? window : this);
