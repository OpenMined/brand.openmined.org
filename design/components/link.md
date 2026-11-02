---
type: Component
title: Links
description: Link text never changes color. A link that stands on its own (a content link, a text button) gets the accent line on hover; a link in a row of many (a nav, a footer) gets the gray line.
status: released
tags: [interface]
tokens: [--gradient-spectrum, --accent-key, --line-strong, --stroke-sm, --text-headline, --font-size-md]
---

**Rule.** Link text keeps its color on hover; the line does the work. Lines are `--stroke-sm`; a resting underline is the line style, `--line-strong`, the same as the secondary button's outline. **Color follows the setting.** A link that stands on its own, a content link in running text or a text button, gets the accent on hover: still in the minimal layer, flowing in the full one (*Interaction states*). A link in a row of many, a nav or a footer, gets the line style on hover instead, since color on every link of a tight row would crowd it. Lines arrive from the left and leave to the right. Keyboard focus also draws the focus line: 1px in `--line-focus`, 2px outside, as on fields.

**Content link.** A plain link inside a paragraph, a heading, or a prose region. It takes the color of the text around it. **Minimal** (`link.css`): a 1px underline in the line style; on hover and keyboard focus a line in the accent's green, `--accent-key`, draws over it from the left and leaves to the right, the full state's geometry without the flowing colors, the glow or the draw-in on load. It works in any browser. **Full** (`link-flow.css`, added on): the underline draws in from the left when the page loads, and on hover or keyboard focus a 1px line in the brand gradient (`--gradient-spectrum`) grows over it from the left, 0.4s, and leaves to the right when the pointer moves off. While it's there, the colors flow along it left to right (*if color, then motion*), starting from green on every hover, never from where the last one stopped. It's sized by the link: each hue spans the link's whole length, so a link of any length shows two colors at most, one hue every 1.7s. Behind the line, a glow band of the same colors at 35%, the line plus 1px on every side. Put `.link-content` on a link, or `.content-links` on a block of running text to make every plain link (no class) inside it a content link; components that are links (buttons, nav, cards) carry their own class and never get it.

**Text button.** An action that reads as text: a short label, usually with an icon after it (an arrow for "go", a download glyph for "download"). Weight 500, headline color. It usually stands with room around it, so it takes the content link's color: no line at rest; on hover and keyboard focus the accent's line draws in under the label (not under the icon), `--accent-key` in the minimal layer, the flowing gradient with its glow in the full one.

**Nav link.** For a row of many links: a header or footer nav, a list of a page's sections. `.link-nav` takes its text and size from the nav around it. No line at rest; on hover and keyboard focus the line style draws in from the left, and under the current page (`aria-current`) it stays. No color in either layer. One exception: the brand guide's top bar takes a sunken wash on hover and on the current page, until a tab nav is defined.

**Reduced motion.** In the full layer, the content link's underline shows at once and the colored line appears without growing or flowing; the text button's colored line appears without growing or flowing, and the nav link's line without sliding.

*Open:*
- The gradient's pale stops (yellow, lime) fade into a light page as they pass under a content link; the hue keys (`--gradient-interactive`) would hold.

**Code.** `components/link.css`, no script: `.link-content` on a link, or `.content-links` on a block of running text; `.link-text` for the text button; `.link-nav` for a nav link. The full state of the content link and the text button is `components/link-flow.css`, loaded after it; inside `data-interaction="minimal"` it steps aside. Load the v2 tokens first. The markup to match is at the top of the CSS file (`components/README.md`).
