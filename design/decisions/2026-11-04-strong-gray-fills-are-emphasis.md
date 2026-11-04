---
type: Decision
title: "Every strong gray fill is emphasis"
description: "Wherever a component fills with the strong gray, it uses --emphasis, and text on it uses --on-emphasis, as the primary button does; not the headline text color and the page's color."
status: released
date: 2026-11-04
tags: [color, interface]
tokens: [--emphasis, --on-emphasis]
---

**Context.** Decision 2026-10-28 (*The accent is a hue; the gray fill is emphasis*) gave the primary button's gray fill its own pair, `--emphasis` and `--on-emphasis`. Other components that fill with the same gray kept building it from other roles: the strong status chip with no status and the steps' number badge filled with `--text-headline` and labeled in `--surface-base`; checked checkboxes, radios and toggles filled with `--text-headline`. The values matched by chance, so a retune of the fill would have moved the button and left the rest behind.

**Decision.** Design lead, 2026-11-04.
- Every strong gray fill is `--emphasis`; text on it is `--on-emphasis`. Status chip (no status, strong), steps' number badge, checked controls, and this site's own demos.
- A control's check, dot or knob stays a raised surface (`--surface-raise-1`): it is the part inside the control, not a label.

**Alternatives.** Leave each component on its own roles: no visible difference today, and the drift the pair exists to prevent.

**Consequences.** Fills unchanged. Labels on the chip and the step badge move one gray step (gray 100 → 50 in light mode, gray 900 → 950 in dark), the same as the primary button's label. The pair's contrast is already checked (`tools/contrast/pairs.json`).
