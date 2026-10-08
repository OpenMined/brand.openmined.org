---
type: Behavior
title: Color modes and sections
description: Light and dark swap every value under the same names. A section can pin a mode or invert the page's; the four levels repeat inside it.
status: working
tags: [surfaces]
tokens: [--surface-base, --text-body]
---

**Rule.** Every token has a light and a dark value under one name; the page's mode picks which. A section can change the mode inside it with `data-section`:

- `always-dark`: dark, whatever the page.
- `always-light`: light, whatever the page.
- `invert`: the opposite of the page. Nested inside another section, it is still the opposite of the *page*.

**Modes, not levels.** A section context doesn't add a surface. The same four levels repeat inside it, with that mode's values: a card in a dark section on a light page is the dark `raise-1`.

**Everything follows the section.** Surfaces, text, lines, hue keys, status colors and shadows all take the section's mode. A shadow falls on the ground beneath, so a raised element inside a dark section casts the dark-mode shadow.

**A section paints its own ground.** An element with `data-section` sets its background to `--surface-base` and its text to `--text-body`, so the switch is visible and text doesn't keep the page's color.

**When to use it.** A full mode switch is a deliberate design move: a feature band, a graphic that needs a dark ground, a highlighted section. It isn't the tint that *Sections aren't tinted* rules out.
