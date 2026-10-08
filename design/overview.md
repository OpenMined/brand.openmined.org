---
type: Design System
title: Overview
description: What the OpenMined Design System is, the principles every value is judged against, and how to use it.
status: working
tags: [overview]
---

The OpenMined Design System is the shared source for how OpenMined looks: its colors, surfaces, type, components and graphics, with the reasons behind them. Websites, apps, documents and graphics all draw from it, and AI tools read it the same way people do.

This is version 2, in progress. It evolves the existing brand rather than replacing it. The structure comes first (the token files, the guidance files and the build that keeps them in step), so each design decision that follows has a place to live.

## How it's built

Every page on this site is a view of source files in the brand repository. Nothing is typed into a page by hand: each page reads the same files that code and AI tools read.

| What you see on a page | Where it comes from | Who reads it |
| --- | --- | --- |
| Every color, shadow, swatch and token table | `tokens/`<br>Values in the open Design Tokens format, built into `src/tokens/v2/` as CSS, JavaScript and JSON | Code, design tools, AI |
| Rules, decisions, open questions, and these words | `design/`<br>One short Markdown file per idea, grouped by kind (`foundations/`, `components/`, `patterns/`, `behaviors/`, `guidelines/`, `decisions/`) | People, on these pages; AI, directly |
| Layout and live demos | The site's page templates | People |

Change a value or a rule at its source and every page, project and AI agent gets the change. This overview is `design/overview.md`. The review rounds, where each decision was explored, are kept as evidence.

## Principles

- **Evolve, don't rebrand.** Build on the existing tokens and components.
- **Web and graphics first.** Pages and graphics outrank app interfaces when a choice trades one for the other.
- **A small set, each with a clear job.** Four surface levels and 66 chromatic values (6 hues × 11 steps), each named for what it does.
- **Graphics take their colors from the palette.** No second color set to keep in step.
- **Both color modes are first-class.** Every value is defined and judged in light and dark.
- **Avoid trends, AI design trends especially.** A treatment that reads as AI-generated house style is the worst case: check every new element against it before adopting it.

## How to use it

- **Use tokens by name, never by value.** Write `var(--surface-raise-1)`, not the hex it resolves to. Names stay stable when values are retuned.
- **Prefer roles over steps.** `--text-muted` or `--danger-fg` says what a color is for; a step like `--gray-500` only says what it looks like. Graphics are the exception: they use fixed steps through each hue's `key`, so their colors hold when the mode switches.
- **Check the status.** Every token and every guidance file carries one:
  - `exploring`: a placeholder or an option still being compared. Previews only.
  - `working`: the current direction, not final. Previews and drafts.
  - `released`: part of a tagged release. Safe everywhere.
  - `deprecated`: being replaced; it names its replacement.

## What stays human

Some calls are made by people on purpose. In these areas AI can research, prepare options and produce files, but a person makes the call. A working list, to iterate:

- **Taste decisions on new visual directions.** Choosing between options in a review round, and approving a direction. AI can generate and compare the options.
- **Imagery: concept and composition.** A person sets what an image says and how it's laid out. Production can run through AI generation, but prompt-and-accept is not the model.
- **The logo and brand marks.** Used as supplied: never generated, redrawn or recolored by AI.
