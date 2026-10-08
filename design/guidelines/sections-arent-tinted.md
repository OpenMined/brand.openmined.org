---
type: Guideline
title: Sections aren't tinted
description: Don't tell sections apart with a slightly different background. A boundary is a divider; a deliberate full mode switch is allowed.
status: working
tags: [surfaces]
tokens: [--surface-base, --line]
---

**Rule.** Don't alternate a slightly lighter or darker background to tell sections apart. Every section sits on `--surface-base`; if a boundary needs marking, use a divider.

**Why.** A slight tint doesn't read as structure. It reads as a slightly different gray, and in light mode it makes the page look muddy.

**Do.** Keep every band on the page level, and use a `--line` divider between them. To set a section apart on purpose, switch its whole mode with `data-section` (`always-dark`, `always-light` or `invert`). That is a full inversion, not a tint, and it is allowed (see [Color modes and sections](#behaviors-color-modes)).

**Don't.** Paint a section `--surface-sunken` or `--surface-raise-1` to set it apart.
