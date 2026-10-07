/**
 * SPECTRUM ROUND — one 11-step series for gray and every hue: 50, 100–900, 950.
 *
 * A proposal, not the working values: ../_working.ts is untouched. Agreed
 * values are pinned at their new step; new steps are generated here and are
 * provisional (not tuned, not display-checked). White and black sit outside
 * the scale.
 *
 *   gray  pinned: the eight surfaces' grays + light shadow ink. New: 300–500,
 *         spaced evenly in lightness between 200 and 600.
 *   hues  pinned: the seven Ink steps (old 100–700 → new 100, 200, 300, 500,
 *         600, 700, 800; the key moves 400 → 500). New: 50, 400, 900, 950.
 *
 * Text, line and accent roles were never tuned (holdovers); here they point
 * at a sensible step as placeholders until the text round.
 */
import data from '../color/_palettes.json';
import { GRAY, HUES, MODES, SAT, ROLES, ROLE_HUE, oklchOf, oklchToHex, contrast } from '../_working';

export type Mode = 'light' | 'dark';
export const SERIES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export type Step = typeof SERIES[number];
export type Kind = 'pinned' | 'new';

const P = (data.palettes as any).ink;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpH = (a: number, b: number, t: number) => { const d = ((b - a + 540) % 360) - 180; return (a + d * t + 360) % 360; };

/* ── Gray ─────────────────────────────────────────────────────────── */
const GRAY_PIN: Partial<Record<Step, string>> = {
  '50': '100', '100': '150', '200': '300', '600': '700', '700': '800', '800': '850', '900': '900', '950': '950',
};
const grayNew = (t: number) => {
  const [L1, C1, H1] = oklchOf(GRAY['300']), [L2, C2, H2] = oklchOf(GRAY['700']);
  return oklchToHex(lerp(L1, L2, t), lerp(C1, C2, t), lerpH(H1, H2, t));
};
export const GRAY11: Record<Step, { hex: string; kind: Kind; from?: string }> = Object.fromEntries(SERIES.map(s => {
  const pin = GRAY_PIN[s];
  if (pin) return [s, { hex: GRAY[pin], kind: 'pinned', from: `gray ${pin}` }];
  const t = { '300': 0.25, '400': 0.5, '500': 0.75 }[s as '300' | '400' | '500'];
  return [s, { hex: grayNew(t), kind: 'new' }];
})) as any;
export const WHITE = GRAY['00'];
export const BLACK = GRAY['1000'];

/* ── Hues: base ramp (before the per-mode saturation offset) ──────── */
const OLD_TO_NEW: Record<string, Step> = { '100': '100', '200': '200', '300': '300', '400': '500', '500': '600', '600': '700', '700': '800' };
export const NEW_FROM_OLD = OLD_TO_NEW;
const baseHue = (h: string): Record<Step, { hex: string; kind: Kind; from?: string }> => {
  const old = (s: string) => oklchOf(P.ramps[h][s]);
  const out: any = {};
  for (const [o, n] of Object.entries(OLD_TO_NEW)) out[n] = { hex: P.ramps[h][o], kind: 'pinned', from: `${h} ${o}` };
  const [L1, C1, H1] = old('100'), [L3, C3, H3] = old('300'), [Lk, Ck, Hk] = old('400'), [L7, C7, H7] = old('700');
  out['50'] = { hex: oklchToHex(98.4, C1 * 0.45, H1), kind: 'new' };                                    // a lighter wash
  out['400'] = { hex: oklchToHex((L3 + Lk) / 2, lerp(C3, Ck, 0.5), lerpH(H3, Hk, 0.5)), kind: 'new' };  // fills 300 → key
  out['900'] = { hex: oklchToHex(22, C7 * 0.8, H7), kind: 'new' };                                      // dark-mode fills
  out['950'] = { hex: oklchToHex(16.5, C7 * 0.62, H7), kind: 'new' };
  return out;
};
const sat = (hex: string, s: number) => { const [L, C, H] = oklchOf(hex); return oklchToHex(L, C * s, H); };
/** A hue's 11 steps for a mode, with the same saturation offset the working ramp uses. */
export function hue11(h: string, m: Mode) {
  const b = baseHue(h);
  return Object.fromEntries(SERIES.map(s => [s, { ...b[s], hex: sat(b[s].hex, SAT[m]) }])) as Record<Step, { hex: string; kind: Kind; from?: string }>;
}

/* ── Roles ────────────────────────────────────────────────────────── */
export type Role = { role: string; token: string; group: string; light: Step | 'white' | 'black'; dark: Step | 'white' | 'black'; settled: boolean; job: string };
/** Gray roles. Surfaces and shadow ink are agreed; text, lines and accent are placeholders. */
export const GRAY_ROLES: Role[] = [
  { group: 'Surfaces', role: 'Recess', token: 'sunken', light: '200', dark: '950', settled: true, job: 'A well set into a surface' },
  { group: 'Surfaces', role: 'Page', token: 'base', light: '100', dark: '900', settled: true, job: 'The background' },
  { group: 'Surfaces', role: 'Card', token: 'raise-1', light: '50', dark: '800', settled: true, job: 'A panel on the page' },
  { group: 'Surfaces', role: 'Raised', token: 'raise-2', light: 'white', dark: '700', settled: true, job: 'Menus, popovers' },
  { group: 'Lines', role: 'Line', token: 'line', light: '200', dark: '600', settled: false, job: 'Dividers, quiet borders' },
  { group: 'Lines', role: 'Strong line', token: 'line-strong', light: '300', dark: '500', settled: false, job: 'Borders that must be seen' },
  { group: 'Text', role: 'Headline', token: 'text-headline', light: '800', dark: '50', settled: false, job: 'Titles' },
  { group: 'Text', role: 'Body', token: 'text-body', light: '600', dark: '200', settled: false, job: 'Running text' },
  { group: 'Text', role: 'Muted', token: 'text-muted', light: '500', dark: '400', settled: false, job: 'Captions, labels' },
  { group: 'Ink', role: 'Shadow ink', token: 'shadow ink', light: '600', dark: 'black', settled: true, job: 'The color shadows are cast in' },
  { group: 'Ink', role: 'Connector', token: 'connector', light: '400', dark: '400', settled: false, job: 'Diagram connectors' },
];
/** Hue roles: the working ROLES, carried to the new step names. */
export const HUE_ROLES = ROLES.map(r => ({
  role: r.role, use: r.use,
  light: OLD_TO_NEW[String(r.light)], dark: OLD_TO_NEW[String(r.dark)],
}));
export const STATUS_OF = (h: string) => Object.entries(ROLE_HUE).filter(([, v]) => v === h).map(([k]) => k);

export const grayHex = (s: Step | 'white' | 'black') => (s === 'white' ? WHITE : s === 'black' ? BLACK : GRAY11[s].hex);
export const grayToken = (s: Step | 'white' | 'black') => (s === 'white' || s === 'black' ? s : `gray-${s}`);
/** Roles on a gray step in a mode. */
export const grayRolesAt = (m: Mode, s: Step) => GRAY_ROLES.filter(r => r[m] === s);
export const hueRolesAt = (m: Mode, s: Step) => HUE_ROLES.filter(r => r[m] === s).map(r => r.role);

/** Contrast of a text role on the page and on the card, per mode. */
export const textContrast = (r: Role, m: Mode) => {
  const on = (t: string) => grayHex(GRAY_ROLES.find(x => x.token === t)![m]);
  return { base: contrast(grayHex(r[m]), on('base')), card: contrast(grayHex(r[m]), on('raise-1')), raised: contrast(grayHex(r[m]), on('raise-2')) };
};

export { HUES, MODES };
export const L = (hex: string) => oklchOf(hex)[0];
