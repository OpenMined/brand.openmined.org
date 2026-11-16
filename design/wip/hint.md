---
type: Component
title: Hint
description: "A line of plain text under a word or a chip, after a short pause on hover or at once on keyboard focus. CSS only: smaller than a tooltip."
status: draft
from: "Issue #54 (the reporting dashboard's data-tip), 2026-11-06"
waiting:
  - "A choice between the options below: a CSS-only hint, a text-only tooltip, or a hint the tooltip's script upgrades"
  - "A screen-reader check with VoiceOver, for whichever is chosen"
tokens: [--surface-raise-2, --shadow-raise-2, --font-size-xs, --duration-fast, --line-strong]
---

**For.** A few words about a label or a chip where a tooltip's title and foot would be too much: what "Bounce rate" means, why a chip says "At risk". The text is in `data-hint`; no script.

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only. The pause is twice `--duration-fast` (0.3s, the dashboard's), not a new token. |
| Color modes | Role tokens. |
| Minimal / full layer | The same in both: a fade, no movement. |
| Keyboard | `tabindex="0"`; focus shows it at once, with the focus line. |
| Placement | Below, aligned to its start; `data-align="end"` near the right edge. CSS can't flip it or keep it inside a box that clips: that's what a tooltip is for. |
| Touch | Can't open. A hint is never the only place something is said. |
| Marked | A dotted underline in `--line-strong`, so a hinted word reads as one (not on a chip). |
| Name | `.hint` (the dashboard's `.tip` is too general to own). |

**Hint or tooltip: the options.** The system already has a released tooltip: a popover with a title, a body and an optional foot, placed by `anchor.js`. The hint does part of the same job in a different way. Before releasing it, the choice is whether short explanations get their own CSS-only element, or share the tooltip's code.

**A. A CSS-only hint (as shown above).** One attribute on any element: `data-hint="…"`, plus `tabindex="0"` where it isn't focusable already. The text is drawn by CSS (`::after`), with no script.

**B. A text-only tooltip.** A variant of the released tooltip with only its body: the same `.tooltip-host` markup, the same script and placement. No new element; the hint is dropped.

**C. A hint the tooltip's script upgrades.** The markup is A's single attribute. Where the CSS alone runs, it behaves as A. Where `tooltips()` runs, it reads `data-hint`, builds a text-only tooltip from it and wires it like B: a popover, placed by `anchor.js`, described to screen readers. One way to write it; the script decides how much it can do.

| | A. CSS-only hint | B. Text-only tooltip | C. Hint, upgraded by the script |
| --- | --- | --- | --- |
| Markup | One attribute | A host, the control and the tooltip (four elements) | One attribute |
| Script | None | `tooltip.js` and `anchor.js` | Optional: none for A's behavior, `tooltip.js` for B's |
| Screen readers | **Not read.** Chrome's accessibility tree gives the element no name and no description: the text in a CSS `::after` isn't attached to anything. | Read: the control gets `aria-describedby`; Chrome reports the tooltip's text as its description. | Read where the script runs; not read where it doesn't. |
| Fits the window | No: below, start-aligned; `data-align="end"` by hand near the right edge | Yes: flips side and alignment, stays 8px inside | Yes where the script runs |
| In a box that clips or scrolls | Cut off | Opens over it (top layer) | Opens over it where the script runs |
| Keyboard | Needs `tabindex="0"`; shows on focus | The control is already focusable; shows on focus; Escape closes | As B where the script runs |
| Touch | Can't open | Can't open | Can't open |
| Motion | A fade after a 0.3s pause | Rises 8px, in `--duration-fast` | As B where the script runs |
| Where only CSS loads (an artifact on `omds.css` alone, an email-like page) | Works | Opens below its control, inside the page; no flip, not described | Works as A |
| For people and agents writing it | Easiest to write; a second way to explain something, with a fuzzy line between "a few words" and "a tooltip" | One way to explain something; more markup to write | One way to write it, one look in the end; the difference is invisible to the author |
| To maintain | A second element with its own look, delay and placement | One element | One element; the upgrade is a few lines in `tooltip.js` |

**What every option shares.** None of them opens on touch: what a hint or tooltip says must also be reachable another way (its control's own action, the page's text). A hint or tooltip is never the only place something is said.

**Accessibility, in short.** A's text is invisible to assistive technology: a screen-reader user on a hinted word hears the word and nothing more. That's acceptable only where the hint adds nothing they need, which is hard to promise for a definition ("Bounce rate") or a reason ("At risk"). B and C (with the script) are described the way the released tooltip is.

**Proposed: C.** It keeps the one-attribute markup that made the dashboard's hint easy to use, while the same words get the tooltip's placement, clipping and screen-reader behavior wherever the script runs, which is everywhere the system's scripts load. Pages that load only the CSS still get a working hint. The cost is the upgrade code in `tooltip.js` and one less-capable fallback.

*Open:*
- The choice: A, B or C.
- With C, whether the CSS-only fallback keeps the 0.3s pause, or matches the tooltip's timing.
- The dotted underline under a hinted word: keep, or only the help cursor. (A tooltip's control is a button with an icon and needs neither.)
