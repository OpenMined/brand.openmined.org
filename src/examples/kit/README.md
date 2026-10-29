# Example kit

The page shell the **website examples** share, so they agree with each other: openmined.org's
header and footer, widths, section rhythm, a generic content section and the join panel, as
reviewed (the page reviews, tag `rounds-archive`), on v2 tokens only.

**Not part of the system.** Not served on its own, no status, not a website starter. Its markup
and styles haven't been decided as system; openmined.org is one iteration of a website, shaped
partly by its history. Examples show the rules in use; they aren't rules (decision 2026-10-29,
`design/decisions/2026-10-29-examples-show-the-rules.md`). Every built example carries the kit's
styles inline, with a header comment saying so.

- `Website.astro`: an example on the kit: `<Website slug current>` for a whole page (header,
  `<main>`, footer); `chrome={false}` for a section (styles only).
- `kit.css`: widths (`kit-col-10/8/6`), the content section, the join panel, text wrapping.
- `Header.astro`, `Footer.astro`, `Section.astro`, `JoinPanel.astro`.

When a value is taken from the review, take it from the review's CSS, not from a screenshot.
Revisit as system once the website shell has been designed as such.
