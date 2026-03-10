import { useRef, useCallback } from 'react';

interface ColorRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ColorRevealImage({ src, alt, className = '', style }: ColorRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const grad = `radial-gradient(circle 150px at ${x}% ${y}%, black 0%, transparent 100%)`;

    if (colorRef.current) {
      colorRef.current.style.opacity = '1';
      colorRef.current.style.maskImage = grad;
      colorRef.current.style.webkitMaskImage = grad;
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '1';
      glowRef.current.style.background = `radial-gradient(circle 100px at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 70%)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (colorRef.current) {
      colorRef.current.style.opacity = '0';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
    >
      {/* Grayscale base */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(100%) brightness(0.85) contrast(1.1)', display: 'block' }}
        loading="lazy"
        draggable={false}
      />

      {/* Color overlay with radial mask - follows cursor */}
      <img
        ref={colorRef}
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0,
          transition: 'opacity 0.4s ease',
          display: 'block',
        }}
        loading="lazy"
        draggable={false}
      />

      {/* Soft glow near cursor */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          transition: 'opacity 0.4s ease',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
