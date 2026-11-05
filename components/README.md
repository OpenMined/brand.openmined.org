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

**A whole page, from nothing.** The served files, linked: the color mode set before the page
draws, the fonts, `/omds.css`, a component's markup, then `/omds.js` to start what moves. Icons
are pasted from `/icons/set/<name>.svg`. Claude artifacts can't link files: start from
`/starter/artifact` instead.

```html
<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Research</title>
<script>
  /* The color mode before the page draws: the saved choice, else the system's. */
  var t; try { t = localStorage.getItem('omds-theme'); } catch (e) {}
  document.documentElement.dataset.theme = t === 'dark' || t === 'light' ? t
    : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Rubik:wght@400&display=swap">
<link rel="stylesheet" href="https://design.openmined.org/omds.css">
</head>
<body>
<main class="container stack stack--2xl">
  <h1>Research</h1>
  <a class="hcard" href="/research">
    <span class="hcard__icon" aria-hidden="true">
      <span class="hcard__glow"><svg>…journal…</svg></span><svg>…journal…</svg><span class="hcard__color"><svg>…journal…</svg></span>
    </span>
    <span class="hcard__text"><strong>Research</strong><span>Papers and results</span></span>
    <span class="hcard__arrow" aria-hidden="true"><svg>…arrow-right…</svg></span>
    <span class="hcard__light" aria-hidden="true"></span>
  </a>
  <button type="button" class="switch" role="switch" aria-checked="false" aria-label="Dark mode" data-theme-toggle><span class="switch__knob"></span></button>
</main>
<script type="module">
  import { hoverCards, cardFlows, themeToggle } from 'https://design.openmined.org/omds.js';
  hoverCards(); cardFlows(); themeToggle();
</script>
</body>
</html>
```

The markup each component expects is at the top of its CSS file, after "Markup:" (or
"Markup (a note):", the note naming the choices, such as the hues). One example per line or
block, with a short note to its right where it needs one. An icon is written
`<svg aria-hidden="true">…name…</svg>` with its name in the icon set, or `…icon…` where any
icon fits; a size goes in the note. Indent the markup 5 spaces and leave a blank line after it,
before any notes; the build fails on a block that reads as empty or stops anywhere else. `npm run lint` checks that every component class in these
blocks and on the site exists, defined in the component's own file. Keep
your own classes out of a component's names (`.signup-form`, not `.fm--signup`): a page's
own rule under a component's name would hide that class being renamed or removed. Renaming
or removing a class: change every copy (`npm run lint` lists them) and add a line to
`design/log.md` naming old → new, so projects that copied the markup can follow.

Where you can't
edit the markup (a vendor's form), point the script at the vendor's selector
(`buttonHover('.hs-button')`) and map the vendor's classes onto the component's
rules in your own CSS. Some components need structure a vendor may not give: the
button hover needs an element that can hold children (`<button>` or `<a>`, not
`<input>`).

**Minimal and full.** Each component's main file is complete on its own, with minimal interaction states in plain CSS. The full layer is an add-on: `button-hover.css` and `.js`, `link-flow.css`, the field's pointer light (`field.js`) and the cards' tilt. Leave the add-ons out where motion doesn't fit (dense interfaces, platforms without scripts), or put `data-interaction="minimal"` on any region to keep it minimal on a page that loads them (`design/behaviors/interaction-states.md`).

Class names are bare (`.btn`, `.ctl`, `.hcard`). Every script follows reduced
motion itself.

## Adding a component

What a new component touches, in order. Start from a similar component's files.

1. **`components/<name>.css`**: the header (name, its guidance file, what it needs, its
   script if any), then "Markup:" with the markup to match, then the rules. Bare class
   names, tokens only, and no class names a page already uses (`npm run lint` says).
2. **If it moves, `components/<name>.js`**: one exported function that takes a selector and
   is safe to call again; export it from `index.js`, add its call to `omdsStartJs()` in
   `src/lib/serve.ts` (the full starter) and to the site's start-up in `src/layouts/Site.astro`.
3. **`components/index.css`**: `@import` it, in the order the file lists.
4. **`design/components/<name>.md`**: the guidance, `status: draft`, with its `tokens`; leave
   anything unsettled as *Open:*.
5. **`design/media/*.md`**: add it to the `components` list of each medium that uses it.
6. **A demo**: a section in the Interface page's Components section (`SECTIONS` in
   `src/pages/interface/index.astro`, with its `componentCode`), or on the page whose subject
   it is.
7. **This README's Files table**: a row.
8. **`design/log.md`**: a line; and if it sets a rule, a draft decision record
   (`CONTRIBUTING.md`, "A contributor proposes").
9. **Check**: `npm run lint` and `npm run build:review` (shows drafts). `npm run build` refuses
   the draft until the design lead releases it. If an example uses it, retake that example's
   still (`npm run examples:thumbs -- <slug>`).

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
| Content link and text button, full state (the flowing line) | `link-flow.css` | none | `design/components/link.md` |
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
| Nav: quiet, wash, strong | `nav.css` | none | `design/components/nav.md` |
| Meter (x of y) | `meter.css` | none | `design/components/meter.md` |
| Pager (Previous, page numbers, Next; with the nav) | `pager.css` | none | `design/components/pager.md` |
| Accordion | `accordion.css` | none | `design/components/accordion.md` |
| Steps | `steps.css` | none | `design/components/steps.md` |
| Code block copy button | `code-copy.css` | `code-copy.js`, `codeCopy()` | `design/components/code-block.md` |
| Logo card, post card | `link-card.css` (`lcard--logo`, `lcard--post`) | `link-card.js` | `design/components/link-card.md` |
| Diagram line pulses | none | `line-flow.js`, `lineFlow()` | `design/patterns/diagrams.md` |
| Box-and-arrow diagram: full (HTML cards over SVG lines) and flat (one SVG) | `diagram.css` | `diagram.js`, `diagrams()` (draws lines, checks text fits), `diagramPath()`, `diagramSvg()` (save as a file) | `design/patterns/diagrams.md` |

Shared by the scripts, imported by them: `pointer.js` (the light that follows the
pointer), `tilt.js` (the card tilt), `two-tone.js` (the moving gradients) and `flow.js` (the
one WebGL renderer per page that colorflows draw with). `index.css` and `index.js`
gather everything.

On the site, `/omds.css` is the tokens and every component CSS in one file, and `/omds.js`
every script in one module, for pasting (a Claude artifact) or linking.

Examples of every component put together are at `/examples/` on the site: bare pages built
from nothing but these files and the tokens.

**The OpenMined skill depends on this format.** Its project-type table and its components
step (`openmined-design-system/SKILL.md` in `OpenMined/skills`) tell agents to copy these files
as they are, in any stack. A change of format (Astro components as the canonical reference,
say) changes those two places too.
