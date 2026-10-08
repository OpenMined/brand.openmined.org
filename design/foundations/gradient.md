---
type: Color
title: The brand gradient
description: Nine stops from gold to yellow, drawn from the palette itself, so every graphic built on it follows when the palette changes.
status: working
tags: [graphics]
tokens: [--gradient-spectrum, --gradient-gold, --gradient-orange, --gradient-red, --gradient-violet, --gradient-blue, --gradient-teal, --gradient-green, --gradient-lime, --gradient-yellow]
---

The gradient runs **gold, orange, red, violet, blue, teal, green, lime, yellow**, in that order, in every palette.

- **Family stops are hue keys.** Red, violet, blue, teal and green *are* `--{hue}-key`, so a palette change reaches the gradient with no second set of colors to keep in step.
- **Fitted stops have no family.** Gold, orange, lime and yellow have no interface job, so they exist only in the gradient. Each is fitted to the palette: its hue from the neighboring families, its strength from the palette's own, its lightness from the gradient's arc.
- **Both modes.** Every stop takes the mode's saturation offset, like the hues.

## What builds on it

The colorflow (`<om-stream>`), the gradient map (`<om-mesh>`) and the diamond (`<om-diamond>`) are drawn in the gradient. On this site they show the v2 colors: each page passes them in through the embed's `colors` attribute, read live from the gradient tokens, so they follow the mode. Used on their own, without `colors`, they fall back to their built-in colors, which are still v1 (`public/embeds/brand-colors.js`) until the embeds are re-tuned.

## Open

- The site's current gradient image has a deep magenta that no palette reaches; the gradient map approximates it.
- How the gradient is applied in graphics (halos, glows, dark stages, bands) belongs to graphics styles, a later push.
