import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MetalCursorProps {
  enabled?: boolean;
}

export default function MetalCursor({ enabled = true }: MetalCursorProps) {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28 });
  const trailX = useSpring(cursorX, { stiffness: 100, damping: 25 });
  const trailY = useSpring(cursorY, { stiffness: 100, damping: 25 });
  const isTouchDevice = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    isTouchDevice.current = 'ontouchstart' in window;
    if (isTouchDevice.current) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = !!target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
      if (hoveringRef.current !== isHoverable) {
        hoveringRef.current = isHoverable;
        setHovering(isHoverable);
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onHover);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onHover);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.style.cursor = '';
    };
  }, [enabled, cursorX, cursorY, visible]);

  if (!enabled || isTouchDevice.current) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: clicking ? 8 : hovering ? 40 : 12,
            height: clicking ? 8 : hovering ? 40 : 12,
            borderWidth: hovering ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            borderRadius: '50%',
            background: hovering ? 'transparent' : 'rgba(255,255,255,0.9)',
            borderColor: 'rgba(255,255,255,0.6)',
            borderStyle: 'solid',
          }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 0.3 : 0,
        }}
      >
        <div
          className="w-6 h-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)',
            filter: 'blur(2px)',
          }}
        />
      </motion.div>
    </>
  );
}
