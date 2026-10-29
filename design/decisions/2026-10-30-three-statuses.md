---
type: Decision
title: "Three statuses: draft, released, deprecated"
description: "Everything on the public site is released. Work in progress is draft and never ships: the production build fails on it. Exploring and working are merged into draft."
status: released
date: 2026-10-30
tags: [overview]
---

**Context.** Tokens and guidance files carried four statuses: `exploring`, `working`, `released` and `deprecated`. The two in-progress words served the review rounds, where the brand owner compared options against a current favorite. At launch the site becomes the public entry point for people and AI agents, and anything on it is already being used to make things.

**Decision.** Design lead, 2026-10-30.
- **Everything on the public site is `released`**, values carried over from v1 included.
- **`draft`** replaces `exploring` and `working`: in progress, seen locally (`npm run dev`) and in a review build (`npm run build:review`), never on the public site. The production build fails if any token or guidance file is `draft` (`src/lib/release-gate.ts`); the token build rejects any other status word.
- **`deprecated`** stays: being replaced, and names its replacement.
- Pages show a status only when it isn't `released`.

**Alternatives.** Drop statuses and let branches carry work in progress: a branch can't hold one unfinished token inside an otherwise ready change, and migration needs `deprecated`. Keep four words: two in-progress levels only help while options are compared against a favorite, which now happens on a branch or in a review build.

**Consequences.** Every `exploring` and `working` token and file became `released` on 2026-10-30, including `--spacing-section`, `--state-pressed-wash` and link cards. The overview's *Check the status* says so.

**Revisit when.** A private review site is set up and needs to tell options from favorites again.
