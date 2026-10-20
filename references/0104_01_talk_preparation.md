# Talk preparation — the decisions behind the deck

> What was decided, what was rejected and why, what was verified and how, and what is still open —
> so the deck and the notebook can be built without re-arguing any of it. Prepared 2026-09-28,
> updated 2026-10-09. Companion files: [`0104_02_abstract_fr.md`](0104_02_abstract_fr.md) · [`BIBLIO.md`](BIBLIO.md) ·
> the deck [`../presentation/deck.md`](../presentation/deck.md).

---

## 1. The ask

The organisers of **Generative AI Bordeaux** asked for a talk and an abstract. The talk is given in
a **personal capacity**: the speaker is introduced with his affiliation, but the content is generic —
a published technique, its spread through the industry from **public sources**, and a demonstration
on a **public corpus** with the code on a personal GitHub.

---

## 2. The room

**Group**: [Generative AI Bordeaux](https://www.meetup.com/generative-ai-bordeaux/), the Bordeaux branch
of Generative AI Paris — ~970 members, working language **French**. Stated target, from the group
description: *"PMs, techs and business experts who use or want to use AI to reinvent their industry"*.
**Format**: in person at sponsor venues, **18:30 start**, **60–116 attendees**, **15–30 min per
speaker**, several speakers per evening, networking after.

### 2.1 What gets programmed there

| Event | Talks |
|---|---|
| **Meetup #4 @ Ynov** ([page](https://www.meetup.com/fr-FR/generative-ai-bordeaux/events/308326062/)) | **EBIOSE** — *"Darwin meets AI"* (evolutionary algorithms applied to agents; bio-inspired framing, implementation kept light) · **Cohere** — ecosystem view of models and agents · **Peaksys** — *"Vibecoding : miracle ou mirage ? Le verdict sans filtre"* (field report) |
| An earlier evening | A **product-side** talk on building GenAI features when the product gives no certainties — need capture, roadmap, no technical content. |

### 2.2 What that implies

- **The evening has a shape**: one conceptual-technical talk + one vendor + one field report. This
  talk fills the **conceptual-technical seat** — and is the engineering side of the question the
  product talk already covered, not a repeat of it.
- **Technical is allowed; technical vocabulary is not.** EBIOSE carried an unfamiliar idea on a
  memorable frame without implementation depth. That is the register to hit.
- **18:30, post-work, ~100 people.** Short, punchy, outcome-framed — like the room's own titles.
- **Half PM/business, half tech** → PMs leave with **the economics**, devs with **the recipe**.
- **LangChain is a recurring topic in this community** → the LangSmith portrait (§5) lands hard here.

---

## 3. The thesis, and the two candidates it beat

**Retained:**
> « La vraie question n'est pas : que ferais-je avec des tokens illimités ? C'est : comment traiter
> des corpus qui grossissent, avec le budget que j'ai ? »

**Rejected — "This is not RAG" as the climax.** It *corrects a misconception*; the budget question
*reframes the question the audience walked in with* — and people repeat stances, not corrections. It
also makes the climax **economic**, reached through a technical demo, so nobody leaves thinking they
watched a clustering tutorial. → "Not RAG" survives as **one sentence** in the use-case slide: RAG only
finds what you already know to look for.

**Rejected — pitching at product level.** The product angle has already been covered in this room;
this talk's differentiator is **a working thing with numbers**. The fix for "too technical" is
**vocabulary, not substance** (§7.3).

**Title**: *« Vos corpus grossissent. Pas votre budget de tokens. »* — about *them*, needs no prior
knowledge. Anthropic is the opening, not the billing. (*"Les héritiers de Clio"* rejected: nobody
knows Clio.)

---

## 4. The frame: S‑E‑C‑N‑A

**Summarise · Embed · Cluster · Name · Aggregate.**

| Letter | Step | Cost profile |
|---|---|---|
| **S** | an LLM summarises **each document** | ⚠️ the expensive letter — one call *per document*, linear in corpus size |
| **E** | embed the texts (or the summaries) | cheap |
| **C** | cluster the embeddings | nearly free, pure compute |
| **N** | an LLM names/describes **each cluster** | tokens, but scales with the **number of clusters** |
| **A** | aggregate — counts, hierarchy, crossing with metadata | free |

**The insight that carries the talk**: *E and C are nearly free; S and N cost tokens; do as little S
and N as you can.* Clio pays for S because conversations are long and messy; **GitHub skips S** — so
S is really **(S)ECNA**, and dropping it is most of the saving.

**Naming**: the acronym is **coined for this talk**, and the talk says so — the field has no canonical
name (*topic modeling*, *concept induction*, *insight mining*, *semantic telemetry*, *"the Clio
recipe"*). **Clio** is the searchable anchor; **SECNA** is what people remember.
**Decided**: SECNA (SNECMA dropped — no honest sixth letter).

---

## 5. The gallery — audited against SECNA, not against lineage

The question is not *"is Clio the mother of all these?"* but *"are they SECNA solutions?"*. Clio is
the name to remember for a set of **converging** solutions, not a paternity claim.

| | S per doc | E | C | N | A | Verdict |
|---|---|---|---|---|---|---|
| **Clio** — Anthropic, Dec 2024 | ✅ | ✅ | ✅ k-means | ✅ | ✅ hierarchy + counts | full SECNA — the reference |
| **Kura** — open source | ✅ | ✅ | ✅ recursive | ✅ | ✅ | full SECNA; *"a simple reproduction of the CLIO paper"* |
| **Urania** — Google, COLM 2025 | ⚠️ summarises clusters; per-document step not established | ✅ | ✅ DP clustering | ✅ | ✅ DP histograms | SECNA-shaped, with differential privacy |
| **GitHub** — 30 Jul 2024 | ❌ embeds raw feedback | ✅ BERT | ✅ HDBSCAN | ✅ GPT-4 | ✅ | **ECNA** — the cheap variant |
| **LangSmith Insights** — LangChain | — | — | — | ✅ | ✅ | the counter-example: sample capped at 1,000 traces |

### 5.1 Evidence — verified, do not re-litigate

- **GitHub is dated 30 July 2024 — five months before Clio** — and mentions neither Clio nor
  Anthropic. Method, from the post: BERTopic (*"BERT's ability to generate high-quality document
  embeddings with a clustering algorithm, typically HDBSCAN"*), then GPT-4 for readable summaries.
  → This killed the "Clio's heirs" framing and replaced it with **convergence**, which is *stronger*:
  nobody coordinated; they landed on the same recipe because it is the one that scales within a
  budget. GitHub is also the proof you need not be a GenAI lab.
- **Urania cites Clio as its baseline**: *"benchmarking against a non-private method inspired by CLIO
  (Tamkin et al., 2024)"*. → Say *"Google built a differentially-private version of the same idea"*,
  **not** *"Google rebuilt Clio"*.
- **Clio's published cost**: *"For our example run of 100,000 conversations, the cost of such a run is
  $48.81"* → ≈ $500 for a million. (An earlier draft said "a few tens of euros for a million" — 10×
  overclaim, corrected.)
- **Do NOT put OpenAI in the gallery.** Their ChatGPT-usage study (NBER w34255) is
  **classifier-first**: zero occurrences of "cluster", "embedding" or "k-means" in the paper.
- **LangSmith Insights**: the public docs never mention Clio, and the analysed sample is capped at
  **1,000 traces**. ⏳ The slide states only what the public documentation says; a stronger version
  depends on a source that is not yet citable.

### 5.2 Say / don't say

- ✅ *"Nobody coordinated this."* · *"GitHub was doing it before Anthropic named it."* · *"Google added
  differential privacy."*
- ❌ *"They all copied Clio."* · *"OpenAI does this too."* · *"Google rebuilt Clio."* · anything
  implying the technique is secret — it is published; the honest form is **barely publicised**, the
  big players run it **on their own logs**, and **almost nobody publishes about ordinary business data**.

---

## 6. Key messages, ranked for this room

1. **You can do this at home, in ~100–200 lines.** The spine.
2. **Data science finds the structure, the LLM gives it meaning.** The *why it's cheap* in one
   sentence — the LLM stays central, it is just used sparingly. *(Reworded 2026-10-20: "statistics"
   undersold the embedding model, a language model too; "only names it" undersold the LLM.)*
3. **Convergence, not lineage.** Independent actors, same recipe, forced by economics.
4. **The hook, in its honest form** — barely publicised; run on their own logs; rarely applied to
   ordinary business text.
5. **Put an agent on top and it gets better** — the cliffhanger, not a section.

**If only one sentence survives**: the promise *« Comprendre tout un corpus sans le lire en entier »*
(Clio's own claim), carried by the means *« La data science trouve la structure, le LLM lui donne du
sens »* — that's why it costs almost nothing and why you can build it this afternoon.

---

## 7. The running order (20-minute assumption)

| # | Beat | ~min | Must achieve |
|---|---|---|---|
| 1 | The question | 1 | Land the thesis before any content |
| 2 | Clio: what Anthropic published | 2 | The story (*a million conversations, no way to read them*), not the paper |
| 3 | Clio → **SECNA** | 2 | Coin the acronym; the naming-vacuum line |
| 4 | **The cost curve** | 3 | The thesis made visual |
| 5 | Convergence → the gallery | 3 | Credibility; one line per portrait |
| 6 | *Only for the giants?* | 1 | Answered **with the curve from beat 4**, reused |
| 7 | *Can I afford it?* → the notebook, the repo | 5 | The proof; the heart of the talk |
| 8 | *Can I benefit?* → use cases, then **the callback** | 2 | Applicability + close the argument |
| 9 | **Cliffhanger** — "and with an agent on top?" → 60–90 s video → *« ce sera pour la prochaine fois »* | 2 | Best last image + book the sequel |

At 15 minutes the gallery collapses to one slide read aloud in ~45 s. Beats 2–3 silently eat the
budget — they don't need the context they seem to need.

### 7.1 The cost curve (beat 4)

x = corpus size (documents); y = tokens or €. *LLM on every document* → a straight line off the top
of the slide. *LLM on the groups only* → nearly flat (clusters grow far more slowly than documents).
Annotate the crossover for a realistic corpus. Beat 6 brings it back with the giants' corpus far right
and the room's far left. **To do**: replace the illustrative curve with **measured** numbers from the
notebook.

### 7.2 The ending is a cliffhanger, not a summary

The argument closes at **beat 8** with the callback; the video is the **encore** — it explains nothing,
or it becomes beat 10. It is **not announced in the abstract** (it is the surprise).

### 7.3 Register rules

- Never say UMAP, HDBSCAN, BERTopic, or show a parameter — *"you group the texts by similarity"*.
  Algorithms belong in the Q&A.
- No benchmark tables, no metric names, no tier lists.
- **Slide test**: a PM can repeat it over lunch; a dev can rebuild the five steps from memory.
- **Beat 8 names real contexts** — marketplace seller messages, product reviews, support tickets,
  student feedback — corpora the companies in the room actually have.

---

## 8. Deferred — not forgotten

Corpus choice (Linux-kernel commits/PRs is the lead; another large public developer corpus otherwise)
· measured vs illustrative cost figures · live run vs walkthrough of the notebook · the closing video ·
tailoring to the other speakers of the evening.

## 9. Open questions for the organisers

1. **Slot length** — 15, 20 or 30 min (changes §7).
2. **Date and venue.** Date confirmed: **Thursday 19 November 2026**. Venue still open.
3. **Who else speaks** that evening.
4. **Slides in French?** (talk and abstract are.)
