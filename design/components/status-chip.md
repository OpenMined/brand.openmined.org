---
type: Component
title: Status chips
description: "A short label that says a thing's status. Quiet: a gray ring and gray text with a dot in the status's color. Strong: the status's key as the fill, a white label, no dot. Fully round."
status: released
tags: [interface]
tokens: [--success-key, --warning-key, --danger-key, --info-key, --on-key, --text-body, --line, --emphasis, --on-emphasis, --radius-full, --stroke-sm, --font-size-xs, --spacing-md]
---

**Anatomy.** A label of a word or two, caption size (weight 500), fully round (`--radius-full`), 12px each side (`--spacing-md`), quiet and strong alike. Not interactive: a chip that does something is a button, and pills are kept for what isn't (buttons are rounded rectangles).

**Statuses.** Four, each a hue by role: success (green), warning (amber), danger (red), and info (blue). The mapping lives on *Color*; a chip names the status, never the hue.

**Quiet** (the default). A gray ring (`--line`, 1px) and gray text (`--text-body`), with a 6px dot in the status's `key` before the label. The dot is the only color, so a column of chips reads as one gray list with a few points of color, in either mode. Use it wherever chips repeat: a column of statuses in a table, a stack on a card.

**Strong.** The status's `key` as the fill, `--on-key` as the label: white (*Color fills use the key*). No dot: the fill is the color. Use it for the one status that has to be seen first: an error on a page, a release status. White on the key is under 4.5:1 on success and warning, which is accepted for chip labels (decision *Four roles per hue; one white label on the key*).

**Without a status.** The quiet chip has no dot, a gray ring and gray text; the strong one fills with `--emphasis` and labels in `--on-emphasis`, as the primary button does.

**Code.** `components/status-chip.css`, no script. Plain CSS, no build step: load the v2 tokens first. The markup to match is at the top of the CSS file (`components/README.md`).
