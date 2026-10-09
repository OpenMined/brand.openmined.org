---
type: Pattern
title: Prose
description: Long-form text in place. One gap between neighboring blocks, and each heading owns the break before it, so the rhythm holds in any layout.
status: exploring
tags: [typography]
tokens: [--font-size-md, --font-size-sm]
---

**Rhythm.** Ported from openmined.org's prose rules, the core only. One rule owns each gap between neighbors, so nothing depends on margins collapsing and the rhythm is the same in block, flex and grid layouts.

| Between | Gap |
| --- | --- |
| Any two blocks | 16px |
| Before an h2 · after it | 32px · 24px |
| Before h3–h6 · after them | 24px · 16px |
| Two headings in a row | 24px |
| Around a rule (`hr`) | 32px |
| List items | 8px |

Space before a heading is always larger than space after it, so a subheading binds to its own section instead of floating between two (Bennett, 2026-09-20).

**Type.** Body at `--font-size-md`, line height 1.5. h2–h4 in Rubik 400 at the website's fluid sizes; h5 and h6 switch to Inter 600 in prose. Quotes take a 1px headline-color rule on the left, the one edge the dividers-only rule allows; small text closes a section at `--font-size-sm`.

**Stays in the website.** Heading downsizing per post, the WordPress shims, and the opt-in "spacious sections" scale. They're publishing features, not brand rules.

*Open (for Bennett):* whether a minimal prose rhythm belongs in the brand. The type plan's lean: rhythm tokens yes, the elaborate cascade no. Rhythm tokens (`--space-before-h2` and so on) come with the type round.
