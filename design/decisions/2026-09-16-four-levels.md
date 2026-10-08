---
type: Decision
title: Four surface levels, not eight
description: The v1 brand had eight surface tokens; in practice people picked the wrong one. v2 has four levels.
status: working
date: 2026-09-16
tags: [surfaces]
tokens: [--surface-sunken, --surface-base, --surface-raise-1, --surface-raise-2]
---

**Context.** v1 shipped eight surface tokens (`--surface-background-*` and `--surface-foreground-*`). Too many levels to use correctly, and in dark mode one of them jumped 24 points of lightness in a single step, so cards read far too light.

**Decision.** Four levels: one below the page, the page, and two above.

**Alternatives.** Keeping eight, which had already shown it couldn't be used consistently. Which direction elevation runs was left open at the time and decided separately.

**Consequences.** Every v1 surface maps onto one of four levels, which is design work for each site as it migrates. Light mode can't gain a fifth level: white is its top level (see the surfaces foundation).

**Revisit when.** A real design needs a level the four can't express.
