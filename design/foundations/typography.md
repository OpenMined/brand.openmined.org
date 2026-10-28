---
type: Typography
title: Typography
description: Rubik for display, Inter for text. A fluid heading scale, four text sizes, leading that tightens as headings grow and slight display tracking, carried from openmined.org's type system and settled in the type round.
status: working
tags: [typography]
tokens: [--measure, --tracking-numbers, --font-display, --font-body, --font-mono, --tracking-display, --font-size-prose-h5-max, --font-size-prose-h6-max, --line-height-h1, --line-height-h2, --line-height-h3, --line-height-h4, --line-height-h5, --text-headline, --text-body, --text-muted, --font-size-xs, --font-size-sm, --font-size-md, --font-size-lg-min, --font-size-lg, --font-size-h1-min, --font-size-h1-max, --font-size-h2-min, --font-size-h2-max, --font-size-h3-min, --font-size-h3-max, --font-size-h4-min, --font-size-h4-max, --font-size-h5-min, --font-size-h5-max, --font-size-h6-min, --font-size-h6-max, --line-height-lead, --line-height-text, --line-height-prose, --font-weight-regular, --font-weight-medium, --font-weight-semibold, --font-weight-bold]
---

v2 type is openmined.org's type system, carried into the brand as tokens with obvious cleanup and settled in the type round (Kyle, 2026-10-28). The website built the system the released brand lacked: fluid headings, per-level sizes, a rhythm for long reads.

**Families.** `--font-display` (Rubik) for h1–h4, at 400 only. `--font-body` (Inter) for everything else: body, interface, h5 and h6, labels. `--font-mono` (the system monospace) for code. Rubik and Inter are Google Fonts, so they work in Google Docs too.

**Text sizes.** Four, in rem at a 16px root: `--font-size-xs` (12px) for captions and labels on graphics, weight 500; `--font-size-sm` (14px) for captions, form descriptions, tables and notes; `--font-size-md` (16px) for body and interface text; `--font-size-lg` for the lead under a page title, fluid from 18px (`--font-size-lg-min`) to 21px at the 1300px page, like the headings.

**The heading scale.** Each level grows with the window between a minimum and a maximum, reaching the maximum at the 1300px page width (the rate is the maximum ÷ 13, in vw), so a heading never jumps at a breakpoint:

| Level | Face | Min → max |
| --- | --- | --- |
| h1 | Rubik 400 | 36 → 61px |
| h2 | Rubik 400 | 28 → 47px |
| h3 | Rubik 400 | 24 → 36px |
| h4 | Rubik 400 | 22 → 27px |
| h5 | Inter 400 · 600 in a long read | 18 → 21px · 18 → 20px |
| h6 | Inter 400 · 600 in a long read | 16 → 20px · 16 → 18px |

Set a heading's style with its class (`.h1` … `.h6`) when the tag and the look differ. A surface that needs a smaller ceiling, such as a hero, caps the level with its own maximum in the same `clamp()`; it never adds a size.

**Two treatments for h5 and h6.** On pages, in interfaces and in presentations, h5 and h6 are Inter 400 (the default, `.h5`, `.h6`). In a long read (`.prose`) they step up to Inter 600 at a smaller maximum, so they stay apart from each other and from body text. Long reads may grow more variations as they're reviewed.

**Leading.** The display levels tighten as they grow: `--line-height-h1` 1.05, `-h2` 1.1, `-h3` 1.15, `-h4` 1.2; `--line-height-h5` 1.4; `--line-height-lead` 1.4; `--line-height-text` (1.5) for body, interface text, h6 and h5–h6 in a long read; `--line-height-prose` (1.75) for paragraphs and list items in a long read. Unitless, so each follows its text's own size.

**Tracking.** The display face (h1–h4 and the pull quote) takes `--tracking-display`, −0.01em: `letter-spacing: calc(var(--tracking-display) * 1em)`. Inter is set as drawn.

**Text color.** `--text-headline` for headings and strong text, `--text-body` for body, `--text-muted` for secondary text (the lead, captions, notes, placeholders). Muted reaches 4.5:1 on every surface in both modes since gray 400 and 500 were retuned (type round).

**Weights.** `--font-weight-regular` (400), `-medium` (500: labels, captions, buttons), `-semibold` (600: strong text, h5–h6, table headers) and `-bold` (700: card titles).

**Text styles.** Lead (`.text-lead`: lg, muted), small (`.text-small`), caption (`.text-caption`: xs, 500) and eyebrow (`.text-eyebrow`, body text, a hook only). Headings balance their lines; paragraphs, list items, quotes and captions avoid a lone last word.

**Inline elements.** Code in the mono family at 0.875em on a tint of the code block's own ground, gray 950, so it's always darker than the surface (6% in light, 35% in dark); a code block is always dark (gray 950 with gray 50 text) in both modes. Keyboard keys (`kbd`) take a line-style outline. A blockquote is set off by the line style on its left, its source in small muted text. Long reads add figures, captions, tables, breaks and the pull quote (*Prose*).

**Cleanup from the website.** Every heading's rate is its maximum ÷ 13. Sizes are tokens in rem. The heading fallback is a sans (v1 fell back to serif). Code uses the brand's mono family; quotes and rules use the v2 line style.

**Numbers.** Wherever numbers line up in columns, digits take one width (tabular figures), tightened by `--tracking-numbers` (−0.02em); the columns still align, since every digit keeps one width. Tables set tabular figures throughout; a numeric cell takes `.num` (right-aligned, tightened); `.tabular` does the same for numbers outside a table, such as stat tiles and chart labels (type round, 2026-10-28).

**Measure.** Text outside an article (a hero's lead, a section intro, a card's text) keeps to a reading width: `.measure`, at `--measure`, the same 640px as the article column. Set `--measure` on the element when a block needs another width. Best practices to come.

**Fonts.** Rubik 400, and Inter 400, 500, 600, 700 and 400 italic, from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Rubik:wght@400&display=swap">
```

**Code.** `components/type.css` (body, headings, text styles, measure, inline elements) and `components/prose.css` (long reads). No script.

**Graphics.** Text in graphics uses these families too (*Graphics use the brand fonts*); the diamond's Sometype Mono labels on openmined.org are a grandfathered exception.

*Open:* a style for block titles (a card's, a rule's): the guide sets them in Inter 700 at body size, not yet a text style. Muted text sits close to body text in light mode (1.55:1 between them), kept so it reaches AA on the sunken level where forms put it; if that matters in practice, a second role for sunken surfaces (`--text-muted-sunken`) could let muted lighten everywhere else (Kyle, 2026-10-28: wait and see).
