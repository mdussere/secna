---
name: secna-deck
description: Build, iterate and freeze the SECNA talk deck (Marp, presentation/). Use whenever you create or edit presentation/deck.md, touch the theme (presentation/theme/secna.css), render or review slides, or export the PDF / standalone HTML.
---

# SECNA deck — how to build and change it

The deck is **one Markdown file** rendered by [Marp](https://marp.app) with the repo's own neutral
theme. The repo gives the form (theme, components, build); the content comes from the talk's intent
(see `plan_secna.md`, Step 3).

## Layout

```
presentation/
  deck.md              the only source of the deck
  assets/img/          this deck's own images (diagrams, captures, video)
  theme/secna.css      the theme (Marp `@theme secna`)
  theme/fonts/         Inter + IBM Plex Mono, SIL OFL 1.1 (licences beside the files)
  build.mjs            the only build tool
  package.json         pins @marp-team/marp-cli (exact version) — package-lock.json too
  dist/                deliverables (see "Freeze")
  review/              one PNG per slide, for reading the slides back (ignored)
```

## Commands (from `presentation/`)

Node 22 is needed; if `node` is not on the PATH, prefix with `mise exec node@22 --`.

```bash
npm ci                      # once per clone (marp-cli, locked)
node build.mjs html --watch # live preview: deck.html rebuilds on save, `p` = presenter view
node build.mjs png          # review/deck.NNN.png — one image per slide
node build.mjs pdf          # dist/deck.pdf (needs a local Chrome/Edge/Firefox)
node build.mjs standalone   # dist/deck-standalone.html — every asset inlined, one file
node build.mjs all          # pdf + png + standalone
```

Don't invent other build paths (no npx, no global marp).

## Rules

- **Verify renders by looking at them.** After any change, `node build.mjs png` and *read every
  affected PNG*. Never call a slide done from the source alone. Watch for: text wrapping onto an
  extra line, blocks touching the footer or each other, a lost first line, overflow.
- **A theme change is checked on every slide**: render PNGs before and after, compare them.
- **Slide separators** `---` always have a blank line before and after (otherwise Markdown merges
  two slides).
- **Chapter bar**: front matter sets `style: "section { --parts: N }"` (quotes required) to the
  number of parts; slides carry `<!-- class: chN -->` and `<!-- header: '0N · Part title' -->` at the
  start of a part.
- **Components before CSS.** Use what the theme offers; a missing component goes into
  `theme/secna.css` (with a one-line comment saying what it is for), never into the deck. The deck's
  front matter `style` holds only `--parts` and small positional tweaks. **Colours are the `:root`
  variables, never literals.**
- **Red means cost.** `--red` is reserved for "this consumes tokens" — not for emphasis. Emphasis is
  `--accent` (blue); `**bold**` on an `impact` slide renders in the accent.
- **Speaker notes are published.** Marp keeps HTML comments as presenter notes, and they end up in
  `deck.html` and the standalone file. Never put anything in a comment you would not show the room.
- **No branding of any organisation** (logo, brand fonts, brand colours, brand backgrounds). The
  speaker's identification line on the cover is the only place an affiliation appears. Fonts must be
  open-licence and embedded (no network at view time).
- **Diagrams**: prefer SVG in `assets/img/`; an SVG loaded through `<img>` cannot use the deck's web
  fonts — export it to PNG or use fonts installed on the rendering machine. Animated GIFs and video
  play in HTML only; PDF/PNG keep the first frame.

## Layouts and components (theme/secna.css)

| Class | What |
|---|---|
| `cover` | Dark background, `#` title, `##` speaker line, `_footer` for event · speaker. No page number. |
| `impact` | One centred sentence, no title, no breadcrumb. |
| default | White, blue `#` title, breadcrumb + chapter bar top, footer + page number bottom right. |
| `clip` | Dark background, a centred `<video autoplay loop muted playsinline>`, no chrome. |
| `.cols`, `.cols3` | 2 or 3 equal columns. |
| `.card` | Bordered card, inside `.cols` / `.cols3`. |
| `.note` | Secondary grey sentence under a block. |
| `.secna` (`.s`, `.s.cost`, `.l`, `b`, `small`) | A row of five lettered steps; `.cost` = consumes tokens (red). |
| `.placeholder` | Dashed red box: something still to insert before the talk. |

`.secna`, `.note` and `.placeholder` came from the first deck (dropped); remove what the new deck
does not use.

## Freeze

Only `dist/deck-standalone.html` is ever committed, **once, when the deck is final** (re-freeze only
for a real new version). `dist/deck.pdf` is local — written to send to someone, never committed.
`deck.html`, `review/`, everything else in `dist/` stay out of git.

## Commits

Conventional Commits (`docs`, `feat`, `fix`, `chore`, `build`). One deck change or one theme change
per commit.
