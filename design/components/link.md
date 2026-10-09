---
type: Component
title: Links
description: Two link styles from openmined.org. Content links in running text, with an animated underline; text buttons, with a line that slides in on hover.
status: exploring
tags: [interface]
tokens: [--teal-key, --text-headline, --font-size-md]
---

**Content link.** A plain link inside a paragraph, a heading or a prose region. It takes the color of the text around it. Its 1px underline draws in from the left when the page loads; on hover the line wipes out to the right and a line in `--teal-key` draws back in, 0.4s each (the live site uses v1's green). On the live site this applies to every link without a class in `p`, headings and `.prose`; components that are links (buttons, nav, cards) carry their own class and never get it.

**Text button.** An action that reads as text: a short label, usually with an icon after it (an arrow for "go", a download glyph for "download"). Weight 500, headline color. No line at rest; on hover a 1px line slides in under the label, not under the icon. The live site's `link-hover-line`, which types an arrow as `->`; v2 uses the Iconoir arrow.

**Reduced motion.** The content link's underline shows at once with no animation; the text button's line appears without sliding.

*Open:* focus styling for both, and whether the text button's hover line takes the teal key too (it uses the text color today).
