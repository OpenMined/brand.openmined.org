---
type: Component
title: Menu
description: "A list that opens from a button: navigate (links to places, the current one marked) or pick one (sets a value, the chosen one checked). Placed to fit the window."
status: draft
from: "Issue #54 (the reporting dashboard's site switcher) and its Goals page (status menu), 2026-11-09"
waiting:
  - "The two kinds in one component, or two"
  - "A check with a screen reader (the navigate kind isn't role=\"menu\"; pick one is)"
tokens: [--surface-raise-2, --shadow-raise-2, --gray-950, --state-hover-wash, --state-current-wash, --duration-fast, --radius-lg]
---

**For.** Moving between a section's places (the dashboard's sites, from the page title) and setting one value from a few (a goal's status). Not for actions on a selection, and not a select in a form.

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only. Items wash in gray 950, as table rows do, not black. |
| Color modes | Role tokens; the washes are percentages that differ per mode. |
| Opening | From a nav item (the context it lives in: an app bar's or a site's nav), with `popovertarget`: the browser opens and closes it (Escape, a click outside), with or without the script. A chevron turns while it's open. |
| Current value | A pick-one menu's item shows the current value (`.menu__current`: the checked item's dot and name), filled by the script and updated on a pick. It holds every option stacked, showing only the current one, so it's as wide as the longest and a pick never moves the item, its nav or its table column. Screen readers hear only the current one. |
| Placement | `anchor.js` (as the tooltip): over everything, below the button and start-aligned, flipping to fit, following on scroll. Without the script it opens at the window's corner. |
| Keyboard | Arrow down on the button opens it; focus goes to the current or checked item; arrows, Home and End move; Tab closes it. |
| Pick one | `role="menu"`, items `role="menuitemradio"`; a click checks it, closes, and sends `menupick`. Busy and error lines are page content inside the menu. |
| Motion | Fades in rising 8px in `--duration-fast`, as the tooltip; minimal and reduced motion fade only. |
| Interaction states | Its items are the wash level's states (hover, current), which settles that *Open:* in *Interaction states*. |

*Open:*
- **As a select** (choosing a value, in a form or a row): showing the selection is done; still to settle are an empty state ("Choose…"), a label for the item when the column or field doesn't give one, a pick that waits on the page (busy, error), and whether a native `<select>` is the better choice in a form.
- One component or two. They share the panel, the items and the placement; they differ in role and what a click does.
- Whether a pick waits for the page (busy) before the menu closes.
