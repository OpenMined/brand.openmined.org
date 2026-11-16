---
type: Component
title: Quiet switch
description: "A switch for a bar's color-mode toggle, drawn like the quiet status chip beside it: the same height, no fill, a hairline ring; a disc that becomes a crescent in dark mode."
status: draft
from: "Issue #54 (the reporting dashboard's header switch), 2026-11-06"
waiting:
  - "The exception to Recessed controls prefer a raised surface, written down for bars"
  - "The size beside the switch: 44 by 26 here, the switch is 46 by 26"
tokens: [--line, --line-strong, --text-muted, --text-headline, --transition-base]
---

**For.** The color-mode switch in an app bar, beside quiet chips, where the full switch's dark fill would be the loudest thing on the bar. Only for a setting that's clearly on or off by its picture (light and dark).

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only. A variant of the released switch: `switch switch--quiet`. |
| Color modes | Role tokens; the crescent is the headline color, so it reads in both. |
| Minimal / full layer | The same: the knob slides and the disc becomes a crescent, a base-duration transition. |
| Reduced motion | The slide stays (it's the state change), as on the switch. |
| Keyboard | The switch's own focus line. |
| Surface | On the page's bar with a line, not a recess: the exception to *Recessed controls prefer a raised surface*. |

*Open:*
- Only for color mode, or any on-off setting on a bar. Its picture (disc, crescent) is color mode's; another setting would need the plain knob.
- 44 or 46 wide.
