// Build the SECNA talk deck as a native PowerPoint file (pptxgenjs, structured deck).
// Content: references/0302_09_slide_proposals.md (recommended picks) + the v1 review fixes.
// Usage (from presentation/): mise exec node@22 -- node pptx/build_deck.js  →  dist/secna.pptx
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const OUT = path.join(__dirname, "..", "dist", "secna.pptx");
const W = 13.333, H = 7.5, MX = 0.6;

// ---------- theme: standard, modern, neutral (no brand) ----------
const THEME = {
  name: "SECNA",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1A2332", lt1: "FFFFFF", dk2: "3A4659", lt2: "F2F4F7",
    accent1: "0E7C7B",  // teal — structure, emphasis
    accent2: "C8423A",  // red — consumes tokens (only)
    accent3: "5B6CC9",  // indigo — group colour
    accent4: "D99A1E",  // amber — group colour
    accent5: "8A94A6",  // slate — muted
    accent6: "2E7DB5",  // blue — group colour
    hlink: "0E7C7B", folHlink: "5B6CC9",
  },
};
const HEX = { ink: "1A2332", ink2: "3A4659", paper: "F2F4F7", teal: "0E7C7B", red: "C8423A", indigo: "5B6CC9",
  amber: "D99A1E", slate: "8A94A6", blue: "2E7DB5", line: "D9DEE5", soft: "FBEDEC", white: "FFFFFF" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Vos corpus grossissent. Pas votre budget de tokens.";
pres.author = "Michaël Dussère";
const C = pres.SchemeColor;
const FOOT = "Generative AI Bordeaux · 19 novembre 2026";

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "COVER", background: { color: HEX.ink },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 2.2, w: W - 2 * MX, h: 1.9, fontSize: 52, bold: true, color: C.background1, align: "center", valign: "middle" }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: MX, y: 4.35, w: W - 2 * MX, h: 1.0, fontSize: 20, color: "C9D1DD", align: "center", valign: "top" }, text: "" } },
    { text: { text: FOOT, options: { x: MX, y: 6.7, w: W - 2 * MX, h: 0.35, fontSize: 13, color: "8FA3BF", align: "center", isTextBox: true } } },
  ],
});
pres.defineSlideMaster({
  title: "IMPACT", background: { color: HEX.ink },
  objects: [
    { placeholder: { options: { name: "body", type: "body", x: 1.0, y: 1.6, w: W - 2.0, h: 3.3, fontSize: 40, color: C.background1, align: "center", valign: "middle" }, text: "" } },
    { text: { text: FOOT, options: { x: MX, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: "7F8DA3", isTextBox: true } } },
  ],
  slideNumber: { x: W - 1.1, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: "7F8DA3", align: "right" },
});
pres.defineSlideMaster({
  title: "CONTENT", background: { color: HEX.white },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.55, w: W - 2 * MX, h: 0.85, fontSize: 34, bold: true, color: C.text1, valign: "middle", align: "left" }, text: "" } },
    { text: { text: FOOT, options: { x: MX, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: HEX.slate, isTextBox: true } } },
  ],
  slideNumber: { x: W - 1.1, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: HEX.slate, align: "right" },
});
pres.defineSlideMaster({
  title: "LETTER", background: { color: HEX.white },
  objects: [{ text: { text: FOOT, options: { x: MX, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: HEX.slate, isTextBox: true } } }],
  slideNumber: { x: W - 1.1, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: HEX.slate, align: "right" },
});
pres.defineSlideMaster({ title: "CLIP", background: { color: "10161F" }, objects: [] });

// ---------- helpers ----------
let section = "";
function newSlide(layout, sec, crumb) {
  if (sec !== section) { pres.addSection({ title: sec }); section = sec; }
  const s = pres.addSlide({ masterName: layout, sectionTitle: sec });
  if (crumb) T(s, crumb, { x: MX, y: 0.22, w: 8, h: 0.3, fontSize: 11, color: HEX.slate });
  return s;
}
function T(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontSize: 18, color: HEX.ink, valign: "top" }, o)); }
const shadow = () => ({ type: "outer", color: "1A2332", opacity: 0.08, blur: 8, offset: 2, angle: 90 });
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ x, y, w, h, rectRadius: 0.08, fill: { color: HEX.white },
    line: { color: HEX.line, width: 1 }, shadow: shadow() }, o));
}
function badge(s, text, cost) {
  const w = Math.max(1.3, 0.13 * text.length + 0.5);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: W - MX - w, y: 0.45, w, h: 0.5, rectRadius: 0.25,
    fill: { color: cost ? HEX.soft : HEX.paper }, line: { color: cost ? HEX.red : HEX.line, width: 1.25 } });
  T(s, text, { x: W - MX - w, y: 0.45, w, h: 0.5, fontSize: 16, bold: true, align: "center", valign: "middle", color: cost ? HEX.red : HEX.ink2 });
}
// the SECNA strip in small: tiles, current letter lit; off = struck letters
function mini(s, x, y, cur, off = "", size = 0.46) {
  [..."SECNA"].forEach((L, i) => {
    const on = cur.includes(L), isOff = off.includes(L), cost = "SN".includes(L);
    const fill = on ? (cost ? HEX.red : HEX.ink) : HEX.white;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + i * (size + 0.1), y, w: size, h: size, rectRadius: 0.06,
      fill: { color: fill }, line: { color: on ? fill : HEX.line, width: 1 }, objectName: "strip-" + L });
    T(s, L, { x: x + i * (size + 0.1), y, w: size, h: size, fontSize: 15, bold: true, align: "center", valign: "middle",
      color: on ? HEX.white : (isOff ? "C5CBD3" : HEX.slate), strike: isOff ? "sngStrike" : undefined });
  });
}
function letterSlide(L, word, verb, sentence, badgeText, cost, draw, notes) {
  const s = newSlide("LETTER", "03 · Les cinq étapes", "03 · Les cinq étapes");
  T(s, L, { x: MX, y: 1.2, w: 3.0, h: 2.3, fontSize: 160, bold: true, color: cost ? HEX.red : HEX.ink, valign: "bottom" });
  T(s, word, { x: MX, y: 3.6, w: 3.3, h: 0.4, fontSize: 18, color: HEX.slate });
  T(s, verb, { x: MX, y: 3.98, w: 3.3, h: 0.95, fontSize: 26, bold: true });
  mini(s, MX, 5.05, L);
  badge(s, badgeText, cost);
  draw(s);
  T(s, sentence, { x: MX, y: 6.15, w: W - 2 * MX, h: 0.6, fontSize: 22 });
  if (notes) s.addNotes(notes);
  return s;
}

// ---------- the sphere (E → C → N: same geometry, same points) ----------
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
const SPH = { cx: 8.45, cy: 3.35, r: 2.35 };
const GROUPS = [
  { dx: -0.9, dy: -0.8, col: HEX.blue, name: "Retards de livraison", lx: -2.45, ly: -1.95 },
  { dx: 0.95, dy: -0.75, col: HEX.teal, name: "Remboursements", lx: 0.65, ly: -1.95 },
  { dx: 0.85, dy: 0.95, col: HEX.indigo, name: "Bugs de l'appli", lx: 0.75, ly: 1.75 },
  { dx: -1.0, dy: 0.9, col: HEX.amber, name: "Compte et connexion", lx: -2.6, ly: 1.75 },
];
const R = rng(11);
const PTS = GROUPS.map(g => Array.from({ length: 9 }, () => { const a = R() * 6.28, d = R() * 0.38;
  return [g.dx + d * Math.cos(a) * 1.25, g.dy + d * Math.sin(a) * 0.9]; }));
const LONERS = [[0.0, 0.05], [-1.85, 0.0], [1.95, 0.15]];
function sphere(s, mode) {
  const { cx, cy, r } = SPH;
  s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: HEX.paper }, line: { color: HEX.line, width: 1.25 }, shadow: shadow(), objectName: "sphere" });
  [0.38, 0.72].forEach(k => {
    s.addShape(pres.shapes.OVAL, { x: cx - r, y: cy - r * k, w: 2 * r, h: 2 * r * k, fill: { type: "none" }, line: { color: "E1E5EB", width: 0.75 } });
    s.addShape(pres.shapes.OVAL, { x: cx - r * k, y: cy - r, w: 2 * r * k, h: 2 * r, fill: { type: "none" }, line: { color: "E1E5EB", width: 0.75 } });
  });
  const dot = (x, y, col, d = 0.13) => s.addShape(pres.shapes.OVAL, { x: cx + x - d / 2, y: cy + y - d / 2, w: d, h: d, fill: { color: col }, line: { type: "none" } });
  GROUPS.forEach((g, i) => {
    if (mode !== "points") s.addShape(pres.shapes.OVAL, { x: cx + g.dx - 0.62, y: cy + g.dy - 0.47, w: 1.24, h: 0.94, fill: { type: "none" }, line: { color: g.col, width: 1.25, dashType: "dash" } });
    PTS[i].forEach(([x, y]) => dot(x, y, mode === "points" ? "B7BEC9" : g.col));
    if (mode === "named") T(s, g.name, { x: cx + g.lx, y: cy + g.ly, w: 2.3, h: 0.35, fontSize: 16, bold: true, color: g.col, align: g.lx < 0 ? "right" : "left" });
  });
  LONERS.forEach(([x, y]) => dot(x, y, mode === "points" ? "B7BEC9" : HEX.slate));
  if (mode === "points") {
    const lab = (p, text, lx, ly, align) => {
      dot(p[0], p[1], HEX.teal, 0.2);
      s.addShape(pres.shapes.LINE, { x: Math.min(cx + p[0], cx + lx), y: Math.min(cy + p[1], cy + ly), w: Math.abs(lx - p[0]) || 0.01, h: Math.abs(ly - p[1]) || 0.01,
        flipH: (lx < p[0]) !== (ly < p[1]), line: { color: HEX.ink2, width: 0.75 } });
      T(s, text, { x: align === "right" ? cx + lx - 2.6 : cx + lx + 0.05, y: cy + ly - 0.2, w: 2.55, h: 0.4, fontSize: 16, bold: true, align, valign: "middle" });
    };
    lab(PTS[0][0], "« Colis jamais arrivé »", -2.0, -2.0, "right");
    lab(PTS[0][1], "« Livraison en retard »", -2.3, -0.25, "right");
    lab(PTS[2][0], "« Super appli ! »", 2.15, 2.1, "left");
  }
}

// ---------- the bill bar ----------
function billbar(s, x, y, w, dimS) {
  const segs = [["S · 45,00 $", 0.922, HEX.red, dimS], ["N", 0.077, HEX.red, false], ["", 0.008, HEX.slate, false]];
  let cx = x;
  segs.forEach(([lab, f, col, dim]) => {
    const sw = Math.max(w * f, 0.04);
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y, w: sw, h: 0.62, fill: { color: col, transparency: dim ? 70 : (lab === "N" ? 25 : 0) }, line: { color: HEX.white, width: 1 } });
    if (lab) T(s, lab, { x: cx, y, w: sw, h: 0.62, fontSize: 16, bold: true, color: HEX.white, align: "center", valign: "middle" });
    cx += sw;
  });
  T(s, [{ text: "La facture de Clio : " }, { text: "48,81 $", options: { bold: true } }, { text: " pour 100 000 conversations" }],
    { x, y: y + 0.72, w: w * 0.6, h: 0.35, fontSize: 15, color: HEX.ink2 });
  T(s, [{ text: "S = " }, { text: "92 %", options: { bold: true, color: HEX.red } }, { text: " · N = 3,75 $ · A = 0,06 $" }],
    { x: x + w * 0.5, y: y + 0.72, w: w * 0.5, h: 0.35, fontSize: 15, color: HEX.ink2, align: "right" });
}

// ---------- the illustrative cost curve (native line chart) ----------
const CATS = ["1 000", "", "10 000", "", "100 000", "", "1 000 000"];
function curve(s, x, y, w, h, axisTitle = true) {
  s.addChart(pres.charts.LINE, [
    { name: "Le LLM lit chaque document", labels: CATS, values: [1, 3, 10, 30, 100, 300, 1000] },
    { name: "Le LLM lit les groupes", labels: CATS, values: [4, 4.2, 4.6, 4.9, 9, 9.3, 9.8] },
  ], {
    x, y, w, h, layout: { x: 0.07, y: 0.04, w: 0.9, h: 0.84 },
    chartColors: [HEX.red, HEX.teal], lineSize: 4, lineDataSymbol: "none", lineSmooth: true,
    valAxisMaxVal: 110, valAxisMinVal: 0, valAxisHidden: true, valGridLine: { style: "none" },
    catAxisLabelColor: HEX.ink, catAxisLabelFontSize: 15, catAxisLabelFontFace: "+mn-lt", catAxisLineColor: HEX.ink2,
    catGridLine: { style: "none" }, showLegend: false, showValue: false,
    showValAxisTitle: true, valAxisTitle: "coût", valAxisTitleColor: HEX.ink2, valAxisTitleFontSize: 14, valAxisTitleFontFace: "+mn-lt",
    showCatAxisTitle: axisTitle, catAxisTitle: "documents (échelle logarithmique)", catAxisTitleColor: HEX.ink2, catAxisTitleFontSize: 13, catAxisTitleFontFace: "+mn-lt",
    objectName: "cost-curve",
  });
  const px = i => x + w * (0.07 + 0.9 * (i + 0.5) / 7);
  T(s, "Le LLM lit chaque document", { x: px(4) - 3.6, y: y + 0.15, w: 3.4, h: 0.4, fontSize: 18, bold: true, color: HEX.red, align: "right" });
  T(s, "Le LLM lit les groupes", { x: px(5) - 1.2, y: y + h * 0.58, w: 3.2, h: 0.4, fontSize: 18, bold: true, color: HEX.teal });
  T(s, "+ un niveau de hiérarchie", { x: px(4) + 0.1, y: y + h * 0.68, w: 2.6, h: 0.3, fontSize: 12, color: HEX.ink2 });
  T(s, "illustratif", { x: x + w - 1.6, y: y - 0.05, w: 1.5, h: 0.3, fontSize: 12, italic: true, color: HEX.slate, align: "right" });
  return px;
}

// =====================================================================
// 1 · La question
// =====================================================================
let s = newSlide("COVER", "01 · La question");
s.addText([{ text: "Vos corpus grossissent.", options: { breakLine: true } }, { text: "Pas votre budget de tokens.", options: { color: "7FD1CF" } }], { placeholder: "title" });
s.addText([{ text: "Michaël Dussère — Advanced GenAI Solution Architect, GenAI Center of Excellence, Betclic" }], { placeholder: "body" });
s.addNotes("Nom, une ligne sur ce que je fais, puis directement la question.");

s = newSlide("IMPACT", "01 · La question");
s.addText([
  { text: "« Que ferais-je avec des tokens illimités ? »", options: { color: "7F8DA3", strike: "sngStrike", fontSize: 30, breakLine: true } },
  { text: " ", options: { fontSize: 14, breakLine: true } },
  { text: "« Comment traiter des corpus qui grossissent, ", options: {} },
  { text: "avec le budget que j'ai ?", options: { bold: true, color: "7FD1CF" } }, { text: " »", options: { breakLine: true } },
  { text: " ", options: { fontSize: 14, breakLine: true } },
  { text: "token ≈ un morceau de mot — c'est ce qu'on paie", options: { fontSize: 18, color: "A9B4C4" } },
], { placeholder: "body" });
s.addNotes("Tout le monde rêve de la première question ; tout le monde vit la seconde.");

const PILES = [["⭐", "Avis clients", "Des milliers, notés de 1 à 5, lus en diagonale.", "les vraies raisons des notes basses"],
  ["🎧", "Tickets de support", "Rangés dans une catégorie choisie il y a trois ans.", "les catégories qui existent vraiment"],
  ["💬", "Messages vendeurs", "Ce que vos vendeurs vous écrivent, sans vue d'ensemble.", "ce qui bloque les vendeurs, regroupé"],
  ["📝", "Retours ouverts", "Le champ libre des questionnaires.", "ce que les gens disent quand on ne leur demande rien"]];
function piles(s, outcome) {
  const cw = (W - 2 * MX - 0.4) / 2, ch = 1.75;
  PILES.forEach(([ico, name, line, out], i) => {
    const x = MX + (i % 2) * (cw + 0.4), y = 1.85 + Math.floor(i / 2) * (ch + 0.35);
    card(s, x, y, cw, ch, { objectName: "pile-" + i });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.42, w: 0.85, h: 0.85, fill: { color: HEX.paper }, line: { type: "none" } });
    T(s, ico, { x: x + 0.35, y: y + 0.42, w: 0.85, h: 0.85, fontSize: 26, align: "center", valign: "middle" });
    T(s, name, { x: x + 1.5, y: y + 0.38, w: cw - 1.8, h: 0.45, fontSize: 22, bold: true });
    T(s, outcome ? "→ " + out : line, { x: x + 1.5, y: y + 0.88, w: cw - 1.8, h: 0.7, fontSize: 17, color: outcome ? HEX.teal : HEX.ink2, bold: !!outcome });
  });
}
s = newSlide("CONTENT", "01 · La question", "01 · La question");
s.addText("Les piles qu'on ne lit jamais", { placeholder: "title" });
piles(s, false);
s.addNotes("Vous avez tous une de ces piles.");

s = newSlide("CONTENT", "01 · La question", "01 · La question");
s.addText("Pourquoi ne pas juste demander à un LLM ?", { placeholder: "title" });
[["1", "Un très gros LLM, tout d'un coup", "Bouché", "tout ne tient pas dans le contexte, ce qui rentre est dilué.", "« Tout d'un coup ? Facile. »"],
 ["2", "Un gros LLM, sur un échantillon", "Malin, mais aveugle", "ce qui n'est pas tiré au sort n'existe pas — les signaux faibles disparaissent.", "« Je vais prendre un échantillon représentatif. »"],
 ["3", "Plein de petits LLM, un par document", "Pas de vue d'ensemble", "à la fin, 100 000 résumés, chacun dans ses mots.", "« Si un agent n'y arrive pas, ajoutez-en dix. »"]]
.forEach(([n, head, verdict, why, quote], i) => {
  const cw = (W - 2 * MX - 0.8) / 3, x = MX + i * (cw + 0.4), y = 1.75;
  card(s, x, y, cw, 3.85, { objectName: "reflex-" + n });
  s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6, fill: { color: HEX.ink }, line: { type: "none" } });
  T(s, n, { x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: HEX.white, align: "center", valign: "middle" });
  T(s, head, { x: x + 0.3, y: y + 1.05, w: cw - 0.6, h: 0.8, fontSize: 19, bold: true });
  T(s, [{ text: verdict + " : ", options: { bold: true, color: HEX.red } }, { text: why }], { x: x + 0.3, y: y + 1.9, w: cw - 0.6, h: 1.15, fontSize: 16 });
  T(s, quote, { x: x + 0.3, y: y + 3.1, w: cw - 0.6, h: 0.6, fontSize: 15, italic: true, color: HEX.slate });
});
T(s, [{ text: "Il existe une quatrième voie : " , options: { bold: true } }, { text: "d'abord des petits modèles sur chaque document, puis un gros, sur les groupes." }],
  { x: MX, y: 5.95, w: W - 2 * MX, h: 0.5, fontSize: 19, color: HEX.teal });
s.addNotes("Les trois réflexes de la salle. La colonne 2 est ce que font la plupart des outils aujourd'hui. (Illustration régénérée à venir.)");

// =====================================================================
// 2 · Clio
// =====================================================================
s = newSlide("CONTENT", "02 · Clio", "02 · Clio");
s.addText("Anthropic, décembre 2024 : Clio", { placeholder: "title" });
[["Le problème", "Des millions de conversations avec Claude. Personne ne peut les lire — et personne ne doit les lire."],
 ["Ce qu'ils ont construit", "Un outil qui dégage les grands usages sans qu'un humain lise les conversations."]].forEach(([h, b], i) => {
  const x = MX + i * 4.15;
  card(s, x, 1.9, 3.8, 3.2);
  T(s, h, { x: x + 0.35, y: 2.2, w: 3.1, h: 0.5, fontSize: 22, bold: true, color: HEX.teal });
  T(s, b, { x: x + 0.35, y: 2.85, w: 3.1, h: 2.6, fontSize: 19 });
});
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX + 8.3, y: 1.9, w: 3.8, h: 3.2, rectRadius: 0.08, fill: { color: HEX.ink }, line: { type: "none" } });
T(s, "La facture", { x: MX + 8.65, y: 2.2, w: 3.1, h: 0.5, fontSize: 22, bold: true, color: "7FD1CF" });
T(s, "48,81 $", { x: MX + 8.65, y: 2.95, w: 3.1, h: 1.2, fontSize: 60, bold: true, color: HEX.white });
T(s, "pour 100 000 conversations", { x: MX + 8.65, y: 4.2, w: 3.1, h: 0.5, fontSize: 19, color: "C9D1DD" });
T(s, "Tamkin et al., 2024 — Clio, arXiv:2412.13678 · Claude 3 Haiku et Claude 3.5 Sonnet, tarifs 2024",
  { x: MX, y: 5.4, w: 10, h: 0.3, fontSize: 11, color: HEX.slate });

s = newSlide("IMPACT", "02 · Clio");
s.addText([{ text: "Comprendre tout un corpus", options: { breakLine: true } }, { text: "sans le lire en entier.", options: { bold: true, color: "7FD1CF", breakLine: true } },
  { text: " ", options: { fontSize: 14, breakLine: true } },
  { text: "— la promesse de Clio : « without the need for human reviewers to read raw conversations »", options: { fontSize: 17, color: "A9B4C4", italic: true } }], { placeholder: "body" });

s = newSlide("CONTENT", "02 · Clio", "02 · Clio");
s.addText("La recette, en cinq lettres", { placeholder: "title" });
[["S", "Summarise", "préparer chaque document"], ["E", "Embed", "projeter le sens"], ["C", "Cluster", "regrouper"],
 ["N", "Name", "nommer chaque groupe"], ["A", "Aggregate", "ranger en niveaux"]].forEach(([L, word, verb], i) => {
  const cost = "SN".includes(L), cw = (W - 2 * MX - 4 * 0.3) / 5, x = MX + i * (cw + 0.3);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: cw, h: 3.0, rectRadius: 0.08, fill: { color: cost ? HEX.soft : HEX.paper },
    line: { color: cost ? HEX.red : HEX.line, width: cost ? 1.5 : 1 }, objectName: "step-" + L });
  T(s, L, { x: x + 0.3, y: 2.2, w: cw - 0.6, h: 1.2, fontSize: 66, bold: true, color: cost ? HEX.red : HEX.ink });
  T(s, word, { x: x + 0.3, y: 3.5, w: cw - 0.6, h: 0.45, fontSize: 20, bold: true });
  T(s, verb, { x: x + 0.3, y: 3.98, w: cw - 0.6, h: 0.8, fontSize: 17, color: HEX.ink2 });
});
T(s, [{ text: "En rouge", options: { bold: true, color: HEX.red } }, { text: ", ce qui consomme des tokens. SECNA : un nom inventé pour ce talk — la recette est celle de Clio." }],
  { x: MX, y: 5.45, w: W - 2 * MX, h: 0.5, fontSize: 18, color: HEX.ink2 });

// =====================================================================
// 3 · Les cinq étapes
// =====================================================================
letterSlide("S", "Summarise", "préparer la donnée", "Résumer, traduire, effacer la forme, faire ressortir ce qui porte le sens.", "45 $ · 92 %", true, s => {
  billbar(s, 4.3, 1.55, 8.43, false);
  card(s, 4.3, 3.15, 3.7, 1.85);
  T(s, "trop nul, colis tjrs pas arrivé apres 10j, et l'appli plante quand je veux suivre la commande. rembourser svp !!!",
    { x: 4.5, y: 3.32, w: 3.3, h: 1.5, fontSize: 14, fontFace: "Courier New", color: HEX.ink2 });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 8.15, y: 3.85, w: 0.65, h: 0.4, fill: { color: HEX.red }, line: { type: "none" } });
  T(s, "petit LLM", { x: 7.9, y: 4.3, w: 1.15, h: 0.3, fontSize: 12, bold: true, color: HEX.red, align: "center" });
  card(s, 9.0, 3.15, 3.73, 1.85);
  T(s, [["Sujet", "livraison en retard"], ["Aussi", "bug du suivi de commande"], ["Ton", "agacé"], ["Demande", "remboursement"]].flatMap(([k, v], i, a) => [
    { text: k + "  ", options: { bold: true, color: HEX.teal } }, { text: v, options: { breakLine: i < a.length - 1 } }]),
    { x: 9.25, y: 3.35, w: 3.3, h: 1.5, fontSize: 16 });
  T(s, "Clio, table 3 — 100 000 conversations, tarifs 2024", { x: 4.3, y: 5.3, w: 8, h: 0.3, fontSize: 11, color: HEX.slate });
}, "Clio extrait quelques attributs par conversation, dont un résumé de la demande — pour la confidentialité et pour choisir l'angle. Optionnel pour vous.");

letterSlide("E", "Embed", "projeter le sens", "Chaque texte devient un point. Plus deux points sont proches, plus leur sens est proche.", "quelques centimes — ou en local", false, s => sphere(s, "points"));
letterSlide("C", "Cluster", "regrouper", "Les points proches forment des groupes — sans LLM, du calcul pur.", "0 $ — sans LLM", false, s => sphere(s, "groups"));
letterSlide("N", "Name", "nommer chaque groupe", "Le LLM lit quelques exemples par groupe et lui donne un nom.", "3,75 $", true, s => {
  sphere(s, "named");
  T(s, [{ text: "100 000 appels", options: { strike: "sngStrike", color: HEX.slate } }, { text: "  →  " }, { text: "des milliers d'appels, un par groupe", options: { bold: true, color: HEX.teal } }],
    { x: 4.3, y: 5.72, w: 8.4, h: 0.4, fontSize: 18, align: "center" });
});
letterSlide("A", "Aggregate", "ranger en niveaux", "Quelques grands thèmes, des milliers de groupes fins. On zoome, on dézoome.", "≈ 0 $ (0,06 $)", false, s => {
  const ox = 4.5, oy = 1.3, k = 0.0108;  // treemap, 700 x 400 units
  const th = [[0, 0, 380, 240, HEX.blue, "Livraison", [[0, 30, 210, 210, "Retards", true], [210, 30, 170, 110, "Colis abîmés"], [210, 140, 170, 100, "Mauvaise adresse"]]],
    [380, 0, 320, 240, HEX.teal, "Paiement", [[0, 30, 180, 210, "Remboursements"], [180, 30, 140, 210, "Double débit"]]],
    [0, 240, 300, 160, HEX.indigo, "L'appli", [[0, 30, 130, 130, "Plantages"], [130, 30, 170, 130, "Suivi commande"]]],
    [300, 240, 270, 160, HEX.amber, "Compte", [[0, 30, 130, 130, "Connexion"], [130, 30, 140, 130, "Mot de passe"]]],
    [570, 240, 130, 160, HEX.slate, "Autres", []]];
  th.forEach(([x, y, w, h, col, lab, subs]) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: ox + x * k + 0.03, y: oy + y * k + 0.03, w: w * k - 0.06, h: h * k - 0.06, rectRadius: 0.05,
      fill: { color: col, transparency: 82 }, line: { color: col, width: 1.5 }, objectName: "theme-" + lab });
    T(s, lab, { x: ox + x * k + 0.15, y: oy + y * k + 0.08, w: w * k - 0.3, h: 0.32, fontSize: 16, bold: true, color: col });
    subs.forEach(([sx, sy, sw, sh, sl, hl]) => {
      s.addShape(pres.shapes.RECTANGLE, { x: ox + (x + sx) * k + 0.1, y: oy + (y + sy) * k + 0.06, w: sw * k - 0.17, h: sh * k - 0.17,
        fill: { color: HEX.white }, line: { color: col, width: hl ? 2.25 : 0.75 } });
      T(s, sl + (hl ? "\n→ 12 groupes fins" : ""), { x: ox + (x + sx) * k + 0.2, y: oy + (y + sy) * k + 0.14, w: sw * k - 0.35, h: 0.7, fontSize: 12.5, color: HEX.ink });
    });
  });
}, "Exemple de Clio : Écriture → rédaction de contenus → contenus pour le référencement.");

s = newSlide("IMPACT", "03 · Les cinq étapes");
s.addText([{ text: "La data science trouve la structure,", options: { breakLine: true } }, { text: "le LLM lui donne du sens.", options: { bold: true, color: "7FD1CF" } }], { placeholder: "body" });

// =====================================================================
// 4 · Les autres
// =====================================================================
s = newSlide("CONTENT", "04 · Les autres", "04 · Les autres");
s.addText("Les autres font pareil — une lettre change", { placeholder: "title" });
const hd = (t, red) => ({ text: t, options: { bold: true, color: red ? HEX.red : HEX.ink2, align: "center", fill: { color: HEX.white } } });
const sym = t => ({ text: t, options: { align: "center", fontSize: 22, color: HEX.ink } });
const row = (name, sub, cells, take, hl) => [
  { text: [{ text: name, options: { bold: true, breakLine: true } }, { text: sub, options: { fontSize: 12, color: HEX.slate } }], options: { fill: { color: hl ? HEX.paper : HEX.white } } },
  ...cells.map(c => Object.assign(sym(c), { options: Object.assign(sym(c).options, { fill: { color: hl ? HEX.paper : HEX.white } }) })),
  { text: take, options: { fill: { color: hl ? HEX.paper : HEX.white } } }];
s.addTable([
  [hd(""), hd("S", true), hd("E"), hd("C"), hd("N", true), hd("A"), { text: "Ce que ça change", options: { bold: true, color: HEX.ink2 } }],
  row("Clio", "Anthropic, 2024", ["●", "●", "●", "●", "●"], "la référence"),
  row("Google Urania", "2025", ["?", "●", "●", "●", "●"], "+ confidentialité garantie"),
  row("LangSmith Insights", "2025", ["●", "?", "●", "●", "●"], "un LLM résume et regroupe → 1 000 traces max", true),
], { x: MX, y: 1.75, w: W - 2 * MX, colW: [2.9, 0.75, 0.75, 0.75, 0.75, 0.75, 5.48], fontSize: 18, color: HEX.ink, valign: "middle",
  border: { type: "solid", pt: 0.75, color: HEX.line }, rowH: [0.55, 0.95, 0.95, 0.95], margin: 0.08 });
T(s, "● oui · ? non documenté", { x: MX, y: 5.95, w: 8, h: 0.35, fontSize: 14, color: HEX.ink2 });
T(s, "Sources : Clio (arXiv:2412.13678) · Urania (arXiv:2506.04681) · docs LangSmith Insights",
  { x: MX, y: 6.4, w: 11, h: 0.3, fontSize: 11, color: HEX.slate });
s.addNotes("LangSmith : un LLM résume chaque trace et un LLM fait le regroupement — d'où le plafond.");

// =====================================================================
// 5 · Le calcul
// =====================================================================
s = newSlide("CONTENT", "05 · Le calcul", "05 · Le calcul");
s.addText("La facture suit les groupes, pas les documents", { placeholder: "title" });
curve(s, MX + 0.4, 1.6, W - 2 * MX - 0.8, 5.0);

s = newSlide("CONTENT", "05 · Le calcul", "05 · Le calcul");
s.addText("Réservé aux géants ?", { placeholder: "title" });
{
  const x = MX + 0.4, y = 1.6, w = W - 2 * MX - 0.8, h = 4.3;
  const px = i => x + w * (0.07 + 0.9 * (i + 0.5) / 7);
  s.addShape(pres.shapes.RECTANGLE, { x: px(0) - 0.4, y: y + 0.1, w: px(4) - px(0) + 0.8, h: h * 0.8, fill: { color: HEX.teal, transparency: 90 }, line: { type: "none" } });
  T(s, "votre corpus", { x: px(0) - 0.25, y: y + 0.2, w: 2.5, h: 0.35, fontSize: 18, bold: true, color: HEX.teal });
  s.addShape(pres.shapes.LINE, { x: px(6), y: y + 0.1, w: 0, h: h * 0.8, line: { color: HEX.ink2, width: 1.25, dashType: "dash" } });
  T(s, "Clio", { x: px(6) - 1.1, y: y + 0.2, w: 1.0, h: 0.35, fontSize: 18, bold: true, color: HEX.ink2, align: "right" });
  curve(s, x, y, w, h, false);
}
T(s, [{ text: "À votre taille, tout lire coûte encore peu — mais ça ne tiendra pas. " }, { text: "Le vrai gain : voir ce que vous ne cherchiez pas.", options: { bold: true, color: HEX.teal } }],
  { x: MX, y: 6.1, w: W - 2 * MX, h: 0.6, fontSize: 17 });

s = newSlide("CONTENT", "05 · Le calcul", "05 · Le calcul");
s.addText("Chez vous, en moins de 200 lignes", { placeholder: "title" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: MX, y: 1.85, w: 8.0, h: 3.9, rectRadius: 0.08, fill: { color: HEX.paper }, line: { color: HEX.slate, width: 1, dashType: "dash" } });
T(s, "Résultat du notebook : les groupes nommés et leur taille, sur un corpus public — à venir (étape 2)",
  { x: MX + 0.5, y: 3.4, w: 7.0, h: 0.8, fontSize: 18, color: HEX.ink2, align: "center", valign: "middle" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 9.55, y: 1.85, w: 2.6, h: 2.6, rectRadius: 0.08, fill: { color: HEX.white }, line: { color: HEX.slate, width: 1, dashType: "dash" } });
T(s, "QR code\ndu dépôt", { x: 9.55, y: 1.85, w: 2.6, h: 2.6, fontSize: 14, color: HEX.slate, align: "center", valign: "middle" });
T(s, "github.com/mdussere/secna", { x: 8.9, y: 4.6, w: 3.9, h: 0.4, fontSize: 15, fontFace: "Courier New", align: "center" });
T(s, "corpus public · une commande", { x: 8.9, y: 5.05, w: 3.9, h: 0.4, fontSize: 15, color: HEX.ink2, align: "center" });
s.addNotes("Parcours du notebook déjà exécuté : le résultat d'abord, le code en passant.");

// =====================================================================
// 6 · Ma recette
// =====================================================================
s = newSlide("CONTENT", "06 · Ma recette", "06 · Ma recette");
s.addText("Ma recette : sans le S", { placeholder: "title" });
T(s, "Pas mon invention — celle que j'utilise et que je défends.", { x: MX, y: 1.45, w: 9, h: 0.4, fontSize: 18, italic: true, color: HEX.ink2 });
mini(s, MX, 2.05, "ECNA", "S", 0.55);
card(s, MX, 2.95, W - 2 * MX, 3.4, { fill: { color: HEX.paper } });
T(s, "Pour un corpus qui grossit", { x: MX + 0.4, y: 3.15, w: 8, h: 0.45, fontSize: 22, bold: true });
[["Ingrédients", "le texte brut, et son contexte : date, produit, note"], ["Étapes", "projeter · regrouper · nommer · ranger"],
 ["Astuce", "ne pas faire préparer chaque document par un LLM"], ["Ce qu'on perd", "un peu de finesse sur les textes longs et confus"],
 ["Ce qu'on gagne", "une table qu'on filtre par produit, par mois"]].forEach(([k, v], i) => {
  T(s, k, { x: MX + 0.4, y: 3.75 + i * 0.48, w: 2.4, h: 0.42, fontSize: 18, bold: true, color: HEX.teal });
  T(s, v, { x: MX + 2.9, y: 3.75 + i * 0.48, w: 8.8, h: 0.42, fontSize: 18 });
});
s.addNotes("La pâte à crêpes : je ne l'ai pas inventée, je l'ai choisie parce qu'elle est équilibrée et qu'elle tient dans la poêle.");

s = newSlide("CONTENT", "06 · Ma recette", "06 · Ma recette");
s.addText("Ces piles, vous pouvez maintenant les lire — sans les lire", { placeholder: "title" });
piles(s, true);
T(s, "Le RAG ne trouve que ce qu'on sait déjà chercher. Ici, les thèmes émergent.", { x: MX, y: 6.15, w: W - 2 * MX, h: 0.45, fontSize: 18, italic: true, color: HEX.ink2 });

s = newSlide("CONTENT", "06 · Ma recette", "06 · Ma recette");
s.addText("Où ça s'arrête", { placeholder: "title" });
[["La plainte rare se noie dans les grands groupes — Clio le dit lui-même", "une carte du volume, pas une alarme : une veille à part pour les signaux critiques"],
 ["Petit corpus, ou corpus uniforme : rien à trouver", "sous quelques milliers de textes, demandez au LLM de tout lire"],
 ["Les noms sont une proposition du LLM", "je relis un échantillon par groupe ; je vérifie qu'ils tiennent d'un passage à l'autre"]].forEach(([lim, act], i) => {
  const y = 1.85 + i * 1.45;
  card(s, MX, y, W - 2 * MX, 1.2);
  s.addShape(pres.shapes.OVAL, { x: MX + 0.3, y: y + 0.32, w: 0.56, h: 0.56, fill: { color: HEX.paper }, line: { color: HEX.line, width: 1 } });
  T(s, "!", { x: MX + 0.3, y: y + 0.32, w: 0.56, h: 0.56, fontSize: 20, bold: true, color: HEX.ink2, align: "center", valign: "middle" });
  T(s, lim, { x: MX + 1.15, y: y + 0.2, w: 5.0, h: 0.8, fontSize: 18, bold: true, valign: "middle" });
  T(s, "→ " + act, { x: MX + 6.45, y: y + 0.2, w: 5.4, h: 0.8, fontSize: 17, color: HEX.teal, valign: "middle" });
});

// =====================================================================
// 7 · Et demain
// =====================================================================
s = newSlide("CONTENT", "07 · Et demain", "07 · Et demain");
s.addText("Demain : les petits modèles", { placeholder: "title" });
billbar(s, MX, 2.1, W - 2 * MX, true);
s.addShape(pres.shapes.DOWN_ARROW, { x: MX + 5.0, y: 3.35, w: 0.5, h: 0.75, fill: { color: HEX.red, transparency: 30 }, line: { type: "none" } });
T(s, "La seule étape LLM qui grossit avec le corpus — c'est là que chaque baisse de prix tombe en premier.", { x: MX, y: 4.35, w: W - 2 * MX, h: 0.9, fontSize: 26 });
T(s, "Quand elle coûtera assez peu, elle reviendra dans ma recette.", { x: MX, y: 5.35, w: W - 2 * MX, h: 0.45, fontSize: 19, color: HEX.teal, bold: true });
T(s, "Clio, table 3 — 100 000 conversations, tarifs 2024", { x: MX, y: 6.4, w: 8, h: 0.3, fontSize: 11, color: HEX.slate });

s = newSlide("IMPACT", "07 · Et demain");
s.addText([{ text: "Et si on mettait " }, { text: "un agent", options: { bold: true, color: "7FD1CF" } }, { text: " dessus ?", options: { breakLine: true } },
  { text: " ", options: { fontSize: 14, breakLine: true } }, { text: "un assistant qui parcourt la carte à votre place", options: { fontSize: 20, color: "A9B4C4" } }], { placeholder: "body" });

s = newSlide("CLIP", "07 · Et demain");
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.7, y: 1.4, w: W - 3.4, h: 4.7, rectRadius: 0.1, fill: { color: "1E2836" }, line: { color: "56657A", width: 1, dashType: "dash" } });
T(s, "Vidéo, 30 s : une question, une réponse — à venir (étape 3.5)", { x: 1.7, y: 1.4, w: W - 3.4, h: 4.7, fontSize: 20, color: "A9B4C4", align: "center", valign: "middle" });

s = newSlide("IMPACT", "07 · Et demain");
s.addText([{ text: "Ce sera pour la prochaine fois.", options: { bold: true, color: "7FD1CF", breakLine: true } }, { text: " ", options: { fontSize: 12, breakLine: true } },
  { text: "La facture suit les groupes, pas les documents.", options: { fontSize: 28 } }], { placeholder: "body" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: W / 2 - 0.8, y: 4.8, w: 1.6, h: 1.6, rectRadius: 0.08, fill: { color: "243044" }, line: { color: "56657A", width: 1, dashType: "dash" } });
T(s, "QR code", { x: W / 2 - 0.8, y: 4.8, w: 1.6, h: 1.6, fontSize: 13, color: "A9B4C4", align: "center", valign: "middle" });
T(s, "Merci · github.com/mdussere/secna", { x: W / 2 - 3, y: 6.7, w: 6, h: 0.35, fontSize: 14, color: "C9D1DD", align: "center", fontFace: "Courier New" });

// ---------- write ----------
(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
