---
type: Shape
title: Lines
description: One line style, the body text color at 1px, for every outline, the secondary button and link underlines. A lighter divider separates things.
status: exploring
tags: [surfaces]
tokens: [--line-strong, --line, --stroke-sm, --stroke-md]
---

Lines are drawn, not boxed: an outline shows the same surface on both sides of it (see *Outlines are lines, not containers*). Two colors and two widths cover every line.

| Token | Value | Use it for |
| --- | --- | --- |
| `--line-strong` | the `--text-body` gray step | **The line style.** Outlines, the secondary button's outline, link underlines and the text button's hover line. |
| `--line` | gray 200 · gray 600 dark | Dividers: a single edge between two things. Every line in a diagram (Kyle, 2026-10-12). |
| `--stroke-sm` | 1px | Every line, unless one below applies. |
| `--stroke-md` | 1.5px | A diagram's outer outline, one step above the lines inside it. |

**One line style.** The outline, the secondary button and the underline are the same line: `--stroke-sm` in `--line-strong`, the same gray step as the body text (Kyle, 2026-10-12). Hover adds the accent on top of an underline; it doesn't change the line underneath.

**Diagrams draw in `--line`.** A diagram carries many lines at once, so its outlines, dashed boxes and chips use the quieter divider color, not the line style (Kyle, 2026-10-12).
