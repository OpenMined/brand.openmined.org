---
type: Decision
title: "Tabs are a segmented control"
description: "Tabs follow openmined.org's, in its card form: the group a raised card, the tabs a segmented control recessed into it, the selected tab filled with the strong gray."
status: released
date: 2026-11-04
tags: [interface]
tokens: [--surface-raise-1, --shadow-raise-1, --surface-sunken, --shadow-sunken, --emphasis, --on-emphasis]
---

**Context.** The tabs were drawn as gray items under the wash rule (muted text, the sunken wash on hover, kept by the selected tab), the provisional look *Interaction states* left open for tabs, and the same treatment as this site's header links. openmined.org's tabs, on the PySyft page, are a segmented control: a white tray with a shadow and the selected tab filled dark.

**Decision.** Design lead, 2026-11-04.
- The whole group is a card on the first raised level (`--surface-raise-1`, `--shadow-raise-1`, the large corner, 24px inside), so the tabs and their panel read as one thing: the live site's card form.
- The row of tabs is a segmented control recessed into the card (`--surface-sunken`, `--shadow-sunken`, the medium corner), a recess on a raised surface like any control (*Recessed controls sit on a raised surface*), sized like one: a field's height, each tab 3px inside it, the recessed-control inset.
- The selected tab fills with `--emphasis`, labeled in `--on-emphasis` (*Every strong gray fill is emphasis*), as a checked control does. The others are headline-color text and take a faded fill of the strong gray on hover (`--emphasis` at 10%).
- Labels at body size, 500, 24px from each side; 24px between the row and the panel.

**Alternatives.** Keep the wash look: lighter, but a second tab design beside the one the site ships, and the selected tab reads weakly. A raised tray on the page (the live site's plain form): it floats apart from its panel, and inside a raised panel it disappears.

**Consequences.** Navigation stays apart: tabs switch views of one thing, never pages. The guide's header links keep their wash until a tab nav is defined. Tabs are a card, so they sit on the page, not inside another card. The live site's plain and bordered forms aren't carried over until they're needed.
