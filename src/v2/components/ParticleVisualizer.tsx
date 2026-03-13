import { useRef, useEffect, useCallback } from 'react';

// ─── Constants ───

const PARTICLE_COUNT = 200;
const MAX_LINE_DISTANCE = 120;
const MAX_CONNECTIONS = 3;
const LINE_BASE_OPACITY = 0.3;
const PARTICLE_MIN_RADIUS = 1;
const PARTICLE_MAX_RADIUS = 3;
const SPAWN_MARGIN = 20;
const FADE_IN_RATIO = 0.1;
const FADE_OUT_RATIO = 0.2;
const DECEL_FACTOR = 0.97;

// ─── Audio-reactive movement constants ───
// Instead of pumping brightness/size, we express audio through physics:
// - Bass (bins 0–15) applies a radial FORCE pushing particles outward from center
// - Mids (bins 16–63) add lateral turbulence (perlin-like displacement)
// - Highs (bins 64–127) increase particle jitter/vibration
// The key insight: smoothly interpolate a "force" value each frame (EMA),
// so movement feels organic rather than frame-to-frame jerky.

const BASS_FORCE_SCALE = 8.0;     // radial push strength from bass — big kicks = big push
const MID_TURBULENCE_SCALE = 2.5; // lateral swirl from mids
const HIGH_JITTER_SCALE = 1.8;    // vibration from highs
const FORCE_SMOOTHING = 0.35;     // snappier EMA — feel every beat
const BASE_DRIFT = 0.08;          // near-still when quiet — maximizes contrast
const MAX_SPEED_CAP = 10.0;       // let particles really fly on drops

const FALLBACK_PALETTE: [number, number, number][] = [
  [255, 232, 214],
  [196, 168, 130],
  [139, 115, 85],
];

// ─── Ring ripple constants ───
const RING_MAX_RADIUS = 350;       // how far rings expand before fading
const RING_EXPAND_SPEED = 3;       // px per frame
const RING_FADE_RATE = 0.012;      // opacity decay per frame
const RING_BASS_THRESHOLD = 0.45;  // min bass level to trigger a ring
const RING_DELTA_THRESHOLD = 0.08; // min bass jump (transient detection)
const RING_COOLDOWN = 12;          // min frames between ring spawns
const MAX_RINGS = 4;

interface Ring {
  radius: number;
  opacity: number;
  color: [number, number, number];
}

// ─── Types ───

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  life: number;
  maxLife: number;
  frequencyBin: number;
  radius: number;
  color: [number, number, number];
  // Physics state
  angle: number; // angle from card center (for radial force direction)
}

interface ParticleVisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlaying: boolean;
  coverUrl: string;
  cardRect: { cx: number; cy: number; size: number };
}

// ─── Color extraction ───

function extractColors(coverUrl: string): Promise<[number, number, number][]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(FALLBACK_PALETTE); return; }

        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;

        const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] >> 4;
          const g = data[i + 1] >> 4;
          const b = data[i + 2] >> 4;
          const key = `${r},${g},${b}`;
          const existing = buckets.get(key);
          if (existing) {
            existing.count++;
          } else {
            buckets.set(key, { count: 1, r, g, b });
          }
        }

        const sorted = [...buckets.values()]
          .filter((c) => {
            const lum = c.r * 16 * 0.299 + c.g * 16 * 0.587 + c.b * 16 * 0.114;
            return lum > 30 && lum < 225;
          })
          .sort((a, b) => b.count - a.count);

        const palette: [number, number, number][] = sorted
          .slice(0, 4)
          .map((c) => [c.r * 16 + 8, c.g * 16 + 8, c.b * 16 + 8]);

        resolve(palette.length >= 2 ? palette : FALLBACK_PALETTE);
      } catch {
        resolve(FALLBACK_PALETTE);
      }
    };
    img.onerror = () => resolve(FALLBACK_PALETTE);
    img.src = coverUrl;
  });
}

// ─── Band energy helpers ───
// Compute average energy for a frequency band range (normalized 0–1)

function bandEnergy(dataArray: Uint8Array<ArrayBuffer>, from: number, to: number): number {
  let sum = 0;
  for (let i = from; i < to && i < dataArray.length; i++) sum += dataArray[i];
  return sum / (to - from) / 255;
}

// ─── Particle helpers ───

function spawnParticle(
  cx: number,
  cy: number,
  halfSize: number,
  palette: [number, number, number][]
): Particle {
  const margin = SPAWN_MARGIN;
  const side = Math.floor(Math.random() * 4);
  let x: number, y: number;

  const left = cx - halfSize - margin;
  const right = cx + halfSize + margin;
  const top = cy - halfSize - margin;
  const bottom = cy + halfSize + margin;

  switch (side) {
    case 0:
      x = left + Math.random() * (right - left);
      y = top;
      break;
    case 1:
      x = right;
      y = top + Math.random() * (bottom - top);
      break;
    case 2:
      x = left + Math.random() * (right - left);
      y = bottom;
      break;
    default:
      x = left;
      y = top + Math.random() * (bottom - top);
      break;
  }

  const angle = Math.atan2(y - cy, x - cx);
  const spread = (Math.random() - 0.5) * 0.8;
  const maxLife = Math.floor(Math.random() * 300) + 300;

  return {
    x,
    y,
    vx: Math.cos(angle + spread),
    vy: Math.sin(angle + spread),
    baseSpeed: 0.3 + Math.random() * 0.9,
    life: maxLife,
    maxLife,
    frequencyBin: Math.floor(Math.random() * 128),
    radius: PARTICLE_MIN_RADIUS + Math.random() * (PARTICLE_MAX_RADIUS - PARTICLE_MIN_RADIUS),
    color: palette[Math.floor(Math.random() * palette.length)],
    angle: angle + spread,
  };
}

// ─── Component ───

export default function ParticleVisualizer({
  analyserRef,
  isPlaying,
  coverUrl,
  cardRect,
}: ParticleVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const paletteRef = useRef<[number, number, number][]>(FALLBACK_PALETTE);
  const rafRef = useRef<number>(0);
  const isPlayingRef = useRef(isPlaying);
  const fadingOutRef = useRef(false);
  const globalAlphaRef = useRef(0);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  // Smoothed band energies (EMA-filtered so movement is organic, not twitchy)
  const smoothBassRef = useRef(0);
  const smoothMidRef = useRef(0);
  const smoothHighRef = useRef(0);
  // Frame counter for turbulence phase
  const frameRef = useRef(0);
  // Ring ripple state
  const ringsRef = useRef<Ring[]>([]);
  const prevBassRef = useRef(0);
  const ringCooldownRef = useRef(0);

  isPlayingRef.current = isPlaying;

  // Extract colors from cover
  useEffect(() => {
    extractColors(coverUrl).then((palette) => {
      paletteRef.current = palette;
      for (const p of particlesRef.current) {
        p.color = palette[Math.floor(Math.random() * palette.length)];
      }
    });
  }, [coverUrl]);

  // Initialize particles
  const initParticles = useCallback(() => {
    const particles: Particle[] = [];
    const halfSize = cardRect.size / 2;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = spawnParticle(cardRect.cx, cardRect.cy, halfSize, paletteRef.current);
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }
    particlesRef.current = particles;
  }, [cardRect.cx, cardRect.cy, cardRect.size]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Main RAF loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    initParticles();
    globalAlphaRef.current = 0;
    fadingOutRef.current = false;

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fade in
      if (isPlayingRef.current && !fadingOutRef.current) {
        globalAlphaRef.current = Math.min(1, globalAlphaRef.current + 0.02);
      }

      if (globalAlphaRef.current <= 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      frameRef.current++;

      // Read frequency data
      const analyser = analyserRef.current;
      let dataArray = dataArrayRef.current;
      if (analyser && !dataArray) {
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        dataArrayRef.current = dataArray;
      }
      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
      }

      // ─── Compute band energies with EMA smoothing ───
      // This is the heart: instead of raw per-frame values (twitchy),
      // we exponentially smooth so forces ramp up/down organically.
      const rawBass = dataArray ? bandEnergy(dataArray, 0, 16) : 0;
      const rawMid = dataArray ? bandEnergy(dataArray, 16, 64) : 0;
      const rawHigh = dataArray ? bandEnergy(dataArray, 64, 128) : 0;

      const a = FORCE_SMOOTHING;
      smoothBassRef.current += (rawBass - smoothBassRef.current) * a;
      smoothMidRef.current += (rawMid - smoothMidRef.current) * a;
      smoothHighRef.current += (rawHigh - smoothHighRef.current) * a;

      const bass = smoothBassRef.current;
      const mid = smoothMidRef.current;
      const high = smoothHighRef.current;

      // Overall intensity (0–1) drives global behaviors
      const avgAmp = (bass + mid + high) / 3;
      // intensity² makes the contrast between quiet and loud more dramatic
      const intensity = avgAmp * avgAmp;

      // ─── Ring ripple spawning (bass transient detection) ───
      ringCooldownRef.current = Math.max(0, ringCooldownRef.current - 1);
      const bassDelta = rawBass - prevBassRef.current;
      prevBassRef.current = rawBass;

      if (
        isPlayingRef.current &&
        rawBass > RING_BASS_THRESHOLD &&
        bassDelta > RING_DELTA_THRESHOLD &&
        ringCooldownRef.current === 0 &&
        ringsRef.current.length < MAX_RINGS
      ) {
        // Pick a color from the palette
        const palette = paletteRef.current;
        ringsRef.current.push({
          radius: cardRect.size / 2 + 10,
          opacity: 0.5 + rawBass * 0.3,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
        ringCooldownRef.current = RING_COOLDOWN;
      }

      const particles = particlesRef.current;
      const halfSize = cardRect.size / 2;
      const { cx, cy } = cardRect;
      const connectionCount = new Uint8Array(PARTICLE_COUNT);
      const frame = frameRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isPlayingRef.current) {
          // ─── Physics-based audio-reactive movement ───

          // 1. Bass → radial push (particles accelerate outward on kicks/bass)
          const bassForce = bass * BASS_FORCE_SCALE;

          // 2. Mids → turbulence (swirling lateral force, phase-offset per particle)
          const turbPhase = frame * 0.02 + i * 0.7;
          const turbX = Math.cos(turbPhase) * mid * MID_TURBULENCE_SCALE;
          const turbY = Math.sin(turbPhase * 1.3) * mid * MID_TURBULENCE_SCALE;

          // 3. Highs → jitter (random micro-displacement, like vibration)
          const jitterX = (Math.random() - 0.5) * high * HIGH_JITTER_SCALE;
          const jitterY = (Math.random() - 0.5) * high * HIGH_JITTER_SCALE;

          // Combine: base drift + bass radial push + mid turbulence + high jitter
          const totalSpeed = Math.min(BASE_DRIFT + bassForce, MAX_SPEED_CAP);
          p.x += p.vx * totalSpeed * p.baseSpeed + turbX + jitterX;
          p.y += p.vy * totalSpeed * p.baseSpeed + turbY + jitterY;

          // ─── Intensity-driven life drain ───
          // Quiet: particles live full lifespan, drift slowly, sparse feel.
          // Loud: particles burn through life 2-3x faster → die sooner →
          //       respawn at card edges → constant stream of fresh particles
          //       bursting outward = visual density + energy.
          const lifeDrain = 1 + intensity * 5;
          p.life -= lifeDrain; // fractional is fine, life is checked as <= 0
        } else {
          // Decelerate on pause
          p.vx *= DECEL_FACTOR;
          p.vy *= DECEL_FACTOR;
          p.x += p.vx * p.baseSpeed * BASE_DRIFT;
          p.y += p.vy * p.baseSpeed * BASE_DRIFT;
          p.life--;
        }

        // Respawn
        if (p.life <= 0 || p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
          particles[i] = spawnParticle(cx, cy, halfSize, paletteRef.current);
          continue;
        }

        // Life-based alpha
        const lifeRatio = p.life / p.maxLife;
        let lifeAlpha = 1;
        if (lifeRatio > 1 - FADE_IN_RATIO) {
          lifeAlpha = (1 - lifeRatio) / FADE_IN_RATIO;
        } else if (lifeRatio < FADE_OUT_RATIO) {
          lifeAlpha = lifeRatio / FADE_OUT_RATIO;
        }

        // Radius: subtle pulse from the particle's own frequency bin
        const freqAmp = dataArray ? dataArray[p.frequencyBin] / 255 : 0;
        const renderRadius = p.radius * (0.7 + freqAmp * 0.8);
        const alpha = lifeAlpha * globalAlphaRef.current;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, renderRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha})`;
        ctx.fill();
      }

      // Draw constellation lines
      const maxDistSq = MAX_LINE_DISTANCE * MAX_LINE_DISTANCE;
      for (let i = 0; i < particles.length; i++) {
        if (connectionCount[i] >= MAX_CONNECTIONS) continue;
        const pa = particles[i];
        if (pa.life <= 0) continue;

        for (let j = i + 1; j < particles.length; j++) {
          if (connectionCount[j] >= MAX_CONNECTIONS) continue;
          const pb = particles[j];
          if (pb.life <= 0) continue;

          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha =
              (1 - dist / MAX_LINE_DISTANCE) *
              (0.1 + intensity * 0.9) * // barely visible when quiet, full presence when intense
              LINE_BASE_OPACITY *
              globalAlphaRef.current;

            if (lineAlpha > 0.005) {
              const r = (pa.color[0] + pb.color[0]) >> 1;
              const g = (pa.color[1] + pb.color[1]) >> 1;
              const bCol = (pa.color[2] + pb.color[2]) >> 1;

              ctx.beginPath();
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
              ctx.strokeStyle = `rgba(${r}, ${g}, ${bCol}, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();

              connectionCount[i]++;
              connectionCount[j]++;
            }
          }
        }
      }

      // ─── Draw ring ripples ───
      const rings = ringsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.radius += RING_EXPAND_SPEED;
        ring.opacity -= RING_FADE_RATE;

        if (ring.opacity <= 0 || ring.radius > RING_MAX_RADIUS + halfSize) {
          rings.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, ${ring.opacity * globalAlphaRef.current})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserRef, cardRect.cx, cardRect.cy, cardRect.size, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1001,
        pointerEvents: 'none',
        opacity: isPlaying ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
