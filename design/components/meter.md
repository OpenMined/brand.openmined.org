---
type: Component
title: Meter
description: "How much of a whole, read as x of y: storage used, a quota, a task's progress. A gray track, a strong gray fill and a small label."
status: released
tags: [interface]
tokens: [--text-headline, --emphasis, --text-muted, --radius-full, --font-size-xs]
---

**Anatomy.** A track 6px tall, fully round; a fill from its start; a label after it, small (12px) and muted, with tabular figures. The track is the headline color at 20% over whatever is under it, so it reads on any surface: the page, a card, a highlighted table row, an always-dark section. The fill is the strong gray (`--emphasis`). A fill is never narrower than the bar is tall, so a small value still shows; at 0 there is no fill.

**Label.** Say the amount, not only the share: *12 of 40 GB*, *3 of 5 steps*. A percentage alone (*82%*) where the whole is obvious, as a project's progress.

**When.** One amount out of a known whole. Not for a value without a maximum (a count), or comparing many values (a chart).

**Markup.** `role="meter"` for an amount of a capacity, `role="progressbar"` for a task underway, with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` saying the label's words. The page sets the fill's width. The width of the track is 96px; set `--meter-width` on the meter to change it.

*Open:* status colors for the fill.

**Code.** `components/meter.css`. No script.
