---
type: Guideline
title: Color fills use the key
description: A colored fill that carries a label (a button, a step marker, a strong status chip) uses the hue's key with a white label, --on-key.
status: working
tags: [color, interface]
tokens: [--accent-key, --green-key, --on-key]
---

**Rule.** When a fill is a hue rather than gray, fill it with the hue's `key` (500) and label it with `--on-key`, white. This covers colored buttons, step markers, and strong status chips. Gray fills, such as the primary button, use the accent's own roles (`--accent-solid`, `--accent-on`).

**Why.** The key is the hue at its purest: a deeper step reads washed out on a large area, and the same color in fills and graphics keeps the hue recognizable.

**Watch.** White on the key is under AA's 4.5:1 for normal text on teal (4.3:1), green and amber (3.8:1), accepted for chip and button labels (*White on every colored fill*).
