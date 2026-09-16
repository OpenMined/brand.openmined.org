/**
 * SURFACE ROUND — live colour editor
 * ════════════════════════════════════════════════════════════════════
 * Two layers of state, deliberately kept separate:
 *
 *   1. GRAYSCALE  — what hex each of the 17 brand steps actually is.
 *                   This is the only place a real colour value is chosen.
 *   2. ASSIGNMENT — which step each surface slot points at.
 *                   Slots can only ever hold a step, never a raw colour,
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

/* ── Colour maths (sRGB ↔ OKLCH), ported from the round-1A derivation ── */

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

export const PALETTE_LABEL: Record<PaletteKey, string> = {
  'light-lighter': 'Light · raised lighter',
  'light-darker':  'Light · raised darker',
  'dark-lighter':  'Dark · raised lighter',
  'dark-darker':   'Dark · raised darker',
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

/* ── Outlines ───────────────────────────────────────────────────────── */

export const BORDER_MODES = ['all', 'selective', 'none'] as const;
export type BorderMode = typeof BORDER_MODES[number];

export const BORDER_LABEL: Record<BorderMode, string> = {
  all: 'All',
  selective: 'Selective',
  none: 'None',
};
export const BORDER_HELP: Record<BorderMode, string> = {
  all: 'Every card, panel and control outlined — today\u2019s behaviour.',
  selective: 'Outlines only on recessed controls and dividers. Cards rely on surface value alone.',
  none: 'No outlines anywhere. The purest read of whether the value steps carry the hierarchy.',
};

/* ── Shadows ────────────────────────────────────────────────────────── */

export interface ShadowSpec { y: number; blur: number; spread: number; alpha: number }
export interface ShadowSet { step: Step; sm: ShadowSpec; md: ShadowSpec; lg: ShadowSpec }
export const SHADOW_SIZES = ['sm', 'md', 'lg'] as const;
export type ShadowSize = typeof SHADOW_SIZES[number];

/**
 * Light defaults are the brand's shipped tokens, decomposed:
 *   --shadow-sm: 0 2px 4px #46425729                     (grayscale-700 @ .16)
 *   --shadow-md: 0 16px 32px -4px #4642571a, 0 2px 4px #4642570a
 *   --shadow-lg: 0 24px 48px -8px #4642571f, 0 2px 4px #4642570a
 * Dark has no shipped equivalent — the brand never defined one, which is
 * part of why dark elevation reads inconsistently. These are a starting
 * proposal: near-black and far more opaque, because a #464257 shadow on a
 * #23202c ground is effectively invisible.
 */
export const DEFAULT_SHADOW: Record<'light' | 'dark', ShadowSet> = {
  light: {
    step: '700',
    sm: { y: 2,  blur: 4,  spread: 0,  alpha: 0.16 },
    md: { y: 16, blur: 32, spread: -4, alpha: 0.10 },
    lg: { y: 24, blur: 48, spread: -8, alpha: 0.12 },
  },
  dark: {
    step: '1000',
    sm: { y: 2,  blur: 4,  spread: 0,  alpha: 0.40 },
    md: { y: 16, blur: 32, spread: -4, alpha: 0.45 },
    lg: { y: 24, blur: 48, spread: -8, alpha: 0.50 },
  },
};

const rgba = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex).map(c => Math.round(c * 255));
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
};

/** md and lg carry a second tight "contact" layer, as the brand tokens do. */
export function shadowCss(set: ShadowSet, size: ShadowSize, gray: Record<Step, string>): string {
  const c = gray[set.step] ?? '#000000';
  const s = set[size];
  const main = `0 ${s.y}px ${s.blur}px ${s.spread}px ${rgba(c, s.alpha)}`;
  if (size === 'sm') return main;
  return `${main}, 0 2px 4px ${rgba(c, s.alpha * 0.4)}`;
}

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
  /** Outline policy. `selective` is the interesting one: outlines only where
   *  they do structural work (recessed controls, dividers inside a card) and
   *  NOT as a default ring around every card. */
  borders: BorderMode;
  /** Shadows are held PER COLOUR MODE. A shadow tuned on a light ground is
   *  almost never right on a dark one — it needs a different colour and a
   *  much higher alpha to register at all. */
  shadow: Record<'light' | 'dark', ShadowSet>;
  theme: 'light' | 'dark';
  elev: 'lighter' | 'darker';
}

export const newState = (): State => ({
  gray: {}, assign: {}, cast: { hue: null, sat: null },
  borders: 'selective',
  shadow: structuredClone(DEFAULT_SHADOW),
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

/** Resolve the effective hex for every step, plus which ones sRGB clamped. */
export function resolveGrayscale(
  brand: Record<Step, string>, st: State, shape: RampShape,
): { hex: Record<Step, string>; clamped: Set<Step> } {
  const hex = {} as Record<Step, string>;
  const clamped = new Set<Step>();
  for (const s of STEPS) {
    const v = stepValues(shape, st, s);
    const want = (v.sat / 100) * SAT_MAX_C;
    const out = oklchToHex(v.L, want, v.hue);
    hex[s] = out;
    // A step whose requested chroma could not be rendered — the slider will
    // appear to stop responding, so it has to say why.
    if (want > 0.0005 && hexToOklch(out).C < want - 0.0008) clamped.add(s);
  }
  return { hex, clamped };
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

  for (const mode of ['light', 'dark'] as const) {
    const sel = mode === 'dark' ? '[data-theme="dark"] .mock' : '.mock';
    lines.push(`${sel} {`);
    for (const size of SHADOW_SIZES) {
      lines.push(`  --s-shadow-${size}: ${shadowCss(st.shadow[mode], size, gray)};`);
    }
    lines.push('}');
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
  }, null, 2);
}

/* ── URL encoding — diffs only, so a small tweak stays a short link ─── */

export function encodeUrl(brand: Record<Step, string>, gray: Record<Step, string>, st: State): string {
  const p = new URLSearchParams();
  if (st.theme !== 'light') p.set('t', st.theme);
  if (st.elev !== 'lighter') p.set('s', st.elev);

  // step:L_dh_ds — trailing zero fields dropped, so a lightness-only edit
  // stays short. Underscores keep negative offsets readable.
  const g = STEPS.filter(s => st.gray[s]).map(s => {
    const e = st.gray[s]!;
    const parts = [
      e.L !== undefined ? e.L.toFixed(1) : '',
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

  if (st.borders !== 'selective') p.set('b', st.borders);

  // Shadows: mode.size:y.blur.spread.alpha — only what differs from default.
  const sh: string[] = [];
  for (const mode of ['light', 'dark'] as const) {
    if (st.shadow[mode].step !== DEFAULT_SHADOW[mode].step) sh.push(`${mode}.step:${st.shadow[mode].step}`);
    for (const size of SHADOW_SIZES) {
      const a = st.shadow[mode][size], d = DEFAULT_SHADOW[mode][size];
      if (a.y !== d.y || a.blur !== d.blur || a.spread !== d.spread || a.alpha !== d.alpha) {
        sh.push(`${mode}.${size}:${a.y}.${a.blur}.${a.spread}.${a.alpha}`);
      }
    }
  }
  if (sh.length) p.set('sh', sh.join(','));

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

  const b = p.get('b');
  if (b && (BORDER_MODES as readonly string[]).includes(b)) st.borders = b as BorderMode;

  const sh = p.get('sh');
  if (sh) {
    for (const item of sh.split(',')) {
      const [path, val] = item.split(':');
      const [mode, key] = (path || '').split('.');
      if (mode !== 'light' && mode !== 'dark') continue;
      if (key === 'step') {
        if ((STEPS as readonly string[]).includes(val)) st.shadow[mode].step = val as Step;
        continue;
      }
      if (!(SHADOW_SIZES as readonly string[]).includes(key)) continue;
      const [y, blur, spread, alpha] = (val || '').split('.').map(Number);
      if ([y, blur, spread, alpha].some(Number.isNaN)) continue;
      st.shadow[mode][key as ShadowSize] = { y, blur, spread, alpha };
    }
  }

  return st;
}
