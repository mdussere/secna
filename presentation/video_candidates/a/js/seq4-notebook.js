/* Séquence 4 (suite) — le notebook, cellule par cellule. Tous les résultats affichés sont illustratifs. */
(() => {
  const S = window.SCENES, W = L.words;

  const top = `<div class="nb-top"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span class="fname">secna.ipynb</span>
    <span class="kern"><span class="badge" style="font-size:14px;padding:4px 10px">résultats illustratifs</span>&nbsp;&nbsp;Python 3 <i></i></span></div>`;
  const nb = (body, zoom) => `<div class="nb" ${zoom ? 'data-at="0.2" data-fx="zoom"' : ''}>${top}<div class="nb-body">${body}</div></div>
    <div class="nbnote">maquette animée du notebook · le vrai notebook : github.com/mdussere/secna · les chiffres réels viendront quand il aura tourné</div>`;
  const num = (n, run, done) => `<div class="num" style="position:relative">
      <span class="abs" style="right:0" data-out="${run}" data-fx="fade">[ ]</span>
      <span class="abs" style="right:0;color:var(--cE)" data-at="${run}" data-out="${done}" data-fx="fade">[*]</span>
      <span class="abs" style="right:0" data-at="${done}" data-fx="fade">[${n}]</span></div>`;
  const code = (src, at, dur) => `<div class="code" data-type="${dur}" data-tat="${at}">${src}</div>`;
  const prev = (n, src) => `<div class="cell" style="opacity:.28"><div class="num">[${n}]</div><div class="code" style="min-height:0;padding:8px 24px;font-size:21px">${src}</div></div>`;
  const out = (html, at, extra = '') => `<div class="cell" data-at="${at}" data-fx="up" ${extra}><div class="num out">Out</div><div class="outp">${html}</div></div>`;
  const k = t => `<span class="k">${t}</span>`, f = t => `<span class="f">${t}</span>`, s = t => `<span class="s">${t}</span>`, c = t => `<span class="c">${t}</span>`, n = t => `<span class="n">${t}</span>`;

  const NB_CENTERS = [
    { x: 230, y: 150, s: 40, wt: 1, name: 'Rust dans le noyau', col: '#ff8a5c' },
    { x: 560, y: 300, s: 48, wt: 1.5, name: 'Pilotes GPU', col: '#ffd166' },
    { x: 820, y: 130, s: 42, wt: 1.2, name: 'Réseau : correctifs', col: '#4ee3a0' },
    { x: 1060, y: 300, s: 40, wt: 1.1, name: 'Gestion mémoire', col: '#5fb2ff' },
    { x: 1260, y: 150, s: 36, wt: 1.3, name: 'Systèmes de fichiers', col: '#c58cff' },
    { x: 330, y: 340, s: 34, wt: .7, name: 'Ordonnanceur', col: '#f472b6' }
  ];
  const mk = (w = 1400, h = 440) => new L.Cloud({
    seed: 42, n: 1300, w, h, noise: .05,
    centers: NB_CENTERS.map(C => ({ ...C, x: C.x * w / 1400, y: C.y * h / 440 }))
  });
  const prevCode = {
    1: `corpus = ${f('load_linux_history')}(months=${n(6)})`,
    2: `vectors = ${f('embed')}(corpus.message)`,
    3: `clusters = ${f('cluster')}(vectors)`,
    4: `names = ${f('name_clusters')}(clusters, examples=${n(5)})`,
    5: `themes = ${f('aggregate')}(names, levels=${n(2)})`,
    6: `${f('bill')}()`
  };

  /* ============ NB0 · Le notebook ============ */
  S.push({
    seq: 4, title: 'Notebook — ouverture', dur: 30,
    html: nb(`
      <div class="cell" data-at="1" data-fx="up"><div class="num"></div><div class="mdcell">Qu'est-ce qui s'est passé dans le <span class="cN">noyau Linux</span> ces six derniers mois ?</div></div>
      <div class="cell" data-at="4" data-fx="up"><div class="num"></div><div class="p" style="font-size:30px">Le corpus : les commits et les <i>pull requests</i> fusionnées du semestre. Personne ne les a tous lus.</div></div>
      <div class="cell" data-at="8" data-fx="up">${num(1, 13, 14)}${code(`${c('# la seule ligne liée au fournisseur de modèles')}
PROVIDER = ${s('"anthropic"')}   ${c('# ou un autre : une ligne à changer')}`, 8.6, 3.5)}</div>
      <div class="cell" data-at="16" data-fx="up"><div class="num"></div>
        <div class="row" style="gap:14px;flex-wrap:wrap;align-items:center">
          ${[['1', 'le corpus', '#9aa1b2'], ['2', 'E · projeter', 'var(--cE)'], ['3', 'C · regrouper', 'var(--cC)'], ['4', 'N · nommer', 'var(--cN)'], ['5', 'A · ranger', 'var(--cA)'], ['6', 'la facture', 'var(--cS)'], ['7', 'votre corpus', '#f3f1ea']].map(([i, t, col], j) =>
            `<span class="pill" data-at="${16.5 + j * .5}" data-fx="pop" style="border-color:${col};font-size:25px"><b style="color:${col}">${i}</b>${t}</span>`).join('')}
          <span class="small" data-at="21" data-fx="fade" style="margin-left:10px">pas de S ici — on y reviendra</span>
        </div></div>`, true),
    say: [[1, "Ouvrons le notebook. La question posée : qu'est-ce qui s'est passé dans le noyau Linux ces six derniers mois ?"],
      [4, 'Le corpus : les commits et les pull requests fusionnées du semestre. Personne ne les a tous lus.'],
      [8, 'Première chose : le fournisseur de modèles. Il se règle sur une seule ligne.'],
      [16, 'Le déroulé : le corpus, puis E, C, N, A, la facture… et votre propre corpus. Vous remarquerez qu\'il n\'y a pas de S : on y reviendra.']]
  });

  /* ============ NB1 · Le corpus ============ */
  const COMMITS = [
    'net: fix use-after-free in tcp_ack() when socket is closed during retransmit',
    'rust: add safe abstractions for workqueue items',
    'drm/amdgpu: fix NULL pointer dereference in link detection',
    'mm: reduce lock contention in page reclaim'
  ];
  S.push({
    seq: 4, title: 'Notebook — le corpus', dur: 36,
    html: nb(`
      ${prev(1, `PROVIDER = ${s('"anthropic"')}`)}
      <div class="cell">${num(2, 5.5, 7.5)}${code(`corpus = ${f('load_linux_history')}(months=${n(6)})   ${c('# commits + PR fusionnées')}
${f('print')}(${f('len')}(corpus), ${s('"commits"')})
corpus.${f('sample')}(${n(4)})`, .8, 4)}</div>
      ${out(`<div class="row" style="align-items:center;gap:20px"><span style="font-size:30px;color:#f3f1ea">plusieurs dizaines de milliers de commits</span><span class="badge">chiffre exact à venir</span></div>
        <table class="t" style="margin-top:16px;width:100%"><tr><th style="width:80px">#</th><th>message du commit · exemples illustratifs</th></tr>
        ${COMMITS.map((m, i) => `<tr data-at="${9 + i * .6}" data-fx="left"><td class="mute">${i}</td><td class="mono" style="font-size:23px;${i === 0 ? 'color:#f3f1ea' : 'color:#aeb3bf'}">${m}</td></tr>`).join('')}
        </table>
`, 7.5)}
      <div class="cell" data-at="19" data-fx="up"><div class="num"></div>
        <div class="card" style="padding:22px 28px;border-color:rgba(255,122,77,.4);display:flex;align-items:center;gap:26px;flex-wrap:wrap">
          <span class="kicker" style="color:var(--cS)">préparé (exemple)</span>
          ${[['sous-système', 'réseau'], ['nature', 'correctif'], ['risque', 'mémoire']].map(([a, b], i) => `<span class="pill" data-at="${20.5 + i * 1.2}" data-fx="pop" style="font-size:26px"><span class="mute">${a} :</span> <b>${b}</b></span>`).join('')}
        </div></div>`),
    say: [[0.8, "Cellule un : on récupère le corpus — six mois d'historique du noyau — et on affiche sa taille."],
      [8, 'Plusieurs dizaines de milliers de commits. Les chiffres exacts viendront quand le notebook aura tourné.'],
      [13, 'Un message de commit, c\'est court, technique, dense. Par exemple : « net: fix use-after-free in tcp_ack()… »'],
      [19, 'Si on le préparait, on en tirerait : sous-système, réseau ; nature, correctif ; risque, mémoire.']]
  });

  /* ============ NB2 · E ============ */
  S.push({
    seq: 4, title: 'Notebook — E', dur: 40,
    html: nb(`
      ${prev(2, prevCode[1])}
      <div class="cell">${num(3, 4.5, 20)}${code(`vectors = ${f('embed')}(corpus.message)   ${c('# E — un point par commit')}
${f('plot')}(vectors)`, .8, 3)}</div>
      ${out(`<div class="row" style="align-items:center;gap:22px"><span>embedding</span><div class="bar-ind"><i></i></div><span data-count="100" data-cat="5" data-cdur="15" data-suf="&nbsp;%">0</span>
        <span class="small" data-at="20.5" data-fx="fade" style="margin-left:20px">modèle d'embedding · quelques centimes · peut tourner en local</span></div>
        <canvas width="1400" height="360" style="margin-top:10px"></canvas>`, 4.8)}
      <div class="cell" data-at="22" data-fx="up"><div class="num"></div><div class="h4" style="font-size:34px">chaque point = <span class="cE">un commit</span>. Les messages qui parlent de la même chose sont voisins.</div></div>`),
    init(el, st) { st.cl = mk(1400, 360); st.c = L.canvas(el.querySelector('canvas')); st.bar = el.querySelector('.bar-ind i'); },
    tick(lt, st) {
      const p = L.clamp((lt - 5) / 15);
      st.bar.style.width = (L.eo(p) * 100) + '%';
      st.cl.draw(st.c, { appear: p, r: 2.6 });
    },
    say: [[0.8, "Cellule deux : E. On projette chaque message de commit avec un modèle d'embedding."],
      [6, 'Et on voit le nuage de points se remplir. Chaque point, c\'est un commit.'],
      [22, 'Les messages qui parlent de la même chose atterrissent les uns à côté des autres. Pour l\'instant, aucun LLM n\'a lu quoi que ce soit.']]
  });

  /* ============ NB3 · C ============ */
  S.push({
    seq: 4, title: 'Notebook — C', dur: 40,
    html: nb(`
      ${prev(3, prevCode[2])}
      <div class="cell">${num(4, 4, 5.5)}${code(`clusters = ${f('cluster')}(vectors)   ${c('# C — du calcul, aucun token')}
clusters.${f('summary')}()`, .8, 2.6)}</div>
      ${out(`<div class="row" style="gap:40px;align-items:center">
          <span>groupes : <b style="color:#f3f1ea;font-size:30px">6</b></span>
          <span data-at="12.5" data-fx="fade">points isolés : <b class="warn" style="font-size:30px">≈ 5 %</b></span>
          <span class="pill" data-at="17" data-fx="pop" style="font-size:22px;border-color:var(--cC);color:var(--cC)">0 token</span></div>
        <canvas width="1400" height="380" style="margin-top:10px"></canvas>`, 5.5)}`),
    init(el, st) { st.cl = mk(1400, 380); st.c = L.canvas(el.querySelector('canvas')); },
    tick(lt, st) {
      st.cl.draw(st.c, { appear: 1, r: 2.6, color: L.prog(lt, 6, 11), noiseRing: L.prog(lt, 12.5, 14) * (1 - .6 * L.prog(lt, 24, 26)), halo: i => L.prog(lt, 26 + i * .4, 27 + i * .4) });
    },
    say: [[0.8, 'Cellule trois : C. On regroupe.'],
      [6, 'Les groupes apparaissent. On les compte.'],
      [12.5, 'Et on montre les points restés isolés — ceux qui ne ressemblent à rien d\'autre.'],
      [17, 'Aucun token dépensé : c\'est du calcul pur.'],
      [26, 'La structure du semestre est là. Elle n\'a pas encore de nom.']]
  });

  /* ============ NB4 · N ============ */
  S.push({
    seq: 4, title: 'Notebook — N', dur: 46,
    html: nb(`
      ${prev(4, prevCode[3])}
      <div class="cell">${num(5, 4, 31)}${code(`names = ${f('name_clusters')}(clusters, examples=${n(5)})   ${c('# N — un appel LLM par groupe')}`, .8, 2.6)}</div>
      ${out(`<div style="display:grid;grid-template-columns:820px 1fr;gap:30px;align-items:start">
          <canvas width="820" height="390"></canvas>
          <div class="col" style="gap:12px;padding-top:6px">
            ${NB_CENTERS.map((C, i) => `<div data-at="${7 + i * 4}" data-fx="left" style="font-size:21px;white-space:nowrap"><span class="mute">groupe ${i} →</span> <b style="font-size:25px;color:${C.col}">« ${C.name} »</b></div>`).join('')}
          </div></div>`, 4.5)}
      <div class="cell" data-at="33" data-fx="up"><div class="num"></div><div class="row" style="gap:30px;align-items:baseline">
        <span class="h3">appels LLM : <span class="cN">6</span></span><span class="h4 mute">— un par groupe, pas un par commit.</span></div></div>`),
    init(el, st) { st.cl = mk(820, 390); st.c = L.canvas(el.querySelector('canvas')); },
    tick(lt, st) {
      const cur = Math.floor((lt - 5) / 4);
      st.cl.draw(st.c, {
        appear: 1, r: 2.2, color: 1, focus: L.clamp(cur, 0, 5), focusDim: L.prog(lt, 5, 6) * (1 - L.prog(lt, 29, 31)),
        labels: i => L.prog(lt, 7.3 + i * 4, 8.3 + i * 4), labelSize: 20
      });
    },
    say: [[0.8, 'Cellule quatre : N. Un appel au LLM par groupe, avec quelques exemples.'],
      [7, 'Et les noms arrivent, un par un…'],
      [15, 'Rust dans le noyau. Pilotes GPU. Réseau : correctifs. Gestion mémoire…'],
      [27, '… systèmes de fichiers, ordonnanceur. Ces noms-là sont illustratifs : les vrais sortiront du notebook.'],
      [33, 'Ce qui compte : un appel par groupe. Pas un par commit.']]
  });

  /* ============ NB5 · A ============ */
  const THEMES = [['Matériel', 'Pilotes GPU', 22, '#ffd166'], ['Stockage', 'Systèmes de fichiers', 21, '#c58cff'], ['Réseau', 'Réseau : correctifs', 18, '#4ee3a0'],
    ['Cœur du système', 'Gestion mémoire', 16, '#5fb2ff'], ['Langages & outillage', 'Rust dans le noyau', 14, '#ff8a5c'], ['Cœur du système', 'Ordonnanceur', 9, '#f472b6']];
  S.push({
    seq: 4, title: 'Notebook — A', dur: 40,
    html: nb(`
      ${prev(5, prevCode[4])}
      <div class="cell">${num(6, 4, 5.5)}${code(`themes = ${f('aggregate')}(names, levels=${n(2)})   ${c('# A — thèmes et sous-thèmes')}
themes.${f('top')}()`, .8, 2.6)}</div>
      ${out(`<table class="t" style="width:100%"><tr><th>grand thème</th><th>groupe</th><th style="width:560px">part des commits</th></tr>
        ${THEMES.map(([a, b, v, col], i) => `<tr data-at="${6 + i * .9}" data-fx="left"><td style="font-weight:650">${a}</td><td style="color:${col}">${b}</td>
          <td><div style="display:flex;align-items:center;gap:16px"><div class="growx" data-at="${6.5 + i * .9}" style="--w:${v * 20}px;height:22px;border-radius:6px;background:${col}"></div><span class="mono">${v} %</span></div></td></tr>`).join('')}
        </table>`, 5.5)}
      <div class="cell" data-at="16" data-fx="up"><div class="num"></div><div class="h4" style="font-size:34px">Les grands thèmes du semestre — <span class="cA">du général au détail.</span></div></div>`),
    say: [[0.8, 'Cellule cinq : A. On range les groupes en thèmes et sous-thèmes.'],
      [6, 'Et voici le tableau des grands thèmes du semestre — ici avec des valeurs illustratives.'],
      [16, 'Du général au détail : on peut descendre dans chaque thème, jusqu\'aux commits eux-mêmes.']]
  });

  /* ============ NB6 · La facture ============ */
  S.push({
    seq: 4, title: 'Notebook — la facture', dur: 42,
    html: nb(`
      ${prev(6, prevCode[5])}
      <div class="cell">${num(7, 4, 5.5)}${code(`${f('bill')}()   ${c('# ce que ce passage a coûté — et ce qu\'aurait coûté un LLM sur chaque commit')}`, .8, 3)}</div>
      ${out(`<div class="col" style="gap:34px;margin-top:14px">
          <div data-at="6.5" data-fx="up">
            <div class="row" style="justify-content:space-between;align-items:baseline"><span style="font-size:28px;color:#f3f1ea">ce passage · le LLM ne lit que les groupes</span><span class="h4 ok">6 appels LLM</span></div>
            <div style="height:34px;margin-top:10px;background:rgba(255,255,255,.05);border-radius:8px"><div class="growx" data-at="7" style="--w:1.2%;height:100%;border-radius:8px;background:var(--ok)"></div></div>
          </div>
          <div data-at="11" data-fx="up">
            <div class="row" style="justify-content:space-between;align-items:baseline"><span style="font-size:28px;color:#f3f1ea">un LLM sur chaque commit</span><span class="h4 warn">des dizaines de milliers d'appels</span></div>
            <div style="height:34px;margin-top:10px;background:rgba(255,255,255,.05);border-radius:8px"><div class="growx" data-at="11.5" style="--w:100%;--d:4s;height:100%;border-radius:8px;background:var(--warn)"></div></div>
          </div>
          <div class="row" data-at="17" data-fx="up" style="gap:20px;align-items:center"><span>tokens et dollars :</span><span class="badge">chiffres réels à venir — le notebook les affichera</span></div>
        </div>`, 5.5)}
      <div class="cell" data-at="23" data-fx="blur" style="margin-top:20px"><div class="num"></div><div>
        <div class="h2" style="font-size:70px">La facture suit les <span class="cC">groupes</span>, pas les <span class="warn">documents.</span></div>
        <div class="p mute" data-at="28" data-fx="up" style="margin-top:14px">Même logique que chez Clio : un appel par groupe, pas un par document.</div>
      </div></div>`),
    say: [[0.8, 'Cellule six : la facture. Le notebook affiche ce que ce passage a coûté en tokens…'],
      [11, "… et ce qu'aurait coûté un LLM sur chaque commit. D'un côté, quelques appels ; de l'autre, des dizaines de milliers."],
      [17, 'Les montants exacts, vous les verrez quand le notebook aura tourné.'],
      [23, 'Mais la forme est déjà là : la facture suit les groupes, pas les documents.']]
  });

  /* ============ NB7 · Votre corpus ============ */
  S.push({
    seq: 4, title: 'Notebook — votre corpus', dur: 36,
    html: nb(`
      <div class="cell" data-at="0.4" data-fx="up"><div class="num"></div><div class="mdcell">Et maintenant, <span class="cE">votre corpus.</span></div></div>
      <div class="cell">${num(1, 13, 14)}<div class="code" style="font-size:32px;line-height:1.7"><div style="position:relative"><span class="abs" style="left:-6px;top:0;bottom:0;right:0;border-radius:6px;background:rgba(255,79,109,.12)" data-at="5" data-fx="fade"></span><span class="warn" data-at="5" data-fx="fade" style="position:absolute;left:-2px">−</span><span class="strike" data-at="5.6" data-fx="state" style="margin-left:30px">corpus = ${f('load_linux_history')}(months=${n(6)})</span></div><div style="position:relative" data-at="7" data-fx="up"><span class="abs" style="left:-6px;top:0;bottom:0;right:0;border-radius:6px;background:rgba(78,227,160,.12)"></span><span class="ok" style="position:absolute;left:-2px">+</span><span style="margin-left:30px" data-type="3" data-tat="7.4">corpus = ${f('load_csv')}(${s('"mes_avis.csv"')}, text=${s('"avis"')})</span></div></div></div>
      <div class="cell" data-at="11" data-fx="up"><div class="num"></div><div class="h4">La seule ligne à changer pour l'appliquer <span class="cE">à vos propres textes.</span></div></div>
      <div class="cell" data-at="18" data-fx="up"><div class="num"></div>
        <div class="row" style="gap:50px;align-items:center">
          <div style="padding:14px;border-radius:18px;background:#f3f1ea">${L.qrSVG(220)}</div>
          <div class="col" style="gap:14px"><div class="h3 mono" style="font-size:44px">github.com/<span class="cN">mdussere/secna</span></div>
          <div class="p">Une commande pour le lancer. Une ligne pour le fournisseur. Une ligne pour votre corpus.</div></div>
        </div></div>`),
    say: [[0.4, 'Et maintenant, votre corpus.'],
      [5, "Pour l'appliquer à vos propres textes, il y a une seule ligne à changer : celle qui charge le corpus."],
      [11, 'Vos avis clients, vos tickets, vos traces d\'agents : un fichier, une colonne de texte.'],
      [18, 'Le dépôt : github.com/mdussere/secna. Une commande pour le lancer, une ligne pour le fournisseur, une ligne pour votre corpus.']]
  });
})();
