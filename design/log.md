# Change log

Newest first. What changed in the brand system and when.

- **2026-10-09** — Infographics round, rev 2: rev 1's three SVG directions dropped (too few containers to stay legible; none used the surfaces). The original overview diagram rebuilt in HTML on the system's own surfaces, in three treatments: outlines outside with surfaces inside; outlines outside with color fills inside; surfaces outside with lines inside. Surfaces are the first tool; outlines and lines are the infographic layer. Three type sizes, two line widths at most.
- **2026-10-09** — Each animated graphic gets its own color list: `--gradient-flow` (the colorflow, unchanged) and `--gradient-map` (the gradient map: magenta on the left, no blue, after Bennett's "red too red, blue area too heavy"). New graphics-only extra stop, **magenta**, sampled from the live CTA raster. Round opened: *Gradient map colors* (`/rounds/gradient-map/`). Exploring. The palette's red is unchanged; whether it moves toward magenta is decided later.
- **2026-10-09** — *One label color per step*: the "no interface text on the key" clause removed (interface design ahead of its time); the one-color-per-step rule stays, now white on 500–800. Set to `exploring`. The key's contrast (3.8:1 on green and amber) is a watch item. The 2026-09-24 decision record stands until a new one replaces it.
- **2026-10-09** — Status chips, working favorites on the Color page: quiet is an outline with no fill (ring and text in `fg` light, step 400 dark); strong is the key with white text, marked under AA (3.8:1 on success and warning) for Bennett's call.
- **2026-10-09** — Forms: every piece of form text is one size (descriptions and errors were smaller); labels are the only heavier weight, errors are regular.
- **2026-10-09** — Gradient map (`<om-mesh>`): new `saturation` attribute, a final chroma scale in OKLab (1 = unchanged, so existing embeds don't change). Shown on the Graphics page with a slider; default set to 1.1 (Kyle, 2026-10-09). Exploring.
- **2026-10-09** — Status round: the quiet outline takes 400 in dark (one step richer than fg); *Outline and dot* rings in the key; *Dot only* removed. Form error text takes red 400 in dark. Corners section shows the four sizes only. Links to the color round no longer apply the old ×0.95 dark offset.
- **2026-10-09** — Round opened: *Infographics* (`/rounds/infographics/`). Three directions for the overview diagram (line hierarchy, color groups, plate) and an inventory of what dense graphics need, from the overview diagram and the Four Pillars deck. Outlines may come back for infographics; nothing decided.
- **2026-10-09** — Round opened: *Status chips* (`/rounds/status/`). Three strong and five quiet options on base, raise-1 and raise-2, pill or squared.
- **2026-10-09** — Dark mode no longer desaturates the hues (saturation ×1, was ×0.95), to try a less muted dark mode. Exploring; 131 dark values shift slightly.
- **2026-10-09** — Form errors are danger-colored text under the field, no box (was a card one level above the form). Form labels match the control's text size (15px) at weight 600; option text stays regular. Each form may choose where its labels go. Exploring; the *Error is a surface* decision stands until this is confirmed.
- **2026-10-09** — Corner radius tokens: `--radius-sm` 4px, `--radius-md` 6px, `--radius-lg` 10px, `--radius-full`, in `tokens/base/radius.json`, shown on the Surfaces page (*Corners*, `foundations/shape.md`). Biased sharp: the site's 16px outer corners become 10px, and the sunken tile's 3px corner matches the rest. Exploring.
- **2026-10-08** — Site title is now *OpenMined Design System*, matching the skill (`openmined-design-system`) and OMDS; a placeholder until the name is decided.
- **2026-10-08** — Quiet buttons get a subtle hover wash (`--accent-subtle`); buttons set to `exploring`.
- **2026-10-08** — Form controls set to `exploring` (focus treatment still open).
- **2026-10-08** — Checkbox check redrawn, centered with the 3px recessed-control inset; the radio dot takes twice the inset (6px) so it reads as a dot.
- **2026-10-08** — Form placeholders use `--text-muted`.
- **2026-10-08** — Form errors use the danger status colors (`--danger-subtle` + `--danger-fg`), still one level above the form.
- **2026-10-08** — Decisions on every page shown as a compact list (date, title, summary), each opening to the full record.
- **2026-10-08** — Graphics: the colorflow (`<om-stream>`) and the gradient map (`<om-mesh>`) shown live, fed v2 gradient colors that follow the mode.
- **2026-10-08** — *Dividers only* gains one exception: a hairline around surface examples that show the base level.
- **2026-10-08** — Overview: *How it's built* (every page is a view of `tokens/` and `design/`), with the system diagram from the infrastructure report, marked built or planned. *Where things live* folded into it.
- **2026-10-08** — *What stays human* is now a working list: taste decisions on new directions, imagery concept and composition, the logo and brand marks.
- **2026-10-08** — New guideline: *Avoid trends, AI design trends especially* (also an overview principle). The overview says the structure comes first.
- **2026-10-08** — `working` now means "the current direction, not final". Elevation decision re-dated to when it was settled (2026-09-23). Dividers-only names the AI-design-trend reason.
- **2026-10-08** — Color, graphics, interface and typography: first versions of their foundation, guidance and decision files. Typography is `exploring` (v2 type not started); diagrams are `exploring` (not yet reviewed).
- **2026-10-08** — Color modes and sections (behavior): `always-dark`, `always-light`, `invert`. *Sections aren't tinted* now says a full mode switch is allowed.
- **2026-10-08** — Surfaces: the foundation, four guidelines (dividers only, sections aren't tinted, sunken is never a ground, blur limit), the shadows-at-rest behavior, and four decisions. All `working`.
- **2026-10-08** — Started `design/`: the overview. The v2 values (the 50–950 color series, roles, surfaces, shadows, gradient) live in `tokens/` and are built into `src/tokens/v2/`. Nothing is released yet.
