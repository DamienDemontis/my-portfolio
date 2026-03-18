import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MetalParticleField from '../components/MetalParticleField';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';

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

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" aria-label="Hero">
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
            <MetalShaderTitle as="h1" className="text-[clamp(5rem,22vw,18rem)] leading-none" speed={0.4} brightness={2.2} tintColor="#ffe8d6">DAMIEN</MetalShaderTitle>
          </div>
          <div className="leading-none tracking-[0.08em] -mt-6 md:-mt-12">
            <MetalShaderTitle as="h1" className="text-[clamp(3rem,12vw,10rem)] leading-none" speed={0.25} brightness={2} tintColor="#ffffff">DEMONTIS</MetalShaderTitle>
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
          <br className="hidden md:block" />
          <span className="text-[#888]">{t('hero.descriptionSuffix')}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-8 flex items-center justify-center gap-6"
          style={{ textShadow: blackKnockout }}
        >
          <a
            href="#contact"
            className="text-sm uppercase tracking-[0.18em] text-[#aaa] hover:text-white transition-colors duration-300 font-medium border-b border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.4)] pb-1"
          >
            {t('hero.cta.contact')}
          </a>
          <span className="text-[#444]" aria-hidden="true">/</span>
          <a
            href="/CV_Damien_DEMONTIS_EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm uppercase tracking-[0.18em] text-[#aaa] hover:text-white transition-colors duration-300 font-medium border-b border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.4)] pb-1"
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
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#555]">{t('hero.scroll')}</span>
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
