# The video — intent, five sections, storyboard (v2)

> Plan Step 6. **v2 (2026-10-23)** — rewritten on Michael's five sections after the v1 storyboard
> was rejected as *too much*: no humour, no characters, no illustration. **A tech talk, serious in
> tone.** The narrative frame (initial state → disruption → development → resolution → cliffhanger)
> shapes the five sections and nothing else. Content source: the talk intent [`0301_01`](0301_01_talk_intent.md).
> Palette: *Charbon & citron vert*. Markdown only — nothing is built until this is agreed.
> **Decided (2026-10-23)**: voice-over narration (a TTS model, chosen in Step 6.3); ~20 min in total
> with **more than 5 minutes on the notebook**; built in HTML / SVG / JS; GitHub not cited.

---

## 1. Intent

- **What it is**: the talk as a ~20-minute video in French, watchable without having been in the
  room. Five sections, each one making one point, each told by **an animated visual built for that
  point** — not by slides.
- **Tone**: a technical presentation. Sober motion design: data, flows, diagrams, charts that build
  themselves; precise typography; no characters, no jokes, no illustration.
- **Form rules**:
  1. **One visual per section**, built up progressively while the narration advances — it grows,
     transforms, reveals; it is never replaced by a text panel.
  2. **Few words on screen**: labels, figures, one key sentence per section at most.
  3. **Continuity**: each section starts from the state the previous one left (the corpus of
     section 1 is the corpus processed in section 3 and the one you run in section 4).
  4. **Red = cost in tokens**, lime = emphasis, the three group colours for clusters — as in the deck.
- **What the viewer leaves with** (unchanged): the promise *comprendre tout un corpus sans le lire en
  entier*; the means *la data science trouve la structure, le LLM lui donne du sens*; the economics
  *la facture suit les groupes, pas les documents*; the five steps; the notebook; the open question
  of the agent.

---

## 2. The five sections

| | Section | Narrative role | The one point it makes | ~min |
|---|---|---|---|---|
| **1** | **L'impasse** | Initial state | Our corpora are too big for LLMs, and it will not get better: the data grows with the models. It is not a race — the scales are not the same. | 2.5 |
| **2** | **Clio** | Disruption | December 2024: Anthropic faces the real case of technical impossibility, and publishes a way out — link data science and the LLM. | 3 |
| **3** | **SECNA** | Development | The pipeline, block by block: Summarise · Embed · Cluster · Name · Aggregate — what each block does to the data, and what it costs. | 4.5 |
| **4** | **Les gros, et nous** | Turning point | Anthropic is not alone: the big players do SECNA too. Is it only for them? The bill says no — and the notebook proves it, run cell by cell. | 7 (big players + curve ~1.5, **notebook ≥ 5**) |
| **5** | **Ma recette** | Resolution → cliffhanger | What I use, why a table, where it stops, what changes tomorrow — and the open question: what if we put agents on it? | 3.5 |

---

## 3. Storyboard

Per section: **Visual** (the one animated construction), **Beats** (what is said, in order, and what
the visual does at that moment), **On screen** (the only words), **Ends on** (the state handed over).

### Section 1 · L'impasse — *état initial* (~2.5 min)

**Visual — two scales.** A horizontal logarithmic axis of token counts, from 10³ to 10¹². Two bars
grow along it over time (2023 → 2026): the **context window** of the largest LLMs, and the **size of
our corpora**.

**Beats**
1. *Our situation.* Reviews, tickets, messages, logs, survey answers: text that keeps arriving. The
   corpus bar appears and starts to grow. *On screen*: the four sources, as small labels feeding it.
2. *We cannot process it.* Nobody reads it; the LLM was supposed to. The context bar appears — far to
   the left.
3. *The LLMs don't get there.* The context bar grows — a few thousand tokens, then a million. The
   corpus bar grows at the same time, and stays orders of magnitude ahead. *On screen*: two figures
   only, the arithmetic made explicit: *1 million d'avis × ~100 tokens ≈ 100 millions de tokens*
   vs *une fenêtre de contexte ≈ 1 million*.
4. *The loop.* An arrow closes into a loop: bigger LLMs → more generated text (summaries, logs,
   agent traces) → bigger corpora → a need for bigger LLMs. *On screen*: the loop, four words on its
   arcs.
5. *Not a race.* The camera zooms out on the log axis: the gap between the two bars stays a constant
   distance — a ratio, not a lap. *On screen*: *Ce n'est pas une course : ce n'est pas la même échelle.*

**Ends on** the corpus bar, enormous, alone — the corpus we will carry through the video.

**Facts**: context-window sizes and the token arithmetic are orders of magnitude, labelled
*ordre de grandeur*; the loop is an argument, said as one.

### Section 2 · Clio — *élément perturbateur* (~3 min)

**Visual — the impossible case.** The corpus of section 1 is replaced by a far bigger field of
points: conversations. Each point, when the camera gets close, is a long, messy, multi-topic,
private exchange — a semantic object, not a row.

**Beats**
1. *December 2024.* A date and a name appear: *Anthropic · Clio*. Who they are at that moment — one
   of the few labs building frontier models, Claude used by millions — in one sentence.
2. *Their problem.* Millions of conversations. Too many to read; and they **must not** be read —
   they are private. Yet the company must understand what the model is used for. *On screen*:
   *trop nombreuses pour être lues · interdites de lecture*. The real case of technical impossibility.
3. *Why the obvious fails here.* The field cannot fit in any context (section 1); sampling a few
   hundred would miss what matters; reading each one with a large model is out of budget.
4. *What they propose.* The field splits into two layers that light up one after the other: a layer
   of **structure** (geometry, groups — data science) and a layer of **meaning** (names, descriptions
   — the LLM). *On screen*: the two words, *structure* and *sens*, and the link between them.
5. *The bill.* A single figure prints: **48,81 $** for 100 000 conversations. *On screen*: the figure,
   and the promise once: *« Comprendre tout un corpus sans le lire en entier. »*

**Ends on** the two layers, structure and meaning, ready to be opened up.

**Facts**: Tamkin et al., Dec 2024, arXiv:2412.13678 — the $48.81 / 100k cost table; the
*"without the need for human reviewers to read raw conversations"* goal.

### Section 3 · SECNA — *le développement* (~4.5 min)

**Visual — the pipeline.** Five blocks in a row, **S · E · C · N · A**, connected left to right; the
data flows through them. Under the pipeline, the corpus is shown in the form each block gives it.
A cost gauge under each block fills as the data passes (red for S and N, grey for the rest).

**Beats**
1. *The pipeline, named.* The five blocks appear, empty; the acronym, and the fact that it is coined
   for this talk — the recipe is Clio's. *On screen*: the five letters and their five verbs.
2. **S — préparer.** The raw texts enter the first block; they come out shorter, cleaner, in one
   language, with the elements that carry meaning extracted. One text is shown before/after. The S
   gauge fills: *45 $ sur 48,81 $ — 92 %*. Said: one call per document, on Anthropic's smallest model;
   optional for us.
3. **E — projeter.** The prepared texts become vectors, then points on a sphere; two texts with the
   same meaning land side by side. The E gauge barely moves: *quelques centimes · peut tourner en
   local*.
4. **C — regrouper.** On the sphere, dense regions are detected and outlined; a few points stay
   outside. The C gauge stays at zero: *sans LLM*. This is where the structure is found.
5. **N — nommer.** For each group, a few representative points are sent to the large model; a label
   comes back and is attached to the group. The N gauge fills by a small step per group:
   *3,75 $ · un appel par groupe, pas par document*.
6. **A — agréger.** Groups are counted and stacked into levels; the sphere unfolds into a hierarchy
   (a few themes → many fine groups); the camera zooms into one branch and out again. Gauge:
   *0,06 $*.
7. *The whole.* The pipeline runs once more end to end, fast, with all five gauges: the bill reads
   **48,81 $**, 92 % of it in S. *On screen*: *« La data science trouve la structure. Le LLM lui donne
   du sens. »*

**Ends on** the complete pipeline and its bill.

### Section 4 · Les gros, et nous — *le retournement* (~7 min, notebook ≥ 5)

**Visual — the same pipeline, other owners, then a cost curve.**

**Beats**
1. *Not only Anthropic.* The pipeline of section 3 is duplicated; each copy gets an owner and one
   block changes:
   - **Google — Urania (2025)**: the same pipeline with formal privacy guarantees on grouping and
     counting; built with Clio as its baseline.
   - **LangChain — LangSmith Insights (2025)**: an LLM prepares every trace *and* an LLM does the
     grouping — the whole pipeline on LLMs; and the input is capped at **1 000 traces**.
   *On screen*: owner, year, the one difference.
2. *What that shows.* When the LLM does everything, you have to sample; when data science does the
   structure, you can read everything. *On screen*: that sentence.
3. *Is it only for the big ones?* A cost chart on a log axis, 10³ → 10⁶ documents: *LLM on every
   document* rises with the corpus and leaves the frame; *LLM on the groups* stays almost flat, with
   one step when the hierarchy gains a level. *On screen*: *La facture suit les groupes, pas les
   documents* — and *illustratif*.
4. *Our scale.* The giants sit at the right of the chart; our corpora at the left. At our size the
   naive approach is still affordable — not for long, and not the point: the gain is seeing what we
   were not looking for.
5. *Can I do it too?* The pipeline shrinks into a notebook — and the video **stays in it for more
   than five minutes**, cell by cell, on the real run (screens of the executed notebook, re-animated:
   code appearing, outputs building). *Depends on plan Step 2 (corpus + notebook).*
   - **5a — Setup** (~0:30): the repository, one command, the provider set in one line of
     configuration. *On screen*: *< 200 lignes · corpus public · une commande* and the repo address.
   - **5b — The corpus** (~0:30): the public corpus loads; its size appears as the corpus bar of
     section 1 — the same object, now on our machine.
   - **5c — E, projeter** (~1:00): the embedding cell runs; a progress counter; the 2-D projection
     of every text fills in, point by point.
   - **5d — C, regrouper** (~1:00): the clustering cell; groups appear and are counted; the points
     left outside are shown, not hidden.
   - **5e — N, nommer** (~1:00): one LLM call per group, the names arriving one by one in a list;
     the token counter ticks once per group.
   - **5f — A, ranger** (~0:45): the hierarchy table builds; a zoom into one theme and its fine groups.
   - **5g — La facture** (~0:30): the notebook prints what this run cost, next to what *an LLM on
     every document* would have cost on the same corpus.
   - **5h — Votre corpus** (~0:15): the one line to change to run it on your own pile.

**Ends on** the notebook's output: a map of named groups, and its bill.

**Facts**: Urania (arXiv:2506.04681); LangSmith Insights public docs (per-trace summary, clustering by
an LLM, 1 000-trace cap). **GitHub is no longer cited** (Michael's decision, 2026-10-23).

### Section 5 · Ma recette — *résolution, puis cliffhanger* (~4 min)

**Visual — the pipeline, as I run it, then the map in use.**

**Beats**
1. *My recipe.* The pipeline of section 3 again, with my settings: **S** reduced to a light,
   LLM-free preparation (raw text plus context: date, product, rating) — *not my invention, the one
   I use and defend*. The S gauge stays near zero. *On screen*: *Ma recette : sans le S*.
2. *The trade-off.* What I lose: some precision on long, multi-topic texts. Why I accept it: S is
   92 % of the bill and most of the latency.
3. *Why a table.* The output is not a report but a table: each text keeps its group, its level, its
   date, its product. The table is filtered and crossed live: themes by month, themes by product, a
   theme rising. *On screen*: the table, three columns, a filter changing.
4. *Where it stops.* Three limits, each shown on the map and each with its answer: a rare, serious
   complaint absorbed by a large group (a separate watch for critical signals); a small or uniform
   corpus with nothing to find (read it all with the LLM); group names are a proposal (checked on a
   sample, stable from one run to the next).
5. *Tomorrow.* The S gauge comes back: it is the only LLM step that grows with the corpus, so it is
   where every price drop of small models lands first; when it costs little enough, S comes back into
   the recipe. *On screen*: *data science pour la structure · petits modèles pour chaque document ·
   un grand modèle là où le sens se fabrique*.
6. *The cliffhanger.* The map is in place, the table is live. A query enters at the edge of the map
   and starts to move through it on its own, from theme to group to example. *On screen*: *Et si on
   mettait des agents dessus ?* — then *Ce sera pour la prochaine fois* and the repository address.

---

## 4. Changes from v1

- No characters (no crowned robot, no reader silhouette), no humour, no illustration — data, flows,
  diagrams, charts.
- No "hero document" thread across the video; at most **one example text** shown before/after in
  S and placed on the sphere in E (a technical example, not a character).
- Sections re-cut on Michael's plan: *L'impasse* now carries the scale argument (data grows with the
  models); *Clio* is its own section; *SECNA* is its own section; the big players and the notebook
  share section 4; my recipe, the table, the limits and the cliffhanger close in section 5.
- **GitHub removed** from the comparison (and from the deck).

## 5. Decisions (2026-10-23) and what follows

| Question | Decision |
|---|---|
| Narration | **Voice-over**, generated by a TTS model that produces smooth French with natural intonation — chosen in Step 6.3 (the browser's built-in voice is ruled out) |
| Length | **~20 min**, with **more than 5 min on the notebook** (section 4, §3) |
| Build | **HTML / SVG / JS** — one scene per section, a camera, the narration as audio files synchronised per beat |
| GitHub | **Not cited** — removed from the video and from the deck |

Next: write the narration script for the ear (Step 6.2, French, ~2 800 words at ~140 words/min),
then choose the voice (6.3), then build the scenes (6.4).
