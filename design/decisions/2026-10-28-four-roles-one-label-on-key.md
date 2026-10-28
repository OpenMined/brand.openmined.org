---
type: Decision
title: "Four roles per hue; one white label on the key"
description: "Each hue and status keeps subtle, soft, fg and key. solid, hover and the per-hue on are gone: the key is the colored fill, and one token, --on-key, labels it in white in every hue and both modes, below AA on green, amber and teal, accepted."
status: working
date: 2026-10-28
tags: [color, interface]
tokens: [--on-key, --green-key, --amber-key, --teal-key]
---

**Context.** Each hue and status carried seven roles. Two weren't used by anything: `solid`, a fill for a label, which *Color fills use the key* had already replaced with the key, and `hover`, one step past it, which the moving button hover replaced. `solid` was also where colored fills looked washed out: in dark mode it was step 300, a pastel, with a dark label. The 2026-09-24 decision *One label color per step; the key carries no text* still said no text sits on the key, while strong status chips put white text on it.

White on the key measures 5.9:1 on violet, 5.4 on blue, 5.3 on red, 4.3 on teal and 3.8 on green and amber, the same in both modes, since the key is the same step in both. AA for normal text is 4.5:1.

**Decision.** Design lead, 2026-10-28. Each hue and status keeps four roles: `subtle`, `soft`, `fg` and `key`. `solid` and `hover` are removed, and so is the shared `--on-solid`. The key is the colored fill. One token labels every key: `--on-key`, white in both modes. A per-hue `on` would hold the same value ten times, and suggest the labels could differ. The keys keep their values: no hue is darkened to reach AA, and no hue takes a dark label. Labels on teal, green and amber stay below AA for normal text, accepted as legible enough for chip and button labels.

**Alternatives.** A dark label on green and amber (4.8:1), with teal nudged 1% darker: every hue passes, but a row of fills mixes white and dark labels. Darker green and amber keys: white passes everywhere, but every graphic in those hues gets deeper and browner, since the key is the graphics color. A separate, darker fill step for those hues: the palette has none between 500 and 600, and 600 reads muddy. White everywhere was chosen to keep the brand colors and one label color.

**Consequences.** Supersedes *One label color per step; the key carries no text* (2026-09-24). *Color*, *White on every colored fill* (formerly *One label color per step*), *Color fills use the key* and *Status chips* say so; status chips draw their strong label with `--on-key`. The accent keeps its own roles (`--accent-solid` is the gray primary button) until the accent round.

**Revisit when.** Colored fills carry text people must read to act on, or OpenMined commits to AA for interface text.
