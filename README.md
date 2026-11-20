![SECNA, written in particles](presentation/img/banner.jpg)

# SECNA — Summarise · Embed · Cluster · Name · Aggregate

**Your corpora keep growing. Your token budget doesn't.** A talk by Michaël Dussère at Generative AI
Bordeaux (Meetup #7, 19 November 2026), with everything it shows: the presentation, the notebook, the sources.

### ▶ [Open the presentation](https://mdussere.github.io/secna/)

▶ Play: the whole presentation, narrated in English ([in French](https://mdussere.github.io/secna/#lang=fr), or the FR / EN button) · → or click: step by step ·
← back · f: fullscreen · h: help.

## The idea

Reviews, tickets, conversations, agent traces, pull requests: text piles up, and nobody reads it all. It
doesn't fit in a context window, a sample misses the weak signals, and one LLM call per document gives a million
summaries and still no overview.

Anthropic's [Clio](https://arxiv.org/abs/2412.13678) shows the way out, in five steps:

| | Step | Who does it | Cost |
|---|---|---|---|
| **S** | **Summarise** each text to what carries its meaning | a small LLM, or plain code for short texts | one call per document, or nothing |
| **E** | **Embed** each text as a point: same meaning, same neighbourhood | a small embedding model | cents, or nothing on a laptop |
| **C** | **Cluster** the dense regions | k-means, HDBSCAN… | no LLM |
| **N** | **Name** each cluster from a few typical texts | an LLM | one call per cluster |
| **A** | **Aggregate** the clusters into a few themes | an LLM | one call |

**Data science finds the structure. The LLM gives it meaning.** The LLM reads clusters, not documents, so the
bill follows the number of clusters, not the size of the corpus. Clio publishes its bill: $48.81 for 100,000
conversations, 92% of it the S step. For short texts, S becomes plain code, and the bill drops to $3.81.

The name *SECNA* is the talk's; the recipe is Clio's, and others' ([sources](BIBLIO.md)).

## The notebook

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mdussere/secna?quickstart=1)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/mdussere/secna/blob/main/notebook/secna.ipynb)

[`notebook/secna.ipynb`](notebook/secna.ipynb) runs the recipe on a public corpus: every pull request of the
[`langchain-ai`](https://github.com/langchain-ai) organisation on GitHub over three months — 14,947 pull
requests, 137 repositories. S is plain code, E runs on the CPU with an open model, C is a k-means into 100
clusters, N and A call a small model: **about $0.15 for the whole run**, and a map of seven themes. It is the
notebook shown during the talk.

**What it needs**
- a **GitHub token** (`GITHUB_TOKEN`): GitHub's search API needs one. Codespaces provides it; elsewhere, any
  token with public read access will do (on your machine, the GitHub CLI's `gh auth token` is picked up on its own);
- an **OpenAI-compatible key** (`OPENAI_API_KEY`, and `OPENAI_BASE_URL` for another endpoint), for N and A only.
  Without it, the extraction, S, E and C still run.

Keys never go in the repository: they are Codespaces or Colab secrets, environment variables, or a `.env` file
(gitignored).

**In GitHub Codespaces:** a machine run by GitHub, with the notebook's environment ready
([`.devcontainer/`](.devcontainer/devcontainer.json)).
1. Add your key once: *GitHub → Settings → Codespaces → Secrets → New secret*: `OPENAI_API_KEY` (and
   `OPENAI_BASE_URL` for another endpoint), with access to this repository. Secrets reach the codespace as
   environment variables.
2. Click the Codespaces badge (or *Code → Codespaces → Create codespace on main*). The first start installs the
   environment (a few minutes); the notebook opens.
3. Select the kernel *Python 3.12*, then *Run All*.

**In Colab:** click the badge, add `GITHUB_TOKEN` and `OPENAI_API_KEY` under 🔑 *Secrets*, then *Runtime → Run
all*. A GPU runtime makes E faster.

**On your machine:**

```bash
cd notebook
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt jupyterlab
export GITHUB_TOKEN=…  OPENAI_API_KEY=…          # or a .env file at the repository's root (see env.template)
.venv/bin/jupyter lab secna.ipynb               # then Run → Run All Cells
```

**How long it takes:** the download of the corpus about 9 minutes (saved to `notebook/data/`, so a second run
skips it), E about 11 minutes on a laptop's CPU, then C in seconds, N (100 calls) and A (1 call) in a few minutes.
For a quick try, set one repository and one month in the *Configuration* cell. To run it on your own code, put
your organisation or repository in `REPOS`.

**The full version.** `test_secna.py` and `test_secna_langchain.py` are the notebook as it actually ran, written
as pytest cells (one test per cell, every output cached on disk), with the checks and extra cells the talk draws
on: who opens the pull requests, the unexpected cluster, routing the next day's pull requests. `test_secna.py`
is configured by default on seven public GitLab repositories (embedded through the API: about $3).

```bash
cp ../env.template ../.env                       # then fill SECNA_API_KEY
.venv/bin/pytest -s test_secna_langchain.py      # the LangChain run
.venv/bin/pytest -s test_secna_langchain.py -k cluster   # one cell
```

## The repository

| Folder | What |
|---|---|
| [`presentation/`](presentation/) | The presentation: one HTML page, played live step by step. `index.html`, its scripts (`js/`), the run's data (`data.js`), the stage notebook (`nb_display.py` → `nb_cells.js`). |
| [`notebook/`](notebook/) | The SECNA notebook (`secna.ipynb`), and its full version as pytest cells. |
| [`.devcontainer/`](.devcontainer/) | The notebook's environment for GitHub Codespaces. |
| [`voice/`](voice/) | The narrated version's voice, in French and in English: the texts (`texts/`), one segment per pause, and the local text-to-speech scripts. |
| [`BIBLIO.md`](BIBLIO.md) | Every source the talk relies on. |

### Rebuild

```bash
# The presentation as one portable HTML file → presentation/dist/
python3 presentation/tools/build_single.py
python3 presentation/tools/build_single.py --voice     # with the voice (FR / EN) and the ambience, once recorded
# → online: the Pages workflow serves the voice build from the release "presentation-voice"
gh release upload presentation-voice presentation/dist/SECNA_*_voice_fr-en.html --clobber

# The narrated video, one per language → presentation/render/   (Node 22, Chrome, ffmpeg)
cd presentation && npm install
node capture.mjs talk 30 4                            # French
SECNA_LANG=en node capture.mjs talk 30 4              # English
```

The voice is generated locally with
[Qwen3-TTS 1.7B](https://huggingface.co/mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16) through
[mlx-audio](https://github.com/Blaizzy/mlx-audio) (Apple silicon): a voice designed from a written description,
one take frozen as a reference clip, then cloned sentence by sentence. From `voice/`:

```bash
python3 -m venv .venv && .venv/bin/pip install mlx-audio pyloudnorm soundfile num2words
python3 scripts/build_segments.py fr                  # texts/video_fr.md → segments_video_fr.json
.venv/bin/python scripts/record_talk.py --lang fr     # → out/video_fr/seg_NN.wav (only what changed)
.venv/bin/python scripts/check_talk.py --lang fr      # Whisper: flags word errors and misread names
```

The generated audio, the models and the renders are not committed.
