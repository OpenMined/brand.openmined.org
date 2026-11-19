---
type: Decision
title: "A dashboard's lead numbers are Inter 600"
description: "The number on a stat card is Inter 600 at the h3's largest size with tabular figures, not the display face."
status: released
date: 2026-11-19
tags: [typography, interface]
tokens: [--font-size-h3-max, --tracking-numbers, --font-body]
---

**Context.** The stat card from issue #54 was shown with its number in two faces: Inter 600 (the reporting dashboard's) and Rubik (`--display`, the dashboard example's).

**Decision.** Design lead, 2026-11-19. **Inter 600, tabular**, at the h3's largest size: the number is data, read and compared across a row, not a headline.

**Alternatives.** Rubik: closer to the site's headings, but its figures aren't tabular and a row of numbers reads as headlines.

**Consequences.** `stat-card.css` sets it; *Typography* says it under Numbers. The dashboard example's own `.stat` tiles are unchanged.
