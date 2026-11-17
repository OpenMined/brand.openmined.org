/**
 * HINT — work in progress (design/wip/hint.md; look: hint.css). Upgrades each hint to a
 * text-only tooltip: reads its data-hint, builds a .tooltip from it beside the hint and wires it
 * as tooltip.js wires a tooltip: a popover over everything, placed by anchor.js to fit the window
 * and follow the hint, opened on a mouse or pen hovering it and on keyboard focus, closed when
 * the pointer or focus leaves or on Escape; the hint gets aria-describedby. Where the browser has
 * no popover, nothing is changed and the CSS hint stays. Safe to call again. (On release this
 * moves into tooltip.js.)
 *
 *   import { hints } from './hint.js';
 *   hints();                // every .hint
 */
import { anchor } from '../anchor.js';

let n = 0;

export function hints(els = '.hint') {
  if (typeof els === 'string') els = document.querySelectorAll(els);
  if (typeof HTMLElement.prototype.showPopover !== 'function') return;
  for (const el of els) {
    if (el.dataset.hintReady || !el.dataset.hint) continue;
    el.dataset.hintReady = '1';
    const tip = document.createElement('span');
    tip.className = 'tooltip tooltip--hint';
    tip.setAttribute('role', 'tooltip');
    tip.id = `omds-hint-${++n}`;
    tip.popover = 'manual';
    const body = document.createElement('span');
    body.className = 'tooltip__body';
    body.textContent = el.dataset.hint;
    tip.append(body);
    el.after(tip);
    el.setAttribute('aria-describedby', `${el.getAttribute('aria-describedby') || ''} ${tip.id}`.trim());

    const align = el.dataset.align === 'end' ? 'end' : 'start';
    let stop = null;
    const open = () => {
      if (stop) return;
      tip.showPopover();
      stop = anchor(tip, el, { side: 'bottom', align });
    };
    const close = () => {
      if (!stop) return;
      stop(); stop = null;
      tip.hidePopover();
    };
    el.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') open(); });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch' && !el.matches(':focus-visible')) close(); });
    el.addEventListener('focus', () => { if (el.matches(':focus-visible')) open(); });
    el.addEventListener('blur', () => { if (!el.matches(':hover')) close(); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Escape' && stop) { e.preventDefault(); e.stopPropagation(); close(); } });
  }
}
