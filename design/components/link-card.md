---
type: Component
title: Link cards
description: "A card that is a link, plain: a title with an arrow and a line of text. On hover it moves one level up, lifts and tilts away from the pointer. The hover card's quieter sibling."
status: exploring
tags: [interface]
tokens: [--surface-raise-1, --surface-raise-2, --shadow-raise-1, --shadow-raise-2, --text-headline, --text-muted, --font-size-md, --font-size-sm]
---

**Anatomy.** A card on the page (`--surface-raise-1` and its shadow) holding a title with an arrow after it and a line or two of muted text. The whole card is the link. No icon.

**When.** Lists of links where each needs a sentence: related pages, "see also", archives. A hover card is for a link that should come to life (an entry point, a call to action); a link card stays quiet, so a row of them doesn't turn into a row of colored, moving things (*Color moves*: avoid the kaleidoscope look).

**On hover or keyboard focus.** One level up, surface and shadow (`--surface-raise-2`, `--shadow-raise-2`), a 2px lift, and the hover card's tilt away from the pointer (`tilt.js`, the same knobs). The arrow, faint at rest (0.3), comes to full strength and nudges right. No light, no color, no colorflow. Under reduced motion the level changes and nothing moves.

**Layout.** Padding 24px (`--spacing-2xl`), `--radius-md`. The title is Inter 700 at body size, as the hover card's; the text small and muted. The title may be a heading where the page's outline needs one.

*Open:* whether this stays its own component or becomes a hover card variant without color; a block title style shared with the hover card.

**Code.** `components/link-card.css` and `link-card.js` (`linkCards()`: the tilt, from `tilt.js`). Plain CSS and ES modules, no build step: load the v2 tokens first, then only the files a page uses. The markup to match is at the top of the CSS file (`components/README.md`).
