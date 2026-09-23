/**
 * SURFACE ROUND — live color editor
 * ════════════════════════════════════════════════════════════════════
 * Two layers of state, deliberately kept separate:
 *
 *   1. GRAYSCALE  — what hex each of the 17 brand steps actually is.
 *                   This is the only place a real color value is chosen.
 *   2. ASSIGNMENT — which step each surface slot points at.
 *                   Slots can only ever hold a step, never a raw color,
 *                   so "surfaces always pull from the grayscale" is
 *                   structurally guaranteed rather than a convention.
 *
 * Edits to (1) flow outward to every slot pointing at that step, in all
 * four palettes at once.
 *
 * SCOPING: overrides are written to `.mock`, NOT `:root`. The editor chrome
 * keeps the real brand tokens so it stays legible and stable no matter how
 * far the mock is pushed. This matters more than dogfooding: the swatches
 * have to be judged against an unchanging ground, and a punishing edit must
 * never be able to strand the controls that would undo it.
 *
 * It has to be `.mock` rather than `:root` because the brand's semantic
 * tokens (--surface-*, --text-*) resolve THROUGH --color-grayscale-*, so a
 * :root override moves the chrome too, however the chrome is written.
 */

/* ── Color maths (sRGB ↔ OKLCH), ported from the round-1A derivation ── */

const s2l = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const l2s = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const cbrt = (x: number) => (x < 0 ? -((-x) ** (1 / 3)) : x ** (1 / 3));

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}
export function rgbToHex(r: number, g: number, b: number): string {
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * 255))).toString(16).padStart(2, '0');
  return `#${f(r)}${f(g)}${f(b)}`;
}

export function hexToOklch(hex: string): { L: number; C: number; H: number } {
  let [r, g, b] = hexToRgb(hex).map(s2l) as [number, number, number];
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    L: L * 100,
    C: Math.hypot(A, B),
    H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
  };
}

function oklchToRgbRaw(L: number, C: number, H: number): [number, number, number] {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const Ln = L / 100;
  const l = (Ln + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (Ln - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (Ln - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    l2s(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const inGamut = (rgb: number[]) => rgb.every(c => c >= -1e-4 && c <= 1 + 1e-4);

/** Gamut-map by reducing chroma, preserving lightness and hue. */
export function oklchToHex(L: number, C: number, H: number): string {
  let rgb = oklchToRgbRaw(L, C, H);
  if (!inGamut(rgb)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToRgbRaw(L, mid, H))) lo = mid; else hi = mid;
    }
    rgb = oklchToRgbRaw(L, lo, H);
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/* ── The palette + slot model ───────────────────────────────────────── */

export const STEPS = ['00','50','100','150','200','300','400','500','550','600','700','750','800','850','900','950','1000'] as const;
export type Step = typeof STEPS[number];

/** Structural slots: four surfaces, two rules, two inks. Buttons stay derived.
 *  Text is here because contrast is a function of the ground it lands on —
 *  tuning a surface without its ink is only half the decision. */
export const SLOTS = [
  'sunken', 'base', 'raise-1', 'raise-2',
  'line', 'line-strong',
  'text-headline', 'text-body',
] as const;
export type Slot = typeof SLOTS[number];

export const PALETTES = ['light-lighter', 'light-darker', 'dark-lighter', 'dark-darker'] as const;
export type PaletteKey = typeof PALETTES[number];

/**
 * Worded exactly as the bar's two switches word it, so a panel title reads as
 * "what the bar is currently set to". One vocabulary for the four states, not
 * two — a second name for the same thing is the problem this round exists to
 * remove, and it would be poor form to reintroduce it in the tool.
 */
export const PALETTE_LABEL: Record<PaletteKey, string> = {
  'light-lighter': 'light, cards lighter',
  'light-darker':  'light, cards darker',
  'dark-lighter':  'dark, cards lighter',
  'dark-darker':   'dark, cards darker',
};

/** MUST mirror _surfaces.css. Verified against the stylesheet at boot. */
export const DEFAULT_ASSIGN: Record<PaletteKey, Record<Slot, Step>> = {
  'light-lighter': { sunken: '200', base: '150', 'raise-1': '50',  'raise-2': '00',  line: '300', 'line-strong': '400', 'text-headline': '850', 'text-body': '750' },
  'light-darker':  { sunken: '00',  base: '50',  'raise-1': '150', 'raise-2': '200', line: '300', 'line-strong': '400', 'text-headline': '850', 'text-body': '750' },
  'dark-lighter':  { sunken: '950', base: '900', 'raise-1': '850', 'raise-2': '800', line: '750', 'line-strong': '700', 'text-headline': '50',  'text-body': '400' },
  'dark-darker':   { sunken: '750', base: '800', 'raise-1': '850', 'raise-2': '900', line: '750', 'line-strong': '700', 'text-headline': '50',  'text-body': '400' },
};

export const SLOT_LABEL: Record<Slot, string> = {
  sunken: '−1 sunken',
  base: '0 base',
  'raise-1': '+1 raise-1',
  'raise-2': '+2 raise-2',
  line: 'line',
  'line-strong': 'line-strong',
  'text-headline': 'headline',
  'text-body': 'body / ink',
};

/* ── Shadows ────────────────────────────────────────────
   Four tables and one rule. Everything about shadows is data here, so the
   open questions (a pressed state, a focus state, a modal tier, a new kind
   of component) are entries to add rather than code to restructure.

     LADDER   what a shadow IS at each level        — shared by all palettes
     INK      what it is made of, per palette       — color step + strength
     KINDS    which components ask the question
     TRIGGERS when a shadow applies

   THE RULE: a trigger may only move an element ALONG the ladder — never to
   an arbitrary shadow. That is what stops this becoming the eight-token
   surface system again, where anything could be anything and so nobody knew
   what to pick. Extensible in every dimension except the one that would rot.
   ════════════════════════════════════════════════════════════─ */

/** ORDERED, because a trigger moves you along it: +1 means "the next rung
 *  up". Index arithmetic is the point, so this is an array, not a map.
 *  Adding a rung (an overlay/modal tier, say) is one entry here. */
export const LEVELS = ['sunken', 'base', 'raise-1', 'raise-2'] as const;
export type Level = typeof LEVELS[number];

export interface Rung { y: number; blur: number; spread: number; alpha: number; inset: boolean }

/**
 * Derived from the brand's shipped tokens rather than invented: --shadow-sm
 * becomes the +1 rung and --shadow-md the +2. `base` is pinned at nothing —
 * an element sitting ON the page is not above anything, so it has nothing to
 * cast onto. It stays editable so that can be disproved rather than assumed.
 * `sunken` is the one inset rung, which is also what makes a PRESSED state
 * work later for free: sinking to −1 lands on an inner shadow with no
 * special rule.
 */
export const DEFAULT_LADDER: Record<Level, Rung> = {
  sunken:    { y: 1,  blur: 3,  spread: 0,  alpha: 0.13, inset: true },
  base:      { y: 0,  blur: 0,  spread: 0,  alpha: 0,    inset: false },
  'raise-1': { y: 2,  blur: 4,  spread: 0,  alpha: 0.16, inset: false },
  'raise-2': { y: 16, blur: 32, spread: -4, alpha: 0.10, inset: false },
};

/**
 * Per palette, because this is the half that genuinely cannot be shared: a
 * #464257 shadow on a #23202c ground is invisible. `strength` multiplies the
 * ladder's alpha, so the ladder keeps its SHAPE and the palette sets only how
 * hard it lands — the same split as the grayscale cast.
 *
 * `step` is any grayscale step, light ones included. That matters most under
 * `darker`, where raised surfaces are DARKER than the page and a dark shadow
 * may do nothing at all; the answer there may be a light shadow, or none.
 */
export interface Ink { step: Step; strength: number }
export const DEFAULT_INK: Record<PaletteKey, Ink> = {
  'light-lighter': { step: '700',  strength: 1 },
  'light-darker':  { step: '700',  strength: 1 },
  'dark-lighter':  { step: '1000', strength: 2.8 },
  'dark-darker':   { step: '1000', strength: 2.8 },
};

/**
 * WHEN a shadow applies. `sel` wraps a kind's selector, and it is the entire
 * extension point: a pseudo-class, an ancestor state attribute, anything CSS
 * can express. The commented entries are the ones already anticipated — each
 * is one line, with no change to the model.
 */
const HOVERABLE = ':is(a, button, [role="button"])';

export interface Trigger { key: string; label: string; sel: (kind: string) => string }
export const TRIGGERS: readonly Trigger[] = [
  { key: 'rest',  label: 'Rest',      sel: k => `.mock ${k}` },
  // Guarded to elements that can ACTUALLY be hovered. Without it, a static
  // <div> panel changes on mouseover — a bug, not a design option. The guard
  // is `:is(a, button, [role="button"])` rather than a bespoke attribute so it
  // stays true in a consuming project without anything to maintain, and so
  // `active`/`focus` can reuse the same shape when they arrive.
  { key: 'hover', label: 'Hover',     sel: k => `.mock ${k}${HOVERABLE}:hover, .mock ${k}${HOVERABLE}:focus-visible` },
  { key: 'stuck', label: 'On scroll', sel: k => `.mock[data-stuck="true"] ${k}` },
  // `:focus-within` rather than `:focus-visible`: a field should show its
  // recess when you click into it, not only on keyboard focus, and the
  // -within form also covers a real <input> nested inside a wrapper.
  { key: 'focus', label: 'On focus', sel: k => `.mock ${k}:focus-within` },
  // { key: 'active', label: 'Pressed', sel: k => `.mock ${k}:active` },
];
export const trigger = (key: string) => TRIGGERS.find(t => t.key === key);

/**
 * WHICH components ask the question. A kind is a question, not a category —
 * and it declares the triggers it offers, which is how "most elements have no
 * hover" stays true without hover becoming a special global.
 *
 * Adding a kind: one entry here, plus `data-sh` on the elements.
 */
export interface Kind { key: string; label: string; note: string; triggers: readonly string[] }
export const KINDS: readonly Kind[] = [
  { key: 'header',  label: 'Header',  note: 'Sticky band — nothing at rest, or a shadow once it covers content?', triggers: ['rest', 'stuck'] },
  { key: 'card',    label: 'Card',    note: 'Carries its rung at rest. Hover modifies it — on the links only, not the static panels.', triggers: ['rest', 'hover'] },
  { key: 'nested',  label: 'Nested',  note: '+2 inside +1 — needed, or is the value step enough this close?',     triggers: ['rest'] },
  // The old single `inset` kind was defined by its LEVEL — everything sitting
  // at sunken. That was the mistake: three things share that level and want
  // three different answers, so they are three kinds. A kind is a question,
  // and "is it recessed?" was never the question being asked.
  { key: 'control', label: 'Control',  note: 'Toggle tracks and segmented tracks — a recess you operate.',            triggers: ['rest'] },
  { key: 'recess',  label: 'Recess',   note: 'A sunken region you do not touch: footer strip, well, badge.',           triggers: ['rest'] },
  { key: 'field',   label: 'Field',    note: 'An input. Flat until you are in it — the recess is the focus state.',   triggers: ['rest', 'focus'] },
  { key: 'knob',    label: 'Knob',    note: 'Riding in a track — where shadow does real work today.',              triggers: ['rest'] },
];

/**
 * INVERSE INK.
 *
 * A shadow falls on the ground BENEATH an element, not on the element's own
 * surface — so its ink belongs to whatever it is casting onto.
 *
 * That answers inverse exactly. The block itself sits on the ordinary page, so
 * it casts with the ordinary ink (and at `base` it casts nothing at all, which
 * is the right answer for a boundary the value step has already drawn).
 * Everything INSIDE it sits on inverse surfaces — the opposite mode's levels —
 * so it must cast with the opposite palette's ink. A +1 card inside a light
 * page's inverse block is a +1 on a dark ground, and wants exactly the shadow
 * that was tuned for dark mode.
 *
 * So `--s-inv-shadow-*` is the opposite palette's ladder, mirroring `--s-inv-*`
 * for surfaces, and `[data-inverse] [data-lvl]` swaps to it — descendants only,
 * never the boundary element itself. No suppression switch and no kind needs an
 * inverse-aware rule: ink follows the ground, and the rest falls out.
 */

/** null = no shadow. A number is a delta along LEVELS from the element's own
 *  level, clamped at both ends. */
export type Delta = number | null;
export const DELTAS: readonly Delta[] = [null, -1, 0, 1, 2];
export const deltaLabel = (d: Delta) => (d === null ? 'Off' : d === 0 ? 'On' : d > 0 ? `+${d}` : String(d));

/**
 * THE PROPOSAL, not the status quo: a surface carries its rung AT REST. That
 * is the thing being judged — whether four value steps plus a matched shadow
 * ladder read as elevation — so it has to be what you see on load.
 *
 * An earlier version defaulted to `today` instead, reasoning that the default
 * should be the thing to argue against. That was wrong for this round: today's
 * page has no resting card shadow at all, so the default rendered the ladder
 * invisible and the system looked broken when it was merely switched off.
 * `today` is still one click away, which is the right place for it.
 *
 * Header stays scroll-only — a full-bleed band casting at rest is ruled out.
 * Hover keeps +1 ON TOP of the resting shadow, so the card-float lift the live
 * site already does still has somewhere to go.
 */
export const DEFAULT_APPLY: Record<string, Record<string, Delta>> = {
  header: { rest: null, stuck: 0 },
  card:   { rest: 0, hover: 1 },
  nested:  { rest: 0 },
  control: { rest: 0 },
  recess:  { rest: null },
  field:   { rest: null, focus: 0 },
  knob:    { rest: 0 },
};

/** The page as the live site behaves today, kept for comparison. */
export const TODAY_APPLY: Record<string, Record<string, Delta>> = {
  header: { rest: null, stuck: 0 },
  card:    { rest: null, hover: 1 },
  nested:  { rest: null },
  control: { rest: null },
  recess:  { rest: null },
  field:   { rest: null, focus: null },
  knob:    { rest: 0 },
};

export const PRESETS: Record<string, Record<string, Record<string, Delta>>> = {
  rest: DEFAULT_APPLY,
  today: TODAY_APPLY,
  none: {
    header: { rest: null, stuck: null },
    card:    { rest: null, hover: null },
    nested:  { rest: null },
    control: { rest: null },
    recess:  { rest: null },
    field:   { rest: null, focus: null },
    knob:    { rest: null },
  },
};
export const PRESET_LABEL: Record<string, string> = { rest: 'At rest', today: 'Today', none: 'None' };

const rgba = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex).map(c => Math.round(c * 255));
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, a).toFixed(3)})`;
};

/** A rung rendered with a palette's ink. Drop shadows past a soft blur carry
 *  a second tight "contact" layer, as the brand tokens do; inset ones do not. */
export function rungCss(r: Rung, ink: Ink, gray: Record<Step, string>): string {
  if (r.alpha <= 0) return 'none';
  const hex = gray[ink.step] ?? '#000000';
  const a = r.alpha * ink.strength;
  const main = `${r.inset ? 'inset ' : ''}0 ${r.y}px ${r.blur}px ${r.spread}px ${rgba(hex, a)}`;
  if (r.inset || r.blur < 12) return main;
  return `${main}, 0 2px 4px ${rgba(hex, a * 0.4)}`;
}

/** The ladder as seen FROM a level: itself, and the rungs either side.
 *  Clamping lives here, so a delta can never fall off the end. */
export const rungAt = (level: Level, delta: number): Level =>
  LEVELS[Math.max(0, Math.min(LEVELS.length - 1, LEVELS.indexOf(level) + delta))];

/* ── State ──────────────────────────────────────────────────────────── */

export interface State {
  /** Per-step edits. Lightness is ABSOLUTE (it is the ladder itself, and a
   *  value you want to set and read back directly). Hue and saturation are
   *  NUDGES from the global cast, so moving the cast carries your per-step
   *  tweaks with it instead of fighting them. */
  gray: Partial<Record<Step, StepEdit>>;
  /** Slot → step overrides, per palette. */
  assign: Partial<Record<PaletteKey, Partial<Record<Slot, Step>>>>;
  /** Global cast: the ramp's base hue, and its tint strength as a percentage
   *  where 100% = SAT_MAX_C chroma at the ramp's peak. Both absolute. */
  cast: { hue: number | null; sat: number | null };
  /** Shadows, in the four tables above. `ladder` is shared across palettes
   *  (geometry is distance off the page, and should not need to change with
   *  the ground); `ink` is per palette, because a shadow's color and
   *  strength is exactly what the ground does change. */
  shadow: {
    ladder: Record<Level, Rung>;
    ink: Record<PaletteKey, Ink>;
    /** kind → trigger → delta. */
    apply: Record<string, Record<string, Delta>>;
  };
  theme: 'light' | 'dark';
  elev: 'lighter' | 'darker';
}

export const newState = (): State => ({
  gray: {}, assign: {}, cast: { hue: null, sat: null },
  shadow: {
    ladder: structuredClone(DEFAULT_LADDER),
    ink: structuredClone(DEFAULT_INK),
    apply: structuredClone(DEFAULT_APPLY),
  },
  theme: 'light', elev: 'lighter',
});

/* ── The ramp's own shape ────────────────────────────────────────────
   Measured from the brand hex at boot, never hardcoded. Three facts drive
   the control model:

   · hue is 292–301° across every meaningful step, i.e. ONE value, not 17
   · chroma ARCS — near-zero at white, peaking at step 600 (0.0385),
     falling again toward black
   · lightness is the only quantity that genuinely varies per step

   So the global cast owns hue and overall tint strength, each step keeps
   the arc's shape, and per-step hue/sat are offsets on top. */

/** 100% saturation. Tuned to neutrals: the brand's most chromatic step sits
 *  at 0.0385, so it lands near 77% and the whole slider stays usable. */
export const SAT_MAX_C = 0.05;

export interface StepEdit { L?: number; dh?: number; ds?: number }
export interface RampShape {
  hue: number;                        // the ramp's base hue
  satPct: number;                     // brand tint strength, 0–100
  norm: Record<Step, number>;         // each step's share of the arc, 0–1
  L: Record<Step, number>;            // brand lightness per step
}

export function readRampShape(brand: Record<Step, string>): RampShape {
  const oklch = {} as Record<Step, { L: number; C: number; H: number }>;
  for (const s of STEPS) oklch[s] = hexToOklch(brand[s]);

  const peak = Math.max(...STEPS.map(s => oklch[s].C));
  // Hue is only meaningful where there is chroma to carry it — pure white and
  // pure black report arbitrary angles. Weight by chroma so they cannot skew it.
  let x = 0, y = 0;
  for (const s of STEPS) {
    const r = (oklch[s].H * Math.PI) / 180;
    x += Math.cos(r) * oklch[s].C;
    y += Math.sin(r) * oklch[s].C;
  }
  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  const norm = {} as Record<Step, number>;
  const L = {} as Record<Step, number>;
  for (const s of STEPS) {
    norm[s] = peak ? oklch[s].C / peak : 0;
    L[s] = oklch[s].L;
  }
  return { hue, satPct: (peak / SAT_MAX_C) * 100, norm, L };
}

/** Brand values, read from the live stylesheet at boot — never hardcoded. */
export function readBrandGrayscale(): Record<Step, string> {
  const cs = getComputedStyle(document.documentElement);
  const out = {} as Record<Step, string>;
  for (const s of STEPS) {
    const v = cs.getPropertyValue(`--color-grayscale-${s}`).trim();
    out[s] = v || '#000000';
  }
  return out;
}

/** The three values behind a step's sliders, in human units. */
export function stepValues(shape: RampShape, st: State, s: Step) {
  const e = st.gray[s] ?? {};
  const baseHue = st.cast.hue ?? shape.hue;
  const baseSat = (st.cast.sat ?? shape.satPct) * shape.norm[s];
  return {
    L: e.L ?? shape.L[s],
    dh: e.dh ?? 0,
    ds: e.ds ?? 0,
    hue: (baseHue + (e.dh ?? 0) + 360) % 360,
    sat: Math.max(0, baseSat + (e.ds ?? 0)),
    baseSat,
  };
}

/* ── Screen robustness ──────────────────────────────────────────────
   A screen share re-encodes the page as BT.709 Y'CbCr, which quantizes luma
   to integers on a 16–235 scale. A large flat surface whose luma lands halfway
   between two of those integers is UNSTABLE: any small perturbation — a
   different capture path, a re-quantize, a dithered composite — tips it one way
   or the other, and the whole background visibly shifts.

   That is measurable per color, so the editor shows it rather than leaving it
   to be discovered in a presentation. Luma is computed on the GAMMA-ENCODED
   channels, not linearised ones — that is what Y'CbCr actually uses. */

const REC709 = [0.2126, 0.7152, 0.0722] as const;

/** BT.709 luma on the limited (studio) 16–235 scale a screen share encodes to. */
export function lumaCode(hex: string): number {
  const rgb = hexToRgb(hex);
  return 16 + 219 * (REC709[0] * rgb[0] + REC709[1] * rgb[1] + REC709[2] * rgb[2]);
}

/** Distance to the nearest integer luma code. 0 = rock solid, 0.5 = coin flip. */
export const lumaMargin = (hex: string): number => {
  const y = lumaCode(hex);
  return Math.abs(y - Math.round(y));
};

/** Over this, a flat field of that color is liable to flip between two values. */
export const LUMA_UNSTABLE = 0.35;

/**
 * The nearest lightness that lands this step on a stable luma code, searched on
 * the same 0.01 grid the URL can round-trip. Hue and tint are held, so snapping
 * never changes the color's character — only where it sits on the encoder's
 * grid. Returns null when the step is already stable.
 */
export function nearestStableL(
  st: State, shape: RampShape, s: Step, reach = 0.6,
): number | null {
  const v = stepValues(shape, st, s);
  const want = (v.sat / 100) * SAT_MAX_C;
  if (lumaMargin(oklchToHex(v.L, want, v.hue)) <= 0.08) return null;
  let best: { L: number; m: number } | null = null;
  for (let d = -reach; d <= reach + 1e-9; d += 0.01) {
    const L = Math.round((v.L + d) * 100) / 100;
    if (L < 0 || L > 100) continue;
    const m = lumaMargin(oklchToHex(L, want, v.hue));
    if (!best || m < best.m - 1e-9 || (Math.abs(m - best.m) < 1e-9 && Math.abs(L - v.L) < Math.abs(best.L - v.L))) {
      best = { L, m };
    }
  }
  return best && best.L !== v.L ? best.L : null;
}

/**
 * Resolve the effective hex for every step.
 *
 * `clamped` and `quantized` are DIFFERENT failures and were previously reported
 * as one, which told the user "sRGB won't go there" when the truth was usually
 * "8-bit won't go there". At the dark end one code value is worth ~0.43 OKLCH L,
 * so a perfectly in-gamut chroma can still be rounded away.
 *   · clamped   — genuinely outside sRGB; no bit depth would render it
 *   · quantized — inside sRGB as a float, lost to 8-bit rounding
 */
export function resolveGrayscale(
  brand: Record<Step, string>, st: State, shape: RampShape,
): { hex: Record<Step, string>; clamped: Set<Step>; quantized: Set<Step>; unstable: Set<Step> } {
  const hex = {} as Record<Step, string>;
  const clamped = new Set<Step>();
  const quantized = new Set<Step>();
  const unstable = new Set<Step>();
  for (const s of STEPS) {
    const v = stepValues(shape, st, s);
    const want = (v.sat / 100) * SAT_MAX_C;
    const out = oklchToHex(v.L, want, v.hue);
    hex[s] = out;
    // A step whose requested chroma could not be rendered — the slider will
    // appear to stop responding, so it has to say why, and say which reason.
    if (want > 0.0005 && hexToOklch(out).C < want - 0.0008) {
      (inGamut(oklchToRgbRaw(v.L, want, v.hue)) ? quantized : clamped).add(s);
    }
    if (lumaMargin(out) > LUMA_UNSTABLE) unstable.add(s);
  }
  return { hex, clamped, quantized, unstable };
}

export const paletteKey = (st: State): PaletteKey => `${st.theme}-${st.elev}` as PaletteKey;

export const assignedStep = (st: State, pal: PaletteKey, slot: Slot): Step =>
  st.assign[pal]?.[slot] ?? DEFAULT_ASSIGN[pal][slot];

/* ── CSS emission ───────────────────────────────────────────────────── */

/**
 * Scoped to `.mock`, which also outranks _surfaces.css: `.mock[data-elev]` is
 * (0,2,0) against its (0,1,0), and the dark pairing gains the same one-class
 * edge. `.mock` is a descendant of <html>, so `[data-theme="dark"] .mock`
 * resolves correctly — unlike putting data-elev on <html> itself.
 */
export function emitCss(gray: Record<Step, string>, st: State): string {
  const lines: string[] = [];

  lines.push('.mock {');
  for (const s of STEPS) lines.push(`  --color-grayscale-${s}: ${gray[s]};`);
  lines.push('}');

  for (const pal of PALETTES) {
    const [theme, elev] = pal.split('-') as ['light' | 'dark', 'lighter' | 'darker'];
    const sel = theme === 'dark'
      ? `[data-theme="dark"] .mock[data-elev="${elev}"]`
      : `.mock[data-elev="${elev}"]`;
    lines.push(`${sel} {`);
    for (const slot of SLOTS) {
      lines.push(`  --s-${slot}: var(--color-grayscale-${assignedStep(st, pal, slot)});`);
    }
    // Inverse = the opposite mode's palette at the same elevation direction,
    // so an inverse band tracks whatever the palettes are tuned to.
    const invPal = `${theme === 'dark' ? 'light' : 'dark'}-${elev}` as PaletteKey;
    for (const slot of SLOTS) {
      lines.push(`  --s-inv-${slot}: var(--color-grayscale-${assignedStep(st, invPal, slot)});`);
    }
    lines.push('}');
  }

  // Shadows, per palette — all four, not just the two color modes. Under
  // `darker` a raised surface is DARKER than the page, so the same shadow can
  // mean the opposite thing; keying only to light/dark made that untestable.
  for (const pal of PALETTES) {
    const [theme, elev] = pal.split('-') as ['light' | 'dark', 'lighter' | 'darker'];
    const sel = theme === 'dark'
      ? `[data-theme="dark"] .mock[data-elev="${elev}"]`
      : `.mock[data-elev="${elev}"]`;
    lines.push(`${sel} {`);
    // `--s-inv-shadow-*` is the opposite palette's ladder, exactly as
    // `--s-inv-*` is the opposite palette's surfaces — so an inverse block's
    // interior casts onto the ground it actually has.
    const invPal = `${theme === 'dark' ? 'light' : 'dark'}-${elev}` as PaletteKey;
    for (const lvl of LEVELS) {
      lines.push(`  --s-shadow-${lvl}: ${rungCss(st.shadow.ladder[lvl], st.shadow.ink[pal], gray)};`);
    }
    for (const lvl of LEVELS) {
      lines.push(`  --s-inv-shadow-${lvl}: ${rungCss(st.shadow.ladder[lvl], st.shadow.ink[invPal], gray)};`);
    }
    lines.push('}');
  }

  // Each level publishes the ladder AS SEEN FROM ITSELF, with the clamping
  // already applied. A kind's rule is then one line that names a direction
  // rather than a level, which is what lets one rule serve elements sitting
  // at different levels.
  for (const lvl of LEVELS) {
    lines.push(`.mock [data-lvl="${lvl}"] {`);
    for (const d of [-2, -1, 0, 1, 2]) {
      const name = d === 0 ? '--sh-self' : d < 0 ? `--sh-dn${-d}` : `--sh-up${d}`;
      lines.push(`  ${name}: var(--s-shadow-${rungAt(lvl, d)});`);
    }
    lines.push('}');
  }

  // DESCENDANTS ONLY — `[data-inverse] [data-lvl]`, not `[data-inverse][data-lvl]`.
  // The boundary element casts onto the ordinary page and keeps ordinary ink;
  // only its interior sits on inverse ground. Emitted before the level
  // bindings would resolve, and at (0,2,0) it outranks their (0,1,0).
  lines.push('.mock [data-inverse] [data-lvl] {');
  for (const lvl of LEVELS) lines.push(`  --s-shadow-${lvl}: var(--s-inv-shadow-${lvl});`);
  lines.push('}');

  // One rule per kind × trigger. `null` emits nothing at all rather than
  // `box-shadow: none`, so a kind that is off cannot win a cascade race
  // against something else that wants to set a shadow.
  for (const kind of KINDS) {
    for (const tk of kind.triggers) {
      const t = trigger(tk);
      const d = st.shadow.apply[kind.key]?.[tk];
      if (!t || d === null || d === undefined) continue;
      const name = d === 0 ? '--sh-self' : d < 0 ? `--sh-dn${-d}` : `--sh-up${d}`;
      lines.push(`${t.sel(`[data-sh="${kind.key}"]`)} { box-shadow: var(${name}); }`);
    }
  }

  return lines.join('\n');
}

/* ── Export formats ─────────────────────────────────────────────────── */

export function exportCss(brand: Record<Step, string>, gray: Record<Step, string>, st: State): string {
  const out: string[] = [];
  const changed = STEPS.filter(s => gray[s].toLowerCase() !== brand[s].toLowerCase());

  if (changed.length) {
    out.push('/* Grayscale — changed steps only */');
    out.push(':root {');
    for (const s of changed) out.push(`  --color-grayscale-${s}: ${gray[s]};`);
    out.push('}');
  } else {
    out.push('/* Grayscale unchanged from brand */');
  }

  out.push('');
  out.push('/* Surface assignments */');
  for (const pal of PALETTES) {
    const [theme, elev] = pal.split('-') as ['light' | 'dark', 'lighter' | 'darker'];
    const sel = theme === 'dark' ? `[data-theme="dark"] [data-elev="${elev}"]` : `[data-elev="${elev}"]`;
    out.push(`${sel} {`);
    for (const slot of SLOTS) {
      const step = assignedStep(st, pal, slot);
      out.push(`  --s-${slot}: var(--color-grayscale-${step});`.padEnd(46) + `/* ${gray[step]} */`);
    }
    out.push('}');
  }

  // Shadows: the per-palette rungs, then the level bindings, then one rule per
  // kind × trigger. Emitted in the same shape the mock consumes, so what is
  // copied out is what was judged.
  out.push('');
  out.push('/* Shadow ladder — per palette */');
  for (const pal of PALETTES) {
    const [theme, elev] = pal.split('-') as ['light' | 'dark', 'lighter' | 'darker'];
    const sel = theme === 'dark' ? `[data-theme="dark"] [data-elev="${elev}"]` : `[data-elev="${elev}"]`;
    const invPal = `${theme === 'dark' ? 'light' : 'dark'}-${elev}` as PaletteKey;
    out.push(`${sel} {`);
    for (const lvl of LEVELS) out.push(`  --s-shadow-${lvl}: ${rungCss(st.shadow.ladder[lvl], st.shadow.ink[pal], gray)};`);
    for (const lvl of LEVELS) out.push(`  --s-inv-shadow-${lvl}: ${rungCss(st.shadow.ladder[lvl], st.shadow.ink[invPal], gray)};`);
    out.push('}');
  }
  out.push('');
  out.push('/* Each level, as seen from itself — clamping already applied */');
  // Only the deltas actually in use. A hardcoded -1/0/+1 exported CSS that
  // referenced --sh-up2 without defining it the moment any kind was set to +2,
  // which DELTAS offers. Deriving the set cannot drift.
  const usedDeltas = [...new Set([0, ...Object.values(st.shadow.apply)
    .flatMap(t => Object.values(t))
    .filter((d): d is number => typeof d === 'number')])].sort((a, b) => a - b);
  for (const lvl of LEVELS) {
    out.push(`[data-lvl="${lvl}"] {`);
    for (const d of usedDeltas) {
      const name = d === 0 ? '--sh-self' : d < 0 ? `--sh-dn${-d}` : `--sh-up${d}`;
      out.push(`  ${name}: var(--s-shadow-${rungAt(lvl, d)});`);
    }
    out.push('}');
  }
  out.push('');
  out.push('/* Inside an inverse block, cast with the opposite palette\'s ink — a');
  out.push('   shadow falls on the ground BENEATH the element. Descendants only: the');
  out.push('   block itself sits on the ordinary page and keeps ordinary ink. */');
  out.push('[data-inverse] [data-lvl] {');
  for (const lvl of LEVELS) out.push(`  --s-shadow-${lvl}: var(--s-inv-shadow-${lvl});`);
  out.push('}');
  out.push('');
  out.push('/* Applied to */');
  for (const kind of KINDS) {
    for (const tk of kind.triggers) {
      const t = trigger(tk);
      const d = st.shadow.apply[kind.key]?.[tk];
      if (!t || d === null || d === undefined) continue;
      const name = d === 0 ? '--sh-self' : d < 0 ? `--sh-dn${-d}` : `--sh-up${d}`;
      out.push(`${t.sel(`[data-sh="${kind.key}"]`).replace(/\.mock ?/g, '')} { box-shadow: var(${name}); }`);
    }
  }

  return out.join('\n');
}

export function exportJson(brand: Record<Step, string>, gray: Record<Step, string>, st: State): string {
  const grayDiff: Record<string, string> = {};
  for (const s of STEPS) if (gray[s].toLowerCase() !== brand[s].toLowerCase()) grayDiff[s] = gray[s];

  const assign: Record<string, Record<string, string>> = {};
  for (const pal of PALETTES) {
    const d: Record<string, string> = {};
    for (const slot of SLOTS) {
      const step = assignedStep(st, pal, slot);
      if (step !== DEFAULT_ASSIGN[pal][slot]) d[slot] = step;
    }
    if (Object.keys(d).length) assign[pal] = d;
  }

  return JSON.stringify({
    grayscale: grayDiff,
    assignments: assign,
    cast: st.cast.hue !== null || st.cast.sat !== null ? st.cast : undefined,
    resolved: Object.fromEntries(
      PALETTES.map(p => [p, Object.fromEntries(SLOTS.map(s => [s, gray[assignedStep(st, p, s)]]))]),
    ),
    shadow: {
      ladder: st.shadow.ladder,
      ink: st.shadow.ink,
      apply: st.shadow.apply,
      resolved: Object.fromEntries(
        PALETTES.map(p => [p, Object.fromEntries(
          LEVELS.map(l => [l, rungCss(st.shadow.ladder[l], st.shadow.ink[p], gray)]),
        )]),
      ),
    },
  }, null, 2);
}

/* ── URL encoding — diffs only, so a small tweak stays a short link ─── */

export function encodeUrl(brand: Record<Step, string>, gray: Record<Step, string>, st: State): string {
  const p = new URLSearchParams();
  if (st.theme !== 'light') p.set('t', st.theme);
  if (st.elev !== 'lighter') p.set('s', st.elev);

  // step:L_dh_ds — trailing zero fields dropped, so a lightness-only edit
  // stays short. Underscores keep negative offsets readable.
  //
  // TWO decimals on lightness, not one. SHIFT+drag already produced 0.05
  // increments and `toFixed(1)` silently rounded them away on re-encode, so a
  // fine-tuned value could not survive being shared — or even the editor's own
  // next edit. That matters most for luma snapping, where the whole point is a
  // sub-0.1 offset. Trailing zeros are trimmed, so ordinary values stay short.
  const g = STEPS.filter(s => st.gray[s]).map(s => {
    const e = st.gray[s]!;
    const parts = [
      e.L !== undefined ? String(Math.round(e.L * 100) / 100) : '',
      e.dh ? String(Math.round(e.dh)) : '',
      e.ds ? String(Math.round(e.ds)) : '',
    ];
    while (parts.length && parts[parts.length - 1] === '') parts.pop();
    return `${s}:${parts.join('_')}`;
  });
  if (g.length) p.set('g', g.join(','));

  const a: string[] = [];
  for (const pal of PALETTES) {
    for (const slot of SLOTS) {
      const v = st.assign[pal]?.[slot];
      if (v && v !== DEFAULT_ASSIGN[pal][slot]) a.push(`${pal}.${slot}:${v}`);
    }
  }
  if (a.length) p.set('a', a.join(','));

  if (st.cast.hue !== null) p.set('ch', String(Math.round(st.cast.hue)));
  if (st.cast.sat !== null) p.set('cs', String(Math.round(st.cast.sat)));

  // Shadows, three keys so each table stays independently readable in a link.
  // Diffs only — a one-value tweak stays short.
  const shl = LEVELS.filter(l => {
    const a = st.shadow.ladder[l], d = DEFAULT_LADDER[l];
    return a.y !== d.y || a.blur !== d.blur || a.spread !== d.spread || a.alpha !== d.alpha || a.inset !== d.inset;
  }).map(l => {
    const a = st.shadow.ladder[l];
    // UNDERSCORE, not dot. `alpha` and `strength` are decimals, so a dot
    // separator collides with their own decimal point: 0.5 encoded into a
    // dot-joined tuple splits into two fields and decodes as 0 — i.e. every
    // shared link silently lost its alpha, which for a shadow means it
    // vanished. Matches the grayscale encoding, which already uses `_`.
    return `${l}:${a.y}_${a.blur}_${a.spread}_${a.alpha}_${a.inset ? 1 : 0}`;
  });
  if (shl.length) p.set('shl', shl.join(','));

  const shi = PALETTES.filter(pal => {
    const a = st.shadow.ink[pal], d = DEFAULT_INK[pal];
    return a.step !== d.step || a.strength !== d.strength;
  }).map(pal => `${pal}:${st.shadow.ink[pal].step}_${st.shadow.ink[pal].strength}`);
  if (shi.length) p.set('shi', shi.join(','));

  const sha: string[] = [];
  for (const kind of KINDS) {
    for (const tk of kind.triggers) {
      const a = st.shadow.apply[kind.key]?.[tk];
      const d = DEFAULT_APPLY[kind.key]?.[tk];
      if (a !== d) sha.push(`${kind.key}.${tk}:${a === null ? 'x' : a}`);
    }
  }
  if (sha.length) p.set('sha', sha.join(','));


  const q = p.toString();
  return q ? `${location.pathname}?${q}` : location.pathname;
}

export function decodeUrl(st: State, search: string): State {
  const p = new URLSearchParams(search);

  const t = p.get('t');
  if (t === 'dark' || t === 'light') st.theme = t;
  const s = p.get('s');
  if (s === 'darker' || s === 'lighter') st.elev = s;

  const g = p.get('g');
  if (g) {
    for (const pair of g.split(',')) {
      const [step, spec] = pair.split(':');
      if (!(STEPS as readonly string[]).includes(step)) continue;
      const [L, dh, ds] = (spec || '').split('_').map(v => (v === '' ? undefined : Number(v)));
      const e: StepEdit = {};
      if (L !== undefined && !Number.isNaN(L)) e.L = L;
      if (dh !== undefined && !Number.isNaN(dh)) e.dh = dh;
      if (ds !== undefined && !Number.isNaN(ds)) e.ds = ds;
      if (Object.keys(e).length) st.gray[step as Step] = e;
    }
  }

  const a = p.get('a');
  if (a) {
    for (const item of a.split(',')) {
      const [path, step] = item.split(':');
      const [pal, slot] = (path || '').split('.');
      if (
        (PALETTES as readonly string[]).includes(pal) &&
        (SLOTS as readonly string[]).includes(slot) &&
        (STEPS as readonly string[]).includes(step)
      ) {
        (st.assign[pal as PaletteKey] ||= {})[slot as Slot] = step as Step;
      }
    }
  }

  const ch = p.get('ch');
  if (ch !== null && !Number.isNaN(Number(ch))) st.cast.hue = Number(ch);
  const cs = p.get('cs');
  if (cs !== null && !Number.isNaN(Number(cs))) st.cast.sat = Number(cs);

  // Every branch below SKIPS what it does not recognise rather than throwing.
  // That is deliberate: links get passed back and forth while the tables are
  // still growing, so a link written before a kind or trigger existed must
  // still load, and one written after must degrade rather than break.
  const shl = p.get('shl');
  if (shl) {
    for (const item of shl.split(',')) {
      const [lvl, val] = item.split(':');
      if (!(LEVELS as readonly string[]).includes(lvl)) continue;
      const [y, blur, spread, alpha, inset] = (val || '').split('_').map(Number);
      if ([y, blur, spread, alpha].some(Number.isNaN)) continue;
      st.shadow.ladder[lvl as Level] = { y, blur, spread, alpha, inset: inset === 1 };
    }
  }

  const shi = p.get('shi');
  if (shi) {
    for (const item of shi.split(',')) {
      const [pal, val] = item.split(':');
      if (!(PALETTES as readonly string[]).includes(pal)) continue;
      const [step, strength] = (val || '').split('_');
      if (!(STEPS as readonly string[]).includes(step) || Number.isNaN(Number(strength))) continue;
      st.shadow.ink[pal as PaletteKey] = { step: step as Step, strength: Number(strength) };
    }
  }

  const sha = p.get('sha');
  if (sha) {
    for (const item of sha.split(',')) {
      const [path, val] = item.split(':');
      const [kind, tk] = (path || '').split('.');
      const k = KINDS.find(x => x.key === kind);
      if (!k || !k.triggers.includes(tk)) continue;
      if (val === 'x') { (st.shadow.apply[kind] ||= {})[tk] = null; continue; }
      if (Number.isNaN(Number(val))) continue;
      (st.shadow.apply[kind] ||= {})[tk] = Number(val);
    }
  }

  return st;
}
