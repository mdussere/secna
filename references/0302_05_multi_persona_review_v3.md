# Multi-persona review — structure v3

> Plan Step 3.2. Third round: the four personas
> ([`0302_02_audience_personas.md`](0302_02_audience_personas.md)), one sub-agent each, on structure
> v3 ([`0302_01_talk_structure.md`](0302_01_talk_structure.md) — notebook as the answer to *"only for
> giants?"*, then *my recipe* as a recipe I use and defend, coarse-to-fine, where it pays, one
> small-models slide tied to my trade-off). Previous rounds: [`0302_03`](0302_03_multi_persona_review.md)
> (v1), [`0302_04`](0302_04_multi_persona_review_v2.md) (v2). Nothing applied — §5 is for Michael.

---

## 1. Verdict

**v3 is the best version for all four.** Camille can retell it *"in one breath"*; Yanis: the notebook
now *"answers a doubt the room actually has"*; Sophie: the crêpe-batter recipe is *"the first time
'my recipe' feels human"*, and 15–17 are *"the best stretch of the talk"*; Laurent: *"from good
communicator to good communicator with an opinion — not yet someone I'd hire"*. The 15 → 18 loop
(trade-off made, trade-off reduced) is *"the first thing that reads like a practitioner's
judgement"*. One ending now.

What still blocks: **the same four pending fixes** (limit, honest hook, a worked cost figure, verbs
under the letters) — and, newly, **the trade-off is asserted, not costed**.

## 2. Scores per slide (✅ lands · 🟡 with the speaker's help · 🔴 loses them)

| # | Slide | Camille | Yanis | Sophie | Main issue |
|---|---|---|---|---|---|
| 1 | Cover | ✅ | ✅ | 🟡 | "tokens" |
| 2 | Real question | ✅ | ✅ | 🔴 | token, corpus |
| 3 | Piles | ✅ | ✅ | ✅ | — |
| 4 | Hook | 🟡 | 🔴 | 🟡 | contradicted by Clio's 92 % (F2) |
| 5 | Clio | ✅ | ✅ | 🟡 | keep $48.81 / 100k |
| 6 | Promise | ✅ | 🟡 | ✅ | rare patterns can be missed |
| 7 | Clio's strip | 🟡 | ✅ | 🔴 | no verbs (F4); put $45.00 on S, $3.75 on N |
| 8 | GitHub | 🟡 | 🟡 | 🟡 | literal components; "no S" needs a verb |
| 9 | Urania | 🔴 | 🟡 | 🔴 | researchers' detail → one line (N4) |
| 10 | LangSmith | 🟡 | 🔴 | 🔴 | empty strip → one line (N4) |
| 11 | What they share | ✅ | ✅ | ✅ | — |
| 12 | Cost curve | 🟡 | 🟡 | 🟡 | no assumptions, no worked number (F6) |
| 13 | Only for giants? | 🟡 | 🔴 | 🟡 | at small scale both are cheap → discovery (F9) |
| 14 | Notebook | 🟡 | ✅ | 🔴 | must open on the named groups and the bill (F5) |
| 15 | My recipe | 🟡 | 🟡 | 🟡 | framing ✅; trade-off not costed; "S", "base you can query" |
| 16 | Coarse to fine | ✅ | 🟡 | ✅ | Clio has a hierarchy too — what's yours is the base you query |
| 17 | Where it pays | ✅ | ✅ | ✅ | *the slide everyone photographs* |
| 18 | Small models | 🟡 | 🔴 | 🔴 | Clio already runs S on its smallest model; vendor figures; recipe internals, not the room's benefit |
| 19 | Setup | ✅ | ✅ | 🟡 | "agent" in one phrase |
| 20 | Video | 🟡 | 🟡 | 🟡 | ≤ 60 s, real |
| 21 | Close | ✅ | ✅ | ✅ | repeat the Monday action next to the QR code |

**Laurent** — economic framing ✅ · simple over fashionable ✅ (new) · personal point of view 🟡→✅
(the 15 → 18 loop, once costed) · measured number 🟡 · trade-off 🟡 · clarity 🟡 · clean code 🟡 ·
**stated limit ❌ — still the blocker**. Walk up afterwards: **probably** — *yes* with a limit slide
and a costed trade-off.

## 3. The open question, answered unanimously

**The notebook runs *my recipe*** (all four). Otherwise the repo contradicts the talk (Yanis) and
slide 15 is a variant nobody saw (Laurent, Camille). Consequences:
- **14 opens on the outputs**: the strip with S greyed (*« voici ce que tourne le notebook »*), the
  named groups, the bill — code under 30 s, QR code. One sentence for Sophie: *« un dev le monte une
  fois, ensuite l'équipe lit les thèmes »*.
- **15 becomes « pourquoi ces choix »** — *« ce que vous venez de voir »* — not a reveal.
- **Yanis's proposal (affects plan Step 2)**: the notebook gets an optional *summarise* switch running
  a small model, and prints the cost of both runs → a **measured** number for 15 (what S would cost)
  and for 18 (what a small model changes).

## 4. New findings on v3

| # | Finding | Raised by | Proposed fix |
|---|---|---|---|
| T1 | **The trade-off on 15 is asserted, not costed** | Laurent, Yanis, Camille | Use Clio's split: *« Anthropic dépense 92 % de sa facture à résumer chaque conversation. Moi, non. Voilà ce que je perds »* — long, multi-topic texts; Clio's S also strips personal data. Plain sentence for Camille: *« je ne résume pas chaque avis — plus rapide, moins cher, moins bon sur les textes longs et confus »*. Measured by the notebook switch if built. |
| T2 | **Slide 18's argument is weak as written** — S was affordable for Anthropic in 2024 on Haiku; I dropped it for cost *at my volume* and latency | Yanis, Laurent, Sophie | *« S est la seule étape qui grossit avec le corpus — 92 % de la facture de Clio, même sur leur plus petit modèle. C'est là que chaque baisse de prix des petits modèles tombe en premier. »* Laurent: end on a **threshold** — *« je remets S quand il coûte moins de X »*. Sophie: say the benefit in business words — *« demain, on pourra résumer chaque avis pour presque rien »*. Vendor figures labelled or dropped. |
| T3 | **The crêpe batter** works — keep it ≤ 10 s | Laurent (Camille, Sophie like it) | One sentence, not a bit |
| T4 | **The Monday action is buried** under 2 min of future + teaser | Camille, Sophie | Slide 21 repeats it next to the QR code: *« le notebook, un sprint, vos 40 000 avis »* |
| T5 | **Abstract wording** | Yanis | On stage: *« la partie chère ne suit plus la taille du corpus »* (embeddings stay linear) |

## 5. Pending fixes — still needed, ranked by all four

| Fix | Camille | Yanis | Sophie | Laurent | Status |
|---|---|---|---|---|---|
| **F1** « Où ça s'arrête » (30 s, after 17) | 4 | 4 | 4 | **1 (blocker)** | **must** — unanimous since v1 |
| **F2** honest hook (4) | 2 | **1** | 9 | 2 | **must** — and merged with T1/T2: one argument from Clio's split, at 4, 15 and 18 |
| **F6** assumptions + *« 40 000 avis : X $ vs Y $ »* | **1** | 3 | 7 | 4 | **must** |
| **F4 / N5** verbs under the letters + one caption per strip | 3 | 9 | **1** | 7 | **must** |
| **F5** notebook opens on outputs | 5 | 8 | 2 | 6 | **must** — now part of §3 |
| N2 slide 18 from Clio's split | 8 | 2 | 8 | 3 | → T2 |
| F9 discovery pivot on 13 | 6 | 6 | 5 | 8 | should |
| N4 Urania, LangSmith → one line each | 7 | 7 | 6 | 9 | should — pays for F1 |
| N6 strip accuracy | 10 | 5 | 9 | 5 | should |
| F11 plain words (token, corpus, RAG, agent) | 9 | 10 | 3 | 10 | should |

**What F1 should hold** (merged): what it can miss — the rare complaint swallowed by big groups
(Clio's own admission); when clustering finds nothing (small or uniform corpus); the names are a
proposal — checked on a sample, stable across runs; what dropping S costs; the scale under which
you should just ask the LLM about every document; where the data goes (can run locally); one thing
tried that failed, on public material.

## 6. Decisions for Michael

1. **The notebook runs my recipe** — 14 opens on outputs, 15 becomes *pourquoi ces choix* (§3)?
2. **The summarise switch in the notebook** (small model, cost of both runs printed) — worth adding to
   Step 2? It gives the measured numbers for 15 and 18.
3. **One argument from Clio's cost split** at 4 (hook), 15 (trade-off) and 18 (et demain) — wording in
   T1, T2, F2?
4. **« Où ça s'arrête »** after 17, 30 s, paid by Urania + LangSmith as one line each (F1, N4)?
5. **Strips**: French verb under each letter + one caption (F4)?
6. **The curve**: assumptions + worked example; 13 pivots to discovery (F6, F9)?
7. **Close**: repeat the Monday action on 21 (T4)?
