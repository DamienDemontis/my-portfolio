import { LiquidMetal } from '@paper-design/shaders-react';

interface MetalFloatingOrbProps {
  size?: number;
  speed?: number;
  className?: string;
}

export default function MetalFloatingOrb({
  size = 200,
  speed = 0.6,
  className = '',
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
      <LiquidMetal
        shape="circle"
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
        scale={0.9}
        speed={speed}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
