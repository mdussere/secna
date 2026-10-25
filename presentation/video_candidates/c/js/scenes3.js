/* Chapitre 4 — Les gros, et nous (dont la séquence notebook, > 5 min) */
(function () {
  const K = window.K;
  const { P, EP, IO, lerp, clamp, COL, FONT } = K;
  const CH = 4, CN = 'Les gros, et nous';

  K.chapter(CH, CN, "Qui d'autre — et est-ce pour moi ?", 'Quatrième temps : les gros, et nous.');

  K.scene({
    id: 'others', canvasTop: true, chapter: CH, chapName: CN, title: "Anthropic n'est pas seul", dur: 42,
    say: "Anthropic n'est pas seul. D'autres grands acteurs ont publié des approches de la même forme, chacun avec sa variante.\nGoogle, avec Urania, en 2025 : la même idée, avec des garanties formelles de confidentialité — la confidentialité différentielle — sur le regroupement et le comptage. L'article se compare explicitement à Clio, qu'il prend comme référence.\nLangChain, avec LangSmith Insights, l'outil d'analyse des traces d'agents. D'après sa documentation publique, un LLM résume chaque trace, puis un LLM fait le regroupement : un LLM à chaque étape. Résultat : l'analyse est plafonnée à mille traces.\nLe point commun : quand le LLM fait tout, il faut échantillonner ; quand la data science fait la structure, on peut tout lire.",
    build(root) {
      const chip = (t, c) => `<span class="chip" style="font-size:19px;padding:9px 15px;border-color:var(--${c});color:var(--${c})">${t}</span>`;
      root.innerHTML = `
        <div class="abs kicker" style="left:120px;top:110px" data-in=".3" data-out="26.5">Anthropic n'est pas seul</div>
        <div class="abs card" style="left:120px;top:190px;width:800px;height:600px" data-in="2" data-out="26.5" data-fx="left">
          <div class="kicker">Google Research · 2025</div>
          <div class="h-m" style="margin:16px 0 24px">Urania</div>
          <div class="t-m" style="color:#c9cfdb">La même idée, avec des <b>garanties formelles de confidentialité</b> — confidentialité différentielle — sur le regroupement et le comptage.</div>
          <div class="row" style="gap:10px;margin-top:30px">${chip('E', 'ds')}${chip('C 🔒', 'ds')}${chip('N', 'llm')}${chip('A 🔒', 'ds')}</div>
          <div class="t-m" style="margin-top:34px">Se compare explicitement à <span class="c-llm b">Clio</span>, pris comme référence.</div>
          <div class="src" style="position:absolute;bottom:30px">Liu et al., COLM 2025 — arXiv:2506.04681</div></div>
        <div class="abs card" style="left:1000px;top:190px;width:800px;height:600px" data-in="9" data-out="26.5" data-fx="right">
          <div class="kicker">LangChain · 2025</div>
          <div class="h-m" style="margin:16px 0 24px">LangSmith Insights</div>
          <div class="t-m" style="color:#c9cfdb">L'analyse des traces d'agents. Un LLM <b>résume chaque trace</b>, puis un LLM <b>fait le regroupement</b>.</div>
          <div class="row" style="gap:10px;margin-top:30px">${chip('LLM : résume', 'llm')}<span class="mute">→</span>${chip('LLM : regroupe', 'llm')}</div>
          <div class="h-s c-cost" data-in="20" style="position:absolute;bottom:80px;font-size:40px">plafond : 1 000 traces</div>
          <div class="src" style="position:absolute;bottom:30px">d'après la documentation publique · docs.langchain.com/langsmith/insights</div></div>
        <div class="full center">
          <div class="h-m" data-in="27.5" style="max-width:1600px">Quand <span class="c-llm">le LLM fait tout</span>, il faut échantillonner.</div>
          <div class="h-m" data-in="31.5" style="margin-top:40px;max-width:1600px">Quand <span class="c-ds">la data science fait la structure</span>, on peut tout lire.</div>
        </div>`;
      const r = K.rng(12);
      const tr = Array.from({ length: 260 }, () => ({ y: r(), d: r() }));
      return (t, ctx) => {
        if (t < 13 || t > 27) return;
        const a = clamp(t - 13) * (1 - P(t, 26, .5));
        const x0 = 1040, x1 = 1760, y0 = 560, h = 70, wall = 1560;
        const lt = t - 13;
        const passed = Math.min(1000, Math.floor(lt * 160));
        tr.forEach((p, i) => {
          const u = lt * .5 - p.d * 2 - i * .006; if (u < 0) return;
          let x = x0 + u * 500; const y = y0 + p.y * h;
          const blocked = i > 150;
          let col = COL.llm;
          if (blocked && x > wall - 14) { x = wall - 14 - (i % 40) * 3 - Math.floor((i - 150) / 40) * 0; col = '#4a5163'; }
          if (!blocked && x > x1) return;
          ctx.globalAlpha = a * .85; ctx.fillStyle = col; ctx.fillRect(x, y, 8, 3);
        });
        ctx.globalAlpha = a; ctx.fillStyle = COL.cost; ctx.fillRect(wall, y0 - 14, 4, h + 28);
        ctx.font = `600 20px ${FONT.mono}`; ctx.textAlign = 'right'; ctx.fillText(K.fmt(passed) + ' traces', x1, y0 - 22);
      };
    },
  });

  K.scene({
    id: 'curve', chapter: CH, chapName: CN, title: 'La courbe de coût', dur: 38,
    say: "La courbe de coût — illustrative, en ordres de grandeur. En abscisse, la taille du corpus : mille, dix mille, cent mille, un million de documents.\nSi le LLM lit chaque document, la facture suit le corpus : dix fois plus de documents, dix fois plus cher.\nSi le LLM ne lit que les groupes, la facture reste presque plate. Elle monte un peu quand le corpus devient assez gros pour un niveau de hiérarchie de plus, mais les groupes grossissent beaucoup moins vite que les documents.\nLa facture suit les groupes, pas les documents.",
    build(root) {
      root.innerHTML = `
        <div class="abs kicker" style="left:260px;top:90px" data-in=".3">La courbe de coût</div>
        <div class="abs tag" style="left:1240px;top:80px" data-in="1">illustratif · ordres de grandeur</div>
        <div class="abs t-s mute" style="left:110px;top:150px;width:150px;text-align:right" data-in="1.5">coût<br>(échelle log)</div>
        <div class="abs t-s mute" style="left:1450px;top:150px" data-in="1.5">→ en abscisse : taille du corpus (documents)</div>
        <div class="abs" style="left:1480px;top:220px;width:400px">
          <div class="t-l c-cost b" data-in="5">Le LLM lit chaque document</div>
          <div class="t-m mute" data-in="9">×10 documents → ×10 la facture</div>
          <div class="t-l c-ds b" data-in="14" style="margin-top:250px">Le LLM ne lit que les groupes</div>
          <div class="t-m mute" data-in="18">presque plate — une marche à chaque niveau de hiérarchie en plus</div>
        </div>
        <div class="abs h-m" style="left:260px;top:960px" data-in="26"><span class="c-cost">La facture suit les groupes,</span> pas les documents.</div>`;
      const X0 = 280, X1 = 1400, Y0 = 860, Y1 = 180;
      const lx = n => X0 + (Math.log10(n) - 3) / 3 * (X1 - X0);
      const ymin = 2.4, ymax = 6.2, ly = c => Y0 - (Math.log10(c) - ymin) / (ymax - ymin) * (Y0 - Y1);
      const A = n => n;
      const B = n => { const l = Math.log10(n); let v = 600 * Math.pow(n / 1000, .16); if (l > 4.5) v *= 1.35; if (l > 5.5) v *= 1.3; return v; };
      return (t, ctx) => {
        const ax = EP(t, .8, 1.5);
        ctx.globalAlpha = ax; ctx.strokeStyle = '#3a4152'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X0, Y1 - 20); ctx.lineTo(X0, Y0); ctx.lineTo(X1 + 30, Y0); ctx.stroke();
        ctx.font = `500 22px ${FONT.mono}`; ctx.textAlign = 'center'; ctx.fillStyle = COL.mute;
        [1e3, 1e4, 1e5, 1e6].forEach((n, i) => {
          const x = lx(n); ctx.globalAlpha = ax * EP(t, 1 + i * .3, .6);
          ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.moveTo(x, Y1); ctx.lineTo(x, Y0); ctx.stroke();
          ctx.fillText(K.fmt(n), x, Y0 + 40);
        });
        const plot = (f, p, col, w) => {
          if (p <= 0) return;
          ctx.globalAlpha = 1; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round';
          ctx.shadowColor = col; ctx.shadowBlur = 18;
          ctx.beginPath(); let last;
          for (let i = 0; i <= 300 * p; i++) {
            const l = 3 + 3 * i / 300, n = Math.pow(10, l), x = lx(n), y = ly(f(n));
            if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); last = { x, y };
          }
          ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(last.x, last.y, 9, 0, 6.283); ctx.fill();
        };
        plot(A, IO(t, 4, 7), COL.cost, 5);
        // repères ×10
        [1e4, 1e5, 1e6].forEach((n, i) => {
          const k = EP(t, 6 + i * 2.2, .6); if (!k) return;
          ctx.globalAlpha = k; ctx.fillStyle = COL.cost; ctx.font = `700 22px ${FONT.mono}`; ctx.textAlign = 'right';
          ctx.fillText('×10', lx(n) - 14, ly(A(n)) - 6);
        });
        plot(B, IO(t, 13, 7), COL.ds, 5);
        if (t > 21) {
          const k = EP(t, 21, 1.2), x = lx(1e6) + 34;
          ctx.globalAlpha = k; ctx.strokeStyle = '#eef1f6'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
          ctx.beginPath(); ctx.moveTo(x, ly(A(1e6))); ctx.lineTo(x, lerp(ly(A(1e6)), ly(B(1e6)), k)); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = '#eef1f6'; ctx.font = `600 22px ${FONT.body}`; ctx.textAlign = 'left';
          ctx.fillText("l'écart se creuse", x + 14, (ly(A(1e6)) + ly(B(1e6))) / 2);
        }
      };
    },
  });

  K.scene({
    id: 'giants', chapter: CH, chapName: CN, title: 'Réservé aux géants ?', dur: 26,
    say: "Réservé aux géants ? À l'échelle d'une entreprise ordinaire — quelques dizaines de milliers de textes — tout faire lire au LLM coûte encore peu. Ça ne durera pas : les piles grossissent.\nEt surtout, le vrai gain n'est pas là. C'est voir ce qu'on ne cherchait pas : les thèmes qui émergent tout seuls, que personne n'avait mis dans le formulaire.",
    build(root) {
      const box = (s, on) => `<div class="t-m" style="margin:10px 0"><span class="mono" style="color:${on ? 'var(--ds)' : 'var(--dim)'}">☐</span> ${s}</div>`;
      root.innerHTML = `
        <div class="full center"><div class="h-xl" data-in=".4" data-out="10" data-fx="blur">Réservé aux géants ?</div>
          <div class="t-l" data-in="3" data-out="10" style="margin-top:50px;max-width:1300px">Quelques dizaines de milliers de textes : tout faire lire au LLM <b>coûte encore peu</b>.</div>
          <div class="t-l c-cost" data-in="6" data-out="10" style="margin-top:18px">Ça ne durera pas — les piles grossissent.</div></div>
        <div class="abs" style="left:110px;top:150px;width:1700px">
          <div class="kicker" data-in="10.8">Le vrai gain n'est pas là</div>
          <div class="h-l" data-in="11.5" style="margin-top:26px">C'est <span class="grad">voir ce qu'on ne cherchait pas.</span></div></div>
        <div class="abs card" style="left:110px;top:440px;width:520px" data-in="14" data-fx="left">
          <div class="kicker" style="margin-bottom:16px">Le formulaire</div>
          ${box('Livraison')}${box('Paiement')}${box('Compte')}${box('Autre')}</div>
        <div class="abs t-l mute" style="left:110px;top:900px;width:1600px" data-in="19">Des thèmes qui émergent tout seuls — <span style="color:var(--ink)">que personne n'avait mis dans le formulaire.</span></div>
        <div class="abs tag" style="right:110px;top:440px" data-in="15">illustratif</div>`;
      const em = [['Double débit', 900, 520], ['Bug après la mise à jour', 1280, 600], ['Frais de retour surprise', 980, 720], ['SMS frauduleux', 1500, 760], ['Livreur sans sonnette', 1350, 470]];
      return (t, ctx) => {
        if (t < 14) return;
        em.forEach((e, i) => {
          const t0 = 15 + i * 1, k = EP(t, t0, 1); if (!k) return;
          const hue = (i * 70 + 170) % 360;
          const g = ctx.createRadialGradient(e[1], e[2], 0, e[1], e[2], 110 * k);
          g.addColorStop(0, `hsla(${hue},80%,60%,.25)`); g.addColorStop(1, `hsla(${hue},80%,60%,0)`);
          ctx.fillStyle = g; ctx.fillRect(e[1] - 120, e[2] - 120, 240, 240);
          const r = K.rng(i + 3);
          for (let j = 0; j < 26; j++) { ctx.globalAlpha = k * .8; ctx.fillStyle = `hsl(${hue},70%,62%)`; ctx.beginPath(); ctx.arc(e[1] + K.gauss(r) * 26 * k, e[2] + K.gauss(r) * 20 * k, 2.6, 0, 6.283); ctx.fill(); }
          K.pill(ctx, e[1], e[2] - 46, e[0], { color: `hsl(${hue},70%,65%)`, size: 20, alpha: k, scale: .8 + .2 * k });
        });
      };
    },
  });

  // ================================================================= LE NOTEBOOK
  const nbWin = (inner, cellN) => `<div class="nb" data-in=".2" data-fx="fade">
      <div class="nb-bar"><span class="dots"><i></i><i></i><i></i></span><span>secna.ipynb</span><span class="dim">· github.com/mdussere/secna</span><span class="nb-badge">résultats illustratifs</span></div>
      ${inner}</div>`;
  const side = (big, cls, title, lines, t0 = .8) => `<div class="nb-side">
      <div class="big ${cls}" data-in="${t0}" data-fx="blur">${big}</div>
      <div class="h-s" data-in="${t0 + .5}">${title}</div>
      ${lines.map((l, i) => `<div class="t-m" data-in="${l[1]}">${l[0]}</div>`).join('')}</div>`;
  const cell = (n, top, code, tin, td) => `<div class="cell" style="top:${top}px"><div class="prompt">In [${n}]:</div><pre class="code" data-in="${tin}" data-fx="fade" data-type="${td}">${code}</pre></div>`;
  const NB_STEPS = ['E', 'C', 'N', 'A'];
  const nbPipe = (i) => `<div class="abs row" style="left:1380px;top:960px;gap:12px" data-in="1">${NB_STEPS.map((s, j) =>
    `<span class="mono" style="font:700 30px var(--f-head);color:${j === i ? (s === 'N' ? 'var(--llm)' : 'var(--ds)') : j < i ? 'var(--mute)' : 'var(--dim)'}">${s}</span>`).join('<span class="dim">·</span>')}
    <span class="t-s dim" style="margin-left:12px">sans S</span></div>`;
  const OUT = { x: 70 + 24 + 110, y: 0, w: 1250 - 48 - 110 };
  const lin = new K.Cloud({ seed: 42, n: 2800, k: 16, aspect: 1100 / 470, minD: .19, sig: [.018, .04], outliers: .06 });
  const LNAMES = ['Rust dans le noyau', 'Pilotes GPU', 'Réseau : correctifs', 'Gestion mémoire', 'Systèmes de fichiers', 'Ordonnanceur',
    'BPF et traçage', 'Arm64 : nouveaux SoC', 'Pilotes audio', 'Sécurité : correctifs', 'Selftests', 'Documentation', 'Virtualisation (KVM)',
    'Stockage (NVMe, blocs)', 'USB et périphériques', 'Énergie et thermique'];

  K.scene({
    id: 'nb-intro', chapter: CH, chapName: CN, title: 'Notebook — moi aussi ?', dur: 30,
    say: "Est-ce que je peux le faire moi aussi ? Oui. Avec le notebook.\nUn notebook Jupyter de moins de deux cents lignes, dans un dépôt public : github.com/mdussere/secna — le QR code renvoie vers ce dépôt. Une commande pour le lancer. Et le fournisseur de modèles se règle sur une ligne de configuration.",
    build(root) {
      root.innerHTML = `
        <div class="full center"><div class="h-l" data-in=".4" data-out="8.5">Est-ce que je peux le faire moi aussi ?</div>
          <div class="h-xxl c-ds" data-in="3" data-out="8.5" data-fx="pop" style="margin-top:40px">Oui.</div></div>
        <div class="abs" style="left:150px;top:180px;width:1000px">
          <div class="kicker" data-in="9">Le notebook</div>
          <div class="h-m mono" data-in="9.5" style="font-size:62px;margin-top:24px">github.com/<span class="c-ds">mdussere/secna</span></div>
          <div class="t-l" data-in="12" style="margin-top:56px">→ un notebook Jupyter de <b>moins de 200 lignes</b></div>
          <div class="t-l" data-in="14" style="margin-top:14px">→ <b>une commande</b> pour le lancer</div>
          <div class="t-l" data-in="16" style="margin-top:14px">→ le fournisseur de modèles : <b>une ligne</b> de configuration</div>
          <div class="term" data-in="19" style="margin-top:56px;width:900px"><span class="ps">$</span> <span data-in="19.4" data-fx="fade" data-type="1.6">git clone https://github.com/mdussere/secna</span>
<span class="mute" data-in="21.5" data-fx="fade"># puis la commande unique indiquée dans le README</span></div>
        </div>
        <div class="abs center" style="left:1300px;top:260px;width:470px" data-in="10" data-fx="pop">
          ${K.qrSVG(380)}<div class="t-s mute" style="margin-top:20px">le dépôt du talk</div></div>`;
    },
  });

  K.scene({
    id: 'nb-corpus', chapter: CH, chapName: CN, title: 'Notebook — le corpus', dur: 36,
    say: "Le corpus : le noyau Linux, les six derniers mois — les commits et les pull requests fusionnées. La question posée : qu'est-ce qui s'est passé dans le noyau Linux ces six derniers mois ?\nPremière cellule : la configuration, avec le fournisseur sur une ligne. Deuxième cellule : on récupère l'historique et on affiche sa taille. Plusieurs dizaines de milliers de commits — le chiffre exact viendra quand le notebook aura tourné.\nUn message de commit ressemble à ça. Avec une étape S, un LLM le préparerait ainsi. Ici, pas de S : on verra pourquoi.",
    build(root) {
      const c1 = `<span class="cm"># configuration</span>
PROVIDER = <span class="str">"…"</span>        <span class="cm"># changer de fournisseur : cette ligne</span>`;
      const c2 = `commits = <span class="fn">load_linux_history</span>(months=<span class="num">6</span>)   <span class="cm"># commits + PR fusionnées</span>
<span class="fn">print</span>(<span class="fn">len</span>(commits))`;
      const commits = ['net: fix use-after-free in tcp_ack() when socket is closed during retransmit', 'drm/amd/display: fix null pointer dereference in dc_link_detect()', 'rust: add abstractions for the platform driver API',
        'mm: reduce lock contention on the LRU list', 'sched/fair: fix load balancing on asymmetric CPU capacity', 'btrfs: avoid deadlock when cloning inline extents', 'arm64: dts: add support for a new SoC board',
        'bpf: verifier: tighten bounds checks for packet pointers', 'ALSA: hda: add quirk for a laptop speaker amp', 'selftests/net: add test for tcp retransmit path', 'Documentation: update the memory model guide',
        'KVM: x86: fix MSR handling on nested virtualization', 'nvme: fix timeout handling for admin queue', 'usb: typec: fix role switch on disconnect', 'thermal: core: fix race on zone removal'];
      root.innerHTML = nbWin(
        cell(1, 80, c1, 2, 2.2) +
        cell(2, 200, c2, 5.5, 2.4) +
        `<div class="cell" style="top:330px"><div class="prompt out">Out[2]:</div><div class="outtxt" style="padding-top:14px" data-in="9" data-fx="fade"><span class="c-cost">plusieurs dizaines de milliers</span>  <span class="dim"># chiffre exact : quand le notebook aura tourné</span></div></div>
         <div class="abs" style="left:134px;top:400px;width:1090px;height:300px;overflow:hidden;-webkit-mask-image:linear-gradient(transparent,#000 15%,#000 85%,transparent);mask-image:linear-gradient(transparent,#000 15%,#000 85%,transparent)" data-in="9.5" data-fx="fade" id="nbc-list"></div>
         <div class="abs card" style="left:134px;top:730px;width:1090px;padding:24px 30px" data-in="21">
           <div class="mono t-s" style="color:#d8dee9">net: fix use-after-free in tcp_ack() when socket is closed during retransmit</div>
           <div class="t-s" data-in="24" style="margin-top:12px"><span class="c-llm">avec un S →</span> sous-système : <b>réseau</b> · nature : <b>correctif</b> · risque : <b>mémoire</b></div>
           <div class="t-s mute" data-in="28" style="margin-top:8px">Dans ce notebook : pas de S, le texte brut suffit. On y reviendra.</div></div>`) +
        side('🐧', '', 'Le noyau Linux', [['les six derniers mois — commits et <i>pull requests</i> fusionnées', 1.6], ['<span class="c-cost">« Qu\'est-ce qui s\'est passé dans le noyau Linux ces six derniers mois ? »</span>', 4]]);
      const list = root.querySelector('#nbc-list');
      list.innerHTML = Array.from({ length: 60 }, (_, i) => `<div class="mono" style="font-size:18px;line-height:30px;color:${i % 7 === 0 ? '#c9cfdb' : '#6b7385'};white-space:nowrap"><span class="dim">${(0x1a2f3 * (i + 7) % 0xfffffff).toString(16).padStart(7, '0')}</span>  ${commits[i % commits.length]}</div>`).join('');
      return (t) => { list.scrollTop = 0; list.firstElementChild.style.marginTop = -((Math.max(0, t - 9.5) * 46) % (15 * 30)) + 'px'; };
    },
  });

  K.scene({
    id: 'nb-E', canvasTop: true, chapter: CH, chapName: CN, title: 'Notebook — E', dur: 42,
    say: "Étape E. On projette chaque message de commit avec un modèle d'embedding. Le nuage de points se remplit : chaque point, c'est un commit. Les commits qui parlent de la même chose se retrouvent côte à côte.\nAucun LLM ici, et ça peut tourner sur un portable.",
    build(root) {
      const c = `vectors = <span class="fn">embed</span>(commits, model=EMBEDDING_MODEL)   <span class="cm"># local possible</span>
<span class="fn">plot_cloud</span>(vectors)`;
      root.innerHTML = nbWin(cell(3, 80, c, 1.5, 2.2) +
        `<div class="cell" style="top:210px"><div class="prompt out">Out[3]:</div><div style="flex:1;padding-top:18px" data-in="4.5" data-fx="fade">
          <div class="row mono t-s" style="gap:16px;color:#aeb5c4">embedding <div class="pbar" style="flex:1"><i id="nbe-bar"></i></div><span id="nbe-pc" style="width:70px;text-align:right">0 %</span></div></div></div>`) +
        side('E', 'c-ds', 'Projeter', [['chaque message de commit → un point', 2], ['un modèle d\'<i>embedding</i>, pas de LLM', 6], ['<span class="mute">même sujet → points voisins</span>', 22]]) + nbPipe(0);
      const bar = root.querySelector('#nbe-bar'), pc = root.querySelector('#nbe-pc');
      const box = { x: OUT.x, y: 370, w: OUT.w, h: 470 };
      return (t, ctx) => {
        const p = IO(t, 5, 16);
        bar.style.width = (p * 100) + '%'; pc.textContent = Math.round(p * 100) + ' %';
        ctx.save(); ctx.beginPath(); ctx.rect(box.x - 10, box.y - 10, box.w + 20, box.h + 20); ctx.clip();
        lin.draw(ctx, { box, reveal: p, gather: 1, color: 0, r: 2, alpha: .75, wobble: .6, t });
        ctx.restore();
        if (t > 24) {
          // zoom sur un voisinage
          const ci = 2, c = lin.center(ci, box), k = EP(t, 24, 1);
          ctx.globalAlpha = k; ctx.strokeStyle = COL.ds; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c.x, c.y, 60, 0, 6.283); ctx.stroke();
          K.pill(ctx, c.x, c.y + 98, 'commits voisins : même sujet', { color: COL.ds, size: 18, alpha: k });
        }
      };
    },
  });

  K.scene({
    id: 'nb-C', canvasTop: true, chapter: CH, chapName: CN, title: 'Notebook — C', dur: 38,
    say: "Étape C. On regroupe. Les groupes apparaissent ; on les compte. Et on montre les points restés isolés : ils ne sont pas cachés, ils sont là, à part.\nToujours aucun token consommé.",
    build(root) {
      const c = `clusters = <span class="fn">cluster</span>(vectors)
clusters.<span class="fn">summary</span>()`;
      root.innerHTML = nbWin(cell(4, 80, c, 1.5, 1.4) +
        `<div class="cell" style="top:210px"><div class="prompt out">Out[4]:</div><div class="outtxt" style="padding-top:14px" data-in="5" data-fx="fade">groupes : <b class="c-ds" data-in="5" data-fx="fade" data-count="${lin.k}" data-cd="4">0</b>   ·   points isolés : <b class="c-cost">montrés à part</b></div></div>`) +
        side('C', 'c-ds', 'Regrouper', [['les points proches forment des groupes', 2], ['les isolés : <span class="c-cost">montrés, pas cachés</span>', 14], ['<span class="mute">aucun token</span>', 20]]) + nbPipe(1);
      const box = { x: OUT.x, y: 370, w: OUT.w, h: 470 };
      return (t, ctx) => {
        lin.draw(ctx, { box, color: IO(t, 4, 8), glow: 1, r: 2, alpha: .85, ringOutliers: P(t, 14, 1) * (1 - P(t, 24, 2)), wobble: .6, t });
      };
    },
  });

  K.scene({
    id: 'nb-N', canvasTop: true, chapter: CH, chapName: CN, title: 'Notebook — N', dur: 46,
    say: "Étape N. Un appel au LLM par groupe, avec quelques exemples de commits. Les noms arrivent un par un : Rust dans le noyau, pilotes GPU, réseau : correctifs, gestion mémoire, systèmes de fichiers, ordonnanceur…\nCe sont des exemples illustratifs, en attendant le vrai résultat. Regardez le compteur : un appel par groupe, pas un appel par commit.",
    build(root) {
      const box = { x: OUT.x, y: 320, w: 650, h: 580 };
      const lin2 = new K.Cloud({ seed: 42, n: 2200, k: 16, aspect: 650 / 580, minD: .24, sig: [.02, .04], outliers: .06 });
      const c = `names = <span class="fn">name_clusters</span>(clusters, examples=<span class="num">5</span>)   <span class="cm"># 1 appel LLM par groupe</span>`;
      root.innerHTML = nbWin(cell(5, 80, c, 1.5, 1.8) +
        `<div class="cell" style="top:180px"><div class="prompt out">Out[5]:</div><div class="outtxt" style="padding-top:14px" data-in="4" data-fx="fade">appels LLM : <b class="c-llm" id="nbn-calls">0</b> <span class="dim">/ ${lin2.k} groupes  — et non un par commit</span></div></div>
         <div class="abs mono" style="left:870px;top:270px;width:420px;font-size:18px;line-height:31px" id="nbn-log"></div>`) +
        side('N', 'c-llm', 'Nommer', [['un appel au LLM par groupe, avec quelques exemples', 2], ['les noms arrivent un par un', 8], ['<span class="mute">noms illustratifs, en attendant le vrai passage</span>', 30]]) + nbPipe(2);
      const ord = lin2.C.map((c, i) => i).sort((a, b) => lin2.C[a].y - lin2.C[b].y);
      const log = root.querySelector('#nbn-log'); const calls = root.querySelector('#nbn-calls');
      log.innerHTML = ord.map((ci, j) => `<div style="opacity:0;white-space:nowrap"><span class="dim">groupe ${String(j + 1).padStart(2, '0')} →</span> <span style="color:${lin2.hsl(ci, 1, 70)}">${LNAMES[j]}</span></div>`).join('');
      const rows = [...log.children];
      const per = 1.7;
      return (t, ctx) => {
        lin2.draw(ctx, { box, color: 1, glow: .7, r: 1.9, alpha: .85, wobble: .5, t });
        let n = 0;
        ord.forEach((ci, j) => {
          const t0 = 4.5 + j * per; const k = EP(t, t0 + .5, .5);
          rows[j].style.opacity = k;
          if (t < t0) return; n = j + 1;
          const c = lin2.center(ci, box);
          if (t < t0 + per + .3) {
            ctx.globalAlpha = .8; ctx.strokeStyle = COL.llm; ctx.lineWidth = 1.2;
            lin2.samples(ci, 5).forEach(p => { const x = box.x + p.x * box.w, y = box.y + p.y * box.h; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(70 + 860, 64 + 270 + j * 31 + 16); ctx.stroke(); });
          }
          ctx.globalAlpha = k; ctx.fillStyle = '#fff'; ctx.font = `700 13px ${FONT.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.beginPath(); ctx.arc(c.x, c.y, 13, 0, 6.283); ctx.fillStyle = 'rgba(10,12,18,.85)'; ctx.fill(); ctx.strokeStyle = lin2.hsl(ci, 1, 70); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.fillText(String(j + 1), c.x, c.y + 1);
        });
        calls.textContent = n;
      };
    },
  });

  K.scene({
    id: 'nb-A', chapter: CH, chapName: CN, title: 'Notebook — A', dur: 42,
    say: "Étape A. On range les groupes en thèmes et en sous-thèmes. Et voilà le tableau des grands thèmes du semestre dans le noyau Linux — illustratif, pour l'instant.\nOn n'a lu aucun commit à la main, et pourtant on a une vue d'ensemble qu'on peut parcourir.",
    build(root) {
      const c = `themes = <span class="fn">aggregate</span>(names, levels=<span class="num">2</span>)
themes.<span class="fn">table</span>()`;
      const rows = [['Pilotes', 'GPU · audio · USB · réseau', 38], ['Architectures', 'Arm64 · x86 · RISC-V', 17], ['Cœur du noyau', 'ordonnanceur · mémoire', 14], ['Réseau', 'correctifs · protocoles', 11],
        ['Fichiers & stockage', 'btrfs · ext4 · NVMe', 10], ['Rust, BPF & outillage', 'Rust · BPF · traçage', 6], ['Tests & documentation', 'selftests · docs', 4]];
      root.innerHTML = nbWin(cell(6, 80, c, 1.5, 1.6) +
        `<div class="cell" style="top:210px"><div class="prompt out">Out[6]:</div><div style="flex:1;padding-top:10px">
          <table class="tbl"><tr data-in="4" data-fx="fade"><th>thème</th><th>sous-thèmes</th><th style="width:380px">part des commits</th></tr>
          ${rows.map((r, i) => `<tr data-in="${5 + i * .9}" data-fx="left"><td><b>${r[0]}</b></td><td class="mute">${r[1]}</td><td><div class="row" style="gap:12px"><div class="nba-bar" data-v="${r[2]}" style="height:16px;border-radius:4px;background:var(--ds);width:0"></div><span class="mono t-s">${r[2]} %</span></div></td></tr>`).join('')}
          </table></div></div>`) +
        side('A', 'c-ds', 'Ranger', [['thèmes et sous-thèmes', 2], ['les grands thèmes du semestre, d\'un coup d\'œil', 8], ['<span class="mute">répartition illustrative</span>', 14]]) + nbPipe(3);
      const bars = [...root.querySelectorAll('.nba-bar')];
      return (t) => { bars.forEach((b, i) => { b.style.width = (+b.dataset.v * 7.5 * IO(t, 5.5 + i * .9, 1.5)) + 'px'; }); };
    },
  });

  K.scene({
    id: 'nb-bill', chapter: CH, chapName: CN, title: 'Notebook — la facture', dur: 40,
    say: "La facture. Le notebook affiche ce que ce passage a coûté en tokens, et ce qu'aurait coûté un LLM sur chaque document. Les chiffres réels viendront quand le notebook aura tourné ; l'ordre de grandeur, lui, est déjà là : la facture suit les groupes, pas les documents.",
    build(root) {
      const c = `<span class="fn">report_cost</span>()`;
      root.innerHTML = nbWin(cell(7, 80, c, 1.5, .6) +
        `<div class="cell" style="top:190px"><div class="prompt out">Out[7]:</div><div style="flex:1;padding-top:16px">
          <div class="kicker" data-in="3">tokens consommés · ordres de grandeur illustratifs</div>
          <div style="margin-top:40px" data-in="4"><div class="t-m">Ce passage <span class="mute">(E · C · N · A)</span></div>
            <div class="row" style="gap:20px;margin-top:14px"><div id="nbb-a" style="height:56px;border-radius:8px;background:var(--ds);width:0"></div><span class="mono h-s c-ds" style="font-size:38px">≈ 0,4 M</span></div></div>
          <div style="margin-top:50px" data-in="9"><div class="t-m">Un LLM sur chaque commit</div>
            <div class="row" style="gap:20px;margin-top:14px"><div id="nbb-b" style="height:56px;border-radius:8px;background:var(--cost);width:0"></div><span class="mono h-s c-cost" style="font-size:38px">≈ 6 M</span></div></div>
          <div class="t-s mute" data-in="15" style="margin-top:50px">chiffres réels : affichés par le notebook quand il aura tourné</div>
        </div></div>`) +
        side('$', 'c-cost', 'La facture', [['ce que ce passage a coûté', 2], ['ce qu\'aurait coûté un LLM sur chaque document', 9], ['<b>La facture suit les groupes, pas les documents.</b>', 22]]);
      const a = root.querySelector('#nbb-a'), b = root.querySelector('#nbb-b');
      return (t) => { a.style.width = (50 * IO(t, 4.5, 1.5)) + 'px'; b.style.width = (750 * IO(t, 9.5, 3)) + 'px'; };
    },
  });

  K.scene({
    id: 'nb-yours', chapter: CH, chapName: CN, title: 'Notebook — votre corpus', dur: 36,
    say: "Et maintenant, votre corpus. Une seule ligne à changer pour l'appliquer à vos propres textes : vos avis, vos tickets, vos messages, vos réponses libres. Tout le reste ne bouge pas.",
    build(root) {
      const c = `<span class="del">- commits = load_linux_history(months=6)</span>
<span class="add">+ commits = load_texts("mes_avis.csv", column="commentaire")</span>`;
      root.innerHTML = nbWin(cell(2, 80, c, 2, 2.6) +
        `<div class="abs h-m" style="left:134px;top:300px;width:1000px" data-in="7">La <span class="c-ds">seule ligne</span> à changer.</div>
         <div class="abs t-l mute" style="left:134px;top:420px;width:1000px" data-in="10">Tout le reste — E, C, N, A — ne bouge pas.</div>
         <div class="abs row" style="left:134px;top:600px;gap:16px;flex-wrap:wrap;width:1050px">
           ${['avis clients', 'tickets de support', 'messages vendeurs', 'réponses libres', 'traces d\'agents'].map((s, i) => `<span class="chip" data-in="${13 + i * .6}" data-fx="pop">${s}</span>`).join('')}</div>`) +
        `<div class="nb-side"><div class="big c-ds" data-in=".8" data-fx="blur" style="font-size:150px">À vous</div>
          <div class="h-s" data-in="1.3">Votre corpus</div>
          <div class="center" style="margin-top:40px;align-items:flex-start" data-in="18" data-fx="pop">${K.qrSVG(300)}
          <div class="mono t-s" style="margin-top:16px">github.com/mdussere/secna</div></div></div>`;
    },
  });
})();
