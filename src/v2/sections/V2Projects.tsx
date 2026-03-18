import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalBadge from '../components/MetalBadge';
import DecryptedText from '../components/DecryptedText';
import SpotlightCard from '../components/SpotlightCard';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github?: string;
  demo?: string;
  video?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'AI Facial Recognition Attendance',
    description: 'Cloud-based attendance platform using Firestore, PyQt6, OpenCV, and PyTorch. Real-time facial recognition with automated reporting.',
    technologies: ['Python', 'OpenCV', 'PyTorch', 'Firestore', 'PyQt6'],
    image: '/projects/facial_recognition.png',
    github: 'https://github.com/DamienDemontis/proto-1-pr-smart',
    featured: true,
  },
  {
    title: 'Leon\'Art — Art Marketplace',
    description: 'Mobile and web application for buying and selling art with social features. Startup project with international team.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'GCP'],
    image: '/projects/leonart.png',
    github: 'https://github.com/Leon-Art-EIP',
    featured: true,
  },
  {
    title: 'MSC Decouverte',
    description: 'Educational platform helping EPITECH students choose specialties. 800+ external resources. Sold to EPITECH in 2025.',
    technologies: ['Jekyll', 'HTML', 'CSS', 'JavaScript'],
    image: '/projects/msc_decouverte.png',
    demo: 'https://decouverte-pmsc.vercel.app/',
  },
  {
    title: 'Corporate Intranet Solution',
    description: 'WordPress-based intranet improving company-wide internal communication and workflow efficiency.',
    technologies: ['PHP', 'WordPress', 'MySQL', 'JavaScript'],
    image: '/projects/intranet.png',
    video: 'https://youtu.be/fSEylEdaZiM',
  },
  {
    title: 'Inept-Intruder',
    description: 'Multiplayer co-op game where a CCTV operator helps another player navigate through a trapped factory.',
    technologies: ['Unity', 'C#', 'Multiplayer'],
    image: '/projects/inept_intruder.png',
    github: 'https://github.com/DamienDemontis/Inept-Intruders/tree/main',
    video: 'https://youtu.be/S_0kDyYHLs0',
  },
  {
    title: 'Wii Tanks Remastered',
    description: 'Recreation of the classic Wii Play Tank game with enhanced graphics and mechanics in Unity.',
    technologies: ['Unity', 'C#', 'Game Physics'],
    image: '/projects/tank_game.png',
    github: 'https://github.com/Shorssaud/Wii_Tanks_Remastered/tree/main',
    video: 'https://youtu.be/jWfFh3oCJ2I',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useTranslation();
  return (
    <MetalScrollReveal delay={index * 0.08}>
      <SpotlightCard
        className={`group relative overflow-hidden ${project.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 4,
        }}
      >
        <div className="relative overflow-hidden" style={{ height: project.featured ? 'clamp(180px, 40vw, 300px)' : 'clamp(140px, 30vw, 180px)' }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.6)' }}
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.9) 100%)' }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)' }} />
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base md:text-lg font-heading font-semibold text-[#e0e0e0] group-hover:text-white transition-colors">
              {project.title}
            </h3>
            {project.featured && <MetalBadge variant="chrome">{t('projects.featured')}</MetalBadge>}
          </div>

          <p className="text-sm text-[#777] leading-relaxed mb-4 font-light">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.map((tech) => (
              <MetalBadge key={tech} variant="outline" size="sm">{tech}</MetalBadge>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-[rgba(255,255,255,0.04)]">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#6b6b6b] hover:text-white transition-colors font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                {t('projects.source')}
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#6b6b6b] hover:text-white transition-colors font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                {t('projects.demo')}
              </a>
            )}
            {project.video && (
              <a href={project.video} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-[#6b6b6b] hover:text-white transition-colors font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                {t('projects.video')}
              </a>
            )}
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
      </SpotlightCard>
    </MetalScrollReveal>
  );
}

export default function V2Projects() {
  const { t } = useTranslation();
  return (
    <section id="projects" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4"><DecryptedText text={t('projects.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('projects.title')}</MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
