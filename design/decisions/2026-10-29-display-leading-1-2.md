---
type: Decision
title: "Display headings at 1.2 leading, as openmined.org"
description: "h1 to h4 return to 1.2 leading, the website's value, replacing the type round's tight ramp. Slight display tracking stays."
status: released
date: 2026-10-29
tags: [typography]
tokens: [--line-height-h1, --line-height-h2, --line-height-h3, --line-height-h4]
---

**Context.** The type round (2026-10-28) chose a tight leading ramp for the display levels: h1 1.05, h2 1.1, h3 1.15, h4 1.2. Set against the reviewed openmined.org pages, headings sat noticeably tighter than the site, and the pages ran short of the reviews.

**Decision.** Design lead, 2026-10-29. **h1 to h4 take 1.2 leading**, as openmined.org. The slight display tracking (`--tracking-display`) and the rest of the type round stand.

**Alternatives.** Keep the tight ramp. The gentle ramp from the same round (1.1, 1.15, 1.2, 1.25). A ramp mainly helps very large headlines running to three or more lines; the display sizes here top out at 61px, headings are usually one or two lines, and they're balanced, so 1.2 costs little and keeps the system and the website alike.

**Revisit when.** Display sizes grow well past the current h1, or long multi-line headlines become common.
