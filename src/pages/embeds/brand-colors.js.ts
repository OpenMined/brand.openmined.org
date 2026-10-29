/**
 * /embeds/brand-colors.js — the colors the <om-*> embeds draw with, generated from the
 * v2 token build (src/tokens/v2/tokens.light.json) since 2026-10-30. Same exports as
 * v1's hand-kept file (PALETTE, GRADIENTS, resolveGradient, hexToRGB, rgbToHex,
 * resample), so the embeds and anything importing it work unchanged; the values are
 * v2's. Graphics use fixed steps, so these are the light mode's; a page that wants the
 * mode's own colors passes them in (data-follow, the examples' FOLLOW_JS).
 */
import LIGHT from '../../tokens/v2/tokens.light.json';
import { STAMP, respond } from '../../lib/serve';

const T = LIGHT as Record<string, { resolved: string }>;
const v = (n: string) => { const e = T[`--${n}`]; if (!e) throw new Error(`brand-colors: no token --${n}`); return e.resolved; };
const list = (n: string) => [...T[`--gradient-${n}`].resolved.matchAll(/#[0-9a-f]{6}/gi)].map(m => m[0]);

const FNS = '/**\n * Resolve a gradient by name to its hex array. Unknown names fall back to the\n * brand spectrum so an embed never renders blank from a typo.\n */\nexport function resolveGradient(name) {\n  if (name && GRADIENTS[name]) return GRADIENTS[name].slice();\n  return GRADIENTS.spectrum.slice();\n}\n\n/** Parse "#rrggbb" → [r, g, b] in 0..1. */\nexport function hexToRGB(hex) {\n  const h = hex.replace(\'#\', \'\');\n  return [\n    parseInt(h.slice(0, 2), 16) / 255,\n    parseInt(h.slice(2, 4), 16) / 255,\n    parseInt(h.slice(4, 6), 16) / 255,\n  ];\n}\n\n/** [r,g,b] in 0..1 → "#rrggbb". */\nexport function rgbToHex(rgb) {\n  return \'#\' + rgb.map((v) => {\n    const n = Math.round(Math.max(0, Math.min(1, v)) * 255);\n    return n.toString(16).padStart(2, \'0\');\n  }).join(\'\');\n}\n\n/**\n * Resample a hex gradient to exactly `n` evenly-spaced stops via linear RGB\n * interpolation. Used by embeds whose shader expects a fixed stop count\n * (e.g. the stream wants 6) so any named/custom gradient still fits.\n */\nexport function resample(hexes, n) {\n  if (hexes.length === n) return hexes.slice();\n  if (hexes.length === 0) return Array(n).fill(\'#ffffff\');\n  if (hexes.length === 1) return Array(n).fill(hexes[0]);\n  const rgbs = hexes.map(hexToRGB);\n  const out = [];\n  for (let i = 0; i < n; i++) {\n    const t = (i / (n - 1)) * (rgbs.length - 1);\n    const lo = Math.floor(t);\n    const hi = Math.min(lo + 1, rgbs.length - 1);\n    const f = t - lo;\n    out.push(rgbToHex([\n      rgbs[lo][0] + (rgbs[hi][0] - rgbs[lo][0]) * f,\n      rgbs[lo][1] + (rgbs[hi][1] - rgbs[lo][1]) * f,\n      rgbs[lo][2] + (rgbs[hi][2] - rgbs[lo][2]) * f,\n    ]));\n  }\n  return out;\n}\n';

export const GET = () => {
  const P: Record<string, string> = {
    gold: v('gradient-gold'), orange: v('gradient-orange'), red: v('gradient-red'), red600: v('gradient-red'),
    violet: v('gradient-violet'), blue: v('gradient-blue'), teal: v('gradient-teal'), green: v('gradient-green'),
    lime: v('gradient-lime'), yellow: v('gradient-yellow'),
  };
  const G: Record<string, string[]> = {
    spectrum: list('spectrum'), stream: list('flow'), flow: list('flow'), map: list('map'), interactive: list('interactive'),
    'gold-orange': [P.gold, P.orange], 'orange-red': [P.orange, P.red], 'red-violet': [P.red, P.violet], 'violet-blue': [P.violet, P.blue],
    'teal-green': [P.teal, P.green], 'green-lime': [P.green, P.lime], 'lime-yellow': [P.lime, P.yellow],
    warm: [P.gold, P.orange, P.red], cool: [P.blue, P.teal, P.green],
  };
  const body = `/* ${STAMP} */
/**
 * OpenMined Design System: brand colors for canvas and WebGL (the <om-*> embeds).
 * Generated from the v2 tokens; never hand-type hex into a shader. Light-mode values:
 * graphics use fixed steps. Pass a page's own colors through an embed's colors
 * attribute to follow the color mode.
 */
export const PALETTE = ${JSON.stringify(P, null, 2)};

export const GRADIENTS = ${JSON.stringify(G, null, 2)};

${FNS}`;
  return respond(body, 'js');
};
