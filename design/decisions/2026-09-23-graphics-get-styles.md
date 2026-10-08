---
type: Decision
title: Graphics get styles, not a color scheme
description: No separate color scheme for graphics. How color is applied in graphics belongs to graphics styles, a later push.
status: working
date: 2026-09-23
tags: [graphics]
---

**Context.** Orange, lime and yellow exist only in the gradient. The question was whether to fold them away or expand them into full families, and whether graphics need their own register of colors.

**Decision.** No separate graphics color scheme. Orange, lime and yellow stay gradient stops only: they have no interface job. Halos, glows, dark stages and bands belong to graphics styles, a later push.

**Alternatives.** A "spectrum register" with a dark-stage glow variant and named stage colors (dropped: too much overhead for what graphics styles should cover; a glow is rendering, not color).
