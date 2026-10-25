---
**Status**: 🧪 Active — Step 1.1 (🟩 2026-10-23)
**Date**: 2026-10-23
**Priority**: High — on the critical path of the talk (main plan milestone: notebook runs end to end by **Fri 30 Oct 2026**)
**Maintained**: Yes
---

# SECNA notebook — the dataset and the demo (workline `secna_notebook`)

## Overview

The talk promises *« Comprendre tout un corpus sans le lire en entier »* and a repo that proves it.
This workline builds that proof: **a public developer corpus — what happened in a very active,
sprawling, GenAI-related open-source project over a given period, read from its merged pull
requests — and a short notebook that runs E · C · N · A on it with basic libraries only.** It takes
over Step 4 of the main plan ([`plan_secna.md`](../../plan_secna.md)) and produces what the
storyboard's notebook beats (section 4, §5a–5h) show on screen.

The point of the notebook is that **there is nothing magic in it**: a pandas DataFrame, raw
embeddings, a plain clustering, one cheap LLM call per group to name it, one call to a stronger
model to gather the names into the main themes — and the bill printed at the end, next to what an
LLM on every document would have cost. No BERTopic (its name suggests BERT, which is not used, and it
hides the steps), no UMAP, no HDBSCAN, no framework.

**Done means**: from a fresh clone, one documented fetch command and one notebook run answer *what
happened in <project> over <period>?* — named groups with their sizes, a handful of main themes the
room understands, a theme-by-month table, the measured token bill and the counterfactual — in a
notebook under 200 lines of code that a developer reads top to bottom; its outputs are saved for the
storyboard (main plan Step 3.2 / 5.1).

## Workline directory layout

- Plan (this file): `worklines/secna_notebook/plan_secna_notebook.md`
- Produced docs: `worklines/secna_notebook/docs/` (`<step>_<num>_<name>.md`)
- Probe script (dataset comparison only): `worklines/secna_notebook/scripts/`
- **Deliverables** live where the main plan put them: `notebook/` — the fetch script, the notebook,
  its `requirements.txt`, its `README.md`; `notebook/data/` and `notebook/out/` are gitignored.
- This repo has no `docs/LOGBOOK.md`: the **time log** below is the log; the main plan's time log gets
  one row per milestone.

## Goals ✅

- **A dataset the room recognises, chosen on evidence** (activity, sprawl, readability of the themes,
  cost) — not by default.
- **A fetch script**: public source → one parquet, size reported, nothing committed.
- **A notebook in four letters** — E · C · N · A, **S deliberately skipped** (storyboard §5 *Ma recette,
  sans S*) — basic libraries only.
- **A measured bill**: tokens and € per letter, read from the API's usage fields, and two defined
  counterfactuals (D9).
- **Outputs for the storyboard**: the 2-D view, group names, sizes, themes, theme × month, the bill —
  as files the animation can read.

## Non-goals ❌

- **No in-house tool, no internal code or prompt** — the recipe is rebuilt from public
  sources and basic libraries.
- **No BERTopic, no UMAP, no HDBSCAN, no LangChain / LlamaIndex**, no package, no CLI.
- **No dimensionality reduction for the clustering** (*« brut de décoffrage »*): clustering runs on the
  raw (normalised) embedding vectors. PCA exists only to draw the picture.
- **No hierarchy deeper than themes → groups** — one flat aggregation prompt gives the two levels the
  storyboard's table (§5f) needs.
- **No agent** in this workline. The agent is the talk's closing question (storyboard §5); a pseudo-agent
  run and its video belong to a later workline.
- **No tuning theatre**: one parameter (the number of groups), chosen by a stated rule, said aloud.
- No contributor names or handles in any output shown on screen.

## Key decisions / assumptions

- **D1c — Corpus chosen (Michael, 2026-10-24): GitLab** — every merge request created over three
  months (2026-07-23 → 2026-10-23) in **seven repositories that cover the whole GitLab environment**:
  `gitlab-org/gitlab` (the product), `ops/artifact-registry`, `modelops/…/ai-assist` (the AI
  assistant's backend), `orbit/knowledge-graph`, `editor-extensions/gitlab-lsp`, `gitlab-runner`,
  `cli` — ~24,400 MRs, all states. Why: open core with an installed base → maintenance **and** the push
  towards agents in the same corpus; GitLab's own `type::` / `devops::` labels (96 % coverage) give a
  ground truth to set the groups against. Supersedes D1b.
- **D1b — (superseded by D1c) Corpus chosen (Michael, 2026-10-23): every pull request of the `langchain-ai` GitHub
  organisation** (~25 active repositories — several products in parallel), **created over three
  months** (2026-07-23 → 2026-10-22, ~15k PRs), **all states** — merged, closed without merge, open —
  with their metadata (status, age, labels, size, reviews). Status and age are dimensions the
  storyboard can cross with the themes.
- **D1 — Not the Linux kernel** (Michael, 2026-10-23: *old school*, it does not speak to the room, its
  themes would be obscure; it also has no GitHub pull requests). **Criteria for the project**:
  1. **GenAI-related** if possible — the meetup is Generative AI Bordeaux;
  2. **very active** — at least ~1,000 merged PRs over the period (the corpus must be "too big to read");
  3. **sprawling** — many contributors, many directions at once, not a tidy subsystem tree;
  4. **themes the room understands** — a PM names most groups without a glossary;
  5. **real pull requests on a public host**, readable without an account; permissive licence.
- **D2 — Libraries**: `pandas`, `numpy`, `scikit-learn` (`KMeans` only — the algorithm Clio uses), the
  `openai` client for the model calls. (Hand-written numpy k-means dropped: longer, no gain.)
- **D3 — Models, provider-agnostic**: OpenAI-compatible endpoints configured by env vars, **one URL and
  key per role** (embeddings may come from another provider than chat):
  `SECNA_EMBED_{BASE_URL,API_KEY,MODEL}`, `SECNA_NAME_*`, `SECNA_AGG_*`. Defaults proposed in Step 3: a
  small embedding model, a small chat model for N, a stronger one for A.
- **D4 — Prompts on screen**: the N and A prompts are a few lines each, readable on screen, in English
  (the corpus is in English). Output language (French names for a French room?) — Michael's call, one
  line in the prompt.
- **D5 — Embedded text**: PR title (stripped of type prefixes such as `[Bugfix]`, `feat(core):` — they
  would make groups by type instead of topic) + description stripped of template lines and
  auto-generated bot summaries; truncated by **characters** (no tokenizer); bot PRs (dependency bumps,
  release bots) and reverts dropped, and said so. Token counts come from the API's usage fields.
- **D6 — Cache keyed on content**: embeddings and LLM answers cached under `notebook/data/`, keyed on a
  hash of (model, text, prompt) — not on row position. The **first run's measured bill is saved** and
  printed on every re-run next to *this run: 0 tokens* — a live re-run never shows a $0 bill alone.
- **D7 — Clustering rule**: vectors normalised; *k* = round(√(N/2)) rounded to a readable number
  (≈ 40 for 3–5k PRs), fixed seed. The **~5 % of PRs farthest from their centroid are shown as
  "outside"** (storyboard §5d: *points left outside are shown, not hidden*) — k-means itself leaves
  nothing outside. Expect one large "misc fixes" group, and show it.
- **D8 — Prompts' inputs**: N gets, per group, the ~15 titles nearest the centroid + ~5 random ones +
  ~5 titles from neighbouring groups as contrast (Clio's trick against generic names such as *Bug
  fixes*); answer = a name + one sentence. A gets every group's name, sentence and size and returns
  **JSON mapping every group to exactly one theme** (5–8 themes); the notebook checks the mapping covers
  all groups.
- **D9 — The counterfactuals, fixed before the run**: (a) **the S we skipped** — the small model reading
  every PR (real input tokens × its price + 150 output tokens per PR); (b) **everything into the
  strong model** — real input tokens × its price, with the check *does it even fit in one context
  window?* (echoes section 1, *L'impasse*).
- **D10b — The extraction is in the notebook** (Michael, 2026-10-24): `notebook/secna.py` is written
  in cells (`# %%`) — the notebook to be — and starts with `REPOS`, `SINCE`, `UNTIL`; the extractor is
  ≤ 20 lines (GitLab's public GraphQL, no account, 100 MRs per page, no search cap so no sharding),
  each step cached and skipped when its output exists. *To reproduce on your code: change `REPOS`.*
- **D10 — (superseded by D10b) Fetch**: GitHub GraphQL search, `is:pr is:merged merged:<day>` windows (≤ 1,000 results per
  query, 100 per page; author type flags bots). Needs a personal token, documented in the README.

## Risks / constraints

- **"A PR description is already a human summary" may be false in 2026** — many are AI-written or carry
  a bot's summary. Measured in Step 1; if common, the talk's reason for skipping S becomes *« le titre
  suffit »*, not *« c'est déjà un résumé »*.
- **Labels are a ready-made taxonomy** → someone will ask *why not group by labels?* Step 4 crosses
  groups with labels: the answer is in the table (labels are coarse, partial, absent on many PRs — to
  verify).
- **The 2-D picture may be a blob** (PCA of raw embeddings often is) → checked in Step 4; fallback: draw
  only the centroids, sized by group.
- **Names may change between runs** (the storyboard §5 claims they are stable) → Step 4 re-runs with a
  second seed and compares; the claim is dropped if false.
- **Algorithm names on screen**: the main plan says *no algorithm names on screen*, but `KMeans` is
  visible in the notebook's code during §5d → to arbitrate (proposal: code is shown, never named aloud).
- **GitHub on screen**: the main plan says *GitHub not cited* (as a SECNA player). The corpus's host and
  the repo address are another matter → to confirm.
- **QR scanners and the token**: a reader without a GitHub token cannot fetch → proposal: publish the
  corpus parquet (public data, handles removed) as a release asset, so the notebook runs without it.
- **A moving target**: the period is fixed (start and end dates as arguments) so the corpus is
  reproducible; PR bodies edited later → idempotence is checked on the set of PR ids, not bytes.
- **Public data only**: contributors are people — handles stay in `notebook/data/` (gitignored).
- **Fixed date**: 19 Nov; outputs handed over by **Wed 4 Nov** (main plan 3.4).

## 📅 Timebox

| By | Steps |
|---|---|
| Mon 26 Oct | Step 1 — dataset chosen |
| Wed 28 Oct | Steps 2–3 — fetch + notebook draft |
| Fri 30 Oct | Step 4 — full run reviewed (main plan milestone) |
| Mon 2 Nov | Step 5 — extract + hand-back (before the 4 Nov storyboard milestone) |

## 🚦 Green light protocol

- Planning/docs only until Michael explicitly says **"🟩 go Step N"**.
- If scope changes materially, update this plan before proceeding.

## Plan steps (no execution until green light)

### Step 1 — Choose the dataset
**Status**: ✅ Decided 2026-10-23 — `langchain-ai` org, all PRs, three months (D1b); 1.2–1.3 superseded by the
choice; the volume table is in the time log
- [ ] 1.1 **Long list** — one search call per project (merged PRs over the last six months, distinct
      authors), licence. Leads to verify: `vllm-project/vllm`, `huggingface/transformers`,
      `langchain-ai/langchain`, `ggml-org/llama.cpp`, `All-Hands-AI/OpenHands`, `ollama/ollama`,
      `open-webui/open-webui`, an AI coding CLI (e.g. OpenAI Codex, Gemini CLI); `dify` / `n8n` flagged
      (non-permissive licences); `pytorch/pytorch` excluded (PRs land through a bot, so they show as
      closed, not merged).
- [ ] 1.2 **Probe 4–5** in depth (`scripts/probe_projects.py`): PRs per month, bot share, title-prefix
      share, description length, template / AI-summary share, label coverage, total characters.
- [ ] 1.3 **Sample run on the top 2** (~1,500 PRs each) with the Step 3 notebook draft (E + C + N, no A):
      read the names — would a PM in the room understand them? Does the project go in every direction?
- [ ] 1.4 Decision doc → `docs/0104_01_dataset_choice.md`: the table, the sample names, a
      recommendation, the **period**, the cost estimate, and the sentence the talk will say
      (*« ce qui s'est passé dans <projet> ces <n> derniers mois »*).
- **Acceptance**: Michael picks the project and the period from `0104_01`; the corpus has ≥ 1,000
  merged PRs; the full run is estimated under $5; **≥ 4 of 5 sample groups read without a glossary**
  (Michael, or the *Camille* PM persona).

### Step 2 — Fetch script
**Status**: 🧪 In progress — moved **into the notebook** (D10b): `notebook/secna.py` cells *config · extract · first
look*; GitLab corpus fetching. The LangChain fetch (`notebook/fetch_corpus.py`, 14,947 PRs) is kept as a record.
- [ ] 2.1 `notebook/fetch_corpus.py`: repo + start / end dates → `notebook/data/corpus.parquet`
      (`id, merged_at, title, body, labels, url, is_bot`); cleaning of D5 applied in the notebook, not
      here (raw stays raw).
- [ ] 2.2 Prints PR count, total characters, size on disk, wall-clock.
- [ ] 2.3 Documented in `notebook/README.md` (one command, prerequisites, the token).
- **Acceptance**: from a fresh clone, the one command produces the parquet; a second run yields the
  same set of PR ids; `git status` shows no data file.

### Step 3 — The notebook (E · C · N · A)
**Status**: ⏳ Pending — a draft is needed by 1.3
- [ ] 3.1 Cell *Setup*: env vars (D3), the corpus into a DataFrame, its size, the D5 cleaning.
- [ ] 3.2 Cell **E**: embed every PR in batches, cached (D6); tokens counted.
- [ ] 3.3 Cell **C**: k-means on the normalised vectors, *k* by D7's rule; group sizes; "outside"
      points; the **2-D view** (PCA, picture only).
- [ ] 3.4 Cell **N**: one call per group (D8); cached; tokens counted.
- [ ] 3.5 Cell **A**: one call to the stronger model (D8) → themes, coverage checked.
- [ ] 3.6 Cell **Pourquoi une table**: a per-PR table (`id, merged_at, group, theme, labels`) and the
      **theme × month** crosstab — one theme rising (storyboard §5, beat 3).
- [ ] 3.7 Cell **La facture**: tokens and € per letter, total, the first run's saved bill, the two
      counterfactuals of D9.
- [ ] 3.8 Cell **Votre corpus**: the one line to change to run it on another parquet.
- **Acceptance**: ≤ 200 lines of **code in the notebook** (fetch script and markdown cells excluded);
  only D2's libraries; runs top to bottom on the chosen corpus; a cached re-run spends 0 tokens and
  still prints the first run's bill.

### Step 4 — Run, read, sanity-check
**Status**: ⏳ Pending
- [ ] 4.1 Full run; wall-clock and bill recorded.
- [ ] 4.2 Read the result as a stranger would: do the names match the titles inside? Spot-check 3
      themes against the project's public release notes.
- [ ] 4.3 Groups × labels crosstab (the *why not labels?* answer); is the 2-D view readable?
- [ ] 4.4 Second run with another seed: how many names survive? (keeps or drops the *stable names*
      claim).
- [ ] 4.5 What is wrong or weak (mixed groups, generic names) is fixed once, by the prompt or *k*, not
      hidden; what is left becomes a stated limit.
- **Acceptance**: Michael reads the review (in `docs/0501_01`, Step 5) and accepts the result as
  something he will show on stage.

### Step 5 — Outputs for the storyboard + hand-back
**Status**: ⏳ Pending
- [ ] 5.1 Committed extract `notebook/results/` (no handles): `groups.csv` (id, name, sentence, size,
      theme, centroid x/y), `themes.json`, `theme_by_month.csv`, `points_2d.csv` (x, y, group, outside —
      no text), `bill.json` (per letter + counterfactuals), `run.json` (project, period, N, k, models,
      date).
- [ ] 5.2 Review + hand-back doc → `docs/0501_01_run_review_and_handoff.md`: the outputs, Step 4's
      checks, the limits, what the storyboard can claim; main plan Step 4 marked done.
- [ ] 5.3 Word-list scan clean before any commit.
- **Acceptance**: section 4 of the storyboard can be written from `notebook/results/` alone, with real
  numbers.

---

## Open questions for Michael

1. **Algorithm names on screen**: `KMeans` is visible in the notebook's code — OK if never said aloud?
2. **GitHub on screen**: the corpus's host and the repo address shown — OK?
3. **Language of the names and themes**: English (as the corpus) or French (as the room)?
4. **Publish the corpus parquet** (handles removed) so QR scanners run the notebook without a token?

---

## Progress tracking ✅

- ✅ Step 1 — Choose the dataset → `langchain-ai`, all PRs, three months
- 🧪 Step 2 — Fetch script
- ⏳ Step 3 — The notebook (E · C · N · A)
- ⏳ Step 4 — Run, read, sanity-check
- ⏳ Step 5 — Outputs for the storyboard + hand-back

---

## Time tracking (use `date`) ⏱️

### Time log

| Timestamp (`date`) | Update |
|---|---|
| Sun Oct 25 2026 (weak signals) | **Weak signals on GitLab's AI strategy** (Michael's ask; duckdb on `corpus.parquet`): Claude Code-signed MRs 121 → 505 → 1,291 per month (239 authors, 377 of them in the AI-agents theme) vs `duo/` branches ~450–540 flat; Duo *Fix Pipeline* agent: 219 MRs, **14 merged**, 202 closed (120 within a day); **GitLab Credits** — per-session credit ingestion, per-model credit rates, credits dashboards; agents in **Slack** (130 MRs, `slack_assistant` flow); governance of **external agents** (cluster 87); agents' instructions written by an agent from the docs (18, *Update AI development principles from SSOT*) and corrected by humans from session traces (27, *distill !6883 session traces into agent harness fixes*); agent **memory** (*Add user memory storage… for Duo*, *distill memory from MR sessions*); the DAP Impact dashboard (96). Caveat: signature-based counts — Duo may sign less than Claude Code. |
| Sun Oct 25 2026 (5–7 themes) | **A re-run with 5 to 7 themes** (Michael: 10 is not readable). 35 s, 14,316 tokens → **7 themes**: G Engineering Quality and Operational Upkeep 6,179 (25 %, 26 clusters — tests, docs, cleanup and bot refreshes together) · E Scaling and Hardening Engineering Systems 4,674 · A AI Agents and Duo Workflows 3,932 · D Artifact Registry and Orbit Development 2,865 (the two new products together) · C Product Capabilities and Customer Workflows 2,660 · B Security, Compliance, Access 2,158 · F Frontend Modernization and UX 1,928. `themes.png` regenerated. |
| Sun Oct 25 2026 (L1 dropped) | **Sub-themes dropped** (Michael: not worth the extra complexity in the notebook — L1 came out almost one sub-theme per cluster outside A). `test_a_subthemes` and its prompt removed, `subtheme*` columns dropped from `corpus.parquet`. A stays one call: clusters → **themes** (`test_a_themes`, columns `theme*`, with `CONTEXT`). |
| Sun Oct 25 2026 (L0→L2→L1) | **Two-level aggregation, top-down** (Michael): L0 = the 100 clusters → **L2 themes** (`test_a_themes`, one call, columns `theme*`, *metacluster* renamed) → **L1 sub-themes** (`test_a_subthemes`, one call per theme, number left free, ids A1, A2…, columns `subtheme*`; coverage asserted per level). A shared **`CONTEXT`** (repos, period, aim: *what the company does and how it operates*) now opens the N, theme and sub-theme prompts. Old `metacluster*` columns dropped (duckdb). Re-run N → themes → sub-themes → graph, 8 min: N 1,288,803 tokens; **10 themes** (15,005 tokens): A Duo and AI Agent Platform 4,269 · C Backend Performance and Service Reliability 3,763 · E Testing, Code Health, CI 3,088 · B Security, Compliance, Access 2,536 · J Automated Dependency and Maintenance Refreshes 2,324 · D Frontend Migration and Product Experience 2,229 · H Documentation 2,046 · F Artifact Registry 1,959 · G Organization and Product Workflow 1,351 · **I Orbit Knowledge Graph 831 (now its own theme)**; **64 sub-themes** (10 calls, 27,275 tokens) — A splits well (7 sub-themes for 21 clusters), but B / C / G / H / I / J give almost one sub-theme per cluster (L1 ≈ L0 there). `themes.png` stacked by repository. |
| Sun Oct 25 2026 (v2 prompts) | **Prompts v2 + stacked chart** (Michael, after my own reading of the 100 clusters: the model grouped by technical layer, the corpus reads as *agents · new products · keeping the giant running*). N: a **facts line** before the summaries (size, authors, origin shares, MRs per month) and the description must say **what, where, why and how** (people / AI agents / bots; one-off or campaign). A: the prompt opens with *we want to discover what the company does and how it operates*. Re-run C → N → A → graph, 6 min: C identical; N 1,269,356 tokens, **the *how* is stated in 99 / 100 descriptions** (e.g. 81 now *produced with the Duo Fix Pipeline agent*, 18 *mostly agent-authored campaign*, 28 *a campaign by one author*); A **8 metaclusters**, 13,888 tokens: A AI and Agent Development Platforms 5,326 (22 %, now with Orbit and the language server) · F Codebase Quality and Test Modernization 3,935 · E Execution Reliability and Scalability 3,509 · B Core Product Experiences 3,300 · G Automated Dependency and Repository Upkeep 2,268 · C Security, Identity, Governance 2,216 · D Artifact Registry Expansion 2,015 · H Documentation 1,827. Chart: one bar per metacluster **stacked by repository** (7 fixed colours, palette validated — contrast WARN relieved by the legend and the totals, 2 px gaps). |
| Sun Oct 25 2026 (checks) | **Checks with duckdb.** *Naming*: 7 clusters read (4 nearest, 4 random, 4 farthest MRs): specific clusters coherent (96 DAP impact dashboards, 93 GitHub import, 22 AI doc translations, 27 agent harness guidance, 59 test/do-not-merge MRs); 65 named too narrowly (core = missing-artifact handling, the rest = assorted backend bug fixes); 8 is a catch-all and its name says so; far edges drift, as expected from naming on the 10 nearest. *Aggregation*: re-run twice (same prompt, `high` effort) → **9 metaclusters every time**, pairwise agreement (Rand index) 0.94–0.97; stable core: Duo / AI agents (≈ 20 clusters, 4.3–4.5k MRs), Artifact Registry, dependencies & cleanup, documentation, security & governance, tests & CI; ~20 border clusters move (Orbit, runner / CLI / language server, search, GraphQL, tenancy, backports, feature-flag promotion). Per month (Jul 23 → Oct 22): **A Duo / AI 1,043 → 1,535 → 1,910 (+83 %)**, Artifact Registry 741 → 993 → 452. `corpus.parquet` now holds run 3's metaclusters (last run); `metaclusters.png` still shows run 1. |
| Sun Oct 25 2026 (A) | **A done — the recipe runs end to end.** `test_a_aggregate`: one call to **`gpt-6-luna` with `reasoning_effort="high"`**, prompt + the 100 clusters as JSON (number, name, description) → JSON of 5–10 metaclusters lettered A, B, C… (`name` 3–8 words, `description` 15–30 words, `clusters` comma-separated); every cluster covered (asserted); columns `metacluster`, `metacluster_name`, `metacluster_description`. **9 metaclusters, 13,505 tokens** (5,866 out, reasoning included): A Duo and AI Agent Platform 4,488 (18 %) · F Frontend, Testing, CI Reliability 3,204 · H Maintenance, Dependencies, Feature Rollouts 3,008 · E Backend Performance and Data Reliability 2,998 · C Security, Identity, Access Governance 2,895 · B Artifact Registry 2,186 · D Product Workflows and Interfaces 2,139 · G Documentation and Localization 1,979 · I Developer Tools and Runner 1,499. `test_graph` → `metaclusters.png` (horizontal bars, one hue, value + % at the tip; rendered and checked). `matplotlib` added. |
| Sun Oct 25 2026 (N) | **N done** (🟩 Michael): `test_n_name`, model **`gpt-6-luna`** (via the proxy; 922k input tokens, $0.12 / $0.60 per M — checked in `test_00_config`), one call per cluster with the **summaries of the 10 MRs closest to the centre** (header + summaries separated by a blank line), JSON answer `name` (8–15 words) + `description` (≤ 50 words) → columns `cluster_name`, `cluster_description` repeated on every row of the cluster; trace every 10 clusters. 100 clusters in **4 min, 1,248,507 tokens** (≈ $0.15–0.20). Names 8–13 words (mean 10.5), descriptions 20–52 words, 100 distinct names. Term rule (Michael): **clusters**, not groups. |
| Sun Oct 25 2026 (C) | **C done** (🟩 Michael): `test_c_cluster`, k-means **K = 100** (a round number), raw vectors, `random_state=0`, 44 s; new columns `cluster` and `centroid_distance` (centres not kept — the closest MRs are a group's examples for N). Sizes 28–635 (1 group < 50, 72 between 50 and 300, 27 > 300). First read: groups by topic *and* by kind — dependency bumps (635, all automated), npm virtual-registry plans, docs, link updates, schema clean-ups, CI fixes; small ones are near-duplicates (a triage template re-posted, ADR syncs) or a sharp topic (MR risk assessment for Duo Agent Platform). `scikit-learn` added. |
| Sun Oct 25 00:09 CEST 2026 | **E done** — 24,396 vectors × 3,072 (`text-embedding-3-large`, through the proxy), **24,392,740 tokens billed** (= S's count to the token; ≈ $3.17 at $0.13 / M), 26 min. First attempt failed at 18 % on HTTP 429 (*all deployments in cooldown*) with nothing saved → E now retries (`max_retries=10`) and **resumes** (checkpoint every 50 batches, only rows without a vector are embedded) — a deliberate exception to *drop the column first*. `test_00_config` added (fails, never skips, without a working key); `env.template` at the root (`.env.*` cannot be read under the managed settings); `corpus.parquet` 231 MB. Commit script prepared, awaiting 🟩. |
| Sat Oct 24 2026 (S) | **Extraction moved into the tests**, `secna.py` removed: `notebook/test_secna.py` = config · `test_0_extract` · `test_s_summarise` · `test_e_embed`. **Keys** (Michael): tests load `notebook/.env` and fetch the key from AWS Secrets Manager when missing (`notebook/conftest.py`, `SECNA_SECRET_NAME` / `AWS_PROFILE`); the notebook will just load `.env`; `notebook/.env.example` lists the names. **Embedding model: `text-embedding-3-large`**, truncation **in S** at its 8,191-token limit. **S run**: text = title · repository · origin · labels · description (authors left out — not meaningful); new column **`origin`**: human 19,691 · bot 2,365 · human + agent 2,205 · agent 135 — GitLab's `bot` flag misses most bots (`automation:bot-authored` label used), agent signatures in descriptions (*Generated with Claude Code*, *AI-authored change*, *generated by GitLab Duo*…) go from 3 % (Jul) to 14 % (Oct). Tokens: median 698, p90 1,851, p99 7,504, max 138,042; 208 cut; **24.4 M tokens to embed** (≈ $3 at $0.13 / M). E not run yet (needs `.env`). |
| Sat Oct 24 2026 (enriched) | **Corpus enriched** (Michael: all the metadata, flattened): 38 columns — size (`additions`, `deletions`, `fileCount`, `commitCount`), people (`mergeUser`, `assignees`, `reviewers`, `approvedBy`), `updatedAt`, `milestone`, branches, votes; scoped labels as columns `type` · `subtype` · `stage` · `group` · `section` · `priority` · `workflow` · `category`. Coverage: group 74 %, section 73 %, stage 71 %, workflow 59 %, subtype 53 %, category 33 %, priority 2 %; milestone 84 %. **GitLab Duo is a reviewer on 20,283 MRs (83 %)**. ~20 min (100 MRs per page at ~4.7 s). **Working rule (Michael)**: one `corpus.parquet` enriched in place; the notebook as **one pytest test per cell** (`notebook/test_secna.py`), each test dropping then rewriting its own columns. S (markdown text + token count) and E (batched embeddings, `tqdm` progress + time remaining) written, **awaiting review**. |
| Sat Oct 24 22:58 CEST 2026 | **GitLab corpus fetched** from the notebook (`notebook/secna.py`, ~5 min in all; a per-page progress trace added at Michael's request) → `notebook/data/gitlab_2026-07-23_2026-10-23/corpus.parquet` (45 MB, gitignored): **24,396 MRs · 1,017 authors · 3 % bots**; merged 18,193 · closed 3,795 · open 2,408; type maintenance 13,266 · feature 6,057 · bug 4,205 · none 843. Counts match the probe exactly, repo by repo. |
| Sat Oct 24 2026 (GitLab go) | **GitLab chosen** (Michael: *a good tour of the whole GitLab environment*) — 7 repositories (D1c). **Extraction moved into the notebook** (D10b): `notebook/secna.py`, cells config / extract (17 lines) / first look; GitLab GraphQL answers 100 MRs per page in ~1 s, so ~250 pages ≈ minutes, not hours. `requests` added to `requirements.txt`. First run started. |
| Sat Oct 24 2026 (GitLab) | **Alternative corpus probed — GitLab** (Michael: open core, many contributions, an installed base → maintenance *and* a push towards agents). Counts only (GitLab.com public GraphQL `count`, nothing downloaded), same period 2026-07-23 → 2026-10-22: group `gitlab-org` **40,346 MRs** over 942 active projects (51 with ≥ 100 MRs). **`gitlab-org/gitlab` alone: 17,644 MRs** — merged 13,118 · closed 2,680 · open 1,846 (759 drafts); one sample week (15–22 Oct): 1,766 MRs, **344 distinct authors**, bots 3 %. **96 % carry a `type::` label**: maintenance 9,617 · feature 4,394 · bug 3,008; *Community contribution* 1,662; AI stages (`devops::agent foundations` 1,162 · `ai coding` 1,078 · `ai platform` 258 · `ai clients` 257) ≈ 2,755 (16 %). Around it: `ops/artifact-registry` 2,444 (27 % bot), Duo backend `ai-assist` 1,300, `orbit/knowledge-graph` 899, `gitlab-lsp` 744, `gitlab-runner` 714, `cli` 651. Titles: technical, maintenance-heavy (feature-flag removals, spec fixes, gem bumps), no conventional prefix, `Draft:` to strip. |
| Sat Oct 24 01:30 CEST 2026 | **Corpus fetched** → `notebook/data/prs_langchain-ai_20260723_20261022.parquet` (gitignored): **14,947 PRs · 137 repos · 52.8 M characters · 19.7 MB**, ~1 h 55 min of fetch (pages of 50: pages of 100 → HTTP 502; a null author from a deleted account crashed the build, fixed). Checked with duckdb: 4,243 bot PRs (28 %) → **10,704 human PRs**, 1,593 human authors, median body 916 characters; status merged 9,853 · closed unmerged 3,259 · open 1,058 · draft 777. Two findings: **open-swe = 2,374 human PRs from 8 people** (likely agent-driven — to look at); **first-time outsiders (`NONE`): 2,177 PRs, 2 % merged, 58 % closed within 2.4 h** (a closing policy?). |
| Fri Oct 23 23:30 CEST 2026 | **Corpus decided** (Michael): **PRs of the `langchain-ai` org, three months, all states** (merged / closed unmerged / open) + metadata — status, and later age, as dimensions. 14,947 PRs created 2026-07-23 → 2026-10-22. `notebook/fetch_corpus.py` (GraphQL search by day via `gh`, raw day files cached in `notebook/data/raw/`, one parquet with `status`, `age_days`, `is_bot`, labels, size, commits, comments, reviews); `notebook/requirements.txt` + `notebook/.venv` (uv). Authors probe stopped (7/22 repos done: no longer needed). **Rule (Michael)**: data exploration with the **duckdb CLI**, not Python → skill `duckdb` linked locally (gitignored). |
| Fri Oct 23 2026 (1.1 b) | **Scope widened** (Michael: something more sprawling than one repo's PRs; target **10–20k documents over a short period**; commits possible; Hugging Face, VS Code extensions, LangChain's parallel products, a tech Discord). Volumes probed: commits per month (vscode ~3.0k, sglang ~2.0k, litellm ~2.2k, unsloth ~2.8k; **org `langchain-ai` 4.8k**, org `huggingface` 4.7k; org `langchain-ai` merged PRs 17.2k over six months); **HF Hub** new models ~4,000/day, datasets ~1,800/day, Spaces ~1,300/day (newest 1,000 of each), daily papers 50/day; **VS Code marketplace** 122.5k extensions, 4.8k in category AI; **Hacker News** (Algolia API) ~7.3k stories/week, ~30k/month, ~6.2k/month matching "AI", "agent" stories 1.0k (Nov 2025) → 3.5k (Mar 2026) → 2.5k (Sep 2026). Discord set aside for a public repo (needs a bot invited by the server's admins; members' messages). arXiv API returned server errors (to retry). Awaiting Michael's pick of the source family. |
| Fri Oct 23 2026 (1.1) | **🟩 go 1.1** (Michael: look mainly at the quantities — PRs over the period, contributors — and take the most active). `scripts/probe_activity.py` (GraphQL search via `gh`): pass *counts* on **30 GenAI-related repos**, period **2026-04-23 → 2026-10-22**, merged and opened PRs + merged per month (2 min 43 s); pass *authors* (distinct human authors, bot share, top-10 concentration) on the 22 repos with ≥ 1,000 merged PRs — running. Data in `notebook/data/probe/` (gitignored). |
| Fri Oct 23 22:52 CEST 2026 | **Workline created** (Michael, dictated): take over main plan Step 4; the pull-request case — what happened in a well-known project over a period; E · C · N · A without S; **basic libraries only** — pandas, raw embeddings, no mapping, no BERTopic; naming raw; one aggregation prompt to a stronger model. **Linux kernel dropped** (old school, obscure themes, no PRs) → a very active, sprawling, GenAI-related open-source project, chosen in Step 1. **Fresh-agent review** integrated: storyboard gaps closed (2-D view mandatory, "outside" points, theme × month table, name stability check, themes → groups = the hierarchy), cache keyed on content + saved bill, counterfactuals fixed before the run, per-role endpoints, title prefixes stripped, labels crosstab, timebox, testable acceptances, 4 open questions. Awaiting 🟩. |

---

## Workline artifacts

- *(none yet)* — `docs/0104_01_dataset_choice.md`, `docs/0501_01_run_review_and_handoff.md`,
  `scripts/probe_projects.py`; `notebook/fetch_corpus.py`, `notebook/secna.ipynb`,
  `notebook/README.md`, `notebook/requirements.txt`, `notebook/results/`.
