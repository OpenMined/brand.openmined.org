---
type: Decision
title: "A meter for x of y, with a track that reads on any surface"
description: "A new meter component for x of y: the track is the headline color at 20% over its surface, the fill the strong gray, a small muted label. Table rows keep their sunken highlight."
status: released
date: 2026-11-04
tags: [interface]
tokens: [--text-headline, --emphasis, --text-muted]
---

**Context.** Feedback during the skill's test round (brand repo issue #44): an agent building a dashboard needed a storage meter in each table row and copied the dashboard example's local bar, whose track was `--surface-sunken`. That track nearly disappeared in dark mode (about 1.05:1 on the page) and disappeared entirely on a highlighted table row, which takes the same token. The system had no meter. Three tracks were compared in tables on the page, on a card and in an always-dark section, in both modes: a wash, an outline and a thin rail.

**Decision.** Design lead, 2026-11-04.
- **A meter component.** The track is the headline color at 20% over whatever is under it, so it reads on any surface (20%, over the 12% first tried); the fill is the strong gray; the label says *x of y*, small and muted.
- **A small value always shows**: the fill is never narrower than the bar is tall.
- **Table rows keep the sunken highlight.** The nav's wash tokens were compared on the rows; the rows stay as they are.
- The dashboard example's bars become meters.

**Alternatives.** An outline track: clearest at 0, heaviest. A thin rail under a thicker fill: lightest. Status colors by threshold (warning from 90%, danger at 100%): left out of this first version; a full meter can mean done or at the limit.

**Revisit when.** A meter needs a status color, or a size other than the table's.
