import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalBadge from '../components/MetalBadge';
import DecryptedText from '../components/DecryptedText';

interface Position {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  technologies: string[];
  achievements: string[];
  impact: string;
  industry: string;
  current?: boolean;
}

const positions: Position[] = [
  {
    title: 'Lead Dev | Fullstack Developer',
    company: 'PandaLab SAS',
    period: 'Dec 2025 — Present',
    location: 'Nancy, France',
    industry: 'HealthTech',
    current: true,
    description: 'Leading fullstack development at a HealthTech company providing a comprehensive e-health coordination platform for healthcare professionals. ISO 27001 & HDS certified with 23,900+ users.',
    technologies: ['Vue 3', 'Vuex', 'Node.js', 'Fastify', 'Vite', 'MongoDB', 'Redis', 'RabbitMQ', 'Docker', 'Nomad', 'Security', 'Frontend Design', 'MCP'],
    achievements: [
      'Lead development of teleexpertise features enabling healthcare professionals to request expert medical opinions',
      'Build teleconsultation modules for secure remote patient consultations',
      'Refactor legacy functionalities to improve maintainability and performance',
      'Contribute to a platform serving 23,900+ professionals with 245,000+ monthly messages',
      'Ensure compliance with ISO 27001 and HDS security standards',
    ],
    impact: 'Modernizing a certified healthcare platform that facilitates coordination between healthcare professionals across France.',
  },
  {
    title: 'Founder & Full Stack Developer',
    company: 'JobNeko',
    period: 'Sep 2024 — Present',
    location: 'Remote',
    industry: 'AI / Open Source',
    current: true,
    description: 'Founded an open-source AI-powered job market analysis platform. Self-hostable with upcoming SaaS model. Simultaneously developing custom websites for clients.',
    technologies: ['Next.js', 'TypeScript', 'OpenAI', 'Prisma', 'Node.js', 'React', 'Tailwind CSS', 'PostgreSQL', 'Chrome Extension API', 'RAG', 'Web Scraping', 'LLM Integration', 'Docker'],
    achievements: [
      'Created full-stack open-source AI-powered job analysis platform',
      'Self-hostable architecture allowing complete user data control',
      'Automated job data extraction via advanced LLMs from any website',
      'Intelligent salary analysis with affordability scoring',
      'AI-powered resume-job matching with personalized compatibility scoring',
      'Chrome extension for one-click job capture from any webpage',
      'RAG implementation for contextual recommendations',
    ],
    impact: 'Launched an innovative open-source project transforming job search with AI, offering free self-hostable + premium SaaS options.',
  },
  {
    title: 'Pedagogical Mentor | MSc Curriculum',
    company: 'EPITECH',
    period: 'Mar 2024 — Aug 2024',
    location: 'Nancy, France',
    industry: 'EdTech',
    description: 'Mentored MSc students on advanced software engineering. Built a cloud-based facial recognition attendance platform. Delivered training on enterprise-grade technologies and agile methodologies.',
    technologies: ['React', 'Vue.js', 'Node.js', 'NestJS', 'Next.js', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'PyTorch', 'OpenCV', 'OWASP Top 10', 'Scrum', 'Kanban'],
    achievements: [
      'Built production-grade facial recognition attendance platform with PyTorch/OpenCV',
      'Introduced modern full-stack technologies into MSc curriculum',
      'Implemented comprehensive CI/CD workflows using GitLab CI and GitHub Actions',
      'Delivered cybersecurity workshops covering OWASP Top 10',
      'Created engaging content improving student engagement by 40%',
    ],
    impact: 'Revolutionized MSc curriculum with enterprise technologies, achieving 95% student satisfaction.',
  },
  {
    title: 'Regional Assistant | PGE & MSc',
    company: 'EPITECH',
    period: '2021 — Aug 2024',
    location: 'Nancy, France',
    industry: 'EdTech',
    description: 'Mentored 200+ students across fundamental and advanced programming concepts, from C/C++ to modern web technologies and DevOps practices.',
    technologies: ['C', 'C++', 'SFML', 'Git', 'Docker', 'SQL', 'JavaScript', 'REST APIs', 'Linux', 'Design Patterns', 'CUnit', 'GoogleTest'],
    achievements: [
      'Top-performing teaching assistant for three consecutive years',
      'Taught fundamental C/C++, memory management, algorithms and data structures',
      'Introduced web development stack and REST API design',
      'Created practical training modules improving coding proficiency by 35%',
    ],
    impact: 'Recognized as top-performing assistant for 3 years, bridging fundamentals with modern development across 200+ students.',
  },
  {
    title: 'Technical Lead & Project Manager',
    company: 'Leon\'Art',
    period: 'Apr 2023 — Mar 2025',
    location: 'Daegu, Korea',
    industry: 'Startup',
    description: 'Architected scalable backend systems for an international art marketplace startup. Led a 7-person cross-functional team.',
    technologies: ['Node.js', 'TypeScript', 'Express', 'MongoDB', 'Stripe', 'React Native', 'GCP', 'Docker', 'Kubernetes', 'Firebase', 'REST APIs', 'WebSockets', 'JWT', 'OAuth 2.0'],
    achievements: [
      'Architected scalable backend with Node.js, TypeScript, and Express',
      'Implemented secure authentication and Stripe payment processing',
      'Designed REST APIs and webhook flows for real-time marketplace events',
      'Led cross-functional team and owned complete technical architecture',
      'Delivered full-stack marketplace platform from concept to beta launch',
    ],
    impact: 'Successfully architected a complete commercial marketplace, demonstrating full-stack leadership in a startup environment.',
  },
  {
    title: 'Web Developer Intern',
    company: '+Simple',
    period: 'Apr 2023 — Aug 2023',
    location: 'Nancy, France',
    industry: 'Fintech',
    description: 'Migrated a monolithic Django application to Nuxt frontend. Cut page load times by 50% and increased test coverage by 30%.',
    technologies: ['Nuxt.js', 'Vue.js', 'Pinia', 'Django', 'PostgreSQL', 'GitLab CI/CD', 'Python', 'Microservices'],
    achievements: [
      'Migrated monolithic Django app to modern Nuxt.js frontend architecture',
      'Achieved 50% reduction in page load times',
      'Increased test coverage by 30% with comprehensive testing strategy',
      'Improved scalability using microservices principles',
    ],
    impact: 'Dramatically improved system performance by 50%, positioning the platform for future growth.',
  },
  {
    title: 'Web Developer Intern',
    company: 'ACORIS Mutuelles',
    period: 'Jul 2021 — Dec 2021',
    location: 'Nancy, France',
    industry: 'Insurance',
    description: 'Developed front-end solutions with WordPress/PHP. Designed MySQL database structures. Built robust intranet solutions improving workflow efficiency.',
    technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'CSS', 'Custom Themes', 'Plugin Development'],
    achievements: [
      'Created custom themes and plugins enhancing UX and functionality',
      'Designed MySQL database structures with data integrity focus',
      'Delivered intranet solutions improving company-wide workflow efficiency',
    ],
    impact: 'Delivered comprehensive intranet solution revolutionizing internal communication across all departments.',
  },
];

export default function V2Experience() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="experience" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4"><DecryptedText text={t('experience.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('experience.title')}</MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="space-y-2">
          {positions.map((pos, i) => {
            const isExpanded = expanded === i;
            return (
              <MetalScrollReveal key={i} delay={i * 0.05}>
                <motion.div
                  layout
                  className="group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(isExpanded ? null : i); } }}
                  style={{
                    background: isExpanded
                      ? 'linear-gradient(135deg, rgba(17,17,17,0.9), rgba(15,15,15,0.95))'
                      : 'transparent',
                    border: `1px solid ${isExpanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'}`,
                    borderRadius: 4,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div className="px-5 md:px-6 py-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-3 md:w-[140px] shrink-0">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[#6b6b6b] font-medium whitespace-nowrap font-body">
                        {pos.period}
                      </span>
                      {pos.current && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#555] animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-sm md:text-base font-semibold transition-colors duration-300 font-heading ${isExpanded ? 'text-white' : 'text-[#999] group-hover:text-[#ddd]'}`}>
                          {pos.title}
                        </h3>
                        <span className="text-[#555]">/</span>
                        <span className="text-[#666] text-sm font-light">{pos.company}</span>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-3 shrink-0">
                      <MetalBadge variant="outline" size="sm">{pos.industry}</MetalBadge>
                      <span className="text-[#6b6b6b] text-xs">{pos.location}</span>
                    </div>

                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      width="14" height="14" viewBox="0 0 14 14"
                      className="text-[#6b6b6b] shrink-0"
                    >
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </motion.svg>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 border-t border-[rgba(255,255,255,0.04)] pt-5">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                              <p className="text-[#888] text-sm leading-relaxed font-light">{pos.description}</p>
                              <div>
                                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium block mb-2">{t('experience.keyAchievements')}</span>
                                <ul className="space-y-1.5">
                                  {pos.achievements.map((a, j) => (
                                    <li key={j} className="text-[#777] text-sm font-light flex items-start gap-2">
                                      <span className="text-[#555] mt-1.5 shrink-0">
                                        <svg width="6" height="6" viewBox="0 0 6 6"><rect width="6" height="6" fill="currentColor" rx="1" /></svg>
                                      </span>
                                      {a}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="pt-2">
                                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium block mb-2">{t('experience.impact')}</span>
                                <p className="text-[#8a8a8a] text-sm font-light italic">{pos.impact}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] font-medium block mb-3">{t('experience.technologies')}</span>
                              <div className="flex flex-wrap gap-1.5">
                                {pos.technologies.map((tech) => (
                                  <MetalBadge key={tech} size="sm">{tech}</MetalBadge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </MetalScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
