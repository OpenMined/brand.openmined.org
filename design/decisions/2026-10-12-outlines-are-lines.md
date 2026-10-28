---
type: Decision
title: Outlines are lines, not containers
description: An outline is allowed when the same surface shows on both sides of it. What stays out is the bordered box with a different fill inside.
status: working
date: 2026-10-12
tags: [surfaces, interface]
tokens: [--line-strong, --stroke-sm, --stroke-md]
---

**Context.** Applying v2 to the live home page (the page reviews) lost a section Kyle liked: "The Federated AI Network", a card drawn as a thin outline with the colorflow showing through it. Dividers-only ruled it out. Reviewing it with Bennett, the dislike turned out to be narrower than "outlines": the infographics round's outer outlines and the outlined secondary button both read well, and both show the same surface inside and out.

**Decision.** Outlines come back as lines: thin and stark, with the same fill inside and outside. What stays out is the app-style bordered container, an outline around an area with a different fill inside (Bennett: "is just like everywhere now"). A card that sits on a different level still uses its level and shadow as its edge, never a border. Outlines are 1px (`--stroke-sm`) in `--line-strong`; a graphic's outer outline may take `--stroke-md` (1.5px). This supersedes *Dividers only* (2026-09-17).

**Alternatives.** Keep dividers-only and give up the outlined home section and the outlined secondary button. Allow outlines anywhere, the look the system set out to avoid.

**Consequences.** Line widths are tokens now (`--stroke-sm`, `--stroke-md`). `--line-strong` has a job again: outlines. Open: whether a band inside an outlined area may step up a level (the home page's "Start your own federated sub-network" row is built raise-1 to judge in context; no rule yet).

**Revisit when.** An outline starts reading as a container in practice, or the raise-1 band settles one way or the other.
