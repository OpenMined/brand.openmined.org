/**
 * Button hover: color in motion (src/styles/button-hover.css). Adds the glow and
 * fill layers to each button and sets where the loop starts (by the clock; a
 * secondary button half a loop on, opposite the primary; the page reviews' Options
 * panel can switch to another option, BUTTON_HOVERS). Skips disabled buttons,
 * pressed toggles (aria-pressed) and buttons that already draw their own layers
 * (the Color and interaction round's .mbtn). Exploring.
 */
import { cardTilt } from './card-tilt';
const LAYER = (k: string, light = false) =>
  `<span class="btn-flow btn-flow--${k}" aria-hidden="true"><i></i><i></i><i></i>${light ? '<b class="btn-flow__light"></b>' : ''}</span>`;

/** The Color and interaction round's button options, for the page reviews'
 *  Options panel (data-btn-hover on <html>; none = j, the working favorite). */
export const BUTTON_HOVERS = [
  { key: 'j', label: 'J · Hue keys from the clock, secondary opposite', start: 'clock-opposite' },
  { key: 'i', label: 'I · Hue keys from the clock', start: 'clock' },
  { key: 'h', label: 'H · Hue keys from a random point', start: 'random' },
  { key: 'g', label: 'G · Full OM gradient from green', start: 'green' },
  { key: 'e', label: 'E · Full OM gradient from green + pointer light', start: 'green' },
] as const;

// One turn of the color loop per minute of clock time.
const MINUTE = 60000;

/** Where the loop starts, as a fraction of one loop, for the current option. */
function startFor(solid: boolean) {
  const key = document.documentElement.dataset.btnHover || 'j';
  const start = BUTTON_HOVERS.find((o) => o.key === key)?.start ?? 'clock-opposite';
  if (start === 'green') return 0;
  if (start === 'random') return Math.random();
  const clock = (Date.now() % MINUTE) / MINUTE;
  return (clock + (start === 'clock-opposite' && !solid ? 0.5 : 0)) % 1;
}

export function buttonHover(selector = '.btn') {
  document.querySelectorAll<HTMLElement>(selector).forEach((btn) => {
    if (btn.classList.contains('has-flow') || btn.classList.contains('mbtn') || btn.matches('[disabled], [aria-disabled="true"], [aria-pressed]')) return;
    btn.classList.add('has-flow');
    // The fill covers the button's own border, whatever its width.
    btn.style.setProperty('--flow-inset', `-${getComputedStyle(btn).borderTopWidth}`);
    btn.insertAdjacentHTML('afterbegin', LAYER('glow') + LAYER('fill', true));
    // Primary = filled at rest (solid); anything without a fill is secondary.
    const solid = !/rgba\(.*,\s*0\)|transparent/.test(getComputedStyle(btn).backgroundColor);
    const setStart = () => btn.style.setProperty('--flow-start', startFor(solid).toFixed(4));
    setStart();
    keepFlowing(btn, btn.querySelector('.btn-flow--fill')!, setStart);
    // The pointer light (option e only; hidden otherwise).
    followPointer(btn);
  });
}

/** Keeps the color running (.is-flowing) from hover or focus until the fill has
 *  faded out, so mouseout doesn't snap it back to its first frame. A new start is
 *  picked only when the button was fully at rest; back in mid-fade, it carries on. */
export function keepFlowing(btn: HTMLElement, fill: Element, onStart: () => void) {
  const enter = () => {
    if (!btn.classList.contains('is-flowing')) onStart();
    btn.classList.add('is-flowing');
  };
  btn.addEventListener('pointerenter', enter);
  btn.addEventListener('focus', enter);
  fill.addEventListener('transitionend', (e) => {
    if ((e as TransitionEvent).propertyName === 'opacity' && getComputedStyle(fill).opacity === '0') btn.classList.remove('is-flowing');
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

/** Form fields (.ctl, components/form-field): the pointer light inside the field. */
export function fieldLights(selector = '.ctl') {
  document.querySelectorAll<HTMLElement>(selector).forEach(followPointer);
}

/** Hover cards (components/site/HoverCard.astro): the pointer light (sized to the
 *  card's width, --cw) and the tilt (src/scripts/card-tilt.ts). */
export function hoverCards(selector = '.hcard') {
  document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
    followPointer(card);
    cardTilt(card);
    card.addEventListener('pointerenter', () => card.style.setProperty('--cw', `${card.offsetWidth}px`));
  });
}
