#!/usr/bin/env node
/**
 * Census (lab research 2026-10-28; decision 2026-11-02 *Usage is traced from the files*):
 * where the design system is used, read from what projects already carry. Nothing is added
 * to anyone's repo. Searches the OpenMined GitHub organization (read-only, with your gh login):
 *   - stamp: the first line of every CSS and JS file the site serves,
 *     "OpenMined Design System <version> · <commit>", kept in a copied file
 *   - link: code that loads files from design.openmined.org instead of copying them
 *   - names: the system's own token, embed and class names, for parts taken by hand or a
 *     copy whose stamp was dropped
 *   - omds-version.txt (brand-version.txt before 2026-11-05): the skill's record of the
 *     version in the project (decisions 2026-11-04, 2026-11-05). The line is read, not the
 *     name: a file with the stamp's words is v2 whichever name it has; one without is v1's
 * For each stamped CSS or JS copy it fetches the file and compares it with what the system
 * served at the commit in its stamp: lines the project added or changed are its local
 * changes. A copy that leaves parts out isn't a change; the reasons come through feedback.
 * Writes tools/census/consumers.json: repo, what was found, the version, local changes.
 *
 *   npm run census                 search and write consumers.json
 *   npm run census -- --dry-run    print, don't write
 *
 * GitHub code search reads default branches only and allows 10 requests a minute (this
 * makes 8). The comparison needs the stamp's commit in your local clone (git fetch).
 * Pages served at run time (linked, not copied) only show here if their code is in a repo;
 * one-off artifacts aren't in any repo, so they aren't counted, by design.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ORG = 'OpenMined';
const SELF = `${ORG}/brand.openmined.org`;
const gh = (args) => execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 << 20 });
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
let failed = 0;
const search = (query, extra = []) => {
  try {
    return JSON.parse(gh(['search', 'code', query, '--owner', ORG, ...extra, '--json', 'repository,path', '--limit', '100']));
  } catch (e) { failed++; console.error(`search failed: ${query}: ${String(e.message).split('\n')[0]}`); return []; }
};

/** Names only the system uses: a hit means the project took something from it. */
const NAMES = ['"--surface-raise-1"', '"--on-key"', '"om-diamond"', '"om-stream"'];
const MARKS = [
  { kind: 'stamp', results: search('"OpenMined Design System"') },
  { kind: 'link', results: search('"design.openmined.org"') },
  ...NAMES.map(n => ({ kind: `name ${n.replace(/"/g, '')}`, results: search(n) })),
  { kind: 'omds-version.txt', results: search('', ['--filename', 'omds-version.txt']) },
  { kind: 'brand-version.txt', results: search('', ['--filename', 'brand-version.txt']) },
];

const repos = new Map();
const stamped = [];
const records = [];
for (const { kind, results } of MARKS) for (const r of results) {
  const repo = r.repository.nameWithOwner ?? r.repository.fullName ?? `${ORG}/${r.repository.name}`;
  if (repo === SELF) continue;
  if (!repos.has(repo)) repos.set(repo, { repo, found: [], versions: new Set(), changes: [] });
  // The file only, not its path: folder names can carry people's names (copy stays role-only).
  const where = `${kind} (${r.path.split('/').length > 1 ? '…/' : ''}${r.path.split('/').pop()})`;
  if (!repos.get(repo).found.includes(where)) repos.get(repo).found.push(where);
  if (kind === 'stamp' && /\.(css|js|mjs)$/.test(r.path)) stamped.push({ repo, path: r.path });
  if (kind === 'omds-version.txt' || kind === 'brand-version.txt') records.push({ repo, path: r.path });
}

/** The lines the system served at a commit, from the files the served CSS and JS are made of
 *  (src/lib/serve.ts): a component's own file when the copy keeps its name (button.css), else
 *  the token build and every component (omds.css, or a renamed copy). Bundled files (omds.js,
 *  the one-file embeds) are reformatted by the bundler, so their lines won't all match. */
const served = new Map();
function servedLines(sha, name) {
  const key = `${sha}:${name}`;
  if (served.has(key)) return served.get(key);
  let lines = null;
  try {
    const all = git(['ls-tree', '-r', '--name-only', sha, '--', 'components', 'src/tokens/v2', 'public/embeds', 'src/lib/embed-colors-helpers.js'])
      .split('\n').filter(f => /\.(css|js)$/.test(f));
    const own = all.filter(f => f === `components/${name}` || f === `public/embeds/${name}`);
    lines = new Set((own.length ? own : all).flatMap(f => git(['show', `${sha}:${f}`]).split('\n').map(norm)));
  } catch { /* commit not in this clone */ }
  served.set(key, lines);
  return lines;
}
const norm = (l) => l.trim();
const STAMP = /OpenMined Design System (\S+) · ([0-9a-f]{7,40})/;

const fetchText = (repo, path) => Buffer.from(JSON.parse(gh(['api', `repos/${repo}/contents/${path}`])).content, 'base64').toString('utf8');

// brand-version.txt: the stamp's line names the version; without it the file is v1's.
for (const { repo, path } of records) {
  let text = '';
  try { text = fetchText(repo, path); } catch { /* unreadable: counted as found, version unknown */ continue; }
  const m = text.match(STAMP);
  repos.get(repo).versions.add(m ? m[1] : 'v1');
}

for (const { repo, path } of stamped) {
  const c = repos.get(repo);
  let text;
  try { text = fetchText(repo, path); }
  catch { c.changes.push({ file: path.split('/').pop(), note: 'could not read the file' }); continue; }
  const m = text.match(STAMP);
  if (!m) continue;
  const [, version, sha] = m;
  c.versions.add(version);
  const file = path.split('/').pop();
  const lines = servedLines(sha, file);
  if (!lines) { c.changes.push({ file, version, commit: sha, note: 'commit not in this clone: git fetch, then run again' }); continue; }
  const own = text.split('\n').map(norm).filter(l => l && !STAMP.test(l) && !lines.has(l));
  if (own.length) c.changes.push({ file, version, commit: sha, lines: own.length, sample: own.slice(0, 5) });
}

const consumers = [...repos.values()].map(({ versions, changes, ...c }) => ({
  ...c,
  version: versions.size ? [...versions].join(', ') : undefined,
  ...(changes.length ? { changes } : {}),
})).sort((a, b) => a.repo.localeCompare(b.repo));

const out = {
  generated: new Date().toISOString().slice(0, 10),
  note: 'Written by npm run census. changes: lines a stamped copy has that the system did not serve at its commit. Add consumers outside GitHub (Webflow, HubSpot, Docs templates) to manual[].',
  consumers,
  manual: [],
};
// Keep the hand-kept entries across runs.
const FILE = join(ROOT, 'tools/census/consumers.json');
if (existsSync(FILE)) out.manual = JSON.parse(readFileSync(FILE, 'utf8')).manual ?? [];

console.log(`${consumers.length} consumer repo(s)${consumers.map(c =>
  `\n  ${c.repo}${c.version ? ` [${c.version}]` : ''}: ${c.found.join('; ')}${(c.changes ?? []).map(ch =>
    `\n    ${ch.file}: ${ch.note ?? `${ch.lines} line(s) of its own`}`).join('')}`).join('')}`);
if (failed) { console.error(`${failed} search(es) failed (GitHub allows 10 a minute): consumers.json not written; run again in a minute.`); process.exit(1); }
if (!process.argv.includes('--dry-run')) { writeFileSync(FILE, JSON.stringify(out, null, 2) + '\n'); console.log('wrote tools/census/consumers.json'); }
