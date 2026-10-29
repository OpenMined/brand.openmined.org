---
type: Decision
title: "Status chips: full pill, contrast accepted"
description: "Status chips stay fully round, and the strong chip's white on the key is accepted for now though some statuses fall under 4.5:1. Closes the status round's two open questions."
status: released
date: 2026-10-28
tags: [interface, color]
tokens: [--radius-full, --success-key, --warning-key, --danger-key, --info-key, --white]
---

**Context.** The status chips round (2026-10-09) left two questions open: whether chips stay pill-shaped (`--radius-full`) or take `--radius-sm` (*Corners*), and whether the strong chip's white text on the status key is acceptable, since it falls under AA's 4.5:1 for some statuses (green and amber at about 3.8:1, *Color fills use the key*).

**Decision.** Chips are fully round. The strong chip's contrast is agreed OK for now (design lead, 2026-10-28). The chip becomes a v2 component (`components/status-chip.css`) and moves to the Interface page; the status roles stay on Color.

**Alternatives.** `--radius-sm`, matching the other small marks: closer to the sharp bias, but it reads as a button. A darker fill for the strong chip (the `solid` step) to reach 4.5:1: it breaks *Color fills use the key*, where every colored fill is the key.

**Consequences.** *Corners* drops the open question. The strong chip's contrast stays flagged on *Color fills use the key* until interface text is worked out.

**Revisit when.** A strong chip carries text people must read to act on (an error's message, not its label), or an accessibility review asks for AA throughout.
