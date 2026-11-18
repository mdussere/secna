"""Local preset male voices (no cloning): Voxtral and Qwen3-TTS, on the same talk paragraphs.

Usage (from the workline root): .venv/bin/python scripts/presets.py [voxtral|qwen_custom|qwen_design ...]
Writes out/presets/<voice>_<test>.wav and prints generation time per clip.
"""
import sys
import time
from pathlib import Path

import numpy as np

from mlx_audio.audio_io import write as audio_write
from mlx_audio.tts.utils import load_model

OUT = Path(__file__).resolve().parent.parent / "out"
PRESETS_OUT = OUT / "presets"
# The test paragraphs of the voice choice (2026-11-17)
TESTS = {
    "t1_embed": ("fr", "E, comme Embed. C'est exactement ce qu'on fait déjà quand on fait du RAG. Un petit "
                       "modèle transforme chaque texte en un vecteur, un point dans un espace à quelques "
                       "centaines de dimensions. Et cette projection a une propriété précieuse : elle crée "
                       "une distance. Deux textes qui disent la même chose, même avec des mots différents, "
                       "atterrissent l'un à côté de l'autre. « Mon colis n'est jamais arrivé », « J'attends "
                       "toujours mon paquet » : deux points voisins."),
    "t3_notebook": ("fr", "Et combien ça m'a coûté ? J'ai utilisé un petit modèle, GPT-6 Luna. Le nommage, "
                          "c'est environ un million de tokens, treize centimes. L'agrégation, deux "
                          "centimes. Au total : quinze centimes pour quinze mille pull requests."),
    "t4_en": ("en", "Data science finds the structure. The LLM gives it meaning. And the bill follows the "
                    "clusters, not the number of documents."),
}
PRESETS_OUT.mkdir(parents=True, exist_ok=True)

TEST_IDS = ["t1_embed", "t3_notebook", "t4_en"]
QWEN_LANG = {"fr": "french", "en": "english"}

DESIGN = ("A French man in his forties, warm and fairly deep voice, calm and confident, "
          "the clear diction of a conference speaker, unhurried pace.")

# family -> (repo, [(voice label, generate kwargs builder)])
FAMILIES = {
    "voxtral": ("mlx-community/Voxtral-4B-TTS-2603-mlx-bf16", [
        (f"voxtral-{v}", (lambda v: lambda lang: {"voice": v})(v))
        for v in ("fr_male", "neutral_male", "casual_male")]),
    "qwen_custom": ("mlx-community/Qwen3-TTS-12Hz-1.7B-CustomVoice-bf16", [
        (f"qwen-{s}", (lambda s: lambda lang: {"voice": s, "lang_code": QWEN_LANG[lang]})(s))
        for s in ("ryan", "aiden")]),
    "qwen_design": ("mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-bf16", [
        ("qwen-design", lambda lang: {"instruct": DESIGN, "lang_code": QWEN_LANG[lang]})]),
}


def run(family: str) -> None:
    repo, voices = FAMILIES[family]
    model = load_model(model_path=repo)
    for label, kw in voices:
        for test in TEST_IDS:
            lang, text = TESTS[test]
            t0 = time.time()
            chunks = [np.asarray(r.audio) for r in model.generate(text=text, **kw(lang))]
            audio = np.concatenate(chunks)
            path = PRESETS_OUT / f"{label}_{test}.wav"
            audio_write(str(path), audio, model.sample_rate)
            print(f"{path.name}: {len(audio) / model.sample_rate:5.1f}s audio in "
                  f"{time.time() - t0:5.1f}s", flush=True)


if __name__ == "__main__":
    for f in sys.argv[1:] or list(FAMILIES):
        run(f)
