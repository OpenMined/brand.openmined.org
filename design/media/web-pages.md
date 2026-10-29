---
type: Medium
title: Web pages
description: "Pages and sections on the web. Everything the system has applies: tokens, components, layout, type, icons, graphics and motion."
status: released
level: covered
order: 1
updated: 2026-10-29
start:
  - label: The whole system, one stylesheet
    href: /omds.css
    note: "Link it first, then your own CSS. Add /omds.js for the full interactive layer; pages work without it."
  - label: One component at a time
    href: /components/README.md
    note: "Each CSS file has its markup at the top; take only what the page uses."
  - label: Guidance index
    href: /design/index.json
guidance:
  - foundations/spacing
  - foundations/surfaces
  - foundations/typography
  - foundations/color
  - behaviors/color-modes
  - behaviors/interaction-states
  - patterns/prose
  - guidelines/one-solid-button
  - guidelines/outlines-are-lines
  - guidelines/sections-arent-tinted
  - guidelines/controls-on-a-raised-surface
  - guidelines/avoid-ai-design-trends
components: [page, type, layout, button, link, card, hover-card, link-card, field, control, steps, tabs, accordion, table, tag, toc, prose]
examples: [home, syfthub, landing-section, product-steps, press-cards, join-form, long-read]
gaps:
  - "No header, navigation or footer components: each site owns its own. The website examples share an example kit with openmined.org's, which is illustration, not system."
  - "No imagery or photography guidance."
---

**Building a page.** Start from the example closest to what you're making and change the words. The website examples share the example kit (page shell, header, footer), which shows openmined.org as it is today, not a rule.
