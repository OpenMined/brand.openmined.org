---
type: Component
title: Hint
description: "A few words about a word or a chip, on hover or keyboard focus. One attribute: with the tooltip's script it becomes a text-only tooltip; with CSS alone, a line drawn below it."
status: draft
from: "Issue #54 (the reporting dashboard's data-tip), 2026-11-06"
waiting:
  - "A screen-reader check with VoiceOver, with the script and with CSS alone"
  - "The design lead's approval on /wip/"
tokens: [--surface-raise-2, --shadow-raise-2, --font-size-sm, --duration-fast, --line-strong]
---

**For.** A few words about a label or a chip where a tooltip's title and foot would be too much: what "Bounce rate" means, why a chip says "At risk". The text is in `data-hint`.

**How it works.** One way to write it; the script decides how much it can do. Where `hints()` runs (`hint.js`, with `anchor.js` beside it), it reads `data-hint` and builds a text-only tooltip (`.tooltip--hint`): a popover over everything, placed to fit the window, closed on Escape, described to screen readers with `aria-describedby`. Where only the CSS loads, the same attribute draws the text below the hint, inside the page. On release, the upgrade moves into `tooltip.js`, so `tooltips()` starts hints too.

**Where it stands.**

| | |
| --- | --- |
| Tokens | Tokens only; the tooltip's look, as wide as its words (17rem at most). |
| Color modes | Role tokens. |
| Timing and motion | The tooltip's: opens at once, rises 8px in `--duration-fast`. Minimal layer and reduced motion: the fade only. With CSS alone too. |
| Keyboard | `tabindex="0"` where it isn't focusable already; focus opens it, with the focus line; Escape closes it (with the script). |
| Placement | With the script: below, aligned to its start, flipping to fit the window; `data-align="end"` prefers its end. With CSS alone: below only, and a box that clips cuts it off. |
| Screen readers | With the script: read as the hint's description. With CSS alone: not read. |
| Touch | Can't open. A hint is never the only place something is said. |
| Marked | A dotted underline in `--line-strong`, so a hinted word reads as one (not on a chip). |
| Name | `.hint` (the dashboard's `.tip` is too general to own). |

**Hint or tooltip: the options weighed.** The system already has a released tooltip: a popover with a title, a body and an optional foot, placed by `anchor.js`. The hint does part of the same job in a different way. Before releasing it, the choice is whether short explanations get their own CSS-only element, or share the tooltip's code.

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

**Chosen: C** (the design lead, 2026-11-17). It keeps the one-attribute markup that made the dashboard's hint easy to use, while the same words get the tooltip's placement, clipping and screen-reader behavior wherever the script runs, which is everywhere the system's scripts load. Pages that load only the CSS still get a working hint. Without the script it matches the tooltip's timing (at once, not after a pause), and a hinted word keeps its dotted underline.
