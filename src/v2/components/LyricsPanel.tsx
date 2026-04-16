import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import type { Track } from '../data/musicData';

interface LyricLine {
  time: number; // seconds
  text: string;
}

function parseLRC(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const raw of lrc.split('\n')) {
    const match = raw.match(/^\[(\d+):(\d+\.\d+)\]\s*(.*)/);
    if (!match) continue;
    const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
    const text = match[3].trim();
    if (text.length > 0) {
      lines.push({ time, text });
    }
  }
  return lines;
}

/** Returns the index of the active lyric line, or -1 if before first line */
function useActiveLyricIndex(lyrics: LyricLine[] | null, offset: number) {
  const { progress } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector('audio');
  }, []);

  if (!lyrics || lyrics.length === 0) return -1;

  // progress triggers re-renders; we read currentTime for precision
  void progress;
  const currentTime = (audioRef.current?.currentTime ?? 0) + offset;

  // Binary-ish search: find last line with time ≤ currentTime
  let idx = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (lyrics[i].time <= currentTime) {
      idx = i;
      break;
    }
  }
  return idx;
}

const VISIBLE_LINES = 7; // lines visible in the scrolling container
const LINE_HEIGHT = 40; // px per line

export default function LyricsPanel({
  track,
  isMobile,
}: {
  track: Track;
  isMobile: boolean;
}) {
  const [lyrics, setLyrics] = useState<LyricLine[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [debugOffset, setDebugOffset] = useState(track.lyricsOffset ?? 0);

  useEffect(() => {
    setLyrics(null);
    setFailed(false);
    setDebugOffset(track.lyricsOffset ?? 0);

    fetch(`/music/lyrics/${track.id}.lrc`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then((text) => {
        const parsed = parseLRC(text);
        if (parsed.length > 0) setLyrics(parsed);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, [track.id, track.lyricsOffset]);

  const activeIdx = useActiveLyricIndex(lyrics, debugOffset);

  if (failed || !lyrics) return null;

  const containerHeight = isMobile
    ? VISIBLE_LINES * LINE_HEIGHT * 0.6
    : VISIBLE_LINES * LINE_HEIGHT;

  if (isMobile) {
    return (
      <div style={{ width: '100%', marginTop: 20 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            width: '100%',
            height: containerHeight,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <LyricsScroller
            lyrics={lyrics}
            activeIdx={activeIdx}
            containerHeight={containerHeight}
            align="center"
          />
        </motion.div>
        {import.meta.env.DEV && (
          <OffsetDebugCard
            trackId={track.id}
            trackTitle={track.title}
            offset={debugOffset}
            onOffsetChange={setDebugOffset}
          />
        )}
      </div>
    );
  }

  // Position to the right of the expanded card, vertically centered on the cover
  const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
  const expandedSize = Math.min(400, vw - 48);
  const cardTop = vh / 2 - expandedSize / 2 - 40; // matches MusicCarousel animate top
  const cardCenterY = cardTop + expandedSize / 2;
  const cardRight = vw / 2 + expandedSize / 2;
  const panelLeft = cardRight + 32;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          position: 'fixed',
          left: panelLeft,
          top: cardCenterY - containerHeight / 2,
          width: 260,
          height: containerHeight,
          overflow: 'hidden',
          zIndex: 1002,
          pointerEvents: 'none',
        }}
      >
        <LyricsScroller
          lyrics={lyrics}
          activeIdx={activeIdx}
          containerHeight={containerHeight}
          align="left"
        />
      </motion.div>
      {import.meta.env.DEV && (
        <OffsetDebugCard
          trackId={track.id}
          trackTitle={track.title}
          offset={debugOffset}
          onOffsetChange={setDebugOffset}
          style={{
            position: 'fixed',
            left: panelLeft,
            top: cardCenterY + containerHeight / 2 + 16,
            zIndex: 1003,
          }}
        />
      )}
    </>
  );
}

function OffsetDebugCard({
  trackId,
  trackTitle,
  offset,
  onOffsetChange,
  style,
}: {
  trackId: string;
  trackTitle: string;
  offset: number;
  onOffsetChange: (v: number) => void;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${trackTitle} (${trackId}): lyricsOffset: ${offset}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const btnStyle: React.CSSProperties = {
    width: 28,
    height: 28,
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 10,
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        marginTop: 12,
        ...style,
      }}
    >
      <button style={btnStyle} onClick={() => onOffsetChange(Math.round((offset - 0.5) * 10) / 10)}>
        -
      </button>
      <span
        style={{
          color: '#a3a3a3',
          fontSize: 12,
          fontFamily: 'var(--font-body)',
          minWidth: 52,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        {offset >= 0 ? '+' : ''}{offset.toFixed(1)}s
      </span>
      <button style={btnStyle} onClick={() => onOffsetChange(Math.round((offset + 0.5) * 10) / 10)}>
        +
      </button>
      <button
        onClick={handleCopy}
        style={{
          ...btnStyle,
          width: 'auto',
          padding: '0 10px',
          fontSize: 11,
          gap: 4,
          marginLeft: 4,
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </motion.div>
  );
}

function LyricsScroller({
  lyrics,
  activeIdx,
  containerHeight,
  align,
}: {
  lyrics: LyricLine[];
  activeIdx: number;
  containerHeight: number;
  align: 'left' | 'center';
}) {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollY, setScrollY] = useState(0);

  // Measure actual DOM positions to compute scroll offset
  useEffect(() => {
    if (activeIdx < 0 || !lineRefs.current[activeIdx]) {
      setScrollY(0);
      return;
    }
    const el = lineRefs.current[activeIdx];
    if (!el) return;
    // Center the active element in the container
    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const target = containerHeight / 2 - elTop - elHeight / 2;
    setScrollY(target);
  }, [activeIdx, containerHeight]);

  // Top/bottom fade masks
  const maskImage =
    'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)';

  return (
    <div
      style={{
        position: 'relative',
        height: containerHeight,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    >
      <motion.div
        animate={{ y: scrollY }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
        style={{ position: 'absolute', left: 0, right: 0 }}
      >
        {lyrics.map((line, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          const distance = Math.abs(i - activeIdx);

          return (
            <div
              key={line.time}
              ref={(el) => { lineRefs.current[i] = el; }}
              style={{
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: align === 'center' ? 'center' : 'flex-start',
                transition: 'color 0.35s ease, opacity 0.35s ease, transform 0.35s ease',
                color: isActive ? '#ffffff' : isPast ? '#525252' : '#6b6b6b',
                opacity: isActive ? 1 : distance <= 2 ? 0.7 : 0.35,
                fontFamily: 'var(--font-body)',
                fontSize: isActive ? 17 : 15,
                fontWeight: isActive ? 700 : 400,
                lineHeight: 1.4,
                letterSpacing: isActive ? '0.01em' : '0',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: align === 'center' ? 'center center' : 'left center',
                paddingLeft: align === 'left' ? 4 : 0,
                paddingRight: align === 'left' ? 4 : 0,
                textAlign: align,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
