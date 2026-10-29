---
type: Guideline
title: Use accent by intent
description: "Use the accent roles where you mean the interactive color, and --emphasis for the strong gray fill. Pick by intent, not by how a color looks, so a change of accent reaches everything it should."
status: released
tags: [color, interface]
tokens: [--accent-key, --accent-fg, --accent-subtle, --emphasis, --on-emphasis]
---

**Rule.** Use `--accent-*` where you mean the interactive color: a hover line, a hover fill, a selected state's tint, an interactive highlight. The accent is a hue (green today) with that hue's roles: `--accent-subtle`, `--accent-soft`, `--accent-fg`, `--accent-key`, labeled with `--on-key`. Use `--emphasis` with `--on-emphasis` for the strong gray fill, the primary button. Use `--text-headline`, `--line` and the other roles when you mean exactly those.

**Why.** The accent points at a hue, as `--success-*` points at green. If the accent hue changes, every `--accent-*` changes together; a `--green-*` written where the accent was meant would be left behind, and nothing on screen today shows the difference.

**Don't.** Write `--green-key` for a hover color, use `--accent-*` for something that's green because it's green (a chart series, a success state), or use `--text-headline` for the primary button's fill.
