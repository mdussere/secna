---
**Status**: 🧪 Active — **storyboard-first** (2026-10-23): the talk and the video are told from one five-section storyboard; the notebook comes next and shapes it; slide decks archived
**Date**: 2026-10-09 (restructured 2026-10-23)
**Priority**: High — **meetup on Thursday 19 November 2026** (date confirmed)
**Maintained**: Yes
---

# SECNA — talk, video and notebook for Generative AI Bordeaux (workline `secna`)

## Overview

A talk for the **Generative AI Bordeaux** meetup, in French, ~20 min, for product managers and
developers: **« Vos corpus grossissent. Pas votre budget de tokens. »** — and the same story as a
~20-min recorded video.

The thesis: the real question is not *what would I do with unlimited tokens* but *how do I process
corpora that keep growing, on the budget I have*. The answer is a recipe several teams reached
(Anthropic's Clio, Google's Urania, LangChain's LangSmith Insights, open-source reproductions):
**S**ummarise · **E**mbed · **C**luster · **N**ame · **A**ggregate — **SECNA**. Data science finds
the structure; the LLM gives it meaning; the bill follows the number of groups, not of documents.

**The form is a storyboard, not slides.** Five sections, each making one point with its own animated
visual (HTML / SVG / JS). The same storyboard serves:
- **live** at the meetup — presenter-driven; the notebook shown as an animation with a QR code to the
  real one (or run live);
- **recorded** — the same scenes driven by a voice-over (a natural French TTS voice).

The **notebook** runs SECNA end to end on a public developer corpus — **what happened in a large
open-source code base over three months**, read from its merge requests (corpus and run in workline
[`secna_notebook`](worklines/secna_notebook/plan_secna_notebook.md)) — and its real outputs (cluster
names, themes, measured bill) feed the storyboard.

**Done means**: the repo is public; the notebook runs from a clean clone in one command and shows the
recipe end to end with its measured token count; the storyboard is built as an animated HTML piece
(live and recorded versions) with no placeholder left; every factual claim traces to `references/`.

## Directory layout

- Plan (this file): `plan_secna.md`
- `references/` — intent, storyboard, preparation record, `BIBLIO.md`. Docs keep the step number they
  were written under (e.g. `0301_01` intent, `0601_01` storyboard) — no renumbering.
- `worklines/<name>/` — sub-worklines with their own plan and docs (`secna_notebook`)
- `notebook/` — the SECNA notebook + a script to fetch the corpus (data and outputs gitignored)
- `presentation/` — the animated storyboard (to build); `presentation/design/` (palette, style
  proposals); archived deck tooling (Marp theme + build, PPTX generator) and the first video attempt

## Goals ✅

- A storyboard of five sections that a mixed room follows and remembers: **the economics** for PMs,
  **the recipe** for developers.
- A notebook a developer can run in an afternoon on a corpus everyone understands (the merge
  requests of a well-known open-source project).
- A public repo that is self-explanatory from its README (the QR code's landing page).

## Non-goals ❌

- **No slide deck** as the main support (decided 2026-10-23 — *« ça, personne n'y croit »*).
- No humour, no characters, no illustration for its own sake — a serious tech talk.
- No product, no library, no package — a notebook and a storyboard.
- **A personal talk, not an employer talk.** The **only** employer mention allowed is the **speaker
  identification line** (*name — GenAI Center of Excellence, employer*): opening frame, abstract
  speaker line, the meetup's programme. Everywhere else — content, notebook, README, references,
  code, commit history — the employer is not cited, explicitly or by allusion, and nothing is
  presented as the employer's work or position. No employer branding.
- No employer-internal material of any kind. Public sources and public corpora only.
- No algorithm names on screen (they stay in the Q&A and the README).

## Key decisions

- **Storyboard, five sections** (2026-10-23) → [`references/0601_01_video_narrative_storyboard.md`](references/0601_01_video_narrative_storyboard.md):
  **L'impasse** · **Clio** · **SECNA** · **Les gros, et nous** (→ the notebook, ≥ 5 min) ·
  **Ma recette** (→ the agent cliffhanger).
- **Corpus** (revised 2026-10-24): ~~the Linux kernel~~ (*old school*, obscure themes) → the merge
  requests of a large, very active open-source code base over three months — *« qu'est-ce qui s'est
  passé dans <projet> ces derniers mois ? »*; chosen and run in
  [`secna_notebook`](worklines/secna_notebook/plan_secna_notebook.md).
- **The notebook shapes the storyboard**: live, the notebook part is an animation with a QR code to the
  real notebook (possibly run live); recorded, the same animation.
- **Palette**: *Charbon & citron vert* (red only for tokens). **Visual style**: to choose (Step 3.3).
- **Acronym SECNA**, coined for the talk and said so. **GitHub not cited**. Convergence, not lineage;
  OpenAI not in the gallery. **BERTopic** off screen (a replaceable glue).
- **Voice**: a TTS model with natural French intonation (Step 5.2) — the browser voice is ruled out.
- **Commits use the personal identity**. **This plan names no employer on purpose**; the audit word
  list lives outside this repo.

## Risks / constraints

- **Git history is permanent once public** — Step 7 audits the full history before the visibility flip.
- **Fixed date** (19 Nov): the notebook is on the critical path — its outputs feed the storyboard.
- **Corpus size**: fetch only the chosen period through the public API and keep the data out of git.
- **TTS quality**: a voice Michael would not put his name on is worse than captions — blind test first.

## 📅 Calendar — back-planned from Thu 19 Nov 2026 (proposed)

| By | Milestone | Steps |
|---|---|---|
| Tue 27 Oct | Storyboard sections deepened; visual style chosen | 3.2 · 3.3 |
| Fri 30 Oct | Notebook runs end to end on the chosen corpus; measured bill | 4 |
| Wed 4 Nov | Storyboard final with the notebook's real outputs; narration script | 3.4 |
| Mon 9 Nov | Animated storyboard v1 (five sections); voice chosen | 5.1 · 5.2 |
| Fri 13 Nov | Recorded version with voice; README; pre-publication audit | 5.3 · 6 · 7.1–7.4 |
| Tue 17 Nov | Sign-off → **repo public**, QR checked from a phone; rehearsal | 7.5 |
| Thu 19 Nov | **Meetup** (18:30) — offline copy of the HTML as fallback | — |

## 🚦 Green light protocol

- Planning/docs only until the user explicitly says **"🟩 go Step N"**.
- If scope changes materially, update this plan before proceeding.

## Plan steps

### Step 1 — Scaffold + references
**Status**: ✅ Done (2026-10-09) — folders, `.gitignore`, `references/BIBLIO.md` (arXiv IDs verified),
the scrubbed preparation record [`0104_01`](references/0104_01_talk_preparation.md), the abstract as sent
[`0104_02`](references/0104_02_abstract_fr.md). Word-list scan clean.

### Step 2 — The talk's intent
**Status**: ✅ Done (2026-10-20) → [`references/0301_01_talk_intent.md`](references/0301_01_talk_intent.md)
— purpose, room, take-aways, the abstract's promises, tone. Key sentence: promise *« Comprendre tout
un corpus sans le lire en entier »* + means *« La data science trouve la structure, le LLM lui donne
du sens »*. Audience personas for reviews: [`0302_02`](references/0302_02_audience_personas.md).

### Step 3 — The storyboard
**Status**: 🧪 In progress
- [x] 3.1 Five sections, v2 (serious tech-talk tone) → [`0601_01`](references/0601_01_video_narrative_storyboard.md);
      decisions: voice-over, ~20 min with ≥ 5 min on the notebook, HTML / SVG / JS, GitHub not cited.
- [ ] 3.2 Deepen each section (what is shown, what is said, the transitions) — to be revised once the
      notebook's outputs exist.
- [ ] 3.3 **Visual style**: 3–4 proposals rendered on the same scene → [`presentation/design/styles.html`](presentation/design/styles.html); Michael chooses.
- [ ] 3.4 Narration script, written for the ear (French, ~20 min at ~140 words/min).
- [ ] 3.5 **New approach (2026-10-23)** — stop steering the form: the raw material only (story, five sequences, explanations, facts, sources; no style or layout guidance) → [`references/0305_01_video_material.md`](references/0305_01_video_material.md); three context-free agents get the same short prompt (*« Prépare une vidéo qui ne soit pas des slides, moderne, impactful, ~20 min, avec tout ce matériel »*) and work in parallel → `presentation/video_candidates/{a,b,c}/`; Michael chooses.
- **Acceptance**: each section makes one point with its own visual; Michael validates the storyboard
  and the script.

### Step 4 — The notebook
**Status**: 📋 Moved to its own workline (2026-10-23) →
[`worklines/secna_notebook/plan_secna_notebook.md`](worklines/secna_notebook/plan_secna_notebook.md)
— dataset choice, fetch, E · C · N · A notebook (no S, basic libraries only), run review, outputs for
the storyboard. Its former checklist (fetch, cells ↔ letters, measured bill, outputs) is carried over
there.
- **Acceptance** (unchanged in spirit): fresh clone → one documented command → the notebook runs top to
  bottom and answers *what happened in <project> over <period>?*

### Step 5 — Build the animated storyboard
**Status**: ⏳ Pending
- [ ] 5.1 The five sections in HTML / SVG / JS: one scene per section, a camera, the chosen style; the
      notebook part as an animation of the real run + QR code; **live mode** (presenter-driven).
- [ ] 5.2 **Choose a TTS model** with natural French intonation over long passages: shortlist (leads,
      to verify: hosted expressive TTS such as Microsoft MAI-Voice-2 or Fish Audio S2.1 Pro; open models
      such as Kokoro's French voice or a bilingual EN–FR model); **blind listening test** by Michael on
      one 2-min excerpt rich in technical words; criteria: prosody, pronunciation of English terms,
      licence, cost, timestamps for syncing.
- [ ] 5.3 **Recorded mode**: the voice drives the scenes (one audio file per beat).
- **Acceptance**: no numbered steps, no text panels; Michael watches both modes end to end.

### Step 6 — README
**Status**: ⏳ Pending
- [ ] 6.1 Tagline, SECNA in five lines, how to run the notebook, links to the video and references.
- **Acceptance**: someone who scanned the QR code understands the recipe and can run it.

### Step 7 — Pre-publication review + make public
**Status**: ⏳ Pending — 🔴 **mandatory gate before the visibility flip**
- [ ] 7.1 Every file in the tree read (not just grepped) — nothing sensitive or compromising.
- [ ] 7.2 No employer mention beyond the speaker identification line; nothing reads as the
      employer's work, data or position.
- [ ] 7.3 No employer branding (styles, fonts, images, exports, video).
- [ ] 7.4 Audit the **whole history** (`git log -p --all`) and commit metadata against the external
      word list.
- [ ] 7.5 Final sign-off by Michael, then flip the repo to public.
- **Acceptance**: 7.1–7.4 clean and logged; repo public; QR code resolves.

### Archived — the slide-deck track (superseded 2026-10-23)
Kept as record, not maintained: the Marp neutral theme and build (`presentation/theme/`, `build.mjs`,
`deck.md` v1); structure proposals A and B and their persona reviews (`references/0302_01`–`0302_08`);
the slide proposals (`0302_09`); the PowerPoint generator (`presentation/pptx/`); the first video
attempt (`presentation/video/secna_video.html`, *« des slides, pas une vidéo »*); palette and
graphic-direction explorations (`presentation/design/`). What carries over: the intent, the cost
figures, the five-letter explanation, the palette, the review personas.

---

## Progress tracking ✅

- ✅ Step 1 — Scaffold + references
- ✅ Step 2 — The talk's intent
- 🧪 Step 3 — The storyboard (3.1 ✅; 3.2–3.4 pending)
- 📋 Step 4 — The notebook → workline `secna_notebook`
- ⏳ Step 5 — Build the animated storyboard (live + recorded, voice)
- ⏳ Step 6 — README
- ⏳ Step 7 — Pre-publication review + make public
- 📦 Archived — the slide-deck track

---

## Time tracking (use `date`) ⏱️

### Time log

| Timestamp (`date`) | Update |
|---|---|
| Fri Oct 23 22:52 CEST 2026 (notebook) | **Step 4 moved to workline `secna_notebook`** (Michael) → `worklines/secna_notebook/plan_secna_notebook.md`, drafted and reviewed, awaiting 🟩. **Corpus revised**: the Linux kernel dropped (*old school*, obscure themes, no PRs) → merged PRs of a very active, sprawling, GenAI-related open-source project, chosen on evidence in that workline's Step 1. Notebook: E · C · N · A, **no S**, basic libraries only (pandas, raw embeddings, k-means, no BERTopic / UMAP). |
| Fri Oct 23 2026 (candidates) | **Three video candidates delivered**, all open without JS errors (checked in headless Chrome): **A** 21:10, 41 scenes, offline (no CDN), C = voice-over script on screen · **B** 19:58, 42 scenes, N = narration panel, durations in `js/timing.js`, `?rec` for capture · **C** 20:41, 40 scenes, T = teleprompter, `?audio=` sync. All: ~5 min of notebook as an animated mock, invented outputs and function names marked *illustratif*. Awaiting Michael's choice. |
| Fri Oct 23 2026 (parallel) | **Change of method** (Michael: *the more instructions and examples, the more it reproduces them and loses what made the first unprepared videos good*). Style explorations stopped (variations deleted; the galactic sequence kept in `presentation/design/` as record). Raw material written → `references/0305_01_video_material.md` (~2,500 words, content only). **Three agents launched in parallel**, no context, same short prompt → `presentation/video_candidates/a|b|c/`. |
| Fri Oct 23 2026 (variations) | **3.3 — styles 1 (tableau blanc) and 2 (schéma d'ingénieur) kept** (Michael). Six variations on the same scene → `presentation/design/styles_variations.html`: 1a tableau blanc feutres · 1b tableau noir craie (stays in the charcoal palette) · 1c carnet d'ingénieur (squared paper, ink) · 2a schéma sombre · 2b schéma clair · 2c **schéma annoté** (hybrid: the precise diagram, annotated by hand in lime). Awaiting Michael's choice. |
| Fri Oct 23 2026 (styles) | **3.3 — four visual styles** rendered on the same SECNA scene (kernel commits, illustrative) → `presentation/design/styles.html`: **tableau blanc** (traced by hand, pedagogical, live-friendly), **schéma d'ingénieur** (dark system diagram, data flowing on a wire, gauges as instruments), **terminal / notebook** (the story is what the program prints — continuous with the notebook section), **éditorial / data journalisme** (thesis title + a chart that builds + annotations). Each with what it carries, why it works, its limit; three combinations suggested. Awaiting Michael's choice. |
| Fri Oct 23 2026 (restructure) | **Plan restructured — storyboard-first** (Michael: *« structure plus slides, personne n'y croit »*). The talk and the video both come from the five-section storyboard; the **notebook comes next and shapes it**; corpus decided: **the Linux kernel, last six months** (commits and merged pull requests); live: notebook shown as an animation + QR code (or run live). Steps renumbered: 1 scaffold ✅ · 2 intent ✅ · 3 storyboard · 4 notebook · 5 build (live + recorded, TTS) · 6 README · 7 pre-publication review; the slide-deck track archived. Older log rows keep their old step numbers. Visual style proposals launched (3.3). |
| Fri Oct 23 2026 (decisions) | **6.1 decisions** (Michael): voice-over narration; ~20 min with **> 5 min on the notebook** (cell by cell on the real run — depends on Step 2); HTML / SVG / JS; **GitHub not cited** — removed from the video, the deck generator (slide 14 table, notes), the adopted structure, the proposals, the intent, this plan and BIBLIO (marked not cited; evidence kept in the preparation record). New **6.3: choose a TTS model** with natural French intonation (shortlist + blind listening test). Note: the abstract as sent still names GitHub. |
| Fri Oct 23 2026 (later) | **6.1 storyboard v2** (Michael: v1 *too much* — no humour, no characters, no illustration; a tech talk). Rebuilt on his five sections: **L'impasse** (corpora vs context windows on a log scale; the loop — data grows with the models; not a race, not the same scale) · **Clio** (Dec 2024, the real case of technical impossibility, structure + meaning) · **SECNA** (the pipeline block by block, a cost gauge per block) · **Les gros, et nous** (Urania, LangSmith — **GitHub dropped**; the cost curve; can I do it too? → the notebook) · **Ma recette** (without S, why a table, limits, tomorrow, *et si on mettait des agents dessus ?*). Open: narration, length, build, GitHub in the deck. |
| Fri Oct 23 2026 | **Step 6 opened — the video, restarted from the intent.** Michael: the first attempt is *slides, not a video* (24 numbered steps, a 1-to-24 bar, text panels left on screen; the synthetic voice removed as "terribly horrible"). New approach → `references/0601_01_video_narrative_storyboard.md`: the video's intent, a narrative frame in **five sections** (La pile → Le mur → La recette des géants → Chez vous → Et si quelqu'un parcourait la carte ?), two story devices (a hero document followed from start to end, a bill meter as the tension), a shot-by-shot storyboard. 5 open questions (narration, length, hero, characters, build). |
| Wed Oct 21 11:30 CEST 2026 | **Narrated video of the talk** (Michael: a modern ~20-min video, not a slide sequence, palette kept, creative freedom, no MP4 needed) → `presentation/video/secna_video.html`: one HTML page, 24 chapters, ~3,200-word French script (first person, public facts only, same structure and decisions as the deck); one continuous particle world (piles → sphere → groups → names → treemap), kinetic type, bill bar, self-drawing curve, typed pseudo-notebook, agent teaser marked *illustratif*; voice = the browser's French speech synthesis, synced step by step, with subtitles, chapters, pause; `#s=N` opens chapter N silently (review). Key scenes captured with puppeteer and read back; fixes: frames under particles, treemap vs zoom card, highlight on large type, agent bubbles. |
| Wed Oct 21 10:05 CEST 2026 | **Visual identity, step 1 — palette chosen: « Charbon & citron vert »** (Michael, from six proposals in `presentation/design/palettes.html`): dominant `#18191C`, light `#F3F4F2`, emphasis `#5E8C00` (text on light) / `#C6F432` (on dark, fills, marker), **cost `#EF4444` (tokens only)**, groups `#7C5CFF` · `#06B6D4` · `#F59E0B`. Rule: lime never as text on white. The three graphic directions (A constellation, B editorial, C gradients) redone in this palette for the next choice. |
| Wed Oct 21 02:15 CEST 2026 | **Deck v1 generated — then switched to native PowerPoint** (Michael: the Marp render "looks ugly"). Marp v1 (`presentation/deck.md`, 24 slides, recommended picks) went through two rounds of a single balanced reviewer (7/10 → 8/10; fixes: group count 11/12, caption 16, colour rule, letter-slide alignment, sources, closing line). Michael then asked for **PowerPoint with a standard modern theme, not the employer's**: `presentation/pptx/build_deck.js` (pptxgenjs 4.0.1 pinned in `package.json`, structured deck: theme, layouts, sections; Calibri; ink / teal, red only for tokens; sphere, bill bar, treemap and table as native shapes, the curve as a native chart) → `dist/secna.pptx` (not committed). Validated (skill validator: all passed) and rendered through PowerPoint → PDF → images, every slide read back. **Decision to record**: the deck toolchain is now PowerPoint; the `secna-deck` skill (Marp) needs updating. |
| Tue Oct 20 22:10 CEST 2026 | **3.2 (b) — slide proposals** → `references/0302_09_slide_proposals.md` (~6,000 words): visual grammar (red = tokens, the letter template, cost badge / bill bar, recurring props: piles, sphere, curve); 24 slides × 3 proposals (layout, on-screen French text, reading path, speaker gist, needs) + a recommendation each; pending fresh-review items shown as ⏳ variants only; 11 theme components and 9 images to add. Next: Michael's picks, then a first deck generated locally with `secna-deck`. |
| Tue Oct 20 21:40 CEST 2026 | **Decided (Michael): BERTopic stays off the slides** — a convenient, replaceable glue for E + C (used in the notebook to keep it short), not part of the recipe; only GitHub names it publicly. Q&A answer added to the preparation record §5.2. |
| Tue Oct 20 21:30 CEST 2026 | **3.2 — slide 14 becomes a table** (Michael): a row per solution (Clio, GitHub, Google Urania, LangSmith Insights), a column per letter. Checked against public sources: GitHub = raw text → BERTopic → GPT-4 on the clusters, A partial (dashboards, top pain points, no hierarchy); **LangSmith Insights docs: an LLM summary of every trace and an LLM ("thinking model") doing the clustering, ≤ 1,000 traces, embeddings never mentioned**. `BIBLIO.md` and the preparation record updated. Also: Laurent's signals table restored in `0302_08` §2. |
| Tue Oct 20 21:05 CEST 2026 | **3.2 — fresh review of B v2** (4 new agents, no history) → `references/0302_08_fresh_review_b_v2.md`. All would come; Camille ~70 % happy, Laurent "mostly senior — probably". Slide 8 (S, 92 %) is the best slide. Decisive: slide 17 (output + one measured point). Not working: slide 14 (jargon, LangSmith, BERTopic missing). Also: ending vs Monday action, limits slide too packed, abstract overclaims, accuracy batch from Yanis. 6 decisions for Michael. |
| Tue Oct 20 20:40 CEST 2026 | **3.2 — proposal B adopted, B v2 applied** (Michael): E keeps its own slide (projection on a sphere); S stays *Summarise* but is presented as data preparation (summarise, translate, strip wording, bring forward meaning) — my recipe does a light, LLM-free version; slide 21 *the only LLM step that grows*; video 30 s (one question, one answer), limits slide 45 s; notebook slide open until Step 2; **cost curve illustrative** (near-log 1k → 1M, an arrow) — *Done means*, 2.3 and 3.3 updated accordingly. 24 slides, ~17 min. Fresh 4-persona review launched (new agents, no history). |
| Tue Oct 20 20:15 CEST 2026 | **3.2 — concurrent proposal B** (Michael: rather one slide per letter, like an image-led explainer) → `references/0302_06_talk_structure_letters.md`: 23 slides, each letter with its cost (Clio: S $45 / 92 %, N $3.75), players on one slide, pending fixes built in. A (v3) kept as is. **4-persona comparison** → `references/0302_07_review_a_vs_b.md`: **B unanimous**; keep from A the *data science / LLM* sentence, convergence weight, coarse-to-fine; merge E+C; honest badges with running total; S described literally; slide 20 *only LLM step that grows*. B v2 proposed — awaiting Michael. |
| Tue Oct 20 19:45 CEST 2026 | **3.2 — structure v3** (Michael: notebook as the answer to *only for giants?*; *my recipe* after it, as a recipe I use and defend; coarse-to-fine; where it pays; one small-models slide closing the loop on my trade-off), 21 slides. **Third 4-persona review** → `references/0302_05_multi_persona_review_v3.md`: best version for all four; unanimous: the notebook runs *my* recipe and opens on its outputs. Still pending: limit (F1), honest hook + costed trade-off from Clio's 92 % (F2/T1/T2), worked cost (F6), verbs (F4). Proposal for Step 2: a *summarise* switch with a small model, cost of both runs printed. 7 decisions for Michael. |
| Tue Oct 20 19:15 CEST 2026 | **3.2 — structure v2** (Michael's flow: Clio → SECNA strip → GitHub / Google / LangSmith on the same strip → my recipe → cost → notebook → *et demain*: small models + Jevons → teaser), 22 slides, reviewers' fixes not applied. **Second 4-persona review** → `references/0302_04_multi_persona_review_v2.md`: shape better, substance unchanged; F1 (limit), F2 (hook), F6 (worked cost), F4 (French verbs) now unanimous; new: two endings, vendor-based slide 18, empty LangSmith strip, strip accuracy. 7 decisions for Michael. |
| Tue Oct 20 18:45 CEST 2026 | **3.2 — multi-persona review** (4 sub-agents, one per persona) → `references/0302_03_multi_persona_review.md`. Consensus: hook contradicts the recipe, no stated limit, letters are jargon, notebook must lead with outputs, curve needs assumptions, ending too long; two overclaims in the sent abstract. Checked against Clio's Table 3: per-conversation S = $45.00 of $48.81 (92 %). Proposed structure v2 (19 slides, new « Où ça s'arrête ») — awaiting Michael. |
| Tue Oct 20 18:20 CEST 2026 | **3.2 — audience personas** → `references/0302_02_audience_personas.md`: Camille (PM), Yanis (AI/backend dev), Sophie (business/ops lead), Laurent (CTO hiring senior profiles, added 18:25) — profile, their pile, what they know, why they came, when they disengage, Q&A questions; evaluation grid for the structure, each slide and the rendered deck. |
| Tue Oct 20 18:10 CEST 2026 | **First commit** `a97a164` (Michael, via a reviewed script): plan, references, theme, build. **3.1 ✅** (go 3.2). **3.2 (a) drafted** → `references/0302_01_talk_structure.md`: 5 parts, 18 slides, ~20 min (15-min cut marked), 7 structural choices to agree on. Rule from Michael: Markdown first — structure, then slide content, deck generated only once agreed. |
| Tue Oct 20 18:05 CEST 2026 | **3.1 — the key sentence reworded** (Michael): promise *« Comprendre tout un corpus sans le lire en entier »* (Clio's own claim) + means *« La data science trouve la structure, le LLM lui donne du sens »* — replaces "statistics … only names it" in the intent, the preparation record, this plan and `CLAUDE.md` (the abstract as sent is unchanged). New open point §10.5: hierarchy in SECNA's A, and the weak-signal claim (Clio states it misses rare patterns). |
| Tue Oct 20 17:38 CEST 2026 | **Docs numbered per the workplan convention** (`<step>_<num>_<name>`, kept in `references/`): `0104_01_talk_preparation.md`, `0104_02_abstract_fr.md` (brought in by 1.4), `0301_01_talk_intent.md`. Step 3 substeps renumbered to numeric (3.A → 3.1, 3.B → 3.2, 3.1–3.4 → 3.3–3.6); older log rows keep the old numbers. `BIBLIO.md` left unnumbered (public reference list). |
| Tue Oct 20 17:24 CEST 2026 | **3.A drafted** (🟩 go 3.A) → `references/0301_01_talk_intent.md`. Awaiting Michael's validation; 4 open points (slot, live vs walkthrough, closing video, hook wording). |
| Tue Oct 20 15:56 CEST 2026 | **Date confirmed: Thursday 19 November 2026.** Priority and risks updated; back-planned calendar added (proposed, to confirm). Next: 3.A (intent) and 2.1 (corpus) in parallel — awaiting 🟩. |
| Tue Oct 20 15:48 CEST 2026 | **Handover + skills.** `CLAUDE.md` (orientation), local `CLAUDE.local.md` (handover note, gitignored), skill `secna-deck` (committed: build, rules, components, freeze), local links to `workplan` / `clean-verbatim` / `rtfm` (gitignored). `.gitignore`: only `dist/deck-standalone.html` is trackable, at freeze. Word-list scan of the trackable files clean. Still nothing committed. |
| Fri Oct  9 17:48 CEST 2026 | **Deck dropped** (Michael): restart from the intent (3.A). Kept: `theme/`, `build.mjs`, `package.json`. Removed: `deck.md`, the illustrative cost-curve PNG, the renders. |
| Fri Oct  9 16:04 CEST 2026 | **3.0 done — the deck builds.** Neutral `secna` theme (Inter + IBM Plex Mono, OFL; no logo / brand images); self-contained Marp build in `presentation/`; PDF + standalone HTML + 13 review PNGs, every slide read back, two layout fixes. Slide 8 (LangSmith) reads weak in its public-facts-only form — flagged. |
| Fri Oct  9 15:56 CEST 2026 | **Step 1 done.** Folders + `.gitignore`; deck brought in (`theme: secna`, LangSmith slide limited to public facts, TODOs → 3.2/3.3); `references/` = public BIBLIO (IDs verified), scrubbed preparation record, abstract. Word-list scan clean apart from the two allowed speaker lines. Nothing committed yet. |
| Fri Oct  9 15:22 CEST 2026 | Rule refined: the speaker is identified with his employer (cover, abstract speaker line, meetup programme) — separation, not erasure; the content itself never cites the employer nor speaks on its behalf. |
| Fri Oct  9 15:20 CEST 2026 | Rules added: personal talk — employer never named, no employer branding; deck reuses the Marp tooling with a **de-branded theme CSS** (3.0); Step 5 becomes a mandatory pre-publication review (sensitive / compromising / employer mention / branding / full history). |
| Fri Oct  9 15:18 CEST 2026 | Workline created. Repo cloned, personal commit identity set, plan drafted. Material to bring in exists from earlier preparation (deck v2, 13 slides; abstract; preparation record; prior-art notes + bibliography). Awaiting 1.1 decisions and 🟩 for Step 1. |

---

## Workline artifacts

- [`CLAUDE.md`](CLAUDE.md) — orientation for Claude Code; [`.claude/skills/secna-deck/`](.claude/skills/secna-deck/SKILL.md) — the deck skill
- `presentation/deck.md` — *(dropped 2026-10-09, to be rewritten from the intent, 3.1)*
- [`presentation/theme/secna.css`](presentation/theme/secna.css) + `theme/fonts/` — the neutral theme; [`presentation/build.mjs`](presentation/build.mjs) — `node build.mjs all`
- [`references/BIBLIO.md`](references/BIBLIO.md) — every source the talk relies on
- [`references/0301_01_talk_intent.md`](references/0301_01_talk_intent.md) — the talk's intent (3.1): purpose, audience, take-aways
- [`references/0302_01_talk_structure.md`](references/0302_01_talk_structure.md) — the talk's structure (3.2): parts, slides, one line each
- [`references/0302_02_audience_personas.md`](references/0302_02_audience_personas.md) — four audience personas + evaluation grid (3.2)
- [`references/0302_03_multi_persona_review.md`](references/0302_03_multi_persona_review.md) — 4-persona review of the abstract + structure, findings and proposed structure v2 (3.2)
- [`references/0302_04_multi_persona_review_v2.md`](references/0302_04_multi_persona_review_v2.md) — second 4-persona review, on structure v2; decisions for Michael (3.2)
- [`references/0302_05_multi_persona_review_v3.md`](references/0302_05_multi_persona_review_v3.md) — third 4-persona review, on structure v3; decisions for Michael (3.2)
- [`references/0302_06_talk_structure_letters.md`](references/0302_06_talk_structure_letters.md) — proposal B: one slide per SECNA letter, each with its cost (3.2)
- [`references/0302_07_review_a_vs_b.md`](references/0302_07_review_a_vs_b.md) — 4-persona comparison A vs B: B unanimous; B v2 proposed (3.2)
- [`references/0302_08_fresh_review_b_v2.md`](references/0302_08_fresh_review_b_v2.md) — fresh 4-persona review (no history) of B v2; decisions for Michael (3.2)
- [`references/0302_09_slide_proposals.md`](references/0302_09_slide_proposals.md) — three content + form proposals per slide, picks, components, images (3.2 b)
- [`references/0104_01_talk_preparation.md`](references/0104_01_talk_preparation.md) — the decisions behind the deck
- [`references/0104_02_abstract_fr.md`](references/0104_02_abstract_fr.md) — the abstract
