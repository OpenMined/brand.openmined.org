---
type: Pattern
title: Explanatory diagrams
description: Diagrams carry attribution in color. Each data source keeps a hue; where attribution is lost the colors drain to gray, and where it's kept they reach the answer.
status: released
tags: [graphics]
---

**Attribution in color.** Color carries the argument: each data source keeps a hue. Where attribution is lost (inside a model trained the usual way) the colors drain to gray; where it's kept they arrive intact and ring the answer. Sources can share a hue in groups, so a figure with many sources stays readable. A hierarchy of scale is drawn as rings spreading outward.

**Colors.** Hue keys and fixed steps, the same in both modes ([Graphics use fixed steps, never roles](#guidelines-graphics-use-fixed-steps)). Connector lines between nodes are `--diagram-connector` (gray 400 in both modes, set in `components/diagram.css` until a role fits); bases and dividers inside a figure are `--line`; the outer outline `--stroke-md` (*Lines*). The figure frame, nodes and labels take the surface and text roles, so a figure sits right on either mode.

**Motion.** Color moves along the lines (*Color moves*): each colored line carries its hue's highlight (*Highlights*), travelling in the line's direction, over the line at 0.8 at its peak. Where a line drains to gray, its highlight turns gray with it. Rings brighten in their highlight, from the innermost out, one after another. Gray lines pulse faintly in their own gray. Under reduced motion, the diagram is still.

**Labels.** In the brand fonts (*Graphics use the brand fonts*).

**Not in use: the technical plate.** An alternative kept for reference: a few colors with one job each (teal for people with data, violet for people seeking insight, gray for the model, red for the problem), with numbered markers and a key in place of floating callouts.

*Open:*
- Rings can read as containment, and one ring is a different kind of level from the others.
- At phone width, labels shrink to about 8–9px.
