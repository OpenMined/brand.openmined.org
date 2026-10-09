/**
 * The v2 token build, for the brand site's pages: values, references and the
 * few calculations a page shows (contrast, which roles land on a step).
 * Read-only; every value comes from src/tokens/v2/ (generated from tokens/).
 */
import LIGHT from '../tokens/v2/tokens.light.json';
import DARK from '../tokens/v2/tokens.dark.json';
import INPUTS from '../../tools/palette/inputs.json';

export type Mode = 'light' | 'dark';
export const MODES: Mode[] = ['light', 'dark'];
export const HUES = Object.keys(INPUTS.hues);
export const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
export const GRADIENT_STOPS = INPUTS.gradient.stops.map(s => s.name);
/** Graphics-only stops: tokens, but not in the spectrum (e.g. magenta). */
export const EXTRA_STOPS = (INPUTS.gradient as any).extra?.map((s: { name: string }) => s.name) ?? [];
/** A graphic's own list (`gradient.map`, `gradient.flow`) as the CSS names of its stops,
 *  in order — what an embed's data-follow attribute takes. */
export const listStops = (name: string) =>
  [...tok('light', `gradient-${name}`).value.matchAll(/var\(--([\w-]+)\)/g)].map(m => m[1]).join(',');
export const SAT = INPUTS.saturation as { light: number; dark: number };

type Entry = { value: string; resolved: string; type: string; status?: string };
const FILES: Record<Mode, Record<string, Entry>> = { light: LIGHT as any, dark: DARK as any };

export function tok(mode: Mode, name: string): Entry {
  const e = FILES[mode][name.startsWith('--') ? name : `--${name}`];
  if (!e) throw new Error(`v2 token ${name} not found`);
  return e;
}
export const hex = (mode: Mode, name: string) => tok(mode, name).resolved;
export const statusOf = (mode: Mode, name: string) => tok(mode, name).status ?? 'working';
/** The token a value points at: `var(--gray-100)` → `gray-100`; null for a literal. */
export const target = (mode: Mode, name: string) => tok(mode, name).value.match(/^var\(--([\w-]+)\)$/)?.[1] ?? null;

/** Follow references down to the primitive a token lands on: `surface-base` → `gray-100`. */
export function primitive(mode: Mode, name: string): string {
  let n = name.replace(/^--/, '');
  for (let t = target(mode, n); t; t = target(mode, n)) n = t;
  return n;
}
/** The step number a role resolves to (`blue-subtle` → `100`), or `white` / `black`. */
export const stepOf = (mode: Mode, name: string) => primitive(mode, name).replace(/^[a-z]+-/, '');

/** Series order: series-N → its hue. */
export const SERIES = Array.from({ length: 6 }, (_, i) => target('light', `series-${i + 1}`)!.replace('-key', ''));
/** Status → hue, read from the build (`danger-solid` → `red-solid`). */
export const STATUS: Record<string, string> = Object.fromEntries(
  ['success', 'warning', 'danger', 'info'].map(s => [s, target('light', `${s}-solid`)!.replace('-solid', '')]));

/* ── Contrast ─────────────────────────────────────────────────────── */
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h: string) => {
  const n = parseInt(h.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** WCAG 2 contrast ratio. */
export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** One label color per step, shared by every hue: the ink with the better worst case. */
export function stepLabel(mode: Mode, step: string): string {
  const ink = { dark: hex(mode, 'gray-800'), light: hex(mode, 'gray-50') };
  const fills = HUES.map(h => hex(mode, `${h}-${step}`));
  const worst = (c: string) => Math.min(...fills.map(f => contrast(c, f)));
  return worst(ink.dark) >= worst(ink.light) ? ink.dark : ink.light;
}
/** A readout on a single swatch (gray card): dark ink on light fills, light ink on dark. */
export const readout = (mode: Mode, fill: string) =>
  contrast(hex(mode, 'gray-800'), fill) >= contrast(hex(mode, 'gray-50'), fill) ? hex(mode, 'gray-800') : hex(mode, 'gray-50');
