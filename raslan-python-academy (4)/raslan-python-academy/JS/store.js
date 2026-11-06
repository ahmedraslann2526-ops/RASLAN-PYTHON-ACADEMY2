/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/store.js  (Phase 2)
   طبقة الحسابات والتقدم والنقاط والشارات فوق LocalStorage.

   ⚠ تنبيه مهم (نسخة تجريبية):
   - كل البيانات تُحفظ داخل متصفح هذا الجهاز فقط (LocalStorage)، ولا تُرسل لأي سيرفر.
   - هذا ليس نظام حسابات آمنًا للإنتاج: أي شخص يستطيع فتح أدوات المطوّر في نفس
     المتصفح ورؤية/تعديل البيانات. كلمة المرور تُخزَّن كـ Hash (PBKDF2) وليست نصًا صريحًا،
     لكن هذا لا يحمي من من يملك وصولًا للجهاز.
   - مسح بيانات المتصفح، أو الوضع الخاص (Incognito)، أو تغيير المتصفح/الجهاز = ضياع/اختلاف البيانات.
     لذلك يوجد تصدير/استيراد نسخة احتياطية JSON.
   - الحجم المتاح عادة نحو 5 ميجابايت للموقع الواحد؛ بيانات الطالب هنا صغيرة جدًا (أقل من 20 كيلوبايت).
   - في الإنتاج الحقيقي يجب استبدال هذه الطبقة بسيرفر وقاعدة بيانات ومصادقة آمنة.

   الاعتماديات: Data/curriculum-index.js و Data/gamification.js (يجب تحميلهما قبل هذا الملف).
   الواجهة العامة: window.RPAStore
   ===================================================================== */
(function (root) {
  'use strict';

  var CUR = root.RPA_CURRICULUM;
  var GAME = root.RPA_GAME;
  if (!CUR || !GAME) { throw new Error('RPAStore: حمّل Data/curriculum-index.js و Data/gamification.js قبل store.js'); }

  /* ------------------------------------------------------------------ */
  /* إعدادات                                                            */
  /* ------------------------------------------------------------------ */
  var NS = 'rpa.v1.';
  var K_USERS = NS + 'users';
  var K_SESSION = NS + 'session';
  var K_LOCK = NS + 'lock';
  var K_DATA = NS + 'data.';
  var K_CERTS = NS + 'certs';   // سجل الشهادات الصادرة على هذا الجهاز (للتحقق المحلي)
  var MAX_USERS = 20;
  var MAX_ACTIVITY = 40;
  var PBKDF2_ITER = 150000;
  var MAX_FAILS = 5;
  var LOCK_MS = 30 * 1000;
  var BACKUP_FORMAT = 'rpa-backup';
  var BACKUP_VERSION = 1;
  var TOTAL = CUR.total;
  var ID_RE = /^[a-z0-9_-]{1,40}$/i;

  var now = function () { return Date.now(); };

  /* ------------------------------------------------------------------ */
  /* تخزين آمن: LocalStorage أو بديل بالذاكرة إن كان محظورًا             */
  /* ------------------------------------------------------------------ */
  var mem = {};
  var persistent = false;
  // صفحة الاختبار الذاتي تضع root.RPA_TEST_STORAGE لعزل الاختبارات عن بيانات الطالب الحقيقية.
  var LS = root.RPA_TEST_STORAGE || null;
  function ls() { return LS || root.localStorage; }
  (function probe() {
    try {
      var t = '__rpa_probe__';
      ls().setItem(t, '1');
      ls().removeItem(t);
      persistent = true;
    } catch (e) { persistent = false; }
  })();

  function rawGet(k) {
    if (persistent) { try { return ls().getItem(k); } catch (e) { persistent = false; } }
    return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null;
  }
  function rawSet(k, v) {
    if (persistent) {
      try { ls().setItem(k, v); return true; }
      catch (e) {
        // الامتلاء (QuotaExceeded) أو الحظر: لا نفقد العملية بصمت
        lastError = (e && e.name === 'QuotaExceededError') ? 'quota' : 'blocked';
        return false;
      }
    }
    mem[k] = v; return true;
  }
  function rawDel(k) {
    if (persistent) { try { ls().removeItem(k); } catch (e) { /* ignore */ } }
    delete mem[k];
  }
  var lastError = null;

  function readJSON(k, fallback) {
    var s = rawGet(k);
    if (s == null) return fallback;
    try { return JSON.parse(s); } catch (e) { return fallback; }
  }
  function writeJSON(k, v) { return rawSet(k, JSON.stringify(v)); }

  /* ------------------------------------------------------------------ */
  /* أدوات                                                              */
  /* ------------------------------------------------------------------ */
  function isObj(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
  function clampInt(v, min, max, def) {
    v = Number(v);
    if (!isFinite(v)) return def;
    v = Math.floor(v);
    return v < min ? min : v > max ? max : v;
  }
  function cleanText(s, max) {
    s = String(s == null ? '' : s);
    s = s.replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s+/g, ' ').trim();
    return s.length > max ? s.slice(0, max).trim() : s;
  }
  function normEmail(e) { return String(e == null ? '' : e).trim().toLowerCase(); }
  function validEmail(e) { return e.length <= 120 && /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/.test(e); }
  function randHex(bytes) {
    var a = new Uint8Array(bytes);
    if (root.crypto && root.crypto.getRandomValues) root.crypto.getRandomValues(a);
    else for (var i = 0; i < bytes; i++) a[i] = Math.floor(Math.random() * 256);
    var s = '';
    for (var j = 0; j < a.length; j++) s += ('0' + a[j].toString(16)).slice(-2);
    return s;
  }
  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function prevDayKey(ts) {
    var d = new Date(ts);
    d.setDate(d.getDate() - 1);
    return dayKey(d.getTime());
  }
  function validDayKey(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  function validTs(t) { t = Number(t); return isFinite(t) && t > 0 && t < 8.64e15 ? Math.floor(t) : 0; }

  /* ------------------------------------------------------------------ */
  /* كلمات المرور: PBKDF2-SHA256 عبر crypto.subtle (وبديل ضعيف عند غيابه) */
  /* ------------------------------------------------------------------ */
  function hasSubtle() { return !!(root.crypto && root.crypto.subtle && root.crypto.subtle.importKey && root.TextEncoder); }

  function toHex(buf) {
    var a = new Uint8Array(buf), s = '';
    for (var i = 0; i < a.length; i++) s += ('0' + a[i].toString(16)).slice(-2);
    return s;
  }
  // بديل ضعيف (يُستخدم فقط إن لم تتوفر crypto.subtle) — يُعلَّم algo:'weak' ويُرقّى تلقائيًا عند أول دخول ناجح.
  function weakHash(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var r = 0; r < 2000; r++) {
      for (var i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    }
    return ('00000000' + (h2 >>> 0).toString(16)).slice(-8) + ('00000000' + (h1 >>> 0).toString(16)).slice(-8);
  }
  function hashPassword(password, salt, algo, iter) {
    if (algo === 'pbkdf2') {
      if (!hasSubtle()) return Promise.reject(new Error('no-subtle'));
      var enc = new TextEncoder();
      return root.crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits'])
        .then(function (key) {
          return root.crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: iter }, key, 256);
        }).then(toHex);
    }
    return Promise.resolve(weakHash(salt + '\u0000' + password));
  }
  function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    var d = 0;
    for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return d === 0;
  }
  function newHash(password) {
    var salt = randHex(16);
    var algo = hasSubtle() ? 'pbkdf2' : 'weak';
    return hashPassword(password, salt, algo, PBKDF2_ITER).then(function (hash) {
      return { salt: salt, hash: hash, algo: algo, iter: algo === 'pbkdf2' ? PBKDF2_ITER : 0 };
    });
  }

  /* ------------------------------------------------------------------ */
  /* التنقية (Sanitize) للبيانات المخزنة والمستوردة                      */
  /* ------------------------------------------------------------------ */
  function sanitizeUser(u) {
    if (!isObj(u)) return null;
    var id = typeof u.id === 'string' && ID_RE.test(u.id) ? u.id : null;
    var email = normEmail(u.email);
    var name = cleanText(u.name, 40);
    var algo = u.algo === 'pbkdf2' ? 'pbkdf2' : u.algo === 'weak' ? 'weak' : null;
    var salt = typeof u.salt === 'string' && /^[0-9a-f]{8,64}$/.test(u.salt) ? u.salt : null;
    var hash = typeof u.hash === 'string' && /^[0-9a-f]{16,128}$/.test(u.hash) ? u.hash : null;
    if (!id || !validEmail(email) || name.length < 2 || !algo || !salt || !hash) return null;
    return {
      id: id, name: name, email: email, algo: algo, salt: salt, hash: hash,
      iter: algo === 'pbkdf2' ? clampInt(u.iter, 1000, 1000000, PBKDF2_ITER) : 0,
      createdAt: validTs(u.createdAt) || now()
    };
  }

  function emptyProgress() {
    return {
      xp: 0,
      levels: {},          // n -> {done, doneAt, quizBest, quizAttempts, quizPerfect, quizBonus, exercises:{id:tier}, challenge}
      badges: {},          // id -> ts
      events: {},          // name -> true
      streak: { current: 0, best: 0, last: '' },
      days: [],            // آخر 60 يوم نشاط (YYYY-MM-DD)
      activity: [],        // [{t, type, text, xp}]
      project: { stages: {}, done: false, doneAt: 0 },   // مشروع التخرج: stageId -> ts
      certs: {},           // half|full -> {id, name, course, issuedAt}
      updatedAt: 0
    };
  }

  function sanitizeLevel(l) {
    var out = { done: false, doneAt: 0, quizBest: 0, quizAttempts: 0, quizPerfect: false, quizBonus: false, exercises: {}, challenge: false };
    if (!isObj(l)) return out;
    out.done = l.done === true;
    out.doneAt = out.done ? validTs(l.doneAt) : 0;
    out.quizBest = clampInt(l.quizBest, 0, 100, 0);
    out.quizAttempts = clampInt(l.quizAttempts, 0, 9999, 0);
    out.quizPerfect = l.quizPerfect === true;
    out.quizBonus = l.quizBonus === true;
    out.challenge = l.challenge === true;
    if (isObj(l.exercises)) {
      var n = 0;
      for (var k in l.exercises) {
        if (!Object.prototype.hasOwnProperty.call(l.exercises, k)) continue;
        if (!ID_RE.test(k) || !GAME.xp.exercise.hasOwnProperty(l.exercises[k])) continue;
        out.exercises[k] = l.exercises[k];
        if (++n >= 60) break;
      }
    }
    return out;
  }

  function sanitizeProgress(p) {
    var out = emptyProgress();
    if (!isObj(p)) return out;
    out.xp = clampInt(p.xp, 0, 1e7, 0);
    if (isObj(p.levels)) {
      for (var n = 1; n <= TOTAL; n++) {
        if (isObj(p.levels[n])) out.levels[n] = sanitizeLevel(p.levels[n]);
      }
    }
    if (isObj(p.badges)) {
      GAME.badges.forEach(function (b) {
        var t = validTs(p.badges[b.id]);
        if (t) out.badges[b.id] = t;
      });
    }
    if (isObj(p.events)) {
      ['registered', 'firstRun', 'projectDone'].forEach(function (e) { if (p.events[e] === true) out.events[e] = true; });
    }
    if (isObj(p.streak)) {
      out.streak.current = clampInt(p.streak.current, 0, 100000, 0);
      out.streak.best = Math.max(out.streak.current, clampInt(p.streak.best, 0, 100000, 0));
      out.streak.last = validDayKey(p.streak.last) ? p.streak.last : '';
    }
    if (Array.isArray(p.days)) {
      out.days = p.days.filter(validDayKey).slice(-60);
    }
    if (Array.isArray(p.activity)) {
      out.activity = p.activity.filter(isObj).slice(-MAX_ACTIVITY).map(function (a) {
        return {
          t: validTs(a.t), type: cleanText(a.type, 20),
          text: cleanText(a.text, 120), xp: clampInt(a.xp, 0, 100000, 0)
        };
      }).filter(function (a) { return a.t && a.text; });
    }
    // مشروع التخرج: المراحل بالترتيب فقط
    if (isObj(p.project) && isObj(p.project.stages)) {
      var prevOk = true;
      GAME.project.stages.forEach(function (sid) {
        var ts = validTs(p.project.stages[sid]);
        if (ts && prevOk) out.project.stages[sid] = ts; else prevOk = false;
      });
      out.project.done = GAME.project.stages.every(function (sid) { return !!out.project.stages[sid]; });
      out.project.doneAt = out.project.done ? (validTs(p.project.doneAt) || out.project.stages[GAME.project.stages[GAME.project.stages.length - 1]]) : 0;
    }
    if (!out.project.done) delete out.events.projectDone;
    // الشهادات
    if (isObj(p.certs)) {
      Object.keys(GAME.certificates).forEach(function (k) {
        var c = sanitizeCert(p.certs[k], k);
        if (c) out.certs[k] = c;
      });
    }
    out.updatedAt = validTs(p.updatedAt);
    // اتساق: لا يمكن أن يكون مستوى مكتملًا بدون اكتمال السابق له
    var ok = true;
    for (var m = 1; m <= TOTAL; m++) {
      var lv = out.levels[m];
      if (lv && lv.done && !ok) { lv.done = false; lv.doneAt = 0; }
      if (!lv || !lv.done) ok = false;
    }
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* الشهادات: أرقام فريدة وتنقية                                         */
  /* ------------------------------------------------------------------ */
  var CERT_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var CERT_RE = /^RPA-([HF])-([A-HJ-NP-Z2-9]{4})-([A-HJ-NP-Z2-9]{4})-([A-HJ-NP-Z2-9])$/;
  function certCheck(body) {
    var s = 0;
    for (var i = 0; i < body.length; i++) { var k = CERT_CHARS.indexOf(body[i]); s = (s * 7 + (k < 0 ? 0 : k) + i) % 32; }
    return CERT_CHARS[s];
  }
  function newCertId(prefix) {
    var a = new Uint8Array(8);
    if (root.crypto && root.crypto.getRandomValues) root.crypto.getRandomValues(a); else for (var j = 0; j < 8; j++) a[j] = Math.floor(Math.random() * 256);
    var body = '';
    for (var i = 0; i < 8; i++) body += CERT_CHARS[a[i] % 32];
    return 'RPA-' + prefix + '-' + body.slice(0, 4) + '-' + body.slice(4) + '-' + certCheck(prefix + body);
  }
  function validCertId(id) {
    var m = CERT_RE.exec(String(id || '').trim().toUpperCase());
    return !!(m && certCheck(m[1] + m[2] + m[3]) === m[4]);
  }
  function cleanName(s) {
    s = String(s == null ? '' : s).replace(/[\u0000-\u001F\u007F<>{}\[\]\\|^~`$#@*=+_]/g, ' ').replace(/\s+/g, ' ').trim();
    return s.length > 60 ? s.slice(0, 60).trim() : s;
  }
  function validName(s) {
    if (s.length < 3 || s.length > 60) return false;
    var letters = s.replace(/[\s.'\-]/g, '');
    if (!letters) return false;
    // لازم يحتوي حروف (عربي أو لاتيني أو غيرهما)، ومينفعش يبقى أرقام بس
    return /[A-Za-z\u00C0-\u024F\u0600-\u06FF\u0750-\u077F]/.test(letters) && !/\d/.test(letters);
  }
  function sanitizeCert(c, type) {
    if (!isObj(c) || !GAME.certificates[type]) return null;
    var id = String(c.id || '').trim().toUpperCase();
    if (!validCertId(id) || id.charAt(4) !== GAME.certificates[type].prefix) return null;
    var name = cleanName(c.name);
    if (!validName(name)) return null;
    var at = validTs(c.issuedAt);
    if (!at) return null;
    return { id: id, type: type, name: name, course: GAME.certificates[type].course, issuedAt: at };
  }
  function loadRegistry() {
    var raw = readJSON(K_CERTS, {}), out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).forEach(function (id) {
      var r = raw[id];
      var c = r && sanitizeCert(r, r.type);
      if (c && c.id === id) { c.uid = typeof r.uid === 'string' && ID_RE.test(r.uid) ? r.uid : ''; out[id] = c; }
    });
    return out;
  }
  function registerCert(uid, c) {
    var reg = loadRegistry();
    reg[c.id] = { id: c.id, type: c.type, name: c.name, course: c.course, issuedAt: c.issuedAt, uid: uid };
    return writeJSON(K_CERTS, reg);
  }

  /* ------------------------------------------------------------------ */
  /* الأحداث                                                            */
  /* ------------------------------------------------------------------ */
  function emit(type, detail) {
    try { root.dispatchEvent(new CustomEvent('rpa:store', { detail: Object.assign({ type: type }, detail || {}) })); } catch (e) { /* ignore */ }
  }
  root.addEventListener('storage', function (e) {
    if (!e.key || e.key.indexOf(NS) !== 0) return;
    cache.progress = null; cache.uid = null;
    emit(e.key === K_SESSION ? 'session' : 'sync', { external: true });
  });

  /* ------------------------------------------------------------------ */
  /* المستخدمون والجلسة                                                 */
  /* ------------------------------------------------------------------ */
  var cache = { progress: null, uid: null };

  function loadUsers() {
    var raw = readJSON(K_USERS, {});
    var out = {};
    if (!isObj(raw)) return out;
    Object.keys(raw).forEach(function (k) {
      var u = sanitizeUser(raw[k]);
      if (u && u.id === k) out[k] = u;
    });
    return out;
  }
  function saveUsers(users) { return writeJSON(K_USERS, users); }
  function findByEmail(users, email) {
    var ks = Object.keys(users);
    for (var i = 0; i < ks.length; i++) if (users[ks[i]].email === email) return users[ks[i]];
    return null;
  }
  function publicUser(u) { return u ? { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt } : null; }

  function currentUser() {
    var id = rawGet(K_SESSION);
    if (!id || !ID_RE.test(id)) return null;
    var users = loadUsers();
    return users[id] ? publicUser(users[id]) : null;
  }
  function setSession(id) {
    cache.progress = null; cache.uid = null;
    if (id) rawSet(K_SESSION, id); else rawDel(K_SESSION);
  }

  function loadProgress(uid) {
    if (cache.uid === uid && cache.progress) return cache.progress;
    var p = sanitizeProgress(readJSON(K_DATA + uid, null));
    cache.uid = uid; cache.progress = p;
    return p;
  }
  function saveProgress(uid, p) {
    p.updatedAt = now();
    var ok = writeJSON(K_DATA + uid, p);
    cache.uid = uid; cache.progress = p;
    return ok;
  }

  /* قفل مؤقت بعد محاولات دخول فاشلة متكررة (حماية بسيطة من التجريب المتكرر) */
  function lockInfo(email) {
    var all = readJSON(K_LOCK, {});
    var e = isObj(all) && isObj(all[email]) ? all[email] : { fails: 0, until: 0 };
    return { all: isObj(all) ? all : {}, e: e };
  }
  function noteFail(email) {
    var li = lockInfo(email);
    li.e.fails = (li.e.fails || 0) + 1;
    if (li.e.fails >= MAX_FAILS) { li.e.until = now() + LOCK_MS; li.e.fails = 0; }
    li.all[email] = li.e;
    writeJSON(K_LOCK, li.all);
  }
  function clearFails(email) {
    var li = lockInfo(email);
    delete li.all[email];
    writeJSON(K_LOCK, li.all);
  }

  function fail(code, extra) { return Promise.resolve(Object.assign({ ok: false, error: code }, extra || {})); }

  function validatePassword(pw) {
    return typeof pw === 'string' && pw.length >= 6 && pw.length <= 100;
  }

  function register(input) {
    input = input || {};
    var name = cleanText(input.name, 40);
    var email = normEmail(input.email);
    var password = input.password;
    if (name.length < 2) return fail('name');
    if (!validEmail(email)) return fail('email');
    if (!validatePassword(password)) return fail('password');
    var users = loadUsers();
    if (findByEmail(users, email)) return fail('exists');
    if (Object.keys(users).length >= MAX_USERS) return fail('limit');
    return newHash(password).then(function (h) {
      var users2 = loadUsers();   // إعادة قراءة (قد يكون تبويب آخر سجّل في هذه الأثناء)
      if (findByEmail(users2, email)) return { ok: false, error: 'exists' };
      var id = 'u' + randHex(8);
      users2[id] = { id: id, name: name, email: email, salt: h.salt, hash: h.hash, algo: h.algo, iter: h.iter, createdAt: now() };
      if (!saveUsers(users2)) return { ok: false, error: lastError || 'storage' };
      var p = emptyProgress();
      p.events.registered = true;
      touchStreak(p, now(), true);
      logActivity(p, 'join', 'انضممت إلى الأكاديمية', 0);
      evaluateBadges(p);
      if (!saveProgress(id, p)) {
        delete users2[id]; saveUsers(users2);
        return { ok: false, error: lastError || 'storage' };
      }
      setSession(id);
      emit('login', { user: publicUser(users2[id]) });
      return { ok: true, user: publicUser(users2[id]), weak: h.algo === 'weak' };
    });
  }

  function login(emailIn, password) {
    var email = normEmail(emailIn);
    if (!validEmail(email) || typeof password !== 'string' || !password) return fail('credentials');
    var li = lockInfo(email);
    if (li.e.until && li.e.until > now()) return fail('locked', { wait: Math.ceil((li.e.until - now()) / 1000) });
    var users = loadUsers();
    var u = findByEmail(users, email);
    if (!u) { noteFail(email); return fail('credentials'); }
    return hashPassword(password, u.salt, u.algo, u.iter).then(function (h) {
      if (!safeEqual(h, u.hash)) { noteFail(email); return { ok: false, error: 'credentials' }; }
      clearFails(email);
      var upgrade = u.algo === 'weak' && hasSubtle() ? newHash(password) : Promise.resolve(null);
      return upgrade.then(function (nh) {
        if (nh) {
          var us = loadUsers();
          if (us[u.id]) { us[u.id].salt = nh.salt; us[u.id].hash = nh.hash; us[u.id].algo = nh.algo; us[u.id].iter = nh.iter; saveUsers(us); }
        }
        setSession(u.id);
        var p = loadProgress(u.id);
        if (touchStreak(p, now(), false)) saveProgress(u.id, p);
        emit('login', { user: publicUser(u) });
        return { ok: true, user: publicUser(u) };
      });
    }, function () { return { ok: false, error: 'crypto' }; });
  }

  function logout() {
    setSession(null);
    emit('logout');
  }

  function verifyPassword(password) {
    var u = currentRecord();
    if (!u || typeof password !== 'string') return Promise.resolve(false);
    return hashPassword(password, u.salt, u.algo, u.iter).then(function (h) { return safeEqual(h, u.hash); }, function () { return false; });
  }
  function currentRecord() {
    var id = rawGet(K_SESSION);
    if (!id) return null;
    return loadUsers()[id] || null;
  }

  function updateName(name) {
    name = cleanText(name, 40);
    if (name.length < 2) return { ok: false, error: 'name' };
    var id = rawGet(K_SESSION), users = loadUsers();
    if (!id || !users[id]) return { ok: false, error: 'auth' };
    users[id].name = name;
    if (!saveUsers(users)) return { ok: false, error: lastError || 'storage' };
    emit('profile');
    return { ok: true, user: publicUser(users[id]) };
  }

  function changePassword(oldPw, newPw) {
    if (!validatePassword(newPw)) return fail('password');
    return verifyPassword(oldPw).then(function (ok) {
      if (!ok) return { ok: false, error: 'credentials' };
      return newHash(newPw).then(function (h) {
        var id = rawGet(K_SESSION), users = loadUsers();
        if (!id || !users[id]) return { ok: false, error: 'auth' };
        users[id].salt = h.salt; users[id].hash = h.hash; users[id].algo = h.algo; users[id].iter = h.iter;
        if (!saveUsers(users)) return { ok: false, error: lastError || 'storage' };
        return { ok: true };
      });
    });
  }

  function deleteAccount(password) {
    return verifyPassword(password).then(function (ok) {
      if (!ok) return { ok: false, error: 'credentials' };
      var id = rawGet(K_SESSION), users = loadUsers();
      if (!id || !users[id]) return { ok: false, error: 'auth' };
      delete users[id];
      saveUsers(users);
      rawDel(K_DATA + id);
      // حذف شهادات الطالب من سجل التحقق المحلي
      try {
        var reg = loadRegistry(), changed = false;
        Object.keys(reg).forEach(function (cid) { if (reg[cid].uid === id) { delete reg[cid]; changed = true; } });
        if (changed) writeJSON(K_CERTS, reg);
      } catch (e) { /* ignore */ }
      // حذف مسودات الكود الخاصة بالطالب (rpa.v1.draft.<id>.*)
      try {
        var pre = NS + 'draft.' + id + '.', del = [];
        for (var i = 0; i < ls().length; i++) { var k = ls().key(i); if (k && k.indexOf(pre) === 0) del.push(k); }
        del.forEach(rawDel);
      } catch (e) { /* ignore */ }
      setSession(null);
      emit('logout');
      return { ok: true };
    });
  }

  /* ------------------------------------------------------------------ */
  /* التقدم: XP، السلسلة، الشارات                                       */
  /* ------------------------------------------------------------------ */
  function logActivity(p, type, text, xp) {
    p.activity.push({ t: now(), type: type, text: cleanText(text, 120), xp: xp || 0 });
    if (p.activity.length > MAX_ACTIVITY) p.activity = p.activity.slice(-MAX_ACTIVITY);
  }

  // يحدّث السلسلة اليومية. يعيد true إن تغيّر شيء. firstDay = عند التسجيل (لا مكافأة).
  function touchStreak(p, ts, firstDay) {
    var today = dayKey(ts);
    if (p.streak.last === today) return false;
    var bonus = 0;
    if (p.streak.last === prevDayKey(ts)) {
      p.streak.current += 1;
      bonus = GAME.xp.dailyStreakBonus;
    } else {
      p.streak.current = 1;
    }
    p.streak.last = today;
    if (p.streak.current > p.streak.best) p.streak.best = p.streak.current;
    if (p.days.indexOf(today) < 0) p.days.push(today);
    if (p.days.length > 60) p.days = p.days.slice(-60);
    if (bonus && !firstDay) {
      p.xp += bonus;
      logActivity(p, 'streak', 'سلسلة ' + p.streak.current + ' أيام متتالية', bonus);
    }
    evaluateBadges(p);
    return true;
  }

  function completedCount(p) {
    var c = 0;
    for (var n = 1; n <= TOTAL; n++) if (p.levels[n] && p.levels[n].done) c++;
    return c;
  }
  function totals(p) {
    var ex = 0, ch = 0, perfect = 0;
    for (var n = 1; n <= TOTAL; n++) {
      var l = p.levels[n];
      if (!l) continue;
      ex += Object.keys(l.exercises).length;
      if (l.challenge) ch++;
      if (l.quizPerfect) perfect++;
    }
    return { exercises: ex, challenges: ch, perfect: perfect };
  }
  function ruleMet(rule, p, t) {
    switch (rule.type) {
      case 'event': return p.events[rule.name] === true;
      case 'levels': return completedCount(p) >= rule.count;
      case 'level': return !!(p.levels[rule.n] && p.levels[rule.n].done);
      case 'group':
        var g = CUR.groups[rule.key];
        for (var n = g.from; n <= g.to; n++) if (!(p.levels[n] && p.levels[n].done)) return false;
        return true;
      case 'xp': return p.xp >= rule.amount;
      case 'streak': return p.streak.best >= rule.days;
      case 'perfect': return t.perfect >= rule.count;
      case 'exercises': return t.exercises >= rule.count;
      case 'challenges': return t.challenges >= rule.count;
      default: return false;
    }
  }
  // يمنح الشارات المستحقة ويعيد قائمة الجديد منها.
  function evaluateBadges(p) {
    var fresh = [], t = totals(p), ts = now();
    GAME.badges.forEach(function (b) {
      if (!p.badges[b.id] && ruleMet(b.rule, p, t)) {
        p.badges[b.id] = ts;
        fresh.push(b);
        logActivity(p, 'badge', 'شارة جديدة: ' + b.title, 0);
      }
    });
    return fresh;
  }

  /* ------------------------------------------------------------------ */
  /* واجهة التقدم                                                       */
  /* ------------------------------------------------------------------ */
  function validLevel(n) { n = Number(n); return n >= 1 && n <= TOTAL && Math.floor(n) === n ? n : 0; }

  function isUnlockedIn(p, n) {
    if (n === 1) return true;
    return !!(p.levels[n - 1] && p.levels[n - 1].done);
  }

  function levelState(n) {
    var u = currentRecord(); n = validLevel(n);
    if (!u || !n) return 'locked';
    var p = loadProgress(u.id);
    if (p.levels[n] && p.levels[n].done) return 'done';
    return isUnlockedIn(p, n) ? 'open' : 'locked';
  }
  function isUnlocked(n) { return levelState(n) !== 'locked'; }

  // نمط موحّد لكل عمليات التسجيل: تحقق → تعديل → تقييم الشارات → حفظ → حدث.
  function mutate(n, fn) {
    var u = currentRecord();
    if (!u) return { ok: false, error: 'auth' };
    n = validLevel(n);
    if (!n) return { ok: false, error: 'level' };
    var p = loadProgress(u.id);
    if (!isUnlockedIn(p, n)) return { ok: false, error: 'locked' };
    var before = { xp: p.xp, rank: GAME.rankFor(p.xp).key };
    if (!p.levels[n]) p.levels[n] = sanitizeLevel(null);
    var res = fn(p, p.levels[n]);
    if (!res || res.ok === false) return res || { ok: false, error: 'noop' };
    touchStreak(p, now(), false);
    var newBadges = evaluateBadges(p);
    if (!saveProgress(u.id, p)) { cache.progress = null; return { ok: false, error: lastError || 'storage' }; }
    var out = Object.assign({ ok: true, xpGained: p.xp - before.xp, xp: p.xp, newBadges: newBadges,
      rankUp: GAME.rankFor(p.xp).key !== before.rank ? GAME.rankFor(p.xp) : null }, res);
    emit('progress', { level: n, result: out });
    return out;
  }

  // تسجيل حل تمرين (مرة واحدة فقط لكل تمرين — لا تتضاعف النقاط عند التكرار).
  function recordExercise(n, exerciseId, tier) {
    if (typeof exerciseId !== 'string' || !ID_RE.test(exerciseId)) return { ok: false, error: 'exercise' };
    if (!GAME.xp.exercise.hasOwnProperty(tier)) return { ok: false, error: 'tier' };
    return mutate(n, function (p, l) {
      if (l.exercises[exerciseId]) return { ok: true, already: true };
      if (Object.keys(l.exercises).length >= 60) return { ok: false, error: 'limit' };
      var xp = GAME.xp.exercise[tier];
      l.exercises[exerciseId] = tier;
      p.xp += xp;
      logActivity(p, 'exercise', 'حللت تمرينًا في المستوى ' + n, xp);
      return { ok: true, already: false };
    });
  }

  function recordChallenge(n) {
    return mutate(n, function (p, l) {
      if (l.challenge) return { ok: true, already: true };
      l.challenge = true;
      p.xp += GAME.xp.finalChallenge;
      logActivity(p, 'challenge', 'أنجزت تحدي المستوى ' + n, GAME.xp.finalChallenge);
      return { ok: true, already: false };
    });
  }

  // تسجيل نتيجة اختبار (نسبة مئوية). النجاح >= 70% يفتح المستوى التالي.
  function recordQuiz(n, percent) {
    percent = Number(percent);
    if (!isFinite(percent)) return { ok: false, error: 'percent' };
    percent = clampInt(Math.round(percent), 0, 100, 0);
    return mutate(n, function (p, l) {
      var passed = percent >= CUR.quizPassPercent;
      var wasDone = l.done;
      l.quizAttempts += 1;
      if (percent > l.quizBest) l.quizBest = percent;
      var gained = 0, justCompleted = false;
      if (passed && !wasDone) {
        l.done = true; l.doneAt = now(); justCompleted = true;
        gained += GAME.xp.quizPass + GAME.xp.levelComplete;
        logActivity(p, 'level', 'أكملت المستوى ' + n + ' بنسبة ' + percent + '%', GAME.xp.quizPass + GAME.xp.levelComplete);
      }
      if (percent === 100 && !l.quizBonus) {
        l.quizPerfect = true; l.quizBonus = true;
        gained += GAME.xp.quizPerfectBonus;
        logActivity(p, 'quiz', 'درجة كاملة في اختبار المستوى ' + n, GAME.xp.quizPerfectBonus);
      }
      p.xp += gained;
      return { ok: true, passed: passed, percent: percent, justCompleted: justCompleted,
        nextUnlocked: justCompleted && n < TOTAL ? n + 1 : 0 };
    });
  }

  /* ------------------------------------------------------------------ */
  /* مشروع التخرج                                                        */
  /* ------------------------------------------------------------------ */
  function projectUnlockedIn(p) { var n = GAME.project.unlockLevel; return !!(p.levels[n] && p.levels[n].done); }

  function projectState() {
    var u = currentRecord();
    if (!u) return null;
    var p = loadProgress(u.id);
    var st = GAME.project.stages;
    var next = '';
    for (var i = 0; i < st.length; i++) if (!p.project.stages[st[i]]) { next = st[i]; break; }
    return { unlocked: projectUnlockedIn(p), stages: JSON.parse(JSON.stringify(p.project.stages)), done: p.project.done,
      doneAt: p.project.doneAt, next: next, completed: Object.keys(p.project.stages).length, total: st.length };
  }

  // تسجيل نجاح مرحلة (مرة واحدة فقط، وبالترتيب، وبعد إكمال المستوى 20)
  function recordProjectStage(stageId) {
    var u = currentRecord();
    if (!u) return { ok: false, error: 'auth' };
    var st = GAME.project.stages, idx = st.indexOf(stageId);
    if (idx < 0) return { ok: false, error: 'stage' };
    var p = loadProgress(u.id);
    if (!projectUnlockedIn(p)) return { ok: false, error: 'locked' };
    if (p.project.stages[stageId]) return { ok: true, already: true, xpGained: 0, xp: p.xp, newBadges: [], projectDone: p.project.done };
    for (var i = 0; i < idx; i++) if (!p.project.stages[st[i]]) return { ok: false, error: 'order' };
    var before = { xp: p.xp, rank: GAME.rankFor(p.xp).key };
    p.project.stages[stageId] = now();
    p.xp += GAME.xp.projectStage;
    logActivity(p, 'project', 'أنجزت المرحلة ' + (idx + 1) + ' في مشروع التخرج', GAME.xp.projectStage);
    var finished = false;
    if (st.every(function (s) { return !!p.project.stages[s]; }) && !p.project.done) {
      p.project.done = true; p.project.doneAt = now(); p.events.projectDone = true; finished = true;
      p.xp += GAME.xp.projectComplete;
      logActivity(p, 'project', 'أنهيت مشروع التخرج بالكامل!', GAME.xp.projectComplete);
    }
    touchStreak(p, now(), false);
    var newBadges = evaluateBadges(p);
    if (!saveProgress(u.id, p)) { cache.progress = null; return { ok: false, error: lastError || 'storage' }; }
    var out = { ok: true, already: false, xpGained: p.xp - before.xp, xp: p.xp, newBadges: newBadges, projectDone: finished,
      rankUp: GAME.rankFor(p.xp).key !== before.rank ? GAME.rankFor(p.xp) : null };
    emit('progress', { project: stageId, result: out });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* الشهادات (مسار تجريبي محلي — قابل للتلاعب وليس اعتمادًا رسميًا)       */
  /* ------------------------------------------------------------------ */
  function certEligibility(p, type) {
    var cfg = GAME.certificates[type];
    var done = completedCount(p);
    var levelsOk = done >= cfg.levels;
    var projectOk = !cfg.project || p.project.done;
    var reasons = [];
    if (!levelsOk) reasons.push('أكمل ' + cfg.levels + ' مستوى (أكملت ' + done + ')');
    if (!projectOk) reasons.push('أنهِ مشروع التخرج (' + Object.keys(p.project.stages).length + '/' + GAME.project.stages.length + ' مراحل)');
    return { eligible: levelsOk && projectOk, levelsDone: Math.min(done, cfg.levels), levelsNeeded: cfg.levels, projectNeeded: cfg.project,
      projectDone: p.project.done, reasons: reasons };
  }
  function certificateStatus() {
    var u = currentRecord();
    if (!u) return null;
    var p = loadProgress(u.id), out = {};
    Object.keys(GAME.certificates).forEach(function (k) {
      var e = certEligibility(p, k);
      e.issued = p.certs[k] ? JSON.parse(JSON.stringify(p.certs[k])) : null;
      e.course = GAME.certificates[k].course;
      e.title = GAME.certificates[k].title;
      out[k] = e;
    });
    return out;
  }
  // إصدار شهادة: مرة واحدة فقط لكل نوع، وبعد التحقق من التقدم المحفوظ
  function issueCertificate(type, nameIn) {
    var u = currentRecord();
    if (!u) return { ok: false, error: 'auth' };
    if (!GAME.certificates[type]) return { ok: false, error: 'type' };
    var p = loadProgress(u.id);
    if (p.certs[type]) return { ok: true, already: true, cert: JSON.parse(JSON.stringify(p.certs[type])) };
    var e = certEligibility(p, type);
    if (!e.eligible) return { ok: false, error: 'not-eligible', reasons: e.reasons };
    var name = cleanName(nameIn);
    if (!validName(name)) return { ok: false, error: 'cert-name' };
    var reg = loadRegistry(), id;
    do { id = newCertId(GAME.certificates[type].prefix); } while (reg[id]);
    var cert = { id: id, type: type, name: name, course: GAME.certificates[type].course, issuedAt: now() };
    p.certs[type] = cert;
    logActivity(p, 'cert', 'استلمت ' + GAME.certificates[type].title, 0);
    if (!saveProgress(u.id, p)) { cache.progress = null; return { ok: false, error: lastError || 'storage' }; }
    registerCert(u.id, cert);
    emit('progress', { cert: type });
    return { ok: true, already: false, cert: JSON.parse(JSON.stringify(cert)) };
  }
  // التحقق المحلي: يبحث في سجل الشهادات المحفوظ على هذا المتصفح فقط
  function verifyCertificate(idIn) {
    var id = String(idIn || '').trim().toUpperCase();
    if (!validCertId(id)) return { ok: false, error: 'format' };
    var c = loadRegistry()[id];
    if (!c) return { ok: false, error: 'not-found' };
    return { ok: true, cert: { id: c.id, type: c.type, name: c.name, course: c.course, issuedAt: c.issuedAt } };
  }

  /* ------------------------------------------------------------------ */
  /* قراءة الحالة                                                       */
  /* ------------------------------------------------------------------ */
  function getProgress() {
    var u = currentRecord();
    if (!u) return null;
    var p = loadProgress(u.id);
    return JSON.parse(JSON.stringify(p));
  }

  function summary() {
    var u = currentRecord();
    if (!u) return null;
    var p = loadProgress(u.id);
    var done = completedCount(p), t = totals(p);
    var rank = GAME.rankFor(p.xp), next = GAME.nextRank(p.xp);
    var current = 0;
    for (var n = 1; n <= TOTAL; n++) { if (!(p.levels[n] && p.levels[n].done)) { current = n; break; } }
    var rankPct = next ? Math.round(((p.xp - rank.min) / (next.min - rank.min)) * 100) : 100;
    return {
      user: publicUser(u), xp: p.xp, rank: rank, nextRank: next, rankPercent: rankPct,
      completed: done, total: TOTAL, percent: Math.round((done / TOTAL) * 100),
      currentLevel: current, finished: done === TOTAL,
      exercises: t.exercises, challenges: t.challenges, perfect: t.perfect,
      badgeCount: Object.keys(p.badges).length, badgeTotal: GAME.badges.length,
      streak: p.streak.current && (p.streak.last === dayKey(now()) || p.streak.last === prevDayKey(now())) ? p.streak.current : 0,
      projectDone: p.project.done, projectStages: Object.keys(p.project.stages).length, projectTotal: GAME.project.stages.length,
      projectUnlocked: projectUnlockedIn(p), certCount: Object.keys(p.certs).length,
      bestStreak: p.streak.best
    };
  }

  function levelInfo(n) {
    var u = currentRecord(); n = validLevel(n);
    if (!u || !n) return null;
    var p = loadProgress(u.id);
    var l = p.levels[n] || sanitizeLevel(null);
    return {
      n: n, state: levelState(n), quizBest: l.quizBest, quizAttempts: l.quizAttempts,
      exercises: Object.keys(l.exercises).length, challenge: l.challenge, doneAt: l.doneAt
    };
  }

  /* ------------------------------------------------------------------ */
  /* نسخة احتياطية: تصدير / استيراد                                      */
  /* ------------------------------------------------------------------ */
  function exportBackup() {
    var u = currentRecord();
    if (!u) return null;
    return {
      format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now(),
      note: 'نسخة احتياطية من RASLAN PYTHON ACADEMY. تحتوي بياناتك ومعرّف كلمة المرور (Hash) وليس كلمة المرور نفسها. احتفظ بها في مكان آمن.',
      user: { id: u.id, name: u.name, email: u.email, algo: u.algo, salt: u.salt, hash: u.hash, iter: u.iter, createdAt: u.createdAt },
      progress: loadProgress(u.id)
    };
  }

  // يعيد {ok, email, replaced}. replace=false: إن كان البريد موجودًا يعيد error:'exists' + needsConfirm
  function importBackup(text, replace) {
    var data;
    if (typeof text === 'string') {
      if (text.length > 400000) return { ok: false, error: 'size' };
      try { data = JSON.parse(text); } catch (e) { return { ok: false, error: 'json' }; }
    } else data = text;
    if (!isObj(data) || data.format !== BACKUP_FORMAT || data.version !== BACKUP_VERSION) return { ok: false, error: 'format' };
    var u = sanitizeUser(data.user);
    if (!u) return { ok: false, error: 'user' };
    var p = sanitizeProgress(data.progress);
    var users = loadUsers();
    var same = findByEmail(users, u.email);
    if (same && !replace) return { ok: false, error: 'exists', needsConfirm: true, email: u.email };
    if (same) { rawDel(K_DATA + same.id); delete users[same.id]; }
    if (users[u.id]) u.id = 'u' + randHex(8);     // تعارض في المعرّف: معرّف جديد
    if (Object.keys(users).length >= MAX_USERS) return { ok: false, error: 'limit' };
    users[u.id] = u;
    if (!saveUsers(users)) return { ok: false, error: lastError || 'storage' };
    evaluateBadges(p);
    if (!saveProgress(u.id, p)) return { ok: false, error: lastError || 'storage' };
    Object.keys(p.certs).forEach(function (k) { registerCert(u.id, p.certs[k]); });
    setSession(u.id);
    emit('login', { user: publicUser(u), imported: true });
    return { ok: true, email: u.email, replaced: !!same };
  }

  function resetProgress(password) {
    return verifyPassword(password).then(function (ok) {
      if (!ok) return { ok: false, error: 'credentials' };
      var u = currentRecord();
      if (!u) return { ok: false, error: 'auth' };
      var old = loadProgress(u.id);
      var p = emptyProgress();
      p.events.registered = true;
      p.certs = old.certs || {};   // الشهادات الصادرة تبقى كما هي ولا تُصدر مرة ثانية
      touchStreak(p, now(), true);
      logActivity(p, 'join', 'أعدت ضبط التقدم من البداية', 0);
      evaluateBadges(p);
      if (!saveProgress(u.id, p)) return { ok: false, error: lastError || 'storage' };
      emit('progress', { reset: true });
      return { ok: true };
    });
  }

  function storageInfo() {
    var bytes = 0;
    if (persistent) {
      try {
        for (var i = 0; i < ls().length; i++) {
          var k = ls().key(i);
          if (k && k.indexOf(NS) === 0) bytes += (k.length + (ls().getItem(k) || '').length) * 2;
        }
      } catch (e) { /* ignore */ }
    }
    return { persistent: persistent, bytes: bytes, users: Object.keys(loadUsers()).length, strongHash: hasSubtle() };
  }

  /* ------------------------------------------------------------------ */
  /* الواجهة العامة                                                     */
  /* ------------------------------------------------------------------ */
  root.RPAStore = {
    version: 1,
    total: TOTAL,
    // الحساب
    register: register, login: login, logout: logout,
    currentUser: currentUser, isLoggedIn: function () { return !!currentRecord(); },
    updateName: updateName, changePassword: changePassword,
    deleteAccount: deleteAccount, resetProgress: resetProgress,
    // التقدم (تستدعيها المراحل القادمة: المحرر والاختبارات)
    recordExercise: recordExercise, recordChallenge: recordChallenge, recordQuiz: recordQuiz,
    levelState: levelState, isUnlocked: isUnlocked, levelInfo: levelInfo,
    getProgress: getProgress, summary: summary,
    // مشروع التخرج والشهادات
    projectState: projectState, recordProjectStage: recordProjectStage,
    certificateStatus: certificateStatus, issueCertificate: issueCertificate, verifyCertificate: verifyCertificate,
    certName: { clean: cleanName, valid: validName }, validCertId: validCertId,
    // نسخ احتياطي
    exportBackup: exportBackup, importBackup: importBackup,
    storageInfo: storageInfo,
    // ثوابت مفيدة للواجهات
    constants: { MAX_USERS: MAX_USERS, LOCK_SECONDS: LOCK_MS / 1000, MAX_FAILS: MAX_FAILS, MIN_PASSWORD: 6 },
    // للاختبارات فقط
    _test: {
      setNow: function (fn) { now = typeof fn === 'function' ? fn : function () { return Date.now(); }; cache.progress = null; },
      sanitizeProgress: sanitizeProgress, sanitizeUser: sanitizeUser, validCertId: validCertId, newCertId: newCertId, cleanName: cleanName, validName: validName, dayKey: dayKey, clearCache: function () { cache.progress = null; cache.uid = null; }
    }
  };
})(window);
