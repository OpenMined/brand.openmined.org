---
type: Color
title: Two-tone gradients
description: One gradient per palette hue, for icons and anything else that names a primary hue. The hue keeps its key and shades; a companion chosen for that hue passes through once.
status: exploring
tags: [color, graphics]
tokens: [--gradient-two-tone-red, --gradient-two-tone-amber, --gradient-two-tone-green, --gradient-two-tone-teal, --gradient-two-tone-blue, --gradient-two-tone-violet]
---

**What it is.** `--gradient-two-tone-<hue>` runs the hue's key, its 400, the companion's key, its 600, and its key again. Name the primary hue and the companion comes with it.

**Companions are chosen, not computed.** The next hue around the wheel isn't always a hue shift: gold to green read as a big color change (Kyle and Bennett, 2026-10-12), so gold takes red. Each companion is set by hand in `tools/palette/inputs.json` (`gradient.two_tone.companions`):

| Hue | Companion |
| --- | --- |
| red | amber |
| amber (gold) | red |
| green | teal |
| teal | blue |
| blue | violet |
| violet | red |

Teal's and violet's companions are first guesses, not yet seen in use.

**In use.** Colored icons (the motion round's option E, the page reviews): the gradient moves inside the stroke from bottom left to top right, over 3× the icon's width, so the whole band never sits inside the icon at once. See *Color moves* (`behaviors/color-moves.md`).
