---
type: Decision
title: "A stack is a grid with a gap"
description: "The stack spaces its children with a one-column grid's gap instead of a margin on each child, so no child can cancel the space; --stack-space, the per-child override, is dropped. A stack goes on an element of its own."
status: released
date: 2026-11-05
tags: [layout]
tokens: [--spacing-lg]
---

**Context.** The stack (2026-11-02, *Space belongs to the container*) put its space on each child after the first, as a top margin weighing one class. A component that resets its own margin at the same weight and loads later (the figure, `.fig`, in `/omds.css`) cancelled it: on the Graphics page a diagram sat flush under the text above it. The same was waiting for a list of options, a row of tags and the steps. The fix, moving each reset to `:where()`, held only as long as every component remembered it.

**Decision.** Design lead, 2026-11-05.
- **A stack is a one-column grid with a gap** (`display: grid; grid-template-columns: minmax(0, 1fr); gap`), `lg` by default, `.stack--2xs` to `.stack--5xl` for any step. The gap is the container's: nothing a child does cancels it, and a hidden child takes no space.
- **`--stack-space` is dropped.** A gap is the same between every pair; to vary the space, nest stacks. Nothing used it.
- **A stack goes on an element of its own,** never on one with its own layout (a card, a row) or one that toggles `hidden` (a tab panel), since the stack sets display: put the stack inside. A component spaces its own insides; where a card's content needs a stack's step, the stack goes inside the card.
- A child's own margin now adds to the gap instead of replacing it. Components keep their insides to themselves, so this is rare (a panel's head inside a figure).

**Alternatives.** A flex column with a gap: stretches images to the full width. Keeping margins and moving every component reset to `:where()`: works, but any new component can break it again. Faking `--stack-space` with a negative margin: a second way to space, for a need nesting already meets.

**Revisit when.** A layout needs uneven space inside one stack that nesting can't give.
