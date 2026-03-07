import { motion } from 'framer-motion';

interface MetalAvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36',
};

const ringSize = {
  sm: 'w-12 h-12',
  md: 'w-[72px] h-[72px]',
  lg: 'w-[104px] h-[104px]',
  xl: 'w-[152px] h-[152px]',
};

export default function MetalAvatar({
  src,
  alt = '',
  size = 'md',
  ring = true,
  className = '',
}: MetalAvatarProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {ring && (
        <div
          className={`absolute ${ringSize[size]} rounded-full`}
          style={{
            background: 'conic-gradient(from 0deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03), rgba(255,255,255,0.15), rgba(255,255,255,0.03), rgba(255,255,255,0.15))',
            animation: 'metal-rotate-slow 12s linear infinite',
          }}
        />
      )}
      <div
        className={`relative ${sizeMap[size]} rounded-full overflow-hidden`}
        style={{
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.8)' }}
        />
      </div>
    </motion.div>
  );
}
