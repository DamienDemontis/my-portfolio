import { type InputHTMLAttributes, type TextareaHTMLAttributes, useState } from 'react';

interface MetalInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  multiline?: boolean;
  rows?: number;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3.5 text-base',
};

export default function MetalInput({
  label,
  size = 'md',
  error,
  multiline = false,
  rows = 4,
  className = '',
  onFocus,
  onBlur,
  ...props
}: MetalInputProps & Partial<TextareaHTMLAttributes<HTMLTextAreaElement>>) {
  const [focused, setFocused] = useState(false);

  const inputClasses = `
    w-full bg-[#0a0a0a]
    border transition-all duration-300
    text-[#d4d4d4] placeholder-[#444]
    font-light tracking-wide
    outline-none
    ${sizeStyles[size]}
    ${error
      ? 'border-[rgba(255,80,80,0.3)]'
      : focused
        ? 'border-[rgba(255,255,255,0.2)] shadow-[0_0_20px_rgba(255,255,255,0.04)]'
        : 'border-[rgba(255,255,255,0.08)]'
    }
    ${className}
  `;

  const handleFocus = (e: any) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[11px] uppercase tracking-[0.15em] text-[#666] font-medium">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          rows={rows}
          className={inputClasses}
          style={{ borderRadius: 2, resize: 'vertical' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(props as any)}
        />
      ) : (
        <input
          className={inputClasses}
          style={{ borderRadius: 2 }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...(props as any)}
        />
      )}
      {error && (
        <p className="text-[11px] text-[rgba(255,80,80,0.7)] tracking-wide">{error}</p>
      )}
    </div>
  );
}
