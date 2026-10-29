---
type: Component
title: Table of contents
description: "A long read's sections as links, beside or above the text; the section being read is marked with a line on its left."
status: released
tags: [interface]
tokens: [--text-muted, --text-headline, --surface-sunken, --line-strong, --stroke-sm, --font-size-sm]
---

**Anatomy.** A short title and the page's h2s (and h3s, indented one step) as links, in small muted text. Each link is a gray item: the sunken wash on hover. The section being read is in the headline color with a 1px line in the line style on its left. `toc--sticky` keeps it in view beside the text.

**Behavior.** `toc.js` marks the current section as the page scrolls (the last heading above a line a third of the way down the window). Without the script the links work and nothing is marked.

**When.** Long reads with four or more sections. Shorter pages don't need one.

**Code.** `components/toc.css` and `toc.js` (`toc()`, every `.toc`; safe to call again).
