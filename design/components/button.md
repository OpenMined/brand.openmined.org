---
type: Component
title: Buttons
description: One solid button per group, carrying the label on the accent; every other button in the group is secondary, an outline with no fill.
status: released
tags: [interface]
tokens: [--emphasis, --on-emphasis, --accent-key, --on-key, --text-headline, --line-strong, --stroke-sm]
---

**Anatomy.** A label, with an optional icon; or an icon alone.

**Variants.**
- **Solid**: `--emphasis` fill with an `--on-emphasis` label. One per group.
- **Secondary**: a `--stroke-sm` outline in `--line-strong` (the line style, the same gray step as `--text-body`), no fill, the label in `--text-headline`. Every other button in the group.

**States.** Both stay grayscale at rest. Every state works in two layers (*Interaction states*); the code below is the spec.

- **Minimal**, in `button.css` alone: on hover (pointer devices only) and keyboard focus both fill with the accent's green, `--accent-key`, labeled in `--on-key`. Pressed takes `--state-pressed-wash` over the green. Keyboard focus also draws the focus line: 1px in `--line-focus`, 2px outside, as on fields. Disabled: `--state-disabled-opacity`, the not-allowed cursor, no hover.
- **Full**, with the hover add-on: on hover or keyboard focus both fill with the accent in motion (decision *Button hover runs the hue keys from the clock*): the hue keys (`--gradient-interactive`) flowing slowly at 20° (30s per loop) under a faint shimmer of white stripes in two crossing layers, blended lighten-only so it never darkens the colors, with one blurred copy behind as its glow (8px, 0.3); white label. The start is set by the clock, once around the loop per minute, and the secondary starts opposite the primary on the wheel. The secondary's outline is covered by the fill: its border turns transparent under the moving fill (*Outlines are lines, not containers*, the button exception). Pressed darkens the moving fill by `--state-pressed-wash` and dims the glow. The add-on doesn't run on touch devices or inside `data-interaction="minimal"`; the minimal states apply there.

**With an icon.** An icon beside the label, on either side: 20px, in the label's color, 8px (`--spacing-sm`) from it. Put the icon after the label for "go" (an arrow), before it for an action with a known glyph (download).

**Icon only** (`.btn--icon`). A button that is just an icon (menu, search, close) stays bare: no outline, as in an interface's chrome, square at the button's 48px height, with an accessible name (`aria-label`). It never fills: on hover and keyboard focus the icon takes the color, the accent's green standing still (minimal) or green's two-tone moving in its stroke (full); pressed darkens it with the pressed wash.

**Size.** 48px tall, with `--radius-md` corners. Every button carries the same 1px border (the solid's in its own fill), so solid and secondary are one size.

*Open:* colored buttons, for when a page needs them, such as a product associated with a color: a hue at rest (*Color fills use the key*), and a color mode whose hover runs that hue's two-tone gradient instead of the hue keys.

**Code.** `components/button.css`, the button with its minimal states; the full state's color in motion, `components/button-hover.css` and `button-hover.js` (`buttonHover()`), which needs a button that can hold children (a `<button>` or `<a>`, not an `<input>`). Plain CSS and ES modules, no build step: load the v2 tokens first, then only the files a page uses; each script exports one function that takes a selector and is safe to call again. The markup to match is at the top of each CSS file (`components/README.md`).
