"""Starry-night ambience beds under the voice: a local text-to-music model, turned into seamless loops.

Usage (from the workline root): .venv/bin/python scripts/night_beds.py [name ...]
Writes out/night/<name>.wav (the loop), <name>_with_voice_<speed>.wav (segments 1–3 over it) and
listen_night.html.

The model (Stable Audio 3, run locally with mlx-audio) generates one take per caption. A loop is made by
laying the take's last XFADE_S seconds over its first XFADE_S with an equal-power crossfade: the loop is
then (take − XFADE_S) long and its end flows into its start.
"""
import html
import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm
import soundfile as sf

from mlx_audio.music.utils import load_model

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out" / "night"
MODEL = str(ROOT / "models" / "stable-audio-3")   # converted from stabilityai/stable-audio-3-optimized
BED_LUFS = -34.0      # the voice is at −19 LUFS; −30 was a little too present (Michael, 2026-11-17)
XFADE_S = 8.0
LOOP_S = 180.0
TAKE_S = 230.0       # the take has a soft intro and a fade-out: both are left out of the loop
SKIP_HEAD_S, SKIP_TAIL_S = 10.0, 18.0
STEREO_WIDTH = 0.6   # side scaled down: the takes are very wide (L/R in opposite phase), bad on a mono speaker
NEGATIVE = ("drums, percussion, beat, bass line, vocals, voice, singing, choir, loud, harsh, distorted, noise, "
            "hiss, static, cinematic hit, epic, fast")

BEDS = {  # name: (caption, seed). chimes = Michael's pick (2026-11-17); the others = more modern takes on it.
    "chimes": ("Dreamy starlight ambient, shimmering glass chimes falling slowly, deep soft drone, "
               "long reverb tails, minimal and serene, night sky", 33),
    "glass_synth": ("Modern minimal ambient, soft glassy synth plucks falling slowly, warm analog pad, subtle "
                    "granular shimmer, night sky, calm and spacious", 51),
    "crystal": ("Contemporary ambient electronica, sparse crystalline bell tones, deep soft sub drone, light tape "
                "texture, wide reverb, nocturnal and minimal", 52),
    "e_piano": ("Modern ambient, delicate electric piano and digital chime notes spaced far apart, airy pad, "
                "gentle stereo delay, starry night, serene", 54),
}
# Voice previews: segments 1–3 at the speeds Michael asked to compare (relative to the recorded talk).
VOICE_TAKES = {"x1.1": ROOT / "out" / "talk_try" / "x1.1", "x1.2": ROOT / "out" / "talk_try" / "x1.2"}


def _db(x: np.ndarray) -> float:
    return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)


def loop(audio: np.ndarray, sr: int) -> tuple[np.ndarray, float]:
    """Pick, in the steady part of the take, the LOOP_S window whose end and start are at the closest level,
    then lay the XFADE_S after its end over its start (equal power) → a seamless loop of exactly LOOP_S.
    Returns the loop and the window start (s)."""
    L, X = int(LOOP_S * sr), int(XFADE_S * sr)
    lo, hi = int(SKIP_HEAD_S * sr), len(audio) - int(SKIP_TAIL_S * sr) - L - X
    starts = range(lo, max(lo, hi) + 1, sr // 2)
    s = min(starts, key=lambda i: abs(_db(audio[i:i + X]) - _db(audio[i + L:i + L + X])))
    chunk = audio[s:s + L + X]
    t = np.linspace(0, np.pi / 2, X)[:, None]
    return np.concatenate([chunk[L:L + X] * np.cos(t) + chunk[:X] * np.sin(t), chunk[X:L]]), s / sr


def narrow(a: np.ndarray, width: float = STEREO_WIDTH, min_corr: float = 0.2) -> np.ndarray:
    """Scale the side signal down (from `width`, by steps of 0.1) until L/R correlation reaches min_corr."""
    mid, side = (a[:, 0] + a[:, 1]) / 2, (a[:, 0] - a[:, 1]) / 2
    for w in np.arange(width, 0.05, -0.1):
        out = np.stack([mid + side * w, mid - side * w], axis=1)
        if np.corrcoef(out[:, 0], out[:, 1])[0, 1] >= min_corr:
            break
    return out


def level(x: np.ndarray, sr: int) -> np.ndarray:
    x = x * 10 ** ((BED_LUFS - pyloudnorm.Meter(sr).integrated_loudness(x)) / 20)
    return x * min(1.0, 0.7 / np.abs(x).max())


def voice_preview(bed: np.ndarray, sr: int, take_dir: Path) -> np.ndarray:
    parts = [np.zeros(int(2.0 * sr))]
    for n in (1, 2, 3):
        v, vsr = sf.read(take_dir / f"seg_{n:02d}.wav", dtype="float64")
        parts += [np.interp(np.arange(len(v) * sr // vsr) * vsr / sr, np.arange(len(v)), v), np.zeros(int(0.6 * sr))]
    voice = np.concatenate(parts)
    reps = int(np.ceil(len(voice) / len(bed)))
    mix = np.tile(bed, (reps, 1))[:len(voice)].copy() + voice[:, None]
    return mix * min(1.0, 0.95 / np.abs(mix).max())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    names = sys.argv[1:] or list(BEDS)
    model = load_model(MODEL)
    sr, dur = model.sample_rate, TAKE_S
    meta = json.loads((OUT / "night.json").read_text()) if (OUT / "night.json").exists() else {}
    for name in names:
        caption, seed = BEDS[name]
        raw = OUT / f"{name}_raw.wav"
        if raw.exists() and meta.get(name, {}).get("caption") == caption and meta[name].get("seed") == seed:
            audio, _ = sf.read(raw, dtype="float64")            # same caption and seed: reuse the take
        else:
            res = model.generate(text=caption, duration=dur, seed=seed, negative_prompt=NEGATIVE)
            res = next(iter(res)) if not hasattr(res, "audio") else res
            audio = np.asarray(res.audio, dtype=np.float64)
            audio = audio.T if audio.ndim == 2 and audio.shape[0] in (1, 2) else audio
            audio = audio if audio.ndim == 2 else np.stack([audio, audio], axis=1)
            sf.write(raw, audio.astype(np.float32), sr)
        looped, start_s = loop(narrow(audio), sr)
        bed = level(looped, sr)
        sf.write(OUT / f"{name}.wav", bed.astype(np.float32), sr, subtype="PCM_16")
        for speed, take_dir in VOICE_TAKES.items():
            sf.write(OUT / f"{name}_with_voice_{speed}.wav", voice_preview(bed, sr, take_dir).astype(np.float32),
                     sr, subtype="PCM_16")
        meta[name] = {"caption": caption, "seed": seed, "model": MODEL, "take_s": dur,
                      "loop_s": round(len(bed) / sr, 1), "window_start_s": start_s, "lufs": BED_LUFS,
                      "xfade_s": XFADE_S, "stereo_width": STEREO_WIDTH}
        print(f"{name}: loop {len(bed) / sr:.1f}s", flush=True)
    (OUT / "night.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False))
    rows = "".join(
        f"<h2>{n} <small>· {m['loop_s']:.0f} s loop</small></h2><p><small>{html.escape(m['caption'])}</small></p>"
        f"<p>Loop alone: <audio controls loop preload=none src='out/night/{n}.wav'></audio></p>"
        + "".join(f"<p>With the voice, {sp}: <audio controls preload=none "
                  f"src='out/night/{n}_with_voice_{sp}.wav'></audio></p>" for sp in VOICE_TAKES)
        for n, m in meta.items() if n in BEDS)
    (ROOT / "listen_night.html").write_text(
        "<!doctype html><meta charset=utf-8><title>Night beds</title><style>body{font:15px system-ui;"
        "max-width:820px;margin:2em auto;padding:0 16px}small{color:#666;font-weight:400}</style>"
        f"<h1>Starry-night beds — loops under the voice</h1><p>Beds at {BED_LUFS:g} LUFS, voice at −19. "
        "Voice speeds: x1.1 and x1.2 faster than the recorded talk.</p>" + rows)


if __name__ == "__main__":
    main()
