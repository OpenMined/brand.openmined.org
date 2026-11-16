/**
 * ANCHOR (design/components/tooltip.md, Placement). Places something that opens beside a control
 * (a tooltip, later a menu) so it fits the window, and keeps it there while the page scrolls.
 * Not called by projects: the component scripts that open things beside a control import it,
 * as button-hover.js imports two-tone.js. Copy it beside them.
 *
 * The thing placed should be a popover (the popover attribute, shown with showPopover()): the
 * browser draws it in the top layer, over everything, so no container clips it and no z-index
 * covers it. It's then position: fixed, and this sets where:
 *   --anchor-top, --anchor-left   its corner, in px from the window's
 *   --anchor-caret                the control's center, in px from its own left edge,
 *                                 for a caret that always points at the control
 *   data-side   bottom | top      where it ended up
 *   data-align  start | center | end
 *
 * Preferred placement first (below, its end at the control's end, by default); it flips to the
 * other side or alignment only where the preferred one would leave the window, then slides to
 * stay at least `margin` inside it. Inline start and end follow the control's direction (rtl).
 *
 *   import { anchor } from './anchor.js';
 *   const stop = anchor(tip, button, { side: 'bottom', align: 'end' });   // on open
 *   stop();                                                               // on close
 */
export function anchor(floating, control, { side = 'bottom', align = 'end', gap = 8, margin = 8, overhang = 6 } = {}) {
  let frame = 0;
  const place = () => {
    frame = 0;
    const c = control.getBoundingClientRect();
    const w = floating.offsetWidth;
    const h = floating.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const rtl = getComputedStyle(control).direction === 'rtl';

    // Block: the preferred side, unless it doesn't fit and the other side has more room.
    const below = vh - c.bottom - gap - margin;
    const above = c.top - gap - margin;
    let s = side;
    if (s === 'bottom' && h > below && above > below) s = 'top';
    else if (s === 'top' && h > above && below > above) s = 'bottom';
    const top = s === 'bottom' ? c.bottom + gap : c.top - gap - h;

    // Inline: start, center or end of the control (end overhangs it a little, so a caret
    // near the corner lands on the control's middle), flipped if it would leave the window.
    const lefts = {
      start: rtl ? c.right + overhang - w : c.left - overhang,
      center: c.left + c.width / 2 - w / 2,
      end: rtl ? c.left - overhang : c.right + overhang - w,
    };
    const fits = (l) => l >= margin && l + w <= vw - margin;
    let a = align;
    if (!fits(lefts[a])) a = [a, align === 'end' ? 'start' : 'end', 'center'].find((k) => fits(lefts[k])) ?? a;
    const left = Math.min(Math.max(lefts[a], margin), Math.max(margin, vw - margin - w));

    floating.style.setProperty('--anchor-top', `${Math.round(top)}px`);
    floating.style.setProperty('--anchor-left', `${Math.round(left)}px`);
    floating.style.setProperty('--anchor-caret', `${Math.round(c.left + c.width / 2 - left)}px`);
    floating.dataset.side = s;
    floating.dataset.align = a;
  };
  const later = () => { frame ||= requestAnimationFrame(place); };
  place();
  addEventListener('scroll', later, { capture: true, passive: true });
  addEventListener('resize', later, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('scroll', later, { capture: true });
    removeEventListener('resize', later);
  };
}
