/* SECNA — outils visuels partagés : nuage de points, treemap, QR, pluie de textes, blocs de scène. */
(function () {
  const K = window.K;
  const { clamp, lerp, ease } = K;
  K.FONT = {
    head: '"Space Grotesk", "Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  };
  K.COL = { ds: '#2fe0c0', llm: '#b49cff', cost: '#ffb547', bad: '#ff5d6c', ok: '#5be38a', ink: '#eef1f6', mute: '#8b93a7', dim: '#4a5163' };

  // ---------- hasard déterministe
  K.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  K.gauss = r => { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };

  K.rrect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
  // étiquette arrondie centrée en (x, y)
  K.pill = function (ctx, x, y, text, o = {}) {
    const fs = o.size || 18;
    ctx.font = `${o.weight || 500} ${fs}px ${o.font || K.FONT.body}`;
    const tw = ctx.measureText(text).width, pw = tw + fs * 1.3, ph = fs * 1.9;
    const s = o.scale == null ? 1 : o.scale;
    ctx.save(); ctx.globalAlpha *= (o.alpha == null ? 1 : o.alpha);
    ctx.translate(x, y); ctx.scale(s, s);
    K.rrect(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2);
    ctx.fillStyle = o.bg || 'rgba(10,12,18,.88)'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = o.color || '#fff'; ctx.stroke();
    ctx.fillStyle = o.ink || '#eef1f6'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 1);
    ctx.restore();
    return pw;
  };

  // ---------- nuage de points (embeddings + groupes)
  K.Cloud = class {
    constructor({ seed = 1, n = 2000, k = 14, outliers = .07, aspect = 1.4, minD = .2, sig = [.022, .05] }) {
      const r = K.rng(seed);
      const C = []; let tries = 0;
      while (C.length < k && tries < 20000) {
        tries++;
        const c = { x: .09 + .82 * r(), y: .1 + .8 * r() };
        if (C.every(o => Math.hypot((o.x - c.x) * aspect, o.y - c.y) > minD)) C.push(c);
      }
      this.k = C.length; this.aspect = aspect;
      C.forEach((c, i) => {
        c.w = Math.pow(r(), 1.5) + .25; c.s = sig[0] + (sig[1] - sig[0]) * r();
        c.hue = (i * 137.508 + 165) % 360; c.n = 0;
      });
      const tw = C.reduce((a, c) => a + c.w, 0);
      this.pts = [];
      for (let i = 0; i < n; i++) {
        let p;
        if (r() < outliers) p = { c: -1, x: .03 + .94 * r(), y: .04 + .92 * r() };
        else {
          let u = r() * tw, ci = 0; while (u > C[ci].w && ci < C.length - 1) { u -= C[ci].w; ci++; }
          const c = C[ci]; c.n++;
          p = { c: ci, x: c.x + K.gauss(r) * c.s, y: c.y + K.gauss(r) * c.s * aspect };
        }
        p.x = clamp(p.x, .01, .99); p.y = clamp(p.y, .01, .99);
        p.sx = r() * .08 - .1; p.sy = r(); p.d = r(); p.j = r();
        this.pts.push(p);
      }
      this.C = C; this.n = n;
    }
    center(i, box) { const c = this.C[i]; return { x: box.x + c.x * box.w, y: box.y + c.y * box.h }; }
    far(i) { // groupe le plus éloigné de i
      let best = 0, bd = -1; const a = this.C[i];
      this.C.forEach((c, j) => { const d = Math.hypot((c.x - a.x) * this.aspect, c.y - a.y); if (d > bd) { bd = d; best = j; } });
      return best;
    }
    samples(ci, m, seed = 3) { // quelques points d'un groupe, proches du centre
      const out = []; const r = K.rng(seed + ci * 17);
      const pts = this.pts.filter(p => p.c === ci);
      for (let i = 0; i < m && pts.length; i++) out.push(pts[Math.floor(r() * pts.length)]);
      return out;
    }
    hsl(ci, m, l = 62) { const c = this.C[ci]; return `hsl(${c.hue},${(72 * m).toFixed(0)}%,${lerp(52, l, m).toFixed(0)}%)`; }
    draw(ctx, o) {
      const { box } = o;
      const n = Math.floor(this.n * clamp(o.reveal == null ? 1 : o.reveal));
      const g = o.gather == null ? 1 : o.gather, col = o.color || 0, R = o.r || 2.4;
      const focus = o.focus == null ? -1 : o.focus, alpha = o.alpha == null ? .9 : o.alpha;
      const t = o.t || 0;
      if (o.glow) {
        this.C.forEach((c, i) => {
          const m = clamp(col * 1.4 - .2) * o.glow * (focus >= 0 && focus !== i ? .25 : 1);
          if (m <= 0) return;
          const x = box.x + c.x * box.w, y = box.y + c.y * box.h, rr = c.s * box.w * 3.2;
          const gr = ctx.createRadialGradient(x, y, 0, x, y, rr);
          gr.addColorStop(0, `hsla(${c.hue},80%,60%,${.22 * m})`); gr.addColorStop(1, `hsla(${c.hue},80%,60%,0)`);
          ctx.fillStyle = gr; ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2);
        });
      }
      for (let i = 0; i < n; i++) {
        const p = this.pts[i];
        const gi = ease.inout(clamp((g - p.d * .55) / .45));
        let x = box.x + box.w * lerp(p.sx, p.x, gi), y = box.y + box.h * lerp(p.sy, p.y, gi);
        if (o.wobble) { x += Math.sin(t * .7 + p.j * 40) * o.wobble; y += Math.cos(t * .6 + p.d * 40) * o.wobble; }
        let a = alpha * (gi < 1 ? .35 + .65 * gi : 1);
        let fill;
        if (p.c < 0) {
          fill = o.outlierColor || '#6b7385';
          if (o.ringOutliers) {
            ctx.globalAlpha = o.ringOutliers * .8; ctx.strokeStyle = K.COL.cost; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(x, y, R + 5 + 2 * Math.sin(t * 4 + p.j * 9), 0, 6.283); ctx.stroke();
          }
        } else {
          const m = clamp((col - p.d * .4) / .6);
          fill = m > 0 ? this.hsl(p.c, m) : '#7b8396';
          if (focus >= 0 && p.c !== focus) a *= o.dimOthers == null ? .22 : o.dimOthers;
        }
        if (focus >= 0 && p.c < 0) a *= .4;
        ctx.globalAlpha = a; ctx.fillStyle = fill;
        ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  };

  // ---------- treemap (squarify)
  K.squarify = function (items, x, y, w, h) {
    const out = []; const total = items.reduce((a, b) => a + b.v, 0); if (!total) return out;
    const scale = w * h / total;
    let rest = items.slice().sort((a, b) => b.v - a.v).map(it => ({ it, a: it.v * scale }));
    let rx = x, ry = y, rw = w, rh = h;
    const worst = (row, side) => {
      const s = row.reduce((a, b) => a + b.a, 0); let mx = 0, mn = Infinity;
      row.forEach(r => { mx = Math.max(mx, r.a); mn = Math.min(mn, r.a); });
      return Math.max(side * side * mx / (s * s), s * s / (side * side * mn));
    };
    while (rest.length) {
      const side = Math.min(rw, rh); const row = [rest[0]]; let i = 1;
      while (i < rest.length && worst([...row, rest[i]], side) <= worst(row, side)) { row.push(rest[i]); i++; }
      const s = row.reduce((a, b) => a + b.a, 0);
      if (rw >= rh) { const cw = s / rh; let cy = ry; row.forEach(r => { const hh = r.a / cw; out.push({ ...r.it, x: rx, y: cy, w: cw, h: hh }); cy += hh; }); rx += cw; rw -= cw; }
      else { const ch = s / rw; let cx = rx; row.forEach(r => { const ww = r.a / ch; out.push({ ...r.it, x: cx, y: ry, w: ww, h: ch }); cx += ww; }); ry += ch; rh -= ch; }
      rest = rest.slice(i);
    }
    return out;
  };

  // ---------- QR code vers github.com/mdussere/secna (matrice pré-calculée, 29×29)
  const QR = '1111111010000111010000111111110000010010010010100101000001101110101010010001010010111011011101001100001111010101110110111010001010011100001011101100000101001011011000010000011111111010101010101010111111100000000001101000010100000000101000110010110110011001001010001100010110000100111110001101110110101101101101001111101111001011101101110101100110000010101110101110100010110000110001000011001100011101100011101111111111100100110111100010010000100011100000110110000001111110011011011000111000001011001000011000110010011001111101111011111111110100001100100000100010000111010101010000111011101101111010101111110100000000011110111110010001110111111110101010010000101010001100000100100110100111000100101011101000110101100111111101110111010010001011011110011101101110101100100100100100100111000001000001000101010011100011111110101100011000100011001';
  K.qrSVG = function (px) {
    let r = '';
    for (let y = 0; y < 29; y++) for (let x = 0; x < 29; x++) if (QR[y * 29 + x] === '1') r += `M${x} ${y}h1v1h-1z`;
    return `<span class="qrwrap"><svg viewBox="0 0 29 29" width="${px}" height="${px}" shape-rendering="crispEdges"><path d="${r}" fill="#06070b"/></svg></span>`;
  };

  // ---------- textes bruts (illustratifs)
  K.SNIPS = [
    'Colis marqué livré, jamais reçu', 'Remboursement toujours pas arrivé', "L'appli plante au moment de payer",
    'Taille trop petite, échange impossible', 'Code promo refusé au panier', 'Service client injoignable',
    'ERROR timeout upstream=payments 504', 'Très bon produit, livraison rapide', 'Le vendeur ne répond pas depuis 5 jours',
    'Impossible de modifier mon adresse', 'WARN retry 3/3 queue=orders', 'agent: tool_call search_orders → 0 results',
    'Pourquoi mon compte est bloqué ?', "Facture introuvable dans l'espace client", 'Notification reçue 4 fois',
    'Je ne comprends pas les frais', 'Le suivi ne bouge plus depuis lundi', 'Super expérience, je recommande',
    'Mot de passe réinitialisé sans raison', 'Délai annoncé non respecté', 'Produit différent de la photo',
    'trace#8812 step=7 llm.retry', 'Une étoile, et encore', 'Q12 : « rien à signaler, sauf le prix »',
    'Stock affiché mais indisponible', 'Le chat se ferme tout seul', 'Article reçu abîmé', 'Pas de réponse à ma réclamation',
    'Retour gratuit ? Pas pour moi', "J'ai été débité deux fois", 'vendeur : « mes annonces sont bloquées »', 'INFO user_session expired id=77a1',
  ];
  // pluie de textes qui remontent lentement
  K.rain = function (ctx, t, o = {}) {
    const n = o.n || 70, r = K.rng(o.seed || 5), A = o.alpha == null ? .25 : o.alpha;
    ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const sz = 14 + r() * 16, sp = (8 + r() * 26) * (o.speed || 1), x = r() * 1920 - 100, ph = r() * 1300;
      const s = K.SNIPS[Math.floor(r() * K.SNIPS.length)];
      const y = 1180 - ((ph + t * sp) % 1300);
      const depth = sz / 30;
      ctx.globalAlpha = A * depth * clamp(Math.min(y / 200, (1080 - y) / 200 + .3));
      ctx.font = `${r() < .25 ? 400 : 500} ${sz}px ${r() < .3 ? K.FONT.mono : K.FONT.body}`;
      ctx.fillStyle = o.color || '#9aa3b8';
      ctx.fillText(s, x, y);
    }
    ctx.globalAlpha = 1;
  };

  // ---------- blocs de scène réutilisables
  K.chapter = function (n, name, sub, say) {
    K.scene({
      id: 'ch' + n, chapter: n, chapName: name, title: `Chapitre ${n} — ${name}`, dur: 6, say,
      build(root) {
        root.innerHTML = `<div class="full center">
          <div class="chapnum" data-in=".1" data-fx="blur" data-d="1.2">${String(n).padStart(2, '0')}</div>
          <div class="h-l" data-in=".6" style="margin-top:-30px">${name}</div>
          <div class="t-l mute" data-in="1.3" style="margin-top:22px">${sub}</div></div>`;
        return (t, ctx) => {
          const p = K.IO(t, .3, 2.2);
          ctx.globalAlpha = .6; const g = ctx.createLinearGradient(0, 0, 1920, 0);
          g.addColorStop(0, 'rgba(47,224,192,0)'); g.addColorStop(.5, K.COL.ds); g.addColorStop(1, 'rgba(180,156,255,0)');
          ctx.fillStyle = g; ctx.fillRect(960 - 700 * p, 820, 1400 * p, 2);
        };
      },
    });
  };
  const STEPS = [['S', 'Summarise', 'préparer', 'llm'], ['E', 'Embed', 'projeter', 'ds'], ['C', 'Cluster', 'regrouper', 'ds'], ['N', 'Name', 'nommer', 'llm'], ['A', 'Aggregate', 'ranger', 'ds']];
  K.STEPS = STEPS;
  K.pipe = function (active, inT = .2) {
    return `<div class="pipe" data-in="${inT}" data-fx="down">${STEPS.map((s, i) =>
      `<div class="pipe-step ${i < active ? 'done' : ''} ${i === active ? 'on ' + s[3] : ''}"><b>${s[0]}</b><span>${s[1]} · ${s[2]}</span></div>`).join('<i class="pipe-arrow">→</i>')}</div>`;
  };
  const COSTS = [['45,00 $', 45, 2], ['≈ 0 $', null], ['0 $', null], ['3,75 $', 3.75, 2], ['0,06 $', .06, 2]];
  K.ledger = function (active, inT, note) {
    let rows = '';
    for (let i = 0; i <= active; i++) {
      const c = COSTS[i], cur = i === active;
      const val = cur && c[1] != null ? `<b data-in="${inT}" data-fx="fade" data-count="${c[1]}" data-dec="${c[2]}" data-suf=" $">${c[0]}</b>` : `<b>${c[0]}</b>`;
      rows += `<div class="lr ${cur ? 'cur' : ''}"><span>${STEPS[i][0]} · ${STEPS[i][1]}</span>${val}</div>`;
    }
    return `<div class="ledger" data-in="${inT - .3}"><div class="lh">Facture Clio · 100 000 conversations</div>${rows}
      ${note ? `<div class="t-s mute" style="margin-top:14px" data-in="${inT + 1.6}">${note}</div>` : ''}</div>`;
  };
})();
