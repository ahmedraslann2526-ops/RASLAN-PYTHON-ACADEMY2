/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/icons.js  (Phase 2)
   مجموعة الأيقونات (SVG sprite) تُحقن في الصفحة عبر JavaScript لأن
   <use href="file.svg#id"> الخارجي لا يعمل عند فتح الملفات مباشرة (file://).
   index.html يحتوي sprite مضمّنًا خاصًا به؛ الصفحات الأخرى تستخدم هذا الملف.
   ===================================================================== */
(function () {
  'use strict';
  if (document.getElementById('rpaSprite')) return;
  var SYMBOLS = [
    '<symbol id="i-ai" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/><path d="M9.5 15v-4.5a2.5 2.5 0 0 1 5 0V15M9.5 13h5"/></symbol>',
    '<symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/><circle cx="7" cy="15" r="1"/><circle cx="11" cy="10" r="1"/><circle cx="14" cy="13" r="1"/><circle cx="19" cy="6" r="1"/></symbol>',
    '<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></symbol>',
    '<symbol id="i-cog" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></symbol>',
    '<symbol id="i-game" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="16" cy="11.5" r="1"/><circle cx="18.5" cy="14" r="1"/></symbol>',
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2.5l8 3v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10v-6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></symbol>',
    '<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 3l2 5.5L19.5 10.5 14 12.5 12 18l-2-5.5L4.5 10.5 10 8.5z"/><path d="M19 3v3M17.5 4.5h3M5 17v3M3.5 18.5h3"/></symbol>',
    '<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 12h5"/></symbol>',
    '<symbol id="i-terminal" viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="16" rx="3"/><path d="M7 10l3 2-3 2M12.5 15h4.5"/></symbol>',
    '<symbol id="i-trophy" viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5"/><path d="M12 14v4M8 21h8M9.5 18h5"/></symbol>',
    '<symbol id="i-rocket" viewBox="0 0 24 24"><path d="M5 15c-1.5 1-2 4-2 6 2 0 5-.5 6-2"/><path d="M12 15l-3-3c1-4 4-8 11-9 0 7-4 11-8 12z"/><circle cx="15.5" cy="8.5" r="1.5"/></symbol>',
    '<symbol id="i-award" viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/><path d="M9.5 9l2 2 3-3.5"/></symbol>',
    '<symbol id="i-puzzle" viewBox="0 0 24 24"><path d="M10 3a2 2 0 0 1 4 0v2h4a1 1 0 0 1 1 1v4h-2a2 2 0 0 0 0 4h2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 0 0-4 0v2H6a1 1 0 0 1-1-1v-4h2a2 2 0 0 0 0-4H5V6a1 1 0 0 1 1-1h4z"/></symbol>',
    '<symbol id="i-code" viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></symbol>',
    '<symbol id="i-check" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></symbol>',
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M20 12H4M10 6l-6 6 6 6"/></symbol>',
    '<symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>',
    '<symbol id="i-up" viewBox="0 0 24 24"><path d="M12 20V5M5.5 11.5L12 5l6.5 6.5"/></symbol>',
    '<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></symbol>',
    '<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.6 3.2-5.5 6.5-5.5s6 1.9 6.5 5.5"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.8c2 .6 3.2 2.3 3.5 5.2"/></symbol>',
    '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 15 12 20.5 12 20.5z"/></symbol>',
    '<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></symbol>',
    '<symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5"/></symbol>',
    '<symbol id="i-mouse" viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="5.5"/><path d="M12 7v4"/></symbol>',
    '<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></symbol>',
    '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/></symbol>',
    '<symbol id="i-logout" viewBox="0 0 24 24"><path d="M9 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H9"/><path d="M15 8l4 4-4 4M19 12H9"/></symbol>',
    '<symbol id="i-home" viewBox="0 0 24 24"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></symbol>',
    '<symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M4.5 19.5h15"/></symbol>',
    '<symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4.5 19.5h15"/></symbol>',
    '<symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4.5h6V7"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/></symbol>',
    '<symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>',
    '<symbol id="i-eye-off" viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.6 5.7A10 10 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3.2 4"/><path d="M6.3 7.3A16.5 16.5 0 0 0 2 12s3.6 6.5 10 6.5c1.6 0 3-.4 4.2-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></symbol>',
    '<symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 21c-4 0-6.5-2.8-6.5-6.3 0-3 2-4.8 3.3-6.7C10 6.3 10.5 4.5 10.3 3c3.5 1.6 6 4.6 6.3 8 .8-.6 1.3-1.5 1.4-2.6 1.3 1.6 2 3.4 2 5.3 0 4-2.8 7.3-8 7.3z"/><path d="M12 21c-1.7 0-3-1.2-3-2.9 0-1.6 1.4-2.4 2-3.7.9.7 2.4 1.8 2.4 3.7 0 1.7-.6 2.9-1.4 2.9z"/></symbol>',
    '<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/></symbol>',
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></symbol>',
    '<symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3.5L2.5 20h19z"/><path d="M12 10v5M12 17.7v.1"/></symbol>',
    '<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.1"/></symbol>',
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/></symbol>',
    '<symbol id="i-edit" viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></symbol>',
    '<symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7.5l8.5 6 8.5-6"/></symbol>',
    '<symbol id="i-save" viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/></symbol>',
    '<symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></symbol>',
    '<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></symbol>'
  ];
  function inject() {
    // لا نكرر أيقونة موجودة أصلًا في الصفحة (مثل sprite الصفحة الرئيسية)
    var list = SYMBOLS.filter(function (sym) {
      var m = /id="([^"]+)"/.exec(sym);
      return !(m && document.getElementById(m[1]));
    });
    if (!list.length) return;
    document.body.insertAdjacentHTML('afterbegin',
      '<svg id="rpaSprite" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + list.join('') + '</defs></svg>');
  }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);
})();
