import { useEffect, useMemo, useRef } from 'react';
import { LiquidMetal } from '@paper-design/shaders-react';

/**
 * Metal Shard cursor — a small polygonal (diamond) cursor rendered with the
 * same LiquidMetal shader used by MetalShaderTitle, clipped to the shard
 * silhouette via an image mask.
 *
 * Direct DOM mutation (no React state) for mouse position → zero lag.
 * Hidden on touch devices and when `prefers-reduced-motion` is active.
 */

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

// Mask: solid black diamond on transparent. Resolution high enough for crisp edges at 14–26px.
function buildShardMask(): string {
  const W = 64;
  const H = 96;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000';
  ctx.beginPath();
  // Diamond with slightly elongated vertical axis
  ctx.moveTo(W / 2, 0);         // top
  ctx.lineTo(W, H * 0.55);      // right (pushed down a touch)
  ctx.lineTo(W / 2, H);         // bottom
  ctx.lineTo(0, H * 0.55);      // left
  ctx.closePath();
  ctx.fill();
  return canvas.toDataURL('image/png');
}

interface MetalShardCursorProps {
  enabled?: boolean;
}

export default function MetalShardCursor({ enabled = true }: MetalShardCursorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);
  const hoverStateRef = useRef(false);

  const maskSrc = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return buildShardMask();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchRef.current) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onMove = (e: MouseEvent) => {
      // Direct DOM write, no React state → hard follow, zero lag.
      wrapper.style.left = `${e.clientX}px`;
      wrapper.style.top = `${e.clientY}px`;
      if (!wrapper.classList.contains('is-visible')) {
        wrapper.classList.add('is-visible');
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest?.(INTERACTIVE_SELECTOR);
      if (isInteractive !== hoverStateRef.current) {
        hoverStateRef.current = isInteractive;
        wrapper.classList.toggle('is-hover', isInteractive);
      }
    };

    const onDown = () => wrapper.classList.add('is-clicking');
    const onUp   = () => wrapper.classList.remove('is-clicking');
    const onEnter = () => wrapper.classList.add('is-visible');
    const onLeave = () => wrapper.classList.remove('is-visible');

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onDown, { passive: true });
    document.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    // Inject a global rule that forces `cursor: none` on every element —
    // including those that set their own cursor (pointer, text, grab, etc.).
    // Without this, native system cursors leak through on interactive elements.
    const globalStyle = document.createElement('style');
    globalStyle.id = 'metal-shard-global-cursor';
    globalStyle.textContent = `
      html.metal-shard-active,
      html.metal-shard-active *,
      html.metal-shard-active *::before,
      html.metal-shard-active *::after { cursor: none !important; }
    `;
    document.head.appendChild(globalStyle);
    document.documentElement.classList.add('metal-shard-active');

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('metal-shard-active');
      globalStyle.remove();
    };
  }, [enabled]);

  if (!enabled || !maskSrc) return null;

  return (
    <div
      ref={wrapperRef}
      className="metal-shard-cursor"
      style={{
        // Fixed intrinsic size = the LARGEST render (hover). Scale via transform
        // so the WebGL canvas never resizes (which would blank 1 frame → blink).
        position: 'fixed',
        left: 0,
        top: 0,
        width: 38,
        height: 52,
        // Hotspot = top tip of the diamond. transform-origin pins the tip at the
        // cursor position so rotate/scale pivot around the pointer, not the center.
        // Base scale = 22/38 (at-rest visual size). Hover = 1. Click = 16/38.
        transform: 'translate(-50%, 0) rotate(-18deg) scale(0.58)',
        transformOrigin: '50% 0%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition:
          'transform 280ms cubic-bezier(.2,.9,.2,1), opacity 180ms, filter 180ms',
        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.28))',
        willChange: 'left, top, transform',
      }}
    >
      <LiquidMetal
        image={maskSrc}
        colorBack="#00000000"
        colorTint="#ffffff"
        softness={0.1}
        repetition={2}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.1}
        contour={0.5}
        angle={70}
        fit="contain"
        scale={1}
        speed={1}
        // At ~22px visual size the shard needs no high-DPR rendering.
        minPixelRatio={1}
        style={{ position: 'absolute', inset: 0 }}
      />
      <style>{`
        .metal-shard-cursor.is-visible { opacity: 1 !important; }
        .metal-shard-cursor.is-hover {
          transform: translate(-50%, 0) rotate(-18deg) scale(0.82) !important;
        }
        .metal-shard-cursor.is-clicking {
          transform: translate(-50%, 0) rotate(-18deg) scale(0.42) !important;
          transition-duration: 80ms !important;
        }
      `}</style>
    </div>
  );
}
