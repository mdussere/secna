"""Shared voice setup for the talk recording: model, reference clip, respellings, audio post-processing.

The voice is the one Michael chose after the bake-off (2026-11-17): Qwen3-TTS 1.7B **VoiceDesign** with the
DESIGN description in presets.py. VoiceDesign re-invents the voice on every call, so to keep one man across
47 files the voice is frozen: an excerpt of the very design clip he heard (out/presets/qwen-design_t1_embed.wav)
is the reference, and every segment is cloned from it with Qwen3-TTS 1.7B Base.
"""
import re
from pathlib import Path

import numpy as np
import pyloudnorm

ROOT = Path(__file__).resolve().parent.parent          # voice/
MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16"
VOICE = "qwen3-tts VoiceDesign (presets.DESIGN), frozen as ref/design_anchor.wav"
REF_AUDIO = ROOT / "ref" / "design_anchor.wav"         # 4.45–16.40 s of out/presets/qwen-design_t1_embed.wav
REF_TEXT = ("Un petit modèle transforme chaque texte en un vecteur, un point dans un espace à quelques "
            "centaines de dimensions. Et cette projection a une propriété précieuse. Elle crée une distance.")
LANG = "french"
# The English voice (Michael, 2026-11-18: take 3 of scripts/voices_en.py neutral): VoiceDesign, "a native English
# speaker in his forties with a neutral international accent… calm and confident, clear diction of a conference
# speaker, unhurried pace", frozen as ref/design_anchor_en.wav (the whole take) and cloned with the same Base model.
VOICE_EN = "qwen3-tts VoiceDesign (voices_en.NEUTRAL, take 3), frozen as ref/design_anchor_en.wav"
REF_AUDIO_EN = ROOT / "ref" / "design_anchor_en.wav"
REF_TEXT_EN = ("A small model turns each text into a vector: a point in a space of a few hundred dimensions. "
               "And that projection has one precious property: distance.")
TARGET_LUFS, PEAK_DBFS = -19.0, -1.0
EDGE_S, SENT_GAP_S, PARA_GAP_S = 0.15, 0.35, 0.7
TEMPO = 1.02         # 1.2× the 0.85 take = about the model's natural pace (Michael, 2026-11-17: « .2, parfait »)

# Respellings sent to the model only (the segments files are never changed). Order matters: longest first.
RESPELL = [
    (r"gpt-6-luna", "gé-pé-té six Luna"),
    (r"k-means", "ka-mînz"),
    (r"\bLangChain\b", "Laingue-tchéïne"),   # tested: as written it comes out « LongChain »
    (r"\bSECNA\b", "Secna"),
    (r"\bLLMs?\b", "élélème"),   # one quick word; "elle-elle-ème" came out spelled with pauses (scripts/abbrev_try.py)
    (r"\bAPI\b", "a-pé-i"),
    (r"\bIA\b", "i-a"),
    (r"\bQR code\b", "kuère-code"),   # "ku-erre" was heard « coup R-code »
    (r"\bRAG\b", "rag"),
    (r"\b2024\b", "deux mille vingt-quatre"),
    (r"\bcents\b", "sènnte"),   # tested: "cents"/"cennts" come out as « cent » (hundred)
    # A letter of the recipe standing alone (« S, comme Summarise », « l'étape S », « N et A »), never C'est.
    (r"(?<![\w'’-])S(?![\w'’-])", "Èsse"),
    (r"(?<![\w'’-])E(?![\w'’-])", "Euh"),
    (r"(?<![\w'’-])C(?![\w'’-])", "Cé"),
    (r"(?<![\w'’-])N(?![\w'’-])", "Ènne"),
]


# English (the video's English voice, 2026-11-18): the same voice, lang_code "english". A letter of the recipe
# is respelled only where it stands for a step; "A" is also the article ("A twenty-turn conversation").
RESPELL_EN = [
    (r"gpt-6-luna", "G P T six Luna"),
    (r"k-means", "kay-means"),
    (r"\bSECNA\b", "Secna"),
    (r"\bRAG\b", "rag"),
    (r"\b2024\b", "twenty twenty-four"),
    (r"\bA, for\b", "Ay, for"),
    (r"\bN and A\b", "N and Ay"),
    (r"\bthe A step\b", "the Ay step"),
]
LANG_CODE = {"fr": "french", "en": "english"}


def respell(text: str, lang: str = "fr") -> str:
    for pat, rep in (RESPELL if lang == "fr" else RESPELL_EN):
        text = re.sub(pat, rep, text)
    return text


def _frame_db(audio: np.ndarray, sr: int, win_s: float = 0.01) -> np.ndarray:
    n = int(sr * win_s)
    frames = audio[: len(audio) // n * n].reshape(-1, n)
    return 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9)


def trim(audio: np.ndarray, sr: int, pad_s: float = 0.0, rel_db: float = 40.0) -> np.ndarray:
    """Cut leading/trailing silence (frames more than rel_db below the loudest), keep pad_s on each side."""
    db = _frame_db(audio, sr)
    voiced = np.where(db > db.max() - rel_db)[0]
    if len(voiced) == 0:
        return audio
    n = int(sr * 0.01)
    start = max(0, voiced[0] * n - int(sr * pad_s))
    end = min(len(audio), (voiced[-1] + 1) * n + int(sr * pad_s))
    return audio[start:end]


def fade(audio: np.ndarray, sr: int, s: float = 0.01) -> np.ndarray:
    """Short linear fade-in and fade-out, so no join or edge clicks."""
    n = min(int(sr * s), len(audio) // 2)
    ramp = np.linspace(0.0, 1.0, n, dtype=np.float32)
    out = audio.astype(np.float32).copy()
    out[:n] *= ramp
    out[len(out) - n:] *= ramp[::-1]
    return out


def sentence_clip(audio: np.ndarray, sr: int) -> np.ndarray:
    """One sentence as generated → silence cut, its natural decay kept (60 ms), faded edges."""
    return fade(trim(audio, sr, pad_s=0.06, rel_db=45.0), sr, 0.005)


def with_edges(audio: np.ndarray, sr: int) -> np.ndarray:
    """Whole segment → silence cut, faded, then EDGE_S of true silence on each side."""
    pad = np.zeros(int(sr * EDGE_S), dtype=np.float32)
    return np.concatenate([pad, fade(trim(audio, sr, pad_s=0.02, rel_db=45.0), sr, 0.01), pad])


def split_sentences(paragraph: str) -> list[str]:
    """Sentences, cut after . ? ! … followed by a space (a quote « … » stays with its sentence)."""
    return [s for s in re.split(r"(?<=[.?!…])\s+(?=[^\s»])", paragraph.strip()) if s]


def ffmpeg_filter(audio: np.ndarray, sr: int, filt: str) -> np.ndarray:
    """Run an ffmpeg audio filter on a float mono array, same sample rate out."""
    import subprocess
    out = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "pipe:0",
                          "-af", filt, "-f", "f32le", "-ar", str(sr), "-ac", "1", "pipe:1"],
                         input=audio.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


def normalise(audio: np.ndarray, sr: int) -> tuple[np.ndarray, float, float]:
    """Gain to TARGET_LUFS, then a peak limiter at PEAK_DBFS; a second pass corrects the limiter's loss.
    Returns audio, lufs, peak."""
    meter = pyloudnorm.Meter(sr)
    lim = 10 ** (PEAK_DBFS / 20)
    out = audio
    for _ in range(3):
        out = out * 10 ** ((TARGET_LUFS - meter.integrated_loudness(out)) / 20)
        if np.abs(out).max() <= lim:
            break
        out = ffmpeg_filter(out, sr, f"alimiter=limit={lim * 0.98:.4f}:attack=2:release=40:level=disabled")
    out = np.clip(out, -lim, lim)
    return out, meter.integrated_loudness(out), 20 * np.log10(np.abs(out).max())


def tighten(audio: np.ndarray, sr: int, floor_dbfs: float = -50.0) -> np.ndarray:
    """Final pass on the normalised file: exactly EDGE_S before the first and after the last frame above
    floor_dbfs (absolute), so every file has the same 0.15 s edges."""
    db = _frame_db(audio, sr)
    voiced = np.where(db > floor_dbfs)[0]
    if len(voiced) == 0:
        return audio
    n = int(sr * 0.01)
    core = fade(audio[voiced[0] * n:(voiced[-1] + 1) * n], sr, 0.005)
    pad = np.zeros(int(sr * EDGE_S), dtype=np.float32)
    return np.concatenate([pad, core, pad])
