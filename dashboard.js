/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/dashboard.js  (Phase 2)
   لوحة الطالب: إحصائيات، خريطة 20 مستوى، شارات، نشاط، إدارة الحساب.
   كل بيانات المستخدم تُعرض عبر textContent.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document, S = root.RPAStore, UI = root.RPAUI, CUR = root.RPA_CURRICULUM, GAME = root.RPA_GAME;
  if (!S || !UI || !UI.requireLogin()) return;

  var $ = function (id) { return doc.getElementById(id); };
  var el = UI.el, icon = UI.icon;
  var dev = /(?:^|[?&])dev=1(?:&|$)/.test(root.location.search);

  function set(id, v) { $(id).textContent = String(v); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  function timeAgo(ts) {
    var d = Math.max(0, Date.now() - ts), m = Math.floor(d / 60000);
    if (m < 1) return 'الآن';
    if (m < 60) return 'منذ ' + m + ' دقيقة';
    var h = Math.floor(m / 60);
    if (h < 24) return 'منذ ' + h + ' ساعة';
    var days = Math.floor(h / 24);
    if (days < 30) return 'منذ ' + days + ' يوم';
    return new Date(ts).toLocaleDateString('ar-EG');
  }
  var ACT_ICON = { project: 'i-rocket', cert: 'i-award', join: 'i-heart', exercise: 'i-puzzle', challenge: 'i-game', level: 'i-check', quiz: 'i-award', badge: 'i-trophy', streak: 'i-flame' };

  /* ---------- الأقسام ---------- */
  function renderHero(sum) {
    $('dAvatar').textContent = UI.initial(sum.user.name);
    set('dName', sum.user.name);
    set('dRank', 'الرتبة: ' + sum.rank.label);
    set('dXpNow', sum.xp + ' XP');
    var bar = $('dRankBar');
    if (sum.nextRank) {
      set('dXpNext', 'الرتبة التالية «' + sum.nextRank.label + '» عند ' + sum.nextRank.min + ' XP');
    } else {
      set('dXpNext', 'وصلت لأعلى رتبة 🎉');
    }
    bar.setAttribute('aria-valuenow', String(sum.rankPercent));
    root.requestAnimationFrame(function () { $('dRankFill').style.width = sum.rankPercent + '%'; });
  }

  function ringSvg(pct) {
    var r = 40, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    var wrap = el('div', { class: 'ring', role: 'img', 'aria-label': 'نسبة الإكمال ' + pct + '%' });
    wrap.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="0.5" stop-color="#2f6bff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>' +
      '<circle class="ring__bg" cx="50" cy="50" r="40"/><circle class="ring__fg" cx="50" cy="50" r="40" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + c.toFixed(2) + '"/></svg><b>' + pct + '%</b>';
    root.requestAnimationFrame(function () { var fg = wrap.querySelector('.ring__fg'); if (fg) fg.style.strokeDashoffset = off.toFixed(2); });
    return wrap;
  }

  function renderNext(sum) {
    var box = $('dNext');
    clear(box);
    box.appendChild(ringSvg(sum.percent));
    var body = el('div', { class: 'dash__next__body' });
    if (sum.finished) {
      body.appendChild(el('h2', { text: sum.projectDone ? 'مبروك! أنهيت المنهج ومشروع التخرج 🎓' : 'مبروك! أكملت المستويات العشرين' }));
      body.appendChild(el('p', { text: sum.projectDone ? 'استلم شهادة إتمام الأكاديمية من صفحة الشهادات.' : 'فاضل خطوة أخيرة: مشروع التخرج To-Do List، وبعده تستلم شهادة إتمام الأكاديمية.' }));
      body.appendChild(el('a', { href: sum.projectDone ? 'certificate.html?type=full' : 'project.html', class: 'btn btn--primary btn--sm dash__go' }, [el('span', { text: sum.projectDone ? 'الشهادات' : (sum.projectStages ? 'كمّل مشروع التخرج' : 'ابدأ مشروع التخرج') }), icon('i-arrow')]));
    } else {
      var lv = CUR.byN(sum.currentLevel);
      var info = S.levelInfo(sum.currentLevel);
      body.appendChild(el('h2', { text: 'خطوتك الحالية: المستوى ' + lv.n + ' — ' + lv.title }));
      var line = lv.desc + (info && info.quizAttempts ? ' أفضل نتيجة لك في الاختبار: ' + info.quizBest + '%.' : '');
      body.appendChild(el('p', { text: line }));
      if (CUR.isReady && CUR.isReady(lv.n)) {
        var go = el('a', { href: 'lesson.html?n=' + lv.n, class: 'btn btn--primary btn--sm dash__go' }, [el('span', { text: (info && (info.quizAttempts || info.exercises) ? 'كمّل' : 'ابدأ') + ' المستوى ' + lv.n }), icon('i-arrow')]);
        body.appendChild(go);
      } else {
        body.appendChild(el('span', { class: 'dash__note' }, [icon('i-info'), el('span', { text: 'محتوى المستوى ' + lv.n + ' بيتجهز حاليًا وهيتضاف قريبًا. تقدر تراجع المستويات اللي خلصتها في أي وقت.' })]));
      }
    }
    box.appendChild(body);
  }

  function renderGrad(sum) {
    var box = $('dGrad');
    if (!box) return;
    clear(box);
    // مشروع التخرج
    var pj = el('article', { class: 'gcard glass' + (sum.projectDone ? ' gcard--done' : '') });
    pj.appendChild(el('div', { class: 'stat__ico' }, [icon('i-rocket')]));
    var pb = el('div', { class: 'gcard__body' });
    pb.appendChild(el('h3', { text: 'مشروع التخرج: To-Do List' }));
    pb.appendChild(el('p', { text: !sum.projectUnlocked ? 'بيتفتح بعد إكمال المستوى 20.' : sum.projectDone ? 'مكتمل ✓ (' + sum.projectTotal + '/' + sum.projectTotal + ' مراحل)' : 'المراحل: ' + sum.projectStages + ' / ' + sum.projectTotal }));
    var bar = el('div', { class: 'bar', role: 'progressbar', 'aria-label': 'تقدم مشروع التخرج', 'aria-valuemin': '0', 'aria-valuemax': String(sum.projectTotal), 'aria-valuenow': String(sum.projectStages) });
    var fill = el('span'); fill.style.width = Math.round(sum.projectStages / sum.projectTotal * 100) + '%'; bar.appendChild(fill);
    pb.appendChild(bar);
    if (sum.projectUnlocked) pb.appendChild(el('a', { href: 'project.html', class: 'btn btn--glass btn--sm' }, [el('span', { text: sum.projectDone ? 'افتح المشروع' : 'اشتغل على المشروع' })]));
    pj.appendChild(pb);
    box.appendChild(pj);
    // الشهادات
    var cs = S.certificateStatus();
    var ce = el('article', { class: 'gcard glass' + (sum.certCount ? ' gcard--done' : '') });
    ce.appendChild(el('div', { class: 'stat__ico' }, [icon('i-award')]));
    var cb = el('div', { class: 'gcard__body' });
    cb.appendChild(el('h3', { text: 'الشهادات' }));
    ['half', 'full'].forEach(function (k) {
      var c = cs[k];
      cb.appendChild(el('p', { text: c.title + ': ' + (c.issued ? 'صادرة ✓' : c.eligible ? 'مستحقة — استلمها الآن' : 'لسه (' + c.reasons.join(' و ') + ')') }));
    });
    cb.appendChild(el('a', { href: 'certificate.html', class: 'btn btn--glass btn--sm' }, [el('span', { text: 'صفحة الشهادات' })]));
    ce.appendChild(cb);
    box.appendChild(ce);
  }

  function renderStats(sum) {
    set('sXp', sum.xp);
    set('sLevels', sum.completed + '/' + sum.total);
    set('sStreak', sum.streak);
    set('sBest', sum.bestStreak > 0 ? '(الأفضل ' + sum.bestStreak + ')' : '');
    set('sBadges', sum.badgeCount + '/' + sum.badgeTotal);
    set('sEx', sum.exercises);
    set('sPerfect', sum.perfect);
    set('passPct', CUR.quizPassPercent);
  }

  function renderMap() {
    var map = $('levelMap');
    clear(map);
    CUR.levels.forEach(function (l) {
      var info = S.levelInfo(l.n);
      var st = info ? info.state : 'locked';
      var label = st === 'done' ? 'مكتمل' : st === 'open' ? 'مفتوح' : 'مقفل';
      var ico = st === 'done' ? 'i-check' : st === 'open' ? 'i-play' : 'i-lock';
      var linkable = st !== 'locked';
      var n = el(linkable ? 'a' : 'article', { class: 'node node--' + st + (linkable ? ' node--link' : ''), href: linkable ? 'lesson.html?n=' + l.n : null, 'aria-label': 'المستوى ' + l.n + ': ' + l.title + ' — ' + label });
      var top = el('div', { class: 'node__top' });
      top.appendChild(el('span', { class: 'node__n', text: String(l.n).padStart(2, '0') }));
      top.appendChild(el('span', { class: 'node__state' }, [icon(ico), el('span', { text: label })]));
      n.appendChild(top);
      n.appendChild(el('strong', { class: 'node__title', text: l.title }));
      var meta = [];
      if (info && info.quizAttempts) meta.push('أفضل اختبار: ' + info.quizBest + '%');
      if (info && info.exercises) meta.push(info.exercises + ' تمرين');
      if (info && info.challenge) meta.push('تحدي منجز');
      if (st === 'locked') meta.push('أكمل المستوى السابق لفتحه');
      else if (CUR.isReady && !CUR.isReady(l.n)) meta.push('المحتوى قيد الإعداد');
      if (meta.length) n.appendChild(el('span', { class: 'node__meta', text: meta.join(' • ') }));
      map.appendChild(n);
    });
  }

  function renderBadges(sum) {
    var p = S.getProgress();
    var grid = $('badgeGrid');
    clear(grid);
    set('badgesSub', 'حصلت على ' + sum.badgeCount + ' من ' + sum.badgeTotal + ' شارة.');
    var list = GAME.badges.slice().sort(function (a, b) { return (p.badges[b.id] ? 1 : 0) - (p.badges[a.id] ? 1 : 0); });
    list.forEach(function (b) {
      var on = !!p.badges[b.id];
      var c = el('article', { class: 'bdg ' + (on ? 'bdg--on' : 'bdg--off'), 'aria-label': b.title + (on ? ' (مكتسبة)' : ' (لم تُكتسب بعد)') });
      c.appendChild(el('div', { class: 'bdg__ico' }, [icon(on ? b.icon : 'i-lock')]));
      c.appendChild(el('strong', { text: b.title }));
      c.appendChild(el('span', { text: b.desc }));
      grid.appendChild(c);
    });
  }

  function renderActivity() {
    var p = S.getProgress(), ul = $('activity');
    clear(ul);
    var list = p.activity.slice().reverse().slice(0, 12);
    if (!list.length) { ul.appendChild(el('li', { class: 'activity__empty', text: 'لا يوجد نشاط بعد.' })); return; }
    list.forEach(function (a) {
      var li = el('li');
      li.appendChild(icon(ACT_ICON[a.type] || 'i-star'));
      li.appendChild(el('span', { class: 'activity__text', text: a.text }));
      li.appendChild(el('span', { class: 'activity__xp', text: a.xp ? '+' + a.xp + ' XP' : '' }));
      li.appendChild(el('span', { class: 'activity__time', text: timeAgo(a.t) }));
      ul.appendChild(li);
    });
  }

  function renderStorage() {
    var si = S.storageInfo();
    var kb = Math.max(1, Math.round(si.bytes / 1024));
    var t = si.persistent ? 'المساحة المستخدمة حاليًا نحو ' + kb + ' كيلوبايت من حوالي 5 ميجابايت متاحة.' : '⚠ المتصفح يمنع الحفظ الدائم الآن، فلن تبقى بياناتك بعد إغلاق الصفحة.';
    if (!si.strongHash) t += ' (متصفحك لا يدعم التشفير القوي لكلمة المرور.)';
    set('storageNote', t);
  }

  function renderDev(sum) {
    $('devPanel').hidden = !dev;
    if (dev) set('devLevel', sum.finished ? 'اكتملت كلها' : sum.currentLevel);
  }

  function renderAll() {
    var sum = S.summary();
    if (!sum) { root.location.replace('auth.html#login'); return; }
    $('dash').hidden = false;
    renderHero(sum); renderNext(sum); renderGrad(sum); renderStats(sum); renderMap(); renderBadges(sum); renderActivity(); renderStorage(); renderDev(sum);
    if (doc.activeElement !== $('setName')) $('setName').value = sum.user.name;
  }

  /* ---------- إشعارات النتائج (نقاط، شارات، رتبة) ---------- */
  function announce(res) {
    if (!res || !res.ok) { if (res) UI.toast(UI.errorText(res.error), 'error'); return; }
    if (res.xpGained) UI.toast('+' + res.xpGained + ' XP', 'ok', 'i-bolt');
    else if (res.already) UI.toast('هذا التمرين محسوب من قبل ولا تتكرر نقاطه.', null, 'i-info');
    if (typeof res.passed === 'boolean') {
      UI.toast(res.passed ? 'نجحت في الاختبار بنسبة ' + res.percent + '%' + (res.nextUnlocked ? ' — تم فتح المستوى ' + res.nextUnlocked : '') : 'نسبتك ' + res.percent + '% — المطلوب ' + CUR.quizPassPercent + '% للنجاح', res.passed ? 'ok' : 'error');
    }
    (res.newBadges || []).forEach(function (b) { UI.toast('شارة جديدة: ' + b.title, 'badge', b.icon, 5200); });
    if (res.rankUp) UI.toast('رتبة جديدة: ' + res.rankUp.label, 'badge', res.rankUp.icon, 5200);
  }

  /* ---------- أدوات المطوّر ---------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-dev]');
    if (!b || !dev) return;
    var sum = S.summary();
    if (!sum || sum.finished) { UI.toast('كل المستويات مكتملة.', null); return; }
    var n = sum.currentLevel, k = b.getAttribute('data-dev'), res;
    if (k === 'exercise') res = S.recordExercise(n, 'dev' + Date.now().toString(36), 'medium');
    else if (k === 'challenge') res = S.recordChallenge(n);
    else res = S.recordQuiz(n, k === 'q60' ? 60 : k === 'q70' ? 70 : 100);
    announce(res);
  });

  /* ---------- الاسم ---------- */
  $('nameForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var r = S.updateName($('setName').value);
    if (r.ok) { $('setNameErr').textContent = ''; $('setName').removeAttribute('aria-invalid'); UI.toast('تم حفظ الاسم.', 'ok'); renderAll(); }
    else { $('setNameErr').textContent = UI.errorText(r.error); $('setName').setAttribute('aria-invalid', 'true'); }
  });

  /* ---------- كلمة المرور ---------- */
  $('pwForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var o = $('pwOld').value, n1 = $('pwNew').value, n2 = $('pwNew2').value, err = $('pwErr');
    err.textContent = '';
    if (!o || !n1) { err.textContent = 'املأ الحقول.'; return; }
    if (n1.length < S.constants.MIN_PASSWORD) { err.textContent = UI.errorText('password'); return; }
    if (n1 !== n2) { err.textContent = 'كلمتا المرور الجديدتان غير متطابقتين.'; return; }
    var btn = this.querySelector('[type=submit]'); btn.classList.add('is-busy');
    S.changePassword(o, n1).then(function (r) {
      btn.classList.remove('is-busy');
      if (r.ok) { UI.toast('تم تغيير كلمة المرور.', 'ok'); $('pwForm').reset(); }
      else err.textContent = UI.errorText(r.error, r);
    });
  });

  /* ---------- نسخة احتياطية ---------- */
  $('btnExport').addEventListener('click', function () {
    var data = S.exportBackup();
    if (!data) { UI.toast(UI.errorText('auth'), 'error'); return; }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: 'raslan-academy-backup-' + S._test.dayKey(Date.now()) + '.json' });
    doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    UI.toast('تم تنزيل النسخة الاحتياطية.', 'ok', 'i-download');
  });

  $('importFile').addEventListener('change', function () {
    var input = this, f = input.files && input.files[0];
    if (!f) return;
    if (f.size > 400000) { UI.toast(UI.errorText('size'), 'error'); input.value = ''; return; }
    var rd = new FileReader();
    rd.onerror = function () { UI.toast('تعذّرت قراءة الملف.', 'error'); input.value = ''; };
    rd.onload = function () {
      var text = String(rd.result || '');
      input.value = '';
      var res = S.importBackup(text, false);
      if (res.ok) { UI.toast('تم استيراد النسخة وتسجيل الدخول بحسابها.', 'ok'); renderAll(); return; }
      if (res.error !== 'exists') { UI.toast(UI.errorText(res.error), 'error'); return; }
      UI.confirmDialog({
        title: 'استبدال الحساب الموجود؟',
        text: 'يوجد حساب بالبريد ' + res.email + ' على هذا الجهاز. الاستيراد سيستبدل تقدمه الحالي بما في الملف.',
        confirmText: 'استبدال', danger: true
      }).then(function (yes) {
        if (!yes) return;
        var r2 = S.importBackup(text, true);
        if (r2.ok) { UI.toast('تم استرجاع الحساب من النسخة.', 'ok'); renderAll(); } else UI.toast(UI.errorText(r2.error), 'error');
      });
    };
    rd.readAsText(f);
  });

  var deleting = false;
  /* ---------- خطر: إعادة الضبط / الحذف ---------- */
  $('btnReset').addEventListener('click', function () {
    UI.confirmDialog({
      title: 'إعادة ضبط التقدم', danger: true, password: true, confirmText: 'إعادة الضبط',
      text: 'سيُمسح تقدمك ونقاطك وشاراتك بالكامل ويبقى حسابك. لا يمكن التراجع. اكتب كلمة المرور للتأكيد.',
      verify: function (pw) { return S.resetProgress(pw); }
    }).then(function (ok) { if (ok) { UI.toast('تمت إعادة ضبط التقدم.', 'ok'); renderAll(); } });
  });
  $('btnDelete').addEventListener('click', function () {
    UI.confirmDialog({
      title: 'حذف الحساب نهائيًا', danger: true, password: true, confirmText: 'حذف الحساب',
      text: 'سيُحذف حسابك وكل بياناتك من هذا المتصفح ولا يمكن استرجاعها إلا من نسخة احتياطية. اكتب كلمة المرور للتأكيد.',
      verify: function (pw) { deleting = true; return S.deleteAccount(pw).then(function (r) { if (!r.ok) deleting = false; return r; }); }
    }).then(function (ok) { if (ok) root.location.href = 'index.html'; });
  });

  /* ---------- تحديث تلقائي ---------- */
  var timer = null;
  root.addEventListener('rpa:store', function (e) {
    var t = e.detail && e.detail.type;
    if (t === 'logout') { if (deleting) return; root.location.replace('auth.html#login'); return; }
    clearTimeout(timer); timer = setTimeout(renderAll, 40);
  });

  renderAll();
})(window);
