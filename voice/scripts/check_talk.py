"""Check the recorded voice: Whisper on out/video_<lang>/seg_NN.wav vs its segments → WER + names; writes check.json.

Usage (from voice/): .venv/bin/python scripts/check_talk.py [--lang en] [n ...]
Numbers are spelled out on both sides (Whisper writes « 48 », the text « quarante-huit »), so only real
misreadings count.
"""
import argparse
import json
import re
import sys
import unicodedata

from num2words import num2words

from mlx_audio.stt.utils import load_model

from talk_voice import ROOT

OUT = ROOT / "out" / "video_fr"
SEGMENTS = ROOT / "segments_video_fr.json"
LANG = "fr"
# Names from the brief's pronunciation table: (as written in the text, accepted spellings in the transcript)
NAMES = {
    "SECNA": ["secna", "sekna", "sekhna"], "Clio": ["clio"], "Claude": ["claude"], "Urania": ["urania", "urannia"],
    "Intercom": ["intercom"], "LangChain": ["langchain", "lang chain"], "LangSmith": ["langsmith", "lang smith"],
    "GitHub": ["github", "git hub"], "GitLab Duo": ["gitlab duo", "git lab duo"], "Graphify": ["graphify"],
    "DeepWiki": ["deepwiki", "deep wiki"], "k-means": ["k-means", "kmeans", "k means"],
    "gpt-6-luna": ["gpt-6 luna", "gpt-6-luna", "gpt 6 luna", "gpt6 luna", "gpt-6luna"], "RAG": ["rag"],
    "LLM": ["llm"], "API": ["api"], "QR": ["qr"],
}


def spell_numbers(s: str) -> str:
    s = re.sub(r"(\d)[  .](\d{3})\b", r"\1\2", s)                          # 15 000 → 15000
    s = re.sub(r"(\d+),(\d+)", r"\1 virgule \2", s) if LANG == "fr" else re.sub(r"(\d),(\d{3})\b", r"\1\2", s)
    s = s.replace("%", " pour cent" if LANG == "fr" else " percent").replace("$", " dollars ")
    return re.sub(r"\d+", lambda m: " " + num2words(int(m.group()), lang=LANG) + " ", s)


def words(s: str) -> list[str]:
    s = unicodedata.normalize("NFKC", spell_numbers(s).lower()).replace("’", "'").replace("-", " ")
    return re.sub(r"[^\w' ]", " ", s).split()


def wer(ref: str, hyp: str) -> float:
    r, h = words(ref), words(hyp)
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
    return d[-1] / len(r)


def main() -> None:
    global OUT, SEGMENTS, LANG
    ap = argparse.ArgumentParser()
    ap.add_argument("n", type=int, nargs="*")
    ap.add_argument("--segments")
    ap.add_argument("--out")
    ap.add_argument("--lang", choices=["fr", "en"], default="fr")
    args = ap.parse_args()
    LANG = args.lang
    SEGMENTS = ROOT / (args.segments or f"segments_video_{LANG}.json")
    OUT = ROOT / "out" / (args.out or f"video_{LANG}")
    only = set(args.n)
    segs = [s for s in json.loads(SEGMENTS.read_text())["segments"] if not only or s["n"] in only]
    path = OUT / "check.json"
    report = {e["n"]: e for e in json.loads(path.read_text())} if path.exists() else {}
    stt = load_model("mlx-community/whisper-large-v3-turbo-asr-fp16")
    for s in segs:
        text = " ".join(s["paragraphs"])
        hyp = stt.generate(str(OUT / s["file"]), language=LANG).text.strip()
        low = hyp.lower()
        missing = [n for n, ok in NAMES.items()
                   if re.search(r"(?<![\w-])" + re.escape(n) + r"(?![\w-])", text) and not any(o in low for o in ok)]
        report[s["n"]] = {"n": s["n"], "wer": round(wer(text, hyp), 3), "names_missing": missing, "transcript": hyp}
        flag = "  <-- CHECK" if report[s["n"]]["wer"] > 0.05 or missing else ""
        print(f"seg_{s['n']:02d}  WER {report[s['n']]['wer']:5.1%}  {missing or ''}{flag}", flush=True)
    path.write_text(json.dumps([report[k] for k in sorted(report)], ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
