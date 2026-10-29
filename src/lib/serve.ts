/**
 * What the site serves for people and AI agents (lab LAUNCH section 4): the live
 * site is the entry point, so every value, rule and component is readable from it
 * as plain files, generated at build from the sources (no copies committed).
 *
 * Every served file carries a stamp naming the version and the commit it was built
 * from, so a project that copies it can be traced and checked for impact later
 * (lab research 2026-10-28, feedback and deployment audit).
 */
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import PKG from '../../package.json';
import LIGHT_TOKENS from '../tokens/v2/tokens.light.json';

export const ROOT = process.cwd();
export const HOST = 'https://design.openmined.org';
export const VERSION: string = PKG.version;
export const SHA = (() => {
  try { return execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; }
})();
/** One line: what this is, which version, which commit, where it came from. */
export const STAMP = `OpenMined Design System ${VERSION} · ${SHA} · ${HOST}`;

/** A stamp as a comment in the file's own syntax. */
export const stamped = (text: string, kind: 'css' | 'js' | 'md' | 'html') => {
  const line = kind === 'md' || kind === 'html' ? `<!-- ${STAMP} -->` : `/* ${STAMP} */`;
  return `${line}\n${text}`;
};

export const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');

/** Every file under a folder, as paths relative to it. */
export function walk(dir: string, keep: (rel: string) => boolean = () => true): string[] {
  const base = join(ROOT, dir), out: string[] = [];
  (function go(d: string) {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) go(p);
      else if (keep(relative(base, p))) out.push(relative(base, p));
    }
  })(base);
  return out.sort();
}

const TYPES: Record<string, string> = {
  css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', json: 'application/json; charset=utf-8',
  md: 'text/markdown; charset=utf-8', txt: 'text/plain; charset=utf-8', html: 'text/html; charset=utf-8',
};
export const respond = (body: string, ext: string) =>
  new Response(body, { headers: { 'Content-Type': TYPES[ext] ?? 'text/plain; charset=utf-8' } });

/** The component CSS files in the order components/index.css imports them. */
export const componentCssOrder = () =>
  [...read('components/index.css').matchAll(/@import '\.\/([\w-]+\.css)';/g)].map(m => m[1]);

/** Tokens + every component, one stylesheet: the file to paste or link. */
export function omdsCss() {
  const parts = [`/* ── tokens ── */\n${read('src/tokens/v2/tokens.css')}`,
    ...componentCssOrder().map(f => `/* ── components/${f} ── */\n${read(`components/${f}`)}`)];
  return stamped(parts.join('\n'), 'css');
}

/** Every component script as one ES module with no imports (bundled from components/index.js). */
export async function omdsJs() {
  const { build } = await import('esbuild');
  const r = await build({ entryPoints: [join(ROOT, 'components/index.js')], bundle: true, format: 'esm', write: false, target: 'es2020', legalComments: 'none' });
  return stamped(r.outputFiles[0].text, 'js');
}

/** /embeds/brand-colors.js: the embeds' colors, from the v2 token build (light mode). */
const T = LIGHT_TOKENS as Record<string, { resolved: string }>;
const v = (n: string) => { const e = T[`--${n}`]; if (!e) throw new Error(`brand-colors: no token --${n}`); return e.resolved; };
const list = (n: string) => [...T[`--gradient-${n}`].resolved.matchAll(/#[0-9a-f]{6}/gi)].map(m => m[0]);

/** v1's helper functions, appended unchanged (src/lib/embed-colors-helpers.js). */
const FNS = readFileSync(join(ROOT, 'src/lib/embed-colors-helpers.js'), 'utf8');

export function brandColorsJs() {
  const P: Record<string, string> = {
    gold: v('gradient-gold'), orange: v('gradient-orange'), red: v('gradient-red'), red600: v('gradient-red'),
    violet: v('gradient-violet'), blue: v('gradient-blue'), teal: v('gradient-teal'), green: v('gradient-green'),
    lime: v('gradient-lime'), yellow: v('gradient-yellow'),
  };
  const G: Record<string, string[]> = {
    spectrum: list('spectrum'), stream: list('flow'), flow: list('flow'), map: list('map'), interactive: list('interactive'),
    'gold-orange': [P.gold, P.orange], 'orange-red': [P.orange, P.red], 'red-violet': [P.red, P.violet], 'violet-blue': [P.violet, P.blue],
    'teal-green': [P.teal, P.green], 'green-lime': [P.green, P.lime], 'lime-yellow': [P.lime, P.yellow],
    warm: [P.gold, P.orange, P.red], cool: [P.blue, P.teal, P.green],
  };
  const body = `/* ${STAMP} */
/**
 * OpenMined Design System: brand colors for canvas and WebGL (the <om-*> embeds).
 * Generated from the v2 tokens; never hand-type hex into a shader. Light-mode values:
 * graphics use fixed steps. Pass a page's own colors through an embed's colors
 * attribute to follow the color mode.
 */
export const PALETTE = ${JSON.stringify(P, null, 2)};

export const GRADIENTS = ${JSON.stringify(G, null, 2)};

${FNS}`;
  return body;
}

/** An embed as one file with its colors inlined, for places that can't load a
 *  second file (a Claude artifact, a CMS block). */
export async function singleEmbed(name: string) {
  const { build } = await import('esbuild');
  const colors = brandColorsJs();
  const r = await build({
    entryPoints: [join(ROOT, 'public/embeds', name)], bundle: true, format: 'esm', write: false, target: 'es2020', legalComments: 'inline',
    plugins: [{ name: 'brand-colors', setup(b) {
      b.onResolve({ filter: /brand-colors\.js$/ }, () => ({ path: 'brand-colors', namespace: 'omds' }));
      b.onLoad({ filter: /.*/, namespace: 'omds' }, () => ({ contents: colors, loader: 'js' }));
    } }],
  });
  return stamped(r.outputFiles[0].text, 'js');
}

/** Every component script with every component started, as one script with no imports:
 *  for the full starter, pasted inline. */
export async function omdsStartJs() {
  const { build } = await import('esbuild');
  const r = await build({
    stdin: { contents: "import * as o from './components/index.js';\no.buttonHover(); o.hoverCards(); o.cardFlows(); o.linkCards(); o.fieldLights(); o.tabs(); o.codeCopy(); o.toc(); o.lineFlow(); o.themeToggle();", resolveDir: ROOT, loader: 'js' },
    bundle: true, format: 'esm', write: false, target: 'es2020', legalComments: 'none',
  });
  return r.outputFiles[0].text;
}
