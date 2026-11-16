---
type: Component
title: App bar
description: "The bar across the top of an internal tool: the brand and the quiet nav on one baseline at its start, what applies to the whole tool at its end."
status: draft
from: "Issue #54 (the reporting dashboard's top bar; the quiet nav beside a brand), 2026-11-06"
waiting:
  - "An app bar as a component, or a line in Nav (how a quiet nav sits beside a brand)"
  - "Sticky or not, and what goes at its end"
tokens: [--surface-base, --line, --text-headline, --spacing-2xl, --spacing-lg]
---

**For.** The top of an internal tool or dashboard: which tool (the brand), its sections (the quiet nav), and the few things that apply everywhere (a status, the color-mode switch). Not for openmined.org's header.

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only. |
| Color modes | Role tokens; on the page's ground with a line under it. |
| Alignment | The brand's name and the nav's items share a baseline, set by the bar, so the nav's smaller text sits on the brand's line without a hand nudge (the dashboard moves it 2px; *Center by eye*). |
| Phone | 16px sides; the nav wraps under the brand. |
| Minimal / full layer | Nothing of its own; its nav and controls bring their states. |

*Open:*
- The dashboard asked for a rule ("how a quiet nav sits beside a brand"). A bar that sets the alignment means nobody applies the rule by hand; the alternative is the line in *Nav* alone.
- Sticky to the top, or scrolls away.
- The internal-tools medium lists "no app shell" as a gap; this is its first part.
