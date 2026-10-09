---
type: Guideline
title: Partner marks are used as supplied
description: Other companies' logos are their trademarks. Use the official file, never recolor or redraw it, and never imply endorsement.
status: working
tags: [graphics, icons]
---

**Rule.** A partner or tool logo comes from `public/logos/partners/` and is used as its owner supplies it. OpenMined's colors don't apply: never recolor, restyle or redraw a mark, and never imply an endorsement or partnership that doesn't exist.

**One color by default.** Show partner marks in one color, the color of the text around them, as the live site does: every brand's `icon.svg` is a one-color glyph (`currentColor`). Use `icon-color.svg`, the official color, where a layout calls for color. `logo*.svg` are wordmark lockups where officially available. *Open:* confirm, owner by owner, that each allows a one-color version of its mark; `partners.json` doesn't record that yet. `partners.json` records each mark's owner, source, variants and known gaps.

**Why.** The marks are trademarks, used to name the product (nominative use). Some owners restrict how their mark appears; Google's four-color G, for example, stays as it is.

**Inline.** Next to text, a partner mark follows the icon sizes and alignment, and in one color it takes the text color like an icon. It never takes our icon style: the mark's own drawing stays as supplied.
