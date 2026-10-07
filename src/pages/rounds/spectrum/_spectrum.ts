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
import grayFile from '../../../../tokens/base/gray.json';
import huesLight from '../../../../tokens/light/hues.json';
import huesDark from '../../../../tokens/dark/hues.json';
import { HUES, MODES, ROLES, ROLE_HUE, contrast, oklchOf } from '../_working';

export type Mode = 'light' | 'dark';
export const SERIES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export type Step = typeof SERIES[number];
export type Kind = 'pinned' | 'new';

/* ── Read from the generated token files (tools/palette/generate.mjs) ──
   This page no longer computes any color: every step is the token file's
   value, so a retune in tools/palette/inputs.json shows up here on reload. */
type Tok = { $value: { hex: string }; $extensions: { 'org.openmined': { pinned?: boolean; was?: string } } };
const asStep = (t: Tok) => {
  const m = t.$extensions['org.openmined'];
  return { hex: t.$value.hex, kind: (m.pinned ? 'pinned' : 'new') as Kind, from: m.was?.replace(' (7-step)', '') };
};

/* ── Gray ─────────────────────────────────────────────────────────── */
export const GRAY11 = Object.fromEntries(SERIES.map(s => [s, asStep((grayFile.gray as any)[s])])) as Record<Step, { hex: string; kind: Kind; from?: string }>;
export const WHITE = grayFile.white.$value.hex;
export const BLACK = grayFile.black.$value.hex;

/* ── Hues ─────────────────────────────────────────────────────────── */
const OLD_TO_NEW: Record<string, Step> = { '100': '100', '200': '200', '300': '300', '400': '500', '500': '600', '600': '700', '700': '800' };
export const NEW_FROM_OLD = OLD_TO_NEW;
const HUE_FILES: Record<Mode, any> = { light: huesLight, dark: huesDark };
/** A hue's 11 steps for a mode, as generated (offset already applied). */
export function hue11(h: string, m: Mode) {
  return Object.fromEntries(SERIES.map(s => [s, asStep(HUE_FILES[m][h][s])])) as Record<Step, { hex: string; kind: Kind; from?: string }>;
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
