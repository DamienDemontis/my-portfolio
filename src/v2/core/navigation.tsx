import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LiquidMetal } from '@paper-design/shaders-react';
import { useReducedMotion } from 'framer-motion';

/**
 * Navigation core — "The Foundry Console".
 *
 * Single source of truth for:
 *  - the section registry (id, number, i18n label key)
 *  - the active section (IntersectionObserver, resilient to lazy-mounted sections)
 *  - fast travel with the liquid-metal veil transition
 *  - scroll velocity (drives LiquidMetal title speed)
 *  - visited-section tracking (rail completion state)
 *  - open/close state for the palette, atlas and shortcuts overlays
 */

export interface SectionDef {
  id: string;
  num: string;
  labelKey: string;
}

export const NAV_SECTIONS: SectionDef[] = [
  { id: 'home', num: '00', labelKey: 'nav.home' },
  { id: 'about', num: '01', labelKey: 'nav.about' },
  { id: 'experience', num: '02', labelKey: 'nav.experience' },
  { id: 'skills', num: '03', labelKey: 'nav.skills' },
  { id: 'projects', num: '04', labelKey: 'nav.projects' },
  { id: 'education', num: '05', labelKey: 'nav.education' },
  { id: 'certifications', num: '06', labelKey: 'nav.certifications' },
  { id: 'languages', num: '07', labelKey: 'nav.languages' },
  { id: 'interests', num: '08', labelKey: 'nav.interests' },
  { id: 'photography', num: '09', labelKey: 'nav.photography' },
  { id: 'contact', num: '10', labelKey: 'nav.contact' },
];

interface NavContextValue {
  sections: SectionDef[];
  activeId: string;
  activeIndex: number;
  visited: ReadonlySet<string>;
  allVisited: boolean;
  travelTo: (id: string) => void;
  travelNext: () => void;
  travelPrev: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  atlasOpen: boolean;
  setAtlasOpen: (open: boolean) => void;
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
  labOpen: boolean;
  setLabOpen: (open: boolean) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used inside <NavProvider>');
  return ctx;
}

/* ── Scroll velocity store (module-level pub/sub, no React re-renders) ────
 *
 * Tracks |scroll delta| per frame, smoothed, normalized to a 0..1 "flow"
 * value. Subscribers (titles) map it onto their LiquidMetal speed. Quantized
 * so React state in subscribers only changes in steps of 0.05.
 */
type VelocityListener = (flow: number) => void;
const velocityListeners = new Set<VelocityListener>();
let velocityStarted = false;
let currentFlow = 0;

function startVelocityTracker() {
  if (velocityStarted || typeof window === 'undefined') return;
  velocityStarted = true;

  let lastY = window.scrollY;
  let lastT = performance.now();
  let smoothed = 0;
  let rafId: number | null = null;

  const tick = (now: number) => {
    const dt = Math.max(1, now - lastT);
    const dy = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    lastT = now;

    // px/ms → normalize: ~3 px/ms (fast flick) maps to 1.
    const instant = Math.min(1, dy / dt / 3);
    // Fast attack, slow release — the metal surges then settles.
    smoothed = instant > smoothed ? smoothed * 0.6 + instant * 0.4 : smoothed * 0.92;

    const quantized = Math.round(smoothed * 20) / 20;
    if (quantized !== currentFlow) {
      currentFlow = quantized;
      velocityListeners.forEach((fn) => fn(currentFlow));
    }

    // Idle out: stop the rAF loop entirely when settled, restart on scroll.
    if (smoothed < 0.005 && dy === 0) {
      smoothed = 0;
      if (currentFlow !== 0) {
        currentFlow = 0;
        velocityListeners.forEach((fn) => fn(0));
      }
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (rafId === null) {
        lastT = performance.now();
        lastY = window.scrollY;
        rafId = requestAnimationFrame(tick);
      }
    },
    { passive: true },
  );
}

/**
 * Scroll-reactive LiquidMetal speed: `base` at rest, up to `base + surge`
 * during fast scrolling. Returns a quantized value — cheap re-renders.
 */
export function useScrollVelocitySpeed(base: number, surge = 1.6): number {
  const [flow, setFlow] = useState(0);
  useEffect(() => {
    startVelocityTracker();
    velocityListeners.add(setFlow);
    return () => {
      velocityListeners.delete(setFlow);
    };
  }, []);
  return base + flow * surge;
}

/* ── Travel veil + directional glide ──────────────────────────────────────
 *
 * Fast travel reads as one continuous movement, but never actually scrolls
 * through the sections in between (flying past them would mount every
 * heavy layer mid-flight — dome gallery, reveals, shader titles — and
 * stutter the whole transition):
 *   - departure: the page drifts ~60px in the travel direction while the
 *     veil dims in (motion starts before the cover, as it should)
 *   - under peak cover: one instant jump, offset short of the target
 *   - arrival: a ~110px eased glide finishes the approach while the veil
 *     lifts, so you land still moving, in the light
 * The shimmer layer is persistent but frozen (speed=0 → no rAF) when idle.
 */
const VEIL_IN_MS = 200;
const VEIL_OUT_MS = 450;
const DEPART_PX = 60;
const ARRIVE_PX = 110;
const ARRIVE_MS = 520;

const easeInQuad = (t: number) => t * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/* ── Travel state (module-level) ──────────────────────────────────────────
 *
 * While gliding, the viewport rushes past every intermediate section; if
 * each one mounts its WebGL title layer mid-flight (canvas rasterization,
 * context creation, image processing), the main thread stalls and the whole
 * transition stutters. Expensive mounts subscribe here and hold off until
 * the glide lands.
 */
let travelingNow = false;
const travelEndListeners = new Set<() => void>();

export function isTravelingNow(): boolean {
  return travelingNow;
}

/** Fires once each time a fast travel lands. Returns an unsubscribe. */
export function onTravelEnd(fn: () => void): () => void {
  travelEndListeners.add(fn);
  return () => travelEndListeners.delete(fn);
}

function setTravelingNow(value: boolean) {
  travelingNow = value;
  if (!value) travelEndListeners.forEach((fn) => fn());
}

type VeilPhase = 'idle' | 'in' | 'out';

export function NavProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState('home');
  const [visited, setVisited] = useState<ReadonlySet<string>>(() => new Set(['home']));
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [veilPhase, setVeilPhase] = useState<VeilPhase>('idle');
  const travelingRef = useRef(false);
  const veilTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const glideRaf = useRef<number | null>(null);

  /* Active section tracking. Sections mount lazily (Suspense after 800ms),
     so a one-shot querySelector pass misses most of them — re-scan whenever
     nodes are added under #root until every section is observed. */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveId(id);
            setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
          }
        });
      },
      { threshold: 0.25 },
    );

    const observedIds = new Set<string>();
    const scan = () => {
      NAV_SECTIONS.forEach(({ id }) => {
        if (observedIds.has(id)) return;
        const el = document.getElementById(id);
        if (el) {
          io.observe(el);
          observedIds.add(id);
        }
      });
      if (observedIds.size === NAV_SECTIONS.length) mo.disconnect();
    };

    const mo = new MutationObserver(scan);
    const root = document.getElementById('root');
    if (root) mo.observe(root, { childList: true, subtree: true });
    scan();

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(
    () => () => {
      veilTimers.current.forEach(clearTimeout);
      if (glideRaf.current !== null) cancelAnimationFrame(glideRaf.current);
    },
    [],
  );

  const jumpNow = useCallback((id: string, behavior: ScrollBehavior) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
  }, []);

  const travelTo = useCallback(
    (id: string) => {
      setPaletteOpen(false);
      setAtlasOpen(false);
      setShortcutsOpen(false);

      const el = id === 'home' ? document.body : document.getElementById(id);
      if (!el) return;

      const targetTop = id === 'home' ? 0 : (el as HTMLElement).getBoundingClientRect().top + window.scrollY;
      const distance = Math.abs(targetTop - window.scrollY);

      // Short hops scroll smoothly; long jumps use the veil (a 15,000px
      // smooth scroll is nausea, an instant one is disorienting).
      if (reducedMotion || distance < window.innerHeight * 1.2) {
        jumpNow(id, reducedMotion ? 'auto' : 'smooth');
        setActiveId(id);
        return;
      }
      if (travelingRef.current) return;
      travelingRef.current = true;
      setTravelingNow(true);
      setVeilPhase('in');

      const dir = Math.sign(targetTop - window.scrollY) || 1;

      // behavior: 'instant' everywhere below overrides the global
      // `scroll-behavior: smooth` (index.css) — without it every frame's
      // write starts a new smooth animation and tweens never move.
      const scrollNow = (top: number) =>
        window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });

      const tween = (
        from: number,
        to: number,
        ms: number,
        ease: (t: number) => number,
      ) => {
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / ms);
          scrollNow(from + (to - from) * ease(p));
          if (p < 1) glideRaf.current = requestAnimationFrame(step);
          else glideRaf.current = null;
        };
        if (glideRaf.current !== null) cancelAnimationFrame(glideRaf.current);
        glideRaf.current = requestAnimationFrame(step);
      };

      // Departure: drift in the travel direction while the veil closes.
      const departFrom = window.scrollY;
      tween(departFrom, departFrom + dir * DEPART_PX, VEIL_IN_MS, easeInQuad);

      const finish = () => {
        setVeilPhase('idle');
        travelingRef.current = false;
        removeCancel();
      };

      // The user owns the scroll: wheel/touch input mid-travel stops the
      // tween where it is and lifts the veil immediately.
      const cancel = () => {
        if (glideRaf.current !== null) {
          cancelAnimationFrame(glideRaf.current);
          glideRaf.current = null;
        }
        setTravelingNow(false);
        veilTimers.current.forEach(clearTimeout);
        veilTimers.current = [];
        setVeilPhase('out');
        veilTimers.current.push(setTimeout(finish, VEIL_OUT_MS));
        removeCancel();
      };
      const removeCancel = () => {
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
      };
      window.addEventListener('wheel', cancel, { passive: true });
      window.addEventListener('touchstart', cancel, { passive: true });

      veilTimers.current.push(
        // Under peak cover: jump short of the target, then glide the rest
        // while the veil lifts. Only the destination section ever mounts —
        // the ±110px approach never crosses into neighbouring sections.
        setTimeout(() => {
          const approachFrom = targetTop - dir * ARRIVE_PX;
          scrollNow(approachFrom);
          setActiveId(id);
          setVisited((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
          // Let the destination mount under cover; release the gate next
          // frame so its title layer comes up while the veil lifts.
          requestAnimationFrame(() => setTravelingNow(false));
          setVeilPhase('out');
          tween(approachFrom, targetTop, ARRIVE_MS, easeOutCubic);
        }, VEIL_IN_MS + 40),
        setTimeout(finish, VEIL_IN_MS + 40 + Math.max(ARRIVE_MS, VEIL_OUT_MS)),
      );
    },
    [jumpNow, reducedMotion],
  );

  const activeIndex = Math.max(
    0,
    NAV_SECTIONS.findIndex((s) => s.id === activeId),
  );

  const travelNext = useCallback(() => {
    const next = NAV_SECTIONS[Math.min(NAV_SECTIONS.length - 1, activeIndex + 1)];
    travelTo(next.id);
  }, [activeIndex, travelTo]);

  const travelPrev = useCallback(() => {
    const prev = NAV_SECTIONS[Math.max(0, activeIndex - 1)];
    travelTo(prev.id);
  }, [activeIndex, travelTo]);

  const allVisited = visited.size >= NAV_SECTIONS.length;

  const value = useMemo<NavContextValue>(
    () => ({
      sections: NAV_SECTIONS,
      activeId,
      activeIndex,
      visited,
      allVisited,
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
    }),
    [activeId, activeIndex, visited, allVisited, travelTo, travelNext, travelPrev, paletteOpen, atlasOpen, shortcutsOpen, labOpen],
  );

  return (
    <NavContext.Provider value={value}>
      {children}
      <TravelVeil phase={veilPhase} />
    </NavContext.Provider>
  );
}

function TravelVeil({ phase }: { phase: VeilPhase }) {
  // Warm-mounted AFTER the load burst (loader, hero titles, background all
  // grab WebGL contexts at boot — the cap is ~16/page). A few idle seconds
  // later we claim ours, so the first travel still starts stall-free.
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setWarm(true), 4500);
    return () => clearTimeout(id);
  }, []);
  if (!warm && phase === 'idle') return null;

  const covering = phase === 'in';
  const transition = covering
    ? `opacity ${VEIL_IN_MS}ms cubic-bezier(0.4, 0, 0.6, 1)`
    : `opacity ${VEIL_OUT_MS}ms cubic-bezier(0.3, 0, 0.2, 1)`;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        // Never fully black — the glide underneath should read through it.
        opacity: covering ? 0.88 : 0,
        transition,
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #040404 100%)',
        willChange: 'opacity',
      }}
    >
      {/* Faint liquid sheen — texture, not spectacle. Runs only while the
          veil participates in a transition (speed=0 stops its rAF). */}
      <LiquidMetal
        shape="none"
        colorBack="#05050500"
        colorTint="#9a9a9a"
        softness={0.6}
        repetition={1.2}
        shiftRed={0.15}
        shiftBlue={0.15}
        distortion={0.08}
        contour={0.2}
        angle={90}
        fit="cover"
        scale={1}
        speed={phase === 'idle' ? 0 : 0.8}
        // It's a faint blurry sheen behind a 0.88-opacity dim — render it
        // small and cheap, never at device resolution.
        minPixelRatio={1}
        maxPixelCount={1280 * 720}
        style={{ width: '100%', height: '100%', opacity: 0.22 }}
      />
    </div>
  );
}
