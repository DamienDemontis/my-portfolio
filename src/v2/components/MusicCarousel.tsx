import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import MusicCard from './MusicCard';
import ParticleVisualizer from './ParticleVisualizer';
import LyricsPanel from './LyricsPanel';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { row1Tracks, row2Tracks, type Track } from '../data/musicData';

const CARD_WIDTH = 200;
const CARD_GAP = 16;
const CARD_MOBILE_WIDTH = 160;
const SCROLL_SPEED = 0.5; // px per frame (~30px/s at 60fps)
const HOVER_SPEED = 0.15; // slow crawl when hovered
const LERP_FACTOR = 0.07; // smoothness of speed transitions
const SPEED_SNAP_THRESHOLD = 0.01; // snap to target when this close

// ─── Expanded card view ───

function ExpandedView({
  track,
  sourceRect,
  onClose,
  isMobile,
}: {
  track: Track;
  sourceRect: DOMRect;
  onClose: () => void;
  isMobile: boolean;
}) {
  const { isPlaying, isLoading, progress, analyserRef, play, pause, resume, seek } =
    useMusicPlayer();

  const cardInnerRef = useRef<HTMLDivElement>(null);
  const pulseRafRef = useRef<number>(0);
  const smoothBassRef = useRef(0);

  // Auto-play on mount
  useEffect(() => {
    play(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bass-driven cover pulse: subtle scale 1.0 → 1.03 on kicks
  useEffect(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (!cardInnerRef.current) {
        pulseRafRef.current = requestAnimationFrame(tick);
        return;
      }
      analyser.getByteFrequencyData(dataArray);
      // Bass energy from bins 0–15
      let bassSum = 0;
      for (let i = 0; i < 16; i++) bassSum += dataArray[i];
      const rawBass = bassSum / 16 / 255;
      // EMA smooth
      smoothBassRef.current += (rawBass - smoothBassRef.current) * 0.3;
      const scale = 1 + smoothBassRef.current * 0.07;
      cardInnerRef.current.style.transform = `scale(${scale})`;
      pulseRafRef.current = requestAnimationFrame(tick);
    };
    pulseRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(pulseRafRef.current);
  }, [analyserRef]);

  const handlePlayPause = useCallback(() => {
    if (isLoading) return;
    if (isPlaying) pause();
    else resume();
  }, [isLoading, isPlaying, pause, resume]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const prog = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(prog);
  };

  const handleClose = useCallback(() => {
    pause();
    onClose();
  }, [pause, onClose]);

  // Compute animation origin from sourceRect
  const expandedSize = Math.min(400, typeof window !== 'undefined' ? window.innerWidth - 48 : 400);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Particle visualizer */}
      <ParticleVisualizer
        analyserRef={analyserRef}
        isPlaying={isPlaying}
        coverUrl={track.coverUrl}
        cardRect={{
          cx: (typeof window !== 'undefined' ? window.innerWidth : 800) / 2,
          cy: (typeof window !== 'undefined' ? window.innerHeight : 600) / 2 - 40,
          size: expandedSize,
        }}
      />

      {/* Card container */}
      <motion.div
        initial={{
          position: 'fixed',
          zIndex: 1002,
          left: sourceRect.left,
          top: sourceRect.top,
          width: sourceRect.width,
          height: sourceRect.width, // square
        }}
        animate={{
          left: (typeof window !== 'undefined' ? window.innerWidth : 800) / 2 - expandedSize / 2,
          top: (typeof window !== 'undefined' ? window.innerHeight : 600) / 2 - expandedSize / 2 - 40,
          width: expandedSize,
          height: expandedSize,
        }}
        exit={{
          left: sourceRect.left,
          top: sourceRect.top,
          width: sourceRect.width,
          height: sourceRect.width,
          opacity: 0,
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'fixed', zIndex: 1002 }}
      >
        <div ref={cardInnerRef} style={{ borderRadius: 20, width: '100%', height: '100%', transition: 'transform 0.05s ease-out' }}>
          {/* Album cover */}
          <img
            src={track.coverUrl}
            alt={track.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 20,
              display: 'block',
            }}
          />

          {/* Play/pause overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={handlePlayPause}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isLoading ? (
              <Spinner size={40} />
            ) : isPlaying ? (
              <PauseIcon size={40} />
            ) : (
              <PlayIcon size={40} />
            )}
          </motion.div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#222',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              zIndex: 10,
            }}
            aria-label="Close player"
          >
            ✕
          </motion.button>

          {/* Progress bar — larger hover target */}
          <div
            onClick={handleSeek}
            className="music-progress-bar"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 6,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '0 0 20px 20px',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'height 0.2s ease, bottom 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.height = '14px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.height = '6px';
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress * 100}%`,
                backgroundColor: '#ffe8d6',
                transition: 'width 0.15s linear',
              }}
            />
          </div>
        </div>

        {/* Track info below */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginTop: 16 }}
        >
          <div
            style={{
              color: '#fafafa',
              fontSize: 18,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}
          >
            {track.title}
          </div>
          <div
            style={{
              color: '#737373',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              marginTop: 4,
            }}
          >
            {track.artist}
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '3px 10px',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#525252',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              fontFamily: 'var(--font-body)',
            }}
          >
            {track.genre}
          </span>
          {isMobile && <LyricsPanel track={track} isMobile />}
        </motion.div>
        {!isMobile && <LyricsPanel track={track} isMobile={false} />}
      </motion.div>
    </>
  );
}

// ─── Icons ───

function PlayIcon({ size = 24 }: { size?: number }) {
  const s = size * 0.5;
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: `${s}px solid transparent`,
        borderBottom: `${s}px solid transparent`,
        borderLeft: `${s * 1.5}px solid white`,
        marginLeft: s * 0.3,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
      }}
    />
  );
}

function PauseIcon({ size = 24 }: { size?: number }) {
  const barW = size * 0.18;
  const barH = size * 0.6;
  return (
    <div style={{ display: 'flex', gap: size * 0.2 }}>
      <div style={{ width: barW, height: barH, backgroundColor: 'white', borderRadius: 2 }} />
      <div style={{ width: barW, height: barH, backgroundColor: 'white', borderRadius: 2 }} />
    </div>
  );
}

function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid rgba(255,255,255,0.2)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'music-spinner 0.7s linear infinite',
      }}
    />
  );
}

// ─── Carousel Row (RAF-based infinite scroll) ───

function CarouselRow({
  tracks,
  direction,
  targetSpeed,
  cardWidth,
  onCardSelect,
}: {
  tracks: Track[];
  direction: 'left' | 'right';
  targetSpeed: number;
  cardWidth: number;
  onCardSelect: (track: Track, rect: DOMRect) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const currentSpeedRef = useRef(targetSpeed);
  const targetSpeedRef = useRef(targetSpeed);
  const isDraggingRef = useRef(false);
  targetSpeedRef.current = targetSpeed;

  // One "set" width = tracks.length cards
  const oneSetWidth = tracks.length * (cardWidth + CARD_GAP);

  // Repeat tracks enough times so total > 2× viewport (guarantees seamless wrap)
  const [repeatCount, setRepeatCount] = useState(4);
  useEffect(() => {
    const vw = window.innerWidth;
    // We need at least 2 full sets beyond the viewport to never show gaps
    const needed = Math.ceil((vw * 3) / oneSetWidth) + 1;
    setRepeatCount(Math.max(needed, 3));
  }, [oneSetWidth]);

  // The "logical" width of one full set (what we wrap around)
  const rowWidth = oneSetWidth;

  // Initialize position for right-scrolling row
  useEffect(() => {
    if (direction === 'right') {
      posRef.current = -rowWidth;
    }
  }, [direction, rowWidth]);

  // RAF scroll loop with gradual speed transitions
  useEffect(() => {
    let raf: number;
    const tick = () => {
      // Lerp current speed toward target
      const target = isDraggingRef.current ? 0 : targetSpeedRef.current;
      const diff = target - currentSpeedRef.current;

      // Snap to exact target when close enough (prevents jittery sub-pixel oscillation)
      if (Math.abs(diff) < SPEED_SNAP_THRESHOLD) {
        currentSpeedRef.current = target;
      } else {
        currentSpeedRef.current += diff * LERP_FACTOR;
      }

      if (currentSpeedRef.current > 0 && rowRef.current) {
        if (direction === 'left') {
          posRef.current -= currentSpeedRef.current;
          if (posRef.current <= -rowWidth) posRef.current += rowWidth;
        } else {
          posRef.current += currentSpeedRef.current;
          if (posRef.current >= 0) posRef.current -= rowWidth;
        }
        rowRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, rowWidth]);

  // Drag
  const bind = useDrag(
    ({ active, movement: [mx], memo }) => {
      if (memo === undefined) memo = posRef.current;
      isDraggingRef.current = active;
      if (active) {
        let newPos = memo + mx;
        // Wrap using modulo to stay in bounds
        newPos = ((newPos % rowWidth) + rowWidth) % rowWidth;
        // For left-scroll, position is negative
        if (direction === 'left') newPos = -newPos || 0;
        else newPos = -(rowWidth - newPos);
        posRef.current = newPos;
        if (rowRef.current) {
          rowRef.current.style.transform = `translate3d(${newPos}px, 0, 0)`;
        }
      }
      return memo;
    },
    { axis: 'x', filterTaps: true }
  );

  // Build repeated track list
  const repeated: Track[] = [];
  for (let r = 0; r < repeatCount; r++) {
    repeated.push(...tracks);
  }

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        ref={rowRef}
        {...bind()}
        style={{
          display: 'flex',
          gap: CARD_GAP,
          cursor: 'grab',
          touchAction: 'pan-y',
          willChange: 'transform',
        }}
      >
        {repeated.map((track, i) => (
          <div key={`${track.id}-${i}`} style={{ flexShrink: 0, width: cardWidth }}>
            <MusicCard
              track={track}
              size={cardWidth}
              onSelect={(rect) => onCardSelect(track, rect)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Carousel ───

export default function MusicCarousel() {
  const { isPlaying } = useMusicPlayer();
  const [hovered, setHovered] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState<Track | null>(null);
  const [expandedRect, setExpandedRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Fully stop when expanded/playing; slow crawl on hover; full speed otherwise
  const targetSpeed = expandedTrack || isPlaying ? 0 : hovered ? HOVER_SPEED : SCROLL_SPEED;
  const cardW = isMobile ? CARD_MOBILE_WIDTH : CARD_WIDTH;

  const handleCardSelect = useCallback((track: Track, rect: DOMRect) => {
    setExpandedTrack(track);
    setExpandedRect(rect);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedTrack(null);
    setExpandedRect(null);
  }, []);

  return (
    <div
      role="region"
      aria-label="Music player carousel"
      style={{ width: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CarouselRow
        tracks={row1Tracks}
        direction="left"
        targetSpeed={targetSpeed}
        cardWidth={cardW}
        onCardSelect={handleCardSelect}
      />

      <div style={{ marginTop: isMobile ? 16 : 24 }}>
        <CarouselRow
          tracks={row2Tracks}
          direction="right"
          targetSpeed={targetSpeed}
          cardWidth={cardW}
          onCardSelect={handleCardSelect}
        />
      </div>

      <AnimatePresence>
        {expandedTrack && expandedRect && (
          <ExpandedView
            key={expandedTrack.id}
            track={expandedTrack}
            sourceRect={expandedRect}
            onClose={handleClose}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
