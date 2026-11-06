/**
 * ICONS — the one lookup every icon goes through (the site's Icon component,
 * the page reviews, the Icons page). Reads icons/set.json; see its $about and
 * design/foundations/iconography.md.
 *
 *   name → set entry → drawing (Tabler or Lucide outline, our own in public/icons/,
 *   or a tool mark) → one inline <svg>, sized, in currentColor, with the stroke
 *   for its size.
 *
 * A name that isn't in the set fails the build, so the set is always the full
 * list of icons in use: the audit starts there.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import SET from '../../icons/set.json';

export type IconEntry = { src: 'tabler' | 'lucide' | 'own' | 'tool'; file?: string; style?: 'line' | 'solid'; status: 'proposed' | 'approved'; note?: string };
export type LiveEntry = { use: string | null; match: string; note?: string };
export const ICONS = SET.icons as Record<string, IconEntry>;
export const LIVE = SET.live as Record<string, LiveEntry>;

/* ── Tabler at Lucide's size ─────────────────────────────────────────
   Tabler leaves 2px inside the box and Lucide 1px, so Tabler draws about 7%
   smaller. Its drawings are scaled up around the center by this factor, with the
   stroke divided by the same factor so the line keeps its weight (measured
   2026-11-06, lab research/2026-11-06-icon-set-audit). */
export const TABLER_SCALE = 1.075;

/* ── Weight by size ───────────────────────────────────────────────────
   Every icon draws on a 24px grid at a 2 stroke. Up to 24px the stroke scales with
   the icon (1.33px at 16, 1.67px at 20, 2px at 24); above 24px the drawn line
   holds at 2px, so large icons don't grow heavy (a 2 stroke at 40px is 3.3px). */
export const ICON_LINE_PX = 2;
/** Stroke in grid units for an icon drawn at `px`. */
export const iconStroke = (px: number) => +Math.min(2, (ICON_LINE_PX * 24) / px).toFixed(3);
/** The pixel size of an icon `size` prop, or null when it isn't in px (1em, inline). */
export const iconPx = (size: number | string) =>
  typeof size === 'number' ? size : /^\d+(\.\d+)?px$/.test(size) ? parseFloat(size) : null;

/** Where an entry's drawing lives. */
export function iconFile(name: string): string {
  const e = ICONS[name];
  if (!e) throw new Error(`Icon "${name}" is not in icons/set.json. Add it there (src: tabler, lucide, own or tool), then use it.`);
  const root = process.cwd();
  const file =
    e.src === 'own' ? join(root, 'public', 'icons', `${name}.svg`)
    : e.src === 'tool' ? join(root, 'public', 'logos', 'tools', name, 'icon.svg')
    : e.src === 'tabler' ? join(root, 'node_modules', '@tabler', 'icons', 'icons', 'outline', `${e.file ?? name}.svg`)
    : e.src === 'lucide' ? join(root, 'node_modules', 'lucide-static', 'icons', `${e.file ?? name}.svg`)
    : '';
  if (!file) throw new Error(`Icon "${name}" has an unknown src "${e.src}" (tabler, lucide, own or tool).`);
  if (!existsSync(file)) throw new Error(`Icon "${name}" (${e.src}) has no drawing at ${file.replace(root + '/', '')}`);
  return file;
}

/**
 * Our own drawings must work like the libraries': a 24 grid, currentColor only, and
 * the stroke left to us (set on the root, so it can follow the size). A solid
 * icon may fill with currentColor. `npm run icons:import` produces files that pass.
 */
function checkOwn(name: string, svg: string, style: 'line' | 'solid') {
  const problems: string[] = [];
  if (!/viewBox="0 0 24 24"/.test(svg)) problems.push('viewBox must be "0 0 24 24"');
  const colors = [...svg.matchAll(/(?:fill|stroke|color|stop-color)\s*[=:]\s*"?\s*([^";)\s]+)/g)].map(m => m[1]);
  const bad = colors.filter(c => !/^(currentColor|none|inherit|url\(.*)$/.test(c));
  if (bad.length) problems.push(`colors other than currentColor: ${[...new Set(bad)].join(', ')}`);
  const inner = svg.replace(/^<svg[^>]*>/, '');
  if (/stroke-width\s*=/.test(inner)) problems.push('stroke-width on inner shapes (remove it: the stroke is set on the root, by size)');
  if (style === 'line' && /fill="currentColor"/.test(inner)) problems.push('fills on a line icon (set style: "solid" in icons/set.json if it is meant to be filled)');
  if (problems.length) throw new Error(`public/icons/${name}.svg: ${problems.join('; ')}`);
}

/** The icon's inline <svg>, ready to place: sized, labeled or hidden, stroke by size. */
export function iconSvg(name: string, { size = '1em', label, cls = '' }: { size?: number | string; label?: string; cls?: string } = {}): string {
  const e = ICONS[name];
  let svg = readFileSync(iconFile(name), 'utf8').trim();
  if (e.src === 'own') checkOwn(name, svg, e.style ?? 'line');
  // Brand marks are fills in every version: a brand drawn in outline has its own
  // line weight, so it's flattened to a fill before it comes in.
  if (e.src === 'tool' && e.style !== 'solid') throw new Error(`Tool mark "${name}" is a fill: set "style": "solid" in icons/set.json.`);
  if (e.src === 'tool' && /stroke="(?!none)[^"]*"/.test(svg)) throw new Error(`Tool mark "${name}" is drawn with strokes; flatten it to a fill (public/logos/tools/${name}/icon.svg).`);
  if (e.src === 'tabler' || e.src === 'lucide') {
    // A stroke-width on a shape would beat the stroke the set gives by size; neither
    // library sets one today, so this stops a future drawing from doing it quietly.
    if (/<(?!svg\b)[a-z]+\b[^>]*\sstroke-width=/.test(svg)) throw new Error(`Icon "${name}" (${e.src}:${e.file ?? name}) sets its own stroke-width on a shape; choose another drawing or import it as our own.`);
    // Tabler's invisible bounding box; the library's own class names.
    svg = svg.replace(/\s*<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*\/>/, '');
    if (e.src === 'tabler') {
      // Scale around the center to Lucide's size; divide the stroke to keep the line.
      const o = +(12 - 12 * TABLER_SCALE).toFixed(4);
      svg = svg.replace(/(<svg[^>]*>)([\s\S]*)(<\/svg>)/, (_, open, body, close) =>
        `${open}<g transform="matrix(${TABLER_SCALE} 0 0 ${TABLER_SCALE} ${o} ${o})" style="stroke-width:calc(var(--icon-stroke, 2) / ${TABLER_SCALE})">${body.trim()}</g>${close}`);
    }
  }
  const px = typeof size === 'number' ? `${size}px` : size;
  const n = iconPx(size);
  // --icon-stroke lets a scaled drawing compensate (Tabler above; an import on another grid, tools/icons/import.mjs).
  const stroke = e.src === 'tool' ? '' : ` style="--icon-stroke:${n ? iconStroke(n) : 2};stroke-width:var(--icon-stroke)"`;
  svg = svg
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1')
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, '<svg$1')
    .replace(/<svg([^>]*?)\sstroke-width="[^"]*"/, '<svg$1')
    .replace(/<svg([^>]*?)\sclass="[^"]*"/, '<svg$1')
    .replace('<svg', `<svg width="${px}" height="${px}" class="icon ${cls}"${stroke} ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false" data-icon="${name}"`)
    .replace(/<svg\b[^>]*>/, (open) => open.replace(/\s+/g, ' ').replace(/\s>$/, '>'));
  return svg;
}

/** The set icon that replaces a live openmined.org icon, or null when none is chosen yet. */
export const liveToSet = (liveName: string) => LIVE[liveName]?.use ?? null;
