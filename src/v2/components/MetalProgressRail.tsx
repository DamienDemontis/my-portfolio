import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNav } from '../core/navigation';

/**
 * The spine: a vertical rail on the right edge, one notch per section,
 * with a liquid-metal droplet tracking scroll position. Notches are evenly
 * spaced (a schematic map, not a to-scale one); the droplet interpolates
 * between the active section's notch and the next using in-section progress.
 *
 * Desktop only — mobile gets a 2px scroll progress line along the top edge.
 * When every section has been visited, the droplet turns gold.
 */
export default function MetalProgressRail() {
  const { t } = useTranslation();
  const { sections, activeId, allVisited, visited, travelTo } = useNav();
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [railFrac, setRailFrac] = useState(0); // 0..1 along the rail
  const [pageFrac, setPageFrac] = useState(0); // 0..1 whole page (mobile bar)
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      rafRef.current = null;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPageFrac(max > 0 ? Math.min(1, y / max) : 0);

      // Locate y between section anchors → fraction along evenly-spaced notches.
      const tops = sections.map(({ id }) => {
        if (id === 'home') return 0;
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + y : Number.MAX_SAFE_INTEGER;
      });
      // Anchor point: 35% down the viewport reads as "what I'm looking at".
      const probe = y + window.innerHeight * 0.35;
      let i = 0;
      for (let k = sections.length - 1; k >= 0; k--) {
        if (probe >= tops[k] && tops[k] !== Number.MAX_SAFE_INTEGER) {
          i = k;
          break;
        }
      }
      const start = tops[i];
      const end = i + 1 < tops.length && tops[i + 1] !== Number.MAX_SAFE_INTEGER ? tops[i + 1] : start + 1;
      const frac = Math.min(1, Math.max(0, (probe - start) / Math.max(1, end - start)));
      const step = 1 / (sections.length - 1);
      setRailFrac(Math.min(1, (i + frac) * step));
    };

    const onScroll = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [sections]);

  return (
    <>
      {/* ── Mobile: top progress line ── */}
      <div
        aria-hidden
        className="md:hidden fixed top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}
      >
        <div
          style={{
            height: '100%',
            width: `${pageFrac * 100}%`,
            background: allVisited
              ? 'linear-gradient(90deg, #7d6a3a, #d4b96a)'
              : 'linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.75))',
            transition: 'width 80ms linear',
          }}
        />
      </div>

      {/* ── Desktop: right-edge rail ── */}
      <nav
        aria-label={t('rail.label')}
        className="hidden md:flex fixed right-5 top-1/2 z-[60] -translate-y-1/2 flex-col items-center"
        style={{ height: 'min(56vh, 460px)' }}
      >
        {/* Track */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}
        />

        {/* Droplet */}
        <div
          aria-hidden
          className="absolute left-1/2 pointer-events-none"
          style={{
            top: `calc(${railFrac * 100}% - 8px)`,
            transform: 'translateX(-50%)',
            width: 16,
            height: 16,
            transition: 'top 120ms cubic-bezier(0.3, 0, 0.2, 1)',
            filter: allVisited ? 'sepia(1) saturate(2.2) hue-rotate(-12deg) brightness(1.15)' : 'none',
            zIndex: 2,
          }}
        >
          {/* CSS chrome bead — a 16px shader canvas isn't worth a whole
              WebGL context (browsers cap ~16 per page). */}
          <span
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 32% 28%, #ffffff 0%, #cfd3d8 22%, #6d7278 55%, #23262b 78%, #7d8288 100%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 0.5px 0 rgba(255,255,255,0.6)',
            }}
          />
        </div>

        {/* Notches */}
        {sections.map((s, i) => {
          const frac = i / (sections.length - 1);
          const isActive = s.id === activeId;
          const isHovered = hoverId === s.id;
          const wasVisited = visited.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => travelTo(s.id)}
              onMouseEnter={() => setHoverId(s.id)}
              onMouseLeave={() => setHoverId(null)}
              aria-label={t('nav.goTo', { label: t(s.labelKey) })}
              aria-current={isActive ? 'true' : undefined}
              className="absolute left-1/2 flex items-center justify-center cursor-pointer"
              style={{
                top: `calc(${frac * 100}% - 11px)`,
                transform: 'translateX(-50%)',
                width: 22,
                height: 22,
                background: 'transparent',
                border: 'none',
                padding: 0,
                zIndex: 3,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: isActive || isHovered ? 10 : 6,
                  height: 1.5,
                  background: isActive
                    ? 'var(--metal-accent)'
                    : wasVisited
                      ? 'rgba(255,255,255,0.45)'
                      : 'rgba(255,255,255,0.18)',
                  transition: 'all 180ms ease',
                  display: 'block',
                }}
              />
              {/* Label */}
              <span
                aria-hidden
                className="absolute right-7 whitespace-nowrap uppercase pointer-events-none"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: isActive ? '#e8e8e8' : '#9a9a9a',
                  background: 'rgba(8,8,8,0.85)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 3,
                  padding: '3px 8px',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(0)' : 'translateX(6px)',
                  transition: 'opacity 160ms ease, transform 160ms ease',
                }}
              >
                {s.num} — {t(s.labelKey)}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
