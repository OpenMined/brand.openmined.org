/**
 * The v2 components (components/ at the repo root), read at build time so the
 * Interface page shows each one's files and reference markup straight from the
 * code. The markup is the "Markup:" block at the top of each CSS file.
 */
const CSS = import.meta.glob('/components/*.css', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const JS = import.meta.glob('/components/*.js', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export type ComponentCode = { css: string[]; js: { file: string; fns: string[] }[]; markup: string };

/** The reference markup from a CSS file's header: the lines indented under "Markup…:". */
function markupOf(src: string): string {
  const lines = src.split('\n');
  let i = lines.findIndex((l) => /^\s*Markup\b/.test(l));
  if (i < 0) return '';
  while (i < lines.length && !lines[i].trimEnd().endsWith(':')) i++;
  const out: string[] = [];
  for (const l of lines.slice(i + 1)) {
    if (!/^ {5}\S/.test(l) && !/^ {6,}/.test(l)) break;
    out.push(l.slice(5));
  }
  return out.join('\n');
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
