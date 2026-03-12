# Music Player Carousel Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive music player carousel in the Interests section with 11 tracks displayed as tilted album-cover cards in a two-row infinite carousel, with real audio playback and ambient glow visualizer.

**Architecture:** React context manages a single `<audio>` element and Web Audio API analyser. MusicCard wraps a TiltedCard (from reactbits.dev) with play/pause overlay, progress bar, and amplitude-driven glow. MusicCarousel arranges cards in two rows with framer-motion infinite scroll and @use-gesture drag support. Everything integrates into the existing V2Interests section above the category grid.

**Tech Stack:** React 18, TypeScript, framer-motion ^10, @use-gesture/react ^10, Web Audio API, CSS transforms

**Spec:** `docs/superpowers/specs/2026-03-12-music-player-carousel-design.md`

---

## Chunk 1: Data, Assets & Foundation

### Task 1: Update .gitignore and create directory structure

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add music mp3s and .superpowers to .gitignore**

Append to `.gitignore`:

```
# Audio files (user-provided, not committed)
public/music/*.mp3

# Superpowers brainstorm artifacts
.superpowers/
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p public/music/covers
mkdir -p src/v2/contexts
mkdir -p src/v2/data
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add music mp3s and .superpowers to gitignore"
```

---

### Task 2: Create track data file

**Files:**
- Create: `src/v2/data/musicData.ts`

- [ ] **Step 1: Create musicData.ts with Track interface and track list**

```typescript
export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

export const tracks: Track[] = [
  {
    id: 'champagne-coast',
    title: 'Champagne Coast',
    artist: 'Blood Orange',
    genre: 'Indie R&B',
    coverUrl: '/music/covers/champagne-coast.jpg',
    audioUrl: '/music/champagne-coast.mp3',
  },
  {
    id: 'in-my-zone',
    title: 'In My Zone',
    artist: 'bbno$ & VALORANT',
    genre: 'Hip House',
    coverUrl: '/music/covers/in-my-zone.jpg',
    audioUrl: '/music/in-my-zone.mp3',
  },
  {
    id: 'touch-off',
    title: 'Touch Off',
    artist: 'UVERworld',
    genre: 'J-Rock',
    coverUrl: '/music/covers/touch-off.jpg',
    audioUrl: '/music/touch-off.mp3',
  },
  {
    id: 'feel-good-inc',
    title: 'Feel Good Inc',
    artist: 'Gorillaz',
    genre: 'Alternative',
    coverUrl: '/music/covers/feel-good-inc.jpg',
    audioUrl: '/music/feel-good-inc.mp3',
  },
  {
    id: 'usseewa',
    title: 'うっせぇわ (Usseewa)',
    artist: 'Ado',
    genre: 'J-Pop',
    coverUrl: '/music/covers/usseewa.jpg',
    audioUrl: '/music/usseewa.mp3',
  },
  {
    id: 'glace',
    title: 'Glace',
    artist: 'Say',
    genre: 'TBD',
    coverUrl: '/music/covers/glace.jpg',
    audioUrl: '/music/glace.mp3',
  },
  {
    id: 'dancing-with-myself',
    title: 'Dancing with Myself',
    artist: 'Billy Idol',
    genre: 'New Wave',
    coverUrl: '/music/covers/dancing-with-myself.jpg',
    audioUrl: '/music/dancing-with-myself.mp3',
  },
  {
    id: 'naihishinsho',
    title: '内秘心書 (Naihishinsho)',
    artist: 'ONE OK ROCK',
    genre: 'J-Rock',
    coverUrl: '/music/covers/naihishinsho.jpg',
    audioUrl: '/music/naihishinsho.mp3',
  },
  {
    id: 'une-vie-a-taimer',
    title: "Une vie à t'aimer",
    artist: 'Lorien Testard',
    genre: 'Game OST',
    coverUrl: '/music/covers/une-vie-a-taimer.jpg',
    audioUrl: '/music/une-vie-a-taimer.mp3',
  },
  {
    id: 'malas-decisiones',
    title: 'Malas Decisiones',
    artist: 'Kenia Os',
    genre: 'Latin Pop',
    coverUrl: '/music/covers/malas-decisiones.jpg',
    audioUrl: '/music/malas-decisiones.mp3',
  },
  {
    id: 'echec-et-mat',
    title: 'Échec et mat',
    artist: 'Miki',
    genre: 'Electronic Pop',
    coverUrl: '/music/covers/echec-et-mat.jpg',
    audioUrl: '/music/echec-et-mat.mp3',
  },
];

/** Row 1: first 6 tracks, Row 2: last 5 + first track duplicate (6 each) */
export const row1Tracks = tracks.slice(0, 6);
export const row2Tracks = [...tracks.slice(6), tracks[0]];
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit src/v2/data/musicData.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/v2/data/musicData.ts
git commit -m "feat: add music track data with Track interface"
```

---

### Task 3: Create TiltedCard component

**Files:**
- Create: `src/v2/components/TiltedCard.tsx`

This is adapted from reactbits.dev's TiltedCard. Key changes from the original:
- TypeScript props interface
- Import from `framer-motion` (not `motion/react` — project uses framer-motion ^10)
- Inline styles instead of separate CSS file (keeps it self-contained)
- `overlayContent` prop for play/pause controls
- `displayOverlayContent` prop to toggle overlay visibility
- Remove `showMobileWarning` (not needed for our use case)
- Remove tooltip/figcaption (not needed)

- [ ] **Step 1: Create TiltedCard.tsx**

```tsx
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const springValues = { damping: 30, stiffness: 100, mass: 2 };

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  children?: React.ReactNode;
}

export default function TiltedCard({
  imageSrc,
  altText = 'Album cover',
  containerHeight = '200px',
  containerWidth = '200px',
  imageHeight = '200px',
  imageWidth = '200px',
  scaleOnHover = 1.05,
  rotateAmplitude = 14,
  overlayContent = null,
  displayOverlayContent = false,
  children,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <figure
      ref={ref}
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight,
        perspective: 800,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          position: 'relative',
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: imageWidth,
            height: imageHeight,
            objectFit: 'cover',
            borderRadius: 4,
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
              willChange: 'transform',
              transform: 'translateZ(30px)',
              borderRadius: 4,
            }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
      {children}
    </figure>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/v2/components/TiltedCard.tsx
git commit -m "feat: add TiltedCard component (adapted from reactbits.dev)"
```

---

## Chunk 2: MusicPlayerContext

### Task 4: Create MusicPlayerContext

**Files:**
- Create: `src/v2/contexts/MusicPlayerContext.tsx`

This is the core audio engine. It manages:
- A single `<audio>` element shared across all cards
- Web Audio API `AudioContext` + `AnalyserNode` for amplitude data
- RAF loop that writes amplitude to a ref (no re-renders at 60fps)
- Actions: `play(track)`, `pause()`, `resume()`, `seek(progress)`, `stop()`
- Lazy loading: audio only fetches when play is called, with loading spinner state

**Important implementation details:**
- `AudioContext` is created on first user interaction (browser gesture requirement)
- `MediaElementAudioSourceNode` can only be created ONCE per `<audio>` element — cache it
- RAF loop only runs during playback
- Progress updates via `timeupdate` event (not RAF — less frequent is fine for progress bar)
- On track end: reset to stopped state, keep `currentTrack` set
- On unmount: disconnect nodes, cancel RAF, pause audio

- [ ] **Step 1: Create MusicPlayerContext.tsx**

```tsx
import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Track } from '../data/musicData';

interface MusicPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
}

interface MusicPlayerActions {
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  seek: (progress: number) => void;
  stop: () => void;
}

interface MusicPlayerContextValue extends MusicPlayerState, MusicPlayerActions {
  amplitudeRef: React.MutableRefObject<number>;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const amplitudeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize Web Audio API on first interaction
  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const audio = audioRef.current!;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch {
      // Web Audio unavailable — player still works, just no glow
      console.warn('Web Audio API unavailable');
    }
  }, []);

  // RAF loop for amplitude — only runs during playback
  const startAmplitudeLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      amplitudeRef.current = sum / dataArray.length / 255;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAmplitudeLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    amplitudeRef.current = 0;
  }, []);

  const play = useCallback(
    (track: Track) => {
      const audio = audioRef.current!;
      ensureAudioContext();

      // If same track and paused, just resume
      if (currentTrack?.id === track.id && !isPlaying && audio.src.includes(track.audioUrl)) {
        audio.play();
        setIsPlaying(true);
        startAmplitudeLoop();
        return;
      }

      // New track
      audio.pause();
      stopAmplitudeLoop();
      setIsLoading(true);
      setProgress(0);
      setCurrentTrack(track);
      setIsPlaying(false);

      audio.src = track.audioUrl;
      audio.load();

      const onCanPlay = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.play().then(() => {
          setIsLoading(false);
          setIsPlaying(true);
          startAmplitudeLoop();
        }).catch(() => {
          setIsLoading(false);
        });
      };

      const onError = () => {
        audio.removeEventListener('error', onError);
        audio.removeEventListener('canplaythrough', onCanPlay);
        setIsLoading(false);
        console.error('Failed to load audio:', track.audioUrl);
      };

      audio.addEventListener('canplaythrough', onCanPlay, { once: true });
      audio.addEventListener('error', onError, { once: true });
    },
    [currentTrack, isPlaying, ensureAudioContext, startAmplitudeLoop, stopAmplitudeLoop]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    stopAmplitudeLoop();
  }, [stopAmplitudeLoop]);

  const resume = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
    startAmplitudeLoop();
  }, [startAmplitudeLoop]);

  const seek = useCallback((prog: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = prog * audio.duration;
      setProgress(prog);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    stopAmplitudeLoop();
  }, [stopAmplitudeLoop]);

  // Progress tracking via timeupdate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      stopAmplitudeLoop();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [stopAmplitudeLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      sourceNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        progress,
        amplitudeRef,
        play,
        pause,
        resume,
        seek,
        stop,
      }}
    >
      <audio ref={audioRef} preload="none" />
      {children}
    </MusicPlayerContext.Provider>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/v2/contexts/MusicPlayerContext.tsx
git commit -m "feat: add MusicPlayerContext with Web Audio analyser"
```

---

## Chunk 3: MusicCard Component

### Task 5: Create MusicCard component

**Files:**
- Create: `src/v2/components/MusicCard.tsx`

MusicCard wraps TiltedCard with:
- Hover overlay with play/pause/loading icon
- Track info below cover (title, artist, genre badge)
- Progress bar (2px, warm peach, click-to-seek)
- Ambient glow via local RAF reading amplitudeRef

**Key details:**
- Card dimensions: 200×280 desktop, 160×230 mobile
- Overlay: `rgba(0,0,0,0.5)` backdrop with centered icon
- Play icon: CSS triangle (`border-left: 16px solid white`)
- Pause icon: Two 4px wide bars
- Loading: CSS spinner (keyframe rotation)
- Genre badge: matches MetalBadge outline variant (`px-2 py-0.5 text-[10px] uppercase tracking-widest border border-[rgba(255,255,255,0.06)]`)
- Progress bar accent: `#ffe8d6` (warm peach)
- Glow: `box-shadow: 0 0 ${amplitude * 20}px ${amplitude * 10}px rgba(255, 232, 214, ${amplitude * 0.4})`

- [ ] **Step 1: Create MusicCard.tsx**

```tsx
import { useRef, useEffect, useState, useCallback } from 'react';
import TiltedCard from './TiltedCard';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import type { Track } from '../data/musicData';

interface MusicCardProps {
  track: Track;
}

export default function MusicCard({ track }: MusicCardProps) {
  const { currentTrack, isPlaying, isLoading, progress, amplitudeRef, play, pause, resume } =
    useMusicPlayer();

  const isActive = currentTrack?.id === track.id;
  const isThisPlaying = isActive && isPlaying;
  const isThisLoading = isActive && isLoading;

  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRafRef = useRef<number>(0);

  // Ambient glow RAF — reads amplitudeRef directly, writes to DOM
  useEffect(() => {
    if (!isThisPlaying) {
      if (cardRef.current) cardRef.current.style.boxShadow = 'none';
      cancelAnimationFrame(glowRafRef.current);
      return;
    }

    const tick = () => {
      const amp = amplitudeRef.current;
      if (cardRef.current) {
        cardRef.current.style.boxShadow =
          `0 0 ${amp * 20}px ${amp * 10}px rgba(255, 232, 214, ${amp * 0.4})`;
      }
      glowRafRef.current = requestAnimationFrame(tick);
    };
    glowRafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(glowRafRef.current);
  }, [isThisPlaying, amplitudeRef]);

  const handlePlayPause = useCallback(() => {
    if (isThisLoading) return;
    if (isThisPlaying) {
      pause();
    } else if (isActive && !isPlaying) {
      resume();
    } else {
      play(track);
    }
  }, [isThisLoading, isThisPlaying, isActive, isPlaying, pause, resume, play, track]);

  return (
    <div
      ref={cardRef}
      style={{ borderRadius: 4, position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TiltedCard
        imageSrc={track.coverUrl}
        altText={`${track.title} by ${track.artist}`}
        containerHeight="200px"
        containerWidth="200px"
        imageHeight="200px"
        imageWidth="200px"
        scaleOnHover={1.05}
        rotateAmplitude={12}
        displayOverlayContent={hovered || isThisPlaying || isThisLoading}
        overlayContent={
          <div
            role="button"
            aria-label={
              isThisPlaying
                ? `Pause ${track.title}`
                : `Play ${track.title} by ${track.artist}`
            }
            tabIndex={0}
            onClick={handlePlayPause}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlayPause();
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {isThisLoading ? (
              <Spinner />
            ) : isThisPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </div>
        }
      />

      {/* Track info */}
      <div style={{ padding: '8px 4px 0', width: 200 }}>
        <div
          style={{
            color: '#fafafa',
            fontSize: 13,
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
            fontSize: 11,
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
            fontSize: 9,
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

      {/* Progress bar */}
      {isActive && (
        <ProgressBar progress={progress} trackId={track.id} />
      )}
    </div>
  );
}

function ProgressBar({ progress, trackId }: { progress: number; trackId: string }) {
  const { seek } = useMusicPlayer();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const prog = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(prog);
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 200,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.06)',
        cursor: 'pointer',
        borderRadius: '0 0 4px 4px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: '#ffe8d6',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: '12px solid transparent',
        borderBottom: '12px solid transparent',
        borderLeft: '18px solid white',
        marginLeft: 4,
      }}
    />
  );
}

function PauseIcon() {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      <div style={{ width: 5, height: 22, backgroundColor: 'white', borderRadius: 1 }} />
      <div style={{ width: 5, height: 22, backgroundColor: 'white', borderRadius: 1 }} />
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        border: '2px solid rgba(255,255,255,0.2)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'music-spinner 0.7s linear infinite',
      }}
    />
  );
}
```

- [ ] **Step 2: Add spinner keyframe to metal-theme.css**

Add to `src/v2/core/metal-theme.css`:

```css
@keyframes music-spinner {
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/v2/components/MusicCard.tsx src/v2/core/metal-theme.css
git commit -m "feat: add MusicCard with play/pause overlay, progress bar, and ambient glow"
```

---

## Chunk 4: MusicCarousel

### Task 6: Create MusicCarousel component

**Files:**
- Create: `src/v2/components/MusicCarousel.tsx`

Two-row infinite horizontal scroll:
- Row 1: `row1Tracks` (6 cards), scrolls left
- Row 2: `row2Tracks` (6 cards), scrolls right
- Each row is duplicated for seamless looping
- Animation: framer-motion `motion.div` with `animate={{ x }}` cycling
- Pause conditions: hover, playing, dragging
- Drag: `@use-gesture/react` `useDrag` on each row
- Container: `overflow: hidden`

**Key framer-motion approach:**
- Use `useAnimationControls()` for each row
- Start/stop animation based on pause conditions
- On drag: set x via motionValue directly
- On release: restart animation from current x position
- Use modulo to wrap x for seamless loop

- [ ] **Step 1: Create MusicCarousel.tsx**

```tsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import MusicCard from './MusicCard';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { row1Tracks, row2Tracks, type Track } from '../data/musicData';

const CARD_WIDTH = 200;
const CARD_GAP = 16;
const CARD_MOBILE_WIDTH = 160;
const DURATION = 40; // seconds per full cycle

function useInfiniteScroll(
  trackCount: number,
  direction: 'left' | 'right',
  isPaused: boolean,
  isMobile: boolean
) {
  const cardW = isMobile ? CARD_MOBILE_WIDTH : CARD_WIDTH;
  const rowWidth = trackCount * (cardW + CARD_GAP);
  const x = useMotionValue(direction === 'right' ? -rowWidth : 0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const isDragging = useRef(false);

  const startAnimation = useCallback(() => {
    if (isDragging.current || isPaused) return;

    const currentX = x.get();
    // Normalize to [0, -rowWidth] range
    const normalized = ((currentX % rowWidth) + rowWidth) % rowWidth;
    const startX = direction === 'left' ? -normalized : -(rowWidth - normalized);

    const targetX = direction === 'left' ? startX - rowWidth : startX + rowWidth;
    const remaining = Math.abs(targetX - startX) / rowWidth;

    animRef.current?.stop();
    animRef.current = animate(x, targetX, {
      duration: DURATION * remaining,
      ease: 'linear',
      onComplete: () => {
        // Reset and restart for seamless loop
        x.set(direction === 'left' ? 0 : -rowWidth);
        if (!isDragging.current) startAnimation();
      },
    });
  }, [x, rowWidth, direction, isPaused]);

  const stopAnimation = useCallback(() => {
    animRef.current?.stop();
  }, []);

  useEffect(() => {
    if (isPaused) {
      stopAnimation();
    } else {
      startAnimation();
    }
    return () => stopAnimation();
  }, [isPaused, startAnimation, stopAnimation]);

  const bind = useDrag(
    ({ active, movement: [mx], memo = x.get() }) => {
      isDragging.current = active;
      if (active) {
        stopAnimation();
        x.set(memo + mx);
      } else {
        // Wrap position
        const current = x.get();
        const wrapped = ((current % rowWidth) + rowWidth) % rowWidth;
        x.set(direction === 'left' ? -wrapped : -(rowWidth - wrapped));
        startAnimation();
      }
      return memo;
    },
    { axis: 'x', filterTaps: true }
  );

  return { x, bind, rowWidth };
}

export default function MusicCarousel() {
  const { isPlaying } = useMusicPlayer();
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isPaused = hovered || isPlaying;

  const row1 = useInfiniteScroll(row1Tracks.length, 'left', isPaused, isMobile);
  const row2 = useInfiniteScroll(row2Tracks.length, 'right', isPaused, isMobile);

  const cardW = isMobile ? CARD_MOBILE_WIDTH : CARD_WIDTH;

  return (
    <div
      style={{ overflow: 'hidden', width: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Row 1 — scrolls left */}
      <CarouselRow
        tracks={row1Tracks}
        x={row1.x}
        bind={row1.bind}
        cardWidth={cardW}
        isMobile={isMobile}
      />

      {/* Row 2 — scrolls right */}
      <div style={{ marginTop: isMobile ? 16 : 24 }}>
        <CarouselRow
          tracks={row2Tracks}
          x={row2.x}
          bind={row2.bind}
          cardWidth={cardW}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}

function CarouselRow({
  tracks,
  x,
  bind,
  cardWidth,
  isMobile,
}: {
  tracks: Track[];
  x: any;
  bind: (...args: any[]) => any;
  cardWidth: number;
  isMobile: boolean;
}) {
  // Duplicate tracks for seamless loop
  const doubled = [...tracks, ...tracks];

  return (
    <motion.div
      {...bind()}
      style={{
        x,
        display: 'flex',
        gap: CARD_GAP,
        cursor: 'grab',
        touchAction: 'pan-y',
      }}
    >
      {doubled.map((track, i) => (
        <div
          key={`${track.id}-${i}`}
          style={{
            flexShrink: 0,
            width: cardWidth,
          }}
        >
          <MusicCard track={track} />
        </div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/v2/components/MusicCarousel.tsx
git commit -m "feat: add MusicCarousel with infinite scroll and drag-to-scroll"
```

---

## Chunk 5: Integration & Polish

### Task 7: Integrate into V2Interests

**Files:**
- Modify: `src/v2/sections/V2Interests.tsx`

Add the music carousel above the existing category grid. Wrap it in `MusicPlayerProvider`. Add a "Musical Tastes" subtitle label above the carousel.

- [ ] **Step 1: Update V2Interests.tsx**

Add imports at top:

```tsx
import { MusicPlayerProvider } from '../contexts/MusicPlayerContext';
import MusicCarousel from '../components/MusicCarousel';
```

After the header `MetalScrollReveal` block (line 27) and before the grid `<div>` (line 29), insert the music carousel section:

```tsx
        <MusicPlayerProvider>
          <MetalScrollReveal delay={0.1}>
            <div className="mb-12">
              <h3
                className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a] font-heading font-semibold mb-6 flex items-center gap-3"
              >
                <span className="w-3 h-px bg-[rgba(255,255,255,0.15)]" />
                {t('interests.categories.0.title')}
              </h3>
              <MusicCarousel />
            </div>
          </MetalScrollReveal>
        </MusicPlayerProvider>
```

Also update the section tag to add `overflowX: 'clip'`:

Change:
```tsx
<section id="interests" className="metal-section">
```
To:
```tsx
<section id="interests" className="metal-section" style={{ overflowX: 'clip' }}>
```

- [ ] **Step 2: Add i18n key for "Musical Tastes" subtitle**

In `src/v2/i18n/locales/en.json`, add under the `interests` object:

```json
"musicSubtitle": "Musical Tastes"
```

Then update the carousel label to use `t('interests.musicSubtitle')` instead of `t('interests.categories.0.title')`.

Do the same for `fr.json` (add `"musicSubtitle": "Goûts Musicaux"`) and `ko.json` (add `"musicSubtitle": "음악 취향"`).

- [ ] **Step 3: Verify it compiles and renders**

```bash
npx tsc --noEmit
npm run dev
```

Open in browser. The carousel should render with placeholder album covers (broken images until user provides cover files). Verify:
- Two rows of cards are visible
- Cards tilt on hover
- Carousel scrolls infinitely
- Hover pauses the carousel
- Drag works to scroll

- [ ] **Step 4: Commit**

```bash
git add src/v2/sections/V2Interests.tsx src/v2/i18n/locales/en.json src/v2/i18n/locales/fr.json src/v2/i18n/locales/ko.json
git commit -m "feat: integrate music carousel into Interests section"
```

---

### Task 8: Add placeholder covers and test audio playback

**Files:**
- Create: `public/music/covers/.gitkeep`

- [ ] **Step 1: Create .gitkeep for covers directory**

```bash
touch public/music/covers/.gitkeep
```

- [ ] **Step 2: Manual testing checklist**

With user-provided audio files and cover images in place:
- [ ] Click a card → loading spinner appears → audio plays
- [ ] Click playing card → audio pauses
- [ ] Click different card → previous stops, new one loads and plays
- [ ] Progress bar fills as track plays
- [ ] Click progress bar → audio seeks to that position
- [ ] Ambient glow pulses with audio amplitude
- [ ] Carousel stops scrolling when a track is playing
- [ ] Carousel stops scrolling on hover
- [ ] Drag to scroll works on both rows
- [ ] Track end → resets to stopped state, no auto-advance
- [ ] Mobile (< 768px): cards scale down, drag/touch works

- [ ] **Step 3: Commit**

```bash
git add public/music/covers/.gitkeep
git commit -m "feat: add music player carousel feature complete"
```

---

### Task 9: Mobile responsive adjustments

**Files:**
- Modify: `src/v2/components/MusicCard.tsx`

- [ ] **Step 1: Add mobile sizing to MusicCard**

The MusicCard currently hardcodes 200px dimensions. For mobile (< 768px), cards should be 160×160 cover with ~70px info area.

Update MusicCard to accept an optional `isMobile` prop, or detect it internally. Change:
- Container width: 160px on mobile
- TiltedCard dimensions: 160×160 on mobile
- Info text slightly smaller on mobile
- Progress bar width: 160px on mobile

The simplest approach: MusicCarousel already tracks `isMobile` and passes `cardWidth`. Have MusicCard accept a `size` prop:

```tsx
interface MusicCardProps {
  track: Track;
  size?: number; // defaults to 200
}
```

Update all hardcoded `200` references to use `size`.

- [ ] **Step 2: Verify mobile layout**

Open dev tools → responsive mode at 375px width. Verify cards are 160px wide and the two rows fit.

- [ ] **Step 3: Commit**

```bash
git add src/v2/components/MusicCard.tsx src/v2/components/MusicCarousel.tsx
git commit -m "feat: add mobile responsive sizing to music cards"
```
