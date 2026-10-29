---
type: Design System
title: Overview
description: What the OpenMined Design System is, the principles every value is judged against, and how to use it.
status: released
tags: [overview]
---

The OpenMined Design System is the shared source for how OpenMined looks: its colors, surfaces, type, components, and graphics, with the reasons behind them. Websites, apps, documents, and graphics all draw from it, and AI tools read it the same way people do.

This is version 2. It evolves the existing brand rather than replacing it. Each value and rule carries its own status, so you can tell what's settled from what's still moving.

## How it's built

Every page on this site is a view of source files in the brand repository: each page reads the same files that code and AI tools read.

| What you see on a page | Where it comes from | Who reads it |
| --- | --- | --- |
| Every color, shadow, swatch, and token table | `tokens/`<br>Values in the open Design Tokens format, built into `src/tokens/v2/` as CSS, JavaScript, and JSON | Code, design tools, AI |
| Rules, decisions, open questions, and these words | `design/`<br>One short Markdown file per idea, grouped by kind (`foundations/`, `components/`, `patterns/`, `behaviors/`, `guidelines/`, `decisions/`) | People, on these pages; AI, directly |
| Buttons, fields, links, cards: the components and their code | `components/`<br>One CSS file per component and a small script for each one that moves, plain files any site can load; the markup to match is at the top of each | Code, AI |
| Layout and live demos | The site's page templates | People |

Change a value or a rule at its source and every page, project, and AI agent gets the change. This overview is `design/overview.md`.

## Principles

- **Evolve, don't rebrand.** Build on the existing tokens and components.
- **Web and graphics first.** Pages and graphics outrank app interfaces when a choice trades one for the other.
- **A small set, each with a clear job.** Four surface levels and 66 chromatic values (6 hues × 11 steps), each named for what it does.
- **Graphics take their colors from the palette.** No second color set to keep in step.
- **Both color modes are first-class.** Every value is defined and judged in light and dark.
- **Avoid trends, AI design trends especially.** A treatment that reads as AI-generated house style is the worst case: check every new element against it before adopting it.

## How to use it

- **Use the components as they are.** Load the files a page needs from `components/` and match their markup; don't rebuild a component by eye, or the values tuned by hand drift.
- **Use tokens by name, never by value.** Write `var(--surface-raise-1)`, not the hex it resolves to. Names stay stable when values are retuned.
- **Prefer roles over steps.** `--text-muted` or `--danger-fg` says what a color is for; a step like `--gray-500` only says what it looks like. Graphics are the exception: they use fixed steps through each hue's `key`, so their colors hold when the mode switches.
- **Check where it runs.** Colors and stills work anywhere, documents and slides too; some motion needs a web page or a script (*Color moves*, "Where it runs"). Where a move can't run, use its still frame.
- **Check the status.** Every token and every guidance file carries one. Everything on this site is `released`: use it. A `deprecated` item names its replacement; move off it. Work in progress is `draft` and never appears here.

## Feedback

Tell us when the system didn't cover something, looked wrong, or you had to work around it: what you were making, what you needed, and what you did instead. A screenshot helps most.

- **With GitHub:** open an issue on the brand repository with the **Design system feedback** form. AI tools with the OpenMined plugin file it for you, after showing you the text.
- **Without:** send it to the design lead.

The design lead reviews feedback every week. A change to the system becomes a decision record and a line in the change log; what changed shows on this page.

## What stays human

Some calls are made by people on purpose. In these areas AI can research, prepare options, and produce files, but a person makes the call.

- **Taste decisions on new visual directions.** Choosing between design options, and approving a direction. AI can generate and compare the options.
- **Imagery: concept and composition.** A person sets what an image says and how it's laid out. Production can run through AI generation, but prompt-and-accept is not the model.
- **The logo and brand marks.** Used as supplied: never generated, redrawn, or recolored by AI.
