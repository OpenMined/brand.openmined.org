---
type: Decision
title: "A hint is one attribute, upgraded by the tooltip's script"
description: "Short explanations are written as data-hint. CSS alone draws them below; where tooltips() runs, each becomes a text-only tooltip, placed to fit the window and read by screen readers."
status: released
date: 2026-11-19
tags: [interface]
tokens: [--surface-raise-2, --shadow-raise-2, --font-size-sm, --duration-fast, --line-strong]
---

**Context.** The reporting dashboard (issue #54) explained terms and chips with a CSS-only hint from one attribute. The system already had a tooltip (a title, a body, a foot, placed by `anchor.js`). A CSS-only hint isn't read by screen readers (Chrome's accessibility tree gives it no name and no description), can't fit the window and is cut off by a box that clips.

**Decision.** Design lead, 2026-11-17; released 2026-11-19.
- **One way to write it:** `data-hint="…"` on the word or chip.
- **The script decides how much it can do.** Where `tooltips()` runs it builds a text-only tooltip (`.tooltip--hint`) from the attribute: a popover placed to fit the window, closed on Escape, described with `aria-describedby`. With CSS alone the text is drawn below, inside the page.
- **The tooltip's timing and motion** either way (at once, rising 8px in `--duration-fast`); a hinted word keeps its dotted underline.

**Alternatives.** A CSS-only hint: easiest to write, but invisible to assistive technology and a second look to maintain. A text-only tooltip only: one element, but four of them in the markup for a few words.

**Consequences.** New `hint.css`; the upgrade lives in `tooltip.js`, so `tooltips()` starts hints too. Pages on `omds.css` alone still get a working hint.

**Revisit when.** A VoiceOver check finds the description isn't read as expected.
