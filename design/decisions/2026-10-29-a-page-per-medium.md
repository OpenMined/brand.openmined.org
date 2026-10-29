---
type: Decision
title: "A page per medium, pulling from one source"
description: "Each thing you might make (web pages, Claude artifacts, slides…) has one file in design/media/ that picks what that medium needs by name; its page pulls everything else from its one source. Curated, not tagged."
status: released
date: 2026-10-29
tags: [overview]
---

**Context.** *What are you making* linked one hand-picked example per medium. Examples are only part of what a person or an agent needs: where to start, which rules matter, which component files to take. The cards had no way to grow.

**Decision.** Design lead, 2026-10-29.
- **One file per medium** in `design/media/` (type *Medium*): its coverage level, where to start, and the guidance files, component files and examples it needs, by name. Its own text holds only advice that belongs to that medium.
- **Pages pull, never copy.** Each medium's page (`/making/<medium>/`) takes every title and description from the guidance files, a component's markup from the top of its CSS file, and examples from the examples registry. The main information stays in one place.
- **Curated, not tagged.** A medium's file decides what it pulls in and changes only by hand. What matters for slides is a judgment, kept in one place, not spread across every file as tags.
- **Checked at build.** Every name must resolve, drafts fail a production build, and every example must be on at least one medium's page. The impact report lists the medium pages that pull in a changed file.
- **Thin pages stay thin.** A medium the system barely covers says so, and lists only what applies.

**Alternatives.** A medium tag on every example and guidance file: the choice gets scattered and inconsistent. One example per card: doesn't grow, and says nothing about rules or files.

**Revisit when.** A medium's list outgrows one page, or the media need sub-kinds.
