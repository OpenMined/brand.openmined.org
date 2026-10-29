/**
 * The release gate (decision 2026-10-30, statuses): everything on the public site
 * is released. A production build (`npm run build`) fails if any guidance file or
 * token is still `draft`. `npm run dev` and a review build (`npm run build:review`,
 * OMDS_DRAFTS=1) let drafts through, so work in progress can sit beside released
 * work on the same branch and still be seen locally.
 */
import { DOCS } from './design';
import LIGHT from '../tokens/v2/tokens.light.json';
import DARK from '../tokens/v2/tokens.dark.json';

export const DRAFTS_ALLOWED = !import.meta.env.PROD || process.env.OMDS_DRAFTS === '1';

const drafts = [
  ...DOCS.filter(d => d.status === 'draft').map(d => `design/${d.path}`),
  ...[...new Set([LIGHT, DARK].flatMap(f => Object.entries(f as Record<string, { status?: string }>)
    .filter(([, e]) => e.status === 'draft').map(([n]) => `token ${n}`)))],
];
if (drafts.length && !DRAFTS_ALLOWED) {
  throw new Error(`Drafts can't ship to the public site (use npm run build:review to see them):\n  ${drafts.join('\n  ')}`);
}
export const DRAFTS = drafts;
