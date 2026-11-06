/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/certificate.js  (Phase 3 / Batch 4)
   الشهادات (المسار التجريبي المحلي):
   - الأهلية تُحسب من التقدم المحفوظ (RPAStore.certificateStatus)، والإصدار مرة واحدة فقط لكل شهادة.
   - الشهادة تُرسم على Canvas (يدعم العربية واتجاه RTL عبر محرك المتصفح)، ثم:
       • تنزيل PDF عالي الدقة (JS/pdf.js)   • أو الطباعة / الحفظ PDF من المتصفح
   - الشعار والتوقيع مرسومان بالكود (لا صور خارجية)، فيعمل التصدير حتى من file://.
   ⚠ الشهادة المحلية قابلة للتلاعب ولا تمثل اعتمادًا رسميًا، والتحقق محدود بهذا الجهاز.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document;

  /* ------------------------------------------------------------------ */
  /* الرسم                                                              */
  /* ------------------------------------------------------------------ */
  var BASE_W = 1123, BASE_H = 794;   // A4 بالعرض بوحدات افتراضية
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var AR_RE = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
  var FONT_LATIN_SERIF = 'Georgia, "Times New Roman", "DejaVu Serif", serif';
  var FONT_SANS = '"Segoe UI", "Helvetica Neue", Arial, "DejaVu Sans", sans-serif';
  var FONT_AR = '"Cairo", "Noto Naskh Arabic", "Amiri", "Segoe UI", Tahoma, "Geeza Pro", "Arial", "DejaVu Sans", sans-serif';
  var FONT_SIGN = '"Segoe Script", "Brush Script MT", "Snell Roundhand", "Lucida Handwriting", "URW Chancery L", "Apple Chancery", cursive';

  function fmtDate(ts) { var d = new Date(ts); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }

  function grad(ctx, x0, y0, x1, y1) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#22d3ee'); g.addColorStop(0.5, '#2f6bff'); g.addColorStop(1, '#8b5cf6');
    return g;
  }
  function fitFont(ctx, text, weight, size, family, maxW, min) {
    var s = size;
    do { ctx.font = weight + ' ' + s + 'px ' + family; if (ctx.measureText(text).width <= maxW) break; s -= 2; } while (s > (min || 18));
    return s;
  }
  function spaced(ctx, text, x, y, spacing) {
    // نص لاتيني بمسافات بين الحروف (للعناوين)
    var total = 0, i, w = [];
    for (i = 0; i < text.length; i++) { w.push(ctx.measureText(text[i]).width); total += w[i]; }
    total += spacing * (text.length - 1);
    var cx = x - total / 2;
    ctx.textAlign = 'left';
    for (i = 0; i < text.length; i++) { ctx.fillText(text[i], cx, y); cx += w[i] + spacing; }
    ctx.textAlign = 'center';
  }
  function drawLogo(ctx, cx, cy, size) {
    var s = size / 64;
    ctx.save();
    ctx.translate(cx - size / 2, cy - size / 2);
    ctx.scale(s, s);
    var g = grad(ctx, 0, 0, 64, 64);
    var hex = new Path2D('M32 3.5 56.5 17.75v28.5L32 60.5 7.5 46.25v-28.5z');
    ctx.fillStyle = '#0a1030'; ctx.fill(hex);
    ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = g; ctx.stroke(hex);
    ctx.lineCap = 'round'; ctx.lineWidth = 5;
    ctx.stroke(new Path2D('M24 22 14 32l10 10'));
    ctx.strokeStyle = '#e8ecff'; ctx.stroke(new Path2D('M30 43h14'));
    ctx.fillStyle = '#22d3ee'; ctx.beginPath(); ctx.arc(44, 22, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawSeal(ctx, cx, cy, r) {
    ctx.save();
    var g = grad(ctx, cx - r, cy - r, cx + r, cy + r);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#0a1130'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = g; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r - 10, 0, Math.PI * 2); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
    // نص دائري
    var text = 'RASLAN • PYTHON • ACADEMY • ';
    ctx.font = '700 11px ' + FONT_SANS; ctx.fillStyle = '#e8ecff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var step = (Math.PI * 2) / text.length;
    for (var i = 0; i < text.length; i++) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI / 2 + i * step + step / 2); ctx.translate(0, -(r - 22)); ctx.fillText(text[i], 0, 0); ctx.restore();
    }
    drawLogo(ctx, cx, cy - 2, r * 0.72);
    ctx.restore();
  }
  function drawSignature(ctx, cx, y) {
    ctx.save();
    ctx.fillStyle = '#16205a'; ctx.strokeStyle = '#16205a';
    ctx.font = 'italic 400 40px ' + FONT_SIGN;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('Ahmed Raslan', cx, y);
    // خط التوقيع المتموج
    var w = Math.min(ctx.measureText('Ahmed Raslan').width, 230);
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - w / 2 - 6, y + 10);
    ctx.bezierCurveTo(cx - w / 4, y + 22, cx + w / 6, y - 2, cx + w / 2 + 18, y + 12);
    ctx.stroke();
    ctx.restore();
  }

  /* يرسم الشهادة كاملة على ctx بمقاس W×H (نفس النسبة BASE_W:BASE_H) */
  function draw(ctx, W, H, c) {
    var k = W / BASE_W;
    ctx.save();
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    // الخلفية
    var bg = ctx.createLinearGradient(0, 0, BASE_W, BASE_H);
    bg.addColorStop(0, '#fdfcf8'); bg.addColorStop(1, '#eef1fb');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, BASE_W, BASE_H);
    // علامة مائية
    ctx.save(); ctx.globalAlpha = 0.045; drawLogo(ctx, BASE_W / 2, BASE_H / 2 + 20, 430); ctx.restore();
    // الإطار
    ctx.fillStyle = '#0a1130';
    ctx.fillRect(0, 0, BASE_W, 16); ctx.fillRect(0, BASE_H - 16, BASE_W, 16); ctx.fillRect(0, 0, 16, BASE_H); ctx.fillRect(BASE_W - 16, 0, 16, BASE_H);
    ctx.lineWidth = 3; ctx.strokeStyle = grad(ctx, 0, 0, BASE_W, BASE_H); ctx.strokeRect(30, 30, BASE_W - 60, BASE_H - 60);
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(10,17,48,0.35)'; ctx.strokeRect(40, 40, BASE_W - 80, BASE_H - 80);
    // زخارف الأركان
    [[40, 40, 1, 1], [BASE_W - 40, 40, -1, 1], [40, BASE_H - 40, 1, -1], [BASE_W - 40, BASE_H - 40, -1, -1]].forEach(function (p) {
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(p[2], p[3]);
      ctx.strokeStyle = grad(ctx, 0, 0, 60, 60); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 46); ctx.lineTo(0, 0); ctx.lineTo(46, 0); ctx.stroke();
      ctx.fillStyle = '#2f6bff'; ctx.beginPath(); ctx.arc(14, 14, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    // الرأس
    drawLogo(ctx, BASE_W / 2, 98, 64);
    ctx.fillStyle = '#0a1130'; ctx.font = '800 22px ' + FONT_SANS;
    spaced(ctx, 'RASLAN PYTHON ACADEMY', BASE_W / 2, 163, 4);
    ctx.fillStyle = '#5b6386'; ctx.font = 'italic 400 13px ' + FONT_SANS;
    ctx.fillText('Learn Python. Build Your Future.', BASE_W / 2, 185);
    // العنوان
    ctx.font = '700 40px ' + FONT_LATIN_SERIF;
    var tw = ctx.measureText(c.heading).width;
    ctx.fillStyle = grad(ctx, BASE_W / 2 - tw / 2, 0, BASE_W / 2 + tw / 2, 0);
    spaced(ctx, c.heading, BASE_W / 2, 248, 3);
    ctx.fillStyle = '#5b6386'; ctx.font = 'italic 400 19px ' + FONT_LATIN_SERIF;
    ctx.fillText('This is to certify that', BASE_W / 2, 296);
    // الاسم (عربي أو لاتيني) — المتصفح بيشكّل الحروف وبيكتب العربي من اليمين لليسار
    var isAr = AR_RE.test(c.name);
    ctx.fillStyle = '#0a1130';
    ctx.direction = isAr ? 'rtl' : 'ltr';
    var family = isAr ? FONT_AR : FONT_LATIN_SERIF;
    var ns = fitFont(ctx, c.name, isAr ? '700' : 'italic 700', isAr ? 50 : 54, family, 760, 24);
    ctx.font = (isAr ? '700 ' : 'italic 700 ') + ns + 'px ' + family;
    ctx.fillText(c.name, BASE_W / 2, 366);
    ctx.direction = 'ltr';
    var nw = Math.min(Math.max(ctx.measureText(c.name).width + 60, 360), 820);
    ctx.fillStyle = grad(ctx, BASE_W / 2 - nw / 2, 0, BASE_W / 2 + nw / 2, 0);
    ctx.fillRect(BASE_W / 2 - nw / 2, 386, nw, 2.5);
    // الدورة
    ctx.fillStyle = '#5b6386'; ctx.font = 'italic 400 18px ' + FONT_LATIN_SERIF;
    ctx.fillText('has successfully completed the course', BASE_W / 2, 428);
    ctx.fillStyle = '#16205a';
    fitFont(ctx, c.course, '700', 25, FONT_SANS, 860, 16);
    ctx.fillText(c.course, BASE_W / 2, 466);
    ctx.fillStyle = '#5b6386'; ctx.font = '400 15px ' + FONT_SANS;
    ctx.fillText('at RASLAN PYTHON ACADEMY', BASE_W / 2, 494);
    // التذييل: التاريخ والرقم | الختم | التوقيع
    var colY = 600;
    ctx.fillStyle = '#0a1130'; ctx.font = '700 17px ' + FONT_SANS;
    ctx.fillText(fmtDate(c.issuedAt), 245, colY);
    ctx.fillStyle = 'rgba(10,17,48,0.4)'; ctx.fillRect(145, colY + 12, 200, 1.5);
    ctx.fillStyle = '#5b6386'; ctx.font = '600 12px ' + FONT_SANS;
    ctx.fillText('DATE OF ISSUE', 245, colY + 32);
    ctx.fillStyle = '#0a1130'; ctx.font = '700 13.5px "Courier New", "DejaVu Sans Mono", monospace';
    ctx.fillText('Certificate ID: ' + c.id, 245, colY + 62);
    drawSeal(ctx, BASE_W / 2, colY + 6, 62);
    drawSignature(ctx, BASE_W - 245, colY - 4);
    ctx.fillStyle = 'rgba(10,17,48,0.4)'; ctx.fillRect(BASE_W - 345, colY + 12, 200, 1.5);
    ctx.fillStyle = '#0a1130'; ctx.font = '700 15px ' + FONT_SANS;
    ctx.fillText('Eng. Ahmed Raslan', BASE_W - 245, colY + 34);
    ctx.fillStyle = '#5b6386'; ctx.font = '600 12px ' + FONT_SANS;
    ctx.fillText('Founder & Instructor', BASE_W - 245, colY + 52);
    // تنويه
    ctx.fillStyle = '#7a819f'; ctx.font = '400 10.5px ' + FONT_SANS;
    ctx.fillText('Internal certificate of completion issued by RASLAN PYTHON ACADEMY (local trial version). Not a governmental or internationally accredited qualification.', BASE_W / 2, BASE_H - 62);
    ctx.fillText('Verification is limited to the device and data where the certificate was issued.', BASE_W / 2, BASE_H - 47);
    ctx.restore();
  }

  function render(cert, W) {
    var cv = doc.createElement('canvas');
    cv.width = W; cv.height = Math.round(W * BASE_H / BASE_W);
    draw(cv.getContext('2d'), cv.width, cv.height, cert);
    return cv;
  }

  function certData(c) {
    var G = root.RPA_GAME.certificates[c.type];
    return { id: c.id, name: c.name, course: c.course || G.course, heading: G.heading, issuedAt: c.issuedAt, type: c.type };
  }

  function pdfBytes(cert) {
    var cv = render(certData(cert), 3508);   // ≈ 300 DPI على A4
    var jpeg = root.RPAPdf.dataUrlToBytes(cv.toDataURL('image/jpeg', 0.92));
    return root.RPAPdf.fromJpeg(jpeg, cv.width, cv.height, { title: 'RASLAN PYTHON ACADEMY Certificate ' + cert.id, author: 'Eng. Ahmed Raslan', subject: cert.course, date: new Date(cert.issuedAt) });
  }

  root.RPACert = { draw: draw, render: render, certData: certData, pdfBytes: pdfBytes, fmtDate: fmtDate, BASE_W: BASE_W, BASE_H: BASE_H };

  /* ------------------------------------------------------------------ */
  /* الصفحة                                                             */
  /* ------------------------------------------------------------------ */
  var host = doc.getElementById('certRoot');
  var S = root.RPAStore, UI = root.RPAUI, GAME = root.RPA_GAME;
  if (!host || !S || !UI) return;
  if (!UI.requireLogin()) return;
  var icon = UI.icon, bidi = UI.bidi || function (x) { return x; };
  var el = function (tag, attrs, children) {
    if (attrs && typeof attrs.text === 'string' && attrs.dir !== 'ltr' && attrs.dir !== 'auto') attrs.text = bidi(attrs.text);
    return UI.el(tag, attrs, children);
  };
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  var user = S.currentUser();
  var view = doc.getElementById('certView');
  var printImg = doc.getElementById('printCert');

  function ready(fn) { if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fn, fn); else fn(); }

  function paintList() {
    clear(host);
    var st = S.certificateStatus();
    ['half', 'full'].forEach(function (type) {
      var s = st[type];
      var card = el('article', { class: 'crt glass' + (s.issued ? ' crt--issued' : s.eligible ? ' crt--ready' : '') });
      card.appendChild(el('div', { class: 'crt__ico' }, [icon(s.issued ? 'i-award' : s.eligible ? 'i-star' : 'i-lock')]));
      var body = el('div', { class: 'crt__body' });
      body.appendChild(el('h2', { text: s.title }));
      body.appendChild(el('p', { class: 'crt__course', dir: 'ltr', text: s.course }));
      var reqs = el('ul', { class: 'crt__req' });
      reqs.appendChild(el('li', { class: s.levelsDone >= s.levelsNeeded ? 'ok' : '' }, [icon(s.levelsDone >= s.levelsNeeded ? 'i-check' : 'i-clock'), el('span', { text: 'المستويات: ' + s.levelsDone + ' / ' + s.levelsNeeded })]));
      if (s.projectNeeded) reqs.appendChild(el('li', { class: s.projectDone ? 'ok' : '' }, [icon(s.projectDone ? 'i-check' : 'i-clock'), el('span', { text: 'مشروع التخرج: ' + (s.projectDone ? 'مكتمل' : 'لم يكتمل بعد') })]));
      body.appendChild(reqs);
      var row = el('div', { class: 'crt__row' });
      if (s.issued) {
        body.appendChild(el('p', { class: 'crt__meta' }, [el('span', { text: 'صادرة باسم: ' }), el('b', { dir: 'auto', text: s.issued.name }), el('span', { text: ' — رقم: ' }), el('code', { dir: 'ltr', text: s.issued.id })]));
        var openBtn = el('button', { type: 'button', class: 'btn btn--primary btn--sm' }, [icon('i-eye'), el('span', { text: 'عرض الشهادة وتنزيلها' })]);
        openBtn.addEventListener('click', function () { showIssued(type); });
        row.appendChild(openBtn);
      } else if (s.eligible) {
        var getBtn = el('button', { type: 'button', class: 'btn btn--primary btn--sm crt__get', 'data-type': type }, [icon('i-award'), el('span', { text: 'احصل على شهادتك' })]);
        getBtn.addEventListener('click', function () { showForm(type); });
        row.appendChild(getBtn);
      } else {
        body.appendChild(el('p', { class: 'crt__why', text: 'لسه: ' + s.reasons.join(' و ') + '.' }));
        var sum = S.summary();
        if (!sum.finished) row.appendChild(el('a', { href: 'lesson.html?n=' + sum.currentLevel, class: 'btn btn--glass btn--sm', text: 'كمّل المستوى ' + sum.currentLevel }));
        else if (s.projectNeeded && !s.projectDone) row.appendChild(el('a', { href: 'project.html', class: 'btn btn--glass btn--sm', text: 'كمّل مشروع التخرج' }));
      }
      body.appendChild(row);
      card.appendChild(body);
      host.appendChild(card);
    });
  }

  function previewCanvas(data) {
    var cv = render(data, 1600);
    cv.className = 'crt__canvas';
    cv.setAttribute('role', 'img');
    cv.setAttribute('aria-label', 'معاينة الشهادة باسم ' + data.name);
    return cv;
  }

  function showForm(type) {
    var cfg = GAME.certificates[type];
    clear(view); view.hidden = false;
    var box = el('section', { class: 'crt-form glass', 'aria-labelledby': 'cfTitle' });
    box.appendChild(el('h2', { id: 'cfTitle', text: 'إصدار ' + cfg.title }));
    box.appendChild(el('p', { class: 'crt-form__note', text: 'اكتب اسمك الكامل زي ما تحب يظهر على الشهادة، بالعربي أو الإنجليزي. راجعه كويس في المعاينة: بعد الإصدار مش هيتغير، والشهادة بتصدر مرة واحدة بس.' }));
    var f = el('div', { class: 'field' });
    f.appendChild(el('label', { class: 'field__label', for: 'certName', text: 'الاسم على الشهادة' }));
    var input = el('input', { class: 'input', id: 'certName', dir: 'auto', maxlength: '60', autocomplete: 'name', value: user.name });
    f.appendChild(input);
    var err = el('div', { class: 'field__error', role: 'alert' });
    f.appendChild(err);
    box.appendChild(f);
    var prevWrap = el('div', { class: 'crt__preview' });
    box.appendChild(prevWrap);
    var row = el('div', { class: 'crt__row' });
    var issueBtn = el('button', { type: 'button', class: 'btn btn--primary', id: 'certIssue' }, [icon('i-award'), el('span', { text: 'إصدار الشهادة' })]);
    var cancel = el('button', { type: 'button', class: 'btn btn--glass' }, [el('span', { text: 'إلغاء' })]);
    row.appendChild(issueBtn); row.appendChild(cancel);
    box.appendChild(row);
    view.appendChild(box);

    var t = null;
    function upd() {
      var name = (S.certName.clean(input.value));
      var valid = S.certName.valid(name);
      err.textContent = valid ? '' : UI.errorText('cert-name');
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      issueBtn.disabled = !valid;
      clear(prevWrap);
      prevWrap.appendChild(previewCanvas({ id: 'RPA-' + cfg.prefix + '-XXXX-XXXX-X', name: valid ? name : (name || 'Your Name'), course: cfg.course, heading: cfg.heading, issuedAt: Date.now(), type: type }));
      prevWrap.appendChild(el('p', { class: 'crt__hint', text: 'معاينة — رقم الشهادة الحقيقي بيتولد عند الإصدار.' }));
    }
    input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(upd, 160); });
    ready(upd);
    cancel.addEventListener('click', function () { clear(view); view.hidden = true; });
    issueBtn.addEventListener('click', function () {
      var name = S.certName.clean(input.value);
      UI.confirmDialog({ title: 'تأكيد الإصدار', text: 'هتصدر الشهادة باسم: ' + name + '. الاسم مش هيتغير بعد كده. متأكد؟', confirmText: 'إصدار' }).then(function (yes) {
        if (!yes) return;
        var r = S.issueCertificate(type, name);
        if (!r.ok) { err.textContent = UI.errorText(r.error); return; }
        UI.toast(r.already ? 'الشهادة صادرة من قبل.' : 'تم إصدار شهادتك 🎉', 'ok', 'i-award');
        paintList();
        showIssued(type);
      });
    });
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showIssued(type) {
    var st = S.certificateStatus()[type];
    if (!st.issued) return;
    var data = certData(st.issued);
    clear(view); view.hidden = false;
    var box = el('section', { class: 'crt-form glass' });
    box.appendChild(el('h2', { text: st.title }));
    var meta = el('p', { class: 'crt__meta' }, [el('span', { text: 'رقم الشهادة: ' }), el('code', { dir: 'ltr', id: 'certIdText', text: data.id }), el('span', { text: ' — تاريخ الإصدار: ' }), el('bdi', { dir: 'ltr', text: fmtDate(data.issuedAt) })]);
    box.appendChild(meta);
    var prevWrap = el('div', { class: 'crt__preview' });
    box.appendChild(prevWrap);
    var row = el('div', { class: 'crt__row' });
    var dl = el('button', { type: 'button', class: 'btn btn--primary', id: 'certPdf' }, [icon('i-download'), el('span', { text: 'تنزيل PDF' })]);
    var pr = el('button', { type: 'button', class: 'btn btn--glass', id: 'certPrint' }, [icon('i-save'), el('span', { text: 'طباعة / حفظ PDF من المتصفح' })]);
    var cp = el('button', { type: 'button', class: 'btn btn--glass' }, [icon('i-check'), el('span', { text: 'نسخ رقم الشهادة' })]);
    var vf = el('a', { href: 'verify.html?id=' + encodeURIComponent(data.id), class: 'btn btn--glass' }, [icon('i-shield'), el('span', { text: 'صفحة التحقق' })]);
    row.appendChild(dl); row.appendChild(pr); row.appendChild(cp); row.appendChild(vf);
    box.appendChild(row);
    box.appendChild(el('p', { class: 'crt__hint', text: 'تنزيل PDF بيعمل ملف A4 بدقة عالية (≈300 DPI). لو التنزيل مش شغال على جهازك، استخدم «طباعة / حفظ PDF من المتصفح» واختار «Save as PDF».' }));
    view.appendChild(box);
    ready(function () { clear(prevWrap); prevWrap.appendChild(previewCanvas(data)); });

    dl.addEventListener('click', function () {
      dl.classList.add('is-busy');
      setTimeout(function () {
        try {
          var bytes = pdfBytes(st.issued);
          var blob = new Blob([bytes], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          var a = el('a', { href: url, download: 'RASLAN-Certificate-' + data.id + '.pdf' });
          doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          UI.toast('تم تنزيل الشهادة PDF.', 'ok', 'i-download');
        } catch (e) {
          UI.toast('تعذّر إنشاء PDF على هذا المتصفح. استخدم «طباعة / حفظ PDF من المتصفح».', 'error');
        }
        dl.classList.remove('is-busy');
      }, 30);
    });
    pr.addEventListener('click', function () {
      var cv = render(data, 3508);
      printImg.onload = function () { root.print(); };
      printImg.src = cv.toDataURL('image/png');
    });
    cp.addEventListener('click', function () {
      var done = function () { UI.toast('تم نسخ رقم الشهادة.', 'ok', 'i-check'); };
      if (root.navigator.clipboard && root.navigator.clipboard.writeText) root.navigator.clipboard.writeText(data.id).then(done, function () { root.prompt('رقم الشهادة:', data.id); });
      else root.prompt('رقم الشهادة:', data.id);
    });
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  root.addEventListener('rpa:store', function (e) { if (e.detail && e.detail.type === 'logout') root.location.replace('auth.html#login'); });
  paintList();
  var want = new URLSearchParams(root.location.search).get('type');
  if (want === 'half' || want === 'full') {
    var s0 = S.certificateStatus()[want];
    if (s0.issued) showIssued(want); else if (s0.eligible) showForm(want);
  }
})(window);
