---
type: Medium
title: Web pages
description: "Pages and sections on the web. Everything the system has applies: tokens, components, layout, type, icons, graphics and motion."
status: released
level: covered
order: 1
updated: 2026-11-05
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
  - guidelines/eyebrows-take-the-eyebrow-style
  - patterns/diagrams
  - foundations/iconography
  - foundations/lines
  - foundations/motion
  - foundations/shape
  - behaviors/shadows-at-rest
  - guidelines/accent-by-intent
  - guidelines/blur-limit
  - guidelines/color-fills-use-the-key
  - guidelines/icons-one-color
  - guidelines/logo-images-on-white
  - guidelines/one-label-per-step
  - guidelines/partner-marks-as-supplied
  - guidelines/partner-marks-follow-the-mode
components: [page, type, layout, button, link, card, hover-card, link-card, field, control, steps, nav, tabs, accordion, table, tag, pager, code-copy, prose, diagram]
examples: [home, syfthub, landing-section, product-steps, press-cards, join-form, long-read]
gaps:
  - "No header or footer components: each site owns its own (the nav covers the row of links inside one). The website examples share an example kit with openmined.org's, which is illustration, not system."
  - "No imagery or photography guidance."
---

**Building a page.** Start from the example closest to what you're making and change the words. The website examples share the example kit (page shell, header, footer), which shows openmined.org as it is today, not a rule.

**Diagrams on a page.** Use the full build. A page is read on phones, so design the figure's narrow layout with the wide one (*Explanatory diagrams*, Phones).
