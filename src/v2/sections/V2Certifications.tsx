import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import DecryptedText from '../components/DecryptedText';

/** Year stamp: a small machined plate — same material language as the skill
 *  plates and the "Autres" cards. Brushed face, milled edge-light, gold
 *  spine, engraved year. */
function Medal({ year }: { year: string }) {
  return (
    <div
      className="metal-medal relative flex flex-shrink-0 items-center justify-center"
      aria-hidden
      style={{
        width: 76,
        height: 76,
        borderRadius: 6,
        background: 'linear-gradient(175deg, #26292d 0%, #17191c 55%, #1f2226 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -6px 12px rgba(0,0,0,0.45), 0 10px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* Molten spine */}
      <span
        className="absolute left-[2px] top-[6px] bottom-[6px] w-[2px]"
        style={{ background: 'linear-gradient(180deg, var(--metal-accent), var(--metal-accent-dim))', opacity: 0.9 }}
      />
      {/* Diagonal sheen */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 6,
          background: 'linear-gradient(120deg, transparent 38%, rgba(255,255,255,0.07) 50%, transparent 62%)',
        }}
      />
      <span className="flex flex-col items-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <span
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#e2e2e2',
            textShadow: '0 1px 0 rgba(0,0,0,0.9), 0 -0.5px 0 rgba(255,255,255,0.12)',
          }}
        >
          {year}
        </span>
        <span style={{ fontSize: 7, letterSpacing: '0.32em', color: 'var(--metal-accent-dim)', marginTop: 3, marginLeft: 3 }}>
          CERT
        </span>
      </span>
    </div>
  );
}

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

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {items.map((cert: any, i: number) => (
            <MetalScrollReveal key={i} delay={i * 0.1}>
              <div className="group flex items-center gap-5 md:gap-6">
                <Medal year={String(cert.year)} />
                <div>
                  <h3 className="mb-1 font-heading text-base font-semibold text-[#e0e0e0] group-hover:text-white transition-colors sm:text-lg">
                    {cert.title}
                  </h3>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8a8a8a]">
                      {cert.issuer}
                    </span>
                    <span aria-hidden className="h-px w-4" style={{ background: 'var(--metal-accent-dim)' }} />
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: 'var(--metal-accent-dim)' }}>
                      {t('certifications.verified')}
                    </span>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-[#8a8a8a]">
                    {cert.description}
                  </p>
                </div>
              </div>
            </MetalScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
