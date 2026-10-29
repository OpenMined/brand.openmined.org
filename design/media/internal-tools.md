---
type: Medium
title: Internal tools and dashboards
description: "Dense interfaces for the team: the minimal interactive layer with cards, tables, tabs, status chips, tags and pagination."
status: released
level: partly
order: 3
updated: 2026-10-29
start:
  - label: Artifact starter, minimal layer
    href: /starter/artifact.html
    note: "For a tool made as a Claude artifact."
  - label: The whole system, one stylesheet
    href: /omds.css
    note: "Put data-interaction=\"minimal\" on the tool, or don't load /omds.js."
guidance:
  - behaviors/interaction-states
  - foundations/surfaces
  - guidelines/controls-on-a-raised-surface
  - guidelines/sunken-is-never-a-ground
components: [card, table, tabs, status-chip, tag, pagination, button, field, control]
examples: [dashboard]
gaps:
  - "No app shell, navigation, menus or dialogs yet."
  - "No chart rules yet (series colors, axes, labels)."
---
