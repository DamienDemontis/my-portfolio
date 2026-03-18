import { useEffect, useRef, type ReactNode } from 'react';
import './ScrollStack.css';

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  /** Gap between cards in normal document flow (px) */
  itemDistance?: number;
  /** Scale reduction per depth level */
  itemScale?: number;
  /** Vertical offset between stacked sticky cards (px) */
  itemStackDistance?: number;
  /** Where cards pin — percentage of viewport height */
  stackPosition?: string;
  /** Minimum scale when a card is fully behind */
  baseScale?: number;
  /** Rotation (deg) per depth level when scaled */
  rotationAmount?: number;
  /** Blur (px) per depth level when behind the top card */
  blurAmount?: number;
}

export function ScrollStackItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>;
}

/**
 * ScrollStack — uses CSS `position: sticky` for pinning (native, buttery smooth)
 * and a lightweight scroll handler for scale/rotation/blur effects only.
 *
 * Zero position caching, zero timers, zero ResizeObservers.
 * The browser handles all positioning; JS only does cosmetic transforms.
 */
export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.04,
  itemStackDistance = 25,
  stackPosition = '10%',
  baseScale = 0.88,
  rotationAmount = 0,
  blurAmount = 0,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const lastBlurs = useRef<number[]>([]);

  const stackPct = parseFloat(stackPosition) / 100;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    if (!cards.length) return;

    // Initialize blur tracking
    lastBlurs.current = cards.map(() => -1);

    // Set sticky tops: each card pins slightly lower than the previous
    cards.forEach((card, i) => {
      card.style.position = 'sticky';
      card.style.top = `calc(${stackPosition} + ${i * itemStackDistance}px)`;
      card.style.zIndex = String(i);
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
    });

    // Bottom spacer: just enough so the last card can reach its sticky top.
    // The container needs: totalContentHeight + spacer >= lastCardNaturalOffset + viewport
    // Solving for spacer: spacer = lastCardNaturalOffset + viewport - totalContentHeight
    // Simplified: spacer = sum of all cards above the last (heights + margins)
    //             minus the viewport space above the last card's sticky top.
    const updateSpacer = () => {
      if (!spacerRef.current || cards.length < 2) {
        if (spacerRef.current) spacerRef.current.style.height = '0px';
        return;
      }
      const vh = window.innerHeight;
      const lastStickyTop = vh * stackPct + (cards.length - 1) * itemStackDistance;
      // Sum of all cards' heights + margins above the last card
      let contentAboveLast = 0;
      for (let i = 0; i < cards.length - 1; i++) {
        contentAboveLast += cards[i].offsetHeight + itemDistance;
      }
      // We need: contentAboveLast - lastStickyTop of scroll room beyond the natural content
      const lastCardHeight = cards[cards.length - 1].offsetHeight;
      const extraHeight = Math.max(0, contentAboveLast - lastStickyTop - lastCardHeight);
      spacerRef.current.style.height = `${extraHeight}px`;
    };
    updateSpacer();

    // Recalculate spacer on resize (card heights may change)
    window.addEventListener('resize', updateSpacer);
    const cleanupResize = () => window.removeEventListener('resize', updateSpacer);

    const onScroll = () => {
      const vh = window.innerHeight;

      // ── READ PHASE: batch all rect reads before any writes ──
      const tops: number[] = [];
      for (let i = 0; i < cards.length; i++) {
        tops[i] = cards[i].getBoundingClientRect().top;
      }

      // ── WRITE PHASE: pure arithmetic → style writes ──
      for (let i = 0; i < cards.length; i++) {
        // Progress: 0 = card is free / just pinned, 1 = fully covered by cards above
        // A card is "covered" when the card AFTER it reaches its own sticky point.
        let progress = 0;
        if (i < cards.length - 1) {
          const nextStickyTop = vh * stackPct + (i + 1) * itemStackDistance;
          const nextTop = tops[i + 1];

          // next card travels from bottom of viewport to its sticky point
          const travelRange = vh - nextStickyTop;
          if (travelRange > 0) {
            const distanceLeft = nextTop - nextStickyTop;
            progress = 1 - Math.max(0, Math.min(1, distanceLeft / travelRange));
          }
        }

        // Scale: shrinks as more cards stack on top
        const depthScale = baseScale + (cards.length - 1 - i) * itemScale;
        const scale = 1 - progress * (1 - depthScale);

        // Rotation
        const rotation = rotationAmount ? progress * rotationAmount * (cards.length - 1 - i) : 0;

        cards[i].style.transform = progress > 0
          ? `scale(${scale}) rotate(${rotation}deg)`
          : 'none';

        // Blur — only write when the value actually changes
        if (blurAmount) {
          // Count how many cards are stacked above this one
          let cardsAbove = 0;
          for (let j = i + 1; j < cards.length; j++) {
            const jSticky = vh * stackPct + j * itemStackDistance;
            if (tops[j] <= jSticky + 1) cardsAbove++;
          }
          const blur = cardsAbove > 0 ? cardsAbove * blurAmount : 0;
          if (blur !== lastBlurs.current[i]) {
            cards[i].style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
            lastBlurs.current[i] = blur;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial render

    return () => {
      window.removeEventListener('scroll', onScroll);
      cleanupResize();
      cards.forEach(card => {
        card.style.position = '';
        card.style.top = '';
        card.style.zIndex = '';
        card.style.marginBottom = '';
        card.style.transform = '';
        card.style.filter = '';
      });
    };
  }, [stackPct, itemDistance, itemScale, itemStackDistance, baseScale, rotationAmount, blurAmount]);

  return (
    <div ref={containerRef} className={`scroll-stack ${className}`.trim()}>
      {children}
      <div ref={spacerRef} aria-hidden="true" />
    </div>
  );
}
