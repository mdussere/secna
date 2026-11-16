# The long storyboard — the short video, extended to 20 minutes

> Plan Step 3.7 (2026-10-26). **Question it answers**: what does each beat of the short video become
> in a ~20-minute talk, in what order, with what on screen — so that the long format can be built on
> the short one's engine. Inputs: the short video [`presentation/short/`](../presentation/short/index.html)
> (the reference), the five sections of [`0601_01`](0601_01_video_narrative_storyboard.md), the intent
> [`0301_01`](0301_01_talk_intent.md), long candidate A (`presentation/video_candidates/a/`), the
> LangChain run [`0405_01`](../worklines/secna_notebook/docs/0405_01_langchain_findings.md).
> **For Michael to validate before any build.** On-screen text in English; the talk is spoken in French.

---

## 1. The principle

The short video already tells the whole story in eleven beats, each with one strong visual. The long
format **does not rewrite it — it opens it up**:

- **Each short beat becomes a chapter.** The short's visual stays, unchanged, as the chapter's
  **anchor** — the screen the chapter builds towards and lands on. The long format adds what leads
  to it (context, a demonstration, an example) and, where needed, what follows.
- **Same order as the short.** It works in two minutes; it is the spine. The five sections of `0601_01`
  group the chapters; nothing moves from one section to another.
- **Same engine, same vocabulary.** One HTML page, deterministic `render(t)`, canvas particles with
  keyframed layouts, DOM beats (`data-in` / `data-out` / `data-fx`), counters, holds after busy
  screens. Near-black sky, very large figures, a small capitalised kicker line, **pink = LLM / cost**,
  **cyan = data science**, lime for the accent. No captions, at most one sentence per screen.
- **The particles are the corpus**, from the first second to the last: the flood, the points that
  don't fit, the sample, the sphere, the groups, the run's 14,947 PRs, the weak signal.
- **Live mode** (the meetup): the same page, advanced by the presenter — every hold of the short
  becomes a **stop**; a key press plays the next beat. **Recorded mode**: the same beats, timed.

## 2. The map — short beat → long chapter

| # | Short beat | Long chapter | Section (`0601_01`) | ~min |
|---|---|---|---|---|
| 0 | — | **Title** — talk title, speaker line, event | 1 · L'impasse | 0:20 |
| 1 | Flood · *Nobody reads it all.* | **The pile** | 1 · L'impasse | 0:40 |
| 2 | The wall · *It doesn't fit.* | **Two scales** | 1 · L'impasse | 1:00 |
| 3 | Three reflexes · *Three dead ends.* | **Three dead ends**, each demonstrated | 1 · L'impasse | 1:00 |
| 4 | Clio · *Understand a whole corpus without reading all of it.* | **Clio** | 2 · Clio | 1:30 |
| 5 | SECNA rail · five letters · *Data science finds the structure. The LLM gives it meaning.* | **SECNA, letter by letter** | 3 · SECNA | 3:00 |
| 6 | The bill · *92% of the bill is S.* · *Short texts? Skip the LLM.* | **The bill** | 3 · SECNA | 1:15 |
| 7 | Curve · *The bill follows the groups, not the documents.* | **The curve** | 4 · Les gros, et nous | 1:00 |
| 8 | Players · *The same recipe, again and again.* | **The others** | 4 · Les gros, et nous | 1:00 |
| 9 | LangChain run · **$0.15** | **The notebook**, cell by cell, landing on the run frame | 4 · Les gros, et nous | 5:30 |
| 9b | Weak signal · the largest of the 100 clusters | **What the map shows** | 4 · Les gros, et nous | 0:45 |
| 10 | End · the two sentences | **My recipe** → **the agents** | 5 · Ma recette | 3:00 |
| | | | **Total** | **≈ 20:00** |

**The 15-minute cut** (if the slot shrinks): chapter 3 back to its short form (0:25), chapter 5 at
two letters in depth (S, C) and three at short length (1:45), the notebook at 4:00, chapter 10
without *where it stops* (2:00).

## 3. The chapters

Per chapter: **Anchor** (the short's screen, kept), **Builds up with** (the new screens, in order),
**The point**, **Material** (where the content comes from). *Said* lines are the gist, not the
script (that is Step 3.4).

### Section 1 · L'impasse (~3:00)

#### 0 · Title (0:20)
- **Screen**: the particle sky, still. *Your corpora keep growing. Your token budget doesn't.* — the
  largest text; under it the speaker line and *Generative AI Bordeaux · 19 November 2026*.
- **Material**: candidate A *Titre*; intent §9 (the punchline the largest text).

#### 1 · The pile (0:40)
- **Anchor**: the flood of sources — *Customer reviews · Support tickets · Seller messages · Agent
  traces* — then *Nobody reads it all.*
- **Builds up with**: the sources arrive one by one, each with a single real-looking example line
  (a review, a ticket, a message, a trace) before turning into particles; the particle count climbs.
- **The point**: everyone in the room has this pile.
- **Material**: candidate A *La pile* and *« Autre »* (the "Other" category where unread text ends up).

#### 2 · Two scales (1:00)
- **Anchor**: *1 million reviews × ~100 tokens ≈ 100,000,000 tokens* vs *the largest context window
  ≈ 1 million* → *It doesn't fit.*
- **Builds up with**: a log axis of tokens (10³ → 10¹²) with two bars growing from 2023 to 2026 —
  the context window, our corpora; the window grows, the corpus grows faster. Then the **loop**:
  bigger models → more generated text (summaries, logs, agent traces) → bigger corpora. Kicker:
  *Not a race — not the same scale.*
- **The point**: it won't get better by waiting for bigger models.
- **Material**: `0601_01` §1 (two scales, the loop); candidate A *La course*. Figures labelled as
  orders of magnitude.

#### 3 · Three dead ends (1:00)
- **Anchor**: *"Let's just ask an LLM."* — the three reflexes struck through, *Three dead ends.*
- **Builds up with** one short demonstration each, on the particles:
  1. *Give the model everything* — the corpus pours into a context frame that overflows; what gets
     in is diluted (the middle fades).
  2. *Take a sample* — 1% of the particles light up; a small, tight group sits in the unlit 99%:
     *What isn't drawn doesn't exist.*
  3. *One LLM per document* — each particle turns into a summary card; the cards pile up (100,000)
     and a cost counter runs: *No big picture — and a bill.*
- **The point**: the three obvious answers fail for three different reasons.
- **Material**: candidate A *Demandons à un LLM*, *Trois impasses*, *La vraie question*.

### Section 2 · Clio (~1:30)

#### 4 · Clio (1:30)
- **Anchor**: *December 2024 · Anthropic · Clio* → *Understand a whole corpus without reading all
  of it.*
- **Builds up with**: who they are in one line; their problem — millions of conversations, **too
  many to read and not to be read** (private); why the three dead ends fail them too (a callback to
  chapter 3, the three struck titles flash). Then the **two layers**: the particle field splits into
  *structure* (cyan — geometry, groups) and *meaning* (pink — names). The hook, said in its honest
  form: *the labs sell tokens; to read their own usage, they published a recipe that spends almost
  none.*
- **The point**: a real case of impossibility, and a published way out.
- **Material**: `0601_01` §2; candidate A *Décembre 2024*, *Des millions de conversations*, *Le pont*;
  Clio paper (arXiv:2412.13678).

### Section 3 · SECNA (~4:15)

#### 5 · SECNA, letter by letter (3:00)
- **Anchor**: the vertical **S E C N A** rail with each letter's card and chip, ending on
  *Data science finds the structure. The LLM gives it meaning.*
- **Builds up with** ~35 s per letter (the short gives ~5 s), each letter's chip unchanged:
  - **S** — *small LLM (SLM) · 1 call per document — or plain code, no LLM*: one text shown before
    and after (long, messy → short, clean, one language). Said: Clio needs it — long, private,
    multi-topic conversations.
  - **E** — *small model · a few cents*: texts become points; two texts with the same meaning land
    side by side (shown with two example lines). Said: an embedding model is a language model too, a
    small one.
  - **C** — *pure computation · 0 tokens*: dense regions are found and outlined; a few points stay
    outside — shown, not hidden.
  - **N** — *LLM · 1 call per group*: a few examples from one cluster fly to the model; a name
    comes back and sits on the cluster; then all names arrive.
  - **A** — *LLM · 1 call in total*: clusters stack into themes; the map zooms into one theme and out
    again (coarse to fine).
- **The point**: five steps you can rebuild from memory; only two spend tokens.
- **Material**: the short's rail and layouts; `0601_01` §3; candidate A *Cinq lettres*, *S*…*A*.

#### 6 · The bill (1:15)
- **Anchor**: *Clio's published bill · 100,000 conversations* — **$48.81**, the bar, *92% of the bill
  is S.* → S collapses → **$3.81**, *Short texts? Skip the LLM.*
- **Builds up with**: the bar fills letter by letter, in pipeline order (S, then E C almost nothing,
  then N, then A); *≈ $500 for a million documents*. After the collapse, one line on what *short
  texts* means: reviews, tickets, PR descriptions — already short and focused.
- **The point**: the cost is in S; for short texts, S can be plain code.
- **Material**: Clio cost table; the short's bill scene.

### Section 4 · Les gros, et nous (~8:15)

#### 7 · The curve (1:00)
- **Anchor**: the two curves, 1k → 1M documents: *LLM on every document* rises out of the frame,
  *LLM on the groups* stays almost flat → *The bill follows the groups, not the documents.*
- **Builds up with**: a marker for **our scale** (a few thousand to tens of thousands of documents)
  and for the giants' (millions); said: at our size the naive way is still affordable — the gain is
  seeing what we were not looking for. Labelled *illustrative*.
- **Material**: the short's curve; candidate A *La courbe de coût*, *Réservé aux géants ?*.

#### 8 · The others (1:00)
- **Anchor**: three cards — *Google Research · Urania*, *LangChain · LangSmith Insights*, *Open
  source · Kura* — *The same recipe, again and again.*
- **Builds up with**: each card arrives on its own with its one fact (Urania: privacy guarantees,
  benchmarked against Clio; Insights: groups agent traces and names the groups; Kura: *"a simple
  reproduction of the CLIO paper"*), then the three collapse onto the same five-letter rail.
  Neutral: no judgement on anyone's choices.
- **The point**: convergence, not lineage — and not only for labs.
- **Material**: the short's cards; candidate A *Le point commun*; BIBLIO.

#### 9 · The notebook (5:30) — *Can I do it too?*
The short's run frame becomes the **end** of the notebook: the notebook is how we get there. Screens
of the real run, re-animated in the same visual language (code lines appearing, outputs building) —
not screenshots. Corpus: **LangChain, every pull request over three months.**

| | Cell | What is shown | ~ |
|---|---|---|---|
| 9a | **Setup** | the repo, one command, one config line; *< 200 lines · public corpus · one command* | 0:30 |
| 9b | **The corpus** | the PRs arrive as particles: **14,947 PRs · 137 repos · 3 months** (the short's counter) | 0:30 |
| 9c | **S — no LLM** | one PR turned into one markdown text (title · repo · origin · description); *S: no LLM* | 0:30 |
| 9d | **E — on-premise** | the embedding cell on the laptop: a progress bar, *11 min · $0*; the 2-D map fills point by point | 1:00 |
| 9e | **C — 100 clusters** | the map splits into 100 clusters; sizes 22 → 310; outliers visible | 0:45 |
| 9f | **N — 100 calls** | names arriving one by one in a list; the token counter ticks once per cluster | 0:45 |
| 9g | **A — 7 themes** | the themes chart builds (the short's bars, *Agent products & reliability* 29% first) | 0:45 |
| 9h | **The bill** | the anchor: **$0.15** for the whole run, next to what an LLM on every PR would have cost | 0:30 |
| 9i | **Your corpus** | the one line to change; the QR code, long enough to scan | 0:15 |

- **The point**: it runs on a laptop, on public data, for fifteen cents.
- **Material**: `notebook/test_secna_langchain.py` and its run; `0405_01` §1–4; `0601_01` §4.5;
  candidate A *Notebook — …* scenes (structure and pacing).

#### 9b · What the map shows (0:45)
- **Anchor**: *Weak signal · the largest of the 100 groups* — *A bot fixing LangChain's docs
  assistant* — *One cluster · 310 PRs · 5 repos* — the cluster drawn as a cloud with its name.
- **Builds up with**: the cluster's month-by-month count (5 → 230 → 75) appearing beside it: nobody
  was looking for it; the clustering surfaced it.
- **The point**: the themes emerge — this is not search (*RAG finds what you already know to look
  for*).
- **Material**: `0405_01`; duckdb on the corpus.

### Section 5 · Ma recette (~3:00)

#### 10 · My recipe → the agents (3:00)
- **Anchor**: the short's ending — *Data science finds the structure, the LLM gives it meaning* — and
  the SECNA wordmark.
- **Builds up with**:
  1. **My recipe** (0:40) — the rail again with my settings: *S: plain code · E: on-premise · C · N ·
     A* — the one I use and defend, not my invention.
  2. **Why a table** (0:40) — every text keeps its cluster, theme, date, repo: the table filtered
     live (themes by month, a cluster rising — the 5 → 230 → 75 of 9b).
  3. **Where it stops** (0:40) — three limits, one line each: a rare, serious case absorbed in a big
     cluster; nothing to find in a small or uniform corpus; names are a proposal, checked on a sample.
  4. **Tomorrow** (0:30) — S is the only LLM step that grows with the corpus: every price drop of
     small models lands there first.
  5. **The agents** (0:30) — a query enters the map and moves through it on its own, theme → cluster
     → example. *And if we put agents on it?* — then *Next time.* and the repo address.
- **Material**: `0601_01` §5; candidate A *Ma recette*, *SECNA sans le S*, *Pourquoi une table*,
  *Où ça rapporte*, *Demain*, *Et si… des agents ?*.

## 4. What has to be built (beyond the short)

New particle layouts and scenes, in the short's engine:

- the log axis with two growing bars, and the loop (ch. 2);
- the overflowing context frame, the 1% sample with a missed group, the summary-card pile (ch. 3);
- the two-layer split of the field (ch. 4);
- per letter: before/after text (S), two example points side by side (E), outlined clusters with
  outliers (C), examples → name (N), zoom into one theme (A) (ch. 5);
- the notebook cells re-animated: code lines, progress bar, the 2-D map of the real run, the names
  list, the themes chart (ch. 9) — from the run's real outputs;
- the month-by-month count of the weak signal (9b); the live table (ch. 10); the agent path on the
  map (ch. 10);
- **live mode**: stops at each hold, key presses to advance and go back.

## 5. Open — for Michael

1. **The notebook's corpus on stage**: LangChain (as in the short — S without LLM, E on the laptop,
   $0.15), with the GitLab run kept for the README and the Q&A? *Recommended: LangChain.*
2. **A second weak signal** in 9b — *Made by Open SWE*: 27% of human PRs signed by LangChain's own
   agent, 588 → 1,333 a month (`0405_01` §5.1). Strong, but to re-check as the other agent signals
   were before using it.
3. **The hook** (ch. 4): how far the *labs sell tokens* wink goes — kept to its honest form above.
4. **« groups » or « clusters » on screen**: the short says *groups* (the curve, the N chip, *→ 100 groups*, the weak-signal kicker) and *cluster* elsewhere (*One cluster · 310 PRs*). One word for the long format — *clusters*?
5. **Recorded mode**: silent with your voice recorded over it, or kept for later — the short has no
   audio and stays so.

## 6. Next

Michael validates or amends this map → the narration script for the ear (3.4, French, ~2,800 words) →
build chapter by chapter on the short's engine (5.1), starting with the notebook (the longest, and
the one the run's outputs shape).
