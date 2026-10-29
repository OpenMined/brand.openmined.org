/**
 * Examples (lab LAUNCH section 6): self-contained pages built from what the site
 * serves (/omds.css, /omds.js, /icons, /logos, /embeds) and, for website pages,
 * the example kit (src/examples/), so the built HTML is exactly what a person or
 * an agent copies. Examples show the rules in use; they aren't rules and carry no
 * status (decision 2026-10-29). `shows` must name released guidance files (the
 * release gate checks). Each is a page in
 * src/pages/examples/ on the Example layout; this list is their index (the
 * Examples page, /examples/index.json, llms.txt). A starter set: more are added
 * as v2 is applied.
 *
 * kind: section (a part of a page) · page (a whole page) · graphic.
 * shows: the guidance files it puts to work, design-relative slugs.
 * motion: whether it loads /omds.js (the full interactive layer).
 */
export type Example = { slug: string; title: string; description: string; kind: 'section' | 'page' | 'graphic'; shows: string[]; motion: boolean };

export const EXAMPLES: Example[] = [
  { slug: 'landing-section', kind: 'section', motion: true, title: 'Landing section',
    description: 'openmined.org\'s federated network, as on the home page: an outlined region on the 12-column grid with the intro, four subnets, three pillars with color icons, and a large hover card.',
    shows: ['guidelines/outlines-are-lines', 'components/hover-card', 'decisions/2026-10-28-raised-levels-inside-an-outline', 'behaviors/color-moves'] },
  { slug: 'product-steps', kind: 'section', motion: true, title: 'Product steps',
    description: 'Two processes side by side, one solid and one outlined, with the call to action pair under them.',
    shows: ['components/steps', 'components/button', 'guidelines/one-solid-button'] },
  { slug: 'press-cards', kind: 'section', motion: true, title: 'Press cards',
    description: 'Logos supplied as images on white plates, each a link card with a caption, in an even grid.',
    shows: ['components/link-card', 'guidelines/logo-images-on-white', 'components/card'] },
  { slug: 'join-form', kind: 'section', motion: true, title: 'Join form',
    description: 'A sign-up form on a raised panel over the gradient map: fields, checkboxes, one solid button.',
    shows: ['components/form-field', 'guidelines/controls-on-a-raised-surface', 'components/button'] },
  { slug: 'long-read', kind: 'section', motion: true, title: 'Long read',
    description: 'An article in the reading column with a wide and a full breakout, a pull quote, a table, a code block and a table of contents.',
    shows: ['patterns/prose', 'foundations/spacing', 'components/toc', 'components/code-block'] },
  { slug: 'dashboard', kind: 'page', motion: false, title: 'Dashboard',
    description: 'An internal tool in the minimal interactive layer: summary cards, tabs, a table with status chips, tags and pagination, and a color mode switch.',
    shows: ['behaviors/interaction-states', 'components/table', 'components/tabs', 'components/status-chip', 'components/card'] },
  { slug: 'home', kind: 'page', motion: true, title: 'Home page',
    description: 'openmined.org\'s home page in v2, as reviewed: the header, the hero with the diamond and the colorflow, the federated network (subnets, pillars, the sub-network card), partnerships, the full press room, the join form over the gradient map, and the footer.',
    shows: ['overview', 'components/hover-card', 'components/link-card', 'guidelines/partner-marks-follow-the-mode', 'behaviors/color-moves'] },
  { slug: 'syfthub', kind: 'page', motion: true, title: 'Product page',
    description: 'SyftHub\'s page in v2, as reviewed: a centered hero, quick-start hover cards, the two products (SyftHub solid, Syft Space outlined), the flow, core components, the two paths as steps, applications, benefits and developer tools as icon cards, a callout in the opposite mode, the closing buttons and the join panel over the gradient map.',
    shows: ['components/steps', 'components/card', 'components/hover-card', 'components/button', 'guidelines/one-solid-button', 'guidelines/sections-arent-tinted', 'guidelines/outlines-are-lines'] },
  { slug: 'diagram-abc-1', kind: 'graphic', motion: true, title: 'Diagram: traditional AI vs ABC',
    description: 'Attribution in color: sources keep their hue to the person asking, or drain to gray inside the model. Pulses run in each line\'s highlight.',
    shows: ['patterns/diagrams', 'foundations/highlight', 'behaviors/color-moves'] },
  { slug: 'diagram-abc-2', kind: 'graphic', motion: true, title: 'Diagram: the rings of impact',
    description: 'Five rings spread outward from a missing control, brightening one after another in their highlight.',
    shows: ['patterns/diagrams', 'foundations/highlight'] },
  { slug: 'diagram-abc-3', kind: 'graphic', motion: true, title: 'Diagram: where attribution is lost',
    description: 'Colored sources merge into one dulled zone; what comes out carries no trace of them.',
    shows: ['patterns/diagrams', 'foundations/highlight'] },
];

export const example = (slug: string) => {
  const e = EXAMPLES.find(x => x.slug === slug);
  if (!e) throw new Error(`Example "${slug}" isn't in src/lib/examples.ts`);
  return e;
};

/** For pages with an <om-*> embed: each embed with data-follow takes its colors from
 *  the tokens it names, and follows the color mode. */
export const FOLLOW_JS = `const h = document.documentElement;
const follow = () => {
  const cs = getComputedStyle(h), read = (v) => cs.getPropertyValue('--' + v).trim();
  document.querySelectorAll('[data-follow]').forEach((el) => {
    el.setAttribute('colors', el.dataset.follow.split(',').map(read).join(','));
    if (el.dataset.followHaze) el.setAttribute('haze', read(el.dataset.followHaze));
  });
};
follow();
new MutationObserver(follow).observe(h, { attributes: true, attributeFilter: ['data-theme'] });`;
