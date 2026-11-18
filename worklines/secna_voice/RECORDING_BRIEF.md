# Recording brief — the talk, one audio file per pause

For the agent that runs the text-to-speech in this workline. You record the whole talk as 47 separate
files. Each file is laid over one pause of the live page (`presentation/long/index.html`). The page is not
changed to fit the voice: the audio is placed on top of it.

## What you get

`segments.json` (in this folder) — 47 segments, in talk order. For each one:

| Field | Meaning |
|---|---|
| `n` | The pause number on the page, 1 to 47. It is the key for everything. |
| `file` | The file name to write: `seg_01.wav` … `seg_47.wav`. |
| `paragraphs` | The French text to say, one string per paragraph. **This is the only text to synthesise.** |
| `sha1` | A hash of that text. Use it to know what changed since the last recording. |
| `words`, `estimated_s` | Size of the segment, and its rough length at 140 words a minute. |
| `animation_s` | How long the screen animates before it holds on this pause. Information only. |
| `sequence`, `ends_on_step`, `screen` | Where the segment sits in the talk and what is on screen. Context only: never say it. |

The text comes from `references/0309_01_speaker_text_fr.md`. If that file changes, rebuild with
`python3 scripts/build_segments.py`, then re-record only the segments whose `sha1` changed.

## What to produce

In `out/talk/`:

1. **`seg_NN.wav`** — one file per segment, named exactly as `file` says. Mono, the model's native sample
   rate (do not resample), 16-bit PCM or float.
2. **`manifest.json`** — one entry per segment: `n`, `file`, `sha1` (copied from `segments.json`),
   `duration_s` (measured on the file), `model`, `voice`, and the settings used. Write it after every
   segment, so an interrupted run can resume.

## Rules

- **One segment, one file.** Never merge two segments, never split one across files. Record them in
  order, 1 to 47.
- **Say the text as written.** Do not rewrite, shorten, translate or reorder it. Do not say the `screen`
  or `ends_on_step` fields. If a word needs help to be pronounced, change only what is sent to the model
  (see *Pronunciation*), never `segments.json`.
- **One voice, one setup, for all 47.** Same model, same reference clip, same settings and seed policy from
  the first file to the last. Use the model and voice Michael chose after the bake-off; if that choice is
  not recorded in this folder, ask him before you start. If you must change anything mid-run, re-record
  from segment 1.
- **Long segments.** Segments run from 5 to 50 seconds (the longest is 38, 117 words). If the model drifts
  or degrades on long input, synthesise paragraph by paragraph, or sentence by sentence, and join inside
  the segment: about 0.25 s of silence between sentences, about 0.5 s between paragraphs. The result is
  still one file.
- **Clean edges.** Trim each file to 0.10–0.20 s of silence at the start and at the end. No clicks, no cut
  breath, no room tone added. The player adds the gaps between segments.
- **Same level everywhere.** Normalise every file to the same loudness (for example −19 LUFS, peaks under
  −1 dBFS), so no segment jumps out when they play one after the other.
- **Pace.** A posed speaking rate, about 130–140 words a minute. Do not speed up to fit `animation_s`:
  every segment is longer than its animation, so the screen simply holds while the voice finishes.
- **Tone.** A speaker addressing a room in the evening: direct, warm, not an advertisement, not an
  audiobook. Questions sound like questions.

## Pronunciation

The on-screen material is in English and the speech is French, so English terms are said as a French
engineer says them, not spelled out.

| Written | Say |
|---|---|
| SECNA | as one word, the way the speaker says it in his reference clip (`ref/fr_b.wav`) |
| S, E, C, N, A (« S, comme Summarise ») | the French letter names |
| Summarise, Embed, Cluster, Name, Aggregate | the English words |
| LLM, API, IA, QR | French letter names |
| RAG | one word, « rag » |
| k-means | « ka-minz » |
| gpt-6-luna | « G-P-T six Luna » |
| 2024 | « deux mille vingt-quatre » |
| Clio, Claude, Anthropic, Urania, Intercom | as proper names; Claude as the French first name |
| LangChain, LangSmith, GitHub, GitLab Duo, Graphify, DeepWiki | English names |
| pull requests, tokens, clusters, notebook, grep, find | English words, as used in French tech talk |
| « … » | a quoted customer message: a slight change of voice is welcome, no more |

Amounts are already written out in the text (« quarante-huit dollars et quatre-vingt-un cents »).

## Check before you hand over

1. 47 files, named `seg_01.wav` to `seg_47.wav`, and 47 entries in `manifest.json`.
2. Transcribe every file (the Whisper check in `scripts/check.py` does this for the bake-off clips; adapt
   it to read `segments.json`) and compare with the text. Listen to, and re-record, any segment with a
   word error rate above about 5 %, and any segment where a name from the table above is wrong.
3. Listen to segments 1, 9, 15, 21, 32, 38 and 47 in full: the opening, the first proper names, the
   longest ones, the amounts, the close.
4. Report: the total duration, the list of segments you re-recorded and why, and anything in the text you
   could not get the model to say correctly. Do not fix the text yourself: report it.

## How the files are used

Segment `n` starts when the page starts moving towards pause `n` (for segment 1, at the start of the talk).
The animation plays for `animation_s` seconds, then the screen holds, with its ambient motion, while the
voice finishes. When the file ends, the page moves on and segment `n + 1` starts. That is why the file
names, the `n` values and the edges matter more than the exact durations.
