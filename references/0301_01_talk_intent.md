# Talk intent — what this talk is for

> Plan Step 3.1. Written before any slide, from scratch: what the talk is for, for whom, and what
> people leave with. The deck structure (3.2) is derived from this file; when the two disagree, this
> file wins or gets amended first. Input, not answer: [`0104_01_talk_preparation.md`](0104_01_talk_preparation.md),
> [`0104_02_abstract_fr.md`](0104_02_abstract_fr.md).
> Generative AI Bordeaux · Thursday 19 November 2026 · French · 15–30 min (slot to confirm).

---

## 1. Why this talk exists — in one paragraph

Most people in the room have a pile of text they never read: reviews, tickets, feedback, messages.
When they think "LLM", they picture the model reading every document — and they stop at the bill.
The talk changes the question they walk in with. Not *"what would I do with unlimited tokens?"* but
*"how do I process a corpus that keeps growing, on the budget I have?"* — and it answers it with a
recipe that is public, that several large teams reached independently, and that fits in a notebook
they can run the same evening.

## 2. Who is in the room

- **~60–110 people, 18:30, after work**, several talks in the evening. Attention is a budget too.
- **Half product / business, half developers.** Neither half should feel the talk was for the other.
- **They know LLMs, not clustering.** They have heard of RAG and agents; very few know Clio, nobody
  needs to know UMAP or HDBSCAN.
- **A local community, not a conference.** They come to take something home and to meet people —
  the talk should give them a reason to come and talk to the speaker afterwards.

## 3. What they leave with

| Who | Leaves with | Test |
|---|---|---|
| **Everyone** | The promise: *« Comprendre tout un corpus sans le lire en entier. »* — and the means: *« La data science trouve la structure, le LLM lui donne du sens. »* | Can repeat both over lunch the next day. |
| **Product / business** | **The calculation**: the bill follows the number of *groups*, not the number of documents — with an order of magnitude they can quote (Clio: $48.81 for 100,000 conversations; the illustrative cost curve). | Can say why reading 1 million reviews is no longer a budget question. |
| **Developers** | **The instructions**: five steps they can rebuild from memory (S · E · C · N · A), and a repo that runs. | Can scan the QR code, clone, run, and adapt it to their own corpus. |
| **Everyone, on the way out** | The feeling that this is **within reach** — not a lab technique, not a vendor product. | Asks "would this work on my tickets?" in the Q&A or at the bar. |

## 4. The promises already made

The abstract has been sent; the talk must keep each of its promises.

1. Anthropic's Clio (2024) as the opening story — *a million conversations, read without reading them*.
2. The same recipe found elsewhere — Google, open source — and at GitHub **five months before Clio**:
   nobody coordinated.
3. The principle in one sentence (§3 — the abstract's wording, *« le LLM se contente de la nommer »*,
   is superseded on stage by *« lui donne du sens »*), and the consequence: the bill no longer
   follows corpus size.
4. The recipe step by step, then **run end to end in a notebook under 200 lines, on a public corpus**,
   code online.
5. The close on the corpora everyone accumulates: **customer reviews, support tickets, marketplace
   seller messages**.
6. *« Les PM repartiront avec le calcul, les devs avec le mode d'emploi. »*
7. To the organisers only: **sound is needed at the end** (the closing video), and the talk opens on
   a possible sequel.

## 5. The story the talk tells

1. **The hook — a slightly conspiratorial wink.** The big AI labs sell tokens; to read *their own*
   logs, they use a recipe that spends almost none. Said in its honest form: the recipe is
   **published**, just **barely publicised**, and almost never applied to ordinary business text.
2. **The proof it is real** — Clio, then the convergence (GitHub before Clio, Google, open source).
3. **The recipe** — SECNA, coined for the talk and said so. Data science (embeddings, clustering)
   finds the structure; the LLM gives it meaning. E and C are nearly free; S and N cost tokens; skip
   S when you can.
4. **The calculation** — the cost curve, the thesis made visible. Reused once to answer *"isn't this
   only for the giants?"*.
5. **You can do it at home** — the notebook, the repo, the QR code. The heart of the talk.
6. **Where it pays** — the corpora in the room's own companies. One sentence on why it is not RAG:
   *RAG only finds what you already know to look for; here, the themes emerge.*
7. **The cliffhanger** — *"and if you put an agent on top?"* — a short video, no explanation,
   *« ce sera pour la prochaine fois »*.

The argument closes at 6. Step 7 is an encore, not a conclusion.

## 6. Tone

- **A practitioner showing a trick**, not a researcher presenting a paper, not a vendor pitching.
- **Technical substance, everyday vocabulary**: *"we group texts by similarity"*, never an algorithm
  name or a parameter on a slide. Algorithms are for the Q&A.
- **The LLM is central, used sparingly** — never "just" a labeller. Data science does the heavy
  lifting cheaply so that the LLM spends its tokens where meaning is made. Avoid "statistics" for the
  embedding side: an embedding model is a language model too, a small and cheap one.
- **Numbers over adjectives**: every cost claim is a figure, sourced or measured.
- **Honest about the field**: convergence, not lineage; no *"they all copied Clio"*; no *"it's secret"*.

## 7. What this talk is not

- Not a clustering tutorial — the climax is **economic**, reached through a technical demo.
- Not a tool or product launch — a notebook and a deck, nothing to install beyond the notebook.
- Not a talk about RAG, agents or a framework — those appear in one sentence and one video.
- Not about any company's internal data or use case — public sources and a public corpus only. The
  question *"what do you do with it at work?"* gets a public-technique answer.

## 8. How we will know it worked

- **On the evening**: Q&A questions are about applying it to *their* corpus, not about what clustering is.
- **The week after**: the repo is cloned / starred; someone reports running it on their own data.
- **The organisers** ask for the sequel.

## 9. Lessons carried over from the dropped first draft

- The **speaker's name and the event** on the cover; the punchline of the title the largest text on it.
- **SECNA written on a slide** — a coined acronym nobody sees is not coined.
- **The notebook gets real slide presence** (it is the longest beat) and the **QR code is on screen
  long enough to scan**.
- **The setup and the punchline never print at the same time** — the cliffhanger is revealed, not read.
- **Every figure checked against its source** — the first draft overstated Clio's cost by 10×.

## 10. Open — to settle before the structure (3.2)

1. **Slot length** (15 / 20 / 30 min) — sets how much of the gallery survives. Default: build for
   20 min, with a 15-min cut marked.
2. **Live notebook or walkthrough?** Recommendation: **recorded or pre-run walkthrough** (screens of
   the real outputs) with the live repo in the QR code — no Wi-Fi or API risk at 18:30.
3. **The closing video**: what the agent does on screen, on the same public corpus, 60–90 s, no
   branding, no narration needed.
4. **The hook's wording** — how far the "conspiratorial" wink goes before it becomes unfair to the labs.
5. **Hierarchy and weak signals.** Going from the coarsest grain to the finest is central to the
   recipe (Clio: a *"multi-level hierarchy"*, *"zoom in and out"*) — should SECNA's A read
   *aggregate into a hierarchy*? And Clio itself states it *"is not useful for identifying rare …
   patterns"*: claiming "without losing weak signals" on stage requires the notebook to show it on
   the public corpus — otherwise the talk does not make that claim.
