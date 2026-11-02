---
type: Decision
title: "Link color follows the setting"
description: "A text button gets the accent line on hover, like a content link; links in a row of many (a nav, a footer) get the gray line, as the new nav link (.link-nav). Replaces: only links with a resting underline get color."
status: released
date: 2026-11-02
tags: [interface]
tokens: [--accent-key, --line-strong]
---

**Context.** The rule was set by the underline: a link with one at rest (the content link) got the accent on hover; a link without one (the text button, nav and footer links) drew the gray line. The text button usually stands with room around it, as a single action under a card's text or at the end of a section, where the gray line read as a missing state next to content links. Rows of many links are different: a header or footer nav repeats its hover across every item, and color there crowds the row.

**Decision.** Design lead, 2026-11-02. **Color follows the setting, not the underline.** A link that stands on its own gets the accent on hover: the content link, and now the text button (`--accent-key` in the minimal layer, the flowing gradient with its glow in the full one, under the label only). A link in a row of many gets the line style on hover and keeps it under the current page: the new **nav link**, `.link-nav`, which takes its text from the nav around it. The example kit's footer, the Home example's "How we help" row and this site's on-page nav move to it.

**Alternatives.** Keep the underline rule: simple to state, but the text button looks unfinished beside colored content links. Color everywhere: nav rows light up link by link as the pointer crosses them. A modifier on the text button for navs (`.link-text--quiet`): one class doing two jobs; a nav link has its own markup (no label span, no icon) and its own current state.

**Revisit when.** A setting doesn't sort cleanly: a short list of two or three standalone links, or a text button inside a dense toolbar.
