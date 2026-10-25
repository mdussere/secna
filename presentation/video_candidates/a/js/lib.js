/* Outils partagés : temps, aléatoire déterministe, nuages de points, QR code. */
window.SCENES = [];
window.L = (() => {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const eo = t => 1 - Math.pow(1 - t, 3);
  const prog = (t, a, b, f = ease) => f(clamp((t - a) / (b - a)));
  const lerp = (a, b, t) => a + (b - a) * t;

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }

  const fmt = (v, dec = 0) => v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace(/ /g, ' ');

  /* Texte cinétique : chaque mot apparaît à son tour. *mot* = mot surligné. */
  function words(text, at, step = 0.12, fx = 'up', cls = '') {
    return text.split(' ').map((w, i) => {
      let c = cls;
      if (w.startsWith('*')) { w = w.replace(/\*/g, ''); c += ' hl'; }
      return `<span class="w ${c}" data-at="${(at + i * step).toFixed(2)}" data-fx="${fx}">${w}</span>`;
    }).join(' ');
  }

  const PAL = ['#ff8a5c', '#ffd166', '#4ee3a0', '#5fb2ff', '#c58cff', '#f472b6', '#a3e635', '#38d6f8', '#fb7185', '#facc15', '#7dd3fc', '#fda4af'];

  /* ---------- canvas : résolution adaptée à l'échelle de la scène ---------- */
  const canvases = [];
  let stageScale = 1;
  function canvas(el) {
    const c = { cv: el, ctx: el.getContext('2d'), w: el.width, h: el.height, k: 1 };
    el.style.width = c.w + 'px'; el.style.height = c.h + 'px';
    canvases.push(c); fit(c); return c;
  }
  function fit(c) {
    const k = Math.max(1, Math.min(2.5, (window.devicePixelRatio || 1) * stageScale));
    c.k = k; c.cv.width = Math.round(c.w * k); c.cv.height = Math.round(c.h * k);
  }
  function setScale(s) { stageScale = s; canvases.forEach(fit); }
  function begin(c) { const x = c.ctx; x.setTransform(c.k, 0, 0, c.k, 0, 0); x.clearRect(0, 0, c.w, c.h); return x; }
  function rrect(x, X, Y, W, H, R) {
    x.beginPath(); x.moveTo(X + R, Y); x.arcTo(X + W, Y, X + W, Y + H, R); x.arcTo(X + W, Y + H, X, Y + H, R);
    x.arcTo(X, Y + H, X, Y, R); x.arcTo(X, Y, X + W, Y, R); x.closePath();
  }
  function pillLabel(x, text, cx, cy, color, alpha = 1, size = 26, maxW = 0) {
    if (alpha <= 0) return;
    x.save(); x.globalAlpha = alpha;
    x.font = `650 ${size}px ${getComputedStyle(document.body).getPropertyValue('--sans') || 'sans-serif'}`;
    const tw = x.measureText(text).width, ph = size * 1.7, pw = tw + size * 1.3;
    if (maxW) cx = clamp(cx, pw / 2 + 4, maxW - pw / 2 - 4);
    cy = Math.max(cy, ph / 2 + 4);
    const yy = cy - (1 - alpha) * 14;
    rrect(x, cx - pw / 2, yy - ph / 2, pw, ph, ph / 2);
    x.fillStyle = 'rgba(8,10,16,.82)'; x.fill();
    x.lineWidth = 2; x.strokeStyle = color; x.stroke();
    x.fillStyle = '#f3f1ea'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(text, cx, yy + 1);
    x.restore();
  }

  /* ---------- nuage de points (Embed / Cluster / Name) ---------- */
  class Cloud {
    constructor(o) {
      const r = rng(o.seed || 1);
      this.w = o.w; this.h = o.h;
      this.centers = o.centers.map((c, i) => ({ ...c, col: c.col || PAL[i % PAL.length] }));
      const k = this.centers.length;
      const wsum = this.centers.reduce((a, c) => a + (c.wt || 1), 0);
      this.pts = [];
      const n = o.n || 1200, noise = o.noise ?? .06;
      for (let i = 0; i < n; i++) {
        let x, y, c = -1;
        if (r() < noise) { x = this.w * (.04 + .92 * r()); y = this.h * (.06 + .88 * r()); }
        else {
          let u = r() * wsum; c = 0;
          while (u > (this.centers[c].wt || 1) && c < k - 1) { u -= (this.centers[c].wt || 1); c++; }
          const C = this.centers[c];
          x = C.x + gauss(r) * C.s; y = C.y + gauss(r) * C.s * .75;
        }
        const ang = r() * Math.PI * 2, rad = 300 + r() * 900;
        const sx = o.spawn === 'left' ? -60 - r() * 300 : this.w / 2 + Math.cos(ang) * rad;
        const sy = o.spawn === 'left' ? this.h * r() : this.h / 2 + Math.sin(ang) * rad * .6;
        this.pts.push({ x, y, c, sx, sy, d: r() * .82, sz: .75 + r() * .6 });
      }
      (o.extra || []).forEach(e => this.pts.push({ ...e, sx: e.x, sy: e.y - 80, d: e.d ?? .3, sz: 1.6, special: true }));
    }
    /* appear 0..1 : remplissage · color 0..1 : coloration par groupe · focus : n° du groupe mis en avant */
    draw(c, o = {}) {
      const x = begin(c);
      const appear = o.appear ?? 1, color = o.color ?? 0, focus = o.focus ?? -1, fdim = o.focusDim ?? 0;
      const R = o.r || 3.2, ring = o.noiseRing || 0;
      const groups = new Map();
      for (const p of this.pts) {
        const q = clamp((appear - p.d) / .18);
        if (q <= 0) continue;
        const e = eo(q);
        const px = lerp(p.sx, p.x, e), py = lerp(p.sy, p.y, e);
        const key = p.c;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(px, py, R * p.sz * (q < 1 ? 1.4 - .4 * q : 1));
      }
      for (const [g, arr] of groups) {
        let a = 1;
        if (focus >= 0 && g !== focus) a = 1 - .78 * fdim;
        // passe grise
        const grey = g < 0 ? 1 : 1 - color;
        if (grey > .01) {
          x.globalAlpha = .75 * a * (g < 0 ? (1 - .45 * color) : grey);
          x.fillStyle = '#9aa1b2'; x.beginPath();
          for (let i = 0; i < arr.length; i += 3) { x.moveTo(arr[i] + arr[i + 2], arr[i + 1]); x.arc(arr[i], arr[i + 1], arr[i + 2], 0, 6.283); }
          x.fill();
        }
        if (g >= 0 && color > .01) {
          x.globalAlpha = .92 * a * color;
          x.fillStyle = this.centers[g].col; x.beginPath();
          for (let i = 0; i < arr.length; i += 3) { x.moveTo(arr[i] + arr[i + 2], arr[i + 1]); x.arc(arr[i], arr[i + 1], arr[i + 2], 0, 6.283); }
          x.fill();
        }
        if (g < 0 && ring > .01) {
          x.globalAlpha = ring * .9; x.strokeStyle = '#ff4f6d'; x.lineWidth = 1.6; x.beginPath();
          for (let i = 0; i < arr.length; i += 3) { x.moveTo(arr[i] + 9, arr[i + 1]); x.arc(arr[i], arr[i + 1], 9, 0, 6.283); }
          x.stroke();
        }
      }
      x.globalAlpha = 1;
      // halos de groupes
      if (o.halo) this.centers.forEach((C, i) => {
        const a = o.halo(i); if (a <= 0) return;
        x.globalAlpha = a * .5; x.strokeStyle = C.col; x.lineWidth = 2; x.setLineDash([6, 8]);
        x.beginPath(); x.ellipse(C.x, C.y, C.s * 2.3, C.s * 1.8, 0, 0, 6.283); x.stroke(); x.setLineDash([]);
      });
      x.globalAlpha = 1;
      if (o.labels) this.centers.forEach((C, i) => {
        const a = o.labels(i); if (a > 0 && C.name) pillLabel(x, C.name, C.x, C.y - C.s * 1.9, C.col, a, o.labelSize || 26, this.w);
      });
      return x;
    }
  }

  /* ---------- QR code de https://github.com/mdussere/secna (niveau M) ---------- */
  const QR = ["11111110100001110100001111111", "10000010010010010100101000001", "10111010101001000101001011101", "10111010011000011110101011101", "10111010001010011100001011101", "10000010100101101100001000001", "11111110101010101010101111111", "00000000001101000010100000000", "10100011001011011001100100101", "00011000101100001001111100011", "01110110101101101101001111101", "11100101110110111010110011000", "00101011101011101000101100001", "10001000011001100011101100011", "10111111111110010011011110001", "00100001000111000001101100000", "01111110011011011000111000001", "01100100001100011001001100111", "11011110111111111101000011001", "00000100010000111010101010000", "11101110110111101010111111010", "00000000111101111100100011101", "11111110101010010000101010001", "10000010010011010011100010010", "10111010001101011001111111011", "10111010010001011011110011101", "10111010110010010010010010011", "10000010000010001010100111000", "11111110101100011000100011001"];
  function qrSVG(px) {
    const n = QR.length, q = 2, s = n + q * 2;
    let d = '';
    QR.forEach((row, y) => { for (let x = 0; x < n; x++) if (row[x] === '1') d += `M${x + q} ${y + q}h1v1h-1z`; });
    return `<svg width="${px}" height="${px}" viewBox="0 0 ${s} ${s}" shape-rendering="crispEdges" style="border-radius:14px;display:block"><rect width="${s}" height="${s}" fill="#f3f1ea"/><path d="${d}" fill="#07080c"/></svg>`;
  }

  function rail(cur, done = '') {
    const L = [['S', 'cS'], ['E', 'cE'], ['C', 'cC'], ['N', 'cN'], ['A', 'cA']];
    return `<div class="rail">${L.map(([l, c]) => `<div class="l ${l === cur ? 'cur' : ''} ${done.includes(l) ? 'done' : ''}" style="--c:var(--${c})">${l}</div>`).join('')}</div>`;
  }

  return { clamp, ease, eo, prog, lerp, rng, gauss, fmt, words, PAL, canvas, setScale, begin, rrect, pillLabel, Cloud, qrSVG, rail };
})();
