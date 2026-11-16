---
type: Component
title: Avatars
description: "A person as a small circle: their photo, or their initials in the sunken well. Never colored per person; a status may sit on it as a dot."
status: released
tags: [interface]
tokens: [--surface-sunken, --text-muted, --emphasis, --on-emphasis, --surface-base, --surface-raise-1, --success-key, --warning-key, --danger-key, --info-key, --radius-full]
---

**When.** Showing who: an owner, an assignee, the people on a team. Beside the name (`.person`) in lists and tables; alone only where the name is in reach (a tooltip, the row).

**Anatomy.** A circle in four sizes: 20 (`--sm`), 24 (`--md`), 32 (the default) and 40 (`--lg`). A photo fills it. Initials are the first and last, uppercase, at 0.42 of the size.

**Fill.** The sunken well with muted initials. The strong gray (`--strong`: `--emphasis`, `--on-emphasis`) is for where an avatar must stand out. Never a hue per person (*Color tells a story*).

**Status.** A dot in the status's key over the bottom end, a quarter of the avatar (6px at least), ringed 2px in the ground it sits on (`--avatar-ground`: the page, or raise-1 on a card; set it elsewhere). The dot is decoration: say the status in words where someone reads it (the row's status chip, the tooltip).

**Markup.** `aria-hidden="true"` on the avatar: the name beside it says who. Alone, it needs the name as its label. Not interactive: the name, or the row holding it, is what you act on.

**Code.** `components/avatar.css`. No script.

*Open:* whether all four sizes are needed.
