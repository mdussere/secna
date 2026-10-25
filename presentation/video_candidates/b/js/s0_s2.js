/* Ouverture · 01 L'impasse · 02 Clio */
(function () {
  'use strict';
  const { clamp, lerp, prog, eo, eio, rng } = U;

  /* ================= OUVERTURE ================= */
  const SNIPS = [
    'Colis jamais arrivé', 'Livraison en retard, encore', 'L’appli plante au paiement', 'ERROR upstream timeout after 30000ms',
    'Je n’arrive plus à me connecter', 'Remboursement toujours pas reçu', 'Très bon service, merci !', 'Le vendeur ne répond plus',
    'tool_call: search_orders(user_id=…)', 'Taille trop petite, retour compliqué', 'Pourquoi mon compte est bloqué ?', 'WARN retry 3/5 payment-gateway',
    'Super appli, rien à dire', 'Le formulaire ne propose pas mon cas', 'Autre : voir commentaire', 'agent step 14: reasoning…',
    'Produit conforme, emballage abîmé', 'Impossible de joindre le SAV', 'Notification reçue deux fois', 'Commande annulée sans raison',
    '“J’aimerais pouvoir payer en trois fois”', 'NullPointerException at Checkout.java:212', 'Le suivi colis ne bouge plus', 'Partenaire : facture en double',
    'Réponse libre : « rien à signaler »', 'trace_id=8f2c… latency=4.2s', 'Merci au livreur, très sympa', 'Le code promo ne marche pas',
  ];
  const SN = (() => { const r = rng(3); return Array.from({ length: 110 }, (_, i) => ({ s: SNIPS[i % SNIPS.length], x: r() * 1820 + 50, o: r() * 1300, v: 30 + r() * 60, z: r(), born: r() * 18 })); })();
  function drawSnips(ctx, t, amount = 1) {
    ctx.save();
    const base = ctx.globalAlpha;
    for (const p of SN) {
      if (p.born > t * amount * 1.4) continue;
      const y = 1150 - ((p.o + t * p.v) % 1300);
      const sz = 16 + p.z * 22;
      ctx.font = (p.z > .5 ? '500 ' : '400 ') + sz + 'px ' + (p.z > .7 ? '"JetBrains Mono",monospace' : '"Inter Tight",sans-serif');
      ctx.globalAlpha = base * (.12 + p.z * .38) * clamp((t * amount * 1.4 - p.born) / 1.5);
      ctx.fillStyle = p.z > .85 ? '#5cc8ff' : '#c7cbd6';
      ctx.fillText(p.s, p.x, y);
    }
    ctx.globalAlpha = base;
    const g = ctx.createRadialGradient(960, 540, 0, 960, 540, 720);
    g.addColorStop(0, 'rgba(6,7,11,.94)'); g.addColorStop(.6, 'rgba(6,7,11,.55)'); g.addColorStop(1, 'rgba(6,7,11,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    ctx.restore();
  }

  scene({
    id: 'cold', ch: 0, dur: 22, title: 'Cold open — le flot de texte', noBrand: true,
    narr: 'Avis clients, tickets, messages de vendeurs, réponses libres, logs, traces d’agents… Chaque jour, du texte. Beaucoup de texte. Et personne ne le lit.',
    html: `<div class="wrap center gap16">
      <div class="d3" data-at="1.5">Chaque jour, du texte.</div>
      <div class="d3 mute" data-at="5">Beaucoup de texte.</div>
      <div style="height:30px"></div>
      <div class="d1 mono" data-at="9" data-fx="blur" style="font-size:170px;letter-spacing:-.04em"><span data-count="0,1000000" data-c="9,8">0</span></div>
      <div class="k" data-at="9.5">documents</div>
      <div style="height:20px"></div>
      <div class="d3 cost glow-cost" data-at="16">Personne ne les lit.</div></div>`,
    draw(ctx, t) { drawSnips(ctx, t, 1); },
  });

  scene({
    id: 'title', ch: 0, dur: 14, title: 'Titre', noBrand: true,
    narr: 'Vos corpus grossissent. Pas votre budget de tokens. — Michaël Dussère, GenAI Center of Excellence chez Betclic.',
    html: `<div class="wrap" style="display:flex;flex-direction:column;justify-content:center">
      <div class="k" data-at="0.4">Generative AI Bordeaux · 19 novembre 2026</div>
      <div style="height:40px"></div>
      <div class="d1" data-at="1" style="font-size:124px">Vos corpus grossissent.</div>
      <div class="d1 cost glow-cost" data-at="2.6" style="font-size:124px">Pas votre budget de tokens.</div>
      <div style="height:70px"></div>
      <div class="t2" data-at="5"><b>Michaël Dussère</b> — GenAI Center of Excellence, Betclic</div></div>`,
    draw(ctx, t) { drawSnips(ctx, 22 + t, .5); },
  });

  /* ================= 01 L'IMPASSE ================= */
  U.chapterCard(1, 'L’impasse', 'Un corpus ne tient pas dans un LLM');

  const SOURCES = [
    ['Avis clients', 1.0, '#5cc8ff'], ['Tickets de support', .85, '#7cf2c9'], ['Messages vendeurs & partenaires', .6, '#ffb547'],
    ['Réponses libres aux questionnaires', .5, '#c08cff'], ['Journaux d’applications', 1.25, '#ff7a90'], ['Traces d’agents', 1.5, '#9be15d'],
  ];
  scene({
    id: 'piles', ch: 1, dur: 26, title: 'Les piles de texte',
    narr: 'Toutes les entreprises accumulent du texte : avis clients, tickets de support, messages de vendeurs ou de partenaires, réponses libres aux questionnaires, journaux d’applications, traces d’agents. Ce texte arrive en continu.',
    html: `<div class="wrap">
      <div class="d3" data-at="0.6">Toutes les entreprises accumulent du texte.</div>
      <div class="t2" data-at="14" style="margin-top:18px">Il arrive <b>en continu</b>. Et il ne fait que grossir.</div>
      <div class="abs" style="left:160px;right:160px;bottom:120px;height:620px;display:flex;gap:36px;align-items:flex-end">
        ${SOURCES.map((s, i) => `<div class="pilecol" data-at="${2 + i * .8}" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
          <div class="mono pilen" style="font-size:24px;color:${s[2]};margin-bottom:12px">0</div>
          <div class="pile" style="height:20px;border-radius:10px 10px 4px 4px;background:repeating-linear-gradient(0deg,${U.rgba(s[2], .55)} 0 3px,${U.rgba(s[2], .08)} 3px 11px);box-shadow:0 0 40px ${U.rgba(s[2], .15)}"></div>
          <div class="t3" style="margin-top:18px;font-size:24px;line-height:1.25;color:#c7cbd6;height:64px">${s[0]}</div></div>`).join('')}
      </div></div>`,
    build(el, st) { st.p = [...el.querySelectorAll('.pile')]; st.n = [...el.querySelectorAll('.pilen')]; },
    update(t, el, st) {
      SOURCES.forEach((s, i) => {
        const u = Math.max(0, t - 2 - i * .8);
        const h = Math.min(470, 14 + Math.pow(u, 1.35) * 14 * s[1]);
        st.p[i].style.height = h + 'px';
        st.n[i].textContent = U.fmt(Math.floor(Math.pow(u, 2.2) * 900 * s[1]));
      });
    },
  });

  const WALL = (() => { const r = rng(11); return Array.from({ length: 26 }, () => Array.from({ length: 4 + Math.floor(r() * 4) }, () => 40 + r() * 140)); })();
  const SAMPLED = new Set([3, 9, 15, 21]);
  scene({
    id: 'skim', ch: 1, dur: 26, title: 'Personne ne lit tout',
    narr: 'Personne ne le lit en entier : on survole, on prend un échantillon, on range à la main dans des catégories décidées il y a longtemps — et une bonne partie finit dans « Autre ».',
    html: `<div class="wrap">
      <div class="d3" data-at="0.4">Personne ne le lit en entier.</div>
      <div class="abs" style="left:160px;top:330px;width:760px;height:620px">
        <div class="wall" style="position:relative;height:100%;overflow:hidden">
          ${WALL.map((row, i) => `<div class="wl" data-i="${i}" style="display:flex;gap:10px;height:14px;margin-bottom:9.5px">${row.map(w => `<i style="display:block;width:${w}px;height:100%;border-radius:7px;background:#232838"></i>`).join('')}</div>`).join('')}
          <div class="scan" style="position:absolute;left:0;right:0;height:90px;top:0;background:linear-gradient(180deg,transparent,rgba(92,200,255,.18),transparent);border-bottom:2px solid rgba(92,200,255,.6);opacity:0"></div>
        </div></div>
      <div class="abs col gap16" style="left:1000px;top:340px;width:800px;font-size:40px">
        <div class="t1" data-at="3" style="font-size:40px">→ on <span class="ds">survole</span></div>
        <div class="t1" data-at="9" style="font-size:40px">→ on prend un <span class="ds">échantillon</span></div>
        <div class="t1" data-at="14" style="font-size:40px">→ on range à la main dans des catégories<br><span class="mute">décidées il y a longtemps</span></div>
      </div>
      <div class="abs" data-at="15" style="left:1000px;top:640px;width:760px;height:300px;display:flex;gap:22px;align-items:flex-end">
        ${['Livraison', 'Paiement', 'Compte', 'Autre'].map((b, i) => `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%">
          <div class="bin" style="height:4px;border-radius:8px 8px 3px 3px;background:${i === 3 ? 'linear-gradient(180deg,#ff5d6c,#a8323f)' : '#2b3144'}"></div>
          <div class="mono" style="margin-top:12px;font-size:22px;color:${i === 3 ? '#ff5d6c' : '#9aa0b2'}">${i === 3 ? '« Autre »' : b}</div></div>`).join('')}
      </div>
      <div class="abs t2" data-at="21" style="left:1000px;top:985px;width:800px">… et une bonne partie finit dans <b class="bad">« Autre »</b>.</div>
      </div>`,
    build(el, st) { st.scan = el.querySelector('.scan'); st.lines = [...el.querySelectorAll('.wl')]; st.bins = [...el.querySelectorAll('.bin')]; },
    update(t, el, st) {
      const sp = prog(t, 3, 8.5);
      st.scan.style.opacity = sp > 0 && sp < 1 ? 1 : 0;
      st.scan.style.top = (sp * 560) + 'px';
      const sm = prog(t, 9, 10);
      st.lines.forEach((l, i) => {
        const on = SAMPLED.has(i) && sm > 0;
        [...l.children].forEach(b => { b.style.background = on ? '#5cc8ff' : (t > 14 ? '#1a1e2a' : '#232838'); b.style.transition = 'background .6s'; });
      });
      const fill = [0.32, 0.22, 0.18, 1];
      st.bins.forEach((b, i) => { b.style.height = (4 + eo(prog(t, 15.5 + i * .3, 23)) * 270 * fill[i]) + 'px'; });
    },
  });

  scene({
    id: 'askllm', ch: 1, dur: 12, title: '« Demandons à un LLM »',
    narr: 'Le réflexe aujourd’hui : « demandons à un LLM ». Mais un corpus ne tient pas dans un LLM.',
    html: `<div class="wrap center gap40">
      <div class="k" data-at="0.4">Le réflexe aujourd’hui</div>
      <div class="d2" data-at="1">« Demandons à un <span class="llm glow-llm">LLM</span>. »</div>
      <div class="d3 bad" data-at="5.5" data-fx="blur">Mais un corpus ne tient pas dans un LLM.</div></div>`,
    draw(ctx, t) { U.drawField(ctx, t); },
  });

  scene({
    id: 'token', ch: 1, dur: 12, title: 'Un token',
    narr: 'Un token, c’est à peu près un morceau de mot. C’est l’unité de ce qu’on paie.',
    html: `<div class="wrap center">
      <div class="k" data-at="0.3">Un token</div>
      <div class="tokword" data-at="1" style="display:flex;gap:0;margin:50px 0;font:700 150px/1 var(--sans);letter-spacing:-.03em">
        <span class="tk" style="padding:10px 18px;border-radius:22px">rem</span><span class="tk" style="padding:10px 18px;border-radius:22px">bourse</span><span class="tk" style="padding:10px 18px;border-radius:22px">ment</span></div>
      <div class="t1" data-at="4">≈ un morceau de mot</div>
      <div class="t1 cost" data-at="6.5" style="margin-top:16px">C’est l’unité de ce qu’on paie.</div>
      <div class="ref" data-at="7.5" style="margin-top:40px">découpage indicatif</div></div>`,
    build(el, st) { st.w = el.querySelector('.tokword'); st.tk = [...el.querySelectorAll('.tk')]; },
    update(t, el, st) {
      const p = eio(prog(t, 2.2, 3.4));
      st.w.style.gap = (p * 26) + 'px';
      const cols = ['#5cc8ff', '#c08cff', '#ffb547'];
      st.tk.forEach((s, i) => { s.style.background = U.rgba(cols[i], .16 * p); s.style.boxShadow = `inset 0 0 0 ${2 * p}px ${U.rgba(cols[i], .7 * p)}`; });
    },
  });

  scene({
    id: 'scale', ch: 1, dur: 26, title: 'L’échelle : corpus vs fenêtre de contexte',
    narr: 'Ordre de grandeur : un million d’avis d’environ cent tokens, c’est environ cent millions de tokens. La fenêtre de contexte des plus grands modèles est passée de quelques milliers de tokens en 2023 à environ un million en 2025–2026. Le corpus reste des ordres de grandeur au-dessus.',
    html: `<div class="wrap">
      <div class="abs col gap16" style="left:160px;top:200px;width:720px">
        <div class="k" data-at="0.4">Ordre de grandeur</div>
        <div class="t1" data-at="1"><span class="mono">1 000 000</span> avis</div>
        <div class="t1" data-at="2.4">× <span class="mono">~100</span> tokens chacun</div>
        <div class="d2 cost glow-cost mono" data-at="4" style="font-size:88px;margin-top:24px">≈ 100 M</div>
        <div class="t2" data-at="4.4">tokens</div>
        <div class="t1" data-at="13" style="margin-top:56px"><span class="good">Fenêtre de contexte</span> des plus grands modèles</div>
        <div class="t2" data-at="13.6"><span class="mono">2023</span> : quelques milliers de tokens<br><span class="mono">2025–2026</span> : ≈ <b class="good">1 million</b></div>
      </div>
      <div class="abs" style="left:1040px;top:200px;width:720px">
        <div class="k" data-at="6" style="margin-bottom:22px">1 carré = 1 million de tokens</div>
        <div class="grid" style="display:grid;grid-template-columns:repeat(10,1fr);gap:9px;width:640px">
          ${Array.from({ length: 100 }, (_, i) => `<i style="display:block;aspect-ratio:1;border-radius:6px;background:#1a1e2a;transition:background .4s,box-shadow .4s;position:relative"></i>`).join('')}
        </div>
      </div>
      <div class="abs d3" data-at="21" style="left:160px;bottom:110px;width:1600px;font-size:62px">Le corpus reste <span class="cost">des ordres de grandeur</span> au-dessus.</div>
    </div>`,
    build(el, st) { st.c = [...el.querySelectorAll('.grid i')]; st.c[0].innerHTML = '<b class="dot" style="position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#fff;opacity:0;transition:opacity .4s"></b>'; },
    update(t, el, st) {
      const n = Math.floor(eo(prog(t, 6.2, 11.5)) * 100);
      st.c.forEach((c, i) => {
        const win = i === 0 && t > 13;
        c.style.background = win ? '#6ef0b0' : (i < n ? 'rgba(255,181,71,.55)' : '#1a1e2a');
        c.style.boxShadow = win ? '0 0 30px rgba(110,240,176,.7)' : 'none';
      });
      st.c[0].firstChild.style.opacity = t > 15 ? 1 : 0;
      st.c[0].firstChild.style.background = '#06070b';
    },
  });

  scene({
    id: 'loop', ch: 1, dur: 20, title: 'La boucle : ce n’est pas la même échelle',
    narr: 'Et ça ne s’arrangera pas tout seul : plus les LLM sont puissants, plus on produit de texte avec eux — résumés, réponses, logs, traces d’agents. Plus on produit de texte, plus il faudrait de gros LLM pour le traiter. Ce n’est pas une course qu’on finira par gagner : ce n’est pas la même échelle.',
    html: `<div class="wrap">
      <svg class="abs" style="left:120px;top:140px" width="820" height="820" viewBox="-410 -410 820 820">
        <circle r="290" fill="none" stroke="#1e2232" stroke-width="3"/>
        <circle class="ring" r="290" fill="none" stroke="url(#lg)" stroke-width="6" stroke-linecap="round" stroke-dasharray="180 1642" transform="rotate(-90)"/>
        <defs><linearGradient id="lg"><stop offset="0" stop-color="#5cc8ff"/><stop offset="1" stop-color="#c08cff"/></linearGradient></defs>
      </svg>
      ${[['LLM plus puissants', 'llm', 0], ['plus de texte produit', 'cost', 1], ['il faudrait de plus gros LLM', 'llm', 2]].map(([txt, c, i]) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 3, x = 530 + Math.cos(a) * 290, y = 550 + Math.sin(a) * 290;
        return `<div class="abs center" data-at="${1 + i * 2.2}" data-fx="pop" style="left:${x - 170}px;top:${y - 70}px;width:340px;height:140px;border-radius:70px;background:#0c0e15;border:2px solid var(--${c});box-shadow:0 0 50px ${c === 'llm' ? 'rgba(192,140,255,.25)' : 'rgba(255,181,71,.22)'}">
          <div class="t1 ${c}" style="font-size:34px;line-height:1.1;padding:0 26px">${txt}</div></div>`;
      }).join('')}
      <div class="abs t3" data-at="3.6" style="left:611px;top:785px;width:340px;text-align:center;font-size:22px">résumés, réponses, logs, traces d’agents</div>
      <div class="abs col gap24" style="left:1120px;top:330px;width:660px">
        <div class="t1" data-at="10">Ce n’est pas une course qu’on finira par gagner.</div>
        <div class="d2" data-at="13.5" data-fx="blur" style="font-size:96px">Ce n’est pas la <span class="cost glow-cost">même échelle</span>.</div>
      </div></div>`,
    build(el, st) { st.r = el.querySelector('.ring'); },
    update(t, el, st) { st.r.setAttribute('stroke-dashoffset', -t * 260 * (1 + t / 14)); },
  });

  /* three naive approaches — drawn on canvas */
  const NV = (() => { const r = rng(21); return {
    docs: Array.from({ length: 110 }, (_, i) => ({ d: i * .09 + r() * .05, x: r(), y: r(), sx: r() })),
    grid: Array.from({ length: 14 * 9 }, (_, i) => ({ s: r() < .12, weak: [17, 52, 88, 101].includes(i) })),
    cards: Array.from({ length: 48 }, () => ({ h: r(), l: [r(), r(), r()], d: r() })),
  }; })();
  const PX = i => 160 + i * 547, PW = 507, VY = 330, VH = 330;
  scene({
    id: 'naive', ch: 1, dur: 48, title: 'Trois façons naïves',
    narr: 'Les trois façons naïves d’appliquer un LLM à un gros corpus échouent chacune à leur manière.\n1. Tout donner à un très gros modèle : ça ne tient pas dans le contexte, et ce qui rentre est dilué.\n2. Le faire travailler sur un échantillon — ce que font beaucoup d’outils et d’agents : quelques lignes de code tirent quelques centaines de documents qui tiennent dans le contexte. Malin, mais ce qui n’est pas tiré au sort n’existe pas : les signaux faibles disparaissent.\n3. Un petit modèle par document : chaque document est traité, mais à la fin on a cent mille résumés, chacun dans ses mots, et toujours aucune vue d’ensemble.',
    html: `<div class="wrap">
      <div class="d3" data-at="0.4" style="font-size:64px">Trois façons naïves <span class="mute">d’appliquer un LLM à un gros corpus</span></div>
      ${[
        ['1', 'Tout donner à un très gros modèle', 'Ça ne tient pas dans le contexte. Et ce qui rentre est <b class="bad">dilué</b>.', 2, 10],
        ['2', 'Travailler sur un échantillon', 'Ce qui n’est pas tiré au sort <b class="bad">n’existe pas</b> : les signaux faibles disparaissent.', 16, 24],
        ['3', 'Un petit modèle par document', '100 000 résumés, chacun dans ses mots. <b class="bad">Aucune vue d’ensemble.</b>', 30, 38],
      ].map(([n, h, o, a, b], i) => `<div class="abs" data-at="${a}" style="left:${PX(i)}px;top:${VY - 70}px;width:${PW}px;height:640px;border-radius:28px;border:1px solid var(--line);background:rgba(255,255,255,.02)"></div>
        <div class="abs" data-at="${a}" style="left:${PX(i) + 34}px;top:${VY + VH + 20}px;width:${PW - 68}px">
          <div class="mono dim" style="font-size:22px">0${n}</div>
          <div class="t1" style="font-size:36px;margin-top:8px">${h}</div>
          <div class="t3" data-at="${b}" style="margin-top:16px;font-size:26px">${o}</div></div>`).join('')}
      <div class="abs t1" data-at="43" style="left:160px;bottom:70px">Chacune échoue <span class="bad">à sa manière</span>.</div>
    </div>`,
    draw(ctx, t) {
      ctx.save();
      const base = ctx.globalAlpha;
      // 1 — the context box overflows
      let u = t - 2;
      if (u > 0) {
        const x0 = PX(0), bx = x0 + PW / 2 - 110, by = VY + 90, bw = 220, bh = 200;
        ctx.globalAlpha = base * clamp(u);
        ctx.strokeStyle = '#6ef0b0'; ctx.lineWidth = 3; ctx.setLineDash([]);
        ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 16); ctx.stroke();
        ctx.fillStyle = '#6ef0b0'; ctx.font = '500 20px "JetBrains Mono",monospace'; ctx.fillText('contexte', bx + 8, by - 12);
        const dil = clamp((u - 8) / 3);
        NV.docs.forEach((d, j) => {
          const p = clamp((u - d.d) / .8); if (p <= 0) return;
          const inside = j < 40;
          const tx = inside ? bx + 14 + (j % 8) * 25 : x0 + 20 + d.sx * (PW - 40);
          const ty = inside ? by + 14 + Math.floor(j / 8) * 37 : VY + VH - 20 - (d.y * 40) - (j % 7) * 4;
          const sx = x0 + 40 + d.x * (PW - 80), sy = VY - 40;
          const e = eio(p);
          ctx.globalAlpha = base * clamp(u) * (inside ? 1 - .7 * dil : .9);
          ctx.fillStyle = inside ? U.mix('#c7cbd6', '#4a5063', dil) : '#ff5d6c';
          ctx.fillRect(lerp(sx, tx, e), lerp(sy, ty, e), 16, 22);
        });
      }
      // 2 — sampling
      u = t - 16;
      if (u > 0) {
        const x0 = PX(1) + 50, cols = 14, gap = (PW - 100) / (cols - 1);
        NV.grid.forEach((g, j) => {
          const cx = x0 + (j % cols) * gap, cy = VY + 20 + Math.floor(j / cols) * 34;
          let a = clamp(u), col = '#9aa0b2', r = 6;
          if (g.weak) { col = '#ff5d6c'; r = 7; }
          if (u > 2.5 && g.s) { col = '#5cc8ff'; r = 8; }
          if (u > 4 && !g.s) a *= 1 - .88 * clamp((u - 4) / 2.5);
          ctx.globalAlpha = base * a;
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.28); ctx.fill();
          if (u > 2.5 && g.s) { ctx.strokeStyle = 'rgba(92,200,255,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 6.28); ctx.stroke(); }
        });
        ctx.globalAlpha = base * clamp(u - .5) * (1 - clamp((u - 5) / 2));
        ctx.fillStyle = '#ff5d6c'; ctx.font = '500 20px "JetBrains Mono",monospace';
        ctx.fillText('● signaux faibles', PX(1) + 50, VY + VH - 6);
        ctx.globalAlpha = base * clamp(u - 3);
        ctx.fillStyle = '#5cc8ff'; ctx.fillText('● tirés au sort', PX(1) + 300, VY + VH - 6);
      }
      // 3 — one summary per document, each in its own words
      u = t - 30;
      if (u > 0) {
        const x0 = PX(2) + 34, cw = 66, ch = 50;
        NV.cards.forEach((c, j) => {
          const p = clamp((u - c.d * 4) / .6); if (p <= 0) return;
          const cx = x0 + (j % 6) * (cw + 8), cy = VY + 6 + Math.floor(j / 6) * (ch - 9);
          ctx.globalAlpha = base * p;
          ctx.fillStyle = '#131623'; ctx.fillRect(cx, cy, cw, ch - 16);
          ctx.fillStyle = `hsl(${Math.floor(c.h * 360)},70%,70%)`;
          c.l.forEach((w, k) => ctx.fillRect(cx + 6, cy + 6 + k * 9, 12 + w * (cw - 24), 4));
        });
      }
      ctx.restore();
    },
  });

  scene({
    id: 'question', ch: 1, dur: 18, title: 'La vraie question',
    narr: 'La vraie question n’est donc pas « que ferais-je avec des tokens illimités ? » mais « comment traiter des corpus qui grossissent, avec le budget que j’ai ? »',
    html: `<div class="wrap" style="display:flex;flex-direction:column;justify-content:center">
      <div class="k" data-at="0.4">La vraie question n’est pas</div>
      <div class="d3" data-at="1.2" style="margin-top:24px"><span data-at="4.5" data-fx="strike">« Que ferais-je avec des tokens illimités ? »</span></div>
      <div class="k" data-at="6.5" style="margin-top:90px">mais</div>
      <div class="d2" data-at="7.5" data-fx="blur" style="margin-top:24px;font-size:96px">« Comment traiter des corpus <span class="ds glow-ds">qui grossissent</span>, avec <span class="cost glow-cost">le budget que j’ai</span> ? »</div>
    </div>`,
  });

  /* ================= 02 CLIO ================= */
  U.chapterCard(2, 'Clio', 'Décembre 2024 · Anthropic');

  scene({
    id: 'clio-intro', ch: 2, dur: 20, title: 'Clio — décembre 2024',
    src: 'Tamkin et al., « Clio: Privacy-Preserving Insights into Real-World AI Use », Anthropic, déc. 2024 — arXiv:2412.13678',
    narr: 'Décembre 2024. Anthropic, l’un des quelques laboratoires qui construisent des modèles de pointe — Claude, utilisé par des millions de personnes — publie un article sur un outil interne : Clio.',
    html: `<div class="wrap" style="display:flex;flex-direction:column;justify-content:center">
      <div class="k" data-at="0.4">Décembre 2024</div>
      <div class="t1" data-at="1.5" style="margin-top:26px"><b>Anthropic</b> publie un article sur un outil interne.</div>
      <div class="t2" data-at="4" style="margin-top:12px;max-width:1300px">L’un des quelques laboratoires qui construisent des modèles de pointe — Claude, utilisé par des millions de personnes.</div>
      <div class="d0" data-at="8.5" data-fx="blur" style="margin-top:50px;font-size:300px;background:linear-gradient(90deg,#5cc8ff,#c08cff);-webkit-background-clip:text;background-clip:text;color:transparent">Clio</div>
    </div>`,
    build(el, st) { st.c = el.querySelector('.d0'); },
    update(t, el, st) { st.c.style.letterSpacing = lerp(.08, -.05, eo(prog(t, 8.5, 12))) + 'em'; },
    draw(ctx, t) { U.drawField(ctx, t); },
  });

  const BUB = (() => { const r = rng(31); return Array.from({ length: 34 * 18 }, (_, i) => ({ i, d: r(), w: .4 + r() * .6, l: 1 + Math.floor(r() * 3), lk: r() })); })();
  function lock(ctx, x, y, s, col) {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .16;
    ctx.beginPath(); ctx.arc(x, y - s * .2, s * .28, Math.PI, 0); ctx.stroke();
    ctx.fillRect(x - s * .4, y - s * .2, s * .8, s * .6);
  }
  scene({
    id: 'clio-problem', ch: 2, dur: 26, title: 'Le problème de Clio',
    narr: 'Leur problème est le cas réel de l’impossibilité technique : des millions de conversations entre Claude et ses utilisateurs. Des objets complexes — longs, désordonnés, souvent sur plusieurs sujets à la fois. Trop nombreuses pour être lues. Et elles ne doivent pas être lues : ce sont des conversations privées. Pourtant, l’entreprise doit comprendre à quoi sert son modèle, ce qui marche, ce qui pose problème.',
    html: `<div class="abs" style="inset:0;background:linear-gradient(90deg,rgba(6,7,11,.97) 0,rgba(6,7,11,.9) 48%,rgba(6,7,11,.2) 75%,transparent)"></div>
      <div class="wrap col gap24" style="justify-content:center;width:1300px">
      <div class="d3" data-at="0.5">Des millions de conversations.</div>
      <div class="t2" data-at="4">Longues, désordonnées, souvent sur plusieurs sujets à la fois.</div>
      <div class="t1" data-at="8">Trop nombreuses pour être lues.</div>
      <div class="d3 bad" data-at="12" style="font-size:64px">Et elles ne <u>doivent</u> pas l’être.</div>
      <div class="t2" data-at="13.5">Ce sont des conversations privées.</div>
      <div class="t1" data-at="18.5" style="margin-top:40px">Pourtant, il faut comprendre&nbsp;:<br><span class="mute">à quoi sert le modèle ? ce qui marche ? ce qui pose problème ?</span></div>
    </div>`,
    draw(ctx, t) {
      ctx.save();
      const base = ctx.globalAlpha;
      const n = Math.floor(eo(prog(t, 0, 7)) * BUB.length);
      for (let j = 0; j < n; j++) {
        const b = BUB[j];
        const cx = 700 + (b.i % 34) * 38, cy = 70 + Math.floor(b.i / 34) * 54;
        if (cx > 1900) continue;
        const lk = clamp((t - 12 - b.lk * 4) / .6);
        ctx.globalAlpha = base * (.5 + .3 * b.d);
        ctx.fillStyle = '#151927';
        ctx.beginPath(); ctx.roundRect(cx, cy, 32, 40, 7); ctx.fill();
        ctx.globalAlpha = base * (.5 + .3 * b.d) * (1 - lk);
        ctx.fillStyle = '#3c4256';
        for (let k = 0; k < b.l; k++) ctx.fillRect(cx + 5, cy + 7 + k * 9, (b.w - k * .15) * 22, 4);
        if (lk > 0) { ctx.globalAlpha = base * lk * .9; lock(ctx, cx + 16, cy + 22, 18, '#ff5d6c'); }
      }
      ctx.restore();
    },
  });

  scene({
    id: 'clio-bridge', ch: 2, dur: 28, title: 'Data science + LLM',
    src: 'Clio, arXiv:2412.13678',
    narr: 'Ce que propose Clio : faire le lien entre la data science et le LLM. La data science trouve la structure du corpus — quels textes se ressemblent, quels groupes se forment. Le LLM donne du sens à cette structure — il nomme et décrit les groupes. L’objectif, dans les mots de l’article : « without the need for human reviewers to read raw conversations » — sans que des relecteurs humains aient besoin de lire les conversations brutes.',
    html: `<div class="wrap">
      <div class="abs col gap8" style="left:160px;top:170px;width:700px" data-at="0.8">
        <div class="k ds">Data science</div>
        <div class="t1">trouve la <b class="ds">structure</b></div>
        <div class="t3">quels textes se ressemblent, quels groupes se forment</div></div>
      <div class="abs col gap8" style="left:1060px;top:170px;width:700px" data-at="6">
        <div class="k llm">LLM</div>
        <div class="t1">lui donne du <b class="llm">sens</b></div>
        <div class="t3">il nomme et décrit les groupes</div></div>
      <div class="abs d2 dim" data-at="5" data-fx="pop" style="left:930px;top:470px">+</div>
      <div class="abs card" data-at="15" style="left:160px;right:160px;bottom:120px;padding:36px 48px">
        <div class="t1" style="font-style:italic">« without the need for human reviewers to read raw conversations »</div>
        <div class="t3" data-at="17.5" style="margin-top:10px">— sans que des relecteurs humains aient besoin de lire les conversations brutes.</div></div>
    </div>`,
    draw(ctx, t) {
      // left: structure appears (data science)
      const tfL = { x: -373, y: 230, s: .62 }, tfR = { x: 567, y: 230, s: .62 };
      U.drawCloud(ctx, { tf: tfL, embed: eo(prog(t, 1, 6)), color: 0, alpha: .9 });
      U.drawCloud(ctx, { tf: tfR, embed: 1, color: 1, halo: .8, alpha: clamp(t - 6), fadeIn: (t - 6) / 2 });
      if (t > 8) {
        ctx.save();
        U.CLUSTERS.forEach((c, k) => {
          const a = clamp((t - 8 - k * .45) / .5); if (a <= 0) return;
          const x = tfR.x + c.x * tfR.s, y = tfR.y + c.y * tfR.s;
          U.pill(ctx, '« … »', x, y - c.s * tfR.s - 8, { font: '500 16px "JetBrains Mono",monospace', alpha: a * (t > 15 ? .35 : 1), h: 28, stroke: U.PAL[k], color: U.PAL[k], bg: 'rgba(12,14,21,.9)' });
        });
        ctx.restore();
      }
    },
  });

  scene({
    id: 'clio-bill', ch: 2, dur: 22, title: 'La facture publiée',
    src: 'Clio, arXiv:2412.13678 — table 3',
    narr: 'La facture publiée : un passage complet sur cent mille conversations coûte quarante-huit dollars quatre-vingt-un. Environ cinq cents dollars pour un million.',
    html: `<div class="wrap center">
      <div class="k" data-at="0.4">La facture publiée</div>
      <div class="t1" data-at="1.4" style="margin-top:30px">Un passage complet sur <b>100 000 conversations</b></div>
      <div class="d0 mono cost glow-cost" data-at="4" data-fx="scale" style="margin:40px 0;font-size:250px;letter-spacing:-.06em"><span data-count="0,48.81" data-c="4,5.5" data-dec="2">0,00</span>&thinsp;$</div>
      <div class="t1" data-at="11">≈ <b class="cost">500 $</b> pour un million.</div></div>`,
    draw(ctx, t) { U.drawField(ctx, t); },
  });

  scene({
    id: 'promise', ch: 2, dur: 12, title: 'La promesse',
    narr: 'La promesse, résumée : comprendre tout un corpus sans le lire en entier.',
    html: `<div class="wrap center">
      <div class="k" data-at="0.3">La promesse</div>
      <div class="d2" data-at="1.2" style="margin-top:40px">Comprendre tout un corpus</div>
      <div class="d2 good glow-good" data-at="3" data-fx="blur">sans le lire en entier.</div></div>`,
    draw(ctx, t) { U.drawCloud(ctx, { tf: { x: -150, y: -50, s: 1.15 }, embed: 1, color: 1, halo: .6, alpha: .18 }); },
  });
})();
