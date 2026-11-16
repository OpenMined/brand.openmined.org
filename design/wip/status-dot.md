---
type: Component
title: Status dot
description: "The status chip's dot on its own: 8px in the status's key, or a ring for no status. For where a chip is too much."
status: draft
from: "The reporting dashboard's Goals page (status menu, gap chips), 2026-11-09"
waiting:
  - "Its size: 8px here; the chip's dot is 6px"
  - "Released in status-chip.css or its own file"
tokens: [--success-key, --warning-key, --danger-key, --info-key, --line-strong, --radius-full]
---

**For.** A status beside a name where a chip would be too much: in a menu's items, a dense row, a legend. The status is said in words beside it; the dot is the only color (*Color tells a story*).

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only. |
| Color modes | The keys; the ring follows the mode. |
| No status | A ring in `--line-strong`, so "none" never reads as a gray status. |
| Accessibility | Decoration (`aria-hidden`); the words beside it say the status. |
| Uses | The menu's pick-one items, here; the avatar has its own dot (ringed in its ground). |

*Open:*
- 8px or the chip's 6px.
- One file with the chip (`status-chip.css`, as `.status-dot`), since it's the chip's dot.
