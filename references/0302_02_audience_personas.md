# Audience personas — to evaluate the talk

> Plan Step 3.2. Four fictional personas, each characteristic of a part of the Generative AI Bordeaux
> room — three for the halves of the audience, one for the people who come to meetups to spot talent (stated audience: *"PMs, techs and business experts who use or want to use AI"*; ~60–110
> people, French, 18:30, after work). Used to review the structure (3.2 a), the slide content
> (3.2 b) and the rendered deck (3.6), slide by slide. Grounded in the room as described in
> [`0104_01_talk_preparation.md`](0104_01_talk_preparation.md) §2 and the intent
> [`0301_01_talk_intent.md`](0301_01_talk_intent.md) §2–3.

---

## Persona 1 — Camille, Product Manager

**Who.** PM in a Bordeaux scale-up (e-commerce or SaaS, 80–300 people), 6 years in product. Has shipped
one GenAI feature (a support assistant) and owns its budget line. Uses ChatGPT daily; has never
written a prompt template in code.

**Their pile.** 40,000 customer reviews a year and a support backlog with a "Autre" category that
holds 35 % of the tickets. Reads a sample of 50 every quarter and hopes it is representative.

**Knows / doesn't know.** Knows: LLMs, RAG as a word, tokens cost money, "agents" are the trend. Does
not know: embeddings, clustering, Clio.

**Came for.** Something to bring back on Monday — an idea that is cheap to try and easy to explain
upward.

**Disengages when.** Acronyms without a reason, code on screen for more than a minute, a slide that
needs a data-science background, a "trust me" number.

**Leaves happy if.** Can say to their CTO: *"there's a public recipe to read all our reviews for a few
dollars instead of a few thousand, the code is online, can someone try it on a sprint?"*

**Likely Q&A questions.**
- How much would it cost on *my* 40,000 reviews?
- How good are the group names — can I show them to my director as is?
- Does it work in French?
- How often do I re-run it — every month? Do the groups stay stable?

---

## Persona 2 — Yanis, AI / backend developer

**Who.** Backend developer turned "the GenAI person" at an agency or software company, 4 years of
experience. Built two RAG chatbots with LangChain, has looked at LangSmith, follows AI on X and
Hacker News. Will scan the QR code during the talk.

**Their pile.** Logs of their own chatbot: thousands of user conversations nobody analyses. Also the
commit history of a big monorepo.

**Knows / doesn't know.** Knows: embeddings (from RAG), vector databases, token pricing per model,
prompting. Has heard of clustering, never used HDBSCAN or BERTopic. Knows Clio's name vaguely.

**Came for.** A technique they can implement this week, and something they did not already know.

**Disengages when.** The talk stays at "AI is great" level, no real numbers, the demo is fake or the
code is not available, the speaker overclaims ("it finds everything").

**Leaves happy if.** Has the repo open on their phone, understands the five steps well enough to
rebuild them, and has one concrete trick (skip S; name the groups, not the documents).

**Likely Q&A questions.**
- Which embedding model, which clustering algorithm, how do you choose the number of groups?
- How do you handle outliers / documents that fit nowhere?
- Why not just ask the LLM to classify every document with a fixed list of categories?
- Isn't this BERTopic? What's new?
- How is LangSmith Insights different?

---

## Persona 3 — Sophie, business / operations lead

**Who.** Head of customer experience (or operations) in a regional company — retail, insurance,
tourism, wine trade — 15 years in the job, non-technical. Comes to the meetup to understand what AI
can concretely do for the team, and to meet people who can help.

**Their pile.** Verbatims from satisfaction surveys, call-centre notes, partner e-mails. Today: a
quarterly Excel tagged by hand by two people, always late.

**Knows / doesn't know.** Knows: what the business needs, how long manual tagging takes, ChatGPT as a
user. Does not know: tokens, embeddings, notebooks, how a cost curve is built.

**Came for.** Proof that "reading everything the customers say" is now realistic — and whether it
needs a data team.

**Disengages when.** Code, English jargon, anything that looks like "for developers only", a slide
whose point is not readable in five seconds.

**Leaves happy if.** Understands the promise (*understand everything without reading everything*),
sees their own corpus on the "where it pays" slide, and knows whom to talk to at the bar.

**Likely Q&A questions.**
- Can my team use it without a developer?
- What about customer data — does it leave the company? GDPR?
- Can it tell me what is *new* this month compared to last month?
- How reliable is it — what if it misses an important complaint?

---

## Persona 4 — Laurent, CTO who hires senior profiles

**Who.** CTO or VP Engineering of a Bordeaux tech company (200–800 people, several product teams),
20 years in software, built two data/AI teams. Hires senior and staff engineers, AI architects, tech
leads. Comes to meetups partly to keep up, mostly to **spot people** — a talk is a 20-minute live
interview nobody had to schedule.

**Their pile.** Not a corpus — a hiring problem: senior AI profiles are rare, CVs all say "GenAI",
and interviews rarely show how someone thinks under real constraints.

**Knows / doesn't know.** Knows: architecture, cost control, production trade-offs, what a hype talk
looks like. Knows the AI landscape at a strategic level; may not know the clustering details and
doesn't need to.

**Came for.** Signals of seniority: judgement, rigour, clarity, honesty about limits — and whether the
speaker is someone worth a coffee.

**Disengages when.** Hype or vendor tone, enthusiasm without numbers, no limits stated, a demo that
hides its weak spots, slides read aloud, a sloppy repo behind the QR code.

**Leaves happy if.** Has seen someone who framed a real problem in economic terms, chose a simple
solution over a fashionable one, measured it, said where it stops working, explained it to a mixed
room — and published clean code. Walks up after the talk or looks the speaker up the same evening.

**Likely Q&A questions.**
- When does this fail? What did you try that didn't work?
- How do you know the groups are right — how did you validate it?
- What would it take to run this in production, every week, on a growing corpus?
- How would you explain the trade-off to a CFO?

**Note.** Seniority is shown with **public** material only — the reasoning, the measured notebook,
the stated limits, the repo's quality. The talk never leans on internal work to prove experience.

---

## How to evaluate with them

### On the structure (3.2 a) — per persona
1. **Arc**: at which slide do they lose the thread, if any? Which slide would they talk about at the bar?
2. **Promise kept**: do they leave with what they came for (their "leaves happy if")?
3. **Missing**: what would they expect that is absent? What is there that they do not need?
4. **Q&A**: which of their questions does the talk answer already, which ones must be prepared?

### On each slide (3.2 b and 3.6) — a quick grid, one line per persona

| Check | Question |
|---|---|
| **Gets it** | Can they say the slide's point in one sentence, without the speaker? |
| **Cares** | Does it connect to their pile, their budget or their code? |
| **Five seconds** | Is the point readable in five seconds (impact slides) / thirty (content slides)? |
| **Trust** | Is every number sourced or measured? Would Yanis catch an overclaim? |
| **Vocabulary** | Any word Sophie wouldn't know that is not explained by the slide itself? |
| **Judgement** | Does the slide show a choice, a trade-off, a measurement or a limit — or only enthusiasm? |

Scoring: ✅ lands · 🟡 lands with the speaker's help · 🔴 loses them. A slide with a 🔴 for any persona
is reworked or justified (e.g. one dev-only detail is acceptable if it takes ten seconds).

### Balance rules
- **Every part** must have at least one ✅ for each persona — no part written for only one half of the room.
- **Yanis is the overclaim detector**: if Yanis would object to a sentence, the sentence changes.
- **Sophie is the vocabulary detector**: if Sophie needs a word explained, the slide explains it or drops it.
- **Camille is the take-away detector**: if Camille can't repeat the slide over lunch, it is not finished.
- **Laurent is the credibility detector**: across the talk, Laurent must see at least one stated limit, one
  measured number and one deliberate trade-off — and the repo behind the QR code must hold up to a
  five-minute look (README, one command, no dead ends).
- **Every part** must work for the three audience personas; Laurent judges the talk **as a whole**
  rather than slide by slide.
