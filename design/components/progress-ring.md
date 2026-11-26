---
type: Component
title: Progress rings
description: "How far along something is, as a ring with the percentage inside: the one figure a card is about. Gray at rest, the status color while a card action is hovered or keyboard-focused."
status: released
tags: [interface]
tokens: [--surface-sunken, --emphasis, --success-key, --warning-key, --danger-key, --text-headline, --text-muted, --transition-base]
---

**When.** One figure of progress that leads a card: a goal's percentage. Inside rows and tables, and wherever the amount matters more than the share, use a meter.

**Anatomy.** The ring uses a 64-unit SVG viewBox, a 6-unit stroke and a centered, semibold tabular figure. The default size is 4rem, small is 3rem (`--sm`) and large is 7rem (`--lg`). In a large ring, wrap the percent sign in `<tspan class="progress-ring__unit">` for a half-size muted unit.

**Like the meter.** The track is the sunken level, so a ring sits on a card, never on the page; the fill is the strong gray, from the top, clockwise.

**Color.** The arc rests in strong gray. In both interaction layers, hovering or keyboard-focusing a card action colors the arc with its status key (`--success`, `--warning` or `--danger`).

**Markup.** An SVG with `role="img"` and an `aria-label` that says the value. The circles use `pathLength="100"`, so the page sets `--progress-ring-value` (0 to 100) and the number, nothing else.

**Code.** `components/progress-ring.css`. No script.

*Open:*
- One *Progress* component with ring and meter variants, if more shapes come.
