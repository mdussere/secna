/* Chapitre 5 — Ma recette, et la fin */
(function () {
  const K = window.K;
  const { P, EP, IO, lerp, clamp, COL, FONT } = K;
  const CH = 5, CN = 'Ma recette';

  K.chapter(CH, CN, 'Celle que j\'utilise et que je défends', 'Cinquième temps : ma recette.');

  K.scene({
    id: 'crepes', chapter: CH, chapName: CN, title: 'SECNA sans le S', dur: 40,
    say: "Ma recette. Pas mon invention : celle que j'utilise et que je défends. Comme la pâte à crêpes : je ne l'ai pas inventée, mais quand je fais des crêpes, c'est celle-là que je prends, parce qu'elle est équilibrée et qu'elle tient bien dans la poêle.\nMa recette, c'est SECNA sans le S. Pas de LLM pour préparer chaque document : c'est quatre-vingt-douze pour cent de la facture et l'essentiel du temps. À la place, une préparation légère, sans LLM : le texte brut, et son contexte — la date, le produit, la note.\nCe que je perds : un peu de finesse sur les textes longs et multi-sujets. Ce que je gagne : le coût et la vitesse.",
    build(root) {
      root.innerHTML = `
        <div class="abs" style="left:110px;top:200px;width:900px">
          <div class="kicker" data-in=".4" data-out="13">Ma recette</div>
          <div class="h-l" data-in=".8" data-out="13" style="margin-top:26px">Pas mon invention.</div>
          <div class="h-s mute" data-in="2.5" data-out="13" style="margin-top:16px">Celle que j'utilise — et que je défends.</div>
          <div class="t-l" data-in="5" data-out="13" style="margin-top:60px">Comme la pâte à crêpes : je ne l'ai pas inventée, mais c'est celle que je prends —
            <span class="c-cost">équilibrée, elle tient bien dans la poêle.</span></div>
        </div>
        <div class="abs row" style="left:0;right:0;top:120px;justify-content:center;gap:40px" data-in="14" data-fx="fade" id="cr-letters">
          ${K.STEPS.map(s => `<div class="h-xxl" style="font-size:200px;position:relative">${s[0]}</div>`).join('')}</div>
        <div class="abs center" style="left:0;right:0;top:370px">
          <div class="h-m" data-in="18"><span class="grad">SECNA sans le S</span></div>
          <div class="t-l" data-in="20" style="margin-top:26px">Pas de LLM pour préparer chaque document : <span class="c-cost b">92 % de la facture</span>, l'essentiel du temps.</div>
          <div class="row" style="gap:16px;margin-top:30px"><span class="t-l mute" data-in="23.5">À la place : le texte brut +</span>
            ${['la date', 'le produit', 'la note…'].map((s, i) => `<span class="chip" data-in="${24 + i * .5}" data-fx="pop">${s}</span>`).join('')}</div>
        </div>
        <div class="abs card" style="left:260px;top:720px;width:640px" data-in="28" data-fx="left">
          <div class="kicker c-bad">Je perds</div><div class="t-l" style="margin-top:16px">un peu de finesse sur les textes longs et multi-sujets</div></div>
        <div class="abs card" style="left:1020px;top:720px;width:640px" data-in="31" data-fx="right">
          <div class="kicker c-ok">Je gagne</div><div class="h-m" style="margin-top:16px">le coût · la vitesse</div></div>`;
      const L = [...root.querySelector('#cr-letters').children];
      return (t, ctx) => {
        // la poêle
        if (t < 13.5) {
          const a = clamp(t - 1.5) * (1 - P(t, 12.5, 1));
          const cx = 1450, cy = 540, R = 300;
          ctx.globalAlpha = a; ctx.fillStyle = '#151922'; ctx.beginPath(); ctx.arc(cx, cy, R + 30, 0, 6.283); ctx.fill();
          ctx.fillStyle = '#1d222d'; ctx.save(); ctx.translate(cx, cy); ctx.rotate(.5); ctx.fillRect(R + 20, -28, 300, 56); ctx.restore();
          const k = EP(t, 3, 3.5);
          const g = ctx.createRadialGradient(cx - 40, cy - 40, 10, cx, cy, R * k);
          g.addColorStop(0, '#f6cf7c'); g.addColorStop(.7, '#e0a446'); g.addColorStop(1, '#b97a26');
          ctx.fillStyle = g; ctx.beginPath();
          for (let i = 0; i <= 64; i++) { const an = i / 64 * 6.283, rr = R * k * (1 + .012 * Math.sin(an * 3 + 1) + .006 * Math.sin(an * 11)); ctx.lineTo(cx + rr * Math.cos(an), cy + rr * Math.sin(an)); }
          ctx.fill();
          const r = K.rng(5); ctx.fillStyle = 'rgba(140,80,20,.35)';
          for (let i = 0; i < 40; i++) { const an = r() * 6.283, d = Math.sqrt(r()) * R * .9 * k; ctx.beginPath(); ctx.arc(cx + d * Math.cos(an), cy + d * Math.sin(an), 3 + r() * 9, 0, 6.283); ctx.fill(); }
          ctx.globalAlpha = a * k; ctx.fillStyle = '#5a3a12'; ctx.font = `700 64px ${FONT.head}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('SECNA', cx, cy);
        }
        // le S s'en va, ECNA se resserre
        const out = IO(t, 16, 1.6);
        L[0].style.opacity = 1 - out; L[0].style.transform = `translateY(${-90 * out}px) rotate(${-14 * out}deg)`;
        L[0].style.color = out > .05 ? 'var(--bad)' : '';
        L.slice(1).forEach(l => { l.style.transform = `translateX(${-120 * IO(t, 17, 1.2)}px)`; });
      };
    },
  });

  K.scene({
    id: 'table', chapter: CH, chapName: CN, title: 'Pourquoi une table', dur: 32,
    say: "Pourquoi une table ? Parce que le résultat n'est pas un rapport : c'est une table. Chaque texte garde son groupe, son niveau, sa date, son produit.\nOn la filtre, on la croise : quels thèmes montent ce mois-ci ? Quels thèmes reviennent sur tel produit ? C'est ce qui rend la carte utile au quotidien.",
    build(root) {
      const R = [
        ["L'appli se ferme quand je paie", 'Appli qui plante', 'Technique', '12/10', 'Appli'],
        ['Colis jamais reçu, suivi bloqué', 'Colis non reçu', 'Livraison', '03/10', 'Site'],
        ['Remboursé au bout de 6 semaines', 'Remboursement lent', 'Paiement', '28/09', 'Site'],
        ['Écran blanc après la mise à jour', 'Appli qui plante', 'Technique', '15/10', 'Appli'],
        ['Code promo refusé au panier', 'Code promo refusé', 'Paiement', '09/10', 'Appli'],
        ['Livreur passé, personne prévenu', 'Colis non reçu', 'Livraison', '21/09', 'Site'],
        ['Impossible de me connecter', 'Compte bloqué', 'Compte', '27/09', 'Appli'],
        ['Débité deux fois pour une commande', 'Double débit', 'Paiement', '11/10', 'Appli'],
        ['Taille trop petite, échange refusé', 'Taille / pointure', 'Produit', '30/09', 'Site'],
        ["Crash dès l'ouverture", 'Appli qui plante', 'Technique', '19/10', 'Appli'],
      ];
      root.innerHTML = `
        <div class="abs" style="left:110px;top:80px;width:1700px">
          <div class="kicker" data-in=".3">Pourquoi une table</div>
          <div class="h-m" data-in=".7" style="margin-top:22px">Pas un rapport : <span class="c-ds">une table.</span></div></div>
        <div class="abs row" style="left:110px;top:270px;gap:14px">
          <span class="chip" data-in="9" data-fx="pop" style="font-size:22px;border-color:var(--ds)">produit = Appli</span>
          <span class="chip" data-in="14" data-fx="pop" style="font-size:22px;border-color:var(--ds)">mois = octobre</span></div>
        <div class="abs" style="left:110px;top:340px;width:1200px" data-in="2" data-fx="fade">
          <table class="tbl" id="tb"><tr><th>texte</th><th>groupe</th><th>niveau</th><th>date</th><th>produit</th></tr>
          ${R.map(r => `<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td class="mute">${r[2]}</td><td class="mono">${r[3]}</td><td>${r[4]}</td></tr>`).join('')}</table></div>
        <div class="abs card" style="left:1380px;top:340px;width:430px" data-in="19" data-fx="right">
          <div class="kicker" style="margin-bottom:22px">Qu'est-ce qui monte ce mois-ci ?</div>
          <div class="t-m"><span class="c-bad b">↑</span> Appli qui plante <span class="mono mute">×3</span></div>
          <div class="t-m" style="margin-top:12px"><span class="c-cost b">↑</span> Double débit</div>
          <div class="t-m" style="margin-top:12px"><span class="mute b">→</span> Code promo refusé</div></div>
        <div class="abs t-l" style="left:110px;top:900px;width:1700px" data-in="24">Chaque texte garde <b>son groupe, son niveau, sa date, son produit</b> : <span class="c-ds">on filtre, on croise.</span></div>
        <div class="abs tag" style="right:110px;top:100px" data-in="2">illustratif</div>`;
      const trs = [...root.querySelectorAll('#tb tr')].slice(1);
      return (t) => {
        const f1 = IO(t, 10, 1), f2 = IO(t, 15, 1);
        trs.forEach((tr, i) => {
          const r = R[i]; let o = 1;
          if (r[4] !== 'Appli') o -= f1 * .88;
          else if (!r[3].endsWith('/10')) o -= f2 * .88;
          tr.style.opacity = o;
          tr.style.background = (r[1] === 'Appli qui plante' && t > 19) ? `rgba(255,93,108,${.12 * EP(t, 19, 1)})` : '';
        });
      };
    },
  });

  K.scene({
    id: 'where', chapter: CH, chapName: CN, title: 'Où ça rapporte', dur: 34,
    say: "Où ça rapporte ? Les avis clients : les vraies raisons des notes basses. Les tickets de support : les catégories qui existent vraiment, pas celles du formulaire — et la catégorie « Autre » qui se découpe enfin. Les messages vendeurs : ce qui les bloque. Les retours ouverts : ce que les gens disent quand on ne leur demande rien.\nUn mot sur le RAG : il répond à une question qu'on pose ; il ne trouve que ce qu'on sait déjà chercher. Ici, ce sont les thèmes qui viennent à vous.",
    build(root) {
      const T = [['★', 'Avis clients', 'les vraies raisons des notes basses'], ['?', 'Tickets de support', 'les catégories qui existent vraiment, pas celles du formulaire'], ['✉', 'Messages vendeurs', 'ce qui les bloque'], ['✎', 'Retours ouverts', 'ce que les gens disent quand on ne leur demande rien']];
      const parts = [['Double débit', 22], ['Bug après mise à jour', 26], ['Frais de retour', 18], ['Demande de facture', 20], ['Question fiscale', 14]];
      root.innerHTML = `
        <div class="abs kicker" style="left:110px;top:100px" data-in=".3" data-out="17.5">Où ça rapporte</div>
        <div class="abs row" style="left:110px;top:160px;gap:30px;align-items:stretch">
          ${T.map((x, i) => `<div class="card" style="width:400px;height:330px;padding:30px 32px" data-in="${1 + i * 1.6}" data-out="17.5">
            <div class="h-m c-ds" style="font-size:50px">${x[0]}</div><div class="h-s" style="font-size:34px;margin:12px 0 12px;white-space:nowrap">${x[1]}</div><div class="t-m mute" style="font-size:26px">${x[2]}</div></div>`).join('')}</div>
        <div class="abs" style="left:110px;top:600px;width:1700px" data-in="8" data-out="17.5" data-fx="fade">
          <div class="t-m" style="margin-bottom:18px">Tickets : la catégorie <b class="c-cost">« Autre »</b> se découpe enfin</div>
          <div id="wh-bar" style="position:relative;height:110px"></div>
        </div>
        <div class="abs" style="left:110px;top:150px;width:760px">
          <div class="kicker" data-in="18.5">Un mot sur le RAG</div>
          <div class="h-s" data-in="19" style="margin-top:24px">Le RAG répond à la question <span class="c-llm">qu'on pose</span>.</div>
          <div class="t-l mute" data-in="21" style="margin-top:20px">Il ne trouve que ce qu'on sait déjà chercher.</div></div>
        <div class="abs" style="left:1050px;top:150px;width:760px">
          <div class="kicker c-ds" data-in="24">Ici</div>
          <div class="h-s" data-in="24.5" style="margin-top:24px">Ce sont <span class="c-ds">les thèmes qui viennent à vous.</span></div></div>`;
      const bar = root.querySelector('#wh-bar');
      bar.innerHTML = `<div id="wh-autre" style="position:absolute;inset:0;border-radius:12px;background:#8a5a12;display:flex;align-items:center;justify-content:center;font:700 40px var(--f-head)">Autre</div>` +
        parts.map((p, i) => `<div class="wh-p" style="position:absolute;top:0;height:100%;border-radius:12px;background:hsl(${(i * 67 + 170) % 360},55%,45%);display:flex;align-items:center;justify-content:center;font:600 22px var(--f-body);opacity:0;text-align:center;padding:0 8px">${p[0]}</div>`).join('');
      const autre = bar.querySelector('#wh-autre'), ps = [...bar.querySelectorAll('.wh-p')];
      const Wd = 1700;
      const boxL = { x: 140, y: 470, w: 700, h: 450 }, boxR = { x: 1080, y: 470, w: 700, h: 450 };
      const cl = K.cloudMain, lab = K.cloudLabels;
      return (t, ctx) => {
        const s = IO(t, 10.5, 2);
        autre.style.opacity = 1 - s;
        let x = 0;
        ps.forEach((p, i) => { const w = parts[i][1] / 100 * Wd; p.style.left = lerp(0, x, s) + 'px'; p.style.width = lerp(Wd, w - 8, s) + 'px'; p.style.opacity = s; x += w; });
        if (t > 19) {
          const a = clamp(t - 19);
          // RAG : un faisceau sur une seule question
          ctx.globalAlpha = a;
          cl.draw(ctx, { box: boxL, color: 0, r: 1.6, alpha: .35 * a });
          const c = cl.center(0, boxL), qx = boxL.x + 40, qy = boxL.y + boxL.h - 10;
          const k = EP(t, 20.5, 1.5);
          ctx.globalAlpha = .35 * k; ctx.fillStyle = COL.llm; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(c.x - 50, c.y - 40); ctx.lineTo(c.x + 50, c.y + 40); ctx.closePath(); ctx.fill();
          ctx.globalAlpha = k; ctx.strokeStyle = COL.llm; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c.x, c.y, 55, 0, 6.283); ctx.stroke();
          K.pill(ctx, qx + 60, qy + 10, '« où en sont les livraisons ? »', { color: COL.llm, size: 17, alpha: k });
        }
        if (t > 24) {
          const a = EP(t, 24, 1.5);
          ctx.globalAlpha = a;
          cl.draw(ctx, { box: boxR, color: a, glow: .8, r: 1.6, alpha: .9 });
          cl.C.forEach((c, i) => { const k = EP(t, 25 + i * .25, .5); const p = cl.center(i, boxR); K.pill(ctx, p.x, p.y, lab[i], { color: cl.hsl(i, 1, 70), size: 13, alpha: k }); });
        }
      };
    },
  });

  K.scene({
    id: 'limits', chapter: CH, chapName: CN, title: "Où ça s'arrête", dur: 40,
    say: "Où ça s'arrête ? Trois limites, chacune avec sa réponse.\nUn : la plainte rare, grave mais unique, peut se noyer dans un grand groupe. Clio le dit lui-même : « not useful for identifying rare patterns ». C'est une carte du volume, pas une alarme : pour les signaux critiques, une veille à part.\nDeux : sur un petit corpus, ou un corpus très uniforme, il n'y a rien à trouver. Sous quelques milliers de textes, demandez au LLM de tout lire.\nTrois : les noms des groupes sont une proposition du LLM, pas une vérité. Relisez un échantillon par groupe, et vérifiez qu'ils tiennent d'un passage à l'autre.",
    build(root) {
      const L = [
        ['La plainte rare, grave mais unique, peut se noyer dans un grand groupe.', '<span class="mute">Clio le dit lui-même :</span> <i>« not useful for identifying rare … patterns »</i>', "Une carte du volume, pas une alarme : pour les signaux critiques, <b>une veille à part</b>.", 1],
        ['Petit corpus, ou corpus très uniforme : rien à trouver.', '', 'Sous quelques milliers de textes : <b>demander au LLM de tout lire</b>.', 13],
        ['Les noms des groupes sont une proposition du LLM, pas une vérité.', '', "<b>Relire un échantillon par groupe</b> ; vérifier qu'ils tiennent d'un passage à l'autre.", 25],
      ];
      root.innerHTML = `<div class="abs kicker" style="left:110px;top:90px" data-in=".3">Où ça s'arrête</div>` +
        L.map((l, i) => `<div class="abs row" style="left:110px;top:${170 + i * 280}px;width:1700px;align-items:flex-start;gap:40px">
          <div class="h-l" data-in="${l[3]}" style="color:var(--dim);width:80px">${i + 1}</div>
          <div style="width:760px"><div class="h-s" data-in="${l[3] + .3}" style="font-size:40px">${l[0]}</div>
            ${l[1] ? `<div class="t-m" data-in="${l[3] + 2.5}" style="margin-top:16px">${l[1]}</div>` : ''}</div>
          <div class="card" data-in="${l[3] + 5}" data-fx="right" style="width:780px;padding:26px 32px;border-color:rgba(91,227,138,.35)"><div class="t-m"><span class="c-ok b">→</span> ${l[2]}</div></div>
        </div>`).join('') + `<div class="abs src" style="left:230px;top:1010px" data-in="4">Clio, arXiv:2412.13678</div>`;
    },
  });

  K.scene({
    id: 'tomorrow', chapter: CH, chapName: CN, title: 'Demain', dur: 28,
    say: "Demain. La préparation de chaque document, le S, est la seule étape LLM qui grossit avec le corpus. C'est donc là que chaque baisse de prix des petits modèles spécialisés tombe en premier. Quand elle coûtera assez peu, le S reviendra dans ma recette.\nL'avenir de ces méthodes n'est pas le LLM partout. C'est le mélange : la data science pour la structure, des petits modèles pour chaque document, un grand modèle là où le sens se fabrique.",
    build(root) {
      root.innerHTML = `
        <div class="abs" style="left:110px;top:170px;width:900px">
          <div class="kicker" data-in=".3" data-out="13">Demain</div>
          <div class="h-s" data-in=".8" data-out="13" style="margin-top:26px">Le <span class="c-llm">S</span> est la seule étape LLM qui grossit avec le corpus.</div>
          <div class="t-l mute" data-in="3.5" data-out="13" style="margin-top:30px">C'est là que chaque baisse de prix des petits modèles spécialisés tombe en premier.</div>
          <div class="t-l" data-in="7.5" data-out="13" style="margin-top:30px">Quand il coûtera assez peu, <b class="c-llm">le S reviendra</b> dans ma recette.</div></div>
        <div class="abs center" style="left:0;right:0;top:130px">
          <div class="t-l mute" data-in="13.6">L'avenir n'est pas le LLM partout.</div>
          <div class="h-l" data-in="14.4" style="margin-top:14px">C'est <span class="grad">le mélange.</span></div></div>
        <div class="abs row" style="left:110px;top:470px;gap:40px">
          ${[['La data science', 'pour la structure', 'ds'], ['Des petits modèles', 'pour chaque document', 'cost'], ['Un grand modèle', 'là où le sens se fabrique', 'llm']].map((b, i) =>
            `<div class="card" data-in="${16 + i * 1.8}" data-fx="up" style="width:540px;height:300px;border-color:var(--${b[2]})"><div class="h-m c-${b[2]}" style="font-size:52px">${b[0]}</div><div class="t-l" style="margin-top:22px">${b[1]}</div></div>`).join('')}</div>`;
      return (t, ctx) => {
        if (t > 13.5) return;
        const a = clamp(t - 1) * (1 - P(t, 12.5, 1));
        const x0 = 1150, x1 = 1800, y0 = 280, y1 = 760;
        ctx.globalAlpha = a; ctx.strokeStyle = '#3a4152'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();
        const p = IO(t, 2, 6);
        ctx.strokeStyle = COL.llm; ctx.lineWidth = 5; ctx.shadowColor = COL.llm; ctx.shadowBlur = 16; ctx.beginPath();
        let lx, ly;
        for (let i = 0; i <= 100 * p; i++) { const u = i / 100; lx = x0 + 20 + u * (x1 - x0 - 40); ly = y0 + 30 + (1 - Math.exp(-3.2 * u)) * (y1 - y0 - 80) + Math.sin(u * 30) * 4; i ? ctx.lineTo(lx, ly) : ctx.moveTo(lx, ly); }
        ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = COL.mute; ctx.font = `500 20px ${FONT.mono}`; ctx.textAlign = 'left';
        ctx.fillText('prix d\'un petit modèle', x0 + 20, y0 - 20); ctx.textAlign = 'right'; ctx.fillText('temps →', x1, y1 + 36);
        if (p >= 1) { ctx.fillStyle = COL.llm; ctx.textAlign = 'right'; ctx.font = `700 22px ${FONT.mono}`; ctx.fillText('le S redevient abordable', x1, ly - 26); }
        ctx.fillStyle = COL.dim; ctx.font = `400 15px ${FONT.mono}`; ctx.textAlign = 'left'; ctx.fillText('ILLUSTRATIF', x0 + 20, y1 + 36);
      };
    },
  });

  K.scene({
    id: 'agents', chapter: CH, chapName: CN, title: 'Et si on mettait des agents dessus ?', dur: 30,
    say: "Une fin, ou plutôt une question ouverte. Une fois qu'on a cette carte — ces groupes nommés et rangés en niveaux — que se passe-t-il si on met des agents dessus ?\nUn assistant qui parcourt la carte à notre place, descend dans les groupes, va chercher des exemples et répond. Par exemple : « quel problème monte le plus ce mois-ci ? »\nCe sera pour la prochaine fois.",
    build(root) {
      root.innerHTML = `
        <div class="abs" style="left:110px;top:120px;width:640px">
          <div class="kicker" data-in=".3" data-out="22">Et la suite ?</div>
          <div class="h-s" data-in=".8" data-out="22" style="margin-top:26px">Une fois qu'on a cette carte…</div>
          <div class="h-m" data-in="3" data-out="22" style="margin-top:18px">…et si on mettait <span class="c-llm">des agents</span> dessus ?</div>
          <div class="t-m mute" data-in="6" data-out="22" style="margin-top:30px">Un assistant qui parcourt la carte, descend dans les groupes, va chercher des exemples — et répond.</div>
        </div>
        <div class="abs" style="left:110px;top:720px" data-in="9" data-out="22"><div class="bubble user">« Quel problème monte le plus ce mois-ci ? »</div></div>
        <div class="abs" style="left:110px;top:860px" data-in="12" data-out="22" data-fx="fade"><div class="bubble agent"><span class="tdots"><i></i><i></i><i></i></span></div></div>
        <div class="full center"><div class="h-xl" data-in="22.6" data-fx="blur" data-d="1.4">Ce sera pour <span class="c-llm">la prochaine fois.</span></div></div>`;
      const cl = K.cloudMain, lab = K.cloudLabels;
      const box = { x: 860, y: 130, w: 960, h: 800 };
      const target = 0, ex = cl.samples(target, 3, 9);
      return (t, ctx) => {
        if (t > 22.5) return;
        const a = clamp(t - .5) * (1 - P(t, 21.5, 1));
        ctx.globalAlpha = a;
        const focus = t > 14 ? target : -1;
        cl.draw(ctx, { box, color: 1, glow: .8, r: 2, alpha: .85 * a, focus, dimOthers: lerp(1, .25, EP(t, 14, 1)) });
        cl.C.forEach((c, i) => { const p = cl.center(i, box); K.pill(ctx, p.x, p.y, lab[i], { color: cl.hsl(i, 1, 70), size: 14, alpha: a * (focus >= 0 && i !== focus ? .3 : .95) }); });
        // l'agent : un losange lumineux qui parcourt la carte
        const tc = cl.center(target, box);
        const path = [[box.x + 40, box.y + box.h - 40], [box.x + box.w * .5, box.y + box.h * .5], [cl.center(3 % cl.k, box).x, cl.center(3 % cl.k, box).y], [tc.x, tc.y]];
        const u = clamp((t - 9.5) / 5) * (path.length - 1);
        const s = Math.min(Math.floor(u), path.length - 2), f = K.ease.inout(u - s);
        const ax = lerp(path[s][0], path[s + 1][0], f), ay = lerp(path[s][1], path[s + 1][1], f);
        if (t > 9.5) {
          ctx.globalAlpha = a; ctx.save(); ctx.translate(ax, ay - 34); ctx.rotate(Math.PI / 4);
          ctx.shadowColor = COL.llm; ctx.shadowBlur = 30; ctx.fillStyle = COL.llm; ctx.fillRect(-11, -11, 22, 22); ctx.restore();
          if (t > 15) ex.forEach((p, i) => {
            const k = EP(t, 15 + i * .6, .6); const x = box.x + p.x * box.w, y = box.y + p.y * box.h;
            ctx.globalAlpha = a * k; ctx.strokeStyle = COL.llm; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(ax, ay - 34); ctx.lineTo(x, y); ctx.stroke();
            ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.stroke();
          });
        }
      };
    },
  });

  K.scene({
    id: 'end', chapter: CH, chapName: CN, title: 'Prenez votre pile', dur: 30, fadeOut: 2,
    say: "Pour finir. La facture suit les groupes, pas les documents. La data science trouve la structure, le LLM lui donne du sens. Le code est en ligne : prenez votre pile, un après-midi, et essayez.",
    build(root) {
      root.innerHTML = `
        <div class="abs" style="left:110px;top:150px;width:1200px;--fs:54px">
          <div class="h-m" style="font-size:54px" data-in=".6" data-out="19"><span class="c-cost">La facture suit les groupes,</span> pas les documents.</div>
          <div class="h-m" data-in="3.4" data-out="19" style="margin-top:40px;font-size:54px"><span class="c-ds">La data science</span> trouve la structure, <span class="c-llm">le LLM</span> lui donne du sens.</div>
          <div class="h-m" data-in="7" data-out="19" style="margin-top:40px;font-size:54px">Le code est en ligne.</div>
          <div class="h-l" data-in="11" data-out="19" data-fx="blur" style="margin-top:70px;font-size:80px">Prenez votre pile, <span class="grad">un après-midi,</span> et essayez.</div>
        </div>
        <div class="abs center" style="left:1360px;top:250px;width:440px" data-in="7.5" data-out="19" data-fx="pop">
          ${K.qrSVG(360)}<div class="mono t-m" style="margin-top:22px">github.com/mdussere/secna</div></div>
        <div class="full center">
          <div class="row" style="gap:36px">${K.STEPS.map((s, i) => `<span class="h-xxl" data-in="${19.6 + i * .25}" data-fx="blur" style="font-size:180px;color:${s[3] === 'llm' ? 'var(--llm)' : 'var(--ds)'}">${s[0]}</span>`).join('')}</div>
          <div class="t-l mute" data-in="21" style="margin-top:20px">Summarise · Embed · Cluster · Name · Aggregate</div>
          <div class="t-m" data-in="22" style="margin-top:50px">Michaël Dussère — github.com/mdussere/secna</div>
          <div class="src" data-in="23" style="margin-top:50px;line-height:1.8">Tamkin et al., Clio, Anthropic, déc. 2024 — arXiv:2412.13678 · Liu et al., Urania, Google Research, COLM 2025 — arXiv:2506.04681<br>LangSmith Insights — docs.langchain.com/langsmith/insights · résultats du notebook : illustratifs</div>
        </div>`;
      return (t, ctx) => {
        if (t < 19) return;
        K.rain(ctx, t, { n: 50, alpha: .12 * clamp(t - 19), speed: .4, seed: 3 });
        const v = ctx.createRadialGradient(960, 540, 100, 960, 540, 900);
        v.addColorStop(0, 'rgba(6,7,11,.95)'); v.addColorStop(.6, 'rgba(6,7,11,.6)'); v.addColorStop(1, 'rgba(6,7,11,.1)');
        ctx.fillStyle = v; ctx.fillRect(0, 0, 1920, 1080);
      };
    },
  });
})();
