# Fresh multi-persona review — structure B v2

> Plan Step 3.2. Four **new** sub-agents, one per persona
> ([`0302_02_audience_personas.md`](0302_02_audience_personas.md)), **no history**: each read only
> its persona, the structure [`0302_06_talk_structure_letters.md`](0302_06_talk_structure_letters.md)
> (§1–3, §5) and the public abstract. Slide 17 (notebook) and the illustrative curve (15) were
> declared as deliberate. Nothing applied — §5 is for Michael.

---

## 1. Verdict

| Persona | Comes? Leaves happy? | Walk-away line |
|---|---|---|
| **Camille** (PM) | Yes — **~70 % happy** | *"92 % of their bill is the per-message step, and you can skip it. There's a notebook — can someone run it on our 'Autre' tickets?"* Misses: a figure at her scale — *the abstract promised "le calcul"*. |
| **Yanis** (dev) | Yes — happy **only if 17 shows real code with its own bill** | Slide 8 is *"the best slide in the talk"*. Will ask *"isn't this BERTopic?"* — nothing answers it. |
| **Sophie** (business) | Yes, thanks to the abstract's *avis clients, tickets* — **mostly happy** | Relaxes at 16 (*"even at my size"*); 20 makes her *trust the speaker*. Misses: can my team do it without a developer? does the data leave the company? |
| **Laurent** (CTO) | **"Mostly senior"** — walk up: **probably** | *"A very good explainer of someone else's work. Slide 17 decides whether he becomes an engineer who measured."* |

**What works for everyone**: the bill read letter by letter — slide **8** ($45 of $48.81, 92 %) is
Camille's photo and Yanis's best slide; 11 (*one call per group*), 12 (zoom), 18 (the trade-off —
*"real judgement"*), 20 (honest limits).

## 2. Scores (✅ lands · 🟡 with the speaker's help · 🔴 loses them)

| # | Slide | Camille | Yanis | Sophie | Main issue |
|---|---|---|---|---|---|
| 1 | Cover | ✅ | ✅ | 🟡 | "tokens" |
| 2 | Real question | ✅ | ✅ | ✅ | — |
| 3 | Piles | ✅ | ✅ | ✅ | — |
| 4 | Hook | ✅ | 🟡 | 🟡 | *« plus petit modèle de l'époque »*; model sizes unknown to Sophie |
| 5 | Clio | ✅ | ✅ | 🟡 | "is $48.81 cheap?" |
| 6 | Promise | ✅ | ✅ | ✅ | — |
| 7 | SECNA in one line | 🟡 | ✅ | 🟡 | say *« pas mon invention »* here (Laurent: coining can look like flag-planting) |
| 8 | S | ✅ | ✅ | 🟡 | **best slide**; *« pour la confidentialité et pour choisir l'angle d'analyse »* |
| 9 | E (sphere) | 🟡 | 🟡 | 🔴 | the picture must do all the work; *« quelques centimes, ou local »* |
| 10 | C | ✅ | 🟡 | ✅ | outliers missing; "number of groups is a choice" depends on the method |
| 11 | N | ✅ | ✅ | ✅ | — |
| 12 | A | ✅ | 🟡 | ✅ | Clio's hierarchy uses a little LLM ($0.06) — say so |
| 13 | The sentence | ✅ | 🟡 | 🟡 | in Clio the LLM *does* read every document (slide 8) — reword or move after 18 |
| 14 | Les autres | 🟡 | 🔴 | 🔴 | jargon (BERT, GPT-4, traces); LangSmith has no letter to light; Urania isn't "pareil"; BERTopic missing |
| 15 | Curve | 🟡 | 🟡 | 🟡 | write *illustratif* on it; "trust me?" without a figure |
| 16 | Only for giants? | 🟡 | ✅ | ✅ | still no figure at Camille's scale |
| 17 | Notebook | 🟡 | 🔴 until decided | 🔴 | **decisive** — output, not code; a measured point |
| 18 | My recipe | ✅ | ✅ | 🟡 | "base", "context elements" → *« un tableau filtrable par produit, par mois »* |
| 19 | Where it pays | ✅ | ✅ | ✅ | RAG unexplained |
| 20 | Limits | ✅ | ✅ | ✅ | Laurent: 5 items in 45 s — needs ~1:15 with validation |
| 21 | Small models | 🟡 | 🟡 | 🟡 | *« … qui grossit **linéairement** »*; X still blank |
| 22 | Setup | 🟡 | 🟡 | 🟡 | teaser |
| 23 | Video | 🟡 | 🟡 | ✅ | Yanis: cut it; Laurent: hype reflex |
| 24 | Close | ✅ | ✅ | 🟡 | the Monday action must be concrete — and one for business people |

## 3. Findings, ranked by how many raised them

| # | Finding | Raised by | Proposed fix |
|---|---|---|---|
| R1 | **Slide 17 is the decisive slide** — output, not code; one measured point | **all four** | Real reviews in → named groups with counts out (in French), one surprise theme, one group that came out wrong; one cell printing documents, tokens, $, seconds; code behind the QR code. Laurent/Yanis: place that one measured point on the illustrative curve. |
| R2 | **Slide 14 doesn't work** | Yanis 🔴, Sophie 🔴, Camille 🟡 | No component names on screen (*« GitHub, Google, LangChain : même recette, une lettre change »*); LangSmith: *« ≤ 1 000 traces, méthode non publiée »*, no letter lit; Urania: *« ajoute des garanties de confidentialité »*; one line on BERTopic (2022) as the shared open-source ancestor → answers *"isn't this BERTopic?"* — *to discuss with Michael* |
| R3 | **The ending (22–23)** pushes the Monday action aside; an agent right after "simple beats fashionable" | Laurent, Yanis, Camille (Sophie likes the break) | Shorten or drop the video; the teaser as one sentence on the close; time to the limits slide |
| R4 | **The limits slide (20)** is right but overloaded | Laurent, Camille | ~1:15: how the groups were validated (sample read by a human), re-run cadence and stability, what production takes |
| R5 | **Abstract overclaims** — *« la seule… »*, *« personne ne s'est concerté »*, *« le calcul »*, *« la facture ne suit plus… »* | Laurent, Yanis, Camille | Not changeable if published — then the talk avoids repeating them; *le calcul* must be delivered somewhere (R6) |
| R6 | **"Le calcul" at the room's scale** | Camille | One line on 16, Clio's price applied (not measured): *« 40 000 avis ≈ 20 $ à la Clio, quelques $ en ne nommant que les groupes »* — Michael declined a 40k figure on the curve; this is arithmetic on the "only for giants?" slide |
| R7 | **A Monday action for everyone** | Sophie, Camille | 24: *« Prenez votre catégorie "Autre", ce repo, un dev, une demi-journée »*; one line on GDPR (can run locally; only a few examples per group go to the LLM) |
| R8 | **Accuracy** | Yanis | 4 *de l'époque*; 8 *+ choisir l'angle d'analyse*; 9 *quelques centimes, ou local*; 10 outliers (*« certains documents ne vont nulle part — c'est là que dorment les cas rares »*, links to 20); 12 *un peu de LLM, $0.06*; 13 reword or move after 18; 15 *illustratif* written on the slide; 21 *linéairement* |
| R9 | **Jargon for Sophie** | Sophie | 9 *« chaque commentaire devient un point ; les commentaires proches sont proches »* — no "embedding" on screen?; 14 component names out; 18 *« un tableau filtrable »* |
| R10 | **Say « pas mon invention » at slide 7**, not only at 18 | Laurent | One phrase when coining SECNA |

## 4. Q&A to prepare (new or still open)

| Question | From | Strong answer |
|---|---|---|
| Isn't this BERTopic? | Yanis | same E + C (BERTopic, 2022, used by GitHub); plus LLM naming, the hierarchy, the cost framing |
| How did you validate the groups? | Laurent (first question) | a sample read by a human, a rough agreement rate, what changed after reading |
| What did you try that failed? | Laurent | one concrete case and what you did |
| Outliers? choice of the number of groups? | Yanis | what the notebook does |
| Does it work in French? | Camille | the multilingual embedding model used |
| Can my team do it without a developer? GDPR? | Sophie | a dev sets it up once; can run locally; only a few examples per group go to the LLM |
| Weekly, growing corpus, stable names? | Laurent, Camille | assign new documents vs re-cluster; keep names stable; detect new themes |
| Why not a fixed list of categories? | Yanis, Laurent | it only finds what you expected — and when a fixed list *is* better |

## 5. Decisions for Michael

1. **Slide 14** (R2) — the discussion you wanted to have: what stays on it, and BERTopic as the ancestor?
2. **Slide 17** (R1) — output first and **one measured point** from the notebook (not a measured curve)?
3. **The ending** (R3) — keep the 30-s video, or teaser as one sentence and the time to slide 20 (R4)?
4. **"Le calcul"** (R6) — one line of arithmetic from Clio's price on slide 16, or leave the abstract's promise to the curve?
5. **Accuracy and jargon** (R8, R9, R10) — apply as a batch?
6. **Monday action** (R7) — one for devs, one for business, + a GDPR line?
