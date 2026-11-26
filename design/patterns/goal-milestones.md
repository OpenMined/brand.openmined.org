---
type: Pattern
title: Goal milestones
description: "Expand a goal, read its progress and dated milestones, and open its source in another app."
status: released
tags: [interface]
tokens: [--radius-md, --radius-full, --success-key, --warning-key, --danger-key, --spacing-2xl, --spacing-3xl]
---

**Title and source.** Use a native `<details>` with the goal title in its `<summary>`. Place the external action beside the disclosure as a separate, named button. Use `--radius-md` for the action and a pill for read-only status.

**External action.** Use `.btn--reveal` for the source button. Its label appears on hover and keyboard focus and stays visible on touch. To confirm before leaving the dashboard, open a dialog with `data-dialog-open` and offer Cancel and a link such as “Open in GitHub”. See [Dialogs](/design/components/dialog.md).

**Progress and status.** Use a large progress ring on the goal and a linear meter in table rows. Put the status in words beside the ring. Its arc takes the status color while a card action is hovered or keyboard-focused. See [Progress rings](/design/components/progress-ring.md).

**Milestones.** Mark completed entries “Done”. Use `<s>` for a plain title or `.link-content.link-content--done` for a link whose strike becomes an underline on hover or keyboard focus. Put “Overdue” and a decorative `.status-dot.status-dot--danger` beside a missed deadline. Use normal text color for the date and label.

**Dates.** Use “as of today” or “as of yesterday” for live updates in the reader’s local calendar. Give older updates, deadlines and exported snapshots an absolute date. Put the ISO date in `<time datetime="…">` and show the year when the period spans years.

**Section spacing.** The dashboard leaves 56px between titled groups of cards (`--spacing-3xl` plus `--spacing-2xl` on the container). A smaller stack gap keeps each heading with its rows.

**Example.** [Project tracker milestones](/examples/dashboard/#milestones-title).
