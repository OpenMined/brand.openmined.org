---
type: Component
title: Status dots
description: "A status as an 8px dot beside the words that say it, where a chip would be too much: in a menu's items, a dense row, a legend."
status: released
tags: [interface]
tokens: [--success-key, --warning-key, --danger-key, --info-key, --line-strong, --radius-full]
---

**When.** A status beside a name where a chip would be too much: a menu's items, a dense row, a legend. The status is said in words beside it; the dot is the only color (*Color tells a story*).

**Anatomy.** 8px, fully round, in the status's key (success, warning, danger, info). No status is a ring in `--line-strong`, not a gray fill, so "none" never reads as a muted status.

**Markup.** Decoration: `aria-hidden="true"`; the words beside it say the status. The avatar has its own dot, ringed in its ground (*Avatars*).

**Code.** `components/status-dot.css`. No script.
