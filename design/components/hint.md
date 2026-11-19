---
type: Component
title: Hints
description: "A few words about a word or a chip, on hover or keyboard focus, from one attribute. With the tooltip's script it becomes a text-only tooltip; with CSS alone, a line drawn below it."
status: released
tags: [interface]
tokens: [--surface-raise-2, --shadow-raise-2, --font-size-sm, --duration-fast, --line-strong]
---

**When.** A few words about a label or a chip where a tooltip's title and foot would be too much: what "Bounce rate" means, why a chip says "At risk". For a title, a source or more than a sentence or two, a tooltip.

**Markup.** One attribute: `data-hint="…"` on the word or chip, plus `tabindex="0"` where it isn't focusable already. `data-align="end"` prefers aligning to its end.

**With the script.** `tooltips()` starts hints too: each becomes a text-only tooltip (`.tooltip--hint`), a popover over everything, placed below and aligned to its start, flipping to fit the window, closed on Escape, and read by screen readers as the hint's description (`aria-describedby`).

**With CSS alone.** The same attribute draws the text below the hint, inside the page: below only, so a box that clips can cut it off, and not read by screen readers. Pages that load only `omds.css` still get a working hint.

**Look and motion.** The tooltip's look, as wide as its words (17rem at most). Opens at once and rises 8px in `--duration-fast`; the minimal layer and reduced motion fade only, with CSS alone too. A hinted word carries a dotted underline in `--line-strong`, so it reads as one (not on a chip).

**Touch.** It can't open. A hint is never the only place something is said.

**Code.** `components/hint.css`; the upgrade is in `tooltip.js` (`tooltips()`), with `tooltip.css` and `anchor.js`.

*Open:* a check with VoiceOver, with the script and with CSS alone.
