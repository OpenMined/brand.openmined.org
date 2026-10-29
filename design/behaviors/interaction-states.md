---
type: Behavior
title: Interaction states
description: "Two interactive layers: minimal (plain CSS, no motion) is built into every component, full (color in motion) is an add-on. The rules for anything without a component; the component files are the spec."
status: released
tags: [interface]
tokens: [--accent-key, --line-focus, --surface-sunken, --state-pressed-wash, --state-disabled-opacity]
---

**Two layers.** *Minimal* is plain CSS with no motion, built into each component's main file, so loading that file alone always works. *Full* adds color in motion from separate add-on files. Documents, slides and images show the resting look only. Use minimal for dense interfaces, platforms without scripts and touch; `data-interaction="minimal"` keeps any region minimal on a page that loads the add-ons. Reduced motion is different: full elements keep their color and stop moving.

**Minimal is full without the motion.** Where full moves color, minimal shows `--accent-key` standing still in the same place. For anything without a component:

- A gray item with no line or fill of its own (a menu item, a row, a nav item) takes a `--surface-sunken` wash on hover; the current one keeps it.
- A link takes a line; a card that is a link moves one level up, and sits on the page, never in a raised panel.
- A clickable icon takes the color in its stroke, never a fill behind it.
- A clickable colored fill darkens on hover.

**Every state.** Focus adds the focus line (1px `--line-focus`, 2px outside). Pressed darkens a fill by `--state-pressed-wash`; a card settles back down. Disabled is `--state-disabled-opacity`, the not-allowed cursor and no hover. Hover only applies where a pointer can hover. Status chips, swatches and labels have no states.

**The spec is the code.** Each component's states are written in its files, in both layers: `button.css` with the add-on `button-hover.css` and `.js`; `link.css` with `link-flow.css`; `link-card.css`; `hover-card.css`; `field.css`; `control.css`.

*Open:* menus, tabs, table rows and segmented toggles take the wash rule when they're built.
