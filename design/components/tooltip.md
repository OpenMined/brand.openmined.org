---
type: Component
title: Tooltips
description: "A short explanation beside a control, on hover or keyboard focus: a title, a line or two, an optional foot (a source, how fresh it is). Opens over everything, so a container that clips or scrolls never cuts it off; placed to fit the window, it follows its control as the page or container scrolls."
status: released
tags: [interface]
tokens: [--surface-raise-2, --shadow-raise-2, --line, --text-headline, --text-body, --text-muted, --radius-md, --font-size-sm, --font-size-xs, --duration-fast, --ease-base]
---

**When.** To explain a number, a term or an icon-only control where a sentence helps and a dialog is too much: what a figure counts, with its source and how fresh it is. Not for anything someone must read to use the page, and not for a link or a button: a tooltip holds text only. "More" is the control's own action (it opens a dialog).

**Anatomy.** A title (semibold, headline color), a body of a line or two, and an optional foot over a line, small and muted, for the source and freshness. On raise-2 with its shadow, 17rem wide and never wider than the window less 32px, small text, a caret pointing at the middle of its control.

**Opening.** On hover (where a pointer can hover) and on keyboard focus; Escape closes it. The pointer can move from the control onto the tooltip without it closing, so its text can be selected. On touch it can't open, so what it says must also be one tap away, through the control's own action.

**Placement.** The tooltip opens over everything (it's a popover, in the browser's top layer), so a container that clips or scrolls (a card, a table, a sidebar) can't cut it off and nothing covers it. Below its control and aligned to its end; it flips to the start or above only where that would leave the window, stays 8px inside it, and follows its control while the page or its container scrolls. The placement is `anchor.js`, which the tooltip's script imports: anything else that opens beside a control (a menu) uses it too, so they all fit and flip the same way. Without the script, or in a browser without popovers, the CSS alone opens it below its control, inside the page.

**Motion.** It fades in rising 8px (half of 1rem) into place and fades out sinking 8px, in `--duration-fast` both ways. In the minimal layer and under reduced motion it fades without moving.

**Markup.** The tooltip is the control's sibling inside a `.tooltip-host`, with `role="tooltip"`; the script gives the control `aria-describedby`. An icon-only control still needs its own `aria-label`: the tooltip describes it, it doesn't name it.

**Hints.** For a few words with no title or foot, a hint (`data-hint`, *Hints*): `tooltips()` starts hints too, turning each into a text-only tooltip.

**Version.** The tooltip uses `--duration-fast`, introduced in OMDS 2.2.0. When copying individual files, take the tokens, tooltip CSS and script, and `anchor.js` from the same release.

**Code.** `components/tooltip.css`, and `tooltip.js` (`tooltips()`) with `anchor.js` beside it.

*Open:* a short delay before it opens on hover.
