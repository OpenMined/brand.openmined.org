/**
 * BRAND-V2 — the working favorites, read from the v2 token build.
 *
 * Every value comes from src/tokens/v2/ (generated from tokens/ by
 * `npm run tokens`). This module computes no color: it reads the build,
 * lists what the review pages need, and maps the rounds' page-local names
 * (--c-h, --spec-N, --{hue}-tint …) onto v2 tokens so the round markup keeps
 * working. Read by the working-favorites page, the diagram round and the
 * token downloads. The pre-v2 values are frozen in ./_legacy.ts.
 *
 * Status (exploring / working) travels with each token; placeholders are
 * marked `exploring` in the build and on the page.
 */
import LIGHT from '../../tokens/v2/tokens.light.json';
import DARK from '../../tokens/v2/tokens.dark.json';
import V2_CSS from '../../tokens/v2/tokens.css?raw';
import INPUTS from '../../../tools/palette/inputs.json';

export type Mode = 'light' | 'dark';
export const MODES: Mode[] = ['light', 'dark'];
export const SAT: Record<Mode, number> = { light: INPUTS.saturation.light, dark: INPUTS.saturation.dark };
export const HUES = Object.keys(INPUTS.hues);
export const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
export const KEY = '500';
export { V2_CSS };

type Entry = { value: string; resolved: string; type: string; status?: string };
const FILES: Record<Mode, Record<string, Entry>> = { light: LIGHT as any, dark: DARK as any };

/** A token's entry for a mode, by CSS name without the leading `--`. */
export function tok(mode: Mode, name: string): Entry {
  const e = FILES[mode]['--' + name];
  if (!e) throw new Error(`v2 token --${name} not found`);
  return e;
}
export const hex = (mode: Mode, name: string) => tok(mode, name).resolved;
export const statusOf = (mode: Mode, name: string) => tok(mode, name).status ?? 'working';

/** The token a value points at (`var(--gray-100)` → `gray-100`), or null for a literal. */
const target = (v: string) => v.match(/^var\(--([\w-]+)\)$/)?.[1] ?? null;
/** Follow a role down to the gray step it lands on: `surface-base` → `100` (or `white` / `black`). */
export function grayStep(mode: Mode, name: string): string {
  let n: string | null = name;
  while (n) {
    const m = n.match(/^gray-(\d+)$/);
    if (m) return m[1];
    if (n === 'white' || n === 'black') return n;
    n = target(tok(mode, n).value);
  }
  throw new Error(`--${name} does not resolve to a gray step`);
}
/** The step a hue role points at: `blue-subtle` → `100`. */
export function hueStep(mode: Mode, name: string): string {
  let n = target(tok(mode, name).value);
  while (n) {
    const m = n.match(/^[a-z]+-(\d+)$/);
    if (m) return m[1];
    n = target(tok(mode, n).value);
  }
  throw new Error(`--${name} does not point at a step`);
}

/* ── Gray: one ramp, the same in both modes ───────────────────────── */
export const GRAY: Record<string, string> = Object.fromEntries(STEPS.map(s => [s, hex('light', `gray-${s}`)]));
export const GRAY_STATUS: Record<string, string> = Object.fromEntries(STEPS.map(s => [s, statusOf('light', `gray-${s}`)]));
export const WHITE = hex('light', 'white');
export const BLACK = hex('light', 'black');

/* ── Hues ─────────────────────────────────────────────────────────── */
export function ramp(mode: Mode): Record<string, Record<string, string>> {
  return Object.fromEntries(HUES.map(h => [h, Object.fromEntries(STEPS.map(s => [s, hex(mode, `${h}-${s}`)]))]));
}
export const isNewStep = (h: string, s: string) => statusOf('light', `${h}-${s}`) === 'exploring';

/** The nine gradient stops; `ref` names the hue key a family stop is. */
export const GRADIENT_STOPS = INPUTS.gradient.stops.map(s => s.name);
export function gradient(mode: Mode): { name: string; hex: string; ref: string | null }[] {
  return GRADIENT_STOPS.map(name => {
    const t = target(tok(mode, `gradient-${name}`).value);
    return { name, hex: hex(mode, `gradient-${name}`), ref: t };
  });
}

/** Chart series order: series-N → its hue. */
export const SERIES = Array.from({ length: 6 }, (_, i) => target(tok('light', `series-${i + 1}`).value)!.replace('-key', ''));

/* ── Surfaces, lines, text: each names a gray step per mode ───────── */
export type Slot = { token: string; name: string; hex: string; step: string; status: string };
const slot = (mode: Mode, token: string, v2: string): Slot =>
  ({ token, name: token, hex: hex(mode, v2), step: grayStep(mode, v2), status: statusOf(mode, v2) });
export const SURFACES: Record<Mode, Slot[]> = Object.fromEntries(MODES.map(m =>
  [m, ['sunken', 'base', 'raise-1', 'raise-2'].map(t => slot(m, t, `surface-${t}`))])) as any;
export const LINES_TEXT: Record<Mode, Slot[]> = Object.fromEntries(MODES.map(m =>
  [m, ['line', 'line-strong', 'text-headline', 'text-body', 'text-muted'].map(t => slot(m, t, t))])) as any;

export const SHADOWS: Record<Mode, Record<'sunken' | 'raise-1' | 'raise-2', string>> = Object.fromEntries(MODES.map(m =>
  [m, { sunken: hex(m, 'shadow-sunken'), 'raise-1': hex(m, 'shadow-raise-1'), 'raise-2': hex(m, 'shadow-raise-2') }])) as any;

/* ── Hue roles ────────────────────────────────────────────────────── */
const ROLE_USE: Record<string, string> = {
  subtle: 'Badge, callout, selected-row background',
  soft: 'Decorative rule, selected outline, area fill',
  fg: 'Colored text, links, icons — AA on every surface',
  key: 'Marks with no text: chart series, dots, progress, strokes',
  solid: 'Fills carrying a label: white in light, ink in dark, every hue',
  hover: 'One step past solid',
};
export const ROLE_ROWS = Object.entries(ROLE_USE).map(([role, use]) => ({
  role, use, light: hueStep('light', `blue-${role}`), dark: hueStep('dark', `blue-${role}`),
}));
/** Status → hue, read from the build (`danger-solid` → `red-solid` → red). */
export const ROLE_HUE: Record<string, string | null> = {
  accent: null,
  ...Object.fromEntries(['success', 'warning', 'danger', 'info'].map(s => [s, target(tok('light', `${s}-solid`).value)!.replace('-solid', '')])),
};

/* ── Color maths, for readouts and contrast notes only ────────────── */
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export function oklchOf(h: string): [number, number, number] {
  const n = parseInt(h.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L * 100, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}
export function contrast(a: string, b: string): number {
  const lum = (h: string) => {
    const n = parseInt(h.replace('#', ''), 16);
    const [r, g, bl] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** Label ink on light and dark fills (swatch readouts). */
export const LABEL_INK = { onLight: GRAY['800'], onDark: GRAY['50'] };

/** One label color per step, shared by every hue (rule 2026-09-24): whichever of
 *  the two inks has the better worst-case contrast across the hues at that step.
 *  Never chosen per swatch, so a row never mixes dark and light labels. */
export function stepLabel(mode: Mode, step: string, ink: { onLight: string; onDark: string } = LABEL_INK): string {
  const r = ramp(mode), fills = HUES.map(h => r[h][step]);
  const worst = (c: string) => Math.min(...fills.map(f => contrast(c, f)));
  return worst(ink.onLight) >= worst(ink.onDark) ? ink.onLight : ink.onDark;
}

/* ── The rounds' page-local names, mapped onto v2 ─────────────────────
   Round markup (here, the diagrams, the color round's blocks) uses short
   names. Each is a reference to a v2 token — no value is chosen here except
   where a name has no v2 token yet, noted inline. */
const SHARED = [
  '--c-white:var(--white)', '--label-ink:var(--gray-800)',
  '--c-sunken:var(--surface-sunken)', '--c-base:var(--surface-base)', '--c-raise-1:var(--surface-raise-1)', '--c-raise-2:var(--surface-raise-2)',
  '--c-line:var(--line)', '--c-line-strong:var(--line-strong)',
  '--c-h:var(--text-headline)', '--c-b:var(--text-body)', '--c-m:var(--text-muted)', '--c-ink:var(--text-headline)',
  '--c-shadow-in:var(--shadow-sunken)', '--c-shadow-1:var(--shadow-raise-1)', '--c-shadow-2:var(--shadow-raise-2)',
  // Diagram connector: no v2 token yet (a component token, later). Was gray 550, which has no
  // v2 step; the spectrum round's placeholder is gray 400.
  '--connector:var(--gray-400)',
  ...GRADIENT_STOPS.map((n, i) => `--spec-${i + 1}:var(--gradient-${n})`),
  `--spectrum:${GRADIENT_STOPS.map(n => `var(--gradient-${n})`).join(',')}`,
];
/** Mode-specific names: the ink chip's label, and the color round's swatch ring. */
function perMode(m: Mode): string[] {
  const base = SURFACES[m][1].hex, d = [`--c-on-ink:var(--gray-${m === 'light' ? '50' : '950'})`, `color-scheme:${m}`];
  for (const h of HUES) {
    // The color round's ring: the key where it reaches 3:1 on the base, otherwise fg.
    d.push(`--${h}-ring:var(--${h}-${contrast(hex(m, `${h}-key`), base) >= 3 ? 'key' : 'fg'})`);
  }
  return d;
}
/** The color round's block names: `tint` is v2's `subtle`; statuses and series follow their hue. */
const BLOCKS = [
  ...HUES.map(h => `--${h}-tint:var(--${h}-subtle)`),
  ...Object.entries(ROLE_HUE).filter(([, h]) => h).flatMap(([r, h]) => [`--${r}-tint:var(--${r}-subtle)`, `--${r}-ring:var(--${h}-ring)`]),
  '--accent-tint:var(--accent-subtle)', '--accent-key:var(--accent-solid)', '--accent-ring:var(--accent-solid)',
  ...SERIES.flatMap((h, i) => [`--series-${i + 1}-tint:var(--${h}-subtle)`, `--series-${i + 1}-soft:var(--${h}-soft)`,
    `--series-${i + 1}-key:var(--${h}-key)`, `--series-${i + 1}-fg:var(--${h}-fg)`]),
];

/** The rounds' page-local names alone — for a page that already loads the v2 CSS
 *  (the brand site embeds round figures with this). */
export const ALIASES_CSS = [
  `:root{${[...SHARED, ...BLOCKS, ...perMode('light')].join(';')}}`,
  `:root[data-theme="dark"]{${[...SHARED, ...BLOCKS, ...perMode('dark')].join(';')}}`,
].join('\n');
/** Everything a round page needs: the v2 build, then the page-local names. */
export const TOKEN_CSS = [V2_CSS, ALIASES_CSS].join('\n');
/** Kept for the pages that called it; the role layer is now part of TOKEN_CSS. */
export const roleCss = () => '';
