---
type: Component
title: Tables
description: "Rows of data or a comparison: small text, rows divided by the lighter line, no fills and no box. Rows you act on take the hover wash."
status: released
tags: [interface]
tokens: [--line, --stroke-sm, --font-size-sm, --text-headline, --text-body, --surface-sunken]
---

**Anatomy.** Small text (14px) at text leading; each row divided from the next by the lighter line (`--line`); headers in the headline color at 600. No fills, no zebra stripes, no outer box (*Outlines are lines*; dividers separate). Numbers line up: `.num` right-aligns a column with tabular figures (*Typography*). A caption sits below in small muted text.

**Rows you act on.** In a table where a row opens or selects something (`table--rows`), a row takes the sunken wash on hover and the current row keeps it, as any gray item does (*Interaction states*).

**Dense.** `table--compact` tightens the rows for dashboards. Status in a cell is a status chip.

**Narrow screens.** Wrap the table in `table-wrap`, which scrolls sideways rather than squeezing the columns.

**Code.** `components/table.css`. No script. Tables inside a long read take the same look from *Prose*.
