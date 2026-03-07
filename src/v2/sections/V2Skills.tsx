import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalSkillBar from '../components/MetalSkillBar';
import MetalProgressRing from '../components/MetalProgressRing';
import MetalDivider from '../components/MetalDivider';

interface SkillGroup {
  category: string;
  skills: { label: string; level: number }[];
}

const topSkills = [
  { label: 'JavaScript', value: 95 },
  { label: 'React', value: 90 },
  { label: 'TypeScript', value: 88 },
  { label: 'Node.js', value: 92 },
  { label: 'Vue.js', value: 78 },
];

const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: [
      { label: 'React / Next.js', level: 90 },
      { label: 'Vue.js / Nuxt.js', level: 78 },
      { label: 'TypeScript', level: 88 },
      { label: 'Tailwind CSS', level: 85 },
      { label: 'HTML5 / CSS3', level: 95 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { label: 'Node.js / Express', level: 92 },
      { label: 'Python / Django', level: 72 },
      { label: 'C / C++', level: 80 },
      { label: 'REST APIs', level: 90 },
      { label: 'Java / C#', level: 65 },
    ],
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      { label: 'Docker', level: 78 },
      { label: 'Linux / Bash', level: 82 },
      { label: 'CI/CD Pipelines', level: 75 },
      { label: 'AWS / GCP', level: 65 },
      { label: 'Kubernetes', level: 50 },
    ],
  },
  {
    category: 'Data & AI',
    skills: [
      { label: 'MongoDB / NoSQL', level: 85 },
      { label: 'PostgreSQL / MySQL', level: 78 },
      { label: 'Redis', level: 55 },
      { label: 'PyTorch / TensorFlow', level: 60 },
      { label: 'OpenCV', level: 58 },
    ],
  },
  {
    category: 'Mobile Development',
    skills: [
      { label: 'React Native', level: 70 },
      { label: 'Flutter', level: 45 },
      { label: 'Expo', level: 65 },
    ],
  },
  {
    category: 'Testing & Quality',
    skills: [
      { label: 'Jest', level: 82 },
      { label: 'Cypress', level: 70 },
      { label: 'Mocha', level: 60 },
      { label: 'Unit/E2E', level: 80 },
    ],
  },
  {
    category: 'AI & Machine Learning',
    skills: [
      { label: 'TensorFlow', level: 55 },
      { label: 'LLM Integration', level: 72 },
      { label: 'RAG', level: 68 },
    ],
  },
  {
    category: 'Tools & Design',
    skills: [
      { label: 'Git', level: 92 },
      { label: 'Figma', level: 60 },
      { label: 'Unity', level: 55 },
      { label: 'Blender', level: 35 },
    ],
  },
];

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
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-16">
            {topSkills.map((skill, i) => (
              <MetalScrollReveal key={skill.label} delay={i * 0.08}>
                <MetalProgressRing value={skill.value} label={skill.label} size={90} strokeWidth={2} />
              </MetalScrollReveal>
            ))}
          </div>
        </MetalScrollReveal>

        <MetalDivider variant="gradient" ornament className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {skillGroups.map((group, i) => (
            <MetalScrollReveal key={group.category} delay={i * 0.1}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a] font-heading font-semibold mb-5 flex items-center gap-3">
                  <span className="w-3 h-px bg-[rgba(255,255,255,0.15)]" />
                  {group.category}
                </h3>
                <div className="space-y-4">
                  {group.skills.map((skill) => (
                    <MetalSkillBar key={skill.label} label={skill.label} level={skill.level} />
                  ))}
                </div>
              </div>
            </MetalScrollReveal>
          ))}
        </div>

        <MetalScrollReveal delay={0.2}>
          <div className="mt-16 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] font-medium">
              {t('skills.alsoExperienced')}
            </span>
          </div>
        </MetalScrollReveal>
      </div>
    </section>
  );
}
