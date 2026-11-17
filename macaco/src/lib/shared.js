// Petits utilitaires partages par plusieurs modules.
const li = 35;
const ci = 75;
const STAGE_HEIGHT_SVH = 100 + li + ci;
function hexToRgbTriplet(e) {
  const i = e.replace("#", "");
  return [parseInt(i.slice(0, 2), 16) / 255, parseInt(i.slice(2, 4), 16) / 255, parseInt(i.slice(4, 6), 16) / 255];
}
function hexToRgbScaled(e, i = 0.3) {
  return hexToRgbTriplet(e).map(a => a * i);
}
function envelope(e, i, a, o) {
  if (e <= i || e >= a) return 0;
  const s = (l, h, c) => {
      const m = Math.min(1, Math.max(0, (c - l) / Math.max(1, h - l)));
      return m * m * (3 - 2 * m);
    },
    n = s(i, i + o, e) * (1 - s(a - o, a, e)),
    d = 0.4 + 0.6 * Math.min(1, (e - i) / Math.max(1, a - i));
  return n * d;
}
export { STAGE_HEIGHT_SVH, ci, envelope, hexToRgbScaled, li };
