import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface MetalIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  tooltip?: string;
}

const sizeMap = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-12 h-12 text-lg',
};

export default function MetalIconButton({
  icon,
  size = 'md',
  variant = 'solid',
  tooltip,
  disabled,
  className = '',
  ...props
}: MetalIconButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled}
      title={tooltip}
      className={`
        relative inline-flex items-center justify-center rounded-full
        transition-all duration-300
        ${sizeMap[size]}
        ${variant === 'solid'
          ? 'bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[rgba(255,255,255,0.08)] text-[#ccc] hover:text-white hover:border-[rgba(255,255,255,0.15)]'
          : variant === 'outline'
            ? 'bg-transparent border border-[rgba(255,255,255,0.1)] text-[#888] hover:text-white hover:border-[rgba(255,255,255,0.2)]'
            : 'bg-transparent border-none text-[#666] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        boxShadow: variant === 'solid'
          ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)'
          : 'none',
      }}
      {...(props as any)}
    >
      {icon}
    </motion.button>
  );
}
