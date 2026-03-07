import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  spotlightSize?: number;
  spotlightOpacity?: number;
}

export default function SpotlightCard({
  children,
  className = '',
  style,
  spotlightSize = 300,
  spotlightOpacity = 0.06,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlight.style.background = `radial-gradient(${spotlightSize}px circle at ${x}px ${y}px, rgba(255,255,255,${spotlightOpacity}), transparent)`;
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 'transparent';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        ...style,
      }}
    >
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-[background] duration-200 z-[1]"
        style={{ borderRadius: 'inherit' }}
      />
      <div className="relative z-[2]">{children}</div>
    </motion.div>
  );
}
