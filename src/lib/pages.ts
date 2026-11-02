/** The brand site's pages, in nav order (Site.astro), simple to complex: the raw values
 *  (color, type, layout), what's built from them (surfaces), the pieces you place (logos,
 *  icons), components, graphics, then the examples that combine them. The overview's
 *  "system at a glance" shows the same pages in the same order, with each summary.
 *  Add one when its page is built. */
export const PAGES = [
  { key: 'overview', label: 'Overview', href: '/' },
  { key: 'color', label: 'Color', href: '/color/', summary: 'One gray and six hues, eleven steps each, with roles for what each color does.' },
  { key: 'typography', label: 'Typography', href: '/typography/', summary: 'Rubik and Inter on a fluid scale, and the long-read rhythm.' },
  { key: 'layout', label: 'Layout', href: '/layout/', summary: 'The page, a 12-column grid, breakpoints and the article zones.' },
  { key: 'surfaces', label: 'Surfaces', href: '/surfaces/', summary: 'Four levels, their shadows, and lines instead of boxes.' },
  { key: 'logos', label: 'Logos', href: '/logo/', summary: 'The logo files, partner marks and the organizations we work with.' },
  { key: 'icons', label: 'Icons', href: '/icons/', summary: 'One outlined set, mono by default, in color with motion.' },
  { key: 'interface', label: 'Interface', href: '/interface/', summary: 'Buttons, links, fields, cards, tables, tabs and their states.' },
  { key: 'graphics', label: 'Graphics', href: '/graphics/', summary: 'The gradient, hue keys, diagrams and the animated brand graphics.' },
  { key: 'examples', label: 'Examples', href: '/examples/', summary: 'Sections, pages and graphics built from the served files: the rules in use, ready to copy.' },
];
