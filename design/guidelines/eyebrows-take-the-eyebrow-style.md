---
type: Guideline
title: Eyebrows take the eyebrow style
description: A short phrase over a heading is always the eyebrow style, body text in sentence case, never caps or mono. Only its size may step down.
status: released
tags: [typography]
tokens: [--font-body, --font-size-md, --font-size-sm]
---

**Rule.** An eyebrow, a short phrase placed over a heading (a page's, a section's, a card's, a hero's), always takes the eyebrow style, `.text-eyebrow`: Inter (`--font-body`) at 400, at body size (`--font-size-md`), in the text color around it, in sentence case. Never all caps, never letter-spaced, never mono, never bold, never a hue.

```html
<p class="text-eyebrow">Federated learning</p>
<h2>Data stays where it lives</h2>
```

**Why.** The eyebrow is a hook into the heading; it adds no style of its own. Caps in mono over a heading is a common pattern in generated pages, and it isn't ours: it reads as a template, not as OpenMined.

**Exceptions.** Only the size may change, and only where the design needs it (a dense card, a compact panel): the small eyebrow, `.text-eyebrow.text-eyebrow--sm`, at `--font-size-sm`. Everything else stays. Inside a figure (a diagram), a label in caps over a group's or a panel's title is allowed: that's the diagram label (`.fig__label`: mono, caps, letter-spaced, muted), the diagram's own style, and this rule doesn't apply to it (*Explanatory diagrams*). Outside a figure, over a page's, a section's or a card's heading, the eyebrow style always holds.
