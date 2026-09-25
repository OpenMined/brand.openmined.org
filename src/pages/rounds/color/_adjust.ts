/**
 * COLOR ROUND — mode adjust: whole-palette offsets per color mode.
 *
 * The generated palette stays the single reference. Each mode carries an
 * OFFSET from it — hue shift (°), saturation (× chroma) and lightness (± L),
 * in OKLCH — that starts at zero, so zero IS the original and nothing about
 * the original is ever lost. Dark is the suggested reference (left at zero);
 * light is tuned to match it. The offsets are the finding: a small rule to
 * bake into the generator, not a set of hand-picked hexes.
 *
 * Offsets rewrite the palette's own custom properties (--violet-400 …, and
 * the gradient's fitted stops) per mode, so everything built on the palette —
 * roles, charts, the gradient, the colorflow, the gradient map — follows.
 * The logo keeps its own colors.
 *
 * URL: ml / md = hue_sat_light_scope (light / dark), only when not zero.
 */

type Mode = 'light' | 'dark';
type Adj = { h: number; s: number; l: number; scope: string };
type Target = { kind: 'ramp'; hue: string; step: number } | { kind: 'spec'; index: number };
type PalData = {
  hues: string[]; steps: number[];
  palettes: Record<string, { ramps: Record<string, Record<string, string>>; gradient: string[]; gradient_ref: (string | null)[] }>;
};

/* ── Scopes ───────────────────────────────────────────────────────────
   Which colors an offset touches. Extend by adding an entry: `match` sees
   each target — a ramp step (hue + step) or one of the gradient's fitted
   stops (the four with no family) — and returns whether to adjust it. */
export const SCOPES: { id: string; label: string; match: (t: Target) => boolean }[] = [
  { id: 'all', label: 'All steps', match: () => true },
  // The keys, and the gradient's fitted stops, which play the key's part there.
  { id: 'keys', label: 'Keys only (400)', match: t => t.kind === 'spec' || t.step === 400 },
];

export const SLIDERS = [
  { k: 'h', label: 'Hue shift', min: -30, max: 30, step: 1, zero: 0, fmt: (v: number) => `${v > 0 ? '+' : ''}${v}°` },
  { k: 's', label: 'Saturation', min: 0.5, max: 1.5, step: 0.01, zero: 1, fmt: (v: number) => `×${v.toFixed(2)}` },
  { k: 'l', label: 'Lightness', min: -10, max: 10, step: 0.5, zero: 0, fmt: (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}` },
] as const;

const zero = (): Adj => ({ h: 0, s: 1, l: 0, scope: 'all' });
const isZero = (a: Adj) => a.h === 0 && a.s === 1 && a.l === 0;

/* ── OKLCH ⇄ sRGB ─────────────────────────────────────────────────── */
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

function shift(hex: string, a: Adj): string {
  const [L, C, H] = hexToOklch(hex);
  return oklchToHex(Math.min(Math.max(L + a.l, 0), 100), C * a.s, (H + a.h + 360) % 360);
}

/* ── Contrast (WCAG 2) ────────────────────────────────────────────── */
const lum = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

/* ── State, URL, CSS ──────────────────────────────────────────────── */
export function initAdjust(data: PalData, onChange: () => void) {
  const html = document.documentElement;
  const state: Record<Mode, Adj> = { light: zero(), dark: zero() };
  let showOriginal = false;
  const style = document.head.appendChild(document.createElement('style'));
  style.id = 'mode-adjust';

  const q = new URLSearchParams(location.search);
  (['light', 'dark'] as Mode[]).forEach(m => {
    const v = q.get(m === 'light' ? 'ml' : 'md');
    if (!v) return;
    const [h, s, l, scope] = v.split('_');
    state[m] = { h: +h || 0, s: Number.isFinite(+s) && s !== '' ? +s : 1, l: +l || 0, scope: SCOPES.some(x => x.id === scope) ? scope : 'all' };
  });

  const mode = (): Mode => (html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  function css(): string {
    if (showOriginal) return '';
    const out: string[] = [];
    for (const m of ['light', 'dark'] as Mode[]) {
      const a = state[m];
      if (isZero(a)) continue;
      const match = SCOPES.find(x => x.id === a.scope)!.match;
      for (const [k, p] of Object.entries(data.palettes)) {
        const d: string[] = [];
        for (const h of data.hues) for (const s of data.steps) {
          if (match({ kind: 'ramp', hue: h, step: s })) d.push(`--${h}-${s}:${shift(p.ramps[h][String(s)], a)}`);
        }
        // Stops with a family are var(--hue-400) and follow on their own; only
        // the fitted stops carry their own value, so only they need shifting.
        p.gradient.forEach((hex, i) => {
          if (!p.gradient_ref[i] && match({ kind: 'spec', index: i })) d.push(`--spec-${i + 1}:${shift(hex, a)}`);
        });
        const sel = m === 'dark' ? `:root[data-p="${k}"][data-theme="dark"]` : `:root[data-p="${k}"]:not([data-theme="dark"])`;
        out.push(`${sel}{${d.join(';')}}`);
      }
    }
    return out.join('\n');
  }

  function writeUrl() {
    const u = new URLSearchParams(location.search);
    (['light', 'dark'] as Mode[]).forEach(m => {
      const key = m === 'light' ? 'ml' : 'md', a = state[m];
      if (isZero(a)) u.delete(key); else u.set(key, `${a.h}_${a.s}_${a.l}_${a.scope}`);
    });
    history.replaceState(null, '', `${location.pathname}?${u}${location.hash}`);
  }

  const apply = () => { style.textContent = css(); writeUrl(); onChange(); };

  /** Live contrast for the mode on screen, read off the resolved roles. */
  function audit() {
    const cs = getComputedStyle(html), v = (n: string) => cs.getPropertyValue(`--${n}`).trim();
    const surfaces = ['c-sunken', 'c-base', 'c-raise-1', 'c-raise-2'].map(v);
    return data.hues.map(h => ({
      hue: h,
      fg: Math.min(...surfaces.map(s => contrast(v(`${h}-fg`), s))),
      key: contrast(v(`${h}-key`), v('c-base')),
      label: contrast(v('on-solid'), v(`${h}-solid`)),
    }));
  }

  const describe = (a: Adj) => (isZero(a) ? 'original'
    : `${SLIDERS.map(s => s.fmt(a[s.k])).join(' ')} · ${SCOPES.find(x => x.id === a.scope)!.label}`);

  apply();
  return {
    state, mode, audit, describe, apply,
    set(m: Mode, patch: Partial<Adj>) { Object.assign(state[m], patch); apply(); },
    reset(m: Mode) { state[m] = zero(); apply(); },
    get showOriginal() { return showOriginal; },
    set showOriginal(v: boolean) { showOriginal = v; style.textContent = css(); onChange(); },
    copyText: () => (['light', 'dark'] as Mode[]).map(m => `${m}: ${describe(state[m])}`).join('\n'),
  };
}
