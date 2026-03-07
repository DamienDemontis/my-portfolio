import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface MetalSkillBarProps {
  label: string;
  level: number;
  icon?: ReactNode;
  className?: string;
}

export default function MetalSkillBar({
  label,
  level,
  icon,
  className = '',
}: MetalSkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`group ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#555] text-sm">{icon}</span>}
          <span className="text-xs uppercase tracking-[0.12em] text-[#888] font-medium group-hover:text-[#ccc] transition-colors">
            {label}
          </span>
        </div>
        <span className="text-[10px] text-[#555] tabular-nums font-medium">{level}%</span>
      </div>
      <div
        className="relative h-1 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 1,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="absolute inset-y-0 left-0"
          style={{
            background: 'linear-gradient(90deg, #333, #555, #333)',
            backgroundSize: '200% 100%',
            borderRadius: 1,
            boxShadow: '0 0 8px rgba(255,255,255,0.05)',
          }}
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="absolute inset-y-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, #444, #777, #444)',
            backgroundSize: '200% 100%',
            borderRadius: 1,
          }}
        />
      </div>
    </motion.div>
  );
}
