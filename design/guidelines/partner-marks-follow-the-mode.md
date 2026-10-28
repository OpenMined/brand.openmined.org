---
type: Guideline
title: Partner marks follow the color mode
description: Every partner mark reads in light and dark. One-color marks take the text color; a color mark with dark ink gets a dark-mode file; the build fails on one that would vanish.
status: working
tags: [graphics, icons]
---

**Rule.** A partner mark from `public/logos/partners/` reads on every surface in both modes, with no plate behind it.

- **One color** (`icon.svg`, `logo-mono.svg`): inlined, so it takes the text color around it and follows the mode by itself.
- **Official color** (`icon-color.svg`, `logo.svg`): shown as supplied. A mark with dark ink that a dark surface would swallow (AWS's lettering, Rippling's plum) gets a dark-mode file beside it, `icon-color-dark.svg` / `logo-dark.svg`, recorded under `dark` in `partners.json`. `PartnerLogo` swaps it in wherever the page or a section is dark.

**Dark-mode files.** Use the owner's own reversed file. Where it can't be fetched, derive one by setting the dark ink to white, as the owner's reversed logos do, and say so in `derived` with a gap to replace it. Never change a mark's brand colors otherwise.

**The check.** The brand site's build measures every visible color in each mode's color file against base, raise-1 and raise-2 (`src/lib/partners.ts`). Under 1.5:1, close to invisible, the build fails unless the brand has a file for that mode or a stated reason it reads anyway (`modeCheck`; Miro's mark is a yellow tile with the mark cut into it, and each mode keeps one of the two readable). The bar is low on purpose: these are marks, not text, and many brand colors sit under 3:1 on one surface while still reading as the logo.

**Why.** Kyle, 2026-10-12: most partner marks already work in both modes; a few didn't, and a new one shouldn't be able to arrive broken. A white plate behind a mark would be a filled container, which *Outlines are lines* rules out.

**Images.** Logos supplied only as images can't do this; they sit on white ([Logo images sit on white](/graphics/#guidelines-logo-images-on-white)).
