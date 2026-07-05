import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LiquidMetal } from '@paper-design/shaders-react';
import { useShaderTitleSlot } from '../core/shaderTitleCoordinator';
import { useScrollVelocitySpeed, isTravelingNow, onTravelEnd } from '../core/navigation';

interface MetalShaderTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  tintColor?: string;
  speed?: number;
  /** The metal reacts to the cursor: flow angle and distortion follow it. */
  interactive?: boolean;
}

export default function MetalShaderTitle({
  children,
  as: Tag = 'h2',
  className = '',
  tintColor = '#ffffff',
  speed = 0.6,
  interactive = false,
}: MetalShaderTitleProps) {
  const textRef = useRef<HTMLElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  // Depth: titles drift slower than the page (multi-layer parallax).
  const { scrollYProgress } = useScroll({ target: spanRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  // distanceToCenter: |viewport center - title center| in px. Infinity = withdraw
  // from the live-slot queue (used when the title is fully off-screen).
  const [distanceToCenter, setDistanceToCenter] = useState<number>(Infinity);

  // Coordinator-issued slot. When false, the shader's speed is set to 0, which
  // cancels its rAF loop entirely (last frame stays painted). When true,
  // animation runs as normal.
  const hasSlot = useShaderTitleSlot(distanceToCenter);

  // The metal flows with the page: scroll velocity surges the shader speed.
  // Callers passing speed=0 (reduced motion) opt out entirely.
  const reactiveSpeed = useScrollVelocitySpeed(speed);

  // Cursor-reactive flow (interactive titles): angle tilts toward the
  // pointer, distortion rises near it. Quantized so re-renders stay rare;
  // the LiquidMetal uniforms update in place without remounting.
  const [flow, setFlow] = useState({ angle: 70, distortion: 0.1 });
  const onPointerMove = interactive
    ? (e: React.PointerEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        const angle = Math.round((70 + nx * 60) / 4) * 4;
        const distortion = Math.round((0.1 + (Math.abs(nx) + Math.abs(ny)) * 0.3) * 50) / 50;
        setFlow((prev) => (prev.angle === angle && prev.distortion === distortion ? prev : { angle, distortion }));
      }
    : undefined;
  const onPointerLeave = interactive ? () => setFlow({ angle: 70, distortion: 0.1 }) : undefined;

  // Two IntersectionObservers:
  //
  // 1. Mount/unmount gate (rootMargin: 200px). Pre-mounts the WebGL layer
  //    before the title strictly enters the viewport, and tears it down after
  //    5s fully off-screen. Same behaviour as before.
  //
  // 2. Slot-priority gate (rootMargin: 0). Reports the title's distance from
  //    the viewport center to the shaderTitleCoordinator, which picks the
  //    closest N titles to keep animating. Withdraws (Infinity) when fully
  //    off-screen so the title relinquishes its slot promptly.
  //
  // The split observers keep the two budgets independent: lots of titles can
  // be MOUNTED at once (cheap — just a paused GL context), but only N
  // can be ANIMATING at once (expensive — fragment shader cost).
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let teardownTimer: ReturnType<typeof setTimeout> | null = null;

    const show = () => {
      if (teardownTimer !== null) {
        clearTimeout(teardownTimer);
        teardownTimer = null;
      }
      setVisible(true);
    };

    const mountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Mounting the WebGL layer is expensive (canvas raster + GL
          // context). During a fast-travel glide, every section flies past
          // this observer — ignore those; the travel-end check below mounts
          // the destination's title instead.
          if (isTravelingNow()) return;
          show();
        } else {
          if (teardownTimer === null) {
            // Short leash: WebGL contexts are capped ~16/page, and a lazy
            // teardown lets scrolled-past titles pile up against that cap.
            teardownTimer = setTimeout(() => {
              setVisible(false);
              teardownTimer = null;
            }, 1500);
          }
        }
      },
      { rootMargin: '120px' },
    );
    mountObs.observe(el);

    // After a glide lands, IO won't re-fire for elements it already reported
    // during the flight — evaluate proximity manually.
    const offTravelEnd = onTravelEnd(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      if (rect.bottom > -200 && rect.top < vh + 200) show();
    });

    // Slot priority. Tracks distance from viewport center even when the title
    // is partially out of view. Uses multiple thresholds so the coordinator
    // can re-shuffle smoothly as the user scrolls, without needing a scroll
    // listener (IO is cheaper and runs off the main thread).
    const slotObs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setDistanceToCenter(Infinity);
          return;
        }
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight || 1;
        const titleCenter = rect.top + rect.height / 2;
        const viewportCenter = vh / 2;
        setDistanceToCenter(Math.abs(titleCenter - viewportCenter));
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    slotObs.observe(el);

    return () => {
      mountObs.disconnect();
      slotObs.disconnect();
      offTravelEnd();
      if (teardownTimer !== null) clearTimeout(teardownTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const el = textRef.current;
    if (!el) return;

    const render = () => {
      const text = el.textContent || '';
      if (!text.trim()) return;

      const computed = getComputedStyle(el);
      const fontSize = parseFloat(computed.fontSize);
      const fontFamily = computed.fontFamily;
      const fontWeight = computed.fontWeight;

      const dpr = Math.min(window.devicePixelRatio, 2);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const font = `${fontWeight} ${fontSize * dpr}px ${fontFamily}`;
      ctx.font = font;
      const metrics = ctx.measureText(text);

      const pad = Math.ceil(fontSize * dpr * 0.15);
      const width = Math.ceil(metrics.width) + pad * 2;
      const height = Math.ceil(fontSize * dpr * 1.3) + pad * 2;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, pad, height / 2);

      setImageSrc(canvas.toDataURL('image/png'));
    };

    document.fonts.ready.then(render);
  }, [visible, children]);

  return (
    <motion.span
      ref={spanRef}
      className="metal-shader-title"
      // Explicit position keeps framer's useScroll offset math happy.
      style={{ y: parallaxY, position: 'relative' }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Tag
        ref={textRef as any}
        className={`metal-shader-title-text font-metal ${className}`}
      >
        {children}
      </Tag>
      {visible && imageSrc && (
        <LiquidMetal
          image={imageSrc}
          colorBack="#00000000"
          colorTint={tintColor}
          softness={0.1}
          repetition={2}
          shiftRed={0.3}
          shiftBlue={0.3}
          distortion={flow.distortion}
          contour={0.5}
          angle={flow.angle}
          fit="contain"
          scale={1}
          // speed=0 cancels the shader's internal rAF loop — used both for the
          // coordinator slot gating (only the N titles nearest the viewport
          // center animate) and for prefers-reduced-motion (speed=0 from
          // the caller).
          speed={hasSlot && speed > 0 ? reactiveSpeed : 0}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
      )}
    </motion.span>
  );
}
