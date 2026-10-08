# Design Tokens schemas (vendored)

The official JSON schemas for the Design Tokens Format Module 2025.10 and its
resolver module, copied unchanged from the Design Tokens Community Group repo:

- Source: https://github.com/design-tokens/community-group/tree/main/schemas/src/2025.10
- Commit: see `SOURCE_SHA`
- License: W3C Software and Document License (per the repo's `LICENSE.md`)

**Why vendored:** the top-level schemas are published at
`https://www.designtokens.org/schemas/2025.10/{format,resolver}.json`, but the
sub-schemas they reference (`format/token.json`, `format/values/color.json`, …)
return 404 at their published URLs (checked 2026-10-08). A local copy also keeps
CI from depending on the network.

`tools/tokens/build.mjs --check` validates every file in `tokens/` against these.
To update: re-download the same paths at a newer commit and replace `SOURCE_SHA`.
