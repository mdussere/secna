// Usage: node capture.mjs frames <t1,t2,...>   -> frames/t_XX.png
//        node capture.mjs all <outdir> [fps]    -> outdir/00000.png ... (full frame dump)
// MP4:   mkdir render && node capture.mjs all render 30, then
//        ffmpeg -framerate 30 -i render/%05d.png -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart secna_90s.mp4
// Node 22 (mise exec node@22 --); puppeteer-core comes with presentation/node_modules (npm ci); Chrome at the macOS path below.
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../node_modules/'));
const puppeteer = require('puppeteer-core');
const here = path.dirname(fileURLToPath(import.meta.url));
const [mode, arg, fpsArg] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(here, 'index.html') + '#t=0&clean');
await page.evaluate(() => document.fonts.ready);
const shot = async (t, file) => {
  await page.evaluate(t => window.seek(t), t);
  await page.screenshot({ path: file, type: 'png' });
};
if (mode === 'frames') {
  for (const t of arg.split(',').map(Number)) await shot(t, path.join(here, 'frames', `t_${String(t).padStart(4, '0')}.png`));
} else {
  const fps = +(fpsArg || 30), n = Math.round(await page.evaluate(() => window.DUR) * fps);
  for (let i = 0; i < n; i++) {
    await shot(i / fps, path.join(arg, String(i).padStart(5, '0') + '.png'));
    if (i % 300 === 0) console.log('frame', i);
  }
}
await browser.close();
