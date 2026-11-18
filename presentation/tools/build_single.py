"""The live talk as one portable HTML file.

Usage (from anywhere): python3 presentation/tools/build_single.py
Reads  presentation/index.html and the local scripts and image it loads.
Writes presentation/dist/SECNA_Michael-Dussere_GenAI-Bordeaux_2026-11-19.html: the scripts pasted inline, the notebook's chart embedded.
With --voice: the player version, …_voice_fr-en.html — the video's 47 clips in French and in English
(voice/out/video_fr/ and video_en/, seg_NN.wav) compressed to MP3 with ffmpeg and embedded, the FR / EN
button to choose, and the ambience bed (voice/out/night/chimes.wav, a seamless
3-minute loop) as Opus, which decodes without padding so the loop stays seamless; it opens on a Play button, voice and
ambience on.
"""
import base64
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
html = (HERE / "index.html").read_text(encoding="utf-8")

def embed_images(js):
    def uri(m):
        f = HERE / m.group(1)
        return "data:image/png;base64," + base64.b64encode(f.read_bytes()).decode("ascii")
    return re.sub(r"(img/[\w.-]+\.png)", uri, js)

def inline(m):
    src = m.group(1).split("?")[0]
    js = embed_images((HERE / src).read_text(encoding="utf-8")).replace("</script", "<\\/script")
    return f"<script>/* {src} */\n{js}\n</script>"

out, n = re.subn(r'<script src="([^"]+)"></script>', inline, html)
left = re.findall(r'(?:src|href)="(?!https?:|data:|#)[^"$]+"', out)
assert n and not left, f"still external: {left}"
NAME = "SECNA_Michael-Dussere_GenAI-Bordeaux_2026-11-19.html"   # the talk, the speaker, the meetup, its date
dist = HERE / "dist"
dist.mkdir(exist_ok=True)
if "--voice" in sys.argv:
    # the video's voice, in French and in English: 47 clips each
    voices, tmp = {}, dist / ".voice"
    for lang in ("fr", "en"):
        folder = HERE.parent / "voice" / "out" / f"video_{lang}"
        clips = sorted(folder.glob("seg_*.wav"))
        assert len(clips) == 47, f"{len(clips)} clips in {folder}, 47 expected"
        (tmp / lang).mkdir(parents=True, exist_ok=True)
        voices[lang] = {}
        for w in clips:
            m = tmp / lang / (w.stem + ".mp3")
            if not m.exists() or m.stat().st_mtime < w.stat().st_mtime:
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(w), "-ac", "1", "-c:a", "libmp3lame", "-b:a", "56k", str(m)], check=True)
            voices[lang][int(w.stem.split("_")[1])] = "data:audio/mpeg;base64," + base64.b64encode(m.read_bytes()).decode("ascii")
    bed_wav = HERE.parent / "voice" / "out" / "night" / "chimes.wav"
    bed = tmp / "bed.ogg"
    if not bed.exists() or bed.stat().st_mtime < bed_wav.stat().st_mtime:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(bed_wav), "-c:a", "libopus", "-b:a", "96k", str(bed)], check=True)
    bed_uri = "data:audio/ogg;base64," + base64.b64encode(bed.read_bytes()).decode("ascii")
    out = out.replace("<script>/* data.js */", "<script>window.SECNA_VOICES = " + json.dumps(voices) + ";\nwindow.SECNA_BED = " + json.dumps(bed_uri) + ";</script>\n<script>/* data.js */", 1)
    assert "window.SECNA_VOICES" in out
    NAME = NAME.replace(".html", "_voice_fr-en.html")
    print(f"{len(voices['fr'])} French and {len(voices['en'])} English clips, and the ambience bed, embedded")
(dist / NAME).write_text(out, encoding="utf-8")
print(f"{n} scripts inlined → {dist / NAME} ({len(out.encode('utf-8')) / 1024:.0f} KB)")
