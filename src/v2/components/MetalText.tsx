import { type ReactNode, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface MetalTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  variant?: 'chrome' | 'silver' | 'dim' | 'bright' | 'liquid';
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}

const variantClasses: Record<string, string> = {
  chrome: 'metal-chrome-text',
  silver: 'text-[#a3a3a3]',
  dim: 'text-[#555]',
  bright: 'text-[#e8e8e8]',
  liquid: 'metal-chrome-text-animated',
};

const sizeDefaults: Record<string, string> = {
  h1: 'text-5xl md:text-7xl font-bold tracking-tight',
  h2: 'text-3xl md:text-5xl font-bold tracking-tight',
  h3: 'text-xl md:text-2xl font-semibold',
  h4: 'text-lg font-semibold',
  p: 'text-base leading-relaxed',
  span: '',
};

export default function MetalText({
  children,
  as: Tag = 'p',
  variant = 'bright',
  animated = false,
  className = '',
  style,
}: MetalTextProps) {
  const combinedClass = `${sizeDefaults[Tag]} ${variantClasses[variant]} ${className}`;

  if (animated) {
    const MotionTag = motion[Tag];
    return (
      <MotionTag
        className={combinedClass}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </MotionTag>
    );
  }

  return <Tag className={combinedClass} style={style}>{children}</Tag>;
}
