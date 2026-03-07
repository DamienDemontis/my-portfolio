import { motion } from 'framer-motion';

interface MetalSectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  number?: string;
}

export default function MetalSectionHeader({
  title,
  subtitle,
  align = 'center',
  className = '',
  number,
}: MetalSectionHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`mb-16 ${alignClasses[align]} ${className}`}
    >
      {number && (
        <span className="block text-[11px] uppercase tracking-[0.3em] text-[#444] font-medium mb-4">
          {number}
        </span>
      )}
      <div className="relative inline-block">
        {align === 'center' && (
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
          />
        )}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight metal-chrome-text">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-4 text-sm text-[#555] tracking-wide max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      {align === 'center' && (
        <div
          className="mt-6 mx-auto w-16 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
        />
      )}
    </motion.div>
  );
}
