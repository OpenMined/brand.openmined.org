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
