/**
 * NAMING ROUND — how many grays, and what to call them.
 *
 * Naming and count only: every value is read from ../_legacy.ts (the pre-v2 working values, frozen) and none
 * changes. The criteria come from review (2026-10-07):
 *   - gray and hues number in the same direction (low = light), as now;
 *   - the agreed values stay exactly as they are;
 *   - someone with little design knowledge can pick a gray without confusion;
 *   - gray will not line up with the hue lightness levels, and needn't.
 */
import { GRAY, GRAY_STEPS, SURFACES, LINES_TEXT, ACCENT_NONE_STEPS, SHADOW_INK, oklchOf } from '../_legacy';

const L = (hex: string) => oklchOf(hex)[0];
export const fmtL = (l: number) => l.toFixed(1);

/* ── What uses each gray today ────────────────────────────────────── */
type Mode = 'light' | 'dark';
const uses = (m: Mode, step: string) => {
  const t = [...SURFACES[m], ...LINES_TEXT[m]].filter(x => x.step === step).map(x => x.token);
  for (const [k, v] of Object.entries(ACCENT_NONE_STEPS[m])) if (v === step) t.push(`accent-${k}`);
  if (SHADOW_INK[m] === step) t.push('shadow ink');
  if (step === '550') t.push('diagram connector');
  return t;
};

export type Gray = { cur: string; hex: string; l: number; use: Record<Mode, string[]>; used: boolean };
export const GRAYS: Gray[] = GRAY_STEPS.map(st => {
  const use = { light: uses('light', st), dark: uses('dark', st) };
  return { cur: st, hex: GRAY[st], l: L(GRAY[st]), use, used: use.light.length + use.dark.length > 0 };
});
/** Lightness gaps between neighbors: where the ramp is dense, where it is thin. */
export const GAPS = GRAYS.slice(1).map((g, i) => ({ from: GRAYS[i], to: g, d: GRAYS[i].l - g.l }));

/* ── Naming options. Each maps a current step to a name, or null = dropped. ── */
const KEPT = GRAYS.filter(g => g.used).map(g => g.cur);
const BANDS: Record<string, string> = {
  '00': '00', '50': '25', '100': '50', '150': '100', '300': '200', '400': '250', '550': '400',
  '600': '500', '700': '600', '750': '650', '800': '700', '850': '750', '900': '800', '950': '850', '1000': '1000',
};
export type Option = {
  id: string; label: string; idea: string;
  name: (cur: string) => string | null;
  notes: { pro: string[]; con: string[] };
};
export const OPTIONS: Option[] = [
  {
    id: 'keep', label: '1 · Keep all 17', idea: 'Today’s ramp, untouched.',
    name: c => c,
    notes: {
      pro: ['No change at all; the released names keep working.'],
      con: ['200 and 500 have no job, so a newcomer has two extra grays to rule out.', 'Names are uneven (150, 550, 750, 850) and say nothing beyond order.'],
    },
  },
  {
    id: 'prune', label: '2 · Keep the names, drop the unused', idea: 'Only the steps something uses; each keeps its current name.',
    name: c => (KEPT.includes(c) ? c : null),
    notes: {
      pro: ['Every gray on offer has a job.', 'Nothing is renamed, so no migration: a name means the same color before and after.', 'Room to insert later (e.g. 200 comes back if a hover state needs it).'],
      con: ['Holes in the numbering (no 200, no 500) read as missing colors.', 'Still uneven: 150, 550, 750, 850.'],
    },
  },
  {
    id: 'even', label: '3 · Renumber evenly', idea: 'The kept steps in order, every 100: 0, 100, 200 … 1400.',
    name: c => (KEPT.includes(c) ? String(KEPT.indexOf(c) * 100) : null),
    notes: {
      pro: ['Regular, with no holes: the next darker gray is always +100.', 'Same hundreds format as the hues.'],
      con: ['Runs to 1400, past the hues’ range, with no meaning in where it ends.', 'Almost every name changes meaning: today’s gray-300 (the light recess) becomes gray-400.', 'Adding a step later means a 50 in between, or renumbering.'],
    },
  },
  {
    id: 'index', label: '4 · Count from 1', idea: 'The kept steps in order, 1 to 15, as Radix numbers its 12.',
    name: c => (KEPT.includes(c) ? String(KEPT.indexOf(c) + 1) : null),
    notes: {
      pro: ['The simplest possible names: gray 1 is lightest, gray 15 darkest.'],
      con: ['A different format from the hues (gray-7 beside blue-500).', 'Every name changes; adding a step renumbers the rest.'],
    },
  },
  {
    id: 'bands', label: '5 · Hue-band names', idea: 'A gray takes the hue step name nearest its lightness, with in-betweens.',
    name: c => BANDS[c] ?? null,
    notes: {
      pro: ['gray-100, 200 and 700 are as light as every hue’s 100, 200 and 700.', 'Same format and range as the hues.'],
      con: ['Only approximate elsewhere, as the agreed values can’t move to the hue levels.', 'Many in-between names (25, 50, 250, 650, 750 …).', 'Every gray name changes meaning.'],
    },
  },
];

/** Names that change meaning: the name existed before but now points at another color. */
export const meaningChanges = (o: Option) =>
  GRAYS.filter(g => { const n = o.name(g.cur); return n !== null && n !== g.cur && GRAY_STEPS.includes(n); }).length;
export const renamed = (o: Option) => GRAYS.filter(g => { const n = o.name(g.cur); return n !== null && n !== g.cur; }).length;
export const offered = (o: Option) => GRAYS.filter(g => o.name(g.cur) !== null).length;

/* ── The pick list: what most people choose from, in both modes ────── */
export const ROLES_PICK: { role: string; job: string; token: string }[] = [
  { role: 'Page', job: 'The background everything sits on', token: 'base' },
  { role: 'Card', job: 'A panel on the page', token: 'raise-1' },
  { role: 'Raised', job: 'A panel above a card: menus, popovers', token: 'raise-2' },
  { role: 'Recess', job: 'A well or input set into a surface', token: 'sunken' },
  { role: 'Line', job: 'Dividers and quiet borders', token: 'line' },
  { role: 'Strong line', job: 'Borders that must be seen', token: 'line-strong' },
  { role: 'Headline', job: 'Titles and the most important text', token: 'text-headline' },
  { role: 'Body', job: 'Running text', token: 'text-body' },
  { role: 'Muted', job: 'Captions, labels, secondary text', token: 'text-muted' },
];
export const stepOf = (m: Mode, token: string) => [...SURFACES[m], ...LINES_TEXT[m]].find(x => x.token === token)!.step;

/* ── What the big systems do (read from their published token files, 2026-10-07) ── */
export const FIELD = [
  { sys: 'Tailwind', gray: '11 (50–950)', hue: '11 (50–950)', note: 'Gray is one more hue.' },
  { sys: 'Radix', gray: '12 (1–12)', hue: '12 (1–12)', note: 'Each step has a job: 1–2 backgrounds, 3–5 component states, 6–8 borders, 9–10 solids, 11–12 text.' },
  { sys: 'IBM Carbon', gray: '10 (10–100)', hue: '10 (10–100)', note: 'Gray is one more hue.' },
  { sys: 'Atlassian', gray: '13 (0–1200)', hue: '12 (100–1000, with 250 and 850)', note: 'Closest to OM: more neutrals than hues, past both ends of the hue range, same direction and format.' },
  { sys: 'Material 3', gray: 'any tone 0–100', hue: 'any tone 0–100', note: 'Named by lightness, so higher = lighter: the opposite direction to OM’s hues.' },
];
