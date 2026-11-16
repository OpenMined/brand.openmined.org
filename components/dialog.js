/**
 * DIALOG (components/dialog.css, design/components/dialog.md). A button with
 * data-dialog-open="<id>" opens that <dialog class="dialog"> as a modal with focus on the
 * dialog itself (not its first button); a click on the scrim closes it; Escape and a
 * <form method="dialog"> button close it natively, and the browser returns focus to the
 * opener. No motion. Safe to call again.
 *
 *   import { dialogs } from './dialog.js';
 *   dialogs();              // every [data-dialog-open]
 */
export function dialogs(openers = '[data-dialog-open]') {
  if (typeof openers === 'string') openers = document.querySelectorAll(openers);
  for (const btn of openers) {
    if (btn.dataset.dialogReady) continue;
    const dlg = document.getElementById(btn.dataset.dialogOpen);
    if (!(dlg instanceof HTMLDialogElement)) continue;
    btn.dataset.dialogReady = '1';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', () => {
      dlg.tabIndex = -1;
      dlg.showModal();
      dlg.focus();
    });
    if (!dlg.dataset.dialogReady) {
      dlg.dataset.dialogReady = '1';
      // A click on the scrim lands on the dialog element itself, outside its box.
      dlg.addEventListener('click', (e) => {
        if (e.target !== dlg) return;
        const r = dlg.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
      });
    }
  }
}
