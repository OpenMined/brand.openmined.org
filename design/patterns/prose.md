---
type: Pattern
title: Prose
description: Long reads in place. Generous space above every heading, stepping down by level, each gap owned by one rule, so the rhythm holds in any layout; lists, figures, captions, tables, quotes and breaks in one scope.
status: working
tags: [typography]
tokens: [--prose-gap, --prose-gap-wide, --prose-gap-section, --prose-gap-break, --prose-gap-h2, --prose-gap-h3, --prose-gap-h4, --prose-gap-h5, --line-height-prose, --font-size-sm]
---

**Scope.** `.prose` on the element that holds a long read (a blog post, a whitepaper, a letter) styles its bare elements and the rhythm between them. Anything with a class keeps its own styling. Add `.content-links` for the content link and `.prose-article` for the reading column and breakouts (*Layout*). Carried from openmined.org's prose rules (2026-10-28).

**Rhythm.** One rule owns each gap between neighbors, so nothing depends on margins collapsing and the rhythm is the same in block, flex and grid layouts. The rhythm follows the tag, never the size a heading renders at. Space above a heading holds whatever comes before it and steps down by level: the type round's *Spacious*, which opens up openmined.org's values (32 above an h2, 24 above h3–h6) to what its authors reached for by hand on long posts (Kyle, 2026-10-28).

| Step | Gap | Where |
| --- | --- | --- |
| `--prose-gap-h2` | 88px | Above an h2 |
| `--prose-gap-h3` | 48px | Above an h3 |
| `--prose-gap-h4` | 40px | Above an h4 |
| `--prose-gap-h5` | 32px | Above an h5 or h6 |
| `--prose-gap` | 16px | Between any two blocks; after h3–h6; before a list |
| `--prose-gap-wide` | 24px | After an h2, a list or a table; before and after anything wider than the text (a figure, an embed, a breakout, the pull quote); between stacked headings |
| `--prose-gap-section` | 32px | Around a rule |
| `--prose-gap-break` | 48px | Around the ⬩⬩⬩ divider, an h2 after it included |

Space before a heading is always larger than space after it, so a subheading binds to its own section instead of floating between two (Bennett, 2026-09-20). List items sit 8px apart.

**Text.** Paragraphs and list items at `--line-height-prose` (1.75). h5 and h6 take the long-read treatment, Inter 600 at a smaller maximum (*Typography*). Bulleted lists take OpenMined's diamond marker; numbered lists keep their numbers.

**Figures and media.** Images, video and embeds fill the column with the medium corner and no frame. A caption sits under its figure, 8px below, in small, medium-weight, muted text. A figure wider than the text breaks out (*Layout*, articles).

**Tables.** Small text, rows on dividers, headers in semibold headline color; no boxes. A wide table scrolls on narrow screens.

**Quotes.** A blockquote is a quotation, set off by the line style on its left, its source (`cite`) in small muted text. A **pull quote** (`.pullquote`) lifts a line from the text: the display face at h3 size with display tracking, on the line style at its left, broken out to the wide zone in an article (type round, 2026-10-28). New in v2; the website has none.

**Breaks.** A rule (`hr`) is a divider line with a section's air around it; the ⬩⬩⬩ divider is a centered mark with more.

**Stays in the website.** Heading downsizing per post and the WordPress migration shims. They're publishing features, not brand rules.

**Code.** `components/prose.css`, with `components/type.css`. No script.

*Open:* other long-read variations as reviews turn them up.
