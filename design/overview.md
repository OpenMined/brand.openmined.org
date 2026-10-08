---
type: Design System
title: Overview
description: What the OpenMined brand system is, the principles every value is judged against, and how to use it.
status: working
tags: [overview]
---

The OpenMined brand system is the shared source for how OpenMined looks: its colors, surfaces, type, components and graphics, with the reasons behind them. Websites, apps, documents and graphics all draw from it, and AI tools read it the same way people do.

This is version 2, in progress. It evolves the existing brand rather than replacing it.

## Principles

- **Evolve, don't rebrand.** Build on the existing tokens and components.
- **Web and graphics first.** Pages and graphics outrank app interfaces when a choice trades one for the other.
- **A small set, each with a clear job.** Four surface levels and 66 chromatic values (6 hues × 11 steps), each named for what it does.
- **Graphics take their colors from the palette.** No second color set to keep in step.
- **Both color modes are first-class.** Every value is defined and judged in light and dark.

## How to use it

- **Use tokens by name, never by value.** Write `var(--surface-raise-1)`, not the hex it resolves to. Names stay stable when values are retuned.
- **Prefer roles over steps.** `--text-muted` or `--danger-fg` says what a color is for; a step like `--gray-500` only says what it looks like. Graphics are the exception: they use fixed steps through each hue's `key`, so their colors hold when the mode switches.
- **Check the status.** Every token and every guidance file carries one:
  - `exploring`: a placeholder or an option still being compared. Previews only.
  - `working`: a chosen direction, approved to build on, not final. Previews and drafts.
  - `released`: part of a tagged release. Safe everywhere.
  - `deprecated`: being replaced; it names its replacement.

## Where things live

- **Values:** `tokens/`, in the open Design Tokens format, built into `src/tokens/v2/` (CSS, JavaScript for canvas embeds, and JSON).
- **Guidance:** `design/`, one short Markdown file per idea, grouped by kind: `foundations/`, `components/`, `patterns/`, `behaviors/`, `guidelines/`, and `decisions/` for the reasons behind a value.
- **Review rounds:** the explorations each decision came from, kept as evidence.

## What stays human

Some calls are made by people on purpose; AI can prepare options and files, but a person decides. A first list, still to confirm: final taste decisions on new visual directions, hero imagery, and the logo and brand marks.
