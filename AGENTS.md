# OpenMined Design System — for AI agents

You are building something for OpenMined: a web page, a Claude artifact, a dashboard, slides, a
document or a graphic. This file says where everything is and how to use it. It is served at
https://design.openmined.org/AGENTS.md and kept at the root of the brand repository; the same
files are on the site, so you never need the repository.

## Start here

1. Read the page for what you're making: `/design/media/<medium>.md`, one of `web-pages`,
   `claude-artifacts`, `internal-tools`, `graphics`, `slides`, `google-docs`, `product-apps`.
   It names where to start, the guidance, the component files and the examples that medium
   needs, and what isn't covered yet. Load those, not everything.
2. Read the guidance it names (`/design/<path>.md`): short Markdown files with frontmatter
   (`status`, the `tokens` they govern, `tags`). Then the components it names (the markup to
   match is at the top of each CSS file) and one example, the closest to what you're making:
   copy it and change the words.
3. Take the code; don't rewrite it. Values were tuned by eye, and a component rebuilt from a
   description drifts.
4. When the medium's page doesn't cover what you need, go wider:
   `https://design.openmined.org/llms.txt` lists every guidance file, by kind, with one line
   each. Building a page from nothing: `/components/README.md`, "A whole page, from nothing",
   is a complete one to start from.

## The files

| What | Where | Use |
| --- | --- | --- |
| Tokens + every component, one stylesheet | `/omds.css` | Link it, or paste it inline (Claude artifacts must inline) |
| Every component script, one ES module | `/omds.js` | The full interactive layer (motion), plus tabs, contents, copy buttons and the color mode switch; pages work without it |
| One component | `/components/<name>.css`, `/components/<name>.js` | When a page needs only a few; the markup to match is at the top of each CSS file |
| Tokens only | `/tokens/omds.css`, `/tokens/omds.light.json`, `/tokens/omds.dark.json`, `/tokens/omds.colors.js` | CSS custom properties; resolved values per mode; colors for canvas and WebGL |
| Token source | `/tokens/source/resolver.json` and the files it names | Design Tokens format 2025.10, for token tools |
| Guidance | `/design/<path>.md`, listed in `/design/index.json` | Rules, components, patterns, decisions |
| A Claude artifact, ready to fill | `/starter/artifact` (minimal), `/starter/artifact-full` (with motion) | One file with everything inlined: copy it, keep the head, replace the body |
| Brand graphics | `/embeds/om-diamond.js`, `om-stream.js`, `om-mesh.js`; one-file versions in `/embeds/single/` | Web components; use the one-file versions where you can't load a second file |
| Icons | `/icons/set/<name>.svg`, listed in `/icons/set/index.json` | Inline the SVG; it takes the text color |
| Logos | `/logos/`, rules on `/design/foundations/logo.md` | Use the files as they are |
| Examples | `/examples/<name>/`, listed in `/llms.txt` and `/manifest.json` | Whole sections, pages and graphics built from these files: copy one and change the words. Examples show the rules in use; they aren't rules (see below) |
| Version | `/manifest.json` | Version, commit, every served file |

Every served CSS and JS file starts with a comment naming the version and commit. Keep it when
you copy the file.

**When the site can't be reached**, a clone of the repository (on an up-to-date `main`) or
GitHub (for people with access) holds the sources the site builds these files from:
`/omds.css` is `src/tokens/v2/tokens.css` followed by the `components/*.css` files in the order
`components/index.css` imports them; `/omds.js` is `components/index.js` bundled;
`/components/*` is `components/`; `/tokens/omds.css`, `omds.light.json`, `omds.dark.json` and
`omds.colors.js` are `src/tokens/v2/tokens.css`, `tokens.light.json`, `tokens.dark.json` and
`brand-colors.js`; `/tokens/source/` is `tokens/`; `/design/` is `design/`; `/embeds/*.js` and
`/logos/` are in `public/`. The starters, the one-file embeds, the icon set and the examples
exist only on the site. Copies from the sources carry no stamp: note the commit you took them
from.

## Rules that matter most

- **Tokens by name, never by value.** `var(--surface-raise-1)`, not its hex. Never type a raw
  color: every color is a token.
- **Roles over steps.** `--text-muted`, `--danger-fg` say what a color is for; graphics are the
  exception and use fixed steps through each hue's `key`.
- **Both color modes.** Light on `:root`, dark on `[data-theme="dark"]` on `<html>`; sections
  can lock with `data-section="always-dark" | "always-light" | "invert"`.
- **Two interactive layers.** Each component is complete in plain CSS (minimal: color stands
  still). The full layer adds motion through `/omds.js`. Dense interfaces (dashboards, internal
  tools) stay minimal: put `data-interaction="minimal"` on the region, or don't load the script.
- **Space belongs to the container.** Never put a margin on a heading or a block. Inside a long
  read use `.prose`; anywhere else put headings and blocks in a `.stack` (`.stack--sm` … for
  another step), and nest a tight stack to keep a heading with its text. Components space their
  own insides.
- **Icons:** the set in `/design/foundations/iconography.md` (Iconoir regular plus our own).
  Never invent an icon; never use another icon library.
- **The logo and partner marks** are used as supplied: never redrawn, recolored or generated.
- **Eyebrows** (a short phrase over a heading) are always `.text-eyebrow`: body text, sentence
  case, never all caps, letter-spaced or mono. Only the size may step down, with
  `.text-eyebrow--sm`. Caps in mono belongs only inside a diagram: the diagram label (`.fig__label`),
  which may sit over a group's or a panel's title within the figure.
- **Fonts:** Rubik and Inter, from Google Fonts (the link is at the top of `/omds.css`'s type
  section and in `/components/README.md`).
- **Status:** every rule, value and component on the site is `released`. `deprecated` items name
  their replacement.
- **Examples show the rules; they aren't rules.** Copy them freely. Each names the guidance it
  puts to work; anything beyond that (page layout, the shared page shell of the website examples)
  is illustration. Where an example and the guidance differ, follow the guidance and report the
  difference as feedback.

## By what you're making

One file per medium in `/design/media/` (listed in `/llms.txt` under *By medium*): where to
start, the guidance and component files that medium needs, its examples, and what isn't covered
yet. Its lists are names: guidance at `/design/<name>.md`, components at `/components/<name>.css`
(and `.js`), examples at `/examples/<name>/`. Read the one for what you're making first: `web-pages.md`, `claude-artifacts.md`
(artifacts can't load `/omds.css` by URL: start from the starter), `internal-tools.md`,
`graphics.md`, `slides.md`, `google-docs.md`, `product-apps.md`.

## Feedback

Tell us when the system didn't cover something, looked wrong, or you had to work around it.
Once per task, only when it happened, in a few lines: what you were making, what you needed,
what you did instead.

- With GitHub access (`gh`): file an issue on `OpenMined/brand.openmined.org` with the
  **Design system feedback** form, after showing the person the text.
- Otherwise: give the person the text to pass on to the design lead.
