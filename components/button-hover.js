/**
 * BUTTON HOVER — color in motion on hover (button-hover.css; design/components/button.md,
 * decisions/2026-10-17-button-hover-hue-keys; exploring). Adds the glow and fill
 * layers to each button and sets where the color loop starts. Skips disabled
 * buttons, pressed toggles (aria-pressed) and buttons already set up, so it is
 * safe to call again after content is added.
 *
 *   import { buttonHover } from './button-hover.js';
 *   buttonHover();                 // every .btn
 *   buttonHover('.hs-button');     // markup you can't edit (it must hold
 *                                  // children: a <button> or <a>, not an <input>)
 *
 * The layers and their motion are drawn by button-hover.css.
 */
const LAYER = (k) => `<span class="btn-flow btn-flow--${k}" aria-hidden="true"><i></i><i></i><i></i></span>`;

// One turn of the color loop per minute of clock time.
const MINUTE = 60000;

/** The default start: by the clock, the same for every button and visitor at a
 *  given moment; a secondary button half a loop on, opposite the primary on the
 *  wheel. Returns a fraction of one loop. */
export const clockStart = (solid) => ((Date.now() % MINUTE) / MINUTE + (solid ? 0 : 0.5)) % 1;

/**
 * @param {string} [selector]
 * @param {{ start?: (solid: boolean, btn: HTMLElement) => number }} [options]
 *   start: where the loop starts, 0–1 (default clockStart).
 */
export function buttonHover(selector = '.btn', { start = clockStart } = {}) {
  document.querySelectorAll(selector).forEach((btn) => {
    if (btn.classList.contains('has-flow') || btn.matches('[disabled], [aria-disabled="true"], [aria-pressed]')) return;
    btn.classList.add('has-flow');
    btn.style.setProperty('--flow-inset', `-${getComputedStyle(btn).borderTopWidth}`);
    btn.insertAdjacentHTML('afterbegin', LAYER('glow') + LAYER('fill'));
    // Primary = filled at rest (solid); anything without a fill is secondary.
    const solid = !/rgba\(.*,\s*0\)|transparent/.test(getComputedStyle(btn).backgroundColor);
    const setStart = () => btn.style.setProperty('--flow-start', start(solid, btn).toFixed(4));
    setStart();
    keepFlowing(btn, btn.querySelector('.btn-flow--fill'), setStart);
  });
}

/** Keeps the color running (.is-flowing) from hover or focus until the fill has
 *  faded out, so mouseout doesn't snap it back to its first frame. A new start is
 *  picked only when the button was fully at rest; back in mid-fade, it carries on. */
function keepFlowing(btn, fill, onStart) {
  const enter = () => {
    if (!btn.classList.contains('is-flowing')) onStart();
    btn.classList.add('is-flowing');
  };
  btn.addEventListener('pointerenter', enter);
  btn.addEventListener('focus', enter);
  fill.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity' && getComputedStyle(fill).opacity === '0') btn.classList.remove('is-flowing');
  });
}
