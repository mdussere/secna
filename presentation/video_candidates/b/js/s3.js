/* 03 SECNA — the five steps */
(function () {
  'use strict';
  const { clamp, lerp, prog, eo, eio } = U;
  const SRC = 'Coûts : Clio, arXiv:2412.13678 — table 3 (passage complet sur 100 000 conversations)';

  U.chapterCard(3, 'SECNA', 'La recette de Clio, en cinq étapes');

  const STEPS = [
    ['S', 'Summarise', 'préparer', 'llm'], ['E', 'Embed', 'projeter', 'ds'], ['C', 'Cluster', 'regrouper', 'ds'],
    ['N', 'Name', 'nommer', 'llm'], ['A', 'Aggregate', 'ranger', 'ds'],
  ];
  scene({
    id: 'acronym', ch: 3, dur: 20, title: 'S · E · C · N · A',
    narr: 'La recette de Clio tient en cinq étapes : Summarise, Embed, Cluster, Name, Aggregate. Le domaine n’a pas de nom canonique pour cette recette ; le nom SECNA est inventé pour ce talk. Et la recette n’est pas la mienne : c’est celle de Clio.',
    html: `<div class="wrap center">
      <div class="t1" data-at="0.4">La recette de Clio tient en <b>cinq étapes</b>.</div>
      <div style="display:flex;gap:40px;margin-top:70px">
        ${STEPS.map(([L, w, f, c], i) => `<div data-at="${1.8 + i * 1.1}" data-fx="pop" style="width:270px;text-align:center">
          <div class="${c} glow-${c}" style="font:800 230px/0.9 var(--sans);letter-spacing:-.04em">${L}</div>
          <div class="t1" style="margin-top:20px;font-size:38px">${w}</div>
          <div class="t3">${f}</div></div>`).join('')}
      </div>
      <div style="display:flex;gap:30px;margin-top:50px" data-at="8.5">
        <span class="chip llm">● étape LLM</span><span class="chip ds">● data science</span></div>
      <div class="t3" data-at="12" style="margin-top:50px">Le nom <b>SECNA</b> est inventé pour ce talk. La recette, elle, est <b>celle de Clio</b>.</div>
    </div>`,
    draw(ctx, t) { U.drawField(ctx, t, .7); },
  });

  /* helper to build the left column + cost tag shared by the step scenes */
  const stepLeft = (L, title, cost) => `
    <div class="abs col gap24" style="left:160px;top:170px;width:640px">${title}</div>
    <div class="abs" data-at="${cost.at}" style="left:160px;bottom:120px;width:640px">
      <div class="k" style="font-size:19px">coût chez Clio · 100 000 conversations</div>
      <div class="mono cost glow-cost" style="font:700 96px/1.1 var(--mono);margin-top:10px">${cost.v}</div>
      <div class="t3" style="margin-top:6px">${cost.sub}</div></div>`;

  scene({
    id: 'S', cls: 'steps', ch: 3, dur: 36, title: 'S — Summarise', rail: 'S', src: SRC, illus: true,
    narr: 'S — Summarise, préparer. Un LLM relit chaque document et en extrait l’essentiel : il résume, traduit, efface la forme, fait ressortir les éléments porteurs de sens. Clio extrait quelques attributs par conversation, dont un résumé de la demande. Chez Clio, cette étape sert aussi à protéger la confidentialité et à choisir l’angle d’analyse.\nCoût : quarante-cinq dollars, avec le plus petit modèle de l’époque, Claude 3 Haiku. Quatre-vingt-douze pour cent de la facture. Une fois par document.',
    html: `<div class="wrap">
      ${stepLeft('S', `
        <div class="k llm" data-at="0.3">S · Summarise — préparer</div>
        <div class="d3" data-at="1">Un LLM relit <span class="llm">chaque</span> document.</div>
        <div class="t2" data-at="4">il <b>résume</b>, il <b>traduit</b>,</div>
        <div class="t2" data-at="6" style="margin-top:4px">il <b>efface la forme</b>,</div>
        <div class="t2" data-at="8" style="margin-top:4px">il fait ressortir <b>ce qui porte le sens</b>.</div>
        <div class="t3" data-at="15" style="margin-top:40px">Chez Clio : quelques attributs par conversation, dont un résumé de la demande. L’étape protège aussi la confidentialité et choisit l’angle d’analyse.</div>`,
      { at: 22, v: '45,00 $', sub: '<b class="cost">92 % de la facture</b> · une fois par document · le plus petit modèle de l’époque (Claude 3 Haiku)' })}
      <div class="abs card mono raw" data-at="2" style="left:930px;top:190px;width:830px;padding:30px 34px;font-size:22px;line-height:1.55;color:#c7cbd6">
        <div class="k" style="font-size:16px;margin-bottom:14px">document brut</div>
        bonjour alors voilà j’ai commandé il y a 3 semaines (commande 4471) et toujours RIEN… hello?? still nothing, tracking says “in transit” since march 2nd!!! et en plus l’appli plante dès que j’essaie de contacter le SAV, merci de me répondre svp c’est la 3e fois que j’écris
      </div>
      <div class="abs center" data-at="5" data-fx="pop" style="left:1260px;top:540px;width:170px;height:70px">
        <span class="chip llm" style="font-size:22px">↓ LLM</span></div>
      <div class="abs card" data-at="7" style="left:930px;top:640px;width:830px;padding:30px 34px;border-color:rgba(192,140,255,.4);box-shadow:0 0 60px rgba(192,140,255,.12)">
        <div class="k llm" style="font-size:16px;margin-bottom:16px">préparé</div>
        <div class="mono" style="font-size:24px;line-height:1.7">
          <div><span class="dim">demande  </span><span data-type="7.5,3">suivi d’une commande jamais livrée</span></div>
          <div><span class="dim">         </span><span data-type="10.5,2">+ bug de l’appli au contact du SAV</span></div>
          <div><span class="dim">langue   </span><span data-type="12.5,1">fr · en → fr</span></div>
          <div><span class="dim">ton      </span><span data-type="13.5,1">agacé</span></div></div></div>
    </div>`,
    update(t, el) { el.querySelector('.raw').style.opacity = t > 7 && t < 35 ? (t > 13.5 ? .35 : 1) : ''; },
  });

  const PH = [
    { txt: '« colis jamais arrivé »', k: 0, from: [380, 700] },
    { txt: '« livraison en retard »', k: 1, from: [420, 790] },
    { txt: '« super appli, merci »', k: 8, from: [460, 880] },
  ];
  // pick a landing point near each cluster centre
  PH.forEach(p => { const c = U.CLUSTERS[p.k]; p.to = [c.x + (p.k === 0 ? 25 : p.k === 1 ? -20 : 0), c.y + (p.k === 0 ? -15 : p.k === 1 ? 20 : 0)]; });

  scene({
    id: 'E', cls: 'steps', ch: 3, dur: 34, title: 'E — Embed', rail: 'E', src: SRC,
    narr: 'E — Embed, projeter. Un petit modèle de langage, un modèle d’embedding, transforme chaque texte en un point dans un espace. Deux textes qui veulent dire la même chose atterrissent tout près l’un de l’autre : « colis jamais arrivé » et « livraison en retard » — des mots différents, le même sens. Le sens devient de la géométrie. Coût : quelques centimes ; ça peut tourner en local.',
    html: `<div class="wrap">
      ${stepLeft('E', `
        <div class="k ds" data-at="0.3">E · Embed — projeter</div>
        <div class="d3" data-at="1">Chaque texte devient <span class="ds">un point</span>.</div>
        <div class="t2" data-at="3.5">Un petit modèle de langage — un modèle d’<i>embedding</i> — le place dans un espace.</div>
        <div class="t1" data-at="18" style="margin-top:30px">Même sens → <span class="ds">tout près</span>.</div>
        <div class="t3" data-at="19">Des mots différents, le même sens.</div>`,
      { at: 27, v: '≈ 0 $', sub: 'quelques centimes · peut tourner en local' })}
      <div class="abs d3 ds glow-ds" data-at="23" style="left:900px;bottom:70px;font-size:56px">Le sens devient de la géométrie.</div>
    </div>`,
    draw(ctx, t) {
      U.drawCloud(ctx, { embed: eo(prog(t, 4, 13)), color: 0 });
      ctx.save();
      PH.forEach((p, i) => {
        const a = clamp((t - 13 - i * .6) / .5); if (a <= 0) return;
        const m = eio(prog(t, 14.5 + i * .5, 17 + i * .5));
        const x = lerp(p.from[0] + 520, p.to[0], m), y = lerp(p.from[1] - 60, p.to[1], m);
        ctx.globalAlpha *= 1;
        if (m < 1) U.pill(ctx, p.txt, x, y, { alpha: a, stroke: '#5cc8ff', color: '#f3f4f8' });
        else {
          ctx.save(); ctx.globalAlpha *= a;
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.28); ctx.fill();
          ctx.strokeStyle = 'rgba(92,200,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 16 + Math.sin(t * 3) * 2, 0, 6.28); ctx.stroke();
          ctx.restore();
          const lx = p.k === 8 ? x - 40 : (p.k === 0 ? x - 60 : x + 40), ly = p.k === 1 ? y - 60 : (p.k === 0 ? y + 60 : y - 56);
          U.pill(ctx, p.txt, lx, ly, { alpha: a, stroke: 'rgba(92,200,255,.6)', font: '500 21px "Inter Tight",sans-serif', h: 40 });
        }
      });
      const near = clamp((t - 18) / .6);
      if (near > 0) {
        const A = PH[0].to, B = PH[1].to, C = PH[2].to;
        ctx.save(); ctx.globalAlpha *= near; ctx.setLineDash([6, 8]); ctx.lineWidth = 2;
        ctx.strokeStyle = '#6ef0b0'; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = '600 22px "JetBrains Mono",monospace';
        ctx.fillStyle = '#6ef0b0'; ctx.fillText('tout près', (A[0] + B[0]) / 2 - 140, (A[1] + B[1]) / 2 - 6);
        ctx.fillStyle = '#9aa0b2'; ctx.fillText('loin', (B[0] + C[0]) / 2 + 14, (B[1] + C[1]) / 2);
        ctx.restore();
      }
      ctx.restore();
    },
  });

  scene({
    id: 'C', cls: 'steps', ch: 3, dur: 28, title: 'C — Cluster', rail: 'C', src: SRC,
    narr: 'C — Cluster, regrouper. Les points proches forment des groupes. Quelques points restent isolés. Pas de LLM : du calcul pur. C’est ici que la structure est trouvée. Coût : zéro — aucun token.',
    html: `<div class="wrap">
      ${stepLeft('C', `
        <div class="k ds" data-at="0.3">C · Cluster — regrouper</div>
        <div class="d3" data-at="1">Les points proches forment <span class="ds">des groupes</span>.</div>
        <div class="t2" data-at="9">Quelques-uns restent isolés.</div>
        <div class="t1" data-at="12.5" style="margin-top:30px">Pas de LLM : <b>du calcul pur</b>.</div>
        <div class="t2" data-at="16">C’est ici que <b class="ds">la structure</b> est trouvée.</div>`,
      { at: 20, v: '0 $', sub: 'aucun token' })}
    </div>`,
    draw(ctx, t) {
      const col = eo(prog(t, 2, 9));
      U.drawCloud(ctx, { embed: 1, color: col, halo: col });
      const o = clamp((t - 9) / .8);
      if (o > 0) {
        ctx.save(); ctx.globalAlpha *= o;
        let first = null;
        U.CLOUD.forEach(p => {
          if (p.k >= 0) return;
          ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, 6.28); ctx.stroke();
          if (!first && p.x > 1250 && p.x < 1450 && p.y > 220 && p.y < 300) first = p;
        });
        if (first) { ctx.fillStyle = '#c7cbd6'; ctx.font = '500 22px "JetBrains Mono",monospace'; ctx.fillText('← isolé', first.x + 16, first.y + 7); }
        ctx.restore();
      }
    },
  });

  scene({
    id: 'N', cls: 'steps', ch: 3, dur: 32, title: 'N — Name', rail: 'N', src: SRC, illus: true,
    narr: 'N — Name, nommer. Pour chaque groupe, un LLM lit quelques exemples et donne au groupe un nom et une description. Le LLM n’est plus appelé une fois par document, mais une fois par groupe : au lieu de cent mille appels, quelques milliers. Coût : trois dollars soixante-quinze, avec un modèle plus gros, Claude 3.5 Sonnet.',
    html: `<div class="wrap">
      ${stepLeft('N', `
        <div class="k llm" data-at="0.3">N · Name — nommer</div>
        <div class="d3" data-at="1">Un LLM lit <span class="llm">quelques exemples</span> par groupe…</div>
        <div class="t1" data-at="3.5">… et lui donne un nom et une description.</div>
        <div class="t2" data-at="15" style="margin-top:36px">Une fois <b>par groupe</b>, plus une fois par document :</div>
        <div class="t1 mono" style="font-size:40px"><span data-at="16" data-fx="fade" style="display:inline-block"><span data-at="17.5" data-fx="strike">100 000 appels</span></span>  <span class="good" data-at="18.5" style="display:inline-block">→ quelques milliers</span></div>`,
      { at: 22, v: '3,75 $', sub: 'un modèle plus gros (Claude 3.5 Sonnet)' })}
      ${U.CLUSTERS.map((c, k) => `<div class="abs" data-at="${5 + k * 1.05}" data-fx="pop" style="left:${c.x + c.lx}px;top:${c.y + c.ly}px;transform-origin:center;translate:-50% -50%;white-space:nowrap;padding:10px 18px;border-radius:100px;background:rgba(12,14,21,.92);border:1.5px solid ${U.PAL[k]};box-shadow:0 0 30px ${U.rgba(U.PAL[k], .3)};font:600 23px/1 var(--sans);color:${U.PAL[k]}">${c.name}</div>`).join('')}
    </div>`,
    draw(ctx, t) {
      U.drawCloud(ctx, { embed: 1, color: 1, halo: .9 });
      // "reading" lines from a few examples to the label being written
      ctx.save();
      U.CLUSTERS.forEach((c, k) => {
        const u = t - (4 + k * 1.05);
        const a = clamp(u / .3) * (1 - clamp((u - 1.4) / .5));
        if (a <= 0) return;
        const pts = U.CLOUD.filter(p => p.k === k).slice(0, 6);
        ctx.globalAlpha = a;
        ctx.strokeStyle = U.PAL[k]; ctx.lineWidth = 1.5;
        pts.forEach(p => {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(c.x + c.lx, c.y + c.ly); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 6.28); ctx.fill();
        });
      });
      ctx.restore();
    },
  });

  /* A — zoomable treemap. Only the Écriture path comes from Clio; the rest is placeholder. */
  const R = { x: 900, y: 200, w: 860, h: 640 };
  const L0 = [
    { r: [0, 0, .5, .5], label: 'Écriture', hot: true },
    { r: [.5, 0, .5, .3] }, { r: [.5, .3, .25, .2] }, { r: [.75, .3, .25, .2] },
    { r: [0, .5, .35, .5] }, { r: [.35, .5, .4, .5] }, { r: [.75, .5, .25, .5] },
  ];
  const sub = (P, r) => [P[0] + r[0] * P[2], P[1] + (.12 + r[1] * .88) * P[3], r[2] * P[2], r[3] * .88 * P[3]];
  const E = L0[0].r;
  const L1 = [{ r: [0, 0, .5, .5], label: 'Rédaction de contenus', hot: true }, { r: [.5, 0, .5, .5] }, { r: [0, .5, .5, .5] }, { r: [.5, .5, .25, .5] }, { r: [.75, .5, .25, .5] }].map(b => ({ ...b, r: sub(E, b.r), lv: 1 }));
  const D = L1[0].r;
  const L2 = [{ r: [0, 0, .5, .5], label: 'Contenus pour le référencement', hot: true }, { r: [.5, 0, .5, .5] }, { r: [0, .5, .6, .5] }, { r: [.6, .5, .4, .5] }].map(b => ({ ...b, r: sub(D, b.r), lv: 2 }));
  const BOXES = [...L0.map(b => ({ ...b, lv: 0 })), ...L1, ...L2];

  scene({
    id: 'A', cls: 'steps', ch: 3, dur: 30, title: 'A — Aggregate', rail: 'A', src: SRC + ' · exemple de hiérarchie tiré de Clio',
    narr: 'A — Aggregate, ranger. On compte les groupes et on les range en niveaux : quelques grands thèmes, des milliers de groupes fins. Le résultat n’est pas une liste, c’est une carte qu’on peut parcourir du général au détail. Exemple de Clio : Écriture, puis rédaction de contenus, puis contenus pour le référencement. Coût : six centimes.',
    html: `<div class="wrap">
      ${stepLeft('A', `
        <div class="k ds" data-at="0.3">A · Aggregate — ranger</div>
        <div class="d3" data-at="1">On compte, on range <span class="ds">en niveaux</span>.</div>
        <div class="t2" data-at="3.5">Quelques grands thèmes → des milliers de groupes fins.</div>
        <div class="t1" data-at="17" style="margin-top:36px">Pas une liste : <b class="ds">une carte</b>, du général au détail.</div>`,
      { at: 22, v: '0,06 $', sub: 'du comptage' })}
      <div class="abs tm" style="left:${R.x}px;top:${R.y}px;width:${R.w}px;height:${R.h}px;overflow:hidden;border-radius:18px">
        ${BOXES.map((b, i) => `<div class="bx" data-i="${i}" style="position:absolute;border-radius:12px;overflow:hidden;
           background:${b.hot ? 'rgba(92,200,255,' + (.10 + b.lv * .05) + ')' : 'rgba(255,255,255,.035)'};border:1.5px solid ${b.hot ? 'rgba(92,200,255,.7)' : '#232838'}">
           <div class="bl" style="position:absolute;left:0;top:0;right:0;padding:.5em .8em;font-weight:600;line-height:1.1;color:${b.hot ? '#f3f4f8' : '#4a5063'}">${b.label || '…'}</div></div>`).join('')}
      </div>
      <div class="abs mono" style="left:${R.x}px;top:${R.y + R.h + 30}px;font-size:24px;display:flex;gap:14px;color:#c7cbd6">
        <span data-at="2.5">Écriture</span><span data-at="9" class="ds">→ Rédaction de contenus</span><span data-at="13" class="ds">→ Contenus pour le référencement</span></div>
    </div>`,
    build(el, st) { st.b = [...el.querySelectorAll('.bx')]; },
    update(t, el, st) {
      // camera: 0 → level-1 zoom (Écriture) → level-2 zoom (Rédaction)
      const z1 = eio(prog(t, 8, 10.5)), z2 = eio(prog(t, 12, 14.5));
      const back = eio(prog(t, 25, 28));
      const cams = [[0, 0, 1, 1], E, D];
      const lerpR = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));
      let cam = lerpR(lerpR(cams[0], cams[1], z1), cams[2], z2);
      cam = lerpR(cam, cams[0], back);
      const zoom = 1 / cam[2];
      const appear = eo(prog(t, 1.5, 4));
      st.b.forEach((n, i) => {
        const b = BOXES[i];
        const x = (b.r[0] - cam[0]) * zoom * R.w, y = (b.r[1] - cam[1]) * zoom * R.h;
        const w = b.r[2] * zoom * R.w, h = b.r[3] * zoom * R.h;
        const pad = 5;
        n.style.left = (x + pad) + 'px'; n.style.top = (y + pad) + 'px';
        n.style.width = Math.max(0, w - 2 * pad) + 'px'; n.style.height = Math.max(0, h - 2 * pad) + 'px';
        const vis = b.lv === 0 ? appear : clamp((zoom - (b.lv === 1 ? 1.3 : 3)) / .5);
        n.style.opacity = vis * (b.lv === 0 && zoom > 1.5 && !b.hot ? 1 - clamp((zoom - 1.5)) : 1);
        n.firstElementChild.style.fontSize = Math.min(40, (b.lv === 0 ? 34 : 30) * zoom / Math.pow(2, b.lv)) + 'px';
        n.firstElementChild.style.opacity = b.lv < 2 && b.hot && zoom > Math.pow(2, b.lv + 1) * .8 ? .35 : 1;
      });
    },
  });

  const BILL = [['S', 45.00, 'llm', '45,00 $'], ['E', 0, 'ds', '≈ 0'], ['C', 0, 'ds', '0 $'], ['N', 3.75, 'llm', '3,75 $'], ['A', 0.06, 'ds', '0,06 $']];
  scene({
    id: 'bill', ch: 3, dur: 30, title: 'La facture, étape par étape', rail: 'all', src: SRC,
    narr: 'Total : quarante-huit dollars quatre-vingt-un. Deux étapes consomment des tokens, S et N ; les trois autres ne coûtent presque rien. S représente quatre-vingt-douze pour cent de la facture — et il est optionnel quand les textes sont courts.\nLa phrase à retenir : la data science trouve la structure, le LLM lui donne du sens. Le LLM n’est pas un figurant : c’est là que le sens se fabrique. Il est simplement utilisé avec parcimonie.',
    html: `<div class="wrap">
      <div class="grp">
      <div class="k" data-at="0.3" style="margin-top:20px">La facture complète · Clio · 100 000 conversations</div>
      <div style="display:flex;align-items:center;gap:40px;margin-top:40px">
        <div class="billbar" style="flex:1;height:90px;display:flex;border-radius:16px;overflow:hidden;background:#11131c">
          ${BILL.map(([L, v, c]) => `<div class="seg" style="width:0;height:100%;background:var(--${c});opacity:${L === 'S' ? 1 : .85};display:grid;place-items:center;font:800 44px/1 var(--sans);color:#06070b">${L === 'S' ? 'S' : ''}</div>`).join('')}
        </div>
        <div class="mono cost glow-cost" data-at="6" style="font:700 84px/1 var(--mono)">48,81 $</div></div>
      <div style="display:flex;gap:26px;margin-top:30px">
        ${BILL.map(([L, v, c, lab], i) => `<div data-at="${3 + i * .5}" class="chip ${c}" style="font-size:26px"><b style="color:inherit">${L}</b> ${lab}${L === 'S' ? ' · 92 %' : ''}</div>`).join('')}</div>
      <div class="t1" data-at="9" style="margin-top:56px">Deux étapes consomment des tokens : <b class="llm">S</b> et <b class="llm">N</b>.</div>
      <div class="t2" data-at="11.5" style="margin-top:12px">S pèse 92 % — et il est <b>optionnel</b> quand les textes sont courts.</div>
      </div>
      <div class="abs" style="left:160px;right:160px;top:600px">
        <div class="d2" data-at="16" style="font-size:92px">La <span class="ds glow-ds">data science</span> trouve la structure,</div>
        <div class="d2" data-at="18" style="font-size:92px">le <span class="llm glow-llm">LLM</span> lui donne du sens.</div>
        <div class="t2" data-at="23" style="margin-top:30px">Le LLM n’est pas un figurant : c’est là que le sens se fabrique. Il est simplement utilisé <b>avec parcimonie</b>.</div>
      </div></div>`,
    build(el, st) { st.s = [...el.querySelectorAll('.seg')]; st.g = el.querySelector('.grp'); },
    update(t, el, st) {
      const p = eo(prog(t, 1.5, 5.5));
      BILL.forEach(([L, v], i) => { st.s[i].style.width = (v / 48.81 * 100 * p) + '%'; });
      st.g.style.opacity = t > 15 ? lerp(1, .3, eo(prog(t, 15, 16.5))) : 1;
    },
  });
})();
