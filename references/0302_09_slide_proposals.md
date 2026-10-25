# Slide proposals — three per slide, content and form

> Plan Step 3.2, second pass (b): the content and **the form** of every slide of the adopted
> structure, proposal B v2 ([`0302_06_talk_structure_letters.md`](0302_06_talk_structure_letters.md)).
> For each slide: its job, then **three proposals** — the idea, the layout, what is on screen
> (French, as it would read), the reading path (where the eye goes, in what order), what the
> speaker says, what it needs (theme component, image) — and a recommendation. Michael picks; then a
> first deck is generated **locally in this repo** with the `secna-deck` skill (Marp, neutral theme),
> following the method of the slide-decks tooling (one Markdown deck, components before CSS, every
> slide read back as an image).
> Pending decisions from the fresh review ([`0302_08`](0302_08_fresh_review_b_v2.md) §5) show up as
> **variants marked ⏳**, never as the default.

---

## 0. The visual grammar (applies to every slide)

| Element | Rule |
|---|---|
| **Canvas** | 1280 × 720, neutral theme `secna` (Inter + IBM Plex Mono), white content slides, dark cover / clip. |
| **Red** | Only for what **consumes tokens**: the S and N letters, their badges, the "LLM on every document" line. Never for emphasis. |
| **Accent (blue)** | Emphasis, the "LLM on the groups" line, the key word of an impact sentence. |
| **Chapter bar** | 7 parts → `--parts: 7`; breadcrumb *0N · Titre de partie* on content slides. |
| **The letter template** (8–12) | Big letter left (red for S, N; ink for E, C, A), French verb under it, one image right, one sentence at the bottom, a **cost badge** top right, and the **mini strip** of slide 7 at the top with the current letter lit. |
| **The cost badge** | A pill: red *45 $ · 92 %* / *3,75 $* for S / N; grey *≈ 0 $* / *0,06 $* for E, C, A. Clio's published figures (100 000 conversations). |
| **Recurring props** | *The piles* (3 → 19 → 24) keep the same four cards, same order; *the sphere* (9 → 10 → 11) is the same picture, gaining colours, then names; *the curve* (15 → 16) is the same graphic. |
| **Text budget** | Impact: ≤ 2 lines. Content: title + ≤ 4 lines or one visual + one sentence. No algorithm or model names on screen. |
| **Sources** | A small grey reference line bottom-left when a figure is quoted (*Tamkin et al., 2024 — Clio, table 3*). |

**Theme today** (`presentation/theme/secna.css`): `cover`, `impact`, default, `clip`, `.cols`,
`.cols3`, `.card`, `.note`, `.secna` strip (`.s`, `.s.cost`), `.placeholder`. **Components each
proposal would add** are listed under *Needs* and summed up in §8.

---

## 1 · La question

### Slide 1 — Cover
**Job**: say what the talk is about and who speaks, in five seconds.

**1A — The two-line title.**
*Layout*: `cover`, dark. Title on two lines of equal size: *Vos corpus grossissent.* (white) /
*Pas votre budget de tokens.* (accent). Speaker line under it; footer *Generative AI Bordeaux · 19 novembre 2026*.
*Reading*: line 1 → line 2 (the punchline lands second) → name.
*Speaker*: name, one line on what I do, straight to slide 2.
*Needs*: nothing new.

**1B — The punchline as hero.**
*Layout*: `cover`. *Vos corpus grossissent.* small, above; *Pas votre budget de tokens.* very large;
speaker line small at the bottom.
*Reading*: the big line first — the joke reads before the setup; less natural.
*Needs*: a `cover` variant with an oversized `h1`.

**1C — The curve in miniature.**
*Layout*: 1A, plus a tiny line drawing under the title: one line climbing steeply (red), one staying
flat (accent) — the cost curve of slide 15, unexplained.
*Reading*: title → the two lines → name. The drawing is paid off at slide 15.
*Needs*: one small SVG (same drawing as 15, simplified).

**Recommendation: 1A**, or **1C** if the curve drawing exists anyway — it plants the thesis.

---

### Slide 2 — The real question
**Job**: swap the question the room walked in with.

**2A — The crossed-out question.**
*Layout*: `impact`. Line 1 in grey, struck through: *« Que ferais-je avec des tokens illimités ? »*
Line 2 in ink, key words in accent: *« Comment traiter des corpus qui grossissent, **avec le budget que j'ai ?** »*
Small `.note` at the bottom: *token ≈ un morceau de mot — c'est ce qu'on paie.*
*Reading*: grey line (recognised, dismissed) → the real question → the definition, for whoever needs it.
*Speaker*: everyone dreams of the first; everyone lives the second.
*Needs*: a strike-through style in `impact` (`<del>` styled grey).

**2B — Dream vs reality, two cards.**
*Layout*: `.cols`, two `.card`s. Left *Le rêve* — *tokens illimités* with an ∞. Right *La réalité* —
*un corpus qui grossit, un budget fixe* with a tiny rising line under a flat ceiling.
*Reading*: left → right; the contrast does the work.
*Needs*: two small icons or drawings.

**2C — Two slides.**
*Layout*: slide 2a shows only the dream question (impact); slide 2b the real one. A click is the swap.
*Reading*: one idea per slide; the click is the punchline.
*Needs*: nothing; costs one extra slide (≈ 0 s).

**Recommendation: 2A** — one slide, the strike-through is the swap, the token definition is free.

---

### Slide 3 — The piles nobody reads
**Job**: make each person see *their* pile; set up the callback (19).

**3A — Four cards, 2 × 2.**
*Layout*: a 2 × 2 grid of cards, each: a simple icon, a bold name, one line.
- **Avis clients** — des milliers, notés de 1 à 5, lus en diagonale.
- **Tickets de support** — rangés dans une catégorie choisie il y a trois ans.
- **Messages vendeurs** — ce que vos vendeurs vous écrivent, sans vue d'ensemble.
- **Retours ouverts** — le champ libre des questionnaires.
Title: *Les piles qu'on ne lit jamais.*
*Reading*: title → scan the four → "that one is mine".
*Speaker*: "you all have one". Optional show of hands.
*Needs*: a `.grid2` (2 × 2 cards) component; four line icons.

**3B — One drawing.**
*Layout*: a full-width drawing of a tall pile of paper, four labelled layers (avis, tickets, messages,
retours), one small person reading a single sheet on top. Title: *Combien en lisez-vous vraiment ?*
*Reading*: the pile → the tiny reader → the question.
*Needs*: one illustration (SVG).

**3C — Four orders of magnitude.**
*Layout*: four KPI tiles, each a typical volume (*10 000 avis / an*, *1 ticket sur 3 en « Autre »*…)
labelled *ordre de grandeur*.
*Reading*: numbers first.
*Risk*: figures that look real but are not sourced — Laurent and Yanis would object. **Not recommended.**
*Needs*: `.kpis` component.

**Recommendation: 3A** — the same four cards come back on 19 with what you get: the callback is
visual.

---

### Slide 4 — The hook
**Job**: a surprise that is true — the giants read everything, cheaply.

**4A — Three lines, one twist.**
*Layout*: `impact`. *Même Anthropic lit chaque conversation —* / *avec son **plus petit modèle** de l'époque.* /
(smaller) *Un plus gros ne lit que les groupes.*
*Reading*: the claim → the twist (accent) → the second half, which the next 8 slides explain.
*Speaker*: no wink needed — the facts are surprising enough.
*Needs*: nothing.

**4B — Small model, big model.**
*Layout*: two halves. Left: a flood of tiny dots flowing through a **small** model icon (*100 000
conversations*). Right: a few dozen bubbles flowing into a **big** model icon (*les groupes*).
Title: *Ce que fait Anthropic chez lui.*
*Reading*: left (many, cheap) → right (few, expensive).
*Needs*: one diagram; risks over-explaining before Clio is introduced.

**4C — The question.**
*Layout*: `impact`: *Pour lire un million de conversations, Anthropic paie-t-il son plus gros modèle ?*
The answer comes on slides 5 and 8.
*Reading*: one question, held open.
*Needs*: nothing.

**4D — « Pourquoi ne pas juste demander à un LLM ? » — three reflexes (Michael's image, reworked).**
*Idea*: the three things people actually do with a pile and an LLM, and what each one loses — which
makes Clio's answer obvious: **every document, small models first, then a big one on the groups**.
*Layout*: one full-width image, **three columns**, title *Pourquoi ne pas juste demander à un LLM ?*

| ① Un très gros LLM, tout d'un coup | ② Un gros LLM, sur un échantillon | ③ Plein de petits LLM, un par document |
|---|---|---|
| The crowned robot in front of the mountain; a funnel with a padlock | The robot writes a few lines of code, pulls out a handful of documents that fit in its context, reads only those | One small model per document, one summary each; a messy pile of summaries at the end |
| **Bouché** : tout ne tient pas dans le contexte · ce qui rentre est dilué | **Malin, mais aveugle** : ce qui n'est pas tiré au sort n'existe pas — les signaux faibles disparaissent | **Pas de vue d'ensemble** : 100 000 résumés, chacun dans ses mots |
| *« Tout d'un coup ? Facile. »* | *« Je vais prendre un échantillon représentatif. »* | *« Si un agent n'y arrive pas, ajoutez-en dix. »* |

*Bottom line* (or the speaker's transition to 5): *Clio lit tout — d'abord des petits modèles sur
chaque document, puis un gros, sur les groupes.*
*Reading*: ① can't swallow it → ② swallows a sample and misses the rare → ③ swallows everything and
sees nothing → the bottom line.
*Speaker*: ② is what most tools and agents do today when you hand them a big file — it is clever, and
by construction it hides the weak signals. → slide 5.
*Level of detail*: kept simple on purpose — ② is *a sample that fits in the context*; the talk does
not discuss how big a sample must be, and makes no promise about weak signals beyond slide 20.
*Coherence with the rest*: ③ **is** S (small model, per document); the view of the whole is what
E-C-N-A add, with the big model only on N; ② comes back on slide 14 (LangSmith: ≤ 1,000 traces) and on
slide 20 (the rare complaint). Slide 8 can point back: *« la colonne ③, avec le plus petit modèle »*.
*Needs*: the image, **regenerated** (below) — not the original file.
*Why regenerate*: the original carries two internal labels (a team's conversation type, an internal
data format) that cannot enter this repo; its text is English; *"8K–128K tokens"* is outdated; it has
two columns, not three.

<details><summary>Regeneration prompt (ChatGPT image, same style as the original)</summary>

> Recreate this infographic in the same hand-drawn, soft-colour style, **with all text in French**,
> but with **three columns** instead of two. Title across the top: « Pourquoi ne pas juste demander à
> un LLM ? ». The overconfident crowned robot with a gold dollar chain appears in each column.
> Column 1 — « UN TRÈS GROS LLM — tout d'un coup »: a mountain of documents and message bubbles
> labelled « Avis clients », « Tickets de support », « Messages vendeurs », « Retours ouverts »,
> « Logs », « Pull requests »; the robot, large, says « Tout d'un coup ? Facile. »; a funnel with a
> padlock, clogged; red cross label « Bouché : tout ne tient pas dans le contexte ».
> Column 2 — « UN GROS LLM — sur un échantillon »: the same mountain, the robot holding a small net or
> tweezers, pulling out only five or six documents, typing a few lines of code; it says « Je vais
> prendre un échantillon représentatif. »; behind it, a few small glowing documents left in the pile,
> unnoticed; label « Malin, mais aveugle : les signaux faibles disparaissent ».
> Column 3 — « PLEIN DE PETITS LLM — un par document »: rows of documents, each → a small robot →
> a summary card; at the bottom a big messy pile labelled « 100 000 résumés »; the robot says « Si un
> agent n'y arrive pas, ajoutez-en dix. 😎 »; label « Pas de vue d'ensemble ».
> Do not mention cost or speed. No company names, no logos, no product names. Landscape 16:9, white
> background, generous spacing so the three columns read separately.

</details>

**4E — the two-column variant (Michael's alternative).** Left ① *un gros LLM qui prend tout — bouché*;
right ② *un gros LLM qui prend un échantillon — il oublie les signaux faibles*, with *« et souvent,
c'est ça qu'on a »*. ③ moves to the spoken transition. Simpler image; loses the link to S.

**Recommendation: 4D (three columns)** — it covers the three real reflexes, ② is the one most of the
room meets every day, and ③ sets up S. **4A**'s sentence becomes the bottom line or the spoken
transition to 5.

---

## 2 · Clio

### Slide 5 — Clio
**Job**: the story — the problem, what they built, the bill.

**5A — Three columns: problem · solution · bill.**
*Layout*: `.cols3`. Title *Anthropic, décembre 2024 : Clio*.
- **Le problème** — des millions de conversations avec Claude. Personne ne peut les lire, et personne ne doit les lire.
- **Ce qu'ils ont construit** — un outil qui dégage les grands usages sans qu'un humain lise les conversations.
- **La facture** — **48,81 $** pour 100 000 conversations.
Source line bottom-left.
*Reading*: left → right, ending on the number.
*Needs*: nothing new (`.cols3`, `.card`); a `.ref` source line.

**5B — The number as hero.**
*Layout*: one huge figure *48,81 $*, under it *pour analyser 100 000 conversations*, under that
*Anthropic · Clio · 2024*. The story is told aloud.
*Reading*: number → what it buys → who.
*Needs*: a `.kpi` big-number block.

**5C — The map.**
*Layout*: a redrawn schematic of Clio's output — bubbles of different sizes with short labels (coding,
writing, analysis…) — title *Un million de conversations, sur une carte*; the bill in a corner badge.
*Reading*: the map (what you get) → the bill.
*Needs*: one drawing, recreated (not copied from the paper).

**Recommendation: 5A** — the three beats in one slide; **5C** if a map visual is wanted early (it
previews 12).

---

### Slide 6 — The promise
**Job**: the sentence people repeat.

**6A — Sentence only.**
*Layout*: `impact`: *Comprendre tout un corpus **sans le lire en entier**.*
*Needs*: nothing.

**6B — Sentence + attribution.**
*Layout*: 6A, plus a small grey line: *— la promesse de Clio : « without the need for human reviewers to read raw conversations »*.
*Reading*: the sentence → whose promise it is (credit, and a fact Yanis can check).
*Needs*: nothing.

**6C — Sentence over texture.**
*Layout*: the sentence over a faint background of thousands of tiny text lines that blur into a map.
*Needs*: one background image; the text must stay readable.

**Recommendation: 6B.**

---

### Slide 7 — SECNA in one line
**Job**: the map of the next five slides; coin the acronym.

**7A — The strip.**
*Layout*: the existing `.secna` strip, five boxes: letter, English word, French verb.
**S** *Summarise* — préparer · **E** *Embed* — projeter · **C** *Cluster* — regrouper · **N** *Name* —
nommer · **A** *Aggregate* — ranger. S and N boxes red-bordered (*consomment des tokens*).
Under it, `.note`: *SECNA : un nom inventé pour ce talk — la recette n'est pas la mienne, c'est celle de Clio.*
*Reading*: five letters → the two red ones → the note.
*Needs*: nothing new.

**7B — A pipeline.**
*Layout*: a horizontal flow: a stack of documents → five steps → a map. A red bracket under S and N:
*ce qui coûte*.
*Reading*: input → output, then the cost bracket.
*Needs*: a diagram.

**7C — The acronym, decoded.**
*Layout*: five very large letters S · E · C · N · A in a row; under each, the English word (small)
and the French verb (bold). Nothing else.
*Reading*: the word SECNA → what each letter means.
*Needs*: a `.acronym` component.

**Recommendation: 7A** — the strip becomes the mini strip of 8–12, so the room sees the same object
shrink and travel.

---

## 3 · Les cinq étapes

> Slides 8–12 share **the letter template** (§0). Proposals vary the *image* and the *cost device*;
> whichever is chosen applies to all five letters.

**Cost device — choose once for 8, 11, 12 (and 21):**
- **(i) Badge** — a pill with the letter's own figure (*45 $ · 92 %*, *3,75 $*, *0,06 $*).
- **(ii) The bill bar** — one horizontal bar *48,81 $*, split S / E+C / N / A; each letter slide
  highlights its own segment. S is visibly almost the whole bar. Reused on 21 (the S segment shrinks).
- **(iii) Nothing on screen** — the figures are said, not shown.
*Recommendation*: **(ii)** on 8 only (the 92 % *is* the bar), **(i)** on 11 and 12, (ii) again on 21.

### Slide 8 — S · Summarise — préparer
**Job**: the expensive letter; show it is preparation, not just a summary; 92 %.

**8A — Template + preparation drawing.**
*Layout*: letter template. Big red **S**, *Summarise — préparer la donnée*. Image: one messy review
(slang, typos, English, two topics) → an arrow labelled *LLM* → a clean card: *sujet : livraison ·
produit : X · ton : agacé · résumé : colis en retard de 10 jours*. Bottom sentence: *Résumer, traduire,
effacer la forme, faire ressortir ce qui porte le sens.* Bill bar top right: *45 $ sur 48,81 $ — 92 %*.
*Reading*: the S → before/after → the 92 %.
*Speaker*: Clio extracts a few attributes per conversation, including a summary of the request;
it needs it for privacy and to choose the angle of analysis. Optional *for you*.
*Needs*: `.letter` layout, bill bar, one before/after drawing.

**8B — The bill as hero.**
*Layout*: the letter S small top-left; the centre is the **bill bar** at full width: a long red S
block *45,00 $*, thin slivers for N *3,75 $* and A *0,06 $*. Caption: *92 % de la facture de Clio : une étape, appelée sur chaque conversation.*
*Reading*: the bar → the red block → the caption.
*Speaker*: then explain what S does.
*Needs*: bill bar component.

**8C — Before / after, side by side.**
*Layout*: `.cols`. Left *Le texte brut* (a real-looking public review). Right *Après S* (the prepared
card). The badge *92 %* in red between them.
*Reading*: left → right; the badge as the price of the arrow.
*Needs*: two cards with monospace text.

**Recommendation: 8A** — it carries both messages (what S really is, what it costs) and teaches the
template.

### Slide 9 — E · Embed — projeter
**Job**: explain embeddings to people who have never heard the word.

**9A — The sphere with three labelled points.**
*Layout*: letter template, ink **E**, *Embed — projeter le sens*. Image: a sphere; three points with
their text: *« Colis jamais arrivé »* and *« Livraison en retard »* close together; *« Super appli »*
far away. Sentence: *Chaque texte devient un point. Plus deux points sont proches, plus leur sens est proche.*
Badge grey: *quelques centimes — ou en local*.
*Reading*: the two close sentences → the far one → the rule.
*Needs*: one sphere drawing (SVG, reused on 10 and 11).

**9B — The shop analogy.**
*Layout*: left, the sphere small; right, an analogy line: *Comme un magasin range ses produits par
rayon, le modèle range les textes par sens.*
*Reading*: analogy first, picture second.
*Risk*: analogies stretch; the sphere already does it.

**9C — A sentence becoming numbers.**
*Layout*: one sentence → a row of numbers *[0.12, −0.48, 0.91 …]* → a point on the sphere.
*Reading*: text → numbers → place.
*Risk*: the numbers frighten Sophie and teach nothing Yanis doesn't know.

**Recommendation: 9A** — the sphere is Michael's image; the three labelled points make it concrete.

### Slide 10 — C · Cluster — regrouper
**Job**: groups appear, with no LLM.

**10A — The same sphere, now coloured.**
*Layout*: letter template, ink **C**, *Cluster — regrouper*. The sphere of 9, points now in coloured
groups, a few grey points left alone. Sentence: *Les points proches forment des groupes — sans LLM,
du calcul pur.* Badge grey: *0 $*.
⏳ Variant (fresh review R8): add *« Certains points ne vont nulle part — c'est là que dorment les cas rares. »*
*Reading*: colours → the lonely grey points → the sentence.
*Needs*: the sphere drawing, coloured version.

**10B — Before / after.**
*Layout*: two small spheres side by side: scattered grey dots → coloured groups.
*Reading*: the change.
*Needs*: two drawings.

**10C — "What your team does in Excel."**
*Layout*: left the coloured sphere; right a spreadsheet column *Catégorie* filling itself.
Sentence: *Ce que votre équipe fait à la main — en une seconde.*
*Reading*: the map → the business equivalent.
*Needs*: a small spreadsheet drawing.

**Recommendation: 10A** — continuity of the sphere; 10C's sentence can be said aloud.

### Slide 11 — N · Name — nommer
**Job**: the trick of the talk — one call per group, not per document.

**11A — The named map.**
*Layout*: letter template, red **N**, *Name — nommer*. The sphere of 10, each group now carrying a
label (*Retards de livraison*, *Remboursements*, *Bugs de l'appli*…). Under it, one line in two
halves: ~~*100 000 documents → 100 000 appels*~~ · ***quelques centaines de groupes → quelques centaines d'appels***. Badge red *3,75 $*.
*Reading*: labels appear → the crossed-out line → the accent line.
*Needs*: sphere, labelled version; strike-through style.

**11B — Inside one group.**
*Layout*: five short example texts of one group → *LLM* → a label card *Retards de livraison*.
*Reading*: examples → name.
*Needs*: a small diagram.

**11C — The two counters.**
*Layout*: two big numbers side by side: *100 000* (grey, crossed) and *quelques centaines* (accent), captions
*appels si le LLM lit tout* / *appels si le LLM nomme les groupes*.
*Reading*: two numbers, one ratio.
*Needs*: `.kpis` component.

**Recommendation: 11A** — the map gets its names, and the ratio sits under it; 11B's mechanism is
said aloud.

### Slide 12 — A · Aggregate — ranger
**Job**: the hierarchy — from coarse to fine; the business payoff.

**12A — Three levels, Clio's own example.**
*Layout*: letter template, ink **A**, *Aggregate — ranger en niveaux*. A three-level tree:
*Écriture* → *Rédaction de contenus* → *Contenus pour le référencement*, with sizes. Sentence:
*Quelques grands thèmes, des milliers de groupes fins. On zoome, on dézoome.* Badge grey *0,06 $*.
*Reading*: top → down → the sentence.
*Source*: Clio paper (example to check word for word before the deck).
*Needs*: a tree drawing.

**12B — The treemap.**
*Layout*: nested rectangles, area = number of documents: big themes, inside them smaller groups;
one rectangle highlighted and "zoomed" in an inset.
*Reading*: like a pivot table or a dashboard — Sophie's and Camille's world.
*Needs*: one treemap drawing.

**12C — Two zoom levels of the same map.**
*Layout*: the named sphere of 11 at two zooms: far (five big themes), near (one theme opened into
its fine groups).
*Reading*: zoom out → zoom in.
*Needs*: two drawings.

**Recommendation: 12B** for the room (it reads like a dashboard), with **12A's** Clio example said
aloud — or **12A** if a sourced example on screen matters more.

### Slide 13 — The sentence
**Job**: sum up 8–12 in the sentence people repeat.

**13A — Impact.** *La data science trouve la structure, **le LLM lui donne du sens**.*
*Needs*: nothing.

**13B — Impact with a recap.** The sentence, and under it a thin line of the five letters, E-C in
grey (*structure*), N in accent (*sens*), S faded (*préparation*).
*Needs*: the mini strip, reused.

**13C — ⏳ Reworded** (fresh review R8 — Yanis: in Clio the LLM *does* read every document):
*La data science trouve la structure, le LLM lui donne du sens — **et quand on le paie par document,
c'est 92 % de la facture.***
*Needs*: nothing; longer.

**Recommendation: 13A**; 13C only if the R8 objection is accepted.

---

## 4 · Les autres

### Slide 14 — The table
**Job**: the others do the same recipe — each changes one thing.

**14A — The full table.**
*Layout*: a table, one row per solution (Clio, Google Urania, LangSmith Insights), one column
per letter (S column header in red), cells ✅ ❌ ◐ ? with a short precision (*petit modèle*, *texte brut*,
*par un LLM*, *≤ 1 000 traces*). The LangSmith row lightly highlighted.
*Reading*: Clio row (the reference) → down the S column (✅ ❌ ? ✅) → the LangSmith row.
*Needs*: a `.matrix` table style.

**14B — Symbols plus a take-away column.**
*Layout*: the same table, cells as symbols only, plus a last column *Ce que ça change*:
Clio *la référence* · Urania *+ confidentialité garantie* ·
LangSmith *un LLM à chaque étape → 1 000 traces max*. Precisions are said, not written.
*Reading*: one row = one line of meaning; Sophie reads the right column, Yanis the symbols.
*Needs*: `.matrix` table style.

**14C — Four mini strips stacked.**
*Layout*: four rows, each the mini strip of slide 7 with letters lit / greyed / marked "?", the
player's name and date left, the take-away right.
*Reading*: the same object as 7–12, four times — the strips *are* the table.
*Needs*: mini strip variant with states (lit, off, ?, partial).

**Recommendation: 14B** — symbols for the technical half, one sentence per row for the rest;
**14C** if the strip has become the deck's signature by then.

---

## 5 · Le calcul

### Slide 15 — The cost curve
**Job**: the thesis in one picture — illustrative, by orders of magnitude.

**15A — Two lines, near-log axis.**
*Layout*: a slide graphic. x: *1 000 · 10 000 · 100 000 · 1 000 000 documents*. A red line *Le LLM
lit chaque document* climbing and leaving the slide with an arrow; an accent line *Le LLM lit les
groupes* almost flat. A small *illustratif* label. Title: *La facture suit le nombre de groupes, pas le
nombre de documents.*
*Reading*: the red arrow → the flat line → the title.
*Needs*: one SVG drawing.

**15B — The flat line takes a step.**
*Layout*: 15A, but the accent line steps up once around 100 000, labelled *un niveau de hiérarchie de
plus* — Michael's idea: the bill grows with the structure, not with the pile.
*Reading*: as 15A, then the step.
*Needs*: the same SVG, one step added.

**15C — Bars by order of magnitude.**
*Layout*: four pairs of bars (red / accent) at 1k, 10k, 100k, 1M, heights on a log scale.
*Reading*: the gap widening pair by pair.
*Risk*: a log scale on bars misleads non-technical readers.

**Recommendation: 15B** — 15A plus the step, which makes the curve Michael's own and pre-empts
"what if the corpus changes shape?".

### Slide 16 — Only for giants?
**Job**: answer the room's doubt; pivot to discovery.

**16A — The same curve, two marks.**
*Layout*: the curve of 15; a mark far right *Clio : 1 000 000*, a mark far left *vous : 10 000 –
100 000*. Title *Réservé aux géants ?* Sentence: *À votre taille, les deux sont abordables — ce que
vous gagnez, c'est voir ce que vous ne cherchiez pas.*
*Reading*: right mark → left mark → the sentence.
*Needs*: the curve SVG with two markers.

**16B — Question and answer, impact.**
*Layout*: `impact`. Big *Réservé aux géants ?*; smaller: *Non : à votre taille, le vrai gain, ce sont
les thèmes que vous ne cherchiez pas.*
*Needs*: nothing; loses the visual callback.

**16C — ⏳ With "le calcul"** (fresh review R6, pending): 16A plus one line of arithmetic from Clio's
price: *40 000 avis : ≈ 20 $ façon Clio · quelques $ en ne nommant que les groupes.*
*Needs*: as 16A.

**Recommendation: 16A**; 16C if the R6 decision is yes.

### Slide 17 — The notebook *(content to be decided — Step 2)*
**Job**: the answer to "only for giants?" — you can do it at home; the repo exists.
The forms below are independent of the dataset; the screens get filled once the notebook runs.

**17A — Output first.**
*Layout*: mini strip on top showing *the notebook's* recipe (S greyed). Left two-thirds: a capture
of the notebook's result — a table of named groups with their sizes (and, ideally, one surprising
group and one that came out wrong). Right third: the **QR code**, the repo URL, three facts:
*< 200 lignes · corpus public · une commande*.
*Reading*: the result (what you get) → the QR code (how to get it).
*Speaker*: a walkthrough of the pre-run notebook; code only in passing.
*Needs*: `.qr` block, a framed capture (`.figure`).

**17B — Five cells, five letters.**
*Layout*: five short code excerpts in a column, each tagged with its letter; QR code right.
*Reading*: the code, letter by letter — the developers' version.
*Risk*: code on screen for 2 min loses half the room (fresh review: 🔴 for Sophie, 🟡 Camille).
*Needs*: code blocks + letter tags.

**17C — Title card, then the real notebook.**
*Layout*: a sober card *Le notebook* + QR code; the speaker switches to Jupyter (pre-run) for
two minutes and comes back.
*Reading*: the slide is a door.
*Risk*: switching windows on stage; Wi-Fi; the PDF loses the content.
*Needs*: nothing on the slide.

⏳ Variant (fresh review R1, pending): one line printed by the notebook — *N documents · X tokens ·
Y $ · Z s* — and that single measured point placed on the illustrative curve of 15.

**Recommendation: 17A** — the output answers *"is it for us?"*, the QR code answers *"can I?"*.

---

## 6 · Ma recette

### Slide 18 — My recipe
**Job**: the recipe I use and defend — and its trade-off.

**18A — The strip, my settings.**
*Layout*: the strip of 7, with my choices written in: **S** greyed, *préparation légère, sans LLM :
texte brut, parfois du contexte* · **E** · **C** · **N** *par groupe* · **A** highlighted, *une table
qu'on filtre par produit, par mois*. Subtitle: *Pas mon invention — celle que j'utilise et que je
défends.* Note: *Ce que je perds : les textes longs et multi-sujets.*
*Reading*: the subtitle → the greyed S → the highlighted A → the loss.
*Needs*: strip with per-letter captions.

**18B — The recipe card.**
*Layout*: a recipe card (the crêpe image made literal): *Ma recette — pour un corpus qui grossit*.
*Ingrédients* : le texte brut, un peu de contexte. *Étapes* : projeter, regrouper, nommer, ranger.
*Astuce* : ne pas faire résumer chaque document par un LLM. *Ce qu'on perd* : les textes longs et
confus. *Temps* : un après-midi.
*Reading*: like a cooking card — title, ingredients, steps, tip.
*Speaker*: one sentence on the crêpe batter (≤ 10 s).
*Needs*: a `.recipe` card component.

**18C — Keep / drop.**
*Layout*: `.cols`: *Ce que je garde* (E, C, N, A — and why) / *Ce que je laisse* (le LLM sur chaque
document — trop cher en tokens et en temps — and what it costs me).
*Reading*: left → right.
*Needs*: nothing new.

**Recommendation: 18B** — memorable, makes the crêpe image visible, and the trade-off reads as an
*astuce* with its price; **18A** if the strip must stay the single visual language.

### Slide 19 — Where it pays
**Job**: the callback — the piles of slide 3, now readable.

**19A — The same four cards, with an outcome.**
*Layout*: the 2 × 2 cards of slide 3, same order and icons, each now with an arrow and what you get:
- **Avis clients** → les vraies raisons des notes basses.
- **Tickets de support** → les catégories qui existent vraiment, pas celles du formulaire.
- **Messages vendeurs** → ce qui bloque les vendeurs, regroupé.
- **Retours ouverts** → ce que les gens disent quand on ne leur pose pas de question.
Note: *Le RAG ne trouve que ce qu'on sait déjà chercher. Ici, les thèmes émergent.*
Title: *Ces piles, vous pouvez maintenant les lire — sans les lire.*
*Reading*: recognition (same cards) → the new lines → the RAG note.
*Needs*: the 2 × 2 grid of 3.

**19B — One pile, before and after.**
*Layout*: `.cols`: left *Avant* — a ticket list with *Autre : 35 %*; right *Après* — the same 35 %
split into a handful of named themes (illustrative).
*Reading*: before → after.
*Risk*: an illustrative split looks like a result.

**19C — RAG vs SECNA.**
*Layout*: two cards: *Le RAG* — *répond à une question que vous posez* / *SECNA* — *vous montre les
questions que vous n'aviez pas posées*.
*Reading*: the contrast.
*Risk*: makes RAG a section; the intent keeps it to one line.

**Recommendation: 19A** — the callback is the point; 19C's sentence fits as the note.

### Slide 20 — Où ça s'arrête
**Job**: the honest limit — earns Laurent's trust, answers Sophie's fear.

**20A — Limit | what I do.**
*Layout*: a two-column table:
| Limite | Ce que j'en fais |
|---|---|
| La plainte rare se noie dans les grands groupes (Clio le dit lui-même) | une carte du volume, pas une alarme : une veille à part pour les signaux critiques |
| Petit corpus, ou corpus uniforme : rien à trouver | sous quelques milliers de textes, demandez au LLM de tout lire |
| Les noms sont une proposition du LLM | je relis un échantillon par groupe ; je vérifie qu'ils tiennent d'un passage à l'autre |
*Reading*: down the left column, then the answers.
*Needs*: a table style (`.matrix`, as 14).

**20B — Three warning cards.**
*Layout*: `.cols3`, three cards, each a limit and one line; Clio's quote in small under the first.
*Reading*: three blocks.
*Needs*: nothing new.

**20C — One sentence and a list.**
*Layout*: big line *Une carte du volume, pas une alarme.* + three bullets.
*Reading*: the formula, then details.
*Needs*: nothing.

⏳ Variant (fresh review R4): add *« une chose que j'ai essayée et qui n'a pas marché »* and *« ce
qu'il faut pour la faire tourner chaque semaine »* — and give the slide ~1:15.

**Recommendation: 20A** — each limit comes with its answer, which is what makes it senior.

---

## 7 · Et demain

### Slide 21 — Small models
**Job**: close the loop on my trade-off — the per-document LLM step is where prices fall first.

**21A — The bill bar, shrinking.**
*Layout*: the bill bar of slide 8; the red S block with a down arrow. Sentence: *La seule étape LLM
qui grossit avec le corpus — c'est là que chaque baisse de prix des petits modèles tombe en premier.*
Small line: *Quand elle coûtera moins de X, je la remets dans ma recette.*
*Reading*: the bar (already known) → the arrow → the threshold.
*Needs*: the bill bar.

**21B — The price trend and a threshold.**
*Layout*: an illustrative line of the price per million tokens of small models going down over time;
a horizontal dashed line *mon seuil*; where they cross, *S revient*. Vendor figures, if any, labelled
*chiffres éditeur*.
*Reading*: the falling line → the threshold → the crossing.
*Needs*: one SVG.

**21C — Impact.**
*Layout*: `impact`: *Demain, on pourra préparer chaque document pour presque rien — **et S reviendra
dans la recette.***
*Needs*: nothing.

**Recommendation: 21A** — the room already knows the bar; seeing the 92 % block shrink is the whole
argument.

### Slide 22 — The setup
**Job**: open the encore.

**22A** — `impact`: *Et si on mettait **un agent** dessus ?*
**22B** — 22A + a small line: *(un assistant qui parcourt la carte à votre place)* — defines the word.
**22C** — the named map of slide 12 with a small cursor or robot icon hovering over it, the question as title.

**Recommendation: 22B.**

### Slide 23 — The video (30 s)
**Job**: one question, one answer — a glimpse, no explanation.

**23A** — `clip`, full bleed, no chrome, sound on.
**23B** — `clip` with the question asked to the agent as a caption on top for the first seconds, then
the answer in the video.
**23C** — for the PDF: the first frame as an image with a play mark (the HTML plays the video).

**Recommendation: 23B**, with **23C** as the PDF fallback.

### Slide 24 — Close
**Job**: the last image — the sequel booked, the action clear, the QR code on screen for the Q&A.

**24A — The sentence and the QR code.**
*Layout*: `impact`: *Ce sera pour la prochaine fois.* Under it, *Merci*, the QR code and the repo URL.
*Needs*: `.qr` block.

**24B — ⏳ Two Monday actions** (fresh review R7):
*Layout*: QR code centre; left *Lundi, côté tech : clonez, lancez, changez de corpus.* Right *Lundi,
côté métier : prenez votre catégorie « Autre » et un développeur, une demi-journée.* The sentence on top.
*Needs*: `.cols` + `.qr`.

**24C — Back to the cover.**
*Layout*: dark, like the cover: the title again — *Vos corpus grossissent. Pas votre budget de
tokens.* — the QR code, *Merci*.
*Reading*: the loop closes.
*Needs*: `cover` + `.qr`.

**Recommendation: 24A**, or **24B** if the R7 decision is yes.

---

## 8. Summary

### Recommended picks

| # | Slide | Pick | Alternative |
|---|---|---|---|
| 1 | Cover | 1A | 1C (curve preview) |
| 2 | Real question | 2A | 2C |
| 3 | Piles | 3A | 3B |
| 4 | Hook | 4D (three reflexes: all at once · a sample · one by one) | 4E (two columns) |
| 5 | Clio | 5A | 5C |
| 6 | Promise | 6B | 6A |
| 7 | SECNA in one line | 7A | 7C |
| 8 | S | 8A (with the bill bar) | 8B |
| 9 | E | 9A | — |
| 10 | C | 10A | 10C |
| 11 | N | 11A | 11C |
| 12 | A | 12B | 12A |
| 13 | Sentence | 13A | 13C ⏳ |
| 14 | The table | 14B | 14C |
| 15 | Curve | 15B | 15A |
| 16 | Only for giants? | 16A | 16C ⏳ |
| 17 | Notebook | 17A | 17C |
| 18 | My recipe | 18B | 18A |
| 19 | Where it pays | 19A | — |
| 20 | Limits | 20A | 20B |
| 21 | Small models | 21A | 21C |
| 22 | Setup | 22B | 22A |
| 23 | Video | 23B + 23C | 23A |
| 24 | Close | 24A | 24B ⏳ |

### Theme components to add (for the recommended picks)

| Component | For | What |
|---|---|---|
| `.letter` | 8–12 | Big letter left, verb, image right, sentence bottom, badge top right, mini strip on top |
| `.badge` (`.cost`, `.free`) | 8–12 | The cost pill — red for tokens, grey for ≈ 0 |
| `.billbar` | 8, 21 | One bar split in segments S / E+C / N / A, one segment highlighted |
| `.mini` strip states | 8–12, 17, 18 | The strip of 7, small, with lit / off / greyed letters |
| `.grid2` | 3, 19 | 2 × 2 cards with icon, bold name, one line |
| `.matrix` | 14, 20 | A clean table: header row, symbol cells, one highlighted row |
| `.recipe` | 18 | A recipe card: title, ingredients, steps, tip, cost |
| `.qr` | 17, 24 | QR code + URL block |
| `.figure` | 5, 17 | A framed capture |
| strike-through | 2, 11 | `<del>` styled grey in `impact` and content |
| `.ref` | 5, 6, 8, 14 | A grey source line bottom-left |

### Images to draw (simple, neutral, SVG → PNG)

| Image | Slides |
|---|---|
| The curve: red line climbing with an arrow, flat accent line with one step, near-log axis | 1 (mini), 15, 16 |
| Before / after of one text through S | 8 |
| The sphere — plain with three labelled points; coloured groups; named groups | 9, 10, 11 |
| The treemap (themes → fine groups) | 12 |
| Four pile icons (avis, tickets, messages, retours) | 3, 19 |
| The recipe card illustration (optional) | 18 |
| « Pourquoi ne pas juste demander à un LLM ? » — regenerated in French, neutral labels | 4 |
| QR code of the repo | 17, 24 |
| Notebook output capture | 17 (after Step 2) |
| Video, 30 s, one question, one answer | 23 (plan 3.5) |
