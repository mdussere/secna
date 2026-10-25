/* 04 Les gros, et nous (sans le notebook) */
(function () {
  'use strict';
  const { clamp, lerp, prog, eo, eio } = U;

  U.chapterCard(4, 'Les gros, et nous', 'Anthropic n’est pas seul');

  scene({
    id: 'others', ch: 4, dur: 34, title: 'Clio, Urania, LangSmith Insights',
    src: 'Liu et al., « Urania », Google Research, COLM 2025 — arXiv:2506.04681 · docs.langchain.com/langsmith/insights',
    narr: 'Anthropic n’est pas seul. D’autres grands acteurs ont publié des approches de la même forme, chacun avec sa variante.\nGoogle — Urania, 2025 : la même idée, avec des garanties formelles de confidentialité — la confidentialité différentielle — sur le regroupement et le comptage. L’article se compare explicitement à Clio, qu’il prend comme référence.\nLangChain — LangSmith Insights, 2025 : l’outil d’analyse des traces d’agents. D’après sa documentation publique, un LLM résume chaque trace, puis un LLM fait le regroupement — un LLM à chaque étape. Résultat : l’analyse est plafonnée à mille traces.',
    html: `<div class="wrap">
      <div class="d3" data-at="0.4" style="font-size:64px">Anthropic n’est pas seul.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:36px;margin-top:56px">
        <div class="card col gap16" data-at="2" style="height:560px">
          <div class="k">Anthropic · déc. 2024</div><div class="d3" style="font-size:66px">Clio</div>
          <div class="t3">La référence. Data science pour la structure, LLM pour le sens.</div>
          <div style="flex:1"></div>
          <div class="mono" style="font-size:24px;color:#c7cbd6">100 000 conversations<br><span class="cost" style="font-size:44px;font-weight:700">48,81 $</span></div></div>
        <div class="card col gap16" data-at="6" style="height:560px">
          <div class="k">Google Research · 2025</div><div class="d3" style="font-size:66px">Urania</div>
          <div class="t3">La même idée, avec des garanties formelles de confidentialité — <b>confidentialité différentielle</b> — sur le regroupement et le comptage.</div>
          <div style="flex:1"></div>
          <div class="chip ds" data-at="11" style="align-self:flex-start;font-size:19px">se compare explicitement à Clio</div></div>
        <div class="card col gap16" data-at="14" style="height:560px">
          <div class="k">LangChain · 2025</div><div class="d3" style="font-size:60px">LangSmith Insights</div>
          <div class="t3">Analyse des traces d’agents. D’après sa documentation publique :</div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center" data-at="16.5">
            <span class="chip llm">LLM résume chaque trace</span><span class="dim">→</span><span class="chip llm">LLM regroupe</span></div>
          <div style="flex:1"></div>
          <div data-at="21">
            <div style="height:16px;border-radius:8px;background:#1a1e2a;overflow:hidden"><div class="cap" style="height:100%;width:0;background:var(--bad)"></div></div>
            <div class="mono bad" style="font-size:32px;font-weight:700;margin-top:14px">plafond : 1 000 traces</div></div></div>
      </div></div>`,
    build(el, st) { st.cap = el.querySelector('.cap'); },
    update(t, el, st) { st.cap.style.width = (eo(prog(t, 21.5, 24)) * 100) + '%'; },
  });

  scene({
    id: 'common', ch: 4, dur: 14, title: 'Le point commun',
    narr: 'Le point commun : quand le LLM fait tout, il faut échantillonner ; quand la data science fait la structure, on peut tout lire.',
    html: `<div class="wrap col" style="justify-content:center">
      <div class="k" data-at="0.3">Le point commun</div>
      <div class="d3" data-at="1.2" style="margin-top:50px">Quand le <span class="llm">LLM fait tout</span>,</div>
      <div class="d3 bad" data-at="2.6" style="padding-left:120px">→ il faut échantillonner.</div>
      <div class="d3" data-at="5.5" style="margin-top:60px">Quand la <span class="ds">data science fait la structure</span>,</div>
      <div class="d3 good glow-good" data-at="7" style="padding-left:120px">→ on peut tout lire.</div></div>`,
    draw(ctx, t) { U.drawField(ctx, t, .6); },
  });

  /* illustrative log-log cost curve */
  const CX = { x: 200, y: 170, w: 1060, h: 590 };
  const lx = v => CX.x + (Math.log10(v) - 3) / 3 * CX.w;            // 1e3 .. 1e6
  const ly = v => CX.y + CX.h - (Math.log10(v) + 0.5) / 3.6 * CX.h;  // 10^-0.5 .. 10^3.1
  const A = [[1e3, 1], [1e6, 1000]];
  const B = [[1e3, .9], [3e3, 1.0], [5e3, 1.6], [3e4, 1.75], [6e4, 2.6], [3e5, 2.8], [6e5, 4.1], [1e6, 4.3]];
  const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + lx(p[0]).toFixed(1) + ' ' + ly(p[1]).toFixed(1)).join(' ');
  scene({
    id: 'curve', ch: 4, dur: 36, title: 'La courbe de coût', illus: true,
    narr: 'La courbe de coût — illustrative, en ordres de grandeur. En abscisse, la taille du corpus : mille, dix mille, cent mille, un million de documents. Si le LLM lit chaque document, la facture suit le corpus : dix fois plus de documents, dix fois plus cher. Si le LLM ne lit que les groupes, la facture reste presque plate : elle monte un peu quand le corpus devient assez gros pour un niveau de hiérarchie de plus, mais les groupes grossissent beaucoup moins vite que les documents. La facture suit les groupes, pas les documents.',
    html: `<div class="wrap">
      <svg class="abs" style="left:0;top:0" width="1920" height="1080">
        <g stroke="#1e2232" stroke-width="1.5">
          ${[1e3, 1e4, 1e5, 1e6].map(v => `<line x1="${lx(v)}" y1="${CX.y}" x2="${lx(v)}" y2="${CX.y + CX.h}"/>`).join('')}
          ${[1, 10, 100, 1000].map(v => `<line x1="${CX.x}" y1="${ly(v)}" x2="${CX.x + CX.w}" y2="${ly(v)}"/>`).join('')}
        </g>
        <line x1="${CX.x}" y1="${CX.y + CX.h}" x2="${CX.x + CX.w}" y2="${CX.y + CX.h}" stroke="#4a5063" stroke-width="2"/>
        <g font-family="JetBrains Mono, monospace" font-size="24" fill="#9aa0b2" text-anchor="middle">
          ${[['1 000', 1e3], ['10 000', 1e4], ['100 000', 1e5], ['1 000 000', 1e6]].map(([s, v]) => `<text x="${lx(v)}" y="${CX.y + CX.h + 44}">${s}</text>`).join('')}
        </g>
        <text x="${CX.x + CX.w / 2}" y="${CX.y + CX.h + 96}" font-family="Inter Tight, sans-serif" font-size="26" fill="#555b6e" text-anchor="middle">documents dans le corpus (échelle log)</text>
        <text x="${CX.x - 20}" y="${CX.y - 30}" font-family="Inter Tight, sans-serif" font-size="26" fill="#555b6e">coût (échelle log)</text>
        <path class="pa" d="${path(A)}" fill="none" stroke="#ff5d6c" stroke-width="6" stroke-linecap="round"/>
        <path class="pb" d="${path(B)}" fill="none" stroke="#6ef0b0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="ma" font-family="JetBrains Mono, monospace" font-size="22" fill="#ff5d6c">
          ${[1e4, 1e5].map(v => `<text x="${lx(v) + 16}" y="${ly(v / 1000) + 50}">×10</text>`).join('')}</g>
      </svg>
      <div class="abs t1 bad" data-at="9" style="left:${lx(1e6) - 430}px;top:${ly(1000) - 100}px;font-size:32px;text-align:right;width:420px">LLM sur chaque document</div>
      <div class="abs t1 good" data-at="17" style="left:${lx(1e6) - 430}px;top:${ly(4.3) - 70}px;font-size:32px;text-align:right;width:420px">LLM sur les groupes</div>
      <div class="abs t3" data-at="19" style="left:${lx(6e4) - 170}px;top:${ly(2.6) + 30}px;font-size:21px;width:340px;text-align:center">+1 niveau de hiérarchie</div>
      <div class="abs col gap24" style="left:1340px;top:220px;width:440px">
        <div class="k" data-at="0.4">La courbe de coût</div>
        <div class="t2" data-at="5">Le LLM lit chaque document : <b class="bad">dix fois plus de documents, dix fois plus cher.</b></div>
        <div class="t2" data-at="13">Le LLM ne lit que les groupes : <b class="good">presque plat</b>. Les groupes grossissent beaucoup moins vite que les documents.</div>
      </div>
      <div class="abs d3" data-at="25" data-fx="blur" style="left:160px;right:160px;bottom:40px;font-size:64px;text-align:center;padding:26px;background:rgba(6,7,11,.85);border-radius:24px">La facture suit <span class="good">les groupes</span>, pas <span class="bad">les documents</span>.</div>
    </div>`,
    build(el, st) {
      st.a = el.querySelector('.pa'); st.b = el.querySelector('.pb'); st.m = el.querySelector('.ma');
      st.la = st.a.getTotalLength(); st.lb = st.b.getTotalLength();
      st.a.style.strokeDasharray = st.la; st.b.style.strokeDasharray = st.lb;
    },
    update(t, el, st) {
      st.a.style.strokeDashoffset = st.la * (1 - eio(prog(t, 3, 9)));
      st.b.style.strokeDashoffset = st.lb * (1 - eio(prog(t, 11, 17)));
      st.m.style.opacity = clamp((t - 6) / .8);
    },
  });

  scene({
    id: 'giants', ch: 4, dur: 22, title: 'Réservé aux géants ?',
    narr: 'Réservé aux géants ? À l’échelle d’une entreprise ordinaire — quelques dizaines de milliers de textes — tout faire lire au LLM coûte encore peu. Ça ne durera pas : les piles grossissent. Et surtout, le vrai gain n’est pas là : c’est voir ce qu’on ne cherchait pas — les thèmes qui émergent tout seuls, que personne n’avait mis dans le formulaire.',
    html: `<div class="wrap col" style="justify-content:center">
      <div class="d2" data-at="0.4">Réservé aux géants ?</div>
      <div class="t2" data-at="3" style="margin-top:40px;max-width:1300px">Quelques dizaines de milliers de textes : tout faire lire au LLM <b>coûte encore peu</b>.</div>
      <div class="t2" data-at="6.5" style="margin-top:10px">Ça ne durera pas — <b class="cost">les piles grossissent</b>.</div>
      <div class="k" data-at="11" style="margin-top:80px">Le vrai gain</div>
      <div class="d2 good glow-good" data-at="12" data-fx="blur" style="margin-top:16px">Voir ce qu’on ne cherchait pas.</div>
      <div class="t2" data-at="15" style="margin-top:20px">Les thèmes qui émergent tout seuls — que personne n’avait mis dans le formulaire.</div></div>`,
    draw(ctx, t) { U.drawCloud(ctx, { tf: { x: 560, y: 330, s: .8 }, embed: 1, color: eo(prog(t, 11, 15)), halo: eo(prog(t, 11, 15)), alpha: .2 }); },
  });

  scene({
    id: 'nb-intro', ch: 4, dur: 16, title: 'Est-ce que je peux le faire moi aussi ?',
    src: 'github.com/mdussere/secna',
    narr: 'Est-ce que je peux le faire moi aussi ? Oui. Un notebook Jupyter de moins de deux cents lignes, dans un dépôt public : github.com/mdussere/secna. Une commande pour le lancer. Le fournisseur de modèles se règle sur une ligne de configuration.',
    html: `<div class="wrap">
      <div class="abs col gap24" style="left:160px;top:200px;width:980px">
        <div class="t1 mute" data-at="0.4">Est-ce que je peux le faire moi aussi ?</div>
        <div class="d0 good glow-good" data-at="2" data-fx="pop" style="font-size:280px">Oui.</div>
        <div class="t1" data-at="5" style="margin-top:20px">Un notebook Jupyter de <b class="good">moins de 200 lignes</b></div>
        <div class="t1" data-at="6.5"><b class="good">Une commande</b> pour le lancer</div>
        <div class="t1" data-at="8">Le fournisseur de modèles : <b class="good">une ligne</b> de configuration</div></div>
      <div class="abs center" data-at="4" data-fx="scale" style="left:1260px;top:230px;width:500px">
        <div style="background:#fff;padding:22px;border-radius:28px;box-shadow:0 0 80px rgba(110,240,176,.25)"><img src="qr.svg" width="400" height="400" alt="QR code vers github.com/mdussere/secna" style="display:block"></div>
        <div class="mono" style="font-size:30px;margin-top:30px">github.com/<b>mdussere/secna</b></div></div>
    </div>`,
  });

  scene({
    id: 'nb-corpus', ch: 4, dur: 14, title: 'Le corpus : le noyau Linux',
    narr: 'Le corpus : le noyau Linux, les six derniers mois — les commits et les pull requests fusionnées. Plusieurs dizaines de milliers de commits. La question posée : qu’est-ce qui s’est passé dans le noyau Linux ces six derniers mois ?',
    html: `<div class="wrap col" style="justify-content:center">
      <div class="k" data-at="0.3">Le corpus</div>
      <div class="d2" data-at="1" style="margin-top:20px;font-size:92px">Le noyau Linux, <span class="ds">les six derniers mois</span>.</div>
      <div class="t2" data-at="3">Les commits et les <i>pull requests</i> fusionnées — plusieurs dizaines de milliers de commits.</div>
      <div class="k" data-at="6.5" style="margin-top:90px">La question</div>
      <div class="d3" data-at="7.2" data-fx="blur" style="margin-top:16px">« Qu’est-ce qui s’est passé dans le noyau Linux ces six derniers mois ? »</div></div>`,
    draw(ctx, t) {
      // a faint git log scrolling in the background
      ctx.save();
      ctx.font = '400 20px "JetBrains Mono",monospace';
      const base = ctx.globalAlpha;
      for (let i = 0; i < 40; i++) {
        const y = ((i * 34 - t * 40) % 1360 + 1360) % 1360 - 100;
        ctx.globalAlpha = base * .08;
        ctx.fillStyle = '#9aa0b2';
        ctx.fillText(LOG[i % LOG.length], 1100, y);
      }
      ctx.restore();
    },
  });
  const LOG = ['commit a1f3…  net: fix use-after-free in tcp_ack()', 'commit 9c2e…  mm: reduce lock contention', 'commit 77b0…  rust: add abstractions', 'commit 3d91…  drm: fix null deref on resume',
    'commit e0a4…  fs: handle short reads', 'commit 1b7c…  sched: rework load balance', 'Merge tag \'net-next\'', 'commit c5d2…  arm64: dts: add board'];
})();
