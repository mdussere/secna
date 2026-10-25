/* Ouverture + Séquence 1 — L'impasse */
(() => {
  const S = window.SCENES, W = L.words;

  /* ============ 0 · Titre ============ */
  S.push({
    seq: 0, title: 'Titre', dur: 24, noChip: true,
    html: `
      <canvas class="abs" style="left:0;top:0;opacity:.55" width="1920" height="1080"></canvas>
      <div class="center" style="position:relative">
        <div data-out="12.5">
          <div class="kicker" data-at="0.4" data-fx="fade" style="margin-bottom:46px">Generative AI Bordeaux · 19 novembre 2026</div>
          <div class="mega">${W('Vos corpus grossissent.', 1.2, .2)}</div>
          <div class="mega" style="color:var(--mute)">${W('Pas votre budget de *tokens.*', 3.4, .2)}</div>
          <div data-at="6.5" data-fx="up" class="p" style="margin-top:60px">Michaël Dussère <span class="mute">— GenAI Center of Excellence, Betclic</span></div>
        </div>
      </div>
      <div class="abs center" style="inset:0;padding:0 200px">
        <div class="h1" data-at="13.4" data-fx="blur">Comprendre tout un corpus</div>
        <div class="h1 grad" data-at="15" data-fx="blur" style="margin-top:10px">sans le lire en entier.</div>
        <div class="p" data-at="19" data-fx="up" style="margin-top:56px">Une recette publiée. Peu connue. Cinq étapes.</div>
      </div>`,
    init(el, s) {
      s.c = L.canvas(el.querySelector('canvas'));
      const r = L.rng(3), N = 2600;
      s.p = Array.from({ length: N }, (_, i) => ({ x: r() * 1920, y: r() * 1080, t: 22 * Math.pow(i / N, 1 / 2.6), v: .2 + r() * .8, a: r() }));
    },
    tick(lt, s) {
      const x = L.begin(s.c);
      x.fillStyle = '#9aa1b2';
      for (const p of s.p) {
        if (lt < p.t) continue;
        const q = L.clamp((lt - p.t) / 1.2);
        x.globalAlpha = q * (.25 + .45 * p.a);
        x.fillRect(p.x + Math.sin(lt * .2 + p.a * 9) * 6, p.y - lt * p.v * 3, 2.4, 2.4);
      }
      // la ligne du budget : immobile
      x.globalAlpha = L.prog(lt, 4, 6) * .9;
      x.strokeStyle = '#ff4f6d'; x.lineWidth = 2; x.setLineDash([10, 10]);
      x.beginPath(); x.moveTo(0, 1000); x.lineTo(1920, 1000); x.stroke(); x.setLineDash([]);
      x.font = '500 18px ' + 'ui-monospace, Menlo, monospace'; x.fillStyle = '#ff4f6d';
      x.fillText('BUDGET DE TOKENS', 64, 988);
      x.globalAlpha = 1;
    },
    say: [[1, 'Vos corpus grossissent. Pas votre budget de tokens.'],
      [7, "Je suis Michaël Dussère, au GenAI Center of Excellence de Betclic."],
      [13.4, 'Pendant vingt minutes, une seule promesse : comprendre tout un corpus, sans le lire en entier.'],
      [19, 'Avec une recette publiée, peu connue, en cinq étapes.']]
  });

  /* ============ 1a · La pile ============ */
  const TYPES = [
    ['avis clients', '#ffc94d', ['Colis jamais arrivé', 'Livraison en retard de 5 jours', 'Très déçu du service client', 'Appli lente depuis la mise à jour', 'Produit conforme, rien à dire', 'On m\'a facturé deux fois', 'Emballage abîmé']],
    ['tickets de support', '#5fb2ff', ['Impossible de me connecter', 'Remboursement toujours pas reçu', 'Code promo refusé', 'Compte bloqué sans explication', 'Le lien de réinitialisation expire']],
    ['messages vendeurs & partenaires', '#4ee3a0', ['Mon stock ne se synchronise plus', 'Les commissions ont changé ?', 'Export catalogue en erreur', 'Paiement partenaire en attente']],
    ['réponses libres', '#b48cff', ['Rien à signaler, sinon le prix', 'Plus de moyens de paiement svp', 'Le design était mieux avant', 'Je ne sais pas trop']],
    ['journaux d\'applications', '#9aa1b2', ['ERROR upstream timeout 504', 'WARN retry 3/5 payment-svc', 'ERROR null ref in OrderMapper', 'WARN slow query 2.3s']],
    ['traces d\'agents', '#ff7a4d', ['agent → search_orders() : 0 résultat', 'agent → tool_call refund_status', 'agent : « je n\'ai pas trouvé »', 'agent → retry plan step 4']]
  ];
  S.push({
    seq: 1, title: 'La pile', dur: 34,
    html: `
      <canvas class="abs" style="left:0;top:0" width="1920" height="1080"></canvas>
      <div class="abs" style="inset:0;background:linear-gradient(90deg,rgba(6,7,11,.94) 0%,rgba(6,7,11,.8) 46%,rgba(6,7,11,.1) 80%)"></div>
      <div class="abs" data-at="18.2" data-fx="fade" style="inset:0;background:rgba(6,7,11,.86)"></div>
      <div class="abs col" style="left:150px;top:200px;width:980px;gap:30px" data-out="18">
        <div class="h2">${W('Toutes les entreprises accumulent du *texte.*', 1.2, .14)}</div>
        <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px">
          ${TYPES.map(([n, c], i) => `<span class="pill" data-at="${4 + i * .9}" data-fx="up" style="border-color:${c}66"><i style="width:12px;height:12px;border-radius:50%;background:${c}"></i>${n}</span>`).join('')}
        </div>
        <div class="h3" data-at="11.5" data-fx="up" style="margin-top:40px">Il arrive <span class="hl">en continu.</span></div>
      </div>
      <div class="abs center" style="inset:0">
        <div class="h1" data-at="18.8" data-fx="blur">Personne ne le lit en entier.</div>
        <div class="row" style="margin-top:70px;gap:70px">
          <div class="h3 mute" data-at="24" data-fx="up">On survole.</div>
          <div class="h3 mute" data-at="25.6" data-fx="up">On prend un échantillon.</div>
          <div class="h3 mute" data-at="27.2" data-fx="up">On range à la main.</div>
        </div>
      </div>`,
    init(el, s) {
      s.c = L.canvas(el.querySelector('canvas'));
      const r = L.rng(11), N = 320, COLS = 7, levels = new Array(COLS).fill(0);
      s.f = [];
      for (let i = 0; i < N; i++) {
        const ty = TYPES[Math.floor(r() * TYPES.length)], txt = ty[2][Math.floor(r() * ty[2].length)];
        const col = Math.floor(r() * COLS);
        s.f.push({ t: .5 + 30 * Math.sqrt(i / N), col, lvl: levels[col]++, txt, color: ty[1], w: 0 });
      }
    },
    tick(lt, s) {
      const x = L.begin(s.c);
      x.font = '500 17px ui-monospace, Menlo, monospace'; x.textBaseline = 'middle';
      for (const f of s.f) {
        if (lt < f.t) continue;
        if (!f.w) f.w = Math.min(244, x.measureText(f.txt).width + 26);
        const land = 1040 - f.lvl * 31, X = 40 + f.col * 266;
        const y = Math.min(land, -30 + 0.5 * 2600 * (lt - f.t) ** 2);
        x.globalAlpha = y >= land ? .7 : .95;
        L.rrect(x, X, y - 13, f.w, 26, 7);
        x.fillStyle = f.color + '22'; x.fill(); x.strokeStyle = f.color + '88'; x.lineWidth = 1; x.stroke();
        x.save(); x.beginPath(); x.rect(X, y - 13, f.w - 8, 26); x.clip();
        x.fillStyle = f.color; x.fillText(f.txt, X + 12, y + 1); x.restore();
      }
      x.globalAlpha = 1;
    },
    say: [[1, "Toutes les entreprises accumulent du texte : avis clients, tickets de support, messages de vendeurs ou de partenaires…"],
      [7.5, "… réponses libres aux questionnaires, journaux d'applications, traces d'agents."],
      [11.5, 'Et ce texte arrive en continu.'],
      [18.8, 'Personne ne le lit en entier.'],
      [24, 'On survole. On prend un échantillon. On range à la main…']]
  });

  /* ============ 1b · « Autre » ============ */
  const CATS = [['Livraison', 14], ['Paiement', 9], ['Compte', 8], ['Produit', 11], ['Service client', 8], ['Autre', 50]];
  S.push({
    seq: 1, title: '« Autre »', dur: 18,
    html: `
      <div class="col" style="gap:40px;margin-top:20px">
        <div class="h3" data-at="0.4" data-fx="up">…dans des catégories décidées <span class="mute">il y a longtemps.</span></div>
        <div class="col" style="gap:18px;margin-top:20px">
          ${CATS.map(([n, v], i) => {
            const last = n === 'Autre';
            return `<div style="display:grid;grid-template-columns:300px 1fr;align-items:center;gap:30px" data-at="${1.6 + i * .5}" data-fx="left">
              <div class="h4 ${last ? 'warn' : 'mute'}" style="text-align:right">${n}</div>
              <div style="height:${last ? 74 : 54}px;display:flex;align-items:center;gap:20px">
                <div class="growx" data-at="${last ? 7.5 : 2.2 + i * .5}" style="--w:${v * 22}px;--d:${last ? '3s' : '1.4s'};height:100%;border-radius:10px;background:${last ? 'var(--warn)' : 'rgba(255,255,255,.22)'}"></div>
                <span class="h4 ${last ? 'warn' : 'mute'}" data-at="${last ? 10 : 3 + i * .5}" data-fx="fade">${v} %</span>
              </div></div>`;
          }).join('')}
        </div>
        <div class="row" style="align-items:center;justify-content:space-between">
          <div class="h3" data-at="11" data-fx="up">…et une bonne partie finit dans <span class="warn">« Autre ».</span></div>
          <span class="badge" data-at="3" data-fx="fade">illustratif</span>
        </div>
      </div>`,
    say: [[0.4, 'On range à la main, dans des catégories décidées il y a longtemps…'],
      [9, '… et une bonne partie finit dans « Autre ».']]
  });

  /* ============ 1c · Demandons à un LLM ============ */
  S.push({
    seq: 1, title: 'Demandons à un LLM', dur: 26,
    html: `
      <div class="col" style="gap:46px;margin-top:10px">
        <div class="row" style="align-items:flex-start;gap:28px" data-at="0.3" data-fx="up" data-out="12.5">
          <div style="width:74px;height:74px;border-radius:50%;background:#262b38;display:flex;align-items:center;justify-content:center;font-size:34px">🙂</div>
          <div class="card" style="border-radius:8px 28px 28px 28px;padding:28px 36px">
            <div class="h4" data-type="2.4" data-tat="0.8">Résume-moi ce que disent nos clients.</div>
            <div class="pill mono" data-at="3.6" data-fx="up" style="margin-top:22px;font-size:24px">📎 avis_clients.csv — 1 000 000 lignes</div>
          </div>
        </div>
        <div class="row" style="align-items:baseline;gap:34px;flex-wrap:wrap" data-at="6" data-fx="up" data-out="12.5">
          <span class="h2">1&nbsp;000&nbsp;000 <span class="h4 mute">avis</span></span>
          <span class="h2 mute">×</span>
          <span class="h2">≈&nbsp;100 <span class="h4 mute">tokens</span></span>
          <span class="h2 mute">=</span>
        </div>
        <div data-at="7.2" data-fx="zoom" data-out="12.5"><span class="mega hl" data-count="100000000" data-cat="7.4" data-cdur="3.2">0</span> <span class="h3 mute">tokens</span></div>
      </div>
      <div class="abs center" style="inset:0;padding:0 150px">
        <div class="kicker" data-at="13" data-fx="fade" data-out="19.5">un token</div>
        <div class="row" style="gap:10px;margin:34px 0" data-out="19.5">
          ${['Col', 'is', ' jamais', ' arr', 'ivé'].map((t, i) => `<span class="mono h3" data-at="${13.5 + i * .35}" data-fx="pop" style="padding:10px 18px;border-radius:12px;background:${L.PAL[i]}22;border:2px solid ${L.PAL[i]};white-space:pre">${t}</span>`).join('')}
        </div>
        <div class="h3" data-at="15.5" data-fx="up" data-out="19.5">≈ un morceau de mot <span class="mute">— l'unité de ce qu'on paie.</span></div>
        <div class="h1" data-at="20.3" data-fx="blur" style="position:absolute">Un corpus ne tient pas<br>dans un LLM.</div>
      </div>`,
    say: [[0.3, "Le réflexe, aujourd'hui : « demandons à un LLM »."],
      [6, "Faisons le calcul : un million d'avis, d'environ cent tokens chacun… cent millions de tokens."],
      [13.2, "Un token, c'est à peu près un morceau de mot. C'est l'unité de ce qu'on paie."],
      [20.3, 'Et un corpus, ça ne tient pas dans un LLM.']]
  });

  /* ============ 1d · L'échelle ============ */
  S.push({
    seq: 1, title: "L'échelle", dur: 32,
    html: `
      <div class="abs col" style="left:150px;top:200px;width:700px;gap:30px">
        <div class="h3" data-at="0.5" data-fx="up">Les fenêtres de contexte grandissent.</div>
        <div class="p" data-at="2" data-fx="up"><span class="mono hl">2023</span> · quelques milliers de tokens</div>
        <div class="p" data-at="6" data-fx="up"><span class="mono hl">2025–2026</span> · ≈ un million de tokens <span class="mute">(les plus grands modèles)</span></div>
        <div class="h3" data-at="13" data-fx="up" style="margin-top:30px">Votre corpus : <span class="warn">100 millions.</span></div>
        <div class="p" data-at="20" data-fx="up">= <b>100 fenêtres de contexte</b> pleines, pour un seul corpus.</div>
        <div class="h4 mute" data-at="24.5" data-fx="up">Plusieurs ordres de grandeur au-dessus.</div>
      </div>
      <!-- carrés à l'échelle : aire ∝ tokens -->
      <div class="abs" style="left:900px;top:80px;width:900px;height:900px">
        <div class="abs" data-at="13" data-fx="grow0" style="left:0;top:0;width:900px;height:900px;transform-origin:0 100%;--d:3.2s;border:2px solid var(--warn);background:rgba(255,79,109,.10);border-radius:6px"></div>
        <div class="abs" data-at="20" data-fx="fade" style="left:0;top:0;width:900px;height:900px;--d:2s;background-image:linear-gradient(rgba(255,79,109,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(255,79,109,.35) 1px,transparent 1px);background-size:90px 90px"></div>
        <div class="abs mono" data-at="15" data-fx="fade" style="left:30px;top:26px;font-size:26px;color:var(--warn)">votre corpus · 100 M tokens</div>
        <div class="abs" data-at="6" data-fx="pop" style="left:0;top:810px;width:90px;height:90px;background:var(--cN);border-radius:4px;box-shadow:0 0 40px rgba(95,178,255,.6)"></div>
        <div class="abs mono" data-at="6.5" data-fx="left" style="left:108px;top:830px;font-size:22px;color:var(--cN);white-space:nowrap" data-out="13">← 1 M tokens</div>
        <div class="abs" data-at="2" data-fx="pop" style="left:0;top:893px;width:7px;height:7px;background:var(--cE)"></div>
        <div class="abs mono" data-at="2.5" data-fx="left" style="left:24px;top:874px;font-size:20px;color:var(--cE);white-space:nowrap" data-out="6">← quelques milliers</div>
      </div>
      <div class="src">aire des carrés proportionnelle au nombre de tokens · ordres de grandeur</div>`,
    say: [[0.5, "Bien sûr, les fenêtres de contexte grandissent : quelques milliers de tokens en 2023…"],
      [6, "… environ un million en 2025–2026, pour les plus grands modèles."],
      [13, "Mais votre corpus, lui, c'est cent millions de tokens."],
      [20, "Cent fenêtres de contexte pleines, pour un seul corpus. Le corpus reste plusieurs ordres de grandeur au-dessus."]]
  });

  /* ============ 1e · La course ============ */
  const node = (x, y, at, title, sub, c) => `<div class="abs" style="left:${x}px;top:${y}px;width:400px;margin-left:-200px;text-align:center" data-at="${at}" data-fx="pop">
      <div class="card" style="padding:24px 26px;border-color:${c}88;background:${c}14"><div class="h4" style="font-size:34px">${title}</div>${sub ? `<div class="small" style="margin-top:8px">${sub}</div>` : ''}</div></div>`;
  S.push({
    seq: 1, title: 'La course', dur: 24,
    html: `
      <svg class="abs" style="left:0;top:0" width="1920" height="1080">
        <defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#ff4f6d"/></marker></defs>
        <g data-at="1" data-fx="fade" style="animation:spin 14s linear infinite">
          <circle cx="600" cy="580" r="300" fill="none" stroke="rgba(255,79,109,.55)" stroke-width="3" stroke-dasharray="18 22"/>
        </g>
        <path d="M750 320 A300 300 0 0 1 900 580" fill="none" stroke="#ff4f6d" stroke-width="4" marker-end="url(#ar)" data-at="4" data-fx="fade"/>
        <path d="M750 840 A300 300 0 0 1 450 840" fill="none" stroke="#ff4f6d" stroke-width="4" marker-end="url(#ar)" data-at="8" data-fx="fade"/>
        <path d="M300 580 A300 300 0 0 1 450 320" fill="none" stroke="#ff4f6d" stroke-width="4" marker-end="url(#ar)" data-at="11" data-fx="fade"/>
      </svg>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      ${node(600, 240, 1, 'LLM plus puissants', '', '#5fb2ff')}
      ${node(860, 670, 4.5, 'Plus de texte produit', 'résumés · réponses · logs · traces d\'agents', '#ffc94d')}
      ${node(340, 670, 8.5, 'Il faudrait de plus gros LLM', 'pour traiter tout ce texte', '#ff7a4d')}
      <div class="abs col" style="left:1180px;top:330px;width:620px;gap:40px">
        <div class="h3" data-at="14" data-fx="up">Ce n'est pas une course qu'on finira par gagner.</div>
        <div class="h1 warn" data-at="18" data-fx="blur" style="font-size:96px">Ce n'est pas la même échelle.</div>
      </div>`,
    say: [[0.5, "Et ça ne s'arrangera pas tout seul. Plus les LLM sont puissants, plus on produit de texte avec eux…"],
      [5, "… résumés, réponses, logs, traces d'agents. Et plus on produit de texte, plus il faudrait de gros LLM pour le traiter."],
      [14, "Ce n'est pas une course qu'on finira par gagner."],
      [18, "Ce n'est pas la même échelle."]]
  });

  /* ============ 1f · Trois impasses ============ */
  const r = L.rng(5);
  const sampled = new Set(); while (sampled.size < 12) sampled.add(Math.floor(r() * 112));
  let weak = 77; while (sampled.has(weak)) weak++;
  const docs = n => Array.from({ length: n }, (_, i) => {
    const inn = (i % 12) < 6 && Math.floor(i / 12) < 4;
    return `<i style="display:block;width:30px;height:38px;border-radius:5px;background:${inn ? 'rgba(95,178,255,.35)' : 'rgba(255,79,109,.16)'};border:1px solid ${inn ? '#5fb2ff' : 'rgba(255,79,109,.45)'}"></i>`;
  }).join('');
  S.push({
    seq: 1, title: 'Trois impasses', dur: 46,
    html: `
      <div class="h3" data-at="0.3" data-fx="up" style="margin-top:-10px">Trois façons naïves d'appliquer un LLM à un gros corpus.</div>
      <div class="row" style="margin-top:60px;gap:36px;align-items:stretch">
        <div class="card grow1" data-at="2.5" data-fx="up" style="position:relative;height:690px">
          <div class="kicker">impasse 1</div>
          <div class="h4" style="margin:14px 0 30px">Tout donner à un très gros modèle</div>
          <div style="position:relative;height:250px">
            <div style="position:absolute;left:0;top:0;width:230px;height:200px;border:2px dashed var(--cN);border-radius:14px"></div>
            <div class="mono" style="position:absolute;left:10px;top:208px;font-size:18px;color:var(--cN)">fenêtre de contexte</div>
            <div style="position:absolute;left:8px;top:8px;width:460px;display:grid;grid-template-columns:repeat(12,30px);gap:8px">${docs(60)}</div>
          </div>
          <div class="p" data-at="6" data-fx="up">Ça ne tient pas.</div>
          <div class="p mute" data-at="9" data-fx="up">Et ce qui rentre est <span style="filter:blur(2.5px)">dilué</span>.</div>
          <div class="cross" data-at="12.5" data-fx="pop">✕</div>
        </div>
        <div class="card grow1" data-at="15" data-fx="up" style="position:relative;height:690px">
          <div class="kicker">impasse 2</div>
          <div class="h4" style="margin:14px 0 30px">Travailler sur un échantillon</div>
          <div style="display:grid;grid-template-columns:repeat(14,1fr);gap:11px;width:440px;height:250px">
            ${Array.from({ length: 112 }, (_, i) => {
              if (sampled.has(i)) return `<i class="dotc" data-at="${17.5 + (i % 7) * .15}" data-fx="state" style="width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.14)"></i>`;
              if (i === weak) return `<i style="position:relative;width:20px;height:20px"><b style="position:absolute;inset:0;border-radius:50%;background:rgba(255,255,255,.14)"></b><b data-at="20.5" data-out="26.5" data-fx="pop" style="position:absolute;inset:0;border-radius:50%;background:var(--warn);box-shadow:0 0 18px var(--warn)"></b></i>`;
              return `<i style="width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.14)"></i>`;
            }).join('')}
          </div>
          <div class="p" data-at="22" data-fx="up">Malin… mais ce qui n'est pas tiré au sort <b>n'existe pas</b>.</div>
          <div class="p mute" data-at="25" data-fx="up">Les signaux faibles disparaissent.</div>
          <div class="cross" data-at="28" data-fx="pop">✕</div>
        </div>
        <div class="card grow1" data-at="30" data-fx="up" style="position:relative;height:690px;overflow:hidden">
          <div class="kicker">impasse 3</div>
          <div class="h4" style="margin:14px 0 30px">Un petit modèle par document</div>
          <div style="position:relative;height:250px">
            ${Array.from({ length: 46 }, (_, i) => `<div data-at="${31 + i * .08}" data-fx="pop" style="position:absolute;left:${(r() * 380) | 0}px;top:${(r() * 190) | 0}px;width:96px;height:56px;border-radius:8px;background:#1b2130;border:1px solid rgba(255,255,255,.18);transform:rotate(${(r() * 30 - 15) | 0}deg);padding:8px"><i style="display:block;height:5px;width:70%;background:#4b5161;margin:4px 0;border-radius:3px"></i><i style="display:block;height:5px;width:90%;background:#4b5161;margin:4px 0;border-radius:3px"></i><i style="display:block;height:5px;width:50%;background:#4b5161;border-radius:3px"></i></div>`).join('')}
          </div>
          <div class="p" data-at="34" data-fx="up"><span class="hl" data-count="100000" data-cat="33" data-cdur="4">0</span> résumés, chacun dans ses mots.</div>
          <div class="p mute" data-at="38" data-fx="up">Et toujours aucune vue d'ensemble.</div>
          <div class="cross" data-at="42" data-fx="pop">✕</div>
        </div>
      </div>
      <style>.dotc.on{background:var(--cN) !important;box-shadow:0 0 14px var(--cN)}</style>`,
    say: [[0.3, "Il y a trois façons naïves d'appliquer un LLM à un gros corpus. Chacune échoue à sa manière."],
      [3, 'Un : tout donner à un très gros modèle. Ça ne tient pas dans le contexte — et ce qui rentre est dilué.'],
      [15, "Deux : le faire travailler sur un échantillon. C'est ce que font beaucoup d'outils et d'agents : quelques lignes de code tirent quelques centaines de documents, qui tiennent dans le contexte."],
      [22, "C'est malin. Mais ce qui n'est pas tiré au sort n'existe pas : les signaux faibles disparaissent."],
      [30, 'Trois : un petit modèle par document. Chaque document est traité…'],
      [35, "… mais à la fin, on a cent mille résumés, chacun dans ses mots. Et toujours aucune vue d'ensemble."]]
  });

  /* ============ 1g · La vraie question ============ */
  S.push({
    seq: 1, title: 'La vraie question', dur: 20,
    html: `
      <div class="center" style="gap:70px">
        <div class="h3 mute" data-at="0.4" data-fx="up" data-out="8"><span class="strike" data-at="4.6" data-fx="state">« Que ferais-je avec des tokens illimités ? »</span></div>
        <div class="h1" style="max-width:1500px;position:absolute">${W('Comment traiter des corpus qui *grossissent,* avec le *budget* que j\'ai ?', 8.3, .16, 'up')}</div>
      </div>`,
    say: [[0.4, "La vraie question n'est donc pas : « que ferais-je avec des tokens illimités ? »"],
      [8.3, "C'est : « comment traiter des corpus qui grossissent, avec le budget que j'ai ? »"]]
  });
})();
