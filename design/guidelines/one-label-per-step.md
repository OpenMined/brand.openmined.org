---
type: Guideline
title: One label color per step
description: A step takes the same label color in every hue. The key carries no text.
status: working
tags: [color]
tokens: [--on-solid]
---

**Rule.** Text on a fill takes one color per step, the same in every hue: ink on 100–300, white on 600–800. **No interface text on the key (500)**: it's for marks (chart series, dots, progress, underlines, rings). A fill that needs a label uses `solid`.

**Why.** The key keeps each hue's own lightness, so neither white nor ink reaches 4.5:1 on all of them. Picking the label per hue makes a row of badges mix dark and white text.

**Swatch readouts** (hex values printed on a color sample) follow one color per step too: ink from 50 to 400, white from 500 up. The new steps (50, 400, 900, 950) have no interface label rule yet.
