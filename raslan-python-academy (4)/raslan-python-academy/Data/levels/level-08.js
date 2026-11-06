/* RASLAN PYTHON ACADEMY — المستوى 8: الشرط المتعدد elif */
(function (L) {
  'use strict';
  L[8] = {
    n: 8,
    bot: {
      hello: 'في المستوى اللي فات اخترنا بين حاجتين بس. النهارده برنامجك هيختار بين أكتر من احتمال بـ elif 🚦',
      done: 'برافو! بقيت تكتب قرارات فيها احتمالات كتير ومترتبة صح. ده اللي بيخلي البرامج ذكية 🧠'
    },
    goals: [
      'تكتب if و elif و else عشان تختار بين أكتر من احتمالين.',
      'تفهم إن Python بتنفذ أول شرط صح بس وبتسيب الباقي.',
      'ترتّب الشروط صح عشان النتيجة متبقاش غلط.',
      'تفرّق بين if ورا if وبين if و elif.'
    ],
    sections: [
      {
        id: 's1', title: 'أكتر من احتمالين: elif',
        text: [
          '`elif` اختصار "else if" يعني "وإلا لو…". بتيجي بعد `if` وقبل `else`، وتقدر تكتب منها عدد زي ما تحب.',
          'كل `elif` ليها شرط ولازم تنتهي بـ `:` والكود اللي تحتها مزاح، بالظبط زي `if`.',
          'و`else` في الآخر اختيارية: بتتنفذ لو مفيش ولا شرط من اللي فوق اتحقق.'
        ],
        analogy: 'زي إشارة المرور: لو أحمر قف، وإلا لو أصفر استعد، وإلا (يعني أخضر) اتحرك. 3 احتمالات وواحد بس هو اللي بيحصل.',
        example: {
          code: 'light = "yellow"\n\nif light == "red":\n    print("Stop")\nelif light == "yellow":\n    print("Get ready")\nelse:\n    print("Go")\n',
          lines: [
            ['if light == "red":', 'أول سؤال: هل الإشارة حمرا؟ لأ، نكمل.'],
            ['elif light == "yellow":', 'تاني سؤال: هل صفرا؟ أيوه، يبقى ننفذ اللي تحتها ونخرج.'],
            ['else:', 'متتنفذش هنا لأن في شرط اتحقق قبلها.']
          ],
          tip: 'غيّر قيمة light لـ "red" ثم "green" وشغّل كل مرة.'
        }
      },
      {
        id: 's2', title: 'أول شرط صح هو اللي بيكسب',
        text: [
          'Python بتسأل الشروط بالترتيب من فوق لتحت، وأول ما تلاقي شرط True بتنفذه وتتجاهل كل اللي بعده حتى لو صح.',
          'عشان كده الترتيب مهم جدًا. في الدرجات مثلًا لازم تبدأ بالأعلى: `score >= 90` قبل `score >= 75`.',
          'لو عكست الترتيب، الطالب اللي جايب 95 هيقف عند `score >= 75` ويطلع له تقدير أقل من حقه!'
        ],
        analogy: 'زي طابور فيه أبواب: أول باب مفتوح تدخل منه وخلاص، مش هتجرب الأبواب اللي بعده.',
        example: {
          code: 'score = 95\n\nif score >= 90:\n    print("Excellent")\nelif score >= 75:\n    print("Very good")\nelif score >= 50:\n    print("Pass")\nelse:\n    print("Try again")\n',
          lines: [
            ['if score >= 90:', '95 أكبر من أو يساوي 90؟ أيوه → Excellent وخلاص.'],
            ['elif score >= 75:', '95 برضه أكبر من 75، بس الشرط ده مش هيتسأل أصلًا.'],
            ['else:', 'لأي درجة أقل من 50.']
          ],
          tip: 'بدّل مكان أول شرطين وشغّل بـ score = 95. هتلاقي النتيجة غلط!'
        }
      },
      {
        id: 's3', title: 'if ورا if مش زي if و elif',
        text: [
          'لو كتبت أكتر من `if` منفصلين، Python بتسأل كل واحد لوحده، فممكن أكتر من واحد يتنفذ.',
          'لكن مع `elif` السلسلة كلها مرتبطة ببعض، وواحد بس بيتنفذ.',
          'استخدم `elif` لما الاحتمالات تكون "يا ده يا ده"، واستخدم `if` منفصلة لما تكون أسئلة مستقلة.'
        ],
        analogy: 'if منفصلة زي أسئلة امتحان كل واحد ليه إجابة. elif زي سؤال اختيار من متعدد: إجابة واحدة بس.',
        example: {
          code: 'x = 100\n\nprint("--- if منفصلة ---")\nif x > 10:\n    print("bigger than 10")\nif x > 50:\n    print("bigger than 50")\n\nprint("--- if و elif ---")\nif x > 10:\n    print("bigger than 10")\nelif x > 50:\n    print("bigger than 50")\n',
          lines: [
            ['if x > 10: … if x > 50:', 'الاتنين اتسألوا والاتنين صح، فاتطبع سطرين.'],
            ['if x > 10: … elif x > 50:', 'أول شرط صح، فالـ elif مش بتتسأل، فاتطبع سطر واحد.']
          ],
          tip: 'جرّب x = 30 وقارن النتيجتين.'
        }
      },
      {
        id: 's4', title: 'elif مع input()',
        text: [
          'أغلب استخدام elif الحقيقي بيبقى مع بيانات جاية من المستخدم.',
          'افتكر تحوّل الأرقام بـ `int()`، والنصوص تقارنها زي ما هي.'
        ],
        analogy: 'زي موظف الاستقبال: يسألك جاي لمين، وعلى حسب إجابتك يوجهك للمكتب الصح.',
        example: {
          code: 'hour = int(input("Hour (0-23): "))\n\nif hour < 12:\n    print("Good morning")\nelif hour < 18:\n    print("Good afternoon")\nelse:\n    print("Good evening")\n',
          lines: [
            ['hour < 12', 'قبل الضهر.'],
            ['elif hour < 18', 'هنا أكيد الساعة 12 أو أكتر (عشان الشرط اللي قبلها طلع False) وأقل من 18.'],
            ['else', 'من 18 لحد 23.']
          ],
          tip: 'جرّب 9 و 12 و 20.'
        }
      }
    ],
    exercises: [
      {
        id: 'l8-e1', tier: 'veryEasy', title: 'إشارة المرور',
        prompt: 'عندك `light = "red"`.\nاطبع `Stop` لو أحمر، و`Wait` لو `"yellow"`، و`Go` لو `"green"`.\n(هنجرّب كودك بالألوان التلاتة.)',
        starter: 'light = "red"\n',
        hints: ['if light == "red":', 'بعدها elif light == "yellow": وفي الآخر elif أو else للأخضر.'],
        tests: [
          { exact: 'Stop' },
          { exact: 'Wait', replace: [/\blight\s*=\s*"red"/, 'light = "yellow"'], hidden: true },
          { exact: 'Go', replace: [/\blight\s*=\s*"red"/, 'light = "green"'], hidden: true }
        ],
        src: [{ re: /\belif\b/, msg: 'استخدم elif.' }],
        solution: 'light = "red"\nif light == "red":\n    print("Stop")\nelif light == "yellow":\n    print("Wait")\nelse:\n    print("Go")\n'
      },
      {
        id: 'l8-e2', tier: 'easy', title: 'موجب أو سالب أو صفر',
        prompt: 'اسأل عن رقم صحيح واطبع:\n`Positive` لو أكبر من صفر\n`Negative` لو أصغر من صفر\n`Zero` لو يساوي صفر',
        starter: '',
        hints: ['n = int(input("n: "))', 'if n > 0: … elif n < 0: … else: …'],
        tests: [{ inputs: ['5'], exact: 'Positive' }, { inputs: ['-2'], exact: 'Negative' }, { inputs: ['0'], exact: 'Zero' }, { inputs: ['100'], exact: 'Positive', hidden: true }],
        src: [{ re: /\belif\b/, msg: 'استخدم elif.' }],
        solution: 'n = int(input("n: "))\nif n > 0:\n    print("Positive")\nelif n < 0:\n    print("Negative")\nelse:\n    print("Zero")\n'
      },
      {
        id: 'l8-e3', tier: 'medium', title: 'التقدير',
        prompt: 'اسأل عن الدرجة (من 100) واطبع التقدير:\n90 فأكثر ← `A`\n75 فأكثر ← `B`\n50 فأكثر ← `C`\nأقل من 50 ← `F`',
        starter: '',
        hints: ['ابدأ بأعلى شرط: if score >= 90:', 'خلي بالك من الترتيب.'],
        tests: [
          { inputs: ['95'], exact: 'A' }, { inputs: ['80'], exact: 'B' }, { inputs: ['60'], exact: 'C' }, { inputs: ['10'], exact: 'F' },
          { inputs: ['90'], exact: 'A', hidden: true }, { inputs: ['75'], exact: 'B', hidden: true }, { inputs: ['50'], exact: 'C', hidden: true }, { inputs: ['49'], exact: 'F', hidden: true }
        ],
        src: [{ re: /\belif\b/, msg: 'استخدم elif.' }],
        solution: 'score = int(input("Score: "))\nif score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelif score >= 50:\n    print("C")\nelse:\n    print("F")\n'
      },
      {
        id: 'l8-e4', tier: 'challenge', title: 'الأكبر من تلاتة',
        prompt: 'اسأل عن 3 أرقام (كل واحد بـ input) واطبع أكبرهم.\nممنوع تستخدم الدالة `max()` — استخدم if و elif و else.',
        starter: '',
        hints: ['الرقم a يبقى الأكبر لو a >= b وكمان a >= c. هتحتاج تكتب شرطين جوه بعض أو تستخدم مقارنة متسلسلة.', 'if a >= b and a >= c: (أو if a >= b >= … ) — and هنتعلمها بالتفصيل المستوى الجاي، بس تقدر تستخدمها.', 'أو: if a >= b: ثم جواها if a >= c: …'],
        tests: [
          { inputs: ['3', '7', '5'], exact: '7' }, { inputs: ['9', '2', '4'], exact: '9' }, { inputs: ['1', '2', '8'], exact: '8' },
          { inputs: ['5', '5', '1'], exact: '5', hidden: true }, { inputs: ['-1', '-7', '-3'], exact: '-1', hidden: true }, { inputs: ['4', '4', '4'], exact: '4', hidden: true }
        ],
        src: [{ re: /\bif\b/, msg: 'استخدم if.' }, { re: /\belse\b|\belif\b/, msg: 'استخدم elif أو else.' }],
        forbid: [{ re: /\bmax\s*\(/, msg: 'التمرين ده عن الشروط، فممنوع max(). قارن بنفسك بـ if.' }, { re: /\bsorted\s*\(|\.sort\s*\(/, msg: 'ممنوع الترتيب هنا، قارن بـ if.' }],
        solution: 'a = int(input("a: "))\nb = int(input("b: "))\nc = int(input("c: "))\nif a >= b and a >= c:\n    print(a)\nelif b >= a and b >= c:\n    print(b)\nelse:\n    print(c)\n'
      }
    ],
    final: {
      id: 'l8-final', title: 'التحدي النهائي: حاسبة الشحن',
      prompt: 'اسأل عن وزن الطرد بالكيلو (رقم صحيح) واطبع سعر الشحن:\nلحد 1 كيلو ← `Shipping: 30`\nلحد 5 كيلو ← `Shipping: 50`\nلحد 20 كيلو ← `Shipping: 100`\nأكتر من 20 ← `Too heavy`\n(كلمة "لحد" يعني الوزن نفسه داخل، يعني 5 كيلو سعرها 50.)',
      starter: '',
      hints: ['if weight <= 1: …', 'استخدم <= عشان الحد نفسه يدخل.', 'آخر حالة else: print("Too heavy")'],
      tests: [
        { inputs: ['1'], exact: 'Shipping: 30' }, { inputs: ['3'], exact: 'Shipping: 50' }, { inputs: ['12'], exact: 'Shipping: 100' }, { inputs: ['25'], exact: 'Too heavy' },
        { inputs: ['5'], exact: 'Shipping: 50', hidden: true }, { inputs: ['20'], exact: 'Shipping: 100', hidden: true }, { inputs: ['21'], exact: 'Too heavy', hidden: true }, { inputs: ['0'], exact: 'Shipping: 30', hidden: true }
      ],
      src: [{ re: /\belif\b/, msg: 'استخدم elif.' }],
      solution: 'weight = int(input("Weight: "))\nif weight <= 1:\n    print("Shipping: 30")\nelif weight <= 5:\n    print("Shipping: 50")\nelif weight <= 20:\n    print("Shipping: 100")\nelse:\n    print("Too heavy")\n'
    },
    quiz: [
      { q: 'إيه ناتج الكود ده؟', code: 'x = 7\nif x > 10:\n    print("A")\nelif x > 5:\n    print("B")\nelse:\n    print("C")', options: ['A', 'B', 'C', 'B و C'], answer: 1, why: '7 مش أكبر من 10، لكنه أكبر من 5.' },
      { q: 'إيه ناتج الكود ده؟', code: 'x = 100\nif x > 10:\n    print("A")\nelif x > 50:\n    print("B")', options: ['A', 'B', 'A و B', 'مفيش'], answer: 0, why: 'أول شرط صح بيتنفذ وبعده السلسلة كلها بتقف.' },
      { q: 'كام elif ممكن نكتب بعد if واحدة؟', options: ['واحدة بس', 'اتنين بس', 'أي عدد', 'مينفعش'], answer: 2, why: 'تقدر تكتب عدد elif زي ما تحب.' },
      { q: 'هل لازم نكتب else في الآخر؟', options: ['أيوه دايمًا', 'لأ، اختيارية', 'لازم قبل elif', 'لازم بعد كل elif'], answer: 1, why: 'else اختيارية، وبتتنفذ لو مفيش شرط اتحقق.' },
      { q: 'إيه ناتج الكود ده؟', code: 'x = 100\nif x > 10:\n    print("A")\nif x > 50:\n    print("B")', options: ['A', 'B', 'A ثم B', 'مفيش'], answer: 2, why: 'دول if منفصلين، فالاتنين اتسألوا والاتنين صح.' }
    ]
  };
})(window.RPA_LEVELS = window.RPA_LEVELS || {});
