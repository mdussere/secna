"""Plot the sound check: render/analysis.npz (from tools/sound.py) → render/sound_check.png, render/sound_zoom.png.

  ../../notebook/.venv/bin/python -I tools/sound_plot.py     (any Python with numpy and matplotlib)
"""
import json
import pathlib

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

HERE = pathlib.Path(__file__).resolve().parent.parent
R = HERE / "render"
a = np.load(R / "analysis.npz")
st = json.loads((R / "analysis.json").read_text())
ev = json.loads((R / "events.json").read_text())
Q = {q["id"]: q for q in ev["seqs"]}
BG, FG, DIM = "#0b0d12", "#e6e8ee", "#7a8091"
C_MIX, C_VOICE, C_AMB, C_DUCK = "#E8FF3A", "#F4F2EC", "#FF3D7F", "#4FD1FF"
plt.rcParams.update({"figure.facecolor": BG, "axes.facecolor": BG, "axes.edgecolor": "#2b303c", "axes.labelcolor": FG,
                     "xtick.color": DIM, "ytick.color": DIM, "text.color": FG, "font.size": 11, "axes.titlesize": 13,
                     "axes.titleweight": "bold", "axes.titlelocation": "left"})
p0, p2, out, p3, dur = a["parts"]
vc, ac, mc = a["voice_curve"], a["amb_curve"], a["mix_curve"]
mmss = lambda x, _=None: f"{int(x // 60)}:{int(x % 60):02d}"
accents = {"title": Q["title"]["cues"][0], "wall grows": Q["wall"]["cues"][5], "SECNA": Q["secna"]["off"], "S → dust": Q["bill"]["cues"][3] + .8,
           "cut": p2, "recede": out, "map": Q["factory"]["cues"][6], "end": Q["end"]["cues"][0]}

def parts(ax, labels=False):
    for x0, x1, name, col in ((p0, p2, "Part 1 · night", "#141a2e"), (p2, out, "Part 2 · notebook", "#1d2129"), (out, dur, "Part 3 · night", "#141a2e")):
        ax.axvspan(x0, x1, color=col, zorder=0)
        if labels:
            ax.text((x0 + x1) / 2, .965, name, transform=ax.get_xaxis_transform(), ha="center", va="top", color=DIM, fontsize=11)

fig = plt.figure(figsize=(18, 11.5), dpi=130)
gs = fig.add_gridspec(3, 2, width_ratios=[4.4, 1], height_ratios=[2.2, 1.2, 1.5], hspace=.42, wspace=.16)
ax1 = fig.add_subplot(gs[0, 0])
parts(ax1, True)
ax1.plot(ac[:, 0], ac[:, 1], color=C_AMB, lw=.6, alpha=.35, label="ambiance · momentary (400 ms)")
ax1.plot(vc[:, 0], vc[:, 2], color=C_VOICE, lw=1.1, alpha=.8, label="voice · short-term (3 s)")
ax1.plot(ac[:, 0], ac[:, 2], color=C_AMB, lw=1.6, label="ambiance · short-term (3 s)")
ax1.plot(mc[:, 0], mc[:, 2], color=C_MIX, lw=1.4, label="mix · short-term (3 s)")
ax1.axhline(-16, color=C_MIX, lw=.8, ls="--", alpha=.6)
ax1.text(dur - 4, -13.2, "−16 LUFS target", color=C_MIX, ha="right", fontsize=9)
for name, t in accents.items():
    ax1.axvline(t, color=DIM, lw=.6, ls=":", alpha=.8)
    ax1.text(t, -54, name, rotation=90, color=DIM, fontsize=8.5, ha="right", va="bottom")
for r in ev["runs"]:
    ax1.plot([r["t"]], [-57.5], marker="|", color=C_DUCK, ms=9)
ax1.text(p2 + 4, -57.4, "cells run", color=C_DUCK, fontsize=8.5, va="center")
ax1.set_ylim(-60, -8); ax1.set_xlim(0, dur + 3)
ax1.set_ylabel("loudness (LUFS)")
ax1.set_title("Loudness over the talk: the voice stays on target, the ambiance sits about 19 LU below it")
ax1.legend(loc="lower center", bbox_to_anchor=(.5, .54), frameon=False, ncol=4, fontsize=9.5)
ax1.xaxis.set_major_formatter(mmss)

ax2 = fig.add_subplot(gs[1, 0], sharex=ax1)
parts(ax2)
t = a["t"]
ax2.fill_between(t, 0, 1, where=a["speech"], color="#2b303c", step="mid", transform=ax2.get_xaxis_transform(), label="speech (from the script)")
ax2.plot(t, a["duck_db"], color=C_DUCK, lw=1.2, label="ambiance gain from ducking (dB)")
tv = vc[:, 0]
diff = vc[:, 1] - np.interp(tv, ac[:, 0], ac[:, 1])
sp = a["speech"][np.minimum((tv * 100).astype(int), len(a["speech"]) - 1)] & (vc[:, 1] > -40)
ax2b = ax2.twinx()
ax2b.scatter(tv[sp], diff[sp], s=1.2, color=C_VOICE, alpha=.35, label="voice − ambiance during speech (LU)")
ax2b.axhline(st["voice_over_ambience_during_speech_LU"]["median"], color=C_VOICE, lw=.8, ls="--", alpha=.7)
ax2b.set_ylim(0, 40); ax2b.set_ylabel("voice − ambiance (LU)", color=FG); ax2b.tick_params(colors=DIM)
ax2.set_ylim(-15, 2); ax2.set_ylabel("ducking (dB)")
ax2.set_title("Ducking follows the speech; the gap between voice and ambiance during speech")
h1, l1 = ax2.get_legend_handles_labels(); h2, l2 = ax2b.get_legend_handles_labels()
ax2.legend(h1 + h2, l1 + l2, loc="lower right", frameon=False, ncol=3, fontsize=9.5, markerscale=6)

ax3 = fig.add_subplot(gs[2, 0], sharex=ax1)
S = a["spec_db"].astype(float)
edges = a["spec_edges"]
ax3.imshow(S.T, origin="lower", aspect="auto", cmap="magma", extent=[0, S.shape[0] * float(a["spec_dt"]), 0, len(edges) - 1],
           vmin=np.percentile(S, 35), vmax=np.percentile(S, 99.7))
ticks = [50, 100, 200, 500, 1000, 2000, 5000, 10000]
ax3.set_yticks([np.interp(np.log(f), np.log(edges), np.arange(len(edges))) for f in ticks])
ax3.set_yticklabels([f"{f // 1000}k" if f >= 1000 else str(f) for f in ticks])
ax3.set_ylabel("frequency (Hz)"); ax3.set_xlabel("time (min:s)")
ax3.set_title("Spectrogram of the mix")
ax3.xaxis.set_major_formatter(mmss)

axs = fig.add_subplot(gs[:, 1]); axs.axis("off")
rows = [("MIX", ""), ("integrated", f"{st['mix']['integrated_LUFS']:.1f} LUFS"), ("loudness range", f"{st['mix']['LRA_LU']:.1f} LU"),
        ("true peak", f"{st['mix']['true_peak_dBTP']:.1f} dBTP"), ("limiter", "never engaged" if st["limiter_max_reduction_dB"] > -.1 else f"{st['limiter_max_reduction_dB']:.1f} dB"),
        ("", ""), ("VOICE", ""), ("integrated", f"{st['voice']['integrated_LUFS']:.1f} LUFS"), ("loudness range", f"{st['voice']['LRA_LU']:.1f} LU"),
        ("", ""), ("AMBIANCE", ""), ("integrated", f"{st['ambience']['integrated_LUFS']:.1f} LUFS"), ("in pauses, median", f"{st['ambience_in_pauses_LUFS_momentary']['median']:.1f} LUFS"),
        ("in pauses, loudest", f"{st['ambience_in_pauses_LUFS_momentary']['max']:.1f} LUFS"), ("", ""), ("VOICE OVER AMBIANCE", ""),
        ("speech, median", f"{st['voice_over_ambience_during_speech_LU']['median']:.1f} LU"),
        ("speech, worst 10 %", f"{st['voice_over_ambience_during_speech_LU']['p10']:.1f} LU"), ("", ""),
        ("TARGETS", ""), ("mix loudness", "−16 ± 1 LUFS"), ("mix true peak", "≤ −1 dBTP"), ("under speech", "≥ 15 LU below")]
y = .97
for k, v in rows:
    if v == "" and k:
        axs.text(0, y, k, color=C_DUCK, fontsize=11, fontweight="bold", transform=axs.transAxes)
    elif k:
        axs.text(0, y, k, color=DIM, fontsize=10.5, transform=axs.transAxes)
        axs.text(1, y, v, color=FG, fontsize=10.5, ha="right", transform=axs.transAxes)
    y -= .036
fig.suptitle("SECNA · the talk's sound check (EBU R128, measured by ffmpeg)", x=.06, ha="left", fontsize=16, fontweight="bold")
fig.savefig(R / "sound_check.png", facecolor=BG, bbox_inches="tight")

# zooms: the cut to the notebook, and the notebook receding into the night
fig, axes = plt.subplots(1, 2, figsize=(18, 5.2), dpi=130)
for ax, (x0, x1, title) in zip(axes, ((p2 - 14, p2 + 14, "Part 1 → 2: the hard cut to the notebook"), (out - 10, out + 18, "Part 2 → 3: the notebook recedes into the night"))):
    sel = lambda c: (c[:, 0] >= x0) & (c[:, 0] <= x1)
    ax.fill_between(t, -70, 0, where=a["speech"], color="#2b303c", step="mid")
    ax.plot(vc[sel(vc), 0], vc[sel(vc), 1], color=C_VOICE, lw=1.1, label="voice · momentary")
    ax.plot(ac[sel(ac), 0], ac[sel(ac), 1], color=C_AMB, lw=1.6, label="ambiance · momentary")
    ax.plot(t, a["duck_db"] - 50, color=C_DUCK, lw=1, label="ducking (dB, offset −50)")
    for r in ev["runs"]:
        if x0 <= r["t"] <= x1:
            ax.axvline(r["t"], color=C_DUCK, lw=.6, ls=":")
    ax.axvline(p2 if x0 < p2 < x1 else out, color=C_MIX, lw=1, ls="--")
    ax.set_xlim(x0, x1); ax.set_ylim(-66, -6); ax.set_title(title); ax.set_ylabel("LUFS"); ax.xaxis.set_major_formatter(mmss)
    ax.legend(loc="upper right", frameon=False, fontsize=9)
fig.savefig(R / "sound_zoom.png", facecolor=BG, bbox_inches="tight")
print("→ render/sound_check.png, render/sound_zoom.png")
