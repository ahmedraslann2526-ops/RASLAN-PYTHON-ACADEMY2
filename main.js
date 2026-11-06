/* =====================================================================
   RASLAN PYTHON ACADEMY — main.js  (Phase 1)
   Loader • smooth scrolling • scroll reveal • animated background • navigation
   mobile menu • levels filter/accordion • timeline • PYTHON BOT wiring
   ---------------------------------------------------------------------
   Later phases extend this file through the global `RPA` object.
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Config (edit here)                                                   */
  /* ------------------------------------------------------------------ */
  var CONFIG = {
    // Path to the founder's photo, e.g. 'Assets/images/founder.jpg'. Leave empty to show the AR placeholder.
    founderPhoto: ''
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var body = document.body;
  var root = document.documentElement;
  var navEl = $('#nav');

  root.classList.add('js-ready');

  /* ------------------------------------------------------------------ */
  /* PYTHON BOT                                                           */
  /* ------------------------------------------------------------------ */
  var bot = null;
  var botReady = false;
  var botLines = {
    normal: ['أهلاً! أنا PYTHON BOT، مدرّسك الافتراضي 👋', 'جاهز تبدأ؟ أنا معاك في كل خطوة.', 'اضغط عليّ وشوف تعبيرات وشي جديد!'],
    happy: ['جاهزين نتعلم Python سوا؟ 😄', 'أول سطر كود بيكون أحلى لحظة!'],
    wow: ['واااو! البرمجة أسهل مما تتخيل!', 'تخيل تبني مشروعك بإيدك! 🚀'],
    wink: ['سر صغير: الممارسة هي الطريق 😉', 'اكتب كود كل يوم ولو سطرين.'],
    love: ['بحب الكود النضيف! 💙', 'Python لغة تتحب من أول يوم!'],
    think: ['همم... هنكتب أول برنامج النهارده؟ 🤔', 'فكر بالمنطق وسيب الباقي على Python.']
  };
  var lineIdx = {};
  var bubble = $('#botBubble');
  var bubbleTimer = null;

  function sayFor(name, force) {
    if (!bubble) return;
    var pool = botLines[name] || botLines.normal;
    lineIdx[name] = ((lineIdx[name] === undefined ? -1 : lineIdx[name]) + 1) % pool.length;
    var text = pool[lineIdx[name]];
    if (!force && bubble.textContent === text) return;
    bubble.classList.add('is-swapping');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.textContent = text; bubble.classList.remove('is-swapping'); }, 260);
  }

  function initBot() {
    var holder = $('#botCanvas');
    if (!holder || typeof window.PythonBot !== 'function') { botReady = true; return; }
    try {
      bot = new window.PythonBot(holder, { followPointer: true, greet: true, autoExpressions: !reduceMotion });
    } catch (err) {
      if (window.console) console.warn('[RPA] PythonBot failed to start:', err);
      botReady = true;
      return;
    }
    holder.addEventListener('bot:expression', function (e) { sayFor(e.detail.name); });

    var wrap = $('#botWrap');
    var mood = $('#botMood');
    function poke(e) {
      if (e) e.stopPropagation();
      var n = bot.nextExpression();
      bot.wave(1800);
      sayFor(n, true);
    }
    if (mood) mood.addEventListener('click', poke);
    if (wrap) wrap.addEventListener('click', function (e) { if (!e.target.closest('#botMood')) poke(); });
    botReady = true;
  }

  /* ------------------------------------------------------------------ */
  /* Loader                                                               */
  /* ------------------------------------------------------------------ */
  var loader = $('#loader');
  var loaderBar = $('#loaderBar');
  var loaderPct = $('#loaderPct');
  var loaderShown = 0, loaderTarget = 8, loaderDone = false, loaderStart = performance.now();

  function setLoaderTarget(v) { loaderTarget = Math.max(loaderTarget, v); }

  function tickLoader() {
    if (loaderDone) return;
    loaderShown += (loaderTarget - loaderShown) * 0.12 + 0.15;
    if (loaderShown > loaderTarget) loaderShown = loaderTarget;
    var v = Math.round(loaderShown);
    if (loaderBar) loaderBar.style.width = v + '%';
    if (loaderPct) loaderPct.textContent = v;
    var minTime = performance.now() - loaderStart > 1100;
    if (v >= 100 && minTime) { finishLoader(); return; }
    requestAnimationFrame(tickLoader);
  }

  function finishLoader() {
    if (loaderDone) return;
    loaderDone = true;
    if (loaderBar) loaderBar.style.width = '100%';
    if (loaderPct) loaderPct.textContent = '100';
    if (loader) loader.classList.add('is-done');
    body.classList.remove('is-loading');
    setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 1200);
    onPageReady();
  }

  /* ------------------------------------------------------------------ */
  /* Smooth scrolling                                                     */
  /* ------------------------------------------------------------------ */
  var scrollAnim = null;
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function cancelScrollAnim() { if (scrollAnim) { cancelAnimationFrame(scrollAnim.raf); scrollAnim = null; } }

  function smoothScrollTo(y, done) {
    cancelScrollAnim();
    var maxY = document.documentElement.scrollHeight - window.innerHeight;
    y = clamp(y, 0, Math.max(0, maxY));
    var startY = window.pageYOffset;
    var dist = y - startY;
    if (reduceMotion || Math.abs(dist) < 2) { window.scrollTo(0, y); if (done) done(); return; }
    var duration = clamp(500 + Math.abs(dist) * 0.35, 600, 1500);
    var t0 = null;
    scrollAnim = { raf: 0 };
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / duration, 0, 1);
      window.scrollTo(0, startY + dist * easeInOutCubic(p));
      if (p < 1) { scrollAnim.raf = requestAnimationFrame(step); }
      else { scrollAnim = null; if (done) done(); }
    }
    scrollAnim.raf = requestAnimationFrame(step);
  }
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (ev === 'keydown' && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) === -1) return;
      cancelScrollAnim();
    }, { passive: true });
  });

  function navOffset() { return navEl ? navEl.offsetHeight + 8 : 76; }

  function scrollToHash(hash, opts) {
    opts = opts || {};
    var target = null, y = 0;
    if (hash === '#home' || hash === '#' || !hash) { y = 0; }
    else {
      target = $(hash);
      if (!target) return;
      y = target.getBoundingClientRect().top + window.pageYOffset - navOffset() + (target.classList.contains('section') ? 6 : 0);
    }
    if (opts.startLevel) {
      var first = $('.level[data-n="1"]');
      if (first) y = first.getBoundingClientRect().top + window.pageYOffset - navOffset() - 130;
    }
    smoothScrollTo(y, function () { if (opts.startLevel) openStartLevel(); });
    if (history.replaceState && hash) { try { history.replaceState(null, '', hash === '#' ? location.pathname : hash); } catch (e) { /* file:// quirks */ } }
  }

  function bindAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-scroll]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      e.preventDefault();
      var start = a.hasAttribute('data-start');
      var inMenu = !!a.closest('#mobileMenu');
      if (inMenu) {
        closeMenu(true);
        setTimeout(function () { scrollToHash(href, { startLevel: start }); }, 120);
      } else {
        scrollToHash(href, { startLevel: start });
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                          */
  /* ------------------------------------------------------------------ */
  var burger = $('#burger');
  var menu = $('#mobileMenu');
  var menuOpen = false;

  function openMenu() {
    if (!menu || menuOpen) return;
    menuOpen = true;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'إغلاق القائمة');
    setTimeout(function () { var l = $('.mobile-menu__link', menu); if (l) l.focus({ preventScroll: true }); }, 350);
  }
  function closeMenu(skipFocus) {
    if (!menu || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'فتح القائمة');
    if (!skipFocus) burger.focus({ preventScroll: true });
  }
  function bindMenu() {
    if (!burger || !menu) return;
    burger.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
    $$('[data-close-menu]', menu).forEach(function (el) { el.addEventListener('click', function () { closeMenu(); }); });
    document.addEventListener('keydown', function (e) {
      if (!menuOpen) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') {   // simple focus trap
        var f = $$('a[href], button', menu).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860 && menuOpen) closeMenu(true); });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-driven UI: nav state, progress, spy, to-top, timeline        */
  /* ------------------------------------------------------------------ */
  var navLinksWrap = $('#navLinks');
  var indicator = $('#navIndicator');
  var progressBar = $('#scrollProgress');
  var toTop = $('#toTop');
  var sections = $$('[data-section]');
  var currentNav = '';
  var timeline = $('#timeline');
  var timelineFill = $('#timelineFill');
  var timelineItems = $$('.timeline__item');
  var ticking = false;

  function moveIndicator(name) {
    if (!indicator || !navLinksWrap) return;
    var link = $('.nav__link[data-nav="' + name + '"]', navLinksWrap);
    if (!link || navLinksWrap.offsetParent === null) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
  }

  function setActiveNav(name) {
    if (name === currentNav) return;
    currentNav = name;
    $$('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === name;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    moveIndicator(name);
  }

  function onScroll() {
    ticking = false;
    var y = window.pageYOffset;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    if (navEl) navEl.classList.toggle('is-scrolled', y > 30);
    if (progressBar) progressBar.style.transform = 'scaleX(' + (docH > 0 ? clamp(y / docH, 0, 1) : 0) + ')';
    if (toTop) toTop.classList.toggle('is-visible', y > vh * 0.9);

    // scroll spy
    var probe = y + vh * 0.38;
    var active = 'home';
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      if (s.offsetTop <= probe) active = s.getAttribute('data-nav-owner') || s.getAttribute('data-section');
    }
    if (docH > 0 && y >= docH - 4) active = 'contact';
    setActiveNav(active);

    // timeline progress
    if (timeline && timelineFill) {
      var r = timeline.getBoundingClientRect();
      var line = vh * 0.6;
      var ratio = clamp((line - r.top) / r.height, 0, 1);
      timelineFill.style.transform = 'scaleY(' + ratio + ')';
      timelineItems.forEach(function (it) {
        var n = it.querySelector('.timeline__node').getBoundingClientRect();
        it.classList.toggle('is-reached', n.top + n.height / 2 < line);
      });
    }
  }
  function requestScrollTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                        */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* Animated background (particle network)                               */
  /* ------------------------------------------------------------------ */
  function initBackground() {
    var canvas = $('#bgCanvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, parts = [];
    var mouse = { x: -9999, y: -9999 };
    var colors = ['34,211,238', '79,139,255', '139,92,246'];
    var running = true;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = clamp(Math.round((W * H) / 24000), 22, W < 700 ? 38 : 80);
      parts = [];
      for (var i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.7 + 0.6, c: colors[i % 3]
        });
      }
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var link = W < 700 ? 105 : 135;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        for (var j = i + 1; j < parts.length; j++) {
          var q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < link * link) {
            var a = (1 - Math.sqrt(d2) / link) * 0.22;
            ctx.strokeStyle = 'rgba(' + p.c + ',' + a.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(' + p.c + ',0.85)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
    }

    var lastBg = 0, throttleBg = !canHover;      // touch devices: 30fps is plenty for the particle network
    function step(ts) {
      if (!running) return;
      if (throttleBg && ts - lastBg < 30) { requestAnimationFrame(step); return; }
      lastBg = ts || 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140 && d2 > 1) { var d = Math.sqrt(d2), f = (140 - d) / 140 * 0.6; p.vx += dx / d * f * 0.05; p.vy += dy / d * f * 0.05; }
        p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
      draw();
      requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      var was = running; running = !document.hidden && !reduceMotion;
      if (running && !was) requestAnimationFrame(step);
    });
    resize();
    if (!reduceMotion) requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ */
  /* Cursor glow • spotlight • tilt • ripple                              */
  /* ------------------------------------------------------------------ */
  function initPointerEffects() {
    var glow = $('#cursorGlow');
    if (canHover && glow && !reduceMotion) {
      var gx = 0, gy = 0, tx = 0, ty = 0, on = false;
      window.addEventListener('pointermove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!on) { on = true; glow.classList.add('is-on'); gx = tx; gy = ty; requestAnimationFrame(follow); }
      }, { passive: true });
      document.addEventListener('pointerleave', function () { glow.classList.remove('is-on'); on = false; });
      var follow = function () {
        if (!on) return;
        gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
        glow.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
        requestAnimationFrame(follow);
      };
    }

    // Spotlight + 3D tilt
    $$('.spot').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        if (canHover && !reduceMotion && el.classList.contains('tilt')) {
          var rx = ((y / r.height) - 0.5) * -7;
          var ry = ((x / r.width) - 0.5) * 7;
          el.classList.add('is-tilting');
          el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px)';
        }
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-tilting');
        el.style.transform = '';
      });
    });

    // Button ripple
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.btn');
      if (!b || reduceMotion) return;
      var r = b.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px';
      s.style.top = (e.clientY - r.top - size / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Hero: typing code card + counters                                    */
  /* ------------------------------------------------------------------ */
  function initHeroCode() {
    var out = $('#heroCode');
    if (!out) return;
    var lines = [
      [['c-var', 'name'], ['c-op', ' = '], ['c-str', '"Raslan"']],
      [['c-fn', 'print'], ['c-var', '('], ['c-str', 'f"Hello, {name}!"'], ['c-var', ')']],
      [['c-kw', 'for'], ['c-var', ' i '], ['c-kw', 'in'], ['c-fn', ' range'], ['c-var', '('], ['c-num', '2'], ['c-var', '):']],
      [['c-var', '    '], ['c-fn', 'print'], ['c-var', '('], ['c-str', '"Level"'], ['c-var', ', i '], ['c-op', '+'], ['c-num', ' 1'], ['c-var', ')']]
    ];
    var outputs = ['Hello, Raslan!', 'Level 1', 'Level 2'];

    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function renderCode(li, ci) {
      var html = '';
      for (var l = 0; l < lines.length; l++) {
        if (l > li) break;
        var limit = l < li ? Infinity : ci, used = 0;
        lines[l].forEach(function (tok) {
          if (used >= limit) return;
          var take = tok[1].slice(0, Math.max(0, limit - used));
          used += tok[1].length;
          html += '<span class="' + tok[0] + '">' + esc(take) + '</span>';
        });
        html += '\n';
      }
      return html;
    }
    function full() {
      return renderCode(lines.length - 1, 9999) + outputs.map(function (o) { return '<span class="code-out">▶ ' + esc(o) + '</span>'; }).join('\n');
    }
    if (reduceMotion) { out.innerHTML = full(); return; }

    var li = 0, ci = 0, timer = null;
    function type() {
      var lineLen = lines[li].reduce(function (n, t) { return n + t[1].length; }, 0);
      if (ci < lineLen) {
        ci++;
        out.innerHTML = renderCode(li, ci);
        timer = setTimeout(type, 34 + Math.random() * 40);
      } else if (li < lines.length - 1) {
        li++; ci = 0;
        timer = setTimeout(type, 260);
      } else {
        out.innerHTML = full();
        timer = setTimeout(function () { li = 0; ci = 0; out.innerHTML = ''; timer = setTimeout(type, 500); }, 4200);
      }
    }
    // Only type while the hero is on screen
    var hero = $('#home');
    var started = false;
    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { if (!started) { started = true; type(); } }
        else { clearTimeout(timer); started = false; }
      }, { threshold: 0.1 }).observe(hero);
    } else { type(); }
  }

  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = end; return; }
      var t0 = null, dur = 1400;
      el.textContent = '0';
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = clamp((ts - t0) / dur, 0, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 600);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Courses: filter tabs + accordion                                     */
  /* ------------------------------------------------------------------ */
  var tabs = $$('.tab');
  var glider = $('#tabsGlider');
  var levels = $$('.level');
  var currentFilter = 'all';

  function moveGlider() {
    if (!glider) return;
    var active = $('.tab.is-active');
    if (!active) return;
    glider.style.width = active.offsetWidth + 'px';
    glider.style.transform = 'translateX(' + active.offsetLeft + 'px)';
  }

  function applyFilter(f) {
    currentFilter = f;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-filter') === f;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    moveGlider();
    levels.forEach(function (lv) {
      var match = f === 'all' || lv.getAttribute('data-level') === f;
      lv.classList.remove('is-entering');
      if (match) {
        var wasHidden = lv.classList.contains('is-hidden');
        lv.classList.remove('is-hidden');
        if (wasHidden || true) {
          void lv.offsetWidth;                      // restart animation
          lv.classList.add('is-entering');
          lv.addEventListener('animationend', function h() { lv.classList.remove('is-entering'); lv.removeEventListener('animationend', h); });
        }
      } else {
        lv.classList.add('is-hidden');
        setLevelOpen(lv, false);
      }
    });
  }

  function setLevelOpen(lv, open) {
    lv.classList.toggle('is-open', open);
    var btn = $('.level__btn', lv);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function openStartLevel() {
    if (currentFilter !== 'all' && currentFilter !== 'beginner') applyFilter('all');
    var first = $('.level[data-n="1"]');
    if (!first) return;
    levels.forEach(function (lv) { if (lv !== first) setLevelOpen(lv, false); });
    setLevelOpen(first, true);
    first.classList.remove('is-highlight');
    void first.offsetWidth;
    first.classList.add('is-highlight');
    setTimeout(function () { first.classList.remove('is-highlight'); }, 2600);
  }

  function initCourses() {
    tabs.forEach(function (t) { t.addEventListener('click', function () { applyFilter(t.getAttribute('data-filter')); }); });
    $$('.level__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lv = btn.closest('.level');
        setLevelOpen(lv, !lv.classList.contains('is-open'));
      });
    });
    window.addEventListener('resize', moveGlider);
    moveGlider();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveGlider);
  }

  /* ------------------------------------------------------------------ */
  /* Founder photo                                                        */
  /* ------------------------------------------------------------------ */
  function initFounderPhoto() {
    var img = $('#founderImg');
    if (!img || !CONFIG.founderPhoto) return;
    var test = new Image();
    test.onload = function () {
      img.src = CONFIG.founderPhoto;
      img.hidden = false;
      var ini = $('.photo__initials');
      if (ini) ini.style.display = 'none';
    };
    test.src = CONFIG.founderPhoto;   // silent if missing: initials placeholder stays
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                 */
  /* ------------------------------------------------------------------ */
  function onPageReady() {
    initReveal();
    initCounters();
    requestScrollTick();
    // Deep link support (e.g. index.html#courses)
    if (location.hash && $(location.hash)) {
      setTimeout(function () { scrollToHash(location.hash); }, 250);
    }
  }

  function init() {
    bindAnchors();
    bindMenu();
    initBackground();
    initPointerEffects();
    initHeroCode();
    initCourses();
    initFounderPhoto();
    initBot();

    window.addEventListener('scroll', requestScrollTick, { passive: true });
    window.addEventListener('resize', function () { requestScrollTick(); moveIndicator(currentNav); });
    onScroll();

    if (toTop) toTop.addEventListener('click', function () { smoothScrollTo(0); });

    // Loader progress is driven by real readiness signals
    setLoaderTarget(40);
    if (document.readyState === 'complete') setLoaderTarget(85);
    else window.addEventListener('load', function () { setLoaderTarget(85); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setLoaderTarget(92); });
    var finishWhenBotReady = function () { setLoaderTarget(100); };
    if (botReady) finishWhenBotReady();
    else { var h = $('#botCanvas'); if (h) h.addEventListener('bot:ready', finishWhenBotReady, { once: true }); }
    setTimeout(finishWhenBotReady, 3500);   // safety net: never block the page
    setTimeout(finishLoader, 6000);
    requestAnimationFrame(tickLoader);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* Public hooks for the next phases */
  window.RPA = {
    config: CONFIG,
    get bot() { return bot; },
    scrollTo: scrollToHash,
    openStartLevel: openStartLevel,
    utils: { $: $, $$: $$, clamp: clamp }
  };
})();
