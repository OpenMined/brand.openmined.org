---
type: Decision
title: "No tracking, as openmined.org"
description: "The display face and tabular numbers are set as drawn (tracking 0), the website's values, replacing the type round's slight display tracking and tightened numbers. h4 in a long read takes the website's 1.3 leading."
status: released
date: 2026-10-29
tags: [typography]
tokens: [--tracking-display, --tracking-numbers, --line-height-prose-h4]
---

**Context.** The type round (2026-10-28) set slight tracking on the display face (−0.01em) and tightened tabular numbers (−0.02em). With the display leading back at the website's 1.2 (*Display headings at 1.2 leading*), the type returns to openmined.org's values for now.

**Decision.** Design lead, 2026-10-29. **No tracking**: `--tracking-display` and `--tracking-numbers` are 0, both faces set as drawn. The tokens stay, so tracking can be tuned in one place later. **h4 in a long read** takes 1.3 leading (`--line-height-prose-h4`), as the website's long reads.

**Alternatives.** Keep the type round's tracking with the website's leading. Drop the tracking tokens: they cost nothing at 0 and keep one place to tune.

**Revisit when.** Type is reviewed again as its own round, against the website.
