/**
 * OMDS — brand colors for canvas / WebGL (the JS-side source)
 * ════════════════════════════════════════════════════════════════════
 * WebGL shaders need numeric color values, so they can't read var(--…)
 * tokens directly. This module is the single JS-side source of brand
 * color for every embed — import from here, never hand-type hex into a
 * shader.
 *
 * Values mirror the palette + --gradient-* tokens in src/tokens/tokens.css.
 * TODO (DTCG follow-up): generate BOTH this file and tokens.css from one
 * tokens.json (Style Dictionary) so the CSS and JS color sources can't
 * drift. Until then this is the canonical JS copy — change it in lockstep
 * with tokens.css.
 * ════════════════════════════════════════════════════════════════════
 */

// Brand hues at their -500 step (the spectrum swatches), plus red-600 which
// the stream gradient opens on. Names match the token families in tokens.css.
export const PALETTE = {
  gold:    '#f8c073',
  orange:  '#f79763',
  red:     '#cc677b',
  red600:  '#b73d56',
  violet:  '#937098',
  blue:    '#6976ae',
  teal:    '#52a8c5',
  green:   '#53bea9',
  lime:    '#96d195',
  yellow:  '#f2d98c',
};

const P = PALETTE;

// Named gradients, each an ordered array of hex stops. `spectrum` is the full
// brand arc (the diamond default); `stream` is the curated 6-stop ribbon. The
// adjacent pairs mirror the --gradient-* tokens for one-to-one parity.
export const GRADIENTS = {
  spectrum:      [P.gold, P.orange, P.red, P.violet, P.blue, P.teal, P.green, P.lime, P.yellow],
  stream:        [P.red600, P.gold, P.violet, P.blue, P.teal, P.green],
  'gold-orange':  [P.gold, P.orange],
  'orange-red':   [P.orange, P.red],
  'red-violet':   [P.red, P.blue],   // token stop is red→blue (#CC677B→#6976AE)
  'violet-blue':  [P.blue, P.teal],  // token stop is blue→teal (#6976AE→#52A8C5)
  'teal-green':   [P.teal, P.green],
  'green-lime':   [P.green, P.lime],
  'lime-yellow':  [P.lime, P.yellow],
  warm:          [P.gold, P.orange, P.red],
  cool:          [P.blue, P.teal, P.green],
};

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
