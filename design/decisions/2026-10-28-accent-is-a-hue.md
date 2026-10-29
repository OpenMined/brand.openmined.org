---
type: Decision
title: "The accent is a hue; the gray fill is emphasis"
description: "The accent points at green and takes a hue's four roles, as the statuses do; the primary button's gray fill becomes --emphasis with --on-emphasis. Elements stay gray at rest."
status: released
date: 2026-10-28
tags: [color, interface]
tokens: [--accent-subtle, --accent-soft, --accent-fg, --accent-key, --emphasis, --on-emphasis]
---

**Context.** The accent had seven roles, set while it was grayscale: `solid`, `hover`, `on`, `subtle`, `soft`, `fg` and `key`. Only `solid` (the primary button's gray fill), `on` (its label) and `key` (green, the one colored role) were used. The hues had just gone to four roles each, and the accent's only color has ever been green.

**Decision.** Design lead, 2026-10-28.
- **The accent is a hue.** `--accent-subtle`, `--accent-soft`, `--accent-fg` and `--accent-key` point at green's roles, as `--success-*` does; its label is `--on-key`. Changing the accent means changing one hue.
- **Gray at rest.** The accent doesn't color anything at rest; it arrives with interaction (*Interactive layers*).
- **The gray fill is emphasis.** The primary button's fill and label become `--emphasis` and `--on-emphasis`, the established names for a strong neutral fill and its label, with the same values. `--accent-solid`, `--accent-hover` and `--accent-on` are removed.

**Alternatives.** Keep seven accent roles until a colored accent is decided: three would stay unused, and `--accent-solid` would be the system's only "solid", in gray. Make the primary button green at rest: decided against for now.

**Consequences.** Builds on *Accent stays a semantic role*: the accent is still a role, now a pointer to a hue. *Color*, *Use accent by intent*, *Buttons* and *Color fills use the key* say so. The review rounds and page reviews read the new names with the same values.

**Revisit when.** The primary button, or anything else, takes a color at rest, or a second accent hue is needed.
