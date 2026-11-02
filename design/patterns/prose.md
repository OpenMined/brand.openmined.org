---
type: Pattern
title: Prose
description: Long reads in place. Space above every heading stepping down by level, each gap owned by one rule, so the rhythm holds in any layout; a spacious mode for long posts and a downsize mode for smaller headings; lists, figures, captions, tables, quotes, and breaks in one scope.
status: released
tags: [typography]
tokens: [--prose-gap, --prose-gap-wide, --prose-gap-section, --prose-gap-break, --prose-gap-h2, --prose-gap-h2-spacious, --prose-gap-h3, --prose-gap-h4, --prose-gap-h5, --line-height-prose, --font-size-sm]
---

**Scope.** `.prose` on the element that holds a long read (a blog post, a whitepaper, a letter) styles its bare elements and the rhythm between them. Anything with a class keeps its own styling. Add `.content-links` for the content link and `.prose-article` for the reading column and breakouts (*Layout*).

**Rhythm.** One rule owns each gap between neighbors, so nothing depends on margins collapsing and the rhythm is the same in block, flex and grid layouts. The rhythm follows the tag, never the size a heading renders at. Space above a heading holds whatever comes before it and steps down by level (decision *Prose: a moderate default, and modes*).

| Step | Gap | Where |
| --- | --- | --- |
| `--prose-gap-h2` | 48px | Above an h2 |
| `--prose-gap-h3` | 40px | Above an h3 |
| `--prose-gap-h4` | 32px | Above an h4 |
| `--prose-gap-h5` | 24px | Above an h5 or h6 |
| `--prose-gap` | 16px | Between any two blocks; after h3–h6; before a list |
| `--prose-gap-wide` | 24px | After an h2, a list, or a table; before and after anything wider than the text (a figure, an embed, a breakout, the pull quote); between stacked headings |
| `--prose-gap-section` | 32px | Around a rule |
| `--prose-gap-break` | 48px | Around the ⬩⬩⬩ divider, an h2 after it included |

Space before a heading is always larger than space after it, so a subheading binds to its own section instead of floating between two. List items sit 8px apart.

**Spacious.** A long post with a few major sections takes `.prose--spacious`: the full break, `--prose-gap-h2-spacious` (88px), above every h2, even one straight after another heading. An h2 right after the ⬩⬩⬩ divider keeps the divider's 48px. For a single stronger break in an ordinary post, use the divider instead.

**Downsize.** `.prose--downsize-1` draws every heading one level smaller (an h2 at h3 size, and so on, floored at h6), `.prose--downsize-2` two levels. The tags stay, so the outline, a table of contents and the spacing still follow them: downsize changes size only, as openmined.org's posts do (an h2 keeps its full break at any size). Also for short Markdown that sits under a page's own headings.

**Text.** Paragraphs and list items at `--line-height-prose` (1.75). h5 and h6 take the long-read treatment, Inter 600 at a smaller maximum (*Typography*). Bulleted lists take OpenMined's diamond marker; numbered lists keep their numbers.

**Figures and media.** Images, video, and embeds fill the column with the medium corner and no frame. A caption sits under its figure, 8px below, in small, medium-weight, muted text. A figure wider than the text breaks out (*Layout*, articles).

**Tables.** Small text, rows on dividers, headers in semibold headline color; no boxes. A wide table scrolls on narrow screens.

**Quotes.** A blockquote is a quotation, set off by the line style on its left, its source (`cite`) in small muted text. A **pull quote** (`.pullquote`) lifts a line from the text: the display face at h3 size with display tracking, on the line style at its left, broken out to the wide zone in an article.

**Breaks.** A rule (`hr`) is a divider line with a section's air around it; the ⬩⬩⬩ divider is a centered mark with more.

**Not part of the pattern.** CMS migration fixes belong to the site that publishes, not to the brand.

**Code.** `components/prose.css`, with `components/type.css`. No script.

*Open:* other long-read variations as reviews turn them up.
