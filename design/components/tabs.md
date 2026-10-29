---
type: Component
title: Tabs
description: "A row of tabs over panels, one panel at a time. Tabs are gray items: the sunken wash on hover, and the selected tab keeps it."
status: released
tags: [interface]
tokens: [--surface-sunken, --text-muted, --text-headline, --font-size-sm, --radius-md, --line-focus]
---

**Anatomy.** A row of tab labels (14px, 500) above their panels. Tabs have no line or fill of their own, so they follow the wash rule (*Interaction states*): in the muted color at rest; on hover the sunken wash and the headline color; the selected tab keeps both. Keyboard focus draws the focus line. No underline bar, no box around the row.

**When.** Two to five views of the same thing a reader picks between ("For researchers" / "For data owners"), or sections of a dashboard. Not for navigating between pages: that's a nav.

**Behavior.** `tabs.js` shows the selected panel and hides the rest, and wires the arrow keys (left, right, Home, End) and the ARIA roles. Without the script every panel shows, one after another, so nothing is lost.

**Code.** `components/tabs.css` and `tabs.js` (`tabs()`, every `[data-tabs]`; safe to call again).
