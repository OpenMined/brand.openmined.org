---
type: Guideline
title: Grays are set, not washed
description: "A gray is a token or a gray step chosen for each mode, never a color at an opacity over whatever is beneath it. Keep a wash only where the alternative costs more than it's worth."
status: released
tags: [color, surfaces]
tokens: [--surface-sunken, --line, --emphasis]
---

**Rule.** When an element needs a gray (a track, a divider, a fill behind a label), use a gray token (a surface, a line, `--emphasis`) or a gray step set for each mode. Don't make one by laying the headline color, black or white at an opacity over the surface.

**Why.** A wash takes its color from whatever is under it, so every surface makes a new, off-palette gray, and the brand's grays stop being a set. If the system shows washes as the easy answer, they show up everywhere.

**Exceptions.** Where a set gray can't do the job without far more work: an element that has to read over imagery or a moving graphic, and the interaction washes built into the components (a table row's hover, a wash nav item, pressed). Say why where it's used.

**Example.** The meter's track is the sunken level on a card, not the headline color at 20% (decision *A meter's track is sunken, on a raised surface*).
