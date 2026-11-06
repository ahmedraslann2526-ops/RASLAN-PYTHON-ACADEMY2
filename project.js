/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/project.js  (Phase 3 / Batch 4)
   صفحة مشروع التخرج: محرر واحد (todo.py) محفوظ للطالب + 5 مراحل بتصحيح فعلي.
   - المشروع يُفتح بعد إكمال المستوى 20 (القاعدة داخل RPAStore).
   - كل مرحلة تُصحَّح على كود المحرر الحالي، وبالترتيب، ونقاطها تُمنح مرة واحدة فقط.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document;
  var S = root.RPAStore, UI = root.RPAUI, GAME = root.RPA_GAME, PRJ = root.RPA_PROJECT;
  var Grader = root.RPAGrader, PG = root.RPAPlayground;
  var host = doc.getElementById('projectRoot');
  if (!host || !S || !UI || !PRJ) return;
  if (!UI.requireLogin()) return;

  var icon = UI.icon, bidi = UI.bidi || function (x) { return x; };
  var el = function (tag, attrs, children) {
    if (attrs && typeof attrs.text === 'string' && attrs.dir !== 'ltr') attrs.text = bidi(attrs.text);
    return UI.el(tag, attrs, children);
  };
  function rich(text) {
    var frag = doc.createDocumentFragment();
    String(text).split('\n').forEach(function (line, li) {
      if (li > 0) frag.appendChild(doc.createElement('br'));
      line.split('`').forEach(function (part, i) {
        if (!part) return;
        if (i % 2 === 1) frag.appendChild(el('code', { class: 'icode', dir: 'ltr', text: part }));
        else frag.appendChild(doc.createTextNode(bidi(part)));
      });
    });
    return frag;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  var user = S.currentUser();

  /* ---------- مقفول؟ ---------- */
  var st = S.projectState();
  clear(host);
  if (!st.unlocked) {
    var b = el('section', { class: 'lblock glass' });
    b.appendChild(el('div', { class: 'lblock__ico' }, [icon('i-lock')]));
    b.appendChild(el('h1', { text: 'مشروع التخرج لسه مقفول' }));
    b.appendChild(el('p', { text: 'المشروع بيتفتح بعد ما تخلّص المستويات العشرين وتنجح في اختبار المستوى 20.' }));
    var row = el('div', { class: 'lblock__row' });
    var cur = S.summary().currentLevel || 20;
    row.appendChild(el('a', { href: 'lesson.html?n=' + cur, class: 'btn btn--primary btn--sm', text: 'كمّل المستوى ' + cur }));
    row.appendChild(el('a', { href: 'dashboard.html', class: 'btn btn--glass btn--sm', text: 'لوحتي' }));
    b.appendChild(row);
    host.appendChild(b);
    return;
  }

  /* ---------- الرأس ---------- */
  var head = el('section', { class: 'lhead glass' });
  var hm = el('div', { class: 'lhead__main' });
  hm.appendChild(el('div', { class: 'lhead__row' }, [el('span', { class: 'badge badge--advanced', text: 'مشروع التخرج' }), el('span', { class: 'lhead__state', id: 'pjState' })]));
  var h1 = el('h1', { class: 'lhead__title pj-title' });
  h1.innerHTML = 'RASLAN <b>PYTHON</b> GRADUATION PROJECT';
  hm.appendChild(h1);
  hm.appendChild(el('p', { class: 'lhead__desc', text: PRJ.subtitle + ' — طبّق كل اللي اتعلمته في برنامج حقيقي على 5 مراحل.' }));
  head.appendChild(hm);
  var stats = el('div', { class: 'lhead__stats' });
  stats.appendChild(el('div', { class: 'lstat' }, [el('strong', { id: 'pjCount', text: '0/5' }), el('span', { text: 'مراحل' })]));
  stats.appendChild(el('div', { class: 'lstat' }, [el('strong', { id: 'pjXp', text: '0' }), el('span', { text: 'XP' })]));
  head.appendChild(stats);
  host.appendChild(head);

  var layout = el('div', { class: 'llayout' });
  var main = el('div', { class: 'lmain' });
  var aside = el('aside', { class: 'laside', 'aria-label': 'PYTHON BOT' });
  layout.appendChild(main); layout.appendChild(aside);
  host.appendChild(layout);

  /* ---------- PYTHON BOT (نفس الشخصية) ---------- */
  var bot = null, bubble = null, bubbleT = null;
  (function () {
    var card = el('div', { class: 'lbot glass' }), stage = el('div', { class: 'lbot__stage' });
    var wrap = el('div', { class: 'bot-wrap lbot__wrap' }), holder = el('div', { class: 'bot-canvas', role: 'img', 'aria-label': 'PYTHON BOT' });
    bubble = el('div', { class: 'bot-bubble lbot__bubble', role: 'status', 'aria-live': 'polite', text: 'وصلت لمشروع التخرج! 🎓 هنبني برنامج To-Do List حقيقي خطوة بخطوة. أنا معاك.' });
    wrap.appendChild(holder); stage.appendChild(bubble); stage.appendChild(wrap); card.appendChild(stage); aside.appendChild(card);
    if (typeof root.PythonBot === 'function') { try { bot = new root.PythonBot(holder, { followPointer: true, greet: true, autoExpressions: false }); } catch (e) { bot = null; } }
    wrap.addEventListener('click', function () { if (bot) { bot.nextExpression(); bot.wave(1600); } });
  })();
  function say(text, expr, wave) {
    if (bubble) { bubble.classList.add('is-swapping'); clearTimeout(bubbleT); bubbleT = setTimeout(function () { bubble.textContent = bidi(text); bubble.classList.remove('is-swapping'); }, 220); }
    if (bot) { try { if (expr) bot.setExpression(expr); if (wave) bot.wave(2200); } catch (e) { /* ignore */ } }
  }
  var side = el('div', { class: 'lside glass' });
  side.appendChild(el('h2', {}, [icon('i-info'), el('span', { text: 'إزاي تشتغل' })]));
  side.appendChild(el('p', { class: 'lside__note', text: 'اكتب كل المراحل في نفس الملف todo.py. الكود بيتحفظ تلقائيًا. جرّب برنامجك بـ «تشغيل»، ولما تخلّص مرحلة دوس «تحقق من المرحلة». كل مرحلة بتتصحح على الكود الحالي كله.' }));
  side.appendChild(el('a', { href: 'dashboard.html', class: 'btn btn--glass btn--sm', text: 'لوحتي' }));
  aside.appendChild(side);

  /* ---------- مقدمة ---------- */
  var intro = el('section', { class: 'pj-intro glass' });
  intro.appendChild(el('h2', { text: 'فكرة المشروع' }));
  intro.appendChild(el('p', { text: 'برنامج إدارة مهام بيشتغل من خلال أوامر: تضيف مهمة، تعرض مهامك، تخلّص أو تحذف مهمة، وتحفظها في ملف عشان ترجع لها. هتستخدم الدوال والقواميس والقوائم والحلقات والملفات والأخطاء.' }));
  var ol = el('ol');
  PRJ.stages.forEach(function (s) { ol.appendChild(el('li', { text: s.title.replace(/^المرحلة \d+: /, '') })); });
  intro.appendChild(ol);
  main.appendChild(intro);

  /* ---------- المحرر ---------- */
  var edSec = el('section', { class: 'pj-editor glass', id: 'pjEditor' });
  edSec.appendChild(el('h2', { text: 'ملف المشروع: todo.py' }));
  edSec.appendChild(el('p', { text: 'في المرحلة 5 لما تشغّل البرنامج هيسألك عن الأوامر في خانة الإدخال تحت المخرجات (add / list / done / delete / save / quit).' }));
  var pgHost = el('div');
  edSec.appendChild(pgHost);
  main.appendChild(edSec);
  var pg = PG.create(pgHost, { code: PRJ.starter, examples: false, fileName: PRJ.fileName, minLines: 20,
    persistKey: 'rpa.v1.draft.' + user.id + '.project',
    onResult: function (r) { if (r.error && !r.stopped && !r.canceled) say('في خطأ في الكود، بص على الشرح تحت المخرجات 💡', 'think'); } });

  /* ---------- المراحل ---------- */
  var list = el('div', { class: 'pj-stages' });
  main.appendChild(list);
  var cards = {};

  function buildStage(s, idx) {
    var card = el('article', { class: 'lex glass pj-stage', id: 'stage-' + s.id });
    var h = el('header', { class: 'lex__head' });
    h.appendChild(el('span', { class: 'lex__tier lex__tier--fn', text: 'المرحلة ' + (idx + 1) }));
    h.appendChild(el('h3', { class: 'lex__title', text: s.title.replace(/^المرحلة \d+: /, '') }));
    h.appendChild(el('span', { class: 'lex__xp', text: '+' + GAME.xp.projectStage + ' XP' + (idx === PRJ.stages.length - 1 ? ' +' + GAME.xp.projectComplete : '') }));
    var status = el('span', { class: 'lex__status' });
    h.appendChild(status);
    card.appendChild(h);
    var chips = el('div', { class: 'pj-chips' });
    s.concepts.forEach(function (c) { chips.appendChild(el('span', { text: c })); });
    card.appendChild(chips);
    card.appendChild(el('p', { class: 'lex__prompt', text: s.intro }));
    var req = el('ul', { class: 'pj-req' });
    s.requirements.forEach(function (r) { req.appendChild(el('li', {}, [rich(r)])); });
    card.appendChild(req);
    var nTests = s.tests.reduce(function (a, t) { return a + (t.calls ? t.calls.length : 0) + (t.exact !== undefined ? 1 : 0); }, 0);
    card.appendChild(el('p', { class: 'lex__tests' }, [icon('i-shield'), el('span', { text: 'التصحيح بيشغّل ملفك ويختبر دوالك وبرنامجك فعليًا (' + nTests + ' فحص' + (s.tests.some(function (t) { return t.hidden; }) ? '، منها فحوص إضافية مخفية' : '') + ').' })]));
    var lockMsg = el('p', { class: 'pj-lockmsg' }, [icon('i-lock'), el('span', { text: 'خلّص المرحلة اللي قبلها الأول.' })]);
    card.appendChild(lockMsg);
    var actions = el('div', { class: 'lex__actions' });
    var btnCheck = el('button', { type: 'button', class: 'btn btn--primary btn--sm' }, [icon('i-check'), el('span', { text: 'تحقق من المرحلة ' + (idx + 1) })]);
    var btnHint = el('button', { type: 'button', class: 'btn btn--glass btn--sm' }, [icon('i-info'), el('span', { text: 'تلميح' })]);
    var btnGo = el('button', { type: 'button', class: 'btn btn--glass btn--sm' }, [icon('i-edit'), el('span', { text: 'روح للمحرر' })]);
    actions.appendChild(btnCheck); actions.appendChild(btnHint); actions.appendChild(btnGo);
    card.appendChild(actions);
    var hints = el('ol', { class: 'lex__hints', hidden: true });
    card.appendChild(hints);
    var fb = el('div', { class: 'lex__fb', role: 'status', 'aria-live': 'polite', hidden: true });
    card.appendChild(fb);

    var hintShown = 0;
    btnHint.addEventListener('click', function () {
      if (hintShown < s.hints.length) { hints.appendChild(el('li', {}, [rich(s.hints[hintShown])])); hintShown++; hints.hidden = false; }
      if (hintShown >= s.hints.length) { btnHint.disabled = true; btnHint.querySelector('span').textContent = 'مفيش تلميحات تانية'; }
    });
    btnGo.addEventListener('click', function () { edSec.scrollIntoView({ behavior: 'smooth', block: 'start' }); pg.focus(); });

    function feedback(kind, nodes) { clear(fb); fb.className = 'lex__fb lex__fb--' + kind; nodes.forEach(function (x) { fb.appendChild(x); }); fb.hidden = false; }

    btnCheck.addEventListener('click', function () {
      if (btnCheck.disabled) return;
      btnCheck.disabled = true; btnCheck.querySelector('span').textContent = 'بيصحّح…';
      feedback('wait', [el('p', { text: 'بنشغّل ملفك ونختبر المرحلة…' })]);
      Grader.check(s, pg.getCode()).then(function (rep) {
        btnCheck.querySelector('span').textContent = 'تحقق من المرحلة ' + (idx + 1);
        paint();
        if (rep.ok) {
          var res = S.recordProjectStage(s.id);
          var nodes = [el('strong', { text: '✓ المرحلة ' + (idx + 1) + ' سليمة! نجحت كل الفحوص.' })];
          if (res.ok && res.xpGained) nodes.push(el('p', { text: 'كسبت +' + res.xpGained + ' XP' }));
          else if (res.ok && res.already) nodes.push(el('p', { text: 'المرحلة دي متسجلة قبل كده، والنقاط محسوبة من الأول.' }));
          else if (!res.ok) nodes.push(el('p', { text: 'تعذّر حفظ النتيجة: ' + UI.errorText(res.error) }));
          feedback('ok', nodes);
          say(res.projectDone ? 'مبروووك! خلّصت مشروع التخرج 🎉🎓 روح استلم شهادتك!' : 'عاش! المرحلة ' + (idx + 1) + ' تمام. يلا على اللي بعدها 🚀', res.projectDone ? 'love' : 'happy', true);
          if (res.ok) { (res.newBadges || []).forEach(function (bd) { UI.toast('شارة جديدة: ' + bd.title, 'badge', bd.icon, 5200); }); if (res.rankUp) UI.toast('رتبة جديدة: ' + res.rankUp.label, 'badge', res.rankUp.icon, 5200); }
          paint();
          return;
        }
        var f = rep.fail || {}, nodes2 = [];
        if (rep.empty) { feedback('err', [el('strong', { text: rep.msg })]); return; }
        if (rep.srcMsg || f.kind === 'src') {
          nodes2.push(el('strong', { text: 'في شرط ناقص في الكود:' }));
          nodes2.push(el('p', { text: rep.msg }));
        } else {
          nodes2.push(el('strong', { text: '✗ الفحص ' + (rep.failIndex + 1) + ' من ' + rep.total + (rep.hidden ? ' (فحص إضافي)' : '') }));
          if (rep.inputs && rep.inputs.length) nodes2.push(el('p', { class: 'lex__inp' }, [el('span', { text: 'الأوامر/المدخلات اللي اتجرّبت بالترتيب: ' })].concat(rep.inputs.map(function (v) { return el('code', { dir: 'ltr', text: v.trim() === '' ? '(فاضي)' : v }); }))));
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
        feedback('err', nodes2);
        say('قربت! راجع رسالة الفحص اللي فشل وجرّب تاني 💡', 'think');
      });
    });

    function paint() {
      var state = S.projectState();
      var done = !!state.stages[s.id];
      var prevDone = idx === 0 || !!state.stages[PRJ.stages[idx - 1].id];
      card.classList.toggle('is-done', done);
      card.classList.toggle('is-locked', !prevDone && !done);
      status.textContent = done ? '✓ اتحلت' : '';
      lockMsg.hidden = prevDone || done;
      btnCheck.disabled = !prevDone && !done;
    }
    cards[s.id] = { paint: paint };
    paint();
    return card;
  }
  PRJ.stages.forEach(function (s, i) { list.appendChild(buildStage(s, i)); });

  /* ---------- النهاية ---------- */
  var doneCard = el('section', { class: 'pj-done glass', hidden: true });
  doneCard.appendChild(el('div', { class: 'lblock__ico' }, [icon('i-award')]));
  doneCard.appendChild(el('h2', { text: 'مبروك! أنهيت مشروع التخرج 🎓' }));
  doneCard.appendChild(el('p', { text: 'كده خلّصت المستويات العشرين ومشروع التخرج، وبقيت مستحق شهادة إتمام الأكاديمية.' }));
  doneCard.appendChild(el('a', { href: 'certificate.html', class: 'btn btn--primary' }, [el('span', { text: 'احصل على شهادتك' }), icon('i-arrow')]));
  main.appendChild(doneCard);

  function paintHead() {
    var state = S.projectState(), sum = S.summary();
    doc.getElementById('pjCount').textContent = state.completed + '/' + state.total;
    doc.getElementById('pjXp').textContent = String(sum.xp);
    var stEl = doc.getElementById('pjState');
    stEl.textContent = state.done ? '✓ مكتمل' : 'قيد التنفيذ';
    stEl.className = 'lhead__state lhead__state--' + (state.done ? 'done' : 'open');
    doneCard.hidden = !state.done;
    Object.keys(cards).forEach(function (k) { cards[k].paint(); });
  }
  root.addEventListener('rpa:store', function (e) {
    if (e.detail && e.detail.type === 'logout') { root.location.replace('auth.html#login'); return; }
    paintHead();
  });
  paintHead();
  root.RPAProjectPage = { pg: pg };
})(window);
