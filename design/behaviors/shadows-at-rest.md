---
type: Behavior
title: Shadows apply at rest
description: Shadows belong to the levels and show at rest. Hover modifies them, only on links and buttons, and only along the ladder.
status: working
tags: [surfaces]
tokens: [--shadow-sunken, --shadow-raise-1, --shadow-raise-2]
---

**Rule.** An element at a level casts that level's shadow at rest. Hover changes the shadow only on interactive elements (links, buttons, anything with `role="button"`). A state can move an element along the ladder of levels, never to a shadow of its own.

**States.**
- *Rest:* the level's shadow.
- *Hover* (interactive elements only): a modified shadow. How much is still to tune.
- *Focus, on text fields:* the inset recess is the focus state; a field is flat until focused.

**Context.** A shadow falls on the ground *beneath* an element, so its ink belongs to that ground. Inside a dark section on a light page, raised elements cast the dark-mode shadow.

**Full-bleed bands cast nothing.** A sticky header that covers content may be the exception; still open.

**Accessibility.** On text fields the inset shadow is the only focus indicator, so its strength must meet 3:1 contrast (WCAG 2.4.7 and 1.4.11). It may need to sit one rung deeper than the resting state.
