/* Moteur de lecture : une horloge, des scènes, des repères temporels (data-at / data-out). */
(() => {
  const SEQ = ['Ouverture', "L'impasse", 'Clio', 'SECNA', 'Les gros, et nous', 'Ma recette'];
  const scenes = window.SCENES;
  const stage = document.getElementById('stage');
  const subsEl = document.querySelector('#subs span');
  const starts = []; let total = 0;
  scenes.forEach(s => { starts.push(total); total += s.dur; });

  /* ---------- construction ---------- */
  const subsAnchor = document.getElementById('subs');
  scenes.forEach((s, i) => {
    const sec = document.createElement('section');
    sec.className = 'scene ' + (s.cls || '');
    sec.innerHTML = s.html;
    stage.insertBefore(sec, subsAnchor);
    s.el = sec; s.i = i;
    s.cues = [...sec.querySelectorAll('[data-at],[data-out]')].map(el => ({
      el, at: +(el.dataset.at ?? 0), out: el.dataset.out != null ? +el.dataset.out : Infinity, on: false, gone: false
    }));
    s.counters = [...sec.querySelectorAll('[data-count]')].map(el => ({
      el, at: +(el.dataset.cat ?? el.dataset.at ?? 0), dur: +(el.dataset.cdur || 2), from: +(el.dataset.from || 0),
      to: +el.dataset.count, dec: +(el.dataset.dec || 0), pre: el.dataset.pre || '', suf: el.dataset.suf || '', last: null
    }));
    s.typers = [...sec.querySelectorAll('[data-type]')].map(el => {
      const nodes = []; const walk = n => { n.childNodes.forEach(c => { if (c.nodeType === 3) { c.__o = c.nodeValue; nodes.push(c); } else walk(c); }); };
      walk(el);
      return { el, nodes, at: +(el.dataset.tat ?? el.dataset.at ?? 0), dur: +el.dataset.type, total: nodes.reduce((a, n) => a + n.__o.length, 0), n: -1 };
    });
    if (s.init) s.init(sec, s);
  });

  /* ---------- rendu d'un instant ---------- */
  function apply(s, lt) {
    for (const c of s.cues) {
      const on = lt >= c.at && lt < c.out, gone = lt >= c.out;
      if (on !== c.on) { c.el.classList.toggle('on', on); c.on = on; }
      if (gone !== c.gone) { c.el.classList.toggle('gone', gone); c.gone = gone; }
    }
    for (const k of s.counters) {
      const v = k.from + (k.to - k.from) * L.prog(lt, k.at, k.at + k.dur, L.eo);
      const t = k.pre + L.fmt(v, k.dec) + k.suf;
      if (t !== k.last) { k.el.textContent = t; k.last = t; }
    }
    for (const ty of s.typers) {
      const n = Math.floor(L.clamp((lt - ty.at) / ty.dur) * ty.total);
      if (n !== ty.n) {
        ty.n = n; let rem = n;
        for (const tn of ty.nodes) { const take = Math.min(rem, tn.__o.length); tn.nodeValue = tn.__o.slice(0, take); rem -= take; }
        ty.el.classList.toggle('typing', n > 0 && n < ty.total);
      }
    }
  }

  const sceneAt = T => { let i = 0; while (i < scenes.length - 1 && T >= starts[i + 1]) i++; return i; };
  let T = 0, playing = false, rate = 1, cur = -1, lastNow = performance.now();
  const lts = scenes.map(() => null);

  function frame() {
    const idx = sceneAt(T);
    scenes.forEach((s, i) => {
      const lt = i < idx ? s.dur - 0.001 : i > idx ? -1 : T - starts[i];
      if (lts[i] === lt) return;
      lts[i] = lt;
      apply(s, lt);
      if (i === idx && s.tick) s.tick(lt, s);
    });
    if (idx !== cur) {
      if (cur >= 0) scenes[cur].el.classList.remove('active');
      scenes[idx].el.classList.add('active');
      cur = idx;
      const sq = scenes[idx].seq;
      document.body.dataset.seq = sq;
      document.getElementById('chipNum').textContent = String(sq).padStart(2, '0');
      document.getElementById('chipTitle').textContent = SEQ[sq];
      document.getElementById('chip').classList.toggle('hide', !!scenes[idx].noChip);
      document.getElementById('sceneName').textContent = `${SEQ[sq]} — ${scenes[idx].title}`;
    }
    // script à l'écran
    const s = scenes[idx], lt = T - starts[idx];
    let line = '';
    if (s.say) for (const [t, txt] of s.say) { if (lt >= t) line = txt; }
    if (subsEl.textContent !== line) subsEl.textContent = line;
    // interface
    const p = T / total * 100;
    fill.style.width = p + '%'; head.style.left = p + '%';
    timeEl.textContent = `${mmss(T)} / ${mmss(total)}`;
  }

  function loop(now) {
    if (playing) {
      T += Math.min(.1, (now - lastNow) / 1000) * rate;
      if (T >= total) { T = total - 0.001; setPlaying(false); }
    }
    lastNow = now;
    frame();
    requestAnimationFrame(loop);
  }

  /* ---------- interface ---------- */
  const fill = document.getElementById('fill'), head = document.getElementById('head'), timeEl = document.getElementById('time');
  const bar = document.getElementById('bar'), tip = document.getElementById('tip'), marks = document.getElementById('marks');
  const mmss = t => { t = Math.max(0, t); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`; };
  scenes.forEach((s, i) => {
    const m = document.createElement('i');
    const major = i === 0 || scenes[i - 1].seq !== s.seq;
    if (!major) m.className = 'minor';
    m.style.left = (starts[i] / total * 100) + '%'; marks.appendChild(m);
  });
  function seek(t) { T = L.clamp(t, 0, total - 0.001); }
  function setPlaying(v) {
    playing = v; document.getElementById('bPlay').textContent = v ? '❚❚' : '▶';
    if (v) document.getElementById('start').classList.add('hidden');
    poke();
  }
  bar.addEventListener('click', e => { const r = bar.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * total); });
  bar.addEventListener('mousemove', e => {
    const r = bar.getBoundingClientRect(); const t = (e.clientX - r.left) / r.width * total; const s = scenes[sceneAt(t)];
    tip.style.left = (e.clientX - r.left) + 'px'; tip.textContent = `${mmss(t)} · ${SEQ[s.seq]} — ${s.title}`;
  });
  const go = d => { const i = L.clamp(sceneAt(T) + d, 0, scenes.length - 1); seek(starts[i]); };
  document.getElementById('bPlay').onclick = () => setPlaying(!playing);
  document.getElementById('bPrev').onclick = () => go(T - starts[sceneAt(T)] > 2 ? 0 : -1);
  document.getElementById('bNext').onclick = () => go(1);
  document.getElementById('bGo').onclick = () => setPlaying(true);
  const RATES = [.5, 1, 1.5, 2, 4];
  const setRate = r => { rate = r; document.getElementById('bRate').textContent = r + '×'; };
  document.getElementById('bRate').onclick = () => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length]);
  const toggleCC = v => {
    const on = v ?? !document.body.classList.contains('cc');
    document.body.classList.toggle('cc', on); document.getElementById('bCC').classList.toggle('on', on);
    try { localStorage.setItem('secna-cc', on ? '1' : '0'); } catch (e) { }
  };
  document.getElementById('bCC').onclick = () => toggleCC();
  const fs = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); };
  document.getElementById('bFS').onclick = fs;
  let ccInit = false; try { ccInit = localStorage.getItem('secna-cc') === '1'; } catch (e) { }
  toggleCC(ccInit);

  window.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === ' ' || k === 'k') { setPlaying(!playing); e.preventDefault(); }
    else if (k === 'ArrowRight') seek(T + (e.shiftKey ? 30 : 5));
    else if (k === 'ArrowLeft') seek(T - (e.shiftKey ? 30 : 5));
    else if (k === 'n' || k === 'N' || k === 'PageDown') go(1);
    else if (k === 'p' || k === 'P' || k === 'PageUp') go(T - starts[sceneAt(T)] > 2 ? 0 : -1);
    else if (k === 'Home') seek(0);
    else if (/^[0-5]$/.test(k)) { const i = scenes.findIndex(s => s.seq === +k); if (i >= 0) seek(starts[i]); }
    else if (k === 'c' || k === 'C') toggleCC();
    else if (k === 'f' || k === 'F') fs();
    else if (k === 'h' || k === 'H') document.body.classList.toggle('noui');
    else if (k === '+' || k === '=') setRate(RATES[Math.min(RATES.length - 1, RATES.indexOf(rate) + 1)]);
    else if (k === '-' || k === '_') setRate(RATES[Math.max(0, RATES.indexOf(rate) - 1)]);
    poke();
  });
  let idleTimer = 0;
  function poke() { document.body.classList.remove('idle'); clearTimeout(idleTimer); if (playing) idleTimer = setTimeout(() => document.body.classList.add('idle'), 2200); }
  window.addEventListener('mousemove', poke);

  /* ---------- mise à l'échelle ---------- */
  function resize() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = Math.min(vw / 1920, vh / 1080);
    stage.style.transform = `scale(${s})`;
    stage.style.left = ((vw - 1920 * s) / 2) + 'px'; stage.style.top = ((vh - 1080 * s) / 2) + 'px';
    L.setScale(s); lts.fill(null);
  }
  window.addEventListener('resize', resize); resize();

  /* point de départ : index.html#t=125 (secondes) ou #s=12 (n° de scène) */
  const h = location.hash.match(/([ts])=(\d+(?:\.\d+)?)/);
  if (h) { if (h[1] === 't') seek(+h[2]); else seek(starts[Math.min(scenes.length - 1, +h[2])] || 0); }
  if (h || /autoplay/.test(location.hash)) document.getElementById('start').classList.add('hidden');
  if (/autoplay/.test(location.hash)) setPlaying(true);
  if (/cc/.test(location.hash)) toggleCC(true);
  if (/still/.test(location.hash)) document.body.classList.add('still', 'noui'); // captures d'écran : sans transitions

  window.SECNA = { seek, get T() { return T; }, total, starts, scenes, play: () => setPlaying(true), pause: () => setPlaying(false) };
  requestAnimationFrame(loop);
})();
