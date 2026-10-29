---
type: Decision
title: "Examples show the rules in use; they aren't rules"
description: "Statuses apply to the system: tokens, guidance and components. Examples have none: they show released parts in use, and where an example and the guidance differ, the guidance wins."
status: released
date: 2026-10-29
tags: [overview]
---

**Context.** *Three statuses* says everything on the public site is released. The site also carries examples: whole pages and sections made in house to show the rules in practice, some of them versions of openmined.org. Their markup and layout, and the shared page shell the website examples use, haven't been decided as system; openmined.org is one iteration of a website, shaped partly by its history. People and agents copy examples whole.

**Decision.** Design lead, 2026-10-29.
- **Every rule, value and component on the site is released. Examples show them in use; they aren't rules themselves.** Statuses (`draft`, `released`, `deprecated`) belong to tokens, guidance files and components only. An example's label is *Example*.
- **Each example names what it shows**: the guidance files it puts to work, linked. Anything in it beyond those, such as page layout or the shared page shell, is illustration, not a rule.
- **Copy examples freely.** Where an example and the guidance differ, follow the guidance and report the difference as feedback.
- **Examples use only released parts.** A production build fails on any draft, and on an example that names a guidance file that doesn't exist or isn't released.
- **Website examples share an example kit** (page shell, header, footer, widths, section rhythm) so they agree with each other. The kit is part of the examples: not served on its own, no status, not a website starter.

**Alternatives.** A fourth status for examples: statuses describe how settled a rule is, and an example isn't a rule. A released website starter: its markup and styles haven't been considered as system decisions yet. Each page's layout written in place: pages drift from each other and from what they show.

**Revisit when.** The website shell has been designed as system, and could be served as a starter.
