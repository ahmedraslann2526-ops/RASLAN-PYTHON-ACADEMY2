/* =====================================================================
   RASLAN PYTHON ACADEMY — Data/gamification.js  (Phase 2)
   قيم النقاط (XP)، الرتب، والشارات. تُقيَّم الشارات داخل JS/store.js
   بناءً على شروط معرّفة هنا بشكل بيانات (بدون كود).
   ===================================================================== */
(function (root) {
  'use strict';

  var XP = {
    exercise: { veryEasy: 10, easy: 20, medium: 35, challenge: 60 }, // تمارين المستوى
    finalChallenge: 80,     // التحدي النهائي للمستوى
    quizPass: 50,           // النجاح في اختبار المستوى (>= 70%)
    quizPerfectBonus: 25,   // مكافأة الدرجة الكاملة (مرة لكل مستوى)
    levelComplete: 100,     // إكمال المستوى
    dailyStreakBonus: 10,   // أول نشاط في اليوم عند استمرار السلسلة
    projectStage: 100,      // كل مرحلة في مشروع التخرج (مرة واحدة)
    projectComplete: 300    // مكافأة إنهاء مشروع التخرج بالكامل (مرة واحدة)
  };

  // مشروع التخرج: معرّفات المراحل بالترتيب (المحتوى في Data/project.js)
  var PROJECT = { stages: ['p1', 'p2', 'p3', 'p4', 'p5'], unlockLevel: 20 };

  // الشهادات (المسار التجريبي المحلي)
  var CERTIFICATES = {
    half: { key: 'half', prefix: 'H', levels: 10, project: false, title: 'شهادة إتمام أول 10 مستويات',
      heading: 'CERTIFICATE OF ACHIEVEMENT', course: 'Python Programming \u2014 Foundations (Levels 1\u201310)' },
    full: { key: 'full', prefix: 'F', levels: 20, project: true, title: 'شهادة إتمام الأكاديمية',
      heading: 'CERTIFICATE OF COMPLETION', course: 'Python Programming \u2014 Complete Course (20 Levels + Graduation Project)' }
  };

  var RANKS = [
    { min: 0,    key: 'newbie',   label: 'مبتدئ جديد',   icon: 'i-sparkle' },
    { min: 150,  key: 'explorer', label: 'مستكشف',       icon: 'i-rocket'  },
    { min: 500,  key: 'coder',    label: 'مبرمج صغير',   icon: 'i-code'    },
    { min: 1100, key: 'builder',  label: 'صانع برامج',   icon: 'i-cog'     },
    { min: 2000, key: 'pro',      label: 'مبرمج محترف',  icon: 'i-bolt'    },
    { min: 3200, key: 'master',   label: 'خبير Python',  icon: 'i-trophy'  }
  ];

  /* شروط الشارات:
     levels   = عدد المستويات المكتملة >= count
     level    = المستوى n مكتمل
     group    = كل مستويات المجموعة مكتملة
     xp       = إجمالي النقاط >= amount
     streak   = أطول سلسلة أيام متتالية >= days
     perfect  = عدد الاختبارات ذات الدرجة الكاملة >= count
     exercises= عدد التمارين المحلولة >= count
     challenges = عدد التحديات النهائية المنجزة >= count
     event    = حدث يسجله النظام (registered, firstRun ...) */
  var BADGES = [
    { id: 'welcome',      title: 'أهلًا بيك',          desc: 'أنشأت حسابك في الأكاديمية.',              icon: 'i-heart',   rule: { type: 'event', name: 'registered' } },
    { id: 'first-level',  title: 'أول مستوى',          desc: 'أكملت المستوى الأول.',                    icon: 'i-check',   rule: { type: 'levels', count: 1 } },
    { id: 'five-levels',  title: 'خمس خطوات',          desc: 'أكملت 5 مستويات.',                        icon: 'i-layers',  rule: { type: 'levels', count: 5 } },
    { id: 'ten-levels',   title: 'نص الطريق',          desc: 'أكملت 10 مستويات.',                       icon: 'i-target',  rule: { type: 'levels', count: 10 } },
    { id: 'fifteen',      title: 'على بُعد خطوات',     desc: 'أكملت 15 مستوى.',                         icon: 'i-rocket',  rule: { type: 'levels', count: 15 } },
    { id: 'graduate',     title: 'خريج الأكاديمية',    desc: 'أكملت المستويات العشرين.',                icon: 'i-award',   rule: { type: 'levels', count: 20 } },
    { id: 'beginner-done',title: 'أتقنت الأساسيات',    desc: 'أنهيت كل مستويات المبتدئ.',               icon: 'i-book',    rule: { type: 'group', key: 'beginner' } },
    { id: 'inter-done',   title: 'مستوى متوسط',        desc: 'أنهيت كل مستويات المتوسط.',               icon: 'i-puzzle',  rule: { type: 'group', key: 'intermediate' } },
    { id: 'adv-done',     title: 'مستوى متقدم',        desc: 'أنهيت كل مستويات المتقدم.',               icon: 'i-trophy',  rule: { type: 'group', key: 'advanced' } },
    { id: 'print-hero',   title: 'بطل print()\u200E',        desc: 'أكملت مستوى print()\u200E.',                    icon: 'i-terminal',rule: { type: 'level', n: 1 } },
    { id: 'variables',    title: 'سيد المتغيرات',      desc: 'أكملت مستوى المتغيرات.',                  icon: 'i-code',    rule: { type: 'level', n: 3 } },
    { id: 'decider',      title: 'صاحب القرار',        desc: 'أكملت مستوى if / else.',                  icon: 'i-bolt',    rule: { type: 'level', n: 7 } },
    { id: 'looper',       title: 'ملك التكرار',        desc: 'أكملت مستوى for.',                        icon: 'i-layers',  rule: { type: 'level', n: 10 } },
    { id: 'functions',    title: 'صانع الدوال',        desc: 'أكملت مستوى الدوال.',                     icon: 'i-cog',     rule: { type: 'level', n: 15 } },
    { id: 'oop',          title: 'مهندس الكائنات',     desc: 'أكملت مستوى OOP.',                        icon: 'i-ai',      rule: { type: 'level', n: 20 } },
    { id: 'project-done', title: 'مشروع التخرج',       desc: 'أنهيت مشروع التخرج To-Do List بكل مراحله.', icon: 'i-rocket',  rule: { type: 'event', name: 'projectDone' } },
    { id: 'xp-100',       title: '100 نقطة',           desc: 'جمعت 100 نقطة XP.',                       icon: 'i-sparkle', rule: { type: 'xp', amount: 100 } },
    { id: 'xp-500',       title: '500 نقطة',           desc: 'جمعت 500 نقطة XP.',                       icon: 'i-sparkle', rule: { type: 'xp', amount: 500 } },
    { id: 'xp-1500',      title: '1500 نقطة',          desc: 'جمعت 1500 نقطة XP.',                      icon: 'i-chart',   rule: { type: 'xp', amount: 1500 } },
    { id: 'xp-3000',      title: '3000 نقطة',          desc: 'جمعت 3000 نقطة XP.',                      icon: 'i-trophy',  rule: { type: 'xp', amount: 3000 } },
    { id: 'streak-3',     title: 'ثلاثة أيام متتالية', desc: 'تعلّمت 3 أيام ورا بعض.',                  icon: 'i-bolt',    rule: { type: 'streak', days: 3 } },
    { id: 'streak-7',     title: 'أسبوع كامل',         desc: 'تعلّمت 7 أيام ورا بعض.',                  icon: 'i-globe',   rule: { type: 'streak', days: 7 } },
    { id: 'perfect-1',    title: 'درجة كاملة',         desc: 'حصلت على 100% في اختبار.',                icon: 'i-award',   rule: { type: 'perfect', count: 1 } },
    { id: 'perfect-5',    title: 'خمس درجات كاملة',    desc: 'حصلت على 100% في 5 اختبارات.',            icon: 'i-shield',  rule: { type: 'perfect', count: 5 } },
    { id: 'solver-20',    title: 'حلّال التمارين',     desc: 'حللت 20 تمرينًا.',                        icon: 'i-puzzle',  rule: { type: 'exercises', count: 20 } },
    { id: 'challenger',   title: 'صائد التحديات',      desc: 'أنجزت 10 تحديات نهائية.',                 icon: 'i-game',    rule: { type: 'challenges', count: 10 } }
  ];

  function rankFor(xp) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].min) r = RANKS[i];
    return r;
  }
  function nextRank(xp) {
    for (var i = 0; i < RANKS.length; i++) if (xp < RANKS[i].min) return RANKS[i];
    return null;
  }
  function badgeById(id) {
    for (var i = 0; i < BADGES.length; i++) if (BADGES[i].id === id) return BADGES[i];
    return null;
  }

  root.RPA_GAME = { project: PROJECT, certificates: CERTIFICATES, xp: XP, ranks: RANKS, badges: BADGES, rankFor: rankFor, nextRank: nextRank, badgeById: badgeById };
})(window);
