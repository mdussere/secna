/* SECNA talk — Part 2: a pseudo-Jupyter notebook.
 * It looks like JupyterLab and runs nothing. The code of every cell comes from nb_cells.js, built by
 * tools/build_cells.py from nb_display.py: a simplified copy of the repository's notebook, for the screen.
 * The notebook is shown as already executed; the outputs are those of the LangChain run of 25 October 2026.
 * The talk's clock drives a static vertical view: each click scrolls to the next block (no zoom) and a
 * call-out appears on the right. The QR code to the repository stays in the top right. While the talk is
 * stopped, the wheel scrolls by hand.
 */
(function () {
'use strict';
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, p) => a + (b - a) * p;
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const eo = p => 1 - Math.pow(1 - p, 3);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SRC = {}; (window.SECNA_CELLS || []).forEach(c => { SRC[c.id] = c.src; });

/* ---------- the run's outputs (25 October 2026) ---------- */
const N_NAMES = ['Automated Dependency Refreshes Across LangChain Repositories and Plugin Tooling',
  'Expanding LangChain documentation with third-party integration listings and provider pages',
  'Bot-Generated DeepAgents Package Releases and Changelog Updates',
  'Ongoing LangChain Documentation Maintenance and Content Updates',
  'Automated Changesets Version-Bump Pull Requests for LangChain JavaScript Packages',
  'Extending LangSmith Gateway, Tracing, and Infrastructure Across the LangChain Ecosystem',
  'Keeping LangChain model catalogs, profiles, and request controls current with provider releases',
  'Faster, More Reliable Agent Threads and Runtimes Across LangChain Projects',
  'Expanding model-provider integrations, gateway routing, and compatibility across LangChain products',
  'Polishing DeepAgents’ dcode terminal experience and fixing related SDK and workflow defects'];
const N_OUT = N_NAMES.map((n, k) => `${(k + 1) * 10}/100 · ${n}`).join('\n');
const A_OUT = `theme
A  Agent Products and Workflow Reliability          4397
C  Automated Dependency and Security Maintenance    2894
B  LangChain and LangGraph Runtime Correctness      2762
D  Documentation and Integration Discoverability    1725
E  LangSmith SDKs, Tracing, and Developer Tools     1262
G  Cloud Deployment and Release Engineering         1048
F  Model Providers and Integration Support           859
Name: count, dtype: int64`;

/* ---------- the cells, in order (all executed) ---------- */
const STAGE = [
  { id: 'title', md: '# SECNA · three months of LangChain\nSummarise · Embed · Cluster · Name · Aggregate, on every pull request of the langchain-ai organisation on GitHub, 23 July – 23 October 2026. A simplified copy of the repository’s notebook, with the outputs of its run of 25 October 2026.' },
  { id: 'imports' },
  { id: 'config' },
  { id: 'extract', fold: { from: 'QUERY = ', to: 'print(f"{len(df)', note: 'lines folded: GitHub’s public API, page by page' },
    out: [{ t: 'text', s: '14,947 pull requests · 137 repositories · 1,607 authors' }] },
  { id: 's' },
  { id: 'e', out: [{ t: 'stderr', s: 'Batches: 100%|██████████| 468/468 [11:01<00:00,  1.41s/it]' }, { t: 'text', s: '14,947 vectors of 768 dimensions' }] },
  { id: 'c', out: [{ t: 'text', s: '100 clusters · sizes 22 to 310' }] },
  { id: 'n', out: [{ t: 'text', s: N_OUT }] },
  { id: 'a', out: [{ t: 'text', s: A_OUT }] },
  { id: 'graph', fold: { from: 'import matplotlib', to: null, note: 'lines folded: matplotlib' }, out: [{ t: 'img', src: 'img/themes_langchain.png' }] },
];

/* the call-outs on the right: a title, a line or two, a fact */
const NOTES = {
  config: { h: 'Configuration', p: 'Change <code>REPOS</code> to run it on your own code: any public GitHub repository or organisation.' },
  extract: { h: 'The corpus', p: 'Fetched from GitHub’s public API.', f: '14,947 pull requests · 3 months' },
  s: { k: 'S', h: 'Summarise', p: 'No LLM: the title, the repository, the labels and the description, in one short text.', f: 'cost: nothing' },
  e: { k: 'E', h: 'Embed', p: 'A small open model, on the laptop’s CPU. No API key.', f: '11 minutes · no bill' },
  c: { k: 'C', h: 'Cluster', p: 'One line: k-means, a classic algorithm.', f: '100 clusters · 22 to 310 each' },
  n: { k: 'N', h: 'Name', llm: 1, p: 'The first LLM call: one per cluster, a short prompt and its 10 most typical pull requests.', f: '100 calls' },
  a: { k: 'A', h: 'Aggregate', llm: 1, p: 'One single call: the 100 names, gathered into 7 themes.', f: '1 call' },
};

/* the plan: what each sequence does to the notebook, at cues of its steps ("c2", "c2+0.5") */
const PLAN = {
  nb0: [['c1', 'qr'], ['c2', 'sweep', null, 6]],
  nb1: [['c0', 'go', 'config', { top: 'imports', hl: ['REPOS = '], note: 'config' }],
    ['c1', 'go', 'extract', { note: 'extract' }],
    ['c2', 'go', 's', { hl: ['df["text"] = ', '+ "\\nlabels: "'], note: 's' }],
    ['c3', 'go', 'e', { hl: ['model = SentenceTransformer'], note: 'e' }],
    ['c4', 'go', 'c', { hl: ['kmeans = KMeans'], note: 'c' }],
    ['c5', 'go', 'n', { hl: ['llm.responses.create', 'names[c] = ask'], note: 'n' }],
    ['c6', 'go', 'a', { hl: ['answer = ask'], note: 'a' }]],
  nb2: [['c0', 'go', 'graph', { anchor: 'end' }], ['c1', 'bill']],
  nb12: [['c0', 'overview']],
};

/* ---------- a small Python highlighter (JupyterLab's light colours) ---------- */
const KW = new Set('def for in if else elif return import from as lambda not and or is with while try except class pass yield break continue raise global assert'.split(' '));
const CONST = new Set(['True', 'False', 'None']);
const BI = new Set('print len range list int str set zip enumerate sorted dict float sum min max open any all next bool round'.split(' '));
function highlight(src) {
  const re = /((?:[rRfFbBuU]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''))|((?:[rRfFbBuU]{1,2})?(?:"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'))|(#[^\n]*)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([=+\-*/%<>!&|^~@]+)|([\s\S])/g;
  const toks = []; let m, prev = '';
  while ((m = re.exec(src))) {
    let cls = '';
    if (m[1] || m[2]) cls = 's'; else if (m[3]) cls = 'c'; else if (m[4]) cls = 'n'; else if (m[6]) cls = 'o';
    else if (m[5]) { const w = m[5]; cls = KW.has(w) ? 'k' : CONST.has(w) ? 'k' : BI.has(w) ? 'b' : prev === 'def' ? 'f' : ''; }
    if (m[5]) prev = m[5]; else if (!/^\s+$/.test(m[0])) prev = '';
    toks.push([cls, m[0]]);
  }
  const lines = [[]];
  toks.forEach(([cls, text]) => text.split('\n').forEach((part, i) => {
    if (i) lines.push([]);
    if (part) lines[lines.length - 1].push(cls ? `<span class="x${cls}">${esc(part)}</span>` : esc(part));
  }));
  return lines.map(l => l.join(''));
}

/* ---------- build ---------- */
let root, scroller, inner, countEl, noteEl, qrEl, billEl, veilEl, lineCount = 0;
const CELL = {};
const lineIndex = (lines, spec) => { const out = new Set(); (spec || []).forEach(s => lines.forEach((l, i) => { if (l.includes(s)) out.add(i); })); return out; };
function noteHTML(n) {
  const badge = n.k ? `<b class="${n.llm ? 'llm' : 'ds'}">${n.k}</b>` : '';
  return `<div class="h">${badge}<span>${n.h}</span></div><p>${n.p}</p>${n.f ? `<div class="f">${n.f}</div>` : ''}`;
}
const BILL = [['S', 'ds', 'Summarise', 'no LLM', '$0'], ['E', 'ds', 'Embed', 'on the laptop', '$0'], ['C', 'ds', 'Cluster', 'k-means', '$0'],
  ['N', 'llm', 'Name', '100 calls · ≈ 1 million tokens', '≈ $0.13'], ['A', 'llm', 'Aggregate', '1 call · ≈ 13,000 tokens', '≈ $0.02']];
function build(container) {
  root = container;
  root.innerHTML = `
<div class="jl-top"><div class="jl-menubar"><span class="jl-logo"><i></i><i></i><i></i></span>${['File', 'Edit', 'View', 'Run', 'Kernel', 'Tabs', 'Settings', 'Help'].map(m => `<span>${m}</span>`).join('')}</div></div>
<div class="jl-body">
  <div class="jl-side"><span class="on">▤</span><span>◉</span><span>☰</span><span>⧉</span></div>
  <div class="jl-main">
    <div class="jl-tabs"><span class="jl-tab on"><b></b>test_secna_langchain.py<em>×</em></span><span class="jl-tab"><b></b>test_secna.py<em>×</em></span></div>
    <div class="jl-toolbar"><span>🖫</span><span>＋</span><span>✂</span><span>⎘</span><span>⎗</span><span>▶</span><span>■</span><span>↻</span><span>⏭</span><span class="jl-sel">Code ⌄</span><span class="jl-fill"></span><span class="jl-kernel">Python 3 (ipykernel)</span><span class="jl-busy"></span></div>
    <div class="jl-scroll" id="jlScroll"><div class="jl-cells" id="jlCells"></div>
      <div class="jl-veil"></div>
      <div class="jl-qr"><div class="q"></div><div class="u">the notebook<br><b>github.com/mdussere/secna</b></div></div>
      <div class="jl-note"></div>
      <div class="jl-bill"><div class="k">The bill of this run</div><div class="m">gpt-6-luna · a small model</div>
        ${BILL.map(([l, c, h, w, v]) => `<div class="r"><b class="${c}">${l}</b><span class="h">${h}</span><span class="w">${w}</span><span class="v">${v}</span></div>`).join('')}
        <div class="t"><span class="v">≈ $0.15</span><span class="w">for 14,947 pull requests</span></div></div>
    </div>
  </div>
</div>
<div class="jl-status"><span class="jl-simple"><i></i>Simple</span><span>0 ⓢ 1 ⚙</span><span>Python 3 (ipykernel) | Idle</span><span class="jl-fill"></span><span class="jl-count" id="jlCount"></span><span>Mode: Command</span><span>test_secna_langchain.py</span></div>`;
  scroller = root.querySelector('#jlScroll'); inner = root.querySelector('#jlCells'); countEl = root.querySelector('#jlCount');
  noteEl = root.querySelector('.jl-note'); qrEl = root.querySelector('.jl-qr'); billEl = root.querySelector('.jl-bill'); veilEl = root.querySelector('.jl-veil');
  const qrT = document.getElementById('qrT');
  if (qrT) qrEl.querySelector('.q').appendChild(qrT.content.firstElementChild.cloneNode(true));
  billEl._rows = [...billEl.querySelectorAll('.r, .t')];
  let n = 0;
  STAGE.forEach(def => {
    const c = Object.assign({ out: [] }, def);
    const el = document.createElement('div'); c.el = el;
    if (c.md) {
      el.className = 'jl-cell md';
      el.innerHTML = `<div class="jl-prompt"></div><div class="jl-mdbody">${c.md.split('\n').map(l => l.startsWith('# ') ? `<h1>${esc(l.slice(2))}</h1>` : `<p>${esc(l)}</p>`).join('')}</div>`;
    } else {
      const src = SRC[c.id] || `# (missing cell: ${c.id} — run tools/build_cells.py)`;
      c.lines = src.split('\n');
      lineCount += c.lines.filter(l => l.trim()).length;
      const html = highlight(src);
      let fa = -1, fb = -1;
      if (c.fold) { fa = c.lines.findIndex(l => l.includes(c.fold.from)); fb = c.fold.to ? c.lines.findIndex((l, i) => i > fa && l.includes(c.fold.to)) - 1 : c.lines.length - 1; }
      const row = i => `<div class="ln" data-i="${i}"><b>${i + 1}</b><span>${html[i] || ' '}</span></div>`;
      let code = '';
      for (let i = 0; i < c.lines.length; i++) {
        if (i === fa) code += `<div class="jl-foldrow"><b>⋯</b><span>${fb - fa + 1} ${esc(c.fold.note)}</span></div><div class="jl-foldbody">`;
        code += row(i);
        if (i === fb) code += '</div>';
      }
      el.className = 'jl-cell code';
      const outs = c.out.map(o => o.t === 'img' ? `<div class="jl-out img"><div class="jl-oprompt"></div><div class="jl-img"><img src="${o.src}" alt=""></div></div>`
        : `<div class="jl-out ${o.t}"><div class="jl-oprompt"></div><pre>${esc(o.s)}</pre></div>`).join('');
      el.innerHTML = `<div class="jl-in"><div class="jl-prompt">[${++n}]:</div><div class="jl-editor">${code}</div></div><div class="jl-outs">${outs}</div>`;
      c.rows = [...el.querySelectorAll('.ln')];
    }
    inner.appendChild(el); CELL[c.id] = c;
  });
  countEl.innerHTML = `<b>${lineCount}</b> lines of Python`;
}

/* ---------- actions on the clock ---------- */
let ACTS = [], manual = 0, curSeq = null;
function resolve(timeOf) {
  ACTS = [];
  for (const sid in PLAN) PLAN[sid].forEach(([at, kind, cell, arg]) => ACTS.push({ t: timeOf(sid, at), sid, kind, cell, arg: arg || {} }));
  ACTS.sort((a, b) => a.t - b.t);
  return ACTS;
}
const lastOf = (T, kinds) => { let r = null, p = null; for (const a of ACTS) { if (a.t > T + 1e-6) break; if (kinds.includes(a.kind)) { p = r; r = a; } } return [r, p]; };
const setCls = (el, k, on) => { if (!!el['_' + k] !== on) { el['_' + k] = on; el.classList.toggle(k, on); } };
const setSty = (el, k, v) => { if (el.style[k] !== v) el.style[k] = v; };
const setHTML = (el, s) => { if (el._h !== s) { el._h = s; el.innerHTML = s; } };

/* where the view stands when an action has settled */
const vh = () => scroller.clientHeight;
const maxY = () => Math.max(0, inner.scrollHeight - vh());
function scrollTarget(a) {
  if (!a || a.kind !== 'go') return 0;
  const c = CELL[a.cell], top = CELL[a.arg.top || a.cell].el.offsetTop, bottom = c.el.offsetTop + c.el.offsetHeight;
  // the block starts level with the QR code's foot, or higher when it needs the room (never above the top)
  const y = a.arg.anchor === 'end' ? bottom - vh() + 24 : clamp(bottom - vh() + 24, top - QR_BOTTOM() + 26, top - 22);
  return clamp(y, 0, maxY());
}
function scrollAt(T) {
  const [cur, prev] = lastOf(T, ['sweep', 'go']);
  if (!cur) return 0;
  if (cur.kind === 'sweep') {
    const u = T - cur.t, d = cur.arg, down = d * .55, hold = d * .1, M = maxY();
    return u < down ? M * ease(clamp(u / down)) : M * (1 - ease(clamp((u - down - hold) / (d - down - hold))));
  }
  return lerp(scrollTarget(prev), scrollTarget(cur), ease(clamp((T - cur.t) / .9)));
}
/* the call-out's place: beside the highlighted lines (or the cell), below the QR code, on screen */
const QR_BOTTOM = () => qrEl.offsetTop + qrEl.offsetHeight + 26;
function noteTop(a) {
  const c = CELL[a.cell], y = scrollTarget(a), on = [...lineIndex(c.lines, a.arg.hl)];
  const row = on.length ? c.rows[on[0]] : null;
  const top = c.el.offsetTop + (row ? c.el.querySelector('.jl-editor').offsetTop + row.offsetTop - 14 : 0) - y;
  return clamp(top, QR_BOTTOM(), vh() - noteEl.offsetHeight - 24);
}

function render(T) {
  if (!ACTS.length) return;
  const [cur, prev] = lastOf(T, ['go']);
  const [scene] = lastOf(T, ['go', 'bill', 'overview', 'sweep']);
  const sweeping = scene && scene.kind === 'sweep';
  // the block in focus: its left bar, its highlighted lines (once the scroll has nearly settled)
  STAGE.forEach(def => {
    const c = CELL[def.id];
    setCls(c.el, 'active', !!cur && !sweeping && cur.cell === c.id);
    if (!c.rows) return;
    const on = cur && !sweeping && cur.cell === c.id && T >= cur.t + .5 ? lineIndex(c.lines, cur.arg.hl) : null;
    c.rows.forEach(r => setCls(r, 'hl', !!on && on.has(+r.dataset.i)));
  });
  // the call-out: the previous one fades out, the new one comes in when the scroll settles
  let n = null, op = 0, dx = 0;
  if (cur && !sweeping && scene === cur) {
    const u = T - cur.t;
    if (u < .25 && prev && prev.arg.note) { n = prev; op = 1 - u / .25; }
    else if (cur.arg.note && u >= .55) { n = cur; const q = eo(clamp((u - .55) / .4)); op = q; dx = 26 * (1 - q); }
  }
  if (n) { setHTML(noteEl, noteHTML(NOTES[n.arg.note])); setSty(noteEl, 'top', noteTop(n).toFixed(0) + 'px'); }
  setSty(noteEl, 'opacity', op.toFixed(3)); setSty(noteEl, 'transform', `translateX(${dx.toFixed(1)}px)`);
  setSty(noteEl, 'visibility', op > 0 ? 'visible' : 'hidden');
  // the QR code: it comes in once, then stays
  const [qa] = lastOf(T, ['qr']), qq = qa ? eo(clamp((T - qa.t) / .45)) : 0;
  setSty(qrEl, 'opacity', qq.toFixed(3)); setSty(qrEl, 'transform', `scale(${(.85 + .15 * qq).toFixed(4)})`);
  // the bill: a veil over the chart, the card, its rows one after the other
  const [b] = lastOf(T, ['bill']), [ov] = lastOf(T, ['overview']);
  const bOn = !!b && (!ov || ov.t < b.t || T - ov.t < .3) && (!cur || cur.t < b.t);
  const bq = bOn ? (ov && ov.t > b.t ? 1 - clamp((T - ov.t) / .3) : 1) : 0, bu = b ? T - b.t : 0;
  setSty(veilEl, 'opacity', (bOn ? .82 * eo(clamp(bu / .4)) * bq : 0).toFixed(3));
  setSty(billEl, 'visibility', bOn ? 'visible' : 'hidden');
  if (bOn) {
    const q = eo(clamp(bu / .5));
    setSty(billEl, 'opacity', (q * bq).toFixed(3)); setSty(billEl, 'transform', `translate(${(40 * (1 - q)).toFixed(1)}px,-50%)`);
    billEl._rows.forEach((r, k) => { const p = eo(clamp((bu - .3 - .14 * k) / .3)); setSty(r, 'opacity', p.toFixed(3)); setSty(r, 'transform', `translateY(${(10 * (1 - p)).toFixed(1)}px)`); });
  }
  layout(T);
}

/* ---------- the camera: scroll, sweep, overview ---------- */
function layout(T) {
  const [ov] = lastOf(T, ['overview']), inOv = !!ov && curSeq === ov.sid && T >= ov.t;
  setCls(inner, 'ov', inOv);
  if (inOv) {   // the whole notebook at once, in columns, left of the QR code
    const W0 = scroller.clientWidth - qrEl.offsetWidth - 70;
    if (!inner._cols) {   // as many columns as make it the largest
      let best = null;
      for (let n = 2; n <= 5; n++) {
        inner.style.width = (n * 1800 + (n - 1) * 80) + 'px'; inner.style.columnCount = n;
        const z = Math.min((W0 - 30) / inner.scrollWidth, (vh() - 30) / inner.scrollHeight);
        if (!best || z > best.z) best = { n, z };
      }
      inner._cols = best; inner.style.width = (best.n * 1800 + (best.n - 1) * 80) + 'px'; inner.style.columnCount = best.n;
    }
    const q = ease(clamp((T - ov.t) / 1.4)), H0 = inner.scrollHeight, Wc = inner.scrollWidth;
    const zs = Math.min((W0 - 30) / Wc, (vh() - 30) / H0), z = lerp(.5, zs, q);
    setSty(inner, 'opacity', (.25 + .75 * q).toFixed(3));
    setSty(inner, 'transform', `translate3d(${((W0 - Wc * z) / 2).toFixed(1)}px,14px,0) scale(${z.toFixed(4)})`);
    return;
  }
  if (inner._cols) { inner._cols = null; inner.style.width = ''; inner.style.columnCount = ''; }
  setSty(inner, 'opacity', '1');
  setSty(inner, 'transform', `translate3d(0,${(-scrollAt(T) - manual).toFixed(1)}px,0)`);
}
function setSeq(id) { curSeq = id; }
function wheel(dy) { manual = clamp(manual + dy, -400, inner.scrollHeight); }
function resetManual() { manual = 0; }
function reset() {}

window.SNB = { build, resolve, render, setSeq, wheel, resetManual, reset, PLAN, get steps() { return lineCount; } };
})();
