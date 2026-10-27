---
type: Component
title: Hover cards
description: "A card that is a link: it comes to life on hover. Icon left, text left-aligned, arrow right; on hover it lifts and tilts, a light follows the pointer, the icon takes its color and a colorflow rises in its lower third."
status: exploring
tags: [interface]
tokens: [--surface-raise-1, --surface-base, --shadow-raise-1, --shadow-raise-2, --gradient-two-tone-green, --gradient-two-tone-green-companion, --white]
---

**Anatomy.** A card one level up (`--surface-raise-1` and its shadow), holding an icon (32px), a title and a line or two of text, left-aligned, and an arrow on the right. The whole card is the link.

**At rest.** Quiet: the icon is mono, the arrow faint (0.3).

**On hover or keyboard focus** (Bennett, 2026-10-12: hover cards are the first test of the interactive color layer):
- The card moves one level up the shadow ladder and lifts 2px.
- It tilts away from the pointer, in 3D. The tilt is set as a distortion, not an angle, so every card size reads alike: at full pointer travel the near edge looks 1.1% longer than the far edge on a 320px card, a little less on larger cards (× (size / 320)^−0.3), at most 6° on either axis.
- A light follows the pointer. In light mode the card shades except around the pointer: clear within 0.3 of the card's width, full from one width out, the page's base surface multiplied in at 0.5, so the card darkens (its text too) but stays lighter than the page. In dark mode, a faint white light (0.03).
- The icon takes its hue's two-tone gradient, moving, with its glow (*Icons have a color mode*). The hue is set per card; any hue the design calls for.
- A colorflow fades in across the card's lower third, sitting 10% of the card's height below its bottom edge (clipped), behind the text, in the same hue's two-tone (base, darker, companion, lighter): a thick soft ribbon near the bottom edge, mostly its top half showing, one sine wave across the card at any size with small ripples on top. One WebGL context draws every flow on a page; a card's flow is made on hover and removed after it fades. Under reduced motion it's a still frame; touch devices don't get it.
- The arrow goes to full strength and nudges right. It stays mono: color on both sides of the text would be too much (Bennett and Kyle, 2026-10-12).

**Layout.** Padding 40px top and bottom, 32px at the sides (`--spacing-4XL`, `--spacing-3XL`). The icon top-aligns with the text, 8px down (where centering puts it beside a two-line title and text), so longer text grows below it; the arrow stays centered. A card standing alone (a call to action) may take a heading in place of the title; its icon sits on the heading's first line.

**Large.** For a card standing alone, such as a call to action under a row of content: it runs the full width of its container, and its icon and text sit centered in it at a 640px measure, so the lines stay short; the arrow stays at the right edge. Padding one step up, 48px top and bottom (`--spacing-5XL`), 32px at the sides. Everything else is the same as a hover card.

**Where it's used.** SyftHub's link cards (page reviews) and the Interface page; large: the home page's "Start your own federated sub-network" (page reviews) and the Interface page. Press cards, white plates showing logos, take the light and the tilt but have no icon, so no colorflow.

*Open:* whether press cards take a hue and a colorflow; the colorflow's strength over text (0.55 light, 0.45 dark).
