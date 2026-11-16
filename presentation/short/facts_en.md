# SECNA — fact sheet

Facts only, for anyone making a support about SECNA. No story, no order, no wording to reuse: the
sections are alphabetical. Every figure comes from the sources at the end or is marked as an order
of magnitude.

## Anthropic Clio (December 2024)

- Paper: Tamkin et al., *Clio: Privacy-Preserving Insights into Real-World AI Use*, Anthropic,
  December 2024 (arXiv:2412.13678).
- Purpose: understand how people use an AI assistant across millions of conversations, without
  anyone reading the conversations.
- Published cost of an example run on 100,000 conversations: **$48.81** in total (≈ $500 for a
  million).
  - summarising every conversation with a small model: **$45.00 — 92 % of the bill**;
  - naming the clusters with a larger model: **$3.75**;
  - the hierarchy: $0.06;
  - embedding and clustering: almost nothing.
- Result: a hierarchy of themes with counts, browsable from broad to narrow (example given: writing
  → content writing → SEO content).
- Known limit, stated in the paper: rare patterns can be missed.

## Corpus sizes vs context windows (orders of magnitude)

- One million customer reviews of ~100 tokens each ≈ **100 million tokens**.
- The largest models' context windows grew from a few thousand tokens (2023) to about **one
  million** (2025–2026). A large corpus stays orders of magnitude bigger.
- A token is roughly a piece of a word; it is the unit you pay for.

## Google Urania (2025)

- Liu et al., *Urania: Differentially Private Insights into AI Use*, Google Research, COLM 2025
  (arXiv:2506.04681).
- The same shape of pipeline with differential privacy; it benchmarks against a method inspired by
  Clio.

## LangSmith Insights (LangChain)

- Public documentation: a summary of every trace, the grouping done by an LLM, categories and
  sub-categories.
- The sample is capped at **1,000 traces**.

## Open-source reproductions

- Kura: an open-source reproduction of the Clio recipe.

## SECNA — the recipe

- **SECNA** is a name coined for this talk (the field has no single name: topic modelling, concept
  induction, insight mining…). The recipe itself is Clio's and others'.
- Five steps:
  - **S — Summarise**: an LLM reads every document and keeps what matters. One call per document —
    the expensive step; optional when texts are short.
  - **E — Embed**: a small model turns each text into a point; texts with the same meaning land
    close together. Cheap; can run locally.
  - **C — Cluster**: close points form clusters. No LLM, pure computation.
  - **N — Name**: an LLM reads a few examples of each cluster and names it. One call per cluster,
    not per document.
  - **A — Aggregate**: clusters are counted and gathered into a few themes.
- Consequence: the LLM bill follows the number of clusters, not the number of documents.
- Several teams reached the same recipe independently (convergence, not one copying another).

## The speaker's own run (public data, October 2026)

- Corpus: every merge request created over three months (23 July – 23 October 2026) in seven public
  GitLab repositories: **24,396 merge requests**.
- Steps as run: S without an LLM (title, repository, labels, description), E with
  `text-embedding-3-large`, C into **100 clusters**, N with a small model (one call per cluster), A
  into **7 themes**.
- Cost of a run: **≈ $3.35** in total, 95 % of it the embeddings; the LLM steps ≈ $0.20.
- The seven themes and their share of the merge requests:
  - engineering quality and operational upkeep 25 %;
  - scaling and hardening engineering systems 19 %;
  - AI agents and Duo workflows 16 %;
  - new products (Artifact Registry, Orbit) 12 %;
  - product capabilities and customer workflows 11 %;
  - security, compliance and access 9 %;
  - frontend modernisation and UX 8 %.
- Things the run surfaced that no list of themes shows:
  - merge requests signed by a third-party coding agent grew 121 → 505 → 1,291 per month, while those
    made with GitLab's own agent stayed flat (~500 a month) — signature-based count;
  - GitLab's *Fix Pipeline* agent opened 219 merge requests; 14 were merged;
  - agent usage is moving to per-session credits;
  - an agent rewrites the coding rules that other agents follow, and people turn faulty agent
    sessions into new instructions.
- The notebook is public: `github.com/mdussere/secna`.

## The talk

- Title (French): *« Vos corpus grossissent. Pas votre budget de tokens. »* — in English: *Your
  corpora grow. Your token budget doesn't.*
- Meetup: Generative AI Bordeaux, 19 November 2026; an audience of product managers and developers
  who know LLMs, not clustering.
- The speaker's thesis: understand a whole corpus without reading all of it; data science finds the
  structure, the LLM gives it meaning.

## Do not say

- Do not cite GitHub or OpenAI among the teams doing SECNA (the repo address is fine).
- Do not say everyone copied Clio, and do not say the technique is secret (it is published, just
  little known).
- No employer name, no speaker identification line.

## Sources

- Tamkin et al., Clio, Anthropic, Dec 2024 — arXiv:2412.13678 (cost: table 3).
- Liu et al., Urania, Google Research, COLM 2025 — arXiv:2506.04681.
- LangSmith Insights — public documentation, docs.langchain.com/langsmith/insights.
- The speaker's run: `worklines/secna_notebook/docs/0404_01_gitlab_findings.md` in the repo.
