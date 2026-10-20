# Multi-persona review — proposal A vs proposal B

> Plan Step 3.2. The four personas ([`0302_02_audience_personas.md`](0302_02_audience_personas.md)),
> one sub-agent each, compare **A** — v3, compare variants on a repeated strip
> ([`0302_01_talk_structure.md`](0302_01_talk_structure.md)) — and **B** — one slide per letter, each
> with its cost ([`0302_06_talk_structure_letters.md`](0302_06_talk_structure_letters.md)).
> Caveat: B already included most pending reviewer fixes; A did not (by Michael's choice). Nothing
> applied — §5 is for Michael.

---

## 1. Verdict: B, unanimously

| Persona | Pick | Why, in their words |
|---|---|---|
| **Camille** (PM) | **B** | *"In B the bill adds up on screen."* Slide 8 is her lunch sentence: *"92 % of Anthropic's bill is one step, and it's optional."* Retells B in one breath more easily than A. |
| **Yanis** (dev) | **B** | *"The 92 % isn't something the speaker asks me to take on trust — it's arithmetic I just did."* A's strips mostly showed empty boxes. |
| **Sophie** (business) | **B, clearly** | *"In A I watched the same five letters go past five times. In B each letter gets a verb, a picture and a price — I finally follow."* |
| **Laurent** (CTO) | **B** | *"In A the speaker shows other people's diagrams side by side. In B he reads a bill line by line — that is how a senior person thinks."* Walk up afterwards: **probably, close to yes**. |

**The shared risk**: slides 9, 10, 12 are three "free" badges in a row — *the tutorial stretch*
(Camille, Laurent, Sophie). And three things A had that B lost (§3).

## 2. Scores on B (✅ lands · 🟡 with the speaker's help · 🔴 loses them)

| # | Slide | Camille | Yanis | Sophie | Main issue |
|---|---|---|---|---|---|
| 1 | Cover | ✅ | ✅ | ✅ | — |
| 2 | Real question | ✅ | ✅ | 🟡 | *corpus* still undefined |
| 3 | Piles | ✅ | ✅ | ✅ | — |
| 4 | Hook | ✅ | 🟡 | 🟡 | 3.5 Sonnet isn't Anthropic's biggest → *« un plus gros »*; define small vs big model |
| 5 | Clio | ✅ | ✅ | ✅ | — |
| 6 | Promise | ✅ | 🟡 | ✅ | don't imply it finds everything |
| 7 | SECNA in one line | 🟡 | ✅ | 🟡 | decode the acronym (S = Summarise → résumer…) |
| 8 | S — Résumer | ✅ | 🟡 | ✅ | Clio does *facet extraction*; "optional" is conditional; say what dropping it costs |
| 9 | E — Rapprocher | 🟡 | 🟡 | 🟡 | least clear letter; "small language model" muddles embedding model vs LLM |
| 10 | C — Regrouper | 🟡 | ✅ | ✅ | thin on its own; second "free" in a row |
| 11 | N — Nommer | ✅ | ✅ | ✅ | *"one call per group, not per document — the trick"* |
| 12 | A — Compter et ranger | 🟡 | 🟡 | 🟡 | two ideas; badge is $0.06, not "free" |
| 13 | Les autres | 🟡 | 🟡 | 🔴 | literal components; convergence said with weight; business words |
| 14 | Cost curve | ✅ | ✅ | ✅ | — if X is measured |
| 15 | Only for giants? | ✅ | ✅ | ✅ | discovery pivot works for all |
| 16 | Notebook | 🟡 | ✅ | 🟡 | open on named groups; *who does what*; where the data goes |
| 17 | My recipe | 🟡 | ✅ | ✅ | trade-off finally costed; crêpe framing lost |
| 18 | Where it pays | ✅ | ✅ | 🟡 | RAG in plain words |
| 19 | Où ça s'arrête | ✅ | ✅ | ✅ | answers *"what if it misses a complaint?"*; Laurent: too short (30 s) |
| 20 | Small models | 🟡 | 🔴 | 🟡 | *"the only step that grows"* is false (E is linear too) |
| 21 | Setup | ✅ | ✅ | 🟡 | define *agent* |
| 22 | Video | 🟡 | 🟡 | ✅ | real run, ≤ 60 s |
| 23 | Close | ✅ | ✅ | ✅ | — |

**Laurent's signals for B** — economic framing ✅ · simple over fashionable ✅ · trade-off ✅ (17 → 20,
with a threshold) · clarity ✅ · personal point of view ✅ · measured number 🟡 (X still Clio's) ·
stated limit 🟡 (exists, but feels like a ticked box) · clean code 🟡.

## 3. What A did better — keep in B

| What | Raised by | Where in B |
|---|---|---|
| **« La data science trouve la structure, le LLM lui donne du sens »** — *"the sentence I'd repeat at the bar"* | Laurent, Camille, Yanis | 10-s impact slide after the letters |
| **Convergence as evidence** (*"not a toy — GitHub and Google do it"*), the spot-the-difference effect | Laurent, Camille, Yanis | slide 13: a mini-strip per player, the changed letter lit; *GitHub, five months before Clio* said with weight |
| **Coarse to fine as its own beat** — the business payoff of the hierarchy | Laurent, Camille, Yanis | the A slide becomes *the levels* (zoom in, zoom out); not merged in the 15-min cut |
| **The crêpe-batter framing** of my recipe | Camille | one sentence on 17 |

## 4. Changes to B, merged

| # | Change | Raised by |
|---|---|---|
| B1 | **Merge E + C** into one slide — *« Rapprocher, puis regrouper »*; the drawing does the work (texts → points → groups); "un petit modèle d'embedding, local", "no LLM" | Camille, Laurent (Sophie: E is the least clear) |
| B2 | **Honest badges, with a running total**: S $45 → E+C $0 → N $48.75 → A $48.81; C *« 0 $, mais le nombre de groupes est un choix que je vérifie sur un échantillon »*; A *« ≈ 0 ($0.06) — mais le relancer chaque semaine a un coût »*; the same figure at 40k reviews when measured | Laurent, Camille, Yanis |
| B3 | **S, literally**: *« S — Résumer (Clio : extraire quelques attributs, dont un résumé de la demande) »*; *« optionnel pour vous — GitHub s'en passe ; Clio en a besoin pour la confidentialité »*; one phrase on what dropping it costs | Yanis, Camille |
| B4 | **Slide 20**: *« la seule étape LLM qui grossit avec le corpus »*; the threshold; the benefit in business words (*« demain on résume chaque avis pour presque rien »*); vendor figures labelled | Yanis (🔴), Sophie |
| B5 | **Slide 4**: *« un plus gros »*, not *« le grand »*; slide 7 decodes the acronym and says *LLM = un modèle type ChatGPT ; petit = moins cher* | Yanis, Sophie |
| B6 | **Limits (19) to 45–60 s**: one failure seen, how the groups are validated, what production would take | Laurent |
| B7 | **Notebook (16)**: opens on the named groups and the bill; *« un dev le monte une fois, ensuite l'équipe lit les thèmes »*; where the data goes (can run locally) | Sophie, Camille |
| B8 | **Measured numbers**: X on 14, 17, 20 from the notebook's own run — the summarise switch (Step 2); repeat X on 23 (*« le notebook, vos 40 000 avis, X $, un après-midi »*) | Laurent, Camille |
| B9 | **Plain words still missing**: corpus, RAG, agent | Sophie |

## 5. Proposed B v2 (23 slides) — for Michael

| # | Slide |
|---|---|
| 1–4 | Cover · real question (token, corpus defined) · piles · hook (*un plus gros*) |
| 5–6 | Clio · promise |
| 7 | SECNA in one line — the acronym decoded, LLM / small model in one phrase |
| 8 | **S — Résumer** — $45 / 92 %, literal, optional *for you* |
| 9 | **E + C — Rapprocher, puis regrouper** — ≈ $0, a choice checked on a sample |
| 10 | **N — Nommer** — $3.75, one call per group |
| 11 | **A — Ranger en niveaux** — coarse to fine, zoom; $0.06 |
| 12 | *« La data science trouve la structure, le LLM lui donne du sens. »* (impact, 10 s) |
| 13 | Les autres — a mini-strip per player, the changed letter lit |
| 14–16 | Curve (recap, assumptions, 40k line) · only for giants? (discovery) · notebook (outputs first) |
| 17–19 | My recipe (crêpe, costed trade-off) · where it pays · où ça s'arrête (45–60 s) |
| 20–23 | Small models (only LLM step that grows; threshold) · setup · video · close (Monday action + X) |

Decisions:
1. **Adopt B as the structure** (A archived as the explored alternative)?
2. **Apply B1–B9** as B v2?
3. **Add the summarise switch to the notebook** (Step 2) — it is what turns X into measured numbers?
