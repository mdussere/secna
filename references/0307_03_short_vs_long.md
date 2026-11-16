# From the short video to the long talk — shot-by-shot comparison

> Plan Step 3.7 (2026-10-27). **Question it answers**: for each shot of the frozen short video, what
> did the earlier long material plan, what does the short do differently, and what will the long
> version **extend** in the shot or **insert** after it. Inputs: the short video, described in
> [`0307_02`](0307_02_short_video_analysis.md); the five-section storyboard
> [`0601_01`](0601_01_video_narrative_storyboard.md) (2026-10-23); long candidate A
> (`presentation/video_candidates/a/`, ~40 scenes, French on screen); the first extension draft
> [`0307_01`](0307_01_long_storyboard.md) (written before the short's last three rounds — **this doc
> supersedes its map**). For Michael to validate before the long storyboard is rewritten.

---

## 1. Three ways to extend a shot

- **Dwell** — same shot, same screen, more time: the speaker talks over it; live, it is a stop.
- **Deepen** — the shot's own visual gets more steps before it lands on the short's screen (the short
  screen stays as the shot's **anchor**).
- **Insert** — a new shot between two shots of the short, in the same visual language.

## 2. The comparison

| # | Short shot (0307_02) | Earlier long plan (0601_01 · candidate A) | What the short changed | Long version: extend | ~min |
|---|---|---|---|---|---|
| — | — | A: *Titre* | — | **Insert** a title shot: talk title, speaker line, event | 0:20 |
| 1 | The pile | 0601 §1.1 sources feeding the corpus · A: *La pile*, *« Autre »* | four sources, one line | **Deepen**: each source shows one real-looking example line before turning into particles; the *Other* bucket where unread text ends | 0:30 |
| 2 | The wall | 0601 §1.2–5 two scales over time, **the loop**, *not a race* · A: *La course* | arithmetic only; no time axis, no loop | **Deepen**: window vs corpus growing 2023 → 2026 on a log axis; **insert** the loop (bigger models → more generated text → bigger corpora) | 1:00 |
| 3 | Three dead ends | (not in 0601) · A: *Demandons à un LLM*, *Trois impasses*, *La vraie question* | three struck titles | **Deepen**: each dead end demonstrated on the particles (overflowing frame, 1% sample missing a cluster, a pile of summary cards with a running cost) | 1:15 |
| 4 | Clio | 0601 §2.1–5 who, problem, two layers, bill · A: *Décembre 2024*, *Des millions de conversations*, *Le pont*, *La facture publiée* | the bill moved **after** SECNA; no two-layer visual | **Deepen**: who they are; *too many to read and not to be read*; the field splitting into structure / meaning; the hook, in its honest form | 1:15 |
| 5 | The SECNA rail | 0601 §3.1–6 pipeline with gauges, sphere, hierarchy zoom · A: *Cinq lettres*, *S*…*A* | a vertical rail, chips instead of gauges, no sphere | **Deepen** each letter (~35 s): S one text before/after; E two example pairs side by side; C outliers named as such; N examples → name; A zoom into one theme and out | 3:00 |
| 6 | Structure / meaning | 0601 §3.7 · A: *La phrase à retenir* | at mid-point, over the map | **Dwell** | 0:20 |
| 7 | Clio's bill | 0601 §2.5 (in Clio) · A: *La facture publiée*, *La facture* | after SECNA, read letter by letter | **Deepen**: the bar fills in pipeline order (S, E C almost nothing, N, A) | 0:45 |
| 8 | Can we cut it further? | 0601 §5.1–2 *Ma recette — sans le S*, the trade-off · A: *SECNA sans le S* | **moved from the end to here** — the recipe's key move is now an answer to the bill | **Deepen**: what *short texts* means (reviews, tickets, PR descriptions); what you give up on long, multi-topic texts | 0:45 |
| 9 | The curve | 0601 §4.3–4 the curve, *our scale* · A: *La courbe de coût*, *Réservé aux géants ?* | question first | **Deepen**: markers for *our scale* and the giants'; at our size the gain is seeing, not saving | 0:45 |
| 10 | Not an isolated case | 0601 §4.1–2 Urania, LangSmith (1,000-trace cap, *when the LLM does everything you sample*) · A: *Le point commun* | **neutral**: Kura instead of the LangSmith limitation | **Deepen**: each card alone with its one fact, then the three collapse onto the same rail | 0:45 |
| 11 | Within everyone's reach? | 0601 §4.5 *Can I do it too?* · A: *Moi aussi ?* | a yes and a code card | **Dwell** on the code card | 0:30 |
| 12 | So we tried it | 0601 §4.5a–h notebook ≥ 5 min · A: *Notebook — ouverture … votre corpus* (8 scenes) | the notebook reduced to one sentence | **Insert the notebook** after this shot: setup → **the corpus introduced** (the talk never presented LangChain: what it is — an open-source framework for building LLM apps; why its pull requests — public, 14,947 in three months across its repositories, written by a team *and* its bots; a corpus, not a platform we promote) → S (one PR as text) → E on the laptop (map filling) → C (100 clusters) → N (names arriving) → A (themes building) | 4:45 |
| 13 | The LangChain run | 0601 §4.5g the bill · A: *Notebook — la facture* | the run's summary screen, $0.15 | **Anchor** of the notebook (its last cell lands here), then **insert** *your corpus*: the one line to change + the QR code | 0:45 |
| 14 | The unexpected | (not in 0601; 0301 §10.5 asked for it) | the largest cluster, 2% | **Deepen** in two moves. **(a) One theme, in depth** — zoom from the 7 themes into the largest, *Agent Products and Workflow Reliability* (29% of PRs, 23 clusters): its clusters, one of them opened, a verbatim. **(b) Two weak signals, each with its verbatims** — the LangSmith Engine bot cluster (310 PRs, 2%; *Opened from a LangSmith Engine issue, which has the diagnosis and the traces that surfaced it.* — 303 of 310), month by month (5 → 230 → 75); and a second one (*Made by Open SWE*, after re-check) | 2:45 |
| — | — | 0601 §5.3–5 why a table, where it stops, tomorrow · A: *Pourquoi une table*, *Où ça rapporte*, *Demain* | not in the short | **Insert** after 14: why a table (cross clusters with month, repo, author); three limits; tomorrow (S comes back as small models get cheaper) | 1:15 |
| — | — | 0601 §5.6 the agents cliffhanger · A: *Et si… des agents ?* | not in the short | **Insert** before the end: a query moving through the map on its own — *And if we put agents on it?* — *Next time.* | 0:40 |
| 15 | SECNA | A: *Fin* | the wordmark, the thesis, the repo | **Dwell**; the QR code again | 0:30 |
| | | | | **Total** | **≈ 21:50** (≈ 20:10 with the cuts in §4.1) |

The five sections of `0601_01` still hold, on the short's order:
**L'impasse** (title, 1–3) · **Clio** (4) · **SECNA** (5–8) · **Les gros, et nous** (9–13, with the
notebook) · **Ma recette → les agents** (14, the inserts, 15).

## 3. What moved, what is new, what is dropped

**The short brought, and the long keeps:**
- **questions at the turning points** — the short's four, not one at every transition (see §3a);
- *skip S* as the answer to Clio's bill (it was the end of the talk in `0601_01`; now it is the
  turning point of the SECNA section);
- the real run on **LangChain** with S without an LLM and E on the laptop — **$0.15** as the hero
  number;
- the weak signal **coming from the clustering**, with its weight (*the largest of the 100
  clusters · 2%*);
- **neutral convergence** (Urania, Insights, Kura) instead of the LangSmith 1,000-trace argument;
- the code card for *a few dozen lines*.

**The long adds back from the earlier plan:** the scale argument over time and the loop (2); each dead
end demonstrated (3); the two layers (4); one example per letter (5); *our scale* on the curve (9);
the notebook (12–13); why a table, the limits, tomorrow, the agents (inserts after 14).

**Dropped for good:** the bill inside the Clio section (it now follows SECNA); *Ma recette — sans le
S* as a separate closing beat (it is shot 8); the LangSmith limitation; on-screen French (candidate A).

## 3a. Transitions — vary the device

A recurring device gives the talk unity; the same device at every transition becomes a tic, and over
20 minutes it would show. Rule for the long version: **a question only at a real turning point**,
where the room would otherwise ask *why are we going there?* — at most one every few minutes, and
never two seams in a row.

| Device | When | Examples in the map |
|---|---|---|
| **Question** | a turn in the argument | the short's four (before 8, 9, 11, 14); possibly one before the agents |
| **A figure turns it** | a number makes the next shot necessary | 2 (window vs corpus) → 3; 7 (*92% of the bill is S*) → 8 |
| **The points carry it** | the visual continues from one shot into the next | 1 → 2 (the pile fills the frame); 5 → 6 (the map stays); notebook map → 13 |
| **A consequence** | the next shot follows from the last line | *So we tried it* (12); *Others do the same* (10) |
| **A name or a date** | a new story starts | Clio (4) — *December 2024* |
| **Wipe or cut, no words** | a section ends | between the five sections; before 15 |

## 3b. Live mode — the speaker drives (decided 2026-10-28)

The long version is not a video: it is **the whole presentation**, played live, and Michael triggers
every sequence.

- **One sequence = one shot (or one step of a deepened shot).** Michael triggers it; it runs on its
  own, then **stops on a still screen**.
- **The ⅔ / ⅓ split.** Of the time a sequence has in the map, **⅔ is animation** — Michael comments
  over it by simply translating the highlights into French — and **⅓ is the still screen**, for the
  deeper explanation. Nothing moves during that third: the room cannot follow a deep explanation
  while an impactful animation runs. (A 45 s shot = 30 s of animation + 15 s still.)
- **A pause point after every animation** — the end frame of each sequence is a stop. The short's
  automatic *holds* become these stops; the next sequence starts only when Michael triggers it.
- **A steerable progress bar** at the bottom: a small mark at every pause point, **bigger marks at
  the five sections**; the played part fills. Click a mark to jump there (for rehearsal, or to go
  back to a screen in the Q&A).
- **Keys**: → / space / clicker = next sequence (if one is running, jump to its end frame);
  ← = back to the previous stop; Home = start. The animation timings in the map are therefore the
  **⅔ part**; the still third is the speaker's, not the page's.
- **Consequence for the build**: the short's continuous timeline becomes a list of sequences with an
  end frame each; the animations are slowed to fill their ⅔ (the short runs ~8 s a shot, the long's
  shots have 20–60 s of animation each) — mostly by deepening, not by playing the same motion slower.

## 4. To decide

1. ~~**The time budget**~~ — **decided**: 20 minutes is the whole presentation; the notebook is
   **5:30**. No 15-minute cut. Row 14 grew from 1:00 to 2:45 (decision 2), so the map is now
   ≈ 21:50 — **1:50 to find**. Proposal: 3 (dead ends) 1:15 → 0:45; 5 (SECNA) 3:00 → 2:30, since
   A's zoom now lives in 14a; the insert after 14 (table, limits, tomorrow) 1:15 → 0:45, since 14a
   already shows the table at work; the title 0:20 → 0:10. That saves 1:40 (≈ 20:10); the last
   10 s are trimmed at storyboard time.
2. ~~**One weak signal or two**~~ — **decided**: one deep dive into a main theme, then two weak
   signals with verbatims (row 14). The second signal (*Made by Open SWE*) is re-checked first; if
   it does not hold, another cluster from the run takes its place.
3. ~~**groups / clusters**~~ — **decided**: **cluster** for level 0 (the C step's output), **theme**
   for level 1 (the A step's output). *groups* disappears from the screens (the short's curve and N
   chip say *groups*; the long says *clusters*).
4. ~~**Live mode**~~ — **decided**: see §3b.
5. ~~**Fonts**~~ — **decided: no** — the page keeps the system fonts.

## 5. Next

Michael validates or amends this table → `0307_01` is rewritten as the definitive long storyboard
(shot by shot, with what is said) → the build starts on the short's page, shot by shot, beginning with
the notebook insert (12–13), the longest and the one the run's outputs shape.
