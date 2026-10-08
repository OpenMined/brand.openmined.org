---
type: Guideline
title: Keep shadow blur at 16px or less
description: The outermost blur sets the widest visible band in a shadow. Past 16px, the bands show as steps on screen.
status: working
tags: [surfaces]
tokens: [--shadow-raise-1, --shadow-raise-2]
---

**Rule.** No shadow layer blurs more than 16px.

**Why.** A blurred shadow fades in small steps of color. The widest of those steps is set by the outermost layer's blur, and by nothing else: changing alpha, ink or the number of layers doesn't narrow it. Past about 16px the widest step exceeds roughly 4 CSS pixels and shows as visible banding, especially in dark mode.

**Check.** Judge from a screenshot of the shadow on its own ground, not by eye: no band wider than about 4px.
