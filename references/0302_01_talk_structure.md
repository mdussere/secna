# Talk structure — parts, slides, what each one is for (v3)

> Plan Step 3.2, first pass: **structure only** — the parts, the number of slides, and what each
> slide carries in one line. Detailed content comes once this is agreed; the deck is generated only
> after that. Derived from the intent [`0301_01_talk_intent.md`](0301_01_talk_intent.md).
> **v3 (2026-10-20)** — Michael's reordering of v2: the notebook moves up as **the answer to "only
> for giants?"**; *my recipe* comes after it, as **the recipe I use and defend** (not one I
> invented); then what the hierarchy allows, where it pays; *et demain* shrinks to **one** slide on
> small models, tied to my recipe's trade-off. Earlier versions and their reviews:
> [`0302_03`](0302_03_multi_persona_review.md) (v1), [`0302_04`](0302_04_multi_persona_review_v2.md) (v2).
> The reviewers' findings are **not applied** unless Michael's flow covers them (§5).
> Assumption: **20-minute slot** (to confirm), with a 15-minute cut marked ✂️.

---

## 1. Six parts, 21 slides, ~17.5 minutes

| Part | Slides | ~min | What the part must achieve |
|---|---|---|---|
| **1 · La question** | 1–4 | 2.5 | Swap the question the room walked in with; name their unread piles. |
| **2 · Clio** | 5–7 | 3 | Anthropic's problem, its promise, and its recipe — SECNA — on one strip. |
| **3 · Les gros** | 8–11 | 2 | The same strip for GitHub, Google, LangSmith: what each one changes. Then what they all share. |
| **4 · Le calcul** | 12–14 | 4.75 | The curve; "only for giants?"; **the notebook is the answer** — you can do it at home. |
| **5 · Ma recette** | 15–17 | 3 | The recipe I use and defend, what its hierarchy lets you do, and what it pays. |
| **6 · Et demain** | 18–21 | 2.25 | Small models will let me take back the step I gave up — then the agent teaser. |

## 2. The slides

| # | Part | Slide | What it carries | Kind | ~min | ✂️ 15 min |
|---|---|---|---|---|---|---|
| 1 | 1 | **Cover** | Title, speaker, event | cover | 0:20 | |
| 2 | 1 | **The real question** | Not "unlimited tokens?" but "growing corpora on my budget?" | impact | 1:00 | |
| 3 | 1 | **The piles nobody reads** | Reviews, tickets, seller messages, open feedback | content | 0:40 | |
| 4 | 1 | **The hook** | The labs sell you tokens; to read their own logs they spend very few | impact | 0:30 | |
| 5 | 2 | **Clio** | Anthropic's problem (millions of conversations nobody may read), outcome, published bill | content | 1:15 | |
| 6 | 2 | **The promise** | *Comprendre tout un corpus sans le lire en entier.* | impact | 0:20 | |
| 7 | 2 | **Clio's recipe = SECNA** | The five-step strip, Clio's choices on each step; S and N cost tokens; the acronym is coined | strip | 1:30 | |
| 8 | 3 | **GitHub (July 2024)** | Same strip — no S (raw feedback embedded); five months before Clio, no citation | strip | 0:45 | |
| 9 | 3 | **Google — Urania (2025)** | Same strip — privacy guarantees added on grouping and counting; built against Clio as a baseline | strip | 0:30 | merged with 10 |
| 10 | 3 | **LangSmith Insights** | Same strip — groups and names agent traces, on a sample capped at 1,000 (public docs) | strip | 0:30 | merged with 9 |
| 11 | 3 | **What they all share** | *La data science trouve la structure, le LLM lui donne du sens.* | impact | 0:20 | |
| 12 | 4 | **The cost curve** | LLM on every document vs LLM on the groups — measured | content | 1:45 | |
| 13 | 4 | **Only for giants?** | Same curve, their corpus far right, yours far left — the question the next slide answers | content | 0:30 | |
| 14 | 4 | **The notebook** | The answer: SECNA at home, < 200 lines, a public corpus, a pre-run walkthrough, QR code to the repo | content | 2:30 | 2:00 |
| 15 | 5 | **My recipe** | Same strip — *not my invention, the one I use and defend*, like a recipe you trust: balanced, holds in the pan. My choices: no S (too costly in tokens and time — a trade-off I accept), N on groups, A as a hierarchy in a base you can query | strip | 1:00 | |
| 16 | 5 | **From coarse to fine** | What the hierarchy lets you do: a few big themes down to thousands of fine groups — zoom in, zoom out, filter | content | 0:45 | |
| 17 | 5 | **Where it pays** | The piles of slide 3, back with what you get; one line on RAG | content | 1:15 | |
| 18 | 6 | **Small models** | They slot into what we already do — and make S affordable again: the trade-off of my recipe shrinks | content | 0:45 | |
| 19 | 6 | **The setup** | *Et si on mettait un agent dessus ?* | impact | 0:15 | |
| 20 | 6 | **The video** | ≤ 60 s, sound on, an agent exploring the same corpus | clip | 1:00 | 0:30 |
| 21 | 6 | **Close** | *Ce sera pour la prochaine fois.* — thanks, QR code | impact | 0:15 | |
| | | | | | **~17:30** | **~15:00** |

## 3. The design ideas

**One strip, five times (slides 7, 8, 9, 10, 15).** The same template — the five SECNA letters in a
row — is reused identically for Clio, each big player, and my recipe. Only what differs changes (a
letter greyed out, a mark added, a cap written on a step). Flipping from one slide to the next, the
room sees the differences and sees that the skeleton never changes.

**The notebook answers a question (12 → 13 → 14).** The curve makes the claim; *"only for giants?"*
voices the room's doubt; the notebook settles it — at home, in an afternoon, on a public corpus.

**My recipe is a recipe, not an invention (15).** Like the crêpe batter you always make: someone else
wrote it, you chose it because it is balanced and it holds in the pan, and you are ready to defend
it. It carries a deliberate trade-off — no per-document summary, because it cost too much in tokens
and in time.

**The end closes the loop (15 → 18).** The trade-off made in my recipe is exactly what small models
will reduce: S comes back, affordable. *Et demain* is not a new argument, it is the next step of my
own recipe. Then the agent teaser, as an encore.

- Only big players on stage (GitHub, Google, LangSmith); Kura, OpenClio, HERCULES in the repo's
  references and the Q&A.
- LangSmith shows only what its public docs say.

## 4. Open questions on v3

- **The notebook (14) comes before my recipe (15)**: what does the notebook run — Clio's SECNA as
  shown on slide 7, or already my recipe? If it runs my recipe, slide 15 explains after the fact
  what the room just saw; if it runs plain SECNA, slide 15 is the variant.
- **Jevons** is no longer a slide; it can be one spoken sentence on 18, or dropped.
- **Slide 18** must name no vendor figure without saying *chiffres éditeur*.

## 5. Reviewers' findings — status in v3

Covered by Michael's flow: **N1** (two endings → one *et demain* slide, tied to the recipe), **N3**
(Jevons no longer a slide), **N7** in part (my recipe framed as chosen, not invented, with its
trade-off stated), **N8** (13 is kept in the 15-min cut), **F7** (video ≤ 60 s), **F8**, **F12** in part.

**Not applied — awaiting Michael's validation** (details in [`0302_04`](0302_04_multi_persona_review_v2.md) §3–§5):

| # | Finding | Proposed fix |
|---|---|---|
| F1 | No stated limit (unanimous; Laurent's blocker) | « Où ça s'arrête » slide |
| F2 | Hook contradicted by Clio's cost table (S = 92 %) | *« Même Anthropic résume chaque conversation — avec son plus petit modèle. »* |
| F4 / N5 | Strips unreadable without French verbs | a verb under every letter, one highlighted change, one caption |
| F5 | Notebook = code on screen | open on the named groups |
| F6 | Curve without assumptions | assumptions line + *« 40 000 avis : X $ vs Y $ »* |
| F9 | At small scale both are cheap | pivot to discovery on 13 |
| F11 | token, corpus, RAG, agent undefined | plain-word definitions |
| N2 | Small models: Clio already uses its smallest model for S; vendor figures | argue from Clio's cost split; label or drop the vendor |
| N4 | LangSmith strip is empty; Urania is researchers' detail | one line each instead of a strip |
| N6 | Strip accuracy (GitHub "identical", Urania's S unknown) | literal components; S *non établi* for Urania |
