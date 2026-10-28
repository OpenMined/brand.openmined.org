---
type: Decision
title: Red moves toward rose (trial)
description: The red hue rotates about 4° toward magenta, with a touch more chroma, so it reads as OpenMined's red rather than a generic one. Lightness is unchanged; the previous red is kept as a backup.
status: working
date: 2026-10-12
tags: [color]
tokens: [--red-key, --danger-key]
---

**Context.** Ink's red (key hue 24) reads as a generic red. The live site's rose red and the magenta in its CTA raster (hue 353) sit well toward magenta, and v2's red and violet (hue 300) leave a wide gap between them.

**Decision.** Try a red pulled slightly toward rose: the light-mode key is `oklch(0.55 0.17 20.6)` (design lead, 2026-10-12), which lands on `#c13b44` (hue 21.1 after rounding to hex). Every pinned red step rotates by the same 3.7° and takes the same chroma increase (× 1.033), keeping its lightness; the generated steps (50, 400, 900, 950) follow. The shared lightness ladder holds, and contrast is unchanged: white on the key 5.28:1, `--danger-fg` 6.69:1 on the page in light mode and 5.60:1 in dark.

**Tried first.** Hue 16.8 the same day read too pink and was dropped.

**What moves with it.** Everything that names red: `--danger-*` (status), the gradient's red stop and the colorflow, the red chart series.

**Backup.** The previous red stays in `tools/palette/inputs.json` under `hues.red.backup_2026_10_12`. Move it back to `pinned` and run `npm run tokens` to restore it. Its pinned steps: 100 `#ffefee`, 200 `#ffd1cd`, 300 `#fca29c`, 500 `#b94644`, 600 `#9b3031`, 700 `#612e2c`, 800 `#3a211f` (base values, before the mode offset).

**Revisit when.** Reviewed in use, especially as the danger color, where a rose red has to still read as an error.
