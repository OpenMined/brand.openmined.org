---
type: Medium
title: Internal tools and dashboards
description: "Dense interfaces for the team: the minimal interactive layer with cards, tables, tabs, status chips and tags."
status: released
level: partly
order: 3
updated: 2026-11-26
start:
  - label: Artifact starter, minimal layer
    href: /starter/artifact
    note: "For a tool made as a Claude artifact."
  - label: The whole system, one stylesheet
    href: /omds.css
    note: "Put data-interaction=\"minimal\" on the tool, or don't load /omds.js."
guidance:
  - patterns/goal-milestones
  - foundations/spacing
  - behaviors/interaction-states
  - foundations/surfaces
  - guidelines/controls-on-a-raised-surface
  - guidelines/sunken-is-never-a-ground
  - guidelines/eyebrows-take-the-eyebrow-style
  - foundations/iconography
  - foundations/shape
  - foundations/motion
  - guidelines/accent-by-intent
  - guidelines/color-fills-use-the-key
  - guidelines/icons-one-color
  - guidelines/center-by-eye
  - guidelines/color-tells-a-story
  - guidelines/text-stays-inside
  - guidelines/grays-are-set
components: [app-bar, card, stat-card, table, meter, progress-ring, pager, nav, menu, tabs, status-chip, status-dot, avatar, tag, button, field, control, tooltip, hint, dialog]
examples: [dashboard]
gaps:
  - "The app shell is the app bar only; the nav is a row only (no sidebar)."
  - "Menus don't yet work as a select in a form (empty state, busy, error)."
  - "No chart rules yet (series colors, axes, labels)."
---
