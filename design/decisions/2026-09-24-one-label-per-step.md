---
type: Decision
title: One label color per step; the key carries no text
description: A row of badges mixed white and dark labels. Every step now takes one label color in every hue.
status: working
date: 2026-09-24
tags: [color]
---

**Context.** The key column showed white labels on some hues and dark on others, because the key keeps each hue's own lightness.

**Decision.** One label color per step in every hue. No interface text on the key. `solid` moved off the key toward contrast, and `on` is one value per mode, never per hue. (Recorded in the old 7-step numbering; in the 50–950 series: ink on 100–300, white on 600–800, no text on the key, 500; `solid` is 600 in light, 300 in dark.)

**Alternatives.** Lock every key to one lightness (rejected: amber and green go brown when darkened, violet and blue pastel when lifted). Keep per-hue labels (the inconsistency being fixed).

**Consequences.** Labels on solids measure 6.2–8.3:1 in light and 9.2–10.5:1 in dark. Light-mode solids are one step deeper; dark-mode solids are light fills with ink labels.
