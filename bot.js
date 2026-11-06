/* =====================================================================
   RASLAN PYTHON ACADEMY — bot.js  (Phase 1)
   PYTHON BOT: an original 3D cartoon teacher, rendered in real time with a
   self-contained WebGL ray-marching shader (no external libraries, works offline).

   Public API (reused in later phases):
     const bot = new PythonBot(containerElement, options);
     bot.setExpression('normal' | 'happy' | 'wow' | 'wink' | 'love' | 'think');
     bot.wave(durationMs);
     bot.nextExpression();
     bot.lookAt(clientX, clientY);   // eyes + head follow a screen point
     bot.destroy();
   Events dispatched on the container: "bot:ready", "bot:expression" {detail:{name}}
   ===================================================================== */
(function (global) {
  'use strict';

  var EXPRESSIONS = ['normal', 'happy', 'wow', 'wink', 'love', 'think'];
  var EXPR_INDEX = { normal: 0, happy: 1, wow: 2, wink: 3, love: 4, think: 5 };

  /* ------------------------------------------------------------------ */
  /* Shaders                                                              */
  /* ------------------------------------------------------------------ */
  var VERT = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform vec2  uLook;',        // -1..1 where the bot is looking
    'uniform vec4  uHeadRot;',     // cos(yaw), sin(yaw), cos(pitch), sin(pitch)
    'uniform float uExprA;',
    'uniform float uExprB;',
    'uniform float uMix;',         // blend A -> B
    'uniform float uBlink;',       // 0 open .. 1 closed
    'uniform float uWave;',        // 0 rest .. 1 waving
    'uniform float uHover;',       // 0..1 excitement
    'uniform float uBob;',
    'uniform float uSteps;',       // ray-march step budget (quality tier)
    'uniform float uAO;',          // ambient-occlusion taps (quality tier)

    '#define PI 3.14159265',

    'float sdSphere(vec3 p, float r){ return length(p) - r; }',
    'float sdRoundBox(vec3 p, vec3 b, float r){ vec3 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }',
    'float sdCapsule(vec3 p, vec3 a, vec3 b, float r){ vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }',
    'float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }',

    /* head-space transform: rotate by yaw/pitch around the neck */
    'vec3 toHead(vec3 p){',
    '  p.y -= 0.78 + uBob;',
    '  p.xz = vec2(uHeadRot.x * p.x - uHeadRot.y * p.z, uHeadRot.y * p.x + uHeadRot.x * p.z);',
    '  p.yz = vec2(uHeadRot.z * p.y - uHeadRot.w * p.z, uHeadRot.w * p.y + uHeadRot.z * p.z);',
    '  return p;',
    '}',

    'vec3 handPos(){',
    '  vec3 rest = vec3(1.02, -0.86 + uBob * 0.6, 0.18);',
    '  float s = sin(uTime * 9.0);',
    '  vec3 up = vec3(1.18 + 0.16 * s, 0.34 + uBob * 0.6 + 0.04 * s, 0.26);',
    '  return mix(rest, up, clamp(uWave, 0.0, 1.0));',
    '}',

    /* returns vec2(distance, materialId)
       1 shell  2 visor  3 ear pods  4 antenna light  5 body  6 hands/arm  7 chest panel */
    'vec2 map(vec3 p){',
    '  vec3 h = toHead(p);',
    '  vec2 res = vec2(sdRoundBox(h, vec3(0.92, 0.74, 0.74), 0.34), 1.0);',

    '  float visor = sdRoundBox(h - vec3(0.0, 0.0, 0.58), vec3(0.74, 0.5, 0.2), 0.2);',
    '  if (visor < res.x) res = vec2(visor, 2.0);',

    '  vec3 hx = vec3(abs(h.x), h.y, h.z);',
    '  float ear = sdCapsule(hx, vec3(0.99, 0.0, 0.0), vec3(1.16, 0.0, 0.0), 0.27);',
    '  if (ear < res.x) res = vec2(ear, 3.0);',

    '  float stem = sdCapsule(h, vec3(0.0, 0.72, 0.0), vec3(0.0, 1.0, 0.0), 0.05);',
    '  stem = smin(stem, sdSphere(h - vec3(0.0, 0.76, 0.0), 0.15), 0.1);',
    '  if (stem < res.x) res = vec2(stem, 1.0);',
    '  float bulb = sdSphere(h - vec3(0.0, 1.14, 0.0), 0.15 + 0.012 * sin(uTime * 4.0));',
    '  if (bulb < res.x) res = vec2(bulb, 4.0);',

    '  vec3 b = p - vec3(0.0, -0.58 + uBob * 0.7, 0.0);',
    '  float body = sdRoundBox(b, vec3(0.42, 0.36, 0.34), 0.26);',
    '  float neck = sdCapsule(p, vec3(0.0, 0.1 + uBob, 0.0), vec3(0.0, -0.18 + uBob * 0.7, 0.0), 0.17);',
    '  body = smin(body, neck, 0.12);',
    '  if (body < res.x) res = vec2(body, 5.0);',

    '  float chest = sdRoundBox(b - vec3(0.0, 0.02, 0.4), vec3(0.2, 0.15, 0.03), 0.04);',
    '  if (chest < res.x && chest < 0.02) res = vec2(chest, 7.0);',

    '  vec3 hand = handPos();',
    '  vec3 shL = vec3(-0.5, -0.4 + uBob * 0.7, 0.0);',
    '  vec3 shR = vec3( 0.5, -0.4 + uBob * 0.7, 0.0);',
    '  vec3 handL = vec3(-1.02, -0.86 + uBob * 0.6, 0.18);',
    '  vec3 elbowR = mix(vec3(0.86, -0.64 + uBob * 0.6, 0.1), vec3(0.98, 0.0 + uBob * 0.6, 0.12), clamp(uWave, 0.0, 1.0));',
    '  float armL = smin(sdCapsule(p, shL, handL, 0.13), sdSphere(p - handL, 0.2), 0.1);',
    '  float armR = smin(smin(sdCapsule(p, shR, elbowR, 0.13), sdCapsule(p, elbowR, hand, 0.13), 0.08), sdSphere(p - hand, 0.2), 0.1);',
    '  float arms = min(armL, armR);',
    '  if (arms < res.x) res = vec2(arms, 6.0);',
    '  return res;',
    '}',

    'vec3 calcNormal(vec3 p){',
    '  vec2 e = vec2(1.0, -1.0) * 0.0025;',
    '  return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);',
    '}',

    /* ---------------- 2D face drawing (on the visor plane) ---------------- */
    'float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }',
    'float sdEllipse(vec2 p, vec2 r){ float k = length(p / r); return (k - 1.0) * min(r.x, r.y); }',
    'float sdHeart(vec2 p){',
    '  p.x = abs(p.x); p.y += 0.5;',
    '  if (p.y + p.x > 1.0) return sqrt(dot(p - vec2(0.25, 0.75), p - vec2(0.25, 0.75))) - 0.35355339;',
    '  return sqrt(min(dot(p - vec2(0.0, 1.0), p - vec2(0.0, 1.0)), dot(p - 0.5 * max(p.x + p.y, 0.0), p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);',
    '}',
    'float arcUp(vec2 p, float r, float w){ float d = abs(length(p) - r) - w; return max(d, -p.y); }',
    'float arcDown(vec2 p, float r, float w){ float d = abs(length(p) - r) - w; return max(d, p.y); }',

    /* single eye shape, e = expression id, side = -1 (left) / +1 (right) */
    'float eyeShape(vec2 p, float e, float side, float blink){',
    '  float open = 1.0 - blink;',
    '  if (e < 0.5) {',                         // normal: tall rounded eye
    '    return sdEllipse(p, vec2(0.105, max(0.012, 0.165 * open)));',
    '  } else if (e < 1.5) {',                  // happy: ^ ^
    '    return mix(arcUp(p + vec2(0.0, 0.07), 0.125, 0.03), sdSeg(p, vec2(-0.1, 0.0), vec2(0.1, 0.0)) - 0.03, blink);',
    '  } else if (e < 2.5) {',                  // wow: big round eye with highlight
    '    return sdEllipse(p, vec2(0.135, max(0.012, 0.19 * open)));',
    '  } else if (e < 3.5) {',                  // wink: right eye is a ^
    '    if (side > 0.0) return arcUp(p + vec2(0.0, 0.07), 0.125, 0.03);',
    '    return sdEllipse(p, vec2(0.105, max(0.012, 0.165 * open)));',
    '  } else if (e < 4.5) {',                  // love: hearts
    '    return sdHeart((p + vec2(0.0, 0.01)) / 0.24) * 0.24;',
    '  }',
    '  return sdEllipse(p, vec2(0.11, max(0.012, 0.09 * open + 0.015)));',  // think: squinting
    '}',

    'float mouthShape(vec2 p, float e){',
    '  if (e < 0.5) return arcDown(p - vec2(0.0, 0.07), 0.1, 0.02);',
    '  if (e < 1.5) return min(arcDown(p - vec2(0.0, 0.1), 0.17, 0.025), sdEllipse(p - vec2(0.0, -0.045), vec2(0.0001, 0.0001)) + 1.0);',
    '  if (e < 2.5) return abs(sdEllipse(p - vec2(0.0, -0.02), vec2(0.055, 0.07))) - 0.02;',
    '  if (e < 3.5) return arcDown(p - vec2(0.03, 0.08), 0.11, 0.022);',
    '  if (e < 4.5) return arcDown(p - vec2(0.0, 0.1), 0.15, 0.025);',
    '  return sdSeg(p, vec2(-0.07, -0.02), vec2(0.07, 0.01)) - 0.02;',
    '}',

    'vec3 faceColor(vec2 uv, vec3 nrm, vec3 rd){',
    '  vec3 base = vec3(0.012, 0.025, 0.085);',
    '  base += vec3(0.02, 0.05, 0.16) * (0.5 + 0.5 * uv.y);',
    /* scan lines */
    '  base *= 0.93 + 0.07 * sin(uv.y * 190.0 - uTime * 2.0);',
    /* eyes follow the look vector inside the visor */
    '  vec2 look = uLook * vec2(0.055, 0.035);',
    '  vec2 eL = uv - vec2(-0.3, 0.08) - look;',
    '  vec2 eR = uv - vec2( 0.3, 0.08) - look;',
    '  float dA = min(eyeShape(eL, uExprA, -1.0, uBlink), eyeShape(eR, uExprA, 1.0, uBlink));',
    '  float dB = min(eyeShape(eL, uExprB, -1.0, uBlink), eyeShape(eR, uExprB, 1.0, uBlink));',
    '  float d = mix(dA, dB, uMix);',
    '  float mA = mouthShape(uv - vec2(0.0, -0.2) - look * 0.5, uExprA);',
    '  float mB = mouthShape(uv - vec2(0.0, -0.2) - look * 0.5, uExprB);',
    '  float md = mix(mA, mB, uMix);',
    '  float glow = exp(-max(d, 0.0) * 22.0) * 0.55 + exp(-max(md, 0.0) * 30.0) * 0.4;',
    '  float core = 1.0 - smoothstep(-0.004, 0.012, d);',
    '  float mcore = 1.0 - smoothstep(-0.003, 0.01, md);',
    '  vec3 eyeCol = mix(vec3(0.15, 0.9, 1.0), vec3(1.0, 0.42, 0.72), step(3.5, mix(uExprA, uExprB, uMix)) * step(mix(uExprA, uExprB, uMix), 4.5));',
    '  vec3 c = base + eyeCol * glow;',
    '  c = mix(c, eyeCol * 1.25 + 0.15, core);',
    '  c = mix(c, vec3(0.55, 1.0, 1.0), mcore);',
    /* sparkle highlight inside eyes */
    '  float spark = (1.0 - smoothstep(0.0, 0.03, length(eL - vec2(-0.03, 0.05)))) * core * (1.0 - uBlink);',
    '  c += vec3(1.0) * spark * 0.9;',
    /* cheeks */
    '  float ch = exp(-length((vec2(abs(uv.x), uv.y) - vec2(0.5, -0.12)) / vec2(0.1, 0.055)) * 1.6);',
    '  c += vec3(1.0, 0.35, 0.65) * ch * (0.25 + 0.35 * uHover);',
    /* glass reflection streak */
    '  float streak = smoothstep(0.03, 0.0, abs(uv.x * 0.8 + uv.y - 0.38 + 0.0)) * 0.12 + smoothstep(0.02, 0.0, abs(uv.x * 0.8 + uv.y - 0.5)) * 0.06;',
    '  float fres = pow(1.0 - clamp(dot(nrm, -rd), 0.0, 1.0), 3.0);',
    '  c += vec3(0.5, 0.7, 1.0) * (streak + fres * 0.5);',
    '  return c;',
    '}',

    'vec3 chestColor(vec2 q){',
    '  vec3 c = vec3(0.02, 0.05, 0.18);',
    '  float d = min(sdSeg(q, vec2(-0.075, 0.05), vec2(-0.14, 0.0)), sdSeg(q, vec2(-0.14, 0.0), vec2(-0.075, -0.05)));',
    '  d = min(d, min(sdSeg(q, vec2(0.075, 0.05), vec2(0.14, 0.0)), sdSeg(q, vec2(0.14, 0.0), vec2(0.075, -0.05))));',
    '  d = min(d, sdSeg(q, vec2(0.025, 0.07), vec2(-0.025, -0.07)));',
    '  float k = 1.0 - smoothstep(0.012, 0.022, d);',
    '  return c + vec3(0.2, 0.95, 1.0) * k * (0.85 + 0.15 * sin(uTime * 3.0)) + vec3(0.1, 0.4, 0.9) * exp(-d * 30.0) * 0.4;',
    '}',

    'void main(){',
    '  vec2 frag = gl_FragCoord.xy;',
    '  vec2 uv = (frag - 0.5 * uRes) / uRes.y;',
    '  vec3 ro = vec3(0.0, 0.45, 6.4);',
    '  vec3 rd = normalize(vec3(uv, -1.55));',
    /* bounding sphere early-out */
    '  vec3 bc = vec3(0.0, 0.45, 0.0); float br = 2.6;',
    '  vec3 oc = ro - bc; float bb = dot(oc, rd); float cc = dot(oc, oc) - br * br; float disc = bb * bb - cc;',
    /* soft contact glow under the bot (premultiplied colour + alpha) */
    '  vec2 gp = (uv - vec2(0.0, -0.43)) / vec2(0.3, 0.05);',
    '  float groundGlow = exp(-dot(gp, gp) * 0.7) * (0.8 - 2.0 * uBob);',
    '  float alpha = clamp(groundGlow * 0.55, 0.0, 1.0);',
    '  vec3 col = vec3(0.25, 0.55, 1.0) * alpha;',
    '  if (disc > 0.0) {',
    '    float t = -bb - sqrt(disc);',
    '    float tmax = -bb + sqrt(disc);',
    '    float dmin = 1e3; float tmin = t; vec2 hit = vec2(1e3, 0.0); bool found = false;',
    '    float pix = 1.6 / uRes.y;',
    '    for (int i = 0; i < 64; i++) {',
    '      if (float(i) >= uSteps) break;',
    '      vec3 p = ro + rd * t;',
    '      vec2 r = map(p);',
    '      if (r.x < dmin) { dmin = r.x; tmin = t; hit = r; }',
    '      if (r.x < 0.0012 * t) { found = true; hit = r; tmin = t; break; }',
    '      t += r.x * 0.9;',
    '      if (t > tmax) break;',
    '    }',
    '    float edge = 1.0 - smoothstep(0.0, pix * tmin * 1.3, dmin);',
    '    if (found || edge > 0.0) {',
    '      vec3 p = ro + rd * tmin;',
    '      vec3 n = calcNormal(p);',
    '      float mat = hit.y;',
    '      vec3 albedo = vec3(0.86, 0.9, 1.0); float spec = 0.9; float shin = 48.0; vec3 emis = vec3(0.0); float rough = 0.0;',
    '      vec3 hp = toHead(p);',
    '      if (mat < 1.5) { albedo = vec3(0.88, 0.92, 1.0) * (0.92 + 0.08 * smoothstep(0.55, -0.4, hp.y)); }',
    '      else if (mat < 2.5) { albedo = vec3(0.01, 0.02, 0.07); spec = 1.3; shin = 120.0; }',
    '      else if (mat < 3.5) { albedo = vec3(0.52, 0.3, 1.0); spec = 0.8; }',
    '      else if (mat < 4.5) { albedo = vec3(0.3, 0.95, 1.0); emis = vec3(0.2, 0.9, 1.0) * (1.1 + 0.4 * sin(uTime * 4.0)); }',
    '      else if (mat < 5.5) { albedo = vec3(0.16, 0.42, 1.0); spec = 0.7; }',
    '      else if (mat < 6.5) { albedo = vec3(0.9, 0.93, 1.0); }',
    '      else { albedo = vec3(0.02, 0.04, 0.14); emis = chestColor((p - vec3(0.0, -0.56 + uBob * 0.7, 0.4)).xy); }',

    '      vec3 L1 = normalize(vec3(0.55, 0.85, 0.7));',
    '      vec3 L2 = normalize(vec3(-0.8, 0.2, 0.5));',
    '      vec3 L3 = normalize(vec3(0.0, 0.1, -1.0));',
    '      float dif1 = clamp(dot(n, L1), 0.0, 1.0);',
    '      float dif2 = clamp(dot(n, L2), 0.0, 1.0);',
    '      float amb = 0.38 + 0.22 * n.y;',
    '      float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);',
    '      vec3 hv = normalize(L1 - rd);',
    '      float sp = pow(clamp(dot(n, hv), 0.0, 1.0), shin) * spec;',
    '      vec3 lit = albedo * (amb * vec3(0.55, 0.65, 1.0) + dif1 * vec3(1.0, 0.97, 0.92) * 0.9 + dif2 * vec3(0.55, 0.35, 1.0) * 0.5);',
    '      lit += vec3(1.0) * sp * 0.8;',
    '      lit += vec3(0.2, 0.75, 1.0) * fres * 0.55 * (0.5 + 0.5 * clamp(dot(n, L3) + 0.6, 0.0, 1.0));',
    '      lit += emis;',

    '      if (mat > 1.5 && mat < 2.5) {',
    '        lit = faceColor(hp.xy, n, rd);',
    '        float fr = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);',
    '        lit += vec3(0.5, 0.7, 1.0) * fr * 0.35 + vec3(1.0) * sp * 0.6;',
    '      }',
    /* simple ambient occlusion */
    '      float ao = 1.0;',
    '      for (int k = 1; k <= 3; k++) { if (float(k) > uAO) break; float hh = 0.07 * float(k); ao -= (hh - map(p + n * hh).x) * (0.55 / float(k)); }',
    '      lit *= clamp(ao, 0.35, 1.0);',
    /* tone map */
    '      lit = lit / (1.0 + lit * 0.18);',
    '      lit = pow(lit, vec3(0.92));',
    '      col = lit * edge + col * (1.0 - edge); alpha = edge + alpha * (1.0 - edge);',
    '    }',
    '  }',
    '  gl_FragColor = vec4(col, alpha);',
    '}'
  ].join('\n');

  /* ------------------------------------------------------------------ */
  /* SVG fallback (for browsers without WebGL)                           */
  /* ------------------------------------------------------------------ */
  var FALLBACK_SVG = [
    '<svg class="bot-fallback" data-expr="normal" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PYTHON BOT">',
    '<defs>',
    '<linearGradient id="pbShell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7ff"/><stop offset="1" stop-color="#b7c6ff"/></linearGradient>',
    '<linearGradient id="pbBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8bff"/><stop offset="1" stop-color="#2f4fe0"/></linearGradient>',
    '<radialGradient id="pbVisor" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#16246b"/><stop offset="1" stop-color="#050a26"/></radialGradient>',
    '</defs>',
    '<g class="pb-all">',
    '<ellipse cx="200" cy="372" rx="90" ry="12" fill="#2f6bff" opacity=".35"/>',
    '<rect x="150" y="262" width="100" height="84" rx="38" fill="url(#pbBody)"/>',
    '<rect x="170" y="282" width="60" height="44" rx="10" fill="#0a1240"/>',
    '<path d="M184 292l-12 14 12 14M216 292l12 14-12 14M206 288l-12 36" stroke="#67e8f9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    '<g transform="rotate(12 148 284)"><rect x="141" y="280" width="14" height="56" rx="7" fill="#e8eeff"/><circle cx="148" cy="342" r="19" fill="#e8eeff"/></g>',
    '<rect x="94" y="96" width="212" height="170" rx="46" fill="url(#pbShell)"/>',
    '<rect x="98" y="100" width="204" height="162" rx="42" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="3"/>',
    '<ellipse cx="150" cy="116" rx="46" ry="9" fill="#ffffff" opacity=".4" transform="rotate(-8 150 116)"/>',
    '<ellipse cx="90" cy="182" rx="19" ry="31" fill="#8b5cf6"/><ellipse cx="310" cy="182" rx="19" ry="31" fill="#8b5cf6"/><ellipse cx="86" cy="172" rx="6" ry="12" fill="#c4b5fd" opacity=".6"/><ellipse cx="306" cy="172" rx="6" ry="12" fill="#c4b5fd" opacity=".6"/>',
    '<rect x="196" y="62" width="8" height="40" rx="4" fill="#d3dcff"/><circle cx="200" cy="56" r="14" fill="#22d3ee"><animate attributeName="opacity" values="1;.55;1" dur="1.4s" repeatCount="indefinite"/></circle>',
    '<rect x="110" y="120" width="180" height="122" rx="38" fill="url(#pbVisor)"/>',
    '<g class="pb-face">',
    '<g class="pb-eyes" fill="#38e6ff">',
    '<g class="pb-eye pb-eye-l" style="transform-origin:160px 170px"><ellipse cx="160" cy="170" rx="14" ry="22" class="pb-blink" style="transform-origin:160px 170px"/></g>',
    '<g class="pb-eye pb-eye-r" style="transform-origin:240px 170px"><ellipse cx="240" cy="170" rx="14" ry="22" class="pb-blink" style="transform-origin:240px 170px"/></g>',
    '</g>',
    '<path class="pb-mouth" d="M182 208q18 14 36 0" stroke="#8cf6ff" stroke-width="6" stroke-linecap="round" fill="none"/>',
    '<ellipse cx="136" cy="204" rx="14" ry="8" fill="#ff69b4" opacity=".35"/><ellipse cx="264" cy="204" rx="14" ry="8" fill="#ff69b4" opacity=".35"/>',
    '</g>',
    '</g>',
    '<g class="pb-arm"><g transform="rotate(-12 252 284)"><rect x="245" y="280" width="14" height="56" rx="7" fill="#e8eeff"/><circle cx="252" cy="342" r="19" fill="#e8eeff"/></g></g>',
    '<style>',
    '.bot-fallback .pb-all{animation:pbBob 3.2s ease-in-out infinite}',
    '.bot-fallback .pb-arm{transform-origin:252px 284px;animation:pbWaveIdle 16s ease-in-out infinite}',
    '.bot-fallback.is-waving .pb-arm{animation:pbWaveNow 2s ease-in-out 1}',
    '.bot-fallback .pb-face{transition:transform .25s ease-out}',
    '.bot-fallback.is-paused *{animation-play-state:paused!important}',
    '.bot-fallback .pb-blink{animation:pbBlink 4s infinite}',
    '.bot-fallback .pb-eye{transition:transform .3s ease}',
    '.bot-fallback .pb-eyes{transition:fill .3s}',
    '.bot-fallback[data-expr="happy"] .pb-eye{transform:scaleY(.3)}',
    '.bot-fallback[data-expr="wow"] .pb-eye{transform:scale(1.18,1.2)}',
    '.bot-fallback[data-expr="wink"] .pb-eye-r{transform:scaleY(.1)}',
    '.bot-fallback[data-expr="love"] .pb-eye{transform:scale(1.12)}',
    '.bot-fallback[data-expr="love"] .pb-eyes{fill:#ff6fb5}',
    '.bot-fallback[data-expr="think"] .pb-eye{transform:scale(.9,.45)}',
    '@keyframes pbBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}',
    '@keyframes pbWaveIdle{0%,76%{transform:rotate(0)}80%{transform:rotate(-100deg)}84%{transform:rotate(-120deg)}88%{transform:rotate(-100deg)}92%{transform:rotate(-120deg)}96%,100%{transform:rotate(0)}}',
    '@keyframes pbWaveNow{0%{transform:rotate(0)}14%{transform:rotate(-100deg)}30%{transform:rotate(-120deg)}46%{transform:rotate(-100deg)}62%{transform:rotate(-120deg)}78%{transform:rotate(-100deg)}100%{transform:rotate(0)}}',
    '@keyframes pbBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}',
    '@media (prefers-reduced-motion:reduce){.bot-fallback *{animation:none!important}}',
    '</style>',
    '</svg>'
  ].join('');

  var FB_MOUTH = {
    normal: 'M182 208q18 14 36 0',
    happy: 'M172 203q28 30 56 0',
    wow: 'M200 206m-9 0a9 12 0 1 0 18 0a9 12 0 1 0 -18 0',
    wink: 'M184 209q22 16 42 -3',
    love: 'M172 203q28 30 56 0',
    think: 'M184 212l32 -5'
  };

  /* Quality tiers: the renderer starts at a tier chosen from the device and steps down
     automatically if frames are slow. */
  var TIERS = [
    { scale: 1.00, steps: 64, ao: 3, fps: 60 },
    { scale: 0.85, steps: 56, ao: 3, fps: 60 },
    { scale: 0.75, steps: 48, ao: 2, fps: 30 },
    { scale: 0.62, steps: 40, ao: 2, fps: 30 },
    { scale: 0.50, steps: 34, ao: 1, fps: 24 }
  ];
  var SOFTWARE_RE = /swiftshader|llvmpipe|softpipe|software|microsoft basic render|mesa offscreen/i;

  function urlMode() {
    try { return new URLSearchParams(global.location.search).get('bot'); } catch (e) { return null; }
  }

  /* ------------------------------------------------------------------ */
  /* PythonBot                                                            */
  /* ------------------------------------------------------------------ */
  function PythonBot(container, options) {
    options = options || {};
    this.el = container;
    this.opts = {
      maxDpr: options.maxDpr || 1.6,
      autoExpressions: options.autoExpressions !== false,
      followPointer: options.followPointer !== false,
      greet: options.greet !== false
    };
    this.reduced = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var ua = navigator.userAgent || '';
    var coarse = !!(global.matchMedia && global.matchMedia('(pointer: coarse)').matches);
    this.isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || coarse || global.innerWidth < 700;
    var lowEnd = (navigator.hardwareConcurrency || 4) <= 2 || (navigator.deviceMemory || 4) <= 2;
    this.tierIndex = Math.min(TIERS.length - 1, (this.isMobile ? 2 : 0) + (lowEnd ? 1 : 0));
    this.tier = TIERS[this.tierIndex];
    this.quality = this.tier.scale;
    this.visible = true;
    this.running = false;
    this.destroyed = false;
    this.mode = 'webgl';
    this.renderer = '';
    this.forced3d = false;

    this.exprA = 0; this.exprB = 0; this.mix = 1; this.mixTarget = 1;
    this.current = 'normal';
    this.blink = 0; this.blinkT = 0; this.nextBlink = 1.5;
    this.waveAmt = 0; this.waveTarget = 0; this.waveUntil = 0;
    this.hover = 0; this.hoverTarget = 0;
    this.look = { x: 0, y: 0 }; this.lookTarget = { x: 0, y: 0 };
    this.nextAuto = 6; this.nextWave = 10;
    this.time = 0; this.last = 0;
    this._lastRender = 0; this._scrollUntil = 0; this._ema = 0; this._slow = 0; this._good = 0; this._errors = 0;
    this.startTier = this.tierIndex; this._failed = {};
    this.t0 = performance.now();

    this._ready = false;
    // ?bot=svg forces the lightweight bot, ?bot=3d forces WebGL even on software renderers (testing only)
    var forced = urlMode();
    this.forced3d = forced === '3d';
    if (forced === 'svg' || !this._initGL(this.forced3d)) { this._fallback(); return; }
    this._bind();
    this._resize();
    this.running = true;
    this._loop = this._loop.bind(this);
    this._raf = 0;
    this._schedule();
    if (this.opts.greet) this.wave_(3200);
    this._ready = true;
    this.el.dispatchEvent(new CustomEvent('bot:ready', { detail: { mode: 'webgl', tier: this.tierIndex } }));
  }

  /* Returns false (→ SVG bot) when WebGL is missing, has no high-precision floats,
     or is a software renderer (SwiftShader / llvmpipe …) which would make the page janky. */
  PythonBot.prototype._initGL = function (force) {
    var canvas = document.createElement('canvas');
    var gl = null;
    var attrs = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
                  powerPreference: 'default', preserveDrawingBuffer: false, failIfMajorPerformanceCaveat: !force };
    try { gl = canvas.getContext('webgl', attrs) || (force ? canvas.getContext('experimental-webgl', attrs) : null); } catch (e) { gl = null; }
    if (!gl) return false;

    try {
      var ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) this.renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
    } catch (e) { /* ignored */ }
    if (!force && this.renderer && SOFTWARE_RE.test(this.renderer)) {
      var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      return false;
    }
    try {
      var pf = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      if (!pf || pf.precision < 1) return false;
    } catch (e) { /* ignored */ }

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        if (global.console) console.warn('[PythonBot] shader error:', gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.DITHER);

    this.gl = gl; this.canvas = canvas; this.prog = prog;
    var names = ['uRes', 'uTime', 'uLook', 'uHeadRot', 'uExprA', 'uExprB', 'uMix', 'uBlink', 'uWave', 'uHover', 'uBob', 'uSteps', 'uAO'];
    this.u = {};
    for (var i = 0; i < names.length; i++) this.u[names[i]] = gl.getUniformLocation(prog, names[i]);

    canvas.setAttribute('aria-hidden', 'true');
    this.el.appendChild(canvas);
    var self = this;
    // A lost GPU context can't be recovered cheaply: switch to the SVG bot instead of reloading the page.
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); self._toFallback(); });
    return true;
  };

  PythonBot.prototype._toFallback = function () {
    if (this.destroyed || this.fallback) return;
    this.running = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null; this.gl = null;
    var cur = this.current;
    this.current = 'normal';
    this._fallback();
    if (cur && cur !== 'normal') this.setExpression(cur);
  };

  PythonBot.prototype._fallback = function () {
    this.fallback = true;
    this.mode = 'svg';
    this.el.insertAdjacentHTML('beforeend', FALLBACK_SVG);
    var svg = this.el.querySelector('.bot-fallback');
    var mouth = svg.querySelector('.pb-mouth');
    var face = svg.querySelector('.pb-face');
    var self = this;

    this.setExpression = function (name) {
      if (!FB_MOUTH[name] || name === self.current) return;
      self.current = name;
      svg.setAttribute('data-expr', name);
      mouth.setAttribute('d', FB_MOUTH[name]);
      self.el.dispatchEvent(new CustomEvent('bot:expression', { detail: { name: name } }));
    };
    this.wave_ = function () {
      svg.classList.remove('is-waving'); void svg.getBoundingClientRect();   // restart the animation
      svg.classList.add('is-waving');
    };
    svg.addEventListener('animationend', function (e) { if (e.animationName === 'pbWaveNow') svg.classList.remove('is-waving'); });
    this._wake = function () {};
    this.lookAt = function (cx, cy) {                       // eyes + mouth follow the pointer
      if (self._fbRaf) return;
      self._fbRaf = requestAnimationFrame(function () {
        self._fbRaf = 0;
        var r = self.el.getBoundingClientRect();
        var dx = (cx - (r.left + r.width / 2)) / Math.max(320, global.innerWidth * 0.5);
        var dy = (cy - (r.top + r.height * 0.4)) / Math.max(320, global.innerHeight * 0.5);
        dx = Math.max(-1, Math.min(1, dx)); dy = Math.max(-1, Math.min(1, dy));
        face.style.transform = 'translate(' + (dx * 7).toFixed(1) + 'px,' + (dy * 4.5).toFixed(1) + 'px)';
      });
    };
    if (!this.reduced) {
      this._fbMove = function (e) { var t = e.touches && e.touches[0] ? e.touches[0] : e; self.lookAt(t.clientX, t.clientY); };
      global.addEventListener('pointermove', this._fbMove, { passive: true });
    }
    if ('IntersectionObserver' in global) {                 // no work while the bot is off-screen
      this._fbIO = new IntersectionObserver(function (en) { svg.classList.toggle('is-paused', !en[0].isIntersecting); }, { threshold: 0.01 });
      this._fbIO.observe(this.el);
    }
    this._ready = true;
    this.el.dispatchEvent(new CustomEvent('bot:ready', { detail: { mode: 'svg' } }));
    if (this.opts.greet && !this.reduced) setTimeout(function () { if (!self.destroyed) self.wave_(); }, 700);
  };

  PythonBot.prototype.info = function () {
    return { mode: this.mode, tier: this.tierIndex, scale: this.tier && this.tier.scale, fps: this.tier && this.tier.fps, renderer: this.renderer };
  };

  PythonBot.prototype._bind = function () {
    var self = this;
    // IntersectionObserver: pause when off-screen
    if ('IntersectionObserver' in global) {
      this.io = new IntersectionObserver(function (entries) {
        self.visible = entries[0].isIntersecting;
        if (self.visible) self._wake();
      }, { threshold: 0.01 });
      this.io.observe(this.el);
    }
    this._onVis = function () {
      if (!document.hidden) self._wake();
    };
    document.addEventListener('visibilitychange', this._onVis);

    if ('ResizeObserver' in global) {
      this.ro = new ResizeObserver(function () { self._resize(); });
      this.ro.observe(this.el);
    } else {
      this._onResize = function () { self._resize(); };
      global.addEventListener('resize', this._onResize);
    }

    if (this.opts.followPointer) {
      this._onMove = function (e) {
        var t = e.touches && e.touches[0] ? e.touches[0] : e;
        self.lookAt(t.clientX, t.clientY);
      };
      global.addEventListener('pointermove', this._onMove, { passive: true });
      global.addEventListener('touchmove', this._onMove, { passive: true });
    }

    // While the page is scrolling, render at a reduced rate so scrolling stays smooth.
    this._onScroll = function () { self._scrollUntil = performance.now() + 160; };
    global.addEventListener('scroll', this._onScroll, { passive: true });

    this._onEnter = function () { self.hoverTarget = 1; if (!self.waveTarget) self.wave_(1800); };
    this._onLeave = function () { self.hoverTarget = 0; };
    this.el.addEventListener('pointerenter', this._onEnter);
    this.el.addEventListener('pointerleave', this._onLeave);
  };

  PythonBot.prototype._resize = function () {
    if (!this.canvas || !this.gl) return;
    var r = this.el.getBoundingClientRect();
    var cap = this.isMobile ? Math.min(this.opts.maxDpr, 1.5) : this.opts.maxDpr;
    var dpr = Math.min(global.devicePixelRatio || 1, cap) * this.tier.scale;
    var w = Math.max(2, Math.round(r.width * dpr));
    var h = Math.max(2, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
    this._draw();       // keep the frame valid even when paused
  };

  PythonBot.prototype.lookAt = function (cx, cy) {
    var r = this.el.getBoundingClientRect();
    var mx = r.left + r.width / 2, my = r.top + r.height * 0.4;
    var dx = (cx - mx) / Math.max(320, global.innerWidth * 0.5);
    var dy = (cy - my) / Math.max(320, global.innerHeight * 0.5);
    this.lookTarget.x = Math.max(-1, Math.min(1, dx));
    this.lookTarget.y = Math.max(-1, Math.min(1, -dy));
  };

  PythonBot.prototype.setExpression = function (name) {
    var idx = EXPR_INDEX[name];
    if (idx === undefined || name === this.current) return;
    // start from whatever is currently displayed
    this.exprA = (this.mix > 0.5) ? this.exprB : this.exprA;
    this.exprB = idx;
    this.mix = 0; this.mixTarget = 1;
    this.current = name;
    this.el.dispatchEvent(new CustomEvent('bot:expression', { detail: { name: name } }));
    this._wake();
  };

  PythonBot.prototype.nextExpression = function () {
    var i = EXPRESSIONS.indexOf(this.current);
    var next = EXPRESSIONS[(i + 1) % EXPRESSIONS.length];
    this.setExpression(next);
    return next;
  };

  PythonBot.prototype.wave_ = function (ms) {
    this.waveTarget = 1;
    this.waveUntil = (performance.now() - this.t0) / 1000 + (ms || 2500) / 1000;
    if (this._wake) this._wake();
  };
  PythonBot.prototype.wave = function (ms) { return this.wave_(ms); };

  PythonBot.prototype._update = function (dt, now) {
    var k = 1 - Math.exp(-dt * 9);
    // look smoothing
    this.look.x += (this.lookTarget.x - this.look.x) * (1 - Math.exp(-dt * 6));
    this.look.y += (this.lookTarget.y - this.look.y) * (1 - Math.exp(-dt * 6));
    // idle drift when pointer is idle
    if (!this.opts.followPointer) {
      this.lookTarget.x = Math.sin(now * 0.6) * 0.5;
      this.lookTarget.y = Math.sin(now * 0.45) * 0.25;
    }
    // expression blend
    this.mix += (this.mixTarget - this.mix) * (1 - Math.exp(-dt * 10));
    if (this.mix > 0.995) { this.mix = 1; this.exprA = this.exprB; }
    // hover + wave
    this.hover += (this.hoverTarget - this.hover) * k;
    if (this.waveTarget && now > this.waveUntil) this.waveTarget = 0;
    this.waveAmt += (this.waveTarget - this.waveAmt) * (1 - Math.exp(-dt * 7));
    // blink
    this.nextBlink -= dt;
    if (this.nextBlink <= 0 && this.blinkT <= 0) { this.blinkT = 0.16; this.nextBlink = 2.2 + Math.random() * 3.2; }
    if (this.blinkT > 0) {
      this.blinkT -= dt;
      var p = 1 - Math.max(0, this.blinkT) / 0.16;
      this.blink = Math.sin(Math.min(1, p) * Math.PI);
    } else this.blink = 0;
    // auto expressions
    if (this.opts.autoExpressions) {
      this.nextAuto -= dt;
      if (this.nextAuto <= 0) {
        var pool = ['happy', 'wink', 'love', 'wow', 'think'];
        var pick = pool[Math.floor(Math.random() * pool.length)];
        if (this.current === 'normal') this.setExpression(pick); else this.setExpression('normal');
        this.nextAuto = this.current === 'normal' ? 4 + Math.random() * 3 : 2.4 + Math.random() * 1.6;
      }
    }
    // idle wave: every 12-20 s (bounded, so the bot never looks "stuck")
    this.nextWave -= dt;
    if (this.nextWave <= 0 && !this.waveTarget) { this.wave_(2200); this.nextWave = 12 + Math.random() * 8; }
  };

  PythonBot.prototype._draw = function () {
    if (!this.gl || this.destroyed) return;
    var gl = this.gl, u = this.u, t = this.time;
    if (gl.isContextLost && gl.isContextLost()) return;
    var yaw = this.look.x * 0.42 + Math.sin(t * 0.8) * 0.05;
    var pitch = this.look.y * 0.26 + Math.sin(t * 1.1) * 0.025;
    var bob = Math.sin(t * 1.7) * 0.055 * (1 + this.hover * 0.6);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, t % 628.3185307);   // keeps float precision after hours (all shader multipliers are integers)
    gl.uniform2f(u.uLook, this.look.x, this.look.y);
    gl.uniform4f(u.uHeadRot, Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch));
    gl.uniform1f(u.uExprA, this.exprA);
    gl.uniform1f(u.uExprB, this.exprB);
    gl.uniform1f(u.uMix, this.mix);
    gl.uniform1f(u.uBlink, this.blink);
    gl.uniform1f(u.uWave, this.waveAmt);
    gl.uniform1f(u.uHover, this.hover);
    gl.uniform1f(u.uBob, bob);
    gl.uniform1f(u.uSteps, this.tier.steps);
    gl.uniform1f(u.uAO, this.tier.ao);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  PythonBot.prototype._loop = function (nowMs) {
    this._raf = 0;
    if (this.destroyed || !this.running) return;
    if (!this.visible || document.hidden) return;        // paused; observers restart the loop

    var scrolling = nowMs < this._scrollUntil;
    var targetMs = 1000 / this.tier.fps;
    if (scrolling) targetMs = Math.max(targetMs, 50);
    var since = nowMs - this._lastRender;
    if (this._lastRender && since < targetMs - 3) { this._schedule(); return; }   // frame-rate cap

    var dt = Math.min(0.05, (since / 1000) || 0.016);
    this.time += dt;
    var now = (nowMs - this.t0) / 1000;

    if (this.reduced) {
      // Static pose: draw once on demand, no continuous animation.
      this._lastRender = nowMs;
      this.mix = 1; this.exprA = this.exprB;
      this._draw();
      return;
    }

    // Adaptive quality: compare the real frame interval with the tier's target.
    if (this._lastRender && !scrolling) {
      this._ema = this._ema ? this._ema * 0.9 + since * 0.1 : since;
      if (this._ema > targetMs * 1.35) { this._good = 0; if (++this._slow > 20) this._downgrade(); }
      else {
        if (this._slow > 0) this._slow--;
        if (this._ema < targetMs * 1.12) {
          // ~10 s of comfortable frames: try one tier up, unless that tier already failed once
          if (++this._good > 600 && this.tierIndex > this.startTier && !this._failed[this.tierIndex - 1]) this._upgrade();
        } else this._good = 0;
      }
    }
    this._lastRender = nowMs;

    try {
      this._update(dt, now);
      this._draw();
      this._errors = 0;
    } catch (err) {
      if (global.console) console.warn('[PythonBot] frame error:', err);
      if (++this._errors >= 3) { this._toFallback(); return; }   // repeated failures: use the SVG bot
    }
    this._schedule();
  };

  PythonBot.prototype._upgrade = function () {
    this._good = 0; this._slow = 0; this._ema = 0;
    this.tierIndex--;
    this.tier = TIERS[this.tierIndex];
    this.quality = this.tier.scale;
    this._resize();
  };

  PythonBot.prototype._downgrade = function () {
    this._slow = 0; this._ema = 0; this._good = 0;
    this._failed[this.tierIndex] = true;
    if (this.tierIndex < TIERS.length - 1) {
      this.tierIndex++;
      this.tier = TIERS[this.tierIndex];
      this.quality = this.tier.scale;
      this._resize();
    } else if (!this.forced3d) {
      this._toFallback();      // even the lowest tier can't keep up: use the light SVG bot
    }
  };

  PythonBot.prototype._schedule = function () {
    if (!this._raf && this.running && !this.destroyed) this._raf = requestAnimationFrame(this._loop);
  };

  PythonBot.prototype._wake = function () {
    this._lastRender = 0; this._ema = 0;
    this._schedule();
  };

  PythonBot.prototype.destroy = function () {
    this.destroyed = true; this.running = false;
    if (this.io) this.io.disconnect();
    if (this.ro) this.ro.disconnect();
    document.removeEventListener('visibilitychange', this._onVis);
    if (this._onResize) global.removeEventListener('resize', this._onResize);
    if (this._onScroll) global.removeEventListener('scroll', this._onScroll);
    if (this._fbMove) global.removeEventListener('pointermove', this._fbMove);
    if (this._fbIO) this._fbIO.disconnect();
    if (this._onMove) { global.removeEventListener('pointermove', this._onMove); global.removeEventListener('touchmove', this._onMove); }
    if (this.el) { this.el.removeEventListener('pointerenter', this._onEnter); this.el.removeEventListener('pointerleave', this._onLeave); }
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  };

  global.PythonBot = PythonBot;
  global.PythonBot.EXPRESSIONS = EXPRESSIONS;
})(window);
