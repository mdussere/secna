# The narrative, restarted — three parts

> **Status, 8 Nov 2026.** Parts 1 and 2 were built from this narrative. Part 3 changed after the speaker's review: it stays at night (same backgrounds and graphic elements as Part 1, new scenes) and becomes three high-level uses, with no LangChain figures: the agentic software factory, the voice of users, your own AI products. The hook was dropped; the talk opens on the title. The narration of record is [`presentation/long/script.md`](../presentation/long/script.md).

> Plan Step 3.8 (2026-11-07). **Question it answers**: what story does the talk tell, part by part and
> beat by beat, once we stop stretching the short video? Written from Michael's critique of the long
> version (2026-11-07) and from scratch on the structure: the short's arc is kept where it holds, the
> rest is new. Inputs: the short video ([`0307_02`](0307_02_short_video_analysis.md)), the intent
> ([`0301_01`](0301_01_talk_intent.md)), the abstract ([`0104_02`](0104_02_abstract_fr.md)), the
> notebook ([`test_secna.py`](../notebook/test_secna.py)) and its LangChain run
> ([`0405_01`](../worklines/secna_notebook/docs/0405_01_langchain_findings.md)), the evening's
> programme and public sources (§11). **Draft for Michael — nothing is built until it is agreed.**
> On-screen text in English; the talk is spoken in French.
>
> **v1.1 (2026-11-07)** — facts and honesty corrected after two reviews
> ([`0308_02`](0308_02_narrative_reviews.md) §1). **The structure waits for Michael's decisions
> D1–D7** (`0308_02` §3): the why, the size of Part 3, the issues run, the minutes of code, the
> opening, the word *map*, the ending.

---

## 1. What was wrong, what changes

| Critique of the long version | Decision in this narrative |
|---|---|
| It is the short video stretched: little new material | Part 1 keeps the short's arc, tighter. The new material is Part 2 (the code, for real) and Part 3 (why it matters) |
| SECNA explained at length, for people who code — yet the code is never really shown | SECNA is explained **once, in two minutes, for everyone**. The code is shown **for real** in Part 2: a notebook the speaker scrolls and runs |
| Long examples whose purpose is unclear | **Every example opens with what it is for** |
| The same animation three times: points gathering into coloured clusters | The points → clusters → names → themes animation appears **once**, in Part 1. The notebook shows code, tables and a chart; Part 3 has its own visuals |
| The end is too technical, and the *why* is missing: why distil, why prepare the data? | Part 3 **is the why**: use cases for product people and team leads — voice of customer, the AI software factory |
| The crêpe-batter "my recipe" | Gone. **"My recipe" is the notebook itself** |
| The agents cliffhanger | Agents are no longer a teaser: they are a **use case** (Part 3) |

## 2. The story in one breath

Text piles up — and AI now writes a growing share of it. Nobody can read it, no model can take it
in, and the three obvious ways to "just ask an LLM" each fail. In December 2024 Anthropic showed a
way out with Clio: let data science find the structure, let the LLM give it meaning — the bill then
follows the number of clusters, not the number of documents. Others reached the same recipe; we call
it SECNA. Is it within everyone's reach? Here is the code: a notebook short enough to read on stage,
run on three months of LangChain's pull requests for fifteen cents — and what it shows about
LangChain. Why bother? Because a distilled corpus is read once and then serves everyone: the product
team who wants to know what customers say, and the AI software factory of the previous talk, whose
agents otherwise read, re-read and re-read again the raw history at random — at the token price.

**What the room leaves with**
- the promise: *understand a whole corpus without reading all of it*;
- the means: *data science finds the structure, the LLM gives it meaning*;
- the calculation (PMs): *the bill follows the clusters, not the documents*;
- the instructions (devs): *five steps, about 130 lines of Python, a public notebook*;
- **the why (new)**: *distil once — then people and agents read the map, not the pile*.

## 3. Structure and time

| Part | What it does | Serves | ~min |
|---|---|---|---|
| **0 · Opening** | A bridge from the previous talk, then the title | everyone | 0:30 |
| **1 · The recipe** | The problem → Clio → SECNA → the bill → the curve → the others | everyone; PMs get the calculation | 7:00 |
| **2 · The code** | A pseudo-Jupyter notebook, run cell by cell on LangChain's pull requests; its last cells *are* the LangChain story | developers; PMs see how short it is | 6:00 |
| **3 · Why it matters** | Distil once, read the map; voice of customer; the AI software factory; where it stops | PMs, team leads, developers | 6:00 |
| **End** | The two sentences, the repo, the QR code | everyone | 0:30 |
| | | **Total** | **20:00** |

Two ruptures carry the structure. **Part 1 → Part 2**: the dark animated stage cuts to a notebook
interface — a deliberate *césure*: "now, the real thing". **Part 2 → Part 3**: from the screen of
code back to the stage, with a question: *"why would you want that?"*

## 4. Part 0 · Opening (0:30)

- **0.1 — Bridge** (we speak right after the AI software factory talk, see §11.1). Spoken, no screen
  change: *Pietro described each image once, so that every later step reads a short text instead of
  the image. Matthieu showed a factory where agents write, review and ship code. Before writing,
  each of those agents reads — and reading costs tokens. Tonight: Pietro's idea at the scale of a
  whole corpus, and what it does for Matthieu's factory.*
- **0.2 — Title**: *Your corpora keep growing. Your token budget doesn't.* — speaker line, event, date.

## 5. Part 1 · The recipe (7:00) — the short's arc, tighter

**Purpose**: give everyone the problem, the principle and the calculation, in the short video's
visual language — without stretching it. Two seeds are planted for Part 3: *AI writes more and more
of the pile*, and *the three dead ends are what agents do too*.

| # | Beat | What it is for | On screen | Said (gist) | ~ |
|---|---|---|---|---|---|
| 1.1 | **The pile** | Everyone in the room has one | Reviews · tickets · seller messages · agent traces → *Nobody reads it all.* | Text keeps coming in — and more and more of it is written by AI: summaries, logs, agent traces, pull requests | 0:40 |
| 1.2 | **It doesn't fit** | Orders of magnitude, made visible | 1 million reviews ≈ 100 million tokens · even the largest context windows, a few million tokens, hold a fraction of it · *It doesn't fit.* | And it won't get better by waiting: bigger models write more text (one sentence — the separate "loop" chart is cut) | 0:45 |
| 1.3 | **Three dead ends** | The reflexes of people — and of agents | *Give the model everything* · *Take a sample* · *Just one LLM per document* — each struck through | Diluted; what isn't drawn doesn't exist; a million descriptions and no big picture. Describing each item is useful — it is S, Pietro's method for images — but alone it gives no big picture | 1:00 |
| 1.4 | **Clio** | A real case of impossibility, and a published way out | December 2024 · Anthropic · Clio · *Understand a whole corpus without reading all of it.* | Millions of conversations: too many to read, and not to be read — they are private | 0:45 |
| 1.5 | **SECNA, once** | Five steps anyone can rebuild from memory; only two spend tokens | **The one clustering animation of the talk**: texts → shorter texts (S) → points (E) → clusters (C) → names (N) → themes (A), each step with its cost chip; then *Data science finds the structure. The LLM gives it meaning.* | Everyday words only; the acronym is coined for the talk, the recipe is Clio's and others' | 2:00 |
| 1.6 | **The bill** | The calculation PMs take home | Clio's published bill, 100,000 conversations: **$48.81**, 92% of it S → *Short texts? Skip the LLM.* → **$3.81** | S is "describe each item once" — what Pietro does for images. Reviews, tickets, PR descriptions are already short: S can be plain code | 0:50 |
| 1.7 | **The curve** | The thesis in one chart | *The bill follows the clusters, not the documents.* (illustrative) | Ten times more documents, not ten times the bill | 0:40 |
| 1.8 | **Not an isolated case** | It is a pattern, not a lab trick | Urania · LangSmith Insights · Kura → *The same shape, again and again.* | Convergence, not lineage. (LangSmith Insights lets an LLM find the structure — the same shape, not the same recipe; Intercom's Topics Explorer, §11.2, could replace it. The published abstract promises Google and open source: keep this beat in every cut) | 0:20 |
| 1.9 | **The turn** | Hand over to the code | *Is it within everyone's reach?* | "Let me show you the code." → *césure* | 0:10 |

**Cut from the long version**: the separate *bigger models won't fix it* chart (one sentence in 1.2
instead); the five per-letter scenes and the *meaning* screen (folded into 1.5); Clio's own
two-layer clustering (folded into 1.5); the code card *a few dozen lines of Python* (Part 2 shows the
real thing).

## 6. Part 2 · The code (6:00) — a notebook you can scroll

**Purpose**: prove that it is short, readable and real; show "my recipe" as code; and let the
LangChain example be the notebook's own output — when the notebook ends, the LangChain story has been
told.

### 6.1 The form: a pseudo-Jupyter, run by the speaker

- The stage cuts to a **notebook interface** that looks like JupyterLab — recognisable at first
  glance — but is part of the talk's HTML: no kernel, no network, no risk.
- The speaker **scrolls** freely (wheel, arrows) and **runs** a cell with Shift+Enter, as in Jupyter:
  `[*]`, then the execution number, then the output appears — progressively, long outputs
  fast-forwarded (the 11-minute embedding bar runs in a few seconds, said as such).
- A cell can be re-run; the boring part (paging through the public API) is a **folded cell** that
  can be opened to show it exists.
- The code shown is **the real code** of `notebook/test_secna.py`, line numbers on; the scrollbar
  shows the whole length; a corner counter reads *five steps · about 130 lines*. The outputs are **the
  run's real outputs** (§10), replayed from a captured log of the run — said once on stage. No
  particle animation in this part.
- Same keys as the rest of the talk to leave the notebook and come back.

### 6.2 The cells

| # | Cell | What the speaker says it is for | Output (the real run) | ~ |
|---|---|---|---|---|
| 1 | **Configuration** — the lines that matter | "The one line to change to run it on your pile" | — (`REPOS = github.com/langchain-ai`, three months, a local embedding model) | 0:20 |
| 2 | **The corpus** (folded) | "Every pull request of the organisation, from the public API" | *14,947 pull requests · 137 repositories · 1,607 authors* | 0:25 |
| 3 | **S · Summarise — without an LLM** | "A pull request description already is a summary: title, repository, who made it, labels, description" | who made them (people, bots, agents); *median 291 tokens*; *0 LLM calls* | 0:35 |
| 4 | **E · Embed — on the laptop** | "An open model on the CPU: no key, no bill" | progress bar, *14,947 in 11 min*; *768 numbers per pull request*; *$0* | 0:35 |
| 5 | **C · Cluster** | "Three lines. How many clusters is a setting" | *100 clusters · from 22 to 310 pull requests* | 0:25 |
| 6 | **N · Name** | "One call per cluster — and here is the prompt, in plain English" (the prompt is on screen) | names arriving ten by ten; *≈ 1 million tokens · ≈ $0.13* | 0:45 |
| 7 | **A · Aggregate** | "One call: a hundred names become seven themes" | the seven themes and their sizes | 0:30 |
| 8 | **The bill** | "What the whole run cost" | **$0.15** — an LLM reading every pull request with the same small model would cost a few dollars: at this scale the gain is *seeing*; the saving is the curve's story (1.7) | 0:20 |
| 9 | **The picture** | "What happened in LangChain in three months" | the themes chart (agents first: 29%) | 0:30 |
| 10 | **Cross the table** *(new cell)* | "Every pull request keeps its cluster and its theme: now I can ask questions" | **28%** opened by bots, **23%** signed by an AI agent; their own agent signs 27% of the human ones — and a beat: *my rule in S missed their agent's signature; the naming step caught it* | 0:40 |
| 11 | **The unexpected** *(new cell)* | "Nobody was looking for this: the largest cluster" | LangChain's own product, LangSmith Engine, proposing fixes to its docs assistant as drafts — 310 pull requests, 303 carrying the same sentence, 5 → 230 → 75 a month | 0:40 |
| 12 | **A new item** *(new cell, optional)* | "A new pull request or issue arrives: which cluster? Zero tokens" | its nearest cluster and that cluster's card | 0:30 |

≈ 6:15 → trim by folding cell 9 into 10, or by dropping 12.

**Ends on** the unexpected cluster, then a sentence that opens Part 3: *we turned 16 million tokens of
pull requests into a map of 11,000 tokens, for fifteen cents. Why would you want that?*

### 6.3 What the notebook must gain for this to be honest

The pseudo-notebook shows only code that exists in the public repo. Before the build, in the
notebook workline:
- cells 8 and 10–12 (the bill, crossing the table, the largest cluster, routing a new item) are
  written and run — no existing code prints them yet;
- **S is not touched**: it writes *origin* into the embedded text, so adding the *Made by Open SWE*
  signature there would change ~2,900 embedded texts and move every cluster, name, theme and figure.
  Cell 10 counts the signature afterwards, as its own column — and the gap becomes a beat;
- a **real notebook view** of the same code, with the LangChain configuration, is published in the
  repo (the QR code must open what the room saw, not pytest functions);
- the abstract sent in `0104_02` said *"under 200 lines"*: the five steps are **about 130 lines of
  code** (149 lines, 131 non-blank); the whole file with the API extraction is 373.

## 7. Part 3 · Why it matters (6:00)

**Purpose**: answer *why distil, why prepare the data* — for the whole room, in plain words, with
uses rather than techniques. Less technical than Parts 1–2 on purpose. Each use case opens with the
question its owner asks.

### 7.1 Distil once, read the map (1:00)

- **On screen** (new visual idiom: two gauges, no particles): *all of LangChain's pull requests:
  16.3 million tokens* — far beyond any context window — next to *the map: 100 cluster cards + 7
  theme cards ≈ 11,000 tokens*. Not a compressed copy, and **not an index** either: an index — even
  a semantic one, which the embeddings alone already give — finds what you already know you are
  looking for; the map, made by clustering and aggregating, shows what is there, including what you
  did not know to look for. It cannot tell what a given pull request changed; it tells what kinds of
  work exist, how big they are, and where to look. Built once for $0.15, rebuilt when the pile grows.
- **Said**: Pietro gives each image one description; SECNA gives the whole corpus one map. The map
  is a table — every item keeps its cluster and its theme. People browse it; tools query it; agents
  read it before they read anything else.
- **Key sentence**: *Distil once. Then people and agents read the map, not the pile.*

### 7.2 Voice of customer — *"What do my users say about me?"* (1:45)

- **For**: product, support, marketplace teams — the pile of the opening comes back.
- **Before**: a sample of 50 reviews a quarter, a support form whose *Other* category holds a third
  of the tickets.
- **After**: every message read once; named themes; the *Other* bucket split into real clusters;
  month by month, what rises; a new ticket lands in its known cluster without an LLM call.
- **Proof points**: Clio itself is a voice-of-customer tool — Anthropic reading what people do with
  Claude; and a support product already ships the same two levels — Intercom clusters similar
  questions into subtopics, groups them into topics, and assigns every new conversation daily
  (§11.2).
- **Visual** (new idiom): one stacked bar where *Other* breaks into named slices; then a monthly
  line where one theme rises.
- **Honesty**: illustrative, unless a public review corpus is run before the 19th (open question 2).

### 7.3 The AI software factory — callback to the previous talk (2:45)

The factory of the previous talk reads, writes and triages. Distillation helps at each of the three.

- **a · The factory reads** (1:00). Agents work in shifts with no memory: each session starts from
  zero (Anthropic's own words), and most of what an agent pays for is what it reads — about 84% of a
  turn in a published measurement (§11.2). So it searches, opens files, reads pull requests and
  issues. LangChain's three months are 16 million tokens: they do not fit, so the agent searches —
  by keyword. **Measured on the run**: for *"fix how LangGraph saves and resumes its state"*, a
  keyword search for *checkpoint* returns 1,046 pull requests (2.5 million tokens), 74% of them
  outside the four checkpoint clusters — and it misses 54% of the 579 pull requests inside them. The
  map reaches all four clusters for about 2,100 tokens (the seven theme cards and the fifteen cluster
  cards of that theme), then the ten typical pull requests of the cluster that matches (a few
  thousand tokens). For a question you already know, a semantic search over the embeddings — an
  index — would also beat keywords (not measured here); what the map adds is the lay of the land:
  what kinds of work exist, how big, and what nobody thought to ask. It is the handover note between
  shifts: consulted when needed, beside search, never pasted wholesale into the agent's instructions.
  **Key sentence**: *Distillation spares your agents from reading, re-reading and re-reading again,
  at random, your raw data.* **Honest close**: *measure it on your factory — tokens per task, with and
  without the map.*
- **b · The factory writes** (0:50). Matthieu's factory must stay *observable and verifiable*. The
  notebook already showed it (cells 10–11 — not shown again): at LangChain, 28% of the pull requests
  come from bots and 23% are signed by an AI agent. The pile grows *because* of the factory — Part
  1's loop, made real — and nobody reads every pull request any more. People keep track by reading
  the map: what the agents changed this week, where, and the campaigns you would not have looked
  for.
- **c · The factory triages** (0:55). *"Hundreds of open issues: which are the same problem? which
  theme do they belong to?"* New issues are embedded and routed to the existing clusters: duplicates
  found, themes counted, no LLM call per issue; only a genuinely new cluster gets named. **Proof
  points**: Sentry routes new errors to known issues this way (40% fewer new issues); Linear sells
  duplicate detection because backlog sorting *"doesn't scale"* by hand (§11.2).
  **Honesty**: shown on pull requests (cell 12), unless the notebook is run on issues before the 19th
  (open question 3).

### 7.4 Where it stops (0:30)

A map of volume, not an alarm: a rare, serious case can hide in a big cluster — keep a separate
watch for critical signals. On a small or uniform corpus there is nothing to find: let the LLM read
it all. Names are a proposal: check a sample.

## 8. End (0:30)

*Data science finds the structure. The LLM gives it meaning.* — *The bill follows the clusters, not
the documents.* — then the published promise: *the notebook is online — try it tomorrow on your own
corpus*, with the repo address and the QR code on screen long enough to scan. One spoken line may
open the next conversation (decision D7): *does the map cut an agent's tokens? Nobody has measured it
yet — I am; tell me your results.*

## 9. Visual grammar

- **One clustering animation in the whole talk** (beat 1.5). Never repeated.
- **Part 1**: the short video's language — night sky, particles as the corpus, very large figures;
  cyan = data science, pink = LLM and cost, lime = emphasis.
- **Part 2**: a notebook interface — the *césure*. Code and real outputs; no particles.
- **Part 3**: data visuals with **one idiom per use case** (token gauges; a bar where *Other*
  breaks apart; who writes the pull requests; an inbox where issues snap to known clusters), same
  palette.
- **Every example says what it is for before it is shown.** Questions only at real turning points
  (1.9, the end of Part 2, the head of each use case).
- Wording: *cluster* for the first level, *theme* for the second; no algorithm names on the stage
  screens (the notebook's code is the exception, see open question 7).
- **Never call the map an index.** In computing an index retrieves what you already know you are
  looking for — the embeddings alone give one (a fast, focused semantic search). Clustering and
  aggregation do something else: they show what you did not know you were looking for. The
  distinction is worth one sentence on stage: *an index finds what you are looking for; the map shows
  what you did not know to look for.*

## 10. Facts and figures

| Figure | Value | Source |
|---|---|---|
| Clio's published bill, 100,000 conversations | $48.81 — S $45.00 (92%), N $3.75, A $0.06 | Tamkin et al., arXiv:2412.13678, table 3 |
| The corpus | 14,947 pull requests · 137 repositories · 1,607 authors · 23 Jul – 23 Oct 2026 | the LangChain run, `0405_01` §1 |
| S | median 291 tokens per pull request; no LLM | the run |
| E | LaBSE on the CPU, 11 min, $0 | the run, `0405_01` §2 |
| C | 100 clusters, 22–310 pull requests | the run |
| N + A | ≈ 1 million tokens ≈ $0.13 (N) + ≈ 13,000 tokens (A); **$0.15** in total | `0405_01` §2 |
| Raw corpus | **16.3 million tokens** (the S texts before the cut, counted by the notebook) | `corpus.parquet`, `summary_tokens` |
| The map | **≈ 11,000 tokens**: 100 cluster cards ≈ 10,600 + 7 theme cards ≈ 400 (estimate: characters ÷ 4) | `corpus.parquet` |
| Checkpoint example | 4 clusters (3, 10, 57, 80): ≈ 240,000 raw tokens; their cards ≈ 460 tokens; the 10 typical pull requests of one of them: 1,800–5,400 tokens | `corpus.parquet` |
| Machines in the pile | 4,243 opened by bots (28%) · 3,452 opened by people and signed by an AI agent (23%) — signatures only, so a lower bound | `corpus.parquet` (bot flag, agent signatures, *Made by Open SWE*) |
| Keyword search vs map | *checkpoint* matches 1,046 pull requests (2.5 M tokens), 74% outside the four checkpoint clusters, and misses 54% of the 579 inside them; the map reaches the four clusters for ≈ 2,100 tokens (7 theme cards + 15 cluster cards) | `corpus.parquet` |
| The unexpected cluster's author | LangSmith Engine, LangChain's own product: 210 of the 303 signed pull requests come from its development instance | `corpus.parquet`, `0405_01` §5.2 |
| Open SWE | 27% of the pull requests opened by people (2,883) | `0405_01` §5.1 |
| The unexpected cluster | 310 pull requests, 303 with the same sentence, 5 → 230 → 75 a month | `corpus.parquet`, `0405_01` §5.2 |

## 11. The evening, and public evidence for the why

### 11.1 The programme of 19 November

Meetup #7, Generative AI Bordeaux, at Peaksys (Cdiscount's tech subsidiary), 18:30–20:30 — three
talks, ours last ([event page](https://www.meetup.com/generative-ai-bordeaux/events/317267354/),
read 2026-11-07):

1. **Pietro Fodra (Cdiscount) — *Une image vaut mille tokens · une description pour les gouverner
   toutes*.** A multimodal LLM describes each product image **once**; that description then feeds
   several text pipelines, faster and cheaper than analysing the image at every step.
2. **Matthieu Sénéchal (Hones) — *IA software factories : une nouvelle ère dans la production de
   logiciels*.** An organisation where agents take a significant share of writing, reviewing and
   shipping code, and which must stay *« observable, vérifiable et maîtrisée »* as their autonomy
   grows; what to delegate, how to measure, when to extend or stop. The abstract says nothing about
   tokens, context, pull requests or issues — that is the gap our Part 3 fills.
3. **Ours.** The abstract published on the event page (it differs from `0104_02`) promises: Clio; the
   same recipe at Google and in open source; the bill follows the clusters; the recipe step by step,
   then end to end in a public notebook *« sur près de 15 000 pull requests LangChain, pour une
   quinzaine de centimes »*; *« ce que la carte fait remonter et qu'aucune lecture n'aurait
   trouvé »*; the notebook online, to try the next day on your own corpora. This narrative keeps
   every one of those promises (Part 1; Part 2 cells 1–11; the end).

**The evening as one arc** — the callbacks the talk makes (lines to adapt to what was actually said):
- **Opening (0.1)**: *Pietro described each image once, so that every later step reads a short
  text instead of the image. Matthieu showed a factory where agents write, review and ship code.
  Tonight, the same idea as Pietro's, at the scale of a whole corpus — and what it does for
  Matthieu's factory.*
- **S in Part 1 (1.5–1.6)**: *describing once is exactly the S step — Pietro does it for images.*
- **Part 3 (7.1)**: one description per item (talk 1) → one map per corpus (ours).
- **Part 3 (7.3)**: *the factory reads* — every agent of talk 2 pays tokens to read the project;
  *the factory writes* — talk 2's *« observable, vérifiable »*: half of LangChain's pull requests are
  already written by machines, and the map is how people keep seeing what the factory does.

### 11.2 Public evidence for the why

Read 2026-11-07; quotes checked in the primary pages. Candidates for `BIBLIO.md` once the narrative
is agreed.

**Agents mostly pay for reading — and start every session from zero**
- Lindenbauer et al. (JetBrains Research / TU Munich), *The Complexity Trap*, arXiv:2508.21433, DL4C
  @ NeurIPS 2025: *"observation tokens make up around 84% of an average SWE-agent turn"* (preliminary
  runs, 50 SWE-bench Lite tasks).
- Anthropic, *Effective harnesses for long-running agents*, 26 Nov 2025: *"each new session begins
  with no memory of what came before"* — agents compared to *"engineers working in shifts"*; the fix
  is a progress file read at the start of each session.
- Anthropic, Claude Code docs, *Manage costs effectively*: *"Token costs scale with context size"*;
  average *"around $13 per developer per active day"* — an order of magnitude only (the whole SECNA
  run, $0.15, is about 1% of it; illustrative, not a saving).
- Cognition, *SWE-grep*, 16 Oct 2025 (vendor figures): trajectories *"often spending >60% of their
  first turn just retrieving context"*.

**Small, relevant context beats big raw context**
- Anthropic, *Effective context engineering for AI agents*, 29 Sep 2025: *"finding the smallest
  possible set of high-signal tokens that maximize the likelihood of some desired outcome"*; Claude
  Code combines a small file read up front with search on demand.
- Chroma, *Context Rot*, 14 Jul 2025: focused prompts (~300 tokens) beat full prompts (~113,000
  tokens of history) *"across all models"* (18 models).
- Aider, *Repository map*: *"a concise map of your whole git repository"*, about 1,000 tokens — a
  precedent for "a map, not a dump" (of code symbols, where SECNA maps the history).

**Grouping and routing new items: production practice**
- Sentry, 5 Feb 2025: embeddings route new errors to known issues — *"a 40% reduction in new issues
  created"*, under 100 ms; 70% in the June 2026 follow-up.
- Linear, *How we built Triage Intelligence*, 3 Sep 2025: *"organizing a backlog has historically
  been manual work that doesn't scale"*; flags duplicates, links related issues.
- Intercom, *Topics Explorer* (help centre, Oct 2026): subtopics *"discovered first by clustering
  similar questions"*, then *"grouped into broader topics"*; *"a daily pipeline … assigns topics to
  all newly closed conversations"* — SECNA's two levels and the routing of new items, in a shipping
  support product.
- Apple ML Research, *Review Summarization on the App Store*, 24 Apr 2025: an LLM distils each
  review into insights, embeddings merge the topics — closer to Clio (an LLM reads every review).

**What it does not prove — say it fairly**
- No public measurement shows that a distilled history of pull requests or issues cuts an agent's
  tokens. Gloaguen et al. (ETH Zurich), arXiv:2602.11988, find that repository context files *"do
  not generally improve task success rates, while increasing inference cost by over 20%"* — agents
  follow them and explore more.
- For code, the Claude Code team chose agentic search over a vector index (Latent Space, 7 May 2025,
  *"just vibes"*, while conceding *"the cost of latency and tokens"*); Cursor measures +12.5% answer
  accuracy with semantic search added to grep (6 Nov 2025). Common ground: both.
- **Consequence for 7.3a**: the map is presented as a cheap first read *beside* search — consulted on
  demand, never pasted wholesale into the agent's instructions — and the claim is *measure it: tokens
  per task with and without the map*. The counter-evidence stays for the Q&A, not the screen.

## 12. Building it by 19 November

- **Part 1**: reuse what exists — the short video's scenes and the best of the reworked long version
  (the wall, the bill as a bar of light, the curve, the one clustering animation) — cut to 7 minutes.
- **Part 2**: new — the pseudo-notebook view (the largest piece of work), fed by the real code and
  the real outputs; plus the three new notebook cells (§6.3).
- **Part 3**: new — four small data visuals, no new engine needed.
- **The 15-minute cut**: drop 1.7 or 1.8, notebook cells 9 and 12, and 7.4.

## 13. Open questions for Michael

1. **The bridge** (0.1) and the callbacks (1.6, 7.1, 7.3) name Pietro and Matthieu and rest on
   their abstracts: keep them, adapted live to what they actually said? A word with them before the
   evening would make the callbacks safer.
2. **Voice of customer**: illustrative, or a public review corpus run before the 19th? *Recommended:
   illustrative, with Clio as the real proof — time is short.*
3. **Issues**: run the notebook on LangChain's issues so that 7.3c is real, or keep it as a proposal
   shown on pull requests? *Recommended: proposal, unless the run is cheap.*
4. **The notebook's look**: JupyterLab light (a clear *césure*, readable on a projector) or dark?
5. **"Distil"** as the talk's verb: natural in French (*distiller un corpus*), but developers know
   *distillation* as training a small model from a big one — say the definition once, or choose
   another word (*condenser*)?
6. **The abstract's promises**: the version published on the event page (§11.1) is the one the room
   read — it promises ~15,000 LangChain pull requests for about fifteen cents and *what the map
   surfaces*, all kept. The version in `0104_02` (*"under 200 lines"*, sound at the end, the closing on
   reviews and tickets) is superseded: the talk says *five steps, about 130 lines*; no sound is needed —
   tell the organisers.
7. **Algorithm names**: the notebook's code naturally shows `KMeans` and `LaBSE`. Lift the
   *no algorithm names on screen* rule for Part 2 only?
