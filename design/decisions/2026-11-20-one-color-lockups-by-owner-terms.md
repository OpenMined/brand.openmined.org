---
type: Decision
title: "A one-color lockup only where the owner's terms allow it; retired ones are removed"
description: "A tool mark gets a currentColor lockup (logo-mono.svg) only where its owner's terms allow a recolored lockup. Docker's, Figma's and Loom's, knockouts of lockups their owners have retired, against terms that forbid recoloring or altering, are removed; the brands keep their current official lockups."
status: draft
date: 2026-11-20
tags: [logos]
---

**Context.** The tool marks refresh (pull request #58) brought Docker, Figma and Loom up to their owners' current files: Docker's 2026-11-19 mark, Figma's 2024 palette and lockup, and Loom in Atlassian's blue with the Charlie attribution lockups. Each brand also kept a `logo-mono.svg` from the earlier set: a `currentColor` knockout of its old lockup (Docker's retired whale, Figma's pre-2024 lockup, Loom's purple-era lockup). Those three now show artwork the owners no longer use, recolored, and each owner's terms speak against it:
- Docker allows only its approved colorways.
- Figma asks that its marks not be modified.
- Atlassian asks that its attribution lockups not be composed or deconstructed.

`tools.json` flags all three with `monoRestricted` and the owner's words. The refresh kept the files rather than removing them, because removing an existing file is the design lead's call.

**Decision.** Proposed; awaiting the design lead (and the brand owner, on the owners' terms).
- **A one-color lockup only where the owner's terms allow it.** A tool mark gets a `logo-mono.svg` (its lockup in `currentColor`) only where the owner's terms allow a recolored lockup. The refresh followed this already: OpenRouter, WP Engine, Resend and Linear got none.
- **Remove `docker/logo-mono.svg`, `figma/logo-mono.svg` and `loom/logo-mono.svg`**, and their `lockup.mono` entries.
- Each brand keeps its current official lockups: Docker in Ether and Zero, Figma's kit lockup, and Loom's attribution lockup in light and dark.

**Alternatives.** Keep the three as they are: the set goes on serving retired artwork, recolored against the owners' terms. Make new one-color versions from the current lockups: the same terms forbid it.

**Consequences.**
- Three files and three `lockup.mono` entries go.
- A project or page that used one of these files falls back to the brand's current lockup.
- admin.openmined.org's brand_marks re-pins and stops offering a one-color lockup for these three.

**Revisit when.** An owner publishes an official one-color lockup.
