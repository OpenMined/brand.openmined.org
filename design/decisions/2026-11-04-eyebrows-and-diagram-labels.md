---
type: Decision
title: "Eyebrows over a heading take the eyebrow style; diagrams keep a label style of their own"
description: "Every eyebrow over a page's or a section's heading is .text-eyebrow: body text, sentence case. Caps in mono stays only inside diagrams, as the diagram label (.fig__label, renamed from .panel__eyebrow)."
status: released
date: 2026-11-04
tags: [graphics]
tokens: [--font-mono, --font-size-xs, --text-muted]
---

**Context.** In the skill's test round, an agent drawing a network diagram as a Claude artifact set the page's eyebrow, over its main heading, in caps and mono: a style in no type style. It had just read `components/diagram.css`, whose label over a diagram panel was named `.panel__eyebrow` and set in caps and mono, while the type's eyebrow (`.text-eyebrow`) is body text. The system had two eyebrows.

**Decision.** Design lead, 2026-11-04.
- **Every eyebrow over a page's or a section's heading takes `.text-eyebrow`**: body text, sentence case, never caps or mono.
- **Diagrams keep their caps style, as a style of their own: the diagram label** (`.fig__label`): mono, caps, letter-spaced, muted, for the labels inside a figure (a panel, a stage, a zone, a group). In SVG it takes the figure's own size.
- `.panel__eyebrow` is renamed `.fig__label`, so its name doesn't read as an eyebrow for pages. The ABC figures' stage and zone labels use it too.

**Alternatives.** Diagram panel labels to the type's eyebrow as well: the caps label is part of how the figures read, and stays with them.

**Revisit when.** A figure needs a label the diagram label doesn't fit.
