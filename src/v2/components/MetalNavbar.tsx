import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface NavItem {
  label: string;
  href: string;
}

interface MetalNavbarProps {
  items: NavItem[];
  logo?: string;
}

export default function MetalNavbar({ items, logo = 'PORTFOLIO' }: MetalNavbarProps) {
  const { i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm font-bold tracking-[0.3em] text-[#888] hover:text-white transition-colors metal-chrome-text cursor-pointer"
          >
            {logo}
          </button>

          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={`
                  relative px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium
                  transition-colors duration-300 cursor-pointer
                  ${activeSection === item.href.slice(1)
                    ? 'text-white'
                    : 'text-[#8a8a8a] hover:text-[#ccc]'
                  }
                `}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-4">
            {(['en', 'fr', 'ko'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`px-2 py-1 text-[10px] uppercase tracking-[0.1em] font-medium transition-colors cursor-pointer ${
                  i18n.language === lang ? 'text-white' : 'text-[#6b6b6b] hover:text-[#aaa]'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : 'KR'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-pointer p-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
              className="block w-5 h-px bg-[#888]"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="block w-5 h-px bg-[#888]"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
              className="block w-5 h-px bg-[#888]"
            />
          </button>
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
                    {lang === 'en' ? 'EN' : lang === 'fr' ? 'FR' : 'KR'}
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
