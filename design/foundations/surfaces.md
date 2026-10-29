---
type: Elevation
title: Surfaces
description: Four surface levels, each with its own shadow. One below the page, the page, and two above.
status: released
tags: [surfaces]
tokens: [--surface-sunken, --surface-base, --surface-raise-1, --surface-raise-2, --shadow-sunken, --shadow-raise-1, --shadow-raise-2]
---

Every element sits on one of four levels. Each level is a gray step and a shadow, defined for light and dark. Pick the level by what the element *is*, never by the shade you want.

| Level | Token | What it's for |
| --- | --- | --- |
| −1 | `--surface-sunken` | A recess inside a surface, sized to a control: fields, toggle and progress tracks, and hover washes. |
| 0 | `--surface-base` | The page. Every section sits on it. |
| +1 | `--surface-raise-1` | A card or panel on the page. |
| +2 | `--surface-raise-2` | One level higher: a card inside a panel, menus, popovers. |

## How the levels behave

- **Each level gets lighter as it rises, in both modes.** In dark mode, cards are lighter than the page, not darker.
- **Shadows belong to the levels.** `raise-1` and `raise-2` cast their own shadow, `sunken` takes an inset one (a control you operate casts it at rest, a field only on focus; see *Form controls*), and `base` casts nothing: an element sitting on the page is not above anything.
- **Light mode has four levels at most.** White is the light `raise-2`, so there is no lighter surface above it. A modal or overlay has to be shown some other way than a fifth surface.
- **Elements opt in to a level.** Nothing gets a surface just by being a `section` or a `div`.
- **Cards that move on hover sit on the page.** A link card or hover card rises from `raise-1` to `raise-2`, so it never sits inside a raised panel, where there's no level left to rise to.
- **Code blocks aren't a level.** A block of code is always dark, in both modes (*Typography*), so it never uses `--surface-sunken`.

## Open

- Dark mode's separation between levels fades in a bright room or on a projector; light mode holds.
- The levels are tuned for how video encoders round color, but not yet checked against a recorded screen share.
- Whether two screen-share findings become rules: in video, brand color carries identity, because the gray's purple tint doesn't survive; and light mode is the safer default for presentations and projectors.
