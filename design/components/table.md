---
type: Component
title: Tables
description: "Rows of data or a comparison: small text, rows divided by the lighter line, no fills and no box. Rows you act on take the hover wash."
status: released
tags: [interface]
tokens: [--line, --stroke-sm, --spacing-xl, --spacing-lg, --font-size-sm, --text-headline, --text-body, --gray-950, --state-hover-wash]
---

**Anatomy.** Small text (14px) at text leading; each row divided from the next by the lighter line (`--line`); headers in the headline color at 600. No fills, no zebra stripes, no outer box (*Outlines are lines*; dividers separate). Numbers line up: `.num` right-aligns a column with tabular figures (*Typography*). A caption sits below in small muted text.

**Padding.** Cells are 12px apart; the first and last cells keep 20px to the row's edge (16px in a compact table), so the text of a highlighted row isn't pressed against the wash's edge.

**Rows you act on.** In a table where a row opens or selects something (`table--rows`), a row takes a faint wash of gray 950 on hover (`--state-hover-wash`: 5% in light, 18% in dark), and the current row keeps it (*Interaction states*). A faint wash, not the sunken level or the nav's stronger current wash, so a meter's sunken track in the row still reads.

**Dense.** `table--compact` tightens the rows for dashboards. Status in a cell is a status chip.

**Narrow screens.** Put the table in `.table-wrap`. In a grid, use `minmax(0, 1fr)` for its track or `min-inline-size: 0` on the grid child that contains the wrapper. Keep a visible note as a sibling after the wrapper (`.table-note`) and point the table’s `aria-describedby` to its ID. The note wraps to the available width while the columns scroll. A native `<caption>` remains appropriate for a table that fits.

**Changes over time.** Pair a signed value and its comparison period with `graph-up` or `graph-down`. The arrow says which way the number moved. Use success for improvement and danger for deterioration on an active control; a drop in error rate is an improvement. Keep neutral or unchanged metrics gray. Keep the signed value readable without the icon or its color.

**Code.** `components/table.css`. No script. Tables inside a long read take the same look from *Prose*.
