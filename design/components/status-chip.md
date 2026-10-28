---
type: Component
title: Status chips
description: "A short label that says a thing's status. Quiet: a ring and text in the status's color, no fill. Strong: the status's key as the fill, a white label. Fully round."
status: working
tags: [interface]
tokens: [--success-fg, --success-key, --warning-fg, --warning-key, --danger-fg, --danger-key, --info-fg, --info-key, --on-key, --radius-full, --stroke-sm, --font-size-xs]
---

**Anatomy.** A label of a word or two, caption size (12px, weight 500), fully round (`--radius-full`). Not interactive: a chip that does something is a button.

**Statuses.** Four, each a hue by role: success (green), warning (amber), danger (red), and info (blue). The mapping lives on *Color*; a chip names the status, never the hue.

**Quiet** (the default). No fill: a 1px ring and the text in the status's `fg` role, over whatever surface the chip sits on, so the ring is a line, not a container. Use it wherever chips repeat: a column of statuses in a table, tags on a list.

**Strong.** The status's `key` as the fill, `--on-key` as the label: white (*Color fills use the key*). Use it for the one status that has to be seen first: an error on a page, a release status. White on the key is under 4.5:1 on success and warning, which is accepted for chip labels (decision *Four roles per hue; one white label on the key*).

**Without a status.** The quiet chip draws in the body text color; the strong one fills with the headline color and labels in the page's own color, for a neutral label.

**Code.** `components/status-chip.css`, no script. Plain CSS, no build step: load the v2 tokens first. The markup to match is at the top of the CSS file (`components/README.md`).
