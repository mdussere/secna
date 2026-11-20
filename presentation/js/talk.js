/* SECNA talk — the clock, the three parts, the voice, the review panel.
 * Everything on screen is a pure function of the talk's time T, so any moment can be seeked or captured.
 * Time comes from the narration: voice/script.js (tools/voice.py, from script.md) gives every sequence its
 * duration and every spoken line its start, a "cue"; animations are placed on cues ("c2+0.5").
 *   Part 1 · the recipe — night: WebGL particles (js/gl.js), the short video's language.
 *   Part 2 · the code — a pseudo-Jupyter notebook (js/notebook.js), the real code and outputs.
 *   Part 3 · why it matters — night again, new scenes: the factory, the voice of users, your AI products.
 * A second clock, AMB, never stops: drifts, rotations, flows and the sky read t + AMB, so a held screen keeps
 * moving. Rule: what a hold adds is periodic, wrapped or a rigid turn, never something a transition has to undo
 * (no wound-up spiral, no accumulated camera turns, no change of speed on a click); #still freezes it (captures stay a pure function of T).
 * Modes: live (→ plays to the next pause, then holds: the talk, silent, its pauses numbered), play on (space:
 * the narrated video, with the draft voice when v is on), review (r: the narration beside the stage).
 */
(function () {
'use strict';
const W = 1920, H = 1080, TAU = Math.PI * 2;
const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, p) => a + (b - a) * p;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eo = p => 1 - Math.pow(1 - p, 3);
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const eback = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const ieo = v => 1 - Math.cbrt(1 - clamp(v));
function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const C = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
function hsl(h, s, l) { const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0), f(8), f(4)]; }
const TMP = [0, 0, 0];
let AMB = 0;   // ambient seconds: keep running while held, so nothing freezes
let GAL = 0;   // extra seconds for Clio's galaxy alone: a short spin-up on the click that opens it
const mix3 = (a, b, p) => { TMP[0] = lerp(a[0], b[0], p); TMP[1] = lerp(a[1], b[1], p); TMP[2] = lerp(a[2], b[2], p); return TMP; };
const fail = msg => { const e = $('fail'); e.style.display = 'block'; e.textContent = msg; throw new Error(msg); };

/* ═════════════ the script: sequences and cues ═════════════ */
const SC = window.SECNA_SCRIPT || fail('steps.js is missing');
const SEQ = []; let acc = 0;
SC.seqs.forEach((s, k) => { SEQ.push({ id: s.id, title: s.title, part: s.part, notes: s.notes, lines: s.lines, dur: s.dur, audio: s.audio, off: acc, k, c: s.lines.map(l => l.t) }); acc += s.dur; });
const DUR = acc, S = {}; SEQ.forEach(s => { S[s.id] = s; });
const PARTS = SC.parts;
function local(s, expr) {
  if (typeof expr === 'number') return expr;
  const e = String(expr).replace(/\s+/g, '');
  const m = e.match(/^(?:c(\d+)|(end))?([+-][\d.]+)?$/);
  if (!m || (m[1] === undefined && !m[2] && m[3] === undefined)) { const v = parseFloat(e); if (isNaN(v)) throw new Error('bad cue ' + expr + ' in ' + s.id); return v; }
  let base = 0;
  if (m[2]) base = s.dur; else if (m[1] !== undefined) { const k = +m[1]; if (k >= s.c.length) throw new Error(`cue c${k} beyond ${s.id} (${s.c.length} lines)`); base = s.c[k]; }
  return base + (m[3] ? parseFloat(m[3]) : 0);
}
const cue = (sid, expr) => { const s = S[sid]; if (!s) throw new Error('unknown sequence ' + sid); return s.off + local(s, expr); };
const lt = (T, sid) => T - S[sid].off;
const seqAt = t => { for (let k = SEQ.length - 1; k >= 0; k--) if (t >= SEQ[k].off - 1e-6) return SEQ[k]; return SEQ[0]; };
const P2 = SEQ.find(s => s.part === 2).off, P3 = SEQ.find(s => s.part === 3).off;

/* ═════════════ the run's data ═════════════ */
const DATA = window.SECNA_DATA || fail('data.js is missing — run tools/build_data.py');
const unb64 = s => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
const N = DATA.n, NDAYS = DATA.days;
const CLU = unb64(DATA.cl), THM = unb64(DATA.th), DAY = unb64(DATA.day), FLG = unb64(DATA.fl);
const F = () => new Float32Array(N);
const R = rng(20261119);
const gauss = () => { let u = 0, v = 0; while (!u) u = R(); while (!v) v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
const R1 = F(), R2 = F(), R3 = F(), R4 = F(), R5 = F(), R6 = F(), G1 = F(), G2 = F(), G3 = F();
for (let i = 0; i < N; i++) { R1[i] = R(); R2[i] = R(); R3[i] = R(); R4[i] = R(); R5[i] = R(); R6[i] = R(); G1[i] = gauss(); G2[i] = gauss(); G3[i] = gauss(); }
/* who wrote it: 0 people · 1 signed by an AI agent · 2 bots */
const CAT = new Uint8Array(N);
for (let i = 0; i < N; i++) { const f = FLG[i]; CAT[i] = (f & 1) ? 2 : ((f & 6) ? 1 : 0); }

/* ═════════════════════════ PART 1 · night ═════════════════════════ */
const K = { paper: C('#F4F2EC'), warm: C('#FFE2B8'), cool: C('#CDDCFF'), ds: C('#4FD1FF'), dsl: C('#AEE9FF'),
  llm: C('#FF3D7F'), llm2: C('#FFA3C3'), hot: C('#E8FF3A'), grey: C('#5C6374'), bot: C('#7F8CB0') };
const FX = F(), FY = F(), FZ = F(), SX = F(), SY = F(), SZ = F(), SS = F();
for (let i = 0; i < N; i++) {
  FX[i] = R1[i] * W; FY[i] = R2[i] * H; FZ[i] = -300 + R3[i] * 500;
  SZ[i] = -2600 + R3[i] * 2700; const depth = 1913 - SZ[i], hh = depth * .3443 * 1.08;
  SX[i] = 960 + (R1[i] * 2 - 1) * hh * 16 / 9;
  SY[i] = R5[i] < .5 ? 540 + (SX[i] - 960) * -.32 + G1[i] * hh * .22 : 540 + (R2[i] * 2 - 1) * hh;
  SS[i] = (1.5 + R4[i] * 1.7 + (R4[i] > .985 ? 3 : 0)) * depth / 1568;
}
const starA = i => .12 + .5 * R4[i] * R4[i] + (R4[i] > .985 ? .6 : 0);

/* customer reviews: eight illustrative clusters and a few loners (the recipe) */
const CL = [
  { name: 'Lost parcel', th: 0, col: '#4FD1FF', x: 780, y: 500, z: 120, w: .16 },
  { name: 'Courier unreachable', th: 0, col: '#8DE4FF', x: 1010, y: 660, z: -90, w: .10 },
  { name: 'Damaged packaging', th: 0, col: '#2B9FD8', x: 730, y: 790, z: 40, w: .08 },
  { name: 'Refund stuck', th: 1, col: '#E8FF3A', x: 1330, y: 450, z: -150, w: .15 },
  { name: 'Double charge', th: 1, col: '#C2F03C', x: 1590, y: 580, z: 60, w: .10 },
  { name: 'Promo code rejected', th: 1, col: '#FFD43A', x: 1280, y: 690, z: 170, w: .08 },
  { name: 'App crashes', th: 2, col: '#B49BFF', x: 1660, y: 810, z: -70, w: .14 },
  { name: "Can't log in", th: 2, col: '#8471FF', x: 1420, y: 850, z: 110, w: .11 }];
const CLC = CL.map(c => C(c.col));
const THEMES3 = [{ n: 'Delivery', x: 700, col: '#4FD1FF' }, { n: 'Payment', x: 1140, col: '#E8FF3A' }, { n: 'App', x: 1580, col: '#B49BFF' }];
{ const cnt = [0, 0, 0]; CL.forEach(c => { const k = cnt[c.th]++; c.ax = THEMES3[c.th].x; c.ay = 520 + k * 150; }); }
const TREE = { x: 1060, dot: 1108, ex: 0 };
{ let y = 300; THEMES3.forEach((th, k) => { th.ty = y; y += 52; CL.forEach((c, j) => { if (c.th !== k) return; c.ty = y; y += 48; if (j === 0) { TREE.ex = y; y += 48; } }); th.tyEnd = y - 48; y += 22; }); }
const IC = new Int8Array(N), IK = new Int32Array(N);
{ let a = 0; const cum = CL.map(c => (a += c.w)), cnt = CL.map(() => 0);
  for (let i = 0; i < N; i++) { let c = -1; for (let k = 0; k < CL.length; k++) if (R6[i] < cum[k]) { c = k; break; }
    IC[i] = c; IK[i] = c >= 0 ? cnt[c]++ : 0; }
  CL.forEach((c, k) => { c.n = cnt[k]; }); }
const firstOf = (c, k) => { for (let i = 0; i < N; i++) if (IC[i] === c && IK[i] === k) return i; return 0; };
const PA1 = firstOf(0, 0), PA2 = firstOf(0, 1);
const TYP5 = [2, 3, 4, 5, 6].map(k => firstOf(0, k));
const E3X = F(), E3Y = F(), E3Z = F(), C3X = F(), C3Y = F(), C3Z = F();
for (let i = 0; i < N; i++) {
  const c = IC[i];
  if (c < 0) { const x = 1220 + (R1[i] * 2 - 1) * 640, y = 650 + (R2[i] * 2 - 1) * 300, z = (R3[i] * 2 - 1) * 320;
    E3X[i] = C3X[i] = x; E3Y[i] = C3Y[i] = y; E3Z[i] = C3Z[i] = z; }
  else { const k = CL[c];
    E3X[i] = k.x + G1[i] * 74; E3Y[i] = k.y + G2[i] * 58; E3Z[i] = k.z + G3[i] * 64;
    C3X[i] = k.x + G1[i] * 34; C3Y[i] = k.y + G2[i] * 28; C3Z[i] = k.z + G3[i] * 32; }
}
{ const pin = (i, c, dx, dy, dz) => { const k = CL[c]; E3X[i] = C3X[i] = k.x + dx; E3Y[i] = C3Y[i] = k.y + dy; E3Z[i] = C3Z[i] = k.z + dz; };
  pin(PA1, 0, -30, -14, 20); pin(PA2, 0, 24, 18, -10); }

/* Clio: a galaxy of conversations */
const GR = F(), GA = F(), GT = F(), GK = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  if (R4[i] < .16) { GK[i] = 0; GR[i] = Math.abs(G1[i]) * 95; GA[i] = R1[i] * TAU; GT[i] = G2[i] * 26; }
  else if (R4[i] < .87) { GK[i] = 1; const s = R3[i], r = 70 + Math.pow(s, 1.25) * 900;
    GR[i] = r * (1 + G3[i] * .06); GA[i] = (R2[i] < .5 ? 0 : Math.PI) + Math.log(r / 70) / .36 + G1[i] * .26 * (1 - s * .4); GT[i] = G2[i] * 12; }
  else { GK[i] = 2; GR[i] = Math.sqrt(R1[i]) * 1000; GA[i] = R2[i] * TAU; GT[i] = G3[i] * 40; }
}

/* the five letters, drawn with the corpus */
function sampleWord(text, px, cx, cy, track) {
  const cw = 1920, ch = 640, cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.font = `900 ${px}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif`;
  g.textBaseline = 'middle'; g.fillStyle = '#fff';
  const chars = [...text], ws = chars.map(c => g.measureText(c).width), tr = px * track;
  const total = ws.reduce((a, b) => a + b, 0) + tr * (chars.length - 1);
  let x = (cw - total) / 2; const bounds = [];
  chars.forEach((c, k) => { g.fillText(c, x, ch / 2); bounds.push(x); x += ws[k] + tr; });
  const img = g.getImageData(0, 0, cw, ch).data, pts = [];
  for (let y = 0; y < ch; y += 2) for (let xx = 0; xx < cw; xx += 2) if (img[(y * cw + xx) * 4 + 3] > 150) pts.push(xx, y);
  const r = rng(99), n = pts.length / 2, order = new Int32Array(n);
  for (let k = 0; k < n; k++) order[k] = k;
  for (let k = n - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)), s = order[k]; order[k] = order[j]; order[j] = s; }
  const X = F(), Y = F();
  for (let i = 0; i < N; i++) { const k = order[i % n]; X[i] = pts[k * 2] + (cx - cw / 2) + (i >= n ? r() * 2 - 1 : 0); Y[i] = pts[k * 2 + 1] + (cy - ch / 2) + (i >= n ? r() * 2 - 1 : 0); }
  return { X, Y };
}
let W1 = null;
const word = () => W1 || (W1 = sampleWord('SECNA', 300, 1110, 520, .02));

/* documents (the S step) */
const DCX = F(), DCY = F(), DCV = new Uint8Array(N);
for (let i = 0; i < N; i++) { DCX[i] = 1200 + G1[i] * 250; DCY[i] = 805 + G2[i] * 78; DCV[i] = Math.abs(G1[i]) < 2.5 && Math.abs(G2[i]) < 2.4 && R5[i] < .5 ? 1 : 0; }

/* Clio's bill as a bar of light: S · E C · N · A */
const BILL = { y0: 522, rows: 26, cell: 3.6, segs: [
  { x0: 160, x1: 1634, c: K.llm, t0: 0, d: 1 }, { x0: 1638, x1: 1642, c: K.ds, t0: 1.1, d: .2 },
  { x0: 1646, x1: 1764, c: K.llm2, t0: 1.3, d: .5 }, { x0: 1768, x1: 1771, c: K.llm2, t0: 1.9, d: .2 }] };
const BLX = F(), BLY = F(), BLDEL = F(), BLS = new Int8Array(N).fill(-1), BLCOL = F();
{ let i = 0;
  BILL.segs.forEach((s, k) => { const cols = Math.max(1, Math.floor((s.x1 - s.x0) / BILL.cell));
    for (let c = 0; c < cols; c++) for (let r = 0; r < BILL.rows && i < N; r++, i++) {
      BLX[i] = s.x0 + 1.8 + c * BILL.cell; BLY[i] = BILL.y0 + 1.8 + r * BILL.cell; BLS[i] = k; BLCOL[i] = c / cols;
      BLDEL[i] = s.t0 + s.d * (cols > 1 ? c / cols : r / BILL.rows); } }); }
const GAL3 = [{ x: 410, y: 400, cue: 1 }, { x: 960, y: 400, cue: 2 }, { x: 1510, y: 400, cue: 3 }];

/* ---------- particle buffers and layouts: L.name(t, out, cues), t local to the layout's sequence ---------- */
function buf() { return { x: F(), y: F(), z: F(), w: F(), h: F(), r: F(), g: F(), b: F(), a: F(), s: F() }; }
const OUT = buf(), POOL = [buf(), buf(), buf(), buf()];
function put(o, i, x, y, z, w, h, c, a, s) { o.x[i] = x; o.y[i] = y; o.z[i] = z; o.w[i] = w; o.h[i] = h; o.r[i] = c[0]; o.g[i] = c[1]; o.b[i] = c[2]; o.a[i] = a; o.s[i] = s; }
const hide = (o, i) => put(o, i, FX[i], FY[i], FZ[i], 2, 2, K.paper, 0, 1);
const L = {};
L.void = (t, o) => { for (let i = 0; i < N; i++) hide(o, i); };
L.stars = (t, o) => {
  for (let i = 0; i < N; i++) {
    const a = t + AMB, sp = Math.pow(Math.max(0, Math.sin(a * (.35 + .5 * R5[i]) + R6[i] * TAU)), 14);
    const tw = .72 + .28 * Math.sin(a * 1.6 + R4[i] * 40) + .9 * sp, c = R6[i] < .035 ? K.hot : (R6[i] > .93 ? K.cool : (R6[i] > .88 ? K.warm : K.paper));
    const dr = Math.sin(a * .025 + .3) * 70 * (.35 + R3[i]);
    put(o, i, SX[i] + dr, SY[i] + dr * .18, SZ[i], SS[i] * (1 + .5 * sp), SS[i] * (1 + .5 * sp), c, starA(i) * tw, 1);
  }
};
L.flood = (t, o, c) => {
  const t0 = c[0], t1 = c[2] + 1, mach = 1e9, dim = 1 - .64 * eo(seg(t, c[3], c[3] + 1));
  for (let i = 0; i < N; i++) {
    const a = t0 + .2 + (t1 - t0) * Math.sqrt(R6[i]), q = eo(seg(t, a, a + 1.6));
    const px = 30 + (((R1[i] * 1860 - (t - t0) * 6 * (.5 + R3[i]) - AMB * 16 * (.5 + R3[i])) % 1860) + 1860) % 1860, py = 46 + R2[i] * 988, pz = -420 + R3[i] * 520;
    const gl = 1 + .3 * Math.sin((t + AMB) * 1.3 + R4[i] * 40) + 1.2 * Math.pow(Math.max(0, Math.sin((t + AMB) * (.4 + .5 * R5[i]) + R6[i] * TAU)), 14);
    const m = R5[i] < .4 ? eo(seg(t, mach + 2.4 * R4[i], mach + 2.4 * R4[i] + .6)) : 0;
    put(o, i, lerp(SX[i], px, q), lerp(SY[i], py, q), lerp(SZ[i], pz, q) + Math.sin(Math.PI * q) * 420,
      lerp(SS[i], 12 + R4[i] * 26, q), lerp(SS[i], 2.3, q), m > 0 ? mix3(K.paper, K.ds, m) : K.paper,
      lerp(starA(i), (.16 + .3 * R4[i] + .2 * m) * gl, q) * dim, 1);
  }
};
L.tiles = (t, o, c) => {
  const on = seg(t, c[3], c[3] + .6), flash = eo(seg(t, c[4], c[4] + .6)) * (1 - .55 * eio(seg(t, c[4] + .9, c[4] + 1.9)));   // the red comes in, then settles to a tint that stays while held
  for (let i = 0; i < N; i++) {
    if (i >= 14400) { hide(o, i); continue; }
    const tile = i / 144 | 0, cell = i % 144, tx = tile % 10, ty = tile / 10 | 0, cx = cell % 12, cy = cell / 12 | 0, win = tile < 2;
    let a = win ? lerp(.4, 1.25, on) : lerp(.4, .2, on);
    if (!win) a *= 1 + 1.4 * flash;
    put(o, i, 150 + tx * 82 + cx * 6 + 3, 135 + ty * 82 + cy * 6 + 3, 0, 4.4, 4.4, win ? mix3(K.paper, K.hot, on) : (flash > .01 ? mix3(K.paper, K.llm, flash) : K.paper), a * (win ? 1 + .12 * Math.sin(AMB * 2.2) : 1 + .35 * Math.sin(AMB * .9 + tile * 1.7)), .3);
  }
};
L.wallGrow = (t, o) => {
  for (let i = 0; i < N; i++) {
    if (i >= 14400) { hide(o, i); continue; }
    const tile = i / 36 | 0, cell = i % 36, tx = tile % 20, ty = tile / 20 | 0, cx = cell % 6, cy = cell / 6 | 0, win = ty === 0 && tx < 2;
    put(o, i, 150 + tx * 82 + cx * 12 + 6, 135 + ty * 82 + cy * 12 + 6, 0, 7, 7, win ? K.hot : K.paper, win ? 1.25 * (1 + .12 * Math.sin(AMB * 2.2)) : .26 * (1 + .35 * Math.sin(AMB * .9 + tile * 1.7)), .3);
  }
};
L.sample = (t, o, c) => {
  const u = t - c[0], dim = seg(u, .8, 1.6), sm = seg(t, c[1] + .8, c[1] + 1.4);
  for (let i = 0; i < N; i++) {
    if (i < 7000) {
      const x = 960 + R1[i] * 880, y = 300 + R2[i] * 620, lit = i % 100 === 0 && Math.hypot(x - 1560, y - 600) > 90;
      if (lit) { const p = 1 + .3 * Math.sin((t + AMB) * 4 + R4[i] * 6); put(o, i, x, y, 0, 8 * p, 8 * p, K.hot, lerp(.7, 1.3, dim), 1); }
      else put(o, i, x, y, 0, 3.2, 3.2, K.paper, lerp(.42, .12, dim), 1);
    } else if (i < 7034) {
      const k = i - 7000, ang = k * 2.39996, rad = 4.8 * Math.sqrt(k);
      put(o, i, 1560 + Math.cos(ang) * rad, 600 + Math.sin(ang) * rad, 0, 5, 5, mix3(K.paper, K.llm, sm), lerp(lerp(.42, .12, dim), 1.2, sm), 1);
    } else hide(o, i);
  }
};
L.cards = (t, o, c) => {
  const u = t - c[2], cy = Math.cos(-.62), sy = Math.sin(-.62), cp = Math.cos(.32), sp = Math.sin(.32);
  for (let i = 0; i < N; i++) {
    const col = i % 30, row = (i / 30 | 0) % 20, lay = i / 600 | 0;
    const lx = (col - 14.5) * 20, ly = (row - 9.5) * 15, lz = -lay * 44 + 420;
    const x1 = lx * cy + lz * sy, z1 = -lx * sy + lz * cy, y1 = ly * cp - z1 * sp, z2 = ly * sp + z1 * cp;
    const ta = .5 + 2.4 * ieo(i / N), q = eo(seg(u, ta, ta + .5));
    put(o, i, 1400 + x1, 660 + y1 - (1 - q) * 50, -420 + z2, 13, 8, K.llm, q * (.17 + .09 * R4[i]) * Math.exp(-lay * .24) * (1 + .3 * Math.sin(AMB * 1.1 - lay * .5)), .3);
  }
};
L.field = (t, o) => {
  for (let i = 0; i < N; i++) put(o, i, FX[i] + Math.sin((t + AMB) * .3 + R3[i] * 6) * 18, FY[i] + Math.cos((t + AMB) * .26 + R4[i] * 6) * 18, FZ[i], 2.4, 2.4, K.paper, R5[i] < .55 ? .13 : 0, 1);
};
L.fieldLow = (t, o) => { L.field(t, o); for (let i = 0; i < N; i++) o.a[i] *= .5; };
L.galaxy = (t, o) => {
  for (let i = 0; i < N; i++) {
    const r = GR[i], ph = GA[i] + t * 36 / (r + 170) + (AMB + GAL) * .05, gx = r * Math.cos(ph), gz = r * Math.sin(ph), k = GK[i];
    const c = k === 0 ? K.warm : (k === 1 ? (R5[i] < .025 ? K.llm2 : (R5[i] > .975 ? K.dsl : K.cool)) : K.paper);
    put(o, i, 1250 + gx, 690 - gz * .44 + GT[i], -380 - gz * .9, 2.6, 2.6, c, k === 0 ? .2 + .2 * R4[i] : (k === 1 ? .34 + .42 * R4[i] : .14), 1);
  }
};
L.veil = (t, o) => { L.galaxy(t + 14, o); for (let i = 0; i < N; i++) { o.w[i] = o.h[i] = 12 + R3[i] * 18; o.s[i] = 1.5; o.a[i] *= .055; o.y[i] += 150; o.z[i] -= 300; } };
L.word = (t, o) => { const w = word(); for (let i = 0; i < N; i++) { const a = t + AMB, sp = R2[i] < .2 ? Math.pow(Math.max(0, Math.sin(a * (.4 + .6 * R5[i]) + R6[i] * TAU)), 16) : 0; put(o, i, w.X[i] + Math.sin(a * .9 + R3[i] * TAU) * 1.6, w.Y[i] + Math.cos(a * .7 + R4[i] * TAU) * 1.6, G3[i] * 5 + Math.sin(a * .5 + R1[i] * TAU) * 14, 2.3 + .5 * sp, 2.3 + .5 * sp, K.paper, .4 + .2 * Math.sin(a * 1.4 + R4[i] * TAU) + .28 * sp, 1); } };
L.docs = (t, o) => { for (let i = 0; i < N; i++) put(o, i, DCX[i], DCY[i], 0, 16 + R3[i] * 14, 3.2, K.paper, DCV[i] ? .3 : 0, 1); };
const scanS = c => [c[2] + .62 * (c[3] - c[2]), c[3] - .5];   // the S scan: done before the E line, so a pause holds it done
L.docsScan = (t, o, c) => {   // S: a small LLM shortens every text (the dashes get shorter, they are not points yet)
  const [sa, sb] = scanS(c), sx = lerp(600, 2000, eio(seg(t, sa, sb)));
  for (let i = 0; i < N; i++) {
    const x = DCX[i], s = clamp((sx - x) / 90);
    put(o, i, x + Math.sin(AMB * .5 + R4[i] * TAU) * 4, DCY[i] + Math.cos(AMB * .4 + R3[i] * TAU) * 3, 0, lerp(16 + R3[i] * 14, 7, s), 3.2, s > 0 && s < 1 ? K.llm : (s >= 1 ? K.llm2 : K.paper), DCV[i] ? lerp(.3, .62, s) : 0, 1);
  }
};
L.embed3d = (t, o) => {
  for (let i = 0; i < N; i++)
    put(o, i, E3X[i] + Math.sin((t + AMB) * .6 + R3[i] * 9) * 5, E3Y[i] + Math.cos((t + AMB) * .5 + R4[i] * 9) * 5, E3Z[i], 2.6, 2.6, IC[i] < 0 ? K.grey : K.dsl, IC[i] < 0 ? .45 : .5, 1);
  [PA1, PA2].forEach(i => { o.a[i] = 1.2; o.w[i] = o.h[i] = 7; });
};
L.cluster3d = (t, o) => {
  for (let i = 0; i < N; i++) { const k = IC[i];
    put(o, i, C3X[i] + Math.sin((t + AMB) * .6 + R3[i] * 9) * 3, C3Y[i] + Math.cos((t + AMB) * .5 + R4[i] * 9) * 3, C3Z[i], 2.6, 2.6, k < 0 ? K.grey : CLC[k], k < 0 ? .5 : .3, 1); }
};
L.name3d = (t, o, c) => {
  L.cluster3d(t, o);
  const u = t - c[5], hl = eo(seg(u, .2, .9)) * (1 - eo(seg(u, 2.6, 3.4)));
  for (let i = 0; i < N; i++) if (IC[i] !== 0) o.a[i] *= 1 - .7 * hl; else o.a[i] = lerp(o.a[i], .9, hl);
  TYP5.forEach((i, k) => { const q = eo(seg(u, .5 + k * .12, 1.1 + k * .12)) * (1 - eo(seg(u, 2.6, 3.2)));
    o.w[i] = o.h[i] = lerp(3, 10, q); const cc = mix3(CLC[0], K.llm, q); o.r[i] = cc[0]; o.g[i] = cc[1]; o.b[i] = cc[2]; o.a[i] = lerp(o.a[i], 1.4, q); });
};
L.agg = (t, o) => {
  for (let i = 0; i < N; i++) { const c = IC[i];
    if (c < 0) { put(o, i, 560 + R1[i] * 1280, 340 + R2[i] * 600, 0, 2.6, 2.6, K.grey, R5[i] < .5 ? .1 : 0, 1); continue; }
    const k = IK[i], ang = k * 2.39996 + AMB * .12 * (c % 2 ? -1 : 1), rad = 1.02 * Math.sqrt(k) * (1 + .03 * Math.sin(AMB * .8 + c)), cl = CL[c];
    put(o, i, cl.ax + Math.cos(ang) * rad, cl.ay + Math.sin(ang) * rad, 0, 2.2, 2.2, CLC[c], .24, 1); }
};
L.tree = (t, o) => {   // each cluster gathers into the dot of its row in the tree; its size still shows
  for (let i = 0; i < N; i++) { const c = IC[i];
    if (c < 0) { put(o, i, 560 + R1[i] * 1280, 340 + R2[i] * 600, 0, 2.6, 2.6, K.grey, 0, 1); continue; }
    const k = IK[i], ang = k * 2.39996 + AMB * .12 * (c % 2 ? -1 : 1), rad = .3 * Math.sqrt(k) * (1 + .04 * Math.sin(AMB * .8 + c));
    put(o, i, TREE.dot + Math.cos(ang) * rad, CL[c].ty + Math.sin(ang) * rad, 0, 2, 2, CLC[c], .07, 1); }
};
L.aggDim = (t, o) => { L.agg(t, o); for (let i = 0; i < N; i++) o.a[i] *= .35; };
L.billWait = (t, o) => { L.agg(t, o); for (let i = 0; i < N; i++) o.a[i] *= .06; };
L.billBar = (t, o) => {
  for (let i = 0; i < N; i++) { const s = BLS[i];
    if (s < 0) { hide(o, i); continue; }
    put(o, i, BLX[i], BLY[i], 0, 2.9, 2.9, BILL.segs[s].c, (s === 0 ? .8 : .95) * (1 + .22 * Math.sin(AMB * 1.4 - BLX[i] * .012)), .4); }
};
L.billCut = (t, o, c) => {
  L.billBar(t, o);
  for (let i = 0; i < N; i++) {
    if (BLS[i] !== 0) continue;
    const dt = t - (c[3] + .3 + .8 * BLCOL[i] + .2 * R1[i]);
    if (dt <= 0) continue;
    o.x[i] += dt * 50 + dt * dt * 120 * R2[i]; o.y[i] += -dt * (40 + 90 * R3[i]) + dt * dt * 25; o.z[i] += dt * 260 * (R4[i] - .25);
    const cc = mix3(K.llm, K.paper, seg(dt, 0, .9)); o.r[i] = cc[0]; o.g[i] = cc[1]; o.b[i] = cc[2];
    o.a[i] *= 1 - eo(seg(dt, .1, 1.7));
  }
};
L.curveFlow = (t, o, c) => {
  const dl = eio(seg(t, c[1], c[1] + 2)), dc = eio(seg(t, c[2], c[2] + 1.8));
  for (let i = 0; i < N; i++) {
    if (i < 1700) { const u = (R1[i] + (t + AMB) * .045) % 1; if (u > dl) { hide(o, i); continue; }
      const v = (Math.pow(10, 3 * u) - 1) / 999; put(o, i, 260 + u * 1400 + G1[i] * 2, 760 - v * 460 + G2[i] * 3, 0, 3, 3, K.llm, .75, 1); }
    else if (i < 2700) { const u = (R1[i] + (t + AMB) * .03) % 1; if (u > dc) { hide(o, i); continue; }
      put(o, i, 260 + u * 1400 + G1[i] * 2, 808 - 10 * u - (u > .45 ? 7 : 0) - (u > .8 ? 7 : 0) + G2[i] * 2.5, 0, 3, 3, K.ds, .75, 1); }
    else put(o, i, FX[i], FY[i], FZ[i], 2.2, 2.2, K.paper, R5[i] < .4 ? .05 : 0, 1);
  }
};
L.cardsGal = (t, o, c) => {
  for (let i = 0; i < N; i++) {
    const g = R5[i] < .25 ? 0 : R5[i] < .5 ? 1 : R5[i] < .75 ? 2 : -1;
    const fx = FX[i] + Math.sin((t + AMB) * .3 + R3[i] * 6) * 18, fy = FY[i] + Math.cos((t + AMB) * .26 + R4[i] * 6) * 18;
    if (g < 0) { put(o, i, fx, fy, FZ[i], 2.4, 2.4, K.paper, R6[i] < .5 ? .06 : 0, 1); continue; }
    const G = GAL3[g], t0 = c[G.cue], on = eio(seg(t, t0 - .2, t0 + 1.6)), rr = 16 + Math.pow(R1[i], .75) * 230;
    const ph = (R2[i] < .5 ? 0 : Math.PI) + Math.log(rr / 16) / .36 + G1[i] * .28 + t * 18 / (rr + 60) + AMB * .06;
    const cc = R6[i] < .2 ? K.warm : (R6[i] < .6 ? K.dsl : K.cool);
    put(o, i, lerp(fx, G.x + rr * Math.cos(ph), on), lerp(fy, G.y + rr * Math.sin(ph) * .56, on), lerp(FZ[i], rr * Math.sin(ph) * .4, on),
      2.6, 2.6, cc, lerp(.06, .5, on), 1);
  }
};

/* ═════════════ PART 3 · the uses: night again, new scenes ═════════════ */
// Use 1 · the agentic software factory: six agents around the code, reading it again and again
const FC = { x: 1250, y: 650, rx: 520, ry: 290 };
const AG = ['Plan', 'Code', 'Review', 'Test', 'Deploy', 'Monitor'].map((n, k) => { const a = (-90 + k * 60) * Math.PI / 180; return { n, x: FC.x + FC.rx * Math.cos(a), y: FC.y + FC.ry * Math.sin(a) }; });
const MAPC = { x: FC.x, y: FC.y, z: 260 };
const NCORE = 6000, NAG = 300, NSTREAM = 5000, NMAP = 1400;
const I_AG = NCORE, I_ST = I_AG + 6 * NAG, I_MAP = I_ST + NSTREAM, I_END = I_MAP + NMAP;
const rowLen = r => 150 + 110 * (((Math.sin(r * 12.9898) * 43758.5453) % 1 + 1) % 1);
L.factory = (t, o, c) => {
  const grow = eo(seg(t, c[3], c[3] + 1.8)), traffic = eo(seg(t, c[2] - .3, c[2] + 1.6));
  const mapOn = eo(seg(t, c[5] + .2, c[5] + 1.6)), via = eio(seg(t, c[6], c[6] + 1.8)), dimAll = 1 - .6 * eo(seg(t, c[7], c[7] + .8)), sc = 1 + .32 * grow;
  for (let i = 0; i < N; i++) {
    if (i < NCORE) {                                   // the code: lines of text, a pile that grows
      const row = Math.floor(R1[i] * 72), shown = R3[i] < .5 + .5 * grow;
      put(o, i, FC.x - 130 * sc + R2[i] * rowLen(row) * sc, FC.y - 180 * sc + row * 5 * sc, (R4[i] < .3 ? -70 : 0) * grow, 6, 2.2, K.paper, shown ? (.25 - .13 * mapOn) * dimAll : 0, .3);
    } else if (i < I_ST) {                             // the agents
      const k = (i - I_AG) / NAG | 0, A = AG[k], on = eback(seg(t, c[1] + k * .18, c[1] + k * .18 + .6));
      put(o, i, A.x + G1[i] * 15 * on, A.y + G2[i] * 15 * on, G3[i] * 15, 3, 3, K.llm, .6 * clamp(on) * dimAll, 1);
    } else if (i < I_MAP) {                            // the reading traffic: agent → code → agent, then agent → map → agent
      const k = i % 6, A = AG[k], u = (R1[i] + (t + AMB) * (.16 + .1 * R2[i])) % 1, w = u < .5 ? u * 2 : 2 - u * 2;
      const bx = lerp(FC.x + (R4[i] - .5) * 250 * sc, MAPC.x + (R4[i] - .5) * 150, via), by = lerp(FC.y + (R5[i] - .5) * 350 * sc, MAPC.y + (R5[i] - .5) * 110, via);
      const mx = (A.x + bx) / 2 + (A.y - by) * .18 * (R6[i] - .5), my = (A.y + by) / 2 - (A.x - bx) * .18 * (R6[i] - .5);
      const x = (1 - w) * (1 - w) * A.x + 2 * (1 - w) * w * mx + w * w * bx, y = (1 - w) * (1 - w) * A.y + 2 * (1 - w) * w * my + w * w * by;
      const keep = R3[i] < (.45 + .55 * grow) * (1 - .62 * via);
      put(o, i, x, y, w * w * MAPC.z * via, 3.2, 3.2, K.llm2, keep ? .72 * traffic * dimAll : 0, 1);
    } else if (i < I_END) {                            // the map: computed once, in front of the pile
      const k = (i - I_MAP) % 7, a = k / 7 * TAU + .3, rr = 92 + (k % 2) * 26, q = eo(seg(t, c[5] + .3 + k * .12, c[5] + 1.3 + k * .12));
      put(o, i, MAPC.x + Math.cos(a) * rr + G1[i] * 11 * q, MAPC.y + Math.sin(a) * rr * .7 + G2[i] * 9 * q, MAPC.z + G3[i] * 8, 3, 3, K.ds, .75 * q * (.2 + .8 * dimAll), 1);
    } else hide(o, i);
  }
};
// Use 2 · the voice of your users: sources everywhere, flowing into rivers of themes; one rises
const SRC = [{ n: 'Reviews', x: 150, y: 495 }, { n: 'Tickets', x: 90, y: 625 }, { n: 'X', x: 90, y: 755 }, { n: 'App stores', x: 170, y: 885 }, { n: 'Platforms', x: 390, y: 975 }, { n: 'Forums', x: 660, y: 1005 }, { n: 'Surveys', x: 380, y: 465 }];
const RX0 = 540, RX1 = 1540, RY = 700;
const RIB = [{ n: 'Delivery', a: 62, b: 68, col: K.dsl }, { n: 'Payment', a: 52, b: 48, col: K.cool }, { n: 'Login after the update', a: 3, b: 92, col: K.hot, rise: true },
  { n: 'App', a: 46, b: 40, col: K.dsl }, { n: 'Customer service', a: 36, b: 40, col: K.cool }];
const ribTh = (k, p) => { const r = RIB[k]; return r.rise ? r.a + (r.b - r.a) * Math.pow(clamp((p - .4) / .6), 1.6) : lerp(r.a, r.b, p) + 4 * Math.sin(p * 9 + k); };
const ribY = (k, p) => { let tot = 0; for (let j = 0; j < RIB.length; j++) tot += ribTh(j, p) + 6; let y = RY - tot / 2; for (let j = 0; j < k; j++) y += ribTh(j, p) + 6; return y + ribTh(k, p) / 2; };
const NSRC = 2600, NRIB = 11000;
L.voices = (t, o, c) => {
  const fill = seg(t, c[0] + .6, c[1] + 1.6), smp = seg(t, c[2], c[2] + .6) * (1 - seg(t, c[3], c[3] + .6)), rise = eo(seg(t, c[3], c[3] + 1.2));
  for (let i = 0; i < N; i++) {
    if (i < NSRC) {
      const s = i % SRC.length, S0 = SRC[s], on = seg(t, c[0] + .3 + s * .2, c[0] + .9 + s * .2), k = Math.floor(R2[i] * RIB.length), u = (R1[i] + (t + AMB) * .22) % 1;
      put(o, i, lerp(S0.x, RX0, u), lerp(S0.y, ribY(k, 0), u) - Math.sin(Math.PI * u) * 50 * (R3[i] - .5), 0, 2.4, 2.4, K.paper, on * .45 * (1 - .75 * smp), 1);
    } else if (i < NSRC + NRIB) {
      const k = Math.floor(R2[i] * RIB.length), r = RIB[k], p = (R1[i] + (t + AMB) * .035) % 1, th = ribTh(k, p), dense = R4[i] < th / 92;
      const sampled = R6[i] < .016 && !r.rise;
      let a = dense && p < fill ? .6 : 0;
      if (smp > 0) a *= sampled ? 1 + 1.6 * smp : 1 - .82 * smp;
      if (r.rise) a *= .55 + .95 * rise;
      const sz = sampled && smp > 0 ? 2.6 + 3 * smp : 2.6;
      put(o, i, lerp(RX0, RX1, p), ribY(k, p) + (R5[i] - .5) * th, 0, sz, sz, r.rise ? mix3(K.paper, K.hot, .45 + .55 * rise) : r.col, a, 1);
    } else hide(o, i);
  }
};
// Use 3 · your own AI products: conversations and agent traces fan out from an assistant; three lanes light up
const AS = { x: 330, y: 650 }, LANES = 12, LANE_Y0 = 440, LANE_DY = 38, LANE_X1 = 1380;
const HOTL = [{ l: 2, n: 'the tasks that keep coming back', col: 'var(--ds)', c: K.ds }, { l: 6, n: 'where the agent fails', col: 'var(--llm)', c: K.llm }, { l: 10, n: 'the uses nobody planned', col: 'var(--hot)', c: K.hot }];
L.assistants = (t, o, c) => {
  const on = eo(seg(t, c[1] - .4, c[1] + 1.4)), hl = eo(seg(t, c[2], c[2] + 1)), calm = 1 - .35 * eo(seg(t, c[3], c[3] + 1));
  for (let i = 0; i < N; i++) {
    if (i < 700) { put(o, i, AS.x + G1[i] * 20, AS.y + G2[i] * 20, G3[i] * 20, 3, 3, K.paper, .7, 1); continue; }
    if (i > 7600) { hide(o, i); continue; }
    const l = i % LANES, u = (R1[i] + (t + AMB) * (.07 + .04 * R2[i])) % 1, ey = LANE_Y0 + l * LANE_DY;
    const x = lerp(AS.x + 30, LANE_X1, u), y = AS.y + (ey - AS.y) * Math.pow(u, .55) + (R3[i] - .5) * 10 * u;
    const bubble = R4[i] < .5, hot = HOTL.find(h => h.l === l);
    let a = (bubble ? .2 : .16) * on * clamp(u * 6) * clamp((1 - u) * 8) * calm, col = K.paper;
    if (hl > 0) { if (hot) { col = mix3(K.paper, hot.c, hl); a *= 1 + 1.4 * hl; } else a *= 1 - .7 * hl; }
    put(o, i, x, y, 0, bubble ? 13 : 3, bubble ? 6 : 3, col, a, bubble ? .3 : 1);
  }
};

/* ---------- the choreography: keyframes, camera, mood per sequence (times are cues of that sequence) ---------- */
const CAMD = { x: 960, y: 540, z: 0, yaw: 0, pitch: 0, roll: 0, zoom: 1, sx: 0, sy: 0, spin: 0 };
const MOODS = {
  uses: { bloom: .95, stars: .45, neb: .04, nebA: [.04, .10, .26], nebB: [.16, .05, .22], exp: 1, vig: .5, grain: .028, dof: 0 },
  space: { bloom: 1.15, stars: 1, neb: .075, nebA: [.06, .10, .30], nebB: [.22, .05, .28], exp: 1, vig: .55, grain: .03, dof: 0 },
  flood: { bloom: .9, stars: .5, neb: .03, nebA: [.06, .10, .30], nebB: [.10, .06, .22], exp: 1, vig: .5, grain: .03, dof: .0012 },
  data: { bloom: .72, stars: .2, neb: 0, nebA: [.05, .09, .2], nebB: [.1, .05, .2], exp: 1, vig: .42, grain: .025, dof: 0 },
  calm: { bloom: .9, stars: .4, neb: .03, nebA: [.05, .10, .24], nebB: [.12, .05, .22], exp: 1, vig: .5, grain: .028, dof: .001 },
  secna: { bloom: 1, stars: .35, neb: .04, nebA: [.03, .12, .24], nebB: [.18, .04, .18], exp: 1, vig: .5, grain: .028, dof: .0022 } };
const P1 = {   // Parts 1 and 3 (the night)
  title: { kf: [[0, 1.8, 'stars', .4]], cam: [[0, 0, { ...CAMD, zoom: 1.1 }], [0, 8, { zoom: 1.02, spin: .2 }]], mood: [[0, 0, 'space']] },
  pile: { kf: [[0, .01, 'flood']], cam: [[0, 3, { ...CAMD, yaw: 'snap', zoom: .94 }]], mood: [['c0', 4, 'flood']] },
  wall: { kf: [['c2', 1.4, 'tiles', .6, { arc: 300 }], ['c5+0.2', 1.6, 'wallGrow', .4, { arc: 160 }]], cam: [[0, 1.6, { ...CAMD }], ['c5+0.2', 2, { x: 970, y: 955, sx: -380, sy: 0, zoom: 1.95 }]], mood: [[0, 1.5, 'data']] },
  dead: { kf: [[0, 1.2, 'sample', .6], ['c2', .8, 'cards', .3], ['c4', 1, 'fieldLow', .3]], cam: [[0, 1.4, { ...CAMD }]], mood: [[0, 1, 'calm']] },
  clio: { kf: [[0, 2, 'galaxy', 1, { arc: 340 }], ['c4-0.4', .7, 'veil', .2]], cam: [[0, 14, { yaw: -6, pitch: 6 }], ['c3', 6, { yaw: -10, pitch: 4 }]], mood: [[0, 2.5, 'space']] },
  secna: { kf: [[0, 1.4, 'word', .8, { arc: 220 }], ['c2', 1, 'docs', .4], [scanS(S.secna.c)[0], .3, 'docsScan', 0], ['c3+0.3', 1.6, 'embed3d', 1, { arc: 120 }], ['c4', 1.4, 'cluster3d', .6], ['c5', .3, 'name3d', 0], ['c6+0.2', 1.4, 'agg', .5], ['c7', 1.3, 'tree', .4]],
    cam: [[0, 2, { ...CAMD, yaw: 'snap', pitch: 0 }], ['c3+0.3', 1.8, { x: 1200, y: 640, z: 0, sx: 240, sy: 100, spin: 1.3 }], ['c5', 1.6, { ...CAMD, yaw: 'snap' }]], mood: [[0, 1.5, 'secna']] },
  bill: { kf: [[0, .6, 'billWait', .3], ['c0+0.3', .6, 'billBar', { delay: BLDEL, arc: 90 }], ['c3', .01, 'billCut', 0]], mood: [[0, 1, 'data']] },
  curve: { kf: [[0, .9, 'curveFlow', .3]] },
  others: { kf: [[0, 1.2, 'cardsGal', .5]], mood: [[0, 1, 'calm']] },
  turn: { kf: [[0, 1.2, 'fieldLow', .5]], mood: [[0, 1, 'space']] },
  // Part 3
  factory: { kf: [[0, 1.6, 'factory', .6, { arc: 120 }]], cam: [[0, 2, { ...CAMD, yaw: 'snap' }], ['c2', 16, { yaw: -5 }], ['c4', 18, { yaw: 4 }], ['c7', 3, { yaw: 0 }]], mood: [[0, 1.5, 'uses']] },
  voices: { kf: [[0, 1.4, 'voices', .5]], cam: [[0, 1.5, { ...CAMD, yaw: 0 }]] },
  assistants: { kf: [[0, 1.4, 'assistants', .5]] },
  // the end: back to the sky of the title
  end: { kf: [[0, 1.6, 'stars', .5]], mood: [[0, 1.5, 'space']] },
};

/* keyframes: [cue, duration, layout, stagger | {opts}, {opts}] */
const maxOf = a => { let m = 0; for (let i = 0; i < a.length; i++) if (a[i] > m) m = a[i]; return m; };
const KF = [{ s: 0, d: .001, L: L.void, g: 0, o: 0, c: [], arc: 0, delay: null, end: 0 }];
const CAMK = [{ s: 0, d: 0, st: { ...CAMD } }], MOODK = [{ s: 0, d: 0, st: MOODS.space }];
for (const sid in P1) {
  const sq = S[sid], q = P1[sid];
  (q.kf || []).forEach(k => {
    let [at, d, name, g = 0, ex = {}] = k; if (typeof g === 'object') { ex = g; g = 0; }
    if (!L[name]) throw new Error('unknown layout ' + name);
    const s = cue(sid, at), delay = ex.delay || null;
    KF.push({ s, d: Math.max(d, .001), L: L[name], g, o: sq.off, c: sq.c, arc: ex.arc || 0, delay, end: s + Math.max(d, .001) + (delay ? maxOf(delay) : g) });
  });
  (q.cam || []).forEach(([at, d, st]) => CAMK.push({ s: cue(sid, at), d, raw: st }));
  (q.mood || []).forEach(([at, d, m]) => MOODK.push({ s: cue(sid, at), d, st: MOODS[m] }));
}
KF.sort((a, b) => a.s - b.s); CAMK.sort((a, b) => a.s - b.s); MOODK.sort((a, b) => a.s - b.s);
function evalKF(k, T, out, depth) {
  const cur = KF[k];
  if (k === 0 || T >= cur.end || depth > 3 || (cur.d <= .0011 && !cur.g && !cur.delay)) { cur.L(T - cur.o, out, cur.c); return; }
  const A = POOL[depth]; evalKF(k - 1, T, A, depth + 1);
  cur.L(T - cur.o, out, cur.c);
  const { s, d, g, arc, delay } = cur;
  for (let i = 0; i < N; i++) {
    let q = (T - s - (delay ? delay[i] : g * R1[i])) / d; q = q <= 0 ? 0 : q >= 1 ? 1 : eio(q);
    if (q >= 1) continue;
    out.x[i] = lerp(A.x[i], out.x[i], q); out.y[i] = lerp(A.y[i], out.y[i], q); out.z[i] = lerp(A.z[i], out.z[i], q) + (arc ? Math.sin(Math.PI * q) * arc * (.35 + R2[i]) : 0);
    out.w[i] = lerp(A.w[i], out.w[i], q); out.h[i] = lerp(A.h[i], out.h[i], q); out.s[i] = lerp(A.s[i], out.s[i], q);
    out.r[i] = lerp(A.r[i], out.r[i], q); out.g[i] = lerp(A.g[i], out.g[i], q); out.b[i] = lerp(A.b[i], out.b[i], q); out.a[i] = lerp(A.a[i], out.a[i], q);
  }
}
function particlesAt(T) { let k = 0; for (let j = 1; j < KF.length; j++) if (KF[j].s <= T) k = j; evalKF(k, T, OUT, 0); }
for (let k = 1; k < CAMK.length; k++) {
  const p = CAMK[k - 1], dt = CAMK[k].s - p.s, yawNow = p.st.yaw + p.st.spin * dt;
  const st = Object.assign({}, p.st, { yaw: yawNow }, CAMK[k].raw);
  if (CAMK[k].raw.yaw === 'snap') st.yaw = Math.round(yawNow / 360) * 360;
  CAMK[k].st = st;
}
const CAMKEYS = ['x', 'y', 'z', 'yaw', 'pitch', 'roll', 'zoom', 'sx', 'sy'];
const camState = (k, T) => { const st = CAMK[k].st, dt = Math.max(0, T - CAMK[k].s); return Object.assign({}, st, { yaw: st.yaw + st.spin * dt + st.spin * 6 * Math.sin(AMB * .12) }); };
function camAt(T) {
  let k = 0; for (let j = 1; j < CAMK.length; j++) if (CAMK[j].s <= T) k = j;
  const B = camState(k, T); if (k === 0) return B;
  const q = CAMK[k].d > 0 ? eio(seg(T, CAMK[k].s, CAMK[k].s + CAMK[k].d)) : 1;
  if (q >= 1) return B;
  const A = camState(k - 1, T), o = {};
  CAMKEYS.forEach(key => { o[key] = lerp(A[key], B[key], q); });
  return o;
}
function moodAt(T) {
  let k = 0; for (let j = 1; j < MOODK.length; j++) if (MOODK[j].s <= T) k = j;
  const B = MOODK[k].st; if (k === 0) return B;
  const q = MOODK[k].d > 0 ? eio(seg(T, MOODK[k].s, MOODK[k].s + MOODK[k].d)) : 1; if (q >= 1) return B;
  const A = MOODK[k - 1].st, o = {};
  for (const key in B) o[key] = Array.isArray(B[key]) ? B[key].map((v, j) => lerp(A[key][j], v, q)) : lerp(A[key], B[key], q);
  return o;
}

/* ═════════════ text on screen: items, effects, anchors ═════════════ */
// generated labels: the illustrative clusters and their themes (the recipe)
CL.forEach((c, k) => $('clLabs').insertAdjacentHTML('beforeend', `<div class="lab" id="lab${k}" style="position:absolute;opacity:0;color:${c.col}"><span>${c.name}</span></div>`));
THEMES3.forEach((th, k) => $('thLabs').insertAdjacentHTML('beforeend', `<div class="it" style="left:${th.x}px;top:450px;transform:translate(-50%,-50%);font:500 34px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:${th.col}" data-in="c6+${(.8 + k * .2).toFixed(1)}" data-out="c7+0.3" data-fx="fade">${th.n}</div>`));
{ const T3 = $('treeLabs'), add = h => T3.insertAdjacentHTML('beforeend', h), tag = s => `<span style="font:500 18px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin-left:18px">${s}</span>`;
  THEMES3.forEach((th, k) => { const d = (.7 + k * .5).toFixed(2);
    add(`<div class="it" style="left:${TREE.x}px;top:${th.ty - 24}px;font:800 44px/1 var(--sans);letter-spacing:-.02em;color:${th.col}" data-in="c7+${d}" data-fx="left">${th.n}${k === 0 ? tag('theme') : ''}</div>`);
    add(`<div class="it" style="left:${TREE.x + 18}px;top:${th.ty + 30}px;width:2px;height:${th.tyEnd - th.ty - 30}px;background:rgba(255,255,255,.2)" data-in="c7+${d}" data-fx="fade"></div>`); });
  CL.forEach((c, j) => { const d = (.9 + c.th * .5 + .1 * j).toFixed(2);
    add(`<div class="it" style="left:${TREE.x + 18}px;top:${c.ty - 1}px;width:16px;height:2px;background:rgba(255,255,255,.2)" data-in="c7+${d}" data-fx="fade"></div>`);
    add(`<div class="it" style="left:${TREE.dot + 30}px;top:${c.ty - 18}px;font:600 34px/1 var(--sans);letter-spacing:-.01em;color:#E6E8EE" data-in="c7+${d}" data-fx="left">${c.name}${j === 0 ? tag('cluster') : ''}</div>`); });
  add(`<div class="it" style="left:${TREE.dot + 30}px;top:${TREE.ex - 17}px;font:italic 500 30px/1 var(--sans);color:var(--llm2)" data-in="c7+1.3" data-fx="left"><span style="color:var(--dim);font-style:normal">↳</span> “the parcel never arrived”${tag('example')}</div>`); }
AG.forEach((A, k) => $('agentLabs').insertAdjacentHTML('beforeend', `<div class="it lab" style="color:var(--llm)" data-in="c1+${(k * .18 + .2).toFixed(2)}" data-out="c7" data-fx="fade" data-ax="${A.x}" data-ay="${A.y - 52}"><span>${A.n}</span></div>`));
SRC.forEach((s, k) => $('srcLabs').insertAdjacentHTML('beforeend', `<div class="it" style="font:600 30px/1 var(--sans);color:var(--soft)" data-in="c0+${(.3 + k * .2).toFixed(2)}" data-fx="fade" data-ax="${s.x}" data-ay="${s.y}">${s.n}</div>`));
RIB.forEach((r, k) => $('ribLabs').insertAdjacentHTML('beforeend', `<div class="it" style="left:${RX1 + 22}px;top:${ribY(k, 1) - (r.rise ? 35 : 17)}px;${r.rise ? 'white-space:normal;width:300px;' : ''}font:${r.rise ? 700 : 500} ${r.rise ? 32 : 26}px/1.1 var(--sans);color:${r.rise ? 'var(--hot)' : 'var(--soft)'}" data-in="${r.rise ? 'c3+0.5' : 'c1+1.4'}" data-fx="fade">${r.n}${r.rise ? ' ↑' : ''}</div>`));
HOTL.forEach((h, k) => $('laneLabs').insertAdjacentHTML('beforeend', `<div class="it s" style="left:${LANE_X1 + 26}px;top:${LANE_Y0 + h.l * LANE_DY - 21}px;font-weight:650;color:${h.col}" data-in="c2+${(k * .3 + .2).toFixed(1)}" data-fx="fade">${h.n}</div>`));
$('laneLabs').insertAdjacentHTML('beforeend', `<div class="it" style="left:${AS.x - 120}px;top:${AS.y + 46}px;width:240px;text-align:center;font:500 24px/1 var(--mono);color:var(--soft)" data-in="c0+0.4" data-fx="fade">your assistant</div>`);
document.querySelectorAll('[data-qr]').forEach(e => e.appendChild(document.getElementById('qrT').content.firstElementChild.cloneNode(true)));

function splitWords(el) {
  const walk = n => { [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) { const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
        else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); } });
      c.replaceWith(frag); }
    else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c); }); };
  walk(el); return [...el.querySelectorAll('.w')];
}
const ITEMS = [...document.querySelectorAll('.dom .it')].filter(e => e.dataset.in !== undefined).map(e => {
  const sid = e.closest('[data-s]').dataset.s, sq = S[sid];
  if (!sq) throw new Error('no sequence ' + sid);
  const tin = sq.off + local(sq, e.dataset.in);
  const tout = e.dataset.out === undefined ? sq.off + sq.dur + .3 : sq.off + local(sq, e.dataset.out);
  const fx = e.dataset.fx || 'up';
  const it = { e, sid, tin, tout, fx, vis: false, last: {}, base: e.style.transform || '' };
  if (fx === 'words') it.parts = splitWords(e);
  if (e.dataset.ax !== undefined) it.anchor = { x: +e.dataset.ax, y: +e.dataset.ay, z: +(e.dataset.az || 0) };
  it.scaled = e.dataset.scale !== undefined;
  return it;
});
const BYID = {}; ITEMS.forEach(it => { if (it.e.id) BYID[it.e.id] = it; });
const COUNTERS = [...document.querySelectorAll('[data-count]')].map(e => { const a = e.dataset.count.split(','), sid = e.closest('[data-s]').dataset.s, sq = S[sid];
  return { e, from: +a[0], to: +a[1], t0: sq.off + local(sq, a[2]), t1: sq.off + local(sq, a[3]), fmt: a[4], last: '' }; });
const STRIKES = [...document.querySelectorAll('[data-strike]')].map(e => { const sq = S[e.closest('[data-s]').dataset.s]; return { e, t: sq.off + local(sq, e.dataset.strike), last: '' }; });
const fmtInt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function setStyle(it, key, val) { if (it.last[key] !== val) { it.e.style[key] = val; it.last[key] = val; } }
function applyFx(it, T) {
  const { tin, tout, fx } = it;
  if (T < tin || T > tout) { if (it.vis) { setStyle(it, 'opacity', '0'); it.vis = false; } return; }
  it.vis = true;
  const po = seg(T, tout - .3, tout);
  let op = 1, tr = '', bl = 0;
  switch (fx) {
    case 'up': { const q = eo(seg(T, tin, tin + .55)); op = q; tr = `translateY(${((1 - q) * 30).toFixed(1)}px)`; bl = (1 - q) * 5; break; }
    case 'left': { const q = eo(seg(T, tin, tin + .55)); op = q; tr = `translateX(${((1 - q) * -50).toFixed(1)}px)`; bl = (1 - q) * 5; break; }
    case 'slam': { const q = eback(seg(T, tin, tin + .5)); op = seg(T, tin, tin + .12); tr = `scale(${lerp(1.22, 1, q).toFixed(4)})`; bl = (1 - seg(T, tin, tin + .3)) * 8; break; }
    case 'focus': { const q = eo(seg(T, tin, tin + .8)); op = q; tr = `scale(${lerp(1.04, 1, q).toFixed(4)})`; bl = (1 - q) * 14; break; }
    case 'scale': { const q = eback(seg(T, tin, tin + .6)); op = seg(T, tin, tin + .2); tr = `scale(${lerp(.3, 1, q).toFixed(4)})`; break; }
    case 'fade': op = eo(seg(T, tin, tin + .5)); break;
    case 'words': it.parts.forEach((w, k) => { const q = eo(seg(T, tin + k * .06, tin + k * .06 + .55));
      const o = q.toFixed(3); if (w._o !== o) { w._o = o; w.style.opacity = o; w.style.transform = q < 1 ? `translateY(${((1 - q) * .28).toFixed(3)}em)` : ''; w.style.filter = q < 1 ? `blur(${((1 - q) * 7).toFixed(2)}px)` : ''; } }); break;
  }
  if (po > 0) { op *= 1 - po; bl += po * 6; tr += ` translateY(${(-po * 12).toFixed(1)}px)`; }
  setStyle(it, 'opacity', op.toFixed(3));
  if (!it.anchor) setStyle(it, 'transform', (it.base + ' ' + tr).trim());
  setStyle(it, 'filter', bl > .05 ? `blur(${bl.toFixed(2)}px)` : '');
}
let CAM = null;
const PP = { x: 0, y: 0, d: 0, s: 1 };
function anchor(it) {
  const a = it.anchor; if (!a || !it.vis || !CAM) return; CAM.project(a.x, a.y, a.z, PP);
  setStyle(it, 'left', PP.x.toFixed(1) + 'px'); setStyle(it, 'top', PP.y.toFixed(1) + 'px');
  setStyle(it, 'transform', `translate(-50%,-50%)${it.scaled ? ` scale(${PP.s.toFixed(4)})` : ''}`);
}
function place(el, x, y, z, op, tf) { CAM.project(x, y, z, PP); el.style.left = PP.x.toFixed(1) + 'px'; el.style.top = PP.y.toFixed(1) + 'px'; el.style.opacity = op.toFixed(3); if (tf !== undefined) el.style.transform = tf; }

/* Part 1 hooks: the rail, the review being read, the pair, the cluster names */
const RAILC = ['var(--ds)', 'var(--ds)', 'var(--ds)', 'var(--llm)', 'var(--llm)'];
const RAILG = ['rgba(79,209,255,.5)', 'rgba(79,209,255,.5)', 'rgba(79,209,255,.5)', 'rgba(255,61,127,.55)', 'rgba(255,61,127,.55)'];
const REVIEW = $('review'), REVIEW_B = [...REVIEW.querySelectorAll('b')];
function hooksNight(T) {
  const s = S.secna, t = lt(T, 'secna');
  { let act = -1; for (let k = 0; k < 5; k++) if (t >= s.c[2 + k] && (k === 4 ? t < s.c[7] : t < s.c[3 + k])) act = k;
    const all = t >= s.c[7];
    for (let k = 0; k < 5; k++) { const on = k === act || all, el = $('r' + k);
      if (el._on !== on) { el._on = on; el.classList.toggle('on', on); el.style.color = on ? RAILC[k] : ''; el.style.textShadow = on ? `0 0 40px ${RAILG[k]}` : ''; } } }
  { const h = seg(t, s.c[2] + 1.4, s.c[2] + 2); REVIEW.style.color = `rgba(195,199,209,${(1 - .72 * h).toFixed(3)})`;
    REVIEW_B.forEach(b => { b.style.color = h > 0 ? `rgba(255,${Math.round(lerp(199, 61, h))},${Math.round(lerp(209, 127, h))},1)` : ''; }); }
  [['pairA1', PA1, -1], ['pairA2', PA2, 1]].forEach(([id, i, sg]) => { const it = BYID[id]; if (it) it.anchor = { x: OUT.x[i] + sg * 10, y: OUT.y[i] + (sg < 0 ? 34 : 92), z: OUT.z[i] }; });
  { const tn = t - s.c[5], ta = t - s.c[6], tm = t - s.dur;
    CL.forEach((c, k) => { const el = $('lab' + k), ti = .4 + k * .22;
      if (tn < ti || tm > .5) { if (el.style.opacity !== '0') el.style.opacity = '0'; return; }
      const qa = eio(seg(ta, .2, 1.6)), pi = eo(seg(tn, ti, ti + .45));
      place(el, lerp(c.x, c.ax + 62, qa), lerp(c.y - 50, c.ay, qa), lerp(c.z, 0, qa), pi * (1 - seg(tm, 0, .5)) * (1 - seg(t, s.c[7] - .1, s.c[7] + .3)),
        `translate(${lerp(-50, 0, qa).toFixed(1)}%,-50%) scale(${lerp(.6, 1, eback(pi)).toFixed(3)})`); }); }
  STRIKES.forEach(st => { const v = (eo(seg(T, st.t, st.t + .45)) * 100).toFixed(1) + '% 8px'; if (st.last !== v) { st.last = v; st.e.style.backgroundSize = v; } });
}

/* light lines: the pair (E), the S scan */
const NLMAX = 400, LINES = new Float32Array(NLMAX * SGL.STRIDE_L); let NL = 0;
function line(ax, ay, az, bx, by, bz, c, a, w) {
  if (NL >= NLMAX || a <= .002) return; const o = NL++ * SGL.STRIDE_L;
  LINES[o] = ax; LINES[o + 1] = ay; LINES[o + 2] = az; LINES[o + 3] = bx; LINES[o + 4] = by; LINES[o + 5] = bz;
  LINES[o + 6] = c[0]; LINES[o + 7] = c[1]; LINES[o + 8] = c[2]; LINES[o + 9] = a; LINES[o + 10] = w;
}
function buildLines(T) {
  NL = 0;
  const s = S.secna, t = lt(T, 'secna');
  if (t > s.c[3] + 2 && t < s.c[4] + .4) line(OUT.x[PA1], OUT.y[PA1], OUT.z[PA1], OUT.x[PA2], OUT.y[PA2], OUT.z[PA2], K.ds, seg(t, s.c[3] + 2, s.c[3] + 2.6) * (1 - seg(t, s.c[4], s.c[4] + .4)), 2.2);
  { const [a, b] = scanS(s.c); if (t > a && t < b) { const x = lerp(600, 2000, eio(seg(t, a, b))); line(x, 600, 0, x, 940, 0, K.llm, 1, 3); } }
}
const NS = 6000, NT = N + NS, ST = SGL.STRIDE_P;
const PART = new Float32Array(NT * ST);
{ const r = rng(5);
  for (let j = 0; j < NS; j++) { const u = r() * 2 - 1, ph = r() * TAU, rr = 4200 + r() * 4200, s = Math.sqrt(1 - u * u), o = (N + j) * ST, c = r();
    PART[o] = 960 + rr * s * Math.cos(ph); PART[o + 1] = 540 + rr * u * .8; PART[o + 2] = rr * s * Math.sin(ph) - 1800;
    PART[o + 3] = PART[o + 4] = 6 + r() * 9; const col = c < .06 ? K.cool : (c > .97 ? K.warm : K.paper);
    PART[o + 5] = col[0]; PART[o + 6] = col[1]; PART[o + 7] = col[2]; PART[o + 8] = .25 + r() * .55; PART[o + 9] = 2; } }
const STARA = new Float32Array(NS), STX = new Float32Array(NS), STZ = new Float32Array(NS); for (let j = 0; j < NS; j++) { const o = (N + j) * ST; STARA[j] = PART[o + 8]; STX[j] = PART[o] - 960; STZ[j] = PART[o + 2] + 1800; }
function packFrame(T, mood) {
  for (let i = 0; i < N; i++) { const o = i * ST; PART[o] = OUT.x[i]; PART[o + 1] = OUT.y[i]; PART[o + 2] = OUT.z[i]; PART[o + 3] = OUT.w[i]; PART[o + 4] = OUT.h[i];
    PART[o + 5] = OUT.r[i]; PART[o + 6] = OUT.g[i]; PART[o + 7] = OUT.b[i]; PART[o + 8] = OUT.a[i]; PART[o + 9] = OUT.s[i]; }
  const a = T + AMB, ca = Math.cos(a * .004), sa = Math.sin(a * .004);
  for (let j = 0; j < NS; j++) { const o = (N + j) * ST, sp = Math.pow(Math.max(0, Math.sin(a * (.3 + (j % 11) * .06) + j * 1.7)), 12);
    PART[o] = 960 + STX[j] * ca - STZ[j] * sa; PART[o + 2] = STX[j] * sa + STZ[j] * ca - 1800;
    PART[o + 8] = STARA[j] * mood.stars * (.68 + .32 * Math.sin(a * (1.1 + (j % 7) * .21) + j) + .8 * sp); }
}

/* ═════════════ the three layers and the two cuts ═════════════ */
const night = $('night'), nbL = $('nb'), canvas = $('gl'), stage = $('stage');
let G = null;
try { G = SGL.create(canvas); } catch (err) { $('fail').style.display = 'block'; $('fail').textContent = 'WebGL2 unavailable: ' + err.message; }
SNB.build(nbL);
SNB.resolve((sid, at) => cue(sid, at));
const BG0 = [.036, .045, .078], BG1 = [.006, .008, .016];
const tOut = cue('nb12', 'c1');   // the notebook recedes into the night
const sty = (e, k, v) => { if (e.style[k] !== v) e.style[k] = v; };
const nightOn = T => T < P2 || T >= tOut - .1;
function layers(T) {
  // Part 1 → 2: a hard cut to the notebook. Part 2 → 3: the notebook shrinks into the night.
  sty(night, 'display', nightOn(T) ? '' : 'none');
  const nbOn = T >= P2 && T < tOut + 1.6;
  sty(nbL, 'display', nbOn ? '' : 'none');
  if (nbOn) {
    const q = eio(seg(T, tOut, tOut + 1.5));
    sty(nbL, 'transformOrigin', '50% 50%');
    sty(nbL, 'transform', q > 0 ? `scale(${lerp(1, .05, q).toFixed(4)})` : '');
    sty(nbL, 'opacity', (1 - seg(T, tOut + .7, tOut + 1.5)).toFixed(3));
    sty(nbL, 'boxShadow', q > 0 ? `0 0 ${(160 * q).toFixed(0)}px rgba(79,209,255,${(.45 * q).toFixed(3)})` : '');
    sty(nbL, 'zIndex', '3');
  }
}

/* ═════════════ render ═════════════ */
let T = 0;
const SWAY = { title: 1, clio: 1, others: .6, turn: 1, end: 1, factory: .5 };
function render(t) {
  if (typeof t !== 'number' || !isFinite(t)) t = T;   // never jump to 0 on a missing time
  T = clamp(t, 0, DUR);
  const sq = seqAt(T);
  layers(T);
  if (nightOn(T)) {
    const cs = camAt(T); if (SWAY[sq.id]) { cs.yaw += 1.6 * SWAY[sq.id] * Math.sin(AMB * .21); cs.pitch += .9 * SWAY[sq.id] * Math.sin(AMB * .17); } CAM = SGL.camera(cs); CAM.zoom = cs.zoom;
    particlesAt(T);
    if (G) { const mood = moodAt(T); buildLines(T); packFrame(T, mood);
      G.draw({ cam: CAM, parts: PART, np: NT, lines: LINES, nl: NL, add: 1, bloom: mood.bloom, exposure: mood.exp, vig: mood.vig, grain: mood.grain,
        focus: SGL.D * cs.zoom, dof: mood.dof, time: T + AMB, neb: mood.neb, nebA: mood.nebA, nebB: mood.nebB, bg0: BG0, bg1: BG1, par: [cs.yaw / 360 * .8, cs.pitch / 90 * .4] }); }
    if (T < P2) hooksNight(T);
  }
  if (T >= P2 - .1 && T < tOut + 1.6) { SNB.setSeq(sq.id); SNB.render(T); }
  for (const it of ITEMS) { applyFx(it, T); anchor(it); }
  for (const c of COUNTERS) { const v = lerp(c.from, c.to, eo(seg(T, c.t0, c.t1))), s = c.fmt === 'money' ? v.toFixed(2) : fmtInt(v); if (s !== c.last) { c.e.textContent = s; c.last = s; } }
  $('nb').querySelector('#jlCount').classList.toggle('beat', T >= cue('nb0', 'c2') && T < cue('nb0', 'end'));
  ui(T, sq);
}

/* ═════════════ progress bar, review panel ═════════════ */
const track = $('track'), partEls = [], tickEls = [];
PARTS.forEach(p => {
  const ss = SEQ.filter(s => s.part === p.n), a = ss[0].off, b = ss[ss.length - 1].off + ss[ss.length - 1].dur;
  const d = document.createElement('div'); d.className = 'pt p' + p.n; d.style.left = (a / DUR * 100) + '%'; d.style.width = `calc(${((b - a) / DUR * 100)}% - 4px)`;
  d.innerHTML = '<i></i>'; track.appendChild(d);
  const l = document.createElement('div'); l.className = 'pl'; l.style.left = (a / DUR * 100) + '%'; l.textContent = ['I', 'II', 'III'][p.n - 1] + ' · ' + p.title; track.appendChild(l);
  partEls.push({ p, a, b, fill: d.firstChild, lab: l });
});
SEQ.forEach(s => { const d = document.createElement('div'); d.className = 'tk'; d.style.left = (s.off / DUR * 100) + '%'; track.appendChild(d); tickEls.push(d); });
track.addEventListener('click', e => { e.stopPropagation(); const r = track.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * DUR;
  let best = SEQ[0]; for (const s of SEQ) if (Math.abs(s.off - x) < Math.abs(best.off - x)) best = s; go(best.off); });
const fmt = s => { s = Math.max(0, Math.round(s)); return (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); };
let panelSeq = null, panelLine = -2;
const pLines = $('pLines');
function ui(T, sq) {
  partEls.forEach(pe => { pe.fill.style.width = (clamp((T - pe.a) / (pe.b - pe.a)) * 100) + '%'; pe.lab.classList.toggle('on', T >= pe.a && T < pe.b + 1e-6); });
  $('clock').textContent = `${fmt(T)} / ${fmt(DUR)}`;
  setT(hudN, typing() ? '→ ' + typed : String(pauseNo(T))); setT(hudS, playing ? '▶' : '❚❚');
  setT($('playB'), reh || playing ? '❚❚ Stop' : '▶ Play'); setT($('snd'), voiceOpt ? 'Voice on' : 'Voice off'); $('snd').classList.toggle('on', voiceOpt);
  setT($('bedB'), bedOpt ? 'Ambience on' : 'Ambience off'); $('bedB').classList.toggle('on', bedOpt);
  setT($('langB'), lang === 'en' ? 'EN' : 'FR');
  $('modeL').textContent = reh ? `● with the voice · clip ${rehN}${rehNote}` : playing ? (stopAt !== null ? '▶ to the next pause' : '▶ playing on, no pauses') : '❚❚ held';
  if (!document.body.classList.contains('review')) return;
  if (panelSeq !== sq) {
    panelSeq = sq; panelLine = -2;
    $('pPart').textContent = `Part ${sq.part} · ${PARTS[sq.part - 1].title} · ${sq.k + 1}/${SEQ.length} · ${sq.id}`;
    $('pTitle').textContent = sq.title;
    $('pNotes').textContent = sq.notes.join(' ');
    pLines.innerHTML = sq.lines.map((l, k) => `<div class="ln" data-k="${k}"><i>${fmt(sq.off + l.t)}${pauseTag(sq.id, k)}</i><span>${l.text}</span></div>`).join('');
    [...pLines.children].forEach((e, k) => e.addEventListener('click', ev => { ev.stopPropagation(); go(sq.off + sq.lines[k].t); }));
    const nx = SEQ[sq.k + 1];
    $('pFoot').innerHTML = `<b>${fmt(sq.dur)}</b> this sequence · part ${sq.part}: <b>${fmt(partEls[sq.part - 1].b - partEls[sq.part - 1].a)}</b> · total <b>${fmt(DUR)}</b>` + (nx ? `<br>next · ${nx.title}` : '');
  }
  const tl = T - sq.off; let k = -1; sq.lines.forEach((l, j) => { if (tl >= l.t - .05) k = j; });
  if (k !== panelLine) { panelLine = k; [...pLines.children].forEach((e, j) => { e.classList.toggle('now', j === k); e.classList.toggle('past', j < k); });
    const cur = pLines.children[k]; if (cur) cur.scrollIntoView({ block: 'nearest' }); }
  $('pTime').textContent = `${fmt(T)} / ${fmt(DUR)} · sequence ${fmt(tl)} / ${fmt(sq.dur)}`;
}

/* ═════════════ the pauses: the steps marked "click" in steps.js ═════════════ */
// A pause sits just before the next step's changes, the ones that start ahead of their cue included
// (DOM items fade out .3 s early, two scenes start up to .4 s early, the notebook moves up to .6 s early).
const LEAD = .45, STOPS = [];
SEQ.forEach(s => {
  const early = (SNB.PLAN[s.id] || []).map(([at]) => String(at).replace(/\s+/g, '').match(/^(?:c(\d+)|end)-([\d.]+)$/)).filter(Boolean)
    .map(m => { const base = m[1] !== undefined ? s.c[+m[1]] : s.dur; return { base, t: base - parseFloat(m[2]) }; });
  const before = b => { let t = b - LEAD; early.forEach(e => { if (Math.abs(e.base - b) < 1e-6) t = Math.min(t, e.t - .05); }); return t; };
  s.lines.forEach((l, k) => { if (l.click) STOPS.push({ t: s.off + before(k + 1 < s.c.length ? s.c[k + 1] : s.dur), sid: s.id, line: k }); });
});
STOPS.sort((a, b) => a.t - b.t); STOPS.forEach((p, i) => { p.n = i + 1; });
const pauseNo = t => { let n = 0; for (const p of STOPS) { if (p.t < t - 1e-3) n++; else break; } return Math.min(STOPS.length, n + 1); };
const nextStop = t => { for (const p of STOPS) if (p.t > t + .02) return p.t; return DUR; };
const prevStop = t => { let r = 0; for (const p of STOPS) { if (p.t < t - .02) r = p.t; else break; } return r; };
const LSTOP = {}; STOPS.forEach(p => { const m = LSTOP[p.sid] = LSTOP[p.sid] || {}; (m[p.line] = m[p.line] || []).push(p.n); });
const pauseTag = (sid, k) => { const a = (LSTOP[sid] || {})[k]; return a ? `<br>⏸ ${a[0]}${a.length > 1 ? '–' + a[a.length - 1] : ''}` : ''; };
const hudN = $('pauseN'), hudS = $('pauseS'); $('pauseT').textContent = '/' + STOPS.length;
const setT = (e, s) => { if (e._t !== s) { e._t = s; e.textContent = s; } };

/* ═════════════ the clock: live pauses, the narration, silence ═════════════ */
let playing = false, stopAt = null, voiceOn = false, silent = false, lastNow = null, started = null;
const AUD = [new Audio(), new Audio()]; AUD.forEach(a => { a.preload = 'auto'; });
let aIdx = 0, aSeq = null;
function audioFor(sq, t0) {
  if (!voiceOn || !sq.audio) return false;
  const a = AUD[aIdx];
  if (aSeq !== sq || !a.src.endsWith(sq.audio)) { a.src = sq.audio; }
  aSeq = sq;
  try { a.currentTime = Math.max(0, t0); } catch (e) { /* not loaded yet */ }
  const p = a.play(); if (p && p.catch) p.catch(() => { silent = true; });
  const nx = SEQ[sq.k + 1]; if (nx && nx.audio) { const b = AUD[1 - aIdx]; if (!b.src.endsWith(nx.audio)) b.src = nx.audio; }
  return true;
}
function stopAudio() { AUD.forEach(a => { try { a.pause(); } catch (e) { /* ignore */ } }); }
function play(until) {
  if (started === null) started = Date.now();
  playing = true; stopAt = until; silent = false; lastNow = null; SNB.resetManual();
  if (T >= DUR - .01) { playing = false; return; }
  if (!audioFor(seqAt(T + 1e-4), T + 1e-4 - seqAt(T + 1e-4).off)) silent = true;
}
function pause() { playing = false; stopAt = null; stopAudio(); render(T); }
function go(t) { const was = playing, until = stopAt; pause(); SNB.resetManual(); render(t); if (was) play(until); }
let kick = -1, lastAmb = null;
function loop(now) {
  const da = lastAmb === null ? 0 : Math.min(.1, (now - lastAmb) / 1000); lastAmb = now;
  bedTick(da);
  if (AMBIENT) {
    if (kick >= 0) { kick += da; const u = kick / 1.6; if (u >= 1) kick = -1; else if (seqAt(T).id === 'clio') GAL += da * 3 * Math.sin(Math.PI * u) ** 2; }   // the click on Clio: the galaxy spins up, then settles
    if (!playing && nightOn(T)) { AMB += da; render(T); }
  }
  if (playing) {
    const sq = seqAt(T + 1e-4), a = AUD[aIdx];
    if (!silent && voiceOn && aSeq === sq && !a.paused && a.readyState >= 2) {
      T = sq.off + a.currentTime;
      if (a.ended || a.currentTime >= sq.dur - .02) { T = sq.off + sq.dur; const nx = SEQ[sq.k + 1];
        if (nx && (stopAt === null || stopAt > T + .01)) { aIdx = 1 - aIdx; audioFor(nx, 0); } }
    } else if (silent || !voiceOn) {
      if (lastNow !== null) T += Math.min(.1, (now - lastNow) / 1000);
    } else if (a.ended) { T = sq.off + sq.dur; aIdx = 1 - aIdx; const nx = SEQ[sq.k + 1]; if (nx) audioFor(nx, 0); else playing = false; }
    lastNow = now;
    if (stopAt !== null && T >= stopAt - 1e-3) { T = stopAt; pause(); }
    else if (T >= DUR) { T = DUR; pause(); }
    else render(T);
  }
  requestAnimationFrame(loop);
}
function next() {   // live: play to the next pause, then hold
  if (playing) {   // a click while it plays: the step ends at once, and holds; never runs on to the next one
    const s = stopAt !== null ? stopAt : nextStop(T); pause(); render(s); return;
  }
  if (T < DUR - .01) { kick = 0; play(nextStop(T)); }
}
function back() { pause(); render(prevStop(T)); }
function goPause(n) { pause(); SNB.resetManual(); render(STOPS[clamp(Math.round(n) || 1, 1, STOPS.length) - 1].t); }
/* The player (the Play button, or space): everything in one go, no pause to click through.
 * Voice on (the Voice button, or v): the recorded voice is laid over the talk, one clip per pause, played as
 * recorded (the takes are at their final speed). Clip n starts as the page leaves pause n-1; the screen plays to
 * pause n and holds while the voice finishes; then the next clip starts. → ← change clip, space or Esc stops.
 * Voice off: the animation plays straight through. Clips: embedded by the single-file build (SECNA_VOICES, one
 * list per language; SECNA_VOICE, French only), or read from voice/out/: video_fr/ in French,
 * video_en/ in English (seg_NN.wav). The language (the FR / EN button, or l) changes the clip, not the screen. */
const VOICE_RATE = 1, VOICE = window.SECNA_VOICES || (window.SECNA_VOICE ? { fr: window.SECNA_VOICE } : null);
let voiceOpt = false, lang = 'en';   // the voice's language: English by default
let reh = false, rehN = 0, rehAudio = null, rehTimer = null, rehNote = '';
function rehQuiet() { clearTimeout(rehTimer); if (rehAudio) { try { rehAudio.pause(); } catch (e) { /* ignore */ } rehAudio = null; } }
function rehStop() { rehQuiet(); reh = false; rehNote = ''; pause(); }
function rehStart(n) {
  n = clamp(Math.round(n), 1, STOPS.length); rehQuiet(); reh = true; rehN = n; rehNote = '';
  pause(); SNB.resetManual(); render(n > 1 ? STOPS[n - 2].t : 0);
  const a = rehAudio = new Audio(VOICE ? (VOICE[lang] || VOICE.fr)[n] : (lang === 'en' ? REH_EN : REH_BASE) + 'seg_' + String(n).padStart(2, '0') + '.wav');
  a.preservesPitch = true; a.defaultPlaybackRate = VOICE_RATE; a.playbackRate = VOICE_RATE;
  const miss = () => { if (rehAudio === a) { rehNote = ' · no audio: → to go on'; render(T); } };
  a.addEventListener('ended', () => { if (rehAudio !== a) return; rehTimer = setTimeout(() => { if (!reh) return; if (n < STOPS.length) rehStart(n + 1); else rehStop(); }, 600); });
  a.addEventListener('error', miss);
  const p = a.play(); if (p && p.catch) p.catch(miss);
  kick = 0; play(STOPS[n - 1].t);
}
/* The ambience (the Ambience button, or a): a bed on its own track, under the voice, for as long as the player
 * runs (the holds and the gaps between clips included); never in the live talk, clicked through by hand. It is
 * not synchronised with the page: it loops, fading in on Play and out on Stop. Embedded by the single-file build
 * (SECNA_BED), or read from voice/out/night/chimes.wav (a seamless 3-minute loop, −34 LUFS, about
 * 15 dB under the voice: the two play at their own level, no ducking). */
const BED = window.SECNA_BED || null, BED_FADE = 2.5;
let bedOpt = false, bedLvl = 0, bedNode = null, bedEl = null, bedGain = null, bedCtx = null, bedTried = false;
function bedLoad() {   // called on a click or a key: browsers start sound only after one
  if (bedCtx && bedCtx.state === 'suspended') bedCtx.resume();
  if (bedTried) return; bedTried = true;
  const src = BED || BED_BASE, el = () => { bedEl = new Audio(src); bedEl.loop = true; bedEl.volume = 0; };
  if (location.protocol === 'file:' && !src.startsWith('data:')) { el(); return; }   // file:// cannot fetch: <audio loop>
  try {   // Web Audio loops sample-exact
    bedCtx = new (window.AudioContext || window.webkitAudioContext)(); bedGain = bedCtx.createGain(); bedGain.gain.value = 0; bedGain.connect(bedCtx.destination);
    fetch(src).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(b => bedCtx.decodeAudioData(b))
      .then(buf => { const n = bedCtx.createBufferSource(); n.buffer = buf; n.loop = true; n.connect(bedGain); n.start(); bedNode = n; }).catch(el);
  } catch (e) { el(); }
}
function bedTick(da) {
  const want = bedOpt && (reh || (playing && stopAt === null)) ? 1 : 0;
  bedLvl = want > bedLvl ? Math.min(1, bedLvl + da / BED_FADE) : Math.max(want, bedLvl - da / BED_FADE);
  const g = bedLvl * bedLvl;
  if (bedNode) { if (bedLvl > 0 && bedCtx.state === 'suspended') bedCtx.resume(); bedGain.gain.value = g; }
  else if (bedEl) { bedEl.volume = g; if (bedLvl > 0 && bedEl.paused) bedEl.play().catch(() => {}); else if (!bedLvl && !bedEl.paused) bedEl.pause(); }
}
function setBed(on) { bedOpt = on; if (on) bedLoad(); render(T); }
let typed = '', typedAt = 0, typedTimer = null;   // a pause number typed, then Enter
const typing = () => typed !== '' && Date.now() - typedAt < 4000;

function toggle() { if (bedOpt) bedLoad(); if (reh) rehStop(); else if (playing) pause(); else if (voiceOpt) rehStart(pauseNo(T)); else play(null); }
function setVoice(on) { const was = reh; if (was) rehStop(); voiceOpt = on; render(T); }
function setLang(l) { lang = l; if (reh) rehStart(rehN); else render(T); }   // playing: the same clip again, in the other language

addEventListener('keydown', e => {
  if (e.key === 'v' || e.key === 'V') { setVoice(!voiceOpt); return; }
  if (e.key === 'a' || e.key === 'A') { setBed(!bedOpt); return; }
  if (e.key === 'l' || e.key === 'L') { setLang(lang === 'fr' ? 'en' : 'fr'); startLabels(); return; }
  if (reh) {
    if (e.key === 'Escape') { rehStop(); return; }
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); rehStart(rehN + 1); return; }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); rehStart(rehN - 1); return; }
    if (e.key === ' ') { e.preventDefault(); rehStop(); return; }
    if (e.key === 'Enter' && typing()) { e.preventDefault(); const n = +typed; typed = ''; rehStart(n); return; }
  }
  if (/^[0-9]$/.test(e.key)) { typed = (typing() ? typed : '') + e.key; typedAt = Date.now();
    clearTimeout(typedTimer); typedTimer = setTimeout(() => { typed = ''; render(T); }, 4000); render(T); return; }
  if (e.key === 'Enter' && typing()) { e.preventDefault(); const n = +typed; typed = ''; goPause(n); return; }
  if (e.key === 'Escape' && typed) { typed = ''; render(T); return; }
  if (['ArrowRight', 'ArrowDown', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
  else if (e.key === ' ') { e.preventDefault(); toggle(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); typed = ''; back(); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(DUR);
  else if (e.key === 'r' || e.key === 'R') { document.body.classList.toggle('review'); panelSeq = null; fit(); }
  else if (e.key === 'b' || e.key === 'B') document.body.classList.toggle('clean');
  else if (e.key === 'h' || e.key === 'H' || e.key === '?') document.body.classList.toggle('help');
  else if (e.key === 'f' || e.key === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
});
// a link on screen opens its page instead of advancing the talk; while its item is hidden it is not a link
// links (sources, the QR codes, the repository's address): open in a new tab and don't advance the talk; while a
// link is not on screen yet (faded out, it or one of its parents), a click on it is an ordinary click: next step
addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
  let op = 1; for (let el = a; el && el !== document.body; el = el.parentElement) op *= +getComputedStyle(el).opacity;
  if (op < .5) e.preventDefault(); else e.stopPropagation();
}, true);
$('view').addEventListener('click', () => { if (reh) rehStart(rehN + 1); else next(); });
addEventListener('wheel', e => { if (!playing && T >= P2 && T < tOut) { SNB.wheel(e.deltaY); render(T); } }, { passive: true });
let idle = null; addEventListener('mousemove', () => { document.body.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(() => document.body.classList.add('idle'), 2200); });

function fit() {
  const v = $('view'), vw = v.clientWidth, vh = v.clientHeight - (document.body.classList.contains('review') ? 46 : 0);
  const s = Math.min(vw / W, vh / H); stage.style.transform = `scale(${s})`;
  stage.style.left = ((vw - W * s) / 2) + 'px'; stage.style.top = ((vh - H * s) / 2) + 'px';
  if (G) { const k = Math.min(2560 / W, Math.max(1, s * (devicePixelRatio || 1))); G.resize(Math.round(W * k), Math.round(H * k)); }
  render(T);
}
addEventListener('resize', fit);

// #p=37 opens a pause · #t=42 a moment · #s=bill the start of a sequence · &review the panel · &clean no bar
// and no pause number · &still no ambient motion (captures)
const hp = new URLSearchParams(location.hash.slice(1));
if (hp.has('clean')) document.body.classList.add('clean');
if (hp.has('review')) document.body.classList.add('review');
const REH_BASE = hp.get('audio') || '../voice/out/video_fr/';   // the video's French; &audio=<folder>/ for other clips
const REH_EN = hp.get('audio_en') || '../voice/out/video_en/';   // the English clips; &audio_en=<folder>/
if (['fr', 'en'].includes(hp.get('lang'))) lang = hp.get('lang');   // &lang=fr opens with the French voice
const BED_BASE = hp.get('bed') || '../voice/out/night/chimes.wav';   // &bed=<file> to try another bed
// the player's buttons, and its opening card (the single-file build with the voice, or #player)
voiceOpt = !!VOICE || hp.has('voice'); bedOpt = !!VOICE || hp.has('player') || hp.has('voice');
const startCard = $('start'), hideStart = () => { startCard.style.display = 'none'; };
const startLabels = () => { [['startVoice', 'Voice', voiceOpt], ['startBed', 'Ambience', bedOpt]].forEach(([id, w, on]) => { $(id).textContent = w + (on ? ': on' : ': off'); $(id).classList.toggle('on', on); });
  $('startLang').textContent = lang === 'en' ? 'English' : 'Français'; };
[['playB', () => { hideStart(); toggle(); }], ['snd', () => setVoice(!voiceOpt)], ['bedB', () => setBed(!bedOpt)], ['langB', () => setLang(lang === 'fr' ? 'en' : 'fr')], ['startLang', () => setLang(lang === 'fr' ? 'en' : 'fr')], ['startPlay', () => { hideStart(); toggle(); }],
 ['startVoice', () => { setVoice(!voiceOpt); }], ['startBed', () => { setBed(!bedOpt); }], ['startStep', hideStart]].forEach(([id, fn]) => $(id).addEventListener('click', e => { e.stopPropagation(); e.currentTarget.blur(); fn(); startLabels(); }));
if ((VOICE || hp.has('player')) && !hp.has('p') && !hp.has('t') && !hp.has('s')) { startCard.style.display = 'flex'; startLabels(); }
addEventListener('keydown', hideStart, true);
const AMBIENT = !hp.has('still');   // #still: no ambient motion (captures stay a pure function of T)
voiceOn = false;   // the live talk is silent: the narrated video is a separate output
if (hp.has('s') && S[hp.get('s')]) T = S[hp.get('s')].off;
if (hp.has('t')) T = +hp.get('t');
if (hp.has('p')) T = STOPS[clamp(Math.round(+hp.get('p')) || 1, 1, STOPS.length) - 1].t;
window.seek = t => { pause(); render(t); return T; };
window.SEQS = SEQ.map(s => ({ id: s.id, part: s.part, title: s.title, off: s.off, dur: s.dur, cues: s.c.map(c => s.off + c), lines: s.lines.map(l => ({ text: l.text, t: s.off + l.t, d: l.d })), notes: s.notes }));
window.DUR = DUR;
window.STOPS = STOPS.map(p => ({ n: p.n, t: p.t, sid: p.sid, line: p.line }));
window.SECNA = { render, cue, S, OUT, N, reh: () => ({ on: reh, n: rehN, note: rehNote, voice: voiceOpt, bed: bedOpt, bedLvl: +bedLvl.toFixed(2), bedWeb: !!bedNode, bedEl: !!bedEl, rate: rehAudio ? rehAudio.playbackRate : null, at: rehAudio ? +rehAudio.currentTime.toFixed(1) : null }), amb: v => { if (v !== undefined) AMB = v; return AMB; } };
document.fonts.ready.then(() => fit());
fit();
requestAnimationFrame(loop);
})();
