import { type ReactNode, type CSSProperties } from 'react';

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  speed?: number;
  color?: string;
  as?: 'div' | 'button' | 'a';
  onClick?: () => void;
}

export default function StarBorder({
  children,
  className = '',
  style,
  speed = 6,
  color = 'rgba(255,255,255,0.15)',
  as: Tag = 'div',
  onClick,
}: StarBorderProps) {
  return (
    <Tag
      className={`relative inline-block ${className}`}
      style={{
        borderRadius: 4,
        ...style,
      }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ borderRadius: 'inherit' }}
      >
        <div
          className="absolute w-[200%] h-[200%]"
          style={{
            top: '-50%',
            left: '-50%',
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 60deg, transparent 120deg)`,
            animation: `metal-rotate-slow ${speed}s linear infinite`,
          }}
        />
      </div>
      <div
        className="absolute inset-px"
        style={{
          borderRadius: 'inherit',
          background: '#0a0a0a',
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </Tag>
  );
}
