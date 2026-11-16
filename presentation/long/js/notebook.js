/* SECNA talk — Part 2: a pseudo-Jupyter notebook.
 * It looks like JupyterLab and runs nothing. The code of every cell comes from nb_cells.js, cut from the
 * real notebook (notebook/test_secna.py, test_secna_langchain.py) by tools/build_cells.py; the outputs
 * are those of the LangChain run of 25 October 2026, replayed. The talk's clock drives it: scroll to a
 * cell, highlight lines, run, reveal the output. While the talk is stopped, the wheel scrolls by hand.
 */
(function () {
'use strict';
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const lerp = (a, b, p) => a + (b - a) * p;
const ease = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SRC = {}; (window.SECNA_CELLS || []).forEach(c => { SRC[c.id] = c.src; });

/* ---------- the run's outputs ---------- */
const S_OUT = `origin
human            10132
bot               4235
human + agent      572
agent                8
Name: count, dtype: int64
count    14947.0
mean      1090.0
std       2807.0
min         19.0
50%        291.0
90%       2368.0
99%      20236.0
max      23455.0
Name: summary_tokens, dtype: float64
372 summaries cut to 8191 tokens · 13,211,837 tokens to embed`;
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
const N_OUT = N_NAMES.map((n, k) => `${(k + 1) * 10}/100 clusters named · … tokens · last: ${n}`).join('\n') + '\n100 clusters named · ≈ 1,000,000 tokens';
const A_OUT = `7 themes · ≈ 13,000 tokens (… out, reasoning included)
A · Agent Products and Workflow Reliability · 4,397 pull requests · clusters 2, 7, 8, 14, 15, 18, 20, 26, 28, 33, 35, 38, 44, 51, 62, 64, 78, 79, 81, 83, 86, 94, 99
B · LangChain and LangGraph Runtime Correctness · 2,762 pull requests · clusters 0, 3, 10, 17, 23, 30, 31, 41, 47, 57, 66, 80, 84, 90, 97
C · Automated Dependency and Security Maintenance · 2,894 pull requests · clusters 4, 5, 6, 9, 16, 22, 36, 37, 43, 50, 54, 56, 60, 61, 68, 71, 72, 73, 75, 77, 87, 88, 95
D · Documentation and Integration Discoverability · 1,725 pull requests · clusters 1, 13, 19, 21, 24, 27, 39, 40, 42, 52, 58, 63, 82, 96
E · LangSmith SDKs, Tracing, and Developer Tools · 1,262 pull requests · clusters 12, 46, 59, 65, 70, 74, 76, 91, 93
F · Model Providers and Integration Support · 859 pull requests · clusters 11, 25, 32, 55, 69, 85, 89
G · Cloud Deployment and Release Engineering · 1,048 pull requests · clusters 29, 34, 45, 48, 49, 53, 67, 92, 98`;
const WHO_OUT = `person                   49%
bot                      28%
signed by an AI agent    23%
Open SWE signs 27% of the pull requests opened by people`;
const UNEXP_OUT = `cluster 2 · 310 pull requests · Bot-led hardening of Chat LangChain’s documentation agent, guardrails, grounding, and tool reliability
303 of them say: “Opened from a LangSmith Engine issue, which has the diagnosis and the traces that surfaced it.”
per month: [5, 230, 75]`;
const ROUTE_OUT = `
286 new pull requests on 2026-10-23, routed without a single LLM call:
fix(langgraph): apply an explicit recursion_limit equal to → 57 · LangGraph checkpoint and store correctness fixes with cr
fix(mda): close turn traces when their root ends           → 28 · Bot-led hardening of model authentication, retries, fall
chore(deps): bump the npm_and_yarn group across 2 director →  9 · Automated Dependency Refreshes Across LangChain Reposito
fix(mda): compact code-mode tool references                → 66 · Hardening Tool-Call Execution, Validation, Serialization
chore(deps): bump fastmcp from 4.1.1 to 4.1.2              →  5 · Automated Dependency Refreshes Across LangChain Librarie
chore(deps): bump opentelemetry-api from 1.42.1 to 1.45.1  → 43 · Automated Python Dependency Refreshes Across LangChain A
chore(deps): bump fastmcp from 4.1.0 to 4.1.2 in /mda in t → 16 · Automated Python Dependency Refreshes Across LangChain R
chore(deps): bump setuptools from 84.0.0 to 84.1.0         → 72 · Automated Python Dependency Refreshes Across LangChain L
fix(mda): retry after-model hooks during backend rollouts  → 28 · Bot-led hardening of model authentication, retries, fall
feat(langsmith): add config switches for shared webhook de → 67 · LangSmith Helm Chart Evolution for SmithDB, Sandbox Infr
docs: state decision model evaluator plan requirement      → 63 · Deep Agents Product Documentation, Onboarding, and SDK C
build(deps): bump Homebrew/actions/git-user-config from 20 →  4 · Automated Recurring Dependency Updates for Homebrew Tap `;
const NOTE_TOKENS = 'This run did not log its token counts: the totals are rounded from the bill.';

/* ---------- the cells, in order ---------- */
const STAGE = [
  { id: 'title', md: '# SECNA · three months of LangChain\nSummarise · Embed · Cluster · Name · Aggregate, on every pull request of the langchain-ai organisation on GitHub, 23 July – 23 October 2026. Code: notebook/test_secna.py, one cell per step, run on this corpus by test_secna_langchain.py. Outputs replayed from the runs of 25 October (the steps) and 7 November 2026 (the last three cells).' },
  { id: 'imports' },
  { id: 'config' },
  { id: 'extract', fold: { from: 'GITLAB_QUERY = ', to: 'df.to_parquet(CORPUS', note: 'lines folded: the GitLab and GitHub APIs, paging, flattening' },
    out: [{ t: 'text', s: '14,947 pull requests · 137 repositories · 1,607 authors · 29 columns' }] },
  { id: 's', step: 'S', out: [{ t: 'text', s: S_OUT }] },
  { id: 'e', step: 'E', out: [{ t: 'progress', n: 468, secs: 661, dur: 3.1 }, { t: 'text', s: '14,947 vectors of 768 dimensions · sentence-transformers/LaBSE on the CPU' }] },
  { id: 'c', step: 'C', out: [{ t: 'text', s: '100 clusters · sizes 22–310 (median 156) · 60 iterations' }] },
  { id: 'n', step: 'N', out: [{ t: 'lines', step: .36, s: N_OUT }, { t: 'note', s: NOTE_TOKENS }] },
  { id: 'a', step: 'A', out: [{ t: 'lines', step: .26, s: A_OUT }, { t: 'note', s: NOTE_TOKENS }] },
  { id: 'graph', fold: { from: 'COLORS = ', to: 'out = DATA', note: 'lines folded: matplotlib', at0: true },
    out: [{ t: 'text', s: '-> data/langchain_2026-07-23_2026-10-23/themes.png' }, { t: 'img', src: 'img/themes_langchain.png' }] },
  { id: 'md2', md: '## Then count\nThe cluster descriptions kept naming one coding agent, Open SWE. The table can check it.' },
  { id: 'who', out: [{ t: 'lines', step: .3, s: WHO_OUT }] },
  { id: 'unexpected', out: [{ t: 'lines', step: .5, s: UNEXP_OUT }] },
  { id: 'route', out: [{ t: 'count', prefix: 'langchain-ai 2026-10-23: ', to: 286, by: 50, post: ' pull requests', dur: 1.3 },
    { t: 'lines', step: .17, s: ROUTE_OUT }, { t: 'more', s: '… and 274 more lines.' }] },
];

/* the plan: what each sequence does to the notebook, at cues of its narration ("c2", "c2+0.5", "end-1") */
const PLAN = {
  nb0: [['c0', 'show'], ['c2+0.2', 'sweep', null, 7]],
  nb1: [['c0', 'scroll', 'config'], ['c0+0.5', 'run', 'imports', .15], ['c0+1.2', 'run', 'config', .15],
    ['c1', 'hl', 'config', ['REPOS = ', 'SINCE, UNTIL = ']], ['c2', 'hl', 'config', ['UNITS = ']],
    ['c3', 'hl', 'config', ['REPOS = ']], ['c3+0.2', 'zoom', 'config', 1.5], ['end-0.4', 'zoom', 'config', 1]],
  nb2: [['c0', 'scroll', 'extract'], ['c0+0.4', 'hl', 'extract', ['created:{day}..{day}']], ['c0+0.6', 'zoom', 'extract', 1.45],
    ['c1-0.2', 'zoom', 'extract', 1], ['c1', 'glide', 'extract', 2.6], ['c1+2.8', 'fold', 'extract'], ['c2', 'run', 'extract', .8], ['c2+1', 'ohl', 'extract', ['14,947']]],
  nb3: [['c0', 'scroll', 's'], ['c1', 'hl', 's', ['text = (', '+ "\\nlabels: "']], ['c1+0.3', 'zoom', 's', 1.4],
    ['c2-0.5', 'zoom', 's', 1], ['c2-0.4', 'run', 's', .5], ['c2+0.4', 'ohl', 's', ['50%']]],
  nb4: [['c0', 'scroll', 'e'], ['c0+0.6', 'hl', 'e', { from: 'if LOCAL_EMBED:', to: 'on the CPU")' }], ['c1-0.2', 'run', 'e', .3],
    ['c2+0.3', 'ohl', 'e', ['768 dimensions']]],
  nb5: [['c0', 'scroll', 'c'], ['c0+0.2', 'hl', 'c', ['X = np.stack', 'km = KMeans', 'df["cluster"] = km.labels_']],
    ['c0+0.4', 'zoom', 'c', 1.45], ['c1', 'hl', 'c', ['K = 100', 'km = KMeans']], ['c3-0.6', 'zoom', 'c', 1], ['c3-0.3', 'run', 'c', .6],
    ['c3+0.8', 'ohl', 'c', ['sizes 22–310']]],
  nb6: [['c0', 'scroll', 'n'], ['c1', 'hl', 'n', ['for summary in members.nsmallest', 'r = client.chat.completions.create']],
    ['c2', 'hl', 'n', { from: 'NAME_PROMPT = ', to: '"""' }], ['c2+0.2', 'zoom', 'n', 1.3], ['c2+2.6', 'zoom', 'n', 1],
    ['c2+2.8', 'run', 'n', .4], ['c3+0.6', 'ohl', 'n', ['100 clusters named · ≈']]],
  nb7: [['c0', 'scroll', 'a'], ['c0+0.3', 'hl', 'a', ['r = client.chat.completions.create']], ['c1-0.2', 'run', 'a', .5]],
  nb8: [['c0', 'scroll', 'graph'], ['c0+0.4', 'run', 'graph', .5], ['c1', 'mark', 'graph', [0]], ['c2', 'mark', 'graph', [1, 2]], ['c3+0.3', 'mark', 'graph', []]],
  nb9: [['c0', 'scroll', 'md2'], ['c1-0.3', 'scroll', 'who'], ['c1+0.6', 'hl', 'who', ['coding agent signs', 'SIGNED = ']], ['c2-0.4', 'run', 'who', .3],
    ['c2+1.9', 'ohl', 'who', ['bot ']], ['c2+5', 'ohl', 'who', ['signed by an AI agent ']], ['c3', 'ohl', 'who', ['Open SWE signs']],
    ['c4', 'hl', 'who', ['coding agent signs', 'SIGNED = ']]],
  nb10: [['c0', 'scroll', 'unexpected'], ['c1-0.4', 'run', 'unexpected', .4], ['c1', 'reveal', 'unexpected', 1], ['c1+0.3', 'ohl', 'unexpected', ['310 pull requests']],
    ['c2', 'reveal', 'unexpected', 2], ['c2', 'ohl', 'unexpected', ['303 of them']], ['c3', 'ohl', 'unexpected', ['LangSmith Engine', 'documentation agent']],
    ['c4', 'reveal', 'unexpected', 3], ['c4', 'ohl', 'unexpected', ['per month']]],
  nb11: [['c0', 'scroll', 'route'], ['c0+1.2', 'run', 'route', .3], ['c1', 'hl', 'route', ['V = SentenceTransformer', 'nearest = centres.index']],
    ['c2', 'ohl', 'route', ['chore(deps): bump the npm', 'fix(langgraph)']], ['c3', 'ohl', 'route', ['routed without a single LLM call']]],
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
let root, scroller, inner, statusEl, busyEl, countEl, steps = 0;
const CELL = {};
function lineIndex(lines, spec) {
  // spec: ["substring", …] → each line containing one; {from, to} → the block between them
  const out = new Set();
  if (Array.isArray(spec)) spec.forEach(s => lines.forEach((l, i) => { if (l.includes(s)) out.add(i); }));
  else if (spec && spec.from) {
    const a = lines.findIndex(l => l.includes(spec.from)); if (a < 0) return out;
    let b = lines.findIndex((l, i) => i > a && l.includes(spec.to)); if (b < 0) b = a;
    for (let i = a; i <= b; i++) out.add(i);
  }
  return out;
}
function build(container) {
  root = container;
  root.innerHTML = `
<div class="jl-top"><div class="jl-menubar"><span class="jl-logo"><i></i><i></i><i></i></span>${['File', 'Edit', 'View', 'Run', 'Kernel', 'Tabs', 'Settings', 'Help'].map(m => `<span>${m}</span>`).join('')}</div></div>
<div class="jl-body">
  <div class="jl-side"><span class="on">▤</span><span>◉</span><span>☰</span><span>⧉</span></div>
  <div class="jl-main">
    <div class="jl-tabs"><span class="jl-tab on"><b></b>test_secna_langchain.py<em>×</em></span><span class="jl-tab"><b></b>test_secna.py<em>×</em></span></div>
    <div class="jl-toolbar"><span>🖫</span><span>＋</span><span>✂</span><span>⎘</span><span>⎗</span><span>▶</span><span>■</span><span>↻</span><span>⏭</span><span class="jl-sel">Code ⌄</span><span class="jl-fill"></span><span class="jl-kernel">Python 3 (ipykernel)</span><span class="jl-busy" id="jlBusy"></span></div>
    <div class="jl-scroll" id="jlScroll"><div class="jl-cells" id="jlCells"></div></div>
  </div>
</div>
<div class="jl-status"><span class="jl-simple"><i></i>Simple</span><span>0 ⓢ 1 ⚙</span><span id="jlStatus">Python 3 (ipykernel) | Idle</span><span class="jl-fill"></span><span class="jl-count" id="jlCount"></span><span>Mode: Command</span><span>test_secna_langchain.py</span></div>`;
  scroller = root.querySelector('#jlScroll'); inner = root.querySelector('#jlCells');
  statusEl = root.querySelector('#jlStatus'); busyEl = root.querySelector('#jlBusy'); countEl = root.querySelector('#jlCount');
  STAGE.forEach(def => {
    const c = Object.assign({ out: [] }, def);
    const el = document.createElement('div'); c.el = el;
    if (c.md) {
      el.className = 'jl-cell md';
      el.innerHTML = `<div class="jl-prompt"></div><div class="jl-mdbody">${c.md.split('\n').map(l => l.startsWith('## ') ? `<h2>${esc(l.slice(3))}</h2>` : l.startsWith('# ') ? `<h1>${esc(l.slice(2))}</h1>` : `<p>${esc(l)}</p>`).join('')}</div>`;
    } else {
      const src = SRC[c.id] || `# (missing cell: ${c.id} — run tools/build_cells.py)`;
      c.lines = src.split('\n');
      const html = highlight(src);
      let fa = -1, fb = -1;
      if (c.fold) { fa = c.lines.findIndex(l => l.includes(c.fold.from)); fb = c.lines.findIndex((l, i) => i > fa && l.includes(c.fold.to)) - 1; }
      const row = i => `<div class="ln" data-i="${i}"><b>${i + 1}</b><span>${html[i] || ' '}</span></div>`;
      let code = '';
      for (let i = 0; i < c.lines.length; i++) {
        if (i === fa) {
          code += `<div class="jl-foldrow"><b>⋯</b><span>${fb - fa + 1} ${esc(c.fold.note)}</span></div><div class="jl-foldbody">`;
        }
        code += row(i);
        if (i === fb) code += '</div>';
      }
      el.className = 'jl-cell code';
      el.innerHTML = `<div class="jl-in"><div class="jl-prompt">[ ]:</div><div class="jl-editor">${code}</div></div><div class="jl-outs"></div>`;
      c.prompt = el.querySelector('.jl-prompt'); c.rows = [...el.querySelectorAll('.ln')];
      c.foldbody = el.querySelector('.jl-foldbody'); c.foldrow = el.querySelector('.jl-foldrow');
      const outs = el.querySelector('.jl-outs');
      c.out.forEach(o => {
        const d = document.createElement('div'); d.className = 'jl-out ' + o.t; o.el = d;
        if (o.t === 'img') d.innerHTML = `<div class="jl-oprompt"></div><div class="jl-img"><img src="${o.src}" alt=""><div class="jl-marks"></div></div>`;
        else d.innerHTML = `<div class="jl-oprompt"></div><pre></pre>`;
        o.pre = d.querySelector('pre'); o.lines = o.s ? o.s.split('\n') : []; o.marks = d.querySelector('.jl-marks');
        outs.appendChild(d);
      });
      if (c.step) steps += c.lines.filter(l => l.trim()).length;
    }
    inner.appendChild(el); CELL[c.id] = c;
  });
  countEl.innerHTML = `S · E · C · N · A <b>${steps}</b> lines`;
}

/* ---------- actions on the clock ---------- */
let ACTS = [], RUNS = {}, HAS_REVEAL = {}, manual = 0, sweepT = null;
function resolve(timeOf) {
  ACTS = [];
  for (const sid in PLAN) PLAN[sid].forEach(([at, kind, cell, arg]) => ACTS.push({ t: timeOf(sid, at), sid, kind, cell, arg }));
  ACTS.sort((a, b) => a.t - b.t);
  let n = 0; RUNS = {}; HAS_REVEAL = {};
  ACTS.forEach(a => { if (a.kind === 'run') { a.count = ++n; RUNS[a.cell] = a; } if (a.kind === 'reveal') HAS_REVEAL[a.cell] = true; });
  // each output starts when the one before it is done
  STAGE.forEach(def => {
    const c = CELL[def.id]; if (!c || !c.out.length) return;
    const run = RUNS[c.id]; let t = run ? run.t + (run.arg || .5) : Infinity;
    c.out.forEach(o => {
      o.t0 = t;
      const d = o.t === 'lines' ? (HAS_REVEAL[c.id] ? 0 : o.lines.length * (o.step || .3)) : o.t === 'progress' || o.t === 'count' ? o.dur : o.t === 'img' ? .5 : 0;
      t += d + .12;
    });
  });
  return ACTS;
}
const last = (T, f) => { let r = null; for (const a of ACTS) { if (a.t > T + 1e-6) break; if (f(a)) r = a; } return r; };
function fmtTime(s) { s = Math.round(s); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
const setTxt = (el, s) => { if (el._t !== s) { el._t = s; el.textContent = s; } };
const setCls = (el, k, on) => { if (!!el['_' + k] !== on) { el['_' + k] = on; el.classList.toggle(k, on); } };
const setSty = (el, k, v) => { if (el.style[k] !== v) el.style[k] = v; };

function render(T) {
  if (!ACTS.length) return;
  let busy = false;
  const focus = last(T, a => ['scroll', 'run', 'glide'].includes(a.kind));
  STAGE.forEach(def => {
    const c = CELL[def.id]; if (!c.prompt) { setCls(c.el, 'active', !!focus && focus.cell === c.id); return; }
    const run = RUNS[c.id], ran = run && T >= run.t, tr = ran ? T - run.t : -1, lag = run ? (run.arg || .5) : 0;
    setTxt(c.prompt, !ran ? '[ ]:' : tr < lag ? '[*]:' : `[${run.count}]:`);
    if (ran && tr < lag) busy = true;
    setCls(c.el, 'active', !!focus && focus.cell === c.id);
    // folding
    if (c.foldbody) {
      const f = c.fold.at0 ? { t: -1e9 } : last(T, a => a.kind === 'fold' && a.cell === c.id);
      const q = f ? ease(clamp((T - f.t) / .6)) : 0;
      const h = c.foldbody.scrollHeight;
      setSty(c.foldbody, 'height', q <= 0 ? '' : (h * (1 - q)).toFixed(1) + 'px');
      setSty(c.foldrow, 'display', q > 0 ? '' : 'none');
      setSty(c.foldrow, 'opacity', q.toFixed(3));
    }
    // highlighted code lines: the latest "hl" of the current sequence for this cell
    const seq = currentSeq(T);
    const hl = last(T, a => a.kind === 'hl' && a.cell === c.id && a.sid === seq);
    const on = hl ? lineIndex(c.lines, hl.arg) : null;
    const hq = hl ? clamp((T - hl.t) / .35) : 0;
    c.rows.forEach(r => { const i = +r.dataset.i; setCls(r, 'hl', !!on && on.has(i) && hq > 0); });
    // outputs
    const rv = last(T, a => a.kind === 'reveal' && a.cell === c.id);
    const ohl = last(T, a => a.kind === 'ohl' && a.cell === c.id && a.sid === seq);
    c.out.forEach((o, k) => {
      const u = T - o.t0, show = u >= 0;
      setSty(o.el, 'display', show ? '' : 'none');
      if (!show) return;
      if (o.t === 'text' || o.t === 'note' || o.t === 'more') o.pre._html !== 1 && (o.pre._html = 1, o.pre.innerHTML = o.lines.map(l => `<span>${esc(l) || ' '}</span>`).join('\n'));
      else if (o.t === 'lines') {
        const n = HAS_REVEAL[c.id] ? (rv ? rv.arg : 0) : Math.min(o.lines.length, Math.floor(u / (o.step || .3)) + 1);
        if (!HAS_REVEAL[c.id] && n < o.lines.length) busy = true;
        if (o._n !== n) { o._n = n; o.pre.innerHTML = o.lines.slice(0, n).map(l => `<span>${esc(l) || ' '}</span>`).join('\n'); }
      } else if (o.t === 'progress') {
        const p = clamp(u / o.dur), done = Math.round(p * o.n), bar = '█'.repeat(Math.floor(p * 10));
        setTxt(o.pre, `Batches: ${String(Math.round(p * 100)).padStart(3)}%|${bar.padEnd(10, ' ')}| ${done}/${o.n} [${fmtTime(p * o.secs)}<${fmtTime((1 - p) * o.secs)}, ${(o.secs / o.n).toFixed(2)}s/it]`);
        if (p < 1) busy = true;
      } else if (o.t === 'count') {
        const p = clamp(u / o.dur), v = p >= 1 ? o.to : Math.min(o.to, o.by * Math.max(1, Math.ceil(p * o.to / o.by)));
        setTxt(o.pre, `${o.prefix}${v} ${o.post.trim()}`); if (p < 1) busy = true;
      } else if (o.t === 'img') {
        setSty(o.el, 'opacity', clamp(u / .5).toFixed(3));
        const mk = last(T, a => a.kind === 'mark' && a.cell === c.id);
        const want = mk ? mk.arg.join(',') : '';
        if (o.marks._w !== want) { o.marks._w = want; o.marks.innerHTML = (mk ? mk.arg : []).map(b => `<i style="top:${BARS[b][0]}%;height:${BARS[b][1]}%;width:36%"></i>`).join(''); }
      }
      if (o.pre && (o.t === 'text' || o.t === 'lines')) [...o.pre.children].forEach(sp => setCls(sp, 'hl', !!ohl && ohl.arg.some(s => sp.textContent.includes(s))));
    });
  });
  setTxt(statusEl, `Python 3 (ipykernel) | ${busy ? 'Busy' : 'Idle'}`);
  setCls(busyEl, 'on', busy);
  layout(T);
}
// the bars of the themes chart, as % of the image height (top, height), largest first
const BARS = [[11.4, 8.6], [23.7, 8.6], [36.0, 8.6]];

/* ---------- scroll, zoom, sweep, overview: a camera over the notebook ---------- */
let curSeq = null;
function currentSeq(T) { return curSeq; }
function setSeq(id) { curSeq = id; }
function topOf(id) { const c = CELL[id]; return c ? c.el.offsetTop - 18 : 0; }
function scrollTarget(a, T) {
  if (!a) return 0;
  const c = CELL[a.cell], vh = scroller.clientHeight, maxY = Math.max(0, inner.scrollHeight - vh);
  let y = topOf(a.cell);
  if (a.kind === 'glide') y = lerp(topOf(a.cell), topOf(a.cell) + Math.max(0, c.el.offsetHeight - vh * .8), ease(clamp((T - a.t) / a.arg)));
  const outs = c.el.querySelector('.jl-outs');
  if (outs && outs.offsetHeight > 0) y = Math.max(y, c.el.offsetTop + c.el.offsetHeight - vh + 36);
  return clamp(y, 0, maxY);
}
function layout(T) {
  const vh = scroller.clientHeight, maxY = Math.max(0, inner.scrollHeight - vh);
  const acts = ACTS.filter(a => a.t <= T + 1e-6 && ['scroll', 'glide', 'run', 'sweep', 'show'].includes(a.kind) && (a.kind !== 'run' || true));
  // the scroll follows the latest focus action, eased from where the previous one left it
  let y = 0;
  const moves = acts.filter(a => a.kind !== 'show');
  if (moves.length) {
    const cur = moves[moves.length - 1], prev = moves[moves.length - 2];
    if (cur.kind === 'sweep') {
      const u = T - cur.t, d = cur.arg, down = d * .55, hold = d * .1;
      y = u < down ? maxY * ease(clamp(u / down)) : maxY * (1 - ease(clamp((u - down - hold) / (d - down - hold))));
    } else {
      const from = !prev ? 0 : prev.kind === 'sweep' ? 0 : scrollTarget(prev, cur.t);
      const to = scrollTarget(cur, T);
      y = lerp(from, to, ease(clamp((T - cur.t) / .8)));
    }
  }
  // zoom on the highlighted lines
  let z = 1, ty = -y;
  const zm = last(T, a => a.kind === 'zoom' && a.sid === curSeq);
  if (zm) {
    const zprev = last(zm.t - 1e-4, a => a.kind === 'zoom' && a.sid === curSeq);
    const zA = zprev ? zprev.arg : 1, q = ease(clamp((T - zm.t) / .7));
    const c = CELL[zm.cell], hl = last(T, a => a.kind === 'hl' && a.cell === zm.cell && a.sid === curSeq);
    const idx = hl ? [...lineIndex(c.lines, hl.arg)] : [0];
    const rows = idx.map(i => c.rows.find(r => +r.dataset.i === i)).filter(Boolean);
    const fy = rows.length ? (Math.min(...rows.map(r => r.offsetTop)) + Math.max(...rows.map(r => r.offsetTop + r.offsetHeight))) / 2 + c.el.offsetTop + c.el.querySelector('.jl-editor').offsetTop : c.el.offsetTop;
    const zAt = zz => ({ z: zz, ty: zz === 1 ? -y : vh * .45 - zz * fy });
    const A = zAt(zA), B = zAt(zm.arg);
    z = lerp(A.z, B.z, q); ty = lerp(A.ty, B.ty, q);
  }
  // overview: the whole notebook at once
  const ov = last(T, a => a.kind === 'overview'), inOv = !!ov && curSeq === ov.sid && T >= ov.t;
  setCls(inner, 'ov', inOv);
  if (inOv) {   // the whole notebook at once, in columns: the mass of code
    const q = ease(clamp((T - ov.t) / 1.4)), W0 = scroller.clientWidth, H0 = inner.scrollHeight, Wc = inner.scrollWidth;
    const zs = Math.min((W0 - 40) / Wc, (vh - 30) / H0);
    z = lerp(.5, zs, q); ty = 14; setSty(inner, 'opacity', (.25 + .75 * q).toFixed(3));
    setSty(inner, 'transformOrigin', '0 0');
    setSty(inner, 'transform', `translate3d(${((W0 - Wc * z) / 2).toFixed(1)}px,${ty}px,0) scale(${z.toFixed(4)})`);
    return;
  }
  setSty(inner, 'opacity', '1');
  setSty(inner, 'transformOrigin', '0 0');
  setSty(inner, 'transform', `translate3d(0,${(ty - manual).toFixed(1)}px,0) scale(${z.toFixed(4)})`);
}
function wheel(dy) { manual = clamp(manual + dy, -400, inner.scrollHeight); }
function resetManual() { manual = 0; }
function reset() { STAGE.forEach(d => { const c = CELL[d.id]; c.out && c.out.forEach(o => { o._n = -1; if (o.pre) o.pre._html = 0; }); }); }

window.SNB = { build, resolve, render, setSeq, wheel, resetManual, reset, PLAN, get steps() { return steps; } };
})();
