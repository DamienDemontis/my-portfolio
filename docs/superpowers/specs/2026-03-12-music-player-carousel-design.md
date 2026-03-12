# Music Player Carousel — Design Spec

## Overview

An interactive music player integrated into the Interests section of the portfolio. Displays 11 tracks as tilted album-cover cards in a two-row infinite carousel with real audio playback, ambient glow visualizer, and lazy-loaded assets.

## Track List

| # | Title | Artist | Genre |
|---|-------|--------|-------|
| 1 | Champagne Coast | Blood Orange | Indie R&B |
| 2 | In My Zone | bbno$ & VALORANT | Hip House |
| 3 | Touch Off | UVERworld | J-Rock |
| 4 | Feel Good Inc | Gorillaz | Alternative |
| 5 | うっせぇわ (Usseewa) | Ado | J-Pop |
| 6 | Glace | Say | TBD |
| 7 | Dancing with Myself | Billy Idol | New Wave |
| 8 | 内秘心書 (Naihishinsho) | ONE OK ROCK | J-Rock |
| 9 | Une vie à t'aimer | Lorien Testard | Game OST |
| 10 | Malas Decisiones | Kenia Os | Latin Pop |
| 11 | Échec et mat | Miki | Electronic Pop |

## Type Definitions

```typescript
interface Track {
  id: string;            // slug, e.g. "champagne-coast"
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;      // e.g. "/music/covers/champagne-coast.jpg"
  audioUrl: string;      // e.g. "/music/champagne-coast.mp3"
}

interface MusicPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;      // 0–1
  amplitudeRef: React.MutableRefObject<number>; // 0–1, read by cards via ref
}

interface MusicPlayerActions {
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  seek: (progress: number) => void; // 0–1 float mapped to audio.duration
  stop: () => void;
}
```

## Architecture

### New Files

```
src/v2/
  components/
    TiltedCard.tsx          — Mouse-tracking 3D tilt card (from reactbits.dev)
    MusicCard.tsx           — Track card (cover, info, play, progress, glow)
    MusicCarousel.tsx       — Two-row infinite scroll carousel
  contexts/
    MusicPlayerContext.tsx   — Global audio state + Web Audio analyser
  data/
    musicData.ts            — Track list typed array (Track[])

public/
  music/
    covers/                 — Album cover images (jpg, user-provided)
    *.mp3                   — Audio files (user-provided, lazy loaded)
```

### TiltedCard

Copy-paste component from [reactbits.dev/components/tilted-card](https://www.reactbits.dev/components/tilted-card). It provides:
- Mouse-tracking 3D perspective tilt on hover (CSS `transform: perspective() rotateX() rotateY()`)
- Props: `imageSrc`, `altText`, `captionText`, `containerHeight`, `containerWidth`, `rotateAmplitude` (tilt intensity), `scaleOnHover`, `showMobileWarning`
- Uses `onMouseMove` to compute tilt angles relative to card center
- No external dependencies — pure React + CSS transforms

We will wrap it and extend the overlay area for play controls.

### MusicPlayerContext

React context + provider managing:

- **State:** as defined in Type Definitions above
- **Single `<audio>` element** in the provider, shared across all cards
- **Web Audio API:** `AudioContext` + `AnalyserNode` created on first user interaction (browser gesture requirement). `MediaElementAudioSourceNode` connects `<audio>` to the analyser. If `AudioContext` creation fails (old browser, privacy), the player still works — just no ambient glow effect.
- **RAF loop:** Only runs when `isPlaying`. Reads `getByteFrequencyData`, computes average amplitude normalized to 0–1. Writes to `amplitudeRef.current` (not setState — avoids 60fps re-renders). Cards subscribe via the ref.
- **Actions exposed:** `play(track)`, `pause()`, `resume()`, `seek(progress)`, `stop()`

**Lazy loading flow:**
1. `play(track)` called → set `isLoading: true`, set audio `src`
2. Listen for `canplaythrough` → start playback, set `isLoading: false`, `isPlaying: true`
3. If `play(differentTrack)` called while loading → pause current audio, reset, start new load
4. On audio load error (network/404) → set `isLoading: false`, show no error UI (silent fail), log to console

**Track end behavior:** When a track finishes (`ended` event), reset to stopped state (`isPlaying: false`, `progress: 0`, `currentTrack` remains set so the card still shows as "last played"). No auto-advance.

**Cleanup:** Disconnect audio nodes, cancel RAF, pause audio on unmount.

### MusicCard

Each card renders:

- **TiltedCard wrapper** with album cover as `imageSrc`
- **Overlay on hover:** Semi-transparent dark backdrop (`rgba(0,0,0,0.5)`) with centered play/pause/loading icon
  - Idle: play icon (CSS triangle)
  - Loading: small CSS spinner (keyframe rotation)
  - Playing: pause icon (two bars)
- **Track info below cover:** Title (`--metal-text-bright`), artist (`--metal-text-dim`), genre badge (outline style matching existing `MetalBadge`)
- **Progress bar:** Thin (2px) bar at card bottom, only visible when this track is the active one. Click to seek (click position / bar width = progress float). Drag-to-seek not needed (bar is too small). Uses warm peach (`#ffe8d6`) color.
- **Ambient glow (when active + playing):** `box-shadow` driven by `amplitudeRef.current`. Updated via a local RAF that reads the ref and applies inline style directly (no React re-render). Color: `rgba(255, 232, 214, amplitude * 0.4)`, spread: `amplitude * 20px`. No CSS transition — the RAF provides smooth updates at 60fps.
- **Accessibility:** Play/pause button has `role="button"`, `aria-label="Play {title} by {artist}"` / `"Pause {title}"`. Progress bar has `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.

**Card dimensions:** ~200px wide, ~280px tall (cover square ~200x200 + info area ~80px).

### MusicCarousel

Two-row infinite horizontal scroll driven by **framer-motion `animate`** (not CSS `@keyframes`). This simplifies drag integration since framer-motion handles interruptible animations natively.

- **Row 1:** Cards 1–6 (duplicated for loop), scrolls left
- **Row 2:** Cards 7–11 + card 1 duplicate (6 cards, duplicated for loop), scrolls right
- Both rows have equal card count (6 each) to ensure matched visual scroll speed
- **Animation:** `motion.div` with `animate={{ x }}` cycling between `0` and `-totalRowWidth/2`. Duration ~40s, linear easing, `repeat: Infinity`.
- **Gap:** 16px between cards

**Carousel pause conditions:**
1. User hovers over the carousel → animation pauses
2. A track is currently playing (`isPlaying` from context) → animation pauses
3. User is dragging → animation pauses

**Drag-to-scroll:**
- Use `@use-gesture/react` `useDrag` hook on each row
- On drag: cancel framer-motion animation, apply drag offset to `x` via `motion.div`'s `style={{ x: motionValue }}`
- On release: restart the infinite animation from the current `x` position
- Wrap `x` value with modulo to keep it within bounds for seamless looping

**Mobile (< 768px):**
- Cards scale down to ~160px wide, ~230px tall
- Two-row layout remains (cards are small enough)
- Drag works via touch events (handled by `@use-gesture`)
- Hover-to-pause doesn't apply (no hover on touch); carousel pauses only when playing or dragging

**Container:** `overflow: hidden`, parent section uses `overflowX: clip`.

### Integration into V2Interests

```tsx
<section "Interests">
  <Header (number + title)>
  <MusicPlayerContext.Provider>
    <"Musical Tastes" subtitle label>
    <MusicCarousel />              // full width, above the grid
  </MusicPlayerContext.Provider>
  <4 category cards in 2x2 grid>  // unchanged
</section>
```

The `MusicPlayerContext.Provider` only wraps the music carousel area. The 4 existing interest category cards remain unchanged.

## Styling

All styling follows the existing metal theme:

- **Backgrounds:** `--metal-dark` (#0a0a0a), `--metal-surface` (#111)
- **Borders:** `--metal-border` (rgba(255,255,255,0.06))
- **Text:** `--metal-text-bright` (#fafafa) for titles, `--metal-text-dim` (#737373) for artists, `--metal-text-muted` (#525252) for genre
- **Accent:** Warm peach `#ffe8d6` for progress bar and ambient glow
- **Fonts:** `--font-body` (Outfit) for card text
- **Border radius:** `--metal-radius-md` (4px) for cards

## Performance

- **Cover images:** `loading="lazy"` on `<img>` tags
- **Audio files:** Only fetched when user clicks play (no `preload` attribute)
- **Visualizer RAF:** Only runs during playback, cancelled on pause/stop
- **Carousel animation:** GPU-accelerated transforms (`translateX`) via framer-motion
- **Amplitude updates:** Via ref, not useState — cards run their own local RAF to read the ref and apply glow styles directly to DOM (no React re-render per frame)

## Audio Files

Audio files are user-provided and placed in `public/music/`. They are **not committed to git** — add `public/music/*.mp3` to `.gitignore`. For deployment, audio files should be uploaded separately or hosted on a CDN. Cover images in `public/music/covers/` are small and can be committed.

## Out of Scope

- **Synced lyrics** — future feature, will use LRC files. Not part of this implementation.
- **Volume control** — users can use system volume. May be added later.
- **Auto-advance / shuffle / repeat** — not needed for a portfolio showcase.
