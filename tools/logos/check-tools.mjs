#!/usr/bin/env node
/**
 * TOOL MARKS CHECK (`npm run logos:check`, run by CI in lint.yml) — every SVG under public/logos/tools is stored
 * exactly as tools/logos/sanitize.mjs rebuilds it, and every icon.svg is one color
 * (tools/logos/mono.mjs), with no ids in an icon.svg and every id brand-prefixed. A mark
 * that didn't come through the allowlist, or was edited by hand afterwards, fails this
 * check, which CI runs on every pull request (decision 2026-11-20, tool marks pass an allowlist).
 * `--fix` rewrites files to their sanitized form
 * (the drawing is unchanged; only editor noise and formatting go).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { sanitizeSvg } from './sanitize.mjs';
import { monoProblems } from './mono.mjs';

const ROOT = join(process.cwd(), 'public', 'logos', 'tools');
const fix = process.argv.includes('--fix');
const problems = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!f.endsWith('.svg')) continue;
    const rel = p.slice(ROOT.length + 1);
    const src = readFileSync(p, 'utf8');
    let clean;
    try { clean = sanitizeSvg(src); } catch (e) { problems.push(`${rel}: ${e.message}`); continue; }
    if (clean !== src) {
      if (fix) writeFileSync(p, clean);
      else problems.push(`${rel}: not in sanitized form (run node tools/logos/check-tools.mjs --fix)`);
    }
    if (f === 'icon.svg') for (const m of monoProblems(clean)) problems.push(`${rel}: ${m}`);
    // An icon.svg is inlined, often more than once on a page: an id would collide, and a
    // reference would follow the first copy (hidden or not). Other files are used as images,
    // where ids stay inside the file, but carry the brand's prefix so two marks never share one.
    const brand = rel.split('/')[0];
    const ids = [...clean.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    if (f === 'icon.svg' && (ids.length || /url\(#|href="#/.test(clean))) problems.push(`${rel}: an icon.svg has ids or references (draw it without masks, clip paths or gradients by id)`);
    for (const id of ids) if (!id.startsWith(`${brand}-`)) problems.push(`${rel}: id "${id}" doesn't start with "${brand}-"`);
  }
};
walk(ROOT);
if (problems.length) {
  console.error(`tool marks: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`tool marks: ok${fix ? ' (fixed)' : ''}`);
