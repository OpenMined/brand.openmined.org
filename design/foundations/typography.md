---
type: Typography
title: Typography
description: Rubik for display and Inter for text. v2 type hasn't started; this is the v1 baseline and the direction already decided.
status: exploring
tags: [typography]
---

v2 has no type tokens yet. This page shows the type the released brand uses today, and the direction already decided for v2.

## Today (v1)

- **Families:** Rubik (400) for headings h1–h4; Inter for body text and h5–h6.
- **Sizes are fixed pixels** at every viewport (h1 61px down to h6 20px). Long-form `.prose` steps them down at two breakpoints.
- **No type tokens.** Type lives as element defaults, unlike color and spacing.
- **A wrong fallback:** headings fall back to `serif`, but Rubik is a sans.

The website (openmined.org) built the system the brand lacks: fluid sizes that scale with the viewport, per-level size tokens, and readable-content rhythm.

## Direction (decided)

The brand takes an **extraction** of the website's type system, not a port:

- **Into the brand:** fluid scale tokens per heading level with the `clamp()` mechanism, family role aliases, a leading ramp, display tracking per level, heading rhythm (space above and below per level), and a measure token for readable line length.
- **Documented as a pattern:** a per-surface cap for heroes (`--h1-max`), the lever for "headline too large".
- **Stays in the website:** its article heading remapping and the full prose cascade.

## Open

- The ask behind the type work is page-level: h1 against the hero, h2 sizing and spacing, and vertical rhythm above the fold.
- Whether a minimal prose rhythm belongs in the brand.
- The h5 and h6 sizes (21px and 20px) read as one level; parked.
- This site's own type is a placeholder until this round.
