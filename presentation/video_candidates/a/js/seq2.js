/* Séquence 2 — Clio */
(() => {
  const S = window.SCENES, W = L.words;
  const SRC = 'Tamkin et al., « Clio: Privacy-Preserving Insights into Real-World AI Use », Anthropic, déc. 2024 · arXiv:2412.13678';

  /* ============ 2a · Décembre 2024 ============ */
  S.push({
    seq: 2, title: 'Décembre 2024', dur: 24,
    html: `
      <div class="abs col" style="left:150px;top:220px;gap:34px;width:1500px" data-out="13.4">
        <div class="mono hl" data-at="0.4" data-fx="left" style="font-size:120px;font-weight:700;letter-spacing:-.04em;--hl:var(--cS)">Décembre 2024.</div>
        <div class="h2" data-at="3" data-fx="up">Anthropic <span class="h4 mute">— l'un des quelques laboratoires qui construisent des modèles de pointe.</span></div>
        <div class="h3 mute" data-at="7" data-fx="up">Claude, utilisé par des millions de personnes.</div>
        <div class="h3" data-at="10.5" data-fx="up">Publie un article sur un outil interne :</div>
      </div>
      <div class="abs center" style="inset:0">
        <div data-at="14" data-fx="big" style="--d:1.6s;font-size:360px;font-weight:900;letter-spacing:-.07em;line-height:.9;color:var(--cS);text-shadow:0 0 120px rgba(255,122,77,.45)">Clio</div>
        <div class="p mono" data-at="16.5" data-fx="up" style="margin-top:30px;font-size:30px">Privacy-Preserving Insights into Real-World AI Use</div>
      </div>
      <div class="src" data-at="16.5" data-fx="fade">${SRC}</div>`,
    say: [[0.4, 'Décembre 2024.'],
      [3, "Anthropic — l'un des quelques laboratoires qui construisent des modèles de pointe ; Claude, utilisé par des millions de personnes…"],
      [10.5, '… publie un article sur un outil interne :'],
      [14, 'Clio.']]
  });

  /* ============ 2b · Des millions de conversations ============ */
  S.push({
    seq: 2, title: 'Des millions de conversations', dur: 34,
    html: `
      <canvas class="abs" style="left:0;top:0" width="1920" height="1080"></canvas>
      <div class="abs" style="inset:0;background:linear-gradient(90deg,rgba(6,7,11,.95),rgba(6,7,11,.75) 50%,rgba(6,7,11,.2))"></div>
      <div class="abs col" style="left:150px;top:200px;width:1000px;gap:30px" data-out="24.5">
        <div class="h2">${W('Des *millions* de conversations.', 1, .15)}</div>
        <div class="p" data-at="3.5" data-fx="up">Entre Claude et ses utilisateurs. Des objets complexes :</div>
        <div class="row" style="gap:16px">
          <span class="pill" data-at="6" data-fx="pop">longues</span>
          <span class="pill" data-at="6.6" data-fx="pop">désordonnées</span>
          <span class="pill" data-at="7.2" data-fx="pop">sur plusieurs sujets à la fois</span>
        </div>
        <div class="h3" data-at="12" data-fx="up" style="margin-top:40px">Trop nombreuses pour être lues.</div>
        <div class="h3 warn" data-at="17" data-fx="up">Et elles ne <u>doivent pas</u> être lues.</div>
        <div class="p mute" data-at="19" data-fx="up">Ce sont des conversations privées.</div>
      </div>
      <div class="abs" data-at="17.6" data-out="24.5" data-fx="pop" style="left:1380px;top:380px">
        <svg width="220" height="260" viewBox="0 0 220 260"><rect x="20" y="110" width="180" height="140" rx="26" fill="#ff4f6d"/><path d="M55 110V75a55 55 0 0 1 110 0v35" fill="none" stroke="#ff4f6d" stroke-width="22"/><circle cx="110" cy="170" r="18" fill="#06070b"/><rect x="103" y="175" width="14" height="40" rx="6" fill="#06070b"/></svg>
      </div>
      <div class="abs center" style="inset:0">
        <div class="h3 mute" data-at="25" data-fx="up">Pourtant, l'entreprise doit comprendre :</div>
        <div class="row" style="gap:60px;margin-top:50px">
          <div class="h3" data-at="26.5" data-fx="up">à quoi sert son modèle,</div>
          <div class="h3 ok" data-at="28" data-fx="up">ce qui marche,</div>
          <div class="h3 warn" data-at="29.5" data-fx="up">ce qui pose problème.</div>
        </div>
      </div>`,
    init(el, s) {
      s.c = L.canvas(el.querySelector('canvas'));
      const r = L.rng(21); s.g = [];
      for (let row = 0; row < 40; row++) for (let col = 0; col < 34; col++) {
        const right = r() < .5;
        s.g.push({ x: 40 + col * 56 + (right ? 14 : 0), y: 20 + row * 26, w: 18 + r() * 24, t: r() * 10 + (col < 16 ? 0 : 0), c: right ? '#5fb2ff' : '#ff7a4d' });
      }
    },
    tick(lt, s) {
      s.c.cv.style.filter = `blur(${(L.prog(lt, 17.5, 20) * 7).toFixed(2)}px)`;
      s.c.cv.style.opacity = 1 - L.prog(lt, 23.5, 25.5) * .75;
      const x = L.begin(s.c);
      for (const g of s.g) {
        const q = L.clamp((lt - g.t) / .6); if (q <= 0) continue;
        x.globalAlpha = q * .55; x.fillStyle = g.c;
        L.rrect(x, g.x, g.y, g.w, 14, 6); x.fill();
      }
      x.globalAlpha = 1;
    },
    say: [[1, "Leur problème, c'est le cas réel de l'impossibilité technique : des millions de conversations entre Claude et ses utilisateurs."],
      [6, 'Des objets complexes — longs, désordonnés, souvent sur plusieurs sujets à la fois.'],
      [12, 'Trop nombreuses pour être lues.'],
      [17, 'Et surtout, elles ne doivent pas être lues : ce sont des conversations privées.'],
      [25, "Pourtant, l'entreprise doit comprendre à quoi sert son modèle, ce qui marche, ce qui pose problème."]]
  });

  /* ============ 2c · Le pont ============ */
  const dots = (() => {
    const r = L.rng(4); const C = [[70, 70, '#4ee3a0'], [190, 90, '#5fb2ff'], [120, 180, '#ffc94d']];
    let o = '';
    C.forEach(([cx, cy, c]) => {
      o += `<circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="${c}" stroke-dasharray="5 6" opacity=".7"/>`;
      for (let i = 0; i < 14; i++) o += `<circle cx="${cx + L.gauss(r) * 18}" cy="${cy + L.gauss(r) * 16}" r="5" fill="${c}"/>`;
    });
    return `<svg width="260" height="250" viewBox="0 0 260 250">${o}</svg>`;
  })();
  S.push({
    seq: 2, title: 'Le pont', dur: 34,
    html: `
      <div data-out="18.5">
        <div class="h3" data-at="0.4" data-fx="up">Ce que propose Clio : <span class="hl">faire le lien.</span></div>
        <div class="row" style="margin-top:70px;align-items:center;gap:0">
          <div class="card" data-at="2.8" data-fx="left" style="width:720px;display:flex;gap:30px;align-items:center;border-color:rgba(78,227,160,.4)">
            ${dots}
            <div><div class="h3 cC">Data science</div><div class="p">trouve la <b>structure</b></div>
            <div class="small" data-at="11.5" data-fx="up" style="margin-top:14px">quels textes se ressemblent,<br>quels groupes se forment</div></div>
          </div>
          <svg width="180" height="40" style="flex:none"><path d="M10 20H170" stroke="#f3f1ea" stroke-width="4" pathLength="1" data-at="5.5" data-fx="draw" style="--d:1.6s"/></svg>
          <div class="card" data-at="7" data-fx="right" style="width:720px;display:flex;gap:30px;align-items:center;border-color:rgba(95,178,255,.4)">
            <div class="col" style="gap:12px;flex:none">
              <span class="pill" style="font-size:22px;border-color:#4ee3a0">Livraison en retard</span>
              <span class="pill" style="font-size:22px;border-color:#5fb2ff">Connexion impossible</span>
              <span class="pill" style="font-size:22px;border-color:#ffc94d">Prix trop élevés</span>
            </div>
            <div><div class="h3 cN">LLM</div><div class="p">donne du <b>sens</b></div>
            <div class="small" data-at="14" data-fx="up" style="margin-top:14px">il nomme et décrit<br>les groupes</div></div>
          </div>
        </div>
      </div>
      <div class="abs center" style="inset:0;padding:0 200px">
        <div class="h2" data-at="19" data-fx="blur" style="font-style:italic;font-weight:600;line-height:1.15">« without the need for human reviewers to read raw conversations »</div>
        <div class="p" data-at="23.5" data-fx="up" style="margin-top:50px">— sans que des relecteurs humains aient besoin de lire les conversations brutes.</div>
      </div>
      <div class="src" data-at="19" data-fx="fade">${SRC}</div>`,
    say: [[0.4, 'Ce que propose Clio, c\'est de faire le lien entre deux mondes.'],
      [2.8, 'La data science trouve la structure du corpus : quels textes se ressemblent, quels groupes se forment.'],
      [8, 'Le LLM donne du sens à cette structure : il nomme et décrit les groupes.'],
      [19, "L'objectif, dans les mots de l'article : « without the need for human reviewers to read raw conversations »…"],
      [24, '… sans que des relecteurs humains aient besoin de lire les conversations brutes.']]
  });

  /* ============ 2d · La facture ============ */
  S.push({
    seq: 2, title: 'La facture publiée', dur: 28,
    html: `
      <div class="center" data-out="14">
        <div class="kicker" data-at="0.4" data-fx="fade">la facture publiée</div>
        <div class="h3" data-at="1.2" data-fx="up" style="margin-top:30px">un passage complet sur <span class="hl">100&nbsp;000 conversations</span></div>
        <div data-at="3.6" data-fx="zoom" style="margin-top:20px"><span data-count="48.81" data-dec="2" data-suf="&nbsp;$" data-cat="3.8" data-cdur="3" style="font-size:300px;font-weight:900;letter-spacing:-.06em">0</span></div>
        <div class="h3 mute" data-at="8.5" data-fx="up">≈ 500 $ pour un million.</div>
      </div>
      <div class="abs center" style="inset:0">
        <div class="kicker" data-at="15" data-fx="fade">la promesse</div>
        <div class="h1" data-at="16.4" data-fx="blur" style="margin-top:40px">Comprendre tout un corpus</div>
        <div class="h1 grad" data-at="18.2" data-fx="blur">sans le lire en entier.</div>
      </div>
      <div class="src" data-at="2" data-fx="fade" data-out="14">${SRC} · table 3</div>`,
    say: [[0.4, 'Et ils publient la facture.'],
      [1.5, 'Un passage complet sur cent mille conversations coûte… quarante-huit dollars quatre-vingt-un.'],
      [8.5, 'À peu près cinq cents dollars pour un million.'],
      [15, 'La promesse, résumée : comprendre tout un corpus, sans le lire en entier.']]
  });
})();
