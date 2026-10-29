# tools/

| Tool | Run | What it does |
| --- | --- | --- |
| `palette/` | `npm run tokens` | Generates the gray, hue, gradient and shadow token files from `inputs.json` |
| `tokens/` | `npm run tokens`, `npm run tokens:check` | Validates `tokens/` and builds `src/tokens/v2/` |
| `contrast/` | `npm run contrast` (also in `tokens:check`) | Checks every color pair the guidance promises a ratio for (`pairs.json`), both modes |
| `impact/` | `npm run impact -- <token> [--consumers]` | What a token change reaches: tokens through it, guidance, components, pages, contrast promises, consumers |
| `census/` | `npm run census [-- --dry-run]` | Where the system is used: searches the OpenMined org for the stamp, `omds.json` and v1's `brand-version.txt`; writes `consumers.json` |
| `icons/` | `npm run icons:import` | Imports our own icon drawings into the set's format |
| `google-docs/` | see its README | Google Docs named styles (from v1's CSS for now) |

Before changing a value: `npm run impact -- <token>`, look at the pages and examples it lists
in both modes, then `npm run tokens:check`. Record the change as a decision and a line in
`design/log.md`.
