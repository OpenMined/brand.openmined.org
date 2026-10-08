/**
 * BRAND-V2 — LEGACY WORKING VALUES (frozen 2026-10-08).
 *
 * The pre-v2 working favorites as they stood when the 50–950 spectrum was
 * approved: 17-step gray (00–1000), 7-step hues (100–700, key 400). Kept only
 * so the closed rounds that document that state (naming, spectrum) keep
 * rendering what was reviewed. Do not use for new work: the working values now
 * come from the v2 build (src/tokens/v2/), read by ./_working.ts.
 *
 * Sources, as they were:
 *   palette   ./color/_palettes.json — Ink, offsets light ×1.10 / dark ×0.95
 *   surfaces  brand-v2-lab/rounds/working-surface-colors.md
 *   shadows   the surfaces round's settled ladder
 */
import data from './color/_palettes.json';

export type Mode = 'light' | 'dark';
export const MODES: Mode[] = ['light', 'dark'];
export const PALETTE = 'ink';
export const SAT: Record<Mode, number> = { light: 1.1, dark: 0.95 };

/* ── OKLCH ⇄ sRGB — the same maths as ./color/_adjust.ts ──────────── */
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklch(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L * 100, Math.hypot(A, B), ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
}

function oklchToRgb(L: number, C: number, H: number): number[] {
  const h = (H * Math.PI) / 180, Lf = L / 100, A = C * Math.cos(h), B = C * Math.sin(h);
  const l = (Lf + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (Lf - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (Lf - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: number[]) => rgb.every(c => c >= -1e-4 && c <= 1 + 1e-4);

/** Gamut-map by reducing chroma, holding lightness and hue — as generate.py. */
export function oklchToHex(L: number, C: number, H: number): string {
  let rgb = oklchToRgb(L, C, H);
  if (!inGamut(rgb)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToRgb(L, mid, H))) lo = mid; else hi = mid; }
    rgb = oklchToRgb(L, lo, H);
  }
  return '#' + rgb.map(c => Math.round(Math.min(Math.max(gam(Math.min(Math.max(c, 0), 1)), 0), 1) * 255).toString(16).padStart(2, '0')).join('');
}

const saturate = (hex: string, s: number) => { const [L, C, H] = hexToOklch(hex); return oklchToHex(L, C * s, H); };

export const oklchOf = hexToOklch;

/** WCAG 2 contrast ratio. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16);
    const [r, g, bl] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/* ── Palette ──────────────────────────────────────────────────────── */
const P = (data.palettes as any)[PALETTE];
export const HUES = data.hues as string[];
export const STEPS = data.steps as number[];
/** The key (400) of each hue as the generator defines it — L, C, H in OKLCH. */
export const KEY_PARAMS = P.params as Record<string, { H: number; C: number; L: number }>;

/** Every ramp step, resolved for a mode (offset applied). */
export function ramp(mode: Mode): Record<string, Record<number, string>> {
  return Object.fromEntries(HUES.map(h => [h, Object.fromEntries(STEPS.map(s => [s, saturate(P.ramps[h][String(s)], SAT[mode])]))]));
}

/** The nine gradient stops, resolved. `ref` names the ramp step a family stop is. */
export const SPECTRUM = data.spectrum as string[];
export function gradient(mode: Mode): { name: string; hex: string; ref: string | null }[] {
  const r = ramp(mode);
  return (P.gradient as string[]).map((hex, i) => {
    const ref = P.gradient_ref[i] as string | null;
    if (!ref) return { name: SPECTRUM[i], hex: saturate(hex, SAT[mode]), ref };
    const [h, s] = ref.split('-');
    return { name: SPECTRUM[i], hex: r[h][+s], ref };
  });
}

/** Chart series order, as validated by the generator. */
export const SERIES = data.categorical as string[];

/* ── Gray: the one neutral ramp ───────────────────────────────────────
   The released grayscale (main's tokens.css) with the eight steps the
   surfaces round re-tuned (brand-v2-lab/rounds/working-surface-colors.md:
   100, 150, 200, 300, 800, 850, 900, 950). The only neutral hexes in the
   working values: every surface, line, text, ink and label below names a
   step. No saturation offset; the neutrals hold across modes. */
export const GRAY_STEPS = ['00', '50', '100', '150', '200', '300', '400', '500', '550', '600', '700', '750', '800', '850', '900', '950', '1000'];
export const GRAY: Record<string, string> = {
  '00': '#ffffff', '50': '#fcfcfd', '100': '#fafafc', '150': '#f3f3f6', '200': '#e6e5e9',
  '300': '#dddde2', '400': '#cfcdd6', '500': '#b4b0bf', '550': '#868394', '600': '#5e5a72',
  '700': '#464257', '750': '#353243', '800': '#282635', '850': '#221f2c', '900': '#1b1824',
  '950': '#16141b', '1000': '#000000',
};
const g = (step: string) => {
  if (!(step in GRAY)) throw new Error(`gray ${step} is not a step`);
  return GRAY[step];
};

/* ── Surfaces, lines, text — each names a gray step per mode ──────── */
export type Slot = { token: string; name: string; hex: string; step: string };
const slot = (token: string, name: string, step: string): Slot => ({ token, name, hex: g(step), step });
export const SURFACES: Record<Mode, Slot[]> = {
  light: [
    slot('sunken', 'sunken (−1)', '300'),
    slot('base', 'base (0)', '150'),
    slot('raise-1', 'raise-1 (+1)', '100'),
    slot('raise-2', 'raise-2 (+2)', '00'),
  ],
  dark: [
    slot('sunken', 'sunken (−1)', '950'),
    slot('base', 'base (0)', '900'),
    slot('raise-1', 'raise-1 (+1)', '850'),
    slot('raise-2', 'raise-2 (+2)', '800'),
  ],
};
// The generator's JSON carries the same surfaces; fail the build if they part.
for (const m of MODES) for (const s of SURFACES[m]) {
  const json = (data.surfaces as any)[m][s.token];
  if (json.toLowerCase() !== s.hex) throw new Error(`surface ${m} ${s.token}: gray ${s.step} is ${s.hex}, _palettes.json has ${json}`);
}
// text-muted is a placeholder snapped to the nearest step, not a decision:
// the type round chooses it. Dark 550 is 4.0:1 on raise-2.
export const LINES_TEXT: Record<Mode, Slot[]> = {
  light: [
    slot('line', 'line', '300'),
    slot('line-strong', 'line-strong', '400'),
    slot('text-headline', 'text-headline', '850'),
    slot('text-body', 'text-body', '750'),
    slot('text-muted', 'text-muted', '600'),
  ],
  dark: [
    slot('line', 'line', '750'),
    slot('line-strong', 'line-strong', '700'),
    slot('text-headline', 'text-headline', '50'),
    slot('text-body', 'text-body', '400'),
    slot('text-muted', 'text-muted', '550'),
  ],
};

/* ── Shadows: one ladder, bound to the levels; ink per mode ───────── */
/** A gray step as `r g b`, for alpha'd shadow ink. */
const rgbOf = (step: string) => { const n = parseInt(g(step).slice(1), 16); return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`; };
export const SHADOW_INK: Record<Mode, string> = { light: '700', dark: '1000' };
const ink = (m: Mode, a: number) => `rgb(${rgbOf(SHADOW_INK[m])} / ${a})`;
export const SHADOWS: Record<Mode, Record<'sunken' | 'raise-1' | 'raise-2', string>> = {
  light: {
    sunken: `inset 0 1px 5px 0 ${ink('light', 0.07)}`,
    'raise-1': `0 2px 10px -4px ${ink('light', 0.05)}`,
    'raise-2': `0 6px 16px -4px ${ink('light', 0.12)}, 0 2px 4px ${ink('light', 0.048)}`,
  },
  dark: {
    sunken: `inset 0 1px 5px 0 ${ink('dark', 0.196)}`,
    'raise-1': `0 2px 10px -4px ${ink('dark', 0.14)}`,
    'raise-2': `0 6px 16px -4px ${ink('dark', 0.336)}, 0 2px 4px ${ink('dark', 0.134)}`,
  },
};

/* ── Roles (interfaces) — a role names a different step per mode ─── */
export const ROLES: { role: string; light: number; dark: number; use: string }[] = [
  { role: 'tint', light: 100, dark: 700, use: 'Badge, callout, selected-row background' },
  { role: 'soft', light: 200, dark: 600, use: 'Decorative rule, selected outline, area fill' },
  { role: 'fg', light: 500, dark: 300, use: 'Colored text, links, icons' },
  { role: 'key', light: 400, dark: 400, use: 'Marks with no text: chart series, dots, progress, strokes' },
  { role: 'solid', light: 500, dark: 300, use: 'Fills carrying a label: buttons, solid badges, checked controls' },
  { role: 'hover', light: 600, dark: 200, use: 'One step past solid' },
];
export const STATUS: Record<string, string> = { success: 'green', warning: 'amber', danger: 'red', info: 'blue' };
/** Accent "none": the interface is grayscale; color is spent on status and data. */
export const ACCENT_NONE_STEPS: Record<Mode, Record<string, string>> = {
  light: { solid: '850', hover: '750', on: '50', tint: '300', soft: '400' },
  dark: { solid: '50', hover: '400', on: '950', tint: '750', soft: '700' },
};
export const ACCENT_NONE: Record<Mode, Record<string, string>> = Object.fromEntries(MODES.map(m =>
  [m, Object.fromEntries(Object.entries(ACCENT_NONE_STEPS[m]).map(([k, s]) => [k, g(s)]))])) as Record<Mode, Record<string, string>>;
export const ON_SOLID_STEP: Record<Mode, string> = { light: '00', dark: '950' };
export const ON_SOLID: Record<Mode, string> = { light: g('00'), dark: g('950') };
/** Label ink on light and dark fills (swatch readouts). */
export const LABEL_INK = { onLight: g('850'), onDark: g('50') };

/* ── The page's own CSS custom properties ─────────────────────────── */
const surfVars = (m: Mode) => {
  // Each neutral resolves through its gray step, never a copied hex.
  const t = Object.fromEntries([...SURFACES[m], ...LINES_TEXT[m]].map(s => [s.token, `var(--gray-${s.step})`]));
  return [
    `--c-white:var(--gray-00)`, `--label-ink:var(--gray-850)`, `--c-sunken:${t.sunken}`, `--c-base:${t.base}`, `--c-raise-1:${t['raise-1']}`, `--c-raise-2:${t['raise-2']}`,
    `--c-line:${t.line}`, `--c-line-strong:${t['line-strong']}`, `--c-h:${t['text-headline']}`, `--c-b:${t['text-body']}`, `--c-m:${t['text-muted']}`,
    `--c-ink:${t['text-headline']}`, `--c-on-ink:var(--gray-${m === 'light' ? '50' : '950'})`, `--connector:var(--gray-550)`,
    `--c-shadow-in:${SHADOWS[m].sunken}`, `--c-shadow-1:${SHADOWS[m]['raise-1']}`, `--c-shadow-2:${SHADOWS[m]['raise-2']}`,
    `color-scheme:${m}`,
  ].join(';');
};

function paletteVars(m: Mode): string {
  const r = ramp(m), d: string[] = [];
  for (const s of GRAY_STEPS) d.push(`--gray-${s}:${GRAY[s]}`);
  for (const h of HUES) for (const s of STEPS) d.push(`--${h}-${s}:${r[h][s]}`);
  // Gradient: family stops are the palette's own keys; the fitted stops
  // carry their own value and take the same offset.
  gradient(m).forEach((g, i) => d.push(`--spec-${i + 1}:${g.ref ? `var(--${g.ref})` : g.hex}`));
  // Graphics use fixed ramp steps, never roles. `key` is only a name for
  // 400, the same step in both modes.
  for (const h of HUES) d.push(`--${h}-key:var(--${h}-400)`);
  return d.join(';');
}

/** Custom properties for round pages. [data-stage] lets a figure pin a mode. */
export const TOKEN_CSS = [
  `:root,[data-stage="light"]{${surfVars('light')};${paletteVars('light')}}`,
  `:root[data-theme="dark"],[data-stage="dark"]{${surfVars('dark')};${paletteVars('dark')}}`,
].join('\n');

/* ── Downloads ────────────────────────────────────────────────────── */
const HEADER = `OpenMined brand-v2 — working favorites (not final).
Palette: Ink, saturation offset light x${SAT.light} / dark x${SAT.dark}. Surfaces: display-adjusted working surface colors.
Generated from the brand.openmined.org rounds; do not edit by hand.`;

/** tokens.css — light on :root, dark on [data-theme="dark"]. */
export function tokensCss(): string {
  const block = (m: Mode) => {
    const r = ramp(m), out: string[] = [];
    if (m === 'light') {
      out.push('  /* Gray — one neutral ramp, the same in both modes */');
      for (let i = 0; i < GRAY_STEPS.length; i += 6) out.push(`  ${GRAY_STEPS.slice(i, i + 6).map(s => `--gray-${s}: ${GRAY[s]};`).join(' ')}`);
      out.push('');
    }
    out.push('  /* Surfaces (four levels), lines, text — each names a gray step */');
    for (const s of [...SURFACES[m], ...LINES_TEXT[m]]) out.push(`  --${s.token}: var(--gray-${s.step});`);
    out.push('', '  /* Shadows — one rung per level; base casts nothing */');
    for (const [k, v] of Object.entries(SHADOWS[m])) out.push(`  --shadow-${k}: ${v};`);
    out.push('', '  /* Palette — 6 hues x 7 steps. Graphics use these steps directly. */');
    for (const h of HUES) out.push(`  ${STEPS.map(s => `--${h}-${s}: ${r[h][s]};`).join(' ')}`);
    out.push('', '  /* Gradient — nine stops; family stops are the 400 keys */');
    gradient(m).forEach((g, i) => out.push(`  --gradient-${i + 1}: ${g.hex}; /* ${g.name}${g.ref ? ` = ${g.ref}` : ', fitted'} */`));
    out.push(`  --gradient: linear-gradient(90deg, ${gradient(m).map((_, i) => `var(--gradient-${i + 1})`).join(', ')});`);
    out.push('', '  /* Interface roles — each names a step for this mode */');
    for (const h of HUES) out.push(`  ${ROLES.map(x => `--${h}-${x.role}: var(--${h}-${x[m]});`).join(' ')}`);
    out.push(`  --on-solid: var(--gray-${ON_SOLID_STEP[m]});`);
    for (const [k, h] of Object.entries(STATUS)) out.push(`  --${k}: var(--${h}-solid);`);
    for (const [k, v] of Object.entries(ACCENT_NONE_STEPS[m])) out.push(`  --accent-${k}: var(--gray-${v});`);
    SERIES.forEach((h, i) => out.push(`  --series-${i + 1}: var(--${h}-400);`));
    return out.join('\n');
  };
  return `/* ${HEADER} */\n\n:root {\n${block('light')}\n}\n\n[data-theme="dark"] {\n${block('dark')}\n}\n`;
}

/** tokens.json — W3C design-tokens format, one set per color mode. */
export function tokensJson(): string {
  const c = (hex: string, description?: string) => ({ $type: 'color', $value: hex, ...(description ? { $description: description } : {}) });
  const gref = (s: Slot) => c(`{gray.${s.step}}`);
  const set = (m: Mode) => {
    const r = ramp(m);
    return {
      surface: Object.fromEntries(SURFACES[m].map(s => [s.token, gref(s)])),
      line: Object.fromEntries(LINES_TEXT[m].filter(s => s.token.startsWith('line')).map(s => [s.token, gref(s)])),
      text: Object.fromEntries(LINES_TEXT[m].filter(s => s.token.startsWith('text')).map(s => [s.token.replace('text-', ''), gref(s)])),
      palette: Object.fromEntries(HUES.map(h => [h, Object.fromEntries(STEPS.map(s => [String(s), c(r[h][s], s === 400 ? 'key — marks only, no text' : undefined)]))])),
      gradient: Object.fromEntries(gradient(m).map((g, i) => [`${i + 1}-${g.name}`, c(g.hex, g.ref ? `= ${g.ref}` : 'fitted to the palette')])),
      shadow: Object.fromEntries(Object.entries(SHADOWS[m]).map(([k, v]) => [k, { $type: 'shadow', $value: v }])),
    };
  };
  const gray = Object.fromEntries(GRAY_STEPS.map(s => [s, c(GRAY[s])]));
  return JSON.stringify({ $description: HEADER, gray, light: set('light'), dark: set('dark') }, null, 2) + '\n';
}

/* ── The color round's role layer, for reusing its blocks ─────────────
   Mirrors color/index.astro's generated CSS (roles, rings, accent none,
   status, series, diagram neutrals, --spectrum) for the working palette
   only, so its ramps / roles / series / gradient markup renders as-is. */
export const ROLE_HUE: Record<string, string | null> = { accent: null, success: 'green', warning: 'amber', danger: 'red', info: 'blue' };
export const ROLE_ROWS = [
  { role: 'tint', light: 100, dark: 700, use: 'Badge, callout, selected-row background' },
  { role: 'soft', light: 200, dark: 600, use: 'Decorative rule, selected outline, area fill' },
  { role: 'fg', light: 500, dark: 300, use: 'Colored text, links, icons — AA on every surface' },
  { role: 'key', light: 400, dark: 400, use: 'Marks with no text: chart series, dots, progress, strokes' },
  { role: 'solid', light: 500, dark: 300, use: 'Fills carrying a label: white in light, ink in dark, every hue' },
];
export function roleCss(): string {
  const out: string[] = [];
  for (const m of MODES) {
    const r = ramp(m), base = SURFACES[m][1].hex, d: string[] = [];
    const [fg, tint, soft, hover] = m === 'light' ? [500, 100, 200, 600] : [300, 700, 600, 200];
    for (const h of HUES) {
      const ring = contrast(r[h][400], base) >= 3 ? 400 : fg;
      d.push(`--${h}-fg:var(--${h}-${fg})`, `--${h}-solid:var(--${h}-${fg})`, `--${h}-tint:var(--${h}-${tint})`,
        `--${h}-soft:var(--${h}-${soft})`, `--${h}-on:var(--on-solid)`, `--${h}-ring:var(--${h}-${ring})`);
    }
    for (const [role, h] of Object.entries(ROLE_HUE)) if (h) {
      d.push(`--${role}-key:var(--${h}-400)`, `--${role}-fg:var(--${h}-fg)`, `--${role}-solid:var(--${h}-solid)`, `--${role}-tint:var(--${h}-tint)`,
        `--${role}-soft:var(--${h}-soft)`, `--${role}-on:var(--on-solid)`, `--${role}-ring:var(--${h}-ring)`,
        `--${role}-hover:color-mix(in oklab,var(--${h}-${fg}),var(--${h}-${hover}) 45%)`);
    }
    // Accent: none — the interface is grayscale.
    const a = ACCENT_NONE[m];
    d.push(`--accent-fg:${a.solid}`, `--accent-solid:${a.solid}`, `--accent-key:${a.solid}`, `--accent-hover:${a.hover}`,
      `--accent-on:${a.on}`, `--accent-tint:${a.tint}`, `--accent-soft:${a.soft}`, `--accent-ring:${a.solid}`, `--on-solid:${ON_SOLID[m]}`);
    SERIES.forEach((h, i) => d.push(`--series-${i + 1}:var(--${h}-400)`, `--series-${i + 1}-tint:var(--${h}-${tint})`,
      `--series-${i + 1}-soft:var(--${h}-${soft})`, `--series-${i + 1}-key:var(--${h}-400)`, `--series-${i + 1}-fg:var(--${h}-${fg})`));
    d.push(`--ink:${m === 'light' ? g('700') : g('400')}`);
    out.push(`${m === 'dark' ? ':root[data-theme="dark"]' : ':root'}{${d.join(';')}}`);
  }
  out.push(`:root{--spectrum:${Array.from({ length: 9 }, (_, i) => `var(--spec-${i + 1})`).join(',')}}`);
  return out.join('\n');
}
