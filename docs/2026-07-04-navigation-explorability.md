# Navigation & Explorability — "The Foundry Console"

Addendum to the 2026-07-04 UI/UX upgrade plan. Goal: make *navigation itself* the impressive
part — the portfolio should feel like an instrument you operate, not a page you scroll.

Design principle: one coherent metaphor — the site is a **machined instrument panel**. Every
navigation surface (rail, palette, overview, transitions) is a control on that panel, rendered
in the existing liquid-metal language. No grab-bag of effects; four layers with distinct jobs.

Sources mined: reactbits.dev catalog (the repo already uses 6+ ReactBits ports),
@paper-design/shaders (already installed — 25+ shaders available), current awwwards portfolio
patterns (interactive navigation as the differentiator).

---

## Layer 1 — Wayfinding (always visible, answers "where am I?")

### 1a. Liquid-metal progress rail (the spine) — M
Vertical rail on the right edge, desktop. One notch per section (10), section numbers in mono.
The position indicator is a small liquid-metal droplet (`LiquidMetal shape="circle"`, ~14px
canvas) that slides along the rail as you scroll.
- Hover a notch → label slides out (+ optional thumbnail, see Atlas).
- Click → fast-travel (see Layer 3 transitions).
- Mobile: collapses to a 2px progress line at the top; tap → chapter sheet.
- The rail doubles as the *map* the rest of the system references — same 10 stops everywhere.

### 1b. HUD chip — S
Fixed top-left, mono type, game-HUD style: `02 / 10 — EXPÉRIENCE`. Updates via the existing
IntersectionObserver infrastructure. Ticks over with a small shuffle/scramble animation
(DecryptedText is already in the repo — reuse it here at ~120ms).

### 1c. Dock refit — S/M
Keep the dock (it's good), but: real `<button>`s, larger targets, label revealed for the active
item (not just a dot), language flags moved out to a corner pill. The dock becomes the *action*
bar (sections + CV + contact), the rail is the *position* instrument — two clear jobs.

---

## Layer 2 — Fast travel (on demand, answers "take me there")

### 2a. Command palette — the signature dev move — M/L
`⌘K` / `Ctrl+K` / `/` opens a terminal-styled palette ("metal console"): CRT-dark panel,
mono font, fuzzy search. This is the feature other developers will remember.
- Jump: type any section, project name, or certification → enter.
- Actions: `cv` (download, EN/FR), `mail` (copy email), `lang fr|en|ko`, `theme`, `perf` (HUD).
- Terminal flavor: `ls` lists sections, `cd projects` navigates, `whoami` prints the About
  blurb, `cat` triggers the existing cat easter egg. Cheap to build, huge charm.
- Styling hooks: backdrop = paper-shaders `flutedGlass` or `dithering` at low opacity;
  input caret = the shard cursor diamond.
- Mobile: reachable via a dock icon (⌘ icon), renders as bottom sheet.
- Footer hint in the hero: `⌘K to explore` — teaches the pattern immediately.

### 2b. Keyboard traversal — S
- `J/K` or `↑/↓` = previous/next section (with transit animation).
- `1–9, 0` = jump to section N.
- `?` = shortcut overlay (styled like an engraved plate).
- `Esc` closes everything. Focus-visible states throughout.
Announce current section to screen readers on jump (aria-live polite).

### 2c. The Atlas (overview mode) — the marquee feature — L
Press `M` (or rail's map button / pinch-out on trackpad): the page zooms out into a bird's-eye
grid of all 10 sections — Mission Control for the portfolio.
- NOT live screenshots (heavy). Each section registers a hand-designed **cover plate**: its
  liquid-metal title, section number, one signature visual (project thumbnails collage, the
  photo dome silhouette, the git-graph glyph...), rendered as a card.
- Cards use the existing SpotlightCard/TiltedCard hover language; active section's plate has a
  paper-shaders `pulsingBorder`.
- Click a plate → fly-in transition to that section (scale + liquid wipe).
- Implementation: separate overlay (`position: fixed`), framer-motion layout animations;
  the page itself never actually transforms (cheap + robust). Mobile: it's simply the upgraded
  menu — the flat list becomes this plate grid, 2-col.
- This single feature converts the "13 sections is too deep" weakness into the site's best
  moment: depth becomes something you *survey and command*.

---

## Layer 3 — Transit (between places, answers "how does moving feel?")

### 3a. Liquid wipe on fast travel — M
Any jump >1 viewport (dock, rail, palette, Atlas, keyboard) plays a ~450ms masked transition:
a `LiquidMetal fullScreenPreset` sweep (or ReactBits PixelTransition as fallback) covers the
teleport, and the destination section replays its entrance choreography. Kills the disorienting
instant-teleport of `scrollIntoView`, and every jump becomes a branded moment.
- Respect `prefers-reduced-motion`: instant jump + simple fade instead.

### 3b. Scroll-velocity-reactive metal — S/M
Drive each visible title's `LiquidMetal speed` prop from scroll velocity (you already have the
slot coordinator plumbed into every title): idle ≈ 0.3, flick ≈ 2. The metal *flows when you
move*. Zero new UI, pure feel — likely the highest delight-per-line-of-code in this plan.

### 3c. Next-chapter affordance — S
At each section's end, a right-aligned mono link: `SUIVANT → 03 COMPÉTENCES` (FlowingMenu-style
hover). Long-scroll sites die when users can't feel forward momentum; this is the fix.
Also finally answers "what's below?" in the hero: add the scroll cue + `⌘K` hint.

### 3d. Smooth scroll (evaluate) — S
Lenis on desktop only, subtle lerp (~0.1), disabled for `prefers-reduced-motion`. Makes the
rail/velocity effects feel machined rather than notchy. Test — if it fights the dome gallery
or terminal scroll areas, drop it without regret.

---

## Layer 4 — Curiosity (rewards exploring)

- Palette discoverables: `help` lists "documented" commands; a few undocumented (`sudo`,
  `rm -rf /` → cheeky refusal in the terminal style, `konami`).
- The existing cat-eyes and poissons easter eggs get palette hints ("something is hiding in
  contact...") — explorability means signposting that secrets exist.
- Rail milestone: when you've *visited* every section, the rail's droplet gets a subtle gold
  tint + a one-time "fully explored" shimmer. Completion mechanics, portfolio edition.

---

## What NOT to do
- No scroll-jacking (full-page snap sections) — it fights the terminal, dome, and long reads.
- No 3D world navigation (Bruno-Simon-style) — wrong genre for a professional profile with an
  employer-visibility constraint; the Atlas gives the same "wow, I can command this" feeling
  at 1/20th the cost and zero gimmick risk.
- Don't add GooeyNav/BubbleMenu/PillNav as-is — playful blob aesthetics clash with machined
  metal. Steal their *mechanics* (label reveal, active morph), restyle in metal.

## Build order (each shippable alone)
1. **1b HUD + 1c dock refit + 2b keyboard** — one day of work, immediately feels intentional.
2. **1a progress rail** — the spine everything else hooks into.
3. **2a command palette** — the memorable one for dev audiences.
4. **3a liquid wipe + 3b velocity metal + 3c next-chapter** — feel pass.
5. **2c Atlas** — the marquee; also replaces the mobile menu.
6. **Layer 4** sprinkles + 3d Lenis evaluation.

Dependencies already in place: LiquidMetal (installed), IO section tracking (navbar),
DecryptedText, SpotlightCard/TiltedCard, framer-motion, the slot coordinator for titles.
New deps worth adding: `cmdk` (palette), optionally `lenis`. Everything else is hand-rolled.
