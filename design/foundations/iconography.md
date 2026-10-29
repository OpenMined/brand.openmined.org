---
type: Iconography
title: Icons
description: Outlined icons from Iconoir, mono by default in the color of the text around them. Status icons take their status color; an icon in color takes its hue's two-tone, moving.
status: released
tags: [icons]
tokens: [--success-fg, --danger-fg, --warning-fg, --info-fg]
---

Icons are **outlined** and **mono** by default. They take the color of the text around them (`currentColor`), so an icon in a muted line is muted and an icon in a link takes the link color.

## Library

**Iconoir** ([iconoir.com](https://iconoir.com), MIT license) is the v2 library: 1,383 outlined icons on a 24px grid. Use its **regular** (outlined) set, **drawn at a 2 stroke** rather than Iconoir's 1.5: a 1.5 line straddles pixels and never reaches its full color, so icons read grayer, most on dark. Iconoir's 288 filled icons aren't used, so every icon reads as one family.

- **Our own icons** go in `public/icons/`, on the same 24px grid, in `currentColor`, with no stroke width of their own: the set gives every icon its stroke, by size. `npm run icons:import` turns any SVG into one (another grid is scaled to 24 with the line kept at v2's weight; colors become `currentColor`), and stops with the reason on what needs a designer: white knockouts, a second color.
- **Brand logos never come from Iconoir, and are always fills.** Iconoir redraws some brands (GitHub, LinkedIn, X); partner logos come only from the official files in `public/logos/partners/`, shown on the [Graphics](/graphics/#logo) page. A brand drawn in outline has its own line weight, so its mark is flattened to a fill before it comes in; the build stops on a stroked partner mark.

## The set

Every icon v2 uses has an entry in `icons/set.json`, by name: where its drawing comes from (Iconoir, our own, or a partner mark), its style (`line`, or `solid` where chosen), its review status (`proposed`, then `approved`), and a note. Components ask for the name, never a file, so changing an entry changes that icon everywhere, and a name that isn't in the set stops the build: the set is always the full list of icons in use. The same file maps each icon v1 and openmined.org use to the set icon that replaces it. The *Set* table on this page is a view of it; `icons/README.md` has the steps for reviewing and changing icons.

## Color

Two exceptions to mono. **Status icons** take their status's `fg` role, the role for colored text and icons, so they pass contrast on every surface. Check is success, X is danger, a triangle is warning, a circled *i* is info. See [Icons are mono unless they're status or in color](#guidelines-icons-one-color).

**In color**, where the design calls for it: the icon takes a hue's two-tone gradient (`--gradient-two-tone-<hue>`), moving inside the stroke, with a soft glow behind (decision *Icons have a color mode*; *Two-tone gradients*). In a hover card, the icon is mono at rest and takes its color on hover.

## Size

- **Inline with text:** 1em, so the icon matches the text it sits in.
- **On their own:** 20px by default; 16px for dense rows; 24px, the grid size, for emphasis.
- **Weight by size.** Every icon draws at a 2 stroke on the 24 grid, which scales with the icon up to 24px (1.33px at 16, 1.67px at 20, 2px at 24). Above 24px the line holds at 2px: the stroke is `min(2, 48 ÷ size)`, so 1.5 at 32px and 1.2 at 40px. Large icons in cards and diagrams otherwise grow heavy (a 2 stroke at 40px is 3.3px). Holding at 2px also keeps the line on whole pixels.

## Use

- Put an icon next to a word, not instead of one, unless the icon is universal (close, menu, search) and has an accessible name.
- A decorative icon is hidden from screen readers; an icon that is the only content of a button carries its label.
- **Partner marks used inline** (an integrations list, a "Sign in with" button) follow these sizes and alignment, but not the style or color rules: they're used as supplied.

*Open:*
- An audit of the Iconoir icons in the set: some carry hard-set strokes (map pin, network, microphone), and the DNA icon reads heavy.
- Whether "icons are lines, except where chosen" is the rule; the set carries a `solid` style for the exceptions.
- Size tokens (`--icon-sm`, `-md`, `-lg`).
- Four icons with no Iconoir match (enforcement, handshake, network discovery, scale): draw our own or not.
- Whether status icons are filled or outlined.
- Official files for the brands with no partner mark yet.
