import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import './DomeGallery.css';

/* ── Types ── */
export interface DomeImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface DomeGalleryProps {
  images: DomeImage[];
  segments?: number;
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  dragDampening?: number;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  openedImageWidth?: string;
  openedImageHeight?: string;
  chromaRadius?: number;
  chromaDamping?: number;
}

interface ItemDef {
  src: string;
  alt: string;
  caption: string;
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
}

/* ── Helpers ── */
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

/** Seeded pseudo-random shuffle (Fisher-Yates) so tiles look random but stable */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildItems(pool: DomeImage[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '', caption: '' }));
  }

  // Fill slots, repeating images as needed, then shuffle to break pattern
  const filled = Array.from({ length: totalSlots }, (_, i) => pool[i % pool.length]);
  const shuffled = seededShuffle(filled, 42);

  // Avoid adjacent duplicates
  for (let i = 1; i < shuffled.length; i++) {
    if (shuffled[i].src === shuffled[i - 1].src) {
      for (let j = i + 1; j < shuffled.length; j++) {
        if (shuffled[j].src !== shuffled[i].src) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: shuffled[i].src,
    alt: shuffled[i].alt || '',
    caption: shuffled[i].caption || '',
  }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  return {
    rotateY: unit * (offsetX + (sizeX - 1) / 2),
    rotateX: unit * (offsetY - (sizeY - 1) / 2),
  };
}

/* ── Component ── */
export default function DomeGallery({
  images,
  segments = 35,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#000000',
  maxVerticalRotationDeg = 5,
  dragSensitivity = 20,
  enlargeTransitionMs = 300,
  dragDampening = 2,
  imageBorderRadius = '8px',
  openedImageBorderRadius = '8px',
  openedImageWidth: _openedImageWidth = '500px',
  openedImageHeight: _openedImageHeight = '400px',
  chromaRadius = 250,
  chromaDamping = 0.45,
}: DomeGalleryProps) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const focusedElRef = useRef<HTMLElement | null>(null);
  const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef<number | null>(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const scrollLockedRef = useRef(false);

  // Chroma mouse tracking refs
  const chromaSetX = useRef<((v: number | string) => void) | null>(null);
  const chromaSetY = useRef<((v: number | string) => void) | null>(null);
  const chromaPos = useRef({ x: 0, y: 0 });

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add('dome-scroll-lock');
  }, []);

  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.classList.remove('dome-scroll-lock');
  }, []);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  // ── Chroma: init gsap quickSetters ──
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    chromaSetX.current = gsap.quickSetter(el, '--chroma-x', 'px') as (v: number | string) => void;
    chromaSetY.current = gsap.quickSetter(el, '--chroma-y', 'px') as (v: number | string) => void;
    const { width, height } = el.getBoundingClientRect();
    chromaPos.current = { x: width / 2, y: height / 2 };
    chromaSetX.current(chromaPos.current.x);
    chromaSetY.current(chromaPos.current.y);
  }, []);

  // Reuse a single tween ref to avoid creating/GCing a new gsap.to() on every pointer move
  const chromaTweenRef = useRef<gsap.core.Tween | null>(null);

  const chromaMoveTo = useCallback((x: number, y: number) => {
    if (chromaTweenRef.current) {
      chromaTweenRef.current.kill();
    }
    chromaTweenRef.current = gsap.to(chromaPos.current, {
      x, y,
      duration: chromaDamping,
      ease: 'power3.out',
      onUpdate: () => {
        chromaSetX.current?.(chromaPos.current.x);
        chromaSetY.current?.(chromaPos.current.y);
      },
    });
  }, [chromaDamping]);

  const handleChromaMove = useCallback((e: React.PointerEvent) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    chromaMoveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  }, [chromaMoveTo]);

  const handleChromaLeave = useCallback(() => {
    gsap.to(fadeRef.current, { opacity: 1, duration: 0.6, overwrite: true });
  }, []);

  // ── Resize observer ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h), maxDim = Math.max(w, h), aspect = w / h;
      let basis: number;
      switch (fitBasis) {
        case 'min': basis = minDim; break;
        case 'max': basis = maxDim; break;
        case 'width': basis = w; break;
        case 'height': basis = h; break;
        default: basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      radius = Math.min(radius, h * 1.35);
      radius = clamp(radius, minRadius, maxRadius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--chroma-r', `${chromaRadius}px`);
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, imageBorderRadius, openedImageBorderRadius, chromaRadius]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  // ── Inertia ──
  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback((vx: number, vy: number) => {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80;
    let vY = clamp(vy, -MAX_V, MAX_V) * 80;
    let frames = 0;
    const d = clamp(dragDampening ?? 0.6, 0, 1);
    const frictionMul = 0.94 + 0.055 * d;
    const stopThreshold = 0.015 - 0.01 * d;
    const maxFrames = Math.round(90 + 270 * d);

    const step = () => {
      vX *= frictionMul;
      vY *= frictionMul;
      if ((Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) || ++frames > maxFrames) {
        inertiaRAF.current = null;
        return;
      }
      const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
      rotationRef.current = { x: nextX, y: nextY };
      applyTransform(nextX, nextY);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia();
    inertiaRAF.current = requestAnimationFrame(step);
  }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

  // ── Drag gesture ──
  useGesture({
    onDragStart: ({ event }) => {
      if (focusedElRef.current) return;
      stopInertia();
      const evt = event as PointerEvent;
      draggingRef.current = true;
      movedRef.current = false;
      startRotRef.current = { ...rotationRef.current };
      startPosRef.current = { x: evt.clientX, y: evt.clientY };
    },
    onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
      if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
      const evt = event as PointerEvent;
      const dxTotal = evt.clientX - startPosRef.current.x;
      const dyTotal = evt.clientY - startPosRef.current.y;

      if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) {
        movedRef.current = true;
      }

      const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
      if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
      }

      if (last) {
        draggingRef.current = false;
        let [vMagX, vMagY] = velocity;
        const [dirX, dirY] = direction;
        let vx = vMagX * dirX;
        let vy = vMagY * dirY;
        if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
          vx = clamp((movement[0] / dragSensitivity) * 0.02, -1.2, 1.2);
          vy = clamp((movement[1] / dragSensitivity) * 0.02, -1.2, 1.2);
        }
        if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
        if (movedRef.current) lastDragEndAt.current = performance.now();
        movedRef.current = false;
      }
    },
  }, { target: mainRef, eventOptions: { passive: true } });

  // ── Open / enlarge ──
  const openItemFromElement = useCallback((el: HTMLElement) => {
    if (openingRef.current) return;
    openingRef.current = true;
    openStartedAtRef.current = performance.now();
    lockScroll();

    const parent = el.parentElement as HTMLElement;
    focusedElRef.current = el;
    el.setAttribute('data-focused', 'true');
    parent.setAttribute('data-focusing', '');

    const offsetX = getDataNumber(parent, 'offsetX', 0);
    const offsetY = getDataNumber(parent, 'offsetY', 0);
    const sizeX = getDataNumber(parent, 'sizeX', 2);
    const sizeY = getDataNumber(parent, 'sizeY', 2);
    const caption = parent.dataset.caption || '';
    const alt = parent.dataset.alt || '';

    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
    const parentY = normalizeAngle(parentRot.rotateY);
    const globalY = normalizeAngle(rotationRef.current.y);
    let rotY = -(parentY + globalY) % 360;
    if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - rotationRef.current.x;
    parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
    parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

    const refDiv = document.createElement('div');
    refDiv.className = 'dome-item__image dome-item__image--reference';
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv);
    void refDiv.offsetHeight;

    const tileR = refDiv.getBoundingClientRect();
    const mainR = mainRef.current?.getBoundingClientRect();
    const frameR = frameRef.current?.getBoundingClientRect();

    if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
      openingRef.current = false;
      focusedElRef.current = null;
      parent.removeChild(refDiv);
      unlockScroll();
      return;
    }

    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    el.style.visibility = 'hidden';
    el.style.zIndex = '0';

    const rawSrc = parent.dataset.src || (el.querySelector('img') as HTMLImageElement)?.src || '';

    // Load image to get natural aspect ratio, then size overlay to fit
    const img = new Image();
    img.src = rawSrc;

    const proceed = () => {
      // Calculate target size based on image's natural aspect ratio
      const natW = img.naturalWidth || 4;
      const natH = img.naturalHeight || 3;
      const imgAspect = natW / natH;
      const maxW = mainR.width * 0.85;
      const maxH = mainR.height * 0.8;
      let targetW: number, targetH: number;
      if (imgAspect > maxW / maxH) {
        targetW = maxW;
        targetH = maxW / imgAspect;
      } else {
        targetH = maxH;
        targetW = maxH * imgAspect;
      }

      const overlay = document.createElement('div');
      overlay.className = 'dome-enlarge';
      overlay.style.position = 'absolute';
      overlay.style.left = frameR.left - mainR.left + 'px';
      overlay.style.top = frameR.top - mainR.top + 'px';
      overlay.style.width = frameR.width + 'px';
      overlay.style.height = frameR.height + 'px';
      overlay.style.opacity = '0';
      overlay.style.zIndex = '30';
      overlay.style.willChange = 'transform, opacity';
      overlay.style.transformOrigin = 'top left';
      overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;

      const imgEl = document.createElement('img');
      imgEl.src = rawSrc;
      overlay.appendChild(imgEl);

      // Caption overlay
      if (caption || alt) {
        const captionEl = document.createElement('div');
        captionEl.className = 'dome-enlarge-caption';
        if (caption) {
          const titleEl = document.createElement('p');
          titleEl.className = 'dome-caption-title';
          titleEl.textContent = caption;
          captionEl.appendChild(titleEl);
        }
        if (alt) {
          const locEl = document.createElement('p');
          locEl.className = 'dome-caption-location';
          locEl.textContent = alt;
          captionEl.appendChild(locEl);
        }
        overlay.appendChild(captionEl);
      }

      viewerRef.current!.appendChild(overlay);

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;
      const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;
      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

      setTimeout(() => {
        if (!overlay.parentElement) return;
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
        rootRef.current?.setAttribute('data-enlarging', 'true');
      }, 16);

      // After initial animation, resize to fit image's natural aspect ratio
      const onFirstEnd = (ev: TransitionEvent) => {
        if (ev.propertyName !== 'transform') return;
        overlay.removeEventListener('transitionend', onFirstEnd);
        const prevTransition = overlay.style.transition;
        overlay.style.transition = 'none';
        overlay.style.width = `${targetW}px`;
        overlay.style.height = `${targetH}px`;
        void overlay.offsetWidth;
        overlay.style.width = frameR.width + 'px';
        overlay.style.height = frameR.height + 'px';
        void overlay.offsetWidth;
        overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`;
        const centeredLeft = (mainR.width - targetW) / 2;
        const centeredTop = (mainR.height - targetH) / 2;
        requestAnimationFrame(() => {
          overlay.style.left = `${centeredLeft}px`;
          overlay.style.top = `${centeredTop}px`;
          overlay.style.width = `${targetW}px`;
          overlay.style.height = `${targetH}px`;
        });
        const cleanupSecond = () => {
          overlay.removeEventListener('transitionend', cleanupSecond);
          overlay.style.transition = prevTransition;
        };
        overlay.addEventListener('transitionend', cleanupSecond, { once: true });
      };
      overlay.addEventListener('transitionend', onFirstEnd);
    };

    // If already cached, proceed immediately; otherwise wait for load
    if (img.complete && img.naturalWidth > 0) {
      proceed();
    } else {
      img.onload = proceed;
      img.onerror = proceed; // fallback with default 4:3
    }
  }, [segments, enlargeTransitionMs, lockScroll, unlockScroll]);

  const onTileClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingRef.current || movedRef.current) return;
    if (performance.now() - lastDragEndAt.current < 80) return;
    if (openingRef.current) return;
    openItemFromElement(e.currentTarget);
  }, [openItemFromElement]);

  const onTilePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') return;
    if (draggingRef.current || movedRef.current) return;
    if (performance.now() - lastDragEndAt.current < 80) return;
    if (openingRef.current) return;
    openItemFromElement(e.currentTarget);
  }, [openItemFromElement]);

  // ── Close handler ──
  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement as HTMLElement;
      const overlay = viewerRef.current?.querySelector('.dome-enlarge') as HTMLElement | null;
      if (!overlay) return;

      const refDiv = parent.querySelector('.dome-item__image--reference') as HTMLElement | null;
      const originalPos = originalTilePositionRef.current;

      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.removeAttribute('data-focusing');
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = '0';
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        unlockScroll();
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current!.getBoundingClientRect();

      const origRel = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height,
      };
      const overlayRel = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height,
      };

      const anim = document.createElement('div');
      anim.className = 'dome-enlarge-closing';
      anim.style.cssText = `
        position: absolute;
        left: ${overlayRel.left}px; top: ${overlayRel.top}px;
        width: ${overlayRel.width}px; height: ${overlayRel.height}px;
        z-index: 9999; border-radius: var(--enlarge-radius, 32px);
        overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.35);
        transition: all ${enlargeTransitionMs}ms ease-out;
        pointer-events: none; margin: 0; transform: none;
      `;
      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const cloned = originalImg.cloneNode() as HTMLImageElement;
        cloned.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        anim.appendChild(cloned);
      }
      overlay.remove();
      rootRef.current!.appendChild(anim);
      void anim.getBoundingClientRect();

      requestAnimationFrame(() => {
        anim.style.left = origRel.left + 'px';
        anim.style.top = origRel.top + 'px';
        anim.style.width = origRel.width + 'px';
        anim.style.height = origRel.height + 'px';
        anim.style.opacity = '0';
      });

      const cleanup = () => {
        anim.remove();
        originalTilePositionRef.current = null;
        if (refDiv) refDiv.remove();
        parent.removeAttribute('data-focusing');
        parent.style.transition = 'none';
        el.style.transition = 'none';
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');

        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = '0';
          focusedElRef.current = null;
          rootRef.current?.removeAttribute('data-enlarging');
          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                openingRef.current = false;
                if (!draggingRef.current && rootRef.current?.getAttribute('data-enlarging') !== 'true') {
                  document.body.classList.remove('dome-scroll-lock');
                }
              }, 300);
            });
          });
        });
      };
      anim.addEventListener('transitionend', cleanup, { once: true });
    };

    scrim.addEventListener('click', close);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      scrim.removeEventListener('click', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  useEffect(() => {
    return () => { document.body.classList.remove('dome-scroll-lock'); };
  }, []);

  return (
    <div
      ref={rootRef}
      className="dome-root"
      style={{
        ['--segments-x' as string]: segments,
        ['--segments-y' as string]: segments,
      } as React.CSSProperties}
      onPointerMove={handleChromaMove}
      onPointerLeave={handleChromaLeave}
    >
      <div ref={mainRef} className="dome-main">
        <div className="dome-stage">
          <div ref={sphereRef} className="dome-sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="dome-item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                data-caption={it.caption}
                data-alt={it.alt}
                style={{
                  ['--offset-x' as string]: it.x,
                  ['--offset-y' as string]: it.y,
                  ['--item-size-x' as string]: it.sizeX,
                  ['--item-size-y' as string]: it.sizeY,
                } as React.CSSProperties}
              >
                <div
                  className="dome-item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.caption || it.alt || t('a11y.openImage')}
                  onClick={onTileClick}
                  onPointerUp={onTilePointerUp}
                >
                  <img src={it.src} draggable={false} alt={it.alt} loading="lazy" decoding="async" width={300} height={200} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dome-overlay" />
        <div className="dome-overlay dome-overlay--blur" />

        {/* Chroma color reveal layers */}
        <div className="dome-chroma-overlay" />
        <div ref={fadeRef} className="dome-chroma-fade" />

        <div className="dome-edge-fade dome-edge-fade--top" />
        <div className="dome-edge-fade dome-edge-fade--bottom" />

        <div className="dome-viewer" ref={viewerRef}>
          <div ref={scrimRef} className="dome-scrim" />
          <div ref={frameRef} className="dome-frame" />
        </div>
      </div>
    </div>
  );
}
