/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/auth.js  (Phase 2)
   صفحة الدخول / إنشاء الحساب / استيراد نسخة احتياطية.
   ===================================================================== */
(function (root) {
  'use strict';
  var doc = root.document, S = root.RPAStore, UI = root.RPAUI;
  if (!S || !UI) return;

  var $ = function (id) { return doc.getElementById(id); };
  var forms = $('authForms'), signed = $('authSignedIn');
  var tabs = Array.prototype.slice.call(doc.querySelectorAll('.auth__tab'));
  var panels = { login: $('panelLogin'), register: $('panelRegister') };
  var current = 'login';

  /* ---------- الحالة: مسجّل بالفعل؟ ---------- */
  function renderState() {
    var u = S.currentUser();
    if (u) {
      forms.hidden = true; signed.hidden = false;
      $('signedName').textContent = u.name;
    } else {
      forms.hidden = false; signed.hidden = true;
    }
  }
  $('signedOut').addEventListener('click', function () { S.logout(); UI.toast('تم تسجيل الخروج.', 'ok'); renderState(); });
  root.addEventListener('rpa:store', renderState);

  if (!S.storageInfo().persistent) $('storageWarn').hidden = false;

  /* ---------- التبويبات ---------- */
  function showTab(name, focus) {
    if (!panels[name]) name = 'login';
    current = name;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    Object.keys(panels).forEach(function (k) { panels[k].hidden = k !== name; });
    if (history.replaceState) { try { history.replaceState(null, '', '#' + name); } catch (e) { /* file:// قد يمنع */ } }
    if (focus) { var f = panels[name].querySelector('input'); if (f) f.focus(); }
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-tab]');
    if (t) { e.preventDefault(); showTab(t.getAttribute('data-tab'), true); }
  });
  tabs.forEach(function (t, i) {
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var n = tabs[(i + 1) % tabs.length];
      showTab(n.getAttribute('data-tab'), false); n.focus();
    });
  });
  root.addEventListener('hashchange', function () { showTab(root.location.hash.replace('#', ''), false); });
  showTab(root.location.hash.replace('#', '') === 'register' ? 'register' : 'login', false);

  /* ---------- إظهار/إخفاء كلمة المرور ---------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-eye]');
    if (!b) return;
    var inp = $(b.getAttribute('data-eye'));
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    b.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
    b.querySelector('use').setAttribute('href', show ? '#i-eye-off' : '#i-eye');
  });

  /* ---------- أدوات ---------- */
  function setAlert(id, msg) {
    var a = $(id);
    if (!msg) { a.hidden = true; return; }
    a.querySelector('span').textContent = msg;
    a.hidden = false;
  }
  function fieldErr(inputId, errId, msg) {
    var i = $(inputId), e = $(errId);
    if (e) e.textContent = msg || '';
    if (msg) i.setAttribute('aria-invalid', 'true'); else i.removeAttribute('aria-invalid');
  }
  function busy(btn, on) { btn.classList.toggle('is-busy', on); if (on) btn.setAttribute('disabled', ''); else btn.removeAttribute('disabled'); }
  function goDashboard() { root.location.href = 'dashboard.html'; }

  /* ---------- قوة كلمة المرور ---------- */
  function strength(pw) {
    var s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[a-zA-Z؀-ۿ]/.test(pw) && /\d/.test(pw)) s++;
    if (/[^a-zA-Z0-9؀-ۿ]/.test(pw) || (pw.length >= 12 && /[A-Z]/.test(pw) && /[a-z]/.test(pw))) s++;
    return pw ? Math.max(1, Math.min(4, s)) : 0;
  }
  var LABELS = ['6 أحرف على الأقل. الأفضل خلط الحروف والأرقام.', 'ضعيفة', 'مقبولة', 'جيدة', 'قوية'];
  $('regPw').addEventListener('input', function () {
    var lv = strength(this.value);
    $('pwStrength').setAttribute('data-level', String(lv));
    $('pwHint').textContent = LABELS[lv];
  });

  /* ---------- تسجيل الدخول ---------- */
  panels.login.addEventListener('submit', function (e) {
    e.preventDefault();
    setAlert('loginAlert', '');
    var email = $('loginEmail').value, pw = $('loginPw').value;
    if (!email.trim() || !pw) { setAlert('loginAlert', 'اكتب البريد وكلمة المرور.'); return; }
    var btn = panels.login.querySelector('[type=submit]');
    busy(btn, true);
    S.login(email, pw).then(function (res) {
      busy(btn, false);
      if (res.ok) { UI.toast('أهلًا ' + res.user.name + '!', 'ok'); goDashboard(); }
      else setAlert('loginAlert', UI.errorText(res.error, res));
    }, function () { busy(btn, false); setAlert('loginAlert', UI.errorText('storage')); });
  });

  /* ---------- إنشاء حساب ---------- */
  function validateRegister() {
    var ok = true;
    var name = $('regName').value.trim().replace(/\s+/g, ' ');
    var email = $('regEmail').value.trim();
    var pw = $('regPw').value, pw2 = $('regPw2').value;
    fieldErr('regName', 'regNameErr', ''); fieldErr('regEmail', 'regEmailErr', '');
    fieldErr('regPw', 'regPwErr', ''); fieldErr('regPw2', 'regPw2Err', '');
    if (name.length < 2) { fieldErr('regName', 'regNameErr', UI.errorText('name')); ok = false; }
    if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(email)) { fieldErr('regEmail', 'regEmailErr', UI.errorText('email')); ok = false; }
    if (pw.length < S.constants.MIN_PASSWORD) { fieldErr('regPw', 'regPwErr', UI.errorText('password')); ok = false; }
    if (pw2 !== pw) { fieldErr('regPw2', 'regPw2Err', 'كلمتا المرور غير متطابقتين.'); ok = false; }
    return ok;
  }
  panels.register.addEventListener('submit', function (e) {
    e.preventDefault();
    setAlert('regAlert', '');
    if (!validateRegister()) { var bad = panels.register.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
    var btn = panels.register.querySelector('[type=submit]');
    busy(btn, true);
    S.register({ name: $('regName').value, email: $('regEmail').value, password: $('regPw').value }).then(function (res) {
      busy(btn, false);
      if (res.ok) { UI.toast('تم إنشاء حسابك. أهلًا ' + res.user.name + '!', 'ok'); goDashboard(); }
      else if (res.error === 'exists') { fieldErr('regEmail', 'regEmailErr', UI.errorText('exists')); $('regEmail').focus(); }
      else setAlert('regAlert', UI.errorText(res.error, res));
    }, function () { busy(btn, false); setAlert('regAlert', UI.errorText('crypto')); });
  });
  ['regName', 'regEmail', 'regPw', 'regPw2'].forEach(function (id) {
    $(id).addEventListener('input', function () { this.removeAttribute('aria-invalid'); var er = $(id + 'Err'); if (er) er.textContent = ''; });
  });

  /* ---------- استيراد نسخة احتياطية ---------- */
  $('importFile').addEventListener('change', function () {
    var f = this.files && this.files[0];
    var input = this;
    if (!f) return;
    if (f.size > 400000) { UI.toast(UI.errorText('size'), 'error'); input.value = ''; return; }
    var rd = new FileReader();
    rd.onerror = function () { UI.toast('تعذّرت قراءة الملف.', 'error'); input.value = ''; };
    rd.onload = function () {
      var text = String(rd.result || '');
      var res = S.importBackup(text, false);
      if (!res.ok && res.error === 'exists') {
        UI.confirmDialog({
          title: 'الحساب موجود بالفعل',
          text: 'يوجد حساب بالبريد ' + res.email + ' على هذا الجهاز. استيراد النسخة سيستبدل تقدمه الحالي بما في الملف. هل تريد المتابعة؟',
          confirmText: 'استبدال', danger: true
        }).then(function (yes) {
          if (!yes) return;
          var r2 = S.importBackup(text, true);
          if (r2.ok) { UI.toast('تم استرجاع حسابك.', 'ok'); goDashboard(); } else UI.toast(UI.errorText(r2.error), 'error');
        });
      } else if (res.ok) { UI.toast('تم استرجاع حسابك.', 'ok'); goDashboard(); }
      else UI.toast(UI.errorText(res.error), 'error');
      input.value = '';
    };
    rd.readAsText(f);
  });

  renderState();
})(window);
