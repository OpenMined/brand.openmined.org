/**
 * PARTNERS — the one lookup for partner and integration marks, and the color-mode
 * check. Reads public/logos/partners/partners.json (the source of truth; see its
 * README for the trademark rules).
 *
 * Every official-color file must read on both modes' surfaces. A visible color
 * under MIN_CONTRAST against base, raise-1 or raise-2 in a mode fails the build,
 * unless the brand has a file for that mode (`dark`) or a stated reason the mark
 * reads anyway (`modeCheck`). So a new partner can't arrive unreadable in one mode.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { MODES, hex, contrast, type Mode } from './tokens';

export const PARTNERS_DIR = join(process.cwd(), 'public', 'logos', 'partners');
const DATA = JSON.parse(readFileSync(join(PARTNERS_DIR, 'partners.json'), 'utf8'));

export type Partner = {
  name: string; trademark: string; source: string; icon: string; iconColor?: string;
  lockup?: Record<string, string> | null; gaps?: string[]; notes?: string;
  dark?: { iconColor?: string; lockup?: Record<string, string>; derived?: string };
  modeCheck?: string;
};
export const BRANDS = DATA.brands as Record<string, Partner>;

/** Near-invisible, not a text standard: brand colors are marks, and at 3:1 most
 *  multi-color marks would fail on one surface while still reading as the logo. */
export const MIN_CONTRAST = 1.5;
const SURFACES = ['surface-base', 'surface-raise-1', 'surface-raise-2'];

/** The colors a file actually draws with: fills, strokes and inline styles,
 *  outside comments, gradients (their stops are shading) and clip paths, masks
 *  and filters (shapes that are never painted). */
export function visibleColors(svg: string): string[] {
  const body = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(linearGradient|radialGradient|clipPath|mask|filter)\b[\s\S]*?<\/\1>/g, '');
  const found = [...body.matchAll(/(?:fill|stroke)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,6})\b/g)].map(m => m[1].toLowerCase());
  const full = (c: string) => (c.length === 4 ? '#' + [...c.slice(1)].map(x => x + x).join('') : c);
  return [...new Set(found.map(full))];
}

/** The color file shown in a mode: the brand's dark file in dark mode, if it has one. */
export function colorFile(brand: Partner, mode: Mode): string | undefined {
  return mode === 'dark' ? brand.dark?.iconColor ?? brand.iconColor : brand.iconColor;
}

export type ModeIssue = { key: string; mode: Mode; file: string; color: string; ratio: number; surface: string };
/** Every visible color, in every mode's color file, that a surface would swallow. */
export function modeIssues(): ModeIssue[] {
  const out: ModeIssue[] = [];
  for (const [key, b] of Object.entries(BRANDS)) {
    if (b.modeCheck) continue;
    for (const mode of MODES) {
      const file = colorFile(b, mode);
      if (!file || !existsSync(join(PARTNERS_DIR, file))) continue;
      for (const color of visibleColors(readFileSync(join(PARTNERS_DIR, file), 'utf8'))) {
        for (const surface of SURFACES) {
          const ratio = contrast(color, hex(mode, surface));
          if (ratio < MIN_CONTRAST) out.push({ key, mode, file, color, ratio, surface });
        }
      }
    }
  }
  return out;
}

const issues = modeIssues();
if (issues.length) {
  const lines = issues.map(i => `  ${i.key} (${i.mode}): ${i.file} draws ${i.color}, ${i.ratio.toFixed(2)}:1 on ${i.surface}`);
  throw new Error(
    `Partner marks that don't read in one color mode (under ${MIN_CONTRAST}:1):\n${[...new Set(lines)].join('\n')}\n` +
      'Add the owner\'s file for that mode under `dark` in partners.json (or derive one and say so in `derived`), ' +
      'or record why the mark reads anyway in `modeCheck`.',
  );
}
