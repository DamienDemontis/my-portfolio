import { type ReactNode } from 'react';

interface MetalBadgeProps {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'chrome';
  size?: 'sm' | 'md';
  className?: string;
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export default function MetalBadge({
  children,
  variant = 'solid',
  size = 'sm',
  className = '',
}: MetalBadgeProps) {
  const baseClasses = `
    inline-flex items-center font-medium uppercase tracking-widest
    ${sizeStyles[size]}
  `;

  if (variant === 'chrome') {
    return (
      <span
        className={`${baseClasses} metal-chrome-text border border-[rgba(255,255,255,0.12)] ${className}`}
        style={{ borderRadius: 2 }}
      >
        {children}
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span
        className={`${baseClasses} text-[#888] border border-[rgba(255,255,255,0.1)] bg-transparent ${className}`}
        style={{ borderRadius: 2 }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} text-[#999] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] ${className}`}
      style={{ borderRadius: 2 }}
    >
      {children}
    </span>
  );
}
