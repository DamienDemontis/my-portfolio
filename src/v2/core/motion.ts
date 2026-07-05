/** Unified motion tokens — every spring/ease on the site comes from here.
 *  snappy: docks, buttons, small UI. soft: cards, panels. reveal: section
 *  entrances (matches the historical [0.22, 1, 0.36, 1] curve). */
export const spring = {
  snappy: { type: 'spring', stiffness: 400, damping: 25 } as const,
  soft: { type: 'spring', stiffness: 220, damping: 24, mass: 0.6 } as const,
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 } as const,
};

export const ease = {
  reveal: [0.22, 1, 0.36, 1] as const,
  heavy: [0.7, 0, 0.3, 1] as const,
  standard: [0.4, 0, 0.2, 1] as const,
};

export const duration = {
  fast: 0.18,
  base: 0.3,
  slow: 0.6,
};
