---
type: Guideline
title: Logos in a group all follow the mode, or all sit on white
description: A group of logos in one layout takes one treatment. Either every logo follows the color mode, in one color, or every logo sits on a white plate as supplied. A logo that can't follow the mode only ever sits on white.
status: released
tags: [logos]
---

**Rule.** Logos shown together in one layout (a strip of partnerships, a press room, a grid of tools) take one treatment. Either every logo follows the color mode, in one color, the text color around it, or every logo sits on a white plate (`--white`), as its owner supplied it. Never a mix in one view.

**Which logos can follow the mode.** Every tool mark can (`public/logos/tools/`: *Tool marks follow the color mode*). An organization's logo can when the registry holds a checked one-color file for it (`mono` in `public/logos/orgs/orgs.json`, the owner's own where one exists). A logo we can't control in the mode (supplied only as an image, a detailed seal, a multi-color mark with no one-color form) only ever sits on white, alone or in a group, and so does every logo grouped with it.

**A group that follows the mode.** A layout designed to follow the mode, like the home page's partnerships, takes each organization's one-color file from the registry (`orgMono()`, `src/lib/orgs.ts`). Adding an organization without one stops the build, with the reason and the fix: bring in its one-color file (`npm run logos:import -- <slug> --mono <file>`, which checks it), or show the whole group on white plates.

**Don't.** Make a logo fit by recoloring it: swapping `currentColor` into a color logo's fills recolors someone else's mark, and can break it outright (a mask filled `none` hides the whole drawing). Bring in a one-color file, or use the plate.

**Seals and emblems.** Government seals and the UN emblem are protected by law: don't put one on a page unless OpenMined has the owner's permission.

**Why.** A row where some logos follow the mode and some sit on plates reads as broken. Organizations come and go, any one can be named at any time in whatever files it publishes, and many are drawn only for white, so the group takes the treatment every logo in it can hold.
