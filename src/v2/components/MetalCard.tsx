import { type ReactNode, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface MetalCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function MetalCard({
  children,
  className = '',
  style,
  hover = true,
  glow = false,
  padding = 'md',
  onClick,
}: MetalCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={`
        relative
        bg-gradient-to-br from-[#111] via-[#0f0f0f] to-[#0a0a0a]
        border border-[rgba(255,255,255,0.06)]
        metal-shine-hover
        ${glow ? 'metal-glow-border' : ''}
        ${paddingMap[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        ...style,
      }}
    >
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.03) 2px,
            rgba(255,255,255,0.03) 4px
          )`,
          borderRadius: 'inherit',
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
