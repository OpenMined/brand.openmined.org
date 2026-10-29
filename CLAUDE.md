# OpenMined Design System — working in this repo

The source of the OpenMined Design System (v2). An Astro site at the repo root builds
**design.openmined.org**, which serves everything people and AI agents need: tokens,
guidance, components, icons, logos, graphics and examples. People using the system read the
site (and agents `AGENTS.md` / `/llms.txt`); this file is for working on the system itself.

**The code is canonical.** Check the files for what exists; don't rely on lists here.

## The site is a view of the sources

Nothing is typed into a page by hand. Route every change to its source:

- **Values** (colors, shadows, spacing, type, any token) → `tokens/`, built into `src/tokens/v2/`.
- **Knowledge** (rules, decisions, open questions, the words on a page) → `design/`: one typed
  Markdown file per idea, in `foundations/`, `components/`, `patterns/`, `behaviors/`,
  `guidelines/`, plus `decisions/` (dated `YYYY-MM-DD-slug.md`, never edited to say something
  new: a changed decision gets a new record). `overview.md` is the entry; `log.md` the change
  history (add a line for every change). `index.md` is reserved for a generated listing.
- **Components** → `components/` at the repo root: one CSS file per component, a small ES
  module per moving part (each exports one function taking a selector; safe to call again),
  bare class names, the markup at the top of each CSS file. No framework, no loader.
  `components/README.md`. Decision 2026-10-27.
- **Examples** → `src/pages/examples/` on `src/layouts/Example.astro`, listed in
  `src/lib/examples.ts`: bare pages built from the served files (plus, for website pages, the example kit in
  `src/examples/`: not system), so the built HTML is what someone copies. Examples have no
  status; each names the guidance it shows (`shows`). Decision 2026-10-29 *Examples show the rules*. Diagram sources live in `src/diagrams/`.
- **Presentation** (layout, live demos) → `src/pages/*`, shared parts in
  `src/components/site/`, styles in `src/styles/site.css` (v2 tokens only).
- **Served files** (`/omds.css`, `/omds.js`, `/components/*`, `/tokens/omds.*`,
  `/tokens/source/*`, `/design/*.md`, `/icons/set/*`, `/llms.txt`, `/AGENTS.md`,
  `/manifest.json`) are endpoints in `src/pages/` over `src/lib/serve.ts`, generated at build;
  each CSS/JS file carries a stamp with the version and commit.

**Frontmatter** on every guidance file: `type`, `title`, `description`, `status`, optional
`tags` (which pages show it) and `tokens` (names it governs). `src/lib/design.ts` validates it
and fails the build on a bad file.

## Statuses

`draft` (in progress) → `released` → `deprecated` (names its replacement), on every token
(`$extensions["org.openmined"].status`) and guidance file. **Every rule, value and component on
the public site is released**; examples have no status (they show the rules, they aren't rules).
`npm run build` fails if any token or file is `draft`, or an example names a missing or draft
guidance file (`src/lib/release-gate.ts`); `npm run dev` and `npm run build:review` show drafts.
Decisions 2026-10-29 (three statuses; examples show the rules).

## Tokens

Open-format token files (Design Tokens 2025.10) in `tokens/`: `base/` (the same in every
mode), `light/` and `dark/`, and `resolver.json`.

- `tools/palette/generate.mjs` writes the generated files (gray, hues, gradient, shadows) from
  `tools/palette/inputs.json`. Retune = edit inputs, regenerate.
- `tools/tokens/build.mjs` validates `tokens/` (vendored schemas in `tools/tokens/schemas/`),
  resolves every reference, and writes `src/tokens/v2/` (`tokens.css`, `brand-colors.js`,
  `tokens.{light,dark}.json`). Outputs are committed; never hand-edit them.
- `npm run tokens` regenerates everything; `npm run tokens:check` is the CI gate.

## Color modes

Tokens respond to `data-theme="dark"` on `<html>`. Three `data-section` values override it on
any element: `always-dark`, `always-light` (fixed), and `invert` (flips with the page). Inside
any of them, always use role tokens (`--surface-base`, `--text-body`, …), never palette steps;
they resolve for the context.

## Enforcement: raw colors are un-shippable

**Never hardcode a color.** Every color is a token. Literal values live only in the token
build (`src/tokens/v2/tokens.css`, generated) and v1's frozen `src/tokens/tokens.css`.

`stylelint.config.js` fails on any raw hex, named color or `rgb()`/`hsl()` literal on a color
property (`npm run lint`). CI runs it with `tokens:check` on every PR (`.github/workflows/lint.yml`)
and before every deploy (`deploy.yml`). WebGL needs numbers, so embeds take colors from the
JS token output (`brand-colors.js`), never hand-typed hex. If a color isn't covered, add a
token first.

## Icons

Every icon is a name in `icons/set.json` (Iconoir regular, our own in `public/icons/`, or a
partner mark), resolved by `src/lib/icons.ts` for the site and served at `/icons/set/`. Stroke
by size (2 up to 24px). Own drawings carry no stroke width or colors (`npm run icons:import`);
partner marks stay fills. A name missing from the set fails the build. `icons/README.md`.

## Brand graphics (`<om-diamond>`, `<om-stream>`, `<om-mesh>`)

Framework-free web components in `public/embeds/`, served at `/embeds/*` with open CORS. Each
is independent and self-cleans. Colors come from `brand-colors.js`; an element with
`data-follow` takes token colors at run time (see the examples' `FOLLOW_JS`). The hover-card
colorflow and diagram pulses are components (`components/card-flow.js` on the shared renderer
`flow.js`; `line-flow.js`).

## Partner and organization marks

`public/logos/partners/` (tools we integrate with) and `public/logos/orgs/` (organizations we
work with) are **trademarks of their owners**, used nominatively, **not** governed by the
system's tokens. Never recolor or redraw; source from the owner's brand resources.
`partners.json` and `orgs.json` are the sources of truth; `src/lib/partners.ts` fails the
build on a color file that doesn't read in one mode. `PartnerLogo.astro` renders them.

## Google Docs

`tools/google-docs/` derives Docs named styles from the **v1** CSS (`src/tokens/*.css`) and
writes them via the Docs API; moving it to v2 is planned. `public/logos/raster/` holds PNG
renders of the logos for Docs. `tools/google-docs/README.md`.

## v1

v1 is tagged `v1.0.0`. Its served files (`/tokens/tokens.css`, `global.css`, `typography.css`,
`google-docs.json`, copied from `src/tokens/` at prebuild) stay at their paths, unlinked, for
existing projects. The review rounds and page reviews were removed 2026-10-29; tag
`rounds-archive` keeps them runnable (`git checkout rounds-archive && npm run dev`).

## Deploying

`npm run build` → `dist/`. Deploys are manual (Wrangler to Cloudflare Pages), built from a
clean checkout of the pushed commit. Previews go to a branch alias; production only on an
explicit go.
