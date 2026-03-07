import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { type ReactNode } from 'react';

interface MetalStatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: ReactNode;
  className?: string;
  decimals?: number;
}

export default function MetalStatCard({
  value,
  label,
  suffix = '',
  prefix = '',
  icon,
  className = '',
  decimals = 0,
}: MetalStatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v);
    return `${prefix}${n}${suffix}`;
  });
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);
  const hasAnimated = useRef(false);
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      animate(count, value, {
        duration: 2,
        ease: [0.4, 0, 0.2, 1],
      });
    }
  }, [inView, value, count]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative p-6 text-center group ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      }}
    >
      {icon && (
        <div className="mb-3 text-[#444] group-hover:text-[#666] transition-colors">
          {icon}
        </div>
      )}
      <div className="text-3xl md:text-4xl font-bold metal-chrome-text mb-2 tabular-nums">
        {displayValue}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#555] font-medium">
        {label}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
      />
    </motion.div>
  );
}
