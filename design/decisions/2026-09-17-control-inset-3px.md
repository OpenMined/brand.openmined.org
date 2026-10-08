---
type: Decision
title: Recessed controls inset 3px
description: The gap between a recessed control's outer surface and the part inside it is 3px, in every state.
status: working
date: 2026-09-17
tags: [interface]
---

**Decision.** 3px between a recessed control's outer surface and the control inside it, consistent in every state. 2px was tried and judged too tight.

**Corroboration.** The brand's existing theme toggle already uses 3px.

**Open.** The spacing scale has no 3px step, so the inset is either a new token or stays a component constant.
