import { useState, useEffect, useRef, Children, cloneElement, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FLAGS from './flags';

interface NavItem {
  label: string;
  href: string;
}

interface MetalNavbarProps {
  items: NavItem[];
  logo?: string;
}

/* ── Section icons ── */
const sectionIcons: Record<string, React.ReactNode> = {
  about: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 12 0v1" />
    </svg>
  ),
  experience: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  skills: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  education: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L1 9l11 6 9-4.91V17" /><path d="M5 13.18v4L12 21l7-3.82v-4" />
    </svg>
  ),
  certifications: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
  languages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z" />
    </svg>
  ),
  interests: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  photography: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  ),
  contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

const homeIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

/* ── Language flag SVGs imported from shared module (rendered monochrome via CSS filter in DockFlag) ── */
const LANG_TO_FLAG = { en: 'GB', fr: 'FR', ko: 'KR' } as const;

/* ── Dock sub-components ── */

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };
const BASE_SIZE = 40;
const MAGNIFICATION = 64;
const DISTANCE = 140;

function DockItem({
  children,
  onClick,
  mouseX,
  isActive,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  isActive?: boolean;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE_SIZE };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(mouseDistance, [-DISTANCE, 0, DISTANCE], [BASE_SIZE, MAGNIFICATION, BASE_SIZE]);
  const size = useSpring(targetSize, SPRING);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onClick={onClick}
      className="relative inline-flex items-center justify-center cursor-pointer"
      tabIndex={0}
      role="button"
      aria-label={label}
      whileTap={{ scale: 0.85 }}
    >
      {/* Active dot */}
      {isActive && (
        <motion.div
          layoutId="dock-active"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}
      {/* Glow behind active item */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: isActive ? 1 : 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child
      )}
    </motion.div>
  );
}

function DockLabel({ children, isHovered }: { children: React.ReactNode; isHovered?: MotionValue<number> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsub = isHovered.on('change', (v) => setVisible(v === 1));
    return () => unsub();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute -top-7 left-1/2 whitespace-nowrap rounded-md px-2 py-0.5"
          style={{
            x: '-50%',
            background: 'rgba(15,15,15,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#bbb',
          }}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, isActive }: { children: React.ReactNode; isActive?: boolean; isHovered?: MotionValue<number> }) {
  return (
    <div
      className="flex items-center justify-center transition-colors duration-200"
      style={{ color: isActive ? '#fff' : '#666' }}
    >
      {children}
    </div>
  );
}

function DockFlag({ children, isActive }: { children: React.ReactNode; isActive?: boolean; isHovered?: MotionValue<number> }) {
  return (
    <div
      className="flex items-center justify-center rounded-sm overflow-hidden transition-all duration-200"
      style={{
        filter: isActive
          ? 'grayscale(0.3) brightness(0.9) contrast(1.1)'
          : 'grayscale(1) brightness(0.4) contrast(1.1)',
      }}
    >
      {children}
    </div>
  );
}

/* ── Separator ── */
function DockSeparator() {
  return <div className="w-px h-6 mx-1 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />;
}

/* ── Main Navbar ── */

import React from 'react';

export default function MetalNavbar({ items, logo = 'DD' }: MetalNavbarProps) {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const panelHeight = 56;
  const maxHeight = useMemo(() => Math.max(panelHeight + 16, MAGNIFICATION + MAGNIFICATION / 2 + 4), []);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, SPRING);

  // Track active section
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
      {/* ── Desktop Dock ── */}
      <motion.div
        style={{ height, scrollbarWidth: 'none' }}
        className="fixed bottom-0 left-0 right-0 z-50 hidden md:flex items-end justify-center pointer-events-none"
      >
        <motion.nav
          onMouseMove={({ pageX }) => {
            isHovered.set(1);
            mouseX.set(pageX);
          }}
          onMouseLeave={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          className="flex items-end gap-1 pb-3 px-3 pointer-events-auto"
          style={{
            height: panelHeight,
            borderRadius: 14,
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            marginBottom: 12,
          }}
          role="navigation"
          aria-label={t('nav.dockLabel')}
        >
          {/* Home */}
          <DockItem
            mouseX={mouseX}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            isActive={activeSection === 'home'}
            label={t('nav.scrollToTop')}
          >
            <DockIcon isActive={activeSection === 'home'}>{homeIcon}</DockIcon>
            <DockLabel>{logo}</DockLabel>
          </DockItem>

          <DockSeparator />

          {/* Section items */}
          {items.map((item) => {
            const id = item.href.slice(1);
            const isActive = activeSection === id;
            return (
              <DockItem
                key={item.href}
                mouseX={mouseX}
                onClick={() => scrollTo(item.href)}
                isActive={isActive}
                label={t('nav.goTo', { label: item.label })}
              >
                <DockIcon isActive={isActive}>
                  {sectionIcons[id] || <span className="text-xs font-medium">{item.label.slice(0, 2)}</span>}
                </DockIcon>
                <DockLabel>{item.label}</DockLabel>
              </DockItem>
            );
          })}

          <DockSeparator />

          {/* Language switcher */}
          {(['en', 'fr', 'ko'] as const).map((lang) => {
            const isActive = i18n.language === lang;
            const name = t(`nav.languageNames.${lang}`);
            return (
              <DockItem
                key={lang}
                mouseX={mouseX}
                onClick={() => i18n.changeLanguage(lang)}
                isActive={isActive}
                label={t('nav.switchTo', { language: name })}
              >
                <DockFlag isActive={isActive}>{FLAGS[LANG_TO_FLAG[lang]]}</DockFlag>
                <DockLabel>{name}</DockLabel>
              </DockItem>
            );
          })}
        </motion.nav>
      </motion.div>

      {/* ── Mobile: hamburger ── */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 cursor-pointer p-3 rounded-xl"
          style={{
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={mobileOpen}
        >
          <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block w-5 h-px bg-[#999]" />
          <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-5 h-px bg-[#999]" />
          <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block w-5 h-px bg-[#999]" />
        </button>
      </div>

      {/* ── Mobile fullscreen menu ── */}
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
            aria-label={t('nav.menuLabel')}
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
                  className={`text-base sm:text-lg tracking-[0.1em] sm:tracking-[0.2em] uppercase font-light cursor-pointer ${
                    activeSection === item.href.slice(1) ? 'text-white' : 'text-[#6b6b6b]'
                  }`}
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
