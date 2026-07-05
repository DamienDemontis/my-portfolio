import { useEffect, useRef } from 'react';

/**
 * Engraved halftone portrait — the photo rendered as a metal-plate dot
 * engraving; hovering dissolves the engraving into the real photograph.
 * Same monochrome→color reveal language as the photography section.
 */
export default function MetalPortrait({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Work at a fixed internal width; dots stay crisp via device scaling.
      const W = 560;
      const H = Math.round((img.height / img.width) * W);
      canvas.width = W;
      canvas.height = H;

      // Sample luminance from a downscaled copy.
      const CELL = 5;
      const sw = Math.ceil(W / CELL);
      const sh = Math.ceil(H / CELL);
      const off = document.createElement('canvas');
      off.width = sw;
      off.height = sh;
      const offCtx = off.getContext('2d')!;
      offCtx.drawImage(img, 0, 0, sw, sh);
      const data = offCtx.getImageData(0, 0, sw, sh).data;

      ctx.fillStyle = '#0b0b0b';
      ctx.fillRect(0, 0, W, H);
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const i = (y * sw + x) * 4;
          const luma = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          // Bright areas = big raised dots (metal catching light).
          const r = luma * CELL * 0.62;
          if (r < 0.4) continue;
          ctx.beginPath();
          const shade = Math.round(120 + luma * 110);
          ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
          ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    img.src = src;
  }, [src]);

  return (
    <div
      className="metal-portrait group/portrait relative overflow-hidden"
      style={{
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 50px rgba(0,0,0,0.6)',
        transform: 'rotate(-1.2deg)',
        background: '#0b0b0b',
      }}
    >
      {/* Real photo underneath — revealed on hover. */}
      <img src={src} alt={alt} className="block w-full" loading="lazy" decoding="async" />
      {/* Engraving on top. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: 1 }}
      />
      {/* Corner rivets */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute z-10"
          style={{
            ...pos,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #6a6a6a, #191919 75%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.8), inset 0 0.5px 0 rgba(255,255,255,0.25)',
          }}
        />
      ))}
    </div>
  );
}
