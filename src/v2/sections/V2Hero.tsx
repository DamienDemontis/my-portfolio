import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MetalParticleField from '../components/MetalParticleField';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';
import { useNav } from '../core/navigation';

/** Magnetic wrapper — the element leans toward the cursor within its zone. */
function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const ctaStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#d4d4d4',
  padding: '13px 26px',
  borderRadius: 4,
  background: 'linear-gradient(175deg, #1c1c1c 0%, #0d0d0d 55%, #141414 100%)',
  border: '1px solid rgba(255,255,255,0.14)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.5)',
  display: 'inline-block',
  transition: 'border-color 250ms ease, color 250ms ease, box-shadow 250ms ease',
};

// Black halo: multiple tight shadows that knock out the background right behind each glyph
// Hard black knockout — no blur, just solid black offsets in all directions
const blackKnockout = [
  '0 0 0 #000',
  '1px 0 0 #000', '-1px 0 0 #000',
  '0 1px 0 #000', '0 -1px 0 #000',
  '1px 1px 0 #000', '-1px -1px 0 #000',
  '1px -1px 0 #000', '-1px 1px 0 #000',
  '2px 0 0 #000', '-2px 0 0 #000',
  '0 2px 0 #000', '0 -2px 0 #000',
  '2px 2px 0 #000', '-2px -2px 0 #000',
  '2px -2px 0 #000', '-2px 2px 0 #000',
].join(', ');

export default function V2Hero() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const { travelTo } = useNav();

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" aria-label="Hero">
      {!reducedMotion && (
        <div className="absolute inset-0 z-[1]">
          <MetalParticleField count={30} speed={0.15} connected={false} />
        </div>
      )}

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <span style={{ textShadow: blackKnockout }}>
            <DecryptedText
              text={t('hero.subtitle')}
              speed={40}
              className="text-sm md:text-base uppercase tracking-[0.4em] text-[#999] font-body font-medium"
            />
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Damien Demontis"
        >
          <div className="leading-none tracking-[0.02em]">
            <MetalShaderTitle as="h1" className="text-[clamp(4.5rem,25vw,18rem)] leading-none" speed={reducedMotion ? 0 : 0.8} tintColor="#ffe8d6" interactive={!reducedMotion}>DAMIEN</MetalShaderTitle>
          </div>
          <div className="leading-none tracking-[0.08em] -mt-4 md:-mt-12">
            <MetalShaderTitle as="h1" className="text-[clamp(2.6rem,14vw,10rem)] leading-none" speed={reducedMotion ? 0 : 0.5} tintColor="#ffffff" interactive={!reducedMotion}>DEMONTIS</MetalShaderTitle>
          </div>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, delay: 1.6, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto my-6 md:my-8 max-w-[200px] overflow-hidden"
        >
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-[#bbb] text-lg md:text-xl font-light tracking-[0.06em] font-body max-w-xl mx-auto"
          style={{ textShadow: blackKnockout }}
        >
          {t('hero.description')}
          <br />
          <span className="text-[#888]">{t('hero.descriptionSuffix')}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-8 flex items-center justify-center gap-6"
          style={{ textShadow: blackKnockout }}
        >
          <Magnetic>
            <a
              href="#contact"
              className="metal-cta"
              style={ctaStyle}
              onClick={(e) => {
                // Anchor jumps land wrong once content-visibility re-measures
                // section heights — travelTo computes the live position.
                e.preventDefault();
                travelTo('contact');
              }}
            >
              {t('hero.cta.contact')}
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="/CV_Damien_DEMONTIS_EN.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="metal-cta metal-cta-ghost"
              style={{ ...ctaStyle, background: 'transparent', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {t('hero.cta.resume')}
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#555]">{t('hero.scroll')}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), transparent)' }}
          />
        </div>
      </motion.div>

      {/* ⌘K teach — desktop only, keyboards required */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
        className="absolute bottom-8 right-8 hidden md:flex items-center gap-2"
        aria-hidden="true"
      >
        <kbd
          className="text-[9px] tracking-[0.1em] text-[#888] px-1.5 py-0.5 rounded"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            background: 'linear-gradient(180deg, #1e1e1e 0%, #121212 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderBottomWidth: 2,
          }}
        >
          ⌘K
        </kbd>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#555]">{t('hero.explore')}</span>
      </motion.div>
    </section>
  );
}
