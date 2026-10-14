/**
 * Button hover: color in motion (src/styles/button-hover.css). Adds the glow and
 * fill layers to each button and moves the pointer light. Skips disabled buttons,
 * pressed toggles (aria-pressed) and buttons that already draw their own layers
 * (the Color and interaction round's .mbtn). Exploring.
 */
const LAYER = (k: string, light = false) =>
  `<span class="btn-flow btn-flow--${k}" aria-hidden="true"><i></i><i></i><i></i>${light ? '<b class="btn-flow__light"></b>' : ''}</span>`;

export function buttonHover(selector = '.btn') {
  document.querySelectorAll<HTMLElement>(selector).forEach((btn) => {
    if (btn.classList.contains('has-flow') || btn.classList.contains('mbtn') || btn.matches('[disabled], [aria-disabled="true"], [aria-pressed]')) return;
    btn.classList.add('has-flow');
    // The fill covers the button's own border, whatever its width.
    btn.style.setProperty('--flow-inset', `-${getComputedStyle(btn).borderTopWidth}`);
    btn.insertAdjacentHTML('afterbegin', LAYER('glow') + LAYER('fill', true));
    followPointer(btn);
  });
}

/** A light that eases toward the pointer each frame (it trails a little): sets
 *  --mx and --my on the element, in px from its top left. */
export function followPointer(el: HTMLElement) {
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

/** Hover cards (components/site/HoverCard.astro): the pointer light. */
export function hoverCards(selector = '.hcard') {
  document.querySelectorAll<HTMLElement>(selector).forEach(followPointer);
}
