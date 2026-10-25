# Talk structure — proposal B: one slide per letter (B v2)

> Plan Step 3.2. **Adopted structure** (2026-10-20), preferred unanimously over proposal A
> ([`0302_01_talk_structure.md`](0302_01_talk_structure.md), kept as the explored alternative) in
> [`0302_07_review_a_vs_b.md`](0302_07_review_a_vs_b.md). Level: parts, number of slides, one line
> per slide — no slide content yet, no deck. Intent: [`0301_01_talk_intent.md`](0301_01_talk_intent.md).
> **The idea**: **teach** SECNA, one image-led slide per letter, each with what it costs (Clio's
> published figures) — the room sees where the bill goes; the big players then fit on one slide.
> **B v2** applies Michael's decisions of 2026-10-20 (§4).
> Assumption: **20-minute slot** (to confirm), with a 15-minute cut marked ✂️.

---

## 1. Seven parts, 24 slides, ~17 minutes

| Part | Slides | ~min | What the part must achieve |
|---|---|---|---|
| **1 · La question** | 1–4 | 2.5 | Swap the question the room walked in with; name their unread piles. |
| **2 · Clio** | 5–7 | 1.75 | Anthropic's problem and promise; SECNA announced in one line. |
| **3 · Les cinq étapes** | 8–13 | 3.5 | One letter per slide — what it does, an image, what it costs — then the sentence that sums it up. |
| **4 · Les autres** | 14 | 1 | Clio, Google, LangSmith on one table — who does which letter, and how. |
| **5 · Le calcul** | 15–17 | 4 | The curve (illustrative); "only for giants?"; the notebook is the answer. |
| **6 · Ma recette** | 18–20 | 2.5 | The recipe I use and defend, where it pays, where it stops. |
| **7 · Et demain** | 21–24 | 1.5 | The per-document LLM step is where prices fall first — then the agent teaser. |

## 2. The slides

| # | Part | Slide | What it carries | Kind | ~min | ✂️ 15 min |
|---|---|---|---|---|---|---|
| 1 | 1 | **Cover** | Title, speaker, event | cover | 0:20 | |
| 2 | 1 | **The real question** | Not "unlimited tokens?" but "growing corpora on my budget?" — *token* defined in passing | impact | 1:00 | |
| 3 | 1 | **The piles nobody reads** | Reviews, tickets, seller messages, open feedback | content | 0:40 | |
| 4 | 1 | **The hook** | *Même Anthropic lit chaque conversation — avec son plus petit modèle. Un plus gros ne lit que les groupes.* | impact | 0:30 | |
| 5 | 2 | **Clio** | Anthropic's problem (millions of conversations nobody may read), outcome, published bill: $48.81 / 100k | content | 1:00 | |
| 6 | 2 | **The promise** | *Comprendre tout un corpus sans le lire en entier.* | impact | 0:20 | |
| 7 | 2 | **SECNA in one line** | The five letters, five French verbs — the map of the next slides; the acronym is coined | strip | 0:30 | |
| 8 | 3 | **S — Summarise** | Not just a summary — **preparing the data**: summarise, translate, strip the wording, bring forward what carries meaning (Clio extracts a few attributes per conversation, incl. a summary of the request). 🔴 one LLM call per document — Clio: **$45 of $48.81, 92 %**. Optional *for you*; Clio needs it for privacy | letter | 0:45 | |
| 9 | 3 | **E — Embedding** | A projection: each text becomes a point on a sphere — the closer two points, the closer their meaning. A small embedding model, can run locally. ≈ free | letter | 0:45 | |
| 10 | 3 | **C — Cluster** | Close points form groups — no LLM, pure computation. $0 — the number of groups is a choice | letter | 0:30 | |
| 11 | 3 | **N — Name** | 🔴 the LLM reads a few examples per group and names it — one call per group, not per document. Clio: **$3.75** | letter | 0:40 | |
| 12 | 3 | **A — Aggregate** | Count and stack in levels: a few big themes down to thousands of fine groups — zoom in, zoom out. Clio: $0.06 | letter | 0:45 | |
| 13 | 3 | **The sentence** | *La data science trouve la structure, le LLM lui donne du sens.* | impact | 0:10 | |
| 14 | 4 | **Les autres** | **One table**: a row per solution (Clio, Google Urania, LangSmith Insights), a column per letter — used, not used, partly, or how (§3) | table | 1:00 | 0:30 |
| 15 | 5 | **The cost curve** | Illustrative, near-log x-axis — 1 000 · 10 000 · 100 000 · 1 000 000 documents: *LLM on every document* climbs with an arrow off the top; *LLM on the groups* stays almost flat (possibly a second hierarchy level appearing) | content | 1:00 | |
| 16 | 5 | **Only for giants?** | Their corpus far right, yours far left — at your size both are affordable; the gain is the themes you didn't know to look for | content | 0:30 | cut |
| 17 | 5 | **The notebook** | The answer: SECNA at home, < 200 lines, a public corpus, QR code. **Content to be decided** — depends on the notebook and the dataset (plan Step 2) | content | 2:30 | 2:00 |
| 18 | 6 | **My recipe** | *Pas mon invention — celle que j'utilise et que je défends* (crêpe batter: balanced, holds in the pan). My S is a **light preparation**: raw text, sometimes context elements — no LLM call per document (too costly in tokens and time: the trade-off I accept). N on groups; A in a base you can query by product, by month | strip | 0:45 | |
| 19 | 6 | **Where it pays** | The piles of slide 3, back with what you get; one line on RAG | content | 1:00 | |
| 20 | 6 | **Où ça s'arrête** | The rare complaint swallowed by big groups (Clio's own admission); small or uniform corpora; names to check on a sample; one failure seen; what running it in production takes | content | 0:45 | |
| 21 | 7 | **Small models** | Per-document preparation is **the only LLM step that grows with the corpus** — where every price drop of small models lands first. When it costs less than X, it comes back into my recipe. Vendor figures labelled as such | content | 0:30 | |
| 22 | 7 | **The setup** | *Et si on mettait un agent dessus ?* | impact | 0:15 | |
| 23 | 7 | **The video** | **30 s**, very short, punchy: one question, one answer — nothing more | clip | 0:30 | |
| 24 | 7 | **Close** | *Ce sera pour la prochaine fois.* — the Monday action, QR code | impact | 0:15 | |
| | | | | | **~17:00** | **~15:00** |

## 3. The design ideas

**Teach, then compare.** The letter slides (8–12) share one template: the letter, the French verb,
one image, one sentence, a cost badge (🔴 with Clio's figure on S and N; *≈ gratuit* / $0.06 on E, C,
A). The strip of slide 7 reappears small on each letter slide with the current letter lit.

**S is data preparation.** The name stays *Summarise* (SECNA sounds right), but the slide insists:
it prepares the text so that what carries meaning stands out — summarising, translating, removing
the wording, adding context. That is why Clio pays for it, and why my recipe keeps a light,
LLM-free version of it.

**E gets its own slide** because most people don't know what an embedding is. The image: texts
projected onto a sphere, meaning as proximity.

**The players after the recipe**: one table, each difference read on letters the room now knows
(slide 14 — draft, from the public sources in `BIBLIO.md`; checked 2026-10-20):

| | S | E | C | N | A |
|---|---|---|---|---|---|
| **Clio** — Anthropic, déc. 2024 | ✅ chaque conversation, petit modèle (45 $ / 100k) | ✅ | ✅ | ✅ par groupe (3,75 $) | ✅ hiérarchie |
| **Google Urania** — 2025 | ? non établi | ✅ | ✅ + confidentialité garantie | ✅ | ✅ + confidentialité garantie |
| **LangSmith Insights** — 2025 | ✅ chaque trace | ? non documenté | ✅ **par un LLM** | ✅ | ✅ catégories, sous-catégories — **≤ 1 000 traces** |

What the room reads in it: everyone names groups with an LLM (N); Urania adds privacy; **LangSmith puts an LLM on every step — hence the 1,000-trace cap**.
Sources: Clio paper (Table 3, method); Urania paper; LangSmith
Insights docs (*"a brief summary of every trace"*, *"the thinking model performs the clustering
step"*, categories → subcategories with distribution bars, 1,000-trace limit; embeddings never
mentioned).

**The curve is a slide graphic, not a chart**: orders of magnitude on a near-log axis, an arrow that
climbs, a line that stays flat. Clio's published figures are the only numbers; the notebook shows
the recipe works, not the curve.

**Images**: simple diagrams drawn for the talk (texts → sphere → groups → named groups → levels);
no algorithm names on slides.

## 4. Michael's decisions applied in B v2 (2026-10-20)

| From [`0302_07`](0302_07_review_a_vs_b.md) | Decision |
|---|---|
| B1 merge E + C | **Rejected** — E keeps its own slide (embeddings are unknown to most), image = projection on a sphere |
| B2 honest badges + running total | Light version — Clio's figure per letter, no running total |
| B3 describe S literally | **Applied, extended** — S = data preparation (summarise, translate, strip wording, bring forward meaning); my recipe does a light version (raw text + context) |
| B4 slide 21 wording | **Applied** — *the only LLM step that grows with the corpus* |
| B5 | Only *« un plus gros »* on slide 4; no LLM definition |
| B6 limits | Video cut to **30 s** (one question, one answer); the limits slide gets 45 s |
| B7 notebook slide | **Open** — depends on the notebook and the dataset |
| B8 measured numbers | **Rejected** — the curve is illustrative, near-log 1k → 1M, an arrow; no 40 000 figure |
| B9 plain words | Set aside for now |
| Kept from A | the *data science / LLM* sentence (13), convergence with a mini-strip per player (14), coarse-to-fine on A (12), crêpe framing (18) |

## 5. Open

**Decided (2026-10-23) — GitHub is no longer cited** in the talk or the video (Michael).

- Slide 17 (notebook) — after Step 2.1 (dataset) and 2.2 (notebook).
- Threshold X on slide 21 — a number or a sentence.
- Slide 14 — the table's level of detail on screen (component names stay off the slide).

**Decided (2026-10-20) — BERTopic is not on the slides.** It is a convenient glue (embedding →
reduction → clustering in a few lines) that the notebook may use to stay short, and it is entirely
replaceable: SECNA is the recipe, not a library. None of the solutions cited names it; we don't know what they use. It belongs in the Q&A and the README.
