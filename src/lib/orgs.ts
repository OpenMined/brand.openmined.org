/**
 * ORGANIZATIONS — the one lookup for organization logos (public/logos/orgs/orgs.json,
 * the registry) and the check on their one-color files.
 *
 * Every organization has a color file, a one-color file, or both. Logos in a group all
 * follow the color mode or all sit on white (*Logos in a group all follow the mode, or
 * all sit on white*). A group that follows the mode asks for each logo's one-color file
 * with orgMono(): an organization without one stops the build, with the reason and the
 * fix, so a group never mixes plates with mode-following logos. Every one-color file is checked on each
 * build (tools/logos/mono.mjs): only currentColor, masks keep their white.
 * New organizations come in with `npm run logos:import`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { monoProblems } from '../../tools/logos/mono.mjs';

export const ORGS_DIR = join(process.cwd(), 'public', 'logos', 'orgs');
const DATA = JSON.parse(readFileSync(join(ORGS_DIR, 'orgs.json'), 'utf8'));

export type Org = {
  name: string; owner?: string; category?: string; roles?: string[];
  color?: string; mono?: string; source?: string; notes?: string;
};
export const ORGS = DATA.brands as Record<string, Org>;

const problems: string[] = [];
for (const [slug, o] of Object.entries(ORGS)) {
  if (!o.color && !o.mono) problems.push(`${slug}: no color file and no one-color file`);
  for (const f of [o.color, o.mono]) if (f && !existsSync(join(ORGS_DIR, f))) problems.push(`${slug}: ${f} is missing`);
  if (o.mono && existsSync(join(ORGS_DIR, o.mono))) {
    const p = monoProblems(readFileSync(join(ORGS_DIR, o.mono), 'utf8'));
    if (p.length) problems.push(`${slug}: ${o.mono}: ${p.join('; ')}`);
  }
}
if (problems.length) throw new Error(`Organization logos (public/logos/orgs/orgs.json):\n${problems.map((p) => `  - ${p}`).join('\n')}\nFix the file, or bring it in again with npm run logos:import.`);

/** Organizations with a role, in registry order. */
export const orgsWithRole = (role: string) => Object.entries(ORGS).filter(([, o]) => o.roles?.includes(role)).map(([slug, o]) => ({ slug, ...o }));

/** An organization's one-color logo, inline, for a group that follows the color mode
 *  (`group` names it in the error). Stops the build when it has none: a group never
 *  mixes treatments. */
export function orgMono(slug: string, { label, group = 'This group' }: { label?: string; group?: string } = {}): string {
  const o = ORGS[slug];
  if (!o) throw new Error(`No organization "${slug}" in public/logos/orgs/orgs.json. Add it with npm run logos:import -- ${slug} --name "…" --mono <file>.`);
  if (!o.mono) throw new Error(`${group} follows the color mode, so every logo in it needs a checked one-color file. ${o.name} has none. Bring one in with npm run logos:import -- ${slug} --mono <file> (the owner's own one-color logo), or show this group on white plates (Logos in a group all follow the mode, or all sit on white).`);
  const svg = readFileSync(join(ORGS_DIR, o.mono), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  // Its intrinsic size, from the viewBox, so any container can scale it (CSS max-width,
  // max-height): an inline SVG with neither width nor height collapses in a flex row.
  const vb = svg.match(/viewBox="\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  const size = vb && !/^<svg\b[^>]*\swidth=/.test(svg) ? ` width="${vb[1]}" height="${vb[2]}"` : '';
  return svg.replace(/<svg\b/, `<svg role="img" aria-label="${(label ?? o.name).replace(/"/g, '&quot;')}"${size}`);
}
