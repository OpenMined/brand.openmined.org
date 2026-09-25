/**
 * DIAGRAM ROUND — working color values.
 *
 * The color round's working favorite, built from the same generated data
 * rather than re-typed: Ink, accent none, with the per-mode saturation
 * offsets from the color round's mode adjust (light ×1.10, dark ×0.95, all
 * steps — `ml=0_1.1_0_all&md=0_0.95_0_all`). A palette edit in
 * ../color/_palettes.json reaches every diagram here with no second set of
 * colors to keep in step.
 *
 * Surfaces and text are the settled 2026-09-23 values, as the color round.
 *
 * Two scopes, so a figure can pin its own stage:
 *   light values   :root, [data-stage="light"]
 *   dark values    :root[data-theme="dark"], [data-stage="dark"]
 * A stage re-declares every token, so anything inside it resolves against
 * the stage, not the page.
 */
import data from '../color/_palettes.json';

type Mode = 'light' | 'dark';
const SAT: Record<Mode, number> = { light: 1.1, dark: 0.95 };
const PALETTE = 'ink';

/* ── OKLCH ⇄ sRGB — the same maths as ../color/_adjust.ts ─────────── */
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

/* ── Tokens ───────────────────────────────────────────────────────── */
const P = (data.palettes as any)[PALETTE];
const HUES = data.hues as string[];
const STEPS = data.steps as number[];
const S = data.surfaces as any;

function ramps(mode: Mode): string {
  const d: string[] = [];
  for (const h of HUES) for (const s of STEPS) d.push(`--${h}-${s}:${saturate(P.ramps[h][String(s)], SAT[mode])}`);
  // Gradient: family stops are the palette's own keys; the four fitted stops
  // carry their own value and take the same offset.
  (P.gradient as string[]).forEach((hex, i) => {
    const ref = P.gradient_ref[i];
    d.push(`--spec-${i + 1}:${ref ? `var(--${ref})` : saturate(hex, SAT[mode])}`);
  });
  // Diagrams use fixed ramp steps, never roles (fg / tint / soft point at a
  // different step per mode, so a color would change shade on a mode switch).
  // `key` is only a name for 400, the same step in both modes.
  for (const h of HUES) d.push(`--${h}-key:var(--${h}-400)`);
  return d.join(';');
}

const SURF: Record<Mode, string> = {
  light: `--c-white:#ffffff;--c-sunken:${S.light.sunken};--c-base:${S.light.base};--c-raise-1:${S.light['raise-1']};--c-raise-2:${S.light['raise-2']};--c-line:#dddde2;--c-line-strong:#cfcdd6;--c-h:#221f2c;--c-b:#353243;--c-m:#5e5a72;--c-ink:#221f2c;--c-on-ink:#fcfcfd;--connector:#868394;--c-shadow-1:0 2px 10px -4px rgb(70 66 87 / 0.05);--c-shadow-2:0 6px 16px -4px rgb(70 66 87 / 0.12), 0 2px 4px rgb(70 66 87 / 0.048);color-scheme:light`,
  dark: `--c-white:#ffffff;--c-sunken:${S.dark.sunken};--c-base:${S.dark.base};--c-raise-1:${S.dark['raise-1']};--c-raise-2:${S.dark['raise-2']};--c-line:#353243;--c-line-strong:#464257;--c-h:#fcfcfd;--c-b:#cfcdd6;--c-m:#9591a3;--c-ink:#fcfcfd;--c-on-ink:#16141b;--connector:#868394;--c-shadow-1:0 2px 10px -4px rgb(0 0 0 / 0.14);--c-shadow-2:0 6px 16px -4px rgb(0 0 0 / 0.336), 0 2px 4px rgb(0 0 0 / 0.134);color-scheme:dark`,
};

export const TOKEN_CSS = [
  `:root,[data-stage="light"]{${SURF.light};${ramps('light')}}`,
  `:root[data-theme="dark"],[data-stage="dark"]{${SURF.dark};${ramps('dark')}}`,
].join('\n');

/** The nine gradient stops as CSS values, for spreading along a node column. */
export const SPEC = Array.from({ length: 9 }, (_, i) => `var(--spec-${i + 1})`);

/** A color at position t (0–1) along the gradient, mixed in OKLCH between
 *  its two nearest stops — so a column of nodes walks the brand gradient
 *  without inventing a single value. `from`/`to` pick a sub-range of stops. */
export function along(t: number, from = 0, to = 8): string {
  const x = from + t * (to - from), i = Math.min(Math.floor(x), to - 1), f = x - i;
  if (f < 0.02) return SPEC[i];
  if (f > 0.98) return SPEC[i + 1];
  return `color-mix(in oklch, ${SPEC[i]}, ${SPEC[i + 1]} ${Math.round(f * 100)}%)`;
}
