---
type: Decision
title: "The accordion and the code block follow openmined.org"
description: "The accordion becomes the live site's FAQ item (a raised card with a round control that fills when open) and the code block's copy button the live site's (icon only, on a faint wash), in the system's tokens."
status: released
date: 2026-11-04
tags: [interface]
tokens: [--surface-raise-1, --shadow-raise-1, --surface-sunken, --shadow-sunken, --emphasis, --on-emphasis, --gray-300, --green-300]
---

**Context.** The accordion (lines between items, no box, a bare arrow) and the code block's copy button (an icon and the word "Copy") were added to the system without a design review, and neither matched what openmined.org already ships: the PySyft FAQ's items and the code blocks' copy button.

**Decision.** Design lead, 2026-11-04.
- **Accordion:** each item a card on the first raised level, 20px apart, with the live padding (32px, 40px on the left); the question in body text; a 32px round control with the down arrow, a recess when closed and filled with the strong gray when open (`--emphasis`, *Every strong gray fill is emphasis*), turned half a turn, as a checked control fills.
- **Code block:** the copy button icon only, on a faint wash of the block's text color with a fainter edge; after a click, a green check for two seconds. The block itself already matched (gray 950, gray 50 text, the medium corner).
- Values snap to the system: the card's level and shadow (not the live site's own shadow), the large corner, the controls' hover outline, the system's mono family.

**Alternatives.** Keep the divided list: lighter on the page, but a second accordion design beside the one the site ships.

**Consequences.** Supersedes the accordion's earlier anatomy ("divided by lines, no boxes"). An accordion is a raised card, so it sits on the page, not inside another raised panel.
