---
type: Behavior
title: Color moves
description: Expressive color comes with persistent motion or with an interaction. Few rules yet; leanings and open questions until the exploration rounds settle them.
status: exploring
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

**Choosing where color goes.** For now this is a designer's call, made piece by piece. Some icons stay mono and some take a colored, moving state. Blanket rules come later, if the work shows any.

**Leanings, not rules yet.**

- Avoid the kaleidoscope look. Many colored, moving things in one view is the failure this rule exists to prevent. One moving group per screen is not a rule: openmined.org/research shows the hero colorflow and the pillar diamonds together, and that reads fine.
- Ambient motion is slow or subtle. *"Some people won't notice"* (Bennett, on button hovers).
- Interactive color stays on the element or elements being interacted with; the rest stays gray.
- Infographics will mostly be explored step by step rather than seen whole at a glance, with color on the step or detail in focus.

**Open, to explore.**

- How much color and motion one piece may carry.
- Icon vs small graphic: whether filled, glowing marks like the diamonds are a separate kind from stroke icons, and whether icons get a color mode (animated color in the stroke, a blurred animated copy behind as the glow). Bennett: *"if they look blurry, it'll be a bummer."*
- Whether a big graphic in a section keeps that section's icons mono.
- Paired-hue loops (green and yellow, red and orange) vs the full spectrum.
- Button hover motion: a flowing accent gradient with a matching glow. Colors not chosen.
- SyftHub's two halves, and colorflow along diagram lines (the ABC page).

**Example.** The pillar diamonds on openmined.org/research. Each is a 22px diamond filled with a strip of the full spectrum that loops back to its first color. The strip is 8 times the diamond's width and slides one strip length every 16s, so each diamond shows about one color family at a time. The three are staggered 30% apart. A copy of the fill sits behind each one, blurred 7px at 0.35 opacity and running the same animation, which makes the glow move too. Under reduced motion they stop, colored.
