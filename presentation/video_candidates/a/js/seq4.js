/* Séquence 4 — Les gros, et nous (hors notebook) */
(() => {
  const S = window.SCENES, W = L.words;

  /* ============ 4a · Anthropic n'est pas seul ============ */
  S.push({
    seq: 4, title: "Anthropic n'est pas seul", dur: 36,
    html: `
      <div class="h2" data-at="0.4" data-fx="up" style="margin-top:-10px">Anthropic n'est pas seul.</div>
      <div class="p mute" data-at="1.6" data-fx="up" style="margin-top:14px">D'autres grands acteurs ont publié des approches de la même forme, chacun avec sa variante.</div>
      <div class="row" style="margin-top:50px;gap:30px;align-items:stretch">
        <div class="card" data-at="3.5" data-fx="up" style="width:380px;flex:none;border-color:rgba(255,122,77,.4)">
          <div class="kicker" style="white-space:nowrap;font-size:19px">Anthropic · déc. 2024</div>
          <div class="h2 cS" style="margin:18px 0;font-size:68px">Clio</div>
          <div class="p">La référence.</div>
          <div class="small" style="margin-top:12px">data science pour la structure,<br>LLM pour le sens</div>
        </div>
        <div class="card grow1" data-at="7" data-fx="up" style="border-color:rgba(95,178,255,.4)">
          <div class="kicker">Google Research · 2025</div>
          <div class="h2 cN" style="margin:18px 0;font-size:68px">Urania</div>
          <div class="p" style="font-size:31px">La même idée, avec des <b>garanties formelles de confidentialité</b> — confidentialité différentielle — sur le regroupement et le comptage.</div>
          <div class="small" data-at="12" data-fx="up" style="margin-top:16px">L'article se compare explicitement à Clio, qu'il prend comme référence.</div>
        </div>
        <div class="card grow1" data-at="16" data-fx="up" style="border-color:rgba(255,79,109,.45)">
          <div class="kicker">LangChain · 2025</div>
          <div class="h2" style="margin:18px 0;color:#ffd166;font-size:62px;white-space:nowrap">LangSmith Insights</div>
          <div class="p" style="font-size:31px">L'analyse des traces d'agents. Un LLM résume <b>chaque trace</b>, puis un LLM fait le regroupement.</div>
          <div class="small" style="margin-top:12px">Un LLM à chaque étape.</div>
          <div data-at="23" data-fx="up" style="margin-top:28px">
            <div class="bar-ind" style="width:100%;height:16px"><i class="growx" data-at="23.5" style="--w:100%;--d:2s;background:var(--warn)"></i></div>
            <div class="h3 warn" style="margin-top:14px">plafond : 1&nbsp;000 traces</div>
          </div>
        </div>
      </div>
      <div class="src">Liu et al., « Urania », Google Research, COLM 2025 · arXiv:2506.04681 — LangSmith Insights, documentation publique · docs.langchain.com/langsmith/insights</div>`,
    say: [[0.4, "Anthropic n'est pas seul. D'autres grands acteurs ont publié des approches de la même forme, chacun avec sa variante."],
      [7, 'Google, avec Urania, en 2025 : la même idée, avec des garanties formelles de confidentialité — de la confidentialité différentielle — sur le regroupement et le comptage.'],
      [12, "L'article se compare explicitement à Clio, qu'il prend comme référence."],
      [16, "LangChain, avec LangSmith Insights : l'outil d'analyse des traces d'agents. D'après sa documentation publique, un LLM résume chaque trace, puis un LLM fait le regroupement. Un LLM à chaque étape."],
      [23, "Résultat : l'analyse est plafonnée à mille traces."]]
  });

  /* ============ 4b · Le point commun ============ */
  const r = L.rng(17); const samp = new Set(); while (samp.size < 9) samp.add(Math.floor(r() * 120));
  const grid = (all, at) => `<div style="display:grid;grid-template-columns:repeat(12,1fr);gap:14px;width:560px">${Array.from({ length: 120 }, (_, i) => {
    const lit = all || samp.has(i);
    return lit ? `<i class="gdot" data-at="${(at + (all ? ((i % 12) + Math.floor(i / 12)) * .06 : (i % 5) * .2)).toFixed(2)}" data-fx="state"></i>` : '<i class="gdot0"></i>';
  }).join('')}</div>`;
  S.push({
    seq: 4, title: 'Le point commun', dur: 20,
    html: `
      <div class="row" style="height:100%;align-items:center;gap:120px;justify-content:center">
        <div class="col" style="gap:40px;align-items:flex-start" data-at="0.4" data-fx="up">
          ${grid(false, 2.5)}
          <div class="h3" style="width:600px">Quand le <span class="cN">LLM fait tout</span>,<br><span class="warn">il faut échantillonner.</span></div>
        </div>
        <div class="col" style="gap:40px;align-items:flex-start" data-at="7" data-fx="up">
          ${grid(true, 9)}
          <div class="h3" style="width:640px">Quand la <span class="cC">data science fait la structure</span>,<br><span class="ok">on peut tout lire.</span></div>
        </div>
      </div>
      <style>.gdot,.gdot0{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.12);transition:background .5s,box-shadow .5s}.gdot.on{background:var(--cE);box-shadow:0 0 16px rgba(255,201,77,.7)}</style>`,
    say: [[0.4, 'Le point commun : quand le LLM fait tout, il faut échantillonner.'],
      [7, 'Quand la data science fait la structure, on peut tout lire.']]
  });

  /* ============ 4c · La courbe de coût ============ */
  const X = d => 300 + (Math.log10(d) - 3) * 400;              // 1 000 → 1 000 000 docs
  const Y = v => 900 - 160 * (Math.log10(v) + 1);              // 0,1 → 1 000 (log)
  const docLine = `M${X(1e3)} ${Y(1)} L${X(1e6)} ${Y(1000)}`;
  const grp = []; for (let e = 3; e <= 6.001; e += .05) {
    const d = 10 ** e; let v = .3 * Math.pow(d / 1e3, .12);
    if (e > 4.95) v *= 1.9;                                     // un niveau de hiérarchie de plus
    grp.push(`${grp.length ? 'L' : 'M'}${X(d).toFixed(1)} ${Y(v).toFixed(1)}`);
  }
  const gLast = .3 * Math.pow(1e3, .12) * 1.9;
  S.push({
    seq: 4, title: 'La courbe de coût', dur: 38,
    html: `
      <div data-out="27.5">
        <div class="row" style="justify-content:space-between;align-items:center;margin-top:-20px">
          <div class="h3" data-at="0.4" data-fx="up">La courbe de coût</div>
          <span class="badge" data-at="1" data-fx="fade">illustratif · ordres de grandeur</span>
        </div>
        <svg class="abs" style="left:0;top:0" width="1920" height="1080" font-family="ui-monospace, Menlo, monospace">
          <g data-at="2" data-fx="fade" stroke="rgba(255,255,255,.18)" fill="#8d93a3" font-size="22">
            ${[1e3, 1e4, 1e5, 1e6].map(d => `<line x1="${X(d)}" y1="240" x2="${X(d)}" y2="900" stroke-dasharray="3 7"/><text x="${X(d)}" y="944" text-anchor="middle" stroke="none">${L.fmt(d)}</text>`).join('')}
            <line x1="300" y1="900" x2="1540" y2="900" stroke="rgba(255,255,255,.4)"/>
            <line x1="300" y1="240" x2="300" y2="900" stroke="rgba(255,255,255,.4)"/>
            <text x="920" y="990" text-anchor="middle" stroke="none" font-size="22">documents dans le corpus</text>
            <text x="270" y="250" text-anchor="end" stroke="none" font-size="20">coût</text>
            <text x="270" y="276" text-anchor="end" stroke="none" font-size="16">(log)</text>
          </g>
          <path d="${docLine}" fill="none" stroke="#ff4f6d" stroke-width="6" stroke-linecap="round" pathLength="1" data-at="4" data-fx="draw" style="--d:4s"/>
          <g data-at="6.5" data-fx="fade"><text x="${X(2e5) - 20}" y="${Y(200) - 40}" text-anchor="end" fill="#ff4f6d" font-size="28" font-family="var(--sans)" font-weight="700">le LLM lit chaque document</text></g>
          <g data-at="9" data-fx="fade" font-family="var(--sans)">
            <path d="M${X(1e4)} ${Y(10) + 30} H${X(1e5)} V${Y(100) + 30}" fill="none" stroke="#f3f1ea" stroke-width="2" stroke-dasharray="6 6"/>
            <text x="${(X(1e4) + X(1e5)) / 2}" y="${Y(10) + 72}" text-anchor="middle" fill="#f3f1ea" font-size="26">×10 documents → ×10 la facture</text>
          </g>
          <path d="${grp.join(' ')}" fill="none" stroke="#4ee3a0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" data-at="14" data-fx="draw" style="--d:4s"/>
          <g data-at="16.5" data-fx="fade"><text x="${X(3e5)}" y="${Y(gLast) + 56}" text-anchor="middle" fill="#4ee3a0" font-size="28" font-family="var(--sans)" font-weight="700">le LLM ne lit que les groupes</text></g>
          <g data-at="19.5" data-fx="fade" font-family="var(--sans)">
            <circle cx="${X(10 ** 4.95)}" cy="${Y(.3 * Math.pow(10 ** 1.95, .12) * 1.45)}" r="26" fill="none" stroke="#4ee3a0" stroke-width="2"/>
            <text x="${X(10 ** 4.95)}" y="${Y(.3 * Math.pow(10 ** 1.95, .12) * 1.45) - 44}" text-anchor="middle" fill="#c9ccd5" font-size="22">+ un niveau de hiérarchie</text>
          </g>
          <g data-at="23" data-fx="fade">
            <path d="M${X(1e6) + 30} ${Y(1000)} V${Y(gLast)}" stroke="#ffc94d" stroke-width="3" fill="none"/>
            <path d="M${X(1e6) + 20} ${Y(1000)} h20 M${X(1e6) + 20} ${Y(gLast)} h20" stroke="#ffc94d" stroke-width="3"/>
            <text x="${X(1e6) + 50}" y="${(Y(1000) + Y(gLast)) / 2}" fill="#ffc94d" font-size="26" font-family="var(--sans)" font-weight="700">l'écart</text>
          </g>
        </svg>
      </div>
      <div class="abs center" style="inset:0">
        <div class="h1" data-at="28.2" data-fx="blur">La facture suit les <span class="cC">groupes</span>,</div>
        <div class="h1" data-at="30" data-fx="blur">pas les <span class="warn">documents.</span></div>
      </div>`,
    say: [[0.4, 'Regardons la courbe de coût. En abscisse, la taille du corpus : mille, dix mille, cent mille, un million de documents.'],
      [5, 'Si le LLM lit chaque document, la facture suit le corpus : dix fois plus de documents, dix fois plus cher.'],
      [14, 'Si le LLM ne lit que les groupes, la facture reste presque plate.'],
      [19.5, "Elle monte un peu quand le corpus devient assez gros pour un niveau de hiérarchie de plus — mais les groupes grossissent beaucoup moins vite que les documents."],
      [28.2, 'La facture suit les groupes, pas les documents.']]
  });

  /* ============ 4d · Réservé aux géants ? ============ */
  S.push({
    seq: 4, title: 'Réservé aux géants ?', dur: 28,
    html: `
      <div class="col" style="gap:40px;margin-top:40px" data-out="14">
        <div class="h2" data-at="0.4" data-fx="up">Réservé aux géants ?</div>
        <div class="p" data-at="2.5" data-fx="up" style="max-width:1300px">À l'échelle d'une entreprise ordinaire — <b>quelques dizaines de milliers de textes</b> — tout faire lire au LLM coûte encore peu.</div>
        <div class="h3 warn" data-at="8.5" data-fx="up">Ça ne durera pas : les piles grossissent.</div>
      </div>
      <div class="abs" style="left:150px;top:260px;width:900px">
        <div class="h3 mute" data-at="14.5" data-fx="up">Et surtout, le vrai gain n'est pas là.</div>
        <div class="h1" data-at="16.5" data-fx="blur" style="margin-top:40px">Voir ce qu'on ne <span class="cC">cherchait pas.</span></div>
        <div class="p" data-at="20" data-fx="up" style="margin-top:40px">Les thèmes qui émergent tout seuls — que personne n'avait mis dans le formulaire.</div>
      </div>
      <div class="abs card" data-at="18" data-fx="right" style="left:1180px;top:250px;width:590px;padding:34px">
        <div class="kicker" style="margin-bottom:20px">formulaire · catégorie</div>
        ${['Livraison', 'Paiement', 'Compte', 'Autre'].map(c => `<div style="padding:14px 18px;margin:8px 0;border-radius:10px;background:rgba(255,255,255,.05);font-size:28px;color:#8d93a3">○ ${c}</div>`).join('')}
        ${[0, 1].map(i => `<div data-at="${21.5 + i * 1.4}" data-fx="pop" style="padding:14px 18px;margin:12px 0 0;border-radius:10px;border:2px dashed var(--cC);color:var(--cC);font-size:28px;background:rgba(78,227,160,.08)">✦ un thème que personne n'attendait</div>`).join('')}
      </div>`,
    say: [[0.4, 'Est-ce que tout ça est réservé aux géants ?'],
      [2.5, "À l'échelle d'une entreprise ordinaire — quelques dizaines de milliers de textes — tout faire lire au LLM coûte encore peu."],
      [8.5, 'Ça ne durera pas : les piles grossissent.'],
      [14.5, "Et surtout, le vrai gain n'est pas là. C'est de voir ce qu'on ne cherchait pas…"],
      [20, "… les thèmes qui émergent tout seuls, que personne n'avait mis dans le formulaire."]]
  });

  /* ============ 4e · Moi aussi ? ============ */
  S.push({
    seq: 4, title: 'Moi aussi ?', dur: 24,
    html: `
      <div class="row" style="align-items:baseline;gap:40px;margin-top:10px">
        <div class="h2" data-at="0.4" data-fx="up">Est-ce que je peux le faire moi aussi ?</div>
        <div class="h1 ok" data-at="3.2" data-fx="pop" style="font-size:140px">Oui.</div>
      </div>
      <div class="row" style="margin-top:60px;gap:70px;align-items:center">
        <div data-at="5.5" data-fx="zoom" style="padding:20px;border-radius:24px;background:#f3f1ea;box-shadow:0 30px 80px rgba(0,0,0,.5)">${L.qrSVG(330)}</div>
        <div class="col" style="gap:26px">
          <div class="h3 mono" data-at="6" data-fx="up" style="font-size:50px">github.com/<span class="cN">mdussere/secna</span></div>
          <div class="p" data-at="8" data-fx="up">▸ un notebook Jupyter de <b>moins de 200 lignes</b>, dans un dépôt public</div>
          <div class="p" data-at="9.5" data-fx="up">▸ <b>une commande</b> pour le lancer</div>
          <div class="p" data-at="11" data-fx="up">▸ le fournisseur de modèles : <b>une ligne</b> de configuration</div>
          <div class="p" data-at="14.5" data-fx="up" style="margin-top:20px">Le corpus : <span class="hl">le noyau Linux, les six derniers mois</span> <span class="mute">— commits et pull requests fusionnées.</span></div>
        </div>
      </div>`,
    say: [[0.4, 'Est-ce que je peux le faire moi aussi ? Oui.'],
      [5.5, "Tout est dans un dépôt public : github.com/mdussere/secna. Un notebook Jupyter de moins de deux cents lignes."],
      [9.5, 'Une commande pour le lancer. Et le fournisseur de modèles se règle sur une ligne de configuration.'],
      [14.5, 'Le corpus de démonstration : le noyau Linux, les six derniers mois — les commits et les pull requests fusionnées.']]
  });
})();
