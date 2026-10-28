---
type: Decision
title: "Article zones are set apart from the grid"
description: "The article's reading column and wide zone are their own values (640 and 860px), not grid spans, so a reading measure can be tuned without moving the grid; the full zone stays the page width."
status: working
date: 2026-10-27
tags: [layout]
tokens: [--prose-content, --prose-wide, --prose-full, --grid-span-6, --grid-span-8]
---

**Context.** The article grid (`.prose-article`, from openmined.org's blog) places blocks by named zones: `content`, `wide` and `full`. On the live site the zones' widths read the grid spans directly (`--col-6`, `--col-8`), and the first v2 tokens did the same (`--prose-content` → `--grid-span-6`, `--prose-wide` → `--grid-span-8`). Tuning the reading column would then have meant changing a grid span, moving every layout that uses it.

**Decision.** Design lead, 2026-10-27. `--prose-content` (640px) and `--prose-wide` (860px) are values of their own. They start equal to six and eight columns, so nothing moves. A reading width is a typographic measure and is tuned as one; the grid spans keep their layout use. `--prose-full` stays a reference to `--page-width`: a full breakout means the page.

**Alternatives.** Zones as grid spans, as on the live site: one source for both, but the reading column can't change alone.

**Consequences.** A grid retune no longer moves articles on its own; whoever retunes the grid checks whether articles should follow. The mechanism is unchanged: blocks are placed by zone name (`grid-column: content`, `wide`, `full`), never by column.

**Revisit when.** The type round sets a reading measure (it may be set in `ch` rather than px).
