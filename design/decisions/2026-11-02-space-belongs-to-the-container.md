---
type: Decision
title: "Space belongs to the container"
description: "Headings and blocks carry no margin of their own: a long read, a component or a stack sets the space between them. The stack (.stack) is the new layout primitive for everything outside the other two."
status: released
date: 2026-11-02
tags: [layout]
---

**Context.** Space around a heading came from three places: a container's gap, a margin written for one context, or a long read's rhythm. A heading outside all three had none on this site (its reset zeroes every margin) and the browser's defaults on anyone else's page. The overview's Feedback and What's new columns showed it: headings touching their text, and a list's bottom margin standing in for the space above the next heading. Nothing told a person or an agent what to do with a bare heading.

**Decision.** Design lead, 2026-11-02. **The container sets the space.** Three containers do: a long read (`.prose`, its rhythm), a component (inside itself), and a **stack** (`.stack` in `components/layout.css`) for everything else: `md` between children, `2xl` above a heading, with `.stack--xs` to `--2xl` for another step and `--stack-space` on one child to change the space above it. The stack puts space only between children, and clears its children's margins at no weight, so components keep theirs.

**Alternatives.** Default margins on headings everywhere: they add to every container's gap and doubled the space in long reads before 2026-10-29. A `gap` stack (flex or grid, as many component libraries build theirs): no selector weight, but every gap is equal, so a heading can't take more space above than below, and children become flex or grid items. A reset of every heading's margin in `type.css`: not needed, since the stack clears its own children; other projects' pages stay as they are.

**Revisit when.** The site's own single-column grids and one-off margins have moved to stacks (a page at a time), and whether a lint rule against margins on headings is worth adding.
