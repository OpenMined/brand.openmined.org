---
type: Guideline
title: Use accent by intent
description: Use the accent roles where you mean "the interactive, brand-emphasis thing". While accent is grayscale, pick by intent, not by how it looks.
status: working
tags: [color, interface]
tokens: [--accent-solid, --accent-fg, --accent-subtle]
---

**Rule.** Use `--accent-*` for interactive and brand-emphasis elements: the primary button, a selected state, a focus ring, an interactive highlight. Use `--text-headline`, `--line` and the other roles when you mean exactly those.

**Why.** Accent is grayscale today, so `--accent-solid` renders the same as `--text-headline`. If accent later gets a color, every use of `--accent-*` changes together. A wrong pick changes the wrong thing, or misses the change, and nothing on screen today shows the difference.

**Don't.** Reach for `--accent-fg` for a dark heading because it looks right, or use `--text-headline` for a primary button's fill.
