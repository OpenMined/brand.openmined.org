---
type: Guideline
title: One label color per step
description: A step takes the same label color in every hue.
status: working
tags: [color]
tokens: [--on-solid]
---

**Rule.** Text on a fill takes one color per step, the same in every hue: gray 950 on 100–300, white on 500–800 (the `--{hue}-on` role).

**Why.** Picking the label per hue makes a row of labeled fills mix dark and white text.

**Watch.** The key (500) keeps each hue's own lightness, so white doesn't reach 4.5:1 on all of them (3.8:1 on green and amber). The strong status chip uses it anyway; that contrast is accepted for chip labels (decision *Status chips: full pill, contrast accepted*).

**Swatch readouts** (hex values printed on a color sample) follow one color per step too: gray 800 from 50 to 400, gray 50 from 500 up. Steps 50, 400, 900, and 950 have no label rule yet.
