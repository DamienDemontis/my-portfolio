import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';
import MetalScrollReveal from '../components/MetalScrollReveal';
import SkillConstellation from '../components/SkillConstellation';

export default function V2Skills() {
  const { t } = useTranslation();
  return (
    <section id="skills" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4"><DecryptedText text={t('skills.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('skills.title')}</MetalShaderTitle>
            <p className="mt-4 text-sm text-[#8a8a8a] tracking-wide font-light">{t('skills.subtitle')}</p>
          </div>
        </MetalScrollReveal>

        <MetalScrollReveal>
          <SkillConstellation />
        </MetalScrollReveal>
      </div>
    </section>
  );
}
