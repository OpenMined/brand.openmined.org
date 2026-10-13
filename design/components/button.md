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
- **Secondary**: a `--stroke-sm` outline in `--line-strong` (the line style, the same gray step as `--text-body`), no fill, the label in `--text-headline`. Every other button in the group (decision 2026-10-12; replaces the quiet button, which had no outline).

**States.** Both stay grayscale at rest. On hover or keyboard focus both fill with the accent in motion (decision *Green at rest, gradients in motion*, 2026-10-13; motion round, option E): the full OM gradient flowing slowly at 20°, starting on green (30s per loop), under a faint grayscale shimmer in two crossing layers, with one blurred copy behind as its glow (8px, 0.3) and a soft white light that follows the pointer; white label. The secondary's outline is covered by the fill. Shared code: `src/styles/button-hover.css` and `src/scripts/button-hover.ts`. The white label dips in contrast while the pale stops pass (accepted for now). Focus ring: style still to decide.

**Colored.** A button in a hue other than ink (a page's alternate color) fills with that hue's key, white label; see [Color fills use the key](#guidelines-color-fills-use-the-key).

**Icon only.** A button that is just an icon (menu, search, close) stays bare: no outline, as in an interface's chrome.

**Size.** At least 48px tall in the reviewed form lab, with `--radius-md` corners. In the brand site's specimens the solid button carries a matching border so both are one size.

*Open:* label contrast over the pale stops; `--gradient-interactive` (hue keys only) is the fallback.
