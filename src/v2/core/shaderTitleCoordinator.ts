/**
 * Live-context coordinator for MetalShaderTitle.
 *
 * Why this exists:
 *   Every section has a MetalShaderTitle. Without coordination, all titles that
 *   are within 200px of the viewport (rootMargin) mount a live WebGL context
 *   running the MetallicSurface fragment shader. During fast scrolling that
 *   easily means 4–6 expensive shaders running at once — the worst case is the
 *   middle of the page where three sections fit on a tall display.
 *
 *   On integrated GPUs this saturates the fragment pipeline and is the primary
 *   cause of saccades during scroll.
 *
 * The contract:
 *   - Every MetalShaderTitle that becomes visible (or near-visible) calls
 *     `requestSlot(id, priority)`. Priority = -distance from viewport center
 *     (closer = higher priority).
 *   - The coordinator maintains a small ordered set of slots (default 3 on
 *     desktop, 2 on mobile / low-end) and notifies each title whether it
 *     currently holds a slot via subscribe().
 *   - When a title loses its slot, it stops uploading uniforms + drawing.
 *     The last frame stays on-screen because the canvas backing store is
 *     preserved. Because the shader animates slowly (wobble in seconds, not
 *     ms), the frozen frame is visually indistinguishable from an animated one
 *     while the user is scrolling past.
 *   - When the user scrolls back, priorities re-shuffle and the title resumes
 *     drawing within a frame — no visible pop because we never destroyed
 *     the GL state.
 *
 *   This is fundamentally a budget: we trade animation continuity on out-of-
 *   focus titles for headroom on in-focus titles + the rest of the page.
 */

import { useEffect, useState } from 'react';
import { isLowEndDevice, isMobile } from './perf';

let _maxSlots: number | null = null;
function maxSlots(): number {
  if (_maxSlots !== null) return _maxSlots;
  // Conservative on integrated/mobile, generous on desktop.
  if (isLowEndDevice()) _maxSlots = 2;
  else if (isMobile()) _maxSlots = 2;
  else _maxSlots = 3;
  return _maxSlots;
}

interface Slot {
  id: number;
  priority: number; // higher = more important = nearer the viewport center
}

const _requests = new Map<number, Slot>();
const _active = new Set<number>();
const _listeners = new Map<number, (active: boolean) => void>();
let _nextId = 1;

function _recompute() {
  // Sort by priority desc, take top N.
  const all = Array.from(_requests.values()).sort((a, b) => b.priority - a.priority);
  const top = new Set(all.slice(0, maxSlots()).map((s) => s.id));

  // Activate newly admitted.
  for (const id of top) {
    if (!_active.has(id)) {
      _active.add(id);
      _listeners.get(id)?.(true);
    }
  }
  // Deactivate evicted.
  for (const id of Array.from(_active)) {
    if (!top.has(id)) {
      _active.delete(id);
      _listeners.get(id)?.(false);
    }
  }
}

export function registerSlot(): number {
  const id = _nextId++;
  // Start unrequested. Caller must call updatePriority() to enter the queue.
  return id;
}

export function unregisterSlot(id: number): void {
  _requests.delete(id);
  if (_active.delete(id)) {
    // No need to notify — caller has unmounted.
  }
  _listeners.delete(id);
  _recompute();
}

/**
 * Set or update the slot's priority. Pass `null` to withdraw the request
 * (e.g. title is far off-screen).
 */
export function updatePriority(id: number, priority: number | null): void {
  if (priority === null) {
    if (_requests.delete(id)) {
      if (_active.delete(id)) _listeners.get(id)?.(false);
      _recompute();
    }
    return;
  }
  const existing = _requests.get(id);
  if (existing && existing.priority === priority) return;
  _requests.set(id, { id, priority });
  _recompute();
}

export function subscribeSlot(id: number, fn: (active: boolean) => void): () => void {
  _listeners.set(id, fn);
  return () => { _listeners.delete(id); };
}

/**
 * React hook for MetalShaderTitle.
 *
 *   const isLive = useShaderTitleSlot(distanceToViewportCenter);
 *
 * Pass `Infinity` to withdraw (e.g. when fully off-screen). The hook returns
 * `true` when this title holds one of the live slots and should keep drawing,
 * `false` otherwise — in which case the component should pause uniform
 * uploads + draw calls but KEEP the canvas alive (so the last frame stays
 * painted).
 */
export function useShaderTitleSlot(distanceToCenter: number): boolean {
  const [id] = useState(() => registerSlot());
  const [active, setActive] = useState(false);

  useEffect(() => {
    const unsub = subscribeSlot(id, setActive);
    return () => {
      unsub();
      unregisterSlot(id);
    };
  }, [id]);

  useEffect(() => {
    if (!Number.isFinite(distanceToCenter)) {
      updatePriority(id, null);
    } else {
      // Negate distance so closer = higher priority. Round to avoid jitter
      // (a 1-pixel scroll shouldn't churn the queue).
      updatePriority(id, -Math.round(distanceToCenter / 16));
    }
  }, [id, distanceToCenter]);

  return active;
}
