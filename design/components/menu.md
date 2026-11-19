---
type: Component
title: Menus
description: "A list that opens from a nav item, in two kinds: navigate (links to places, the current one marked) and pick one (sets a value, the chosen one checked and shown in the item that opens it)."
status: released
tags: [interface]
tokens: [--surface-raise-2, --shadow-raise-2, --gray-950, --state-hover-wash, --state-current-wash, --duration-fast, --radius-lg]
---

**When.** Moving between a section's places (a dashboard's sites, from the page title), and setting one value from a few (a goal's status). Not for actions on a selection, and not a select in a form.

**Anatomy.** On raise-2 with its shadow, the large corner, 8px inside; 16rem to 22rem wide, never wider than the window less 32px; 70% of the window tall at most, then it scrolls. An optional head, group labels and foot, small and muted. Items in the headline color at small size, 500, with an optional detail line; a check on the current or chosen one.

**Opening.** From a nav item (an app bar's or a site's nav), with `popovertarget`: the browser opens and closes it (Escape, a click outside), with or without the script. A chevron in the item turns while it's open.

**Placement.** Over everything, below its item and aligned to its start, flipping to fit the window and following it on scroll (`anchor.js`, as the tooltip). Without the script it opens at the window's corner.

**States.** Items take the wash level's states in gray 950, as a table's rows: a faint wash on hover, a stronger one on the current or chosen item (*Interaction states*).

**Navigate.** Links; the current place has `aria-current="page"`.

**Pick one.** `role="menu"` on the menu, each item a `menuitemradio` button with a value, a status dot before its name where it sets a status. The item that opens it shows the current value (`.menu__current`, its dot and name), filled by the script and updated on a pick. It holds every option stacked, showing only the current one, so it's as wide as the longest and a pick never moves the item, its nav or its table column; screen readers hear only the current one. A pick checks the item, closes the menu, returns focus and sends a `menupick` event with its value. Busy and error lines are page content inside the menu.

**Keyboard.** Arrow down on the item opens it; focus goes to the current or chosen item; the arrows, Home and End move; Tab closes it.

**Motion.** Fades in rising 8px in `--duration-fast`, as the tooltip; the minimal layer and reduced motion fade only.

**Code.** `components/menu.css`, `menu.js` (`menus()`) with `anchor.js` beside it.

*Open:*
- **As a select** (choosing a value in a form or a row): showing the selection is done; still to settle are an empty state ("Choose…"), a label for the item when the column or field doesn't give one, a pick that waits on the page (busy, error, and whether the menu closes before it's done), and whether a native `<select>` is the better choice in a form.
- A check with a screen reader (the navigate kind isn't `role="menu"`; pick one is).
