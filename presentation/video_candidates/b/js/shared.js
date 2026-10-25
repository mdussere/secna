/* Shared visuals: the point cloud (E / C / N / A), chapter cards, small drawing helpers. */
(function () {
  'use strict';
  const { rng, gauss, clamp, lerp, eo } = U;

  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  U.rgba = (h, a) => { const c = hex(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  U.mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`; };
  U.GREY = '#6f7588';
  U.PAL = ['#5cc8ff', '#7cf2c9', '#ffb547', '#c08cff', '#ff7a90', '#9be15d', '#ffd86b', '#6aa8ff', '#ff9f5a'];

  /* Illustrative clusters (customer-review flavoured). Two delivery clusters sit side by side:
     "colis jamais arrivé" and "livraison en retard" — different words, same meaning. */
  U.CLUSTERS = [
    { name: 'Colis jamais arrivés', x: 1010, y: 400, s: 58, n: 150, lx: -70, ly: -85 },
    { name: 'Retards de livraison', x: 1150, y: 320, s: 52, n: 130, lx: 60, ly: -80 },
    { name: 'Remboursements en attente', x: 1360, y: 440, s: 56, n: 120, lx: 30, ly: 90 },
    { name: 'Bugs au paiement', x: 1580, y: 320, s: 50, n: 110, lx: 0, ly: -80 },
    { name: 'Connexion impossible', x: 1680, y: 560, s: 46, n: 90, lx: -10, ly: 80 },
    { name: 'Service client injoignable', x: 1420, y: 680, s: 60, n: 140, lx: 0, ly: 95 },
    { name: 'Qualité des produits', x: 1130, y: 720, s: 62, n: 150, lx: 0, ly: 100 },
    { name: 'Tailles et retours', x: 930, y: 610, s: 46, n: 90, lx: -30, ly: 75 },
    { name: 'Compliments', x: 1700, y: 830, s: 52, n: 110, lx: -30, ly: -80 },
  ];
  U.REGION = { x: 860, y: 220, w: 940, h: 700 };

  U.makeCloud = function (seed = 7) {
    const r = rng(seed), pts = [];
    U.CLUSTERS.forEach((c, k) => {
      for (let i = 0; i < c.n; i++) pts.push({ x: c.x + gauss(r) * c.s * .55, y: c.y + gauss(r) * c.s * .55, k });
    });
    const R = U.REGION;
    for (let i = 0; i < 95; i++) pts.push({ x: R.x + 20 + r() * (R.w - 40), y: R.y + 20 + r() * (R.h - 40), k: -1 });
    const n = pts.length, cols = 40, rows = Math.ceil(n / cols);
    const order = pts.map((_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    order.forEach((pi, j) => {
      const p = pts[pi];
      p.sx = R.x + 10 + (j % cols) * (R.w / cols);
      p.sy = R.y + 30 + Math.floor(j / cols) * ((R.h - 60) / rows);
      p.d = r(); p.w = 6 + r() * 14;
    });
    return pts;
  };
  U.CLOUD = U.makeCloud(7);

  /* o: embed 0..1 (doc tiles -> points), color 0..1 (grey -> cluster colours), reveal 0..1,
        halo 0..1, focus (cluster index), tf {x,y,s}, alpha */
  U.drawCloud = function (ctx, o = {}) {
    const P = o.pts || U.CLOUD;
    const e = o.embed ?? 1, col = o.color ?? 0, rev = o.reveal ?? 1, A = o.alpha ?? 1;
    ctx.save();
    const base = ctx.globalAlpha;
    if (o.tf) { ctx.translate(o.tf.x, o.tf.y); ctx.scale(o.tf.s, o.tf.s); }
    const ck = k => clamp(col * 1.7 - k * .08);
    if (o.halo) {
      U.CLUSTERS.forEach((c, k) => {
        const a = ck(k) * o.halo * (o.focus != null && o.focus !== k ? .25 : 1);
        if (a <= 0) return;
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.s * 2.2);
        g.addColorStop(0, U.rgba(U.PAL[k], .26 * a)); g.addColorStop(1, U.rgba(U.PAL[k], 0));
        ctx.fillStyle = g; ctx.fillRect(c.x - c.s * 2.2, c.y - c.s * 2.2, c.s * 4.4, c.s * 4.4);
      });
    }
    for (let i = 0; i < P.length; i++) {
      const p = P[i];
      if (p.d > rev) continue;
      const pe = eo(clamp(e * 1.4 - p.d * .4));
      const x = lerp(p.sx, p.x, pe), y = lerp(p.sy, p.y, pe);
      let a = A * (o.focus != null && p.k !== o.focus ? .22 : 1);
      if (o.fadeIn != null) a *= clamp((o.fadeIn - p.d) * 8);
      ctx.globalAlpha = base * a * (.55 + .45 * pe);
      ctx.fillStyle = p.k < 0 || col <= 0 ? U.GREY : U.mix(U.GREY, U.PAL[p.k], ck(p.k));
      if (pe < .55) {
        const w = lerp(p.w, 4, pe / .55);
        ctx.fillRect(x - w / 2, y - 1.5, w, 3);
      } else {
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill();
      }
    }
    ctx.restore();
  };

  U.pill = function (ctx, text, x, y, o = {}) {
    ctx.save();
    ctx.font = o.font || '500 24px "Inter Tight", system-ui, sans-serif';
    const w = ctx.measureText(text).width + 32, h = o.h || 46;
    const X = x - (o.align === 'left' ? 0 : w / 2), Y = y - h / 2;
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.fillStyle = o.bg || 'rgba(12,14,21,.92)';
    ctx.strokeStyle = o.stroke || 'rgba(255,255,255,.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(X, Y, w, h, h / 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = o.color || '#f3f4f8'; ctx.textBaseline = 'middle';
    ctx.fillText(text, X + 16, y + 1);
    ctx.restore();
    return w;
  };

  /* Faint drifting dot field used as ambience. */
  const FIELD = (() => { const r = rng(99); return Array.from({ length: 220 }, () => ({ x: r() * 1920, y: r() * 1080, v: .2 + r() * .8, s: .6 + r() * 1.8, a: .05 + r() * .25 })); })();
  U.drawField = function (ctx, t, alpha = 1) {
    ctx.save();
    const base = ctx.globalAlpha;
    for (const p of FIELD) {
      const y = (p.y - t * 8 * p.v + 2000) % 1080;
      ctx.globalAlpha = base * p.a * alpha;
      ctx.fillStyle = '#9aa0b2';
      ctx.fillRect(p.x, y, p.s, p.s);
    }
    ctx.restore();
  };

  /* Chapter card factory */
  U.chapterCard = function (n, name, sub, narr) {
    return scene({
      id: 'ch' + n, ch: n, dur: 5, title: 'Carte de chapitre', cls: 'chcard', noBrand: true, narr: narr || '(transition — pas de voix ou une phrase d’amorce)',
      html: `<div class="wrap center">
        <div class="num" data-at="0.1" data-fx="blur">${String(n).padStart(2, '0')}</div>
        <div class="name" data-at="0.5">${name}</div>
        ${sub ? `<div class="t2 sub" data-at="1.1">${sub}</div>` : ''}
        <div class="rule" data-at="1.3" data-fx="wipe"></div></div>`,
      draw(ctx, t) { U.drawField(ctx, t, .8); },
    });
  };
})();
