"""Voice the talk: script.md → one audio clip per sequence, and voice/script.js (text, cues, durations).

Every line of narration is rendered on its own with Kokoro (ONNX, local, CPU), so the time at which it
starts is a cue the presentation's animations use. A pronunciation table fixes the words the French
phonemizer reads wrong (English names inside French). Unchanged lines come from a cache.

  tools/.venv/bin/python -I tools/voice.py              # render (only the lines that changed)
  tools/.venv/bin/python -I tools/voice.py --estimate   # no audio: timings estimated from the text

Setup, once (from presentation/long):
  uv venv --python 3.12 tools/.venv && uv pip install --python tools/.venv/bin/python kokoro-onnx soundfile
  tools/models/: kokoro-v1.0.onnx and voices-v1.0.bin, from github.com/thewh1teagle/kokoro-onnx (release model-files-v1.1)
Needs ffmpeg on the PATH (WAV → AAC).
"""
import hashlib
import json
import pathlib
import re
import subprocess
import sys

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent.parent          # presentation/long
SCRIPT, OUT = HERE / "script.md", HERE / "voice"
CACHE = OUT / ".cache"
VOICE, SPEED, LANG, SR = "ff_siwis", 0.85, "fr-fr", 24000
LEAD, GAP, TAIL = 0.25, 0.34, 0.7                               # seconds of silence

LEXICON = {  # word → phonemes (Kokoro's IPA): English names said as a French developer says them
    "LangChain": "lˈæŋtʃeɪn", "LangGraph": "lˈæŋɡɹæf", "LangSmith Engine": "lˈæŋsmɪθ ˈɛndʒɪn",
    "LangSmith": "lˈæŋsmɪθ", "Summarise": "sˈʌməɹaɪz",
    "Aggregate": "ˈæɡɹɪɡət", "Cluster": "klˈœstœʁ", "clusters": "klˈœstœʁ", "cluster": "klˈœstœʁ",
    "data science": "dˈeɪtə sˈaɪəns", "prompt": "pʁˈɔmpt", "checkpoints": "tʃˈɛkpɔɪnts",
    "checkpoint": "tʃˈɛkpɔɪnt", "Intercom": "ˈɪntəkɒm", "issues": "ˈɪʃuːz", "issue": "ˈɪʃuː", "IA": "iˈa",
    "GitLab Duo": "ɡˈɪtlæb dˈuːoʊ", "Graphify": "ɡɹˈæfɪfaɪ", "DeepWiki": "dˈiːpwɪki", "GraphRAG": "ɡɹˈæfɹæɡ",
    "Microsoft Research": "mˈaɪkɹəsɒft ɹɪsˈɜːtʃ", "commits": "kəmˈɪts", "logs": "lˈɔɡ", "stores": "stˈɔʁ",
    "HERCULES": "ɛʁkylˈɛs", "Open SWE": "ˈoʊpən swˈiː",
}
PATTERN = re.compile(r"(?<![\w-])(" + "|".join(re.escape(w) for w in sorted(LEXICON, key=len, reverse=True)) + r")(?![\w-])")


def parse(text):
    """Sequences in order: id, title, part, stage notes, narration lines."""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    parts, seqs, part = [], [], 0
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("# "):
            part += 1
            parts.append({"n": part, "title": line[2:].split("·", 1)[-1].strip()})
        elif line.startswith("## "):
            sid, title = (s.strip() for s in line[3:].split("·", 1))
            seqs.append({"id": sid, "title": title, "part": part, "notes": [], "lines": []})
        elif line.startswith(">"):
            seqs[-1]["notes"].append(line[1:].strip())
        else:
            seqs[-1]["lines"].append({"text": line})
    return parts, seqs


def phonemes(k, text):
    out, pos = [], 0
    for m in PATTERN.finditer(text):
        if m.start() > pos:
            out.append(k.tokenizer.phonemize(text[pos:m.start()], LANG))
        out.append(LEXICON[m.group(1)])
        pos = m.end()
    if pos < len(text):
        out.append(k.tokenizer.phonemize(text[pos:], LANG))
    return " ".join(p.strip() for p in out if p.strip())


def render_line(k, text):
    ph = phonemes(k, text)   # the cache follows what is actually said: a lexicon change re-renders only its lines
    key = hashlib.sha1(json.dumps([ph, VOICE, SPEED], ensure_ascii=False).encode()).hexdigest()[:16]
    cached = CACHE / f"{key}.npy"
    if cached.exists():
        return np.load(cached)
    audio, sr = k.create(ph, voice=VOICE, speed=SPEED, lang=LANG, is_phonemes=True)
    assert sr == SR, sr
    audio = audio.astype(np.float32)
    np.save(cached, audio)
    return audio


def main():
    estimate = "--estimate" in sys.argv
    parts, seqs = parse(SCRIPT.read_text(encoding="utf-8"))
    OUT.mkdir(exist_ok=True)
    CACHE.mkdir(exist_ok=True)
    k = None
    if not estimate:
        from kokoro_onnx import Kokoro
        models = HERE / "tools" / "models"
        k = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    total = 0.0
    for s in seqs:
        t, chunks = LEAD, [np.zeros(int(LEAD * SR), np.float32)]
        for i, line in enumerate(s["lines"]):
            if estimate:
                d = len(line["text"].split()) / 2.55 + 0.2
            else:
                a = render_line(k, line["text"])
                d = len(a) / SR
                chunks += [a, np.zeros(int((GAP if i < len(s["lines"]) - 1 else TAIL) * SR), np.float32)]
            line["t"], line["d"] = round(t, 3), round(d, 3)
            t += d + (GAP if i < len(s["lines"]) - 1 else TAIL)
        s["dur"] = round(t, 3)
        total += t
        if not estimate:
            import soundfile as sf
            wav = CACHE / f"{s['id']}.wav"
            sf.write(wav, np.concatenate(chunks), SR)
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-c:a", "aac", "-b:a", "96k",
                            str(OUT / f"{s['id']}.m4a")], check=True)
            s["audio"] = f"voice/{s['id']}.m4a"
        words = sum(len(l["text"].split()) for l in s["lines"])
        print(f"{s['id']:10s} part {s['part']} · {len(s['lines']):2d} cues · {words:3d} words · {s['dur']:6.1f} s")
    meta = {"voice": f"Kokoro-82M · {VOICE} · speed {SPEED}" if not estimate else "estimated from the text",
            "parts": parts, "seqs": seqs, "total": round(total, 1)}
    (OUT / "script.js").write_text("// Generated by tools/voice.py from script.md — do not edit.\n"
                                   "window.SECNA_SCRIPT=" + json.dumps(meta, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"total {total / 60:.1f} min · {len(seqs)} sequences → voice/script.js")


if __name__ == "__main__":
    main()
