import { useEffect, useRef, useState, useId, useMemo, type ReactNode } from 'react';
import MetallicSurface from '../core/MetallicSurface';

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
  const id = useId();

  const seed = useMemo(
    () => id.split('').reduce((a, c) => a + c.charCodeAt(0), 0),
    [id],
  );

  // Only start expensive WebGL work when the title is near the viewport
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
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
          style={{ position: 'absolute' as const, inset: 0 }}
        />
      )}
    </span>
  );
}
