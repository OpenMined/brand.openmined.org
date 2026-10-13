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

/** Only v2 routes exist now (the live ports were dropped 2026-10-13, Kyle: not
 *  needed; openmined.org is the reference). The port's seams still branch on
 *  `system`, so the ported files keep their live markup unchanged. */
export type System = 'live' | 'v2';

export const PAGES = [
  { key: 'home', label: 'Home', live: 'https://openmined.org/', path: '/page-reviews/home/' },
  { key: 'syfthub', label: 'SyftHub', live: 'https://openmined.org/syfthub/', path: '/page-reviews/syfthub/' },
] as const;

export type PageKey = (typeof PAGES)[number]['key'];

/** The route for a page: its v2 pass. */
export const routeFor = (key: PageKey) => PAGES.find((x) => x.key === key)!.path;
