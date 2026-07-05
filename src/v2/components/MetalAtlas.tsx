import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNav } from '../core/navigation';
import { sectionIcons, homeIcon, commandIcon } from '../core/sectionIcons';
import { syncLangUrl } from '../core/lang';

/**
 * The Atlas — bird's-eye overview of the whole portfolio (press M, or the
 * map button in the dock; on mobile this IS the menu, opened by the burger).
 * A grid of section cover plates; click a plate to fast-travel.
 */
export default function MetalAtlas() {
  const { t, i18n } = useTranslation();
  const { sections, activeId, visited, atlasOpen, setAtlasOpen, setPaletteOpen, travelTo } = useNav();
  const panelRef = useRef<HTMLDivElement>(null);

  // Rudimentary focus trap: focus the active plate on open, keep Tab inside.
  useEffect(() => {
    if (!atlasOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      [...panel.querySelectorAll<HTMLElement>('button, [href]')].filter((el) => !el.hasAttribute('disabled'));

    (panel.querySelector<HTMLElement>('[aria-current="true"]') ?? focusables()[0])?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [atlasOpen]);

  // Lock page scroll while open.
  useEffect(() => {
    if (!atlasOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [atlasOpen]);

  return (
    <AnimatePresence>
      {atlasOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[85] overflow-y-auto"
          style={{ background: 'rgba(2,2,2,0.9)', backdropFilter: 'blur(18px)' }}
          onClick={() => setAtlasOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('atlas.title')}
        >
          <div
            ref={panelRef}
            className="min-h-full flex flex-col items-center justify-center px-4 py-16 md:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="mb-8 flex items-baseline gap-4 uppercase select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.35em' }}
            >
              <span style={{ fontSize: 11, color: '#8a8a8a' }}>{t('atlas.title')}</span>
              <span style={{ fontSize: 9, color: '#555' }}>
                {visited.size - 1}/{sections.length - 1} {t('atlas.explored')}
              </span>
            </motion.div>

            {/* Plate grid */}
            <div className="grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {/* Home plate spans differently to break the grid rhythm */}
              <AtlasPlate
                index={0}
                num="00"
                label={t('nav.home')}
                icon={homeIcon}
                isActive={activeId === 'home'}
                wasVisited
                onSelect={() => travelTo('home')}
              />
              {sections.slice(1).map((s, i) => (
                <AtlasPlate
                  key={s.id}
                  index={i + 1}
                  num={s.num}
                  label={t(s.labelKey)}
                  icon={sectionIcons[s.id]}
                  isActive={activeId === s.id}
                  wasVisited={visited.has(s.id)}
                  onSelect={() => travelTo(s.id)}
                />
              ))}
              {/* Console plate (primary palette entry on touch devices) */}
              <AtlasPlate
                index={sections.length}
                num={'>_'}
                label={t('atlas.console')}
                icon={commandIcon}
                isActive={false}
                wasVisited
                onSelect={() => {
                  setAtlasOpen(false);
                  setPaletteOpen(true);
                }}
              />
            </div>

            {/* Language row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-10 flex items-center gap-5"
            >
              {(['en', 'fr', 'ko'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    i18n.changeLanguage(lang);
                    syncLangUrl(lang);
                  }}
                  className="uppercase cursor-pointer"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    color: i18n.language === lang ? '#f0f0f0' : '#5f5f5f',
                    background: 'none',
                    border: 'none',
                    borderBottom: i18n.language === lang ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                    paddingBottom: 2,
                  }}
                >
                  {lang}
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#4a4a4a' }}
            >
              ESC — {t('shortcuts.close')}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AtlasPlate({
  index,
  num,
  label,
  icon,
  isActive,
  wasVisited,
  onSelect,
}: {
  index: number;
  num: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  wasVisited: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.06 + index * 0.035, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      aria-current={isActive ? 'true' : undefined}
      className="metal-atlas-plate group relative flex aspect-[4/3] cursor-pointer flex-col justify-between overflow-hidden p-3 text-left md:p-4"
      style={{
        borderRadius: 8,
        background: isActive
          ? 'linear-gradient(160deg, #1d1d1d 0%, #101010 100%)'
          : 'linear-gradient(160deg, #131313 0%, #0b0b0b 100%)',
        border: isActive ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isActive
          ? '0 0 0 1px rgba(255,255,255,0.1), 0 12px 32px rgba(0,0,0,0.5)'
          : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Top row: number + visited tick */}
      <div className="flex w-full items-start justify-between">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.2em',
            color: isActive ? '#e8e8e8' : '#6a6a6a',
          }}
        >
          {num}
        </span>
        <span
          aria-hidden
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: wasVisited ? (isActive ? '#fff' : 'rgba(255,255,255,0.4)') : 'rgba(255,255,255,0.08)',
            marginTop: 4,
          }}
        />
      </div>

      {/* Glyph */}
      <div
        aria-hidden
        className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 opacity-25 transition-all duration-300 group-hover:opacity-60 group-hover:scale-110 md:h-12 md:w-12"
        style={{ color: isActive ? '#fff' : '#9a9a9a' }}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className="uppercase"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          fontSize: 'clamp(11px, 1.4vw, 14px)',
          letterSpacing: '0.08em',
          color: isActive ? '#fafafa' : '#b9b9b9',
        }}
      >
        {label}
      </span>

      {/* Hover sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.05) 45%, transparent 60%)',
        }}
      />
    </motion.button>
  );
}
