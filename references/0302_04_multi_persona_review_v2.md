# Multi-persona review — structure v2

> Plan Step 3.2. Second round: the same four personas
> ([`0302_02_audience_personas.md`](0302_02_audience_personas.md)), one sub-agent each, on structure
> v2 ([`0302_01_talk_structure.md`](0302_01_talk_structure.md) — Michael's flow: Clio → SECNA → the
> big players on one strip → my recipe → cost → notebook → *et demain*). First round:
> [`0302_03_multi_persona_review.md`](0302_03_multi_persona_review.md). Nothing applied — §5 lists
> what needs Michael's decision.

---

## 1. Verdict

**The shape is better; the substance has not moved.** All four prefer v2's arc — Clio told as one
story, the lineage claim gone, *the same strip* for each player (*"the slide I'd photograph"* —
Yanis; *"a good communicator's choice"* — Laurent). But the pending v1 fixes are still the top
asks of every persona, and v2 added two new weak spots: **the ending** (two conclusions in a row,
with the two most hype-prone slides of the deck) and **the strips' accuracy and readability**.
Laurent: *"v1 oversold the method, v2 oversells the outlook — net, about level."*

## 2. Scores per slide (✅ lands · 🟡 with the speaker's help · 🔴 loses them)

| # | Slide | Camille | Yanis | Sophie | Main issue |
|---|---|---|---|---|---|
| 1 | Cover | ✅ | ✅ | 🟡 | "tokens" undefined |
| 2 | Real question | ✅ | ✅ | 🔴 | token, corpus undefined |
| 3 | Piles | ✅ | ✅ | ✅ | — |
| 4 | Hook | 🟡 | 🔴 | 🟡 | contradicted by Clio's own cost table (S = 92 %) |
| 5 | Clio | ✅ | ✅ | 🟡 | keep $48.81 / 100k on screen |
| 6 | Promise | ✅ | 🟡 | ✅ | "tout un corpus" vs rare patterns |
| 7 | Clio's strip | 🟡 | ✅ | 🔴 | English letters, no French verbs |
| 8 | GitHub | 🟡 | 🟡 | 🟡 | "the rest identical" is wrong; "no S" means nothing without a verb |
| 9 | Urania | 🔴 | 🟡 | 🔴 | researchers' detail; S must be "non établi" |
| 10 | LangSmith | 🟡 | 🔴 | 🔴 | blank strip = nothing to see; unknown brand |
| 11 | What they share | ✅ | ✅ | ✅ | — |
| 12 | My recipe | 🟡 | 🟡 | 🔴 | hierarchy isn't new (Clio has one); trade-off unstated; "metadata" jargon |
| 13 | Coarse to fine | ✅ | 🟡 | ✅ | needs the notebook's own hierarchy; don't merge it away |
| 14 | Cost curve | 🟡 | 🟡 | 🟡 | no assumptions, no worked number |
| 15 | Only for giants? | 🟡 | 🔴 | 🟡 | at small scale both are cheap → say it, pivot to discovery; keep in the cut |
| 16 | Notebook | 🔴/🟡 | ✅ | 🔴 | open on the named groups, not the cells |
| 17 | Where it pays | ✅ | ✅ | ✅ | *the slide Camille photographs*; RAG in plain words |
| 18 | Small models | 🟡 | 🔴 | 🔴 | vendor figures; Clio already summarises with its smallest model |
| 19 | Jevons | 🟡 | 🟡 | 🟡 | an argument, not a fact; "therefore mix" does not follow |
| 20 | Setup | ✅ | ✅ | 🟡 | "agent" in one phrase |
| 21 | Video | 🟡 | 🟡 | 🟡 | fine at ≤ 60 s |
| 22 | Close | ✅ | ✅ | ✅ | — |

**Laurent (talk as a whole)** — economic framing ✅ · clarity for a mixed room ✅ · simple over
fashionable 🟡 (ends on a vendor and an agent) · measured number 🟡 · trade-off 🟡 · clean code 🟡 ·
personal point of view 🟡 (12 is a real choice, not yet argued; 18–19 an opinion, not yet argued) ·
**stated limit ❌ — "the blocker"**.

## 3. New findings on v2

| # | Finding | Raised by | Proposed fix |
|---|---|---|---|
| N1 | **Two endings in a row** (18–19 conclusion, 20–22 teaser) — the real close (17) gets buried | all four | Fold 18 + 19 into **one** *et demain* slide ending on an action; then the teaser as a short encore |
| N2 | **Slide 18 rests on a vendor** — and Clio *already* runs S on its smallest model (Haiku, $45 of $49) | Yanis, Laurent, Camille, Sophie | Argue from Clio's cost split: *the per-document layer is the one that keeps getting cheaper*. ScaleDown as a labelled example (*chiffres éditeur*) or dropped; best: measure a small model in the notebook |
| N3 | **Jevons is stretched** — an argument from commentary; "so mix the approaches" doesn't follow from it | Yanis, Laurent (Camille, Sophie: "what do I do on Monday?") | Say it as a bet (*« pari »*), one spoken sentence; present the mix as **a decision rule**: data science where there is structure · a small model per document if needed · the big model only on the groups — with the cost of each layer |
| N4 | **The LangSmith strip is empty** (method undocumented) — and sampling isn't damning: Clio's costed run is itself a 100k sample | Yanis 🔴, Sophie 🔴, Camille | Drop the strip; one spoken line on 11 or the Q&A. Merge Urania into a single line too (Sophie, Camille) |
| N5 | **The strips must be readable in five seconds** | Camille, Sophie | French verb under every letter (*résumer · rapprocher · regrouper · nommer · compter*); the one change highlighted, the rest greyed; one business caption (*« GitHub : ne résume pas → moins cher »*); a cost marker on S and N |
| N6 | **Accuracy of the strips** | Yanis | GitHub: *même squelette, sans S* — not "identical" (BERT · HDBSCAN via BERTopic · GPT-4 on the clusters; check whether it has an A). Urania: S = *non établi*. Clio: put $45.00 on S, $3.75 on N. |
| N7 | **"My recipe" claims a hierarchy as new** (Clio has one) and states no trade-off | Yanis, Laurent | *« la variante que j'utilise — celle du notebook »*: what's really different = no S + a base you query and cross with metadata (say *« filtrer par produit, par mois »*). State what dropping S costs (long, messy texts), where the line is, and one thing tried that didn't work |
| N8 | **15-min cut** | Sophie, Camille | Keep 13 and 15 (they answer *"is this for us?"*) |

## 4. The v1 findings still pending — now ranked by all four

| Fix | Camille | Yanis | Sophie | Laurent | Consensus |
|---|---|---|---|---|---|
| **F1** « Où ça s'arrête » (stated limit) | 4 | 2 | 4 | **1 (blocker)** | **must** |
| **F2** hook rewritten with Clio's 92 % | 2 | **1** | 7 | 2 | **must** |
| **F6** curve assumptions + worked example (40 000 avis : X $ vs Y $) | **1** | 3 | 5 | 3 | **must** |
| **F4** French verbs under the letters | 3 | 8 | **1** | 6 | **must** now (five strips) |
| **F5** notebook opens on its outputs | 5 | 5 | 3 | 4 | should |
| **F9** small scale: both cheap → discovery | 6 | 4 | 6 | 5 | should |
| **F11** token, corpus, RAG in plain words | 7 | 7 | 2 | 6 | should |
| F7 / F10 | covered by v2 / by N8 | | | | — |

## 5. Decisions for Michael

1. **The stated limit (F1)** — unanimous, and Laurent's blocker. Where: a slide after 15 (paid for
   by dropping the LangSmith strip, N4), or replacing 19.
2. **The hook (F2)** — use Clio's cost split: *« Même Anthropic résume chaque conversation — avec son
   plus petit modèle. Le grand ne lit que les groupes. »*
3. **The strips** — keep Clio, GitHub, mine as full strips; Urania and LangSmith as one line each
   (N4)? French verbs + one highlighted change + one caption (N5, F4)? Literal components (N6)?
4. **My recipe (12)** — reframed as *the notebook's variant*: no S + a queryable base; the trade-off
   stated; one failed attempt (N7). What failed attempt can you honestly tell, on public material?
5. **Et demain (18–19 → one slide)** — argued from Clio's cost split, the mix as a decision rule,
   Jevons as a one-sentence bet, ScaleDown labelled or dropped (N1–N3). Or measure a small model in
   the notebook (adds work to Step 2).
6. **The curve (F6)** — assumptions line + *« 40 000 avis : X $ vs Y $ »*; keep 15 with the
   discovery pivot (F9, N8).
7. **Words (F11)** — *token* defined on 2; RAG in plain words on 17; *agent* in one phrase on 20.
