![SECNA, written in particles](presentation/img/banner.jpg)

# SECNA — Summarise · Embed · Cluster · Name · Aggregate

**Your corpora keep growing. Your token budget doesn't.** A talk by Michaël Dussère at Generative AI
Bordeaux (Meetup #7, 19 November 2026), with everything it shows: the presentation, the notebook, the sources.

### ▶ [Open the presentation](https://mdussere.github.io/secna/)

→ or click: the next step · ← back · space: play it all · f: fullscreen · h: help.

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

[`notebook/`](notebook/) runs the recipe on a public corpus: every pull request of the
[`langchain-ai`](https://github.com/langchain-ai) organisation on GitHub over three months — 14,947 pull
requests, 137 repositories. S is plain code, E runs on the laptop's CPU with an open model, C is a k-means into
100 clusters, N and A call a small model: **about $0.15 for the whole run**, and a map of seven themes.

The notebook is a pytest file: each test is a cell, run in order, its outputs cached on disk.

```bash
cd notebook
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cp ../env.template ../.env                     # then fill SECNA_API_KEY (any OpenAI-compatible endpoint)
.venv/bin/pytest -s test_secna_langchain.py    # the LangChain run
.venv/bin/pytest -s test_secna_langchain.py -k cluster   # one cell
```

To run it on your own corpus, change `SECNA_REPOS` (and the dates) at the top of `test_secna_langchain.py`.
`test_secna.py` holds the cells, configured by default on seven public GitLab repositories (embedded through the
API: about $3).

## The repository

| Folder | What |
|---|---|
| [`presentation/`](presentation/) | The presentation: one HTML page, played live step by step. `index.html`, its scripts (`js/`), the run's data (`data.js`), the stage notebook (`nb_display.py` → `nb_cells.js`). |
| [`notebook/`](notebook/) | The SECNA notebook. |
| [`voice/`](voice/) | The narrated version's voice, in French and in English: the texts (`texts/`), one segment per pause, and the local text-to-speech scripts. |
| [`BIBLIO.md`](BIBLIO.md) | Every source the talk relies on. |

### Rebuild

```bash
# The presentation as one portable HTML file → presentation/dist/
python3 presentation/tools/build_single.py
python3 presentation/tools/build_single.py --voice     # with the voice (FR / EN) and the ambience, once recorded

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
