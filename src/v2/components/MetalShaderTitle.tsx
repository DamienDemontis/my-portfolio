import { useEffect, useRef, useState, useId, useMemo, type ReactNode } from 'react';
import MetallicSurface from '../core/MetallicSurface';
import { useShaderTitleSlot } from '../core/shaderTitleCoordinator';

interface MetalShaderTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  tintColor?: string;
  speed?: number;
  brightness?: number;
}

export default function MetalShaderTitle({
  children,
  as: Tag = 'h2',
  className = '',
  tintColor = '#ffffff',
  speed = 0.3,
  brightness = 2,
}: MetalShaderTitleProps) {
  const textRef = useRef<HTMLElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  // distanceToCenter: |viewport center - title center| in px. Infinity = withdraw
  // from the live-slot queue (used when the title is fully off-screen).
  const [distanceToCenter, setDistanceToCenter] = useState<number>(Infinity);
  const id = useId();

  // Coordinator-issued slot. When false, MetallicSurface freezes its draw loop
  // (last frame stays painted). When true, animation runs as normal.
  const hasSlot = useShaderTitleSlot(distanceToCenter);

  const seed = useMemo(
    () => id.split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    [id],
  );

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

    const mountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (teardownTimer !== null) {
            clearTimeout(teardownTimer);
            teardownTimer = null;
          }
          setVisible(true);
        } else {
          if (teardownTimer === null) {
            teardownTimer = setTimeout(() => {
              setVisible(false);
              teardownTimer = null;
            }, 5000);
          }
        }
      },
      { rootMargin: '200px' },
    );
    mountObs.observe(el);

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
    <span className="metal-shader-title">
      <Tag
        ref={textRef as any}
        className={`metal-shader-title-text font-metal ${className}`}
      >
        {children}
      </Tag>
      {visible && imageSrc && (
        <MetallicSurface
          mode="image"
          imageSrc={imageSrc}
          seed={seed}
          scale={4}
          refraction={0.01}
          blur={0.015}
          liquid={0.75}
          speed={speed}
          brightness={brightness}
          contrast={0.5}
          fresnel={1}
          lightColor="#ffffff"
          darkColor="#000000"
          patternSharpness={1}
          waveAmplitude={1}
          noiseScale={0.5}
          chromaticSpread={2}
          distortion={1}
          contour={0.2}
          tintColor={tintColor}
          edgeFade={0}
          // ── Perf tuning for title use-case ──
          // 1) DPR cap 1.25: the shader output is masked through text, so
          //    high-DPR shimmer differences are imperceptible. Cuts fragment
          //    cost ~2.5× compared to DPR 2.
          // 2) Frame interval 1000/24: title wobble at speed=0.3 is too slow
          //    for the eye to tell 24fps from 30fps. Cuts GPU work 20%.
          // 3) frozen={!hasSlot}: when the live-slot coordinator has more
          //    than N titles requesting animation, the further-from-center
          //    ones freeze their last frame. The canvas stays painted; only
          //    uniform updates + draw calls stop.
          // 4) perfLabel: name shown in the PerfHUD's GPU-time table.
          dprCap={1.25}
          frameInterval={1000 / 24}
          frozen={!hasSlot}
          perfLabel="Title"
          style={{ position: 'absolute' as const, inset: 0 }}
        />
      )}
    </span>
  );
}
