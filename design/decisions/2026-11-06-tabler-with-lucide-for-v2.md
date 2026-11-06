---
type: Decision
title: Tabler for v2 icons, with chosen Lucide icons
description: v2 takes its icons from Tabler's outline set, with Lucide icons where one is chosen, in place of Iconoir. Tabler is scaled to Lucide's size so the two read as one set.
status: released
date: 2026-11-06
tags: [icons]
---

**Context.** Iconoir's icons sat unevenly together: some drew small (lock, key, eye, plus, copy, download), some dense (DNA, notebook, fingerprint). An audit of eleven open icon sets (lab, `research/2026-11-06-icon-set-audit`) drew each one at our 2 line and compared every icon with the same idea in the other sets. Against that, Iconoir's sizes spread 8.3% and 22 of 108 icons stood out. Lucide spread 3.9% (6 stood out) and Tabler 5.9% (5 stood out). Iconoir is drawn for a 1.5 line, so at our 2 its details close up; Tabler and Lucide are drawn at 2. Iconoir also had nothing for four icons the live site uses: enforcement, handshake, network discovery, scale.

**Decision.** The design lead and the brand owner, 2026-11-06.
- **Tabler's outline set is the default.** It has the larger catalog (5,217 outline icons, MIT) and the brand owner preferred most of its drawings.
- **Lucide (ISC) where an icon is chosen.** Thirteen in the set today: info, lock, profile, search, journal, book stack, DNA, globe, donate, calendar, chat, light bulb, gavel. The choice is per icon and recorded in `icons/set.json`.
- **Tabler is drawn at Lucide's size.** Tabler leaves 2px inside the box and Lucide 1px, so Tabler draws about 7% smaller. The set scales Tabler's drawings by 1.075 around the center and divides the stroke by the same factor, so the line keeps its weight (`TABLER_SCALE`, `src/lib/icons.ts`).
- **Unchanged:** outlined and one color, a 2 line by size, status icons in their status color, brand logos only from partner marks. Both libraries are pinned to an exact version, so a redrawn icon only arrives with a deliberate upgrade.
- **The four live-site gaps** get set icons: gavel (enforcement), handshake (Tabler's, with a heart), radar (network discovery), scale. Our own `equal` is dropped for Tabler's.

**Alternatives.** Lucide alone: the most even set and drawn at our line, but 2,100 icons, and the brand owner preferred Tabler's drawings for most of the set. Tabler alone: loses the thirteen Lucide drawings the brand owner preferred. Keep Iconoir: the unevenness stays, and the four gaps would need our own drawings.

**Watch.** Icons that share parts (shields and locks, status marks, arrows) read best from one library; a mixed family is checked side by side before it ships.

**Revisit when.** Lucide picks grow past a third of the set (then Lucide as the default may be simpler), or a library upgrade redraws an icon in the set.
