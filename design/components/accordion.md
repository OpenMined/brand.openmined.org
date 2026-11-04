---
type: Component
title: Accordions
description: "A question that opens to its answer; stack several for an FAQ. Each item a card on the first raised level, with a round control that fills when open, as on openmined.org."
status: released
tags: [interface]
tokens: [--surface-raise-1, --shadow-raise-1, --radius-lg, --surface-sunken, --shadow-sunken, --emphasis, --on-emphasis, --text-body, --text-headline, --line, --line-focus, --font-size-md]
---

**Anatomy.** Each item is a card on the first raised level (`--surface-raise-1`, its shadow, the large corner), 20px from the next, with 32px of padding and 40px on the left. The summary holds the question, in body text, and a 32px round control with a 16px down arrow. The answer starts 8px below the question and takes any content, spaced 16px apart like a stack.

**Behavior.** The round control works like the other controls: closed, it is a recess (the sunken surface and its inset shadow, the arrow in the headline color); open, it fills with the strong gray (`--emphasis`, the arrow in `--on-emphasis`) and turns half a turn. On hover the recess takes the controls' 1px outline; keyboard focus draws the focus line around the question. Built on `<details>`, so it works without a script and the answer stays in the page for search and assistive tech.

**When.** FAQs, optional detail, long lists where most readers need one item. Not for content everyone needs: show it.

**Code.** `components/accordion.css`. No script.
