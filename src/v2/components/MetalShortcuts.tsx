import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNav } from '../core/navigation';

const KEY_STYLE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.08em',
  color: '#d4d4d4',
  background: 'linear-gradient(180deg, #262626 0%, #161616 100%)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderBottomWidth: 2,
  borderRadius: 4,
  padding: '3px 7px',
  minWidth: 24,
  textAlign: 'center',
  display: 'inline-block',
};

/** Engraved shortcut plate, toggled with "?". */
export default function MetalShortcuts() {
  const { t } = useTranslation();
  const { shortcutsOpen, setShortcutsOpen } = useNav();

  const rows: Array<{ keys: string[]; label: string }> = [
    { keys: ['⌘', 'K'], label: t('shortcuts.palette') },
    { keys: ['J', 'K'], label: t('shortcuts.nextPrev') },
    { keys: ['1', '…', '0'], label: t('shortcuts.jump') },
    { keys: ['M'], label: t('shortcuts.atlas') },
    { keys: ['?'], label: t('shortcuts.this') },
    { keys: ['ESC'], label: t('shortcuts.close') },
  ];

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShortcutsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('shortcuts.title')}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(360px, 100%)',
              background: 'linear-gradient(180deg, #101010 0%, #0a0a0a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              boxShadow: '0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
              padding: '20px 22px',
            }}
          >
            <div
              className="uppercase mb-4"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.3em',
                color: '#8a8a8a',
              }}
            >
              {t('shortcuts.title')}
            </div>
            <div className="flex flex-col gap-2.5">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span style={{ fontSize: 12, color: '#b5b5b5' }}>{row.label}</span>
                  <span className="flex gap-1">
                    {row.keys.map((k, i) => (
                      <span key={i} style={k === '…' ? { color: '#666', fontSize: 10, alignSelf: 'center' } : KEY_STYLE}>
                        {k}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
