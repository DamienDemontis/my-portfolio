import { useId } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MetalProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export default function MetalProgressRing({
  value,
  size = 100,
  strokeWidth = 3,
  label,
  className = '',
}: MetalProgressRingProps) {
  const gradientId = useId();
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div ref={ref} className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold metal-chrome-text tabular-nums font-heading">{value}%</span>
      </div>
      {label && (
        <span className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#555] font-medium">
          {label}
        </span>
      )}
    </div>
  );
}
