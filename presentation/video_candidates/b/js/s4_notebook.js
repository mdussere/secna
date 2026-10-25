/* 04 — the notebook walkthrough (> 5 minutes). Everything shown is illustrative:
   the notebook has not run on the Linux kernel yet. */
(function () {
  'use strict';
  const { clamp, lerp, prog, eo, eio } = U;

  const THEMES = [
    ['Rust dans le noyau', ['abstractions', 'pilotes en Rust', 'outillage']],
    ['Pilotes GPU', ['correctifs', 'nouveau matériel', 'performances']],
    ['Réseau : correctifs', ['TCP', 'pilotes réseau', 'sécurité mémoire']],
    ['Gestion mémoire', ['allocation', 'verrous', 'régressions']],
    ['Systèmes de fichiers', ['correctifs', 'performances']],
    ['Ordonnanceur', ['équilibrage de charge', 'latence']],
  ];
  const SHARE = [.62, .9, .78, .55, .47, .33];

  const CELLS = [
    { id: 'cfg', step: 'Configuration', type: [4, 3.5], run: 9,
      code: '# Le fournisseur de modèles : une seule ligne\nPROVIDER = "anthropic"   # ou un autre fournisseur, ou un modèle local',
      out: `<div class="mono good" style="font-size:22px">✓ fournisseur : anthropic · modèle d’embedding : local</div>` },
    { id: 'corpus', step: 'Corpus', type: [22, 5], run: 29.5,
      code: '# Le corpus : six mois d’historique du noyau Linux\ncorpus = git_history("linux", since="6 months ago", merged_prs=True)\nlen(corpus)',
      out: `<div class="t1" style="font-size:34px">→ plusieurs dizaines de milliers de documents <span class="chip cost" style="font-size:18px;vertical-align:middle">chiffre exact : à venir</span></div>
        <div class="mono" style="font-size:20px;line-height:1.9;margin-top:18px;color:#c7cbd6">
          ${['net: fix use-after-free in tcp_ack() when socket is closed during retransmit', 'mm: avoid lock contention when reclaiming pages', 'rust: add safe abstractions for a driver subsystem', 'drm: fix null pointer dereference on resume', 'sched: rework load balancing for hybrid cores']
            .map((m, i) => `<div data-at="${31 + i * .7}" data-fx="left" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><span class="dim">${String(i).padStart(2, '0')}  </span>${m}</div>`).join('')}</div>
        <div data-at="38" class="card" style="margin-top:22px;padding:22px 26px;border-radius:16px">
          <div class="k" style="font-size:16px">un message, préparé</div>
          <div class="mono" style="font-size:21px;margin-top:12px;color:#c7cbd6">net: fix use-after-free in tcp_ack() when socket is closed during retransmit</div>
          <div class="mono" data-at="40" style="font-size:22px;margin-top:10px">→ <span class="ds">sous-système : réseau</span> · <span class="good">nature : correctif</span> · <span class="bad">risque : mémoire</span></div></div>` },
    { id: 'E', step: 'E · projeter', type: [56, 4], run: 61,
      code: '# E — projeter chaque message dans un espace\nvectors = embed(corpus.text)   # modèle d’embedding, en local',
      out: `<div style="display:flex;align-items:center;gap:20px;font:500 20px var(--mono);color:#9aa0b2">embedding
          <div style="flex:1;height:10px;border-radius:5px;background:#1a1e2a;overflow:hidden"><div class="eb" style="height:100%;width:0;background:var(--ds)"></div></div>
          <span class="ep" style="width:70px;text-align:right">0 %</span></div>
        <canvas class="cv" data-k="E" width="2320" height="760" style="width:1160px;height:380px;margin-top:14px"></canvas>` },
    { id: 'C', step: 'C · regrouper', type: [100, 4], run: 105,
      code: '# C — regrouper : aucun token\nclusters = cluster(vectors)\nclusters.summary()',
      out: `<canvas class="cv" data-k="C" width="2320" height="760" style="width:1160px;height:380px"></canvas>
        <div class="mono" data-at="112" style="font-size:24px;margin-top:10px">groupes trouvés : <b class="ds"><span data-count="0,140" data-c="112,4">0</span></b>   ·   isolés : <b>≈ 8 %</b>   ·   <span class="good">tokens consommés : 0</span></div>` },
    { id: 'N', step: 'N · nommer', type: [142, 4], run: 147,
      code: '# N — un appel au LLM par groupe, avec quelques exemples\nnames = name_clusters(clusters, examples=10)',
      out: `<div class="mono" style="font-size:22px;color:#9aa0b2">appels LLM : <b class="llm"><span data-count="0,140" data-c="148,36">0</span> / 140</b>  <span class="dim">— un par groupe, pas un par document</span></div>
        <div style="margin-top:16px;display:grid;gap:10px">
          ${THEMES.map(([n, sub], i) => `<div data-at="${150 + i * 5.5}" data-fx="left" style="display:flex;align-items:baseline;gap:20px;padding:12px 18px;border-radius:12px;background:rgba(192,140,255,.06);border:1px solid rgba(192,140,255,.25)">
              <span class="mono dim" style="font-size:20px">#${String(3 + i * 17).padStart(3, '0')}</span>
              <span style="font:600 30px var(--sans)">${n}</span>
              <span class="t3" style="font-size:21px">${sub.join(' · ')}</span></div>`).join('')}
          <div class="mono dim" data-at="184" style="font-size:24px;padding-left:18px">… 134 autres groupes</div></div>` },
    { id: 'A', step: 'A · ranger', type: [197, 4], run: 202,
      code: '# A — ranger les groupes en thèmes et sous-thèmes\nthemes = aggregate(names, levels=2)\nthemes.top()',
      out: `<div class="k" style="font-size:16px;margin-bottom:12px">les grands thèmes du semestre</div>
        ${THEMES.map(([n, sub], i) => `<div data-at="${203 + i * 1.6}" style="display:grid;grid-template-columns:330px 1fr 380px;align-items:center;gap:20px;padding:13px 0;border-bottom:1px solid #1a1e2a">
          <span style="font:600 28px var(--sans)">${n}</span>
          <span style="display:flex;gap:8px;flex-wrap:wrap">${sub.map(s => `<span class="chip" style="font-size:17px;padding:7px 12px">${s}</span>`).join('')}</span>
          <span style="height:14px;border-radius:7px;background:#1a1e2a;overflow:hidden"><i class="ab" data-w="${SHARE[i]}" style="display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ds),var(--llm))"></i></span></div>`).join('')}` },
    { id: 'bill', step: 'La facture', type: [236, 2], run: 239,
      code: 'bill()',
      out: `<div style="display:grid;grid-template-columns:420px 1fr;gap:22px 30px;align-items:center">
          <div class="t1" style="font-size:30px">Ce passage<br><span class="t3" style="font-size:22px">un appel LLM par groupe</span></div>
          <div style="height:44px;border-radius:10px;background:#11131c;overflow:hidden"><div class="b1" style="height:100%;width:0;background:var(--good);box-shadow:0 0 30px rgba(110,240,176,.5)"></div></div>
          <div class="t1" style="font-size:30px">Un LLM sur chaque document<br><span class="t3" style="font-size:22px">un appel par document</span></div>
          <div style="height:44px;border-radius:10px;background:#11131c;overflow:hidden"><div class="b2" style="height:100%;width:0;background:var(--bad)"></div></div></div>
        <div class="t3" data-at="249" style="margin-top:24px">Le notebook affiche les deux, en tokens. <span class="cost">Les vrais chiffres arriveront quand il aura tourné.</span></div>` },
    { id: 'yours', step: 'Votre corpus', type: [262, 5], run: 1e9,
      code: '# Votre corpus : la seule ligne à changer\ncorpus = load_texts("mes_avis.csv", text_column="commentaire")',
      out: '' },
  ];

  scene({
    id: 'notebook', ch: 4, dur: 285, title: 'Le notebook, cellule par cellule', illus: true, noBrand: false,
    src: 'Aperçu illustratif — github.com/mdussere/secna · le notebook n’a pas encore tourné sur le noyau Linux',
    narr: 'Le notebook, cellule par cellule (plus de cinq minutes).\n0:00 — Configuration : le fournisseur de modèles se règle sur une ligne.\n0:22 — Récupérer le corpus : les six derniers mois de l’historique du noyau, et afficher sa taille. Exemple de message de commit : « net: fix use-after-free in tcp_ack() when socket is closed during retransmit » → préparé : sous-système réseau, nature correctif, risque mémoire.\n0:56 — E : projeter chaque message de commit avec un modèle d’embedding ; on voit le nuage de points se remplir.\n1:40 — C : regrouper ; on compte les groupes, on montre les points restés isolés. Aucun token.\n2:22 — N : un appel au LLM par groupe, avec quelques exemples ; les noms arrivent un par un.\n3:17 — A : ranger les groupes en thèmes et sous-thèmes ; un tableau des grands thèmes du semestre.\n3:56 — La facture : ce que ce passage a coûté en tokens, et ce qu’aurait coûté un LLM sur chaque document.\n4:22 — Votre corpus : la seule ligne à changer pour l’appliquer à vos propres textes.\n(Thèmes et chiffres illustratifs en attendant le vrai résultat.)',
    html: `<div class="abs nbwin" style="left:110px;top:110px;width:1380px;height:900px;border-radius:22px;background:#0b0d13;border:1px solid #1e2232;box-shadow:0 40px 120px rgba(0,0,0,.6);overflow:hidden" data-at="0.2" data-fx="scale">
        <div style="height:54px;display:flex;align-items:center;gap:10px;padding:0 22px;border-bottom:1px solid #1a1e2a;background:#0e1018">
          <i style="width:14px;height:14px;border-radius:50%;background:#ff5f57;display:block"></i><i style="width:14px;height:14px;border-radius:50%;background:#febc2e;display:block"></i><i style="width:14px;height:14px;border-radius:50%;background:#28c840;display:block"></i>
          <span class="mono" style="margin-left:20px;font-size:19px;color:#c7cbd6">secna.ipynb</span><span class="sp" style="flex:1"></span>
          <span class="mono kern" style="font-size:17px;color:#9aa0b2">● Python 3 · inactif</span></div>
        <div class="vp" style="position:absolute;left:0;right:0;top:55px;bottom:0;overflow:hidden">
          <div class="nb" style="position:absolute;left:0;right:0;top:0;padding:30px 40px 600px">
            <div class="md" style="padding:10px 0 34px 100px">
              <div style="font:750 46px/1.1 var(--sans);letter-spacing:-.02em">SECNA — qu’est-ce qui s’est passé dans le noyau Linux ces six derniers mois ?</div>
              <div class="t3" style="margin-top:12px;font-size:24px">Recette : <b class="ds">E</b> · <b class="ds">C</b> · <b class="llm">N</b> · <b class="ds">A</b> — moins de 200 lignes.</div></div>
            ${CELLS.map((c, i) => `<div class="cell" data-i="${i}" style="display:flex;gap:18px;margin-bottom:34px">
              <div class="gut mono" style="width:82px;flex:none;text-align:right;font-size:19px;color:#555b6e;padding-top:18px">[ ]:</div>
              <div style="flex:1;min-width:0">
                <div class="cbox" style="border-radius:12px;background:#11141d;border:1px solid #1e2232;padding:18px 22px;transition:border-color .4s,box-shadow .4s">
                  <pre class="mono code" data-type="${c.type[0]},${c.type[1]}" style="margin:0;font-size:22px;line-height:1.6;white-space:pre-wrap;color:#d9dce6;min-height:35px">${U.esc(c.code)}</pre></div>
                ${c.out ? `<div class="out" data-at="${c.run}" data-fx="fade" style="padding:18px 4px 0">${c.out}</div>` : ''}
              </div></div>`).join('')}
            <div class="abs arrow t1 good" data-at="269" style="font-size:34px">↑ la seule ligne à changer</div>
            <div class="abs fin col gap16" data-at="273" style="left:100px;right:40px">
              <div class="d3" style="font-size:58px">Prenez votre pile.</div>
              <div class="t2">Changez cette ligne, relancez toutes les cellules — un après-midi suffit.</div></div>
          </div></div></div>
      <div class="abs col" style="left:1540px;top:130px;width:300px">
        <div class="k" style="font-size:18px;margin-bottom:22px" data-at="0.5">le notebook</div>
        ${CELLS.map((c, i) => `<div class="trk" data-at="${0.8 + i * .15}" style="display:flex;align-items:center;gap:14px;padding:12px 0;font:500 24px var(--sans);color:#555b6e;transition:color .4s">
            <i style="width:12px;height:12px;border-radius:50%;border:2px solid currentColor;display:block;flex:none"></i>${c.step}</div>`).join('')}
        <div class="mono" data-at="1.5" style="margin-top:40px;font-size:18px;color:#555b6e">S : sauté — pas de LLM<br>pour préparer chaque document</div>
      </div>`,
    build(el, st) {
      st.nb = el.querySelector('.nb');
      st.cells = [...el.querySelectorAll('.cell')];
      st.gut = [...el.querySelectorAll('.gut')];
      st.box = [...el.querySelectorAll('.cbox')];
      st.trk = [...el.querySelectorAll('.trk')];
      st.kern = el.querySelector('.kern');
      st.cv = {};
      el.querySelectorAll('canvas.cv').forEach(c => { st.cv[c.dataset.k] = c.getContext('2d'); });
      st.eb = el.querySelector('.eb'); st.ep = el.querySelector('.ep');
      st.ab = [...el.querySelectorAll('.ab')];
      st.b1 = el.querySelector('.b1'); st.b2 = el.querySelector('.b2');
      st.arrow = el.querySelector('.arrow');
      const last = st.cells[st.cells.length - 1];
      st.arrow.style.left = '200px';
      st.arrow.style.top = (last.offsetTop + last.offsetHeight + 10) + 'px';
      const fin = el.querySelector('.fin');
      fin.style.top = (last.offsetTop + last.offsetHeight + 120) + 'px';
      st.cloud = U.makeCloud(13);
    },
    update(t, el, st) {
      // active cell + camera
      let a = -1;
      CELLS.forEach((c, i) => { if (t >= c.type[0] - 1.5) a = i; });
      const tops = st.cells.map(c => c.offsetTop - 24);
      const tgt = i => (i < 0 ? 0 : tops[i]);
      let y = 0;
      if (a >= 0) {
        const f = CELLS[a].type[0] - 1.5;
        y = lerp(tgt(a - 1), tgt(a), eio(prog(t, f, f + 1.3)));
        if (a === 0) y = lerp(0, 0, 1);
      }
      st.nb.style.transform = `translateY(${-y}px)`;
      // gutters / run state
      let busy = false;
      CELLS.forEach((c, i) => {
        const running = t >= c.run - 1.2 && t < c.run;
        const done = t >= c.run;
        if (running) busy = true;
        st.gut[i].textContent = done ? `[${i + 1}]:` : running ? '[*]:' : '[ ]:';
        st.gut[i].style.color = running ? '#ffb547' : done ? '#9aa0b2' : '#555b6e';
        const act = i === a;
        st.box[i].style.borderColor = act ? 'rgba(92,200,255,.6)' : '#1e2232';
        st.box[i].style.boxShadow = act ? '0 0 0 4px rgba(92,200,255,.08)' : 'none';
        st.trk[i].style.color = act ? '#f3f4f8' : (i < a ? '#9aa0b2' : '#555b6e');
      });
      st.kern.textContent = busy ? '● Python 3 · occupé' : '● Python 3 · inactif';
      st.kern.style.color = busy ? '#ffb547' : '#9aa0b2';
      // E — progress + cloud filling
      const ep = prog(t, 61, 86);
      st.eb.style.width = (ep * 100) + '%'; st.ep.textContent = Math.round(ep * 100) + ' %';
      const tf = { x: (1160 - 940 * .54) / 2 - 860 * .54, y: (380 - 700 * .54) / 2 - 220 * .54, s: .54 };
      const draw = (k, o) => { const c = st.cv[k]; if (!c) return; c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, 1160, 380); U.drawCloud(c, { pts: st.cloud, tf, ...o }); };
      if (t > 60 && t < 140) draw('E', { embed: eo(prog(t, 61, 80)), reveal: ep, color: 0 });
      if (t > 100 && t < 200) {
        draw('C', { embed: 1, color: eo(prog(t, 106, 116)), halo: eo(prog(t, 106, 116)) });
      }
      // A bars
      st.ab.forEach((b, i) => { b.style.width = (eo(prog(t, 203.5 + i * 1.6, 206 + i * 1.6)) * +b.dataset.w * 100) + '%'; });
      // bill bars
      st.b1.style.width = (eo(prog(t, 240, 242)) * 3) + '%';
      st.b2.style.width = (eo(prog(t, 243, 248)) * 100) + '%';
    },
  });
})();
