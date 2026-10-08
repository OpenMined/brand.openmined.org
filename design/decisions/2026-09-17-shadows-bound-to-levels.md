---
type: Decision
title: Shadows are bound to the levels
description: Each level has its own shadow, and v1's sm/md/lg scale is retired. The shadow values were re-derived for the levels.
status: working
date: 2026-09-17
tags: [surfaces]
tokens: [--shadow-sunken, --shadow-raise-1, --shadow-raise-2]
---

**Context.** v1 shipped `--shadow-sm/md/lg`, which said nothing about which surface each belonged on: a second parallel scale, like the eight surface tokens.

**Decision.** One shadow per level: `raise-1` and `raise-2` cast, `sunken` is inset, `base` casts nothing. Geometry is shared across modes; only the ink changes, because a shadow must land on a dark ground as clearly as on a light one. The ink is always a gray step (or black), never a typed color.

**Re-derived 2026-09-18.** The first version adopted v1's `sm` and `md` values as the two rungs. The `md` shadow was built for a card floating on a page, not a panel inside a card, and its 32px blur caused visible banding in dark mode. Re-derived: `raise-1` is 2/10/−4, `raise-2` is 6/16/−4 plus a 2/4 contact layer. The lesson: *a rung inherited from a token scale is not a rung derived for a level.*

**Consequences.** Changing a level changes its shadow with it. The blur limit guideline follows from the re-derivation.

**Revisit when.** A shadow needs different geometry per mode. That would mean contrast, not shadow, is carrying elevation.
