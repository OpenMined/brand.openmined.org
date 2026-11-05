---
type: Decision
title: "The pager is a nav at the wash level"
description: "A new pager component: Previous, the page numbers and Next side by side, as quiet items of a wash-level nav; the current page takes the wash. Not large buttons."
status: released
date: 2026-11-04
tags: [interface]
tokens: [--state-current-wash, --state-hover-wash]
---

**Context.** Feedback during the skill's test round (brand repo issue #45): an agent building a datasite dashboard with a paged table found no pagination component and built one from secondary buttons with arrows and a "Page 1 of 5" label. The buttons were large for what they do. The system's earlier pagination was removed on 2026-11-04 until it had a design review.

**Decision.** Design lead, 2026-11-04.
- **A pager component**, quiet, not buttons: a nav at the wash level (*The nav has three levels*), with a Previous link, numbered page links and a Next link side by side (the steps next to the numbers, not spread to the row's ends); the current page takes the wash.
- The first and last pages, the current page and its neighbors are shown; a gap (…) stands for the rest.
- At the ends, the step that can't go anywhere stays in place, muted.
- Centered by default; it may align to the start or end where a layout needs.
- The dashboard example pages its table again.

**Alternatives.** Secondary buttons for the steps (what the agent built): too heavy for a control under a table. The strong nav: the current page would compete with the table's filter above it.

**Revisit when.** A pager is needed on narrow screens, or with a page-size choice.
