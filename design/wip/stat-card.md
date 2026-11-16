---
type: Component
title: Stat card
description: "One number on a card: its label, the number, one line of change. Neutral at rest; the change takes its color while you're on the card."
status: draft
from: "Issue #54 and #53 (the reporting dashboard's stat tiles), 2026-11-06"
waiting:
  - "The number's face: Inter 600 (the dashboard's) or Rubik (the dashboard example's)"
  - "The full layer's colorflow and tilt on a number card: keep, or the lift only"
tokens: [--font-size-h3-max, --tracking-numbers, --success-fg, --danger-fg, --warning-fg, --text-muted, --shadow-raise-2, --duration-fast]
---

**For.** The few numbers a dashboard leads with: visitors, a rate, goals on schedule. One number per card, with what it's compared to.

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only. Builds on `card card--compact`. |
| Color modes | Role tokens; the change's colors are the `-fg` roles, readable in both modes. |
| Minimal layer | As the hover card's: on hover or focus the card goes up a level, the change takes its color (good green, bad red), and a still fade of that key rises from the bottom edge in the flow's place. Standing still: no lift, tilt or flow. Shown on the page as its own row. |
| Full layer | `statCards()`: the hover card's lift, tilt and colorflow, the flow green or red with the change (`card-flow.js`, `tilt.js`; nothing new in them). |
| Reduced motion | No lift or tilt; the flow shows a still frame (as on hover cards). |
| Attention | A stat that needs attention says so in an amber flag line, colored at rest (*Color tells a story*). |
| Tooltip | An info tooltip in the head, as on the dashboard; it opens over the card (the card clips its flow). |
| Alignment | The head is always 1.75em (28px at the default size), whatever it holds (an info button overflows it), so a row of cards keeps its numbers on one line. In em, so it grows with the text it holds (the reader's font size, or the card's); cards in a row share a size, so their numbers stay level. |
| Touch | No hover: color never appears, and doesn't need to. The sign and the words carry the meaning. |
| Name | `.stat-card`, so the dashboard example's own `.stat` doesn't collide. |

*Open:*
- The number's face. Both are on the page: Inter 600 (default here) and Rubik (`--display`). One answer, then *Typography* says it.
- Whether the change needs an arrow as well as its sign.
