---
type: Guideline
title: Dividers only, no outlines
description: Nothing is enclosed by a border. The only rules are single edges that separate one thing from the next.
status: working
tags: [surfaces]
tokens: [--line]
---

**Rule.** Don't outline cards, inputs, buttons or panels. Where two things need separating, use a divider: a single 1px edge in `--line`.

**Why.** Levels and shadows already say where one thing ends and the next begins. An outline on top adds a second, competing edge, and the resulting busy, boxed-in look is what this system moves away from. Borders on everything is also a mark of AI-generated design right now, and the brand avoids trends, AI design trends especially. A transparent border isn't "no outline" either: it still reserves a pixel of layout.

**Do.** Separate sections and list items with a divider. Let a card's level and shadow be its edge.

**Exception: surface examples.** A specimen that shows the `base` level, such as a panel demonstrating the four levels on a page of the same color, may take a 1px `--line` hairline around it. A base panel on a base page has no other edge. Keep this to brand and surface examples.

**Don't.** Enclose a card in a border. Hide an outline with `border-color: transparent`. If an enclosing rule ever has to come back, draw it with `outline`, which takes no layout space.
