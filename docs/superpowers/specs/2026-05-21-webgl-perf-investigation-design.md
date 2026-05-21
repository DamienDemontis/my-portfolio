# WebGL Performance — Investigation & State-of-the-Art Optimization

**Date:** 2026-05-21
**Author:** Damien (via Claude)
**Constraint:** Zero visual change on capable hardware. Everything done autonomously, local emulation only.
**Target:** Solid 60fps on mid-range / integrated-GPU laptops (Intel Iris, 4-core).

---

## 1. Problem statement

The portfolio runs smoothly on Damien's powerful PC but stutters ("saccades, low FPS") on friends' machines. The page contains a substantial amount of WebGL:

| Component | Where | Cost class | Notes |
|---|---|---|---|
| `Dither` | V2Portfolio fixed background | High (fullscreen fbm × 4) | Already freezes past 1.2× viewport |
| `MetallicSurface` | V2Contact bg + every `MetalShaderTitle` | **Very High** — runs in ~10 sections | Branchy fragment shader, multiple smoothsteps, sin/cos, FBM-like noise |
| `MetalShaderTitle` | ~10 section titles | Inherits MetallicSurface | IO mount/unmount with 5s grace |
| `MetalParticleField` | V2Hero | Low — 2D canvas, 30 particles | OK |
| `Lanyard` | V2About | High — r3f + Rapier physics | Lazy + IO gated |
| `SoftAurora` | V2Languages | Medium — OGL fbm | IO + page-active |
| `ParticleVisualizer` | Audio-reactive only | Medium — 200 2D particles | OK |

### Why friends' PCs lag

1. **WebGL context count.** Chrome/Safari cap at ~16 contexts/tab; integrated GPUs feel pain starting at 8. With several `MetalShaderTitle`s near the viewport during scroll, plus `Dither`, plus possibly `Lanyard` / `SoftAurora`, the page can briefly run 6–8 contexts at once. ([MDN — context limits](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices))
2. **Fragment cost.** `MetallicSurface`'s fragment shader has many branches, smoothsteps, sin/cos, and a custom noise (`aF` / `lM` / `pW`). On a 2000×2000 framebuffer (DPR 2) that's ~16M shader invocations per draw — fine on RTX, painful on Intel UHD.
3. **No GPU instrumentation.** Without `EXT_disjoint_timer_query`, we can't tell which canvas is the bottleneck during investigation.
4. **Shader linking blocks first paint.** No `KHR_parallel_shader_compile` — each shader's link stalls the main thread on cold load.
5. **Antialiasing wasted on procedural fragments.** Both `MetallicSurface` and `SoftAurora` request MSAA, but the shaders cover the full quad — there are no triangle edges to anti-alias.
6. **Contact section ships a WebGL background at opacity 0.1** — invisible cost.

## 2. Investigation methodology (no friend involvement)

Everything done on Damien's machine, in 4 tiers:

| Tier | Tool | What it gives |
|---|---|---|
| **1** | **In-app PerfHUD** (`?perf=1`, dev-only build flag) | Live FPS (median + p1), frame-time histogram, long-task counter, active WebGL context count, current DPR, list of visible sections, **per-component GPU time via `EXT_disjoint_timer_query_webgl2`** |
| **2** | Chrome DevTools Performance + 6× CPU throttle + GPU "Software" emulation | Flamechart + dropped frames + raster work |
| **3** | [Spector.js](https://spector.babylonjs.com/) browser extension | Frame capture, draw call list, shader source per program, GL state |
| **4** | Lighthouse Mobile + `about:tracing` | TTI/INP regressions, compositor view |

### Why the HUD?
It's the only way to attribute cost to a specific WebGL component without manually toggling each one. `EXT_disjoint_timer_query_webgl2` gives nanosecond GPU-time per draw — that's the gold standard.

## 3. Optimization plan (no visual change)

### A. Remove dead cost: V2Contact background
The `<MetallicSurface mode="procedural" />` at the top of `V2Contact` is rendered at `opacity-10` and covered by content. Cost: one extra WebGL context running a heavy fragment shader. Fix: delete the block. (Optional CSS gradient fallback if we want a hint of texture, but not necessary.)

### B. MetallicSurface (highest leverage — used by ~10 titles)

| Change | Visual impact | Perf impact |
|---|---|---|
| `antialias: false` | None — procedural shader has no triangle edges | Reduces backing-store sample count, frees fragment work |
| `KHR_parallel_shader_compile` | None | First-paint jank eliminated |
| New `dprCap` prop (default 2, `MetalShaderTitle` uses 1.25) | None — titles already use heavy quantization and noise; sub-1.5 DPR is indistinguishable on the kind of shimmer they render | **~3× fragment cost reduction for all titles** (DPR 2² → 1.25²) |
| Throttle `MetalShaderTitle`-mode to 24fps (currently 30) | None — title wobble at `speed=0.3` is too slow to perceive frame-rate difference below 30 | 20% rAF reduction |

### C. MetalShaderTitle coordinator
Introduce a tiny module-level registry. At most **3 `MetalShaderTitle`s render live simultaneously** — the ones with smallest viewport distance. Others stay mounted but `freeze` (skip uniform updates + draw calls) until they enter the top-3. Because each title's animation is a slow shimmer, the freeze is imperceptible during scroll.

This caps context cost at 3 + 1 (Dither) + maybe 1 (SoftAurora/Lanyard) = **5 live contexts** at any time, well under the integrated-GPU 8-context pain point.

### D. Dither
- Drop FBM iterations from 4 → 3. At `colorNum=4`, `pixelSize=2`, the 4th octave contributes < 1/16 amplitude after dither quantization. **Invisible. ~25% fragment cost reduction on the most-rendered shader on the page.**
- `KHR_parallel_shader_compile`.
- **OffscreenCanvas + Worker** (progressive enhancement, desktop only). Removes the largest fragment shader from the main thread entirely. Falls back to current main-thread path if browser/feature flag rejects it. ([evilmartians OffscreenCanvas write-up](https://evilmartians.com/chronicles/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers))

### E. SoftAurora
- `antialias: false`. None of the fbm aurora benefits from MSAA.
- `KHR_parallel_shader_compile`.

### F. Things deliberately NOT changed
- **Lanyard** (r3f + Rapier) — already lazy-loaded, IO-gated, mobile uses 30Hz physics. Diminishing returns.
- **MetalParticleField** — 2D canvas, 30 particles, already cheap.
- **ParticleVisualizer** — only mounts when audio plays. Outside the common-path.
- **Single-OffscreenCanvas-rendering-everything refactor** — too much complexity for too little gain given the per-component shape mismatch.

## 4. Verification

1. Build + run dev server (`?perf=1`).
2. Chrome DevTools → Performance panel → CPU 6× throttle → record full scroll + back.
3. PerfHUD median FPS during scroll → target **≥ 58fps**.
4. Long tasks (>50ms) during scroll → target **0**.
5. Lighthouse mobile performance score → record before/after.
6. Spector.js capture of Hero, Skills (middle of scroll), Contact (end of scroll) — confirm only ≤ 5 live contexts each.

## 5. Risk & rollback

Every optimization is a small focused commit. If any change causes a visual regression on capable hardware (which it should not), revert that single commit. The PerfHUD is dev-only and gated by `?perf=1`, no production impact.

## 6. Sources

- [MDN — WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [MDN — KHR_parallel_shader_compile](https://developer.mozilla.org/en-US/docs/Web/API/KHR_parallel_shader_compile)
- [MDN — EXT_disjoint_timer_query](https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query)
- [MDN — OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
- [web.dev — about:tracing](https://web.dev/articles/abouttracing)
- [Spector.js docs](https://spector.babylonjs.com/)
- [evilmartians — Faster WebGL with OffscreenCanvas + Workers](https://evilmartians.com/chronicles/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers)
- [r3f scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Codrops — Building Efficient Three.js Scenes (2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/)
