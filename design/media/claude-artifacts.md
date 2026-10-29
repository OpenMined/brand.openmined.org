---
type: Medium
title: Claude artifacts
description: "Pages, dashboards and tools made as Claude artifacts: one self-contained file with the tokens and every component inlined."
status: released
level: covered
order: 2
updated: 2026-10-29
start:
  - label: Artifact starter, minimal layer
    href: /starter/artifact.html
    note: "Everything inlined. Copy it, keep the head, replace the body."
  - label: Artifact starter with motion
    href: /starter/artifact-full.html
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
components: [card, table, tabs, status-chip, tag, button, field]
examples: [dashboard]
gaps:
  - "No artifact-specific patterns yet beyond the starter: tell us what you build."
---

**Why the starter.** Artifacts load scripts only from a few public CDNs and styles only from Google Fonts, so a linked `/omds.css` fails without an error. The starter has everything inlined; fonts load from Google Fonts as usual. Dashboards and tools stay in the minimal layer.
