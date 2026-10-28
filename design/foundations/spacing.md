---
type: Spacing
title: Layout
description: Eleven spacing steps from 2 to 48px and a section step (88px), a 1300px page on twelve columns, an article's reading column with wide and full breakouts, three breakpoints and a fixed stacking order. The values are v1's and openmined.org's, carried over unchanged.
status: working
tags: [layout]
tokens: [--spacing-section, --spacing-3xs, --spacing-2xs, --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl, --spacing-3xl, --spacing-4xl, --spacing-5xl, --page-width, --page-width-wide, --page-gutter, --grid-columns, --grid-gap, --grid-column, --grid-span-4, --grid-span-5, --grid-span-6, --grid-span-8, --grid-span-10, --prose-content, --prose-wide, --prose-full, --breakpoint-lg, --breakpoint-md, --breakpoint-sm, --z-below, --z-card, --z-base, --z-sticky, --z-dropdown, --z-overlay]
---

**Spacing.** Eleven steps: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40 and 48px (`--spacing-3xs` to `--spacing-5xl`). They are v1's steps unchanged, renamed lowercase to match the other v2 sizes (2026-10-27). Use a step for every gap, padding and margin, never a value between them. v1's 88px step returns as `--spacing-section`, the space above and below each section of a page (the brand guide's bands), exploring (2026-10-28).

How each step is used today comes from the components: a field's parts sit `xs` apart, options in a list `sm`, buttons in a row `md`, a hover card's icon and text `lg`, cards in a row `xl`, fields in a form `2xl`; a hover card is padded `4xl` top and bottom and `3xl` at the sides, `5xl` top and bottom when large. The 2 and 4px steps aren't used yet.

**The page.** Content runs to `--page-width` (1300px) inside the page container (`.container`), which keeps `--page-gutter` (20px) between it and the viewport edge. Bands that run wider, such as a footer bar, take `--page-width-wide` (1400px). v1's values, kept for v2 (Kyle, 2026-10-27).

**The grid.** Twelve columns (`--grid-columns`) of 90px (`--grid-column`) with 20px gaps (`--grid-gap`), across the 1300px page: `.grid-12`, children placed with `grid-column` (`2 / 12` for ten columns with one of air each side). Below `--breakpoint-lg` it is one column. For a centered block without the grid, cap its width at a span: `--grid-span-4` (420px), `-5` (530, the form card), `-6` (640), `-8` (860) or `-10` (1080).

**Articles.** A blog post or long read sits on three zones (`.prose-article`, from openmined.org's blog). Blocks are placed by zone name, never by column: every block takes the reading column, `--prose-content` (640px). A figure, table or embed wider than the text breaks out to the wide zone with `.breakout`, `--prose-wide` (860px). A full breakout, `.breakout--full`, leaves the article for the page width, `--prose-full` (1300px), centered and kept inside the gutters on narrow screens. The article owns no horizontal padding: the gutter belongs to the container around it.

The reading column and the wide zone are **set apart from the grid** (decision *Article zones are set apart from the grid*): they start equal to six and eight columns, but a reading measure is tuned as type, so changing one never moves the grid, and changing the grid never moves articles. Whoever retunes the grid checks whether articles should follow. The full zone stays the page width.

**Breakpoints.** `--breakpoint-lg` (991px, below desktop: the grid collapses), `--breakpoint-md` (767px, below tablet: text measures are lifted) and `--breakpoint-sm` (479px, phones). Media queries can't read tokens, so they write the number; the tokens name the set and serve scripts.

**Stacking.** Six fixed layers, so nothing invents a z-index: `--z-below` (−1, behind its container), `--z-card` (5, a full-cover link over a card), `--z-base` (10, an element lifted over its neighbors), `--z-sticky` (100, the sticky header), `--z-dropdown` (1000, dropdowns and popovers) and `--z-overlay` (9999, modals). Values from v1, unchanged.

**Code.** `components/layout.css`: `.container` (`.container--wide`), `.grid-12`, `.prose-article` with `.breakout` and `.breakout--full`. No script.

*Open:* rules for choosing a spacing step (a rhythm per context, or a step per relationship); whether the 2 and 4px steps stay.
