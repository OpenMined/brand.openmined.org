---
type: Decision
title: "Type: display leading and tracking, two h5–h6 treatments, AA muted text"
description: "The type round's picks: a tight leading ramp with slight display tracking; h5 and h6 as page and long-read treatments; 12px captions; gray 400 and 500 retuned so muted text passes AA; dividers one step darker in light; the pull quote wide, on a left line."
status: working
date: 2026-10-28
tags: [typography]
tokens: [--line-height-h1, --line-height-h2, --line-height-h3, --line-height-h4, --tracking-display, --font-size-h5-max, --font-size-h6-max, --font-size-prose-h5-max, --font-size-prose-h6-max, --font-size-xs, --text-muted, --line, --gray-400, --gray-500]
---

**Context.** v2 type was carried from openmined.org with obvious cleanup. The type round (`/rounds/type/`) showed the calls that change how it looks, with today's value first in each.

**Decision.** Kyle, 2026-10-28.
- **Display headings:** the tight leading ramp (h1 1.05, h2 1.1, h3 1.15, h4 1.2) with slight tracking on the display face (−0.01em, `--tracking-display`).
- **h5 and h6:** keep the website's two treatments. Page styles are the default, the ones an app interface or a presentation would pick: Inter 400, 18–21 and 16–20px. Long reads keep theirs: Inter 600, 18–20 and 16–18px. Other long-read variations may come as reviews go on.
- **Caption:** `--font-size-xs` is 12px (was 11), the caption's size.
- **Muted text:** gray 400 and 500 retuned (400 10% toward 300, 500 20% toward 600), so `--text-muted` reaches 4.5:1 on every surface in both modes. It still names its step.
- **Dividers:** `--line` in light mode is one step darker (gray 300), so it shows on the sunken level.
- **Pull quote:** wide, on a left line: the display face at h3 size, the line style at its left, in the wide zone of an article.

**Alternatives.** Even 1.2 leading and no tracking (the website's values). One h5–h6 treatment everywhere. An 11px caption. Muted kept off the two levels where it fell short. A pull quote between two lines, or open and centered.

**Consequences.** The text and line roles are `working`. Every surface's muted text, the light focus line and the dark field edges gain a little contrast from the retune.

**Revisit when.** Real pages on the redesigned openmined.org show a level reading wrong.
