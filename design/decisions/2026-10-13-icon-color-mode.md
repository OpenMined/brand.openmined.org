---
type: Decision
title: "Icons have a color mode"
description: "Icons are mono by default. Where a design calls for color, an icon takes its hue's two-tone gradient, moving, with a soft glow; in a hover card, only on hover."
status: working
date: 2026-10-13
tags: [icons, color]
tokens: [--gradient-two-tone-green, --gradient-two-tone-amber, --gradient-two-tone-red, --gradient-two-tone-blue]
---

**Context.** *Status icons take their status color* kept every other icon in the text's color, with no gradients or hue keys. *If color, then motion* (2026-10-12) and the motion round tried icons in color: the two-tone gradient moving in the stroke (option E) was chosen in review, and the hue's companion was made a token per hue (*Two-tone gradients*).

**Decision.** Two icon modes (brand owner and design lead, 2026-10-12; working favorite 2026-10-13). **Mono**, the default: the text's color. **Color**, chosen per design: the icon's hue's two-tone gradient (`--gradient-two-tone-<hue>`) moves inside the stroke, bottom left to top right, with one blurred copy behind as its glow (6px; 0.15 light, 0.4 dark). In a hover card the icon is mono at rest and takes its color only on hover. Status icons keep their status colors and don't move.

**Alternatives.** Mono only (the earlier rule). Filled, glowing marks like the /research diamonds, kept for small graphics rather than icons.

**Consequences.** The icon guideline now names the color mode as the exception alongside status icons. Which elements take color is a design call for now; no blanket rule yet (*Color moves*).
