# Page reviews

Real openmined.org pages (home and `/syfthub/`), ported into the brand site so the
v2 design system can be tried on them. **Working material, not part of the guide**:
findings that settle move to `design/`; the pages are expected to go before release.
Notes and findings: `/page-reviews/` (from `findings.ts`).

## What's where

| Path | What |
| --- | --- |
| `openmined-org/` | The port: components, layouts, styles, data and icons copied from `OpenMined/openmined-org` at `3fbc850` (2026-10-09), import aliases made relative. Stylelint-exempt (it's the "before"). |
| `live.css` / `v2.css` | `live.css` is the port's own styles; `v2.css` imports it and puts v2 on top. Routes import `v2.css`; none of it reaches the guide pages. |
| `v2/bridge.css` | Live token names → v2 tokens. Most of the v2 pass. |
| `v2/pass.css` | Component-level changes, each naming the `design/` rule it applies. |
| `v2/motion.css` | Color in motion: the working favorites from `/rounds/motion/` (button hover, icons in a set hue). |
| `v2/V2Pass.astro` | The pass's markup changes, at runtime: a gradient map behind each CTA; the button hover layers; colored icons where marked `data-color-icons` (in order) or `data-icon-hue`; hover cards' icons on hover (`data-hover-hue` on the card to set the hue). |
| `ReviewHead.astro`, `ReviewBar.astro` | Rendered by the ported `Base.astro`: v2 colors for the hero graphics; the floating bar (switches page) and link rewriting. |
| `reviews.ts`, `findings.ts` | The page list and the review notes. |
| `../pages/page-reviews/` | Routes: `<page>/` is the v2 pass (the live ports were dropped 2026-10-13; openmined.org is the reference). Each sets `Astro.locals.review`. |
| `../../public/page-reviews/` | Org logos and the CTA raster from openmined.org. |

## Changes to the port

Every change is marked `PORT` (a cut or substitution) or `PORT SEAM` (a hook for
the v2 pass) in its file:

- `layouts/Base.astro`: SEO, JSON-LD, analytics, the Astro 7 Fonts API (fonts
  come from Google Fonts here; `styles/fonts.css` supplies the variables), the
  donate and search dialogs, Ionicons and the HubSpot loader removed. CSS imports
  moved to `live.css`. Renders the review head and bar.
- `layouts/Page.astro`: schema type import dropped.
- `components/elements/FormEmbed.astro`: a static mock of the HubSpot embed
  markup (fields from the forms' public definitions in `data/forms.json`), so
  nothing can submit to the CRM.
- `Partnerships`, `HomePressRoom`: organizations from `data/organizations.json`
  instead of a content collection; press links go to the live blog.
- `OrgLogo`, `organizations.json`, `CtaSection`: asset paths under `/page-reviews/openmined-org/`.
- Seams: `Icon.astro` (v2 icons on v2 routes), `DiamondEmbed` / `StreamEmbed`
  (colors from `window.OM_REVIEW_COLORS`), `SyftHub.astro` (Core Components
  wrapped in `data-color-icons`), `HomeFederatedNetwork.astro` (pillar hues).

## Refresh or remove

**Refresh:** re-copy the files listed above from `openmined-org` (`git fetch`, then
`git show origin/HEAD:<path>`; the local clone can be stale), rewrite `@ui/`,
`@elements/` … aliases to relative paths, and re-apply the marked changes. Update
`SOURCE` in `reviews.ts`.

**Remove:** delete this folder, `src/pages/page-reviews/`, `public/page-reviews/`,
the `REVIEWS` nav group in `src/layouts/Site.astro` (and `.bar__group` in
`site.css`), and the `src/page-reviews/openmined-org/**` line in `stylelint.config.js`.
