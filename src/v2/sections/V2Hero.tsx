import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MetallicSurface from '../core/MetallicSurface';
import MetalParticleField from '../components/MetalParticleField';
import DecryptedText from '../components/DecryptedText';

const letterVariants = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.8 + i * 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function AnimatedWord({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <span className="inline-flex overflow-hidden" aria-hidden="true">
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i + offset}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function V2Hero() {
  const { t } = useTranslation();
  const shaderParams = useMemo(() => ({
    speed: 0.04 + Math.random() * 0.06,
    angle: Math.random() * 360,
    noiseScale: 0.2 + Math.random() * 0.4,
    waveAmplitude: 0.3 + Math.random() * 0.4,
    chromaticSpread: 0.02 + Math.random() * 0.03,
    distortion: 0.1 + Math.random() * 0.2,
  }), []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" aria-label="Hero">
      <div className="absolute inset-0 opacity-20">
        <MetallicSurface
          mode="procedural"
          pattern="wave"
          interactive={true}
          {...shaderParams}
          brightness={1.4}
          contrast={0.3}
          scale={2}
          liquid={0.04}
          edgeFade={0}
          lightColor="#ffffff"
          darkColor="#000000"
          tintColor="#ffffff"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 z-[1]">
        <MetalParticleField count={30} speed={0.15} connected={false} />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <DecryptedText
            text={t('hero.subtitle')}
            speed={40}
            className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-[#6b6b6b] font-body font-medium"
          />
        </motion.div>

        <h1 className="font-metal leading-[0.85] tracking-[0.02em]" aria-label="Damien Demontis">
          <div className="text-[clamp(3rem,15vw,10rem)] metal-chrome-text-animated">
            <AnimatedWord word="DAMIEN" />
          </div>
          <div className="text-[clamp(3rem,15vw,10rem)] metal-chrome-text">
            <AnimatedWord word="DEMONTIS" offset={6} />
          </div>
        </h1>

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
          className="text-[#8a8a8a] text-sm md:text-base font-light tracking-[0.06em] font-body max-w-lg mx-auto"
        >
          {t('hero.description')}
          <br className="hidden md:block" />
          <span className="text-[#6b6b6b]">{t('hero.descriptionSuffix')}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <a
            href="#contact"
            className="text-[11px] uppercase tracking-[0.18em] text-[#8a8a8a] hover:text-white transition-colors duration-300 font-medium border-b border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.4)] pb-1"
          >
            {t('hero.cta.contact')}
          </a>
          <span className="text-[#444]" aria-hidden="true">/</span>
          <a
            href="/CV_Damien_DEMONTIS_EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.18em] text-[#8a8a8a] hover:text-white transition-colors duration-300 font-medium border-b border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.4)] pb-1"
          >
            {t('hero.cta.resume')}
          </a>
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
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#555]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25), transparent)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
