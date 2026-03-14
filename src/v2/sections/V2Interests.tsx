import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalBadge from '../components/MetalBadge';
import DecryptedText from '../components/DecryptedText';
import { MusicPlayerProvider } from '../contexts/MusicPlayerContext';
import MusicCarousel from '../components/MusicCarousel';

export default function V2Interests() {
  const { t } = useTranslation();
  const categories = t('interests.categories', { returnObjects: true }) as any[];

  return (
    <section id="interests" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4">
              <DecryptedText
                text={t('interests.number')}
                speed={60}
                className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body"
              />
            </span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">
              {t('interests.title')}
            </MetalShaderTitle>
          </div>
        </MetalScrollReveal>
      </div>

      {/* Music carousel — full viewport width, breaks out of metal-section-inner */}
      <MusicPlayerProvider>
        <MetalScrollReveal delay={0.1}>
          <div className="mb-12">
            <div className="metal-section-inner">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a] font-heading font-semibold mb-6 flex items-center gap-3">
                <span className="w-3 h-px bg-[rgba(255,255,255,0.15)]" />
                {t('interests.musicSubtitle', 'Absolute Nonsense Musical Taste')}
              </h3>
            </div>
            <MusicCarousel />
          </div>
        </MetalScrollReveal>
      </MusicPlayerProvider>

      <div className="metal-section-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {categories.map((category: any, i: number) => (
            <MetalScrollReveal key={i} delay={i * 0.1}>
              <div
                className="p-6 metal-shine-hover transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,17,0.7), rgba(10,10,10,0.9))',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a] font-heading font-semibold mb-4 flex items-center gap-3">
                  <span className="w-3 h-px bg-[rgba(255,255,255,0.15)]" />
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item: string, j: number) => (
                    <MetalBadge key={j} variant="outline" size="sm">
                      {item}
                    </MetalBadge>
                  ))}
                </div>
              </div>
            </MetalScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
