# UI/UX Upgrade Plan — demontis.dev (v5)

Audit date: 2026-07-04. Based on a full visual walkthrough (desktop + mobile) and a code-level
sweep of `src/v2`. Content/copy is out of scope; this is UI/UX mechanics, polish, and perception.

Overall verdict: the metal identity is strong and distinctive — the problem is not the concept,
it's friction (loading gate, contrast, nav discoverability), inconsistency (motion configs,
theme breaks like the white Calendly iframe), and unrealized polish (hover affordances, mobile
scale, section transitions).

---

## Phase 1 — Kill the friction (highest ROI)

### 1.1 Loading screen: gate once, never again
`MetalLoadingScreen` blocks every visit for 2.2s. Keep the moment (it sells the brand) but:
- Show the full experience only on first visit per session (`sessionStorage` flag).
- Repeat visits: 500ms micro-version (orb flash + fade) or none.
- Make it dismissible: any click/keypress/scroll skips it.
- Drive it by real readiness (fonts loaded + hero shader mounted) instead of a fixed timer, with
  2.2s as the *max*, not the constant.

### 1.2 Contrast repairs (WCAG + plain readability)
- `--metal-text-muted: #525252` fails contrast on dark surfaces (~2:1). Raise to `#8a8a8a` min.
- `--metal-text-dim: #737373` is borderline; audit its usages — body-size text gets `#9a9a9a`.
- Form field borders/placeholders in Contact are near-invisible; raise to `--metal-border-light`.
- Experience terminal text is tiny mono at low contrast — see 3.2.

### 1.3 Semantics & keyboard
- Heading outline: ensure H1 (hero) → H2 (section titles, already default) → H3 (sub-blocks);
  fix the places that jump to H3.
- Dock items: replace `<div role="button">` with real `<button>`.
- Mobile menu: trap focus while open (`focus-lock` or manual), restore focus on close,
  close on Escape.
- Add a skip-link that is actually rendered first in the tree.

### 1.4 Fonts: eliminate the swap flash
- Add `&display=swap` to Google Fonts URLs; preload the two critical woff2 (Outfit, Syne) or
  self-host all four faces with `font-display: swap` + `size-adjust` on fallbacks to kill CLS.

---

## Phase 2 — Navigation & orientation

The page is ~15,700px tall with 10 destinations behind unlabeled 16px icons in the dock.

### 2.1 Dock upgrade (desktop)
- Persistent tooltips are not enough: show a text label on hover *and* on active section.
- Bigger hit targets (min 32px), stronger active indicator (label + dot, not dot alone).
- Move the language switcher out of the dock into a corner pill (EN/FR/KO) — frees ~3 slots.
- Optional: collapse rarely-visited sections (certifications, languages) into fewer dock items.

### 2.2 Scroll progress & wayfinding
- Add a thin liquid-metal progress rail (left edge or under the dock) showing scroll position
  and section boundaries — on-brand and functional.
- Section numbers already exist ("01", "09"); surface current number + total near the dock.

### 2.3 Mobile menu with the same soul as the site
Current: plain centered gray list — the flattest screen of the whole product.
- Number the entries (01–10), stagger-reveal them, give active section state.
- Add the metal texture/shader accent to the overlay background.
- Swipe-down or backdrop-tap to dismiss.

### 2.4 Section transitions
- Replace uniform gradient-line separators with 2–3 variants (forge line, rivet strip, plain)
  so long scrolling has rhythm.
- Consider Lenis smooth scrolling (desktop only, `prefers-reduced-motion` off) to make the
  10-section scroll feel like one continuous machined surface. Test before committing.

---

## Phase 3 — Signature moments & cohesion

### 3.1 Hero
- Mobile: title occupies ~82px height in a 812px viewport with large dead zones — scale name up
  (target ~2× current), tighten vertical rhythm, raise tagline size/contrast.
- CTA links ("ME CONTACTER / CV") are small underline links — promote to proper metal buttons
  with magnetic hover; they are the page's primary actions.
- Add scroll cue (animated chevron or "scroll" microcopy) — currently no affordance that 9 more
  sections exist below.

### 3.2 Experience (git-log terminal)
Great concept, weak execution at reading distance:
- Raise font size and contrast of role titles (the *job title* should read first, the hash/refs
  second); let the git decoration be secondary chrome.
- **Remove `feat: join your company?`** — it's a job-seeking signal, which conflicts with the
  stated employer-visibility constraint.
- Company logos are barely visible (near-black on black); give them a subtle plate/hover reveal.

### 3.3 Skills
Percent rings + skill bars are the most dated pattern on the page (and self-ratings invite
skepticism). Replace with:
- Grouped capability clusters (chips sized/weighted by depth, or a "forged in / working with /
  exploring" three-tier layout) — no fake percentages.
- One interactive flourish max (e.g. hover = liquid-metal fill on the chip).

### 3.4 Projects
- Cards are uniformly dark-gray; hover should do more than lift: color/contrast reveal on the
  screenshot (grayscale → color, matching the photography section's existing pattern).
- Tech tags look like buttons but aren't — either flatten their styling or make them filter.
- Differentiate featured cards (2×2 span already exists — add a "featured" visual treatment).
- Add a subtle inner-shadow/edge-light so cards read as machined plates, not flat rectangles.

### 3.5 Contact
- The white Calendly iframe is the single biggest theme break on the site. Fix via Calendly's
  `background_color`/`text_color`/`primary_color` URL params (dark theme), or hide it behind a
  styled "Planifier une réunion" button that opens the Calendly popup.
- Form: visible focus states, inline validation, real submit feedback (loading → success state
  with a metal shimmer, error state), larger touch targets.

### 3.6 Interests
- Raw YouTube iframes (red play button, white cards) clash — use lite-youtube-style facades:
  grayscale thumbnail + custom metal play button; load the iframe on click.
- Album art color is fine as an intentional color moment — but gate it behind the same
  grayscale→color hover language used elsewhere so the system feels deliberate.

### 3.7 Motion system unification
- Define motion tokens in one place: `spring.snappy` (dock), `spring.soft` (cards),
  `ease.reveal` (section entrances) — replace the 4+ ad-hoc spring configs.
- Standardize entrance choreography: every section = title reveal → content stagger (0.06–0.08s),
  same distances, same easing.
- Scroll-linked detail: drive the LiquidMetal `speed`/`frame` of section titles slightly with
  scroll velocity — the metal "flows" as you move. Cheap, on-brand, memorable.

---

## Phase 4 — Performance as UX

- **Lanyard**: 2.96MB three.js chunk for one decorative band. Replace with a pre-rendered video
  (webm w/ alpha), an animated SVG, or drop it. Biggest single perf win available.
- **DomeGallery**: reduce segments on mobile (`isMobile ? ~24 : 45`), lower texture sizes.
- **Images**: add `srcset`/`sizes`, encode AVIF with WebP fallback; project screenshots are the
  bulk of transfer.
- **Reveals**: keep `once: true` (perf-friendly), but ensure below-fold sections don't all mount
  eagerly at 800ms — tie mounting to approach distance (IntersectionObserver rootMargin), which
  the titles already do.
- Re-run Lighthouse after Phase 1 & 4; target 90+ mobile.

---

## Quick wins (do anytime, <1h each)
1. `&display=swap` on font URLs.
2. `--metal-text-muted` bump.
3. Remove `feat: join your company?` line.
4. Calendly dark-theme URL params.
5. Real `<button>` in dock items.
6. Larger dock hit areas + labels on active.
7. Hero CTA → MetalButton.
8. Scroll cue in hero.
9. Delete unused `MetalFloatingOrb` or actually use it (e.g. in About/Contact as ambient decor).
10. Escape-to-close + focus trap on mobile menu.

## Suggested execution order
Phase 1 → 2.1/2.2 → 3.1/3.5 (highest visibility) → 3.2/3.4 → 4 → rest of 3.
Each phase is independently shippable; verify with the browser preview + Lighthouse after each.
