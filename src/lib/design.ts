/**
 * The design/ folder — guidance files, one typed Markdown file per idea.
 *
 * Layout (lab DECISIONS 2026-10-08, after the Open Design System Format's
 * conventional bundle): overview.md (the entry every reader starts from) and
 * log.md at the root; foundations/, components/, patterns/, behaviors/,
 * guidelines/, decisions/. index.md and log.md are reserved names (a listing
 * and a change history, per the Open Knowledge Format): no frontmatter needed,
 * and index.md is to be generated, not hand-written.
 *
 * Loaded with Vite's file import, so it works without Astro content
 * collections. Every file's frontmatter is checked here; a bad file fails
 * the build with its path.
 */
const ALL = import.meta.glob('/design/**/*.md', { eager: true }) as Record<string, any>;
const RESERVED = /(^|\/)(index|log)\.md$/;
const FILES = Object.fromEntries(Object.entries(ALL).filter(([p]) => !RESERVED.test(p)));
/** The change history, design/log.md, rendered as-is. */
export const LOG = ALL['/design/log.md']?.Content;

export const TYPES = ['Design System', 'Elevation', 'Color', 'Typography', 'Spacing', 'Shape', 'Motion', 'Component', 'Pattern', 'Behavior', 'Guideline', 'Accessibility', 'Voice', 'Decision'] as const;
export const STATUSES = ['exploring', 'working', 'released', 'deprecated'] as const;

export type Doc = {
  path: string;            // design-relative, e.g. foundations/surfaces.md
  slug: string;            // e.g. foundations/surfaces
  type: (typeof TYPES)[number];
  title: string;
  description: string;
  status: (typeof STATUSES)[number];
  tags: string[];
  tokens: string[];        // CSS names this file governs, e.g. --surface-base
  data: Record<string, any>;
  Content: any;
  html: string;            // the rendered HTML, for pages that place something inside a file's text
};

function check(path: string, fm: Record<string, any>): string[] {
  const errs: string[] = [];
  for (const k of ['type', 'title', 'description', 'status']) if (!fm[k]) errs.push(`missing "${k}"`);
  if (fm.type && !TYPES.includes(fm.type)) errs.push(`unknown type "${fm.type}"`);
  if (fm.status && !STATUSES.includes(fm.status)) errs.push(`unknown status "${fm.status}"`);
  if (fm.tokens && !Array.isArray(fm.tokens)) errs.push('"tokens" must be a list');
  return errs.map(e => `design/${path}: ${e}`);
}

const problems: string[] = [];
export const DOCS: Doc[] = Object.entries(FILES).map(([abs, mod]) => {
  const path = abs.replace(/^\/design\//, '');
  const fm = mod.frontmatter ?? {};
  problems.push(...check(path, fm));
  return {
    path, slug: path.replace(/\.md$/, ''),
    type: fm.type, title: fm.title, description: fm.description, status: fm.status,
    tags: fm.tags ?? [], tokens: fm.tokens ?? [], data: fm, Content: mod.Content,
    html: typeof mod.compiledContent === 'function' ? mod.compiledContent() : '',
  };
});
if (problems.length) throw new Error(`Invalid guidance files:\n  ${problems.join('\n  ')}`);

export const doc = (slug: string): Doc => {
  const d = DOCS.find(x => x.slug === slug);
  if (!d) throw new Error(`design/${slug}.md not found`);
  return d;
};

/** Every file carrying a tag, of the given types, in path order. */
export const byTag = (tag: string, ...types: Doc['type'][]): Doc[] =>
  DOCS.filter(d => d.tags.includes(tag) && (!types.length || types.includes(d.type))).sort((a, b) => a.path.localeCompare(b.path));

/** Decisions carrying a tag, oldest first. */
export const decisionsFor = (tag: string): Doc[] => {
  const day = (d: unknown) => (d instanceof Date ? d.toISOString() : String(d ?? '')).slice(0, 10);
  return byTag(tag, 'Decision').sort((a, b) => day(a.data.date).localeCompare(day(b.data.date)));
};
