# OMDS → Google Docs

Turns the canonical tokens in `src/tokens/` into Google Docs **named styles** (Normal
text, Title, Subtitle, Heading 1–6), page margins, and a header/footer — so a Doc
built from one of these templates is on-brand by construction, and Format →
Paragraph styles in the Docs UI *is* OMDS.

Why named styles and not per-paragraph formatting: the definition travels with the
document. Anything typed later with those styles inherits it; "Update Heading 2 to
match" never fights the brand; and re-running the tool against the template's doc ID
re-syncs it after a token change.

## What Google gives you (and doesn't), Sept 2026

- **No admin "default styles for new Docs."** Google's org-branding default
  templates/themes cover Slides, Vids, Forms and Sites only (Business Plus+).
- **Custom template gallery** — Admin console → Apps → Google Workspace → Drive and
  Docs → Templates → *Enable custom templates*. Available on Business Standard (incl.
  the nonprofit SKU). Submission mode Moderated or Restricted keeps the tab curated.
  Submitting a template is a UI action in Docs (Template gallery → org tab → Submit
  template) — there is no API.
- **Per-person defaults** — the only way to make a *blank* doc on-brand: open the
  "OpenMined — Blank" template once → Format → Paragraph styles → Options → **Save as
  my default styles**. One-time, per account. Put it in onboarding.
- **Fonts** — Docs can't load custom fonts, but Rubik and Inter are Google Fonts, so
  OMDS renders natively. (Sub-brands using self-hosted faces need a Google Fonts
  stand-in.)
- **Gemini "Match doc format"** (Business Standard+) will mirror a template's fonts
  and structure when generating — point people at the Blank template as the reference.

## Usage

Stdlib Python 3; credentials via Passport (`sec`): `{entity}/google-docs-token`
(falls back to `{entity}/google-refresh-token`).

```bash
cd tools/google-docs
python3 omds_docs.py                         # print the derived style map (no API call)
python3 make_template.py blank               # create a template; prints the doc URL
python3 make_template.py memo --doc <ID>     # re-sync an existing template's styles in place
python3 restyle.py <doc URL or ID>           # apply OMDS named styles to any existing doc
python3 restyle.py <doc> --icon              # …and add the templates' header mark (OpenMined icon, centered, first page)
python3 restyle.py <doc> --icon --footer     # …and pages 2+: title right-aligned + a line for page numbers
python3 inspect_doc.py <doc> --readonly      # diff a doc's named styles against the OMDS map
```

Templates: `blank` · `meeting-notes` · `memo` · `letterhead`.

Scopes: creating/refreshing docs this tool made works with `drive.file`. Restyling a
doc it did *not* create needs `https://www.googleapis.com/auth/documents` on the
token. The header logo needs a hosted **raster** logo (Docs can't inline SVG) —
`public/logos/raster/*.png`, rendered from the canonical SVGs with
`rsvg-convert -w 1200`; served at `design.openmined.org/logos/raster/` once deployed.
Until then `make_template.py letterhead` warns and skips the header; re-run with
`--doc <ID>` won't add it — recreate or pass `--logo-url`.

## Published spec

`python3 omds_docs.py --json ../../src/tokens/google-docs.json` regenerates the
machine-readable spec; `prebuild` copies it to `/tokens/google-docs.json` on
design.openmined.org (CORS on), and the reference page's **Google Docs** section
renders from the same file. Run it after any change to `DOC_PT` or the token CSS.

## What comes from where

| Property | Source |
|---|---|
| Font family, weight | `global.css` `body`, `h1`–`h6`; `.prose h5/h6` (Inter 600); `.text-subtitle` |
| Line spacing | headings: the CSS `line-height` (1.2 → 120%, h4 1.3 → 130%). Body, H5, H6: **`DOC_LINE` = 130%** — the web 1.5 is a screen value and reads loose at 10pt on paper (Bennett, 2026-09-08). |
| Colors | `--text-headline`, `--text-body`, `--text-subtle` (light values; paper is light) |
| Paragraph spacing | `.prose` rhythm tokens (`--spacing-3XL/2XL/L/S`) scaled by (Normal pt ÷ body px). Heading space-*below* is overridden to `--spacing-S` (5pt) for print — more air above a heading than below (`DOC_HEADING_BELOW_TOKEN`). |
| Margins | 1" (Docs default; `PAGE_MARGIN_PT`) |
| List rhythm | `.prose li` margin (spacing-S → 5pt between items), `.prose ul` margin (spacing-L → 10pt after a list), body leading inside an item; `spacingMode: NEVER_COLLAPSE` per list paragraph since Docs has no list named style |
| **Point sizes** | **`DOC_PT` in `omds_docs.py` — the one Docs-specific table.** OpenMined's print scale, taken from the 2025 gallery templates (Bennett, adopted 2026-09-08): Normal 10 · Title 26 · Subtitle 13 · H1 20 · H2 16 · H3 14 · H4 12 · H5 11 · H6 10. Web headings (61/47/36/27px) are a display scale and are not used on paper. |

Title and Subtitle are centered (the masthead; the page-header logo lives in a
Title-styled paragraph); Normal and Heading 1–6 are left-aligned. Headings get
`keepWithNext` + `keepLinesTogether`; every style gets `avoidWidowAndOrphan`.

## Limits

- `--icon` matches the templates: the mark (44pt rendered, 36pt header margin) on the
  first page only. The Docs API cannot create a first-page header (`createHeader` takes
  only `DEFAULT`, and `useFirstPageHeaderFooter` does not materialise one), so the tool
  sections the doc instead — a CONTINUOUS section break right after the masthead
  (leading Title/Subtitle paragraphs) gives page 1 its own header; the rest gets an
  empty one. Invisible in the rendered doc; visible under View → Show section breaks.
- `--footer` writes the title into the section-2 footer but **cannot add page numbers**:
  no Docs API request inserts `PAGE_NUMBER` / `PAGE_COUNT` auto-text (checked in the
  discovery doc). It leaves a right-aligned empty line — put the cursor there and use
  Insert → Page numbers (number, type " of ", then page count).
- Pasted-in headings usually carry direct formatting (size, bold, colour) that beats
  the named style. `restyle.py` leaves it; clear it with an `updateTextStyle` over the
  heading ranges using an empty `textStyle` and a field mask (see the 2026-09-08
  Fellowship packet run in the vault), or Format → Clear formatting in the UI.

- Direct formatting wins over named styles (as in the Docs UI). `restyle.py` leaves
  it alone — select the text and Format → Clear formatting to fall back.
- Docs has exactly nine named styles; there is no "eyebrow", "meta" or "caption"
  style. Use Subtitle for a dateline and Normal for captions.
- `--doc` refresh touches styles + margins only; it never rewrites body, header or footer.
