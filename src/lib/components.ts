/**
 * The v2 components (components/ at the repo root), read at build time so the
 * Interface page shows each one's files and reference markup straight from the
 * code. The markup is the "Markup:" block at the top of each CSS file.
 */
const CSS = import.meta.glob('/components/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const JS = import.meta.glob('/components/*.js', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export type ComponentCode = { css: string[]; js: { file: string; fns: string[] }[]; markup: string };

/**
 * The reference markup from a CSS file's header: the lines indented 5 or more spaces under
 * "Markup…:". `next` is the line that ended the block, for the check below.
 */
function parseMarkup(src: string): { found: boolean; markup: string; next: string } {
  const lines = src.split('\n');
  let i = lines.findIndex((l) => /^\s*Markup\b/.test(l));
  if (i < 0) return { found: false, markup: '', next: '' };
  while (i < lines.length && !lines[i].trimEnd().endsWith(':')) i++;
  const out: string[] = [];
  let j = i + 1;
  for (; j < lines.length; j++) {
    const l = lines[j];
    if (!/^ {5}\S/.test(l) && !/^ {6,}/.test(l)) break;
    out.push(l.slice(5));
  }
  return { found: true, markup: out.join('\n'), next: lines[j] ?? '' };
}
const markupOf = (src: string) => parseMarkup(src).markup;

/*
 * Every Markup block must parse, or the Interface page shows an empty or cut-short code panel
 * and the build passes. A block is its lines indented 5 spaces or more, then a blank line
 * (or the comment's end). Fails on a block that reads as empty (its first line indented too
 * little) or one that stops anywhere else (a line partway through indented too little, or
 * notes with no blank line before them).
 */
for (const [path, src] of Object.entries(CSS)) {
  const { found, markup, next } = parseMarkup(src);
  if (!found) continue;
  const file = path.slice(1);
  if (!markup.trim()) throw new Error(`${file}: its Markup block reads as empty; indent the markup 5 spaces under "Markup:" (components/README.md)`);
  const end = next.trim();
  if (end !== '' && !end.startsWith('*/')) throw new Error(`${file}: its Markup block stops at "${end.slice(0, 60)}"; indent every line of markup at least 5 spaces, and leave a blank line after the block (components/README.md)`);
}

/** A component's code: its CSS files (the first holds the markup) and scripts with their exported functions. */
export function componentCode(css: string[], js: string[] = []): ComponentCode {
  for (const f of [...css.map((c) => `${c}.css`), ...js.map((j) => `${j}.js`)]) {
    if (!CSS[`/components/${f}`] && !JS[`/components/${f}`]) throw new Error(`components/${f} not found`);
  }
  return {
    css: css.map((c) => `components/${c}.css`),
    js: js.map((j) => ({ file: `components/${j}.js`, fns: [...JS[`/components/${j}.js`].matchAll(/^export function (\w+)/gm)].map((m) => `${m[1]}()`) })),
    markup: markupOf(CSS[`/components/${css[0]}.css`]),
  };
}
