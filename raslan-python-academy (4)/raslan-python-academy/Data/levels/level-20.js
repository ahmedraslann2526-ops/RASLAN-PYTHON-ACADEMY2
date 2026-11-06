/* RASLAN PYTHON ACADEMY — المستوى 20: البرمجة الكائنية OOP */
(function (L) {
  'use strict';
  L[20] = {
    n: 20,
    bot: {
      hello: 'آخر مستوى! 🏁 النهارده هتصمّم "أشياء" ليها بيانات وتصرفات بالكلاسات. وبعده على طول مشروع التخرج!',
      done: 'مبروك يا بطل! خلّصت المستويات العشرين كلها 🎉 مشروع التخرج اتفتح لك، يلا نبني برنامج حقيقي!'
    },
    goals: [
      'تعمل كلاس (Class) وتنشئ منه كائنات (Objects).',
      'تستخدم __init__ والخصائص (Attributes) و self.',
      'تكتب دوال جوه الكلاس (Methods) بتغيّر حالة الكائن.',
      'تستخدم الوراثة البسيطة و __str__.'
    ],
    sections: [
      {
        id: 's1', title: 'الكلاس والكائن',
        text: [
          'الكلاس (Class) زي "الكتالوج" أو القالب: بيوصف الشيء هيكون شكله إيه وبيعمل إيه.',
          'الكائن (Object) نسخة حقيقية معمولة من الكتالوج ده. من كلاس واحد تقدر تعمل كائنات كتير.',
          'بنعرّف الكلاس بـ `class Dog:` (أول حرف كبير بالعرف)، وبننشئ كائن بـ `d = Dog()`.'
        ],
        analogy: 'الكلاس زي تصميم العربية في المصنع، والكائنات هي العربيات الحقيقية اللي طالعة من خط الإنتاج، كل واحدة بلونها.',
        example: {
          code: 'class Dog:\n    def bark(self):\n        return "Woof!"\n\nd1 = Dog()\nd2 = Dog()\nprint(d1.bark())\nprint(d2.bark())\nprint(type(d1))\n',
          lines: [
            ['class Dog:', 'تعريف الكلاس.'],
            ['def bark(self):', 'دالة جوه الكلاس اسمها Method، وأول معامل دايمًا self.'],
            ['d1 = Dog()', 'إنشاء كائن.'],
            ['d1.bark()', 'استدعاء الـ Method بالنقطة.']
          ],
          tip: 'ضيف Method تانية اسمها sleep ترجّع "Zzz".'
        }
      },
      {
        id: 's2', title: '__init__ و self والخصائص',
        text: [
          '`__init__` دالة خاصة بتشتغل لوحدها أول ما الكائن يتعمل، وبنستخدمها نحط البيانات الأولى.',
          '`self` معناها "الكائن ده نفسه". `self.name = name` بتخزن الاسم جوه الكائن كخاصية (Attribute).',
          'كل كائن ليه نسخته من الخصائص: تغيير اسم كائن مش بيأثر على التاني.'
        ],
        analogy: 'زي استمارة التسجيل في الأكاديمية: كل طالب بيملاها ببياناته أول ما يتسجل، وكل واحد عنده ملفه.',
        example: {
          code: 'class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n        self.xp = 0\n\na = Student("Ali", 90)\nb = Student("Sara", 95)\nb.xp = 50\nprint(a.name, a.grade, a.xp)\nprint(b.name, b.grade, b.xp)\n',
          lines: [
            ['def __init__(self, name, grade):', 'بتتنفذ عند Student("Ali", 90).'],
            ['self.name = name', 'خاصية جوه الكائن.'],
            ['b.xp = 50', 'غيّرنا خاصية في b بس.']
          ],
          tip: 'اعمل طالب تالت واطبع بياناته.'
        }
      },
      {
        id: 's3', title: 'Methods بتغيّر حالة الكائن',
        text: [
          'الـ Methods بتقدر تقرا وتعدّل خصائص الكائن عن طريق self.',
          'كده البيانات والتصرفات بتبقى متجمعة في مكان واحد، وده جوهر البرمجة الكائنية.'
        ],
        analogy: 'الحساب البنكي: الرصيد (خاصية) والإيداع والسحب (تصرفات). مينفعش تسحب من غير ما البنك يتأكد من الرصيد.',
        example: {
          code: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount\n        return True\n\nacc = BankAccount("Ali", 100)\nacc.deposit(50)\nprint(acc.withdraw(500))\nprint(acc.withdraw(30))\nprint(acc.owner, acc.balance)\n',
          lines: [
            ['self.balance += amount', 'الـ Method بتعدّل خاصية.'],
            ['return False', 'رفض السحب لو الرصيد مش كفاية.'],
            ['acc.balance', '120 في الآخر.']
          ],
          tip: 'ضيف Method اسمها get_balance ترجّع الرصيد.'
        }
      },
      {
        id: 's4', title: 'الوراثة و __str__',
        text: [
          'الوراثة: كلاس جديد ياخد كل حاجة من كلاس قديم ويضيف أو يغيّر: `class Cat(Animal):`.',
          'لو كتبت في الكلاس الجديد Method بنفس الاسم، بتحل محل القديمة (Override).',
          '`__str__` بتحدد شكل الكائن لما تطبعه بـ print أو تحوله بـ str().'
        ],
        analogy: 'الوراثة زي إن موبايل جديد بياخد كل مميزات الموديل القديم ويزود عليها كاميرا أحسن.',
        example: {
          code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "..."\n\n    def __str__(self):\n        return f"{self.name} ({type(self).__name__})"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow"\n\nc = Cat("Mishmish")\nprint(c.speak())\nprint(c)\nprint(isinstance(c, Animal))\n',
          lines: [
            ['class Cat(Animal):', 'Cat وارث من Animal.'],
            ['def speak(self): (في Cat)', 'Override: نسخة خاصة بالقطة.'],
            ['print(c)', 'بتستخدم __str__: Mishmish (Cat)']
          ],
          tip: 'اعمل class Dog(Animal) يقول Woof.'
        }
      }
    ],
    exercises: [
      {
        id: 'l20-e1', tier: 'veryEasy', title: 'الكلب بيهوهو',
        prompt: 'اعمل كلاس `Dog` فيه Method اسمها `bark` بترجّع النص `"Woof!"`.\n`Dog().bark()` ← `\'Woof!\'`',
        starter: '',
        hints: ['class Dog:', '    def bark(self):', '        return "Woof!"'],
        tests: [{ calls: [{ code: 'd = Dog()', expr: 'd.bark()', expect: "'Woof!'", label: 'Dog().bark()' }] }],
        src: [{ re: /\bclass\s+Dog\b/, msg: 'عرّف class Dog.' }],
        solution: 'class Dog:\n    def bark(self):\n        return "Woof!"\n'
      },
      {
        id: 'l20-e2', tier: 'easy', title: 'كلاس الطالب',
        prompt: 'اعمل كلاس `Student` بياخد `name` و `grade` في `__init__` ويخزنهم كخصائص بنفس الاسمين.\n`s = Student("Ali", 90)` ← `s.name` = `"Ali"` و `s.grade` = `90`',
        starter: '',
        hints: ['def __init__(self, name, grade):', 'self.name = name'],
        tests: [{ calls: [
          { code: 's = Student("Ali", 90)', expr: 's.name', expect: "'Ali'", label: 's.name' },
          { code: 's = Student("Ali", 90)', expr: 's.grade', expect: '90', label: 's.grade' },
          { code: 'a = Student("A", 1)\nb = Student("B", 2)', expr: '(a.name, b.name, a.grade + b.grade)', expect: "('A', 'B', 3)", label: 'كائنين منفصلين' }
        ] }],
        src: [{ re: /\bdef\s+__init__\s*\(\s*self/, msg: 'استخدم __init__(self, …).' }],
        solution: 'class Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n'
      },
      {
        id: 'l20-e3', tier: 'medium', title: 'الحساب البنكي',
        prompt: 'اعمل كلاس `BankAccount(owner, balance=0)` فيه:\n- `deposit(amount)` يضيف للرصيد\n- `withdraw(amount)` لو المبلغ أكبر من الرصيد يرجّع `False` ومايغيّرش حاجة، وإلا يخصم ويرجّع `True`\n- `get_balance()` يرجّع الرصيد',
        starter: '',
        hints: ['self.balance = balance في __init__', 'في withdraw: if amount > self.balance: return False'],
        tests: [{ calls: [
          { code: 'a = BankAccount("Ali", 100)\na.deposit(50)', expr: 'a.get_balance()', expect: '150', label: 'إيداع 50 على 100' },
          { code: 'a = BankAccount("Ali", 100)', expr: '(a.withdraw(500), a.get_balance())', expect: '(False, 100)', label: 'سحب أكتر من الرصيد' },
          { code: 'a = BankAccount("Ali", 100)', expr: '(a.withdraw(30), a.get_balance())', expect: '(True, 70)', label: 'سحب 30' },
          { code: 'b = BankAccount("Sara")', expr: 'b.get_balance()', expect: '0', label: 'الرصيد الافتراضي' }
        ] }],
        src: [{ re: /\bself\.balance\b/, msg: 'خزّن الرصيد في self.balance.' }],
        solution: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount\n        return True\n\n    def get_balance(self):\n        return self.balance\n'
      },
      {
        id: 'l20-e4', tier: 'challenge', title: 'الحيوانات والوراثة',
        prompt: 'اعمل كلاس `Animal(name)` فيه `speak()` بترجّع `"..."`.\nبعدها كلاسين وارثين منه:\n- `Cat` و `speak()` بترجّع `"<name> says Meow"`\n- `Dog` و `speak()` بترجّع `"<name> says Woof"`',
        starter: '',
        hints: ['class Cat(Animal):', 'return f"{self.name} says Meow"'],
        tests: [{ calls: [
          { expr: 'Animal("x").speak()', expect: "'...'" },
          { expr: 'Cat("Mishmish").speak()', expect: "'Mishmish says Meow'" },
          { expr: 'Dog("Rex").speak()', expect: "'Rex says Woof'" },
          { expr: '(isinstance(Cat("a"), Animal), isinstance(Dog("b"), Animal))', expect: '(True, True)', label: 'Cat و Dog وارثين من Animal' }
        ] }],
        src: [{ re: /class\s+Cat\s*\(\s*Animal\s*\)/, msg: 'Cat لازم يورث من Animal: class Cat(Animal):' }, { re: /class\s+Dog\s*\(\s*Animal\s*\)/, msg: 'Dog لازم يورث من Animal.' }],
        solution: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "..."\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof"\n'
      }
    ],
    final: {
      id: 'l20-final', title: 'التحدي النهائي: كلاس المهمة (تجهيز لمشروع التخرج)',
      prompt: 'اعمل كلاس `Task(title)` فيه:\n- خاصية `title` وخاصية `done` بتبدأ `False`\n- `mark_done()` تخلي done تبقى `True`\n- `__str__` ترجّع `"[x] <title>"` لو خلصت، أو `"[ ] <title>"` لو لسه\nوكلاس `TodoList` فيه:\n- خاصية `tasks` (قائمة فاضية في الأول)\n- `add(title)` تضيف `Task` جديدة\n- `complete(number)` تخلّص المهمة رقم number (الترقيم من 1)\n- `pending_count()` ترجّع عدد المهام اللي لسه',
      starter: '',
      hints: ['في Task: self.done = False', 'في TodoList.add: self.tasks.append(Task(title))', 'complete: self.tasks[number - 1].mark_done()'],
      tests: [{ calls: [
        { code: 't = Task("Study")', expr: '(t.title, t.done, str(t))', expect: "('Study', False, '[ ] Study')", label: 'مهمة جديدة' },
        { code: 't = Task("Study")\nt.mark_done()', expr: '(t.done, str(t))', expect: "(True, '[x] Study')", label: 'mark_done' },
        { code: 'L = TodoList()\nL.add("A")\nL.add("B")\nL.add("C")\nL.complete(2)', expr: '(L.pending_count(), [str(x) for x in L.tasks])', expect: "(2, ['[ ] A', '[x] B', '[ ] C'])", label: 'TodoList كاملة' },
        { code: 'L = TodoList()', expr: '(L.tasks, L.pending_count())', expect: '([], 0)', label: 'قائمة فاضية' }
      ] }],
      src: [{ re: /\bclass\s+Task\b/, msg: 'عرّف class Task.' }, { re: /\bclass\s+TodoList\b/, msg: 'عرّف class TodoList.' }, { re: /def\s+__str__\s*\(/, msg: 'عرّف __str__ في Task.' }],
      solution: 'class Task:\n    def __init__(self, title):\n        self.title = title\n        self.done = False\n\n    def mark_done(self):\n        self.done = True\n\n    def __str__(self):\n        mark = "x" if self.done else " "\n        return f"[{mark}] {self.title}"\n\nclass TodoList:\n    def __init__(self):\n        self.tasks = []\n\n    def add(self, title):\n        self.tasks.append(Task(title))\n\n    def complete(self, number):\n        self.tasks[number - 1].mark_done()\n\n    def pending_count(self):\n        count = 0\n        for t in self.tasks:\n            if not t.done:\n                count += 1\n        return count\n'
    },
    quiz: [
      { q: 'إيه الفرق بين الكلاس والكائن؟', options: ['مفيش فرق', 'الكلاس قالب، والكائن نسخة حقيقية منه', 'الكائن قالب، والكلاس نسخة', 'الكلاس دالة'], answer: 1, why: 'من كلاس واحد بنعمل كائنات كتير.' },
      { q: 'إمتى بتتنفذ __init__ ؟', options: ['لما نطبع الكائن', 'أول ما الكائن يتعمل', 'لما نحذفه', 'لازم نناديها بإيدنا'], answer: 1, why: 'بتشتغل تلقائيًا عند الإنشاء.' },
      { q: 'إيه معنى self جوه الكلاس؟', options: ['الكلاس نفسه', 'الكائن الحالي اللي بنتعامل معاه', 'متغير عام', 'اسم الملف'], answer: 1, why: 'self هو الكائن اللي استدعى الـ Method.' },
      { q: 'إيه ناتج الكود ده؟', code: 'class A:\n    def hi(self):\n        return "A"\n\nclass B(A):\n    pass\n\nprint(B().hi())', options: ['A', 'B', 'خطأ', 'None'], answer: 0, why: 'B ورث hi من A.' },
      { q: 'إيه اللي بتتحكم فيه __str__ ؟', options: ['سرعة الكلاس', 'شكل الكائن لما نطبعه', 'عدد الكائنات', 'الوراثة'], answer: 1, why: 'print(obj) بيستخدم __str__.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
