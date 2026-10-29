---
type: Guideline
title: "Icons are mono unless they're status or in color"
description: "Icons are one color, the color of the text around them. Status icons take their status color; an icon in color takes its hue's two-tone gradient, moving."
status: released
tags: [icons]
tokens: [--success-fg, --danger-fg, --warning-fg, --info-fg, --gradient-two-tone-green]
---

**Rule.** An icon is drawn in `currentColor`. Two exceptions. Status icons take their status color: check in `--success-fg`, X in `--danger-fg`, warning in `--warning-fg`, info in `--info-fg`. An icon **in color** takes its hue's two-tone gradient (`--gradient-two-tone-<hue>`), moving, with a soft glow, where a design calls for it, or on hover in a hover card (decision *Icons have a color mode*).

**Why.** Color on an icon has to mean something or move (*If color, then motion*). Keeping icons mono by default leaves color free to signal status, and the `fg` roles hold contrast on every surface in both modes.

**Don't.** Give an icon a static color for decoration, or a hue key: a colored icon is either a status or in color, and an icon in color always moves.
