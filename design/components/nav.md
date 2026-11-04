---
type: Component
title: Nav
description: "A row of places or views, one of them current, at three levels: quiet (a line under the current item, the default), wash (the current item darkens the surface) and strong (the current item fills with the strong gray)."
status: released
tags: [interface]
tokens: [--text-headline, --text-muted, --line-strong, --stroke-sm, --black, --state-current-wash, --state-hover-wash, --emphasis, --on-emphasis, --font-size-sm, --radius-md, --line-focus]
---

**Anatomy.** A horizontal row of items, labels in the headline color at small size, 500, with an optional count in the muted color. One item is current. Three levels, the same markup, a modifier on the row:
- **Quiet** (`.nav`, the default): plain text, the nav link's line under the current item. On hover and keyboard focus the line draws in from the left and leaves to the right, as on a nav link (*Links*).
- **Wash** (`.nav--wash`): the current item darkens the surface under it (black mixed in, `--state-current-wash`), a soft chip in either mode; hover darkens about half as much (`--state-hover-wash`), so hover and current differ.
- **Strong** (`.nav--strong`): the current item fills with the strong gray (`--emphasis`, its label in `--on-emphasis`), as a selected tab or a checked control does; hover is a faded fill of it (`--emphasis` at 10%), a preview of being current.

**When.** Moving between places, or between views of the same data. Pick the level by how much the nav should carry:
- **Quiet:** a site's header (as openmined.org's), secondary navigation, a list of a page's sections. Where navigation should step back.
- **Wash:** a menu inside an app, a level below its main navigation; menus in layers.
- **Strong:** an app's main sections, and view filters above data (*All / Needs attention*), where seeing what's current matters most.

Not tabs: tabs switch between panels of different content in one place. A filter over one table, or a menu, is a nav.

**Markup.** Between pages, links in a `<nav>` with `aria-current="page"` on the current one. Views of one page (a filter), buttons in a `role="group"` with `aria-pressed`; the page shows or hides what each view covers. One current item per nav.

**Placement.** No divider line directly under a nav: it competes with the quiet level's line, and a row of places doesn't need a rule to sit on. Space separates it from what follows.

*Open:* a vertical (sidebar) nav, and how a row behaves when it runs out of width on narrow screens. Whether this site's own header moves to one of these levels.

**Code.** `components/nav.css`. No script.
