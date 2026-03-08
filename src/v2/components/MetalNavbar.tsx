import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface NavItem {
  label: string;
  href: string;
}

interface MetalNavbarProps {
  items: NavItem[];
  logo?: string;
}

export default function MetalNavbar({ items, logo = 'DD' }: MetalNavbarProps) {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const delta = latest - lastScrollY.current;
    setScrolled(latest > 50);
    if (latest > 200) {
      setHidden(delta > 4);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    items.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className="mx-auto transition-all duration-500"
          style={{
            maxWidth: scrolled ? '56rem' : '100%',
            margin: scrolled ? '0.5rem auto' : '0 auto',
            borderRadius: scrolled ? 12 : 0,
            background: scrolled
              ? 'rgba(8,8,8,0.8)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
            backdropFilter: scrolled ? 'blur(24px) saturate(1.3)' : 'none',
            border: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)' : 'none',
          }}
        >
          <div className="px-5 h-14 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-base font-metal tracking-[0.2em] text-[#c0c0c0] hover:text-white transition-colors cursor-pointer"
            >
              {logo}
            </button>

            <div className="hidden md:flex items-center gap-0.5">
              {items.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollTo(item.href)}
                    className="relative px-3 py-1.5 cursor-pointer group"
                  >
                    <span
                      className={`
                        text-[10px] uppercase tracking-[0.14em] font-medium transition-colors duration-300
                        ${isActive ? 'text-white' : 'text-[#777] group-hover:text-[#bbb]'}
                      `}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: 6,
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-0">
              {(['en', 'fr', 'ko'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={`
                    px-2 py-1 text-[9px] uppercase tracking-[0.1em] font-medium transition-all duration-300 cursor-pointer rounded
                    ${i18n.language === lang
                      ? 'text-white bg-[rgba(255,255,255,0.08)]'
                      : 'text-[#555] hover:text-[#999]'
                    }
                  `}
                >
                  {lang.toUpperCase()}
                </button>
              ))}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2 ml-2"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <motion.span
                  animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
                  className="block w-5 h-px bg-[#999]"
                />
                <motion.span
                  animate={{ opacity: mobileOpen ? 0 : 1 }}
                  className="block w-5 h-px bg-[#999]"
                />
                <motion.span
                  animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
                  className="block w-5 h-px bg-[#999]"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {items.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => scrollTo(item.href)}
                  className={`
                    text-lg tracking-[0.2em] uppercase font-light cursor-pointer
                    ${activeSection === item.href.slice(1) ? 'text-white' : 'text-[#6b6b6b]'}
                  `}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="flex items-center gap-4 mt-8">
                {(['en', 'fr', 'ko'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { i18n.changeLanguage(lang); setMobileOpen(false); }}
                    className={`text-sm tracking-[0.15em] uppercase cursor-pointer ${
                      i18n.language === lang ? 'text-white font-medium' : 'text-[#6b6b6b]'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
