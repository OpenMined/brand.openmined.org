---
type: Decision
title: "An owner's vector shipped only as PDF may be converted path for path"
description: "Where a brand's owner publishes its mark as vector PDF (or AI) but not SVG, the mark may be converted to SVG operator for operator from the owner's file; a raster is never traced or redrawn."
status: draft
date: 2026-11-20
tags: [logos]
---

**Context.** *Tool marks are used as supplied* says to source each mark officially and never redraw it. Some owners publish their vector only as PDF: WordPress's W mark is `WordPress-logotype-wmark.pdf`, and its white version is PNG only. Until now such a mark kept a third-party glyph (Simple Icons, with a legacy blue the owner no longer uses) or stayed a gap.

**Decision.** Proposed; awaiting the design lead.
- **A vector PDF from the owner may be converted to SVG path for path:** each filled path's operators (`m`, `l`, `c`, `v`, `y`, `h`, `re`, `f`) become SVG path commands in the page's coordinates, with the owner's color. Nothing is traced, simplified or redrawn; what the page paints at 0% opacity is left out.
- **A raster is never traced.** Where only a raster exists, the mark stays a gap.
- **A color the owner publishes only as a raster** (WordPress's white W) may be derived from the converted vector and recorded under `dark.derived`, as other derived dark files are.
- The first use: WordPress's W mark in gray `#32373C` (`wordpress/icon-color.svg`, `icon.svg`), with a derived white dark file.

**Alternatives.** Keep the Simple Icons glyph with the owner's hex: allowed only where the owner offers no vector, and here it does. Leave it a gap: the set keeps showing a color the owner retired.

**Consequences.** `public/logos/tools/README.md` names the rule; `tools.json` records the PDF as the source of each converted file.

**Revisit when.** An owner's PDF draws with something other than filled paths (strokes, clipping, images): convert only what the rule covers, or leave the gap.
