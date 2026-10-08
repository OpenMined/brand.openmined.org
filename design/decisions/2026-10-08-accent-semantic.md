---
type: Decision
title: Accent stays a semantic role
description: Accent stays a role even while it's grayscale, so a future accent color needs no untangling.
status: working
date: 2026-10-08
tags: [color, interface]
tokens: [--accent-solid]
---

**Context.** Accent came from the color round, as every reviewed system has one (Primer `accent`, Atlassian `brand`, Material `primary`). The round's accent setting was never decided: "none" (grayscale) was the review's default.

**Decision.** Keep `accent` as a semantic role. If it stays grayscale, that's fine; if it gets a color, nothing has to be untangled from the roles it currently matches.

**Condition.** It only works if authors pick by intent; see [Use accent by intent](#guidelines-accent-by-intent).

**Revisit when.** The interface round decides whether OpenMined has a colored accent.
