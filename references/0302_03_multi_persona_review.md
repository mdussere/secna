# Multi-persona review — the abstract and the structure

> Plan Step 3.2. Four independent reviews (one sub-agent per persona of
> [`0302_02_audience_personas.md`](0302_02_audience_personas.md)) of the public abstract
> [`0104_02_abstract_fr.md`](0104_02_abstract_fr.md) and the 18-slide structure
> [`0302_01_talk_structure.md`](0302_01_talk_structure.md), merged here. One claim was checked against
> the source (§2). Nothing has been applied yet — §5 lists the proposed changes to agree on.

---

## 1. Verdict in one paragraph

The spine holds: all four would come or stay, and the same slides land for everyone — the real
question (2), the piles (3), the promise (6), *data science / LLM* (9), the callback (15). What fails
is consistent across reviewers: **the hook contradicts the recipe** (slide 4 vs 11), **no limit is
ever stated**, **the letters are jargon** (8, 11), **the notebook risks being code on screen** (14),
**the curve has no assumptions or worked number** (12), and **the ending spends 2+ minutes on a
teaser** (16–18). The abstract has two overclaims a developer will raise in the Q&A.

## 2. The fact that settles the main contradiction

Clio's own cost table (Table 3, arXiv:2412.13678), for 100,000 conversations:

| Step | Model | Cost |
|---|---|---|
| Facet extraction — one call **per conversation** (= S) | Claude 3 Haiku (small) | **$45.00** |
| Cluster labelling — one call **per group** (= N) | Claude 3.5 Sonnet (large) | $3.75 |
| Hierarchy generation | Claude 3.5 Sonnet | $0.06 |
| **Total** | | **$48.81** |

→ **S is 92 % of Clio's bill**; naming the groups with the *bigger* model costs 8 %. This one table
fixes slide 4 (the labs *do* spend per document — with a small model), proves slide 11 with a
sourced number, and gives Laurent and Camille the measured figure they asked for before the
notebook exists.

## 3. Scores per slide (✅ lands · 🟡 with the speaker's help · 🔴 loses them)

| # | Slide | Camille PM | Yanis dev | Sophie biz | Main issue |
|---|---|---|---|---|---|
| 1 | Cover | ✅ | ✅ | 🟡 | "tokens" undefined for Sophie |
| 2 | The real question | ✅ | ✅ | 🔴 | "tokens", "corpus" undefined |
| 3 | The piles | ✅ | ✅ | ✅ | — (but cut at 15 min: wrong cut) |
| 4 | The hook | 🟡 | 🔴 | 🟡 | contradicts Clio's per-document S; no number |
| 5 | Clio | ✅ | ✅ | 🟡 | keep $48.81 / 100k, don't round to a million |
| 6 | The promise | ✅ | 🟡 | ✅ | "tout un corpus" vs Clio missing rare patterns |
| 7 | Nobody coordinated | 🟡 | 🟡 | 🔴 | true for GitHub/Clio only; Kura reproduces, Urania baselines; 2 min of history |
| 8 | SECNA | 🟡 | ✅ | 🔴 | English letters need everyday French glosses |
| 9 | Who does what | ✅ | ✅ | ✅ | — |
| 10 | Coarse to fine | 🟡 | 🟡 | 🟡 | Clio's example, not a business one; say how it's built |
| 11 | Skip S | 🔴 | 🟡 | 🔴 | a letter as title; shown as a free win, no trade-off |
| 12 | Cost curve | ✅ | 🟡 | 🟡 | needs model, price, number of groups, a worked example |
| 13 | Only for giants? | ✅ | 🔴 | ✅ | small corpora are cheap either way → the win is discovery |
| 14 | The notebook | 🔴/🟡 | ✅ | 🔴 | lead with outputs (named groups), code briefly |
| 15 | Where it pays | ✅ | ✅ | ✅ | "RAG" needs plain words |
| 16 | The setup | 🟡 | ✅ | 🟡 | — |
| 17 | The video | 🟡 | 🟡 | 🟡 | teaser, nothing to take home |
| 18 | Close | ✅ | ✅ | ✅ | — |

**Laurent (CTO, the talk as a whole)** — seniority signals: economic framing ✅ · clarity for a mixed
room ✅ · simple over fashionable 🟡 (the talk ends on the fashionable agent) · measured number 🟡 ·
deliberate trade-off 🟡 · clean public code 🟡 (judged on the README) · **stated limit ❌**. Would
"probably" walk up; "yes for sure" if a limit is stated unprompted and one failed attempt is shown.

**Balance rule**: Part 3 (*La recette*) has a single ✅ for Sophie (slide 9) — it barely holds.

## 4. Findings, ranked by how many reviewers raised them

| # | Finding | Raised by | Proposed fix |
|---|---|---|---|
| F1 | **No stated limit** of the method | Laurent, Yanis, Sophie (Q&A) | New slide **« Où ça s'arrête »** after the curve, never cut: Clio's own *"not useful for identifying rare … patterns"*; group names are an LLM's proposal, read by a human before going upstairs; groups move between runs. Scope line: *« pour savoir ce que dit l'essentiel du corpus, pour quelques dollars »*. |
| F2 | **Hook contradicts the recipe** (slide 4) | Yanis 🔴, Laurent, Camille | Use §2: *« Même Anthropic résume chaque conversation — avec son plus petit modèle. Le grand modèle ne lit que les groupes. »* Drop the conspiracy wink (also intent open point 4). |
| F3 | **« Skip S » is jargon and a free lunch** (slide 11) | all three audience + Laurent | Retitle *« Ne résumez pas chaque document »*; show the 92 % from §2; state the trade-off: keep it for long, messy texts (why Clio pays for it). Keep it in the 15-min cut. |
| F4 | **The letters need French glosses** (slide 8) | Sophie, Camille | Each letter = one everyday verb phrase: *résumer · transformer en vecteurs (rapprocher les textes qui se ressemblent) · regrouper · nommer · compter et empiler*. |
| F5 | **Notebook = code on screen** (slide 14) | Sophie, Camille (Yanis wants real imports) | Open on the **outputs**: named groups, sizes, one example text; then ≤ 30 s of real code; one line on effort (*« une personne, un après-midi »* if true). |
| F6 | **The curve has no assumptions or worked number** (slide 12) | Yanis, Laurent, Camille | Assumptions line (models, €/M tokens, corpus size, number of groups, date) + one worked example a PM can quote: *« 40 000 avis : X $ vs Y $ »*. |
| F7 | **The ending is a long teaser** (16–18) | Laurent, Camille, Yanis | Video ≤ 60 s; give the time to F1. Keep *« ce sera pour la prochaine fois »*. |
| F8 | **"Nobody coordinated" is too broad** (slide 7) | Yanis, Laurent | Claim it for GitHub vs Clio only; Kura = *a reproduction*, Urania = *a private version built against Clio*; name BERTopic as the shared building block (Q&A or one line). Drop the LangSmith line to the Q&A. Trim to ~1:15. |
| F9 | **Small corpora are cheap either way** (slide 13) | Yanis (🔴) | Say it: *« à votre échelle, même l'approche naïve coûte peu — l'intérêt, c'est de voir les thèmes que vous ne saviez pas chercher »*. Turns an objection into the discovery argument. |
| F10 | **The 15-min cut removes what PMs and business liked** (3, 13) | Camille, Sophie | Cut from slide 7 and the video instead; keep 3, 11, 13. |
| F11 | **Undefined words**: token, corpus, RAG, notebook | Sophie | Define *token* once on slide 2 (*« un token ≈ un morceau de mot, c'est ce qu'on paie »*); show *corpus* as the pile of slide 3; RAG on 15 in plain words (*« la recherche dans vos documents »*). |
| F12 | **Hierarchy shown on Clio's example only** (slide 10) | Camille, Yanis | Use the notebook's own hierarchy once it exists; say in words how levels are built. |

## 5. The abstract

Already sent; reviewers read it as published on the meetup page.

| Sentence | Problem | Survives as |
|---|---|---|
| *« c'est la seule qui passe à l'échelle sans faire exploser la facture »* | "the only one" is false (classifier-first pipelines scale too — OpenAI, Microsoft, TnT-LLM are in our own BIBLIO) | *« la plus simple qui passe à l'échelle »* |
| *« la facture ne suit plus la taille du corpus »* | only true once S is skipped; embeddings stay linear (cheap) | *« la facture LLM suit le nombre de groupes, pas le nombre de documents »* |
| *« les statistiques trouvent la structure, le LLM se contente de la nommer »* | superseded by our own decision (3.1) | *« la data science trouve la structure, le LLM lui donne du sens »* |
| *« Les PM repartiront avec le calcul, les devs avec le mode d'emploi »* | business people feel excluded (Sophie would come only if pushed) | add *« et les métiers, avec les cas d'usage »* — or leave it and make slide 15 do the job |

Options: send the organisers a corrected version if the page is not published yet; otherwise leave
it and make sure **the talk itself** does not repeat the overclaims (it is the talk Yanis will
challenge, not the page).

## 6. Q&A to prepare (merged, by persona)

| Question | From | Answered by the talk? | Strong answer |
|---|---|---|---|
| When does it fail? | Laurent, Yanis, Sophie | after F1 | rare patterns, very short/heterogeneous texts, unstable names — and what to do for each |
| How do you know the groups / names are right? | Laurent, Yanis, Camille | ❌ | a concrete check on the public corpus: read a sample per group; agreement with existing labels if any |
| Why not classify every document against a fixed list? | Yanis | ❌ | it only finds the categories you already have; SECNA finds the ones you don't — and is cheaper at scale |
| Isn't this BERTopic? | Yanis | ❌ | same E + C building block; plus LLM naming, the hierarchy, and the cost framing |
| Which embedder, which clustering, how many groups? | Yanis | ❌ (by design) | the notebook's choices, and why; the number of groups as a granularity choice |
| Outliers / documents that fit nowhere? | Yanis | ❌ | what the notebook does with them |
| Stable across re-runs? Monthly? What's new this month? | Camille, Yanis, Sophie | ❌ | re-cluster vs assign new documents to existing groups; keep names stable |
| Cost on *my* 40k reviews? | Camille | after F6 | the worked example |
| Does it work in French? | Camille | ❌ | multilingual embedding models; say what the notebook used |
| Can my team use it without a developer? | Sophie | ❌ | honest: a developer for the first afternoon, then a report anyone reads |
| Data / GDPR — does it leave the company? | Sophie | ❌ | can run with local models; the notebook uses a public corpus |
| Production, every week, growing corpus? | Laurent | ❌ | incremental embedding, assignment vs re-clustering, cost per run |
| How do you explain it to a CFO? | Laurent | ✅ (12) | *« la facture suit le nombre de thèmes, pas de documents : X $ par passage au lieu de Y »* |
| And at your company? | Laurent | — | short, public technique only (intent §7) |

## 7. What this means for the open points of the intent (§10)

- **Point 4 (hook wording)** — answered: drop the wink, use Clio's cost split (F2).
- **Point 5 (hierarchy, weak signals)** — answered in part: keep the hierarchy slide; **do not claim
  weak signals**; state Clio's rare-pattern limit as a limit (F1). If the notebook later shows rare
  groups surviving, that becomes a bonus, not a promise.
- **Point 3 (video)** — shorten to ≤ 60 s whatever it shows (F7).

## 8. Proposed structure v2 (to agree on before the slide content)

19 slides: slide 11 retitled, one new slide after 13, ending shortened.

| # | Slide | Change |
|---|---|---|
| 1–3 | Cover · real question · piles | define *token* on 2 (F11) |
| 4 | Hook | rewritten with Clio's cost split (F2) |
| 5–6 | Clio · promise | promise attributed to Clio, *« les grandes tendances »* (Yanis) |
| 7 | Convergence | narrower claim, ~1:15, LangSmith to the Q&A (F8) |
| 8–10 | SECNA · data science/LLM · coarse to fine | French glosses (F4); hierarchy from the notebook later (F12) |
| 11 | *Ne résumez pas chaque document* | 92 % + trade-off (F3) |
| 12–13 | Curve · *Réservé aux géants ?* | assumptions + worked example (F6); discovery pivot (F9) |
| **14** | **Où ça s'arrête** (new) | the limits (F1), never cut |
| 15 | Notebook | outputs first (F5) |
| 16 | Where it pays | RAG in plain words (F11) |
| 17–19 | Setup · video ≤ 60 s · close | shorter ending (F7) |

15-min cut: slide 7 to 45 s, video to 30 s or cut, slide 10 merged into 9 — keep 3, 11, 13, 14 (F10).
