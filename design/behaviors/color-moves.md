---
type: Behavior
title: Color moves
description: Expressive color comes with persistent motion or with an interaction. A rule, where each move can run, the moves in use, and the leanings that aren't rules yet.
status: working
tags: [color, graphics, interface]
---

**Rule.** Where color is used for expression, it moves while it's on screen, or it arrives with an interaction (decision *If color, then motion*).

**What counts as motion.**

- Persistent motion while the color is visible: an ambient loop, such as a fill or stroke that flows.
- Color that arrives with an interaction: hover, an expanded accordion, the current step of an infographic someone is stepping through.
- A one-time entrance (a fade or slide on scroll) doesn't count: once it ends, the color sits still.

**Exempt.**

- Color that carries meaning: an error's red, a status, a chart series.
- The logo.
- Reduced motion: the color stays and the motion stops.

**Where it runs.** Not every move works everywhere. Before using one, check what it needs:

- **Anywhere** (documents, slides, PDF, images): the still look only. Colors, two-tone and highlight colors, a diagram's still frame.
- **Any web page, CSS and SVG only** (HTML decks and Claude artifacts too): link hovers, the moving icon two-tone (its gradients are SVG markup).
- **Web, with a script:** button hovers, the field and hover-card pointer lights, the card tilt (the modules in `components/`, each small and standalone), diagram line pulses (`src/scripts/line-flow.ts`), and the `<om-diamond>` and `<om-stream>` embeds. A Claude artifact loads scripts only from a few public CDNs, so it can't load the brand site's embeds; paste the script in or use the still frame.
- **The brand site only:** hover card colorflows (the site's shared WebGL renderer).

Where a move can't run, use its still frame: the same colors, standing still, as under reduced motion. Never fake the motion with a different look. Interactive elements have their own plain layer for these places, built into every component: *Interaction states*.

**Moves in use.**

- **Buttons:** the hue keys flow under a faint shimmer on hover (*Buttons*).
- **Links:** a gradient line flows over the underline on hover (*Links*).
- **Icons in color:** the hue's two-tone moves inside the stroke (*Two-tone gradients*).
- **Hover cards:** a colorflow in the card's two-tone rises in its lower third (*Hover cards*).
- **Diagram lines:** each colored line's highlight travels along it, over the line at 0.8 at its center and fading in a bell to nothing at its ends; a line that drains to gray carries a highlight that turns gray with it. Rings brighten in their highlight, one after another (*Highlights*).

Small animated graphics that come and go (hover flows) share one renderer per page (`src/scripts/gl/`); the large brand graphics stay standalone embeds.

**Choosing where color goes** is a designer's call, made piece by piece: some icons stay mono and some take a colored, moving state.

**Leanings, not rules yet.**

- Avoid the kaleidoscope look: many colored, moving things in one view is the failure this rule exists to prevent. One moving group per screen isn't required; openmined.org/research shows the hero colorflow and the pillar diamonds together, and that reads fine.
- Ambient motion is slow or subtle enough that some people won't notice it.
- Interactive color stays on the element being interacted with; the rest stays gray.
- Infographics are explored step by step, with color on the step or detail in focus.

**Example.** The pillar diamonds on openmined.org/research. Each is a 22px diamond filled with a strip of the full spectrum that loops back to its first color. The strip is 8 times the diamond's width and slides one strip length every 16s, so each diamond shows about one color family at a time. The three are staggered 30% apart. A copy of the fill sits behind each one, blurred 7px at 0.35 opacity and running the same animation, so the glow moves too. Under reduced motion they stop, colored.

*Open:*
- How much color and motion one piece may carry.
- Whether filled, glowing marks like the diamonds are a separate kind from stroke icons.
- Whether a big graphic in a section keeps that section's icons mono.
- How color splits across SyftHub's two halves.
