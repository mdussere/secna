# Recording brief: the video, in French and in English

This brief is for the agent that runs the text-to-speech in this workline. Michael approved the texts on
18 November 2026. The long video gets a voice in two languages, with the same 47 clips and the same pauses as
the talk. The page doesn't change: each clip is laid over its pause, as for `out/talk/`. Everything in
`RECORDING_BRIEF.md` still applies, except for the points below.

## 1. French: 8 clips

- **The text:** `segments_video_fr.json`, from `references/0311_01_video_text_fr.md`. It is the talk's text
  without the self-introduction, and in a more assertive tone.
- **What to record:** only the clips whose text changed: **1, 3, 10, 17, 23, 25, 28 and 45**.
- **Where:** `out/video_fr/`. The other 39 are already there. They were copied from `out/talk/`, have the same
  `sha1`, and are listed in `out/video_fr/manifest.json`. Add the 8 new entries to that manifest.
- **Settings:** the same as `out/talk/`:
  - the same model, anchor and seed policy;
  - TEMPO 1.02;
  - gaps of 0.35 s between sentences and 0.7 s between paragraphs;
  - 0.15 s at each edge;
  - −19 LUFS, peaks under −1 dBFS.

  The new clips must not stand out from the 39 around them.
- **Leave `out/talk/` as it is.** It stays the voice of the talk's own text.

## 2. English: 47 clips

- **The text:** `segments_video_en.json`, from `references/0311_02_video_text_en.md`, with `language: en`.
  - It has the same 47 cuts, so the same `n` and the same `file` names.
  - It has 2,168 words. The segments run from 5 to 87 words.
- **Where:** `out/video_en/`: `seg_01.wav` … `seg_47.wav`, plus `manifest.json`.
- **The voice:**
  - **The same voice as the French:** the same model, the same `design_anchor.wav`, with `lang_code` set to
    English.
  - The final speed is the same as the French: TEMPO 1.02. In English, that is about 165–180 words a minute.
  - The levels and edges are the same as the French.
  - **Tone:** a video narrator. Direct, confident and lively, with short sentences that land. Not an
    advertisement, not an audiobook.
- **First, a check before the 47:** record clips **1, 15 and 31** and send them to Michael. If the anchor gives
  the English a strong French accent, or a voice he doesn't recognise as the same, stop and report. Don't
  switch to another voice without his choice.
- **Pronunciation:**

  | Written | Say |
  |---|---|
  | SECNA | as one word, as in the French clips |
  | S, E, C, N, A (*S, for Summarise*) | the English letter names |
  | LLM, API, CPU, QR | the letters |
  | RAG | one word, "rag" |
  | k-means | "kay-means" |
  | gpt-6-luna | "G-P-T six Luna" |
  | December 2024 | "December twenty twenty-four" |
  | Clio, Claude, Anthropic, Urania, Intercom, LangChain, LangSmith, GitHub, GitLab Duo, Graphify, DeepWiki | proper names, said the English way |
  | "…" | a quoted customer message: a slight change of voice is welcome, no more |

  The amounts are already written out in words.

## 3. Check before you hand over

1. **The French:** 47 files and 47 manifest entries in `out/video_fr/`, and the 8 new ones match their `sha1`.
2. **The English:** 47 files and 47 manifest entries in `out/video_en/`.
3. **Whisper on the new clips** (`scripts/check_talk.py`, pointed at the segments file and the folder):
   - re-record any clip with a word error rate above about 5 %;
   - re-record any clip where a name from the tables is wrong.
4. **Listen in full to:**
   - FR 1 and 45;
   - EN 1, 9, 15, 17, 32 and 47.
5. **Report:** the total duration per language, the clips you re-recorded and why, and anything you couldn't
   get said right. Don't change the texts yourself: report the problem instead.

## How the files are used

- The page `presentation/long/index.html` switches language with its FR / EN button (or the `l` key). English
  plays from `out/video_en/`. French plays from `out/talk/` until the 8 new French clips are in; then it moves
  to `out/video_fr/`.
- From these two folders, `capture.mjs` builds:
  - the narrated video, one per language;
  - the single-file HTML, with both languages.
