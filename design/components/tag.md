---
type: Component
title: Tags
description: "A short neutral label: a category, a topic, a type. A line, not a container. For a status, use a status chip."
status: released
tags: [interface]
tokens: [--line, --stroke-sm, --radius-sm, --font-size-xs, --text-body, --text-headline, --accent-key]
---

**Anatomy.** A word or two in small text (12px, 500) inside a 1px line in the lighter line color (`--line`), the small corner. No fill: it sits on whatever surface it's on (*Outlines are lines*).

**When.** Categories on a post, topics on a resource, a type in a list. A tag says what a thing is; a status chip says what state it's in, in the status's color. Keep tags gray.

**As a link.** A tag that links (a category page) takes the headline color for its text, and on hover its line takes the accent's green, as content links do. Keyboard focus draws the focus line.

**Code.** `components/tag.css`. No script.
