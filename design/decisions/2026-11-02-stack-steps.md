---
type: Decision
title: "Stack steps"
description: "A stack's default is lg (16px), the same as a long read's gap between blocks; it takes any spacing step from 2xs to 5xl, and a heading gets two steps more than the stack's own."
status: released
date: 2026-11-02
tags: [layout]
---

**Context.** The first stack (*Space belongs to the container*) defaulted to `md` (12px), offered `xs` to `2xl` (6 to 24px) and put a fixed `2xl` (24px) above a heading. On the overview, `.stack--xl` read as large but is 20px, the seventh of eleven steps; the range stopped below what sub-sections inside a section need (32–48px); and the fixed heading space was barely more than an `xl` stack's own and equal to a `2xl` stack's.

**Decision.** Design lead, 2026-11-02. **Default `lg`** (16px), the gap between blocks in a long read, so the stack and prose share a base step. **Every step** from `2xs` to `5xl` as `.stack--{step}`, named after the spacing tokens so a step reads straight off the scale. **A heading after anything but another heading gets two steps more** than the stack's own (`lg` 24, `xl` 32, `2xl` 40, `3xl` 48), capped at `5xl` (48), with the section step above a `5xl` stack's heading. Replaces the first stack's default, range and fixed heading space; the rule that the container sets the space stands.

**Alternatives.** Names by role (tight, default, loose, section): easier to guess, but a second vocabulary over the spacing scale, and agents map token names directly. A fixed heading space: no hierarchy in large stacks.

**Revisit when.** The site's own grids and margins have moved to stacks, and the steps they reach for show whether every step earns its class.
