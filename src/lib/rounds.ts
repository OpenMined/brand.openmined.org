/**
 * The review rounds and page reviews, in one list for every header that shows
 * them (the brand site's review-rounds header, layouts/Site.astro, on every
 * round and page review built on it; the older Base-layout rounds keep their own bars) and for the rounds index (pages/rounds/index.astro).
 * Add a round here when it opens. Working favorites live on the brand guide pages;
 * `lives` names where each round's went.
 * `keepT`: the older rounds read a ?t= color-mode parameter; their links carry it.
 */
import { PAGES as PAGE_REVIEWS } from '../page-reviews/reviews';

export type NavLink = { key: string; label: string; href: string; keepT?: boolean };
export type Round = NavLink & { opened?: string; about?: string; lives?: [string, string][] };

/** Rounds, oldest first; the index leads. */
export const ROUNDS: Round[] = [
  { key: 'all', label: 'All rounds', href: '/rounds/' },
  { key: 'surfaces', label: 'Surfaces', keepT: true, href: '/rounds/surfaces/?g=100:98.5__-2,150:96.5,200:92.5,300:89.85__4,800:27.77_-2_-1,850:24.75,900:21.77,950:19.67&a=light-lighter.sunken:300,light-lighter.raise-1:100&shl=sunken:1_5_0_0.07_1,raise-1:2_10_-4_0.05_0,raise-2:6_16_-4_0.12_0', opened: '2026-09-16', about: 'Surface levels, shadows and the form lab.', lives: [['Surfaces', '/surfaces/'], ['Interface: forms', '/interface/#forms']] },
  { key: 'color', label: 'Color', href: '/rounds/color/?p=ink&a=none&l=og&ml=0_1.1_0_all', keepT: true, opened: '2026-09-23', about: 'The palette consolidated, with a role for every color; the gray midtone boost.', lives: [['Color', '/color/']] },
  { key: 'diagrams', label: 'Diagrams', href: '/rounds/diagrams/', keepT: true, opened: '2026-09-25', about: 'Diagram style, on the ABC article’s figures.', lives: [['Graphics: diagrams', '/graphics/#diagrams']] },
  { key: 'naming', label: 'Naming', href: '/rounds/naming/', keepT: true, opened: '2026-10-07', about: 'How many grays, and what to call them.', lives: [['Color: palette', '/color/#palette']] },
  { key: 'spectrum', label: 'Spectrum', href: '/rounds/spectrum/', keepT: true, opened: '2026-10-07', about: 'One 50–950 series for gray and every hue.', lives: [['Color: palette', '/color/#palette']] },
  { key: 'status', label: 'Status chips', href: '/rounds/status/', opened: '2026-10-09', about: 'The strong and quiet status chips.', lives: [['Color: roles', '/color/#role-examples']] },
  { key: 'infographics', label: 'Infographics', href: '/rounds/infographics/', opened: '2026-10-09', about: 'A layer for infographics, diagrams and charts on top of the web system.', lives: [] },
  { key: 'gradient-map', label: 'Gradient map', href: '/rounds/gradient-map/', opened: '2026-10-09', about: 'Each atmospheric graphic’s own list of palette colors, starting with the gradient map.', lives: [['Graphics: colorflow and gradient map', '/graphics/#motion']] },
  { key: 'icons', label: 'Icons', href: '/rounds/icons/', opened: '2026-10-09', about: 'Every icon in openmined.org’s style guide, mapped to the v2 set.', lives: [['Icons: the set', '/icons/#set']] },
  { key: 'motion', label: 'Color and interaction', href: '/rounds/motion/', opened: '2026-10-12', about: 'If color, then motion, and interaction beyond it: button and link hovers, icons in color, hover cards, form fields.', lives: [['Interface: buttons, links, hover cards', '/interface/#buttons'], ['Icons: in color', '/icons/#color'], ['Color: two-tone', '/color/#two-tone']] },
];

/** Page reviews: the notes page, then each reviewed page. */
export const REVIEW_PAGES: NavLink[] = [
  { key: 'page-reviews', label: 'Page reviews', href: '/page-reviews/' },
  ...PAGE_REVIEWS.map(p => ({ key: `review-${p.key}`, label: p.label, href: p.path })),
];

/** The link that matches a path (ignoring query strings), for aria-current. */
export const isCurrent = (href: string, path: string) => href.split('?')[0] === path;
