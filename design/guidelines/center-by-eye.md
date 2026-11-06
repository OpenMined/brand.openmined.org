---
type: Guideline
title: Center by eye
description: "Anything meant to be centered is checked by eye, not only by its box: a letter in a circle, an icon in a button, a figure in a badge. Fonts carry space the box doesn't show."
status: released
tags: [layout, typography]
---

**Rule.** When something is meant to sit in the middle of its container, look at it and confirm it *looks* centered. Being centered by the box (`place-items: center`, equal padding) is the start, not the check.

**Why.** Type carries built-in space: a cap letter sits above its line box's center, numerals and lowercase sit lower, and an icon's drawing isn't always centered in its viewbox. Off-center marks read as mistakes, most of all small ones in repeated shapes: day letters in a row of boxes, initials in an avatar, a number in a step badge, a play icon in a circle.

**Check.** At the size it's used, in both modes:
- **Text in a fixed box** (a badge, a day cell, initials): `line-height: 1` and the box's flex centering, then compare the space above the letters with the space below. Where they differ, nudge the text, not the box, by the smallest step that evens them (`padding-block-start` or a 1px `translate`), and test with the real characters.
- **Icons:** shapes with a heavy side (a play triangle, an arrow) look centered when their mass is, not their box.
- **Repeated items:** check the row together; one off-center cell shows the rest.

**Don't.** Fix it in the container's padding for one string: the next label is a different shape.
