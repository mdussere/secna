# Two reviews of the narrative — and the decisions they raise

> Plan Step 3.8 (2026-11-07). Two independent reviews of [`0308_01`](0308_01_narrative.md), each by a
> sub-agent given the material but not the supervisor's reasoning: **(1)** does the draft answer
> Michael's critique of the long version, point by point; **(2)** a devil's advocate that challenges
> the critique itself, the draft and the way the work is done, and looks for other axes. The figures
> the reviews used were re-checked against `corpus.parquet`. What follows: what was corrected at once,
> what both reviews agree on, and **the decisions that are Michael's** — several of them question his
> own direction.

---

## 1. Corrected in the draft at once (facts and honesty — no decision needed)

| Problem | Correction in `0308_01` |
|---|---|
| *"The largest context window ≈ 1 million"* is out of date (2 M offered, 10 M announced) | *Even the largest windows, a few million tokens, hold a fraction of it.* (The frozen short video still says 1 million.) |
| Dead end 3 strikes through *"one LLM per document"* — 40 minutes after Pietro's talk, which describes every image with an LLM | The per-document LLM is not wrong — it is S; alone it gives *a million descriptions and no big picture*. Pietro is credited for S |
| *"The campaign nobody planned"* is false: it is LangSmith Engine, LangChain's own product, under test (210 of the 303 pull requests come from its development instance) | *A campaign you would not have looked for: LangChain's own product proposing fixes as drafts* |
| *"Half written by a bot or an AI agent"* lumps two different things | Two numbers: **28%** opened by bots (dependencies, releases, refreshes), **23%** signed by an AI agent |
| Adding the Open SWE signature to S would change ~2,900 embedded texts and move every cluster, name, theme and figure | **S is not touched.** The signature is counted afterwards, in a cell — and the gap becomes a beat: *my rule missed their agent; the naming step caught it* (`0405_01` §6) |
| LangSmith Insights: an LLM finds the structure there (a summary model and a separate cluster model) | *The same shape*, not *the same recipe* — the published abstract only promises Google and open source |
| *16.3 M tokens vs ≈ 11,000*: reads as compression | The map is neither a compressed copy nor an **index** (Michael, 2026-11-07): an index retrieves what you know you are looking for — the embeddings alone give one; clustering and aggregation show what you did not know to look for |
| *"Five steps, 141 lines"* does not reproduce | *About 130 lines of code* for the five steps (149 lines, 131 non-blank) |
| The QR code would open pytest functions, not the notebook the room saw | A real notebook view of the same code, with the LangChain configuration, is published in the repo |
| Cell 8's *"an LLM on every pull request"* was never computed (≈ $2–3 with the same small model) | Said as *seeing, not saving* at this scale — the saving is the curve (Part 1), not this run |
| The talk ended on its limits | It ends on the published promise: *try it tomorrow on your own corpus* |

## 2. What both reviews agree on (structure)

- **The notebook owns every LangChain finding.** Part 3 replayed cells 10–12 (who writes the pull
  requests, the unexpected cluster, routing a new item) — against *"quand on a fini le notebook, on a
  fini LangChain"*.
- **The why arrives at minute 14.** Announce it in the opening; let Parts 1–2 build towards it.
- **Too long**: 20:25 planned before any live overrun (we are the last talk). Aim at about 17:30
  planned, with a 15-minute cut that really reaches 15.
- **7.3a argued against a straw man**: no agent reads 16 million tokens; agents search. Measured
  instead, on the run: a keyword search for *checkpoint* returns **1,046** pull requests
  (2.5 M tokens), **74%** of them outside the four checkpoint clusters, and it **misses 54%** of the
  579 pull requests inside them; the map reaches all four clusters for **≈ 2,100 tokens**. Careful
  with the claim: for a question you already know, a semantic search over the embeddings (an index)
  would also beat keywords; what the map adds is the overview — what kinds of work exist, and what
  nobody thought to ask.
- **The new material is still mock-up**: voice of customer is illustrative and issue triage a
  proposal. One more run — LangChain's **issues** — makes both real (*what users say* is literally
  what an issue tracker holds).
- **Code, honestly rather than at length**: keep the notebook to about 4:30–5:00; make one cell
  readable for everyone (the N prompt is plain English); let the outputs tell the story; the clicker
  runs the next cell; a highlight shows the line being explained; long lines are wrapped.

## 3. Where the reviews challenge Michael's direction — his decisions

**D1 · The why.** *Michael*: distillation lets the factory's agents consume fewer tokens. *Reviews*:
no public measurement supports it, the one rigorous study finds that repository context files raise
cost by over 20%, and talk 2's abstract is about keeping the factory *« observable, vérifiable »* and
*« comment mesurer »*, not about tokens.
- (a) keep it, framed as a hypothesis and measured on our corpus before the 19th (five history
  questions, tokens per task with and without the map — about two days; a negative result is a
  slide too);
- (b) make **observability** the why: *LangChain already runs an AI software factory — 28% of its
  pull requests from bots, 23% signed by an AI agent; here is what it looks like from outside, for
  fifteen cents* — measured, promised by the abstract, and an answer to talk 2;
- (c) **both**: observability as the why; token savings as the honest open question at the end.
- *Recommended: (c).*

**D2 · Part 3's size.** Two use cases in six minutes, or one use case in four plus one sentence.
*Recommended: one — the factory, observed — with voice of customer carried by LangChain's issues if
D3 is yes, otherwise by one sentence and Clio as the proof, without an invented chart.*

**D3 · Run the notebook on LangChain's issues** (one to two days): real voice of customer, real
routing of a new issue for zero tokens, nothing illustrative left. *Recommended: yes — decide by
Monday 9 November.*

**D4 · Minutes of code.** About six in the draft; four and a half in the reviews. *Recommended:
4:30–5:00, the N prompt readable, the rest scrolled and run.*

**D5 · The opening.** A recap of talks 1–2 (known only from their abstracts — fragile), or **open on
the finding**: *one in four pull requests sent to LangChain last quarter was signed by an AI agent; I
found out for fifteen cents, without reading one* — then one spoken line for Pietro and Matthieu.
*Recommended: open on the finding.*

**D6 · The word.** *Distillation* makes developers think of model distillation and suggests nothing
is lost; the published abstract already says *la carte*. *Recommended: the map, everywhere.*

**D7 · The ending.** The cliffhanger is gone; the open question can replace it honestly: *does the map
cut an agent's tokens? Nobody has measured it; one study says context files cost more; I am
measuring it — tell me your results.* *Recommended: yes, one line, after "try it tomorrow".*

## 4. On the process

- **Detail before decisions** — the reviewer's sharpest point: the WebGL rebuild changed the form
  before the story; this draft wrote 30 beats before the four choices that decide them (the why, real
  or illustrative voice of customer, the issues run, the minutes of code). From now on: decisions
  D1–D7 first, then the narrative is rewritten, then the script and the voice.
- **Rehearsal is not in the calendar.** Reserve 15–18 November for three timed run-throughs, one in
  front of a real product manager.
- **The callbacks rest on two abstracts**: a word with Pietro and Matthieu through the organisers.
- **Prepare the Q&A answer to *"a GROUP BY would have found your bot cluster"*** — 303 of its 310 pull
  requests share one sentence. Keep one finding that only the map shows (for example, where outside
  contributions concentrate).

## 5. Sources of the reviews

The two review reports (2026-11-07) are kept in the session's scratchpad, not in the repo; the
figures in §1–2 were re-checked against `notebook/data/langchain_2026-07-23_2026-10-23/corpus.parquet`
with duckdb.
