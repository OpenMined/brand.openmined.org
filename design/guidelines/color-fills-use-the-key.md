---
type: Guideline
title: Color fills use the key
description: A colored fill that carries a label (a button, a step marker, a strong status chip) uses the hue's key with a white label, not its solid step.
status: working
tags: [color, interface]
tokens: [--accent-key, --green-key]
---

**Rule.** When a fill is a hue rather than gray, fill it with the hue's `key` (500) and label it in white, as the strong status chips do. This covers colored buttons, step markers, and strong status chips. The `solid` role stays for gray fills (`--accent-solid`).

**Why.** On a large area, `solid` (600 in light mode) reads washed out next to the key; the key keeps the hue's own character.

**Watch.** White on the key is under AA's 4.5:1 for some hues (teal 4.32, green and amber 3.8). Accepted for status chip labels (decision *Status chips: full pill, contrast accepted*); check any other text on a key fill.
