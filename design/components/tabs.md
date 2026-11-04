---
type: Component
title: Tabs
description: "A row of tabs over panels, one panel at a time, as on openmined.org: the group a raised card, the tabs a segmented control recessed into it, the selected tab filled with the strong gray."
status: released
tags: [interface]
tokens: [--surface-raise-1, --shadow-raise-1, --surface-sunken, --shadow-sunken, --emphasis, --on-emphasis, --text-headline, --font-size-md, --radius-lg, --radius-md, --radius-sm, --line-focus]
---

**Anatomy.** As on openmined.org, in its card form. The whole group is a card on the first raised level (`--surface-raise-1` and its shadow, the large corner, 24px inside), so the tabs and their panel read as one thing. The row of tabs is a segmented control recessed into the card (`--surface-sunken` and its inset shadow, the medium corner), as a field or a toggle is (*Recessed controls prefer a raised surface*), and sized like one: the row is a field's height, and each tab sits 3px inside it, the inset every recessed control uses (*Form controls*, Geometry). Each tab is a label at body size, 500, 24px from each side. The selected tab fills with the strong gray (`--emphasis`, its label in `--on-emphasis`), as a checked control does; the others are text in the headline color and take a faded fill of the strong gray on hover (`--emphasis` at 10%), a preview of being selected. Keyboard focus draws the focus line. 24px between the row and the panel. Being a card, it sits on the page, not inside another card.

**When.** Two to five views of the same thing a reader picks between ("For researchers" / "For data owners"), or sections of a dashboard. Not for navigating between pages: that's a nav.

**Behavior.** `tabs.js` shows the selected panel and hides the rest, and wires the arrow keys (left, right, Home, End) and the ARIA roles. Without the script every panel shows, one after another, so nothing is lost.

**Code.** `components/tabs.css` and `tabs.js` (`tabs()`, every `[data-tabs]`; safe to call again).
