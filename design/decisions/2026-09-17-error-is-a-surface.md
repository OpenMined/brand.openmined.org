---
type: Decision
title: Error is a surface, not a rule
description: A validation error renders as a solid card one level above the form, not an outline around the field.
status: working
date: 2026-09-17
tags: [interface]
---

**Decision.** Render a validation error as a solid card one level above the form.

**Why.** The error becomes a thing that appeared, rather than a state painted onto an input. The surface system can say that natively; an outline couldn't.

**Consequences.** Still grayscale: weight and one surface step carry it, which does far less than a red would. It depends on the status colors being applied to interface elements.
