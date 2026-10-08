---
type: Decision
title: Ink is the palette
description: Ink chosen as the working palette, with a per-mode saturation offset.
status: working
date: 2026-09-25
tags: [color]
---

**Context.** The color round consolidated nine hue families into six with a shared lightness ladder and compared generated candidates (Brand, Heritage, Deep and variants, Ink) on real pages, in both modes.

**Decision.** Ink, with saturation ×1.10 in light mode and ×0.95 in dark mode on every step. Hue and lightness are untouched.

**Why the offsets.** A color that holds up on dark goes dull on light. Light wants a little more chroma, dark a little less: a small uniform rule rather than per-step values.

**Checked.** No text, key or label fails under the offsets; every contrast figure moved by less than 0.05.

**Revisit when.** The offsets are confirmed and baked into the generator, or a real design problem needs a more saturated stop.
