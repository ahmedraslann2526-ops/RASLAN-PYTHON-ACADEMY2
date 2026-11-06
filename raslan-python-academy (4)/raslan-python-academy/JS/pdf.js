/* =====================================================================
   RASLAN PYTHON ACADEMY — JS/pdf.js  (Phase 3 / Batch 4)
   منشئ PDF صغير بدون مكتبات خارجية: صفحة واحدة A4 بالعرض تحتوي صورة JPEG
   عالية الدقة (الشهادة مرسومة مسبقًا على Canvas، فالمتصفح هو اللي بيشكّل
   الحروف العربية ويكتبها من اليمين لليسار بشكل صحيح).
   الواجهة: window.RPAPdf.fromJpeg(jpegBytes, pxWidth, pxHeight, info) => Uint8Array
   ===================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RPAPdf = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function ascii(s) {
    // نصوص الـ PDF هنا ASCII فقط (العنوان ورقم الشهادة)، وأي حرف آخر يُستبدل
    return String(s || '').replace(/[^\x20-\x7E]/g, '?').replace(/([\\()])/g, '\\$1');
  }
  function enc(str) {
    var out = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0xff;
    return out;
  }
  function concat(parts) {
    var len = 0, i;
    for (i = 0; i < parts.length; i++) len += parts[i].length;
    var out = new Uint8Array(len), off = 0;
    for (i = 0; i < parts.length; i++) { out.set(parts[i], off); off += parts[i].length; }
    return out;
  }
  function pad10(n) { return ('0000000000' + n).slice(-10); }
  function pdfDate(d) {
    function p(x) { return ('0' + x).slice(-2); }
    return 'D:' + d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + p(d.getUTCHours()) + p(d.getUTCMinutes()) + p(d.getUTCSeconds()) + 'Z';
  }

  // A4 بالعرض بالنقاط (1/72 بوصة)
  var PAGE_W = 841.89, PAGE_H = 595.28;

  function fromJpeg(jpeg, pxW, pxH, info) {
    info = info || {};
    if (!(jpeg instanceof Uint8Array)) jpeg = new Uint8Array(jpeg);
    if (jpeg[0] !== 0xFF || jpeg[1] !== 0xD8) throw new Error('not a JPEG');
    var content = 'q\n' + PAGE_W + ' 0 0 ' + PAGE_H + ' 0 0 cm\n/Im0 Do\nQ\n';
    var objs = [];
    objs.push(enc('<< /Type /Catalog /Pages 2 0 R >>'));
    objs.push(enc('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
    objs.push(enc('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE_W + ' ' + PAGE_H + '] /Resources << /XObject << /Im0 4 0 R >> /ProcSet [/PDF /ImageC] >> /Contents 5 0 R >>'));
    objs.push(concat([
      enc('<< /Type /XObject /Subtype /Image /Width ' + pxW + ' /Height ' + pxH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpeg.length + ' >>\nstream\n'),
      jpeg, enc('\nendstream')
    ]));
    objs.push(enc('<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream'));
    objs.push(enc('<< /Title (' + ascii(info.title) + ') /Author (' + ascii(info.author) + ') /Subject (' + ascii(info.subject) + ') /Creator (RASLAN PYTHON ACADEMY) /Producer (RPA pdf.js) /CreationDate (' + pdfDate(info.date || new Date()) + ') >>'));

    var parts = [enc('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
    var offsets = [], pos = parts[0].length;
    for (var i = 0; i < objs.length; i++) {
      offsets.push(pos);
      var head = enc((i + 1) + ' 0 obj\n'), tail = enc('\nendobj\n');
      parts.push(head, objs[i], tail);
      pos += head.length + objs[i].length + tail.length;
    }
    var xref = 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
    offsets.forEach(function (o) { xref += pad10(o) + ' 00000 n \n'; });
    xref += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R /Info ' + objs.length + ' 0 R >>\nstartxref\n' + pos + '\n%%EOF\n';
    parts.push(enc(xref));
    return concat(parts);
  }

  function dataUrlToBytes(dataUrl) {
    var b64 = String(dataUrl).split(',')[1] || '';
    var bin = (typeof atob === 'function') ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  return { fromJpeg: fromJpeg, dataUrlToBytes: dataUrlToBytes, PAGE_W: PAGE_W, PAGE_H: PAGE_H };
});
