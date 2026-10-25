/* Chapitre 3 — SECNA, étape par étape */
(function () {
  const K = window.K;
  const { P, EP, IO, lerp, clamp, COL, FONT } = K;
  const CH = 3, CN = 'SECNA';
  const BOX = { x: 790, y: 200, w: 1010, h: 720 };
  const cloud = new K.Cloud({ seed: 7, n: 2300, k: 13, aspect: BOX.w / BOX.h, minD: .26, sig: [.022, .045] });
  K.cloudMain = cloud; K.BOX = BOX;
  const c0 = 0, c1 = cloud.far(0);
  const NAMES = ['Points fidélité', 'Remboursement lent', 'Appli qui plante', 'Taille / pointure', 'Produit abîmé',
    'Service client injoignable', 'Frais cachés', 'Compte bloqué', 'Retour compliqué', 'Très satisfait', 'Double débit', 'Stock erroné', 'Paiement refusé'];
  const labels = []; let ni = 0;
  for (let i = 0; i < cloud.k; i++) labels[i] = i === c0 ? 'Colis non reçu ou en retard' : i === c1 ? 'Code promo refusé' : NAMES[ni++ % NAMES.length];
  K.cloudLabels = labels;
  // ordre de nommage : de gauche à droite
  const order = cloud.C.map((c, i) => i).sort((a, b) => cloud.C[a].x - cloud.C[b].x);

  const note = `<div class="viz-note" style="left:${BOX.x}px;top:${BOX.y + BOX.h + 30}px" data-in="1">visualisation illustrative</div>`;

  K.chapter(CH, CN, 'La recette de Clio, en cinq étapes', 'Troisième temps : la recette.');

  K.scene({
    id: 'secna', chapter: CH, chapName: CN, title: 'Cinq étapes', dur: 24,
    say: "La recette de Clio tient en cinq étapes : Summarise, Embed, Cluster, Name, Aggregate. S, E, C, N, A.\nLe domaine n'a pas de nom canonique pour cette recette : SECNA, c'est un nom inventé pour ce talk. Et la recette n'est pas la mienne : c'est celle de Clio.",
    build(root) {
      root.innerHTML = `<div class="abs row" style="left:0;right:0;top:230px;justify-content:center;gap:70px">
        ${K.STEPS.map((s, i) => `<div class="center" style="width:250px">
          <div class="h-xxl" data-in="${1 + i * .55}" data-fx="drop" data-d=".8" style="font-size:250px">${s[0]}</div>
          <div class="t-l b" data-in="${4.2 + i * .3}" style="margin-top:20px">${s[1]}</div>
          <div class="t-m mute" data-in="${4.6 + i * .3}">${s[2]}</div></div>`).join('')}</div>
        <div class="abs center" style="left:0;right:0;top:700px">
          <div class="t-l mute" data-in="10.5">Le domaine n'a pas de nom canonique pour cette recette.</div>
          <div class="h-s" data-in="13.5" style="margin-top:22px"><span class="c-ds">SECNA</span> : un nom inventé pour ce talk.</div>
          <div class="h-s" data-in="16.5" style="margin-top:22px">La recette n'est pas la mienne. <span class="c-llm">C'est celle de Clio.</span></div>
        </div>`;
    },
  });

  // ------------------------------------------------------------------ S
  K.scene({
    id: 'S', chapter: CH, chapName: CN, title: 'S — Summarise', dur: 36,
    say: "S, Summarise : préparer. Un LLM relit chaque document et en extrait l'essentiel : il résume, traduit, efface la forme, fait ressortir les éléments porteurs de sens.\nClio extrait quelques attributs par conversation, dont un résumé de la demande. Chez Clio, cette étape sert aussi à protéger la confidentialité et à choisir l'angle d'analyse.\nC'est l'étape chère : quarante-cinq dollars, avec le plus petit modèle de l'époque, Claude 3 Haiku. Quatre-vingt-douze pour cent de la facture. Une fois par document.",
    build(root) {
      root.innerHTML = K.pipe(0) + `
        <div class="step-left">
          <div class="kicker c-llm" data-in=".6">S — Summarise · préparer</div>
          <div class="h-s" data-in="1">Un LLM relit <span class="c-llm">chaque document</span></div>
          <div class="t-m" data-in="4">résume · traduit · efface la forme</div>
          <div class="t-m" data-in="5.5">fait ressortir ce qui porte le sens</div>
          <div class="t-s mute" data-in="14" style="margin-top:22px">Clio extrait quelques attributs par conversation, dont un résumé de la demande — et s'en sert aussi pour protéger la confidentialité et choisir l'angle d'analyse.</div>
        </div>
        ${K.ledger(0, 25, '<span class="c-cost b">92 % de la facture</span> · une fois par document')}
        <div class="abs card t-s" style="left:790px;top:210px;width:470px;padding:26px 30px;color:#aeb5c4;font-size:21px" data-in="2" data-fx="left">
          <div class="kicker" style="margin-bottom:14px">document brut</div>
          bonjour alors voila jai commandé le 3 mars des baskets pour mon fils, le suivi dit LIVRÉ depuis jeudi mais on a RIEN reçu!!! j'ai appelé 2 fois personne répond… franchement déçue c'était pour son anniv 😡 ps: la taille c'était 38</div>
        <div class="abs center" style="left:1268px;top:300px;width:110px" data-in="7" data-fx="pop">
          <div class="chip" style="font-size:20px;padding:10px 16px;border-color:var(--llm);color:var(--llm)">LLM</div>
          <div class="mono" style="font-size:30px;color:var(--llm);margin-top:8px">→</div></div>
        <div class="abs card" style="left:1390px;top:210px;width:420px;padding:26px 30px" data-in="8" data-fx="right">
          <div class="kicker c-llm" style="margin-bottom:16px">préparé</div>
          <div class="t-s" data-in="8.6"><span class="mute">demande :</span> colis marqué livré, jamais reçu</div>
          <div class="t-s" data-in="9.4"><span class="mute">sujet :</span> livraison</div>
          <div class="t-s" data-in="10.2"><span class="mute">ton :</span> négatif</div>
          <div class="t-s" data-in="11"><span class="mute">langue :</span> français</div></div>
        <div class="abs t-s mute" style="left:790px;top:610px" data-in="19">chaque document, une fois</div>
        <div class="abs t-s c-llm" style="left:1290px;top:610px;width:520px;text-align:right" data-in="21">petit modèle · Claude 3 Haiku</div>`;
      const r = K.rng(31);
      const docs = Array.from({ length: 60 }, () => ({ o: r(), y: r(), w: .6 + r() * .4 }));
      return (t, ctx) => {
        if (t < 18.5) return;
        const a = clamp(t - 18.5);
        const y0 = 660, h = 200, x0 = 790, x1 = 1810, mid = 1300;
        ctx.globalAlpha = a; ctx.strokeStyle = COL.llm; ctx.lineWidth = 2;
        K.rrect(ctx, mid - 50, y0 + 40, 100, 120, 14); ctx.stroke();
        ctx.fillStyle = COL.llm; ctx.font = `600 22px ${FONT.mono}`; ctx.textAlign = 'center'; ctx.fillText('LLM', mid, y0 + 108);
        docs.forEach(d => {
          const u = ((t - 18.5) * .12 + d.o) % 1, x = lerp(x0, x1, u);
          const y = y0 + 20 + d.y * (h - 40);
          const yy = lerp(y, y0 + 100, Math.sin(clamp((x - (mid - 260)) / 520) * Math.PI));
          const after = x > mid;
          const w = after ? 40 : 90 * d.w, hh = after ? 12 : 54;
          ctx.globalAlpha = a * Math.sin(u * Math.PI) * (after ? .95 : .6);
          ctx.fillStyle = after ? COL.llm : '#8b93a7';
          if (Math.abs(x - mid) < 50) return;
          K.rrect(ctx, x - w / 2, yy - hh / 2, w, hh, 4); ctx.fill();
          if (!after) { ctx.fillStyle = '#06070b'; for (let l = 0; l < 4; l++) ctx.fillRect(x - w / 2 + 6, yy - hh / 2 + 8 + l * 11, (w - 12) * (l === 3 ? .5 : 1), 3); }
        });
      };
    },
  });

  // ------------------------------------------------------------------ E
  K.scene({
    id: 'E', chapter: CH, chapName: CN, title: 'E — Embed', dur: 36,
    say: "E, Embed : projeter. Un petit modèle de langage, un modèle d'embedding, transforme chaque texte en un point dans un espace.\nDeux textes qui veulent dire la même chose atterrissent tout près l'un de l'autre : « colis jamais arrivé » et « livraison en retard » — des mots différents, le même sens.\nLe sens devient de la géométrie. Coût : quasiment zéro, quelques centimes ; ça peut tourner en local.",
    build(root) {
      root.innerHTML = K.pipe(1) + `
        <div class="step-left">
          <div class="kicker c-ds" data-in=".6">E — Embed · projeter</div>
          <div class="h-s" data-in="1">Chaque texte devient <span class="c-ds">un point</span></div>
          <div class="t-m" data-in="3">Un petit modèle d'<i>embedding</i> place chaque texte dans un espace.</div>
          <div class="t-m" data-in="11">Même sens → points voisins, même avec des mots différents.</div>
          <div class="h-s c-ds" data-in="19" style="margin-top:30px">Le sens devient de la géométrie.</div>
        </div>
        ${K.ledger(1, 25, 'quelques centimes · peut tourner en local')}${note}`;
      const a = cloud.center(c0, BOX), b = cloud.center(c1, BOX);
      const phr = [
        { s: 'colis jamais arrivé', x: a.x - 20, y: a.y - 18, t: 5 },
        { s: 'livraison en retard', x: a.x + 24, y: a.y + 16, t: 6.5 },
        { s: 'code promo refusé', x: b.x, y: b.y, t: 8 },
      ];
      return (t, ctx) => {
        const rev = IO(t, 15, 12);
        if (rev > 0) cloud.draw(ctx, { box: BOX, reveal: rev, gather: IO(t, 15, 13), color: 0, r: 2.3, alpha: .8 });
        phr.forEach((p, i) => {
          const k = IO(t, p.t, 1.6); if (t < p.t) return;
          const sx = BOX.x + 140, sy = BOX.y + 80 + i * 90;
          const x = lerp(sx, p.x, k), y = lerp(sy, p.y, k);
          const dim = 1 - P(t, 26, 2) * .5;
          ctx.globalAlpha = dim; ctx.fillStyle = i < 2 ? COL.ds : COL.cost;
          ctx.beginPath(); ctx.arc(p.x, p.y, 6 * k, 0, 6.283); ctx.fill();
          K.pill(ctx, x, y - 34 * k - (i === 0 ? 24 * k : i === 1 ? -54 * k : 0), p.s, { color: i < 2 ? COL.ds : COL.cost, size: 20, alpha: dim * clamp((t - p.t) * 3) });
        });
        if (t > 10.5) {
          const k = EP(t, 10.5, 1) * (1 - P(t, 26, 2) * .6);
          ctx.globalAlpha = k; ctx.strokeStyle = COL.ds; ctx.setLineDash([5, 6]); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc((phr[0].x + phr[1].x) / 2, (phr[0].y + phr[1].y) / 2, 52, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = COL.ds; ctx.font = `600 18px ${FONT.mono}`; ctx.textAlign = 'center'; ctx.fillText('même sens', (phr[0].x + phr[1].x) / 2, phr[1].y + 84);
          ctx.strokeStyle = 'rgba(255,181,71,.5)'; ctx.setLineDash([2, 8]);
          ctx.beginPath(); ctx.moveTo(phr[1].x, phr[1].y); ctx.lineTo(phr[2].x, phr[2].y); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = COL.cost; const mx = (phr[1].x + phr[2].x) / 2, my = (phr[1].y + phr[2].y) / 2;
          ctx.textAlign = 'center'; ctx.fillText('sens différent : loin', mx, my - 12);
        }
      };
    },
  });

  // ------------------------------------------------------------------ C
  K.scene({
    id: 'C', chapter: CH, chapName: CN, title: 'C — Cluster', dur: 30,
    say: "C, Cluster : regrouper. Les points proches forment des groupes. Quelques points restent isolés.\nPas de LLM : du calcul pur. C'est ici que la structure est trouvée. Coût : zéro. Aucun token.",
    build(root) {
      root.innerHTML = K.pipe(2) + `
        <div class="step-left">
          <div class="kicker c-ds" data-in=".6">C — Cluster · regrouper</div>
          <div class="h-s" data-in="1">Les points proches forment <span class="c-ds">des groupes</span></div>
          <div class="t-m" data-in="9">Quelques points restent isolés.</div>
          <div class="t-m" data-in="13">Pas de LLM. Du calcul pur.</div>
          <div class="h-s c-ds" data-in="17" style="margin-top:30px">C'est ici que la structure est trouvée.</div>
        </div>
        ${K.ledger(2, 21, 'aucun token')}${note}
        <div class="abs mono" style="left:${BOX.x + BOX.w - 260}px;top:${BOX.y - 10}px;width:260px;text-align:right;font-size:22px" data-in="5">
          <span class="mute">groupes :</span> <b class="c-ds" data-in="5" data-fx="fade" data-count="${cloud.k}" data-cd="3">0</b></div>`;
      return (t, ctx) => {
        cloud.draw(ctx, { box: BOX, color: IO(t, 1.5, 7), glow: 1, r: 2.4, ringOutliers: P(t, 9, 1) * (1 - P(t, 15, 2)), t });
      };
    },
  });

  // ------------------------------------------------------------------ N
  K.scene({
    id: 'N', chapter: CH, chapName: CN, title: 'N — Name', dur: 32,
    say: "N, Name : nommer. Pour chaque groupe, un LLM lit quelques exemples et donne au groupe un nom et une description.\nLe LLM n'est plus appelé une fois par document, mais une fois par groupe : au lieu de cent mille appels, quelques milliers.\nCoût : trois dollars soixante-quinze, avec un modèle plus gros, Claude 3.5 Sonnet.",
    build(root) {
      root.innerHTML = K.pipe(3) + `
        <div class="step-left">
          <div class="kicker c-llm" data-in=".6">N — Name · nommer</div>
          <div class="h-s" data-in="1">Un LLM <span class="c-llm">nomme</span> chaque groupe</div>
          <div class="t-m" data-in="3.5">Il lit quelques exemples, propose un nom et une description.</div>
          <div class="t-m" data-in="11">Une fois <b>par groupe</b>, plus une fois par document :</div>
          <div class="h-s mono" data-in="13.5" style="font-size:30px;margin-top:6px;white-space:nowrap"><span style="position:relative;display:inline-block" class="mute">100 000<i class="strike" data-in="15" data-fx="wipe"></i></span> → <span class="c-llm" data-in="16" data-fx="fade">quelques milliers</span> <span class="t-s mute">appels</span></div>
        </div>
        ${K.ledger(3, 21, 'un modèle plus gros · Claude 3.5 Sonnet')}${note}`;
      const per = 14 / cloud.k;
      const smp = cloud.C.map((c, i) => cloud.samples(i, 4));
      return (t, ctx) => {
        let cur = -1;
        order.forEach((ci, j) => { if (t >= 2 + j * per) cur = ci; });
        cloud.draw(ctx, { box: BOX, color: 1, glow: .8, r: 2.3, t });
        order.forEach((ci, j) => {
          const t0 = 2 + j * per; if (t < t0) return;
          const c = cloud.center(ci, BOX), k = EP(t, t0 + .4, .5);
          if (ci === cur && t < 17) {
            ctx.globalAlpha = .8; ctx.strokeStyle = cloud.hsl(ci, 1, 75); ctx.lineWidth = 1.2;
            smp[ci].forEach(p => { const x = BOX.x + p.x * BOX.w, y = BOX.y + p.y * BOX.h; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(c.x, c.y); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.stroke(); });
          }
          K.pill(ctx, c.x, c.y, labels[ci], { color: cloud.hsl(ci, 1, 70), size: 17, scale: .7 + .3 * K.ease.back(k), alpha: k });
        });
      };
    },
  });

  // ------------------------------------------------------------------ A
  const TREE = [
    { n: 'Écriture', hu: 165, c: [{ n: 'Rédaction de contenus', c: [['Contenus pour le référencement', 5], ['Articles de blog', 4], ['Fiches produits', 3], ['Newsletters', 2]] }, { n: 'Correction & style', c: [['Relecture', 4], ['Reformulation', 3], ['Traduction', 2]] }, { n: 'Écriture créative', c: [['Fiction', 3], ['Poésie', 2], ['Scénarios', 2]] }] },
    { n: 'Code', hu: 210, c: [{ n: 'Développement web', c: [['Frontend', 5], ['API', 4], ['CSS', 3]] }, { n: 'Débogage', c: [['Erreurs Python', 4], ['Tests', 3], ['Performance', 3]] }, { n: 'Données', c: [['SQL', 3], ['Scripts', 3]] }] },
    { n: 'Analyse', hu: 265, c: [{ n: 'Analyse de données', c: [['Tableurs', 4], ['Statistiques', 3], ['Visualisation', 3]] }, { n: 'Recherche', c: [['Synthèse', 4], ['Veille', 4]] }] },
    { n: 'Apprentissage', hu: 35, c: [{ n: 'Maths', c: [['Algèbre', 4], ['Probabilités', 3]] }, { n: 'Langues', c: [['Vocabulaire', 4], ['Grammaire', 3]] }] },
    { n: 'Conseils', hu: 320, c: [{ n: 'Carrière', c: [['CV', 3], ['Entretiens', 3]] }, { n: 'Quotidien', c: [['Recettes', 2], ['Voyages', 2]] }] },
  ];
  TREE.forEach(a => { a.c.forEach(b => { b.v = b.c.reduce((s, x) => s + x[1], 0); }); a.v = a.c.reduce((s, b) => s + b.v, 0); });
  const L1 = K.squarify(TREE, BOX.x, BOX.y, BOX.w, BOX.h);
  const L2 = [], L3 = [];
  L1.forEach(a => {
    const pad = 6, top = 40;
    K.squarify(a.c, a.x + pad, a.y + top, a.w - 2 * pad, a.h - top - pad).forEach(b => {
      b.par = a.n; b.hue = a.hu; L2.push(b);
      const t2 = 30;
      K.squarify(b.c.map(x => ({ n: x[0], v: x[1] })), b.x + 4, b.y + t2, b.w - 8, b.h - t2 - 4).forEach(c => { c.hue = a.hu; c.par = b.n; L3.push(c); });
    });
  });
  L1.forEach(a => { a.hue = a.hu; });
  const PATH = ['Écriture', 'Rédaction de contenus', 'Contenus pour le référencement'];
  function label(ctx, txt, x, y, w, size, weight, color) {
    ctx.font = `${weight} ${size}px ${FONT.body}`;
    let s = txt; while (s.length > 3 && ctx.measureText(s).width > w) s = s.slice(0, -2) + '…';
    if (ctx.measureText(s).width > w) return;
    ctx.fillStyle = color; ctx.fillText(s, x, y);
  }
  K.scene({
    id: 'A', chapter: CH, chapName: CN, title: 'A — Aggregate', dur: 32,
    say: "A, Aggregate : ranger. On compte les groupes et on les range en niveaux : quelques grands thèmes, des milliers de groupes fins.\nLe résultat n'est pas une liste : c'est une carte qu'on peut parcourir du général au détail. Exemple de Clio : Écriture, puis rédaction de contenus, puis contenus pour le référencement.\nCoût : six centimes.",
    build(root) {
      root.innerHTML = K.pipe(4) + `
        <div class="step-left">
          <div class="kicker c-ds" data-in=".6">A — Aggregate · ranger</div>
          <div class="h-s" data-in="1">On compte, on range <span class="c-ds">en niveaux</span></div>
          <div class="t-m" data-in="4">Quelques grands thèmes. Des milliers de groupes fins.</div>
          <div class="t-m" data-in="11">Pas une liste : <b>une carte</b>, du général au détail.</div>
          <div class="t-s" data-in="17" style="margin-top:20px;font-size:23px"><span class="mute">Exemple de Clio :</span><br><b>Écriture</b> → <b>rédaction de contenus</b> → <b class="c-ds">contenus pour le référencement</b></div>
        </div>
        ${K.ledger(4, 22)}
        <div class="viz-note" style="left:${BOX.x}px;top:${BOX.y + BOX.h + 30}px" data-in="1">thèmes illustratifs · seul le chemin en surbrillance vient de l'article</div>`;
      return (t, ctx) => {
        const p1 = EP(t, 2, 2), p2 = EP(t, 6, 2.5), p3 = EP(t, 10, 2.5), hl = IO(t, 17, 1.5);
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        const onPath = n => PATH.includes(n);
        L1.forEach((a, i) => {
          const k = clamp((p1 * 1.4 - i * .1));
          const dim = onPath(a.n) ? 1 : 1 - hl * .7;
          ctx.globalAlpha = k * dim;
          ctx.fillStyle = `hsla(${a.hue},55%,${lerp(40, 20, p2)}%,${lerp(.9, .55, p2)})`;
          K.rrect(ctx, a.x + 2, a.y + 2, a.w - 4, a.h - 4, 10); ctx.fill();
          if (onPath(a.n) && hl > 0) { ctx.globalAlpha = hl; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); }
          ctx.globalAlpha = k * dim;
          label(ctx, a.n, a.x + 16, a.y + 32, a.w - 30, lerp(30, 22, p2), 700, '#fff');
        });
        if (p2 > 0) L2.forEach(b => {
          const dim = onPath(b.n) ? 1 : 1 - hl * .75;
          ctx.globalAlpha = p2 * dim; ctx.fillStyle = `hsla(${b.hue},60%,${lerp(45, 30, p3)}%,.85)`;
          K.rrect(ctx, b.x + 2, b.y + 2, b.w - 4, b.h - 4, 7); ctx.fill();
          if (onPath(b.n) && hl > 0) { ctx.globalAlpha = clamp(hl * 2 - .5); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke(); }
          ctx.globalAlpha = p2 * dim; label(ctx, b.n, b.x + 10, b.y + 22, b.w - 20, 16, 600, '#f1f3f8');
        });
        if (p3 > 0) L3.forEach(c => {
          const on = onPath(c.n), dim = on ? 1 : 1 - hl * .8;
          ctx.globalAlpha = p3 * dim; ctx.fillStyle = on && hl > 0 ? `hsla(165,70%,${lerp(55, 45, 1 - hl)}%,1)` : `hsla(${c.hue},60%,60%,.35)`;
          K.rrect(ctx, c.x + 2, c.y + 2, c.w - 4, c.h - 4, 5); ctx.fill();
          if (on && hl > 0) { ctx.globalAlpha = clamp(hl * 3 - 2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); }
          ctx.globalAlpha = p3 * dim;
          const lines = c.n.split(' ');
          if (c.w > 90 && c.h > 30) {
            if (on) { ctx.font = `700 15px ${FONT.body}`; let y = c.y + 22, line = ''; lines.forEach(w => { const tt = line ? line + ' ' + w : w; if (ctx.measureText(tt).width > c.w - 16) { ctx.fillStyle = '#06070b'; ctx.fillText(line, c.x + 8, y); y += 18; line = w; } else line = tt; }); ctx.fillStyle = '#06070b'; ctx.fillText(line, c.x + 8, y); }
            else label(ctx, c.n, c.x + 8, c.y + 20, c.w - 14, 13, 500, 'rgba(255,255,255,.85)');
          }
        });
      };
    },
  });

  // ------------------------------------------------------------------ facture
  K.scene({
    id: 'secna-bill', chapter: CH, chapName: CN, title: 'La facture, étape par étape', dur: 30,
    say: "Total : quarante-huit dollars quatre-vingt-un. Deux étapes consomment des tokens, S et N ; les trois autres ne coûtent presque rien. S représente quatre-vingt-douze pour cent de la facture — et il est optionnel quand les textes sont courts.\nLa phrase à retenir : la data science trouve la structure, le LLM lui donne du sens. Le LLM n'est pas un figurant : c'est là que le sens se fabrique. Il est simplement utilisé avec parcimonie.",
    build(root) {
      const X = 160, Wd = 1600;
      const segs = [['S', 45, 'llm'], ['E', 0, 'ds'], ['C', 0, 'ds'], ['N', 3.75, 'llm2'], ['A', .06, 'ds']];
      root.innerHTML = `
        <div class="abs kicker" style="left:${X}px;top:150px" data-in=".3" data-out="17">La facture de Clio · 100 000 conversations</div>
        <div class="abs" style="left:${X}px;top:220px;width:${Wd}px;height:130px" data-in=".6" data-out="17" data-fx="fade" id="sb-bar"></div>
        <div class="abs mono" style="left:${X}px;top:380px;font-size:24px" data-in="4" data-out="17">
          <span class="c-llm b" style="font-size:36px">S · 45,00 $</span> <span class="mute">— 92 %</span></div>
        <div class="abs mono" style="left:${X + Wd - 560}px;top:380px;width:560px;text-align:right;font-size:24px;line-height:1.6" data-in="4.6" data-out="17">
          <span class="c-llm b">N · 3,75 $</span><br><span class="c-ds">A · 0,06 $ · E ≈ 0 · C 0</span></div>
        <div class="abs" style="left:${X}px;top:560px" data-in="6" data-out="17"><span class="kicker">Total</span>
          <div class="mono c-cost" style="font:700 120px/1 var(--f-head);margin-top:10px">48,81 $</div></div>
        <div class="abs" style="left:900px;top:560px;width:860px" >
          <div class="h-s" data-in="8" data-out="17" style="font-size:40px">Deux étapes consomment des tokens : <span class="c-llm">S</span> et <span class="c-llm">N</span>.</div>
          <div class="t-l mute" data-in="11" data-out="17" style="margin-top:24px">S = 92 % de la facture — et il est <b style="color:var(--ink)">optionnel</b> quand les textes sont courts.</div></div>
        <div class="full center">
          <div class="h-l" data-in="18" data-fx="blur"><span class="c-ds">La data science</span> trouve la structure,</div>
          <div class="h-l" data-in="19.6" data-fx="blur" style="margin-top:14px"><span class="c-llm">le LLM</span> lui donne du sens.</div>
          <div class="t-l mute" data-in="23" style="margin-top:60px;max-width:1300px">Le LLM n'est pas un figurant : c'est là que le sens se fabrique.<br>Il est simplement utilisé avec <span class="c-cost">parcimonie</span>.</div>
        </div>`;
      const bar = root.querySelector('#sb-bar');
      bar.innerHTML = segs.map(s => `<div style="position:absolute;top:0;height:100%;border-radius:10px;background:${s[2] === 'llm2' ? '#8467e8' : 'var(--' + s[2] + ')'}" data-seg="${s[0]}"></div>`).join('');
      const els = [...bar.children];
      return (t) => {
        const g = IO(t, 1, 3);
        let x = 0; const tot = 48.81;
        segs.forEach((s, i) => {
          const w = Math.max(s[1] / tot * Wd * g - 4, s[1] > 0 ? 6 * g : 0);
          els[i].style.left = x + 'px'; els[i].style.width = Math.max(0, w) + 'px';
          els[i].style.opacity = s[1] > 0 ? 1 : 0;
          x += w + (s[1] > 0 ? 4 : 0);
        });
      };
    },
  });
})();
