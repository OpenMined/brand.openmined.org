---
type: Motion
title: Motion timing
description: Two durations (0.4s for state changes, 0.15s for a state coming in) and one easing, CSS's ease, with a shorthand for transitions. The color moves keep their own timings.
status: released
tags: [interface]
tokens: [--duration-base, --duration-fast, --ease-base, --transition-base]
---

**State changes** (hover, focus, a theme switch, a surface lifting) take `--duration-base` (0.4s) at `--ease-base` (CSS's `ease`). `--transition-base` is both together, for a transition: `transition: color var(--transition-base)`.

**Coming in, going out.** A state may come in faster than it leaves: hover and focus states, the field, card and button lights, and a tooltip opening come in at `--duration-fast` (0.15s) and go out at the base duration, so the response feels immediate and the exit stays calm. Set the base duration on the element and the fast one on its state: `transition: opacity var(--transition-base)`, then `:hover { opacity: 1; transition-duration: var(--duration-fast); }`. Something that opens and closes as one piece (a tooltip) may take the fast duration both ways.

**The color moves keep their own timings**: the button hover's 30s loop, the icons' 4s two-tone, the link's 15s flow, the diagram pulses. They are tuned per move and recorded with it (*Color moves*, the component files), not drawn from these tokens.

**Reduced motion.** Under `prefers-reduced-motion`, movement stops and the state shows at once: colors stay, motion goes (*Color moves*).

*Open:* a longer duration for larger movements (a panel opening, a page change), if one is needed. A distance for things that move into place (the tooltip rises 8px) stays with each component; it becomes a token only if several share it.
