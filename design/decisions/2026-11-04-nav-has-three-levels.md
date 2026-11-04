---
type: Decision
title: "The nav has three levels: quiet, wash, strong"
description: "A new nav component for places and views: quiet (a line under the current item, the default), wash (the current item darkens the surface) and strong (the current item fills with the strong gray). Tabs narrow to panels of different content; filters and menus are a nav."
status: released
date: 2026-11-04
tags: [interface]
tokens: [--state-current-wash, --state-hover-wash, --emphasis, --on-emphasis, --line-strong]
---

**Context.** Feedback during the skill's test round (brand repo issue #43): an agent building a dashboard used tabs as a view filter, because the tabs guidance allowed "sections of a dashboard" and the dashboard example did the same. The system had no nav. Three styles were compared side by side, in an app's header and as a view filter on a card, in both modes: this site's header (a sunken wash), a current item inverted to the strong gray, and openmined.org's underline. The sunken wash failed twice: current and hover looked the same, and in dark mode it nearly disappeared on the page.

**Decision.** Design lead, 2026-11-04.
- **A nav component with three levels**, the same markup, a modifier on the row: **quiet** (`.nav`, the default: plain text, the nav link's line under the current item, drawn in and out as on a nav link); **wash** (`.nav--wash`: the current item darkens the surface under it with black, `--state-current-wash`, hover about half, `--state-hover-wash`, more in dark mode so it shows); **strong** (`.nav--strong`: the current item fills with `--emphasis`, its label `--on-emphasis`, hover a faded fill of it, as on a tab).
- **Levels by weight:** quiet for site headers and secondary navigation, wash for menus inside an app and menus in layers, strong for an app's main sections and view filters above data.
- **Tabs narrow** to panels of different content in one place. Filters over one set of data and menus are a nav. The dashboard example's filter moves to the strong nav.
- **No divider line directly under a nav.**
- Horizontal rows only for now.

**Alternatives.** The sunken wash as this site's header has it: current and hover the same, and nearly invisible in dark mode. One level only: an app with menus in layers needs more than one weight.

**Revisit when.** A vertical (sidebar) nav, or a row that runs out of width on narrow screens, is needed.
