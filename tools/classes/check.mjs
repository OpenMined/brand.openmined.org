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
import { readFileSync, readdirSync, statSync } from 'node:fs';
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
const ASTRO = walk('src', '.astro');
const componentClasses = new Set(COMPONENT_FILES.flatMap((f) => [...selectorClasses(readFileSync(f, 'utf8'))]));
const blocks = new Set([...componentClasses].map(block));

/** Static class names in one class attribute's value. */
const names = (value) => value.replace(/[\w-]*\$\{[^}]*\}[\w-]*/g, ' ').split(/[\s'",[\]{}`]+/).filter((t) => /^[_a-zA-Z][\w-]*$/.test(t));
const problems = [];
const check = (file, line, cls, where) => {
  if (blocks.has(block(cls)) && !componentClasses.has(cls)) problems.push(`${file}:${line}  .${cls} (${where}) isn't defined by its component`);
};
const lineAt = (text, i) => text.slice(0, i).split('\n').length;

for (const f of ASTRO) {
  const text = readFileSync(f, 'utf8');
  const attrs = [
    ...text.matchAll(/\bclass="([^"]*)"/g),
    ...text.matchAll(/\bclass=\{`([^`]*)`\}/g),
    ...text.matchAll(/\bclass:list=\{\[([^\]]*)\]\}/g),
  ];
  for (const m of attrs) for (const c of names(m[1].replace(/&&[^,\]]*?(?=['"`])/g, ' '))) check(f, lineAt(text, m.index), c, 'class attribute');
}
for (const f of COMPONENT_FILES) {
  const text = readFileSync(f, 'utf8');
  const head = text.slice(0, text.indexOf('*/'));
  for (const m of head.matchAll(/\bclass="([^"]*)"/g)) for (const c of names(m[1])) {
    if (!componentClasses.has(c) && blocks.has(block(c))) problems.push(`${f}:${lineAt(text, m.index)}  .${c} (Markup block) isn't defined by any component`);
  }
}

if (problems.length) {
  console.error(`Class contract: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ class contract: every component class in use is defined (${ASTRO.length} pages and parts, ${COMPONENT_FILES.length} component files)`);
