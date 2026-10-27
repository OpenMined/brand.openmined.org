---
type: Component
title: Button
description: One solid button per group, carrying the label on the accent; every other button in the group is secondary, an outline with no fill.
status: exploring
tags: [interface]
tokens: [--accent-solid, --accent-on, --accent-key, --text-headline, --line-strong, --stroke-sm]
---

**Anatomy.** A label, with an optional icon.

**Variants.**
- **Solid**: `--accent-solid` fill with an `--accent-on` label. One per group.
- **Secondary**: a `--stroke-sm` outline in `--line-strong` (the line style, the same gray step as `--text-body`), no fill, the label in `--text-headline`. Every other button in the group (decision 2026-10-12).

**States.** Both stay grayscale at rest. On hover or keyboard focus both fill with the accent in motion (decision *Button hover runs the hue keys from the clock*, 2026-10-17; Color and interaction round, option J): the hue keys (`--gradient-interactive`) flowing slowly at 20° (30s per loop) under a faint shimmer of white stripes in two crossing layers, blended lighten-only so it never darkens the colors, with one blurred copy behind as its glow (8px, 0.3); white label. The start is set by the clock, once around the loop per minute, and the secondary starts opposite the primary on the wheel. The secondary's outline is covered by the fill. Shared code: `src/styles/button-hover.css` and `src/scripts/button-hover.ts`. Focus ring: style still to decide.

**Colored.** A button in a hue other than ink (a page's alternate color) fills with that hue's key, white label; see [Color fills use the key](#guidelines-color-fills-use-the-key).

**Icon only.** A button that is just an icon (menu, search, close) stays bare: no outline, as in an interface's chrome.

**Size.** At least 48px tall in the reviewed form lab, with `--radius-md` corners. In the brand site's specimens the solid button carries a matching border so both are one size.

