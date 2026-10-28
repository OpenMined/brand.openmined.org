---
type: Color
title: Color
description: One gray and six hues, each in eleven steps from 50 to 950, with roles that say what each color is for.
status: working
tags: [color]
tokens: [--on-key, --line, --line-strong, --text-headline, --text-body, --text-muted, --emphasis, --on-emphasis, --accent-subtle, --accent-soft, --accent-fg, --accent-key]
---

The palette has one gray and six hues (violet, blue, teal, green, amber, red), and every scale runs **50, 100–900, 950**, light to dark. White and black sit outside the scales.

## The scales

- **Gray** is the same in both modes. Every surface, line, and text color names one of its steps.
- **Hues** shift slightly per mode. Light mode raises saturation ×1.10, so a color that holds up on dark doesn't go dull on white; dark mode takes the palette as it is. Lightness and hue stay the same.
- **One lightness ladder.** Every hue step except 400 and the key sits at the same lightness in every hue, so a role gives the same contrast whatever the color.
- **The key is 500.** It keeps each hue's own character, and it's the color graphics and chart marks use.
- **Red leans toward rose**, so it reads as OpenMined's red rather than a generic one (decision *Red moves toward rose*).
- **Steps without a job yet** (hue 50, 900, and 950) are provisional: each is tuned when something first uses it.

## Roles

Components use roles, never steps. Each hue and status has four roles, and each names a step per mode:

| Role | Light | Dark | For |
| --- | --- | --- | --- |
| `subtle` | 100 | 800 | A quiet colored background: callout, selected row |
| `soft` | 200 | 700 | A decorative rule, a selected outline, an area fill. No text |
| `fg` | 600 | 400 | Colored text, links, icons. AA on every surface |
| `key` | 500 | 500 | Marks: chart series, dots, progress, strokes. The colored fill: strong status chips, colored buttons (*Color fills use the key*) |

One label serves every key: **`--on-key`**, white in both modes, for text or an icon on any hue's or status's key (*White on every colored fill*).

**Status** colors are their own roles, each pointing at a hue: `success` → green, `warning` → amber, `danger` → red, `info` → blue. `--danger-fg` is `--red-fg`, so a status can move to another hue without touching a component.

**Accent** is the interactive color, and it's a hue: green, with green's roles (`--accent-subtle`, `--accent-soft`, `--accent-fg`, `--accent-key`), as `--success-*` points at green. Elements are gray at rest; the accent arrives with interaction, as the still green of the minimal layer (`--accent-key`). Where the accent moves it becomes a gradient: the brand gradient on link hover, the hue keys on button hover, a hue's two-tone on icons in color (decisions *Green is the accent's color*, *Green at rest, gradients in motion*). Pick accent roles by intent, not by look ([Use accent by intent](#guidelines-accent-by-intent)).

**Emphasis** is the strong gray fill, the primary button: `--emphasis` (the headline gray as a fill) with `--on-emphasis` as its label.

## Text and lines

| Role | Light | Dark | For |
| --- | --- | --- | --- |
| `--text-headline` | gray 800 | gray 50 | Headings, strong text, labels |
| `--text-body` | gray 600 | gray 200 | Body and interface text |
| `--text-muted` | gray 500 | gray 400 | Secondary text: the lead, captions, notes, placeholders |
| `--line` | gray 300 | gray 600 | Dividers, and every line in a diagram |
| `--line-strong` | gray 600 | gray 200 | The line style: outlines, the secondary button, link underlines |
| `--line-focus` | gray 500 | gray 400 | Focus on form controls |

Every text role reaches 4.5:1 on all four surface levels in both modes. *Typography* and *Lines* say where each is used.

## Open

- `soft` covers both strokes and area fills, which may need different steps.
- Light `--accent-soft` and `--accent-subtle` resolve to the same step.
- Whether the palette needs a saturated stop, and whether the website's deep magenta (`#ab3c81`, which no step reaches) needs one.
