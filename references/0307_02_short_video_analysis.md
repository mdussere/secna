# The short video — shot by shot, and its graphic concept

> Plan Step 3.7 (2026-10-27). **Question it answers**: what exactly is the validated short video —
> its shots, its story, its visual language — so that the long format can be grown from it.
> Source: [`presentation/short/index.html`](../presentation/short/index.html), frozen on
> 2026-10-27 (v9), rendered as `secna_short.mp4` — **1:56**, 1920 × 1080, 30 fps, English, no audio,
> no captions. Times below are video times (pauses included), rounded.

---

## 1. The story in one breath

Text piles up and nobody reads it; it doesn't fit in a model; the three obvious ways to "just ask an
LLM" fail. Clio shows a way out: five steps, where data science finds the structure and the LLM gives
it meaning. Clio's own bill shows the cost is in S — and for short texts S needs no LLM at all. When
the corpus grows, the bill follows the clusters, not the documents. Others do the same. It is within
everyone's reach: a few dozen lines of Python, tried on LangChain's pull requests for $0.15 — and the
map surfaces something nobody was looking for.

**Four questions mark the turning points**, each answered by the next screen:
*Can we cut this bill further?* → *And when the corpus grows?* → *Is it within everyone's reach?* →
*Can it surface the unexpected?* The other transitions use other devices (a figure, the points
moving, a consequence) — see rule 1.

## 2. Shot by shot

| # | Shot | Time | Dur. | Pause |
|---|---|---|---|---|
| 1 | The pile | 0:00–0:06 | 6 s | — |
| 2 | The wall | 0:06–0:15 | 9 s | 0.9 s |
| 3 | Three dead ends | 0:15–0:23 | 8 s | 1.3 s |
| 4 | Clio | 0:23–0:31 | 8 s | 1.0 s |
| 5 | The SECNA rail | 0:31–0:58 | 27 s | 0.5 s × 4, 0.6 s |
| 6 | Structure / meaning | 0:58–1:02 | 4 s | 0.9 s |
| 7 | Clio's bill | 1:02–1:09 | 7 s | 1.0 s |
| 8 | Can we cut it further? | 1:09–1:14 | 5 s | 1.0 s + 2.2 s |
| 9 | The curve | 1:14–1:22 | 8 s | 1.0 s |
| 10 | Not an isolated case | 1:22–1:28 | 6 s | 0.8 s |
| 11 | Within everyone's reach? | 1:28–1:33 | 5 s | 1.0 s + 1.4 s |
| 12 | So we tried it | 1:33–1:37 | 4 s | 1.6 s |
| 13 | The LangChain run | 1:37–1:44 | 7 s | — |
| 14 | The unexpected | 1:44–1:51 | 7 s | 0.6 s |
| 15 | SECNA | 1:51–1:56 | 5 s | — |

### 1 · The pile (0:00–0:06)
- **Particles**: 1,400 horizontal strokes — texts — pour in diagonally, a few lime ones among them.
- **On screen**: *Customer reviews · Tickets · Logs · Agent traces*, slammed one at a time, then
  *Nobody reads it all.* (*it all* in lime).
- **The point**: everyone has this pile.

### 2 · The wall (0:06–0:15)
- **Particles**: the strokes snap into a grid of squares — the corpus as a block. When the context
  window is named, the fifteen squares in the top-left corner light up lime: that is what fits.
- **On screen**: kicker *The corpus*; *1 million reviews · × ~100 tokens each · ≈ 100,000,000 tokens*
  (a counter runs); *▪ The largest context window: ≈ 1 million*; slam *It doesn't fit.*
- **The point**: orders of magnitude, made visible.

### 3 · Three dead ends (0:15–0:23)
- **Particles**: a faint drifting field.
- **On screen**: *"Let's just ask an LLM."*; three numbered columns — *01 Give the model everything ·
  02 Take a sample · 03 One LLM per document* — each with its consequence (*diluted · weak signals
  vanish · no big picture*); each title is struck through in pink, one after the other; *Three dead
  ends.*
- **The point**: the obvious answers fail, each for its own reason.

### 4 · Clio (0:23–0:31)
- **On screen**: *December 2024* (lime, spaced capitals); *Anthropic publishes Clio.*; *Millions of
  conversations. Private. Impossible to read by hand.*; the promise, revealed by a mask:
  *Understand a whole corpus — without reading all of it.*
- **The point**: a real case of impossibility, and a published way out.

### 5 · The SECNA rail (0:31–0:58)
- **Layout**: a vertical rail of five outline letters on the left; the current letter lights up and
  its card shows the verb, one line, and a **chip** saying what it costs — pink when it calls an LLM,
  cyan when it doesn't. The particles on the right show what the step does to an *illustrative
  corpus of customer reviews* (tag at the bottom).
- **S · Summarise** — *Each document is cut down to what carries meaning.* Chip *small LLM (SLM) ·
  1 call per document — or plain code, no LLM*. A scan line crosses the strokes: long strokes become
  short dots, pink under the scan, cyan after.
- **E · Embed** — *Each text becomes a point. Meaning becomes geometry.* Chip *small model · a few
  cents*. Points drift into neighbourhoods; example *"parcel never arrived" ≈ "late delivery"*.
- **C · Cluster** — *Nearby points form groups. A few stay on their own.* Chip *pure computation ·
  0 tokens*. Eight coloured clusters; grey outliers stay visible.
- **N · Name** — *The LLM reads a few examples per group and names it.* Chip *LLM · 1 call per
  group*. A name pill lands on each cluster (*Lost parcel, Refund stuck, App crashes…*).
- **A · Aggregate** — *From fine groups to big themes: a map.* Chip *LLM · 1 call in total*. The
  clusters line up under three themes — *Delivery · Payment · App*.
- **The point**: five steps you can rebuild from memory; only two spend tokens.

### 6 · Structure / meaning (0:58–1:02)
- **On screen**, over the dimmed map: *Data science finds the structure.* (cyan) / *The LLM gives it
  meaning.* (pink), each revealed by a mask.
- **The point**: the thesis, said once at mid-point.

### 7 · Clio's bill (1:02–1:09)
- **On screen**: *Clio's published bill · 100,000 conversations*; **$48.81** counting up (220 px); a
  stacked bar grows — S pink (most of it), N light pink, E·C·A a cyan sliver — with labels *S ·
  summarise every document · $45.00*, *N · name · $3.75*, *E · C · A · a few cents*; slam *92% of the
  bill is S.*
- **The point**: the cost is in S.

### 8 · Can we cut it further? (1:09–1:14)
- **On screen**: the title turns into *Can we cut this bill further?* and holds over the full bar;
  then the S segment collapses to a dashed outline, the counter falls **$48.81 → $3.81**, the S label
  becomes *S · short texts: plain code, no LLM · $0*, slam *Short texts? Skip the LLM.*
- **The point**: going beyond Clio — for short texts, S needs no LLM.

### 9 · The curve (1:14–1:22)
- **On screen**: *And when the corpus grows?*; a log axis 1,000 → 1,000,000 documents; the red curve
  *LLM on every document* draws itself and shoots up; the blue *LLM on the groups only* stays almost
  flat, with two small steps (more clusters, a new level); the title becomes *The bill follows the
  groups, not the documents.*; tag *illustrative · orders of magnitude*.
- **The point**: the thesis in one chart.

### 10 · Not an isolated case (1:22–1:28)
- **On screen**: *Not an isolated case.*; three cards — *Google Research · Urania · 2025 · The same
  shape, with privacy guarantees. Benchmarked against Clio.* / *LangChain · LangSmith Insights · 2025
  · Groups agent traces and names the groups.* / *Open source · Kura · 2025 · "A simple reproduction
  of the CLIO paper."*; *The same recipe, again and again.*
- **The point**: convergence — neutral, no judgement on anyone's choices.

### 11 · Within everyone's reach? (1:28–1:33)
- **On screen**: *Is it within everyone's reach?*; slam *Yes.* (lime); *A few dozen lines of Python
  are enough.*; a five-line code card, one line per step, its comments in the step's colour
  (*# S · plain code*, *# E · on the laptop*, *# C · 0 tokens* in cyan; *# N · 1 call per cluster*,
  *# A · 1 call* in pink).
- **The point**: not reserved to labs.

### 12 · So we tried it (1:33–1:37)
- **On screen**: *So we tried it* / *on **LangChain**'s pull requests,* (LangChain cyan) / *at the
  lowest possible cost.* (lime).

### 13 · The LangChain run (1:37–1:44)
- **Particles**: a dot matrix of seven bars — the themes — the first one pink.
- **On screen**: kicker *Real run · public data*; **14,947** counting up; *LangChain · pull requests
  · 3 months · 137 repos*; *S: no LLM · E: on-premise* (cyan); chip *→ 100 clusters*; **$0.15** slammed
  in lime with a glow, *our cost · the whole run*; the seven themes with their shares (*Agent
  products & reliability 29 %* … *Model providers 6 %*).
- **The point**: it runs, on public data, for fifteen cents — the hero number.

### 14 · The unexpected (1:44–1:51)
- **Particles**: one cluster gathers on the right in pink, the other 99 fade to a grey field.
- **On screen**: *Can it surface the unexpected?* (alone first); then *A bot fixing LangChain's docs
  assistant* (*docs assistant* pink); the cluster's name from N in a pill, *Bot-led hardening of the
  docs agent*; *The largest of the 100 clusters · 2% of all PRs*.
- **The point**: the themes emerge — nobody was looking for this.

### 15 · SECNA (1:51–1:56)
- **Particles**: a slow elliptical orbit.
- **On screen**: the five letters rise one by one — S white, E and C cyan, N pink, A lime; *Summarise
  · Embed · Cluster · Name · Aggregate*; *Data science finds the structure, the LLM gives it
  meaning.*; *github.com/mdussere/secna* (lime).

## 3. The graphic concept

### The idea
**The particles are the corpus.** One set of 1,400 points carries the story from start to end — texts
pouring in, a block that doesn't fit, points drifting into meaning, clusters, a map, the bars of a
real run, one surprising cluster, an orbit at the end. The text never explains what the points
already show; it names it.

### Palette — each colour has one meaning
| Token | Colour | Means |
|---|---|---|
| ink | `#08090D` | the sky (background) |
| paper | `#F3F1EA` | text, neutral points |
| dim | `#8A8F9C` | kickers, axes, secondary text |
| **cyan** | `#4FD1FF` | **data science** — E, C, plain code, *the groups*, *Skip the LLM* |
| **pink** | `#FF3D7F` | **the LLM — tokens, cost** — S with an LLM, N, A, *92%*, the red curve |
| **lime** | `#E8FF3A` | **emphasis** — dates, *Yes.*, **$0.15**, the scene wipe, the repo address |

Rule learned in review: **at most two accent colours in a line**, colour on the key word only — a
line that alternates colours reads as *bariolé*.

### Typography and sizes
- A heavy sans (weights 800–900, tight tracking) for everything large; a mono for kickers (spaced
  capitals), chips, axes and code.
- **Figures are the heroes**: 130–220 px (*14,947*, *$48.81 → $3.81*, *$0.15*), counters that run.
- One idea per screen; one large sentence at most; labels short.
- *Fonts*: the page uses the system fonts of the machine (SF Pro / SF Mono on a Mac). For the long
  version, which will run on other machines, the repo's open fonts (Inter, IBM Plex Mono, already in
  `presentation/theme/fonts/`) should be embedded.

### Motion vocabulary
- **Text entries**: *up*, *left*, *slam* (scale-in for punchlines), *mask* (left-to-right reveal for
  the key sentences), *grow* (bars), *fade*; strike-through drawn over the text.
- **Particle layouts**: keyframed, with a stagger, so the corpus *moves* from one form to the next
  instead of cutting.
- **Scene wipe**: a slanted lime bar sweeps across between scenes.
- **Pauses** (*holds*): time stops for 0.5–2.2 s after a busy screen settles — 18 pauses, about
  17 s of the 1:56. They became **the reading rhythm** of the video.

### Rhythm
15 shots in 116 s — **about 8 s a shot**. Busy screens get a pause; questions get a pause before the
answer.

### How it is built
One HTML page (1920 × 1080 stage): a canvas for the particles, a DOM layer for text, a deterministic
`render(t)` with story time and video time separated by the pauses; `capture.mjs` renders frames in
headless Chrome, ffmpeg makes the MP4. `#t=…` opens any moment.

## 4. What the iterations taught (rules for the long version)

1. **A question where the jump is unclear — not everywhere.** The two jumps colleagues found unclear
   (bill → $3.81, *not isolated* → LangChain) were fixed by a question before the answer. A device
   that recurs gives unity; one used at every transition becomes a tic. Vary it: a question, a
   figure that turns the story, the points carrying the eye to the next shot, a plain consequence
   (*So we tried it*), a wipe or a cut.
2. **Give busy screens time** — a pause after they settle; never chain two dense screens.
3. **Every figure has a referent**: *2% of all PRs*, *our cost · the whole run*, *the largest of the
   100 clusters*.
4. **Concrete beats abstract**: the code card made *a few dozen lines* believable; the cluster cloud
   made the weak signal come *from* the clustering.
5. **No redundancy on screen**: a line that repeats the punchline goes (*without an LLM on every
   document*, *≈ $500 for a million documents*).
6. **Labels sit on what they name** (the blue curve's label moved onto the blue curve).
7. **Neutral on the others**: no controversy about anyone's product choices.
8. **No audio** — no synthetic voice, no generated music.
9. **Wording**: *groups* and *clusters* both appear (curve and N chip say *groups*; run and weak
   signal say *clusters*) — one word to choose for the long version.
