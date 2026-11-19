---
type: Decision
title: "Button hover's color is sized to the button"
description: "The hover's loop is measured in percentages of the button, drawn for a 200px one, so every button shows the span of hue keys a typical button does, not two or three times as many on a wide one."
status: released
date: 2026-11-19
tags: [interface]
tokens: [--gradient-interactive, --green-key, --teal-key, --blue-key, --violet-key, --red-key, --amber-key]
---

**Context.** The hover's color was a fixed loop, 1200px long, a hue key every 200px. A button about 200px wide, which most are, showed one hue blending into the next; a 408px button (two side by side in a half-width column, on openmined.org's restyle) showed three or four, which read as a different, busier effect.

**Decision.** Design lead, 2026-11-19.
- **Sized to the button.** The color strip is 1350% of the button's width at 9 : 1, its hue keys and its slide percentages of the strip, so every button shows the span a 200px button does and the colors cross it at the same pace relative to its width (still 30s a loop). A 200px button is unchanged.
- **Small buttons scale too.** A 95px button shows the same span as a 200px one, not today's narrower slice.
- **The shimmer stays fixed** (240px and 180px stripes).

**Alternatives.** One fixed loop for every button: wide buttons stay busier than the rest. Scaling only buttons wider than 200px (`max(1350%, 2700px)`): small buttons keep a narrower slice of the loop than the others.

**Consequences.** `button-hover.css` only, in CSS, with no script and nothing to recompute when a button's width changes. No class or token renamed.

**Revisit when.** A wide button shows the shimmer's stripes as too dense next to its color.
