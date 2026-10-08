---
type: Decision
title: Elevation gets lighter as it rises
description: In both modes, a higher level is a lighter surface.
status: working
date: 2026-09-23
tags: [surfaces]
tokens: [--surface-raise-1, --surface-raise-2]
---

**Context.** In v1, light mode receded as surfaces rose and dark mode lifted, so shadows behaved inconsistently between modes.

**Decision.** Higher levels are lighter, in both modes: cards are lighter than the page.

**Alternatives.** Darker as it rises; a different direction per mode. Both were compared on live review pages; lighter was the leaning from 2026-09-17 and settled on 2026-09-23.

**Consequences.** A shadow and a lightness step say the same thing in both modes. In light mode white is the highest level.

**Revisit when.** Dark-mode separation proves too weak in real use (bright rooms, projectors).
