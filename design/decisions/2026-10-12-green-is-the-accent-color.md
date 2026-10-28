---
type: Decision
title: Green is the accent's color
description: Where a color is needed and none is specified, use green through the new --accent-key. Buttons stay grayscale at rest and take it on hover.
status: working
date: 2026-10-12
tags: [color, interface]
tokens: [--accent-key, --green-key]
---

**Context.** Applying v2 to openmined.org's home and SyftHub pages (the page reviews) turned up several places that need a color with none assigned: the hover line on links, icon and button hover, and SyftHub's alternate color, which the live site draws in green. Picking a hue each time would scatter them. Teal was tried first the same day, then changed to green (Kyle, 2026-10-12).

**Decision.** Green is the accent's color, through a new role, `--accent-key` (the green key). It's used:
- for hover lines on links and text buttons (the content link's line was the teal key from 2026-10-09; it moves to green);
- for icon hover;
- for button hover: both the solid and the quiet button fill green, with a white label;
- as a page's alternate color when one isn't specified (SyftHub keeps green, now the accent key).

The rest of the accent stays grayscale: buttons are unchanged at rest (Kyle, 2026-10-12).

**Also.** A page with a color theme keeps to one hue throughout (SyftHub: its title, labels, button, step markers and connector all take green).

**Watch.** White on the green key is 3.84:1 (button hover labels) and the key as text is 3.47–4.51:1 (light mode lowest; hover lines don't carry text), both under AA's 4.5 for body-size text. The strong status chips carry the same flag.

**Revisit when.** The interface round decides whether the whole accent takes a color.
