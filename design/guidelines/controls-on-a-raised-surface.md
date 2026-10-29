---
type: Guideline
title: Recessed controls sit on a raised surface
description: Fields, toggles, checkboxes and radios are recesses, so they sit on a card or panel (raise-1 or raise-2), never directly on the page.
status: released
tags: [interface, surfaces]
tokens: [--surface-sunken, --surface-base, --surface-raise-1, --surface-raise-2]
---

**Rule.** A control drawn as a recess (a field, a toggle, a checkbox, a radio, a progress track) sits on a raised surface: `--surface-raise-1` or `--surface-raise-2`. Never put one directly on the page (`--surface-base`); put it in a card or panel first.

**Why.** A recess reads by its difference from the surface around it. Sunken against the page is 1.22:1 in light mode and 1.05:1 in dark, close to invisible; against raise-1 it's 1.30:1 and 1.13:1, against raise-2 1.35:1 and 1.24:1. Raised surfaces also give the recess's inset shadow something to fall from.

**Do.** Put a single toggle in a small raise-1 panel with its label, as the Interface page does for its interactive layer.
