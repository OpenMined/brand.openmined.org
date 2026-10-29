---
type: Behavior
title: Shadows apply at rest
description: Shadows belong to the levels and show at rest. Hover modifies them, only on links and buttons, and only along the ladder.
status: released
tags: [surfaces]
tokens: [--shadow-sunken, --shadow-raise-1, --shadow-raise-2]
---

**Rule.** An element at a level casts that level's shadow at rest. Hover changes the shadow only on interactive elements (links, buttons, anything with `role="button"`). A state can move an element along the ladder of levels, never to a shadow of its own.

**States.**
- *Rest:* the level's shadow.
- *Hover* (interactive elements only): one level up the ladder, surface and shadow, as the hover card and link card do.
- *Focus, on fields:* the inset with the `--line-focus` line (*Form controls*); a field is flat until focused.

**Context.** A shadow falls on the ground *beneath* an element, so its color belongs to that ground. Inside a dark section on a light page, raised elements cast the dark-mode shadow.

**Full-bleed bands cast nothing.** A sticky header that covers content may be the exception; still open.

**Accessibility.** A shadow is never the only focus indicator: fields and controls show focus with the `--line-focus` line, which reaches 3:1 (WCAG 2.4.7 and 1.4.11).
