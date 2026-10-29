# v2 components

The OpenMined v2 interface components as plain CSS and JavaScript modules: no
framework, no build step, no loader. Use them in plain HTML, any framework, a CMS,
HubSpot or a Claude artifact. The guidance for each lives in `design/components/`;
these files are the code. Each component's status is in its guidance file.

## Use

**Fonts.** The type module needs Rubik 400, and Inter 400, 500, 600, 700 and 400
italic. Paste into `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Rubik:wght@400&display=swap">
```

1. Load the v2 tokens: `/tokens/omds.css` on the site (in the repo, `src/tokens/v2/tokens.css`,
   generated from `tokens/`). Or load `/omds.css`: the tokens and every component in one file.
2. Load only the component CSS a page uses, or `index.css` for all of them.
3. For components that move, import their script and call its function once the
   markup is on the page. Every function is safe to call again: call it after
   adding content (a HubSpot form, a client-side route).

```html
<link rel="stylesheet" href="…/tokens.css">
<link rel="stylesheet" href="…/components/button.css">
<link rel="stylesheet" href="…/components/button-hover.css">
<script type="module">
  import { buttonHover } from '…/components/button-hover.js';
  buttonHover();               // every .btn
</script>
```

The markup each component expects is at the top of its CSS file. Where you can't
edit the markup (a vendor's form), point the script at the vendor's selector
(`buttonHover('.hs-button')`) and map the vendor's classes onto the component's
rules in your own CSS. Some components need structure a vendor may not give: the
button hover needs an element that can hold children (`<button>` or `<a>`, not
`<input>`).

**Minimal and full.** Each component's main file is complete on its own, with minimal interaction states in plain CSS. The full layer is an add-on: `button-hover.css` and `.js`, `link-flow.css`, the field's pointer light (`field.js`) and the cards' tilt. Leave the add-ons out where motion doesn't fit (dense interfaces, platforms without scripts), or put `data-interaction="minimal"` on any region to keep it minimal on a page that loads them (`design/behaviors/interaction-states.md`).

Class names are bare (`.btn`, `.ctl`, `.hcard`). Every script follows reduced
motion itself.

## Files

| Component | CSS | Script | Guidance |
|---|---|---|---|
| Page container, 12-column grid, article grid and breakouts | `layout.css` | none | `design/foundations/spacing.md` |
| Body text, headings, text styles, code, blockquote | `type.css` | none | `design/foundations/typography.md` |
| Long reads: rhythm, lists, figures, captions, tables, pull quote | `prose.css` | none | `design/patterns/prose.md` |
| Button | `button.css` | none | `design/components/button.md` |
| Button hover (color in motion) | `button-hover.css` | `button-hover.js`, `buttonHover()` | `design/components/button.md` |
| Field, form layout, errors | `field.css` | `field.js`, `fieldLights()` (pointer light) | `design/components/form-field.md` |
| Checkbox, radio, toggle | `control.css` | none | `design/components/form-field.md` |
| Content link, text button | `link.css` | none | `design/components/link.md` |
| Content link, full state (the flowing line) | `link-flow.css` | none | `design/components/link.md` |
| Colored icon (two-tone) | `color-icon.css` | `two-tone.js`, `twoTone()` | `design/foundations/two-tone.md` |
| Hover card | `hover-card.css` | `hover-card.js`, `hoverCards()` | `design/components/hover-card.md` |
| Link card | `link-card.css` | `link-card.js`, `linkCards()` | `design/components/link-card.md` |
| Status chip | `status-chip.css` | none | `design/components/status-chip.md` |
| Page: box sizing, the page's ground, sections | `page.css` | `theme.js`, `themeInit()`, `themeToggle()` (color mode) | `design/behaviors/color-modes.md` |
| Card, card with an icon, card grid | `card.css` | none | `design/components/card.md` |
| Hover card colorflow | `card-flow.css` | `card-flow.js`, `cardFlows()` (draws with `flow.js`) | `design/components/hover-card.md` |
| Tag | `tag.css` | none | `design/components/tag.md` |
| Table | `table.css` | none | `design/components/table.md` |
| Tabs | `tabs.css` | `tabs.js`, `tabs()` | `design/components/tabs.md` |
| Accordion | `accordion.css` | none | `design/components/accordion.md` |
| Steps | `steps.css` | none | `design/components/steps.md` |
| Code block copy button | `code-copy.css` | `code-copy.js`, `codeCopy()` | `design/components/code-block.md` |
| Table of contents | `toc.css` | `toc.js`, `toc()` | `design/components/toc.md` |
| Pagination | `pagination.css` | none | `design/components/pagination.md` |
| Logo card, post card | `link-card.css` (`lcard--logo`, `lcard--post`) | `link-card.js` | `design/components/link-card.md` |
| Diagram line pulses | none | `line-flow.js`, `lineFlow()` | `design/patterns/diagrams.md` |

Shared by the scripts, imported by them: `pointer.js` (the light that follows the
pointer), `tilt.js` (the card tilt), `two-tone.js` (the moving gradients) and `flow.js` (the
one WebGL renderer per page that colorflows draw with). `index.css` and `index.js`
gather everything.

On the site, `/omds.css` is the tokens and every component CSS in one file, and `/omds.js`
every script in one module, for pasting (a Claude artifact) or linking.

Examples of every component put together are at `/examples/` on the site. In the repository,
`demo.html` shows the components with nothing but these files and the tokens (serve the repo
root with `python3 -m http.server` and open `/components/demo.html`).
