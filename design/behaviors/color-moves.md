---
type: Behavior
title: Color moves
description: Expressive color comes with persistent motion or with an interaction. Few rules yet; leanings and open questions until the exploration rounds settle them.
status: working
tags: [color, graphics, interface]
---

**Rule.** Where color is used for expression, it moves while it's on screen, or it arrives with an interaction. See the decision *If color, then motion* (2026-10-12).

**What counts as motion.**

- Persistent motion while the color is visible: an ambient loop, such as a fill or stroke that flows.
- Color that arrives with an interaction: hover, an expanded accordion, the current step of an infographic someone is stepping through.
- Not a one-time entrance animation (a fade or slide on scroll). Once it ends, the color sits still.

**Exempt.**

- Color that carries meaning: an error's red, a status, a chart series. Decided otherwise case by case if needed.
- The logo.
- Reduced motion: the color stays and the motion stops.

**Where it runs (for agents and other platforms).** Not every move works everywhere. Before using one, check what it needs:

- **Anywhere** (documents, slides, PDF, images): the still look only. Colors, two-tone and highlight colors, a diagram's still frame.
- **Any web page, CSS and SVG only** (HTML decks and Claude artifacts too): link hovers, the moving icon two-tone (its gradients are SVG markup).
- **Web, with a script:** button hovers, the field and hover-card pointer lights and the card tilt (the v2 components' modules in `components/`, each one small and standalone), diagram line pulses (`src/scripts/line-flow.ts`) and the `<om-diamond>`/`<om-stream>` embeds. A Claude artifact loads scripts only from a few public CDNs, so it can't load the brand site's embeds; paste the script in or use the still frame.
- **The brand site only, for now:** hover card colorflows (the site's shared WebGL renderer).

Where a move can't run, use its still frame: the same colors, standing still, as under reduced motion. Never fake the motion with a different look.

**Choosing where color goes.** For now this is a designer's call, made piece by piece. Some icons stay mono and some take a colored, moving state. Blanket rules come later, if the work shows any.

**Leanings, not rules yet.**

- Avoid the kaleidoscope look. Many colored, moving things in one view is the failure this rule exists to prevent. One moving group per screen is not a rule: openmined.org/research shows the hero colorflow and the pillar diamonds together, and that reads fine.
- Ambient motion is slow or subtle. *"Some people won't notice"* (Bennett, on button hovers).
- Interactive color stays on the element or elements being interacted with; the rest stays gray.
- Infographics will mostly be explored step by step rather than seen whole at a glance, with color on the step or detail in focus.

**Open, to explore.**

- How much color and motion one piece may carry.
- Whether filled, glowing marks like the diamonds are a separate kind from stroke icons.
- Whether a big graphic in a section keeps that section's icons mono.
- SyftHub's two halves.

**Settled so far.** Icons have a color mode, with two-tone gradients (a companion per hue); button and link hovers are working favorites (*Green at rest, gradients in motion*, 2026-10-13).

- **Diagram lines** (direction A): the line's highlight (one per hue, lighter than it: *Highlights*) travels along each colored line, over it at 0.8 at its center and fading in a bell to nothing at its ends, so the line shows through; lines that drain to gray carry a highlight that turns gray with them. Rings brighten in their highlight, one after another.
- **Hover cards**: a colorflow in the card's two-tone rises in its lower third (*Hover cards*).
- Small animated graphics that come and go (hover flows) share one renderer per page (`src/scripts/gl/`); the large brand graphics stay standalone embeds.

**Example.** The pillar diamonds on openmined.org/research. Each is a 22px diamond filled with a strip of the full spectrum that loops back to its first color. The strip is 8 times the diamond's width and slides one strip length every 16s, so each diamond shows about one color family at a time. The three are staggered 30% apart. A copy of the fill sits behind each one, blurred 7px at 0.35 opacity and running the same animation, which makes the glow move too. Under reduced motion they stop, colored.
