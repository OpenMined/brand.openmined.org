---
type: Guideline
title: Outlines are lines, not containers
description: An outline may surround an area only when the same surface shows inside and outside it. Never a bordered box with a different fill inside.
status: working
tags: [surfaces]
tokens: [--line, --line-strong, --stroke-sm, --stroke-md]
---

**Rule.** An outline is a line, never a container. Draw one only where the surface inside matches the surface outside: a thin, stark 1px edge (`--stroke-sm`) in `--line-strong`, the line style (see *Lines*). Where two things need separating, a divider still does it: a single `--stroke-sm` edge in `--line`.

**Why.** A border around an area with a different fill inside is the app-style container that is everywhere right now, and borders on everything is a mark of AI-generated design; the brand avoids trends, AI design trends especially. A line over the same surface reads as drawing instead: the infographics' outer outlines, the outlined secondary button, the home page's outlined federated-network section with the colorflow showing through.

**Do.** Outline an area that keeps the page's surface, such as a section of a page or a diagram's outer region. Let a card on a different level use its level and shadow as its edge. In a diagram, lines are the quieter `--line`, and the outer outline may take `--stroke-md` (1.5px), one step above the lines inside it.

**Exception: surface examples.** A specimen that shows the `base` level, such as a panel demonstrating the four levels on a page of the same color, may take a 1px `--line` hairline around it. A base panel on a base page has no other edge. Keep this to brand and surface examples.

**Raised levels inside an outline.** A card or band on its own level, with its shadow, may sit inside an outlined area (decision *Raised levels may sit inside an outline*). The outline still has the page's surface on both sides; the raised thing inside keeps its level as its edge. Examples: a large hover card inside an outlined section, and the system diagram on the overview, its outlined outer sections holding surfaces.

**Don't.** Put a border on a card that already sits on a different level, or around a fill of another color. Hide an outline with `border-color: transparent` to switch it off at rest.

**Buttons are the exception.** A button's border stays in place in every state, so solid and secondary are one size. On hover the fill covers the button and the border goes with it: transparent under the moving fill, or the fill's own color without the hover script (*Buttons*). At rest the secondary's outline always shows.
