---
type: Component
title: Links
description: Link text never changes color. A link with an underline gets the accent drawn over it on hover; a link without one draws an underline in its own color.
status: exploring
tags: [interface]
tokens: [--gradient-spectrum, --line-strong, --stroke-sm, --text-headline, --font-size-md]
---

**Rule.** Link text keeps its color on hover; the line does the work (Kyle and Bennett, 2026-10-12). Every link line is the line style, a `--stroke-sm` line in `--line-strong`, the same as the secondary button's outline. A link that already has an underline gets the accent drawn over it on hover. A link without one draws the line on hover. Lines arrive from the left and leave to the right.

**Content link.** A plain link inside a paragraph, a heading or a prose region. It takes the color of the text around it. Its 1px underline draws in from the left when the page loads. On hover or keyboard focus a 1px line in the full OM gradient grows over it from the left, 0.4s, and leaves to the right when the pointer moves off. While it's there, the colors flow along it left to right (*if color, then motion*). It's sized by the link: each hue spans the link's whole length, so a link of any length shows two colors at most, one hue every 1.7s. Behind the line, a glow band of the same colors at 35%, the line plus 1px on every side. Working favorite of the Color and interaction round (links, B), 2026-10-13. Only links with a resting underline get color. This applies to every link without a class in `p`, headings and `.prose`; components that are links (buttons, nav, cards) carry their own class and never get it.

**Text button.** An action that reads as text: a short label, usually with an icon after it (an arrow for "go", a download glyph for "download"). Weight 500, headline color. No line at rest; on hover the line slides in under the label, not under the icon. The live site's `link-hover-line`, which types an arrow as `->`, so its line runs under the arrow too; v2 uses the Iconoir arrow and keeps the line under the label (Kyle, 2026-10-12: keep as is for now).

**Nav and footer links.** No underline at rest, so they work like the text button: the line on hover, and on the current page it stays. The live footer brightens its links on hover; in v2 they hold their color.

**Reduced motion.** The content link's underline shows at once and the colored line appears without growing or flowing; the text button's line appears without sliding.

*Open:*
- Focus styling for both.
- **The pale stops (yellow, lime) fade into a light page as they pass** (2026-10-13); the hue keys (`--gradient-interactive`, the round's option C) would hold.
