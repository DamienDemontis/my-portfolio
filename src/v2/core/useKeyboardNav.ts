import { useEffect } from 'react';
import { useNav } from './navigation';

function isTypingTarget(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/**
 * Global keyboard traversal:
 *   ⌘K / Ctrl+K / "/"  → command palette
 *   J / K              → next / previous section
 *   1–9, 0             → jump to section 1–10
 *   M                  → atlas (overview)
 *   ?                  → shortcuts overlay
 *   Escape             → close any overlay
 *
 * Arrow keys / PageUp / PageDown are deliberately NOT hijacked — native
 * scrolling must keep working exactly as users expect.
 */
export function useKeyboardNav() {
  const {
    sections,
    travelTo,
    travelNext,
    travelPrev,
    paletteOpen,
    setPaletteOpen,
    atlasOpen,
    setAtlasOpen,
    shortcutsOpen,
    setShortcutsOpen,
    labOpen,
    setLabOpen,
  } = useNav();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Palette toggle works everywhere, even from inputs (standard ⌘K behavior).
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
        return;
      }

      if (e.key === 'Escape') {
        if (paletteOpen) setPaletteOpen(false);
        else if (labOpen) setLabOpen(false);
        else if (atlasOpen) setAtlasOpen(false);
        else if (shortcutsOpen) setShortcutsOpen(false);
        return;
      }

      if (isTypingTarget(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      // Single-key shortcuts are inert while an overlay owns the keyboard.
      if (paletteOpen || atlasOpen || labOpen) return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          setPaletteOpen(true);
          return;
        case '?':
          e.preventDefault();
          setShortcutsOpen(!shortcutsOpen);
          return;
        case 'j':
        case 'J':
          travelNext();
          return;
        case 'k':
        case 'K':
          travelPrev();
          return;
        case 'm':
        case 'M':
          setAtlasOpen(true);
          return;
        default: {
          if (/^[0-9]$/.test(e.key)) {
            // 1..9 → sections 1..9, 0 → section 10.
            const index = e.key === '0' ? 10 : Number(e.key);
            const target = sections[index];
            if (target) travelTo(target.id);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    sections,
    travelTo,
    travelNext,
    travelPrev,
    paletteOpen,
    setPaletteOpen,
    atlasOpen,
    setAtlasOpen,
    shortcutsOpen,
    setShortcutsOpen,
  ]);
}
