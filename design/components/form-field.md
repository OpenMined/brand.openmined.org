---
type: Component
title: Form controls
description: Fields are flat at rest, light up under the pointer on hover, and take a gray line with the inset on focus. Checkboxes, radios, and toggles are small recesses that cast at rest and take the fields' outline and line. Errors are colored text, not a box.
status: released
tags: [interface]
tokens: [--surface-sunken, --shadow-sunken, --gray-300, --gray-400, --gray-500, --danger-fg, --text-headline, --text-body, --radius-sm, --radius-md, --font-size-md, --font-size-sm]
---

**Kinds, by behavior.** A control's kind names how it behaves, not which level it sits at:

- **Field** (text, email, select, textarea, file): `--surface-sunken`, **flat at rest**. In the minimal layer, hover draws a faint 1px outline, the controls' hover line. In the full layer (`field.js`) a soft white light inside the field follows the pointer: in light mode with a gray 300 outline that turns white near the pointer, in dark mode a gray 500 edge near the pointer. On focus a solid 1px line in `--line-focus` (gray 500 in light mode, gray 400 in dark), with the inset `--shadow-sunken` (decisions *Fields light up on hover and take a gray line on focus*; *Controls take the fields' outline and focus line*). All grayscale.
- **Control** (checkbox, radio, toggle track): a recess you operate. It casts its inset shadow at rest. Checked fills with `--text-headline`. On hover the fields' outline, 1px inside the edge (gray 300 in light mode, gray 500 at 0.5 in dark), with no pointer light: the control is too small for one. On keyboard focus the fields' gray line, 1px, drawn 2px outside the control.
- **Recess** (a progress track, a well inside a card): a recess you don't touch. It never casts.

**Anatomy of a field.** Label, an optional description (`--text-body`), the control. A required mark sits after the label.

**Text sizes.** Two sizes, set by the text tokens:

- **Labels and placeholders:** `--font-size-md` (1rem), weight 500. Most of the website's forms put the label inside the field as its placeholder, so the two match.
- **Values, options, and errors:** `--font-size-md`, regular weight.
- **Descriptions:** `--font-size-sm` (0.875rem), regular weight.

A form can then mix fields with an inner label and lists with a heading above them, and they still read as one level. *Open:* whether typed values should also be 500, since a placeholder at 500 is heavier than the text that replaces it.

**Where the label goes.** Each form chooses. Most of the website's forms put the label inside the field, as its placeholder, and that is the cleanest default; checkbox and radio lists can't, so they take a heading at the same size. A form that mixes the two is fine as long as the sizes match. A placeholder used as the label disappears once someone types, so the field needs an accessible name too (`aria-label` or a visually hidden label).

**States.** Hover (the pointer light and outline), filled, disabled (dimmed, not-allowed cursor, no hover), focus (the gray line and inset), error.

**Placeholder text** uses `--text-muted`, which reaches 4.5:1 on the sunken field.

**Errors are text.** A validation error is `--danger-fg` text directly under the field, on whatever surface the form sits on: no box, no outline, no fill. Colored boxes stacked on a dark page read as a muddy mix of panels.

**States.** In both interactive layers (*Interaction states*); the code is the spec.

**Geometry.** Fields and buttons take `--radius-md`; checkboxes `--radius-sm`; toggles `--radius-full`. The gap between a recessed control's outer surface and the part inside it is 3px in every state: a toggle's knob, a checkbox's check. A radio's dot takes twice that (6px), because a round mark needs more room to read as a dot rather than a ring.

**Accessibility.** The gray line is the focus indicator on every control, and it reaches 3:1 against every surface and the field's own fill: `--line-focus`, gray 500 in light mode (4.15:1 on the fill, 5.07:1 or more on the surfaces) and gray 400 in dark mode (4.45:1 or more). On checkboxes, radios, and toggles it sits outside the control, because inside it would meet the checked fill (gray 500 on `--text-headline` is 2.87:1).

**Generic first.** Style generic form markup; vendor forms (HubSpot, for one) get an adapter in the project that uses them, never vendor class names in the brand. Style the control or its own wrapper, never sibling order or nesting depth, so the mapping holds.

**Code.** Fields: `components/field.css`, with `field.js` (`fieldLights()`) for the pointer light. Checkbox, radio, and toggle: `components/control.css`, no script. Plain CSS and ES modules, no build step: load the v2 tokens first, then only the files a page uses; each script exports one function that takes a selector and is safe to call again. The markup to match is at the top of each CSS file (`components/README.md`).
