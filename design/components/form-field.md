---
type: Component
title: Form controls
description: Fields are flat until focus, and the recess is the focus state. Checkboxes and radios are small recesses that cast at rest. Errors are colored text, not a box.
status: exploring
tags: [interface]
tokens: [--surface-sunken, --shadow-sunken, --danger-fg, --text-headline, --text-body, --radius-sm, --radius-md, --font-size-md, --font-size-sm]
---

**Kinds, by behavior.** A control's kind names how it behaves, not which level it sits at:

- **Field** (text, email, select, textarea, file): `--surface-sunken`, **flat until focus**. On focus it takes the inset `--shadow-sunken`; the recess *is* the focus state. It's subtle today, so a more obvious focus should be explored (a stronger or deeper inset, or a ring), as long as it reaches 3:1.
- **Control** (checkbox, radio, toggle track): a recess you operate. It casts its inset shadow at rest. Checked fills with `--text-headline`.
- **Recess** (a well, a footer strip, a badge): a recess you don't touch. It never casts.

**Anatomy of a field.** Label, an optional description (`--text-body`), the control. A required mark sits after the label.

**Text sizes.** Two sizes, set by the text tokens:

- **Labels and placeholders:** `--font-size-md` (1rem), weight 500. Most of the website's forms put the label inside the field as its placeholder, so the two match.
- **Values, options and errors:** `--font-size-md`, regular weight.
- **Descriptions:** `--font-size-sm` (0.875rem), regular weight.

A form can then mix fields with an inner label and lists with a heading above them, and they still read as one level. *Open:* whether typed values should also be 500, since a placeholder at 500 is heavier than the text that replaces it.

**Where the label goes.** Each form chooses. Most of the website's forms put the label inside the field, as its placeholder, and that is the cleanest default; checkbox and radio lists can't, so they take a heading at the same size. A form that mixes the two is fine as long as the sizes match. *Open:* placeholder-as-label disappears once someone types, so it needs an accessible name (`aria-label` or a visually hidden label) and a check against the accessibility round.

**States.** Filled, disabled (dimmed, not-allowed cursor), focus (the inset recess), error.

**Placeholder text** uses `--text-muted`. In light mode that is 4.13:1 on the sunken field, under AA's 4.5:1; the text-and-lines round sets `--text-muted`.

**Errors are text.** A validation error is `--danger-fg` text directly under the field, on whatever surface the form sits on: no box, no outline, no fill. Colored boxes stacked on a dark page read as a muddy mix of panels, the look this system avoids (Bennett, 2026-10-08). Replaces the earlier rule, an error card one level above the form.

**Geometry.** Fields and buttons take `--radius-md`; checkboxes `--radius-sm`; toggles `--radius-full`. The gap between a recessed control's outer surface and the part inside it is 3px in every state: a toggle's knob, a checkbox's check. A radio's dot takes twice that (6px), because a round mark needs more room to read as a dot rather than a ring.

**Accessibility.** On text fields the inset shadow is the only focus indicator, so it must reach 3:1 contrast. Checkboxes and radios keep the browser's focus ring: they already cast at rest, and without the ring a keyboard user would lose the focus signal.

**Generic first.** Style generic form markup; vendor forms (HubSpot today) get an adapter in the project that uses them, never vendor class names in the brand. Style the control or its own wrapper, never sibling order or nesting depth, so the mapping holds.
