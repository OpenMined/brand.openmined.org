---
type: Component
title: Button
description: One solid button per group, carrying the label on the accent; every other button in the group is secondary, an outline with no fill.
status: working
tags: [interface]
tokens: [--accent-solid, --accent-on, --accent-key, --text-headline, --line-strong, --stroke-sm]
---

**Anatomy.** A label, with an optional icon; or an icon alone.

**Variants.**
- **Solid**: `--accent-solid` fill with an `--accent-on` label. One per group.
- **Secondary**: a `--stroke-sm` outline in `--line-strong` (the line style, the same gray step as `--text-body`), no fill, the label in `--text-headline`. Every other button in the group (decision 2026-10-12).

**States.** Both stay grayscale at rest. On hover or keyboard focus both fill with the accent in motion (decision *Button hover runs the hue keys from the clock*, 2026-10-17; Color and interaction round, option J): the hue keys (`--gradient-interactive`) flowing slowly at 20° (30s per loop) under a faint shimmer of white stripes in two crossing layers, blended lighten-only so it never darkens the colors, with one blurred copy behind as its glow (8px, 0.3); white label. The start is set by the clock, once around the loop per minute, and the secondary starts opposite the primary on the wheel. The secondary's outline is covered by the fill. Code: `components/button.css` (the look) and the hover as its own module, `components/button-hover.css` + `button-hover.js`. Focus ring: style still to decide.

**Colored.** A button in a hue other than ink (a page's alternate color) fills with that hue's key, white label; see [Color fills use the key](#guidelines-color-fills-use-the-key).

**With an icon.** An icon beside the label, on either side: 20px, in the label's color, 8px (`--spacing-sm`) from it. Put the icon after the label for "go" (an arrow), before it for an action with a known glyph (download).

**Icon only** (`.btn--icon`). A button that is just an icon (menu, search, close) stays bare: no outline, as in an interface's chrome, square at the button's 48px height, with an accessible name (`aria-label`). Hover is the same fill as every button (2026-10-28).

**Size.** At least 48px tall in the reviewed form lab, with `--radius-md` corners. In the brand site's specimens the solid button carries a matching border so both are one size.

**Code.** `components/button.css`; the color in motion on hover, `components/button-hover.css` and `button-hover.js` (`buttonHover()`), which needs a button that can hold children (a `<button>` or `<a>`, not an `<input>`). Plain CSS and ES modules, no build step: load the v2 tokens first, then only the files a page uses; each script exports one function that takes a selector and is safe to call again. The markup to match is at the top of each CSS file (`components/README.md`).
