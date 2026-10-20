# CLAUDE.md

Orients Claude Code in this repo.

## What this is

**SECNA** — a talk for the Generative AI Bordeaux meetup (French, 15–30 min, PMs + developers),
*« Vos corpus grossissent. Pas votre budget de tokens. »*, plus everything public around it: the deck,
a short notebook running the recipe on a public corpus, and the references. **S**ummarise ·
**E**mbed · **C**luster · **N**ame · **A**ggregate: data science finds the structure, the LLM gives
it meaning, so the bill follows the number of clusters, not the number of documents.

The repo is **private until the material is ready, then public**. Write everything as if it were
already public.

## Start here

1. **`CLAUDE.local.md`** if it exists — the handover note (local only, never committed). Read it first.
2. **[`plan_secna.md`](plan_secna.md)** — the workline plan: steps, status, decisions, time log.
3. [`references/`](references/) — `0104_01_talk_preparation.md` (decisions so far — input, not gospel),
   `0104_02_abstract_fr.md`, `BIBLIO.md` (every source the talk relies on).

## Layout

- `presentation/` — the Marp deck, its neutral theme and its build → skill **`secna-deck`**.
- `notebook/` — the SECNA notebook (to write, plan Step 2). Data and outputs gitignored.
- `references/` — preparation notes and the bibliography. Paper PDFs gitignored.

## How to work here

- **Plans and steps**: skill `workplan` (local link). This repo has no `docs/LOGBOOK.md`; the
  plan's **time log** is the log.
- **Green light**: propose the step (checklist + acceptance criteria) and wait for an explicit
  "🟩 go" before writing deliverables or editing the plan beyond what was asked.
- **Voice monologues** dropped into a markdown file: skill `clean-verbatim` (local link).
- **Before an unfamiliar command**: skill `rtfm` (local link).
- **Nothing non-public enters this repo — not even temporarily.** Git history is permanent once the
  repo is public. Public sources and public corpora only; no organisation branding. The speaker's
  identification line (cover, abstract) is the only affiliation mention allowed. Plan Step 5 is the
  mandatory review before the repo goes public.
- **Commits**: Conventional Commits; author is the repo's configured personal identity — never
  change it.
