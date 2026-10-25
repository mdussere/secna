/* SECNA — moteur de la vidéo.
 * Tout est une fonction du temps : chaque scène déclare des « beats » (attributs data-in / data-out)
 * et une fonction render(t, ctx) pour le canvas. On peut donc lire, mettre en pause et se déplacer
 * n'importe où dans la vidéo. */
(function () {
  const W = 1920, H = 1080;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = {
    out: t => 1 - Math.pow(1 - t, 3),
    inout: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    lin: t => t,
    back: t => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  };
  const P = (t, a, d = 1) => clamp((t - a) / d);
  const K = window.K = {
    W, H, clamp, ease, P,
    EP: (t, a, d = 1) => ease.out(P(t, a, d)),
    IO: (t, a, d = 1) => ease.inout(P(t, a, d)),
    lerp: (a, b, t) => a + (b - a) * t,
    scenes: [],
    scene(def) { this.scenes.push(def); },
    fmt(v, dec = 0) { return v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace(/ /g, ' '); },
  };

  // ------------------------------------------------------------------ beats
  function collectBeats(root) {
    const list = [];
    root.querySelectorAll('[data-in]').forEach(el => {
      const ds = el.dataset;
      const fx = ds.fx || 'up';
      if (fx !== 'none') el.classList.add('fx-' + fx);
      const b = { el, in: +ds.in, out: ds.out != null ? +ds.out : null, d: ds.d ? +ds.d : .9, hidden: false };
      if (ds.type != null) {
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        b.nodes = []; let n, total = 0;
        while ((n = w.nextNode())) { b.nodes.push({ n, s: n.nodeValue }); total += n.nodeValue.length; }
        b.len = total; b.td = ds.type ? +ds.type : Math.max(.6, total * .028); b.lastN = -1;
      }
      if (ds.count != null) {
        b.count = +ds.count; b.dec = ds.dec ? +ds.dec : 0; b.cd = ds.cd ? +ds.cd : 1.6;
        b.pre = ds.pre || ''; b.suf = ds.suf || ''; b.from = ds.from ? +ds.from : 0;
      }
      list.push(b);
    });
    return list;
  }
  function updateBeats(beats, t) {
    for (const b of beats) {
      const pi = ease.out(P(t, b.in, b.d));
      const po = b.out != null ? ease.inout(P(t, b.out, .55)) : 0;
      const v = pi * (1 - po);
      if (v <= .001) { if (!b.hidden) { b.el.style.visibility = 'hidden'; b.hidden = true; } }
      else if (b.hidden) { b.el.style.visibility = ''; b.hidden = false; }
      const s = b.el.style;
      s.setProperty('--pi', pi.toFixed(4)); s.setProperty('--po', po.toFixed(4)); s.setProperty('--p', v.toFixed(4));
      if (b.nodes) {
        const k = Math.floor(b.len * P(t, b.in, b.td));
        if (k !== b.lastN) {
          let left = k;
          for (const o of b.nodes) { const take = clamp(left, 0, o.s.length); o.n.nodeValue = o.s.slice(0, take); left -= take; }
          b.lastN = k;
          b.el.classList.toggle('typing', t >= b.in && k < b.len);
        }
      }
      if (b.count != null) {
        const val = K.lerp(b.from, b.count, ease.out(P(t, b.in, b.cd)));
        b.el.textContent = b.pre + K.fmt(val, b.dec) + b.suf;
      }
    }
  }

  // ------------------------------------------------------------------ boot
  let T = 0, playing = false, last = 0, total = 0, cur = -1, audio = null, rate = 1;
  let stage, ctx, canvas, hudChap, hudLine, chapters = [];
  const qs = new URLSearchParams(location.search);

  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }

  function boot() {
    stage = document.getElementById('stage');
    canvas = document.getElementById('fx'); canvas.width = W; canvas.height = H;
    ctx = canvas.getContext('2d');
    hudChap = document.getElementById('hud-chap'); hudLine = document.querySelector('#hud-line i');
    const host = document.getElementById('scenes');
    let acc = 0;
    K.scenes.forEach((s, i) => {
      s.i = i; s.start = acc; acc += s.dur;
      s.root = document.createElement('div'); s.root.className = 'scene'; s.root.dataset.id = s.id;
      host.appendChild(s.root);
      s.render = s.build ? s.build(s.root, s) : null;
      s.beats = collectBeats(s.root);
      if (s.chapter != null && (i === 0 || K.scenes[i - 1].chapter !== s.chapter)) chapters.push({ t: s.start, name: s.chapName, n: s.chapter });
    });
    total = acc; K.total = total;
    fit(); addEventListener('resize', fit);
    if (qs.has('rec')) document.body.classList.add('rec');
    if (qs.has('still')) { document.body.classList.add('rec'); document.getElementById('start').classList.add('gone'); }
    if (qs.get('audio')) {
      audio = new Audio(qs.get('audio')); audio.preload = 'auto';
      audio.addEventListener('ended', () => { playing = false; });
    }
    const t0 = parseFloat(qs.get('t') || (location.hash.match(/t=([\d.]+)/) || [])[1] || 0);
    T = clamp(t0 || 0, 0, total);
    if (qs.get('scene')) { const s = K.scenes.find(s => s.id === qs.get('scene')); if (s) T = s.start + (+qs.get('lt') || 0); }
    buildControls();
    draw(T);
    requestAnimationFrame(loop);
  }

  function sceneAt(t) {
    for (let i = K.scenes.length - 1; i >= 0; i--) if (t >= K.scenes[i].start) return i;
    return 0;
  }

  function draw(t) {
    const i = Math.min(sceneAt(t), K.scenes.length - 1);
    const s = K.scenes[i];
    if (i !== cur) {
      if (cur >= 0) K.scenes[cur].root.style.display = 'none';
      s.root.style.display = 'block'; cur = i;
      canvas.style.zIndex = s.canvasTop ? 2 : 0;
      updateScript(s);
    }
    const lt = Math.min(t - s.start, s.dur);
    const fi = s.fadeIn != null ? s.fadeIn : .45, fo = s.fadeOut != null ? s.fadeOut : .45;
    const fade = Math.min(fi > 0 ? P(lt, 0, fi) : 1, fo > 0 ? 1 - P(lt, s.dur - fo, fo) : 1);
    s.root.style.opacity = fade; canvas.style.opacity = fade;
    updateBeats(s.beats, lt);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
    if (s.render) { ctx.save(); s.render(lt, ctx, s); ctx.restore(); }
    hudChap.textContent = s.chapName ? `${String(s.chapter).padStart(2, '0')} — ${s.chapName}` : '';
    hudLine.style.width = (t / total * 100) + '%';
    updateControls(t);
  }

  function loop(now) {
    const dt = last ? (now - last) / 1000 : 0; last = now;
    if (playing) {
      if (audio && !audio.paused) T = audio.currentTime;
      else T += dt * rate;
      if (T >= total) { T = total; playing = false; if (audio) audio.pause(); }
    }
    draw(T);
    requestAnimationFrame(loop);
  }

  // ------------------------------------------------------------------ contrôles
  let el = {};
  function seek(t) {
    T = clamp(t, 0, total);
    if (audio) { try { audio.currentTime = T; } catch (e) { } }
  }
  function play(on) {
    playing = on == null ? !playing : on;
    if (T >= total && playing) seek(0);
    if (audio) { if (playing) { audio.currentTime = T; audio.play().catch(() => { }); } else audio.pause(); }
    el.play.textContent = playing ? '❚❚ pause' : '► lecture';
    poke();
  }
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  function buildControls() {
    el.ctl = document.getElementById('controls');
    el.scrub = document.getElementById('scrub');
    el.fill = el.scrub.querySelector('.fill'); el.knob = el.scrub.querySelector('.knob'); el.tip = el.scrub.querySelector('.tip');
    el.play = document.getElementById('ctl-play'); el.time = document.getElementById('ctl-time');
    el.sel = document.getElementById('ctl-scene');
    chapters.forEach(c => {
      const m = document.createElement('div'); m.className = 'mark'; m.style.left = (c.t / total * 100) + '%'; el.scrub.appendChild(m);
    });
    K.scenes.forEach(s => {
      const o = document.createElement('option'); o.value = s.i;
      o.textContent = `${mmss(s.start)}  ${s.chapter ? s.chapter + '.' : ''} ${s.title || s.id}`; el.sel.appendChild(o);
    });
    el.sel.addEventListener('change', () => { seek(K.scenes[+el.sel.value].start + .01); el.sel.blur(); });
    el.play.addEventListener('click', () => play());
    document.getElementById('ctl-prev').addEventListener('click', () => jumpScene(-1));
    document.getElementById('ctl-next').addEventListener('click', () => jumpScene(1));
    document.getElementById('ctl-script').addEventListener('click', () => toggleScript());
    document.getElementById('ctl-fs').addEventListener('click', () => toggleFS());
    const fromX = x => { const r = el.scrub.getBoundingClientRect(); return clamp((x - r.left) / r.width) * total; };
    let drag = false;
    el.scrub.addEventListener('pointerdown', e => { drag = true; el.scrub.setPointerCapture(e.pointerId); seek(fromX(e.clientX)); });
    el.scrub.addEventListener('pointermove', e => {
      const t = fromX(e.clientX); if (drag) seek(t);
      const s = K.scenes[sceneAt(t)];
      el.tip.style.display = 'block'; el.tip.style.left = (t / total * 100) + '%'; el.tip.textContent = `${mmss(t)} · ${s.title || s.id}`;
    });
    el.scrub.addEventListener('pointerup', () => { drag = false; });
    el.scrub.addEventListener('pointerleave', () => { el.tip.style.display = 'none'; });
    const start = document.getElementById('start');
    start.addEventListener('click', () => { start.classList.add('gone'); play(true); });
    addEventListener('mousemove', poke);
    addEventListener('keydown', onKey);
    poke();
  }
  let hideTimer = 0;
  function poke() {
    el.ctl.classList.remove('hidden'); document.body.classList.remove('hide-cursor');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (playing) { el.ctl.classList.add('hidden'); document.body.classList.add('hide-cursor'); } }, 2200);
  }
  function updateControls(t) {
    if (!el.fill) return;
    const pc = (t / total * 100) + '%';
    el.fill.style.width = pc; el.knob.style.left = pc;
    el.time.textContent = `${mmss(t)} / ${mmss(total)}`;
    if (+el.sel.value !== cur && document.activeElement !== el.sel) el.sel.value = cur;
  }
  function jumpScene(d) {
    const i = sceneAt(T);
    const s = K.scenes[i];
    if (d < 0 && T - s.start > 1.5) seek(s.start);
    else seek(K.scenes[clamp(i + d, 0, K.scenes.length - 1)].start);
  }
  function toggleScript() { document.getElementById('script').classList.toggle('on'); }
  function updateScript(s) {
    const box = document.getElementById('script');
    box.innerHTML = `<h4>Voix off — ${s.title || s.id}</h4>${(s.say || '—').split('\n').map(p => `<p>${p}</p>`).join('')}`;
  }
  function toggleFS() {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => { });
  }
  function onKey(e) {
    const k = e.key;
    const start = document.getElementById('start');
    if (!start.classList.contains('gone') && (k === ' ' || k === 'Enter')) { start.classList.add('gone'); play(true); e.preventDefault(); return; }
    if (k === ' ' || k === 'k') { play(); e.preventDefault(); }
    else if (k === 'ArrowRight') seek(T + (e.shiftKey ? 30 : 5));
    else if (k === 'ArrowLeft') seek(T - (e.shiftKey ? 30 : 5));
    else if (k === 'l') seek(T + 10);
    else if (k === 'j') seek(T - 10);
    else if (k === '.') seek(T + 1 / 30);
    else if (k === ',') seek(T - 1 / 30);
    else if (k === 'n' || k === 'PageDown' || k === 'ArrowDown') { jumpScene(1); e.preventDefault(); }
    else if (k === 'p' || k === 'PageUp' || k === 'ArrowUp') { jumpScene(-1); e.preventDefault(); }
    else if (k === 'Home' || k === '0') seek(0);
    else if (k === 'End') seek(total - .01);
    else if (/^[1-5]$/.test(k)) { const c = chapters.find(c => c.n === +k); if (c) seek(c.t); }
    else if (k === 'f') toggleFS();
    else if (k === 't') toggleScript();
    else if (k === 'h' || k === '?') document.getElementById('help').classList.toggle('on');
    else if (k === 'r') document.body.classList.toggle('rec');
    else if (k === '[') { rate = Math.max(.25, rate / 2); }
    else if (k === ']') { rate = Math.min(4, rate * 2); }
    else return;
    if (start && !start.classList.contains('gone') && k !== 'h' && k !== '?') start.classList.add('gone');
    poke();
  }

  addEventListener('error', e => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:10px;top:10px;z-index:99;background:#b00;color:#fff;font:14px monospace;padding:8px;max-width:90vw';
    d.textContent = 'Erreur : ' + e.message + ' @ ' + (e.filename || '').split('/').pop() + ':' + e.lineno;
    document.body.appendChild(d);
  });
  addEventListener('DOMContentLoaded', () => {
    // les polices doivent être prêtes avant la première mesure de texte sur canvas
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(boot);
  });
})();
