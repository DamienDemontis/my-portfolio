import { useCallback, useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNav } from '../core/navigation';
import { syncLangUrl } from '../core/lang';

const EMAIL = 'damien.demontis@epitech.eu';

const MONO = "'JetBrains Mono', monospace";

interface LogLine {
  cmd: string;
  out: string[];
}

/**
 * The metal console — ⌘K command palette.
 *
 * Two personalities in one input:
 *  - fuzzy palette: type anything → section jumps + actions (cmdk filtering)
 *  - terminal: type an exact command (help, ls, cd X, whoami, pwd, cat,
 *    sudo, konami, clear) → output prints in a log above the input
 */
export default function MetalCommandPalette() {
  const { t, i18n } = useTranslation();
  const { sections, activeId, paletteOpen, setPaletteOpen, travelTo, setAtlasOpen, setLabOpen } = useNav();
  const [value, setValue] = useState('');
  const [log, setLog] = useState<LogLine[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paletteOpen) setValue('');
  }, [paletteOpen]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'end' });
  }, [log]);

  const print = useCallback((cmd: string, out: string[]) => {
    setLog((prev) => [...prev.slice(-30), { cmd, out }]);
  }, []);

  const runTerminal = useCallback(
    (raw: string): boolean => {
      const input = raw.trim();
      const [cmd, ...args] = input.toLowerCase().split(/\s+/);
      const arg = args.join(' ');

      switch (cmd) {
        case 'help':
          print(input, [
            'help          — ' + t('palette.term.help'),
            'ls            — ' + t('palette.term.ls'),
            'cd <section>  — ' + t('palette.term.cd'),
            'pwd           — ' + t('palette.term.pwd'),
            'whoami        — ' + t('palette.term.whoami'),
            'clear         — ' + t('palette.term.clear'),
            t('palette.term.hidden'),
          ]);
          return true;
        case 'ls':
          print(
            input,
            sections.slice(1).map((s) => `${s.num}-${s.id}/`),
          );
          return true;
        case 'cd': {
          if (arg === 'lab' || arg === '/lab') {
            print(input, ['→ /lab — welcome to the workshop.']);
            setPaletteOpen(false);
            setLabOpen(true);
            return true;
          }
          const target = sections.find((s) => s.id.startsWith(arg) || s.num === arg.padStart(2, '0'));
          if (arg && target) {
            print(input, [`→ /${target.num}-${target.id}`]);
            travelTo(target.id);
          } else {
            print(input, [`cd: ${arg || '~'}: ${t('palette.term.noSuchSection')}`]);
          }
          return true;
        }
        case 'pwd': {
          const s = sections.find((x) => x.id === activeId) ?? sections[0];
          print(input, [`/portfolio/${s.num}-${s.id}`]);
          return true;
        }
        case 'whoami':
          print(input, ['damien — ' + t('hero.subtitle')]);
          return true;
        case 'cat':
          print(input, ['🐱 ' + t('palette.term.cat')]);
          return true;
        case 'sudo':
          print(input, [t('palette.term.sudo')]);
          return true;
        case 'konami':
          print(input, ['↑ ↑ ↓ ↓ ← → ← → B A', t('palette.term.konami')]);
          return true;
        case 'rm':
          print(input, [t('palette.term.rm')]);
          return true;
        case 'clear':
          setLog([]);
          return true;
        default:
          return false;
      }
    },
    [sections, activeId, travelTo, print, t],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && runTerminal(value)) {
      e.preventDefault();
      e.stopPropagation();
      setValue('');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      print('copy email', [`${EMAIL} — ${t('palette.copied')}`]);
    } catch {
      print('copy email', [EMAIL]);
    }
  };

  const switchLang = (lang: 'en' | 'fr' | 'ko') => {
    i18n.changeLanguage(lang);
    syncLangUrl(lang);
    setPaletteOpen(false);
  };

  const download = (path: string) => {
    const a = document.createElement('a');
    a.href = path;
    a.download = '';
    a.click();
    setPaletteOpen(false);
  };

  const itemStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: '0.06em',
    color: '#b9b9b9',
    padding: '9px 12px',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[16vh]"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
          onClick={() => setPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(560px, 100%)' }}
          >
            <Command
              label={t('palette.label')}
              onKeyDown={onKeyDown}
              style={{
                background: 'linear-gradient(180deg, rgba(16,16,16,0.98) 0%, rgba(9,9,9,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              {/* Terminal log */}
              {log.length > 0 && (
                <div
                  style={{
                    maxHeight: 180,
                    overflowY: 'auto',
                    padding: '10px 14px 4px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontFamily: MONO,
                    fontSize: 11,
                    lineHeight: 1.7,
                  }}
                >
                  {log.map((line, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      <div style={{ color: '#7a7a7a' }}>
                        <span style={{ color: 'var(--metal-accent)' }}>❯</span> {line.cmd}
                      </div>
                      {line.out.map((o, j) => (
                        <div key={j} style={{ color: '#b9b9b9', whiteSpace: 'pre-wrap' }}>
                          {o}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}

              {/* Prompt */}
              <div className="flex items-center gap-2" style={{ padding: '4px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: 'var(--metal-accent)' }}>❯</span>
                <Command.Input
                  value={value}
                  onValueChange={setValue}
                  placeholder={t('palette.placeholder')}
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: MONO,
                    fontSize: 13,
                    letterSpacing: '0.04em',
                    color: '#e8e8e8',
                    padding: '12px 0',
                    caretColor: 'var(--metal-accent)',
                  }}
                />
                <kbd
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    color: '#666',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    padding: '2px 5px',
                  }}
                >
                  ESC
                </kbd>
              </div>

              <Command.List style={{ maxHeight: 320, overflowY: 'auto', padding: 8 }}>
                <Command.Empty
                  style={{ fontFamily: MONO, fontSize: 11, color: '#666', padding: '14px 12px' }}
                >
                  {t('palette.empty')}
                </Command.Empty>

                <Command.Group
                  heading={t('palette.groups.sections')}
                  style={{ color: '#5a5a5a' }}
                >
                  {sections.slice(1).map((s) => (
                    <Command.Item
                      key={s.id}
                      value={`${s.id} ${t(s.labelKey)}`}
                      onSelect={() => travelTo(s.id)}
                      style={itemStyle}
                      className="metal-palette-item"
                    >
                      <span style={{ color: '#6a6a6a', fontSize: 10 }}>{s.num}</span>
                      <span>{t(s.labelKey)}</span>
                      <span style={{ marginLeft: 'auto', color: '#555', fontSize: 10 }}>↵</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={t('palette.groups.actions')} style={{ color: '#5a5a5a' }}>
                  <Command.Item value="overview atlas map" onSelect={() => { setPaletteOpen(false); setAtlasOpen(true); }} style={itemStyle} className="metal-palette-item">
                    <span>{t('palette.actions.atlas')}</span>
                    <kbd style={{ marginLeft: 'auto', color: '#555', fontSize: 10 }}>M</kbd>
                  </Command.Item>
                  <Command.Item value="copy email mail" onSelect={copyEmail} style={itemStyle} className="metal-palette-item">
                    <span>{t('palette.actions.copyEmail')}</span>
                  </Command.Item>
                  <Command.Item value="cv resume english download" onSelect={() => download('/CV_Damien_DEMONTIS_EN.pdf')} style={itemStyle} className="metal-palette-item">
                    <span>{t('palette.actions.cvEn')}</span>
                  </Command.Item>
                  <Command.Item value="cv resume french français download" onSelect={() => download('/CV_Damien_DEMONTIS_FR.pdf')} style={itemStyle} className="metal-palette-item">
                    <span>{t('palette.actions.cvFr')}</span>
                  </Command.Item>
                  <Command.Item value="language english" onSelect={() => switchLang('en')} style={itemStyle} className="metal-palette-item">
                    <span>English</span>
                  </Command.Item>
                  <Command.Item value="langue français french" onSelect={() => switchLang('fr')} style={itemStyle} className="metal-palette-item">
                    <span>Français</span>
                  </Command.Item>
                  <Command.Item value="language 한국어 korean" onSelect={() => switchLang('ko')} style={itemStyle} className="metal-palette-item">
                    <span>한국어</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Hint bar */}
              <div
                style={{
                  padding: '8px 14px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  color: '#5f5f5f',
                  display: 'flex',
                  gap: 16,
                }}
              >
                <span>↑↓ {t('palette.hints.navigate')}</span>
                <span>↵ {t('palette.hints.select')}</span>
                <span style={{ marginLeft: 'auto', color: '#7a6a45' }}>{t('palette.hints.terminal')}</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
