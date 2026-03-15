import { useLayoutEffect, useEffect, useRef, useCallback, type ReactNode } from 'react';
import './ScrollStack.css';

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

export function ScrollStackItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>
  );
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardOriginalTopsRef = useRef<number[]>([]);
  const endOriginalTopRef = useRef(0);
  const positionsCachedRef = useRef(false);
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>());

  // Store config in refs so the scroll handler always reads latest values
  // without needing to recreate the callback
  const configRef = useRef({
    itemScale, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, rotationAmount, blurAmount, useWindowScroll,
  });
  configRef.current = {
    itemScale, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, rotationAmount, blurAmount, useWindowScroll,
  };
  const onStackCompleteRef = useRef(onStackComplete);
  onStackCompleteRef.current = onStackComplete;

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(String(value));
  }, []);

  // Stable callback that reads from refs — never changes identity
  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length || !positionsCachedRef.current) return;

    const cfg = configRef.current;
    const scrollTop = cfg.useWindowScroll ? window.scrollY : (scrollerRef.current?.scrollTop ?? 0);
    const containerHeight = cfg.useWindowScroll ? window.innerHeight : (scrollerRef.current?.clientHeight ?? 0);

    const stackPositionPx = parsePercentage(cfg.stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(cfg.scaleEndPosition, containerHeight);
    const endElementTop = endOriginalTopRef.current;

    cards.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardOriginalTopsRef.current[i];
      if (cardTop === undefined) return;

      const triggerStart = cardTop - stackPositionPx - cfg.itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      let scaleProgress = 0;
      if (scrollTop >= triggerEnd) scaleProgress = 1;
      else if (scrollTop > triggerStart) scaleProgress = (scrollTop - triggerStart) / (triggerEnd - triggerStart);

      const targetScale = cfg.baseScale + i * cfg.itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = cfg.rotationAmount ? i * cfg.rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (cfg.blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cards.length; j++) {
          const jTop = cardOriginalTopsRef.current[j];
          const jTriggerStart = jTop - stackPositionPx - cfg.itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) {
          blur = Math.max(0, (topCardIndex - i) * cfg.blurAmount);
        }
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + cfg.itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + cfg.itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const last = lastTransformsRef.current.get(i);
      const changed =
        !last ||
        Math.abs(last.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(last.scale - newTransform.scale) > 0.001 ||
        Math.abs(last.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(last.blur - newTransform.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        card.style.filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';
        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cards.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackCompleteRef.current?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [parsePercentage]);

  // Cache positions ONCE on mount — no dependency on updateCardTransforms
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;

    // Apply margins and styles (no transform reset needed — cards start clean)
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
    });

    // Force reflow
    void scroller.offsetHeight;

    // Cache original positions
    cardOriginalTopsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return rect.top + window.scrollY;
    });

    const endEl = scroller.querySelector('.scroll-stack-end');
    if (endEl) {
      const rect = endEl.getBoundingClientRect();
      endOriginalTopRef.current = rect.top + window.scrollY;
    }

    positionsCachedRef.current = true;
    updateCardTransforms();

    return () => {
      cardsRef.current = [];
      cardOriginalTopsRef.current = [];
      positionsCachedRef.current = false;
      lastTransformsRef.current.clear();
      stackCompletedRef.current = false;
    };
    // Only re-run if children change (itemDistance is stable across renders)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemDistance]);

  // Scroll listener
  useEffect(() => {
    const target = useWindowScroll ? window : scrollerRef.current;
    if (!target) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCardTransforms);
    };

    target.addEventListener('scroll', onScroll, { passive: true });
    updateCardTransforms();

    return () => {
      target.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [useWindowScroll, updateCardTransforms]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'scroll-stack-window' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
