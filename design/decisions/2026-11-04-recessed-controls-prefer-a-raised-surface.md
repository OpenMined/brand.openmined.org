---
type: Decision
title: "Recessed controls prefer a raised surface"
description: "Putting a recessed control on a raised surface becomes the default, not an absolute: a control may sit on the page where an exception is named. The color-mode switch in a page's header is the first."
status: released
date: 2026-11-04
tags: [interface, surfaces]
tokens: [--surface-base, --surface-raise-1]
---

**Context.** The guideline said recessed controls (fields, toggles, checkboxes, radios) never sit directly on the page. Feedback during the skill's test round (brand repo issue #41) found the components README's whole-page example putting the color-mode switch on the page, against it. Side by side on the page and on a card, in both modes: in light mode every control reads on the page; in dark mode the field and anything checked or on read, while an unchecked box, an empty radio and a switch that's off all but disappear. The color-mode switch is never in those states where they fail: off in light mode, on in dark.

**Decision.** Design lead, 2026-11-04.
- A recessed control goes on a raised surface, raise-1 at least, **by default**, as general interface practice suggests.
- It may sit on the page where an exception is named, in the guideline or in the control's own guidance.
- **The color-mode switch in a page's header** is the first exception. The README example stands.

**Alternatives.** Keep the rule absolute and move the switch onto a raised surface in the README and the examples: a panel in the header for one switch adds chrome for no gain in legibility. Drop the rule: dark-mode forms on the page would lose their unchecked and off states.

**Revisit when.** A high-contrast toggle exists for controls that have to sit on the page (open in the guideline).
