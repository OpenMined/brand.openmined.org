---
type: Component
title: Steps
description: "A numbered process: a small number beside a title and a line or two of text. Solid or outlined numbers, optionally joined by a line."
status: released
tags: [interface]
tokens: [--text-headline, --surface-base, --line-strong, --stroke-sm, --radius-sm, --spacing-5xl]
---

**Anatomy.** Each step: a small number badge (14px, 500, tabular), a title (the h5 size: Inter 400, 18–21px) and body text, 48px between steps. The badge is solid (the headline color, the figure in the page's color) or outlined (`steps--outline`: the line style around the figure), as the solid and secondary buttons pair. Two processes side by side take one of each: the main path solid, the other outlined. Never green: a product isn't marked by a color (SyftHub review).

**Connector.** `steps--connector` joins the numbers with a 1px line in the line style, center to center, stopping at each badge's edge.

**When.** A sequence a reader follows in order: install, connect, query. Not for a list of features: those are cards.

**Code.** `components/steps.css`. No script.
