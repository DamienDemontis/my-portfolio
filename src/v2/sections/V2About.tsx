import { useTranslation } from 'react-i18next';
import { useState, useEffect, Suspense, lazy } from 'react';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalShaderTitle from '../components/MetalShaderTitle';
const Lanyard = lazy(() => import('../components/Lanyard'));
import MetalStatCard from '../components/MetalStatCard';
import MetalDivider from '../components/MetalDivider';
import DecryptedText from '../components/DecryptedText';
import SpotlightCard from '../components/SpotlightCard';

export default function V2About() {
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const lanyardEl = (
    <Suspense fallback={null}>
      <Lanyard position={[0, 0, 8.5]} gravity={[0, -40, 0]} fov={40} />
    </Suspense>
  );

  return (
    <section id="about" className="metal-section" style={{ position: 'relative', overflow: 'visible' }}>
      {/* Desktop: absolute, left half, full height — right uses clamp to prevent overlap on narrow screens */}
      {isDesktop && (
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '11%',
          right: '34%',
          zIndex: 10,
          overflow: 'visible',
          pointerEvents: 'none',
        }}>
          <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            {lanyardEl}
          </div>
        </div>
      )}

      <div className="metal-section-inner" style={{ position: 'relative', zIndex: 2 }}>
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4"><DecryptedText text={t('about.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('about.title')}</MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="lg:ml-auto lg:max-w-[55%]">
          <MetalScrollReveal direction="right" delay={0.15}>
            <div className="space-y-5">
              <h3 className="text-xl md:text-2xl font-heading font-semibold text-[#e0e0e0]">
                {t('about.heading')}
              </h3>
              <p className="text-[#888] leading-relaxed text-sm md:text-base font-light">
                {t('about.description')}
              </p>
              <p className="text-[#888] leading-relaxed text-sm font-light">
                {t('about.international')}
              </p>
              <p className="text-[#888] leading-relaxed text-sm font-light italic">{t('about.aspiration')}</p>
              <MetalDivider variant="gradient" className="my-6" />
              <div className="flex flex-wrap gap-3">
                {['React', 'TypeScript', 'Node.js', 'Vue.js', 'Python', 'Docker', 'WebGL'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8a8a8a] border border-[rgba(255,255,255,0.06)] font-medium"
                    style={{ borderRadius: 2 }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </MetalScrollReveal>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetalScrollReveal delay={0}><SpotlightCard><MetalStatCard value={3} label={t('about.stats.experience')} suffix="+" /></SpotlightCard></MetalScrollReveal>
          <MetalScrollReveal delay={0.08}><SpotlightCard><MetalStatCard value={20} label={t('about.stats.projects')} suffix="+" /></SpotlightCard></MetalScrollReveal>
          <MetalScrollReveal delay={0.16}><SpotlightCard><MetalStatCard value={15} label={t('about.stats.technologies')} suffix="+" /></SpotlightCard></MetalScrollReveal>
          <MetalScrollReveal delay={0.24}><SpotlightCard><MetalStatCard value={100} label={t('about.stats.mentoring')} suffix="+" /></SpotlightCard></MetalScrollReveal>
        </div>
      </div>
    </section>
  );
}
