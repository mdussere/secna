/* SECNA video — timeline engine.
   Every scene is a pure function of its local time t (seconds), so the
   video can be scrubbed, paused and replayed deterministically. */
(function () {
  'use strict';
  const W = 1920, H = 1080;

  const U = window.U = {
    W, H,
    clamp: (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
    lerp: (a, b, t) => a + (b - a) * t,
    prog: (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))),
    eo: t => 1 - Math.pow(1 - t, 3),
    eio: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    rng(seed) {
      let a = seed >>> 0;
      return () => {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    },
    gauss(r) { const u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },
    fmt(n, d = 0) {
      return n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/[  ]/g, ' ');
    },
    esc: s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    hl(code) {
      return U.esc(code).replace(/(#[^\n]*)|("[^"\n]*"?)|\b(import|from|def|return|for|in|as|with|print|if|else|lambda|True|False|None)\b|\b(\d[\d_.]*)\b|([A-Za-z_]\w*)(?=\()/g,
        (m, c, s, k, n, f) => c ? `<i class=t-c>${c}</i>` : s ? `<i class=t-s>${s}</i>` : k ? `<i class=t-k>${k}</i>` : n ? `<i class=t-n>${n}</i>` : `<i class=t-f>${f}</i>`);
    },
    mmss(s) { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); },
  };

  const SCENES = window.SCENES = [];
  window.scene = d => (SCENES.push(d), d);
  const CHAPTERS = window.CHAPTERS = ['Ouverture', "L'impasse", 'Clio', 'SECNA', 'Les gros, et nous', 'Ma recette'];

  const $ = s => document.querySelector(s);
  let stage, layer, canvas, ctx, q = 1, total = 0;
  let T = 0, playing = false, last = null, cur = -1, el = null, nodes = null, rate = 1;

  function layout() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    q = Math.min(2, Math.max(1, s * (devicePixelRatio || 1)));
    canvas.width = Math.round(W * q); canvas.height = Math.round(H * q);
    U.scale = s;
  }

  function locate(t) {
    for (let i = 0; i < SCENES.length; i++) if (t < SCENES[i].start + SCENES[i].len) return i;
    return SCENES.length - 1;
  }

  function mount(i) {
    cur = i;
    const s = SCENES[i];
    layer.innerHTML = '';
    el = document.createElement('div');
    el.className = 'scene ' + (s.cls || '');
    el.innerHTML = typeof s.html === 'function' ? s.html() : (s.html || '');
    layer.appendChild(el);
    s.st = {};
    if (s.build) s.build(el, s.st);
    nodes = {
      at: [...el.querySelectorAll('[data-at]')].map(n => ({ n, a: +n.dataset.at, o: n.dataset.off != null ? +n.dataset.off : Infinity, on: false })),
      cnt: [...el.querySelectorAll('[data-count]')].map(n => {
        const [f, t] = n.dataset.count.split(',').map(Number), [a, d] = (n.dataset.c || '0,1').split(',').map(Number);
        return { n, f, t, a, d, dec: +(n.dataset.dec || 0), v: null };
      }),
      typ: [...el.querySelectorAll('[data-type]')].map(n => {
        const [a, d] = n.dataset.type.split(',').map(Number);
        return { n, a, d, full: n.textContent, code: n.classList.contains('code'), k: -1 };
      }),
    };
    nodes.typ.forEach(o => { o.n.textContent = ''; });
    // HUD
    $('#chap').textContent = s.ch ? String(s.ch).padStart(2, '0') + ' · ' + CHAPTERS[s.ch] : '';
    $('#brand').style.opacity = s.noBrand ? 0 : 1;
    const rail = $('#rail');
    rail.classList.toggle('on', !!s.rail);
    [...rail.children].forEach((n, j) => {
      const L = 'SECNA'[j];
      n.className = (L === 'S' || L === 'N') ? 'llm' : 'ds';
      if (s.rail && (s.rail === 'all' || s.rail.includes(L))) n.classList.add('act');
    });
    $('#illus').classList.toggle('on', !!s.illus);
    $('#src').textContent = s.src || '';
    updateNotes();
  }

  function render() {
    const i = locate(T);
    if (i !== cur) mount(i);
    const s = SCENES[i];
    const lt = U.clamp((T - s.start) * s.dur / s.len, 0, s.dur);
    const fi = s.noFadeIn ? 1 : U.clamp(lt / .45), fo = s.noFadeOut ? 1 : U.clamp((s.dur - lt) / .45);
    const fade = Math.min(fi, fo);
    el.style.opacity = fade;
    for (const a of nodes.at) {
      const on = lt >= a.a && lt < a.o;
      if (on !== a.on) { a.on = on; a.n.classList.toggle('on', on); }
    }
    for (const c of nodes.cnt) {
      const v = U.lerp(c.f, c.t, U.eo(U.prog(lt, c.a, c.a + c.d)));
      const txt = U.fmt(v, c.dec);
      if (txt !== c.v) { c.v = txt; c.n.textContent = txt; }
    }
    for (const o of nodes.typ) {
      const p = U.prog(lt, o.a, o.a + o.d);
      const k = Math.round(p * o.full.length);
      const typing = p > 0 && p < 1;
      const key = k + (typing ? 'c' : '');
      if (key !== o.k) {
        o.k = key;
        const sub = o.full.slice(0, k);
        o.n.innerHTML = (o.code ? U.hl(sub) : U.esc(sub)) + (typing ? '<span class="caret"></span>' : '');
      }
    }
    if (s.update) s.update(lt, el, s.st);
    ctx.setTransform(q, 0, 0, q, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (s.draw) { ctx.save(); ctx.globalAlpha = fade; s.draw(ctx, lt, s.st); ctx.restore(); }
    // UI
    $('#prog').style.width = (T / total * 100) + '%';
    $('#tc').textContent = U.mmss(T) + ' / ' + U.mmss(total);
    $('#scn').textContent = (s.ch ? CHAPTERS[s.ch] + ' — ' : '') + (s.title || s.id);
    if (notesOn) $('#notesTime').textContent = 'scène ' + U.mmss(lt) + ' / ' + U.mmss(s.dur) + '   ·   global ' + U.mmss(T);
  }

  function frame(now) {
    if (playing && last != null) {
      T += Math.min(.1, (now - last) / 1000) * rate;
      if (T >= total) { T = total - 0.001; setPlaying(false); }
    }
    last = now;
    render();
    requestAnimationFrame(frame);
  }

  function setPlaying(p) {
    playing = p;
    $('#play').innerHTML = p ? '&#10074;&#10074;' : '&#9654;';
    poke();
  }
  function seek(t) { T = U.clamp(t, 0, total - 0.001); if (locate(T) !== cur) cur = -1; else { cur = -1; } }

  // ---- notes ----
  let notesOn = false;
  function updateNotes() {
    if (!notesOn || cur < 0) return;
    const s = SCENES[cur];
    $('#notesT').textContent = s.title || s.id;
    $('#notesB').innerHTML = (s.narr || '—').split('\n').map(p => '<p>' + U.esc(p) + '</p>').join('');
  }

  // ---- ui idle ----
  let idleTimer = null;
  function poke() {
    const ui = $('#ui');
    ui.classList.remove('idle'); document.body.classList.remove('nocursor');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (playing) { ui.classList.add('idle'); document.body.classList.add('nocursor'); } }, 2200);
  }

  function start() {
    stage = $('#stage'); layer = $('#layer'); canvas = $('#fx'); ctx = canvas.getContext('2d');
    const TIMING = window.TIMING || {};
    let acc = 0;
    SCENES.forEach(s => { s.len = TIMING[s.id] || s.dur; s.start = acc; acc += s.len; });
    total = acc;
    window.Engine.total = total;
    layout(); addEventListener('resize', layout);

    // ticks
    const ticks = $('#ticks');
    let lastCh = -1;
    SCENES.forEach(s => {
      if (s.ch !== lastCh) {
        lastCh = s.ch;
        const x = s.start / total * 100;
        ticks.insertAdjacentHTML('beforeend', `<i style="left:${x}%"></i><span style="left:${x}%">${s.ch ? String(s.ch).padStart(2, '0') + ' ' + CHAPTERS[s.ch] : ''}</span>`);
      }
    });
    const bar = $('#bar'), tip = $('#tip');
    const tAt = e => { const r = bar.getBoundingClientRect(); return U.clamp((e.clientX - r.left) / r.width) * total; };
    let drag = false;
    bar.addEventListener('pointerdown', e => { drag = true; bar.setPointerCapture(e.pointerId); seek(tAt(e)); });
    bar.addEventListener('pointermove', e => {
      const t = tAt(e), s = SCENES[locate(t)];
      tip.style.display = 'block'; tip.style.left = (t / total * 100) + '%';
      tip.textContent = U.mmss(t) + ' · ' + (s.title || s.id);
      if (drag) seek(t);
    });
    bar.addEventListener('pointerup', () => { drag = false; });
    bar.addEventListener('pointerleave', () => { tip.style.display = 'none'; });
    $('#play').onclick = () => setPlaying(!playing);
    $('#fsBtn').onclick = toggleFs;
    $('#notesBtn').onclick = toggleNotes;
    const go = () => { $('#start').classList.add('hidden'); setPlaying(true); };
    $('#startBtn').onclick = go;
    addEventListener('mousemove', poke);

    addEventListener('keydown', e => {
      const k = e.key;
      if (k === ' ' || k === 'k') { e.preventDefault(); if (!$('#start').classList.contains('hidden')) go(); else setPlaying(!playing); }
      else if (k === 'ArrowRight') seek(T + (e.shiftKey ? 30 : 5));
      else if (k === 'ArrowLeft') seek(T - (e.shiftKey ? 30 : 5));
      else if (k === ']') seek(SCENES[Math.min(SCENES.length - 1, locate(T) + 1)].start);
      else if (k === '[') { const i = locate(T); const s = SCENES[i]; seek(T - s.start > 1.5 ? s.start : SCENES[Math.max(0, i - 1)].start); }
      else if (/^[0-5]$/.test(k)) { const s = SCENES.find(x => (x.ch || 0) === +k); if (s) seek(s.start); }
      else if (k === 'f' || k === 'F') toggleFs();
      else if (k === 'n' || k === 'N') toggleNotes();
      else if (k === 'h' || k === 'H') $('#ui').classList.toggle('off');
      else if (k === 'Home') seek(0);
      poke();
    });

    // URL options: #t=123  ?autoplay  ?rec (hide all UI, for screen recording)
    const params = new URLSearchParams(location.search);
    const m = location.hash.match(/t=([\d.]+)/);
    if (m) T = U.clamp(+m[1], 0, total - .001);
    if (params.has('rec')) document.body.classList.add('rec');
    if (params.has('shot')) document.body.classList.add('shot', 'rec');
    if (params.has('autoplay') || params.has('rec')) go();
    else if (m) { $('#start').classList.add('hidden'); }
    requestAnimationFrame(frame);
  }
  function toggleFs() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
  function toggleNotes() { notesOn = !notesOn; $('#notes').classList.toggle('on', notesOn); updateNotes(); }

  window.Engine = { start, seek, get t() { return T; }, play: () => setPlaying(true), pause: () => setPlaying(false), renderAt(t) { seek(t); render(); } };
})();
