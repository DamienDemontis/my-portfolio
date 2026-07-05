import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidMetal } from '@paper-design/shaders-react';

interface MetalLoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function MetalLoadingScreen({
  onComplete,
  duration = 2500,
}: MetalLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        // Release only once the display fonts are in — otherwise the hero
        // titles rasterize their shader masks with fallback fonts and get
        // re-rendered (visible jank) right after the loader lifts. The
        // timer is the *minimum*; fonts are usually ready well before it.
        const fontsReady =
          typeof document !== 'undefined' && 'fonts' in document
            ? document.fonts.ready
            : Promise.resolve();
        // Never hold the loader hostage on a slow font CDN.
        const failsafe = new Promise((res) => setTimeout(res, 1500));
        Promise.race([fontsReady, failsafe]).then(() => {
          setTimeout(() => {
            setVisible(false);
            setTimeout(() => onComplete?.(), 600);
          }, 300);
        });
      }
    };
    requestAnimationFrame(tick);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ background: '#000' }}
        >
          <div className="relative w-32 h-32 mb-12">
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
              speed={1}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <div className="w-48 relative">
            <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <motion.div
              className="absolute top-0 left-0 h-px"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4))',
                boxShadow: '0 0 8px rgba(255,255,255,0.1)',
              }}
            />
          </div>

          <div className="mt-6 text-[10px] uppercase tracking-[0.4em] text-[#333] font-medium tabular-nums">
            {Math.round(progress * 100)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
