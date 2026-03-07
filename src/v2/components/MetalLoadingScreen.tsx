import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetallicSurface from '../core/MetallicSurface';

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
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => onComplete?.(), 600);
        }, 300);
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
            <MetallicSurface
              mode="procedural"
              pattern="radial"
              seed={7}
              speed={0.4}
              brightness={2.2}
              contrast={0.6}
              scale={5}
              liquid={0.2}
              edgeFade={1}
              lightColor="#ffffff"
              darkColor="#000000"
              tintColor="#ffffff"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
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
