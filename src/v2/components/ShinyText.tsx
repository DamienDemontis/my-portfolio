import { type ReactNode } from 'react';

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  as?: 'span' | 'p' | 'div';
}

export default function ShinyText({
  children,
  className = '',
  speed = 3,
  as: Tag = 'span',
}: ShinyTextProps) {
  return (
    <Tag
      className={`inline-block ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.4) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `metal-shiny-slide ${speed}s linear infinite`,
      }}
    >
      {children}
    </Tag>
  );
}
