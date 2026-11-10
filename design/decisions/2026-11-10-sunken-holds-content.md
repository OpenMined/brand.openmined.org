---
type: Decision
title: "Sunken is a well: it may hold content, never be a ground"
description: "The sunken level is no longer limited to a control's size: a well set into a surface may hold content (a demo, a figure, an excerpt), on the page or on a raised surface. It is still never a page, section or band. Code blocks stay always dark."
status: released
date: 2026-11-10
tags: [surfaces]
tokens: [--surface-sunken]
---

**Context.** *Sunken is never a ground* and *Surfaces* limited the sunken level to a recess sized to a control, and ruled out a panel holding content. The work already does otherwise: the site's demos set content into sunken wells directly on the page (the spacing stack, the type article's media, the grid drawing, the article zones), and a well reads as set into the page, not as a new ground. The token's own description already says "a well set into a surface; never a page or section ground."

**Decision.** Design lead, 2026-11-10.
- **Sunken is a well.** Use `--surface-sunken` for a recess set into a surface: a control's field or track, a hover wash, or a well holding content (a demo, a figure, an excerpt).
- **A well may sit on the page or on a raised surface.** Controls still prefer a raised surface, and thin tracks never sit on the page (*Recessed controls prefer a raised surface*, unchanged).
- **Never a ground.** Not a page, a full-width section, a band or a sidebar (*Sections aren't tinted*, unchanged).
- **Code blocks stay always dark** (*Surfaces*, *Typography*, unchanged).

**Alternatives.** Keep sunken to control size: the site's demos break the rule, and a well for content has no level. A raised panel for content: a well and a card say different things (set into the page, lifted off it).

**Consequences.** *Sunken is never a ground* is rewritten to this rule; *Surfaces* describes the −1 level as a well. No token or class changes.

**Revisit when.** Code blocks are reconsidered (the design lead plans to): whether a code excerpt may sit in a sunken well.
