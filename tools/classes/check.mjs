#!/usr/bin/env node
/**
 * Class contract: every class a page, an example or a component's Markup block uses
 * from a component (a class whose block, the part before __ or --, a component
 * defines) must exist. Catches a component class renamed or removed while copies of
 * its markup still use the old name: the site's own wrappers and demos, the examples,
 * and the Markup blocks at the top of each components/*.css.
 *
 *   npm run lint          (runs this after stylelint)
 *   node tools/classes/check.mjs
 *
 * Defined: every class in a selector in components/*.css. Only these count for a
 * component's classes: a page's own rule for .lcard__text would otherwise hide that
 * class being renamed in link-card.css. Keep page classes out of a component's names. Used: static class names in
 * class="…", class:list={[…]} and class={`…`} (parts built from ${…} are skipped),
 * and the class attributes in each Markup block. A class whose block no component
 * defines (the site's own, a page's own) isn't checked.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (dir, ext) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p, ext) : p.endsWith(ext) ? [p] : [];
});
const noComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
/** Class names in the selectors of a stylesheet (not in values: url(), numbers). */
const selectorClasses = (css) => {
  const out = new Set();
  for (const m of noComments(css).matchAll(/([^{}]+)\{/g)) {
    const sel = m[1];
    if (sel.trim().startsWith('@')) continue;
    for (const c of sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.add(c[1]);
  }
  return out;
};
const block = (c) => c.split(/__|--/)[0];

const COMPONENT_FILES = readdirSync('components').filter((f) => f.endsWith('.css')).map((f) => join('components', f));
const WIP_FILES = existsSync('components/wip') ? readdirSync('components/wip').filter((f) => f.endsWith('.css')).map((f) => join('components/wip', f)) : [];
const ASTRO = walk('src', '.astro');
const isWipPart = (f) => /^src\/(pages\/wip|components\/site\/wip)\//.test(f);
const releasedClasses = new Set(COMPONENT_FILES.flatMap((f) => [...selectorClasses(readFileSync(f, 'utf8'))]));
const wipClasses = new Set(WIP_FILES.flatMap((f) => [...selectorClasses(readFileSync(f, 'utf8'))].map((c) => [f, c])).filter(([, c]) => !releasedClasses.has(c)).map(([, c]) => c));
const releasedBlocks = new Set([...releasedClasses].map(block));
const wipBlocks = new Set([...wipClasses].map(block));

/** Static class names in one class attribute's value. */
const names = (value) => value.replace(/[\w-]*\$\{[^}]*\}[\w-]*/g, ' ').split(/[\s'",[\]{}`]+/).filter((t) => /^[_a-zA-Z][\w-]*$/.test(t));
const problems = [];
for (const f of WIP_FILES) {
  // A WIP file may style a released class it builds on (a .btn inside a dialog's head) and may
  // add a modifier to a released block (.switch--quiet, a variant in progress), but not an element
  // or the block itself: a new part gets its own name.
  for (const c of selectorClasses(readFileSync(f, 'utf8'))) {
    const variant = !c.includes('__') && c.includes('--');
    if (!releasedClasses.has(c) && releasedBlocks.has(block(c)) && !variant) problems.push(`${f}  .${c}: work in progress can't add an element to a released component's block (.${block(c)}); a variant is .${block(c)}--name, a new part gets its own name`);
  }
}
const check = (file, line, cls, where, wipOk) => {
  const b = block(cls);
  // A WIP variant of a released block (.switch--quiet) is work in progress wherever it's used.
  if (wipClasses.has(cls) && releasedBlocks.has(b)) { if (!wipOk) problems.push(`${file}:${line}  .${cls} (${where}) is work in progress (components/wip/); released work can't use it`); return; }
  if (releasedBlocks.has(b)) { if (!releasedClasses.has(cls)) problems.push(`${file}:${line}  .${cls} (${where}) isn't defined by its component`); return; }
  if (!wipBlocks.has(b)) return;
  if (!wipOk) problems.push(`${file}:${line}  .${cls} (${where}) is work in progress (components/wip/); released work can't use it`);
  else if (!wipClasses.has(cls)) problems.push(`${file}:${line}  .${cls} (${where}) isn't defined by its work-in-progress component`);
};
const lineAt = (text, i) => text.slice(0, i).split('\n').length;

for (const f of ASTRO) {
  const text = readFileSync(f, 'utf8');
  const attrs = [
    ...text.matchAll(/\bclass="([^"]*)"/g),
    ...text.matchAll(/\bclass=\{`([^`]*)`\}/g),
    ...text.matchAll(/\bclass:list=\{\[([^\]]*)\]\}/g),
  ];
  for (const m of attrs) for (const c of names(m[1].replace(/&&[^,\]]*?(?=['"`])/g, ' '))) check(f, lineAt(text, m.index), c, 'class attribute', isWipPart(f));
}
for (const f of [...COMPONENT_FILES, ...WIP_FILES]) {
  const text = readFileSync(f, 'utf8');
  const head = text.slice(0, text.indexOf('*/'));
  for (const m of head.matchAll(/\bclass="([^"]*)"/g)) for (const c of names(m[1])) check(f, lineAt(text, m.index), c, 'Markup block', WIP_FILES.includes(f));
}

// A released component's script or stylesheet list may not pull in work in progress: esbuild would
// bundle it into /omds.js, and the served copy would import a file that isn't served.
for (const f of readdirSync('components').filter((f) => /\.(js|css)$/.test(f)).map((f) => join('components', f))) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/(?:\bimport\b[^'"]*|@import\s+(?:url\()?)['"](\.\/wip\/[^'"]+)['"]/g)) {
    problems.push(`${f}:${lineAt(text, m.index)}  imports ${m[1]}, work in progress (release it first, or keep this in wip/)`);
  }
}

if (problems.length) {
  console.error(`Class contract: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ class contract: every component class in use is defined (${ASTRO.length} pages and parts, ${COMPONENT_FILES.length} component files, ${WIP_FILES.length} in progress)`);
