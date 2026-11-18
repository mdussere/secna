"""Record the talk: segments.json → out/talk/seg_NN.wav + out/talk/manifest.json (see RECORDING_BRIEF.md).

Usage (from the workline root):
  .venv/bin/python scripts/record_talk.py              # record what is missing or changed (sha1), in order
  .venv/bin/python scripts/record_talk.py --redo 12 38 # re-record these segments (next seed attempt)

One sentence per model call, joined with SENT_GAP_S (sentences) and PARA_GAP_S (paragraphs) of silence; the
same TEMPO for every file; edges trimmed to EDGE_S; loudness normalised with a peak limiter.
Seed policy: mx.random.seed(100000 * attempt + 1000 * n + 50 * paragraph + sentence).
  --try 1 4 15 --tempo 0.9  → a trial in out/talk_try/, no manifest.
The video (VIDEO_BRIEF.md): --segments segments_video_fr.json --out video_fr
                            --segments segments_video_en.json --out video_en --lang en
"""
import argparse
import hashlib
import json
import time

import mlx.core as mx
import numpy as np
import soundfile as sf

from mlx_audio.tts.utils import load_model

import talk_voice
from talk_voice import (EDGE_S, LANG, LANG_CODE, MODEL, PARA_GAP_S, PEAK_DBFS, REF_AUDIO, REF_AUDIO_EN, REF_TEXT, REF_TEXT_EN, ROOT, SENT_GAP_S,
                        TARGET_LUFS, VOICE, VOICE_EN, ffmpeg_filter, normalise, respell, sentence_clip, split_sentences,
                        tighten, with_edges)

SEGMENTS = ROOT / "segments.json"
OUT = ROOT / "out" / "talk"
MANIFEST = OUT / "manifest.json"
LANG_NOW = "fr"   # fr | en (--lang): the model's lang_code, the respelling table and the voice (its anchor)


def voice():
    """(reference clip, its text, the voice's name) for the language being recorded."""
    return (REF_AUDIO, REF_TEXT, VOICE) if LANG_NOW == "fr" else (REF_AUDIO_EN, REF_TEXT_EN, VOICE_EN)


def settings(attempt: int) -> dict:
    return {"lang_code": LANG_CODE[LANG_NOW], "ref_audio": voice()[0].name, "ref_text": voice()[1],
            "sampling": "model defaults",
            "seed": "100000*attempt + 1000*n + 50*paragraph + sentence", "attempt": attempt,
            "per_call": "one sentence", "sentence_gap_s": SENT_GAP_S, "paragraph_gap_s": PARA_GAP_S,
            "tempo": talk_voice.TEMPO, "edge_s": EDGE_S,
            "target_lufs": TARGET_LUFS, "peak_cap_dbfs": PEAK_DBFS}


def load_manifest() -> dict:
    if MANIFEST.exists():
        return {e["n"]: e for e in json.loads(MANIFEST.read_text())["segments"]}
    return {}


def save_manifest(entries: dict) -> None:
    MANIFEST.write_text(json.dumps({"model": MODEL, "voice": voice()[2],
                                    "segments": [entries[k] for k in sorted(entries)]},
                                   ensure_ascii=False, indent=1))


def record(model, seg: dict, attempt: int, out_dir=None) -> dict:
    sr = model.sample_rate
    sent_gap = np.zeros(int(sr * SENT_GAP_S), dtype=np.float32)
    para_gap = np.zeros(int(sr * PARA_GAP_S), dtype=np.float32)
    parts, sent = [], []
    for i, para in enumerate(seg["paragraphs"]):
        for j, sentence in enumerate(split_sentences(para)):
            text = respell(sentence, LANG_NOW)
            sent.append(text)
            mx.random.seed(100000 * attempt + 1000 * seg["n"] + 50 * i + j)
            audio = np.concatenate([np.asarray(r.audio, dtype=np.float32) for r in model.generate(
                text=text, ref_audio=str(voice()[0]), ref_text=voice()[1], lang_code=LANG_CODE[LANG_NOW])])
            parts += [sentence_clip(audio, sr), sent_gap]
        parts[-1] = para_gap
    audio = np.concatenate(parts[:-1])
    if talk_voice.TEMPO != 1.0:
        audio = ffmpeg_filter(audio, sr, f"atempo={talk_voice.TEMPO}")
    audio = with_edges(audio, sr)
    audio, lufs, peak = normalise(audio, sr)
    audio = tighten(audio, sr)
    path = (out_dir or OUT) / seg["file"]
    sf.write(path, audio, sr, subtype="PCM_16")
    return {"n": seg["n"], "file": seg["file"], "sha1": seg["sha1"],
            "duration_s": round(sf.info(path).duration, 2), "sample_rate": sr,
            "wav_sha1": hashlib.sha1(path.read_bytes()).hexdigest()[:12],
            "lufs": round(float(lufs), 1), "peak_dbfs": round(float(peak), 1),
            "model": MODEL, "voice": voice()[2], "settings": settings(attempt), "sent_text": sent}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--redo", type=int, nargs="*", default=[])
    # --again: re-record with the same attempt (same seeds) after a RESPELL change: the sentences whose text
    # did not change come out identical, only the respelled ones are new.
    ap.add_argument("--again", type=int, nargs="*", default=[])
    ap.add_argument("--try", dest="trial", type=int, nargs="*", default=[])
    ap.add_argument("--tempo", type=float)
    ap.add_argument("--segments", help="a segments file in the workline root (default segments.json)")
    ap.add_argument("--out", help="a folder under out/ (default talk)")
    ap.add_argument("--lang", choices=["fr", "en"], default="fr")
    args = ap.parse_args()
    global SEGMENTS, OUT, MANIFEST, LANG_NOW
    LANG_NOW = args.lang
    if args.segments:
        SEGMENTS = ROOT / args.segments
    if args.out:
        OUT = ROOT / "out" / args.out
        MANIFEST = OUT / "manifest.json"
    if args.tempo:
        talk_voice.TEMPO = args.tempo
    if args.trial:
        trial_dir = ROOT / "out" / ("talk_try" if LANG_NOW == "fr" else "video_en_try")
        trial_dir.mkdir(parents=True, exist_ok=True)
        model = load_model(model_path=MODEL)
        for seg in [s for s in json.loads(SEGMENTS.read_text())["segments"] if s["n"] in args.trial]:
            e = record(model, seg, 0, trial_dir)
            print(f"try {e['file']}: {e['duration_s']:5.1f}s  {seg['words'] / e['duration_s'] * 60:4.0f} wpm  "
                  f"{e['lufs']} LUFS  peak {e['peak_dbfs']}  tempo {talk_voice.TEMPO}", flush=True)
        return
    OUT.mkdir(parents=True, exist_ok=True)
    segs = json.loads(SEGMENTS.read_text())["segments"]
    entries = load_manifest()
    todo = [s for s in segs if s["n"] in args.redo or s["n"] in args.again or s["n"] not in entries
            or entries[s["n"]]["sha1"] != s["sha1"] or not (OUT / s["file"]).exists()]
    if not todo:
        print("nothing to record")
        return
    model = load_model(model_path=MODEL)
    for seg in todo:
        attempt = (entries[seg["n"]]["settings"]["attempt"] + (seg["n"] in args.redo)
                   if seg["n"] in args.redo or seg["n"] in args.again else 0)
        t0 = time.time()
        entries[seg["n"]] = record(model, seg, attempt)
        save_manifest(entries)
        e = entries[seg["n"]]
        print(f"{e['file']}: {e['duration_s']:5.1f}s  {seg['words'] / e['duration_s'] * 60:4.0f} wpm  "
              f"{e['lufs']} LUFS  peak {e['peak_dbfs']}  attempt {attempt}  ({time.time() - t0:.0f}s)", flush=True)


if __name__ == "__main__":
    main()
