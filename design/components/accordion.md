---
type: Component
title: Accordions
description: "A question that opens to its answer; stack several for an FAQ. Built on the browser's own disclosure, divided by lines, no boxes."
status: released
tags: [interface]
tokens: [--line, --stroke-sm, --surface-sunken, --text-headline, --font-size-md, --line-focus]
---

**Anatomy.** A summary line (the question, Inter 500 at body size in the headline color, and a 20px down arrow) over its answer. Items are divided by the lighter line (`--line`), with a line above the first. No card or box around each item (*Outlines are lines*).

**Behavior.** The summary is a gray item: the sunken wash on hover; keyboard focus draws the focus line. The arrow turns half a turn when open. Built on `<details>`, so it works without a script and the answer stays in the page for search and assistive tech.

**When.** FAQs, optional detail, long lists where most readers need one item. Not for content everyone needs: show it.

**Code.** `components/accordion.css`. No script.
