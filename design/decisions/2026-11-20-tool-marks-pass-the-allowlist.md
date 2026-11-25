---
type: Decision
title: "Tool marks pass an allowlist, and CI checks every stored mark"
description: "Every SVG under public/logos/tools/ is rebuilt by an allowlist sanitizer before it is stored, and CI fails on any stored mark that isn't exactly what the sanitizer rebuilds, or any icon.svg that isn't one color with no ids."
status: draft
date: 2026-11-20
tags: [logos]
---

**Context.** Tool marks are other companies' files, downloaded from brand kits, and an SVG can carry script, load other files or hide CSS tricks. They are served from this site to other origins (`/logos/*` has open CORS), inlined into its pages, and seeded into admin.openmined.org. Nothing checked them: a file came in as it was downloaded. `tools/logos/sanitize.mjs` rebuilds a file from an allowlist of elements, attributes and value functions and refuses anything else with the reason; `npm run logos:check` runs it over every stored mark. **Until this is decided, nothing in CI stops an unsanitized tool SVG**: the check runs only when someone runs it. That matters most for `icon.svg`, which the site inlines into its own pages (`ToolLogo.astro`, the icon set's tool marks), so a hostile file would run as part of the page, not in an image.

**Decision.** Proposed; awaiting the design lead.
- **Every tool mark passes the allowlist before it is stored**, and is stored as the sanitizer rebuilds it (editor noise dropped, the drawing unchanged).
- **CI runs `npm run logos:check`**, so a pull request fails on a mark that isn't in that form, on an `icon.svg` that isn't one color, on an `icon.svg` with ids or references (it is inlined, often more than once), and on an id without its brand's prefix. Two ways, for the design lead to choose:
  - **Lighter (recommended):** one step in `.github/workflows/lint.yml`, after *Lint*, that runs `npm run logos:check`. `npm run lint` stays as it is, so a local lint run is unchanged.
  - **Fuller:** `npm run lint` runs `npm run logos:check`, so the local lint, CI and every deploy all check the marks.
  - **At deploy (with either, or alone):** once the site builds through Cloudflare Pages' Git integration, its build command can run `npm run logos:check` before `npm run build`. That enforces the allowlist on every deploy, previews included, without changing `npm run lint`.

**Alternatives.** Keep the check as its own script, run by hand: a mark added without it is served unchecked, and nothing in CI notices. Sanitize at build time in `ToolLogo.astro` as well: it would protect the site's own pages even if a file slipped through, but not the files served at `/logos/` or seeded elsewhere; it can be added on top.

**Consequences.** The 82 sanitizer tests and the stored-marks check run in CI on every pull request (and, with the fuller way, in every local `npm run lint`). Adding a mark means running it through the sanitizer first (`public/logos/tools/README.md`).

**Revisit when.** The organization logos (`public/logos/orgs/`) come under the same check: 10 of their 36 files would be rewritten and 5 are over the 64 KB cap, so each needs a look first.
