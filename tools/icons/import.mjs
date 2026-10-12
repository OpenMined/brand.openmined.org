#!/usr/bin/env node
/**
 * ICON IMPORT — turns an SVG into one of our own v2 icons (public/icons/<name>.svg)
 * and adds it to icons/set.json, so it behaves like an Iconoir icon: a 24 grid,
 * currentColor, and the stroke left to the set (src/lib/icons.ts sets it by size).
 *
 *   npm run icons:import -- <source> <name> [--solid] [--note "why"] [--dry-run]
 *
 *   <source>   a file path, or live:<name> for a drawing from the live site's
 *              snapshot (src/pages/icons/_live-icons.json); a live source also
 *              points that live icon at the new one (icons/set.json → live)
 *   <name>     the set name; an existing entry is switched to src "own"
 *   --solid    a filled icon (style "solid"); default is a line icon
 *
 * What it does to the drawing:
 *   - another grid (32, 42, 512…) is scaled to 24 inside a group that divides the
 *     stroke by the same factor (via --icon-stroke), so the line keeps v2's weight;
 *   - every color becomes currentColor; inner stroke-widths are removed (the
 *     source's own weight is replaced by v2's, which is the point);
 *   - width, height, class and style come off the root.
 * It stops, with the reason, on what it can't decide for you: white or second-color
 * parts (a knockout needs drawing as a mask or a cut-out path), <style> blocks, and
 * filled shapes in a line icon (pass --solid if the icon is meant to be filled).
 * Brand logos don't come in this way: they're partner marks, as supplied, as fills.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const [source, name] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--note'));
const solid = flag('--solid'), dry = flag('--dry-run'), note = opt('--note');
const fail = (m) => { console.error(`icons:import: ${m}`); process.exit(1); };
if (!source || !name) fail('usage: npm run icons:import -- <file.svg | live:<name>> <name> [--solid] [--note "why"] [--dry-run]');
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(`name "${name}" should be lowercase-with-dashes`);

const ROOT = process.cwd();
let svg, liveName;
if (source.startsWith('live:')) {
  liveName = source.slice(5);
  const snap = JSON.parse(readFileSync(join(ROOT, 'src/pages/icons/_live-icons.json'), 'utf8'));
  const it = snap.groups.flatMap((g) => g.items).find((i) => i.name === liveName);
  if (!it) fail(`no live icon "${liveName}" in the snapshot`);
  svg = it.svg;
} else {
  if (!existsSync(source)) fail(`no file ${source}`);
  svg = readFileSync(source, 'utf8');
}

svg = svg.replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
if (/<style[\s>]/.test(svg)) fail('the SVG has a <style> block; inline its styles as attributes first');
const vb = svg.match(/viewBox="([^"]+)"/)?.[1]?.trim().split(/[\s,]+/).map(Number);
if (!vb || vb.length !== 4) fail('the SVG needs a viewBox');
const [x, y, w, h] = vb;
const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

// Colors: currentColor, except knockouts, which need drawing by hand.
const WHITE = /^(#fff(fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/i;
const colorRe = /(fill|stroke)="([^"]+)"/g;
const found = [...inner.matchAll(colorRe)].map((m) => m[2]).filter((c) => !/^(none|currentColor)$/i.test(c));
const whites = found.filter((c) => WHITE.test(c));
const others = [...new Set(found.filter((c) => !WHITE.test(c)))];
if (whites.length) fail(`white parts (${whites.length}) are knockouts: one color can't paint them. Redraw them as a cut-out (a mask, or the shape's path with the hole in it), then import that file.`);
if (others.length > 1) fail(`more than one color (${others.join(', ')}): v2 icons are one color. Decide which parts stay, then import.`);
let body = inner
  .replace(colorRe, (m, attr, c) => (/^none$/i.test(c) ? m : `${attr}="currentColor"`))
  .replace(/\s(stroke-width|class|style)="[^"]*"/g, '')
  .replace(/\s+/g, ' ').trim();

const filled = /fill="currentColor"/.test(body) || (!/fill="none"/.test(svg.match(/^<svg[^>]*>/)[0]) && !/stroke="currentColor"/.test(body) && !/stroke="currentColor"/.test(svg.match(/^<svg[^>]*>/)[0]));
if (filled && !solid) fail('the drawing has filled shapes; pass --solid if it is meant to be a filled icon, or redraw it in lines');

// Another grid: scale into 24, and divide the stroke by the same factor so the line keeps v2's weight.
const k = 24 / Math.max(w, h);
if (x !== 0 || y !== 0 || k !== 1) {
  const dx = (24 - w * k) / 2 - x * k, dy = (24 - h * k) / 2 - y * k;
  const t = `${dx || dy ? `translate(${+dx.toFixed(4)} ${+dy.toFixed(4)}) ` : ''}scale(${+k.toFixed(6)})`;
  body = `<g transform="${t}" style="stroke-width:calc(var(--icon-stroke, 2) / ${+k.toFixed(6)})">${body}</g>`;
}
const root = solid
  ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">'
  : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">';
const out = `${root}${body}</svg>\n`;

// The set entry (and the live pointer, for a live source).
const setPath = join(ROOT, 'icons/set.json');
const set = JSON.parse(readFileSync(setPath, 'utf8'));
const was = set.icons[name];
set.icons[name] = { src: 'own', style: solid ? 'solid' : 'line', status: 'proposed', note: note ?? (liveName ? `Imported from the live site's ${liveName}` : was?.note ?? '') };
set.icons = Object.fromEntries(Object.keys(set.icons).sort().map((n) => [n, set.icons[n]]));
if (liveName && set.live[liveName]) set.live[liveName].use = name;

if (dry) { console.log(out); console.log(JSON.stringify({ [name]: set.icons[name] }, null, 2)); process.exit(0); }
writeFileSync(join(ROOT, 'public/icons', `${name}.svg`), out);
writeFileSync(setPath, JSON.stringify(set, null, 2) + '\n');
console.log(`public/icons/${name}.svg written${k !== 1 ? ` (scaled from a ${w}×${h} grid)` : ''}; icons/set.json: ${name} → own, ${solid ? 'solid' : 'line'}, proposed${was ? ` (was ${was.src})` : ''}${liveName ? `; live ${liveName} → ${name}` : ''}.`);
