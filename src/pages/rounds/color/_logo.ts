/**
 * COLOR ROUND — the logo, recolored per palette.
 *
 * The mark's colors are hand-tuned: 27 gradient stops plus a flat base fill,
 * most of them sitting BETWEEN brand hues (a gold→teal fade, a muted rose).
 * Snapping them to palette steps would flatten that tuning, so each color is
 * kept as a recipe against today's gradient instead:
 *
 *   original = mix(stop_i, stop_j, t) + residual        (in OKLab, vs Brand)
 *
 * The recipe is the best two-stop blend of the Brand gradient plus whatever
 * is left over. A palette rebuilds the color from ITS stops with the same
 * i, j, t and residual — so Brand reproduces the logo exactly, and the other
 * palettes carry the same fine tuning over their own hues.
 *
 * Values are read from the canonical SVGs in public/logos at build time —
 * nothing here is typed by hand. Output is custom properties keyed by the
 * original hex (--lg-e6af7b …) set per palette, plus the wordmark fill per
 * mode, and inline SVG markup that reads them.
 */
import { readFileSync } from 'node:fs';

type Lab = [number, number, number];

/* ── sRGB ⇄ OKLab ─────────────────────────────────────────────────── */
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function toLab(hex: string): Lab {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function toHex([L, A, B]: Lab): string {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return '#' + rgb.map(c => Math.round(Math.min(Math.max(gam(Math.min(Math.max(c, 0), 1)), 0), 1) * 255).toString(16).padStart(2, '0')).join('');
}

const mix = (a: Lab, b: Lab, t: number): Lab => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const dist = (a: Lab, b: Lab) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/* ── Recipes ──────────────────────────────────────────────────────── */
type Recipe = { i: number; j: number; t: number; res: Lab };

function recipe(hex: string, brand: Lab[]): Recipe {
  const c = toLab(hex);
  let best = { i: 0, j: 0, t: 0, d: Infinity };
  for (let i = 0; i < brand.length; i++) {
    for (let j = i; j < brand.length; j++) {
      for (let k = 0; k <= 100; k++) {
        const t = k / 100, d = dist(mix(brand[i], brand[j], t), c);
        if (d < best.d) best = { i, j, t, d };
      }
    }
  }
  const m = mix(brand[best.i], brand[best.j], best.t);
  return { i: best.i, j: best.j, t: best.t, res: [c[0] - m[0], c[1] - m[1], c[2] - m[2]] };
}

const apply = (r: Recipe, pal: Lab[]): string => {
  const m = mix(pal[r.i], pal[r.j], r.t);
  return toHex([m[0] + r.res[0], m[1] + r.res[1], m[2] + r.res[2]]);
};

/* ── Sources ──────────────────────────────────────────────────────── */
// From the project root, as the page reads tokens.css: a path relative to
// this module breaks once Astro bundles it into dist/.
const read = (f: string) => readFileSync(`${process.cwd()}/public/logos/${f}`, 'utf8');
const LOGO = read('OpenMined-Logo.svg');
const LOGO_DARK = read('OpenMined-Logo-Dark.svg');
const ICON = read('OpenMined-Icon.svg');

const HEX = /#[0-9a-fA-F]{6}\b/g;
const wordFill = (svg: string) => svg.match(/<path[^>]*fill="(#[0-9a-fA-F]{6})"/)![1];
// Mark colors: every stop and flat fill except the wordmark's.
const markHexes = (svg: string, skip: string) =>
  [...new Set((svg.match(HEX) ?? []).map(h => h.toLowerCase()))].filter(h => h !== skip.toLowerCase());

const WORD_LIGHT = wordFill(LOGO);
const WORD_DARK = wordFill(LOGO_DARK);
const MARK = [...new Set([...markHexes(LOGO, WORD_LIGHT), ...markHexes(ICON, WORD_LIGHT)])];

const v = (hex: string) => `--lg-${hex.slice(1).toLowerCase()}`;

/** Per-palette custom properties for every mark color, plus the wordmark per mode. */
export function logoCss(palettes: Record<string, { gradient: string[] }>): string {
  const brand = palettes.brand.gradient.map(toLab);
  const recipes = MARK.map(h => [h, recipe(h, brand)] as const);
  const out = Object.entries(palettes).map(([k, p]) => {
    const pal = p.gradient.map(toLab);
    return `:root[data-p="${k}"]{${recipes.map(([h, r]) => `${v(h)}:${apply(r, pal)}`).join(';')}}`;
  });
  out.push(`:root{--lg-word:${WORD_LIGHT}}`, `:root[data-theme="dark"]{--lg-word:${WORD_DARK}}`);
  return out.join('');
}

/** Inline SVG markup reading the custom properties. `uid` keeps gradient ids unique per instance. */
function inline(svg: string, uid: string, cls: string, label: string, word?: string): string {
  let s = svg
    .replace(/<svg([^>]*)>/, `<svg$1 class="${cls}" role="img" aria-label="${label}">`)
    .replace(/id="([^"]+)"/g, `id="${uid}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${uid}-$1)`)
    .replace(/stop-color="(#[0-9a-fA-F]{6})"/g, (_, h) => `style="stop-color:var(${v(h)})"`);
  if (word) s = s.replace(`fill="${word}"`, 'style="fill:var(--lg-word)"');
  return s.replace(/fill="(#[0-9a-fA-F]{6})"/g, (_, h) => `style="fill:var(${v(h)})"`);
}

export const logoSvg = (uid: string, cls: string) => inline(LOGO, uid, cls, 'OpenMined', WORD_LIGHT);
export const iconSvg = (uid: string, cls: string) => inline(ICON, uid, cls, 'OpenMined');
