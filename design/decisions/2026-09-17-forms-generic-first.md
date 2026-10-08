---
type: Decision
title: Form styles are generic first
description: Style generic form elements; map them onto HubSpot with an adapter that lives in the website.
status: working
date: 2026-09-17
tags: [interface]
---

**Decision.** Style generic form markup. HubSpot's forms get an adapter in the website (openmined.org), not in the brand.

**Why.** Styling HubSpot's classes would put a vendor's names into the brand, inherited by every project whether it uses HubSpot or not. Generic → vendor is a mapping; vendor → generic is an extraction.

**Consequences.** The real portability requirement is the shape of the markup, not the class names: HubSpot wraps controls in extra elements. Style the control or its own wrapper, never sibling order or depth. Dropping HubSpot later means deleting one file.
