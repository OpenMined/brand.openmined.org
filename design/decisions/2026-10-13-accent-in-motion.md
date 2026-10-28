---
type: Decision
title: "Green at rest, gradients in motion"
description: "Green stays the static accent. Where the accent moves, it steps up to a gradient: the full OM gradient on button and link hover, a hue's two-tone gradient on icons."
status: working
date: 2026-10-13
tags: [color, interface]
tokens: [--accent-key, --gradient-spectrum, --gradient-two-tone-green]
---

**Context.** *Green is the accent's color* (2026-10-12) put green, `--accent-key`, wherever a color is needed and none is specified, including hover lines and button and icon hover. Then *If color, then motion* asked for color to move, and the motion round settled working favorites that move through gradients: buttons (option E), links (option B) and icons (option E, two-tone).

**Decision.** Two levels of accent (design lead, 2026-10-13). **At rest, static:** green, `--accent-key`, as before, for a color with no motion (a page's alternate color, colored fills, focus). **In motion, a step up:** the accent becomes a gradient. Button hover fills with the full OM gradient flowing under a grayscale shimmer; a content link's hover line is the full OM gradient flowing, with a glow; an icon in color takes its hue's two-tone gradient, moving. Every hover starts on green, so the step up begins where the static accent is.

**Alternatives.** Green moving on its own (the motion round's button B), which read well but only shimmered one hue. The spectrum everywhere, static color included, which breaks *if color, then motion* wherever nothing moves.

**Consequences.** Hover is no longer a green fill or a green line; `button.md`, `link.md` and the color foundation say so. The white label on a button dips in contrast while pale stops (gold, yellow, lime) pass behind it; accepted for now. `--gradient-interactive` (hue keys only) is kept as the fallback if that changes. *Green is the accent's color* still holds for static color.

**Revisit when.** The brand owner reviews the motion on the preview, or label contrast on hover becomes a requirement.
