#!/usr/bin/env node
/**
 * Census (lab research 2026-10-28): where the design system is used. Searches the
 * OpenMined GitHub organization (read-only, with your gh login) for the marks a
 * project carries when it uses the system:
 *   - the stamp in a copied file: "OpenMined Design System <version> · <commit>"
 *   - omds.json, the record the OMDS skill writes in an ongoing project
 *   - brand-version.txt, v1's record (a project still on v1)
 * and writes tools/census/consumers.json: repo, what was found, the version when it
 * can tell. One-off artifacts aren't in any repo, so they aren't counted, by design.
 *
 *   npm run census                 search and write consumers.json
 *   npm run census -- --dry-run    print, don't write
 *
 * GitHub code search reads default branches only and allows 10 requests a minute.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ORG = 'OpenMined';
const SELF = `${ORG}/brand.openmined.org`;
const search = (query, extra = []) => {
  try {
    return JSON.parse(execFileSync('gh', ['search', 'code', query, '--owner', ORG, ...extra, '--json', 'repository,path', '--limit', '100'], { encoding: 'utf8' }));
  } catch (e) { console.error(`search failed: ${query}: ${String(e.message).split('\n')[0]}`); return []; }
};
const MARKS = [
  { kind: 'stamp', results: search('"OpenMined Design System"') },
  { kind: 'omds.json', results: search('omds', ['--filename', 'omds.json']) },
  { kind: 'brand-version.txt (v1)', results: search('', ['--filename', 'brand-version.txt']) },
];
const repos = new Map();
for (const { kind, results } of MARKS) for (const r of results) {
  const repo = r.repository.nameWithOwner ?? r.repository.fullName ?? `${ORG}/${r.repository.name}`;
  if (repo === SELF) continue;
  if (!repos.has(repo)) repos.set(repo, { repo, found: [] });
  // The file only, not its path: folder names can carry people's names (copy stays role-only).
  const where = `${kind} (${r.path.split('/').length > 1 ? '…/' : ''}${r.path.split('/').pop()})`;
  if (!repos.get(repo).found.includes(where)) repos.get(repo).found.push(where);
}
const consumers = [...repos.values()].map(c => ({ ...c, version: c.found.every(f => f.startsWith('brand-version')) ? 'v1' : undefined }))
  .sort((a, b) => a.repo.localeCompare(b.repo));
const out = { generated: new Date().toISOString().slice(0, 10), note: 'Written by npm run census. Add consumers outside GitHub (Webflow, HubSpot, Docs templates) to manual[].', consumers, manual: [] };
console.log(`${consumers.length} consumer repo(s)${consumers.map(c => `\n  ${c.repo}: ${c.found.join('; ')}`).join('')}`);
if (!process.argv.includes('--dry-run')) { writeFileSync(join(ROOT, 'tools/census/consumers.json'), JSON.stringify(out, null, 2) + '\n'); console.log('wrote tools/census/consumers.json'); }
