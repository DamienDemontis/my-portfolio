/**
 * Shared performance utilities for WebGL/canvas/animation components.
 *
 * Goals:
 *  - Pause rAF when the tab is hidden (saves 50-60% GPU)
 *  - Pause rAF when the component is off-screen (IntersectionObserver)
 *  - Cap DPR on mobile so high-retina fragments don't 9x the GPU cost
 *  - Detect low-end devices to optionally trim shader work
 *
 * Every utility is deliberately idempotent and cheap to call: no React state
 * unless strictly needed (to avoid triggering re-renders from perf hooks).
 */

import { useEffect, useRef, useState } from 'react';

/* ── Mobile / device class detection ─────────────────────────────────── */

function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  // Primary signal: coarse pointer (touch-first device). Works on iPad Safari too.
  if (window.matchMedia?.('(pointer: coarse)').matches) return true;
  // Fallback: UA string (less reliable, but catches desktop Chrome DevTools emulation).
  const ua = navigator.userAgent || '';
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(ua);
}

let _isMobile: boolean | null = null;
export function isMobile(): boolean {
  if (_isMobile === null) _isMobile = detectMobile();
  return _isMobile;
}

/** Best-effort low-end device detection. Budget phones / integrated GPUs. */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  return cores <= 4 || mem <= 2;
}

/**
 * Cap devicePixelRatio. Mobile high-DPR (3.0) means 9x fragments vs 1.0;
 * capping at 1.5 on mobile keeps the look crisp while cutting fragment cost
 * by ~40–60%. Desktop keeps the full DPR up to 2.0 for retina displays.
 */
export function getDPRCap(): number {
  if (typeof window === 'undefined') return 1;
  const raw = window.devicePixelRatio || 1;
  const cap = isMobile() ? 1.5 : 2;
  return Math.min(raw, cap);
}

/* ── Page-pause: tab-hidden aware ────────────────────────────────────── */

/**
 * Returns true when the page is active (visible + focused enough to animate).
 * Returns false when the tab is hidden. Components should pause their rAF
 * loops while false and resume when it flips back to true.
 *
 * Kept as a React state so components re-render on change — but the state
 * flips at most a few times per session (only on tab focus/blur), so cost
 * is negligible.
 */
export function usePageActive(): boolean {
  const [active, setActive] = useState(() => {
    if (typeof document === 'undefined') return true;
    return !document.hidden;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onChange = () => setActive(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return active;
}

/**
 * Imperative sibling to usePageActive — for rAF loops that must not trigger
 * React re-renders. Returns a ref-like object with a `.current` boolean you
 * can read inside your animation loop. The underlying event listener is
 * shared via a module-level subscription counter so you can call this from
 * many components cheaply.
 */
const pageActiveListeners = new Set<(active: boolean) => void>();
let pageActiveRefCount = 0;
let pageActiveHandlerBound = false;

function handleVisibilityChange() {
  const active = !document.hidden;
  pageActiveListeners.forEach((fn) => fn(active));
}

export function usePageActiveRef(): { readonly current: boolean } {
  const ref = useRef(typeof document === 'undefined' ? true : !document.hidden);

  useEffect(() => {
    const listener = (active: boolean) => {
      ref.current = active;
    };
    pageActiveListeners.add(listener);
    pageActiveRefCount += 1;
    if (!pageActiveHandlerBound && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      pageActiveHandlerBound = true;
    }

    return () => {
      pageActiveListeners.delete(listener);
      pageActiveRefCount -= 1;
      if (pageActiveRefCount === 0 && pageActiveHandlerBound && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        pageActiveHandlerBound = false;
      }
    };
  }, []);

  return ref;
}
