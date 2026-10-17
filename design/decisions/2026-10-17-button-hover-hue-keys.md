---
type: Decision
title: "Button hover runs the hue keys from the clock"
description: "Button hover fills with the hue keys, not the full OM gradient, starting where the clock puts it (one turn a minute), the secondary opposite the primary; no pointer light."
status: exploring
date: 2026-10-17
tags: [color, interface]
tokens: [--gradient-interactive, --green-key, --teal-key, --blue-key, --violet-key, --red-key, --amber-key]
---

**Context.** *Green at rest, gradients in motion* (2026-10-13) made button hover the full OM gradient, starting on green, with a light that follows the pointer (the Color and interaction round's option E). On Oct 17 Kyle wanted to try the button without the pointer light, and without green always being the first color seen. Starting anywhere in the full gradient can land on a pale stop (gold, yellow, lime), where the white label is hardest to read.

**Decision.** Button hover takes the round's option J (Kyle, 2026-10-17). The fill runs through the hue keys only (`--gradient-interactive`: green, teal, blue, violet, red, amber, blended in OKLCH) under the grayscale shimmer, with the same glow and no pointer light. Where the loop starts is set by the clock: once around the loop per minute, so it changes over time but is the same for every button and visitor at a given moment. A secondary button starts half a loop on, opposite the primary on the wheel (green with violet, teal with red, blue with amber). This replaces the 2026-10-13 decision's button hover only; links and icons are unchanged, and green stays the static accent.

**Alternatives.** E (the full gradient from green, with the pointer light); G (E without the light); H (hue keys from a random point on every hover); I (J with both buttons on the same color).

**Consequences.** Hover no longer begins on green. The white label stays at the hue keys' contrast (about 3.8:1 at the green key, or better), so the pale-stop dip accepted on Oct 13 is gone from buttons. Shared code: `src/styles/button-hover.css`, `src/scripts/button-hover.ts`.

**Revisit when.** Bennett reviews it on the preview, or the clock start reads as random rather than intended.
