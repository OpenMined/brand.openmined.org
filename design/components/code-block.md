---
type: Component
title: Code blocks
description: "A block of code is always dark, in both modes, with a copy button. Inline code sits on a tint of the same dark."
status: released
tags: [interface]
tokens: [--gray-950, --gray-50, --gray-400, --font-size-xs]
---

**Anatomy.** The block itself is type's `pre`: gray 950 with gray 50 text in the mono family, in both modes (*Typography*). It is never a surface level (*Surfaces*: code blocks aren't a level). The copy button sits top right inside it: an icon and "Copy" in small gray 400 text, gray 50 on hover, "Copied" for two seconds after a click.

**Code.** `components/type.css` (the block) and `code-copy.css` + `code-copy.js` (`codeCopy()`, every `pre.code-block`; safe to call again).
