# Partner / integration marks

Third-party tool logos used to identify integrations — **not** OpenMined brand
assets. Each mark is the **trademark of its owner** and is used nominatively
(to refer to the product). They are governed by each owner's brand guidelines,
**not** by OMDS:

- **Never recolor or restyle** a mark where the owner forbids it (e.g. Google's
  4-color G must stay as-is). OMDS color tokens do **not** apply here.
- **Never imply endorsement or partnership** that doesn't exist.
- Some owners (Google, HubSpot, Slack, GitHub) require permission for certain
  uses — confirm the surface is referential before shipping externally.

## Files (per brand, see `partners.json` for the full record)

- `icon.svg` — monochrome glyph, `fill="currentColor"`. Inline it and set `color`
  to theme it (mono / "1-color"). As an `<img>` it renders black.
- `icon-color.svg` — the mark in its **official brand color** (or full color for
  multicolor marks like Google's G). Use via `<img>`; do not recolor.
- `logo-*.svg` / `logo.svg` — full wordmark lockups where officially available
  (currently GitHub black/white, Ramp).
- `icon-color-dark.svg` / `logo-dark.svg` — the color file for **dark mode**,
  only where the color mark's ink would vanish on a dark surface (AWS, Rippling).
  Recorded under `dark` in `partners.json`; `derived` says when it was made by
  OpenMined (dark ink set to white, as in the owner's reversed logo) rather than
  supplied, and `gaps` asks for the official file.

## Color mode

Every mark must read on light and dark surfaces. One-color marks do by
themselves (inline them). Color marks are checked: the brand site's build
(`src/lib/partners.ts`) fails on any visible color under 1.5:1 against a mode's
surfaces, unless the brand has a dark file or a `modeCheck` reason. `PartnerLogo`
swaps a brand's `-dark` file in wherever the page or a section is dark.

`partners.json` is the source of truth: per brand it records the trademark owner,
official source URL, available variants, brand color, and known **gaps** (marks
that still need an official file dropped in — e.g. Rippling, Slack's 4-color icon,
several wordmark lockups behind brand-kit gates).

## Source

Lockups/marks are official (GitHub `GitHub_Logos.zip`, Ramp production SVG,
Google 4-color G artwork). Monochrome glyphs for single-color icons come from
[Simple Icons](https://simpleicons.org) (CC0 file license; trademarks remain the
owners'). Never redraw a mark — source it officially or leave it as a documented
gap.
