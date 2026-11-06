---
type: Decision
title: "Quiet status chips are gray with a colored dot; strong chips stay filled"
description: "The quiet chip draws a gray ring and gray text with a dot in the status's key; the strong chip keeps its fill with no dot. Both get 12px each side and stay pills. Replaces the quiet chip's colored ring and text from 2026-10-28."
status: released
date: 2026-11-06
tags: [interface, color]
tokens: [--line, --text-body, --success-key, --warning-key, --danger-key, --info-key, --spacing-md, --radius-full]
---

**Context.** In generated work the quiet chips (a ring and text in the status's `fg`) lost their pop in light mode and read as colored outlines everywhere a column of them repeated. A test dashboard's "tech stack" badge, a gray outline with a colored dot, read as more considered and leaned less on color for something that isn't interactive. The chips also felt cramped at 8px a side. Design review, 2026-11-05.

**Decision.** Design lead and brand owner, 2026-11-05.
- **Quiet:** a gray ring (`--line`) and gray text (`--text-body`), with a 6px dot in the status's `key` before the label.
- **Strong:** unchanged: the key as the fill, a white label. **No dot**: on a fill a dot would have to go neutral and says nothing the fill doesn't.
- **12px each side** (`--spacing-md`, was 8px), the same on both, so a quiet chip and a strong one beside it hold the same pads.
- **Still pills.** Full round stays the shape for what isn't interactive; buttons keep rounded rectangles.

The outline-pill with a dot remains out as an eyebrow (*Eyebrows take the eyebrow style*); as a status chip it's the component.

**Alternatives.** Keep the colored ring and text: it carried more color than a repeated status needs. A dot on the strong chip too: it would have to be white or gray on the fill.

**Consequences.** The quiet chip no longer uses the status `fg` roles; the dot uses the key. Markup is unchanged: no class changed.

**Revisit when.** A chip's dot is the only thing telling two statuses apart for someone who can't see the hue: the label carries the status, so it shouldn't be.
