import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import DecryptedText from '../components/DecryptedText';
import MetalProgressRing from '../components/MetalProgressRing';
import MetalDivider from '../components/MetalDivider';
import SoftAurora from '../components/SoftAurora';
import { FlagSVG } from '../components/flags';

export default function V2Languages() {
  const { t } = useTranslation();
  const items = t('languages.items', { returnObjects: true }) as any[];
  const [hoveredFlag, setHoveredFlag] = useState<string | null>(null);

  return (
    <section id="languages" className="metal-section relative overflow-hidden">
      {/* Aurora — full viewport width, behind everything */}
      <SoftAurora
        activeFlag={hoveredFlag}
        speed={0.6}
        scale={1.1}
        brightness={1.3}
        noiseFrequency={2.5}
        noiseAmplitude={3}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1}
        mouseInteraction={false}
        mouseInfluence={0}
      />

      <div className="metal-section-inner relative z-10">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4">
              <DecryptedText
                text={t('languages.number')}
                speed={60}
                className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body"
              />
            </span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">
              {t('languages.title')}
            </MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {items.map((lang: any, i: number) => (
            <MetalScrollReveal key={i} delay={i * 0.1}>
              <div
                className="group p-6 text-center metal-shine-hover transition-all duration-300 hover:border-[rgba(255,255,255,0.12)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,17,0.75), rgba(10,10,10,0.92))',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={() => setHoveredFlag(lang.flag)}
                onMouseLeave={() => setHoveredFlag(null)}
              >
                <span
                  className="inline-flex items-center justify-center w-8 h-5 mb-4 overflow-hidden transition-[filter] duration-300 group-hover:grayscale-0 group-hover:brightness-100"
                  style={{ filter: 'grayscale(0.5) brightness(0.85)' }}
                  aria-label={lang.flag}
                >
                  <FlagSVG code={lang.flag} />
                </span>
                <div className="flex justify-center mb-4">
                  <MetalProgressRing value={lang.percent} size={80} strokeWidth={2} />
                </div>
                <MetalDivider variant="thin" className="mb-3" />
                <h3 className="text-sm font-heading font-semibold text-[#e0e0e0] mb-1">
                  {lang.name}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium block mb-2">
                  {lang.level}
                </span>
                <p className="text-[11px] text-[#555] font-light">
                  {lang.detail}
                </p>
              </div>
            </MetalScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
