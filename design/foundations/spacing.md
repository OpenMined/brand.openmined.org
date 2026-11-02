---
type: Spacing
title: Layout
description: Eleven spacing steps from 2 to 48px and a section step (88px), space set by the container (a stack), a 1300px page on twelve columns, an article's reading column with wide and full breakouts, three breakpoints, and a fixed stacking order.
status: released
tags: [layout]
tokens: [--spacing-section, --spacing-3xs, --spacing-2xs, --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl, --spacing-3xl, --spacing-4xl, --spacing-5xl, --page-width, --page-width-wide, --page-gutter, --grid-columns, --grid-gap, --grid-column, --grid-span-4, --grid-span-5, --grid-span-6, --grid-span-8, --grid-span-10, --prose-content, --prose-wide, --prose-full, --breakpoint-lg, --breakpoint-md, --breakpoint-sm, --z-below, --z-card, --z-base, --z-sticky, --z-dropdown, --z-overlay]
---

**Spacing.** Eleven steps: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, and 48px (`--spacing-3xs` to `--spacing-5xl`). Use a step for every gap, padding, and margin, never a value between them. One more, `--spacing-section` (88px), is the space above and below each section of a page.

How the components use the steps: a status chip is padded `2xs` and `sm`, a field's parts sit `xs` apart, options in a list `sm`, buttons in a row `md`, a hover card's icon and text `lg`, cards in a row `xl`, fields in a form `2xl`; a hover card is padded `4xl` top and bottom and `3xl` at the sides, `5xl` top and bottom when large.

**Space belongs to the container.** The space between two things depends on both of them and on where they sit, so neither can know it alone: a heading's margin that suits an article is wrong in a card, and a paragraph's is wrong at the end of a panel. So whatever holds them decides, and headings, paragraphs and blocks carry no margin of their own. Three containers do: a **long read** (`.prose`), whose rhythm reads which element follows which (more room above a heading than below it); a **component**, which spaces its own insides; and everywhere else a **stack**. A component has no outer margin of its own; its parent places it.

**Stacks.** `.stack` puts the same space between every pair of its children: `lg` (16px, a long read's gap between blocks) by default, `.stack--2xs` to `.stack--5xl` for any other step. Space goes only between children, never before the first or after the last, so a stack sits in its parent without extra air. **To keep a heading with its content, nest**: a tight stack holds the heading and its text, a looser stack spaces the groups. As a guide: 4–8px for a tight pair (a date over its line, a heading over its text), 12–16 for items in a group, 20–24 for blocks in a column, 32–48 for sub-sections inside a section. **When to use one:** when you compose from the served files without writing CSS (a Claude artifact, a page built on `/omds.css`). In your own stylesheet, a container's `gap` does the same job; running text is a long read, not a stack. To change the space above one child alone, set `--stack-space` on it. Between sections, `--spacing-section`.

**The page.** Content runs to `--page-width` (1300px) inside the page container (`.container`), which keeps `--page-gutter` (20px) between it and the viewport edge. Bands that run wider, such as a footer bar, take `--page-width-wide` (1400px).

**The grid.** Twelve columns (`--grid-columns`) of 90px (`--grid-column`) with 20px gaps (`--grid-gap`), across the 1300px page: `.grid-12`, children placed with `grid-column` (`2 / 12` for ten columns with one of air each side). Below `--breakpoint-lg` it is one column. For a centered block without the grid, cap its width at a span: `--grid-span-4` (420px), `-5` (530, the form card), `-6` (640), `-8` (860), or `-10` (1080).

**Articles.** A blog post or long read sits on three zones (`.prose-article`). Blocks are placed by zone name, never by column: every block takes the reading column, `--prose-content` (640px). A figure, table, or embed wider than the text breaks out to the wide zone with `.breakout`, `--prose-wide` (860px). A full breakout, `.breakout--full`, leaves the article for the page width, `--prose-full` (1300px), centered and kept inside the gutters on narrow screens. The article owns no horizontal padding: the gutter belongs to the container around it.

The reading column and the wide zone are **set apart from the grid**: they start equal to six and eight columns, but a reading measure is tuned as type, so changing one never moves the grid, and changing the grid never moves articles. Whoever retunes the grid checks whether articles should follow. The full zone stays the page width.

**Breakpoints.** `--breakpoint-lg` (991px, below desktop: the grid collapses), `--breakpoint-md` (767px, below tablet: text measures are lifted) and `--breakpoint-sm` (479px, phones). Media queries can't read tokens, so they write the number; the tokens name the set and serve scripts.

**Stacking.** Six fixed layers, so nothing invents a z-index: `--z-below` (−1, behind its container), `--z-card` (5, a full-cover link over a card), `--z-base` (10, an element lifted over its neighbors), `--z-sticky` (100, the sticky header), `--z-dropdown` (1000, dropdowns and popovers), and `--z-overlay` (9999, modals).

**Code.** `components/layout.css`: `.container` (`.container--wide`), `.grid-12`, `.prose-article` with `.breakout` and `.breakout--full`, `.stack` (`.stack--2xs` to `.stack--5xl`). No script.

*Open:* rules for choosing a spacing step (a rhythm per context, or a step per relationship); whether the 2px step stays.
