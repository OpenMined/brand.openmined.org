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
