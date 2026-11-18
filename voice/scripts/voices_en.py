"""English voice samples for the video (2026-11-18): British and American, local models only, one text.

Michael found the English clips (the French designed voice speaking English) too French. These samples are for
him to choose an English voice. Same text for every voice; loudness normalised so only the voice differs.

Usage (from voice/):
  .venv/bin/python scripts/voices_en.py qwen voxtral            # Qwen3-TTS (designed voices, preset speakers), Voxtral
  ../presentation/tools/.venv/bin/python scripts/voices_en.py kokoro   # Kokoro (its own venv)
  .venv/bin/python scripts/voices_en.py neutral                 # the voice made like the French: design takes, cloned
  .venv/bin/python scripts/voices_en.py page                    # normalise to −19 LUFS → listen_en.html
Writes out/voices_en/<label>.wav.
"""
import sys
import time
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "out" / "voices_en"
OUT.mkdir(parents=True, exist_ok=True)

TEXT = ("Nobody reads it all. Yet it's a goldmine. In the years ahead, what sets apart the players of one "
        "industry will be what they get out of these corpora. Not storing them. Understanding them. "
        "Three months of LangChain, mapped in eighty lines, for fifteen cents.")

DESIGNS = {   # Qwen3-TTS VoiceDesign: a voice from a description (frozen later as an anchor, like the French)
    "uk_m_design": "A British man in his forties with a standard Southern English accent, warm and fairly deep "
                   "voice, confident and engaging, the clear diction of a documentary narrator, lively pace.",
    "uk_f_design": "A British woman in her thirties with a standard Southern English accent, clear and warm voice, "
                   "confident, the diction of a technology documentary narrator, lively pace.",
    "us_m_design": "An American man in his forties with a General American accent, warm and fairly deep voice, "
                   "confident and energetic, the clear diction of a tech keynote speaker, lively pace.",
    "us_f_design": "An American woman in her thirties with a General American accent, clear and warm voice, "
                   "confident and energetic, the diction of a tech explainer video narrator, lively pace.",
}
# (label, accent, model, what it is)
CATALOGUE = [
    ("neutral_1_clone", "Neutral international", "Qwen3-TTS VoiceDesign → Base", "take 1, frozen and cloned (as the 47 clips would sound)"),
    ("neutral_1_anchor", "Neutral international", "Qwen3-TTS VoiceDesign", "take 1: the design take itself"),
    ("neutral_2_clone", "Neutral international", "Qwen3-TTS VoiceDesign → Base", "take 2, frozen and cloned (as the 47 clips would sound)"),
    ("neutral_2_anchor", "Neutral international", "Qwen3-TTS VoiceDesign", "take 2: the design take itself"),
    ("neutral_3_clone", "Neutral international", "Qwen3-TTS VoiceDesign → Base", "take 3, frozen and cloned (as the 47 clips would sound)"),
    ("neutral_3_anchor", "Neutral international", "Qwen3-TTS VoiceDesign", "take 3: the design take itself"),
    ("neutral_4_clone", "Neutral international", "Qwen3-TTS VoiceDesign → Base", "take 4, frozen and cloned (as the 47 clips would sound)"),
    ("neutral_4_anchor", "Neutral international", "Qwen3-TTS VoiceDesign", "take 4: the design take itself"),
    ("neutral_5_clone", "Neutral international", "Qwen3-TTS VoiceDesign → Base", "take 5, frozen and cloned (as the 47 clips would sound)"),
    ("neutral_5_anchor", "Neutral international", "Qwen3-TTS VoiceDesign", "take 5: the design take itself"),
    ("neutral_6_clone", "Neutral international", "Qwen3-TTS VoiceDesign → Base", "take 6, frozen and cloned (as the 47 clips would sound)"),
    ("neutral_6_anchor", "Neutral international", "Qwen3-TTS VoiceDesign", "take 6: the design take itself"),
    ("uk_m_design", "British", "Qwen3-TTS VoiceDesign", "designed: man, forties, documentary narrator"),
    ("uk_f_design", "British", "Qwen3-TTS VoiceDesign", "designed: woman, thirties, documentary narrator"),
    ("kokoro_bm_george", "British", "Kokoro", "preset bm_george"),
    ("kokoro_bm_fable", "British", "Kokoro", "preset bm_fable"),
    ("kokoro_bm_lewis", "British", "Kokoro", "preset bm_lewis"),
    ("kokoro_bf_emma", "British", "Kokoro", "preset bf_emma"),
    ("us_m_design", "American", "Qwen3-TTS VoiceDesign", "designed: man, forties, tech keynote speaker"),
    ("us_f_design", "American", "Qwen3-TTS VoiceDesign", "designed: woman, thirties, explainer narrator"),
    ("qwen_ryan", "American", "Qwen3-TTS CustomVoice", "preset speaker Ryan"),
    ("qwen_aiden", "American", "Qwen3-TTS CustomVoice", "preset speaker Aiden"),
    ("voxtral_neutral_male", "American", "Voxtral 4B TTS", "preset neutral_male"),
    ("voxtral_casual_male", "American", "Voxtral 4B TTS", "preset casual_male"),
    ("kokoro_am_michael", "American", "Kokoro", "preset am_michael"),
    ("kokoro_am_adam", "American", "Kokoro", "preset am_adam"),
    ("kokoro_am_onyx", "American", "Kokoro", "preset am_onyx"),
    ("kokoro_af_heart", "American", "Kokoro", "preset af_heart"),
]


def save(label: str, audio, sr: int, t0: float) -> None:
    audio = np.asarray(audio, dtype=np.float32)
    sf.write(OUT / f"{label}.wav", audio, sr)
    print(f"{label}: {len(audio) / sr:5.1f}s audio in {time.time() - t0:5.1f}s", flush=True)


def qwen() -> None:
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    m = load_model(model_path="mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-bf16")
    for label, desc in DESIGNS.items():
        t0 = time.time(); mx.random.seed(1)
        save(label, np.concatenate([np.asarray(r.audio) for r in m.generate(text=TEXT, instruct=desc, lang_code="english")]), m.sample_rate, t0)
    m = load_model(model_path="mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-bf16")
    for s in ("ryan", "aiden"):
        t0 = time.time(); mx.random.seed(1)
        save(f"qwen_{s}", np.concatenate([np.asarray(r.audio) for r in m.generate(text=TEXT, voice=s, lang_code="english")]), m.sample_rate, t0)


def voxtral() -> None:
    from mlx_audio.tts.utils import load_model
    m = load_model(model_path="mlx-community/Voxtral-4B-TTS-2603-mlx-bf16")
    for v in ("neutral_male", "casual_male"):
        t0 = time.time()
        save(f"voxtral_{v}", np.concatenate([np.asarray(r.audio) for r in m.generate(text=TEXT, voice=v)]), m.sample_rate, t0)


def kokoro() -> None:
    from kokoro_onnx import Kokoro
    models = ROOT.parent / "presentation" / "tools" / "models"
    k = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    for label, _, model, _ in CATALOGUE:
        if model == "Kokoro":
            v = label.removeprefix("kokoro_")
            t0 = time.time()
            audio, sr = k.create(TEXT, voice=v, speed=1.0, lang="en-gb" if v[0] == "b" else "en-us")
            save(label, audio, sr, t0)


# The voice made like the French one (Michael, 2026-11-18): VoiceDesign from a description, several takes (each
# take is a slightly different man); a take is then frozen as the anchor and cloned by the Base model, sentence by
# sentence, as in record_talk.py. "_anchor" = the design take; "_clone" = what the 47 clips would sound like.
NEUTRAL = ("A native English speaker in his forties with a neutral international accent, neither British nor "
           "American, like a Scandinavian who speaks perfect English with no accent at all. Warm and fairly deep "
           "voice, calm and confident, the clear diction of a conference speaker, unhurried pace.")
ANCHOR_TEXT = ("A small model turns each text into a vector: a point in a space of a few hundred dimensions. "
               "And that projection has one precious property: distance.")
NEUTRAL_SEEDS = (1, 2, 3, 4, 5, 6)


def neutral() -> None:
    import re
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    import talk_voice
    m = load_model(model_path="mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-bf16")
    for k in NEUTRAL_SEEDS:
        t0 = time.time(); mx.random.seed(k)
        a = np.concatenate([np.asarray(r.audio, dtype=np.float32) for r in m.generate(text=ANCHOR_TEXT, instruct=NEUTRAL, lang_code="english")])
        save(f"neutral_{k}_anchor", talk_voice.trim(a, m.sample_rate, pad_s=0.05), m.sample_rate, t0)
    b = load_model(model_path=talk_voice.MODEL)
    sentences = [x for x in re.split(r"(?<=[.?!])\s+", TEXT) if x]
    for k in NEUTRAL_SEEDS:
        t0 = time.time(); parts = []
        for j, sentence in enumerate(sentences):
            mx.random.seed(1000 + j)
            a = np.concatenate([np.asarray(r.audio, dtype=np.float32) for r in b.generate(
                text=sentence, ref_audio=str(OUT / f"neutral_{k}_anchor.wav"), ref_text=ANCHOR_TEXT, lang_code="english")])
            parts += [talk_voice.sentence_clip(a, b.sample_rate), np.zeros(int(b.sample_rate * talk_voice.SENT_GAP_S), dtype=np.float32)]
        save(f"neutral_{k}_clone", np.concatenate(parts[:-1]), b.sample_rate, t0)


def page() -> None:
    import pyloudnorm
    rows = []
    for label, accent, model, what in CATALOGUE:
        f = OUT / f"{label}.wav"
        if not f.exists():
            continue
        a, sr = sf.read(f, dtype="float32")
        a = a if a.ndim == 1 else a.mean(axis=1)
        a = a * 10 ** ((-19 - pyloudnorm.Meter(sr).integrated_loudness(a)) / 20)
        a = np.clip(a, -0.89, 0.89)
        sf.write(OUT / f"{label}_n.wav", a, sr)
        rows.append((accent, label, model, what, len(a) / sr))
    html = ["<!doctype html><meta charset=utf-8><title>English voices</title><style>body{font:15px/1.5 system-ui;"
            "max-width:860px;margin:30px auto;padding:0 16px;background:#111;color:#eee}h2{margin-top:28px}"
            ".r{display:flex;gap:14px;align-items:center;padding:8px 0;border-bottom:1px solid #333}"
            ".n{width:30px;color:#E8FF3A;font:600 15px monospace}.l{width:300px}.l small{color:#999}audio{flex:1}</style>",
            "<h1>English voices for the video</h1><p><b>Neutral international</b>: " + NEUTRAL + " Each take is a "
            "slightly different man: the first player is the take frozen and cloned on the sample text (what the 47 "
            "clips would sound like), the second the design take itself.</p><p>Same text, same loudness (−19 LUFS), "
            "natural speed. Pick one "
            "(or two to compare on a full clip).</p><p><i>" + TEXT + "</i></p>"]
    n = 0
    for accent in ("Neutral international", "British", "American"):
        html.append(f"<h2>{accent}</h2>")
        for acc, label, model, what, d in rows:
            if acc == accent:
                n += 1
                html.append(f"<div class=r><span class=n>{n}</span><span class=l>{model}<br><small>{what} · {d:.1f} s</small></span>"
                            f"<audio controls preload=none src='out/voices_en/{label}_n.wav'></audio></div>")
    (ROOT / "listen_en.html").write_text("\n".join(html), encoding="utf-8")
    print(f"{len(rows)} voices → listen_en.html")


if __name__ == "__main__":
    for step in sys.argv[1:]:
        {"qwen": qwen, "voxtral": voxtral, "neutral": neutral, "kokoro": kokoro, "page": page}[step]()
