---
type: Decision
title: "A meter's track is sunken, on a raised surface; no opacity grays"
description: "The meter's track becomes the sunken level instead of the headline color at 20%, so a meter sits on a card, never on the page; table rows highlight with a faint gray wash so the track still reads. Fills don't change color with the amount. Replaces 2026-11-04 on the track."
status: released
date: 2026-11-06
tags: [interface, surfaces]
tokens: [--surface-sunken, --gray-950, --state-hover-wash, --emphasis]
---

**Context.** The meter's track was the headline color at 20% over whatever was under it, so it read anywhere. In review the opacity wash was the concern: if the system shows a wash of its main colors as the way to get a gray, those in-between grays show up everywhere and the brand's grays stop being a set. A test dashboard's progress bars, a light fill over a sunken track on cards, worked well, and worked *because* they sat on cards. Design review, 2026-11-05.

**Decision.** Design lead and brand owner, 2026-11-05.
- **The track is `--surface-sunken`**, and a meter sits on a raised surface (raise-1 at least). A thin sunken track **never sits on the page**; other recessed controls only prefer a raised surface.
- **The track never changes.** Table rows you act on highlight with a faint wash of gray 950 (`--state-hover-wash`, 5% in light and 18% in dark, on hover and when current) instead of the sunken level, so the track reads on a highlighted row.
- **Avoid opacity washes for grays** where a token or a set gray per mode answers it; keep a wash only where the alternative costs more than it's worth. An interaction state (a row's hover) is one such place: a faint gray over whatever surface the table sits on.
- **The fill doesn't change color with the amount**: fuller isn't always worse.

**Alternatives.** Keep the 20% wash: reads everywhere, at the cost of off-palette grays. `--line` as the track everywhere: reads on the page too, but heavier on cards. Stepping the track to `--line` on a highlighted row: the track shouldn't change on hover.

**Consequences.** Table rows stop using the sunken level for their highlight (*Interaction states*' open item on table rows is settled). Tables of meters go on a card: the dashboard example and the Interface demo move theirs. *Recessed controls prefer a raised surface* names the thin track as a no-exception case.

**Revisit when.** A meter has to sit on the page (a header, a full-width band): it needs its own track.
