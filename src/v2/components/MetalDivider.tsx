interface MetalDividerProps {
  className?: string;
  variant?: 'thin' | 'thick' | 'gradient' | 'dashed';
  ornament?: boolean;
}

export default function MetalDivider({
  className = '',
  variant = 'gradient',
  ornament = false,
}: MetalDividerProps) {
  if (variant === 'dashed') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="h-px flex-1"
            style={{
              background: `rgba(255,255,255,${0.03 + Math.sin(i * 0.3) * 0.03})`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div
        className="flex-1 h-px"
        style={{
          background:
            variant === 'gradient'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)'
              : variant === 'thick'
                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent)'
                : 'rgba(255,255,255,0.06)',
          height: variant === 'thick' ? 2 : 1,
        }}
      />
      {ornament && (
        <>
          <div
            className="w-1.5 h-1.5 mx-3 rotate-45"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <div
            className="flex-1 h-px"
            style={{
              background:
                variant === 'gradient'
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)'
                  : 'rgba(255,255,255,0.06)',
              height: variant === 'thick' ? 2 : 1,
            }}
          />
        </>
      )}
    </div>
  );
}
