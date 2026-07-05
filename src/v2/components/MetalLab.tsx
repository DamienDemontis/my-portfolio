import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GodRays,
  Water,
  NeuroNoise,
  Metaballs,
  Swirl,
  GrainGradient,
} from '@paper-design/shaders-react';
import { useNav } from '../core/navigation';

const MONO = "'JetBrains Mono', monospace";

/**
 * The Lab — hidden playground, reached via `cd lab` in the console.
 * A wall of live shader experiments (paper-shaders) + the WebGL game build.
 * Each shader idles frozen (speed=0 → no rAF) and only flows under the
 * cursor, so the whole wall costs ~one animating canvas at a time.
 */

interface Experiment {
  id: string;
  name: string;
  render: (active: boolean) => React.ReactNode;
}

const shaderStyle = { width: '100%', height: '100%' } as const;

const EXPERIMENTS: Experiment[] = [
  {
    id: 'god-rays',
    name: 'god rays',
    render: (a) => (
      <GodRays colorBack="#000000" colors={['#d4a24e', '#5a5a5a', '#233']} speed={a ? 1 : 0} style={shaderStyle} />
    ),
  },
  {
    id: 'water',
    name: 'water',
    render: (a) => (
      <Water colorBack="#020506" colorHighlight="#8a97a0" speed={a ? 0.8 : 0} style={shaderStyle} />
    ),
  },
  {
    id: 'neuro',
    name: 'neuro noise',
    render: (a) => (
      <NeuroNoise colorFront="#c8c8c8" colorBack="#000000" speed={a ? 1 : 0} style={shaderStyle} />
    ),
  },
  {
    id: 'metaballs',
    name: 'metaballs',
    render: (a) => (
      <Metaballs colors={['#d4a24e', '#8a8a8a', '#2c2c2c']} colorBack="#000000" speed={a ? 1 : 0} style={shaderStyle} />
    ),
  },
  {
    id: 'swirl',
    name: 'swirl',
    render: (a) => (
      <Swirl colors={['#1a1a1a', '#6a6a6a', '#d4a24e']} speed={a ? 0.8 : 0} style={shaderStyle} />
    ),
  },
  {
    id: 'grain',
    name: 'grain gradient',
    render: (a) => (
      <GrainGradient colors={['#0a0a0a', '#3a3a3a', '#7a6a45']} speed={a ? 0.8 : 0} style={shaderStyle} />
    ),
  },
];

export default function MetalLab() {
  const { labOpen, setLabOpen } = useNav();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {labOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[88] overflow-y-auto"
          style={{ background: 'rgba(2,2,2,0.96)', backdropFilter: 'blur(16px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Lab"
        >
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-14 md:px-8">
            {/* Header */}
            <div className="mb-8 flex items-baseline justify-between">
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.35em', color: 'var(--metal-accent)' }}>
                  /LAB
                </div>
                <div className="mt-2" style={{ fontFamily: MONO, fontSize: 11, color: '#8a8a8a' }}>
                  experiments — shaders, toys, unfinished ideas
                </div>
              </div>
              <button
                onClick={() => setLabOpen(false)}
                className="cursor-pointer uppercase"
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: '#8a8a8a',
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 3,
                  padding: '6px 12px',
                }}
              >
                ESC — exit
              </button>
            </div>

            {/* Shader wall */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXPERIMENTS.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  className="relative aspect-video overflow-hidden"
                  style={{
                    borderRadius: 6,
                    border: activeId === exp.id ? '1px solid var(--metal-accent-dim)' : '1px solid rgba(255,255,255,0.08)',
                    background: '#050505',
                  }}
                  onPointerEnter={() => setActiveId(exp.id)}
                  onPointerLeave={() => setActiveId((cur) => (cur === exp.id ? null : cur))}
                >
                  {exp.render(activeId === exp.id)}
                  <span
                    className="absolute bottom-2 left-3 uppercase"
                    style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.25em', color: '#9a9a9a' }}
                  >
                    {exp.name}
                  </span>
                </motion.div>
              ))}

              {/* Wii Tanks — the playable one */}
              <motion.a
                href="/games/wii-tanks/index.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + EXPERIMENTS.length * 0.05, duration: 0.3 }}
                className="group relative flex aspect-video items-center justify-center overflow-hidden"
                style={{
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'linear-gradient(160deg, #141414 0%, #0a0a0a 100%)',
                }}
              >
                <img
                  src="/projects/tank_game.png"
                  alt="Wii Tanks Remastered"
                  loading="lazy"
                  className="metal-project-img absolute inset-0 h-full w-full object-cover"
                />
                <span
                  className="relative z-10 uppercase transition-transform duration-300 group-hover:scale-105"
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: '0.25em',
                    color: '#e8e8e8',
                    padding: '9px 16px',
                    borderRadius: 4,
                    background: 'rgba(8,8,8,0.8)',
                    border: '1px solid var(--metal-accent-dim)',
                    boxShadow: '0 0 20px var(--metal-accent-glow)',
                  }}
                >
                  ▶ wii tanks — play
                </span>
              </motion.a>
            </div>

            <div className="mt-8 text-center" style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.25em', color: '#4a4a4a' }}>
              hover to run — powered by paper shaders
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
