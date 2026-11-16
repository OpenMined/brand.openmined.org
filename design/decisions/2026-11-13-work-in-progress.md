---
type: Decision
title: "Work in progress lives in wip/, never on the public site"
description: "Components we know we need but can't release yet live in components/wip/ and design/wip/: in the codebase, iterated locally and shown on preview links, left out of every served file and every production build. A draft elsewhere still blocks a release; a piece in wip/ doesn't."
status: released
date: 2026-11-13
tags: [interface]
---

**Context.** Feedback brings pieces the system needs before they're ready: the first outside feedback (issue #54, an internal dashboard) built a tooltip, a dialog, an avatar and a progress ring, each with calls still to make. The system had two places for them, and neither fits. A `draft` blocks the production build anywhere in the tree, and every release comes from the same branch, so a piece left in draft for weeks stops every release, a patch included. An example has no status and ships at once, so a piece put there is public before it's approved.

**Decision.** Design lead, 2026-11-16.
- **Where.** A piece in progress keeps its code in `components/wip/` (the repo's component format: a CSS file with its Markup block, a module if it moves; or only a module, for a script other components use, such as placement) and its notes in `design/wip/` (one file per piece: what it's for, the feedback it came from, what it's waiting on, its open calls, and where it stands on the component checklist).
- **Who sees it.** `npm run dev` and review builds (`npm run build:review`, deployed to a branch preview to share) show every piece on one page, `/wip/`. A production build doesn't build that page. A review preview is shareable but unlisted: anyone with its link can open it, and nothing on the public site links to it. That is accepted for work in progress.
- **Never served.** `wip/` is left out of `/omds.css`, `/omds.js`, `/components/*`, `/design/*`, `/manifest.json`, `/llms.txt` and `AGENTS.md`, so no project or agent takes it as part of the system. It doesn't change the version.
- **Never used by released work.** A WIP class on a released page, in an example or in a released component's Markup block fails `npm run lint`, as does a released component's script importing one from `wip/` (it would be bundled into `/omds.js`, and the served copy would import a file that isn't served). A WIP piece can't reuse a released component's name.
- **No draft tokens.** A WIP piece uses released tokens only. A value it needs is either a custom property named `--wip-…` in its own file, built from tokens (no raw colors; stylelint applies), made a token when the piece is released; or, where released work needs it too, a token released on its own first (as `--duration-fast` was, 2026-11-16).
- **Approved in WIP is approved.** The design lead reviews a piece on `/wip/`; the calls made there are recorded in its note. When the design lead approves it, that is its release decision: it moves out of `wip/` following *Adding a component* (`components/README.md`) and comes out already `released`, with its line in the change log then, without a second draft round. The log doesn't record work in progress; the piece's note does.

**Alternatives.** Drafts beside released work: block every release while they wait. Pieces in the examples, marked as the example's own: public before they're approved, and copied as if they were the system. A public "in progress" section: easier to point people to, but it changes *every rule, value and component on the public site is released*, and people would copy unapproved pieces.

**Consequences.** The release gate, the served files, the class check and the site's pages learn the folder. The pieces from issue #54 that aren't ready start here: the info tooltip, the dialog, the avatar and the progress ring, and the placement script the tooltip uses (anchor).

**Revisit when.** The site's navigation is refactored for more sections: work in progress then moves onto the same per-component pages as released components, under a banner.
