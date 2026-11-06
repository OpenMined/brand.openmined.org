---
type: Guideline
title: Recessed controls prefer a raised surface
description: Fields, toggles, checkboxes and radios are recesses, so put them on a card or panel (raise-1 at least) unless their guidance names an exception. The color-mode switch in a page's header is one.
status: released
tags: [interface, surfaces]
tokens: [--surface-sunken, --surface-base, --surface-raise-1, --surface-raise-2]
---

**Rule.** A control drawn as a recess (a field, a toggle, a checkbox, a radio, a progress track) goes on a raised surface, `--surface-raise-1` at least, by default. Put it directly on the page (`--surface-base`) only where an exception is named, here or in the control's guidance.

**Why.** A recess reads by its difference from the surface around it. Sunken against the page is 1.22:1 in light mode and 1.05:1 in dark; against raise-1 it's 1.30:1 and 1.13:1, against raise-2 1.35:1 and 1.24:1. On the page in dark mode, an unchecked box, an empty radio and a switch that's off all but disappear; checked and on states read anywhere. Raised surfaces also give the recess's inset shadow something to fall from.

**Never on the page.** A thin track (a meter, a progress bar) has no exception: it all but disappears on the page in either mode.

**Exceptions.**
- **The color-mode switch in a page's header** may sit on the page. It is off in light mode and on in dark mode, the two states that read on the page.

**Do.** Put a single toggle in a small raise-1 panel with its label, as the Interface page does for its interactive layer.

*Open:* a high-contrast toggle for controls that have to sit on the page.
