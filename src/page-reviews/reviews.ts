/**
 * PAGE REVIEWS — real openmined.org pages, ported so v2 can be tried on them.
 * Working material, not part of the brand guide: the whole feature is this
 * folder, src/pages/page-reviews/, public/page-reviews/ and one nav group in
 * Site.astro. See README.md here for how it's put together and how to remove it.
 */

/** Where the snapshot came from. */
export const SOURCE = {
  repo: 'OpenMined/openmined-org',
  ref: 'origin/HEAD',
  sha: '3fbc850',
  date: '2026-10-09',
};

export type System = 'live' | 'v2';

export const PAGES = [
  { key: 'home', label: 'Home', live: 'https://openmined.org/', path: '/page-reviews/home/' },
  { key: 'syfthub', label: 'SyftHub', live: 'https://openmined.org/syfthub/', path: '/page-reviews/syfthub/' },
] as const;

export type PageKey = (typeof PAGES)[number]['key'];

/** The route for a page in a system: v2 at the page path, the live port under live/. */
export const routeFor = (key: PageKey, system: System) => {
  const p = PAGES.find((x) => x.key === key)!;
  return system === 'v2' ? p.path : `${p.path}live/`;
};
