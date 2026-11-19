---
type: Component
title: App bar
description: "The bar across the top of an internal tool: the brand and the quiet nav on one baseline at its start, what applies to the whole tool at its end."
status: released
tags: [interface]
tokens: [--surface-base, --line, --text-headline, --spacing-2xl, --spacing-lg]
---

**When.** The top of an internal tool or dashboard: which tool (the brand), its sections (the quiet nav), and the few things that apply everywhere (a status, the color-mode switch). Not for openmined.org's header.

**Anatomy.** On the page's ground with a line under it, 56px tall at least, 24px from the window's sides (16px on a phone). At its start the brand (the mark at 24px, the tool's name semibold in the headline color) and a quiet nav; at its end a status chip or two and the quiet switch. On a phone the nav wraps under the brand.

**Alignment.** The brand's name and the nav's items share a baseline, set by the bar, so the nav's smaller text sits on the brand's line without a hand nudge (*Center by eye*).

**Scrolling.** It scrolls away with the page. A tool that needs it in view may make it sticky.

**States.** Nothing of its own: its nav and controls bring theirs, in both layers.

**Code.** `components/app-bar.css`, with `nav.css`. No script.
