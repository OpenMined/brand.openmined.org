---
type: Component
title: Progress rings
description: "How far along something is, as a ring with the percentage inside: the one figure a card is about. Gray at rest, the status's color while you're on its card."
status: released
tags: [interface]
tokens: [--surface-sunken, --emphasis, --success-key, --text-headline, --font-size-sm, --transition-base]
---

**When.** One figure of progress that leads a card: a goal's percentage. Inside rows and tables, and wherever the amount matters more than the share, use a meter.

**Anatomy.** A track and a fill 6px wide, the percentage inside in the headline color (`--font-size-sm`, semibold, tabular figures). 64px, or 48px (`--sm`).

**Like the meter.** The track is the sunken level, so a ring sits on a card, never on the page; the fill is the strong gray, from the top, clockwise.

**Color.** Gray at rest. A ring that carries a status (`--success`, on schedule) takes the status's key only while you're on its card, hover or focus (*Color tells a story*). In plain CSS, so the minimal layer has it too; only the color moves.

**Markup.** An SVG with `role="img"` and an `aria-label` that says the value. The circles use `pathLength="100"`, so the page sets `--progress-ring-value` (0 to 100) and the number, nothing else.

**Code.** `components/progress-ring.css`. No script.

*Open:*
- Warning and danger statuses, still only on hover.
- One *Progress* component with ring and meter variants, if more shapes come.
