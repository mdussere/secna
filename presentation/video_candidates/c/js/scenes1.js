/* Ouverture, chapitre 1 (L'impasse), chapitre 2 (Clio) */
(function () {
  const K = window.K;
  const { P, EP, IO, lerp, clamp, COL, FONT } = K;

  // =============================================================== OUVERTURE
  K.scene({
    id: 'title', title: 'Ouverture', dur: 30,
    say: "Vos corpus grossissent. Pas votre budget de tokens.\nAvis, tickets, messages, traces : le texte arrive plus vite qu'on ne peut le lire. En vingt minutes : comment comprendre tout un corpus sans le lire en entier.",
    build(root) {
      root.innerHTML = `<div class="full center">
        <div class="kicker" data-in="1" data-out="26">Generative AI Bordeaux · 19 novembre 2026</div>
        <div class="h-xl" data-in="2.2" data-out="26" data-fx="blur" data-d="1.4" style="margin-top:40px">Vos corpus grossissent.</div>
        <div class="h-xl c-cost" data-in="5" data-out="26" data-fx="blur" data-d="1.4" style="margin-top:10px">Pas votre budget de tokens.</div>
        <div class="rule" data-in="9" data-out="26" data-fx="wipe" data-d="1.6" style="width:900px;margin:56px 0 40px"></div>
        <div class="t-l" data-in="10" data-out="26">Michaël Dussère <span class="mute">— GenAI Center of Excellence, Betclic</span></div>
        <div class="t-m mute" data-in="15" data-out="26" style="margin-top:34px">Comprendre tout un corpus <span class="grad b">sans le lire en entier.</span></div>
      </div>`;
      return (t, ctx) => {
        K.rain(ctx, t + 40, { n: 70, alpha: .2 * clamp(t / 2) * (1 - P(t, 26, 3) * .6) });
        const v = ctx.createRadialGradient(960, 520, 100, 960, 520, 820);
        v.addColorStop(0, 'rgba(6,7,11,.92)'); v.addColorStop(.55, 'rgba(6,7,11,.55)'); v.addColorStop(1, 'rgba(6,7,11,0)');
        ctx.fillStyle = v; ctx.fillRect(0, 0, 1920, 1080);
      };
    },
  });

  // =============================================================== 1. L'IMPASSE
  K.chapter(1, "L'impasse", 'Un corpus ne tient pas dans un LLM', "Premier temps : l'impasse.");

  K.scene({
    id: 'flood', chapter: 1, chapName: "L'impasse", title: 'Le texte arrive en continu', dur: 45,
    say: "Toutes les entreprises accumulent du texte : avis clients, tickets de support, messages de vendeurs ou de partenaires, réponses libres aux questionnaires, journaux d'applications, traces d'agents.\nCe texte arrive en continu. Personne ne le lit en entier. On survole, on prend un échantillon, on range à la main dans des catégories décidées il y a longtemps…\n… et une bonne partie finit dans « Autre ».",
    build(root) {
      const src = [['★', 'Avis clients'], ['?', 'Tickets de support'], ['✉', 'Messages vendeurs & partenaires'], ['✎', 'Réponses libres aux questionnaires'], ['≡', "Journaux d'applications"], ['⟳', "Traces d'agents"]];
      const cats = [['Livraison', 22, 14], ['Paiement', 18, 11], ['Compte', 14, 8], ['Produit', 16, 9], ['Autre', 9, 58]];
      root.innerHTML = `
        <div class="abs kicker" style="left:0;right:0;top:200px;text-align:center" data-in=".5" data-out="14">Toutes les entreprises accumulent du texte</div>
        <div class="abs" style="left:260px;right:260px;top:300px;display:flex;flex-wrap:wrap;gap:30px;justify-content:center">
          ${src.map((s, i) => `<div class="chip" data-in="${1.5 + i * 1.1}" data-out="14" data-fx="pop" style="font-size:40px;padding:24px 36px"><span class="c-ds">${s[0]}</span>${s[1]}</div>`).join('')}
        </div>
        <div class="abs t-l mute" style="left:0;right:0;top:720px;text-align:center" data-in="9" data-out="14">… et ce n'est que le début de la liste.</div>

        <div class="abs" style="left:110px;top:170px;width:1400px">
          <div class="h-m" data-in="15.2" data-out="33.5">Ce texte arrive en continu.</div>
          <div class="h-m c-cost" data-in="18.5" data-out="33.5" style="margin-top:14px">Personne ne le lit en entier.</div>
          <div style="margin-top:60px" class="col">
            <div class="t-l" data-in="23" data-out="33.5" data-fx="left">→ on survole</div>
            <div class="t-l" data-in="25" data-out="33.5" data-fx="left" style="margin-top:12px">→ on prend un échantillon</div>
            <div class="t-l" data-in="27" data-out="33.5" data-fx="left" style="margin-top:12px">→ on range à la main, dans des catégories décidées il y a longtemps</div>
          </div>
        </div>
        <div class="abs mono" style="right:110px;top:170px;text-align:right" data-in="15" data-out="33.5">
          <div class="kicker">documents reçus</div><div class="h-s c-cost" id="fl-count" style="margin-top:12px;font-family:var(--f-mono)">0</div></div>

        <div class="abs" style="left:110px;top:150px" data-in="34" data-fx="fade">
          <div class="kicker">Les catégories du formulaire</div></div>
        <div class="abs bars" style="left:110px;top:230px;width:1600px" data-in="34.2">
          ${cats.map((c, i) => `<div class="brow"><div class="blab" ${c[0] === 'Autre' ? 'style="color:var(--cost);font-weight:700"' : ''}>${c[0]}</div><div class="bbar" id="fl-bar${i}" style="width:0"></div></div>`).join('')}
        </div>
        <div class="abs h-s" style="left:110px;top:760px" data-in="39">… et une bonne partie finit dans <span class="c-cost">« Autre »</span>.</div>
        <div class="abs tag" style="right:110px;top:150px" data-in="34.5">illustratif</div>`;
      const cnt = root.querySelector('#fl-count');
      const bars = cats.map((c, i) => root.querySelector('#fl-bar' + i));
      return (t, ctx) => {
        // mur de documents qui se remplit par le bas
        if (t > 14 && t < 35) {
          const a = clamp((t - 14) / 1.5) * (1 - P(t, 33, 1.5));
          const cw = 30, ch = 12, cols = 64, rows = 90;
          const fill = Math.floor(Math.pow(P(t, 14.5, 19), 1.4) * cols * 60);
          const r = K.rng(11);
          for (let i = 0; i < fill; i++) {
            const cx = i % cols, cy = Math.floor(i / cols);
            const x = cx * cw + (cy % 2) * 15 - 10, y = 1080 - (cy + 1) * (ch + 4);
            const fresh = clamp(1 - (fill - i) / 300);
            ctx.globalAlpha = a * (.3 + .6 * fresh) * (.6 + .4 * r());
            ctx.fillStyle = fresh > .5 ? COL.cost : '#7c859a';
            ctx.fillRect(x, y, cw - 6, ch);
          }
          ctx.globalAlpha = 1;
          const g = ctx.createLinearGradient(0, 0, 0, 1080);
          g.addColorStop(0, 'rgba(6,7,11,.95)'); g.addColorStop(.5, 'rgba(6,7,11,.55)'); g.addColorStop(1, 'rgba(6,7,11,0)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
          const n = Math.floor(1200 * Math.exp(.36 * Math.max(0, t - 15)));
          cnt.textContent = K.fmt(Math.min(n, 1250000));
        }
        // barres : « Autre » enfle
        if (t > 34) {
          const g = IO(t, 35, 2.5), grow = IO(t, 38, 5);
          cats.forEach((c, i) => {
            const w = lerp(c[1], c[2], grow) * g;
            bars[i].style.width = (w * 22) + 'px';
            bars[i].style.background = c[0] === 'Autre' ? `linear-gradient(90deg, #8a5a12, ${COL.cost})` : '#39404f';
          });
        }
      };
    },
  });

  K.scene({
    id: 'llm', chapter: 1, chapName: "L'impasse", title: 'Demandons à un LLM', dur: 50,
    say: "Le réflexe aujourd'hui : « demandons à un LLM ». Un token, c'est à peu près un morceau de mot — c'est l'unité de ce qu'on paie.\nUn million d'avis d'une centaine de tokens, c'est environ cent millions de tokens. La fenêtre de contexte des plus grands modèles est passée de quelques milliers de tokens en 2023 à environ un million en 2025-2026.\nLe corpus reste plusieurs ordres de grandeur au-dessus. Un corpus ne tient pas dans un LLM.",
    build(root) {
      const toks = ['Col', 'is', ' jamais', ' arriv', 'é', ',', ' je', ' suis', ' déç', 'ue'];
      root.innerHTML = `
        <div class="full center"><div class="h-xl" data-in=".5" data-out="7" data-fx="blur">« Demandons à un LLM. »</div>
          <div class="t-l mute" data-in="2.5" data-out="7" style="margin-top:30px">le réflexe, aujourd'hui</div></div>
        <div class="full center">
          <div class="kicker" data-in="8" data-out="18.5">Un token</div>
          <div class="h-m" data-in="8.4" data-out="18.5" style="margin-top:20px">≈ un morceau de mot</div>
          <div class="row" style="gap:10px;margin-top:60px">${toks.map((k, i) => `<span class="mono" data-in="${10 + i * .3}" data-out="18.5" data-fx="pop" style="font-size:46px;padding:12px 6px;border-radius:10px;background:${i % 2 ? 'rgba(180,156,255,.18)' : 'rgba(47,224,192,.16)'};border:1px solid ${i % 2 ? 'rgba(180,156,255,.5)' : 'rgba(47,224,192,.45)'};white-space:pre">${k.replace(/ /g, '·')}</span>`).join('')}</div>
          <div class="t-l" data-in="14" data-out="18.5" style="margin-top:60px">C'est <span class="c-cost b">l'unité de ce qu'on paie.</span></div>
        </div>
        <div class="abs" style="left:110px;top:220px;width:820px">
          <div class="kicker" data-in="19.5">Ordre de grandeur</div>
          <div class="h-m" data-in="20" style="margin-top:30px">1 000 000 avis</div>
          <div class="h-m mute" data-in="21.5" style="margin-top:6px">× ~100 tokens</div>
          <div class="rule" data-in="22.6" data-fx="wipe" style="margin:26px 0;width:640px"></div>
          <div class="h-l c-cost mono" style="font-size:80px" data-in="23" data-fx="fade" data-count="100000000" data-cd="2.4" data-pre="≈ ">0</div>
          <div class="t-m mute" data-in="23.2">tokens</div>
          <div class="t-l" data-in="38" style="margin-top:56px">Le corpus reste <span class="c-cost b">plusieurs ordres de grandeur</span> au-dessus.</div>
          <div class="h-s" data-in="43" style="margin-top:34px">Un corpus ne tient pas dans un LLM.</div>
        </div>
        <div class="abs mono t-s" style="left:1050px;top:150px;color:var(--cost)" data-in="25">CORPUS · ~100 M tokens</div>
        <div class="abs src" style="left:1050px;top:985px" data-in="33.5">surfaces à l'échelle · ordres de grandeur</div>`;
      return (t, ctx) => {
        if (t < 24) return;
        const S = 700, x0 = 1050, y0 = 190;
        const pa = IO(t, 24, 3);
        // carré corpus rempli de cellules
        const cells = 50, cs = S / cells, nfill = Math.floor(cells * cells * pa);
        for (let i = 0; i < nfill; i++) {
          const cx = i % cells, cy = Math.floor(i / cells);
          ctx.globalAlpha = .1 + .12 * ((cx * 7 + cy * 13) % 5) / 5;
          ctx.fillStyle = COL.cost; ctx.fillRect(x0 + cx * cs + .5, y0 + cy * cs + .5, cs - 1, cs - 1);
        }
        ctx.globalAlpha = pa; ctx.strokeStyle = COL.cost; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, S, S);
        // fenêtres de contexte (surfaces proportionnelles)
        const w23 = S * Math.sqrt(8000 / 1e8), w25 = S * Math.sqrt(1e6 / 1e8);
        const p23 = EP(t, 29, 1), p25 = EP(t, 33, 1.2);
        ctx.fillStyle = COL.llm; ctx.strokeStyle = COL.llm; ctx.lineWidth = 1.5;
        const lab = (x, y, yr, txt, k) => {
          ctx.globalAlpha = k; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.font = `700 24px ${FONT.mono}`; ctx.fillStyle = COL.llm; ctx.fillText(yr, x, y - 16);
          ctx.font = `400 22px ${FONT.body}`; ctx.fillStyle = '#eef1f6'; ctx.fillText(txt, x, y + 16);
        };
        if (p23 > 0) {
          const x = x0 + 90, y = y0 + 470;
          ctx.globalAlpha = p23; ctx.fillRect(x, y, w23, w23);
          ctx.beginPath(); ctx.arc(x + w23 / 2, y + w23 / 2, 18 + 5 * Math.sin(t * 4), 0, 6.283); ctx.stroke();
          lab(x + 50, y + 3, '2023', 'fenêtre de contexte : quelques milliers de tokens', p23);
        }
        if (p25 > 0) {
          const x = x0 + 60, y = y0 + 220;
          ctx.globalAlpha = p25; ctx.fillStyle = COL.llm; ctx.fillRect(x, y, w25 * p25, w25 * p25);
          lab(x + w25 + 26, y + w25 / 2, '2025–2026', 'fenêtre de contexte : ~1 million de tokens', p25);
        }
      };
    },
  });

  K.scene({
    id: 'spiral', chapter: 1, chapName: "L'impasse", title: "Ce n'est pas la même échelle", dur: 26,
    say: "Et ça ne s'arrangera pas tout seul. Plus les LLM sont puissants, plus on produit de texte avec eux : résumés, réponses, logs, traces d'agents. Plus on produit de texte, plus il faudrait de gros LLM pour le traiter.\nCe n'est pas une course qu'on finira par gagner. Ce n'est pas la même échelle.",
    build(root) {
      const cx = 960, cy = 500, R = 300;
      const node = (a, html, i) => {
        const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        return `<div class="abs center" style="left:${x - 300}px;top:${y - 70}px;width:600px;height:140px" data-in="${1 + i * 2.2}" data-out="13" data-fx="pop">
          <div class="card" style="padding:22px 34px;white-space:nowrap">${html}</div></div>`;
      };
      root.innerHTML = `
        <div class="abs kicker" style="left:0;right:0;top:90px;text-align:center" data-in=".4" data-out="13">Et ça ne s'arrangera pas tout seul</div>
        ${node(-Math.PI / 2, '<div class="h-s c-llm" style="font-size:36px">LLM plus puissants</div>', 0)}
        ${node(Math.PI / 6, '<div class="h-s" style="font-size:36px">plus de texte produit</div><div class="t-s mute">résumés · réponses · logs · traces d\'agents</div>', 1)}
        ${node(5 * Math.PI / 6, '<div class="h-s c-cost" style="font-size:36px">il faudrait de plus gros LLM</div>', 2)}
        <div class="full center">
          <div class="h-m" data-in="13.6" style="max-width:1400px">Ce n'est pas une course qu'on finira par gagner.</div>
          <div class="h-xl c-cost" data-in="17" data-fx="blur" data-d="1.4" style="margin-top:40px">Ce n'est pas la même échelle.</div>
        </div>`;
      return (t, ctx) => {
        const a = clamp(t - .5) * (1 - P(t, 12.6, .8));
        if (a <= 0) return;
        ctx.globalAlpha = a * .5; ctx.strokeStyle = '#3a4152'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
        // flux tournant, de plus en plus rapide
        const sp = .6 + t * .12;
        for (let i = 0; i < 26; i++) {
          const ang = t * sp + i * .24 - Math.PI / 2;
          ctx.globalAlpha = a * (1 - i / 26);
          ctx.fillStyle = i < 3 ? COL.cost : COL.llm;
          ctx.beginPath(); ctx.arc(cx + R * Math.cos(-ang), cy + R * Math.sin(-ang) * -1, 7 - i * .2, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = a * .9; ctx.fillStyle = '#c9cfdb'; ctx.font = `700 90px ${FONT.head}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * sp * .5); ctx.fillText('↻', 0, 0); ctx.restore();
      };
    },
  });

  K.scene({
    id: 'naive', chapter: 1, chapName: "L'impasse", title: 'Trois façons naïves', dur: 54,
    say: "Les trois façons naïves d'appliquer un LLM à un gros corpus échouent chacune à leur manière.\nUn : tout donner à un très gros modèle. Ça ne tient pas dans le contexte, et ce qui rentre est dilué.\nDeux : le faire travailler sur un échantillon — c'est ce que font beaucoup d'outils et d'agents : quelques lignes de code tirent quelques centaines de documents qui tiennent dans le contexte. Malin. Mais ce qui n'est pas tiré au sort n'existe pas : les signaux faibles disparaissent.\nTrois : un petit modèle par document. Chaque document est traité, mais à la fin on a cent mille résumés, chacun dans ses mots, et toujours aucune vue d'ensemble.",
    build(root) {
      const cols = [
        ['Tout donner à un très gros modèle', "Ça ne tient pas dans le contexte — et ce qui rentre est <b>dilué</b>.", 1],
        ['Le faire travailler sur un échantillon', "Malin. Mais ce qui n'est pas tiré au sort <b>n'existe pas</b> : les signaux faibles disparaissent.", 18],
        ['Un petit modèle par document', "100 000 résumés, chacun dans ses mots — et <b>toujours aucune vue d'ensemble</b>.", 35],
      ];
      root.innerHTML = `<div class="abs kicker" style="left:110px;top:70px" data-in=".3">Trois façons naïves d'appliquer un LLM à un gros corpus</div>` +
        cols.map((c, i) => {
          const x = 110 + i * 590;
          return `<div class="abs" style="left:${x}px;top:140px;width:540px">
            <div class="h-l c-mute" data-in="${c[2]}" style="color:var(--dim)">${i + 1}</div>
            <div class="h-s" data-in="${c[2] + .4}" style="font-size:40px;height:100px;margin-top:6px">${c[0]}</div>
            ${i === 1 ? `<div class="t-s mute" data-in="${c[2] + 1.5}" style="position:absolute;top:205px">ce que font beaucoup d'outils et d'agents</div>` : ''}
            <div class="t-m" data-in="${c[2] + 8}" style="position:absolute;top:650px;width:520px;color:#c9cfdb">${c[1]}</div>
            <div class="stamp" data-in="${c[2] + 12}" data-fx="pop" data-d=".5" style="left:110px;top:-8px;font-size:110px">✕</div>
          </div>`;
        }).join('');
      const r = K.rng(4);
      const docs = Array.from({ length: 140 }, (_, i) => ({ x: r(), d: r(), w: .6 + r() * .4 }));
      const grid = Array.from({ length: 22 * 14 }, (_, i) => ({ s: r() < .09, rare: r() < .03, j: r() }));
      const sums = Array.from({ length: 220 }, () => ({ x: r(), y: r(), w: .3 + r() * .7, h: Math.floor(r() * 360), ang: (r() - .5) * .5 }));
      return (t, ctx) => {
        const top = 390, hh = 300;
        // 1. débordement de contexte
        if (t > 1.5) {
          const x0 = 110, lt = t - 2;
          const bx = x0 + 120, by = top + 90, bw = 300, bh = 200;
          ctx.strokeStyle = COL.llm; ctx.lineWidth = 2; ctx.globalAlpha = clamp(lt);
          ctx.strokeRect(bx, by, bw, bh);
          ctx.fillStyle = COL.llm; ctx.font = `500 16px ${FONT.mono}`; ctx.fillText('fenêtre de contexte', bx, by + bh + 26);
          const cap = 48;
          docs.forEach((d, i) => {
            const t0 = i * .09, u = lt - t0; if (u < 0) return;
            let x, y, col = '#9aa3b8', a = 1;
            if (i < cap) {
              const sx = bx + 10 + (i % 8) * 36, sy = by + bh - 22 - Math.floor(i / 8) * 30;
              const k = clamp(u / 1.1); x = lerp(bx + d.x * bw, sx, k); y = lerp(top - 60, sy, ease(k));
              a = lerp(1, .25 + .5 * (1 - i / cap) * (1 - clamp((lt - 6) / 4)), clamp(lt - 4));
            } else {
              const k = clamp(u / .9); x = bx + d.x * bw; y = lerp(top - 60, by - 14, ease(k));
              if (u > .9) { const s = u - .9, dir = d.x < .5 ? -1 : 1; x += dir * s * 90; y += s * s * 220; col = COL.bad; a = clamp(1 - (s - 1.2)); }
            }
            ctx.globalAlpha = Math.max(0, a) * clamp(lt) * (1 - P(t, 17.5, .5) * 0); ctx.fillStyle = col;
            ctx.fillRect(x, y, 28, 18);
          });
        }
        // 2. échantillon
        if (t > 18.5) {
          const lt = t - 19, x0 = 700, gx = 22, gy = 14, cs = 23;
          grid.forEach((g, i) => {
            const cx = i % gx, cy = Math.floor(i / gx);
            const x = x0 + 20 + cx * cs, y = top + 10 + cy * cs;
            const appear = clamp((lt - (cx + cy) * .03) * 2);
            const picked = g.s && lt > 3;
            const fade = lt > 7 && !g.s ? clamp((lt - 7 - g.j) / 1.5) : 0;
            let col = g.rare ? COL.bad : '#7b8396', R = 4.5;
            if (picked) { col = COL.ds; R = 6.5; }
            ctx.globalAlpha = appear * (1 - fade * .92); ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
            if (g.rare && lt > 5 && lt < 9.5) { ctx.globalAlpha = .7 * (1 - fade); ctx.strokeStyle = COL.bad; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 12 + 3 * Math.sin(t * 5), 0, 6.283); ctx.stroke(); }
          });
          if (lt > 3) { ctx.globalAlpha = clamp(lt - 3) * .9; ctx.fillStyle = COL.ds; ctx.font = `500 16px ${FONT.mono}`; ctx.fillText('tiré au sort', x0 + 20, top + 345); }
          if (lt > 5) { ctx.globalAlpha = clamp(lt - 5) * (1 - clamp(lt - 9)); ctx.fillStyle = COL.bad; ctx.fillText('signaux faibles', x0 + 200, top + 345); }
        }
        // 3. un résumé par document
        if (t > 35.5) {
          const lt = t - 36, x0 = 1290, w = 520;
          sums.forEach((s, i) => {
            const a = clamp((lt - i * .025) * 2); if (a <= 0) return;
            const spread = clamp((lt - 2) / 5);
            const x = x0 + lerp(w / 2, 20 + s.x * (w - 120), spread), y = top + lerp(hh / 2, 10 + s.y * (hh - 20), spread);
            ctx.save(); ctx.translate(x, y); ctx.rotate(s.ang * spread);
            ctx.globalAlpha = a * .8; ctx.fillStyle = `hsl(${s.h},55%,62%)`;
            ctx.fillRect(0, 0, 30 + s.w * 70, 4); ctx.fillRect(0, 8, 20 + s.w * 40, 4);
            ctx.restore();
          });
          if (lt > 6) { ctx.globalAlpha = clamp(lt - 6); ctx.fillStyle = COL.cost; ctx.font = `600 22px ${FONT.mono}`; ctx.fillText('100 000 résumés', x0 + 10, top + 345); }
        }
        function ease(k) { return k * k; }
      };
    },
  });

  K.scene({
    id: 'question', chapter: 1, chapName: "L'impasse", title: 'La vraie question', dur: 20,
    say: "La vraie question n'est donc pas : que ferais-je avec des tokens illimités ?\nC'est : comment traiter des corpus qui grossissent, avec le budget que j'ai ?",
    build(root) {
      root.innerHTML = `<div class="full center">
        <div class="kicker" data-in=".4">La vraie question</div>
        <div class="h-m mute" data-in="1.2" style="margin-top:40px"><span style="position:relative;display:inline-block">« Que ferais-je avec des tokens illimités ? »<i class="strike" data-in="5" data-fx="wipe" data-d=".8"></i></span></div>
        <div class="h-l" data-in="7.5" style="margin-top:90px;max-width:1600px">Comment traiter des corpus qui grossissent,</div>
        <div class="h-l c-cost" data-in="9.5" style="margin-top:10px">avec le budget que j'ai ?</div>
      </div>`;
    },
  });

  // =============================================================== 2. CLIO
  K.chapter(2, 'Clio', "Le cas réel de l'impossibilité technique", 'Deuxième temps : Clio.');

  K.scene({
    id: 'clio', chapter: 2, chapName: 'Clio', title: 'Des millions de conversations', dur: 40,
    say: "Décembre 2024. Anthropic — l'un des quelques laboratoires qui construisent des modèles de pointe, Claude, utilisé par des millions de personnes — publie un article sur un outil interne : Clio.\nLeur problème, c'est le cas réel de l'impossibilité technique : des millions de conversations entre Claude et ses utilisateurs. Longues, désordonnées, souvent sur plusieurs sujets à la fois. Trop nombreuses pour être lues.\nEt elles ne doivent pas l'être : ce sont des conversations privées. Pourtant, l'entreprise doit comprendre à quoi sert son modèle, ce qui marche, ce qui pose problème.",
    build(root) {
      root.innerHTML = `
        <div class="full center">
          <div class="h-m mute mono" data-in=".5" data-out="11.5" style="font-size:52px">Décembre 2024</div>
          <div class="t-l" data-in="2.5" data-out="11.5" style="margin-top:30px">Anthropic publie un article sur un outil interne</div>
          <div class="h-xxl c-llm" data-in="4.6" data-out="11.5" data-fx="blur" data-d="1.5" style="margin-top:20px">Clio</div>
          <div class="t-m mute" data-in="7" data-out="11.5" style="margin-top:30px;max-width:1200px">Anthropic : l'un des quelques laboratoires qui construisent des modèles de pointe — Claude, utilisé par des millions de personnes.</div>
        </div>
        <div class="abs" style="left:110px;top:620px;width:1600px">
          <div class="h-l" data-in="12.5" data-out="33">Des millions de conversations.</div>
          <div class="t-l mute" data-in="15.5" data-out="33" style="margin-top:16px">longues · désordonnées · souvent sur plusieurs sujets à la fois</div>
          <div class="h-s c-cost" data-in="19.5" data-out="24.5" style="margin-top:40px">Trop nombreuses pour être lues.</div>
        </div>
        <div class="abs h-s" style="left:110px;top:940px" data-in="24.8" data-out="33">Et elles <span class="c-bad">ne doivent pas</span> l'être : ce sont des conversations privées.</div>
        <div class="abs center" style="left:860px;top:250px;width:200px;height:200px" data-in="25" data-out="33" data-fx="pop">
          <svg width="150" height="170" viewBox="0 0 150 170"><path d="M40 75 V50 a35 35 0 0 1 70 0 V75" fill="none" stroke="#ff5d6c" stroke-width="12"/><rect x="20" y="72" width="110" height="88" rx="16" fill="#ff5d6c"/><circle cx="75" cy="112" r="11" fill="#06070b"/></svg></div>
        <div class="full center">
          <div class="kicker" data-in="33.6">Pourtant, il faut comprendre</div>
          <div class="h-m" data-in="34.2" style="margin-top:34px">à quoi sert le modèle ·
            <span class="c-ok">ce qui marche</span> · <span class="c-bad">ce qui pose problème</span></div>
        </div>`;
      const r = K.rng(21);
      const B = Array.from({ length: 900 }, (_, i) => ({ c: i % 36, rw: Math.floor(i / 36), l1: .4 + r() * .6, l2: .2 + r() * .7, l3: r() < .5 ? r() : 0, me: r() < .5, d: r() }));
      return (t, ctx) => {
        if (t < 11.5 || t > 33.5) return;
        const a = clamp((t - 11.5) / 1.5) * (1 - P(t, 32.5, 1));
        const priv = IO(t, 24.5, 1.5);
        const scroll = (t - 11.5) * 14;
        B.forEach(b => {
          const x = 10 + b.c * 54 + (b.rw % 2) * 20, y = ((b.rw * 44 - scroll) % 1100 + 1100) % 1100 - 20;
          const appear = clamp((t - 11.8 - b.d * 3) * 1.5);
          if (appear <= 0) return;
          ctx.globalAlpha = a * appear * (.16 + .18 * b.d) * (1 - priv * .35);
          ctx.fillStyle = b.me ? '#8f9bb5' : COL.llm;
          K.rrect(ctx, x, y, 44, 32, 7); ctx.fill();
          ctx.globalAlpha *= 1 - priv;
          ctx.fillStyle = '#06070b';
          ctx.fillRect(x + 6, y + 7, 32 * b.l1, 3); ctx.fillRect(x + 6, y + 14, 32 * b.l2, 3); if (b.l3) ctx.fillRect(x + 6, y + 21, 32 * b.l3, 3);
        });
        ctx.globalAlpha = 1;
        const g = ctx.createLinearGradient(0, 560, 0, 1080);
        g.addColorStop(0, 'rgba(6,7,11,0)'); g.addColorStop(.25, 'rgba(6,7,11,.9)'); g.addColorStop(1, 'rgba(6,7,11,.95)');
        ctx.fillStyle = g; ctx.fillRect(0, 560, 1920, 520);
        // compteur
        ctx.globalAlpha = a; ctx.fillStyle = COL.mute; ctx.font = `500 20px ${FONT.mono}`; ctx.textAlign = 'right';
        ctx.fillText('conversations : des millions', 1810, 620);
      };
    },
  });

  K.scene({
    id: 'bridge', chapter: 2, chapName: 'Clio', title: 'Data science + LLM', dur: 34,
    say: "Ce que propose Clio : faire le lien entre la data science et le LLM.\nLa data science trouve la structure du corpus : quels textes se ressemblent, quels groupes se forment. Le LLM donne du sens à cette structure : il nomme et décrit les groupes.\nL'objectif, dans les mots de l'article : « without the need for human reviewers to read raw conversations » — sans que des relecteurs humains aient besoin de lire les conversations brutes.",
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" style="left:0;right:0;top:100px;text-align:center" data-in=".3" data-out="14.5">Ce que propose Clio : faire le lien</div>
        <div class="abs card" style="left:150px;top:300px;width:560px" data-in="1" data-out="14.5" data-fx="left">
          <div class="kicker c-ds">Data science</div>
          <div class="h-m" style="margin:20px 0">trouve la <span class="c-ds">structure</span></div>
          <div class="t-m mute">quels textes se ressemblent,<br>quels groupes se forment</div></div>
        <div class="abs card" style="left:1210px;top:300px;width:560px" data-in="4" data-out="14.5" data-fx="right">
          <div class="kicker c-llm">LLM</div>
          <div class="h-m" style="margin:20px 0">lui donne du <span class="c-llm">sens</span></div>
          <div class="t-m mute">il nomme et décrit<br>les groupes</div></div>
        <div class="full center" style="padding:0 220px">
          <div class="h-m it" data-in="15.5" data-fx="blur" data-d="1.4" style="line-height:1.2">“without the need for human reviewers<br>to read raw conversations”</div>
          <div class="t-l mute" data-in="19" style="margin-top:40px">— sans que des relecteurs humains aient besoin de lire les conversations brutes.</div>
          <div class="src" data-in="21.5" style="margin-top:60px">Tamkin et al., « Clio: Privacy-Preserving Insights into Real-World AI Use », Anthropic, déc. 2024 — arXiv:2412.13678</div>
        </div>`;
      const r = K.rng(9);
      const parts = Array.from({ length: 120 }, () => ({ o: r(), y: (r() - .5) * 120, h: Math.floor(r() * 6) }));
      const hues = [165, 300, 40, 210, 120, 260];
      return (t, ctx) => {
        if (t < 6 || t > 15) return;
        const a = clamp(t - 6) * (1 - P(t, 14, .6));
        parts.forEach(p => {
          const u = ((t - 6) * .25 + p.o) % 1;
          const x = 720 + u * 480, y = 470 + p.y * Math.sin(u * Math.PI) - 80 * Math.sin(u * Math.PI);
          ctx.globalAlpha = a * Math.sin(u * Math.PI) * .9;
          ctx.fillStyle = u < .5 ? '#8b93a7' : `hsl(${hues[p.h]},75%,64%)`;
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 6.283); ctx.fill();
        });
      };
    },
  });

  K.scene({
    id: 'bill', chapter: 2, chapName: 'Clio', title: 'La facture publiée', dur: 28,
    say: "Et l'article publie la facture : un passage complet sur cent mille conversations coûte quarante-huit dollars quatre-vingt-un. Environ cinq cents dollars pour un million.",
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" style="left:160px;top:150px" data-in=".3">La facture publiée</div>
        <div class="abs" style="left:160px;top:260px;width:700px">
          <div class="t-l mute" data-in="1">Un passage complet sur</div>
          <div class="h-l mono" style="font-size:110px;margin-top:20px" data-in="1.4" data-fx="fade" data-count="100000" data-cd="2.5">0</div>
          <div class="h-s" data-in="2" style="margin-top:6px">conversations</div>
        </div>
        <div class="abs card" style="left:1000px;top:200px;width:760px;padding:50px 56px" data-in="5" data-fx="pop">
          <div class="kicker">Total</div>
          <div class="mono c-cost" style="font:700 190px/1 var(--f-head);letter-spacing:-.04em;margin-top:24px" data-in="5.6" data-fx="fade" data-count="48.81" data-dec="2" data-cd="2.6" data-suf=" $">0</div>
          <div class="rule" style="margin:40px 0 30px" data-in="9" data-fx="wipe"></div>
          <div class="t-l" data-in="11">≈ <b>500 $</b> pour un million</div>
          <div class="t-m mute" data-in="14" style="margin-top:12px">moins d'un dixième de centime par conversation</div>
        </div>
        <div class="abs src" style="left:160px;top:960px" data-in="16">Source : Clio, arXiv:2412.13678, table 3</div>`;
    },
  });

  K.scene({
    id: 'promise', chapter: 2, chapName: 'Clio', title: 'La promesse', dur: 14,
    say: "La promesse, résumée : comprendre tout un corpus sans le lire en entier.",
    build(root) {
      root.innerHTML = `<div class="full center">
        <div class="kicker" data-in=".4">La promesse</div>
        <div class="h-xl" data-in="1.2" data-fx="blur" data-d="1.4" style="margin-top:50px">Comprendre tout un corpus</div>
        <div class="h-xl grad" data-in="3" data-fx="blur" data-d="1.4" style="margin-top:14px">sans le lire en entier.</div></div>`;
      return (t, ctx) => K.rain(ctx, t, { n: 60, alpha: .14, speed: .5, seed: 8 });
    },
  });
})();
