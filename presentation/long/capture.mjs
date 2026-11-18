// The talk's stills, its timeline of events, and the video.
//   node capture.mjs sheet [id,id,…]   frames/NN_id_cK.png at every spoken line, and frames/review.html:
//                                      each still beside the sentence said over it, sequence by sequence
//   node capture.mjs pauses            frames/pauses/pNNN.png at every pause of the live talk (its number in the
//                                      corner), and frames/pauses.html: each still beside the line it ends
//   node capture.mjs at <t1,t2,…>      frames/t_XXXX.png at those times (seconds)
//   node capture.mjs talk [fps] [workers]  render/secna_talk.mp4: the talk with its recorded voice, as the player plays it
//                                      (worklines/secna_voice/out/talk/seg_NN.wav as recorded), holds alive, over the
//                                      looping ambience bed (out/night/chimes.wav); resumable; + a lighter …_share.mp4
// Node 22+; puppeteer-core comes with presentation/node_modules (npm ci); Chrome at the macOS path below.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { once } from 'events';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.resolve(here, '../node_modules/'));
const puppeteer = require('puppeteer-core');
const [mode = 'sheet', arg] = process.argv.slice(2);
const out = path.join(here, mode === 'talk' ? 'render' : 'frames'); fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--hide-scrollbars', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'], protocolTimeout: 600000 });
const page = await browser.newPage();
page.on('pageerror', e => console.error('page error:', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'index.html') + '#t=0&clean&novoice&still');
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 400));
const shot = async (t, file) => { await page.evaluate(t => window.seek(t), t); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r()))); await page.screenshot({ path: file, type: 'png' }); };
const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const openPage = async () => {
  const pg = await browser.newPage();
  pg.on('pageerror', e => console.error('page error:', e.message));
  await pg.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await pg.goto('file://' + path.join(here, 'index.html') + '#t=0&clean&novoice&still');
  await pg.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 400));
  return pg;
};
if (mode === 'talk') {
  // The talk with its recorded voice, as the player shows it: clip n plays (at the player's fixed speed) while the
  // screen moves to pause n, then holds — still alive, on the ambient clock — until the clip ends. Every frame is
  // a pure function of (T, ambient seconds), so the render is exact and resumable, in 30-second chunks.
  const fps = +(arg || 30), workers = +(process.argv[4] || 1), CH = 30 * fps, RATE = 1, GAP = .6, LEAD = 1, TAIL = 2.5;
  const clips = path.resolve(here, '../../worklines/secna_voice/out/talk');
  const stops = await page.evaluate(() => window.STOPS);
  const wavSeconds = f => { const b = fs.readFileSync(f); let o = 12, rate = 0; while (o < b.length) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') rate = b.readUInt32LE(o + 16); if (id === 'data') return sz / rate; o += 8 + sz + (sz & 1); } throw new Error('no data chunk in ' + f); };
  let at = LEAD, amb = 0, prev = 0;
  const segs = stops.map(p => { const f = path.join(clips, `seg_${String(p.n).padStart(2, '0')}.wav`), anim = p.t - prev, len = Math.round((Math.max(anim, wavSeconds(f) / RATE) + GAP) * fps) / fps;
    const s = { n: p.n, f, at, from: prev, anim, len, amb }; at += len; amb += len - anim; prev = p.t; return s; });
  const total = at, test = +process.env.SECNA_VIDEO_SECONDS || 0, n = Math.ceil((test || total + TAIL) * fps);
  const state = t => { if (t < LEAD) return { T: 0, A: t, fade: 0 }; let s = segs[segs.length - 1]; for (const q of segs) if (t < q.at + q.len) { s = q; break; }
    const e = Math.min(t - s.at, s.len + TAIL); return { T: s.from + Math.min(e, s.anim), A: LEAD + s.amb + Math.max(0, e - s.anim), fade: Math.max(0, Math.min(1, (t - total - .8) / 1.4)) }; };
  const dir = path.join(out, test ? 'chunks_talk_test' : 'chunks_talk'); fs.mkdirSync(dir, { recursive: true });
  const run = (cmd, args) => new Promise((res, rej) => spawn(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] }).on('close', c => c ? rej(new Error(cmd + ' ' + c)) : res()));
  // the sound: each clip at the player's speed, padded to its place in the timeline; under it, the bed, looped
  const vdir = path.join(dir, 'voice'); fs.mkdirSync(vdir, { recursive: true });
  await run('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-t', String(LEAD), '-i', 'anullsrc=r=48000:cl=stereo', path.join(vdir, 'lead.wav')]);
  for (const s of segs) await run('ffmpeg', ['-loglevel', 'error', '-y', '-i', s.f, '-af', RATE === 1 ? 'apad' : `atempo=${RATE},apad`, '-t', s.len.toFixed(6), '-ar', '48000', '-ac', '2', path.join(vdir, `v${String(s.n).padStart(2, '0')}.wav`)]);
  await run('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-t', String(TAIL + .5), '-i', 'anullsrc=r=48000:cl=stereo', path.join(vdir, 'tail.wav')]);   // silence under the closing fade
  fs.writeFileSync(path.join(vdir, 'list.txt'), ["file 'lead.wav'", ...segs.map(s => `file 'v${String(s.n).padStart(2, '0')}.wav'`), "file 'tail.wav'"].join('\n') + '\n');
  const voice = path.join(dir, 'voice.wav');
  await run('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(vdir, 'list.txt'), '-c', 'copy', voice]);
  // the bed: its own level (−34 LUFS, about 15 dB under the voice), no ducking; in with the lead, out with the closing fade
  const bed = path.resolve(here, '../../worklines/secna_voice/out/night/chimes.wav'), sound = path.join(dir, 'sound.wav');
  await run('ffmpeg', ['-loglevel', 'error', '-y', '-i', voice, '-stream_loop', '-1', '-i', bed, '-filter_complex',
    `[1:a]aresample=48000,afade=t=in:d=${LEAD + 1.5},afade=t=out:st=${total.toFixed(3)}:d=2.5[b];[0:a][b]amix=inputs=2:normalize=0:duration=first[m]`,
    '-map', '[m]', '-c:a', 'pcm_s16le', sound]);
  fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify({ fps, rate: RATE, total, segments: segs.map(({ n, at, len, anim }) => ({ n, at: +at.toFixed(3), len: +len.toFixed(3), anim: +anim.toFixed(3) })) }, null, 1));
  console.log(`talk: ${segs.length} clips at ×${RATE} · ${fmt(total)} · ${n} frames at ${fps} fps · ${workers} worker(s)`);
  const chunks = Math.ceil(n / CH), name = c => path.join(dir, `chunk_${String(c).padStart(3, '0')}.mp4`);
  let next = 0; const t0 = Date.now(); let made = 0;
  await Promise.all([...Array(Math.min(workers, chunks))].map(async () => {
    const pg = await openPage();
    for (let c = next++; c < chunks; c = next++) {
      if (fs.existsSync(name(c) + '.done')) continue;
      const a = c * CH, b = Math.min(n, a + CH);
      const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), name(c)], { stdio: ['pipe', 'inherit', 'inherit'] });   // a master: large; compress a copy to share
      for (let k = a; k < b; k++) {
        await pg.evaluate(st => { window.SECNA.amb(st.A); window.seek(st.T);
          let d = document.getElementById('capfade');
          if (!d) { d = document.createElement('div'); d.id = 'capfade'; d.style.cssText = 'position:fixed;inset:0;background:#000;pointer-events:none;z-index:99;opacity:0'; document.body.appendChild(d); }
          d.style.opacity = String(st.fade); }, state(k / fps));
        const buf = await pg.screenshot({ type: 'jpeg', quality: 92 });
        if (!ff.stdin.write(buf)) await once(ff.stdin, 'drain');
      }
      ff.stdin.end(); await once(ff, 'close');
      fs.writeFileSync(name(c) + '.done', ''); made += b - a;
      const el = (Date.now() - t0) / 1000;
      console.log(`chunk ${c + 1}/${chunks} · ${el.toFixed(0)} s · ${(made / el).toFixed(1)} frames/s`);
    }
    await pg.close();
  }));
  fs.writeFileSync(path.join(dir, 'list.txt'), [...Array(chunks)].map((_, c) => `file '${path.basename(name(c))}'`).join('\n') + '\n');
  const final = path.join(out, test ? 'secna_talk_test.mp4' : 'secna_talk.mp4');
  await run('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-i', sound,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', final]);
  console.log(`→ ${path.relative(here, final)} · ${n} frames at ${fps} fps · ${((Date.now() - t0) / 60000).toFixed(1)} min`);
  if (!test) {   // the master is large (crf 18): a lighter copy to share
    const share = final.replace('.mp4', '_share.mp4');
    await run('ffmpeg', ['-loglevel', 'error', '-y', '-i', final, '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', share]);
    console.log(`→ ${path.relative(here, share)}`);
  }
} else if (mode === 'pauses') {   // the live talk: what the screen holds at each pause
  const stops = await page.evaluate(() => window.STOPS), seqs = await page.evaluate(() => window.SEQS);
  const byId = Object.fromEntries(seqs.map(s => [s.id, s])), dir = path.join(out, 'pauses'); fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) if (/^p\d{3}\.png$/.test(f) && +f.slice(1, 4) > stops.length) fs.unlinkSync(path.join(dir, f));   // stills of pauses that are gone
  await page.evaluate(() => { document.body.classList.remove('clean'); document.getElementById('bar').style.display = 'none'; });
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let html = `<!doctype html><meta charset="utf-8"><title>SECNA — the pauses</title><style>
body{font:15px/1.45 -apple-system,sans-serif;background:#111;color:#ddd;margin:0;padding:24px 32px}
.r{display:grid;grid-template-columns:640px 1fr;gap:18px;margin:10px 0;align-items:start}
img{width:640px;border-radius:4px;display:block} .t{font-size:17px;color:#eee}
.t b{font:600 22px ui-monospace,monospace;color:#E8FF3A;margin-right:10px} .t i{color:#888;font-style:normal;font-family:ui-monospace,monospace;font-size:13px}
</style><h1>SECNA — the ${stops.length} pauses of the live talk</h1><p>What the screen holds at each pause, beside the line of the draft narration it ends.</p>`;
  for (const p of stops) {
    const f = `p${String(p.n).padStart(3, '0')}.png`, l = byId[p.sid].lines[p.line];
    await shot(p.t, path.join(dir, f));
    html += `<div class="r"><img src="pauses/${f}" loading="lazy"><div class="t"><b>${p.n}</b><i>${p.sid} · ${fmt(p.t)}</i><br>${esc(l.text)}</div></div>`;
  }
  fs.writeFileSync(path.join(out, 'pauses.html'), html);
  console.log(`→ frames/pauses.html · ${stops.length} pauses`);
} else if (mode === 'at') {
  for (const t of arg.split(',').map(Number)) await shot(t, path.join(out, `t_${String(t.toFixed(1)).padStart(6, '0')}.png`));
} else {
  const seqs = await page.evaluate(() => window.SEQS), want = arg ? arg.split(',') : null;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let html = `<!doctype html><meta charset="utf-8"><title>SECNA — review sheet</title><style>
body{font:15px/1.45 -apple-system,sans-serif;background:#111;color:#ddd;margin:0;padding:24px 32px}
h2{font-size:20px;margin:36px 0 4px;color:#fff} .n{color:#888;font-style:italic;margin:0 0 12px}
.r{display:grid;grid-template-columns:640px 1fr;gap:18px;margin:10px 0;align-items:start}
img{width:640px;border-radius:4px;display:block} .t{font-size:17px;color:#eee} .t i{color:#E8FF3A;font-style:normal;font-family:ui-monospace,monospace;font-size:13px;margin-right:8px}
</style><h1>SECNA — the talk, line by line</h1><p>${seqs.length} sequences · ${fmt(seqs.at(-1).off + seqs.at(-1).dur)} narrated</p>`;
  let part = 0;
  for (const [k, s] of seqs.entries()) {
    if (want && !want.includes(s.id)) continue;
    if (s.part !== part) { part = s.part; html += `<h1>Part ${part}</h1>`; }
    html += `<h2>${k + 1} · ${esc(s.title)} <small style="color:#888">${s.id} · ${s.dur.toFixed(1)} s</small></h2><p class="n">${esc(s.notes.join(' '))}</p>`;
    for (const [j, l] of s.lines.entries()) {
      const t = l.t + Math.min(l.d * .8, l.d - .1), file = `${String(k + 1).padStart(2, '0')}_${s.id}_c${j}.png`;
      await shot(t, path.join(out, file));
      html += `<div class="r"><img src="${file}" loading="lazy"><div class="t"><i>${fmt(l.t)}</i>${esc(l.text)}</div></div>`;
    }
    console.log(`${s.id} · ${s.lines.length} stills`);
  }
  fs.writeFileSync(path.join(out, 'review.html'), html);
  console.log('→ frames/review.html');
}
await browser.close();
