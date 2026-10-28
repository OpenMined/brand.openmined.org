---
type: Decision
title: "Fields light up on hover and take a gray line on focus"
description: "Grayscale field states: a soft light that follows the pointer and a gray outline on hover; a solid 1px gray-500 line with the inset on focus."
status: working
date: 2026-10-17
tags: [interface]
tokens: [--surface-sunken, --shadow-sunken, --gray-300, --gray-500, --white]
---

**Context.** A field's only focus signal was the inset recess, the same light inset the sunken level casts at rest, which is hard to see in both modes and has to reach 3:1. The Color and interaction round (`/rounds/motion/#fields`) tried grayscale hover and focus states; colorful lines were ruled out (design lead, 2026-10-14). Its two options shared the hover and differed on focus: B a gray line with a lighter gray moving around it, C a solid gray line.

**Decision.** Option C (design lead, 2026-10-17, after trying it on the page reviews). On hover a soft white light inside the field follows the pointer; in light mode the field takes a gray-300 outline that turns white near the pointer (0.5), with the inner light at 0.4; in dark mode its edge lights up in gray-500 near the pointer (0.5), inner light 0.0175. On focus a solid 1px gray-500 line, in both modes, over the inset.

**Alternatives.** B, the moving focus line: more motion than a field needs. The inset alone: too faint to be the only focus signal.

**Consequences.** Fields carry a transparent 1px border (padding 1px less, so sizes hold) and paint their states as background layers. Shared on the brand site (`.ctl` in `src/styles/site.css`, the light from `src/scripts/button-hover.ts`) and on the page reviews (`v2/motion.css`). The line's contrast against each surface still needs checking against 3:1.

**Revisit when.** The accessibility round checks field focus, or the focus ring style for other controls is set.
