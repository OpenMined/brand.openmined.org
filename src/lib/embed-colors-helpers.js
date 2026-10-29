/* The helpers v1's embeds/brand-colors.js exported, unchanged, appended to the generated
   /embeds/brand-colors.js (src/lib/serve.ts) so anything importing them still works.
   GRADIENTS is defined in the generated file above this code. */
/**
 * Resolve a gradient by name to its hex array. Unknown names fall back to the
 * brand spectrum so an embed never renders blank from a typo.
 */
export function resolveGradient(name) {
  if (name && GRADIENTS[name]) return GRADIENTS[name].slice();
  return GRADIENTS.spectrum.slice();
}

/** Parse "#rrggbb" → [r, g, b] in 0..1. */
export function hexToRGB(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/** [r,g,b] in 0..1 → "#rrggbb". */
export function rgbToHex(rgb) {
  return '#' + rgb.map((v) => {
    const n = Math.round(Math.max(0, Math.min(1, v)) * 255);
    return n.toString(16).padStart(2, '0');
  }).join('');
}

/**
 * Resample a hex gradient to exactly `n` evenly-spaced stops via linear RGB
 * interpolation. Used by embeds whose shader expects a fixed stop count
 * (e.g. the stream wants 6) so any named/custom gradient still fits.
 */
export function resample(hexes, n) {
  if (hexes.length === n) return hexes.slice();
  if (hexes.length === 0) return Array(n).fill('#ffffff');
  if (hexes.length === 1) return Array(n).fill(hexes[0]);
  const rgbs = hexes.map(hexToRGB);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (rgbs.length - 1);
    const lo = Math.floor(t);
    const hi = Math.min(lo + 1, rgbs.length - 1);
    const f = t - lo;
    out.push(rgbToHex([
      rgbs[lo][0] + (rgbs[hi][0] - rgbs[lo][0]) * f,
      rgbs[lo][1] + (rgbs[hi][1] - rgbs[lo][1]) * f,
      rgbs[lo][2] + (rgbs[hi][2] - rgbs[lo][2]) * f,
    ]));
  }
  return out;
}
