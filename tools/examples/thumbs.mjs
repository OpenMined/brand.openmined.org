#!/usr/bin/env node
/**
 * Example thumbnails: one still per example and color mode for the Examples page,
 * so it shows pictures instead of running every example live in a frame.
 *
 *   npm run dev                       (or npm run preview after a build)
 *   npm run examples:thumbs           every example
 *   npm run examples:thumbs -- home   only these
 *
 * Opens each example at 1440×900 in headless Chrome (?theme=light|dark), waits for
 * the graphics to draw, and writes public/examples/thumbs/<slug>-<mode>.webp at
 * 720×450 (cwebp). Run it after changing an example; the Examples page fails the
 * build when an example has no thumbnail.
 *
 * Env: OMDS_BASE (default http://localhost:4321), CHROME (default the macOS app path).
 */
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const BASE = process.env.OMDS_BASE ?? 'http://localhost:4321';
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = 'public/examples/thumbs';
const MODES = ['light', 'dark'];

/** Slugs from the registry (src/lib/examples.ts), read as text: no TypeScript loader. */
const ALL = [...readFileSync('src/lib/examples.ts', 'utf8').matchAll(/\{ slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
const pick = process.argv.slice(2);
const slugs = pick.length ? pick : ALL;
for (const s of pick) if (!ALL.includes(s)) { console.error(`No example "${s}" in src/lib/examples.ts`); process.exit(1); }
if (!existsSync(CHROME)) { console.error(`Chrome not found at ${CHROME} (set CHROME)`); process.exit(1); }
try { execFileSync('cwebp', ['-version'], { stdio: 'ignore' }); } catch { console.error('cwebp not found (brew install webp)'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** One screenshot. Headless Chrome can hang after writing the file, so wait for the
 *  file, then stop it. */
async function shot(url, png) {
  const profile = mkdtempSync(join(tmpdir(), 'omds-thumb-'));
  const chrome = spawn(CHROME, ['--headless=new', `--user-data-dir=${profile}`, '--hide-scrollbars',
    '--window-size=1440,900', '--virtual-time-budget=10000', `--screenshot=${png}`, url], { stdio: 'ignore' });
  for (let i = 0; i < 120 && !(existsSync(png) && statSync(png).size > 0); i++) await sleep(250);
  await sleep(300);
  chrome.kill('SIGKILL');
  rmSync(profile, { recursive: true, force: true });
  if (!existsSync(png)) throw new Error(`no screenshot for ${url}`);
}

const tmp = mkdtempSync(join(tmpdir(), 'omds-thumbs-'));
const jobs = slugs.flatMap((slug) => MODES.map((mode) => ({ slug, mode })));
const run = async ({ slug, mode }) => {
  const png = join(tmp, `${slug}-${mode}.png`);
  await shot(`${BASE}/examples/${slug}/?theme=${mode}`, png);
  const webp = join(OUT, `${slug}-${mode}.webp`);
  execFileSync('cwebp', ['-quiet', '-q', '80', '-resize', '720', '450', png, '-o', webp]);
  console.log(`wrote ${webp}`);
};
for (let i = 0; i < jobs.length; i += 3) await Promise.all(jobs.slice(i, i + 3).map(run));
rmSync(tmp, { recursive: true, force: true });
