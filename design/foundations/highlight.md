---
type: Color
title: Highlights
description: One highlight per palette hue, for the brighter part of a moving line in that hue. It reads as the same line lit up, not a second color.
status: working
tags: [color, graphics]
tokens: [--gradient-highlight-red, --gradient-highlight-amber, --gradient-highlight-green, --gradient-highlight-teal, --gradient-highlight-blue, --gradient-highlight-violet]
---

**What it is.** `--gradient-highlight-<hue>` is a single color: the lit-up part of a line, ring or other mark drawn in that hue as color moves along it. It follows the color mode and any section mode.

**Lighter than its hue.** A highlight should read as more light and energy in the same line, so each is chosen to be lighter than its hue in both modes: one step toward yellow on the wheel, the way red brightens to amber and teal to green. Violet is the exception: it warms to the gradient's magenta, about as light as violet itself, so its pulse reads as warmth more than light. A highlight that turns away from yellow reads as a second color: on the diagrams, violet's red and blue's violet did (Kyle, 2026-10-27). The choice is made by hand and reviewed before it's published, in `tools/palette/inputs.json` (`gradient.highlight.colors`):

| Hue | Highlight |
| --- | --- |
| red | amber |
| amber (gold) | gold (gradient stop) |
| green | lime (gradient stop) |
| teal | green |
| blue | teal |
| violet | magenta (gradient stop) |

**Not the two-tone companion.** A companion passes a second color through an icon or a card (*Two-tone gradients*), so a real change of hue is welcome there; blue's is violet. A highlight never changes the line's color, only brightens it. The two sets agree where one color does both jobs (red, amber, green, teal) and are set separately so each can change on its own.

**Steps by mode.** A hue highlight takes the hue's 400 in light and its key in dark, the same steps as a two-tone companion (`gradient.highlight.steps`). A highlight can also name a step of its own (`violet.300`), the same in both modes. A gradient-stop highlight (`gradient.<stop>`) takes that stop's value in each mode.

**In use.** Diagram lines (direction A): the pulse along a colored line is its highlight alone, over the line at 0.8 at its center and fading in a bell to nothing at its ends. Where a line drains to gray, its highlight turns gray with it. Diagram rings (Fig 2's cascade) brighten in their highlight (`src/scripts/line-flow.ts`, `--flow-tone`). See *Color moves* (`behaviors/color-moves.md`).

**Watch for.** Where hue tells groups apart, a highlight that is a neighbor group's own hue can briefly read as that group (a violet line pulsing blue beside Fig 1's blue group). It's a flourish, so *Violet and blue never tell things apart* doesn't apply, but check it on the figure.
