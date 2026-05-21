/**
 * Animated favicon: "/D" with a double-sweep metallic shimmer.
 * Draws on an off-screen canvas and swaps the <link rel="icon"> href
 * at ~10 fps. Pauses when the tab is hidden.
 */

const SIZE = 32;
const FPS = 6;                 // was 10; the shimmer cycle is 4s long, 6fps = 24 frames/cycle still buttery
const LOOP_DURATION = 4000;    // ms per full animation cycle

let raf: number | null = null;
let lastFrame = 0;
let linkEl: HTMLLinkElement | null = null;
let encodingInFlight = false;  // guards against overlapping toBlob calls
let lastBlobUrl: string | null = null;

const canvas = document.createElement('canvas');
canvas.width = SIZE;
canvas.height = SIZE;
const ctx = canvas.getContext('2d')!;

function drawFrame(time: number) {
  const t = (time % LOOP_DURATION) / LOOP_DURATION; // 0..1

  ctx.clearRect(0, 0, SIZE, SIZE);

  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.roundRect(0, 0, SIZE, SIZE, 4);
  ctx.fill();

  // Build the double-sweep gradient
  // Two bright bands moving across the text
  const offset1 = t * 3 - 0.5;     // first band position
  const offset2 = t * 3 - 1.0;     // second band, trailing

  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE * 0.5);

  // Base chrome
  grad.addColorStop(0, '#4a4a4a');

  // First bright band
  const b1Start = Math.max(0, Math.min(1, offset1 - 0.08));
  const b1Peak = Math.max(0, Math.min(1, offset1));
  const b1End = Math.max(0, Math.min(1, offset1 + 0.08));

  if (b1Start > 0 && b1Start < 1) grad.addColorStop(b1Start, '#4a4a4a');
  if (b1Peak > 0 && b1Peak < 1) grad.addColorStop(b1Peak, '#ffffff');
  if (b1End > 0 && b1End < 1) grad.addColorStop(b1End, '#4a4a4a');

  // Second bright band (dimmer)
  const b2Start = Math.max(0, Math.min(1, offset2 - 0.06));
  const b2Peak = Math.max(0, Math.min(1, offset2));
  const b2End = Math.max(0, Math.min(1, offset2 + 0.06));

  if (b2Start > b1End && b2Start > 0 && b2Start < 1) grad.addColorStop(b2Start, '#4a4a4a');
  if (b2Peak > b1End && b2Peak > 0 && b2Peak < 1) grad.addColorStop(b2Peak, '#dddddd');
  if (b2End > b1End && b2End > 0 && b2End < 1) grad.addColorStop(b2End, '#4a4a4a');

  grad.addColorStop(1, '#4a4a4a');

  // Draw /D text with gradient
  ctx.save();
  ctx.font = "bold 24px 'Impact','Arial Black',sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = grad;
  ctx.fillText('/D', SIZE / 2, SIZE / 2 + 1);
  ctx.restore();

  // Update favicon — use toBlob (async, off-main-thread) instead of toDataURL
  // (sync, encodes on main thread). On Chrome the PNG encoder runs on the
  // browser's worker thread, so this returns immediately and the encoded
  // bytes arrive in the callback. Big win on the main-thread profile.
  if (!linkEl) {
    linkEl = document.querySelector('link[rel="icon"][type="image/png"]')
      || document.querySelector('link[rel="icon"]');
  }
  if (linkEl && !encodingInFlight) {
    encodingInFlight = true;
    canvas.toBlob((blob) => {
      encodingInFlight = false;
      if (!blob || !linkEl) return;
      // Revoke the previous object URL so we don't leak.
      const prev = lastBlobUrl;
      lastBlobUrl = URL.createObjectURL(blob);
      linkEl.href = lastBlobUrl;
      if (prev) URL.revokeObjectURL(prev);
    }, 'image/png');
  }
}

function loop(time: number) {
  if (time - lastFrame >= 1000 / FPS) {
    lastFrame = time;
    drawFrame(time);
  }
  raf = requestAnimationFrame(loop);
}

function start() {
  if (raf) return;
  lastFrame = performance.now();
  raf = requestAnimationFrame(loop);
}

function stop() {
  if (raf) {
    cancelAnimationFrame(raf);
    raf = null;
  }
}

export function initAnimatedFavicon() {
  // Only animate if canvas is supported and not prefers-reduced-motion
  if (!ctx) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
}
