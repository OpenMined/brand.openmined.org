---
type: Decision
title: "A tool mark flagged monoRestricted or preferColor shows its color file"
description: "Where tools.json flags a mark monoRestricted (its owner's terms limit its color) or preferColor (its one-color glyph doesn't read at small sizes), pages and apps show its color file, not its one-color icon.svg."
status: draft
date: 2026-11-25
tags: [logos]
---

**Context.** Version 2.4.0 records each tool mark's owner terms in `tools.json`. `monoRestricted` marks a brand whose terms limit its color (no recoloring, approved colorways only, black or white only), and `preferColor` marks a brand whose one-color glyph doesn't read at 20–24px. The data is released. How a page uses it isn't: *Tool marks are used as supplied* says to show tool marks in one color by default, and the Logos page's One color view shows every mark's `icon.svg`, flagged or not. admin.openmined.org already shows the color file for flagged marks.

**Decision.** Proposed; awaiting the design lead. The brand owner wrote this proposal while the design lead was away.
- **A flagged mark shows its color file.** Where a mark is `monoRestricted` or `preferColor`, a page or app that would show it in one color shows `icon-color.svg` instead (its `dark` file in dark mode). Where it has no color file (GitHub, X, Apple, fal, Meta), its one-color file renders only in black or white.
- *Tool marks are used as supplied* gains this as an exception to "one color by default".
- The Logos page's One color view follows it.

**Alternatives.** Leave every mark one-color by default: the site shows several owners' marks in ways their terms forbid. Remove the flagged marks' one-color files: other projects that use one-color tool marks lose them.

**Consequences.** `tool-marks-as-supplied.md` and the Logos page change. No file changes.

**Revisit when.** An owner publishes a one-color version.
