---
type: Component
title: Pagination
description: "Pages of a listing: previous, the page numbers, next. Page numbers are gray items; the current page keeps the wash."
status: released
tags: [interface]
tokens: [--surface-sunken, --text-muted, --text-headline, --font-size-sm, --radius-md]
---

**Anatomy.** Previous and next as text buttons in the headline color with an arrow that nudges on hover; the page numbers between them as gray items (*Interaction states*): muted at rest, the sunken wash and the headline color on hover, and the current page keeps both. Gaps are an ellipsis. A step with nowhere to go (previous on page one) is left out, not disabled.

**Code.** `components/pagination.css`. No script.
