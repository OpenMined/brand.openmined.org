---
type: Decision
title: "Prose: a moderate default, and modes"
description: "A long read puts 48px above an h2 (stepping down to 24px above an h5), not 88px. .prose--spacious gives a post the full 88px break; .prose--downsize-1 and -2 draw its headings smaller and leave the spacing to the tags. The site's guidance text uses the default prose."
status: released
date: 2026-11-02
tags: [typography]
tokens: [--prose-gap-h2, --prose-gap-h2-spacious, --prose-gap-h3, --prose-gap-h4, --prose-gap-h5]
---

**Context.** The type round (2026-10-28) made openmined.org's opt-in spacious break (88px above an h2) the default, on the reading that most posts used it. The live site's own record says otherwise: 118 hand-inserted spacers on 16 of its 375 posts. Established systems put 32 to 56px above an h2 (Tailwind Typography 48, GOV.UK 40, Ghost 56, openmined.org 32) and none has 88 as a default. The live site also downsizes headings on some posts (`.prose.downsize-1`, `-2`), which v2 had left to the site.

**Decision.** Design lead, 2026-11-02. **Default:** 48px above an h2, 40 above an h3, 32 above an h4, 24 above an h5 or h6; the rest of the rhythm unchanged. **Spacious** (`.prose--spacious`): 88px above every h2 except straight after the divider, for long posts with major sections; it came from a real need, so it stays. **Downsize** (`.prose--downsize-1`, `-2`) joins the pattern: headings drawn one or two levels smaller, tags and spacing unchanged, as the live site decided (authors had added spacers to keep a downsized h2's full break). **The site's guidance text** (rendered Markdown under a page's headings) uses the default prose with downsize-2 instead of its own spacing. Replaces the type round's 88px default; the prose pattern's line that left downsizing to the site no longer holds.

**Alternatives.** Keep 88 as the default with a compact mode: no established system does, and most posts never wanted it. A spacing-only "compact" class for short Markdown: two prose spacings to keep in step; a smaller size of the whole rhythm (Tailwind's `prose-sm`) is the established form if the default proves too airy there. Downsize that also shrinks spacing: authors restored the full break by hand when it did.

**Revisit when.** The website moves to v2 (its 16 spacious posts map to `.prose--spacious`, its downsized posts to `.prose--downsize-N`), or the guidance text proves too airy at the default.
