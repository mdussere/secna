# References

Every source the talk relies on, with a public link. Paper PDFs are not committed (third-party);
download them from the links.

## The recipe, as published

| Who | What | Link |
|---|---|---|
| Anthropic (Tamkin et al., Dec 2024) | **Clio: Privacy-Preserving Insights into Real-World AI Use** — summarise each conversation, embed, cluster, name the clusters, build a hierarchy. Published cost: **$48.81 for 100,000 conversations**. | [arXiv:2412.13678](https://arxiv.org/abs/2412.13678) · [research page](https://www.anthropic.com/research/clio) |
| GitHub (30 Jul 2024) — *not cited in the talk (decided 2026-10-23)* | *How GitHub harnesses AI to transform customer feedback into action* — BERT embeddings → HDBSCAN (via BERTopic) → GPT-4 writes the summaries. **Five months before Clio**, and it does not mention it. | [github.blog](https://github.blog/engineering/how-github-harnesses-ai-to-transform-customer-feedback-into-action/) |
| Google Research (Liu et al., COLM 2025) | **Urania: Differentially Private Insights into AI Use** — the same shape with differential-privacy guarantees. Cites Clio as its non-private **baseline**, not as a pipeline it rebuilt. | [arXiv:2506.04681](https://arxiv.org/abs/2506.04681) |
| Kura (open source) | Describes itself as *"a simple reproduction of the CLIO paper"*. | [github.com/567-labs/kura](https://github.com/567-labs/kura) · [usekura.xyz](https://usekura.xyz/) |
| OpenClio (open source) | Two independent reimplementations. | [Phylliida/OpenClio](https://github.com/Phylliida/OpenClio) · [R0bk/openclio](https://github.com/R0bk/openclio) |
| Intercom — Topics Explorer (help centre, 2 Oct 2026; research post, 30 Mar 2026) | Each conversation summarised into up to three key questions by a lightweight LLM, embedded, clustered into subtopics (HDBSCAN), grouped into topics and named by an LLM; a daily pipeline assigns newly closed conversations to the closest cluster. The research post does not name the product feature: the link between the two pages is inferred from matching steps. | [help centre](https://www.intercom.com/help/en/articles/11390087-use-the-topics-explorer-to-see-what-s-driving-volume) · [fin.ai research](https://fin.ai/research/unsupervised-learning-meets-generative-ai-topic-modelling-for-real-world-dialogue/) |
| Petneházi & Aradi (2025) — *no longer on screen (replaced by Intercom, 2026-11-17)* | **HERCULES** — recursive embedding-based clustering with LLM naming, as an installable package. | [arXiv:2506.19992](https://arxiv.org/abs/2506.19992) · [pyhercules](https://github.com/bandeerun/pyhercules) |

## The counter-example

| Who | What | Link |
|---|---|---|
| LangChain — LangSmith Insights (Oct 2025) | Summarises **every trace** with an LLM, then a "thinking model" performs the clustering into categories and subcategories (embeddings never mentioned); the analysed sample is capped at **1,000 traces**. The public docs never mention Clio. | [docs](https://docs.langchain.com/langsmith/insights) · [launch post](https://www.langchain.com/blog/from-traces-to-insights-understanding-agent-behavior-at-scale) · [announcement](https://blog.langchain.com/insights-agent-multiturn-evals-langsmith/) |

## Deliberately *not* in the gallery

| Who | Why not |
|---|---|
| OpenAI — *How People Use ChatGPT* (NBER w34255, 2025) | Taxonomy / **classifier-first**: the paper contains no clustering and no embeddings. Not a SECNA pipeline. [NBER](https://www.nber.org/papers/w34255) · [post](https://openai.com/index/how-people-are-using-chatgpt/) |
| Microsoft — Semantic Telemetry | Classification of interactions at scale, not unsupervised clustering. [blog](https://www.microsoft.com/en-us/research/blog/semantic-telemetry-understanding-how-users-interact-with-ai-systems/) |

## The building blocks

| What | Link |
|---|---|
| BERTopic (Grootendorst, 2022) — embed → reduce → cluster → describe | [arXiv:2203.05794](https://arxiv.org/abs/2203.05794) |
| Top2Vec (Angelov, 2020) | [arXiv:2008.09470](https://arxiv.org/abs/2008.09470) |
| TopicGPT (Pham et al., NAACL 2024) — the opposite school: the LLM builds the topics | [arXiv:2311.01449](https://arxiv.org/abs/2311.01449) |
| TnT-LLM (Wan et al., KDD 2024) — LLM-built taxonomies at scale | [arXiv:2403.12173](https://arxiv.org/abs/2403.12173) |
