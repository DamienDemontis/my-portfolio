import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalLottie from '../components/MetalLottie';
import DecryptedText from '../components/DecryptedText';
import './V2Experience.css';

// ============================================
// Typing effect — triggers on scroll into view
// ============================================

function TypingText({ text, delay = 0, speed = 25 }: { text: string; delay?: number; speed?: number }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (started.current) return;
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();
          setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
              i++;
              setCount(i);
              if (i >= text.length) clearInterval(interval);
            }, speed);
          }, delay);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delay, speed]);

  return (
    <span ref={elRef} className="git-typing">
      {text.split('').map((ch, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0 }}>{ch}</span>
      ))}
    </span>
  );
}

// ============================================
// Position data
// ============================================

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
  logo?: string;
  lottie?: string;
}

const positions: Position[] = [
  {
    title: 'Lead Dev | Fullstack Developer',
    company: 'PandaLab SAS',
    period: 'Dec 2025 — Present',
    location: 'Nancy, France',
    industry: 'HealthTech',
    current: true,
    logo: '/Logo_pandalab.webp',
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
    lottie: '/JobNeko.json',
    description: 'Founded an open-source AI-powered job market analysis platform. Self-hostable with upcoming SaaS model.',
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
    logo: '/Epitech_Official_Logo.webp',
    description: 'Mentored MSc students on advanced software engineering. Built a cloud-based facial recognition attendance platform.',
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
    logo: '/Epitech_Official_Logo.webp',
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
    logo: '/images/leonart-logo.webp',
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
    title: 'Fullstack Developer Intern',
    company: '+Simple',
    period: 'Apr 2023 — Aug 2023',
    location: 'Nancy, France',
    industry: 'Fintech',
    logo: '/Logo-plus-simple.webp',
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
    logo: '/acoris_logo.webp',
    description: 'Developed front-end solutions with WordPress/PHP. Designed MySQL database structures.',
    technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'CSS', 'Custom Themes', 'Plugin Development'],
    achievements: [
      'Created custom themes and plugins enhancing UX and functionality',
      'Designed MySQL database structures with data integrity focus',
      'Delivered intranet solutions improving company-wide workflow efficiency',
    ],
    impact: 'Delivered comprehensive intranet solution revolutionizing internal communication across all departments.',
  },
];

// ============================================
// Git graph topology
// ============================================

const B = {
  main:    '#d4a574',
  jobneko: '#7a9eb5',
  epitech: '#9b8e7e',
  leonart: '#7fa882',
  simple:  '#b08db5',
  acoris:  '#b5967a',
};

// Col pixel positions (must match CSS left values + 1px for center)
const CX_DESKTOP = [33, 65];
const CX_MOBILE  = [21, 45];
const GUTTER_DESKTOP = 100;
const GUTTER_MOBILE  = 64;

interface Line { col: number; color: string; dashed?: boolean; noBottom?: boolean; noTop?: boolean }

interface GitCommit {
  posIndex: number | null;
  hash: string;
  col: number;
  color: string;
  refs: { label: string; type: 'head' | 'branch' | 'current' }[];
  commitMsg: string;
  lines: Line[];
  bookend?: 'future' | 'init';
}

interface Connector {
  lines: { col: number; color: string }[];
  fork?: { color: string };  // curve from col 0 → col 1 (bottom half)
  merge?: { color: string }; // curve from col 1 → col 0 (top half)
}

// All work commits on col 1 — branch line spans full row height
// Connectors use merge-then-fork: top half merges previous branch back,
// bottom half forks new branch out. No X crossings.
const gitCommits: GitCommit[] = [
  // === FUTURE ===
  {
    posIndex: null, hash: '???????', col: 0, color: B.main,
    refs: [{ label: 'unreached', type: 'branch' }],
    commitMsg: 'feat: join your company?',
    lines: [{ col: 0, color: B.main, dashed: true, noTop: true }],
    bookend: 'future',
  },
  // === WORK ===
  {
    posIndex: 0, hash: 'a3f7c21', col: 1, color: B.main,
    refs: [{ label: 'HEAD', type: 'head' }, { label: 'main', type: 'current' }],
    commitMsg: 'feat: lead healthtech platform development',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.main }],
  },
  {
    posIndex: 1, hash: '8b2e4f9', col: 1, color: B.jobneko,
    refs: [{ label: 'feature/jobneko', type: 'branch' }],
    commitMsg: 'feat: launch ai-powered job analysis',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.jobneko }],
  },
  {
    posIndex: 4, hash: 'd91a3c7', col: 1, color: B.leonart,
    refs: [{ label: 'feature/leonart', type: 'branch' }],
    commitMsg: 'feat: architect art marketplace platform',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.leonart }],
  },
  {
    posIndex: 2, hash: 'f4c8a12', col: 1, color: B.epitech,
    refs: [{ label: 'epitech/mentor', type: 'branch' }],
    commitMsg: 'feat: mentor msc curriculum',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.epitech }],
  },
  {
    posIndex: 3, hash: '2e7b91d', col: 1, color: B.epitech,
    refs: [{ label: 'epitech/ra', type: 'branch' }],
    commitMsg: 'feat: regional assistant for 200+ students',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.epitech }],
  },
  {
    posIndex: 5, hash: '7a3f5c8', col: 1, color: B.simple,
    refs: [],
    commitMsg: 'feat: migrate monolith to nuxt frontend',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.simple }],
  },
  {
    posIndex: 6, hash: 'b1d9e42', col: 1, color: B.acoris,
    refs: [],
    commitMsg: 'feat: first dev role, wordpress/php',
    lines: [{ col: 0, color: B.main }, { col: 1, color: B.acoris }],
  },
  // === INIT ===
  {
    posIndex: null, hash: '0000000', col: 0, color: B.main,
    refs: [{ label: 'origin', type: 'branch' }],
    commitMsg: 'init: spawned on planet earth',
    lines: [{ col: 0, color: B.main, noBottom: true }],
    bookend: 'init',
  },
];

// Connectors: merge (top half) + fork (bottom half)
// merge = col 1 → col 0 curve in top half (previous branch returns to main)
// fork  = col 0 → col 1 curve in bottom half (new branch starts)
const connectors: Connector[] = [
  // Future → PandaLab: fork only (future is on main, PandaLab starts branch)
  { lines: [{ col: 0, color: B.main }], fork: { color: B.main } },
  // PandaLab → JobNeko: merge PandaLab back, fork JobNeko
  { lines: [{ col: 0, color: B.main }], merge: { color: B.main }, fork: { color: B.jobneko } },
  // JobNeko → Leon'Art
  { lines: [{ col: 0, color: B.main }], merge: { color: B.jobneko }, fork: { color: B.leonart } },
  // Leon'Art → EPITECH Mentor
  { lines: [{ col: 0, color: B.main }], merge: { color: B.leonart }, fork: { color: B.epitech } },
  // EPITECH Mentor → EPITECH RA (same branch continues)
  { lines: [{ col: 0, color: B.main }, { col: 1, color: B.epitech }] },
  // EPITECH RA → +Simple
  { lines: [{ col: 0, color: B.main }], merge: { color: B.epitech }, fork: { color: B.simple } },
  // +Simple → ACORIS
  { lines: [{ col: 0, color: B.main }], merge: { color: B.simple }, fork: { color: B.acoris } },
  // ACORIS → Init: merge only (init is on main)
  { lines: [{ col: 0, color: B.main }], merge: { color: B.acoris } },
];

// ============================================
// Sub-components
// ============================================

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    setMobile(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return mobile;
}

function ConnectorRow({ connector }: { connector: Connector }) {
  const isMobile = useIsMobile();
  const CX = isMobile ? CX_MOBILE : CX_DESKTOP;
  const gutterW = isMobile ? GUTTER_MOBILE : GUTTER_DESKTOP;
  const hasBoth = connector.merge && connector.fork;
  const h = hasBoth ? 48 : 36;
  const mid = h / 2;

  return (
    <div className="git-connector">
      <div className="git-connector-gutter">
        <svg width={gutterW} height={h} viewBox={`0 0 ${gutterW} ${h}`}>
          {/* Main vertical line always runs full height */}
          {connector.lines.map((l, i) => (
            <line key={i} x1={CX[l.col]} y1={0} x2={CX[l.col]} y2={h}
              stroke={l.color} strokeWidth={2} strokeOpacity={0.5} />
          ))}
          {/* Merge: col 1 → col 0 in top half */}
          {connector.merge && (
            <path
              d={hasBoth
                ? `M ${CX[1]},0 C ${CX[1]},${mid * 0.6} ${CX[0]},${mid * 0.4} ${CX[0]},${mid}`
                : `M ${CX[1]},0 C ${CX[1]},${h * 0.6} ${CX[0]},${h * 0.4} ${CX[0]},${h}`}
              stroke={connector.merge.color} strokeWidth={2} strokeOpacity={0.5} fill="none"
            />
          )}
          {/* Fork: col 0 → col 1 in bottom half */}
          {connector.fork && (
            <path
              d={hasBoth
                ? `M ${CX[0]},${mid} C ${CX[0]},${mid + (h - mid) * 0.6} ${CX[1]},${mid + (h - mid) * 0.4} ${CX[1]},${h}`
                : `M ${CX[0]},0 C ${CX[0]},${h * 0.6} ${CX[1]},${h * 0.4} ${CX[1]},${h}`}
              stroke={connector.fork.color} strokeWidth={2} strokeOpacity={0.5} fill="none"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

function DiffView({ position }: { position: Position }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div className="git-diff-container">
        <div className="git-diff-header">
          <div><span style={{ color: '#555' }}>Author: </span><span className="diff-author">Damien Demontis</span></div>
          <div><span style={{ color: '#555' }}>Date:   </span><span className="diff-date">{position.period}</span></div>
          <div>
            <span style={{ color: '#555' }}>Loc:    </span>
            <span className="diff-date">{position.location}</span>
            <span style={{ color: '#333', margin: '0 8px' }}>|</span>
            <span className="diff-date">{position.industry}</span>
          </div>
          <div className="diff-desc">{position.description}</div>
        </div>
        <div className="git-diff-file">diff --git a/achievements b/achievements</div>
        <div className="git-diff-hunk">@@ -0,0 +1,{position.achievements.length} @@</div>
        {position.achievements.map((a, i) => (
          <div key={i} className="git-diff-add">{a}</div>
        ))}
        <div className="git-diff-impact">{position.impact}</div>
        <div className="git-diff-summary">
          <span>{position.technologies.length} files changed:</span>
          {position.technologies.map((tech) => (
            <span key={tech} className="git-diff-tech">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CommitRow({
  commit, isExpanded, onToggle, index,
}: {
  commit: GitCommit;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const isHead = commit.refs.some(r => r.type === 'head');
  const isBookend = !!commit.bookend;
  const isFuture = commit.bookend === 'future';
  const pos = commit.posIndex !== null ? positions[commit.posIndex] : null;

  const cls = [
    'git-commit-row', 'git-row-reveal',
    isExpanded && 'is-expanded',
    isBookend && 'is-bookend',
    isFuture && 'is-future',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={isBookend ? undefined : onToggle}
      role={isBookend ? undefined : 'button'}
      tabIndex={isBookend ? undefined : 0}
      onKeyDown={isBookend ? undefined : (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
      }}
    >
      {/* Graph gutter: vertical lines + dot */}
      <div className="git-graph-gutter">
        {commit.lines.map((line, i) => {
          const classes = [
            'git-vline',
            line.dashed && 'is-dashed',
            line.noTop && 'no-top',
            line.noBottom && 'no-bottom',
          ].filter(Boolean).join(' ');
          return (
            <div
              key={i}
              className={classes}
              data-col={line.col}
              style={{
                background: line.dashed ? undefined : line.color,
                borderColor: line.dashed ? line.color : undefined,
              }}
            />
          );
        })}
        <div
          className={`git-dot ${isHead ? 'is-head' : ''} ${isFuture ? 'is-future' : ''}`}
          data-col={commit.col}
          style={{
            background: isFuture ? undefined : commit.color,
            ['--dot-color' as string]: commit.color,
          }}
        />
      </div>

      {/* Commit info */}
      <div className="git-commit-info">
        <div className="git-commit-header">
          <span className="git-hash" style={{ color: commit.color }}>{commit.hash}</span>
          {commit.refs.map((ref, i) => (
            <span key={i} className={`git-ref ${ref.type === 'head' ? 'ref-head' : ref.type === 'current' ? 'ref-current' : 'ref-branch'}`}>
              {ref.label}
            </span>
          ))}
        </div>

        {isBookend ? (
          <div className="git-bookend-message">
            <TypingText text={commit.commitMsg} delay={index * 80 + 300} speed={isFuture ? 50 : 30} />
          </div>
        ) : (
          <>
            <div className="git-commit-content-row">
              <div className="git-commit-text">
                <div className="git-commit-title">{pos!.title}</div>
                <div className="git-commit-message">
                  <TypingText text={commit.commitMsg} delay={index * 80 + 300} speed={20} />
                  {' '}<span className="company">— {pos!.company}</span>
                </div>
                <div className="git-commit-meta">
                  <span>{pos!.period}</span>
                  <span className="separator">·</span>
                  <span>{pos!.location}</span>
                  {pos!.current && (
                    <>
                      <span className="separator">·</span>
                      <span style={{ color: '#7fa882' }}>● active</span>
                    </>
                  )}
                </div>
              </div>
              {pos!.logo && (
                <img src={pos!.logo} alt={pos!.company} className="git-company-logo" />
              )}
              {pos!.lottie && (
                <MetalLottie animationPath={pos!.lottie} className="git-company-lottie" />
              )}
            </div>
          </>
        )}

        <AnimatePresence>
          {isExpanded && pos && <DiffView position={pos} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// Main
// ============================================

export default function V2Experience() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="experience" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4">
              <DecryptedText text={t('experience.number')} speed={60}
                className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" />
            </span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">
              {t('experience.title')}
            </MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <MetalScrollReveal>
          <div className="git-terminal">
            <div className="git-terminal-bar">
              <div className="git-terminal-dots"><span /><span /><span /></div>
              <span className="git-terminal-cmd">
                <span className="prompt">$</span>
                git log --graph --all --decorate
                <span className="git-cursor" />
              </span>
            </div>

            <div className="git-log-content">
              {gitCommits.map((commit, i) => (
                <Fragment key={commit.hash}>
                  <CommitRow
                    commit={commit}
                    isExpanded={expanded === i}
                    onToggle={() => setExpanded(expanded === i ? null : i)}
                    index={i}
                  />
                  {i < connectors.length && <ConnectorRow connector={connectors[i]} />}
                </Fragment>
              ))}
            </div>
          </div>
        </MetalScrollReveal>
      </div>
    </section>
  );
}
