---
type: Decision
title: "Raised levels may sit inside an outline"
description: "A card or band on its own level, with its shadow, may sit inside an outlined area; the outline keeps the page's surface on both sides. Settles the open question in Outlines are lines."
status: working
date: 2026-10-28
tags: [surfaces]
tokens: [--line-strong, --stroke-sm, --surface-raise-1, --shadow-raise-1]
---

**Context.** *Outlines are lines, not containers* (2026-10-12) allows an outline only where the same surface shows on both sides of it, and left one question open: may something on a raised level sit inside an outlined area? Two built cases put it in practice: the home page's "Start your own federated sub-network" hover card (raise-1, with its shadow) inside the outlined federated-network section, and the system diagram on the overview, whose outlined outer sections hold surfaces.

**Decision.** Yes, for now (Kyle, 2026-10-28). Both cases were reviewed and approved as working styles. The outline still has the page's surface on both sides of its line; what sits inside is on its own level, with its shadow as its edge. A bordered box with a different fill as its ground stays out.

**Alternatives.** Keep raised levels out of outlined areas: the sub-network card would go flat and the system diagram would lose its surfaces. Leave it open: both reviewed pieces would stay without a rule behind them.

**Consequences.** The guideline names both as its examples. When guidance files get examples beside them (planned), these two are the first for *Outlines are lines*.

**Revisit when.** An outlined area with raised content starts reading as a bordered container.
