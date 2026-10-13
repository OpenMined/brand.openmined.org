---
type: Color
title: Color
description: One gray and six hues, each in eleven steps from 50 to 950, with roles that say what each color is for.
status: working
tags: [color]
tokens: [--line, --line-strong, --text-headline, --text-body, --text-muted, --on-solid, --accent-solid, --accent-hover, --accent-on, --accent-subtle, --accent-soft, --accent-fg]
---

The palette is called **Ink**. Every scale runs **50, 100–900, 950**, light to dark: one gray and six hues (violet, blue, teal, green, amber, red). White and black sit outside the scales.

## The scales

- **Gray** is the same in both modes. Every surface, line and text color names one of its steps.
- **Hues** shift slightly per mode: saturation ×1.10 in light, so a color that holds up on dark doesn't go dull on light. Dark takes the palette as it is (×1); until 9 Oct 2026 it was ×0.95, and the change is being tried. Lightness and hue don't change.
- **One lightness ladder.** Every hue step except 400 and the key sits at the same lightness in every hue, so a role means the same contrast whatever the color.
- **The key is 500.** It keeps each hue's own character, and it's the color graphics and chart marks use.
- **New steps are provisional.** Gray 300–500 and hue 50, 400, 900 and 950 were added with the 50–950 series. Each is tuned in the round that first gives it a job. Hue 400 has one now: `fg` in dark mode.

## Roles

Components use roles, never steps. Each role names a step per mode:

| Role | Light | Dark | For |
| --- | --- | --- | --- |
| `subtle` | 100 | 800 | A quiet colored background: badge, callout, selected row |
| `soft` | 200 | 700 | A decorative rule, a selected outline, an area fill. No text |
| `fg` | 600 | 400 | Colored text, links, icons. AA on every surface (dark moved from 300 to 400 on 9 Oct 2026, exploring) |
| `key` | 500 | 500 | Marks with no text: chart series, dots, progress, strokes |
| `solid` | 600 | 300 | A fill that carries a label: buttons, solid badges, checked controls |
| `hover` | 700 | 200 | One step past solid |
| `on` | white | gray 950 | Text or icon on any solid, every hue |

**Status** colors are their own roles, each pointing at a hue: `success` → green, `warning` → amber, `danger` → red, `info` → blue. `--danger-fg` is `--red-fg`, so a status can move to another hue without touching a component.

**Accent** is the role for interactive and brand-emphasis elements: the primary call-to-action button's fill is `--accent-solid`, and links, selected states and focus rings are candidates. It is grayscale for now (ink), with one colored role: `--accent-key`, the green key, the static accent, for wherever a color is needed and none is specified (a page's alternate color, colored fills, focus; see [Green is the accent's color](#decisions-2026-10-12-green-is-the-accent-color)). Where the accent moves, it steps up to a gradient: the full OM gradient on button and link hover, a hue's two-tone gradient on icons in color (see [Green at rest, gradients in motion](#decisions-2026-10-13-accent-in-motion)). Whether the whole accent takes a color, and exactly which elements use it, are interface decisions still to come; until then, use it by intent (see [Use accent by intent](#guidelines-accent-by-intent)).

## Text and lines (placeholders)

Text and line roles are placeholders until the text-and-lines round:

| Role | Light | Dark |
| --- | --- | --- |
| `--text-headline` | gray 800 | gray 50 |
| `--text-body` | gray 600 | gray 200 |
| `--text-muted` | gray 500 | gray 400 |
| `--line` | gray 200 | gray 600 |
| `--line-strong` | gray 600 | gray 200 |

## Open

- Dark `--text-muted` is 4.48:1 on `raise-2`, just under AA's 4.5. Light `--text-muted` is 4.13:1 on `sunken`.
- `--line` and `--surface-sunken` share gray 200 in light mode.
- `--line-strong` is the line style: outlines, the secondary button, link underlines. It takes the same gray step as `--text-body` (2026-10-12). A lighter divider step (`gray-250`) may be needed.
- `soft` covers both strokes and area fills, which may need different steps.
- The accent snapped to the new series: light `accent-soft` now equals `accent-subtle`.
- **Red toward rose (trial, 2026-10-12).** The red key moved from hue 24.3 to 20.6, with a touch more chroma, so it reads as OpenMined's red, not a generic one; lightness is unchanged and the previous red is kept as a backup. See [Red moves toward rose](#decisions-2026-10-12-red-toward-rose).
- Whether a saturated stop is needed, and whether the site's deep magenta (`#ab3c81`, which no palette reaches) needs a vividness boost: held until more design problems are solved.
