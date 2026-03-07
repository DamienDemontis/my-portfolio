import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import DecryptedText from '../components/DecryptedText';
import MetalProgressRing from '../components/MetalProgressRing';
import MetalDivider from '../components/MetalDivider';

export default function V2Languages() {
  const { t } = useTranslation();
  const items = t('languages.items', { returnObjects: true }) as any[];

  return (
    <section id="languages" className="metal-section">
      <div className="metal-section-inner">
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
                className="group p-6 text-center metal-shine-hover transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,17,0.7), rgba(10,10,10,0.9))',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-8 h-5 mb-4 text-[10px] font-bold uppercase tracking-wider text-[#888] border border-[rgba(255,255,255,0.1)]"
                  style={{ borderRadius: 2 }}
                >
                  {lang.flag}
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
