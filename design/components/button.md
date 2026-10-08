---
type: Component
title: Button
description: One solid button per group, carrying the label on the accent; every other button in the group has no outline.
status: exploring
tags: [interface]
tokens: [--accent-solid, --accent-hover, --accent-on, --accent-subtle, --text-headline]
---

**Anatomy.** A label, with an optional icon. A 1px transparent border holds every button to the same size, solid or not; it's the one legitimate transparent border.

**Variants.**
- **Solid**: `--accent-solid` fill with an `--accent-on` label. One per group.
- **Quiet**: no fill and no outline; the label in `--text-headline`. Every other button in the group.

**States.** Solid hover: `--accent-hover`. Quiet hover: a subtle wash of `--accent-subtle` behind the label, being tried now; as an accent role it follows the accent if that gets a color. Focus: a visible ring, style still to decide.

**Size.** At least 48px tall in the reviewed form lab, with `--border-radius-S` corners.
