---
type: Decision
title: The gradient draws from the palette
description: Every gradient stop with a hue family is that family's key; only the family-less stops are fitted.
status: working
date: 2026-09-25
tags: [graphics]
---

**Context.** The gradient first kept nine stops of its own. Color explorations then had to reach graphics too, and the family stops were already palette steps under another name.

**Decision.** Every family stop is its hue's key. Gold, orange, lime and yellow are fitted to the selected palette (hue from neighbors, strength from the palette's register, lightness from the arc). The colorflow and gradient map inherit it. This supersedes "the gradient keeps its own nine stops" (2026-09-23).

**Consequences.** A palette change reaches every gradient-based graphic. The pale ends of the gradient vanish on a light ground, so diagrams that walk the gradient use only the family stops (red to green), in both modes.
