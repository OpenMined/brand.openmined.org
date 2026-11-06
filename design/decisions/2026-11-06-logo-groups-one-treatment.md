---
type: Decision
title: Logos in a group all follow the mode, or all sit on white
description: A group of logos in one layout takes one treatment, all following the color mode or all on white plates. A logo that can't follow the mode sits on white; a group that follows the mode takes every organization's checked one-color file, and the build rejects one without.
status: released
date: 2026-11-06
tags: [logos]
---

**Context.** *Logo images sit on white* put logos supplied as images on white plates; vector organization logos had no rule. Some organization logos can't follow the color mode (images, detailed seals, multi-color marks), while tool marks always can, and a layout mixing the two treatments reads as broken. One-color versions made by swapping `currentColor` into color logos at build had also hidden one logo entirely (a mask lost its white fill).

**Decision.** The design lead, 2026-11-06.
- **One treatment per group.** Logos shown together in one layout either all follow the color mode, in one color, or all sit on white plates as supplied.
- **What can follow the mode.** Tool marks, and organizations with a checked one-color file in the registry (`orgs.json`, the owner's own where one exists). Any other logo only ever sits on white, and takes its group with it.
- **Enforced.** A group that follows the mode takes each organization's one-color file through `orgMono()`; one without stops the build, naming the logo and the fix: bring in its one-color file (`npm run logos:import`), or put the group on white plates.
- **No one-color versions made by recoloring.**
- *Logo images sit on white* is replaced by *Logos in a group all follow the mode, or all sit on white*.

**Alternatives.** Organization logos on white by default, following the mode only alone: rules out a designed one-color strip like the home page's partnerships. Recolor at build to make a strip fit: recolors other organizations' marks and can break them.

**Revisit when.** Groups regularly need a logo that has no one-color form and the white plate doesn't suit the layout.
