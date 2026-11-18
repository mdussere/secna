# Sound choices — the narrated talk

Michael's decisions of 17 November 2026, for whoever mixes the narrated version (the voice files over the
live page, the background bed under them). The audio itself is local only: `out/` is gitignored.

## Decisions

| | Choice |
|---|---|
| **Voice** | Qwen3-TTS 1.7B, the "Design" voice (a French man in his forties, conference speaker), kept identical across the talk by cloning one reference take (`ref/design_anchor.wav`). |
| **Voice speed** | **1.2×** the previous recording, so about 170–185 words a minute. This replaces the 130–140 words a minute in `RECORDING_BRIEF.md`. |
| **Background bed** | **`chimes`**: glass chimes falling slowly over a soft deep drone, long reverb. Generated locally with Stable Audio 3. |
| **Bed level** | −34 LUFS, about 15 dB under the voice (−19 LUFS). It should stay just behind the voice. |
| **Rejected** | White or coloured noise beds ("bruit de mire"); harp (`midsummer`). |

## Files

| What | Where | Format |
|---|---|---|
| The talk, one file per pause | `out/talk/seg_01.wav` … `seg_47.wav` + `manifest.json` | mono, 24 kHz, 16-bit, −19 LUFS, 0.15 s of silence at each end |
| The previous talk (slower, 0.85) | `out/talk_v2/` | kept for comparison; do not use |
| The bed | `out/night/chimes.wav` | stereo, 44.1 kHz, 16-bit, a seamless **3-minute loop**, −34 LUFS |

## How to use the bed

- Loop `chimes.wav` continuously, from the start of the talk to the end. It is **not synchronised** with the
  page or the voice: it simply keeps running, including while the screen holds.
- Put the voice files on top at their own level. Don't duck the bed under the voice: −34 LUFS is already low
  enough.
- The loop joins without a click or a level dip (the end crossfades into the start over 8 s), so it can
  repeat any number of times.
- The bed is 44.1 kHz stereo and the voice is 24 kHz mono, so resample both to the output rate when you mix.

## Status

- **Bed:** final.
- **Voice at 1.2×:** final. All 47 segments were re-recorded on 17 November: **16 min 02 s** in total, about
  165 words a minute, −19.0 LUFS everywhere, 0.15–0.17 s of silence at each end.
  - The files keep the same names and `n` values, and `manifest.json` gives the new durations. Re-read it
    before placing the files, because every segment is about a sixth shorter than in the previous version.
  - Seg 13 was re-recorded once: « appel de LLM » had come out as « de LM ».
  - The Whisper check found no reading errors. The remaining differences are homophones (« relit/relie »,
    « calculée/calculez », « au LLM » transcribed « OLLM »).
  - Still to confirm by ear: « Michaël Dussère » (seg 1) and LangChain (segs 24 and 31).
- **Abbreviations fixed (17 November, later):** « LLM » is now one quick word, and « QR code » is said at
  normal speed instead of letter by letter. Before, « LLM » sometimes came out spelled with pauses, up to
  1.3 s with a 240 ms gap; it now takes 0.36–0.54 s. The 16 segments containing them were re-recorded: 4, 7,
  13–17, 19, 23, 29, 32, 34, 38, 41, 46 and 47.
  - Same seeds: only the sentences containing LLM or QR code changed.
  - Total **15 min 57 s**, about 5 s shorter: re-read `manifest.json` for the new durations.
  - The previous files are in `out/talk_v3/`.

## How to regenerate

From `worklines/secna_voice/`:

- Voice: `.venv/bin/python scripts/record_talk.py`, then `.venv/bin/python scripts/check_talk.py`. The speed is
  `TEMPO` in `scripts/talk_voice.py`.
- Bed: `.venv/bin/python scripts/night_beds.py chimes`. This reuses the saved take, and the level is
  `BED_LUFS` in `scripts/night_beds.py`.
