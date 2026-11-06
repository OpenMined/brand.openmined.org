---
type: Guideline
title: Text stays inside its box
description: "Every box with text in it grows or wraps to fit the text, at the narrowest width it will be seen and with the longest real string. Never a fixed height on text."
status: released
tags: [layout, typography]
---

**Rule.** Text never spills out of the element that holds it: a card, a chip, a table cell, a diagram node, a button. Build every text container so it can't, then check it with the longest real string at the narrowest width it will be seen.

**How.**
- **No fixed heights on anything holding text.** Use `min-block-size` if a minimum is needed; let the box grow.
- **Flex and grid children shrink:** give a text child `min-width: 0` (the components' cards and grids do), or long words push the row wider than its container.
- **Long words wrap:** `overflow-wrap: anywhere` on names, URLs, IDs and tokens that have no spaces.
- **One-line labels** that must stay on one line (a chip, a tab) truncate with `text-overflow: ellipsis` and carry the full text in `title` or nearby, rather than overflowing.
- **SVG text doesn't wrap:** break lines by hand and measure in the browser (`diagrams()` in `components/diagram.js` checks it for a diagram's nodes).

**Check.** Before calling a layout done: resize to the narrowest width (320px for a page), swap in the longest label the data allows, and look at every box with text. In a generated layout, this is the check to run before handing it over.
