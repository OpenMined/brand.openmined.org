---
type: Decision
title: "Controls take the fields' outline and focus line"
description: "Checkbox, radio and toggle take the fields' gray hover outline and focus line, the line 2px outside; the focus line is gray-400 in dark mode so it reaches 3:1 on every surface."
status: released
date: 2026-10-27
tags: [interface]
tokens: [--gray-300, --gray-400, --gray-500, --shadow-sunken, --text-headline]
---

**Context.** The field decision of 2026-10-17 left two things: the focus line's contrast was unchecked, and checkboxes, radios and toggles had no hover and kept the browser's focus ring. Checked against 3:1, the 1px gray-500 line passes everywhere in light mode (4.15:1 on the field's fill, 5.07:1 or more on the surfaces) and in dark mode on the fill and base (3.25, 3.11), but not on raise-1 (2.87) or raise-2 (2.63), where forms often sit.

**Decision.** Design lead, 2026-10-27. The focus line is **gray-400 in dark mode** (4.45:1 or more on every surface and the fill); light stays gray-500. Checkboxes, radios and toggles take the fields' language: on hover the fields' outline, 1px inside the edge (light gray-300, dark gray-500 at 0.5), no pointer light; on keyboard focus the gray line, 1px, **2px outside** the control, in place of the browser's ring.

**Alternatives.** Keep gray-500 in dark and keep forms on base or lower: a rule easy to break. The line inside the control's edge, as on fields: on a checked control it meets the headline fill, 2.87:1 in light mode. Hover only, keeping the browser ring: two focus styles in one form.

**Consequences.** One focus signal for every form control. `.opt__box` and `.switch` in `src/styles/site.css`; the page reviews' HubSpot checkboxes in `v2/motion.css`.

**Revisit when.** The accessibility round sets the focus style for the rest of the interface (buttons and links still use their own).
