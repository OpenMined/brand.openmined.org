---
type: Component
title: Stat cards
description: "One number a dashboard leads with, on a card: its label, the number, and one line of change. Neutral at rest; the change takes its color while you're on the card."
status: released
tags: [interface]
tokens: [--font-size-h3-max, --tracking-numbers, --success-fg, --danger-fg, --warning-fg, --text-muted, --shadow-raise-2, --duration-fast]
---

**When.** The few numbers a dashboard leads with: visitors, a rate, goals on schedule. One number per card, with what it's compared to. A row of them, all the same size. For a share of a goal, a progress ring; inside rows and tables, the table's own numbers.

**Anatomy.** A compact card (`card card--compact`): a head with the label (small, muted) and an optional info tooltip; the number in Inter 600 at the h3's largest size, tabular figures; one line of change, the change itself semibold, then what it's compared to, muted. An optional flag line below for a stat that needs attention.

**Color.** Neutral at rest: the change is in the headline color. On the card's hover or focus it goes up a level (the raise-2 shadow) and the change takes its color, good in green, bad in red (the `-fg` roles, readable in both modes). Only a stat that needs attention is colored at rest, in an amber flag line (*Color tells a story*). The sign and the words carry the meaning, so on touch, where color never appears, nothing is lost.

**Full layer.** `statCards()`: the hover card's lift, tilt and colorflow, the flow green or red with the change (`card-flow.js`, `tilt.js`). Under reduced motion no lift or tilt, and the flow shows a still frame.

**Minimal layer.** As the hover card's: standing still, no lift, tilt or flow; the card goes up a level, the change takes its color, and a still fade of that key rises from the bottom edge in the flow's place.

**Alignment.** The head is always 1.75em (28px at the default size), whatever it holds (an info button overflows it), so a row of cards keeps its numbers on one line. In em, so it grows with the text it holds.

**Tooltip.** An info tooltip in the head opens over the card (*Tooltips*), so the card's clipping of its flow never cuts it off.

**Code.** `components/stat-card.css`, `stat-card.js` (`statCards()`), on `card.css`.

When an arrow helps readers scan deltas, use `graph-up` for a rise and `graph-down` for a fall alongside the signed value. Choose good or bad by what the metric measures. A falling error rate and a rising completion rate both improve.
