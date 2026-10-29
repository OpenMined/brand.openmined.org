#!/usr/bin/env node
/**
 * Impact report (lab research 2026-10-28): before changing a token, see what it reaches.
 *
 *   npm run impact -- red-key                  what changes if --red-key changes
 *   npm run impact -- red-key --consumers      also search the projects in tools/census/consumers.json
 *
 * Lists: every token that resolves through it (in either mode), the guidance files that
 * govern or mention those names, the components, pages, examples and diagrams that use
 * them, the contrast pairs they're in, and (with --consumers) the consumer projects whose
 * code uses any of them. Reads the repo only; --consumers runs read-only GitHub searches.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const target = (args.find(a => !a.startsWith('--')) ?? '').replace(/^--/, '');
if (!target) { console.error('Usage: npm run impact -- <token-name> [--consumers]'); process.exit(1); }

const MODES = ['light', 'dark'].map(m => JSON.parse(readFileSync(join(ROOT, `src/tokens/v2/tokens.${m}.json`), 'utf8')));
if (!MODES.some(t => t[`--${target}`])) { console.error(`No token --${target} in the v2 build.`); process.exit(1); }

// Reverse references: which tokens name --x in their value (aliases, gradients, shadows).
const users = new Map();
for (const t of MODES) for (const [name, e] of Object.entries(t)) {
  for (const m of String(e.value).matchAll(/var\((--[\w-]+)\)/g)) {
    if (!users.has(m[1])) users.set(m[1], new Set());
    users.get(m[1]).add(name);
  }
}
const affected = new Set([`--${target}`]);
for (let grew = true; grew;) {
  grew = false;
  for (const n of [...affected]) for (const u of users.get(n) ?? []) if (!affected.has(u)) { affected.add(u); grew = true; }
}
const names = [...affected].sort();

const walk = (dir, keep) => {
  const out = [];
  if (!existsSync(join(ROOT, dir))) return out;
  (function go(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? go(p) : keep(p) && out.push(p); } })(join(ROOT, dir));
  return out;
};
// A name written out anywhere (var(--name), a frontmatter tokens list, prose, a string), or
// bare in a token helper call ('name'). Names built in code (`--${hue}-key`) can't be found
// this way: the examples cover those, so look at them too.
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const usesIn = (file, list) => {
  const text = readFileSync(file, 'utf8');
  return list.filter(n => new RegExp(`${esc(n)}(?![\\w-])`).test(text) || text.includes(`'${n.slice(2)}'`));
};
const group = (label, files, list) => {
  const hits = files.map(f => [relative(ROOT, f), usesIn(f, list)]).filter(([, u]) => u.length);
  console.log(`\n${label} (${hits.length})`);
  for (const [f, u] of hits) console.log(`  ${f}  ${u.join(', ')}`);
  return hits;
};

console.log(`Impact of changing --${target}`);
console.log(`\nTokens that resolve through it (${names.length})\n  ${names.join('\n  ')}`);
const guides = group('Guidance (design/)', walk('design', p => p.endsWith('.md') && !p.includes('/design/media/')), names);
const comps = group('Components (components/)', walk('components', p => /\.(css|js)$/.test(p)), names);
// Medium pages (design/media/) that name one of those guidance or component files: their
// pages pull the files in, so they change with them.
const guideSlugs = guides.map(([f]) => f.replace(/^design\//, '').replace(/\.md$/, ''));
const compNames = comps.map(([f]) => f.replace(/^components\//, '').replace(/\.(css|js)$/, ''));
const media = walk('design/media', p => p.endsWith('.md')).map(f => {
  const fm = readFileSync(f, 'utf8').split('---')[1] ?? '';
  const named = [...guideSlugs.filter(s => new RegExp(`(^|[\\s\\[,-])${esc(s)}($|[\\s,\\]])`, 'm').test(fm)),
    ...compNames.filter(c => new RegExp(`components: \\[[^\\]]*\\b${esc(c)}\\b`).test(fm))];
  return [relative(ROOT, f), [...new Set(named)]];
}).filter(([, n]) => n.length);
console.log(`\nMedium pages that pull them in (${media.length})`);
for (const [f, n] of media) console.log(`  ${f}  ${n.join(', ')}`);
const pages = group('Pages, examples and diagrams', [...walk('src/pages', p => /\.(astro|ts)$/.test(p)), ...walk('src/examples', p => p.endsWith('.astro')), ...walk('src/diagrams', p => /\.(astro|ts)$/.test(p)), ...walk('src/components/site', p => p.endsWith('.astro')), ...walk('src/styles', p => p.endsWith('.css'))], names);
const pairs = JSON.parse(readFileSync(join(ROOT, 'tools/contrast/pairs.json'), 'utf8'));
const inPairs = pairs.rules.filter(r => [...r.fg, ...r.bg].some(n => names.includes(`--${n}`) || /\{(hue|status)\}/.test(n) && names.some(x => new RegExp(`^--${n.replace(/\{(hue|status)\}/, '[a-z]+')}$`).test(x))));
console.log(`\nContrast promises it's in (${inPairs.length})${inPairs.map(r => `\n  ${r.name}: ${r.source}`).join('')}`);
console.log(`\nLook at before and after: http://localhost:4321/examples/ and the pages above; npm run contrast for the ratios.`);

if (args.includes('--consumers')) {
  const file = join(ROOT, 'tools/census/consumers.json');
  if (!existsSync(file)) { console.log('\nConsumers: none recorded yet (npm run census).'); process.exit(0); }
  const { consumers } = JSON.parse(readFileSync(file, 'utf8'));
  console.log(`\nConsumers using these names (searching ${consumers.length} repos)`);
  for (const c of consumers) {
    const hit = [];
    for (const n of names) {
      try {
        const r = JSON.parse(execFileSync('gh', ['search', 'code', n, '--repo', c.repo, '--json', 'path', '--limit', '5'], { encoding: 'utf8' }));
        if (r.length) hit.push(`${n} (${r.map(x => x.path).join(', ')})`);
      } catch { hit.push(`${n}: search failed`); }
    }
    console.log(`  ${c.repo} @ ${c.version ?? 'unknown version'}${hit.length ? `\n    ${hit.join('\n    ')}` : ': none'}`);
  }
}
