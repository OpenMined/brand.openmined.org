---
type: Decision
title: "Color lines start from the same place"
description: "A flowing color line (the content link's and the text button's hover line) starts from green on every hover, instead of resuming where the last hover left it."
status: released
date: 2026-11-02
tags: [interface]
---

**Context.** The hover line's colors flowed as an animation that paused when the pointer left and resumed on the next hover, so each hover showed whatever hues the last one stopped on. The same link looked different from one hover to the next, and links side by side showed unrelated colors.

**Decision.** Design lead, 2026-11-02. **Every hover starts the flow from green**, the start of the spectrum, on every element with a flowing color line: the content link and the text button (`link-flow.css`). When the pointer leaves, the colors hold while the line slides away, then reset. Plain CSS, no script: the color shift runs as a transition that resets once the line is gone. A hover longer than 150 seconds stops flowing, on the start color. The button's hover fill isn't a line and keeps its own timing (*Button hover runs the hue keys from the clock*).

**Alternatives.** Resume where it stopped: the old behavior. A script to restart the animation: works, but the line works without one today.
