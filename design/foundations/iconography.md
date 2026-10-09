---
type: Iconography
title: Icons
description: Outlined, one-color icons from Iconoir, drawn in the color of the text around them. Only status icons take color.
status: exploring
tags: [icons]
tokens: [--success-fg, --danger-fg, --warning-fg, --info-fg]
---

Icons are **outlined** and **one color**. They take the color of the text around them (`currentColor`), so an icon in a muted line is muted and an icon in a link takes the link color. They never take a gradient or a second color.

## Library

**Iconoir** ([iconoir.com](https://iconoir.com), MIT license) is the v2 library: 1,383 outlined icons on a 24px grid. Use its **regular** (outlined) set, **drawn at a 2 stroke** rather than Iconoir's 1.5: the live site's weight, and a 1.5 line straddles pixels and never reaches its full color, so icons read grayer, most on dark. It also has 288 filled icons; those aren't used, so every icon reads as one family.

- **Our own icons** go in `public/icons/` on the same 24px grid with a 2 stroke. One with the same name replaces the Iconoir icon everywhere.
- **Brand logos never come from Iconoir.** Iconoir redraws some brands (GitHub, LinkedIn, X); partner logos come only from the official files in `public/logos/partners/`, shown on the [Graphics](/graphics/#logo) page.
- **v1 and the live site keep their current icons** until v2 is released: a hosted set of 61 from mixed sources (2px and 1.5px strokes, five already from Iconoir) plus Ionicons loaded on opt-in pages. The table on this page maps every one of them to Iconoir for the move.

## Color

Status icons are the one exception: they take their status's `fg` role, the role for colored text and icons, so they pass contrast on every surface. Check is success, X is danger, a triangle is warning, a circled *i* is info. See [Status icons take their status color](#guidelines-icons-one-color).

## Size

- **Inline with text:** 1em, so the icon matches the text it sits in.
- **On their own:** 20px by default; 16px for dense rows; 24px, the grid size, for emphasis.
- Every icon draws at a 2 stroke (on the 24 grid); it scales with the icon (about 1.3px at 16px).

## Use

- Put an icon next to a word, not instead of one, unless the icon is universal (close, menu, search) and has an accessible name.
- A decorative icon is hidden from screen readers; an icon that is the only content of a button carries its label.
- **Partner marks used inline** (an integrations list, a "Sign in with" button) follow these sizes and alignment, but not the style or color rules: they're used as supplied.

*Open:* size tokens (`--icon-sm/md/lg`) once the interface round needs them; the four live icons with no Iconoir match (enforcement, handshake, network discovery, scale) and whether OpenMined draws its own; whether status icons stay filled, as on the live site, or go outlined; official files for the brands with no partner mark yet.
