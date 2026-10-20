#!/usr/bin/env node
// Build the deck: node build.mjs <html|pdf|png|standalone|all>
//   html        deck.html (live-reload: add --watch)
//   pdf         dist/deck.pdf (needs a local Chrome)
//   png         review/deck.NNN.png — one image per slide, to read every slide back
//   standalone  dist/deck-standalone.html — every local asset inlined, one shareable file
//   all         pdf + png + standalone
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const MARP = createRequire(import.meta.url).resolve("@marp-team/marp-cli/marp-cli.js");
const BASE = ["--no-stdin", "--html", "--theme", "theme/secna.css", "deck.md"];

function marp(args) {
  const res = spawnSync(process.execPath, [MARP, ...BASE, ...args], { cwd: DIR, stdio: "inherit" });
  if (res.status !== 0) { console.error(`marp failed (${res.status})`); process.exit(1); }
}
const html = (extra = []) => marp(["-o", "deck.html", ...extra]);
const pdf = () => { mkdirSync(join(DIR, "dist"), { recursive: true }); marp(["--allow-local-files", "--pdf", "-o", "dist/deck.pdf"]); };
const png = () => { mkdirSync(join(DIR, "review"), { recursive: true }); marp(["--allow-local-files", "--images", "png", "-o", "review/deck.png"]); };

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".mp4": "video/mp4", ".webm": "video/webm", ".woff2": "font/woff2" };

// marp only inlines local files for PDF; for one shareable HTML file we inline them ourselves.
function standalone() {
  html();
  const page = readFileSync(join(DIR, "deck.html"), "utf8");
  const inline = (ref) => {
    if (/^(https?:|data:|#|mailto:|\/\/)/.test(ref)) return null;
    const file = resolve(DIR, ref.split("?")[0]);
    if (!existsSync(file) || !statSync(file).isFile()) return null;
    return `data:${MIME[extname(file).toLowerCase()] ?? "application/octet-stream"};base64,${readFileSync(file).toString("base64")}`;
  };
  const out = page
    .replace(/(src|href|poster)="([^"]+)"/g, (m, a, ref) => { const d = inline(ref); return d ? `${a}="${d}"` : m; })
    .replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, ref) => { const d = inline(ref); return d ? `url(${q}${d}${q})` : m; });
  mkdirSync(join(DIR, "dist"), { recursive: true });
  writeFileSync(join(DIR, "dist", "deck-standalone.html"), out);
  console.log(`dist/deck-standalone.html: ${(statSync(join(DIR, "dist", "deck-standalone.html")).size / 1048576).toFixed(1)} MB`);
}

const [cmd = "all", ...rest] = process.argv.slice(2);
switch (cmd) {
  case "html": html(rest); break;
  case "pdf": pdf(); break;
  case "png": png(); break;
  case "standalone": standalone(); break;
  case "all": pdf(); png(); standalone(); break;
  default: console.error("usage: node build.mjs <html|pdf|png|standalone|all>"); process.exit(1);
}
