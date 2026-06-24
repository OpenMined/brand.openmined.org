# OpenMined Brand Reference

Canonical source for OpenMined's brand tokens, UI primitives, and logo assets. All OpenMined projects and sub-brands consume from this repo. Deploys to brand.openmined.org via standard Astro build.

**The code is canonical.** Check the files directly for what exists — don't rely on lists in this document.

## Repo structure

Standard Astro project at the repo root — no subdirectory wrapper.

```
src/
  layouts/      — Base.astro: shell, fonts, token imports, theme init
  pages/        — one .astro file per page; index.astro is the reference page
  components/   — brand UI primitives (Button, Input, ThemeToggle, etc.)
  tokens/       — CSS custom properties and base styles
public/
  logos/        — all approved logo SVGs
  icons/        — custom SVG icons (currently empty)
astro.config.mjs
package.json
```

## What is canonical here

- **`src/tokens/`** — all CSS custom properties and base styles. `tokens.css` is the single source of truth for every brand value; `global.css` covers resets, element defaults, section theming, and prose scope.
- **`src/components/`** — brand UI primitives as Astro components. The reference site uses these directly; consuming projects copy them.
- **`public/logos/`** — all approved logo SVGs, served at `/logos/` in the built site.
- **`public/icons/`** — custom SVG icons when brand-specific glyphs are defined.

## What does NOT belong here

Site-specific layouts, sections, navigation, content, or anything tied to a particular project. `Logo.astro` is inherently project-specific (hardcodes logo paths) — each project ships its own. The logo SVG files are canonical here; the component is not.

## Astro aliases

`astro.config.mjs` defines two Vite path aliases:

- `@tokens` → `src/tokens/` — use for CSS imports in any component or layout
- `@brand` → `src/components/` — use for component imports within the site

## Color mode system

Tokens respond to `[data-theme="dark"]` on `<html>`. Three `data-section` values override this at the element level — apply to any element, not just `<section>`:

- **`always-dark`** — locks surface and text tokens to dark values regardless of page theme
- **`always-light`** — locks surface and text tokens to light values regardless of page theme
- **`invert`** — remaps surface tokens to the `--dark-surface-*` parallel set, which flips with the page theme (dark surface in light mode, light surface in dark mode)

**Rule:** inside any of these contexts, always use semantic tokens (`--surface-background-default`, `--text-body`, etc.) — never hardcoded palette values. The tokens resolve correctly for the context automatically.

`always-dark` and `always-light` are fixed — they never respond to the page theme. `invert` does.

## Icon system

Ionicons is the current peer dependency. Custom SVG icons go in `public/icons/` and replace ionicons element-by-element when available. Each component that uses an ionicon names it in its file header.

## Enforcement (raw colors are un-shippable)

**IMPORTANT — never hardcode a color.** Every color on a brand surface MUST be a design token: `var(--color-teal-600)`, `var(--surface-background-default)`, `var(--text-body)`, etc. Literal palette values live in exactly one file: `src/tokens/tokens.css`.

A stylelint gate (`stylelint.config.js`) makes this a hard rule, not a suggestion. Three rules — `color-no-hex`, `color-named`, and `declaration-strict-value` on color properties — fail the build on any raw hex, named color (`red`), or `rgb()`/`hsl()` literal. Run it with `npm run lint`. It runs in CI on every PR (`.github/workflows/lint.yml`, the merge blocker) and before every deploy (`deploy.yml`) — a violation cannot reach `brand.openmined.org`.

**Exempt from the gate** (intentional, in `ignoreFiles`):
- `src/tokens/tokens.css` — the palette source of truth; literal hex is correct here.
- `src/pages/diamond/`, `src/pages/stream/` — WebGL tuning tooling with their own local control-panel palette; not brand surfaces.

WebGL shaders need numeric color values, so the embeds can't read `var(--…)` tokens — they import from `public/embeds/brand-colors.js`, the single JS-side color source (see Portable embeds). Never hand-type hex into a shader; add/adjust colors in `brand-colors.js` (kept in lockstep with `tokens.css` until the DTCG build unifies them).

If you genuinely need a color the tokens don't cover, add it to `tokens.css` (or `brand-colors.js` for canvas) first, then reference it — don't reach around the gate.

## Portable embeds (`<om-diamond>` / `<om-stream>`)

The animated WebGL brand visuals are **framework-agnostic web components** in `public/embeds/`, meant to drop into any project — plain HTML, React, Astro, Webflow, anywhere. They are the canonical assets; the `DiamondEmbed.astro` / `StreamEmbed.astro` files are just thin wrappers the reference site uses to dogfood them.

**Consume — hosted (zero-build):**
```html
<script type="module" src="https://design.openmined.org/embeds/om-diamond.js"></script>
<om-diamond></om-diamond>
```
**Consume — copied** (the OMDS sync pattern, no Astro needed): copy the whole `public/embeds/` folder (`om-*.js` + `brand-colors.js`) into the project and record the SHA.

**Attributes:** `gradient="spectrum"` (named gradient from `brand-colors.js`) or `colors="#f8c073,#52a8c5,…"` (explicit stops). `<om-stream>` also takes `aspect-ratio`, `crop-top`, `crop-bottom`, `rot-speed`, `rot-axis`. Size with normal CSS.

**Design notes:**
- Each element is independent (multiple per page is fine) and self-cleans on removal — no global boot step.
- Colors come from `brand-colors.js` only — on-brand by construction, so the embeds never hand-type hex.
- Cross-origin hosting works because `public/_headers` sends `Access-Control-Allow-Origin: *` for `/embeds/*` (module scripts + their relative imports are fetched in CORS mode).
- The `/diamond` and `/stream` pages are tuning tooling (gate-exempt), not the assets themselves.

## Partner / integration marks (`public/logos/partners/`)

Third-party tool logos (GitHub, Slack, Notion, Asana, Claude, HubSpot, 1Password, Google, Ramp, …) used to identify integrations — **NOT OpenMined brand assets, and NOT governed by OMDS.** Each is the **trademark of its owner**, used nominatively. Rules:

- **Never recolor/restyle** a mark where the owner forbids it (e.g. Google's 4-color G stays as-is). OMDS color tokens do **not** apply to partner marks. Never imply endorsement.
- **Never redraw** a partner mark — source it from the owner's official brand resources (or a CC0 Simple Icons glyph for monochrome icons), or leave it as a documented gap.
- `partners.json` is the source of truth: per brand it records trademark owner, official source URL, available variants, brand color, and known gaps. `README.md` carries the governance.
- Per brand: `icon.svg` (monochrome, `fill="currentColor"` — inline + set `color` to theme it), `icon-color.svg` (official brand color), `logo*.svg` (wordmark lockups where officially available). The `PartnerLogo.astro` atom renders them.

## Deploying

Standard Astro build — no special config needed for GitHub Pages or Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist/`

For a subdirectory GitHub Pages deployment (e.g. `username.github.io/repo/`), add `base: '/repo-name/'` to `astro.config.mjs`.

## Using in a project

Copy `src/tokens/` and `src/components/` into the consuming project's `src/brand/`. Serve logos from `public/logos/`. Record the brand repo commit SHA in `src/brand/brand-version.txt` as the audit trail. Any edits to files in `src/brand/` are intentional project-specific divergence — document what changed and why.

**Sync approaches (priority order):** local clone of this repo → GitHub raw file URLs → deployed brand reference at brand.openmined.org. No canonical sync script; use whichever approach is available and let the implementation follow from there.

## Peer dependencies

Projects must load ionicons in their base layout. CDN is fine for development; self-host before production.
