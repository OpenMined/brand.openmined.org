---
type: Component
title: Link cards
description: "A card that is a link, plain: a title with an arrow and a line of text. On hover it moves one level up, lifts and tilts away from the pointer. The hover card's quieter sibling."
status: released
tags: [interface]
tokens: [--surface-raise-1, --surface-raise-2, --shadow-raise-1, --shadow-raise-2, --text-headline, --text-muted, --font-size-md, --font-size-sm]
---

**Anatomy.** A card on the page (`--surface-raise-1` and its shadow) holding a title with an arrow after it and a line or two of muted text. The whole card is the link. No icon.

**When.** Lists of links where each needs a sentence: related pages, "see also", archives. A hover card is for a link that should come to life (an entry point, a call to action); a link card stays quiet, so a row of them doesn't turn into a row of colored, moving things (*Color moves*: avoid the kaleidoscope look).

**On hover or keyboard focus.** One level up, surface and shadow (`--surface-raise-2`, `--shadow-raise-2`), a 2px lift, and the hover card's tilt away from the pointer (`tilt.js`, the same knobs). The arrow, faint at rest (0.3), comes to full strength and nudges right. No light, no color, no colorflow. **Pressed:** the card settles back onto the page, its shadow back to `raise-1` and the lift gone. Under reduced motion the level changes and nothing moves.

**On the page only.** A link card sits on the page (`--surface-base`), never inside a raised panel: it rests on `raise-1` and rises to `raise-2`, the top of the ladder, so there's no level left above it in a panel. Inside a panel, use a text button or a link.

**States.** In both interactive layers (*Interaction states*); the code is the spec.

**Layout.** Padding 24px (`--spacing-2xl`), `--radius-md`. The title is Inter 700 at body size, as the hover card's; the text small and muted. The title may be a heading where the page's outline needs one.

**Logo and post cards.** Two variants from openmined.org. A *logo card* (`lcard--logo`) holds an organization's logo supplied as an image on a white plate in either mode (*Logo images sit on white*), with a caption under it; mark it `data-section="always-light"`. A *post card* (`lcard--post`) is a square with a cover image filling it, the date and category at the top and the title at the bottom over the image, in a fixed light or dark text color chosen for the cover (`data-text`). Both behave as link cards.

*Open:* whether this stays its own component or becomes a hover card variant without color; a block title style shared with the hover card.

**Code.** `components/link-card.css` and `link-card.js` (`linkCards()`: the tilt, from `tilt.js`). Plain CSS and ES modules, no build step: load the v2 tokens first, then only the files a page uses. The markup to match is at the top of the CSS file (`components/README.md`).
