---
type: Decision
title: Diagram colors stay the same across modes
description: Diagrams use fixed palette steps, never roles, so switching mode doesn't reshade them.
status: working
date: 2026-09-25
tags: [graphics]
---

**Context.** In the first diagram drafts, switching mode swapped one figure's dots and reshaded another's reds, because roles point at a different step per mode.

**Decision.** Diagrams use fixed ramp steps (the hue key, or a named step), never roles. Each mode differs only by its saturation offset. Neutrals still follow the mode.

**Consequences.** The rule generalizes to every graphic; see [Graphics use fixed steps, never roles](#guidelines-graphics-use-fixed-steps).
