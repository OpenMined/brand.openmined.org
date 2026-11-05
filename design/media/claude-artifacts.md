---
type: Medium
title: Claude artifacts
description: "Pages, dashboards and tools made as Claude artifacts: one self-contained file with the tokens and every component inlined."
status: released
level: covered
order: 2
updated: 2026-11-05
start:
  - label: Artifact starter, minimal layer
    href: /starter/artifact
    note: "Everything inlined. Copy it, keep the head, replace the body."
  - label: Artifact starter with motion
    href: /starter/artifact-full
    note: "The same with every component script inlined and started."
  - label: Brand graphics as one file each
    href: /embeds/single/om-stream.js
    note: "om-diamond.js, om-stream.js and om-mesh.js in /embeds/single/, colors inlined."
guidance:
  - behaviors/interaction-states
  - behaviors/color-modes
  - foundations/color
  - foundations/typography
  - guidelines/one-solid-button
  - guidelines/avoid-ai-design-trends
  - guidelines/eyebrows-take-the-eyebrow-style
  - patterns/diagrams
components: [type, card, table, meter, pager, nav, tabs, status-chip, tag, button, field, diagram]
examples: [dashboard, diagram-route]
gaps:
  - "No artifact-specific patterns yet beyond the starter: tell us what you build."
---

**Why the starter.** Artifacts load scripts only from a few public CDNs and styles only from Google Fonts, so a linked `/omds.css` fails without an error. The starter has everything inlined; fonts load from Google Fonts as usual. Dashboards and tools stay in the minimal layer.

**Diagrams.** A box-and-arrow diagram in an artifact takes the full build (HTML cards over SVG lines). The minimal starter has no script, so write each line's path data yourself, following the line rules, or start from the starter with motion, which draws lines from `data-points` and checks that text fits its nodes. A diagram the reader will save as a file takes the flat build.

**Eyebrows.** A phrase over a heading is the eyebrow style: body text, sentence case, never caps or mono. Caps in mono is only for labels inside a diagram.
