---
type: Decision
title: Iconoir for v2 icons
description: v2 takes its icons from Iconoir's outlined set instead of Ionicons. Icons are outlined and one color.
status: working
date: 2026-10-09
tags: [icons]
---

**Decision.** v2's icon library is **Iconoir** (regular, outlined, 24px grid; MIT), drawn at a **2 stroke** instead of Iconoir's 1.5, to match the live site's weight and render at full color. Icons are outlined and one color; status icons take their status color. Brand logos come only from the partner marks, never from Iconoir. v1 and the live site keep their current icons until v2 is released.

**Why.** The live site's icons are already mostly outlined and one color, but from mixed sources: a hosted set of 61 with 2px and 1.5px strokes (five already Iconoir) and Ionicons on opt-in pages. Iconoir's regular set gives one family across 1,383 icons, and of the live site's 53 non-brand icons, 49 have an Iconoir counterpart (36 the same idea, 11 the closest one, 2 status icons) and 4 have none. Its filled set covers only 288, so outlined is the only style it can deliver in full. Icons are inlined at build time from the package, with no CDN.

**Decided by** Kyle, 2026-10-09 ("outlined is right… monocolor"; "iconoir will be for v2").

**Revisit when** an icon OpenMined needs has no good Iconoir match often enough to call for a set of our own.
