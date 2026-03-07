import MetallicSurface from '../core/MetallicSurface';

interface MetalFloatingOrbProps {
  size?: number;
  seed?: number;
  speed?: number;
  className?: string;
  pattern?: 'radial' | 'noise' | 'wave';
  brightness?: number;
}

export default function MetalFloatingOrb({
  size = 200,
  seed = 42,
  speed = 0.15,
  className = '',
  pattern = 'radial',
  brightness = 2,
}: MetalFloatingOrbProps) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        animation: 'metal-float 6s ease-in-out infinite',
      }}
    >
      <MetallicSurface
        mode="procedural"
        pattern={pattern}
        seed={seed}
        speed={speed}
        brightness={brightness}
        contrast={0.7}
        scale={3}
        liquid={0.15}
        edgeFade={1}
        lightColor="#ffffff"
        darkColor="#111111"
        tintColor="#ffffff"
        waveAmplitude={0.6}
        noiseScale={0.5}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          filter: 'blur(0.5px)',
        }}
      />
    </div>
  );
}
