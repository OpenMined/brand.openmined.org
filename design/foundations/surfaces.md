---
type: Elevation
title: Surfaces
description: Four surface levels, each with its own shadow. One below the page, the page, and two above.
status: working
tags: [surfaces]
tokens: [--surface-sunken, --surface-base, --surface-raise-1, --surface-raise-2, --shadow-sunken, --shadow-raise-1, --shadow-raise-2]
---

Every element sits on one of four levels. Each level is a gray step and a shadow, defined for light and dark. Pick the level by what the element *is*, never by the shade you want.

| Level | Token | What it's for |
| --- | --- | --- |
| −1 | `--surface-sunken` | A recess inside a surface, sized to a control: fields, toggle and progress tracks, badges, hover washes. |
| 0 | `--surface-base` | The page. Every section sits on it. |
| +1 | `--surface-raise-1` | A card or panel on the page. |
| +2 | `--surface-raise-2` | One level higher: a card inside a panel, menus, popovers. |

## How the levels behave

- **Each level gets lighter as it rises, in both modes.** In dark mode, cards are lighter than the page, not darker.
- **Shadows belong to the levels.** `raise-1` and `raise-2` cast their own shadow, `sunken` takes an inset one, and `base` casts nothing: an element sitting on the page is not above anything.
- **Light mode has four levels at most.** White is the light `raise-2`, so there is no lighter surface above it. A modal or overlay has to be shown some other way than a fifth surface.
- **Elements opt in to a level.** Nothing gets a surface just by being a `section` or a `div`.

## Open

- A divider inside a recess disappears in light mode: `--line` and `--surface-sunken` resolve to the same gray (200). No current design puts one there; the text-and-lines round decides `--line`.
- Dark mode's separation between levels fades in a bright room or on a projector; light mode holds.
- The screen-share tuning of these values is calculated from how video encoders round color, but hasn't been checked against a recorded screen share yet.
- Whether to make the screen and projector findings (2026-09-18) into rules: in video, brand color carries identity because the gray's purple tint doesn't survive a screen share; light mode is the safer default for presentations and projectors.
- **Code blocks.** The guideline [Sunken is never a ground](#guidelines-sunken-is-never-a-ground) allows `--surface-sunken` only for a recess sized to a control (a field, a toggle track, a badge), never as the background behind content. A code block is in between: a recess inside a card that holds content and can be large. Options: allow it as a named exception (a well inside a card), keep code on its parent level with a divider, or give code its own surface role. Nothing in v2 uses a code block yet; settle it when a page or component needs one.
