/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/account.js  (Phase 2)
   - أدوات واجهة مشتركة: window.RPAUI (إشعارات، حوار تأكيد، رسائل الأخطاء، أيقونات)
   - شريط الحساب في القائمة (#navAccount) وقائمة الجوال (#mobileAccount) في كل الصفحات.
   كل نص يخص المستخدم يُدرج عبر textContent فقط (لا innerHTML) لمنع حقن HTML.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document;
  var S = root.RPAStore;

  function el(tag, attrs, children) {
    var n = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (attrs[k] === true) n.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c); });
    return n;
  }
  var SVGNS = 'http://www.w3.org/2000/svg';
  function icon(id, cls) {
    var svg = doc.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'icon' + (cls ? ' ' + cls : ''));
    svg.setAttribute('aria-hidden', 'true');
    var use = doc.createElementNS(SVGNS, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }
  /* إصلاح اتجاه النص: أسماء دوال مثل print() داخل جملة عربية تظهر معكوسة ")print(".
     نضيف علامة اتجاه غير مرئية (LRM) بعد القوس فقط في النصوص العربية، وليس داخل الكود. */
  var BIDI_RE = /([A-Za-z_][\w.]*\([^()\n]*\))(?!\u200E)/g;
  function bidi(s) { return String(s == null ? '' : s).replace(BIDI_RE, '$1\u200E'); }

  function initial(name) {
    var s = String(name || '?').trim();
    return s ? Array.from(s)[0].toUpperCase() : '?';
  }

  /* ---------- رسائل الأخطاء بالعربية ---------- */
  var ERRORS = {
    name: 'اكتب اسمًا من حرفين على الأقل.',
    email: 'البريد الإلكتروني غير صحيح.',
    password: 'كلمة المرور لازم تكون 6 أحرف على الأقل.',
    exists: 'يوجد حساب بهذا البريد بالفعل على هذا الجهاز. جرّب تسجيل الدخول.',
    limit: 'وصلت للحد الأقصى من الحسابات على هذا المتصفح (' + (S ? S.constants.MAX_USERS : 20) + ').',
    credentials: 'البريد أو كلمة المرور غير صحيحة.',
    locked: 'محاولات كثيرة خاطئة. انتظر قليلًا ثم حاول مرة أخرى.',
    quota: 'مساحة التخزين في المتصفح ممتلئة. احذف بيانات موقع قديمة ثم حاول مرة أخرى.',
    blocked: 'المتصفح يمنع حفظ البيانات (ربما بسبب الوضع الخاص). لن يتم حفظ حسابك.',
    storage: 'تعذّر حفظ البيانات في المتصفح.',
    crypto: 'متصفحك لا يدعم التحقق من كلمة المرور هنا. جرّب متصفحًا حديثًا.',
    auth: 'يجب تسجيل الدخول أولًا.',
    json: 'الملف ليس بصيغة JSON صحيحة.',
    format: 'هذا الملف ليس نسخة احتياطية من الأكاديمية.',
    user: 'بيانات الحساب داخل الملف غير صالحة أو تالفة.',
    size: 'الملف كبير جدًا ليكون نسخة احتياطية صحيحة.',
    'not-eligible': 'لسه مش مستحق الشهادة دي. كمّل الشروط المطلوبة الأول.',
    'cert-name': 'اكتب اسمك الكامل (من 3 لـ 60 حرف، حروف بس من غير أرقام).',
    stage: 'المرحلة دي مش موجودة.',
    order: 'لازم تخلّص المراحل اللي قبلها الأول.',
    type: 'نوع الشهادة غير معروف.'
  };
  function errorText(code, res) {
    var m = ERRORS[code] || 'حدث خطأ غير متوقع.';
    if (code === 'locked' && res && res.wait) m = 'محاولات كثيرة خاطئة. انتظر ' + res.wait + ' ثانية ثم حاول مرة أخرى.';
    return m;
  }

  /* ---------- الإشعارات ---------- */
  var toastBox = null;
  function toast(message, type, iconId, ms) {
    if (!toastBox) {
      toastBox = el('div', { class: 'toasts', 'aria-live': 'polite', role: 'status' });
      doc.body.appendChild(toastBox);
    }
    var t = el('div', { class: 'toast' + (type ? ' toast--' + type : '') });
    t.appendChild(icon(iconId || (type === 'error' ? 'i-alert' : type === 'ok' ? 'i-check' : 'i-info')));
    t.appendChild(el('span', { text: bidi(message) }));
    toastBox.appendChild(t);
    while (toastBox.children.length > 4) toastBox.removeChild(toastBox.firstChild);
    var gone = false;
    function close() {
      if (gone) return; gone = true;
      t.classList.add('is-leaving');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 380);
    }
    setTimeout(close, ms || 4200);
    t.addEventListener('click', close);
    return t;
  }

  /* ---------- حوار تأكيد (native <dialog>) ----------
     opts: {title, text, confirmText, cancelText, danger, password:true}
     يعيد Promise: false عند الإلغاء، وإلا true (أو كلمة المرور النصية إن طُلبت). */
  function confirmDialog(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var dlg = el('dialog', { class: 'modal', 'aria-labelledby': 'dlgTitle' });
      var body = el('div', { class: 'modal__body' });
      body.appendChild(el('h2', { class: 'modal__title', id: 'dlgTitle', text: opts.title || 'تأكيد' }));
      if (opts.text) body.appendChild(el('p', { class: 'modal__text', text: opts.text }));
      var pw = null, err = null;
      if (opts.password) {
        var f = el('div', { class: 'field' });
        f.appendChild(el('label', { class: 'field__label', for: 'dlgPw', text: 'كلمة المرور الحالية' }));
        pw = el('input', { class: 'input', id: 'dlgPw', type: 'password', autocomplete: 'current-password', dir: 'ltr' });
        err = el('div', { class: 'field__error', role: 'alert' });
        f.appendChild(pw); f.appendChild(err);
        body.appendChild(f);
      }
      var actions = el('div', { class: 'modal__actions' });
      var ok = el('button', { type: 'button', class: 'btn btn--sm ' + (opts.danger ? 'btn--danger' : 'btn--primary'), text: opts.confirmText || 'تأكيد' });
      var no = el('button', { type: 'button', class: 'btn btn--sm btn--glass', text: opts.cancelText || 'إلغاء' });
      actions.appendChild(ok); actions.appendChild(no);
      body.appendChild(actions);
      dlg.appendChild(body);
      doc.body.appendChild(dlg);

      var settled = false;
      function done(v) {
        if (settled) return; settled = true;
        try { dlg.close(); } catch (e) { /* ignore */ }
        if (dlg.parentNode) dlg.parentNode.removeChild(dlg);
        resolve(v);
      }
      ok.addEventListener('click', function () {
        if (pw) {
          if (!pw.value) { err.textContent = 'اكتب كلمة المرور.'; pw.setAttribute('aria-invalid', 'true'); pw.focus(); return; }
          if (opts.verify) {
            ok.classList.add('is-busy');
            opts.verify(pw.value).then(function (res) {
              ok.classList.remove('is-busy');
              if (res && res.ok) done(pw.value);
              else { err.textContent = errorText(res && res.error, res); pw.setAttribute('aria-invalid', 'true'); pw.focus(); }
            });
            return;
          }
          done(pw.value);
        } else done(true);
      });
      no.addEventListener('click', function () { done(false); });
      dlg.addEventListener('cancel', function (e) { e.preventDefault(); done(false); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) done(false); });
      if (pw) pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ok.click(); } });
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      (pw || ok).focus();
    });
  }

  /* ---------- شريط الحساب في القائمة ---------- */
  function renderNav() {
    var slot = doc.getElementById('navAccount');
    var mob = doc.getElementById('mobileAccount');
    var u = S ? S.currentUser() : null;
    var sum = u ? S.summary() : null;

    if (slot) {
      slot.textContent = '';
      if (u) {
        var a = el('a', { href: 'dashboard.html', class: 'acc-user', 'aria-label': 'لوحة الطالب: ' + u.name });
        a.appendChild(el('span', { class: 'acc-user__avatar', text: initial(u.name), 'aria-hidden': 'true' }));
        var meta = el('span', { class: 'acc-user__meta' });
        meta.appendChild(el('span', { class: 'acc-user__name', text: u.name }));
        meta.appendChild(el('span', { class: 'acc-user__xp', text: (sum ? sum.xp : 0) + ' XP' }));
        a.appendChild(meta);
        slot.appendChild(a);
      } else {
        var b = el('a', { href: 'auth.html', class: 'acc-btn', 'aria-label': 'تسجيل الدخول أو إنشاء حساب' });
        b.appendChild(icon('i-user'));
        b.appendChild(el('span', { text: 'دخول / تسجيل' }));
        slot.appendChild(b);
      }
    }

    if (mob) {
      mob.textContent = '';
      if (u) {
        var who = el('div', { class: 'mobile-account__who' });
        who.appendChild(el('span', { class: 'acc-user__avatar', text: initial(u.name), 'aria-hidden': 'true' }));
        var w = el('div');
        w.appendChild(el('strong', { text: u.name }));
        w.appendChild(el('small', { text: (sum ? sum.xp : 0) + ' XP — ' + (sum ? sum.rank.label : '') }));
        who.appendChild(w);
        mob.appendChild(who);
        var row = el('div', { class: 'mobile-account__row' });
        var d = el('a', { href: 'dashboard.html', class: 'btn btn--glass btn--sm' }, [icon('i-chart'), el('span', { text: 'لوحتي' })]);
        var o = el('button', { type: 'button', class: 'btn btn--glass btn--sm', 'data-logout': true }, [icon('i-logout'), el('span', { text: 'خروج' })]);
        row.appendChild(d); row.appendChild(o);
        mob.appendChild(row);
      } else {
        mob.appendChild(el('a', { href: 'auth.html#login', class: 'btn btn--glass btn--sm btn--block' }, [icon('i-user'), el('span', { text: 'تسجيل الدخول' })]));
        mob.appendChild(el('a', { href: 'auth.html#register', class: 'btn btn--glass btn--sm btn--block' }, [icon('i-sparkle'), el('span', { text: 'إنشاء حساب جديد' })]));
      }
    }
  }

  function bindLogout() {
    doc.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-logout]');
      if (!t || !S) return;
      e.preventDefault();
      S.logout();
      toast('تم تسجيل الخروج.', 'ok');
      // صفحة اللوحة تعيد التوجيه بنفسها عند حدث الخروج (dashboard.js)
    });
  }

  // لا يُسمح بدخول صفحة محمية بدون جلسة
  function requireLogin() {
    if (S && S.isLoggedIn()) return true;
    root.location.replace('auth.html#login');
    return false;
  }

  function mount() {
    renderNav();
    bindLogout();
    root.addEventListener('rpa:store', renderNav);
  }

  root.RPAUI = { bidi: bidi, el: el, icon: icon, initial: initial, toast: toast, confirmDialog: confirmDialog, errorText: errorText, renderNav: renderNav, requireLogin: requireLogin };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount); else mount();
})(window);
