/**
 * TOOLTIP (components/tooltip.css, design/components/tooltip.md). Needs anchor.js beside
 * it. Each host's tooltip becomes a popover, so it opens over everything (nothing clips or
 * covers it), placed beside its control by anchor() to fit the window and following it as the
 * page scrolls. Opens on a mouse or pen hovering the host and on keyboard focus; closes when the
 * pointer leaves the host (the tooltip is inside it, so moving onto it keeps it open), when focus
 * leaves, or on Escape. The control gets aria-describedby. Where the browser has no popover,
 * nothing is changed and the CSS alone opens it below the control. Safe to call again.
 *
 *   import { tooltips } from './tooltip.js';
 *   tooltips();             // every .tooltip-host
 */
import { anchor } from './anchor.js';

let n = 0;

export function tooltips(hosts = '.tooltip-host') {
  if (typeof hosts === 'string') hosts = document.querySelectorAll(hosts);
  const popovers = typeof HTMLElement.prototype.showPopover === 'function';
  for (const host of hosts) {
    if (host.dataset.tooltipReady) continue;
    const tip = host.querySelector(':scope > .tooltip');
    const control = host.querySelector(':scope > :is(button, a, [tabindex])');
    if (!tip || !control) continue;
    host.dataset.tooltipReady = '1';
    tip.id ||= `omds-tooltip-${++n}`;
    if (!(control.getAttribute('aria-describedby') || '').split(' ').includes(tip.id)) {
      control.setAttribute('aria-describedby', `${control.getAttribute('aria-describedby') || ''} ${tip.id}`.trim());
    }
    if (!popovers) {
      host.addEventListener('keydown', (e) => { if (e.key === 'Escape') host.dataset.dismissed = ''; });
      host.addEventListener('pointerleave', () => delete host.dataset.dismissed);
      control.addEventListener('blur', () => delete host.dataset.dismissed);
      continue;
    }

    tip.popover = 'manual';
    let stop = null;
    const open = () => {
      if (stop) return;
      tip.showPopover();
      stop = anchor(tip, control, { side: 'bottom', align: 'end' });
    };
    const close = () => {
      if (!stop) return;
      stop(); stop = null;
      tip.hidePopover();
    };
    host.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') open(); });
    host.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch' && !control.matches(':focus-visible')) close(); });
    control.addEventListener('focus', () => { if (control.matches(':focus-visible')) open(); });
    control.addEventListener('blur', () => { if (!host.matches(':hover')) close(); });
    host.addEventListener('keydown', (e) => { if (e.key === 'Escape' && stop) { e.preventDefault(); e.stopPropagation(); close(); } });
  }
}
