---
type: Component
title: Code blocks
description: "A block of code is always dark, in both modes, with a copy button. Inline code sits on a tint of the same dark."
status: released
tags: [interface]
tokens: [--gray-950, --gray-50, --gray-300, --green-300, --radius-sm]
---

**Anatomy.** The block itself is type's `pre`: gray 950 with gray 50 text in the mono family, in both modes (*Typography*). It is never a surface level (*Surfaces*: code blocks aren't a level). The copy button sits top right inside it, as on openmined.org: a 16px copy icon in gray 300 on a faint wash of gray 50 (8%, its edge 12%); on hover the wash doubles and the icon turns gray 50. After a click the icon becomes a check in green 300 for two seconds. Screen readers hear "Copy code", then "Copied".

**Code.** `components/type.css` (the block) and `code-copy.css` + `code-copy.js` (`codeCopy()`, every `pre.code-block`; safe to call again).
