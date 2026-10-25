/* 05 Ma recette */
(function () {
  'use strict';
  const { clamp, lerp, prog, eo, eio, rng } = U;

  U.chapterCard(5, 'Ma recette', 'Pas mon invention — celle que j’utilise et que je défends');

  const SPOTS = (() => { const r = rng(5); return Array.from({ length: 46 }, () => ({ a: r() * 6.28, d: Math.sqrt(r()) * .88, s: 4 + r() * 16, o: .15 + r() * .35 })); })();
  scene({
    id: 'crepes', ch: 5, dur: 20, title: 'La pâte à crêpes',
    narr: 'Ma recette — pas mon invention, celle que j’utilise et que je défends. Comme la pâte à crêpes : je ne l’ai pas inventée, mais quand je fais des crêpes, c’est celle-là que je prends, parce qu’elle est équilibrée et qu’elle tient bien dans la poêle.',
    html: `<div class="wrap">
      <div class="abs col gap24" style="left:160px;top:250px;width:860px">
        <div class="d2" data-at="0.4">Ma recette.</div>
        <div class="t1" data-at="2">Pas mon invention : celle que <b class="cost">j’utilise</b> et que <b class="cost">je défends</b>.</div>
        <div class="t2" data-at="7" style="margin-top:50px">Comme la pâte à crêpes : je ne l’ai pas inventée,</div>
        <div class="t2" data-at="10">mais c’est celle-là que je prends —<br><b>équilibrée</b>, elle <b>tient bien dans la poêle</b>.</div></div>
    </div>`,
    draw(ctx, t) {
      const cx = 1420, cy = 560, R = 300;
      ctx.save();
      const base = ctx.globalAlpha * clamp(t / 1.2);
      ctx.globalAlpha = base;
      // pan
      ctx.fillStyle = '#14161f'; ctx.beginPath(); ctx.arc(cx, cy, R + 40, 0, 6.28); ctx.fill();
      ctx.strokeStyle = '#262a38'; ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = '#14161f'; ctx.save(); ctx.translate(cx + R + 30, cy + 30); ctx.rotate(.5); ctx.beginPath(); ctx.roundRect(0, -24, 320, 48, 24); ctx.fill(); ctx.restore();
      // crêpe (rotating, golden)
      const rot = t * .35;
      const g = ctx.createRadialGradient(cx - 60, cy - 60, 20, cx, cy, R);
      g.addColorStop(0, '#ffd88a'); g.addColorStop(.7, '#f5b65a'); g.addColorStop(1, '#d48a36');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * eo(clamp(t / 2)), 0, 6.28); ctx.fill();
      SPOTS.forEach(s => {
        const a = s.a + rot, x = cx + Math.cos(a) * s.d * R, y = cy + Math.sin(a) * s.d * R;
        ctx.globalAlpha = base * s.o * clamp(t - 1.5);
        ctx.fillStyle = '#9a5a1e'; ctx.beginPath(); ctx.ellipse(x, y, s.s, s.s * .7, a, 0, 6.28); ctx.fill();
      });
      // steam
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = base * .12;
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath();
        for (let k = 0; k < 30; k++) { const y = cy - R - 30 - k * 6, x = cx - 80 + i * 80 + Math.sin(k * .35 + t * 2 + i) * 12; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }
      ctx.restore();
    },
  });

  scene({
    id: 'nos', ch: 5, dur: 28, title: 'SECNA sans le S',
    narr: 'Ma recette, c’est SECNA sans le S : pas de LLM pour préparer chaque document — c’est quatre-vingt-douze pour cent de la facture et l’essentiel du temps. À la place, une préparation légère, sans LLM : le texte brut, et son contexte — la date, le produit, la note… Ce que je perds : un peu de finesse sur les textes longs et multi-sujets. Ce que je gagne : le coût et la vitesse.',
    html: `<div class="wrap">
      <div class="abs" style="left:0;right:0;top:150px;display:flex;justify-content:center;gap:30px;font:800 200px/1 var(--sans);letter-spacing:-.03em">
        <span class="sS" data-at="0.5" style="color:var(--llm)"><span data-at="3.5" data-fx="strike">S</span></span>
        <span data-at="0.8" class="ds">E</span><span data-at="1.1" class="ds">C</span><span data-at="1.4" class="llm">N</span><span data-at="1.7" class="ds">A</span></div>
      <div class="abs center col" style="left:0;right:0;top:390px">
        <div class="t1" data-at="4.5">SECNA <b class="bad">sans le S</b></div>
        <div class="t3" data-at="5.5">pas de LLM pour préparer chaque document : <b class="cost">92 % de la facture</b>, l’essentiel du temps</div></div>
      <div class="abs center col" style="left:0;right:0;top:560px">
        <div class="t2" data-at="9">À la place : une préparation légère, <b>sans LLM</b></div>
        <div style="display:flex;gap:16px;margin-top:24px">
          <span class="chip ds" data-at="10.5" data-fx="pop">texte brut</span><span class="chip" data-at="11.2" data-fx="pop">+ date</span>
          <span class="chip" data-at="11.9" data-fx="pop">+ produit</span><span class="chip" data-at="12.6" data-fx="pop">+ note…</span></div></div>
      <div class="abs" style="left:260px;right:260px;top:790px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
        <div class="card" data-at="16"><div class="k">Je perds</div><div class="t2" style="margin-top:12px">un peu de finesse sur les textes longs et multi-sujets</div></div>
        <div class="card" data-at="19" style="border-color:rgba(110,240,176,.4)"><div class="k good">Je gagne</div><div class="t1" style="margin-top:12px">le <b class="good">coût</b> et la <b class="good">vitesse</b></div></div></div>
    </div>`,
  });

  const ROWS = [
    ['« Toujours pas reçu mon colis »', 'Colis jamais arrivés', 'Livraison', '12 oct.', 'App', '★☆☆☆☆', 1],
    ['« Le paiement plante à la validation »', 'Bugs au paiement', 'Paiement', '14 oct.', 'Web', '★★☆☆☆', 1],
    ['« Remboursé en 2 jours, parfait »', 'Compliments', 'Service', '15 oct.', 'App', '★★★★★', 1],
    ['« Impossible de joindre quelqu’un »', 'Service client injoignable', 'Service', '28 sept.', 'App', '★☆☆☆☆', 0],
    ['« Taille trop petite, retour galère »', 'Tailles et retours', 'Produit', '19 oct.', 'Web', '★★☆☆☆', 1],
    ['« Livré avec une semaine de retard »', 'Retards de livraison', 'Livraison', '21 oct.', 'App', '★★☆☆☆', 1],
    ['« Mot de passe refusé en boucle »', 'Connexion impossible', 'Compte', '02 sept.', 'Web', '★☆☆☆☆', 0],
  ];
  scene({
    id: 'table', ch: 5, dur: 24, title: 'Pourquoi une table', illus: true,
    narr: 'Pourquoi une table : le résultat n’est pas un rapport mais une table. Chaque texte garde son groupe, son niveau, sa date, son produit. On la filtre et on la croise : quels thèmes montent ce mois-ci ? Quels thèmes reviennent sur tel produit ? C’est ce qui rend la carte utile au quotidien.',
    html: `<div class="wrap">
      <div class="k" data-at="0.3">Pourquoi une table</div>
      <div class="d3" data-at="1" style="margin-top:14px;font-size:64px">Pas un rapport : <span class="ds">une table</span>.</div>
      <div style="display:flex;gap:14px;margin-top:34px" data-at="9">
        <span class="chip ds">mois : octobre ✕</span><span class="chip" data-at="14">produit : App</span><span class="chip good" data-at="17">↑ thèmes qui montent</span></div>
      <div class="tbl" data-at="3" style="margin-top:22px;border:1px solid var(--line);border-radius:18px;overflow:hidden;font-size:24px">
        <div style="display:grid;grid-template-columns:2.4fr 1.8fr 1fr .8fr .7fr .9fr;gap:20px;padding:16px 26px;background:#0e1018;font:500 18px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:#555b6e">
          <span>texte</span><span>groupe</span><span>niveau 1</span><span>date</span><span>produit</span><span>note</span></div>
        ${ROWS.map(r => `<div class="tr" data-m="${r[6]}" data-p="${r[4]}" style="display:grid;grid-template-columns:2.4fr 1.8fr 1fr .8fr .7fr .9fr;gap:20px;padding:15px 26px;border-top:1px solid #151827;transition:opacity .5s,background .5s">
          <span style="color:#c7cbd6">${r[0]}</span><span class="ds">${r[1]}</span><span class="mute">${r[2]}</span><span class="mono mute" style="font-size:21px">${r[3]}</span><span class="mono mute" style="font-size:21px">${r[4]}</span><span class="cost" style="letter-spacing:.05em">${r[5]}</span></div>`).join('')}
      </div>
      <div class="t2" data-at="19" style="margin-top:28px">Chaque texte garde son groupe, son niveau, sa date, son produit. <b>On filtre, on croise.</b></div>
    </div>`,
    build(el, st) { st.r = [...el.querySelectorAll('.tr')]; },
    update(t, el, st) {
      st.r.forEach(r => {
        const out = (t > 9.5 && r.dataset.m === '0') || (t > 14.5 && r.dataset.p !== 'App');
        r.style.opacity = out ? .15 : 1;
        r.style.background = !out && t > 17.5 ? 'rgba(110,240,176,.06)' : 'transparent';
      });
    },
  });

  scene({
    id: 'payoff', ch: 5, dur: 28, title: 'Où ça rapporte',
    narr: 'Où ça rapporte : les avis clients — les vraies raisons des notes basses. Les tickets de support — les catégories qui existent vraiment, pas celles du formulaire, et la catégorie « Autre » qui se découpe enfin. Les messages vendeurs — ce qui les bloque. Les retours ouverts — ce que les gens disent quand on ne leur demande rien.\nUn mot sur le RAG : il répond à une question qu’on pose ; il ne trouve que ce qu’on sait déjà chercher. Ici, ce sont les thèmes qui viennent à vous.',
    html: `<div class="wrap">
      <div class="k" data-at="0.3">Où ça rapporte</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:36px">
        ${[['Avis clients', 'les vraies raisons des notes basses', '#5cc8ff'], ['Tickets de support', 'les catégories qui existent vraiment — et « Autre » se découpe enfin', '#7cf2c9'],
          ['Messages vendeurs', 'ce qui les bloque', '#ffb547'], ['Retours ouverts', 'ce que les gens disent quand on ne leur demande rien', '#c08cff']]
          .map(([h, d, c], i) => `<div class="card" data-at="${1.5 + i * 2.2}" style="height:330px;border-top:4px solid ${c}">
            <div class="t1" style="font-size:38px">${h}</div><div class="t3" style="margin-top:16px">${d}</div>
            ${i === 1 ? `<div class="autre" style="display:flex;gap:4px;margin-top:22px;height:30px"><i style="flex:1;background:#ff5d6c;border-radius:6px;transition:all .8s"></i></div>` : ''}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:60px">
        <div class="card" data-at="15"><div class="k">Le RAG</div><div class="t1" style="margin-top:14px;font-size:38px">répond à la question qu’on pose.</div><div class="t3" style="margin-top:10px">Il ne trouve que ce qu’on sait déjà chercher.</div></div>
        <div class="card" data-at="19" style="border-color:rgba(110,240,176,.45);box-shadow:0 0 60px rgba(110,240,176,.1)"><div class="k good">Ici</div><div class="t1" style="margin-top:14px;font-size:38px"><b class="good">les thèmes viennent à vous.</b></div></div>
      </div></div>`,
    build(el, st) { st.a = el.querySelector('.autre'); },
    update(t, el, st) {
      const split = t > 7 && !st.done;
      if (t > 7 && st.a.children.length === 1) {
        st.a.innerHTML = U.PAL.slice(0, 6).map(c => `<i style="flex:1;background:${c};border-radius:6px;opacity:.9"></i>`).join('');
      } else if (t <= 7 && st.a.children.length > 1) {
        st.a.innerHTML = '<i style="flex:1;background:#ff5d6c;border-radius:6px"></i>';
      }
    },
  });

  scene({
    id: 'limits', ch: 5, dur: 34, title: 'Où ça s’arrête',
    src: 'Clio, arXiv:2412.13678 — limite sur les motifs rares',
    narr: 'Où ça s’arrête — les limites, chacune avec sa réponse.\n1. La plainte rare, grave mais unique, peut se noyer dans un grand groupe — Clio le dit lui-même : « not useful for identifying rare … patterns ». C’est une carte du volume, pas une alarme : pour les signaux critiques, une veille à part.\n2. Sur un petit corpus, ou un corpus très uniforme, il n’y a rien à trouver : sous quelques milliers de textes, demander au LLM de tout lire.\n3. Les noms des groupes sont une proposition du LLM, pas une vérité : relire un échantillon par groupe, vérifier qu’ils tiennent d’un passage à l’autre.',
    html: `<div class="wrap">
      <div class="k" data-at="0.3">Où ça s’arrête</div>
      ${[
        ['La plainte rare, grave mais unique, peut se noyer dans un grand groupe.', '<i>« not useful for identifying rare … patterns »</i> — Clio', 'Une carte du volume, pas une alarme → <b>une veille à part</b> pour les signaux critiques.', 2, 6],
        ['Petit corpus, ou corpus très uniforme : rien à trouver.', '', 'Sous quelques milliers de textes → <b>demander au LLM de tout lire</b>.', 12, 15],
        ['Les noms des groupes sont une proposition du LLM, pas une vérité.', '', '<b>Relire un échantillon</b> par groupe, vérifier qu’ils tiennent d’un passage à l’autre.', 21, 24],
      ].map(([l, q, r, a, b], i) => `<div style="display:grid;grid-template-columns:90px 1fr 1fr;gap:40px;align-items:start;margin-top:${i ? 50 : 50}px;padding-top:${i ? 50 : 0}px;border-top:${i ? '1px solid #1a1e2a' : '0'}">
          <div class="mono dim" data-at="${a}" style="font-size:60px;font-weight:700">0${i + 1}</div>
          <div data-at="${a}"><div class="t1" style="font-size:38px">${l}</div>${q ? `<div class="t3" style="margin-top:12px">${q}</div>` : ''}</div>
          <div class="t2" data-at="${b}" data-fx="right" style="font-size:32px;border-left:3px solid var(--good);padding-left:26px">${r}</div></div>`).join('')}
    </div>`,
  });

  scene({
    id: 'tomorrow', ch: 5, dur: 26, title: 'Demain : le mélange',
    narr: 'Demain : la préparation de chaque document — le S — est la seule étape LLM qui grossit avec le corpus ; c’est donc là que chaque baisse de prix des petits modèles spécialisés tombe en premier. Quand elle coûtera assez peu, le S reviendra dans ma recette.\nL’avenir de ces méthodes n’est pas le LLM partout, c’est le mélange : la data science pour la structure, des petits modèles pour chaque document, un grand modèle là où le sens se fabrique.',
    html: `<div class="wrap">
      <div class="k" data-at="0.3">Demain</div>
      <div class="t1" data-at="1" style="margin-top:20px"><b class="llm">S</b> est la seule étape LLM qui grossit avec le corpus.</div>
      <div class="t2" data-at="4">C’est là que chaque baisse de prix des petits modèles spécialisés tombe en premier.</div>
      <div class="t1" data-at="7.5" style="margin-top:14px">Quand elle coûtera assez peu, <b class="good">le S reviendra</b> dans ma recette.</div>
      <div class="k" data-at="12" style="margin-top:80px">L’avenir : pas le LLM partout — <span class="ink">le mélange</span></div>
      <div class="col gap16" style="margin-top:30px">
        ${[['La data science', 'pour la structure', 'ds', 14], ['Des petits modèles', 'pour chaque document', 'good', 16], ['Un grand modèle', 'là où le sens se fabrique', 'llm', 18]]
          .map(([a, b, c, at]) => `<div data-at="${at}" data-fx="left" style="display:flex;align-items:baseline;gap:24px;padding:22px 34px;border-radius:20px;background:linear-gradient(90deg,var(--${c}) 0 6px,rgba(255,255,255,.03) 6px)">
            <span class="d3 ${c}" style="font-size:56px">${a}</span><span class="t2">${b}</span></div>`).join('')}</div>
    </div>`,
  });

  /* agents exploring the map */
  const PATH = [8, 0, 1, 2, 5, 2];
  scene({
    id: 'agents', ch: 5, dur: 24, title: 'Et si on mettait des agents dessus ?', illus: true,
    narr: 'La fin — une question ouverte. Une fois qu’on a cette carte, ces groupes nommés et rangés en niveaux, que se passe-t-il si on met des agents dessus ? Un assistant qui parcourt la carte à notre place, descend dans les groupes, va chercher des exemples et répond — par exemple : « quel problème monte le plus ce mois-ci ? ». Ce sera pour la prochaine fois.',
    html: `<div class="wrap">
      <div class="abs col gap24" style="left:160px;top:200px;width:640px">
        <div class="k" data-at="0.3">Une question ouverte</div>
        <div class="d3" data-at="1">Et si on mettait des <span class="llm glow-llm">agents</span> dessus ?</div>
        <div class="t2" data-at="4">Un assistant qui parcourt la carte, descend dans les groupes, va chercher des exemples — et répond.</div>
        <div class="card" data-at="7" style="padding:24px 30px;border-color:rgba(192,140,255,.45)"><div class="t1" style="font-size:31px;white-space:nowrap">« Quel problème monte le plus ce mois-ci ? »</div></div>
      </div>
      <div class="abs d2" data-at="18" data-fx="blur" style="left:160px;bottom:110px;font-size:80px">Ce sera pour <span class="llm">la prochaine fois</span>.</div>
    </div>`,
    draw(ctx, t) {
      U.drawCloud(ctx, { embed: 1, color: 1, halo: .8, alpha: .75, focus: t > 15.5 ? 2 : null });
      ctx.save();
      const base = ctx.globalAlpha;
      U.CLUSTERS.forEach((c, k) => U.pill(ctx, c.name, c.x + c.lx, c.y + c.ly, { alpha: (t > 15.5 && k !== 2 ? .25 : .85), font: '600 19px "Inter Tight",sans-serif', h: 36, stroke: U.PAL[k], color: U.PAL[k] }));
      // agent
      const seg = 1.6, t0 = 8;
      const u = clamp((t - t0) / seg, 0, PATH.length - 1);
      const i = Math.min(PATH.length - 2, Math.floor(u)), f = eio(u - i);
      const A = U.CLUSTERS[PATH[i]], B = U.CLUSTERS[PATH[i + 1]];
      const x = lerp(A.x, B.x, f), y = lerp(A.y, B.y, f);
      const vis = clamp(t - t0 + .5);
      if (vis > 0) {
        for (let k = 1; k < 14; k++) {
          const uu = clamp((t - k * .06 - t0) / seg, 0, PATH.length - 1), ii = Math.min(PATH.length - 2, Math.floor(uu)), ff = eio(uu - ii);
          const P = U.CLUSTERS[PATH[ii]], Q = U.CLUSTERS[PATH[ii + 1]];
          ctx.globalAlpha = base * vis * (1 - k / 14) * .5;
          ctx.fillStyle = '#c08cff'; ctx.beginPath(); ctx.arc(lerp(P.x, Q.x, ff), lerp(P.y, Q.y, ff), 9 - k * .5, 0, 6.28); ctx.fill();
        }
        ctx.globalAlpha = base * vis;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 50); g.addColorStop(0, 'rgba(192,140,255,.7)'); g.addColorStop(1, 'rgba(192,140,255,0)');
        ctx.fillStyle = g; ctx.fillRect(x - 50, y - 50, 100, 100);
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.28); ctx.fill();
      }
      if (t > 15.5) {
        const c = U.CLUSTERS[2];
        U.pill(ctx, '→ « Remboursements en attente » · en hausse — exemples à l’appui', c.x + 60, c.y + 190, { alpha: clamp((t - 15.5) / .6), stroke: '#c08cff', color: '#f3f4f8', font: '500 22px "Inter Tight",sans-serif', h: 48 });
      }
      ctx.restore();
    },
  });

  scene({
    id: 'final', ch: 5, dur: 26, title: 'Dernière phrase', noFadeOut: false,
    src: 'Sources : Clio — arXiv:2412.13678 · Urania — arXiv:2506.04681 · LangSmith Insights — docs.langchain.com/langsmith/insights',
    narr: 'La facture suit les groupes, pas les documents. La data science trouve la structure, le LLM lui donne du sens. Le code est en ligne — prenez votre pile, un après-midi, et essayez.',
    html: `<div class="wrap">
      <div class="abs col gap40" style="left:160px;top:200px;width:1000px">
        <div class="d3" data-at="0.8" style="font-size:62px">La facture suit <span class="good">les groupes</span>, pas les documents.</div>
        <div class="d3" data-at="4.5" style="font-size:62px">La <span class="ds">data science</span> trouve la structure, le <span class="llm">LLM</span> lui donne du sens.</div>
        <div class="d3" data-at="8.5" style="font-size:62px">Le code est en ligne — <span class="cost">prenez votre pile, un après-midi, et essayez.</span></div></div>
      <div class="abs center" data-at="11" data-fx="scale" style="left:1300px;top:230px;width:460px">
        <div style="background:#fff;padding:20px;border-radius:26px;box-shadow:0 0 80px rgba(255,181,71,.2)"><img src="qr.svg" width="340" height="340" alt="QR code vers github.com/mdussere/secna" style="display:block"></div>
        <div class="mono" style="font-size:28px;margin-top:26px">github.com/<b>mdussere/secna</b></div></div>
      <div class="abs" data-at="16" style="left:160px;bottom:120px;display:flex;align-items:baseline;gap:40px">
        <span class="d2" style="font-size:96px">Merci.</span>
        <span class="t2">Michaël Dussère · Generative AI Bordeaux · 19 novembre 2026</span></div>
    </div>`,
    draw(ctx, t) { U.drawField(ctx, t, .8); },
  });
})();
