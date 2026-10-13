/**
 * The review rounds and page reviews, in one list for every header that shows
 * them: the brand site's review-rounds header (layouts/Site.astro, on any page
 * under /rounds/ or /page-reviews/) and the working-favorites page's own bar
 * (pages/rounds/index.astro). Add a round here when it opens.
 * `keepT`: the older rounds read a ?t= color-mode parameter; their links carry it.
 */
import { PAGES as PAGE_REVIEWS } from '../page-reviews/reviews';

export type NavLink = { key: string; label: string; href: string; keepT?: boolean };

/** Rounds, oldest first; the working-favorites page leads. */
export const ROUNDS: NavLink[] = [
  { key: 'favorites', label: 'Working favorites', href: '/rounds/', keepT: true },
  { key: 'surfaces', label: 'Surfaces', keepT: true, href: '/rounds/surfaces/?g=100:98.5__-2,150:96.5,200:92.5,300:89.85__4,800:27.77_-2_-1,850:24.75,900:21.77,950:19.67&a=light-lighter.sunken:300,light-lighter.raise-1:100&shl=sunken:1_5_0_0.07_1,raise-1:2_10_-4_0.05_0,raise-2:6_16_-4_0.12_0' },
  { key: 'color', label: 'Color', href: '/rounds/color/?p=ink&a=none&l=og&ml=0_1.1_0_all', keepT: true },
  { key: 'diagrams', label: 'Diagrams', href: '/rounds/diagrams/', keepT: true },
  { key: 'naming', label: 'Naming', href: '/rounds/naming/', keepT: true },
  { key: 'spectrum', label: 'Spectrum', href: '/rounds/spectrum/', keepT: true },
  { key: 'status', label: 'Status chips', href: '/rounds/status/' },
  { key: 'infographics', label: 'Infographics', href: '/rounds/infographics/' },
  { key: 'gradient-map', label: 'Gradient map', href: '/rounds/gradient-map/' },
  { key: 'icons', label: 'Icons', href: '/rounds/icons/' },
  { key: 'motion', label: 'Color in motion', href: '/rounds/motion/' },
];

/** Page reviews: the notes page, then each reviewed page. */
export const REVIEW_PAGES: NavLink[] = [
  { key: 'page-reviews', label: 'Page reviews', href: '/page-reviews/' },
  ...PAGE_REVIEWS.map(p => ({ key: `review-${p.key}`, label: p.label, href: p.path })),
];

/** The link that matches a path (ignoring query strings), for aria-current. */
export const isCurrent = (href: string, path: string) => href.split('?')[0] === path;
