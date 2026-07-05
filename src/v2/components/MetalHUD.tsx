import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNav } from '../core/navigation';

const SCRAMBLE_CHARS = '▪▫▝▘▚█▓▒░<>/\\|—';
const SCRAMBLE_MS = 260;
const SCRAMBLE_TICK = 28;

/** Scrambles into `text` whenever it changes — a compact take on DecryptedText
 *  sized for the HUD (few chars, fast settle). */
function useScramble(text: string): string {
  const [display, setDisplay] = useState(text);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const start = performance.now();
    if (frame.current) clearInterval(frame.current);
    frame.current = setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / SCRAMBLE_MS);
      const settled = Math.floor(text.length * progress);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        out += text[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(out);
      if (progress >= 1 && frame.current) {
        clearInterval(frame.current);
        frame.current = null;
      }
    }, SCRAMBLE_TICK);
    return () => {
      if (frame.current) clearInterval(frame.current);
    };
  }, [text]);

  return display;
}

/**
 * Game-HUD position chip, top-left: `02 / 10 — EXPÉRIENCE`.
 * Hidden on the hero (index 0) so the landing stays clean; ticks over with a
 * scramble as you cross section boundaries. aria-live announces position to
 * screen readers on every change, including keyboard fast-travel.
 */
export default function MetalHUD() {
  const { t } = useTranslation();
  const { sections, activeIndex } = useNav();
  const section = sections[activeIndex];
  const label = t(section.labelKey);
  const scrambled = useScramble(label.toUpperCase());
  const total = String(sections.length - 1).padStart(2, '0');

  return (
    <div aria-live="polite" role="status">
      <AnimatePresence>
        {activeIndex > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 left-4 md:top-6 md:left-6 z-50 pointer-events-none select-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.22em',
              color: 'var(--metal-text-dim, #737373)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75em',
              padding: '6px 10px',
              background: 'rgba(8,8,8,0.55)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 4,
              backdropFilter: 'blur(12px)',
            }}
          >
            <span style={{ color: 'var(--metal-accent)' }}>{section.num}</span>
            <span style={{ opacity: 0.5 }}>/ {total}</span>
            <span style={{ color: '#b9b9b9' }}>{scrambled}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
