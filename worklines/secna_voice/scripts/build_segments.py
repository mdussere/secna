"""The talk's text, cut into one segment per pause of the live page.

Usage (from the workline root): python3 scripts/build_segments.py [text.md] [out.json] [lang]
       default: the talk's text → segments.json; the video's: ../../references/0311_01_video_text_fr.md
       segments_video_fr.json fr, ../../references/0311_02_video_text_en.md segments_video_en.json en
Reads  ../../references/0309_01_speaker_text_fr.md  (the speaker's text: a **[clic]** ends each segment)
       stops.json  (the page's pauses: window.STOPS and window.SEQS, dumped from presentation/long/index.html)
Writes segments.json: for each pause n, the text said on it, where it sits in the talk, how long the screen
animates before it holds, and a hash of the text (to re-record only what changed).
"""
import hashlib
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
args = sys.argv[1:]
TEXT = (HERE / args[0]).resolve() if args else HERE.parent.parent / "references" / "0309_01_speaker_text_fr.md"
OUT = HERE / (args[1] if len(args) > 1 else "segments.json")
LANG = args[2] if len(args) > 2 else "fr"
WPM = 140 if LANG == "fr" else 150  # a posed speaking rate, for the estimate only

src = TEXT.read_text(encoding="utf-8")
body = src[src.index("## 1. "):]
stops = json.loads((HERE / "stops.json").read_text(encoding="utf-8"))
seq = {s["id"]: s for s in stops["seqs"]}

segments = []
for raw in body.split("**[clic]**"):
    paragraphs, screens, cur = [], [], []
    for line in raw.split("\n"):
        t = line.strip()
        if t.startswith("[") and t.endswith("]"):
            screens.append(t[1:-1].replace("*", ""))
            t = ""
        if not t or t.startswith("#") or t.startswith(">") or t == "---":
            if cur:
                paragraphs.append(" ".join(cur))
                cur = []
            continue
        cur.append(t)
    if cur:
        paragraphs.append(" ".join(cur))
    if paragraphs:
        segments.append((paragraphs, screens))

assert len(segments) == len(stops["stops"]), f"{len(segments)} segments in the text, {len(stops['stops'])} pauses on the page"
out, prev = [], 0.0
for (paragraphs, screens), st in zip(segments, stops["stops"]):
    text = "\n\n".join(paragraphs)
    words = len(re.findall(r"[\w’'-]+", text))
    s = seq[st["sid"]]
    out.append({
        "n": st["n"], "file": f"seg_{st['n']:02d}.wav", "part": s["part"], "sequence": st["sid"], "sequence_title": s["title"],
        "ends_on_step": s["lines"][st["line"]], "screen": screens,
        "animation_s": round(st["t"] - prev, 2), "words": words, "estimated_s": round(words / WPM * 60, 1),
        "sha1": hashlib.sha1(text.encode("utf-8")).hexdigest()[:12], "paragraphs": paragraphs,
    })
    prev = st["t"]
OUT.write_text(json.dumps({"source": "references/" + TEXT.name, "language": LANG, "segments": out}, ensure_ascii=False, indent=1), encoding="utf-8")
tot = sum(o["words"] for o in out)
print(f"{len(out)} segments · {tot} words · about {tot / WPM:.1f} min at {WPM} words/min → {OUT.name}")
short = [o["n"] for o in out if o["estimated_s"] < o["animation_s"]]
print("segments shorter than the animation before their pause:", short or "none")
