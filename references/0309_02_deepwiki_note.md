# DeepWiki, in short (for the factory part of the talk)

> Note for the speaker, who asked what DeepWiki is (monologue 0308_03, § 11). Public sources, November 2026.

- **What:** a free documentation site by Cognition, the company behind the coding agent Devin. It is the
  public version of Devin's internal "Devin Wiki" and "Devin Search"; launched on 5 May 2025.
- **How you use it:** replace `github.com` with `deepwiki.com` in a public repository's URL and you get its
  wiki. At launch Cognition had indexed more than 50,000 popular public repositories.
- **What it produces:** a wiki written by an LLM for each repository — pages per component, architecture
  diagrams, summaries linked to the source — and a chat ("Ask Devin") that answers questions on it.
  It can also be queried by agents through an MCP server.
- **Private code:** through a Devin account; a `.devin/wiki.json` file in the repository can steer what the
  wiki covers.
- **Where it sits in the talk:** like GitLab Duo and Graphify, it prepares a codebase so that people and
  agents can navigate it. It writes *pages* (a wiki per repository) where GitLab Duo and Graphify build
  *graphs*; SECNA builds a *map* (themes → clusters → examples) of a whole pile — pull requests, commits,
  tickets — at a very low cost. Complementary, not competing.

Sources: [Cognition — DeepWiki: AI docs for any repo](https://cognition.com/blog/deepwiki) (primary);
[Latent Space wiki — Cognition](https://latent.space/wiki/cognition-6249c527/) (launch date);
[fast.io — How to use Devin DeepWiki](https://fast.io/resources/devin-deepwiki-guide/) (third-party guide:
private repositories, `wiki.json`).
