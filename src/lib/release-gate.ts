/**
 * The release gate (decisions 2026-10-29, statuses; examples show the rules): every
 * rule, value and component on the public site is released. A production build
 * (`npm run build`) fails if any guidance file or token is still `draft`, or if an
 * example names a guidance file that doesn't exist or is a draft. `npm run dev` and a review build (`npm run build:review`,
 * OMDS_DRAFTS=1) let drafts through, so work in progress can sit beside released
 * work on the same branch and still be seen locally.
 */
import { DOCS } from './design';
import { EXAMPLES } from './examples';
import LIGHT from '../tokens/v2/tokens.light.json';
import DARK from '../tokens/v2/tokens.dark.json';

export const DRAFTS_ALLOWED = !import.meta.env.PROD || process.env.OMDS_DRAFTS === '1';

/** What each example shows must be a guidance file, in any build. */
const byPath = new Map(DOCS.map(d => [d.path.replace(/\.md$/, ''), d]));
const missing = EXAMPLES.flatMap(e => e.shows.filter(s => !byPath.has(s)).map(s => `${e.slug} shows ${s}`));
if (missing.length) throw new Error(`Examples name guidance files that don't exist (src/lib/examples.ts):\n  ${missing.join('\n  ')}`);

const drafts = [
  ...DOCS.filter(d => d.status === 'draft').map(d => `design/${d.path}`),
  ...EXAMPLES.flatMap(e => e.shows.filter(s => byPath.get(s)?.status === 'draft').map(s => `example ${e.slug} shows draft design/${s}.md`)),
  ...[...new Set([LIGHT, DARK].flatMap(f => Object.entries(f as Record<string, { status?: string }>)
    .filter(([, e]) => e.status === 'draft').map(([n]) => `token ${n}`)))],
];
if (drafts.length && !DRAFTS_ALLOWED) {
  throw new Error(`Drafts can't ship to the public site (use npm run build:review to see them):\n  ${drafts.join('\n  ')}`);
}
export const DRAFTS = drafts;
