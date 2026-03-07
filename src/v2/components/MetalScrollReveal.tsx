import { type ReactNode } from 'react';
import { motion, type Variant } from 'framer-motion';

interface MetalScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
  once?: boolean;
}

const getVariants = (direction: string, distance: number): { hidden: Variant; visible: Variant } => {
  const offsets: Record<string, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    fade: { x: 0, y: 0 },
  };

  const offset = offsets[direction] || offsets.up;

  return {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
    },
  };
};

export default function MetalScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  distance = 40,
  once = true,
}: MetalScrollRevealProps) {
  const variants = getVariants(direction, distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
