---
type: Component
title: Links
description: Link text never changes color. A link with an underline gets the accent drawn over it on hover; a link without one draws an underline in its own color.
status: working
tags: [interface]
tokens: [--gradient-spectrum, --line-strong, --stroke-sm, --text-headline, --font-size-md]
---

**Rule.** Link text keeps its color on hover; the line does the work. Every link line is the line style, a `--stroke-sm` line in `--line-strong`, the same as the secondary button's outline. A link that already has an underline gets the accent on hover: still in the minimal layer, flowing in the full one (*Interaction states*). A link without one draws the line on hover. Lines arrive from the left and leave to the right. Keyboard focus also draws the focus line: 1px in `--line-focus`, 2px outside, as on fields.

**Content link.** A plain link inside a paragraph, a heading, or a prose region. It takes the color of the text around it. **Minimal** (`link.css`): a 1px underline in the line style; on hover and keyboard focus a line in the accent's green, `--accent-key`, draws over it from the left and leaves to the right, the full state's geometry without the flowing colors, the glow or the draw-in on load. It works in any browser. **Full** (`link-flow.css`, added on): the underline draws in from the left when the page loads, and on hover or keyboard focus a 1px line in the brand gradient (`--gradient-spectrum`) grows over it from the left, 0.4s, and leaves to the right when the pointer moves off. While it's there, the colors flow along it left to right (*if color, then motion*). It's sized by the link: each hue spans the link's whole length, so a link of any length shows two colors at most, one hue every 1.7s. Behind the line, a glow band of the same colors at 35%, the line plus 1px on every side. Only links with a resting underline get color. Put `.link-content` on a link, or `.content-links` on a block of running text to make every plain link (no class) inside it a content link; components that are links (buttons, nav, cards) carry their own class and never get it.

**Text button.** An action that reads as text: a short label, usually with an icon after it (an arrow for "go", a download glyph for "download"). Weight 500, headline color. No line at rest; on hover the line slides in under the label, not under the icon.

**Nav and footer links.** No underline at rest, so they work like the text button: the line on hover, and on the current page it stays. Their text holds its color on hover. One exception: the brand guide's top bar takes a sunken wash on hover and on the current page, until a tab nav is defined.

**Reduced motion.** In the full layer, the content link's underline shows at once and the colored line appears without growing or flowing; the text button's line appears without sliding.

*Open:*
- The gradient's pale stops (yellow, lime) fade into a light page as they pass under a content link; the hue keys (`--gradient-interactive`) would hold.

**Code.** `components/link.css`, no script: `.link-content` on a link, or `.content-links` on a block of running text; `.link-text` for the text button. The content link's full state is `components/link-flow.css`, loaded after it; inside `data-interaction="minimal"` it steps aside. Load the v2 tokens first. The markup to match is at the top of the CSS file (`components/README.md`).
