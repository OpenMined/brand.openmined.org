---
type: Decision
title: Dividers only
description: Outlines removed from inputs, buttons and cards. The only rules left are dividers between things.
status: working
date: 2026-09-17
tags: [surfaces]
tokens: [--line]
---

**Context.** Review pages offered a switch for how many outlines to show. A hidden border still reserved a pixel of layout, so the "no outlines" option was never the layout that would ship.

**Decision.** Lock in dividers only: nothing is enclosed, and the only borders are single edges separating one thing from the next.

**Alternatives.** Keep outlines on controls; keep a visibility switch. Both left enclosing borders in the system.

**Consequences.** `--line-strong` has little work left and may not be needed (decided in the text-and-lines round). The brand has no `<hr>` style yet.

**Revisit when.** Accessibility needs a visible boundary that a level and shadow can't provide.
