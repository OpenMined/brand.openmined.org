---
type: Component
title: Cards
description: "A panel on its own level: content grouped on a raised surface, its level as its edge. With an icon beside or above the text, or in an even grid. Not a link."
status: released
tags: [interface]
tokens: [--surface-raise-1, --surface-raise-2, --shadow-raise-1, --shadow-raise-2, --radius-lg, --spacing-2xl, --spacing-lg, --text-headline]
---

**Anatomy.** A block on `--surface-raise-1` with its shadow, the large corner (`--radius-lg`), 24px inside. A title (Inter 600 at body size) and text, or anything else a group needs: a chart, a form, a table. With an icon (`card--icon`): the 32px set icon in the headline color beside the text, or above it (`card--stacked`).

**When.** To group things that belong together on a page or in an interface: a feature with its explanation, a panel of settings, a dashboard tile. A card that is a link is a *Link card* or a *Hover card*, which move on hover; a card doesn't.

**Levels.** A card on the page is `raise-1`; a card inside a raised panel goes one level up (`card--raise-2`). Never on the sunken level, never with an outline: its level is its edge (*Outlines are lines*, *Sunken is never a ground*). Dense interfaces use `card--compact` (16px inside).

**Grids.** `card-grid` lays cards in even columns (three by default; `--2`, `--4`), two below 991px and one below 767px, so rows stay even.

**Code.** `components/card.css`. No script.
