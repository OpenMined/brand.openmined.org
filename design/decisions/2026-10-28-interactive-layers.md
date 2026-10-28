---
type: Decision
title: "Interactive layers: minimal built in, full added on"
description: "Every interactive element has a minimal state in plain CSS, with the accent's still green where the full state moves color; the full state is an add-on. Colored fills darken with a wash; focus and disabled follow the fields."
status: working
date: 2026-10-28
tags: [interface]
tokens: [--accent-key, --line-focus, --state-pressed-wash, --state-disabled-opacity]
---

**Context.** The system will be used in many places: brand pages, product interfaces, CMSs, decks and agent-built pages. Some can't run the hover scripts, and in dense interfaces (tables, toolbars, forms) the flowing button and link hovers are too much movement. Buttons and content links had no defined plain state, colored fills had no hover after the `hover` role was removed, there was no pressed state, no shared disabled state, buttons and links had only a temporary focus ring, and hover stuck on after a tap on touch screens.

**Decision.** Design lead, 2026-10-28.
- **Two interactive layers:** full (color in motion) and minimal (plain CSS, no motion); documents, slides and images show the resting look.
- **Minimal is built in, full is added on.** A component's main file holds its whole minimal state; the moving color is a separate file (`button-hover.css` and `.js`, `link-flow.css`). `data-interaction="minimal"` keeps a region minimal on a page that loads the add-ons.
- **Minimal keeps the accent.** Where full moves color, minimal shows `--accent-key` standing still in the same place: a gray button fills green on hover, a content link's underline turns green.
- **Clickable icons never fill:** the icon takes the color, green standing still in minimal, green's two-tone moving in full.
- **Pressed darkens with a wash:** `--state-pressed-wash` (20%) of black mixed into the fill. A clickable colored fill darkens on hover too; its amount is set when the first one ships, and a `hover` role per hue stays an option.
- **Focus** is the fields' focus line on everything: 1px in `--line-focus`, 2px outside. **Disabled** is the fields' 0.55 opacity on everything.
- **Hover applies only where a pointer can hover**; the full add-ons don't run on touch.

**Alternatives.** A grayscale minimal layer (a gray wash or line, no accent): calmer, but it loses the one cue that the system's color lives in interaction. A hover role per hue (one step darker): on the palette, but ten more tokens for one state. Only `prefers-reduced-motion` as the plain version: it's the user's setting, not the designer's, and it keeps the moving element's colors.

**Consequences.** *Interaction states* holds the rules for every element, components or not. *Buttons* and *Links* describe both layers, and their open focus-ring questions close. `link.css` splits into `link.css` and `link-flow.css`. New tokens: `--state-pressed-wash` (exploring) and `--state-disabled-opacity`. The guide's Interface page shows one layer at a time, with a switch between the full and the minimal interactive layer, rather than both side by side.

**Revisit when.** The wash reads muddy on a hue, or a dense interface needs less than the accent's green.
