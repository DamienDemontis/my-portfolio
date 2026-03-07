import { useState, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetalTooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom';
}

export default function MetalTooltip({
  children,
  content,
  position = 'top',
}: MetalTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 200);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute left-1/2 -translate-x-1/2 z-50 whitespace-nowrap
              ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            `}
          >
            <div
              className="px-3 py-1.5 text-[11px] text-[#ccc] tracking-wide"
              style={{
                background: 'rgba(20,20,20,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
