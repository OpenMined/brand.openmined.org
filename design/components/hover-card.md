---
type: Component
title: Hover cards
description: "A card that is a link: it comes to life on hover. Icon left, text left-aligned, arrow right; on hover it lifts, a soft light follows the pointer and the icon takes its color."
status: exploring
tags: [interface]
tokens: [--surface-raise-1, --shadow-raise-1, --shadow-raise-2, --gradient-two-tone-green, --white]
---

**Anatomy.** A card one level up (`--surface-raise-1` and its shadow), holding an icon (32px), a title and a line or two of text, left-aligned, and an arrow on the right. The whole card is the link.

**At rest.** Quiet: the icon is mono, the arrow faint (0.3).

**On hover or keyboard focus** (Bennett, 2026-10-12: hover cards are the first test of the interactive color layer):
- The card moves one level up the shadow ladder and lifts 2px.
- A soft white light, 480px across, follows the pointer over the card and its content, so text and marks pick it up even where a white card can't get lighter: 0.2 in light mode and on always-light cards, 0.03 in dark.
- The icon takes its hue's two-tone gradient, moving, with its glow (*Icons have a color mode*). The hue is set per card; any hue the design calls for.
- The arrow goes to full strength and nudges right. It stays mono: color on both sides of the text would be too much (Bennett and Kyle, 2026-10-12).

**Layout.** The icon top-aligns with the text, 8px down (where centering puts it beside a two-line title and text), so longer text grows below it; the arrow stays centered. A card standing alone (a call to action) may take a heading in place of the title; its icon sits on the heading's first line.

**Where it's used.** SyftHub's link cards and the home page's "Start your own federated sub-network" (page reviews); the Interface page. Press cards, white plates showing logos, take the light but have no icon.

*Open:* color-themed flourishes on larger cards (a matching smoky flow along the bottom, Bennett, 2026-10-12), once more graphic variants exist.
