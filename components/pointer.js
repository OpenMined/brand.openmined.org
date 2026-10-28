/**
 * POINTER — shared helper for the v2 components (exploring). A light that eases
 * toward the pointer each frame, so it trails a little: sets --mx and --my on
 * the element, in px from its top left; the component's CSS draws the light.
 * Used by field.js and hover-card.js. Safe to call twice on one element.
 */
const following = new WeakSet();

/** @param {HTMLElement} el */
export function followPointer(el) {
  if (following.has(el)) return;
  following.add(el);
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const step = () => {
    x += (tx - x) * 0.15; y += (ty - y) * 0.15;
    el.style.setProperty('--mx', `${x}px`); el.style.setProperty('--my', `${y}px`);
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(step) : 0;
  };
  el.addEventListener('pointerenter', (e) => { const r = el.getBoundingClientRect(); x = tx = e.clientX - r.left; y = ty = e.clientY - r.top; step(); });
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
    if (!raf) raf = requestAnimationFrame(step);
  });
}
