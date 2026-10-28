/**
 * PAGE REVIEWS — what came up applying v2 to the ported pages (since
 * 2026-10-09). Review notes, not guidance: anything decided here moves to
 * design/ as a guideline or decision record. Shown on /page-reviews/.
 *
 * `rule` names the design/ file the finding pushes on; `pages` where it shows.
 */
export type Finding = {
  title: string;
  pages: ('home' | 'syfthub')[];
  rule?: string;
  did: string;
  open: string;
  /** Kyle's response in review, with its date. */
  review?: string;
};

export const FINDINGS: { group: string; items: Finding[] }[] = [
  {
    group: 'Surfaces and sections',
    items: [
      {
        title: 'Pages were structured by tinted bands',
        pages: ['syfthub'],
        rule: 'guidelines/sections-arent-tinted',
        did: 'Every band moved to the page level (--surface-base). SyftHub alternated six dim bands with the page; they are gone.',
        open: 'Without the bands, sections run together, and each band’s own padding now stacks into large empty gaps (under the quick links, around “How It Works”). Needs a section rhythm (space tokens, or a divider rule for long pages); the brand site itself uses no dividers between sections.',
        review: 'Oct 12: OK as it is. Keep it minimal: remove the offending styles first, then solve for design needs. The website needs a full layout spacing system (inside and between sections), probably web-specific rather than brand v2.',
      },
      {
        title: 'Cards were flat tiles; now they are a level',
        pages: ['home', 'syfthub'],
        rule: 'foundations/surfaces',
        did: 'Every card (link cards, icon cards, product cards, flow nodes, the quote, press cards, the federated-network panel) is raise-1 with its shadow at rest, no outline. Interactive cards step to the raise-2 shadow on hover.',
        open: 'In light mode raise-1 (gray 50) on the page (gray 100) is a faint step and the shadow does most of the work; in dark mode, gray 800 on 900 is the known low-separation case. SyftHub shows about 25 cards: is that “too many boxes”?',
        review: 'Oct 12: faint card edges are OK for now.',
      },
      {
        title: 'The federated-network panel is an outline again',
        pages: ['home'],
        rule: 'guidelines/outlines-are-lines',
        did: 'The live style: a 1px line-strong outline with the page (and the colorflow behind it) showing through; its row rules in the same line. “Start your own federated sub-network” is a hover card inside the outline, under the three pillars and as wide as them, its text at a 640px measure centered in the card, its icon taking green on hover.',
        open: 'None for now: with the card outside the outline, no fill sits inside an outlined area.',
      },
      {
        title: 'Hand-rolled inverse blocks',
        pages: ['home'],
        rule: 'behaviors/color-modes',
        did: 'Live’s dark blocks (the old sub-network row) read the live inverse tokens (--dark-surface-*, --text-*-light) instead of data-section="invert". v2 has no inverse set, so the bridge names the opposite mode’s gray steps; in the v2 pass the row is now a hover card (see the federated-network panel).',
        open: 'In the site itself these blocks should switch mode with data-section. A port-side fix, not a brand question, unless an inverse set is wanted.',
        review: 'Oct 12: agreed; make them systematic eventually.',
      },
      {
        title: 'The footer uses two darks',
        pages: ['home', 'syfthub'],
        rule: 'guidelines/sections-arent-tinted',
        did: 'The body (gray 850) and the darker bottom bar (950) are one dark ground (gray 900) with a divider between. The footer pins dark with palette values, not data-section="always-dark", so the pass names v2 dark steps directly.',
        open: 'Whether the footer becomes an always-dark section (and gets v2’s dark roles for free).',
      },
    ],
  },
  {
    group: 'Color',
    items: [
      {
        title: 'SyftHub and Syft Space: solid and outlined',
        pages: ['syfthub'],
        rule: 'guidelines/accent-by-intent',
        did: 'The live page marks SyftHub in green against Syft Space. Now no product color: SyftHub keeps the page’s normal colors (solid button, solid step badges and connector), Syft Space takes the outlined style (the secondary button; step badges as a line around the number, a line connector).',
        open: 'Whether products get their own hues is still open.',
        review: 'Oct 12: the solid fill read washed out; colored fills use the key, as the status chips do (guidelines/color-fills-use-the-key). One hue per color-themed page, and the accent color wherever a color is needed but not specified: teal at first, then green (decisions/2026-10-12-green-is-the-accent-color).',
      },
      {
        title: 'Muted text gets lighter',
        pages: ['home', 'syfthub'],
        rule: 'foundations/color',
        did: 'The live --text-subtle (gray 600, about 6:1) maps to v2 --text-muted (gray 500): hero subheads, step intros, fine print, placeholders.',
        open: 'v2 muted is 4.13:1 on sunken (placeholders) and the text-and-lines round is still to come; this page is a good test for it.',
      },
    ],
  },
  {
    group: 'Interface',
    items: [
      {
        title: 'Outlined buttons become secondary',
        pages: ['home', 'syfthub'],
        rule: 'guidelines/one-solid-button',
        did: 'Every outlined button is secondary: a 1px outline in the body text color, no fill, headline label. Both stay grayscale at rest; on hover they fill with the accent in motion, button hover J (components/button), white label.',
        open: 'Focus styling is still open (an accent-key ring stands in).',
        review: 'Oct 12 (meeting): Bennett didn’t like the quiet button; secondary = body-color outline, no fill; hover = the primary’s accent fill.',
      },
      {
        title: 'Links: the line changes, the text doesn’t',
        pages: ['home', 'syfthub'],
        rule: 'components/link',
        did: 'Content links keep their underline, and on hover a line in the full OM gradient grows over it, flowing, with a soft glow (link hover B, components/link). Nav, footer and text-button lines are drawn in the text color (were green), in from the left and out to the right (live returns left). Footer links no longer brighten on hover; the footer bar link gains the same line.',
        open: 'Icon links (social, search) still turn green on hover: icons, not link text, so left as they were.',
      },
      {
        title: 'Forms: raised fields become recesses',
        pages: ['home', 'syfthub'],
        rule: 'components/form-field',
        did: 'Fields are sunken and flat at rest (the live fields cast a shadow), with a pointer light and gray outline on hover and a solid gray line on focus (the round’s option C); the form card is raise-1 with the outer corner (10px); checkboxes are controls with their inset at rest, an ink fill when checked, the fields’ outline on hover and the gray line outside on keyboard focus; the submit takes the button hover (a <button> swapped in for HubSpot’s input).',
        open: 'Both forms put the label inside the field (placeholder only), which v2 lists as needing an accessible name. The forms are static mocks of the HubSpot embed.',
      },
      {
        title: 'Corners and shadows snap to the ladders',
        pages: ['home', 'syfthub'],
        rule: 'foundations/shape',
        did: '2px step badges → 4px; 6 and 8px cards → 6px; the 16px form card → 10px. The live shadows (32–48px blur) → the level shadows (16px at most).',
        open: 'The press cards lose most of their lift: the live lg shadow was the page’s one strong shadow.',
      },
    ],
  },
  {
    group: 'Graphics and icons',
    items: [
      {
        title: 'The hero graphics take the v2 gradient',
        pages: ['home'],
        rule: 'guidelines/graphics-draw-from-palette',
        did: 'The diamond (nine stops) and the colorflow (six) are fed the same stops from the v2 gradient. Read once at load, so they don’t follow a mode switch.',
        open: 'The colorflow reads more saturated than live (v2 violet and blue). The diamond’s labels use Sometype Mono, which v2 type doesn’t cover yet.',
      },
      {
        title: 'The CTA raster becomes the gradient map',
        pages: ['home', 'syfthub'],
        rule: 'foundations/gradient',
        did: 'Both CTA backgrounds were the same off-palette raster. v2 puts the gradient map (<om-mesh>, the Graphics page’s setting) behind them.',
        open: 'In dark mode the map stays bright around a dark card. Both variants (“gradient” and “subtle”) now look the same.',
      },
      {
        title: 'Icons swap to Iconoir, with gaps',
        pages: ['home', 'syfthub'],
        rule: 'foundations/iconography',
        did: 'Each live icon is replaced from the Icons page map: Iconoir at a 2 stroke, or the one-color partner mark (LinkedIn, X, GitHub, Bluesky).',
        open: 'No partner mark yet for Python, Node and YouTube, so those keep the live drawing. The home page’s three pillar icons are inline SVG in the component; the v2 pass swaps them too (globe, code-brackets-square, settings), as of Oct 12.',
      },
    ],
  },
  {
    group: 'Not changed',
    items: [
      {
        title: 'Type is still the live type',
        pages: ['home', 'syfthub'],
        rule: 'foundations/typography',
        did: 'Nothing: v2 has two text sizes and the type round hasn’t started. Only form text takes --font-size-md.',
        open: 'These two pages are the natural test bed for the type round (hero h1, section heads, card titles, eyebrows).',
      },
    ],
  },
];
