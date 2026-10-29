---
type: Motion
title: Motion timing
description: One duration and one easing for state changes, 0.4s at CSS's ease, with a shorthand for transitions. The color moves keep their own timings.
status: released
tags: [interface]
tokens: [--duration-base, --ease-base, --transition-base]
---

**State changes** (hover, focus, a theme switch, a surface lifting) take `--duration-base` (0.4s) at `--ease-base` (CSS's `ease`). `--transition-base` is both together, for a transition: `transition: color var(--transition-base)`.

**Coming in, going out.** A hover state may come in faster than it leaves: the field, card, and button lights fade in at 0.15s and out at the base duration, so the response feels immediate and the exit stays calm.

**The color moves keep their own timings**: the button hover's 30s loop, the icons' 4s two-tone, the link's 15s flow, the diagram pulses. They are tuned per move and recorded with it (*Color moves*, the component files), not drawn from these tokens.

**Reduced motion.** Under `prefers-reduced-motion`, movement stops and the state shows at once: colors stay, motion goes (*Color moves*).

*Open:* a second duration for larger movements (a panel opening, a page change), if one is needed; whether the 0.15s "in" becomes a token.
