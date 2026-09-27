/**
 * BRAND-V2 — the working favorites, as data.
 *
 * One module every consumer reads — the working-favorites page, its token
 * downloads, and the diagram round — so they can never disagree.
 *
 * Sources, never re-typed here:
 *   palette   ./color/_palettes.json (written by the lab's generate.py) —
 *             Ink, with the color round's per-mode saturation offsets
 *             (light ×1.10, dark ×0.95, all steps; hue and lightness untouched)
 *   surfaces  the same JSON's surface block, plus the lines and text from
 *             brand-v2-lab/rounds/working-surface-colors.md
 *   shadows   the surfaces round's settled ladder, as the color round renders it
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
function oklchToHex(L: number, C: number, H: number): string {
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

/* ── Surfaces, lines, text ────────────────────────────────────────── */
const S = data.surfaces as any;
export type Slot = { token: string; name: string; hex: string; step: string };
export const SURFACES: Record<Mode, Slot[]> = {
  light: [
    { token: 'sunken', name: 'sunken (−1)', hex: S.light.sunken, step: '300' },
    { token: 'base', name: 'base (0)', hex: S.light.base, step: '150' },
    { token: 'raise-1', name: 'raise-1 (+1)', hex: S.light['raise-1'], step: '100' },
    { token: 'raise-2', name: 'raise-2 (+2)', hex: S.light['raise-2'], step: '00' },
  ],
  dark: [
    { token: 'sunken', name: 'sunken (−1)', hex: S.dark.sunken, step: '950' },
    { token: 'base', name: 'base (0)', hex: S.dark.base, step: '900' },
    { token: 'raise-1', name: 'raise-1 (+1)', hex: S.dark['raise-1'], step: '850' },
    { token: 'raise-2', name: 'raise-2 (+2)', hex: S.dark['raise-2'], step: '800' },
  ],
};
export const LINES_TEXT: Record<Mode, Slot[]> = {
  light: [
    { token: 'line', name: 'line', hex: '#dddde2', step: '300' },
    { token: 'line-strong', name: 'line-strong', hex: '#cfcdd6', step: '400' },
    { token: 'text-headline', name: 'text-headline', hex: '#221f2c', step: '850' },
    { token: 'text-body', name: 'text-body', hex: '#353243', step: '750' },
    { token: 'text-muted', name: 'text-muted', hex: '#5e5a72', step: '' },
  ],
  dark: [
    { token: 'line', name: 'line', hex: '#353243', step: '750' },
    { token: 'line-strong', name: 'line-strong', hex: '#464257', step: '700' },
    { token: 'text-headline', name: 'text-headline', hex: '#fcfcfd', step: '50' },
    { token: 'text-body', name: 'text-body', hex: '#cfcdd6', step: '400' },
    { token: 'text-muted', name: 'text-muted', hex: '#9591a3', step: '' },
  ],
};

/* ── Shadows: one ladder, bound to the levels; ink per mode ───────── */
export const SHADOWS: Record<Mode, Record<'sunken' | 'raise-1' | 'raise-2', string>> = {
  light: {
    sunken: 'inset 0 1px 5px 0 rgb(70 66 87 / 0.07)',
    'raise-1': '0 2px 10px -4px rgb(70 66 87 / 0.05)',
    'raise-2': '0 6px 16px -4px rgb(70 66 87 / 0.12), 0 2px 4px rgb(70 66 87 / 0.048)',
  },
  dark: {
    sunken: 'inset 0 1px 5px 0 rgb(0 0 0 / 0.196)',
    'raise-1': '0 2px 10px -4px rgb(0 0 0 / 0.14)',
    'raise-2': '0 6px 16px -4px rgb(0 0 0 / 0.336), 0 2px 4px rgb(0 0 0 / 0.134)',
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
export const ACCENT_NONE: Record<Mode, Record<string, string>> = {
  light: { solid: '#221f2c', hover: '#353243', on: '#fcfcfd', tint: '#dddde2', soft: '#cfcdd6' },
  dark: { solid: '#fcfcfd', hover: '#cfcdd6', on: '#16141b', tint: '#353243', soft: '#464257' },
};
export const ON_SOLID: Record<Mode, string> = { light: '#ffffff', dark: '#16141b' };

/* ── The page's own CSS custom properties ─────────────────────────── */
const surfVars = (m: Mode) => {
  const t = Object.fromEntries([...SURFACES[m], ...LINES_TEXT[m]].map(s => [s.token, s.hex]));
  return [
    `--c-white:#ffffff`, `--label-ink:#221f2c`, `--c-sunken:${t.sunken}`, `--c-base:${t.base}`, `--c-raise-1:${t['raise-1']}`, `--c-raise-2:${t['raise-2']}`,
    `--c-line:${t.line}`, `--c-line-strong:${t['line-strong']}`, `--c-h:${t['text-headline']}`, `--c-b:${t['text-body']}`, `--c-m:${t['text-muted']}`,
    `--c-ink:${t['text-headline']}`, `--c-on-ink:${m === 'light' ? '#fcfcfd' : '#16141b'}`, `--connector:#868394`,
    `--c-shadow-in:${SHADOWS[m].sunken}`, `--c-shadow-1:${SHADOWS[m]['raise-1']}`, `--c-shadow-2:${SHADOWS[m]['raise-2']}`,
    `color-scheme:${m}`,
  ].join(';');
};

function paletteVars(m: Mode): string {
  const r = ramp(m), d: string[] = [];
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
    out.push('  /* Surfaces (four levels), lines, text */');
    for (const s of [...SURFACES[m], ...LINES_TEXT[m]]) out.push(`  --${s.token}: ${s.hex};`);
    out.push('', '  /* Shadows — one rung per level; base casts nothing */');
    for (const [k, v] of Object.entries(SHADOWS[m])) out.push(`  --shadow-${k}: ${v};`);
    out.push('', '  /* Palette — 6 hues x 7 steps. Graphics use these steps directly. */');
    for (const h of HUES) out.push(`  ${STEPS.map(s => `--${h}-${s}: ${r[h][s]};`).join(' ')}`);
    out.push('', '  /* Gradient — nine stops; family stops are the 400 keys */');
    gradient(m).forEach((g, i) => out.push(`  --gradient-${i + 1}: ${g.hex}; /* ${g.name}${g.ref ? ` = ${g.ref}` : ', fitted'} */`));
    out.push(`  --gradient: linear-gradient(90deg, ${gradient(m).map((_, i) => `var(--gradient-${i + 1})`).join(', ')});`);
    out.push('', '  /* Interface roles — each names a step for this mode */');
    for (const h of HUES) out.push(`  ${ROLES.map(x => `--${h}-${x.role}: var(--${h}-${x[m]});`).join(' ')}`);
    out.push(`  --on-solid: ${ON_SOLID[m]};`);
    for (const [k, h] of Object.entries(STATUS)) out.push(`  --${k}: var(--${h}-solid);`);
    for (const [k, v] of Object.entries(ACCENT_NONE[m])) out.push(`  --accent-${k}: ${v};`);
    SERIES.forEach((h, i) => out.push(`  --series-${i + 1}: var(--${h}-400);`));
    return out.join('\n');
  };
  return `/* ${HEADER} */\n\n:root {\n${block('light')}\n}\n\n[data-theme="dark"] {\n${block('dark')}\n}\n`;
}

/** tokens.json — W3C design-tokens format, one set per color mode. */
export function tokensJson(): string {
  const c = (hex: string, description?: string) => ({ $type: 'color', $value: hex, ...(description ? { $description: description } : {}) });
  const set = (m: Mode) => {
    const r = ramp(m);
    return {
      surface: Object.fromEntries(SURFACES[m].map(s => [s.token, c(s.hex, `grayscale ${s.step}`)])),
      line: Object.fromEntries(LINES_TEXT[m].filter(s => s.token.startsWith('line')).map(s => [s.token, c(s.hex)])),
      text: Object.fromEntries(LINES_TEXT[m].filter(s => s.token.startsWith('text')).map(s => [s.token.replace('text-', ''), c(s.hex)])),
      palette: Object.fromEntries(HUES.map(h => [h, Object.fromEntries(STEPS.map(s => [String(s), c(r[h][s], s === 400 ? 'key — marks only, no text' : undefined)]))])),
      gradient: Object.fromEntries(gradient(m).map((g, i) => [`${i + 1}-${g.name}`, c(g.hex, g.ref ? `= ${g.ref}` : 'fitted to the palette')])),
      shadow: Object.fromEntries(Object.entries(SHADOWS[m]).map(([k, v]) => [k, { $type: 'shadow', $value: v }])),
    };
  };
  return JSON.stringify({ $description: HEADER, light: set('light'), dark: set('dark') }, null, 2) + '\n';
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
    d.push(`--ink:${m === 'light' ? '#464257' : '#cfcdd6'}`);
    out.push(`${m === 'dark' ? ':root[data-theme="dark"]' : ':root'}{${d.join(';')}}`);
  }
  out.push(`:root{--spectrum:${Array.from({ length: 9 }, (_, i) => `var(--spec-${i + 1})`).join(',')}}`);
  return out.join('\n');
}
