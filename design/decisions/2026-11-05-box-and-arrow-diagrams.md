---
type: Decision
title: "Box-and-arrow diagrams: full in HTML by default, flat in SVG for a file"
description: "Box-and-arrow figures have a node style and two builds from one layout: full (raised HTML cards over an SVG layer of lines), the default, and flat (one SVG, outlined nodes), for a figure that travels as a file. Squares mark a node's kind, as needed."
status: released
date: 2026-11-05
tags: [graphics]
tokens: [--surface-raise-2, --shadow-raise-2, --line, --line-strong, --stroke-sm, --stroke-md, --radius-md, --radius-lg, --state-current-wash]
---

**Context.** The system had no node style for box-and-arrow diagrams (feedback #47). Drawn in SVG, a raised card has no easy shadow, and the overview's system graphic was the only reference. A review round tried six node treatments (raised cards on the frame, on the page and in raised groups; outlined; washes; washes with a hue bar), then color marks (a dot, a square, a diamond), then a fuller figure: a subsystem, a boundary, two-way and return lines, a node out of scope, a card holding a paragraph.

**Decision.** Design lead, 2026-11-05.
- **Full, the default:** nodes are HTML cards one level up on the figure frame (raise-2 with its shadow, no outline), over an SVG layer of groups, lines and labels. Text wraps and takes the type roles.
- **Flat, for a file:** one SVG, nodes as `--stroke-sm` outlines in `--line`; every line of text broken by hand and measured. `diagramSvg()` saves it as a standalone file.
- **Marks:** an 8px square in a kind's hue key before the title, with a key; used as needed (all, none, or only the kinds a figure is about). Not a dot, which reads as a status.
- **Lines:** rounded bends at the large radius, open 45° arrowheads at the line's width, starting on a box and stopping 4px short of the next; two-way lines have a head at each end; a return is a second line; crossings at 90°; a label that crosses an element gets a backing.
- **Groups:** an outline at `--stroke-md`; a subsystem in round dots; a boundary data doesn't cross as a wash zone.
- **Text stays inside its node,** checked by `diagrams()`; **balance:** even gaps between a figure's big parts, shared edges, alignment on purpose.

**Alternatives.** Wash nodes, and wash nodes with a hue bar: flat and mode-proof, but they read as disabled beside raised cards. Raised cards on the page with no frame, and raised groups holding raised cards: more depth than a figure needs. Dots and diamonds as marks: a dot reads as a status; the diamond is fussy at 8px.

**Revisit when.** A figure needs a node or line the two builds can't draw (people, icons in nodes, fan-out), or the phone layout of a figure needs its own markup.
