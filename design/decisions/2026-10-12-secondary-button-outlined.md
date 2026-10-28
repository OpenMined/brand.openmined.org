---
type: Decision
title: The secondary button is an outline
description: Every button that isn't the group's solid one is an outline in the body text color, with no fill. It replaces the quiet button.
status: working
date: 2026-10-12
tags: [interface]
tokens: [--line-strong, --stroke-sm, --accent-key]
---

**Context.** On the page reviews, the quiet button (no fill, no outline) didn't read as a button next to the solid one (Bennett: "turns out I don't like the secondary button"). He wanted something close to the live site's outline button, without its hover, where the outline and the label turn green.

**Decision.** The secondary button is a `--stroke-sm` outline in `--text-body` with no fill and a headline label. On hover it fills with the accent key, as the solid button does, with a white label. It replaces the quiet button: the system has two button styles, solid and secondary, and text buttons cover the case with no outline. One solid button per group still holds.

**Alternatives.** Keep the quiet button as a third style. The live hover (green outline and label), which Bennett called bad.

**Consequences.** Allowed by *Outlines are lines, not containers* (same day): the outline shows the surface behind it. Still open: a subtle animated accent gradient and glow on hover (Bennett, same meeting), held until the colors are chosen.
