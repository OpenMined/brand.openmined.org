---
type: Decision
title: "Stacks are even"
description: "A stack puts the same space between all its children; a heading is kept with its content by nesting a tight stack inside a looser one, as established stack components do. Replaces the extra space above a heading from Stack steps."
status: released
date: 2026-11-02
tags: [layout]
---

**Context.** *Stack steps* gave a heading two steps more space above it than the stack's own. Research into how organizations use stacks (Primer, Atlassian, Polaris, Carbon, MUI, Chakra, Braid; Every Layout and the `.flow` utility) found the principle, the container sets the space, well established, but no stack that treats headings differently: they space every child evenly and keep a heading with its content by nesting. Spacing that reads which element follows which belongs to prose, which every prose system does. The extra rule was ours alone, and a second spacing behavior to learn.

**Decision.** Design lead, 2026-11-02. **Stacks are even**: the same space between every pair of children, `lg` by default, any step from `2xs` to `5xl`. **Nest to group**: a tight stack holds a heading and its text, a looser one spaces the groups. **Use a stack where you compose without writing CSS** (an artifact, a page on `/omds.css`); in your own stylesheet, a container's `gap` is the same principle. Only places where an element carries its own margin are fixed; containers that already space their children with `gap` stay as they are. Replaces *Stack steps*' heading rule; its default and range stand.

**Alternatives.** Keep the heading rule: one fewer element in the markup, but a behavior no other stack has. Elements carrying a bottom margin with utilities to override (Bootstrap, GOV.UK): established for class-based websites, but it puts the space on the element, which is what *Space belongs to the container* rejects.

**Revisit when.** Agents or people building from the served files keep reaching for margins, or nesting proves heavy in practice.
