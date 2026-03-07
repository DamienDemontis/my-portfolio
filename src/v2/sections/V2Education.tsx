import { useTranslation } from 'react-i18next';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalBadge from '../components/MetalBadge';
import MetalDivider from '../components/MetalDivider';
import DecryptedText from '../components/DecryptedText';

interface Education {
  school: string;
  degree: string;
  period: string;
  location: string;
  gpa?: string;
  highlights: string[];
  badge?: string;
  video?: string;
}

const education: Education[] = [
  {
    school: 'EPITECH',
    degree: 'Expert in Information Technology',
    period: '2020 — 2025',
    location: 'Nancy, France',
    gpa: '3.7/4.0',
    badge: 'Master',
    highlights: [
      'Major of Nancy campus — Campus Leader recognition',
      'Teaching Assistant for 3 consecutive years',
      'Project-based learning methodology',
      'Core: C, C++, Java, Haskell, DevOps, Cloud',
      'Startup Project Manager (Leon\'Art)',
      'Coding Club Member',
    ],
  },
  {
    school: 'Keimyung University',
    degree: 'Study Abroad — Game Dev & AI',
    period: 'Sep 2023 — Jul 2024',
    location: 'Daegu, South Korea',
    badge: 'Exchange',
    video: 'https://youtu.be/s0AG0_PY93I',
    highlights: [
      'Certified EPITECH Ambassador',
      'Game development & AI studies',
      'VR/AR technologies research',
      'Korean language learning',
      'International cultural exchange',
    ],
  },
  {
    school: 'Henri Poincare High School',
    degree: 'Scientific Baccalaureate — High Honors',
    period: '2017 — 2020',
    location: 'Nancy, France',
    badge: 'Honors',
    highlights: [
      'Specialization in Computer Science',
      'High Honors graduation',
      'Strong mathematics foundation',
      'Physics fundamentals',
      'Scientific methodology',
    ],
  },
];

export default function V2Education() {
  const { t } = useTranslation();
  return (
    <section id="education" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4"><DecryptedText text={t('education.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('education.title')}</MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="max-w-3xl mx-auto space-y-4">
          {education.map((edu, i) => (
            <MetalScrollReveal key={edu.school} delay={i * 0.1}>
              <div
                className="group p-6 md:p-8 metal-shine-hover transition-all duration-300 hover:border-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,17,0.7), rgba(10,10,10,0.9))',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-heading font-semibold text-[#e0e0e0]">{edu.school}</h3>
                      {edu.badge && <MetalBadge variant="chrome" size="sm">{edu.badge}</MetalBadge>}
                    </div>
                    <p className="text-sm text-[#888] font-light">{edu.degree}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium block">{edu.period}</span>
                    <span className="text-[10px] text-[#6b6b6b]">{edu.location}</span>
                    {edu.gpa && (
                      <span className="text-[10px] text-[#6b6b6b] block mt-1 font-medium">GPA: {edu.gpa}</span>
                    )}
                  </div>
                </div>

                <MetalDivider variant="thin" className="mb-4" />

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                  {edu.highlights.map((h, j) => (
                    <li key={j} className="text-[#777] text-sm font-light flex items-start gap-2">
                      <span className="text-[#555] mt-1.5 shrink-0">
                        <svg width="4" height="4" viewBox="0 0 4 4"><circle cx="2" cy="2" r="2" fill="currentColor" /></svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>

                {edu.video && (
                  <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                    <a
                      href={edu.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#6b6b6b] hover:text-white transition-colors font-medium"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      {t('education.schools.1.videoLabel')}
                    </a>
                  </div>
                )}
              </div>
            </MetalScrollReveal>
          ))}
        </div>

        <MetalScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-[11px] text-[#6b6b6b] italic tracking-wide font-light">
              {t('education.quote')}
            </p>
          </div>
        </MetalScrollReveal>
      </div>
    </section>
  );
}
