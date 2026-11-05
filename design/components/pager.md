---
type: Component
title: Pager
description: "Moves between the pages of a long list or table: Previous, the page numbers, Next. A nav at the wash level: the current page darkens the surface under it."
status: released
tags: [interface]
tokens: [--text-headline, --text-muted, --black, --state-current-wash, --state-hover-wash, --font-size-sm, --radius-md]
---

**Anatomy.** One row, a nav at the wash level (*Nav*): Previous, the page numbers, Next, side by side; the steps sit next to the numbers, not at the row's ends. The row is centered under what it pages by default; it may align to the start or end where a layout needs (under a left-aligned list, in a toolbar). Each is a quiet item, small text at 500, no border; the current page takes the wash (`--state-current-wash`), hover about half (`--state-hover-wash`). Previous and Next carry the 16px arrows `nav-arrow-left` and `nav-arrow-right`. Numbers use tabular figures.

**Which numbers.** The first page, the last, and the current one with a neighbor on each side; a gap (…) stands for the pages between. Up to seven pages, show them all.

**At the ends.** On the first page Previous stays in place, muted and not a link; on the last, Next. The numbers don't shift as you page.

**When.** A list or table too long for one page, where people go to a place in it (page 4 of 12). Not for a feed people read down (load more as they go), or a table short enough to show whole. A range line ("11–20 of 47") beside it is the page's own text.

**Markup.** A `<nav>` labeled for what it pages, links with `aria-current="page"` on the current one and `rel="prev"`/`rel="next"` on the steps. A table that pages in place uses buttons, with `aria-current` moved by the page's script. A step that can't go anywhere is a `<span>` with `aria-disabled="true"`.

*Open:* how the row behaves on narrow screens (the words Previous and Next may drop to their arrows); a page-size choice.

**Code.** `components/pager.css`, with `components/nav.css`. No script.
