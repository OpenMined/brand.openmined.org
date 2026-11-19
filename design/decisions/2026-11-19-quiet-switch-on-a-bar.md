---
type: Decision
title: "The color-mode switch on a bar is quiet"
description: "On an app bar or a page's header, beside quiet chips, the color-mode switch is a hairline ring with no fill (switch--quiet). For color mode only; not a recess, so it sits on the page."
status: released
date: 2026-11-19
tags: [interface, surfaces]
tokens: [--line, --line-strong, --text-muted, --text-headline]
---

**Context.** The reporting dashboard's bar held quiet status chips and the color-mode switch. The switch's dark fill was the loudest thing on the bar, and *Recessed controls prefer a raised surface* named the exception only for a page's header.

**Decision.** Design lead, 2026-11-19.
- **On a bar, the quiet switch** (`switch switch--quiet`): 44 by 26, no fill, a hairline ring; a disc for light, a crescent for dark.
- **For color mode only.** Its picture is light and dark; any other setting takes the switch.
- **The exception is written for bars:** the color-mode switch on a bar (a page's header, an app bar) may sit on the page.

**Alternatives.** The switch on a bar: its fill outweighs everything beside it. The quiet switch for any setting: it would need a plain knob, and its picture would say "dark mode" for something else.

**Consequences.** A variant in `control.css`; *Form controls* and *Recessed controls prefer a raised surface* say it.
