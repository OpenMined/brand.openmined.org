---
type: Decision
title: Errors are text, not a box
description: "A validation error is danger-colored text directly under its field, on whatever surface the form sits on: no box, no outline, no fill."
status: working
date: 2026-10-09
tags: [interface]
tokens: [--danger-fg]
---

**Context.** *Error is a surface, not a rule* (2026-09-17) rendered an error as a card one level above the form, then in the danger colors (`--danger-subtle` with `--danger-fg`, 2026-10-08). In review, colored boxes stacked on a dark page read as a muddy mix of panels.

**Decision.** A validation error is `--danger-fg` text directly under its field, at the form's text size and regular weight, on whatever surface the form sits on: no box, no outline, no fill. Decided 2026-10-09; recorded 2026-10-28, when the earlier decision was deprecated.

**Alternatives.** Keep the error card, in gray or in the danger colors: it reads as a separate thing that appeared, but a form with several errors becomes a stack of panels.

**Consequences.** Replaces *Error is a surface, not a rule*. *Form controls* describes it; `components/field.css` draws it (`.fld__errs`). `--danger-fg` reaches AA on every surface in both modes.

**Revisit when.** A form needs an error that isn't tied to one field, such as a failed submission.
