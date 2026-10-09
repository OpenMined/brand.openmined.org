---
type: Shape
title: Corners
description: Four corner radii, biased sharp. Six pixels is the default; a larger corner only on the outer of two nested shapes.
status: exploring
tags: [surfaces]
tokens: [--radius-sm, --radius-md, --radius-lg, --radius-full]
---

OpenMined's corners are intentionally less rounded than the soft, generic corners common in AI-generated layouts. The ladder is short so that every corner on a page comes from one of four values.

| Token | Value | Use it for |
| --- | --- | --- |
| `--radius-sm` | 4px | Marks too small for the default: checkboxes, swatch chips, a file input's button. |
| `--radius-md` | 6px | The default. Buttons, fields, tiles, and any card that holds no rounded shapes. |
| `--radius-lg` | 10px | The outer of two nested shapes: a panel that holds fields, tiles or cards. |
| `--radius-full` | fully round | Toggles, pills, dots. |

**Nesting.** When a rounded shape sits inside another, the outer one takes `--radius-lg` and the inner one `--radius-md`. A single level of nesting is the limit the ladder covers. Deeper nesting is a sign the layout has too many boxes.

**Every level takes the same corner.** A sunken recess has the same corner as the raised tile beside it. A corner too small to read as either sharp or round (2–3px on a large shape) is avoided.

*Open:*
- The `--radius-lg` value (10px) is a first pick between 8 and 12.
- Whether status chips stay pill-shaped (`--radius-full`) or take `--radius-sm`. This is compared in the status round.
- Corners in infographics and diagrams, where boxes nest more deeply. This is part of the infographics round.
