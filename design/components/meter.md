---
type: Component
title: Meter
description: "How much of a whole, read as x of y: storage used, a quota, a task's progress. A sunken track on a raised surface, a strong gray fill and a small label."
status: released
tags: [interface]
tokens: [--surface-sunken, --emphasis, --text-muted, --radius-full, --font-size-xs]
---

**Anatomy.** A track 6px tall, fully round; a fill from its start; a label after it, small (12px) and muted, with tabular figures. The track is the sunken level (`--surface-sunken`), a recess, so a meter sits on a raised surface: a card or a panel, raise-1 at least. **Never on the page** (`--surface-base`): a thin recess there all but disappears (*Recessed controls prefer a raised surface*). A table of meters goes on a card. The track stays the same on a highlighted table row (rows take a wash, not the sunken level). It's a set gray, one per mode, never an opacity over the surface. The fill is the strong gray (`--emphasis`). A fill is never narrower than the bar is tall, so a small value still shows; at 0 there is no fill.

**Label.** Say the amount, not only the share: *12 of 40 GB*, *3 of 5 steps*. A percentage alone (*82%*) where the whole is obvious, as a project's progress.

**When.** One amount out of a known whole. Not for a value without a maximum (a count), or comparing many values (a chart).

**Markup.** `role="meter"` for an amount of a capacity, `role="progressbar"` for a task underway, with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` saying the label's words. The page sets the fill's width. The width of the track is 96px; set `--meter-width` on the meter to change it.

**One color, whatever the amount.** The fill doesn't turn amber or red as it fills: fuller can be good (a task near done) or bad (a disk near full), and the label says which. Where a limit matters, say it beside the meter, as a status chip.

**Code.** `components/meter.css`. No script.
