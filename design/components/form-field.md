---
type: Component
title: Form controls
description: Fields are flat until focus, and the recess is the focus state. Checkboxes and radios are small recesses that cast at rest. Errors are a surface.
status: exploring
tags: [interface]
tokens: [--surface-sunken, --shadow-sunken, --danger-subtle, --danger-fg, --shadow-raise-2, --text-headline, --text-body]
---

**Kinds, by behavior.** A control's kind names how it behaves, not which level it sits at:

- **Field** (text, email, select, textarea, file): `--surface-sunken`, **flat until focus**. On focus it takes the inset `--shadow-sunken`; the recess *is* the focus state. It's subtle today, so a more obvious focus should be explored (a stronger or deeper inset, or a ring), as long as it reaches 3:1.
- **Control** (checkbox, radio, toggle track): a recess you operate. It casts its inset shadow at rest. Checked fills with `--text-headline`.
- **Recess** (a well, a footer strip, a badge): a recess you don't touch. It never casts.

**Anatomy of a field.** Label (`--text-headline`, 500 weight), an optional description (`--text-body`), the control. A required mark sits after the label.

**States.** Filled, disabled (dimmed, not-allowed cursor), focus (the inset recess), error.

**Placeholder text** uses `--text-muted`. In light mode that is 4.13:1 on the sunken field, under AA's 4.5:1; the text-and-lines round sets `--text-muted`.

**Errors are a surface.** A validation error is a card one level above the form, not an outline around the field: it takes the raised shadow (`--shadow-raise-2`) and the danger status colors, `--danger-subtle` behind `--danger-fg` text (6.6:1 in light, 7.7:1 in dark).

**Geometry.** The gap between a recessed control's outer surface and the part inside it is 3px in every state: a toggle's knob, a checkbox's check. A radio's dot takes twice that (6px), because a round mark needs more room to read as a dot rather than a ring.

**Accessibility.** On text fields the inset shadow is the only focus indicator, so it must reach 3:1 contrast. Checkboxes and radios keep the browser's focus ring: they already cast at rest, and without the ring a keyboard user would lose the focus signal.

**Generic first.** Style generic form markup; vendor forms (HubSpot today) get an adapter in the project that uses them, never vendor class names in the brand. Style the control or its own wrapper, never sibling order or nesting depth, so the mapping holds.
