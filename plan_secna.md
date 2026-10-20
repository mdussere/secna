---
**Status**: 🧪 Active — deck dropped 2026-10-09; intent drafted (3.1), awaiting validation
**Date**: 2026-10-09 (updated 2026-10-20)
**Priority**: High — **meetup on Thursday 19 November 2026** (date confirmed)
**Maintained**: Yes
---

# SECNA — talk + notebook for Generative AI Bordeaux (workline `secna`)

## Overview

A talk for the **Generative AI Bordeaux** meetup, in French, 15–30 min, for an audience of
product managers and developers: **« Vos corpus grossissent. Pas votre budget de tokens. »**

The thesis: the real question is not *what would I do with unlimited tokens* but *how do I process
corpora that keep growing, on the budget I have*. The answer is a recipe several teams reached
independently (Anthropic's Clio, GitHub, Google's Urania, Kura): **S**ummarise · **E**mbed ·
**C**luster · **N**ame · **A**ggregate — **SECNA**. Data science finds the structure; the LLM gives
it meaning. E and C are nearly free, so the bill follows the number of clusters, not the number of documents.

This repository holds everything public about the talk: the **deck**, a **notebook** (≈100–200
lines) running SECNA end to end on a **public corpus**, and the **references**. It is private until
the material is ready, then made public; the deck's QR code points here.

**Done means**: the repo is public, the notebook runs from a clean clone in one command and produces
the cost curve shown in the deck, the deck is exported (PDF + HTML) with no placeholders left, and
every factual claim on a slide traces to a reference in `references/`.

## Workline directory layout

- Plan (this file): `plan_secna.md`
- `presentation/` — the Marp deck (`deck.md`, `assets/`), exports under `dist/` (gitignored)
- `notebook/` — the SECNA notebook + a script to fetch the corpus (data gitignored)
- `references/` — `BIBLIO.md` (links) + the preparation notes; PDFs gitignored

## Goals ✅

- A notebook a developer can run in an afternoon: fetch a public corpus → S(optional)·E·C·N·A →
  named themes + **measured** token/cost figures.
- A deck that lands two takeaways in one talk: **the economics** for PMs, **the recipe** for devs.
- A public repo that is self-explanatory from the README alone (the QR code's landing page).

## Non-goals ❌

- No product, no library, no package — a notebook and a deck.
- **A personal talk, not an employer talk.** The speaker presents in his own name, not on behalf of
  his employer — but where he comes from is not hidden. The **only** employer mention allowed is the
  **speaker identification line** (*name — GenAI Center of Excellence, employer*): deck cover, abstract
  speaker line, the meetup's own programme. Everywhere else — slide content, notebook, README,
  references, code, commit history — the employer is not cited, explicitly or by allusion, and
  nothing is presented as the employer's work or position. No employer branding (logo, fonts,
  colours, backgrounds, emotes).
- No employer-internal material of any kind: no internal data, figures, use cases, architecture,
  or product names. Public sources and public corpora only.
- No benchmark tables or algorithm names on the slides (UMAP, HDBSCAN, BERTopic stay in the Q&A).

## Key decisions / assumptions

- **Acronym: SECNA** — coined for the talk, said so on stage (the field has no canonical name).
- **Convergence, not lineage**: GitHub's pipeline (July 2024) predates Clio (Dec 2024). Never say
  "they all copied Clio"; never put OpenAI in the gallery (their usage study is classifier-based).
- **Running order** (20-min assumption): question → Clio → SECNA → **cost curve** → gallery →
  "only for the giants?" (curve reused) → **notebook** → use cases + callback → cliffhanger video.
- **Corpus**: a large public developer corpus (Linux-kernel commits/PRs is the lead candidate) —
  the x-axis of the cost curve can honestly run to "the whole history".
- **Commits use the personal identity** (`michael.dussere@gmail.com`) — this history goes public.
- **Deck toolchain**: the Marp slide-deck tooling already used elsewhere (it produces good decks),
  but with a **de-branded copy of its theme CSS** living in `presentation/` — every employer-specific
  element (logo, brand fonts, colours, backgrounds, emotes, footer) removed or replaced by neutral ones.
  The branded theme itself never enters this repo.
- **This plan names no employer on purpose** — it is itself published. The word list used by the
  audit (employer name, internal names, channels, page IDs, paths) is kept **outside** this repo.

## Risks / constraints

- **Git history is permanent once public.** Anything that must not be published never enters this
  repo — not even temporarily. Mitigation: Step 5 audits the full history before the visibility flip.
- **Paper PDFs are mostly copyrighted** → gitignored; `BIBLIO.md` carries the links.
- **Slot length unknown** (15/20/30 min) — the gallery collapses to one slide at 15 min.
- **Fixed date, 30 days out** (from 2026-10-20). The notebook feeds the deck (measured cost curve)
  and the README feeds the QR code: Step 2 is on the critical path, not a side task.

## 📅 Calendar — back-planned from Thu 19 Nov 2026 (proposed, to confirm)

| By | Milestone | Steps |
|---|---|---|
| Fri 23 Oct | Intent written and validated; corpus chosen and fetchable; slot length asked of the organisers | 3.1 · 2.1 |
| Fri 30 Oct | Notebook runs end to end; **measured** cost curve produced | 2.2–2.4 |
| Fri 6 Nov | Deck v1 complete (structure + slides, curve in); first timed run-through | 3.2 · 3.3 |
| Tue 10 Nov | Closing video in; README written; QR code on the slide | 3.4 · 3.5 · 4 |
| Fri 13 Nov | Deck exported and reviewed slide by slide; pre-publication audit done | 3.6 · 5.1–5.4 |
| Tue 17 Nov | Sign-off → **repo public**, QR code checked from a phone; final rehearsal | 5.5 |
| Thu 19 Nov | **Meetup** (18:30) — PDF + standalone HTML on a USB key as fallback | — |

## 🚦 Green light protocol

- Planning/docs only until the user explicitly says **"🟩 go Step N"**.
- If scope changes materially, update this plan before proceeding.

## Plan steps (no execution until green light)

### Step 1 — Scaffold + bring the existing material in
**Status**: ✅ Done (2026-10-09) — build check moved to 3.0
- [x] 1.1 Decided: shared research material is **copied**, not moved — the full bibliography stays in
      the source workspace; this repo gets a **short public list** of what the talk cites. The long
      prior-art notes stay there (they compare the literature to non-public work).
      *Deck theme: de-branded copy of the existing theme — see Step 3.0.*
- [x] 1.2 `presentation/`, `notebook/`, `references/` created; `.gitignore` covers Marp outputs,
      `references/pdf/`, `notebook/data/`, `notebook/out/`.
- [x] 1.3 Deck source in `presentation/` (`deck.md` + `assets/img/courbe_cout.png`). On the way:
      `theme: secna` (the theme itself is Step 3.0 — **the deck does not build until then**); the
      LangSmith slide states only what LangSmith's public docs say (1,000-trace cap; Clio never
      mentioned) — a stronger version waits for a citable source; TODOs renumbered to 3.2 / 3.3.
- [x] 1.4 `references/BIBLIO.md` (public, every source the talk relies on, arXiv IDs verified against
      the arXiv API), `references/0104_01_talk_preparation.md` (decisions, scrubbed), `references/0104_02_abstract_fr.md`
      (the abstract as sent to the organisers).
- [x] 1.5 Source workspace: the deck replaced by a pointer stub; the preparation record and the
      abstract carry a banner pointing here (originals frozen there).
- **Acceptance**: ✅ the word-list scan over the tree finds only the two allowed speaker lines (deck
  cover, abstract). The PNG carries no metadata beyond the plotting software. ✅ builds here (3.0).

### Step 2 — The notebook
**Status**: ⏳ Pending
- [ ] 2.1 Choose and fetch the corpus (script, not committed data); size it for a laptop run.
- [ ] 2.2 Five cells ↔ five letters (S optional, E, C, N, A); ≤ 200 lines.
- [ ] 2.3 Measure tokens/cost for "LLM on every document" vs "LLM on the clusters only" at several
      corpus sizes → the data behind the cost curve.
- [ ] 2.4 Provider-agnostic LLM/embedding calls (env vars), documented in the notebook header.
- **Acceptance**: fresh clone → one documented command → notebook runs top to bottom and writes the
  cost-curve figure.

### Step 3 — The deck
**Status**: 🧪 Restarted from scratch (2026-10-09) — the previous deck (v2, 13 slides) was dropped;
the theme and the build stay. Previous version recoverable from the source workspace's git history.
*Substeps renumbered 2026-10-20 to fit the doc numbering (3.A → 3.1, 3.B → 3.2, old 3.1–3.4 → 3.3–3.6).*
- [x] 3.0 ✅ **Neutral theme** (2026-10-09): `presentation/theme/secna.css` — written compact (only
      what the deck uses: cover / impact / clip, chapter bar, cols, cards) rather than stripped from
      the original: no logo, no brand background images, no emotes; **Inter + IBM Plex Mono** (OFL,
      licences beside the woff2, embedded so the HTML renders offline); neutral blue for titles and
      chrome; red kept **only** for meaning ("costs tokens", slide 4). Self-contained build:
      `presentation/package.json` (marp-cli 4.5.1 locked) + `build.mjs <html|pdf|png|standalone|all>`
      → `dist/deck.pdf`, `dist/deck-standalone.html` (0.3 MB), `review/deck.NNN.png`. All 13 slides
      read back; fixed the page-number offset and the missing gap under card/column blocks.
- [ ] 3.1 **Intent, from scratch** — what the talk is for, for whom, what they leave with; written
      before any slide. The preparation record in `references/` is input, not the answer.
      🧪 **Drafted 2026-10-20** → [`references/0301_01_talk_intent.md`](references/0301_01_talk_intent.md) — purpose,
      room, take-aways per audience (with a test each), the abstract's promises, story, tone, non-goals,
      success signals, lessons from the dropped draft, 4 open points. **Acceptance**: Michael validates
      it (and settles or defers §10) before 3.2 starts.
- [ ] 3.2 Structure + slide list derived from 3.1 — then the deck.
- [ ] 3.3 Cost curve from the measured data of 2.3, drawn with the neutral palette of 3.0.
- [ ] 3.4 Insert the repo QR code + URL.
- [ ] 3.5 Insert the closing video (60–90 s, unbranded, explains nothing).
- [ ] 3.6 Export PDF + standalone HTML; render every slide to PNG and review each one.
- **Acceptance**: no `TODO` / placeholder left in `deck.md`; every slide image reviewed; no employer
  logo, font, colour or name visible on any slide.

### Step 4 — README
**Status**: ⏳ Pending
- [ ] 4.1 Tagline, the SECNA idea in five lines, how to run the notebook, links to the deck and refs.
- **Acceptance**: someone who scanned the QR code understands the recipe and can run it without the talk.

### Step 5 — Pre-publication review + make public
**Status**: ⏳ Pending — 🔴 **mandatory gate before the visibility flip**
- [ ] 5.1 **Clear review that nothing is sensitive or compromising**: every file in the tree is read,
      not just grepped — deck, notebook, README, references, plan.
- [ ] 5.2 **No employer mention beyond the speaker identification line**: the talk is given in a
      personal capacity — the employer is not cited in the content, explicitly or by allusion
      (internal tool names, colleagues, internal channels, URLs, page IDs, local paths), and nothing
      reads as the employer's work, data or position.
- [ ] 5.3 **No employer branding**: theme CSS, fonts, images, rendered exports, video.
- [ ] 5.4 Audit the **whole history** (`git log -p --all`) and commit metadata (author names/emails)
      against the external word list; rewrite or re-create the repo if anything slipped.
- [ ] 5.5 Final sign-off by Michael, then flip the repo to public.
- **Acceptance**: 5.1–5.4 clean and recorded in the time log; repo public; QR code resolves.

---

## Progress tracking ✅

- ✅ Step 1 — Scaffold + bring the existing material in (build check → 3.0)
- ⏳ Step 2 — The notebook
- 🧪 Step 3 — The deck (3.0 theme ✅; 3.1 intent drafted; 3.2–3.6 pending)
- ⏳ Step 4 — README
- ⏳ Step 5 — Pre-publication audit + make public

---

## Time tracking (use `date`) ⏱️

### Time log

| Timestamp (`date`) | Update |
|---|---|
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
- [`references/0104_01_talk_preparation.md`](references/0104_01_talk_preparation.md) — the decisions behind the deck
- [`references/0104_02_abstract_fr.md`](references/0104_02_abstract_fr.md) — the abstract
