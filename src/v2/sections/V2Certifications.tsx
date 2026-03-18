import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalBadge from '../components/MetalBadge';
import DecryptedText from '../components/DecryptedText';
import SpotlightCard from '../components/SpotlightCard';
import MetalDivider from '../components/MetalDivider';

export default function V2Certifications() {
  const { t } = useTranslation();
  const items = t('certifications.items', { returnObjects: true }) as any[];

  return (
    <section id="certifications" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4">
              <DecryptedText
                text={t('certifications.number')}
                speed={60}
                className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body"
              />
            </span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">
              {t('certifications.title')}
            </MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {items.map((cert: any, i: number) => (
            <MetalScrollReveal key={i} delay={i * 0.1}>
              <SpotlightCard className="p-6 md:p-8 h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-[#e0e0e0]">
                    {cert.title}
                  </h3>
                  <div className="hidden sm:block flex-shrink-0">
                    <MetalBadge variant="chrome" size="sm">
                      {t('certifications.verified')}
                    </MetalBadge>
                  </div>
                </div>
                <MetalDivider variant="thin" className="mb-3" />
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium">
                    {cert.issuer}
                  </span>
                  <span className="text-[10px] text-[#555]">—</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium">
                    {cert.year}
                  </span>
                </div>
                <p className="text-sm text-[#777] font-light leading-relaxed">
                  {cert.description}
                </p>
              </SpotlightCard>
            </MetalScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
