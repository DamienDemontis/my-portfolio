import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface MetalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
}

const sizeStyles = {
  sm: 'px-4 py-1.5 text-xs gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
};

const variantStyles = {
  solid: `
    bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]
    border border-[rgba(255,255,255,0.1)]
    text-[#e0e0e0]
    hover:from-[#333] hover:to-[#222]
    hover:border-[rgba(255,255,255,0.18)]
    hover:text-white
    active:from-[#1a1a1a] active:to-[#111]
  `,
  outline: `
    bg-transparent
    border border-[rgba(255,255,255,0.12)]
    text-[#a3a3a3]
    hover:bg-[rgba(255,255,255,0.04)]
    hover:border-[rgba(255,255,255,0.22)]
    hover:text-white
  `,
  ghost: `
    bg-transparent border border-transparent
    text-[#737373]
    hover:bg-[rgba(255,255,255,0.04)]
    hover:text-[#d4d4d4]
  `,
};

export default function MetalButton({
  children,
  variant = 'solid',
  size = 'md',
  icon,
  iconRight,
  loading,
  disabled,
  className = '',
  ...props
}: MetalButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center font-medium
        tracking-wide uppercase transition-all duration-300
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        metal-shine-hover overflow-hidden
        ${className}
      `}
      style={{ borderRadius: 2 }}
      {...(props as any)}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <span className="w-4 h-4 border-2 border-[#555] border-t-white rounded-full animate-spin" />
        </span>
      )}
      <span className={`inline-flex items-center gap-inherit ${loading ? 'invisible' : ''}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </span>
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />
    </motion.button>
  );
}
