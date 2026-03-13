import { useRef, useCallback } from 'react';
import TiltedCard from './TiltedCard';
import type { Track } from '../data/musicData';

interface MusicCardProps {
  track: Track;
  size?: number;
  onSelect?: (rect: DOMRect) => void;
}

export default function MusicCard({ track, size = 200, onSelect }: MusicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (!cardRef.current || !onSelect) return;
    const rect = cardRef.current.getBoundingClientRect();
    onSelect(rect);
  }, [onSelect]);

  const sizeStr = `${size}px`;

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      style={{ cursor: 'pointer', position: 'relative', zIndex: 1 }}
    >
      <TiltedCard
        imageSrc={track.coverUrl}
        altText={`${track.title} by ${track.artist}`}
        containerHeight={sizeStr}
        containerWidth={sizeStr}
        imageHeight={sizeStr}
        imageWidth={sizeStr}
        scaleOnHover={1.1}
        rotateAmplitude={14}
        borderRadius={15}
      />

      {/* Track info */}
      <div style={{ padding: '8px 4px 0', width: size }}>
        <div
          style={{
            color: '#fafafa',
            fontSize: size < 180 ? 11 : 13,
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.title}
        </div>
        <div
          style={{
            color: '#737373',
            fontSize: size < 180 ? 10 : 11,
            fontFamily: 'var(--font-body)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: 2,
          }}
        >
          {track.artist}
        </div>
        <span
          style={{
            display: 'inline-block',
            marginTop: 4,
            padding: '2px 6px',
            fontSize: size < 180 ? 8 : 9,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#525252',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 2,
            fontFamily: 'var(--font-body)',
          }}
        >
          {track.genre}
        </span>
      </div>
    </div>
  );
}
