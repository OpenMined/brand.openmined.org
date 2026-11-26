---
type: Component
title: Dialogs
description: "A modal on the native dialog element: a head with the title and a close, what it holds, and an optional foot of actions. Always centered, over a frosted scrim in the sunken gray."
status: released
tags: [interface]
tokens: [--surface-raise-1, --shadow-raise-2, --surface-sunken, --text-headline, --text-muted, --red-key, --radius-lg, --spacing-lg, --spacing-5xl, --spacing-xl]
---

**When.** Detail someone asks for and then closes: how a number is counted, a confirmation, a short form. Not for content that should be a page, and not to interrupt someone who didn't ask.

**Anatomy.** A head: an optional eyebrow, the title, and a close icon button. Then what it holds, a lead in the headline color first. Then an optional foot of actions at the end. Raise-1 with the raise-2 shadow, 38rem at most, generous padding that tightens under 640px.

**Placement.** Always centered in the window, both ways, and never closer than 1rem (16px at the default font size) to its edges; longer content scrolls inside it.

**The scrim.** The sunken level at 70% with a 10px blur: the page frosts over in its own mode's gray, light in light mode and dark in dark, and inside a `data-section` its gray. The dialog stands off it by its raise-2 shadow. Mixed in sRGB, so the gray keeps its hue. It's a wash, so what shows through sits between the set steps (*Grays are set*): accepted for the scrim, which has to read over anything. Under reduced transparency the blur goes and the scrim is almost solid.

**The close.** A quiet gray icon button that turns red on hover and focus (red's key, red's two-tone in the full layer), fading in as every icon button's color does.

**Opening and closing.** Focus goes to the dialog itself, not its first button, so nothing opens wearing a focus ring. Escape, the close, or a click on the scrim closes it, and focus returns to the button that opened it. No motion: it appears.

**Markup.** `<dialog class="dialog" aria-labelledby="…">` holding a `<form method="dialog">`, so the close and any cancel button close it with no script. A button with `data-dialog-open="<id>"` opens it (the script); without the script, call `showModal()`.

**Leaving a tool.** Name the destination in the title and the item in the body. Put Cancel and the destination link in the dialog footer.

**Code.** `components/dialog.css`, `dialog.js` (`dialogs()`). The close and actions use `button.css`.

*Open:*
- A full-width sheet on a phone instead of a centered box.
- Whether a click on the scrim should close a dialog holding a form someone has filled in.
