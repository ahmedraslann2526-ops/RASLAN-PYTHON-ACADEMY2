/* RASLAN PYTHON ACADEMY — JS/verify.js (Phase 3 / Batch 4): التحقق المحلي من رقم الشهادة */
(function (root) {
  'use strict';
  var doc = root.document, S = root.RPAStore, UI = root.RPAUI;
  if (!S || !UI) return;
  var form = doc.getElementById('vfForm'), input = doc.getElementById('vfId'), res = doc.getElementById('vfRes');
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmt(ts) { var d = new Date(ts); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function row(dl, k, v, dir) { dl.appendChild(UI.el('dt', { text: k })); dl.appendChild(UI.el('dd', { text: v, dir: dir || null })); }

  function check(id) {
    var r = S.verifyCertificate(id);
    clear(res); res.hidden = false;
    if (r.ok) {
      var c = r.cert;
      res.className = 'vf__res glass is-ok';
      res.appendChild(UI.el('h2', {}, [UI.icon('i-check'), UI.el('span', { text: 'الشهادة موجودة في سجل هذا الجهاز' })]));
      var dl = UI.el('dl');
      row(dl, 'الاسم', c.name, 'auto');
      row(dl, 'الشهادة', root.RPA_GAME.certificates[c.type].title);
      row(dl, 'الدورة', c.course, 'ltr');
      row(dl, 'تاريخ الإصدار', fmt(c.issuedAt), 'ltr');
      row(dl, 'رقم الشهادة', c.id, 'ltr');
      res.appendChild(dl);
      res.appendChild(UI.el('p', { class: 'field__hint', text: 'تذكير: هذا تحقق محلي من بيانات هذا المتصفح فقط، وليس اعتمادًا رسميًا.' }));
    } else {
      res.className = 'vf__res glass is-bad';
      res.appendChild(UI.el('h2', {}, [UI.icon('i-alert'), UI.el('span', { text: r.error === 'format' ? 'رقم الشهادة غير صحيح الشكل' : 'الشهادة غير موجودة على هذا الجهاز' })]));
      res.appendChild(UI.el('p', { text: r.error === 'format'
        ? 'الرقم لازم يكون بالشكل RPA-F-XXXX-XXXX-X أو RPA-H-XXXX-XXXX-X، وآخر حرف هو رمز تحقق. راجع الرقم.'
        : 'الرقم صحيح الشكل، لكن مفيش شهادة بالرقم ده محفوظة على المتصفح ده. لو الشهادة صادرة على جهاز تاني، التحقق المحلي هنا مش هيلاقيها.' }));
    }
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); check(input.value); });
  var q = new URLSearchParams(root.location.search).get('id');
  if (q) { input.value = q; check(q); }
})(window);
