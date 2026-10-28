---
type: Color
title: Two-tone gradients
description: One gradient per palette hue, for icons, hover cards, and anything else that names a primary hue. The hue keeps its key and shades; a companion chosen for that hue passes through once.
status: working
tags: [color, graphics]
tokens: [--gradient-two-tone-red, --gradient-two-tone-amber, --gradient-two-tone-green, --gradient-two-tone-teal, --gradient-two-tone-blue, --gradient-two-tone-violet]
---

**What it is.** `--gradient-two-tone-<hue>` runs base, darker, companion, lighter, base. Name the primary hue and the companion comes with it. Each stop is its own token (`--gradient-two-tone-<hue>-base`, `-lighter`, `-companion`, `-darker`) for anything that draws the stops itself, such as an SVG gradient; the stops follow the color mode and any section mode.

**Steps by mode.** Dark: the hue's key, 600, the companion's key, 400. Light: the hue's key (500), 500, the companion's 400, 300. The pale stops widen the range so the motion reads on white. Set in `tools/palette/inputs.json` (`gradient.two_tone.steps`).

**Companions are set by hand.** The next hue around the wheel can read as a different color rather than a shift (amber to green does), so amber takes the gradient's gold instead. Each companion is set in `tools/palette/inputs.json` (`gradient.two_tone.companions`):

| Hue | Companion |
| --- | --- |
| red | amber |
| amber (gold) | gold (gradient stop) |
| green | lime (gradient stop) |
| teal | green |
| blue | violet |
| violet | red |

**A companion can be a gradient stop.** Written `gradient.<stop>` (`gradient.gold`, `gradient.lime`, `gradient.magenta` …), it takes that stop's value in each mode, with no step to choose: stops have no 50–950 series. Hues take the companion step above.

**In use.** Colored icons: the gradient moves inside the stroke from bottom left to top right, over 4× the icon's width (96 units, 4s per loop), so the whole band never sits inside the icon at once. Hover cards: a colorflow in the card's two-tone stops (*Hover cards*). Diagram lines don't use the companion: their pulse is the hue's highlight, which brightens the line instead of passing a second color through it (*Highlights*, `foundations/highlight.md`). See *Color moves* (`behaviors/color-moves.md`).

*Open:* violet's companion (red) hasn't been reviewed in use.

**Code.** Colored icons: `components/color-icon.css`, with `components/two-tone.js` (`twoTone()`) putting the moving gradients on the page once. Plain CSS and ES modules, no build step: load the v2 tokens first, then only the files a page uses; each script exports one function that takes a selector and is safe to call again. The markup to match is at the top of each CSS file (`components/README.md`).
