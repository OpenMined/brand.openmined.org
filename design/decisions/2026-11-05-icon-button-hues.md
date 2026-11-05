---
type: Decision
title: "An icon button hovers in a hue chosen for it, with a glow"
description: "On hover and focus an icon-only button's icon takes a hue chosen per icon, moving in its stroke with a soft glow behind, as a hover card's icon does. Green without a choice; no hue rules yet."
status: released
date: 2026-11-05
tags: [interface]
tokens: [--accent-key, --red-key, --blue-key]
---

**Context.** Icon-only buttons (menu, search, close) took green's two-tone on hover, the same for every icon and with no glow, while a hover card's icon takes its own hue and glows. The Icons page showed it, but how an icon on its own should hover hadn't been decided.

**Decision.** Design lead, 2026-11-05.
- **The icon takes a hue chosen for it**, set on the button as a hover card's icon is: `--ci-key` (the minimal layer's still color) and `--ci-stroke` (the full layer's moving two-tone). Close red and search blue are the first.
- **Full layer:** the two-tone moves in the stroke with a blurred copy behind as its glow (6px, 0.25 in light, 0.4 in dark), the same as a hover card's icon. **Minimal layer:** the hue's key, still.
- **Without a choice, green**, the accent.
- **No rules yet** tying hues to meanings: each is chosen per icon, on purpose.

**Alternatives.** No hover color until a hue is set: every existing icon button would lose its hover. Hues tied to roles (red removes, blue finds): left until more icons need one.

**Revisit when.** Enough icons carry hues to see a pattern worth a rule, or a red icon is read as a danger it isn't.
