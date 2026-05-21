import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalInput from '../components/MetalInput';
import MetalButton from '../components/MetalButton';
import MetalDivider from '../components/MetalDivider';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';
import MetalLottie from '../components/MetalLottie';
import MetalFishCounter from '../components/MetalFishCounter';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: Element | null;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/damien-demontis/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/damiendemontis',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/damien.demontis/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
];

export default function V2Contact() {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [, setSubmitting] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);

  // Load Calendly only when the section gets close to the viewport.
  //
  // Previous behavior loaded it on mount, which now happens at restReady=+800ms
  // — long before the user reaches the bottom of the page. The script eval is
  // ~1.16s (measured under 6× CPU throttle) and blocks the parser, contributing
  // a huge long task to the cold-load period. IO with rootMargin "1500px" gives
  // the script ~1 viewport of pre-load headroom so it's ready before the
  // section enters view, but doesn't run if the user never scrolls there.
  useEffect(() => {
    const el = calendlyRef.current;
    if (!el) return;
    const CALENDLY_URL = 'https://calendly.com/damien-demontis-knwj/meeting-1h?hide_gdpr_banner=1&background_color=111111&text_color=d4d4d4&primary_color=ffffff';

    let loaded = false;
    const init = () => {
      if (loaded) return;
      loaded = true;
      window.Calendly?.initInlineWidget({ url: CALENDLY_URL, parentElement: el });
    };

    const load = () => {
      if (loaded) return;
      if (window.Calendly) { init(); return; }
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    };

    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: behave as before on browsers without IO.
      load();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load();
          io.disconnect();
        }
      },
      { rootMargin: '1500px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <section id="contact" className="metal-section relative overflow-hidden">
      {/* WebGL MetallicSurface background removed (2026-05-21): was rendered at
          opacity-10 below content — invisible cost. Saves one full WebGL context
          + a heavy fragment shader at the bottom of the page. See
          docs/superpowers/specs/2026-05-21-webgl-perf-investigation-design.md */}

      <div className="metal-section-inner relative z-10">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4"><DecryptedText text={t('contact.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('contact.title')}</MetalShaderTitle>
          </div>
        </MetalScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <MetalScrollReveal direction="left">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-heading font-semibold text-[#e0e0e0] mb-4">{t('contact.heading')}</h3>
                <p className="text-sm text-[#777] leading-relaxed font-light">
                  {t('contact.description')}
                </p>
              </div>

              <MetalDivider variant="gradient" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#555]">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <a href={`mailto:${t('contact.email')}`} className="text-sm text-[#888] hover:text-white transition-colors font-light">
                    {t('contact.email')}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#555]">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-sm text-[#888] font-light">{t('contact.location')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#555]">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="text-sm text-[#888] font-light">{t('contact.availability')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.label}
                    aria-label={link.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#555] hover:text-white transition-all duration-300 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.04)]"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/CV_Damien_DEMONTIS_EN.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a8a] hover:text-white transition-colors font-medium border-b border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] pb-0.5"
                >
                  {t('contact.resumeEn')}
                </a>
                <span className="text-[#555]">/</span>
                <a
                  href="/CV_Damien_DEMONTIS_FR.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a8a] hover:text-white transition-colors font-medium border-b border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] pb-0.5"
                >
                  {t('contact.resumeFr')}
                </a>
                <span className="text-[#555]">/</span>
                <a
                  href="https://calendly.com/damien-demontis-knwj/meeting-1h?hide_gdpr_banner=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a8a] hover:text-white transition-colors font-medium border-b border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] pb-0.5"
                >
                  {t('contact.schedule')}
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.04)]">
                <div
                  className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  onClick={() => { if ((window as any).__feedCat) (window as any).__feedCat(); }}
                >
                  <MetalLottie animationPath="/JobNeko.json" className="w-full h-[300px]" />
                </div>
                <MetalFishCounter />
              </div>
            </div>
          </MetalScrollReveal>

          <MetalScrollReveal direction="right" delay={0.15}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <MetalInput
                  label={t('contact.form.name')}
                  placeholder={t('contact.form.namePlaceholder')}
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                />
                <MetalInput
                  label={t('contact.form.email')}
                  type="email"
                  placeholder={t('contact.form.emailPlaceholder')}
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <MetalInput
                label={t('contact.form.subject')}
                placeholder={t('contact.form.subjectPlaceholder')}
                value={formState.subject}
                onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
              />
              <MetalInput
                label={t('contact.form.message')}
                multiline
                rows={5}
                placeholder={t('contact.form.messagePlaceholder')}
                value={formState.message}
                onChange={(e: any) => setFormState((s) => ({ ...s, message: e.target.value }))}
              />
              <MetalButton type="submit" size="lg" className="w-full sm:w-auto">
                {t('contact.form.send')}
              </MetalButton>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-heading font-semibold text-[#e0e0e0] mb-4">{t('contact.bookCall')}</h3>
              <div className="metal-calendly-container">
                {/* Use a non-Calendly classname so widget.js's auto-init does NOT
                    scan this element — its parseOptions() crashes when there is
                    no data-url attribute and we initialize via initInlineWidget()
                    ourselves once it's safe to load. */}
                <div ref={calendlyRef} className="metal-calendly-inline" style={{ minWidth: 320, height: 700 }} />
              </div>
            </div>
          </MetalScrollReveal>
        </div>
      </div>
    </section>
  );
}
