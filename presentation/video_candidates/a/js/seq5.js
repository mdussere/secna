/* Séquence 5 — Ma recette */
(() => {
  const S = window.SCENES, W = L.words;

  /* ============ 5a · Ma recette ============ */
  S.push({
    seq: 5, title: 'Ma recette', dur: 24,
    html: `
      <div class="abs col" style="left:150px;top:250px;width:900px;gap:30px">
        <div class="h1" data-at="0.4" data-fx="up">Ma recette.</div>
        <div class="p" data-at="2.5" data-fx="up">Pas mon invention : celle que j'utilise, et que je défends.</div>
        <div class="h4 mute" data-at="7" data-fx="up" style="margin-top:30px">Comme la pâte à crêpes : je ne l'ai pas inventée…</div>
        <div class="h4" data-at="11" data-fx="up">… mais quand je fais des crêpes, c'est celle-là que je prends.</div>
        <div class="row" style="gap:16px;margin-top:10px">
          <span class="pill" data-at="15" data-fx="pop">équilibrée</span>
          <span class="pill" data-at="16" data-fx="pop">elle tient bien dans la poêle</span>
        </div>
      </div>
      <svg class="abs" style="left:1080px;top:200px" width="700" height="700" viewBox="0 0 700 700">
        <defs><radialGradient id="cr" cx="45%" cy="40%"><stop offset="0" stop-color="#ffe3a3"/><stop offset=".7" stop-color="#f2b860"/><stop offset="1" stop-color="#c9822f"/></radialGradient></defs>
        <g data-at="1.5" data-fx="zoom">
          <rect x="560" y="320" width="150" height="46" rx="20" fill="#2a2f3b" transform="rotate(-20 560 340)"/>
          <circle cx="330" cy="350" r="270" fill="#171a22" stroke="#2f3442" stroke-width="16"/>
        </g>
        <circle cx="330" cy="350" r="230" fill="url(#cr)" data-at="7.5" data-fx="pop" style="--d:3s"/>
        ${Array.from({ length: 14 }, (_, i) => { const a = i * 2.4, rr = 40 + (i * 37) % 170; return `<circle cx="${330 + Math.cos(a) * rr}" cy="${350 + Math.sin(a) * rr}" r="${6 + (i % 4) * 3}" fill="#c98734" opacity=".55" data-at="${10 + i * .2}" data-fx="fade"/>`; }).join('')}
      </svg>`,
    say: [[0.4, "Alors, ma recette. Pas mon invention : celle que j'utilise, et que je défends."],
      [7, "Comme la pâte à crêpes : je ne l'ai pas inventée…"],
      [11, "… mais quand je fais des crêpes, c'est celle-là que je prends. Parce qu'elle est équilibrée, et qu'elle tient bien dans la poêle."]]
  });

  /* ============ 5b · SECNA sans le S ============ */
  S.push({
    seq: 5, title: 'SECNA sans le S', dur: 30, cls: 's5b',
    html: `
      <div class="row" style="gap:40px;justify-content:center;margin-top:-20px">
        <div style="position:relative"><div class="letter cS dropS" data-at="3" data-fx="state" style="font-size:210px">S</div><div class="slash" data-at="3" data-fx="state"></div></div>
        ${[['E', 'cE'], ['C', 'cC'], ['N', 'cN'], ['A', 'cA']].map(([l, c]) => `<div class="letter ${c}" style="font-size:210px">${l}</div>`).join('')}
      </div>
      <div class="center" style="height:auto;margin-top:40px;gap:24px">
        <div class="h3" data-at="4.5" data-fx="up">Pas de LLM pour préparer chaque document.</div>
        <div class="p mute" data-at="7" data-fx="up" data-out="18.5">C'est 92 % de la facture — et l'essentiel du temps.</div>
        <div class="row" data-at="11.5" data-fx="up" data-out="18.5" style="gap:18px;align-items:center">
          <span class="p">À la place, une préparation légère, sans LLM :</span>
          <span class="pill">le texte brut</span><span class="mute">+</span><span class="pill">son contexte · date · produit · note</span>
        </div>
      </div>
      <div class="abs row" style="left:150px;right:150px;top:640px;gap:40px">
        <div class="card grow1" data-at="19" data-fx="left" style="border-color:rgba(255,79,109,.4)"><div class="kicker warn">ce que je perds</div><div class="h4" style="margin-top:14px">un peu de finesse sur les textes longs et multi-sujets</div></div>
        <div class="card grow1" data-at="22" data-fx="right" style="border-color:rgba(78,227,160,.4)"><div class="kicker ok">ce que je gagne</div><div class="h4" style="margin-top:14px">le coût et la vitesse</div></div>
      </div>
      <style>.s5b .dropS{transition:opacity 1.2s,filter 1.2s}.s5b .dropS.on{opacity:.18;filter:blur(2px)}
      .s5b .slash{position:absolute;left:-12%;top:74%;width:0;height:12px;background:var(--warn);border-radius:6px;transform:rotate(-32deg);transform-origin:0 50%;transition:width .8s}
      .s5b .slash.on{width:130%;transform:rotate(-32deg)}</style>`,
    say: [[0.4, "Ma recette, c'est SECNA… sans le S."],
      [4.5, "Pas de LLM pour préparer chaque document : c'est 92 % de la facture, et l'essentiel du temps."],
      [11.5, 'À la place, une préparation légère, sans LLM : le texte brut, et son contexte — la date, le produit, la note.'],
      [19, "Ce que je perds : un peu de finesse sur les textes longs et multi-sujets."],
      [22, 'Ce que je gagne : le coût, et la vitesse.']]
  });

  /* ============ 5c · Pourquoi une table ============ */
  const ROWS = [
    ['Colis jamais arrivé', 'Livraison en retard', 'Livraison › retards', '12/10', 'App', 1],
    ['Appli lente depuis la mise à jour', 'Appli lente', 'Appli › performance', '14/10', 'App iOS', 1],
    ['Remboursement toujours pas reçu', 'Remboursement', 'Paiement › remboursement', '28/09', 'Web', 0],
    ["Le suivi n'a pas bougé depuis lundi", 'Livraison en retard', 'Livraison › retards', '17/10', 'Web', 1],
    ['Code promo refusé', 'Paiement refusé', 'Paiement › promotions', '03/09', 'App', 0],
    ["Ça plante à l'ouverture", 'Appli lente', 'Appli › performance', '19/10', 'App Android', 1]
  ];
  S.push({
    seq: 5, title: 'Pourquoi une table', dur: 28, cls: 's5c',
    html: `
      <div class="row" style="align-items:baseline;justify-content:space-between;margin-top:-10px">
        <div class="h3">${W("Le résultat n'est pas un rapport. C'est une *table.*", .4, .1)}</div>
        <span class="badge" data-at="3" data-fx="fade">illustratif</span>
      </div>
      <div class="p mute" data-at="3" data-fx="up" style="margin-top:14px">Chaque texte garde son groupe, son niveau, sa date, son produit.</div>
      <div class="row" style="margin-top:40px;gap:40px;align-items:flex-start">
        <div class="filt" data-at="11.5" data-fx="state">
          <div class="pill" data-at="11" data-fx="pop" style="margin-bottom:18px;border-color:var(--cE);color:var(--cE);font-size:24px">filtre · date : ce mois-ci</div>
          <table class="t"><tr><th>texte</th><th>groupe</th><th>niveau</th><th>date</th><th>produit</th></tr>
          ${ROWS.map((r, i) => `<tr class="${r[5] ? '' : 'nomatch'}" data-at="${4 + i * .5}" data-fx="left"><td>« ${r[0]} »</td><td style="color:${['#ff8a5c', '#5fb2ff', '#4ee3a0', '#ff8a5c', '#c58cff', '#5fb2ff'][i]}">${r[1]}</td><td class="mute">${r[2]}</td><td class="mono">${r[3]}</td><td class="mute">${r[4]}</td></tr>`).join('')}
          </table>
        </div>
        <div class="card" data-at="15" data-fx="right" style="width:400px;flex:none;padding:30px">
          <div class="kicker" style="margin-bottom:18px">thèmes qui montent ce mois-ci</div>
          ${[['Appli lente', 86, '#5fb2ff'], ['Livraison en retard', 64, '#ff8a5c'], ['Remboursement', 20, '#4ee3a0']].map(([t, v, c], i) => `<div style="margin:14px 0"><div style="font-size:24px">${t}</div><div class="growx" data-at="${16 + i * .5}" style="--w:${v * 3.6}px;height:14px;border-radius:7px;background:${c};margin-top:8px"></div></div>`).join('')}
        </div>
      </div>
      <div class="h3" data-at="21" data-fx="up" style="margin-top:46px">On la filtre, on la croise : <span class="cE">c'est ce qui rend la carte utile au quotidien.</span></div>
      <style>.s5c table.t td{font-size:21px;padding:9px 14px;white-space:nowrap}.s5c .filt.on tr.nomatch{opacity:.14}</style>`,
    say: [[0.4, "Pourquoi j'y tiens : le résultat n'est pas un rapport. C'est une table."],
      [3, 'Chaque texte garde son groupe, son niveau, sa date, son produit.'],
      [11, 'On la filtre, on la croise : quels thèmes montent ce mois-ci ?'],
      [17, 'Quels thèmes reviennent sur tel produit ?'],
      [21, "C'est ce qui rend la carte utile au quotidien."]]
  });

  /* ============ 5d · Où ça rapporte ============ */
  const tile = (at, t, sub, extra = '') => `<div class="card" data-at="${at}" data-fx="up" style="padding:32px;position:relative;overflow:hidden"><div class="h4">${t}</div><div class="p mute" style="margin-top:10px;font-size:30px">${sub}</div>${extra}</div>`;
  S.push({
    seq: 5, title: 'Où ça rapporte', dur: 32,
    html: `
      <div data-out="17.5">
        <div class="h3" data-at="0.3" data-fx="up" style="margin-top:-10px">Où ça rapporte</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:40px">
          ${tile(1, 'Avis clients', 'les vraies raisons des notes basses')}
          ${tile(3, 'Tickets de support', 'les catégories qui existent vraiment — pas celles du formulaire', `
            <div style="position:relative;height:62px;margin-top:18px">
              <div data-at="3.5" data-out="8" data-fx="fade" style="position:absolute;left:0;top:0;width:640px;height:56px;border-radius:10px;background:rgba(255,79,109,.3);border:2px solid var(--warn);display:flex;align-items:center;padding-left:18px;font-size:24px">« Autre »</div>
              ${['#ff8a5c', '#ffd166', '#4ee3a0', '#5fb2ff', '#c58cff'].map((c, i) => `<div data-at="${8 + i * .25}" data-fx="pop" style="position:absolute;left:${i * 130}px;top:0;width:120px;height:56px;border-radius:10px;background:${c}33;border:2px solid ${c}"></div>`).join('')}
            </div><div class="small" data-at="9.5" data-fx="fade" style="margin-top:6px">… et la catégorie « Autre » qui se découpe enfin.</div>`)}
          ${tile(5, 'Messages vendeurs', 'ce qui les bloque')}
          ${tile(6.5, 'Retours ouverts', 'ce que les gens disent quand on ne leur demande rien')}
        </div>
      </div>
      <div class="abs center" style="inset:0;padding:0 150px">
        <div class="kicker" data-at="18" data-fx="fade">un mot sur le RAG</div>
        <div class="row" style="gap:60px;margin-top:50px;align-items:stretch">
          <div class="card" data-at="18.5" data-fx="left" style="width:760px;text-align:left">
            <div class="mono" style="font-size:30px;color:var(--mute)">vous <span class="hl">→</span> question <span class="hl">→</span> corpus</div>
            <div class="h4" style="margin-top:22px">Le RAG répond à la question qu'on pose.</div>
            <div class="p mute" style="margin-top:10px">Il ne trouve que ce qu'on sait déjà chercher.</div>
          </div>
          <div class="card" data-at="23" data-fx="right" style="width:760px;text-align:left;border-color:rgba(78,227,160,.45)">
            <div class="mono" style="font-size:30px;color:var(--mute)">corpus <span class="ok">→</span> thèmes <span class="ok">→</span> vous</div>
            <div class="h4" style="margin-top:22px">Ici, ce sont <span class="ok">les thèmes qui viennent à vous.</span></div>
          </div>
        </div>
      </div>`,
    say: [[0.3, 'Où ça rapporte ? Les avis clients : les vraies raisons des notes basses.'],
      [3, 'Les tickets de support : les catégories qui existent vraiment, pas celles du formulaire — et la catégorie « Autre » qui se découpe enfin.'],
      [11, 'Les messages vendeurs : ce qui les bloque. Les retours ouverts : ce que les gens disent quand on ne leur demande rien.'],
      [18, "Un mot sur le RAG : il répond à une question qu'on pose. Il ne trouve que ce qu'on sait déjà chercher."],
      [23, 'Ici, ce sont les thèmes qui viennent à vous.']]
  });

  /* ============ 5e · Où ça s'arrête ============ */
  const lim = (at, i, txt, ans, extra = '') => `<div style="display:grid;grid-template-columns:80px 1fr 60px 1fr;gap:26px;align-items:center;padding:28px 0;border-bottom:1px solid var(--line)" data-at="${at}" data-fx="up">
      <div class="h2 warn" style="font-size:70px">${i}</div>
      <div><div class="h4" style="font-size:36px">${txt}</div>${extra}</div>
      <div class="h3 mute" data-at="${at + 4.5}" data-fx="left">→</div>
      <div class="h4 ok" data-at="${at + 5}" data-fx="left" style="font-size:36px">${ans}</div></div>`;
  S.push({
    seq: 5, title: "Où ça s'arrête", dur: 36,
    html: `
      <div class="h3" data-at="0.3" data-fx="up" style="margin-top:-10px">Où ça s'arrête</div>
      <div style="margin-top:30px">
        ${lim(1.5, 1, 'La plainte rare, grave mais unique, peut se noyer dans un grand groupe.', "Une carte du volume, pas une alarme : pour les signaux critiques, une veille à part.", '<div class="mono small" style="margin-top:10px">Clio le dit lui-même : « not useful for identifying rare … patterns »</div>')}
        ${lim(12.5, 2, 'Petit corpus, ou corpus très uniforme : il n\'y a rien à trouver.', 'Sous quelques milliers de textes : demandez au LLM de tout lire.')}
        ${lim(23, 3, 'Les noms des groupes sont une proposition du LLM, pas une vérité.', "Relire un échantillon par groupe ; vérifier qu'ils tiennent d'un passage à l'autre.")}
      </div>
      <div class="src">Tamkin et al., Clio, 2024 · arXiv:2412.13678 — limites</div>`,
    say: [[0.3, "Et où ça s'arrête. Trois limites, chacune avec sa réponse."],
      [1.5, 'Un : la plainte rare, grave mais unique, peut se noyer dans un grand groupe. Clio le dit lui-même.'],
      [6.5, "C'est une carte du volume, pas une alarme : pour les signaux critiques, il faut une veille à part."],
      [12.5, "Deux : sur un petit corpus, ou un corpus très uniforme, il n'y a rien à trouver."],
      [17.5, 'Sous quelques milliers de textes : demandez au LLM de tout lire.'],
      [23, 'Trois : les noms des groupes sont une proposition du LLM, pas une vérité.'],
      [28, "Relisez un échantillon par groupe, et vérifiez qu'ils tiennent d'un passage à l'autre."]]
  });

  /* ============ 5f · Demain ============ */
  S.push({
    seq: 5, title: 'Demain', dur: 28,
    html: `
      <div data-out="15">
        <div class="kicker" data-at="0.3" data-fx="fade">demain</div>
        <div class="h3" data-at="1" data-fx="up" style="margin-top:20px;max-width:1300px">La préparation de chaque document — <span class="cS">S</span> — est la seule étape LLM qui grossit avec le corpus.</div>
        <svg class="abs" style="left:150px;top:470px" width="900" height="400">
          <path d="M20 40 C 220 60, 330 250, 520 300 S 800 340, 880 345" fill="none" stroke="#ff7a4d" stroke-width="6" pathLength="1" data-at="5" data-fx="draw" style="--d:3s"/>
          <text x="20" y="390" fill="#8d93a3" font-size="22" font-family="ui-monospace, Menlo, monospace" data-at="5" data-fx="fade">prix des petits modèles spécialisés (illustratif) →</text>
        </svg>
        <div class="abs col" style="left:1120px;top:500px;width:650px;gap:30px">
          <div class="p" data-at="6.5" data-fx="up">C'est donc là que <b>chaque baisse de prix</b> tombe en premier.</div>
          <div class="h4" data-at="10" data-fx="up">Quand elle coûtera assez peu, <span class="cS">le S reviendra</span> dans ma recette.</div>
        </div>
      </div>
      <div class="abs" style="inset:0;padding:180px 150px 0">
        <div class="h2" data-at="15.5" data-fx="up">L'avenir n'est pas le LLM partout.</div>
        <div class="h2 grad" data-at="17" data-fx="up">C'est le mélange.</div>
        <div class="row" style="gap:30px;margin-top:60px">
          ${[['la data science', 'pour la structure', 'cC'], ['des petits modèles', 'pour chaque document', 'cS'], ['un grand modèle', 'là où le sens se fabrique', 'cN']].map(([a, b, c], i) =>
            `<div class="card grow1" data-at="${19 + i * 1.6}" data-fx="up" style="border-color:color-mix(in srgb,var(--${c}) 45%,transparent)"><div class="h3 ${c}" style="font-size:50px">${a}</div><div class="p" style="margin-top:10px">${b}</div></div>`).join('')}
        </div>
      </div>`,
    say: [[1, 'Demain : la préparation de chaque document, le S, est la seule étape LLM qui grossit avec le corpus.'],
      [6.5, "C'est donc là que chaque baisse de prix des petits modèles spécialisés tombe en premier."],
      [10, 'Quand elle coûtera assez peu, le S reviendra dans ma recette.'],
      [15.5, "L'avenir de ces méthodes, ce n'est pas le LLM partout. C'est le mélange :"],
      [19, 'la data science pour la structure, des petits modèles pour chaque document, un grand modèle là où le sens se fabrique.']]
  });

  /* ============ 5g · Et si… des agents ? ============ */
  const CENTERS = [
    { x: 330, y: 330, s: 46, wt: 1.6, name: 'Livraison en retard' }, { x: 650, y: 170, s: 38, wt: 1, name: 'Remboursement' },
    { x: 930, y: 400, s: 44, wt: 1.3, name: 'Connexion impossible' }, { x: 1270, y: 190, s: 42, wt: 1.2, name: 'Appli lente' },
    { x: 1460, y: 450, s: 38, wt: .9, name: 'Prix' }, { x: 600, y: 500, s: 38, wt: 1, name: 'Service client' },
    { x: 1150, y: 540, s: 34, wt: .8, name: 'Qualité produit' }, { x: 140, y: 130, s: 30, wt: .6, name: 'Paiement refusé' }
  ];
  const PATH = [[60, 600], [140, 130], [330, 330], [600, 500], [930, 400], [1270, 190], [1150, 540], [1460, 450]].map(([x, y]) => [x, y * .875]);
  S.push({
    seq: 5, title: 'Et si… des agents ?', dur: 26,
    html: `
      <canvas class="abs" style="left:150px;top:410px" width="1620" height="560"></canvas>
      <div class="abs col" style="left:150px;top:130px;gap:10px">
        <div class="h4 mute" data-at="0.4" data-fx="up">Une fois qu'on a cette carte — ces groupes nommés, rangés en niveaux…</div>
        <div class="h2" data-at="3.5" data-fx="up">… et si on mettait <span class="cN">des agents</span> dessus ?</div>
      </div>
      <div class="abs card" data-at="10" data-fx="pop" data-out="20" style="right:150px;top:300px;padding:22px 30px;border-radius:28px 28px 8px 28px;background:rgba(10,12,18,.92);border-color:rgba(95,178,255,.5)">
        <div class="h4" style="font-size:36px">« Quel problème monte le plus ce mois-ci ? »</div>
      </div>
      <div class="abs center" style="inset:0;background:rgba(6,7,11,.75)" data-at="20" data-fx="fade">
        <div class="h1" data-at="20.6" data-fx="blur">Ce sera pour la prochaine fois.</div>
      </div>`,
    init(el, s) { s.cl = new L.Cloud({ seed: 7, n: 1500, w: 1620, h: 560, noise: .05, centers: CENTERS.map(C => ({ ...C, y: C.y * .875 })) }); s.c = L.canvas(el.querySelector('canvas')); },
    tick(lt, s) {
      const x = s.cl.draw(s.c, { appear: 1, r: 2.6, color: .85, labels: () => .9, labelSize: 22 });
      const p = L.clamp((lt - 6) / 13) * (PATH.length - 1);
      const seg = Math.min(PATH.length - 2, Math.floor(p)), u = L.ease(p - seg);
      const ax = L.lerp(PATH[seg][0], PATH[seg + 1][0], u), ay = L.lerp(PATH[seg][1], PATH[seg + 1][1], u);
      if (lt > 5) {
        x.globalAlpha = .8; x.strokeStyle = '#5fb2ff'; x.lineWidth = 3; x.setLineDash([2, 8]); x.beginPath(); x.moveTo(PATH[0][0], PATH[0][1]);
        for (let i = 1; i <= seg; i++) x.lineTo(PATH[i][0], PATH[i][1]);
        x.lineTo(ax, ay); x.stroke(); x.setLineDash([]);
        x.globalAlpha = 1; x.fillStyle = '#5fb2ff'; x.shadowColor = '#5fb2ff'; x.shadowBlur = 30;
        x.beginPath(); x.arc(ax, ay, 12, 0, 6.283); x.fill(); x.shadowBlur = 0;
        x.strokeStyle = '#5fb2ff'; x.lineWidth = 2; x.beginPath(); x.arc(ax, ay, 22 + 8 * Math.sin(lt * 4), 0, 6.283); x.stroke();
        x.font = '600 20px ui-monospace, Menlo, monospace'; x.fillStyle = '#cfe6ff'; x.fillText('agent', ax + 30, ay + 6);
      }
    },
    say: [[0.4, "Pour finir, une question ouverte. Une fois qu'on a cette carte — ces groupes nommés et rangés en niveaux…"],
      [3.5, '… que se passe-t-il si on met des agents dessus ?'],
      [7, 'Un assistant qui parcourt la carte à notre place, descend dans les groupes, va chercher des exemples, et répond.'],
      [12, '« Quel problème monte le plus ce mois-ci ? »'],
      [20.6, 'Ce sera pour la prochaine fois.']]
  });

  /* ============ 5h · Fin ============ */
  S.push({
    seq: 5, title: 'Fin', dur: 26, cls: 's5h',
    html: `
      <div class="col" style="gap:26px;margin-top:20px">
        <div class="h2" data-at="0.5" data-fx="up">La facture suit les <span class="cC">groupes</span>, pas les documents.</div>
        <div class="h2" data-at="3.5" data-fx="up">La data science trouve la <span class="cC">structure</span>, le LLM lui donne du <span class="cN">sens</span>.</div>
        <div class="h2" data-at="7" data-fx="up">Le code est en ligne.</div>
      </div>
      <div class="row" style="margin-top:60px;gap:50px;align-items:center" data-at="9.5" data-fx="up">
        <div style="padding:14px;border-radius:20px;background:#f3f1ea">${L.qrSVG(230)}</div>
        <div class="col" style="gap:18px">
          <div class="h3 mono" style="font-size:50px">github.com/<span class="cN">mdussere/secna</span></div>
          <div class="h3 grad" data-at="11" data-fx="up">Prenez votre pile, un après-midi, et essayez.</div>
        </div>
      </div>
      <div class="src" data-at="14" data-fx="fade" style="line-height:1.7">
        Tamkin et al., Clio, Anthropic, déc. 2024 · arXiv:2412.13678<br>
        Liu et al., Urania, Google Research, COLM 2025 · arXiv:2506.04681<br>
        LangSmith Insights · docs.langchain.com/langsmith/insights<br>
        Michaël Dussère · Generative AI Bordeaux · 19 novembre 2026
      </div>
      <style>.s5h .h2{font-size:64px}</style>`,
    say: [[0.5, 'Ce qu\'il faut retenir : la facture suit les groupes, pas les documents.'],
      [3.5, 'La data science trouve la structure ; le LLM lui donne du sens.'],
      [7, 'Et le code est en ligne.'],
      [11, 'Prenez votre pile, un après-midi, et essayez. Merci.']]
  });
})();
