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

**States.** Both stay grayscale at rest and take the accent's color, `--accent-key` (green), on hover: both fill green with a white label, and the secondary's outline turns green with the fill (Kyle and Bennett, 2026-10-12). Focus: a visible ring, style still to decide.

**Colored.** A button in a hue other than ink (a page's alternate color) fills with that hue's key, white label; see [Color fills use the key](#guidelines-color-fills-use-the-key).

**Icon only.** A button that is just an icon (menu, search, close) stays bare: no outline, as in an interface's chrome.

**Size.** At least 48px tall in the reviewed form lab, with `--radius-md` corners. In the brand site's specimens the solid button carries a matching border so both are one size.

*Open:* a subtle animated accent gradient and glow on hover (Bennett, 2026-10-12), held until its colors are chosen.
