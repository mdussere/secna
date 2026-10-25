/* Séquence 3 — SECNA */
(() => {
  const S = window.SCENES, W = L.words;
  const SRC = 'Coûts : Tamkin et al., Clio, Anthropic, déc. 2024 · arXiv:2412.13678 · table 3 (100 000 conversations)';
  const cost = (at, val, sub, c) => `<div class="costbox" data-at="${at}" data-fx="down"><div class="lab">coût de l'étape</div><div class="val" style="color:${c}">${val}</div><div class="small" style="font-size:20px">${sub}</div></div>`;
  const cap = (at, out, html) => `<div class="abs h3" data-at="${at}" ${out ? `data-out="${out}"` : ''} data-fx="up" style="left:150px;right:150px;bottom:110px;font-size:50px">${html}</div>`;

  /* le nuage partagé par E, C et N : des avis clients (exemple illustratif) */
  const CENTERS = [
    { x: 330, y: 330, s: 46, wt: 1.6, name: 'Livraison en retard' },
    { x: 650, y: 170, s: 38, wt: 1, name: 'Remboursement' },
    { x: 930, y: 400, s: 44, wt: 1.3, name: 'Connexion impossible' },
    { x: 1270, y: 190, s: 42, wt: 1.2, name: 'Appli lente' },
    { x: 1460, y: 450, s: 38, wt: .9, name: 'Prix' },
    { x: 600, y: 500, s: 38, wt: 1, name: 'Service client' },
    { x: 1150, y: 540, s: 34, wt: .8, name: 'Qualité produit' },
    { x: 140, y: 130, s: 30, wt: .6, name: 'Paiement refusé' }
  ];
  const mkCloud = () => new L.Cloud({ seed: 7, n: 1500, w: 1620, h: 640, noise: .05, centers: CENTERS });
  const CV = `<canvas class="abs" style="left:150px;top:190px" width="1620" height="640"></canvas>`;
  const SPECIAL = [
    { x: 300, y: 318, t: '« colis jamais arrivé »', at: 17.5, dx: -10, dy: -60 },
    { x: 360, y: 345, t: '« livraison en retard »', at: 20, dx: 30, dy: 70 },
    { x: 1290, y: 175, t: '« appli lente depuis la mise à jour »', at: 24, dx: 0, dy: -60 }
  ];

  /* ============ 3a · Cinq lettres ============ */
  const LET = [['S', 'Summarise', 'préparer', 'cS'], ['E', 'Embed', 'projeter', 'cE'], ['C', 'Cluster', 'regrouper', 'cC'], ['N', 'Name', 'nommer', 'cN'], ['A', 'Aggregate', 'ranger', 'cA']];
  S.push({
    seq: 3, title: 'Cinq lettres', dur: 26,
    html: `
      <div class="center">
        <div class="kicker" data-at="0.4" data-fx="fade">la recette de Clio, en cinq étapes</div>
        <div class="row" style="gap:70px;margin-top:40px" data-out="12.5">
          ${LET.map(([l, en, fr, c], i) => `<div class="col" style="align-items:center;gap:6px">
            <div class="letter ${c}" data-at="${1.4 + i * .45}" data-fx="pop" style="text-shadow:0 0 80px color-mix(in srgb,var(--${c}) 50%,transparent)">${l}</div>
            <div class="h4" data-at="${4.5 + i * .35}" data-fx="up" style="font-size:38px">${en}</div>
            <div class="p mute" data-at="${7 + i * .35}" data-fx="up">${fr}</div></div>`).join('')}
        </div>
      </div>
      <div class="abs center" style="inset:0;gap:36px">
        <div class="h3 mute" data-at="13.2" data-fx="up">Le domaine n'a pas de nom canonique pour cette recette.</div>
        <div class="h2" data-at="16" data-fx="up"><span class="grad" style="font-weight:900">SECNA</span> : un nom inventé pour ce talk.</div>
        <div class="h3" data-at="20" data-fx="up">La recette n'est pas la mienne : <span class="cS">c'est celle de Clio.</span></div>
      </div>`,
    say: [[0.4, 'La recette de Clio tient en cinq étapes.'],
      [1.5, 'Summarise, Embed, Cluster, Name, Aggregate.'],
      [7, 'Préparer, projeter, regrouper, nommer, ranger.'],
      [13.2, "Le domaine n'a pas de nom canonique pour cette recette. SECNA, c'est un nom inventé pour ce talk."],
      [20, "Et la recette n'est pas la mienne : c'est celle de Clio."]]
  });

  /* ============ 3b · S — Summarise ============ */
  S.push({
    seq: 3, title: 'S — Summarise', dur: 36,
    html: `
      ${L.rail('S')}
      ${cost(24, '45,00 $', 'Claude 3 Haiku · le plus petit modèle de l\'époque', 'var(--cS)')}
      <div class="row" style="margin-top:60px;align-items:center;gap:30px">
        <div class="card" data-at="0.8" data-fx="left" style="width:660px;font-size:26px;line-height:1.5;color:#b9bdc8;padding:32px">
          <div class="kicker" style="margin-bottom:14px">un document brut</div>
          bonjour, alors voilà j'ai commandé il y a 2 semaines (commande n°48213) et toujours rien… au passage votre appli plante quand je veux voir le suivi ?? also the tracking link is broken. et sinon vous avez des réducs pour les étudiants ? merci d'avance enfin j'espère
        </div>
        <div class="col" style="align-items:center;gap:14px;flex:none">
          <div class="pill" data-at="3.6" data-fx="pop" style="border-color:var(--cS);color:var(--cS);font-weight:700">LLM</div>
          <svg width="150" height="30"><path d="M5 15H140M128 5l12 10-12 10" fill="none" stroke="#ff7a4d" stroke-width="4" pathLength="1" data-at="4.2" data-fx="draw" style="--d:1s"/></svg>
        </div>
        <div class="card" data-at="5.5" data-fx="right" style="flex:1;border-color:rgba(255,122,77,.45);padding:32px">
          <div class="kicker" style="margin-bottom:14px">l'essentiel, extrait</div>
          <div class="mono" style="font-size:27px;line-height:1.75;white-space:pre-wrap" data-type="5" data-tat="6"><span class="cS">demande</span> : suivi d'une commande non reçue
<span class="cS">sujets </span> : livraison · appli (suivi) · réduction
<span class="cS">langue </span> : français (+ anglais)
<span class="cS">ton    </span> : agacé</div>
        </div>
      </div>
      <div class="row" style="gap:16px;margin-top:40px;flex-wrap:wrap" data-out="23.6">
        ${['il résume', 'il traduit', 'il efface la forme', 'il fait ressortir ce qui porte le sens'].map((t, i) => `<span class="pill" data-at="${12 + i * .8}" data-fx="up">${t}</span>`).join('')}
        <span class="badge" data-at="12" data-fx="fade" style="margin-left:auto;align-self:center">exemple illustratif</span>
      </div>
      <div class="p" data-at="17.5" data-fx="up" data-out="23.6" style="margin-top:28px">Chez Clio, cette étape sert aussi à <b>protéger la confidentialité</b> et à <b>choisir l'angle d'analyse</b>.</div>
      <div class="row abs" style="left:150px;right:150px;bottom:120px;align-items:baseline;gap:40px">
        <div class="h2 cS" data-at="25.5" data-fx="up">92 % de la facture.</div>
        <div class="h3 mute" data-at="28.5" data-fx="up">Un appel LLM par document.</div>
      </div>
      <div class="src" data-at="24" data-fx="fade">${SRC}</div>`,
    say: [[0.8, "S, comme Summarise : préparer. Un LLM relit chaque document, et en extrait l'essentiel."],
      [12, 'Il résume, il traduit, il efface la forme, il fait ressortir ce qui porte le sens. Clio extrait ainsi quelques attributs par conversation, dont un résumé de la demande.'],
      [17.5, "Chez Clio, cette étape sert aussi à protéger la confidentialité, et à choisir l'angle d'analyse."],
      [24, "Coût : quarante-cinq dollars, avec le plus petit modèle de l'époque, Claude 3 Haiku."],
      [25.5, "C'est 92 % de la facture. Parce que c'est un appel par document."]]
  });

  /* ============ 3c · E — Embed ============ */
  S.push({
    seq: 3, title: 'E — Embed', dur: 34,
    html: `
      ${L.rail('E', 'S')}
      ${cost(27, '≈ 0 $', 'quelques centimes · peut tourner en local', 'var(--cE)')}
      ${CV}
      ${cap(0.6, 15.5, "Un modèle d'<span class='cE'>embedding</span> transforme chaque texte en un point.")}
      ${cap(16.5, 25.5, 'Même sens, mots différents : <span class="cE">tout près</span>.')}
      ${cap(26, 0, 'Le sens devient de la <span class="cE">géométrie.</span>')}`,
    init(el, s) { s.cl = mkCloud(); s.c = L.canvas(el.querySelector('canvas')); },
    tick(lt, s) {
      const x = s.cl.draw(s.c, { appear: L.prog(lt, 1.5, 15, t => t), r: 3 });
      SPECIAL.forEach((p, i) => {
        const a = L.prog(lt, p.at, p.at + 1.2); if (a <= 0) return;
        x.globalAlpha = a; x.fillStyle = '#ffc94d';
        x.beginPath(); x.arc(p.x, p.y, 9, 0, 6.283); x.fill();
        x.strokeStyle = '#ffc94d'; x.lineWidth = 2; x.beginPath(); x.arc(p.x, p.y, 16 + 6 * Math.sin(lt * 3), 0, 6.283); x.stroke();
        L.pillLabel(x, p.t, p.x + p.dx, p.y + p.dy, '#ffc94d', a, 26);
      });
      const a2 = L.prog(lt, 21, 22.5);
      if (a2 > 0) { x.globalAlpha = a2; x.strokeStyle = '#ffc94d'; x.setLineDash([4, 5]); x.lineWidth = 2; x.beginPath(); x.moveTo(SPECIAL[0].x, SPECIAL[0].y); x.lineTo(SPECIAL[1].x, SPECIAL[1].y); x.stroke(); x.setLineDash([]); }
      x.globalAlpha = 1;
    },
    say: [[0.6, "E, comme Embed : projeter. Un petit modèle de langage — un modèle d'embedding — transforme chaque texte en un point dans un espace."],
      [16.5, "Deux textes qui veulent dire la même chose atterrissent tout près l'un de l'autre : « colis jamais arrivé » et « livraison en retard »…"],
      [22, '… des mots différents, le même sens. Alors qu\'« appli lente depuis la mise à jour » atterrit ailleurs.'],
      [26, 'Le sens devient de la géométrie. Coût : quelques centimes — et ça peut tourner en local.']]
  });

  /* ============ 3d · C — Cluster ============ */
  S.push({
    seq: 3, title: 'C — Cluster', dur: 30,
    html: `
      ${L.rail('C', 'SE')}
      ${cost(15, '0 $', 'aucun token', 'var(--cC)')}
      ${CV}
      ${cap(0.6, 9, 'Les points proches forment des <span class="cC">groupes.</span>')}
      ${cap(9.5, 14.5, 'Quelques points restent <span class="warn">isolés.</span>')}
      ${cap(15, 20.5, 'Pas de LLM : <span class="cC">du calcul pur.</span>')}
      ${cap(21, 0, "C'est ici que la <span class='cC'>structure</span> est trouvée.")}`,
    init(el, s) { s.cl = mkCloud(); s.c = L.canvas(el.querySelector('canvas')); },
    tick(lt, s) {
      s.cl.draw(s.c, {
        appear: 1, r: 3, color: L.prog(lt, 1.5, 7), noiseRing: L.prog(lt, 9.5, 11) * (1 - L.prog(lt, 15, 16.5) * .7),
        halo: i => L.prog(lt, 20.5 + i * .25, 21.5 + i * .25)
      });
    },
    say: [[0.6, 'C, comme Cluster : regrouper. Les points proches forment des groupes.'],
      [9.5, 'Quelques points restent isolés.'],
      [15, 'Ici, pas de LLM : du calcul pur. Aucun token.'],
      [21, "Et c'est ici que la structure est trouvée."]]
  });

  /* ============ 3e · N — Name ============ */
  S.push({
    seq: 3, title: 'N — Name', dur: 34,
    html: `
      ${L.rail('N', 'SEC')}
      ${cost(25.5, '3,75 $', 'un modèle plus gros · Claude 3.5 Sonnet', 'var(--cN)')}
      ${CV}
      <div class="abs card" data-at="1.6" data-out="13" data-fx="right" style="left:1060px;top:200px;width:700px;padding:30px;background:rgba(10,12,18,.92)">
        <div class="kicker" style="margin-bottom:16px">quelques exemples du groupe</div>
        ${['Colis jamais arrivé', 'Livré avec 5 jours de retard', 'Toujours en attente du colis', "Le suivi n'a pas bougé depuis lundi"].map((t, i) => `<div class="mono" data-at="${2.4 + i * .5}" data-fx="left" style="font-size:24px;padding:8px 0;color:#c9ccd5">« ${t} »</div>`).join('')}
        <div class="row" style="align-items:center;gap:16px;margin-top:18px" data-at="5.4" data-fx="up">
          <span class="pill" style="border-color:var(--cN);color:var(--cN);font-weight:700">LLM</span>
          <span class="mute" style="font-size:30px">→</span>
          <span class="h4" style="font-size:34px;color:#ff8a5c">Livraison en retard</span>
        </div>
        <div class="small" data-type="3" data-tat="7" style="margin-top:12px;color:#c9ccd5">Clients dont la commande arrive après la date promise — ou jamais.</div>
      </div>
      <div class="abs" data-at="14" data-fx="fade" style="right:150px;bottom:190px"><span class="badge">noms illustratifs</span></div>
      ${cap(14, 19.5, 'Pour chaque groupe, un LLM lit quelques exemples… et le <span class="cN">nomme.</span>')}
      <div class="abs row" style="left:150px;right:150px;bottom:110px;align-items:baseline;gap:34px">
        <span class="h3" data-at="20" data-fx="up"><span class="strike" data-at="22.5" data-fx="state">100&nbsp;000 appels</span></span>
        <span class="h3 mute" data-at="23" data-fx="up">→</span>
        <span class="h3 cN" data-at="23.3" data-fx="up">quelques milliers : un par groupe.</span>
      </div>`,
    init(el, s) { s.cl = mkCloud(); s.c = L.canvas(el.querySelector('canvas')); },
    tick(lt, s) {
      const solo = L.prog(lt, 1, 2.5) * (1 - L.prog(lt, 12.5, 14));
      s.cl.draw(s.c, {
        appear: 1, r: 3, color: 1, focus: 0, focusDim: solo,
        labels: i => i === 0 ? L.prog(lt, 6, 7) : L.prog(lt, 14.5 + i * .7, 15.3 + i * .7)
      });
    },
    say: [[0.6, 'N, comme Name : nommer.'],
      [1.6, 'Pour chaque groupe, un LLM lit quelques exemples, et donne au groupe un nom et une description.'],
      [14, 'Groupe après groupe, la carte se légende.'],
      [20, "Le LLM n'est plus appelé une fois par document, mais une fois par groupe : au lieu de cent mille appels, quelques milliers."],
      [25.5, 'Coût : trois dollars soixante-quinze — avec un modèle plus gros, Claude 3.5 Sonnet.']]
  });

  /* ============ 3f · A — Aggregate ============ */
  const smalls = (() => {
    const r = L.rng(9); let o = '';
    // petits groupes dans le cercle « Rédaction de contenus »
    const pos = [[1255, 425], [1340, 400], [1370, 490], [1285, 520], [1210, 495]];
    pos.forEach(([x, y], i) => o += `<circle cx="${x}" cy="${y}" r="${i === 0 ? 40 : 30}" fill="${i === 0 ? 'rgba(180,140,255,.55)' : 'rgba(180,140,255,.18)'}" stroke="#b48cff" stroke-width="${i === 0 ? 3 : 1.5}" data-at="${2 + i * .2}" data-fx="pop"/>`);
    // autres petits groupes, ailleurs dans le grand thème
    const other = [[1540, 400, 2], [1590, 470, 2], [1510, 500, 2], [1450, 690, 3], [1530, 740, 3], [1380, 760, 3], [1230, 700, 4], [1170, 760, 4]];
    other.forEach(([x, y, g], i) => o += `<circle cx="${x}" cy="${y}" r="${24 + r() * 12}" fill="rgba(180,140,255,.12)" stroke="rgba(180,140,255,.6)" stroke-width="1.2" data-at="${2.4 + i * .15}" data-fx="pop"/>`);
    return o;
  })();
  S.push({
    seq: 3, title: 'A — Aggregate', dur: 30,
    html: `
      ${L.rail('A', 'SECN')}
      ${cost(22, '0,06 $', 'un compte, un rangement', 'var(--cA)')}
      <div class="abs col" style="left:150px;top:250px;width:540px;gap:34px">
        <div class="h3">${W('On compte les groupes. On les range en *niveaux.*', .6, .1)}</div>
        <div class="p" data-at="6" data-fx="up"><span class="cA">quelques</span> grands thèmes</div>
        <div class="p" data-at="7.5" data-fx="up"><span class="cA">des milliers</span> de groupes fins</div>
        <div class="h3" data-at="17" data-fx="up" style="margin-top:20px">Pas une liste : <span class="cA">une carte</span>, qu'on parcourt du général au détail.</div>
      </div>
      <svg class="abs" style="left:0;top:0" width="1920" height="1080">
        <circle cx="1390" cy="570" r="330" fill="rgba(180,140,255,.05)" stroke="#b48cff" stroke-width="3" data-at="9" data-fx="zoom"/>
        <circle cx="1290" cy="460" r="135" fill="rgba(180,140,255,.07)" stroke="#b48cff" stroke-width="2.5" data-at="5" data-fx="zoom"/>
        <circle cx="1550" cy="455" r="90" fill="none" stroke="rgba(180,140,255,.5)" stroke-width="1.5" data-at="5.4" data-fx="zoom"/>
        <circle cx="1460" cy="720" r="115" fill="none" stroke="rgba(180,140,255,.5)" stroke-width="1.5" data-at="5.8" data-fx="zoom"/>
        <circle cx="1200" cy="730" r="80" fill="none" stroke="rgba(180,140,255,.5)" stroke-width="1.5" data-at="6.2" data-fx="zoom"/>
        ${smalls}
        <g data-at="10" data-fx="fade" font-family="var(--sans)">
          <text x="1390" y="218" text-anchor="middle" fill="#f3f1ea" font-size="40" font-weight="800">Écriture</text>
        </g>
        <g data-at="11.5" data-fx="fade">
          <path d="M1185 380 L1020 300" stroke="#b48cff" stroke-width="2" fill="none"/>
          <text x="1010" y="292" text-anchor="end" fill="#e2d6ff" font-size="30" font-weight="650">rédaction de contenus</text>
        </g>
        <g data-at="13" data-fx="fade">
          <path d="M1240 462 L1080 600" stroke="#b48cff" stroke-width="2" fill="none"/>
          <text x="1070" y="640" text-anchor="end" fill="#e2d6ff" font-size="28" font-weight="600">contenus pour</text>
          <text x="1070" y="674" text-anchor="end" fill="#e2d6ff" font-size="28" font-weight="600">le référencement</text>
        </g>
        <text x="1560" y="460" text-anchor="middle" fill="#8d93a3" font-size="26" data-at="11.5" data-fx="fade">…</text>
        <text x="1460" y="725" text-anchor="middle" fill="#8d93a3" font-size="26" data-at="11.5" data-fx="fade">…</text>
      </svg>
      <div class="abs" data-at="13.5" data-out="16.6" data-fx="fade" style="left:150px;bottom:120px"><span class="mono small">exemple de Clio · les « … » sont les autres groupes</span></div>
      <div class="src" data-at="22" data-fx="fade">${SRC}</div>`,
    say: [[0.6, 'A, comme Aggregate : ranger. On compte les groupes, et on les range en niveaux.'],
      [6, 'Quelques grands thèmes ; des milliers de groupes fins.'],
      [10, "L'exemple de Clio : Écriture, puis rédaction de contenus, puis contenus pour le référencement."],
      [17, "Le résultat n'est pas une liste : c'est une carte, qu'on peut parcourir du général au détail."],
      [22, 'Coût : six centimes.']]
  });

  /* ============ 3g · La facture ============ */
  const SEG = [['S', 'cS', 45, '45,00 $', 2], ['E', 'cE', 0, '≈ 0', 4.4], ['C', 'cC', 0, '0 $', 4.8], ['N', 'cN', 3.75, '3,75 $', 5.4], ['A', 'cA', .06, '0,06 $', 6.6]];
  S.push({
    seq: 3, title: 'La facture', dur: 28,
    html: `
      ${L.rail('', 'SECNA')}
      <div class="row" style="margin-top:80px;align-items:baseline;justify-content:space-between">
        <div class="h3">La facture de Clio, étape par étape</div>
        <div><span class="h4 mute">total&nbsp;</span><span class="h2" data-count="48.81" data-dec="2" data-suf="&nbsp;$" data-cat="2" data-cdur="6">0</span></div>
      </div>
      <div style="display:flex;height:150px;margin-top:50px;gap:4px">
        ${SEG.map(([l, c, v, , at]) => `<div class="growx" data-at="${at}" style="--w:${Math.max(6, v / 48.81 * 1600).toFixed(0)}px;--d:${l === 'S' ? '2.4s' : '1s'};height:100%;border-radius:12px;background:var(--${c});flex:none;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#07080c;font-weight:900;font-size:64px">${v > 3 ? l : ''}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1.6fr repeat(4,1fr);gap:20px;margin-top:30px">
        ${SEG.map(([l, c, , lab, at]) => `<div data-at="${at + .8}" data-fx="up"><div class="h4 ${c}">${l} · ${lab}</div></div>`).join('')}
      </div>
      <div class="col" style="gap:24px;margin-top:70px">
        <div class="h3" data-at="11" data-fx="up">Deux étapes consomment des tokens : <span class="cS">S</span> et <span class="cN">N</span>. Les trois autres ne coûtent presque rien.</div>
        <div class="h3" data-at="17" data-fx="up"><span class="cS">S = 92 % de la facture</span> — et il est <u>optionnel</u> quand les textes sont courts.</div>
      </div>
      <div class="src">${SRC}</div>`,
    say: [[0.5, 'Total : quarante-huit dollars quatre-vingt-un.'],
      [11, 'Deux étapes consomment des tokens : S et N. Les trois autres ne coûtent presque rien.'],
      [17, 'Et S, qui représente 92 % de la facture, est optionnel quand les textes sont courts. Retenez-le : on y reviendra.']]
  });

  /* ============ 3h · La phrase ============ */
  S.push({
    seq: 3, title: 'La phrase à retenir', dur: 22, cls: 's3h',
    html: `
      <div class="center" style="gap:24px">
        <div class="h1">${W('La data science trouve la *structure.*', .5, .14, 'up')}</div>
        <div class="h1">${W('Le LLM lui donne du *sens.*', 3, .14, 'up')}</div>
        <div class="p" data-at="9" data-fx="up" style="margin-top:70px">Le LLM n'est pas un figurant : c'est là que le sens se fabrique.</div>
        <div class="p mute" data-at="14" data-fx="up">Il est simplement utilisé avec parcimonie.</div>
      </div>
      <style>.s3h .h1{font-size:100px} .s3h .h1 .w.hl{color:var(--cC)} .s3h .h1:nth-child(2) .w.hl{color:var(--cN)}</style>`,
    say: [[0.5, 'La phrase à retenir : la data science trouve la structure ; le LLM lui donne du sens.'],
      [9, "Le LLM n'est pas un figurant : c'est là que le sens se fabrique."],
      [14, 'Il est simplement utilisé avec parcimonie.']]
  });
})();
