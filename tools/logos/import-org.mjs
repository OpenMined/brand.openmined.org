#!/usr/bin/env node
/**
 * ORGANIZATION IMPORT — brings an organization's logo into the registry
 * (public/logos/orgs/<slug>/, orgs.json), so a page can show it.
 *
 *   npm run logos:import -- <slug> --name "Name" [--owner "Owner"] [--category tech]
 *       [--color <file.svg>] [--mono <file.svg>] [--one-color] [--role partner]…
 *       [--source "where the files came from"] [--note "…"] [--dry-run]
 *
 *   --color   the logo in its owner's colors, copied as supplied (never changed).
 *   --mono    the logo in one color: checked and turned into currentColor
 *             (tools/logos/mono.mjs), so it follows the color mode. Only a drawing
 *             that is one color comes in; white parts and second colors stop it.
 *   --one-color  the drawing's colors are one color in the mark (two near-identical
 *             navies, say): convert them together.
 *   --role    what the organization is to OpenMined (partner, press…); repeatable.
 *
 * An existing entry is updated: given files replace its own, roles are added.
 * Without a one-color file an organization can only sit on a white plate, and so
 * does any group it's in (Logos in a group all follow the mode, or all sit on white).
 * A group that follows the mode asks for each one-color file; the build stops when one
 * is missing (src/lib/orgs.ts).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { toMono } from './mono.mjs';

const args = process.argv.slice(2);
const fail = (m) => { console.error(`logos:import: ${m}`); process.exit(1); };
const opts = {}, roles = [];
let slug;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--dry-run' || a === '--one-color') opts[a.slice(2)] = true;
  else if (a === '--role') roles.push(args[++i]);
  else if (a.startsWith('--')) opts[a.slice(2)] = args[++i];
  else slug ??= a;
}
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail('usage: npm run logos:import -- <slug> --name "Name" [--color f.svg] [--mono f.svg] [--role partner]');

const ROOT = process.cwd(), DIR = join(ROOT, 'public/logos/orgs'), REG = join(DIR, 'orgs.json');
const reg = JSON.parse(readFileSync(REG, 'utf8'));
const was = reg.brands[slug];
const entry = { ...(was ?? {}) };
if (!was && !opts.name) fail(`"${slug}" is new: give it a --name`);
for (const k of ['name', 'owner', 'category', 'source']) if (opts[k]) entry[k] = opts[k];
if (opts.note) entry.notes = opts.note;
if (!entry.color && !opts.color && !opts.mono) fail('give a --color file, a --mono file, or both');

let monoOut;
if (opts.mono) {
  if (!existsSync(opts.mono)) fail(`no file ${opts.mono}`);
  try { monoOut = toMono(readFileSync(opts.mono, 'utf8'), { oneColor: !!opts['one-color'] }); }
  catch (e) { fail(`${opts.mono}: ${e.message}`); }
  entry.mono = `${slug}/logo-mono.svg`;
}
if (opts.color) {
  if (!existsSync(opts.color)) fail(`no file ${opts.color}`);
  if (!/\.svg$/i.test(opts.color)) fail('the color file should be an SVG');
  entry.color = `${slug}/logo.svg`;
}
if (roles.length) entry.roles = [...new Set([...(entry.roles ?? []), ...roles])];

const order = ['name', 'owner', 'category', 'roles', 'color', 'mono', 'source', 'notes'];
const tidy = Object.fromEntries([...order.filter((k) => k in entry), ...Object.keys(entry).filter((k) => !order.includes(k))].map((k) => [k, entry[k]]));
reg.brands[slug] = tidy;

if (opts['dry-run']) { console.log(JSON.stringify({ [slug]: tidy }, null, 2)); if (monoOut) console.log(monoOut.slice(0, 400) + '…'); process.exit(0); }
mkdirSync(join(DIR, slug), { recursive: true });
if (opts.color) copyFileSync(opts.color, join(DIR, slug, 'logo.svg'));
if (monoOut) writeFileSync(join(DIR, slug, 'logo-mono.svg'), monoOut);
writeFileSync(REG, JSON.stringify(reg, null, 2) + '\n');
console.log(`orgs.json: ${slug} ${was ? 'updated' : 'added'}${opts.color ? '; color copied as supplied' : ''}${monoOut ? '; one-color checked and written' : ''}${roles.length ? `; roles ${tidy.roles.join(', ')}` : ''}.`);
