"""The talk's sound: the narration, a sound ambiance under it, the mix, and its loudness check.

  tools/.venv/bin/python -I tools/sound.py      (from presentation/long, after tools/voice.py and
                                                 `node capture.mjs events`)

Writes render/voice.wav, render/ambience.wav (as heard: ducked), render/mix.wav (48 kHz, stereo, 24-bit),
and render/analysis.npz + render/analysis.json — loudness measured by ffmpeg's EBU R128 scanner — for
tools/sound_plot.py.

The ambiance is sound design, not music: no melody, no chord, no rhythm. Coloured noise only (night air,
wind, a low rumble, a room tone for the notebook), shaped in time by the talk's events (the cut to the
notebook, the cells that run, the notebook receding into the night, the factory's traffic), and ducked
under the voice. Deterministic: the same inputs give the same file.
"""
import json
import pathlib
import re
import subprocess

import numpy as np
import soundfile as sf

HERE = pathlib.Path(__file__).resolve().parent.parent
VOICE, RENDER = HERE / "voice", HERE / "render"
SR, VSR, CR = 48000, 24000, 100                    # audio rate, Kokoro's rate, control rate (envelopes)
VOICE_LUFS, BED_LUFS = -16.0, -28.0                # speech; the ambiance bed before ducking
DUCK_DB, TAIL = -12.0, 2.5                         # ambiance under speech; seconds held after the end
CEIL = 10 ** (-1.5 / 20)                           # sample-peak ceiling of the mix
rng = np.random.default_rng(20261119)


def ebur128(path, frames=False):
    """Integrated loudness, loudness range, true peak — and the momentary/short-term curves (10 Hz)."""
    err = subprocess.run(["ffmpeg", "-nostats", "-hide_banner", "-i", str(path), "-filter_complex",
                          "ebur128=peak=true" + (":framelog=info" if frames else ":framelog=quiet"), "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    summary = err[err.rfind("Summary:"):]
    I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summary).group(1))
    LRA = float(re.search(r"LRA:\s+(-?[\d.]+) LU", summary).group(1))
    tp = re.search(r"Peak:\s+(-?[\d.]+|-inf) dBFS", summary)
    out = {"I": I, "LRA": LRA, "TP": float(tp.group(1)) if tp else float("nan")}
    if frames:
        rows = re.findall(r"t:\s*([\d.]+)\s+TARGET:\S+ LUFS\s+M:\s*(-?[\d.]+)\s+S:\s*(-?[\d.]+)", err)
        out["curve"] = np.array(rows, float)                     # columns: t, M, S
    return out


def write(path, x):
    sf.write(path, x, SR, subtype="PCM_24")


def follow(level_db, att, rel, rate):
    """Attack/release smoothing of a level curve (dB), at `rate` frames per second."""
    a, r = 1 - np.exp(-1 / (att * rate)), 1 - np.exp(-1 / (rel * rate))
    out = np.empty_like(level_db)
    out[0] = level_db[0]
    for i in range(1, len(level_db)):
        x = level_db[i]
        out[i] = out[i - 1] + (x - out[i - 1]) * (a if x > out[i - 1] else r)
    return out


def compress(v, thr=-28.0, ratio=2.5):
    """A gentle speech compressor (5 ms RMS, 10 ms attack, 150 ms release)."""
    hop = SR // 200
    nfr = len(v) // hop + 1
    pad = np.pad(v, (0, nfr * hop - len(v)))
    lvl = 10 * np.log10(np.mean(pad.reshape(nfr, hop) ** 2, axis=1) + 1e-12)
    env = follow(lvl, .01, .15, 200)
    gr = -(1 - 1 / ratio) * np.maximum(0, env - thr)
    g = 10 ** (np.interp(np.arange(len(v)), np.arange(nfr) * hop + hop / 2, gr) / 20)
    return (v * g).astype(np.float32)


def limit(v, ceil_db=-2.0):
    """A peak limiter: 5 ms blocks, one block of look-ahead, 80 ms release."""
    hop = SR // 200
    nfr = len(v) // hop + 1
    peak = np.abs(np.pad(v, (0, nfr * hop - len(v)))).reshape(nfr, hop).max(axis=1)
    need = np.minimum(1, 10 ** (ceil_db / 20) / np.maximum(peak, 1e-9))
    need = np.minimum(need, np.concatenate([need[1:], [1]]))          # one frame of look-ahead
    lim = np.minimum(need, 10 ** (follow(20 * np.log10(need), .0001, .08, 200) / 20))
    return (v * np.interp(np.arange(len(v)), np.arange(nfr) * hop + hop / 2, lim)).astype(np.float32)


# ── colour, filters ──────────────────────────────────────────────────────────────────────────────────
def shape(lo=None, hi=None, tilt=1.0, n=2):
    """Magnitude response: a spectral tilt (1 = pink, 2 = brown) inside Butterworth-like band edges."""
    def m(f):
        f = np.maximum(f, 1.0)
        g = f ** (-tilt / 2)
        if lo:
            g = g / np.sqrt(1 + (lo / f) ** (2 * n))
        if hi:
            g = g / np.sqrt(1 + (f / hi) ** (2 * n))
        return g
    return m


def noise(n, mag, block=1 << 19, ov=1 << 15):
    """Continuous coloured noise of n samples, unit RMS: FFT-shaped blocks, equal-power crossfades."""
    hop, f = block - ov, np.fft.rfftfreq(block, 1 / SR)
    m = mag(f)
    win = np.ones(block, np.float32)
    th = np.linspace(0, np.pi / 2, ov, dtype=np.float32)
    win[:ov], win[-ov:] = np.sin(th), np.cos(th)
    out = np.zeros(n + block, np.float32)
    for pos in range(0, n, hop):
        x = np.fft.irfft(m * np.exp(2j * np.pi * rng.random(len(f))), block).astype(np.float32)
        out[pos:pos + block] += x * win
    out = out[:n]
    return out / (np.sqrt(np.mean(out ** 2)) + 1e-12)


def burst(dur, mag):
    """A short noise buffer, unit RMS (for the accents)."""
    n = int(dur * SR)
    x = np.fft.irfft(mag(np.fft.rfftfreq(n, 1 / SR)) * np.exp(2j * np.pi * rng.random(n // 2 + 1)), n).astype(np.float32)
    return x / (np.sqrt(np.mean(x ** 2)) + 1e-12)


# ── envelopes at the control rate ─────────────────────────────────────────────────────────────────────
class Env:
    def __init__(self, total):
        self.t = np.arange(int(total * CR) + 1) / CR

    def pts(self, points):
        """Piecewise-linear gain through (time, gain) points; flat beyond the ends."""
        t, g = zip(*points)
        return np.interp(self.t, t, g).astype(np.float32)

    def audio(self, e, n):
        return np.interp(np.arange(n) / SR, self.t, e).astype(np.float32)


def place(dst, x, t0, gain=1.0):
    a = int(round(t0 * SR))
    if a < 0:                       # starts before the beginning: keep what falls inside
        x, a = x[-a:], 0
    if a >= len(dst) or not len(x):
        return
    b = min(len(dst), a + len(x))
    dst[a:b] += gain * x[:b - a]


def swell(rise, fall, mag_dark, mag_bright, bright=1.0):
    """Noise that grows and brightens, then decays: a breath of air, no pitch."""
    n = int((rise + fall) * SR)
    d, b = burst(rise + fall, mag_dark), burst(rise + fall, mag_bright)
    t = np.arange(n) / SR
    env = np.where(t < rise, (t / rise) ** 2, np.exp(-(t - rise) / (fall / 3)))
    br = np.where(t < rise, t / rise, np.exp(-(t - rise) / (fall / 4))) * bright
    return (env * ((1 - .6 * br) * d + br * b)).astype(np.float32)


def thump():
    """The cut: a short, low, unpitched knock."""
    n = int(.9 * SR)
    t = np.arange(n) / SR
    return (burst(.9, shape(35, 140, tilt=1)) * np.minimum(1, t / .004) * np.exp(-t / .22)).astype(np.float32)


def click():
    """A key press: a few milliseconds of bright noise on a soft low body."""
    n = int(.06 * SR)
    t = np.arange(n) / SR
    hi = burst(.06, shape(1800, 7000, tilt=.5)) * np.exp(-t / .0025)
    lo = burst(.06, shape(140, 500, tilt=1)) * np.exp(-t / .008)
    return (.75 * hi + .5 * lo).astype(np.float32)


def dust(dur=2.2):
    """S dissolves: a crackle that falls from bright to dark."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    hiss_b, hiss_d = burst(dur, shape(2500, 11000, tilt=.5)), burst(dur, shape(300, 2200, tilt=1))
    fall = t / dur
    grains = np.zeros(n, np.float32)
    for k in rng.integers(0, n, int(dur * 140)):
        grains[k] = rng.choice([-1, 1]) * rng.random()
    grains = np.convolve(grains, np.exp(-np.arange(int(.003 * SR)) / (.0007 * SR)), mode="same")
    env = np.minimum(1, t / .08) * np.exp(-t / (dur / 2.5))
    return (env * ((1 - fall) * hiss_b + fall * .8 * hiss_d + 2.2 * grains)).astype(np.float32)


def main():
    s = (VOICE / "script.js").read_text(encoding="utf-8")
    sc = json.loads(s[s.index("=") + 1:s.rindex(";")])
    ev = json.loads((RENDER / "events.json").read_text(encoding="utf-8"))
    Q = {q["id"]: q for q in ev["seqs"]}
    cue = lambda sid, k, d=0.0: Q[sid]["cues"][k] + d
    start, end = (lambda sid: Q[sid]["off"]), (lambda sid: Q[sid]["off"] + Q[sid]["dur"])
    DUR = ev["dur"]
    TOT = DUR + TAIL
    n = int(TOT * SR)
    E = Env(TOT)
    P2, OUT, P3 = start("nb0"), cue("nb12", 1), start("factory")

    # ── the narration: the rendered clips at their place on the clock, normalised ──
    v24 = np.zeros(int(TOT * VSR), np.float32)
    off = 0.0
    for q in sc["seqs"]:
        w, sr = sf.read(VOICE / ".cache" / f"{q['id']}.wav", dtype="float32")
        assert sr == VSR and abs(len(w) / VSR - q["dur"]) < .05, (q["id"], len(w) / VSR, q["dur"])
        place_at = int(round(off * VSR))
        v24[place_at:place_at + len(w)] += w[:len(v24) - place_at]
        off += q["dur"]
    RENDER.mkdir(exist_ok=True)
    sf.write(RENDER / "voice_24k.wav", v24, VSR, subtype="FLOAT")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(RENDER / "voice_24k.wav"), "-af", "aresample=48000",
                    "-c:a", "pcm_f32le", str(RENDER / "voice_48k.wav")], check=True)
    voice, _ = sf.read(RENDER / "voice_48k.wav", dtype="float32")
    voice = np.pad(voice, (0, max(0, n - len(voice))))[:n]
    write(RENDER / "voice.wav", voice)
    voice *= 10 ** ((VOICE_LUFS - 2 - ebur128(RENDER / "voice.wav")["I"]) / 20)   # near the target, then even out the dynamics
    voice = compress(voice)
    write(RENDER / "voice.wav", voice)
    voice = limit(voice * 10 ** ((VOICE_LUFS - ebur128(RENDER / "voice.wav")["I"]) / 20))

    # ── the ambiance bed: night (Parts 1 and 3), a room tone in the notebook (Part 2) ──
    night = E.pts([(0, 0), (3, 1), (P2 - .03, 1), (P2, 0), (OUT, 0), (OUT + 2.5, 1), (DUR + .3, 1), (TOT - .2, 0)])
    room = E.pts([(P2, 0), (P2 + .35, 1), (OUT, 1), (OUT + 1.6, 0)])
    p3 = E.pts([(OUT, 0), (OUT + 3, 1)])                                   # Part 3: airier, less rumble — the same sky, not a replay
    breath = (1 + .22 * np.sin(2 * np.pi * E.t / 29) + .12 * np.sin(2 * np.pi * E.t / 13 + 1.3)).astype(np.float32)
    glint_env = np.zeros_like(E.t, dtype=np.float32)                       # stars: sparse, soft shimmers
    for t0 in np.cumsum(rng.exponential(1.4, int(TOT / 1.4) + 20)):
        if t0 < TOT:
            k = int(t0 * CR)
            glint_env[k:k + 60] += (rng.random() * np.exp(-np.arange(min(60, len(glint_env) - k)) / 15)).astype(np.float32)
    L = np.zeros((n, 2), np.float32)
    for ch in (0, 1):                                                      # independent noise per channel: a wide sky
        air = noise(n, shape(150, 5200, tilt=1))
        L[:, ch] += air * E.audio(night * breath * (1 + .15 * p3), n)
        wind = noise(n, shape(30, 420, tilt=2))
        L[:, ch] += .8 * wind * E.audio(night * (1 - .3 * p3), n)
        glint = noise(n, shape(5000, 12000, tilt=.5))
        L[:, ch] += .35 * glint * E.audio(night * glint_env * (1 + .6 * p3), n)
    rumble = noise(n, shape(25, 75, tilt=0))
    L += (.6 * rumble * E.audio(night * (1 - .35 * p3), n))[:, None]
    tone = noise(n, shape(120, 2600, tilt=.6))
    L += (.95 * tone * E.audio(room, n))[:, None]
    # the factory's traffic: busy while the agents re-read the code, calm once they read the map
    busy = E.pts([(cue("factory", 2) - .3, 0), (cue("factory", 2) + 1.5, 1), (cue("factory", 7), 1), (cue("factory", 7) + 1.8, .3),
                  (cue("factory", 8), .3), (end("factory"), 0)])
    flicker = np.interp(E.t, np.arange(0, TOT, .12), .6 + .4 * rng.random(int(TOT / .12) + 1)).astype(np.float32)
    flow = noise(n, shape(400, 2600, tilt=1))
    for ch, d in ((0, 0), (1, 220)):
        L[:, ch] += .55 * np.roll(flow, d) * E.audio(busy * flicker, n)
    # the voice of users: a stream, rising and falling slowly
    st = E.pts([(start("voices") + .4, 0), (start("voices") + 1.6, 1), (end("voices") - 1, 1), (end("voices"), 0)])
    und = (1 + .3 * np.sin(2 * np.pi * E.t / 7)).astype(np.float32)
    stream = noise(n, shape(300, 2200, tilt=1))
    L += (.45 * stream * E.audio(st * und, n))[:, None]

    # level of the bed, before the accents and the ducking
    write(RENDER / "bed.wav", L)
    k = 10 ** ((BED_LUFS - ebur128(RENDER / "bed.wav")["I"]) / 20)
    L *= k

    # ── accents, in dB above the bed's level ──
    A = np.zeros((n, 2), np.float32)
    def acc(x, t0, db, pan=0.0):
        g = k * 10 ** (db / 20)
        place(A[:, 0], x * (1 - pan), t0, g)
        place(A[:, 1], x * (1 + pan), t0, g)
    dark, bright = shape(60, 900, tilt=1.5), shape(1500, 9000, tilt=.5)
    acc(swell(1.4, 3.2, dark, bright), cue("title", 0) - .9, 6)                    # the title rises
    acc(swell(2.2, 3.0, shape(30, 300, tilt=1.5), shape(200, 1500)), cue("wall", 5) + .1, 7)   # the wall grows
    acc(swell(1.6, 2.6, shape(200, 2000), bright, 1.2), start("secna"), 4)        # SECNA, written in light
    acc(dust(), cue("bill", 3) + .8, 5)                                            # S dissolves into dust
    acc(thump(), P2, 8)                                                            # the cut to the notebook
    acc(swell(1.4, 1.8, shape(150, 2500), bright, 1.0), OUT - .2, 3)              # the notebook recedes into the night
    acc(swell(1.2, 2.8, shape(500, 4000), bright, 1.3), cue("factory", 6) + .2, 4)   # the map appears
    acc(swell(1.6, 4.0, dark, bright, .8), cue("end", 0) - .4, 4)                 # the end
    for r in ev["runs"]:                                                           # the notebook's cells run
        acc(click(), r["t"], 16, pan=-.15)

    # ── ducking: the ambiance makes room for the voice ──
    hop = SR // CR
    frames = len(voice) // hop
    rms = np.sqrt(np.mean(voice[:frames * hop].reshape(frames, hop) ** 2, axis=1) + 1e-12)
    active = (20 * np.log10(rms) > -46).astype(np.float32)
    held = active.copy()                                                           # hold 0.3 s: short gaps between sentences don't release
    hold = int(.3 * CR)
    for i in range(1, frames):
        if not held[i] and active[max(0, i - hold):i].any():
            held[i] = 1
    g = np.zeros(frames, np.float32)
    att, rel = 1 - np.exp(-1 / (.07 * CR)), 1 - np.exp(-1 / (1.2 * CR))
    for i in range(1, frames):
        g[i] = g[i - 1] + (held[i] - g[i - 1]) * (att if held[i] > g[i - 1] else rel)
    duck_db = np.zeros(len(E.t), np.float32)
    duck_db[:frames] = DUCK_DB * g
    bed_gain = E.audio(10 ** (duck_db / 20), n)
    acc_gain = E.audio(10 ** (duck_db / 40), n)                                    # accents: half the ducking
    amb = L * bed_gain[:, None] + A * acc_gain[:, None]
    write(RENDER / "ambience.wav", amb)

    # ── the mix, with a gentle limiter on sample peaks ──
    mix = amb + voice[:, None] / np.sqrt(2)                                       # centre, −3 dB per channel: same loudness as the mono stem
    blk = 256
    nb = len(mix) // blk + 1
    padded = np.pad(np.abs(mix).max(axis=1), (0, nb * blk - len(mix)))
    need = np.minimum(1, CEIL / np.maximum(padded.reshape(nb, blk).max(axis=1), 1e-9))
    lim = np.ones(nb, np.float32)
    for i in range(nb):                                                            # instant attack, 120 ms release
        lim[i] = min(need[i], lim[i - 1] + (1 - lim[i - 1]) * (1 - np.exp(-blk / (.12 * SR)))) if i else need[i]
    lim = np.minimum(lim, np.concatenate([lim[1:], [1]]))                         # one block of look-ahead
    mix *= np.interp(np.arange(len(mix)), np.arange(nb) * blk + blk / 2, lim).astype(np.float32)[:, None]
    write(RENDER / "voice.wav", voice)
    write(RENDER / "mix.wav", mix)

    # ── measure: EBU R128 on each stem, curves for the plot ──
    m = {k: ebur128(RENDER / f"{k}.wav", frames=True) for k in ("voice", "ambience", "mix")}
    speech = np.zeros(len(E.t), bool)                                              # what the script says is spoken
    for q in sc["seqs"]:
        o = Q[q["id"]]["off"]
        for l in q["lines"]:
            speech[int((o + l["t"]) * CR):int((o + l["t"] + l["d"]) * CR)] = True
    tv, Mv = m["voice"]["curve"][:, 0], m["voice"]["curve"][:, 1]
    Ma = np.interp(tv, m["ambience"]["curve"][:, 0], m["ambience"]["curve"][:, 1])
    sp = speech[np.minimum((tv * CR).astype(int), len(speech) - 1)]
    gap = Mv - Ma
    stats = {k: {"integrated_LUFS": m[k]["I"], "LRA_LU": m[k]["LRA"], "true_peak_dBTP": m[k]["TP"]} for k in m}
    stats["voice_over_ambience_during_speech_LU"] = {"median": float(np.median(gap[sp & (Mv > -40)])), "p10": float(np.percentile(gap[sp & (Mv > -40)], 10))}
    ta, Mamb = m["ambience"]["curve"][:, 0], m["ambience"]["curve"][:, 1]
    spa = speech[np.minimum((ta * CR).astype(int), len(speech) - 1)]
    amb_pause = Mamb[(~spa) & (ta > 3) & (ta < DUR)]
    stats["ambience_in_pauses_LUFS_momentary"] = {"median": float(np.median(amb_pause)), "max": float(np.max(amb_pause))}
    stats["limiter_max_reduction_dB"] = float(20 * np.log10(lim.min()))
    stats["limiter_at_s"] = float(np.argmin(lim) * blk / SR)
    stats["limiter_active_s"] = float((lim < 10 ** (-.5 / 20)).sum() * blk / SR)
    stats["duration_s"] = TOT
    # the spectrum of the mix, in log bands, every 0.1 s
    mono = mix.mean(axis=1)
    win, hopS = 8192, SR // 10
    nf = (len(mono) - win) // hopS
    idx = np.arange(win)[None, :] + hopS * np.arange(nf)[:, None]
    spec = np.abs(np.fft.rfft(mono[idx] * np.hanning(win).astype(np.float32), axis=1))
    fr = np.fft.rfftfreq(win, 1 / SR)
    edges = np.geomspace(40, 16000, 97)
    bands = np.stack([spec[:, (fr >= a) & (fr < b)].mean(axis=1) if ((fr >= a) & (fr < b)).any() else spec[:, np.argmin(np.abs(fr - (a + b) / 2))]
                      for a, b in zip(edges[:-1], edges[1:])], axis=1)
    np.savez_compressed(RENDER / "analysis.npz", t=E.t, duck_db=duck_db, speech=speech,
                        voice_curve=m["voice"]["curve"], amb_curve=m["ambience"]["curve"], mix_curve=m["mix"]["curve"],
                        spec_db=(20 * np.log10(bands + 1e-9)).astype(np.float16), spec_edges=edges, spec_dt=.1,
                        parts=np.array([0, P2, OUT, P3, DUR]))
    (RENDER / "analysis.json").write_text(json.dumps(stats, indent=1), encoding="utf-8")
    for f in ("voice_24k.wav", "voice_48k.wav", "bed.wav"):
        (RENDER / f).unlink(missing_ok=True)
    print(json.dumps(stats, indent=1))


if __name__ == "__main__":
    main()
