/**
 * Media: what you're making (web pages, Claude artifacts, slides…), one guidance file
 * per medium in design/media/ (type Medium). Each file picks what its medium needs by
 * name: the way in (start), guidance files, component files and examples; its own text
 * holds only advice that belongs to that medium. Everything else is pulled from its one
 * source here, never copied: titles and descriptions from the guidance files, a
 * component's markup from the top of its CSS file, examples from src/lib/examples.ts.
 * Decision 2026-10-29, a page per medium.
 *
 * Checked at build (any build): every name resolves, and every example is on at least
 * one medium's page. Drafts named here fail a production build (src/lib/release-gate.ts).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { DOCS, type Doc } from './design';
import { EXAMPLES, example, type Example } from './examples';
import { PAGES } from './pages';

export type Start = { label: string; href?: string; note?: string };
export type Level = 'covered' | 'partly' | 'not-yet';
export type ComponentFile = { name: string; css: string; js?: string; guide?: Doc; markup?: string };
/** Component files grouped by the guidance file they share (field.css and control.css are both Form controls). */
export type ComponentGroup = { guide?: Doc; files: ComponentFile[] };
export type Medium = {
  doc: Doc; slug: string; title: string; description: string; level: Level; order: number;
  start: Start[]; guidance: Doc[]; components: ComponentGroup[]; examples: Example[]; gaps: string[]; updated: string;
};

const LEVELS: Level[] = ['covered', 'partly', 'not-yet'];
const day = (d: unknown) => (d instanceof Date ? d.toISOString() : String(d ?? '')).slice(0, 10);
const bySlug = new Map(DOCS.map(d => [d.slug, d]));

/** A component file as served: its CSS (and JS of the same name), the guidance file its
 *  header names, and the markup block from its header comment. */
const componentFile = (name: string): ComponentFile | null => {
  const css = `components/${name}.css`;
  if (!existsSync(css)) return null;
  const text = readFileSync(css, 'utf8');
  const head = text.slice(0, text.indexOf('*/'));
  const guide = bySlug.get(head.match(/design\/([a-z0-9/-]+)\.md/)?.[1] ?? '');
  const block = head.split('\n');
  const at = block.findIndex(l => /^\s*Markup:\s*$/.test(l));
  let markup: string | undefined;
  if (at >= 0) {
    const lines: string[] = [];
    for (const l of block.slice(at + 1)) { if (!l.trim()) break; lines.push(l); }
    const indent = Math.min(...lines.map(l => l.match(/^\s*/)![0].length));
    markup = lines.map(l => l.slice(indent)).join('\n');
  }
  const js = existsSync(`components/${name}.js`) ? `/components/${name}.js` : undefined;
  return { name, css: `/${css}`, js, guide, markup };
};

const problems: string[] = [];
export const MEDIA: Medium[] = DOCS.filter(d => d.type === 'Medium').map(d => {
  const fm = d.data;
  const at = `design/${d.path}`;
  if (!LEVELS.includes(fm.level)) problems.push(`${at}: "level" must be one of ${LEVELS.join(', ')}`);
  const guidance = (fm.guidance ?? []).map((s: string) => bySlug.get(s) ?? (problems.push(`${at}: no guidance file design/${s}.md`), null)).filter(Boolean);
  const files: ComponentFile[] = (fm.components ?? []).map((n: string) => componentFile(n) ?? (problems.push(`${at}: no component file components/${n}.css`), null)).filter(Boolean);
  const components: ComponentGroup[] = [];
  for (const f of files) {
    const g = f.guide && components.find(c => c.guide?.slug === f.guide!.slug);
    g ? g.files.push(f) : components.push({ guide: f.guide, files: [f] });
  }
  const examples = (fm.examples ?? []).map((s: string) => EXAMPLES.some(e => e.slug === s) ? example(s) : (problems.push(`${at}: no example "${s}" in src/lib/examples.ts`), null)).filter(Boolean);
  return {
    doc: d, slug: d.slug.replace(/^media\//, ''), title: d.title, description: d.description,
    level: fm.level, order: fm.order ?? 99, start: fm.start ?? [], guidance, components, examples,
    gaps: fm.gaps ?? [], updated: day(fm.updated),
  };
}).sort((a, b) => a.order - b.order);

const shown = new Set(MEDIA.flatMap(m => m.examples.map(e => e.slug)));
for (const e of EXAMPLES) if (!shown.has(e.slug)) problems.push(`example "${e.slug}" is on no medium's page (design/media/)`);
if (problems.length) throw new Error(`Media:\n  ${problems.join('\n  ')}`);

/** Where a guidance file reads best on this site: the guide page its tags put it on
 *  (a foundation or pattern is that page; anything else sits at its anchor there);
 *  otherwise the Markdown file itself. */
const PAGE_FOR_TAG = Object.fromEntries(PAGES.filter(p => p.key !== 'overview' && p.key !== 'examples').map(p => [p.key, p.href])) as Record<string, string>;
export const docHref = (d: Doc) => {
  const page = d.tags.map(t => PAGE_FOR_TAG[t]).find(Boolean);
  if (!page) return `/design/${d.path}`;
  return d.type === 'Pattern' || d.slug.startsWith('foundations/') ? page : `${page}#${d.slug.replace(/\//g, '-')}`;
};

/** The guidance and component files each medium names, for the impact report. */
export const mediaNaming = (slug: string) => MEDIA.filter(m => m.guidance.some(d => d.slug === slug) || m.components.some(c => c.guide?.slug === slug));

export const LEVEL_LABEL: Record<Level, [string, string]> = { covered: ['Covered', 'success'], partly: ['Partly', 'warning'], 'not-yet': ['Not yet', ''] };
