---
type: Guideline
title: Status icons take their status color
description: Icons are one color, the color of the text around them. Only status icons take a color, through the status roles.
status: exploring
tags: [icons]
tokens: [--success-fg, --danger-fg, --warning-fg, --info-fg]
---

**Rule.** An icon is drawn in `currentColor`. The only icons that take a color of their own are status icons: check in `--success-fg`, X in `--danger-fg`, warning in `--warning-fg`, info in `--info-fg`.

**Why.** Color on an icon has to mean something. Keeping every other icon in the text's color leaves color free to signal status, and the `fg` roles hold contrast on every surface in both modes.

**Don't.** Color an icon for decoration, give it a gradient, or use a hue key on it: keys are for marks in graphics, not for interface icons.
