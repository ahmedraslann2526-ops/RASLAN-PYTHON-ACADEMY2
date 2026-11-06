/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/lesson.js  (Phase 3 / Batch 2)
   محرك الدروس: lesson.html?n=رقم_المستوى
   - الدرس: شرح مصري + تشبيه + مثال قابل للتشغيل والتعديل + شرح سطر بسطر + شرح صوتي اختياري
   - التمارين (4 درجات) + التحدي النهائي: تصحيح فعلي عبر RPAGrader، والنقاط تُسجَّل فقط عند النجاح
   - الاختبار: 5 أسئلة، النجاح من 70% يكمل المستوى ويفتح التالي (القاعدة داخل RPAStore)
   - PYTHON BOT: نفس الشخصية من الصفحة الرئيسية (JS/bot.js) تتفاعل مع النجاح والخطأ
   كل النصوص التي يكتبها الطالب أو يطبعها البرنامج تُعرض عبر textContent.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document;
  var S = root.RPAStore, UI = root.RPAUI, CUR = root.RPA_CURRICULUM, GAME = root.RPA_GAME;
  var LEVELS = root.RPA_LEVELS || {};
  var Grader = root.RPAGrader, PG = root.RPAPlayground;
  var host = doc.getElementById('lessonRoot');
  if (!host || !S || !UI) return;
  if (!UI.requireLogin()) return;

  var icon = UI.icon, bidi = UI.bidi || function (x) { return x; };
  // كل نص عربي يمر بإصلاح الاتجاه، ما عدا عناصر الكود (dir=ltr) حتى لا تُنسخ علامات مخفية مع الكود
  var el = function (tag, attrs, children) {
    if (attrs && typeof attrs.text === 'string' && attrs.dir !== 'ltr') attrs.text = bidi(attrs.text);
    return UI.el(tag, attrs, children);
  };
  var params = new URLSearchParams(root.location.search);
  var n = parseInt(params.get('n'), 10);
  var meta = CUR.byN(n);
  var data = LEVELS[n];
  var user = S.currentUser();

  var TIER = {
    veryEasy: { label: 'سهل جدًا', cls: 'vez' },
    easy: { label: 'سهل', cls: 'ez' },
    medium: { label: 'متوسط', cls: 'md' },
    challenge: { label: 'تحدي', cls: 'ch' },
    final: { label: 'التحدي النهائي', cls: 'fn' }
  };

  /* ---------- أدوات نص ---------- */
  // يحوّل `كود` إلى <code> والأسطر الجديدة إلى فواصل — مع تهريب كامل (البيانات ثابتة من ملفات المنهج)
  function rich(text) {
    var frag = doc.createDocumentFragment();
    String(text).split('\n').forEach(function (line, li) {
      if (li > 0) frag.appendChild(doc.createElement('br'));
      line.split('`').forEach(function (part, i) {
        if (!part) return;
        if (i % 2 === 1) { var c = el('code', { class: 'icode', dir: 'ltr', text: part }); frag.appendChild(c); }
        else frag.appendChild(doc.createTextNode(bidi(part)));
      });
    });
    return frag;
  }
  function plain(text) { return String(text).replace(/`/g, ''); }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  document.title = (meta ? 'المستوى ' + n + ': ' + meta.title : 'الدرس') + ' | RASLAN PYTHON ACADEMY';

  /* ---------- حالات لا يُعرض فيها الدرس ---------- */
  function blocker(title, text, actions) {
    clear(host);
    var b = el('section', { class: 'lblock glass' });
    b.appendChild(el('div', { class: 'lblock__ico' }, [icon(actions && actions.icon || 'i-lock')]));
    b.appendChild(el('h1', { text: title }));
    b.appendChild(el('p', { text: text }));
    var row = el('div', { class: 'lblock__row' });
    (actions && actions.links || []).forEach(function (l) { row.appendChild(el('a', { href: l.href, class: 'btn btn--sm ' + (l.primary ? 'btn--primary' : 'btn--glass'), text: l.text })); });
    b.appendChild(row);
    host.appendChild(b);
  }
  if (!meta) {
    blocker('المستوى غير موجود', 'الرابط ده مش لمستوى من مستويات الأكاديمية.', { icon: 'i-alert', links: [{ href: 'dashboard.html', text: 'ارجع للوحتي', primary: true }] });
    return;
  }
  var state = S.levelState(n);
  if (state === 'locked') {
    var cur = S.summary().currentLevel || 1;
    blocker('المستوى ' + n + ' لسه مقفول', 'المستوى ده بيتفتح لما تنجح في اختبار المستوى ' + (n - 1) + ' بنسبة ' + CUR.quizPassPercent + '% أو أكتر.', { links: [{ href: 'lesson.html?n=' + cur, text: 'كمّل المستوى ' + cur, primary: true }, { href: 'dashboard.html', text: 'لوحتي' }] });
    return;
  }
  if (!CUR.isReady(n) || !data) {
    blocker('المستوى ' + n + ': ' + meta.title, 'محتوى المستوى ده بيتجهز حاليًا وهيتضاف قريبًا. تقدر تراجع المستويات اللي خلصتها أو تجرّب أي كود في RASLAN PYTHON PLAYGROUND.', { icon: 'i-clock', links: [{ href: 'dashboard.html', text: 'لوحتي', primary: true }, { href: 'playground.html', text: 'Playground' }] });
    return;
  }

  /* ------------------------------------------------------------------ */
  /* PYTHON BOT (إعادة استخدام JS/bot.js)                                */
  /* ------------------------------------------------------------------ */
  var bot = null, bubble = null, bubbleT = null;
  var LINES = {
    ok: ['برافو عليك! 🎉', 'إيه الحلاوة دي! حل صح 👏', 'كده إنت ماشي صح جدًا 💪', 'عاش يا بطل! 🔥'],
    err: ['ولا يهمك، الغلط بيعلّم 🙂 بص على الشرح تحت', 'قربت جدًا! راجع السطر اللي متعلّم عليه', 'خد نفس وجرّب تاني، إنت تقدر 💡'],
    run: ['شغّال! جرّب تغيّر في الكود وتشوف إيه اللي هيحصل', 'كده بالظبط، كمّل تجريب 👌'],
    quizOk: ['نجحت في الاختبار! المستوى اتقفل بنجاح 🏆'],
    quizBad: ['قربت! راجع الدرس وجرّب الاختبار تاني، أنا معاك 💙']
  };
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function say(text, expr, wave) {
    if (bubble) {
      bubble.classList.add('is-swapping');
      clearTimeout(bubbleT);
      bubbleT = setTimeout(function () { bubble.textContent = bidi(text); bubble.classList.remove('is-swapping'); }, 220);
    }
    if (bot) { try { if (expr) bot.setExpression(expr); if (wave) bot.wave(2200); } catch (e) { /* ignore */ } }
  }
  function mountBot(stage) {
    var wrap = el('div', { class: 'bot-wrap lbot__wrap' });
    var holder = el('div', { class: 'bot-canvas', role: 'img', 'aria-label': 'PYTHON BOT' });
    bubble = el('div', { class: 'bot-bubble lbot__bubble', role: 'status', 'aria-live': 'polite', text: data.bot.hello });
    wrap.appendChild(holder);
    stage.appendChild(bubble);
    stage.appendChild(wrap);
    if (typeof root.PythonBot === 'function') {
      try { bot = new root.PythonBot(holder, { followPointer: true, greet: true, autoExpressions: false }); }
      catch (e) { bot = null; }
    }
    wrap.addEventListener('click', function () { if (bot) { bot.nextExpression(); bot.wave(1600); } });
  }

  /* ------------------------------------------------------------------ */
  /* الشرح الصوتي (اختياري تمامًا)                                         */
  /* ------------------------------------------------------------------ */
  var Voice = (function () {
    var synth = root.speechSynthesis;
    var supported = !!(synth && root.SpeechSynthesisUtterance);
    var voice = null, checked = false, speakingBtn = null;
    function pickVoice() {
      if (!supported) return;
      var vs = synth.getVoices() || [];
      if (!vs.length) return;
      checked = true;
      voice = vs.filter(function (v) { return /^ar[-_]EG/i.test(v.lang); })[0] ||
              vs.filter(function (v) { return /^ar/i.test(v.lang); })[0] || null;
      refresh();
    }
    var listeners = [];
    function refresh() { listeners.forEach(function (f) { f(); }); }
    if (supported) {
      pickVoice();
      if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', pickVoice);
      else synth.onvoiceschanged = pickVoice;
    }
    function available() { return supported && !(checked && !voice); }
    function reason() {
      if (!supported) return 'الشرح الصوتي غير مدعوم في متصفحك. تقدر تكمّل الدرس عادي بالقراءة.';
      if (checked && !voice) return 'مفيش صوت عربي متثبت على جهازك، فالشرح الصوتي مش متاح. تقدر تكمّل الدرس عادي بالقراءة.';
      return '';
    }
    function stop() {
      if (!supported) return;
      try { synth.cancel(); } catch (e) { /* ignore */ }
      if (speakingBtn) { setBtn(speakingBtn, false); speakingBtn = null; }
    }
    function setBtn(b, on) {
      b.classList.toggle('is-on', on);
      b.querySelector('span').textContent = on ? 'إيقاف الصوت' : 'استمع للشرح';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    function speak(text, btn) {
      if (!available()) { UI.toast(reason(), null, 'i-info'); return; }
      if (speakingBtn === btn) { stop(); return; }
      stop();
      // نقسم النص لجمل قصيرة لأن بعض المتصفحات تقطع النصوص الطويلة
      var parts = (String(text).match(/[^.!؟?]+[.!؟?]*/g) || []).map(function (p) { return p.trim(); }).filter(Boolean);
      speakingBtn = btn; setBtn(btn, true);
      parts.forEach(function (p, i) {
        var u = new root.SpeechSynthesisUtterance(p);
        u.lang = voice ? voice.lang : 'ar-EG';
        if (voice) u.voice = voice;
        u.rate = 0.92;
        if (i === parts.length - 1) {
          u.onend = function () { if (speakingBtn === btn) { setBtn(btn, false); speakingBtn = null; } };
        }
        u.onerror = function () { if (speakingBtn === btn) { setBtn(btn, false); speakingBtn = null; } };
        synth.speak(u);
      });
    }
    return { speak: speak, stop: stop, available: available, reason: reason, onChange: function (f) { listeners.push(f); } };
  })();

  /* ------------------------------------------------------------------ */
  /* الهيكل                                                              */
  /* ------------------------------------------------------------------ */
  clear(host);
  var head = el('section', { class: 'lhead glass' });
  var headMain = el('div', { class: 'lhead__main' });
  headMain.appendChild(el('div', { class: 'lhead__row' }, [
    el('span', { class: 'lhead__num', text: String(n).padStart(2, '0') }),
    el('span', { class: 'badge badge--' + meta.group, text: CUR.groups[meta.group].label }),
    el('span', { class: 'lhead__state', id: 'lState' })
  ]));
  headMain.appendChild(el('h1', { class: 'lhead__title', text: meta.title }));
  headMain.appendChild(el('p', { class: 'lhead__desc', text: meta.desc }));
  head.appendChild(headMain);
  var stats = el('div', { class: 'lhead__stats' });
  stats.appendChild(el('div', { class: 'lstat' }, [el('strong', { id: 'lEx', text: '0/5' }), el('span', { text: 'تمارين محلولة' })]));
  stats.appendChild(el('div', { class: 'lstat' }, [el('strong', { id: 'lQuiz', text: '—' }), el('span', { text: 'أفضل اختبار' })]));
  stats.appendChild(el('div', { class: 'lstat' }, [el('strong', { id: 'lXp', text: '0' }), el('span', { text: 'XP' })]));
  head.appendChild(stats);
  host.appendChild(head);

  var layout = el('div', { class: 'llayout' });
  var main = el('div', { class: 'lmain' });
  var aside = el('aside', { class: 'laside', 'aria-label': 'PYTHON BOT والتنقل' });
  layout.appendChild(main); layout.appendChild(aside);
  host.appendChild(layout);

  // التبويبات
  var TABS = [
    { id: 'lesson', label: 'الدرس', icon: 'i-book' },
    { id: 'exercises', label: 'التمارين', icon: 'i-puzzle' },
    { id: 'final', label: 'التحدي النهائي', icon: 'i-game' },
    { id: 'quiz', label: 'الاختبار', icon: 'i-award' }
  ];
  var tabBar = el('div', { class: 'ltabs', role: 'tablist', 'aria-label': 'أجزاء المستوى' });
  var panels = {};
  TABS.forEach(function (t, i) {
    var b = el('button', { type: 'button', class: 'ltab', role: 'tab', id: 'tab-' + t.id, 'aria-controls': 'panel-' + t.id, 'data-tab': t.id }, [icon(t.icon), el('span', { text: t.label }), el('em', { class: 'ltab__mark', 'aria-hidden': 'true' })]);
    tabBar.appendChild(b);
    var p = el('section', { class: 'lpanel', role: 'tabpanel', id: 'panel-' + t.id, 'aria-labelledby': 'tab-' + t.id });
    panels[t.id] = p;
  });
  main.appendChild(tabBar);
  TABS.forEach(function (t) { main.appendChild(panels[t.id]); });

  var currentTab = null;
  function showTab(id, focus) {
    if (!panels[id]) id = 'lesson';
    currentTab = id;
    Voice.stop();
    TABS.forEach(function (t) {
      var on = t.id === id, b = doc.getElementById('tab-' + t.id);
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      panels[t.id].hidden = !on;
    });
    try { history.replaceState(null, '', '?n=' + n + '#' + id); } catch (e) { /* file:// */ }
    if (focus) doc.getElementById('tab-' + id).focus();
  }
  tabBar.addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { showTab(b.getAttribute('data-tab')); root.scrollTo({ top: tabBar.getBoundingClientRect().top + root.scrollY - 90, behavior: 'smooth' }); } });
  tabBar.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var i = TABS.map(function (t) { return t.id; }).indexOf(currentTab);
    i = (i + (e.key === 'ArrowLeft' ? 1 : -1) + TABS.length) % TABS.length; // RTL: اليسار = التالي
    showTab(TABS[i].id, true);
  });
  doc.addEventListener('click', function (e) { var g = e.target.closest && e.target.closest('[data-goto]'); if (g) { e.preventDefault(); showTab(g.getAttribute('data-goto')); root.scrollTo({ top: tabBar.getBoundingClientRect().top + root.scrollY - 90, behavior: 'smooth' }); } });

  /* ------------------------------------------------------------------ */
  /* الجانب: PYTHON BOT + الصوت + التنقل                                   */
  /* ------------------------------------------------------------------ */
  var botCard = el('div', { class: 'lbot glass' });
  var stage = el('div', { class: 'lbot__stage' });
  botCard.appendChild(stage);
  aside.appendChild(botCard);
  mountBot(stage);

  var voiceCard = el('div', { class: 'lside glass' });
  voiceCard.appendChild(el('h2', {}, [icon('i-play'), el('span', { text: 'الشرح الصوتي' })]));
  var voiceNote = el('p', { class: 'lside__note' });
  voiceCard.appendChild(voiceNote);
  aside.appendChild(voiceCard);
  function paintVoice() {
    voiceNote.textContent = Voice.available() ? 'اختياري: دوس «استمع للشرح» في أي جزء من الدرس عشان تسمعه بصوت عربي. جودة الصوت بتختلف حسب جهازك.' : Voice.reason();
    Array.prototype.forEach.call(doc.querySelectorAll('.lsay'), function (b) { b.disabled = !Voice.available(); b.title = Voice.available() ? '' : Voice.reason(); });
  }
  Voice.onChange(paintVoice);

  var navCard = el('div', { class: 'lside glass' });
  navCard.appendChild(el('h2', {}, [icon('i-layers'), el('span', { text: 'التنقل بين المستويات' })]));
  var navRow = el('div', { class: 'lside__nav' });
  navCard.appendChild(navRow);
  aside.appendChild(navCard);
  function paintNav() {
    clear(navRow);
    if (n > 1) navRow.appendChild(el('a', { href: 'lesson.html?n=' + (n - 1), class: 'btn btn--glass btn--sm' }, [el('span', { text: '→ المستوى ' + (n - 1) })]));
    var nextState = n < CUR.total ? S.levelState(n + 1) : 'locked';
    if (n < CUR.total) {
      if (nextState !== 'locked') navRow.appendChild(el('a', { href: 'lesson.html?n=' + (n + 1), class: 'btn btn--primary btn--sm' }, [el('span', { text: 'المستوى ' + (n + 1) + ' ←' })]));
      else navRow.appendChild(el('span', { class: 'lside__locked' }, [icon('i-lock'), el('span', { text: 'المستوى ' + (n + 1) + ' يتفتح بعد نجاحك في الاختبار' })]));
    } else if (S.levelState(n) === 'done') {
      navRow.appendChild(el('a', { href: 'project.html', class: 'btn btn--primary btn--sm' }, [el('span', { text: 'مشروع التخرج ←' })]));
    } else {
      navRow.appendChild(el('span', { class: 'lside__locked' }, [icon('i-lock'), el('span', { text: 'مشروع التخرج يتفتح بعد نجاحك في اختبار المستوى ده' })]));
    }
    navRow.appendChild(el('a', { href: 'dashboard.html', class: 'btn btn--glass btn--sm' }, [el('span', { text: 'لوحتي' })]));
  }

  /* ------------------------------------------------------------------ */
  /* تبويب الدرس                                                         */
  /* ------------------------------------------------------------------ */
  (function buildLesson() {
    var p = panels.lesson;
    var intro = el('div', { class: 'lintro glass' });
    intro.appendChild(el('h2', { text: 'هتتعلم في المستوى ده:' }));
    var ul = el('ul', { class: 'lgoals' });
    data.goals.forEach(function (g) { ul.appendChild(el('li', {}, [icon('i-check'), el('span', {}, [rich(g)])])); });
    intro.appendChild(ul);
    p.appendChild(intro);

    data.sections.forEach(function (s, i) {
      var sec = el('article', { class: 'lsec glass', id: 'sec-' + s.id });
      var h = el('header', { class: 'lsec__head' });
      h.appendChild(el('h2', {}, [el('span', { class: 'lsec__n', text: String(i + 1) }), el('span', { text: s.title })]));
      var sayBtn = el('button', { type: 'button', class: 'btn btn--glass btn--sm lsay', 'aria-pressed': 'false' }, [icon('i-play'), el('span', { text: 'استمع للشرح' })]);
      var spoken = s.title + '. ' + s.text.map(plain).join(' ') + ' ' + plain(s.analogy || '');
      sayBtn.addEventListener('click', function () { Voice.speak(spoken, sayBtn); });
      h.appendChild(sayBtn);
      sec.appendChild(h);
      s.text.forEach(function (t) { sec.appendChild(el('p', { class: 'lsec__p' }, [rich(t)])); });
      if (s.analogy) sec.appendChild(el('div', { class: 'lanalogy' }, [el('strong', { text: 'تخيّل كده 💡' }), el('p', {}, [rich(s.analogy)])]));
      if (s.example) {
        var exWrap = el('div', { class: 'lexample' });
        exWrap.appendChild(el('h3', { text: 'مثال تقدر تشغّله وتعدّل فيه' }));
        var pgHost = el('div');
        exWrap.appendChild(pgHost);
        PG.create(pgHost, { code: s.example.code, examples: false, compact: true, autoHeight: true, minLines: 3, fileName: 'example_' + (i + 1) + '.py',
          onResult: function (r) { if (r.ok) say(pick(LINES.run), 'wink'); else if (r.error && !r.stopped) say(pick(LINES.err), 'think'); } });
        var table = el('div', { class: 'llines' });
        table.appendChild(el('h4', { text: 'شرح الكود سطر بسطر' }));
        s.example.lines.forEach(function (ln) {
          var row = el('div', { class: 'llines__row' });
          row.appendChild(el('code', { class: 'llines__code', dir: 'ltr', text: ln[0] }));
          row.appendChild(el('span', { class: 'llines__why' }, [rich(ln[1])]));
          table.appendChild(row);
        });
        exWrap.appendChild(table);
        if (s.example.tip) exWrap.appendChild(el('p', { class: 'ltip' }, [icon('i-target'), el('span', {}, [rich(s.example.tip)])]));
        sec.appendChild(exWrap);
      }
      p.appendChild(sec);
    });
    var next = el('div', { class: 'lnext' });
    next.appendChild(el('p', { text: 'فهمت الدرس؟ يلا نطبّق على التمارين.' }));
    next.appendChild(el('button', { type: 'button', class: 'btn btn--primary', 'data-goto': 'exercises' }, [el('span', { text: 'ابدأ التمارين' }), icon('i-arrow')]));
    p.appendChild(next);
  })();

  /* ------------------------------------------------------------------ */
  /* التمارين والتحدي النهائي                                             */
  /* ------------------------------------------------------------------ */
  function solvedIds() {
    var pr = S.getProgress();
    var lv = pr && pr.levels[n];
    return { ex: lv ? lv.exercises : {}, challenge: !!(lv && lv.challenge) };
  }

  function xpFor(ex) { return ex === data.final ? GAME.xp.finalChallenge : GAME.xp.exercise[ex.tier]; }

  function buildExercise(ex, isFinal, index) {
    var tier = TIER[isFinal ? 'final' : ex.tier];
    var card = el('article', { class: 'lex glass', id: 'ex-' + ex.id, 'data-id': ex.id });
    var h = el('header', { class: 'lex__head' });
    h.appendChild(el('span', { class: 'lex__tier lex__tier--' + tier.cls, text: (isFinal ? '' : (index + 1) + ' • ') + tier.label }));
    h.appendChild(el('h3', { class: 'lex__title', text: ex.title }));
    h.appendChild(el('span', { class: 'lex__xp', text: '+' + xpFor(ex) + ' XP' }));
    var status = el('span', { class: 'lex__status' });
    h.appendChild(status);
    card.appendChild(h);
    card.appendChild(el('div', { class: 'lex__prompt' }, [rich(ex.prompt)]));
    var visible = ex.tests.filter(function (t) { return !t.hidden; }).length;
    card.appendChild(el('p', { class: 'lex__tests' }, [icon('i-shield'), el('span', { text: 'التصحيح بيشغّل كودك ' + (ex.tests.length > 1 ? 'على ' + ex.tests.length + ' حالات اختبار' + (ex.tests.length > visible ? ' (منها حالات إضافية بقيم مختلفة)' : '') : 'ويقارن النتيجة') + '، وبيتأكد كمان من طريقة الحل (المتغيرات والأوامر المطلوبة).' })]));

    var pgHost = el('div', { class: 'lex__pg' });
    card.appendChild(pgHost);
    var pg = PG.create(pgHost, { code: ex.starter || '', examples: false, compact: true, autoHeight: true, minLines: 5, maxHeight: 380, fileName: ex.id + '.py',
      persistKey: 'rpa.v1.draft.' + user.id + '.' + ex.id });

    var actions = el('div', { class: 'lex__actions' });
    var btnCheck = el('button', { type: 'button', class: 'btn btn--primary btn--sm' }, [icon('i-check'), el('span', { text: 'تحقق من حلّي' })]);
    var btnHint = el('button', { type: 'button', class: 'btn btn--glass btn--sm' }, [icon('i-info'), el('span', { text: 'تلميح' })]);
    var btnSol = el('button', { type: 'button', class: 'btn btn--glass btn--sm', disabled: true, title: 'يتفتح بعد 3 محاولات' }, [icon('i-eye'), el('span', { text: 'عرض الحل' })]);
    actions.appendChild(btnCheck); actions.appendChild(btnHint); actions.appendChild(btnSol);
    card.appendChild(actions);
    var hints = el('ol', { class: 'lex__hints', hidden: true });
    card.appendChild(hints);
    var fb = el('div', { class: 'lex__fb', role: 'status', 'aria-live': 'polite', hidden: true });
    card.appendChild(fb);
    var solBox = el('div', { class: 'lex__sol', hidden: true });
    card.appendChild(solBox);

    var fails = 0, hintShown = 0;
    function paintStatus() {
      var s = solvedIds();
      var done = isFinal ? s.challenge : !!s.ex[ex.id];
      card.classList.toggle('is-done', done);
      status.textContent = done ? '✓ اتحل' : '';
    }
    paintStatus();

    btnHint.addEventListener('click', function () {
      if (hintShown < ex.hints.length) {
        hints.appendChild(el('li', {}, [rich(ex.hints[hintShown])]));
        hintShown++;
        hints.hidden = false;
      }
      if (hintShown >= ex.hints.length) { btnHint.disabled = true; btnHint.querySelector('span').textContent = 'مفيش تلميحات تانية'; }
    });

    btnSol.addEventListener('click', function () {
      UI.confirmDialog({ title: 'عرض الحل؟', text: 'هتشوف حل نموذجي. افهمه واكتبه بإيدك في المحرر وجرّب؛ النقاط بتتحسب لما الحل اللي في المحرر ينجح في التصحيح.', confirmText: 'اعرض الحل' })
        .then(function (yes) {
          if (!yes) return;
          clear(solBox);
          solBox.appendChild(el('strong', { text: 'حل نموذجي:' }));
          solBox.appendChild(el('pre', { class: 'lex__solcode', dir: 'ltr', text: ex.solution }));
          solBox.hidden = false;
        });
    });

    function feedback(kind, nodes) {
      clear(fb);
      fb.className = 'lex__fb lex__fb--' + kind;
      nodes.forEach(function (x) { fb.appendChild(x); });
      fb.hidden = false;
    }

    btnCheck.addEventListener('click', function () {
      if (btnCheck.disabled) return;
      btnCheck.disabled = true;
      btnCheck.querySelector('span').textContent = 'بيصحّح…';
      feedback('wait', [el('p', { text: 'بنشغّل كودك على حالات الاختبار…' })]);
      Grader.check(ex, pg.getCode()).then(function (rep) {
        btnCheck.disabled = false;
        btnCheck.querySelector('span').textContent = 'تحقق من حلّي';
        if (rep.ok) {
          var res = isFinal ? S.recordChallenge(n) : S.recordExercise(n, ex.id, ex.tier);
          var nodes = [el('strong', { text: rep.total > 1 ? '✓ حل صحيح! نجح في كل حالات الاختبار (' + rep.passed + ' من ' + rep.total + ').' : '✓ حل صحيح! النتيجة وطريقة الحل مظبوطين.' })];
          if (res && res.ok && res.xpGained) nodes.push(el('p', { text: 'كسبت +' + res.xpGained + ' XP' + (res.xpGained > xpFor(ex) ? ' (منها مكافأة السلسلة اليومية)' : '') }));
          else if (res && res.ok && res.already) nodes.push(el('p', { text: 'التمرين ده محلول قبل كده، فالنقاط محسوبة من الأول.' }));
          else if (res && !res.ok) nodes.push(el('p', { text: 'تعذّر حفظ النتيجة: ' + UI.errorText(res.error) }));
          feedback('ok', nodes);
          say(pick(LINES.ok), 'happy', true);
          if (res && res.ok) announce(res);
          paintStatus(); paintHead();
          return;
        }
        fails++;
        if (fails >= 3) { btnSol.disabled = false; btnSol.title = ''; }
        if (rep.empty) { feedback('err', [el('strong', { text: rep.msg })]); return; }
        var f = rep.fail || {};
        var nodes2 = [];
        if (rep.srcMsg || f.kind === 'src') {
          nodes2.push(el('strong', { text: rep.total && rep.passed === rep.total ? 'المخرجات صح 👍 بس في شرط ناقص في طريقة الحل:' : 'في شرط ناقص في طريقة الحل:' }));
          nodes2.push(el('p', { text: rep.msg }));
        } else {
          nodes2.push(el('strong', { text: rep.total > 1 ? '✗ حالة الاختبار ' + (rep.failIndex + 1) + ' من ' + rep.total + (rep.hidden ? ' (حالة إضافية بقيم مختلفة)' : '') : '✗ الحل لسه مش مظبوط' }));
          if (rep.inputs && rep.inputs.length) nodes2.push(el('p', { class: 'lex__inp' }, [el('span', { text: 'المدخلات اللي اتجرّبت بالترتيب: ' })].concat(rep.inputs.map(function (v) { return el('code', { dir: 'ltr', text: v === '' ? '(فاضي)' : v }); }))));
          if (f.kind === 'error' && f.error) {
            nodes2.push(el('p', { class: 'lex__errt', text: f.error.title + (f.error.line ? ' — السطر ' + f.error.line : '') }));
            nodes2.push(el('p', { text: f.error.explain }));
            if (f.error.hint) nodes2.push(el('p', { class: 'lex__hint' }, [el('b', { text: 'تلميح: ' }), doc.createTextNode(bidi(f.error.hint))]));
          } else {
            nodes2.push(el('p', { text: rep.msg }));
            if (f.expected !== undefined) {
              var cmp = el('div', { class: 'lex__cmp' });
              cmp.appendChild(el('div', {}, [el('span', { text: 'المطلوب' }), el('pre', { dir: 'ltr', text: Grader.show(f.expected) })]));
              cmp.appendChild(el('div', {}, [el('span', { text: 'اللي طلع عندك' }), el('pre', { dir: 'ltr', text: Grader.show(f.got || '') })]));
              nodes2.push(cmp);
            }
          }
        }
        if (fails >= 3) nodes2.push(el('p', { class: 'lex__more', text: 'لو محتاج مساعدة، زرار «عرض الحل» اتفتح.' }));
        feedback('err', nodes2);
        say(pick(LINES.err), 'think');
      });
    });
    return card;
  }

  (function buildExercises() {
    var p = panels.exercises;
    p.appendChild(el('div', { class: 'lpanel__intro' }, [el('p', { text: '4 تمارين متدرجة من السهل للصعب. اكتب الحل في المحرر، جرّبه بـ «تشغيل»، ولما تبقى جاهز دوس «تحقق من حلّي». النقاط بتتحسب مرة واحدة لكل تمرين لما حلك ينجح في كل الحالات.' })]));
    data.exercises.forEach(function (ex, i) { p.appendChild(buildExercise(ex, false, i)); });
    var next = el('div', { class: 'lnext' });
    next.appendChild(el('button', { type: 'button', class: 'btn btn--primary', 'data-goto': 'final' }, [el('span', { text: 'على التحدي النهائي' }), icon('i-arrow')]));
    p.appendChild(next);
  })();

  (function buildFinal() {
    var p = panels.final;
    p.appendChild(el('div', { class: 'lpanel__intro' }, [el('p', { text: 'التحدي النهائي بيجمع كل أفكار المستوى في برنامج واحد. ده أصعب جزء، خد وقتك.' })]));
    p.appendChild(buildExercise(data.final, true, 0));
    var next = el('div', { class: 'lnext' });
    next.appendChild(el('button', { type: 'button', class: 'btn btn--primary', 'data-goto': 'quiz' }, [el('span', { text: 'على الاختبار' }), icon('i-arrow')]));
    p.appendChild(next);
  })();

  /* ------------------------------------------------------------------ */
  /* الاختبار                                                            */
  /* ------------------------------------------------------------------ */
  (function buildQuiz() {
    var p = panels.quiz;
    p.appendChild(el('div', { class: 'lpanel__intro' }, [el('p', { text: data.quiz.length + ' أسئلة. محتاج ' + CUR.quizPassPercent + '% أو أكتر عشان تنجح وتكمّل المستوى ويتفتح اللي بعده. تقدر تعيد الاختبار أكتر من مرة.' })]));
    var form = el('form', { class: 'lquiz', novalidate: true });
    data.quiz.forEach(function (q, qi) {
      var fs = el('fieldset', { class: 'lq glass', 'data-q': String(qi) });
      fs.appendChild(el('legend', { class: 'lq__q' }, [el('span', { class: 'lq__n', text: String(qi + 1) }), el('span', {}, [rich(q.q)])]));
      if (q.code) fs.appendChild(el('pre', { class: 'lq__code', dir: 'ltr', text: q.code }));
      var opts = el('div', { class: 'lq__opts' });
      q.options.forEach(function (o, oi) {
        var id = 'q' + qi + 'o' + oi;
        var lab = el('label', { class: 'lq__opt', for: id });
        lab.appendChild(el('input', { type: 'radio', name: 'q' + qi, id: id, value: String(oi) }));
        lab.appendChild(el('span', {}, [rich(o)]));
        opts.appendChild(lab);
      });
      fs.appendChild(opts);
      fs.appendChild(el('p', { class: 'lq__why', hidden: true }));
      form.appendChild(fs);
    });
    var bar = el('div', { class: 'lquiz__bar' });
    var submit = el('button', { type: 'submit', class: 'btn btn--primary', disabled: true }, [icon('i-check'), el('span', { text: 'صحّح الاختبار' })]);
    var retry = el('button', { type: 'button', class: 'btn btn--glass', hidden: true }, [el('span', { text: 'أعد الاختبار' })]);
    var left = el('span', { class: 'lquiz__left' });
    bar.appendChild(submit); bar.appendChild(retry); bar.appendChild(left);
    form.appendChild(bar);
    var result = el('div', { class: 'lquiz__result', role: 'status', 'aria-live': 'polite', hidden: true });
    p.appendChild(form);
    p.appendChild(result);

    function answered() { var c = 0; data.quiz.forEach(function (q, i) { if (form.querySelector('input[name="q' + i + '"]:checked')) c++; }); return c; }
    function upd() { var a = answered(); submit.disabled = a < data.quiz.length; left.textContent = a < data.quiz.length ? 'جاوبت ' + a + ' من ' + data.quiz.length : ''; }
    form.addEventListener('change', upd); upd();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (answered() < data.quiz.length) return;
      var right = 0;
      data.quiz.forEach(function (q, i) {
        var chosen = parseInt(form.querySelector('input[name="q' + i + '"]:checked').value, 10);
        var fs = form.querySelector('[data-q="' + i + '"]');
        var ok = chosen === q.answer;
        if (ok) right++;
        fs.classList.add(ok ? 'is-right' : 'is-wrong');
        Array.prototype.forEach.call(fs.querySelectorAll('.lq__opt'), function (lab, oi) {
          lab.classList.toggle('is-answer', oi === q.answer);
          lab.classList.toggle('is-chosen-wrong', oi === chosen && !ok);
          lab.querySelector('input').disabled = true;
        });
        var why = fs.querySelector('.lq__why');
        why.textContent = bidi((ok ? '✓ ' : '✗ الإجابة الصح: ' + plain(q.options[q.answer]) + ' — ') + q.why);
        why.hidden = false;
      });
      var pct = Math.round(right / data.quiz.length * 100);
      var res = S.recordQuiz(n, pct);
      submit.hidden = true; retry.hidden = false;
      clear(result);
      result.className = 'lquiz__result glass ' + (pct >= CUR.quizPassPercent ? 'is-pass' : 'is-fail');
      result.appendChild(el('strong', { class: 'lquiz__pct', text: pct + '%' }));
      result.appendChild(el('p', { text: 'جاوبت صح على ' + right + ' من ' + data.quiz.length + '.' }));
      if (!res || !res.ok) {
        result.appendChild(el('p', { text: 'تعذّر حفظ النتيجة: ' + UI.errorText(res && res.error) }));
      } else if (res.passed) {
        result.appendChild(el('p', { text: res.justCompleted ? 'مبروك! أكملت المستوى ' + n + ' بنجاح.' : 'نجحت! المستوى ده مكتمل من قبل.' }));
        if (res.xpGained) result.appendChild(el('p', { text: '+' + res.xpGained + ' XP' }));
        var row = el('div', { class: 'lquiz__next' });
        if (n < CUR.total && CUR.isReady(n + 1)) row.appendChild(el('a', { href: 'lesson.html?n=' + (n + 1), class: 'btn btn--primary' }, [el('span', { text: 'ابدأ المستوى ' + (n + 1) }), icon('i-arrow')]));
        else if (n < CUR.total) row.appendChild(el('p', { class: 'lside__note', text: 'المستوى ' + (n + 1) + ' اتفتح في لوحتك، ومحتواه بيتجهز وهيتضاف قريبًا.' }));
        else row.appendChild(el('a', { href: 'project.html', class: 'btn btn--primary' }, [el('span', { text: 'ابدأ مشروع التخرج' }), icon('i-arrow')]));
        row.appendChild(el('a', { href: 'dashboard.html', class: 'btn btn--glass' }, [el('span', { text: 'لوحتي' })]));
        result.appendChild(row);
        say(LINES.quizOk[0] + ' ' + data.bot.done, 'love', true);
        announce(res);
      } else {
        result.appendChild(el('p', { text: 'محتاج ' + CUR.quizPassPercent + '% عشان تنجح. راجع الإجابات والشرح تحت كل سؤال وجرّب تاني.' }));
        say(LINES.quizBad[0], 'think');
      }
      result.hidden = false;
      paintHead(); paintNav();
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    retry.addEventListener('click', function () {
      form.reset();
      Array.prototype.forEach.call(form.querySelectorAll('.lq'), function (fs) {
        fs.classList.remove('is-right', 'is-wrong');
        fs.querySelector('.lq__why').hidden = true;
        Array.prototype.forEach.call(fs.querySelectorAll('.lq__opt'), function (lab) { lab.classList.remove('is-answer', 'is-chosen-wrong'); lab.querySelector('input').disabled = false; });
      });
      retry.hidden = true; submit.hidden = false; result.hidden = true; upd();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* إشعارات وتحديث الرأس                                                */
  /* ------------------------------------------------------------------ */
  function announce(res) {
    (res.newBadges || []).forEach(function (b) { UI.toast('شارة جديدة: ' + b.title, 'badge', b.icon, 5200); });
    if (res.rankUp) UI.toast('رتبة جديدة: ' + res.rankUp.label, 'badge', res.rankUp.icon, 5200);
  }
  function paintHead() {
    var info = S.levelInfo(n), s = solvedIds(), sum = S.summary();
    if (!info || !sum) return;
    var exDone = data.exercises.filter(function (e) { return s.ex[e.id]; }).length + (s.challenge ? 1 : 0);
    doc.getElementById('lEx').textContent = exDone + '/' + (data.exercises.length + 1);
    doc.getElementById('lQuiz').textContent = info.quizAttempts ? info.quizBest + '%' : '—';
    doc.getElementById('lXp').textContent = String(sum.xp);
    var st = doc.getElementById('lState');
    st.textContent = info.state === 'done' ? '✓ مكتمل' : 'قيد التعلّم';
    st.className = 'lhead__state lhead__state--' + info.state;
    // علامات التبويبات
    var marks = { exercises: data.exercises.every(function (e) { return s.ex[e.id]; }), final: s.challenge, quiz: info.state === 'done' };
    Object.keys(marks).forEach(function (k) { doc.getElementById('tab-' + k).classList.toggle('is-done', !!marks[k]); });
  }
  root.addEventListener('rpa:store', function (e) {
    var t = e.detail && e.detail.type;
    if (t === 'logout') { root.location.replace('auth.html#login'); return; }
    paintHead(); paintNav();
  });

  paintVoice(); paintNav(); paintHead();
  showTab((root.location.hash || '').replace('#', '') || 'lesson');

  // للاختبار: الوصول لمكوّن الصوت
  root.RPALesson = { n: n, voice: Voice, showTab: showTab };
})(window);
