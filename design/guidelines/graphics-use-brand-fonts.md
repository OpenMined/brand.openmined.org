---
type: Guideline
title: Graphics use the brand fonts
description: Text in a graphic, animated or still, is set in the brand's own families. An exception names its reason.
status: released
tags: [graphics, typography]
tokens: [--font-display, --font-body]
---

**Rule.** Labels, captions, and numbers inside a graphic, animated or still (a diagram, a chart, an embed), are set in the brand's families: Inter (`--font-body`) by default, Rubik (`--font-display`) where the graphic carries a display line. No graphic brings a typeface of its own by default.

**Why.** A graphic sits in a page, a deck, or a document beside text in the brand's fonts. A third face reads as a different voice, and every extra face is one more file to load and one more thing for a tool or an agent to get wrong.

**Exceptions.** A graphic may take another face when it has a stated reason, written down with the graphic. The one standing exception: the diamond in openmined.org's home hero labels its points in Sometype Mono (500, 18px). The brand's own `<om-diamond>` embed draws no labels.
