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

## What comes from where

| Property | Source |
|---|---|
| Font family, weight | `global.css` `body`, `h1`–`h6`; `.prose h5/h6` (Inter 600); `.text-subtitle` |
| Line spacing | the same rules' `line-height` (1.5 body → 150%, 1.2 headings → 120%) |
| Colors | `--text-headline`, `--text-body`, `--text-subtle` (light values; paper is light) |
| Paragraph spacing | `.prose` rhythm tokens (`--spacing-3XL/2XL/L/S`) scaled by (Normal pt ÷ body px) |
| Margins | 1" (Docs default; `PAGE_MARGIN_PT`) |
| **Point sizes** | **`DOC_PT` in `omds_docs.py` — the one Docs-specific judgment call.** Web headings (61/47/36/27px) are a display scale; on paper: Title 30 · H1 24 · H2 18 · H3 14 · H4 12 · H5 11 · H6 10 · Normal 11 · Subtitle 14. |

Headings get `keepWithNext` + `keepLinesTogether`; every style gets
`avoidWidowAndOrphan`.

## Limits

- Direct formatting wins over named styles (as in the Docs UI). `restyle.py` leaves
  it alone — select the text and Format → Clear formatting to fall back.
- Docs has exactly nine named styles; there is no "eyebrow", "meta" or "caption"
  style. Use Subtitle for a dateline and Normal for captions.
- `--doc` refresh touches styles + margins only; it never rewrites body, header or footer.
