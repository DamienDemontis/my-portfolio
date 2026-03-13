# Particle Constellation Visualizer — Design Spec

**Date:** 2026-03-13
**Context:** Replace the current single-color `boxShadow` glow on the expanded music card with a full-viewport particle constellation that reacts to per-frequency audio data and uses colors extracted from the album cover art.

---

## Overview

When a track is playing in the expanded view, ~200 particles radiate outward from behind the album cover, forming organic constellations across the entire viewport. Each particle is driven by a specific FFT frequency bin. Nearby particles connect with faint lines. Colors are extracted from the currently playing track's cover art.

## New File: `src/v2/components/ParticleVisualizer.tsx`

Self-contained canvas component. Renders a full-viewport `<canvas>` element positioned between the backdrop overlay and the expanded card (z-index 1000 < canvas < 1001).

### Props

```ts
interface ParticleVisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlaying: boolean;
  coverUrl: string;
  cardRect: { cx: number; cy: number; size: number }; // center + size of the expanded card (static final position)
}
```

### Particle Structure

```ts
interface Particle {
  x: number;
  y: number;
  vx: number;        // velocity X
  vy: number;        // velocity Y
  baseSpeed: number;  // base drift speed (randomized 0.3–1.2)
  life: number;       // current life (counts down)
  maxLife: number;     // total lifespan in frames (300–600 = 5–10s at 60fps)
  frequencyBin: number; // which FFT bin (0–127) drives this particle
  radius: number;     // base radius (1–3px)
  color: [number, number, number]; // RGB from cover extraction
  alpha: number;      // current opacity (computed from life + amplitude)
}
```

### Behavior

1. **Spawn:** Particles originate from random positions along a perimeter band 20px outward from the card's bounding box edges. Initial velocity points outward from card center.
2. **Movement:** Each frame, particle velocity is scaled by `baseSpeed * (0.3 + frequencyAmplitude * 2.0)`. Bass hits create bursts; quiet passages = gentle drift.
3. **Life cycle:** Particles fade in over first 10% of life, fade out over last 20%. When life expires or particle exits viewport, it respawns at a card edge.
4. **Radius pulse:** Rendered radius = `baseRadius * (0.6 + frequencyAmplitude * 1.5)`. Particles swell on beats.
5. **Constellation lines:** For each particle, check distance to others. If < 120px, draw a line with `opacity = (1 - distance/120) * avgAmplitude * 0.3`. Max 3 connections per particle (bidirectional — if A→B counts, it counts for both A and B). Line color blends the two endpoint colors.
6. **Pause behavior:** When `isPlaying` goes false, particles gradually decelerate (multiply velocity by 0.97 each frame) and fade out over ~1 second. They do NOT vanish instantly.
7. **Mount/unmount:** Canvas fades in/out via CSS `opacity` transition (0.4s).

### Color Extraction

On mount (or when `coverUrl` changes):
1. Create offscreen canvas, load cover image with `crossOrigin = 'anonymous'`, draw at 50×50 (small for speed)
2. Read pixel data via `getImageData`
3. Quantize colors: bucket each pixel's RGB into 16-step bins (R>>4, G>>4, B>>4), count frequencies. This yields max 4096 buckets which cluster better than 32-step for 2500 pixels.
4. Take top 3–4 most frequent buckets, convert back to full RGB (multiply by 16 + 8 for mid-bin value)
5. Filter out near-black (< 30 luminance) and near-white (> 225 luminance) buckets to avoid dull particles
6. Assign each particle a random color from this palette
7. **Fallback palette:** If extraction fails (CORS, < 2 usable colors), use `[#FFE8D6, #C4A882, #8B7355]` (warm amber tones matching the site theme)

### Frequency Data

The particle RAF loop calls `analyser.getByteFrequencyData(dataArray)` each frame independently from the context's amplitude loop. Two consumers reading from the same `AnalyserNode` is safe — each gets a fresh snapshot. The context's amplitude loop continues running for other consumers (e.g. if we add amplitude-based features elsewhere). Each particle reads `dataArray[particle.frequencyBin] / 255` to get its normalized frequency amplitude.

### Performance

- 200 particles, ~300 lines max → trivial for Canvas 2D at 60fps
- Brute-force distance check: 200² / 2 = 20k comparisons per frame — fast enough, no spatial hashing needed
- Canvas uses `willChange: 'opacity'` for smooth fade transitions
- RAF loop only runs when expanded view is mounted

## Changes to Existing Files

### `src/v2/contexts/MusicPlayerContext.tsx`

Expose `analyserRef` in the context value:

```ts
interface MusicPlayerContextValue extends MusicPlayerState, MusicPlayerActions {
  amplitudeRef: React.MutableRefObject<number>;
  analyserRef: React.RefObject<AnalyserNode | null>; // NEW
}
```

Add `analyserRef` to the Provider's value object.

### `src/v2/components/MusicCarousel.tsx` — ExpandedView

1. Remove the existing `boxShadow` glow RAF loop (lines 39–56)
2. Remove `glowRef` and `glowRafRef`
3. Add `<ParticleVisualizer>` as a sibling rendered between the backdrop and the card container
4. Pass `analyserRef` from `useMusicPlayer()`, `isPlaying`, `track.coverUrl`, and computed card center coordinates

## Constants

| Constant | Value | Rationale |
|---|---|---|
| PARTICLE_COUNT | 200 | Dense enough for effect, light enough for 60fps |
| MAX_LINE_DISTANCE | 120px | Close enough to form visible clusters |
| MAX_CONNECTIONS | 3 | Prevents visual noise |
| LINE_BASE_OPACITY | 0.3 | Subtle, not distracting |
| PARTICLE_MIN_RADIUS | 1px | Smallest particles for depth |
| PARTICLE_MAX_RADIUS | 3px | Largest particles |
| SPAWN_MARGIN | 20px | Offset from card edges for spawn zone |
| FADE_IN_RATIO | 0.1 | First 10% of life = fade in |
| FADE_OUT_RATIO | 0.2 | Last 20% of life = fade out |
| DECEL_FACTOR | 0.97 | Per-frame velocity decay on pause |

## Z-Index Stack (Expanded View)

1. `z-index: 1000` — Backdrop (dark blur overlay)
2. `z-index: 1001` — ParticleVisualizer canvas (`pointer-events: none`)
3. `z-index: 1002` — Expanded card + controls

## Out of Scope

- WebGL / shaders (Canvas 2D is sufficient)
- Particle physics (gravity, collision) — keeps it simple and performant
- Lyrics visualization — separate feature
- Visualizer on non-expanded carousel cards
