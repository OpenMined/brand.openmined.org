---
type: Guideline
title: Graphics use fixed steps, never roles
description: A graphic's colors hold when the mode switches. Use a hue's key (or a fixed step), never an interface role.
status: working
tags: [graphics]
tokens: [--red-key, --teal-key, --violet-key]
---

**Rule.** In diagrams, charts and illustrations, color with a hue's `key` or another fixed step: `--teal-key`, `--red-600`. Never with a role such as `--teal-subtle` or `--red-fg`.

**Why.** Roles point at a different step in each mode, so a graphic drawn with roles changes its colors when the reader switches mode. A fixed step only shifts by the mode's saturation offset. Neutrals (ink, text, lines) still follow the mode.

**Prefer the key.** Name the key rather than its step number, so a renumbering of the scale never touches a graphic.
