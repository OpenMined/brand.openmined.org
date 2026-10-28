/**
 * PAGE REVIEWS — the Options panel's button hovers (src/page-reviews/ReviewBar.astro),
 * over the v2 button component (components/button-hover.js; button-options.css for the
 * looks). data-btn-hover on <html> picks one; none = j, the working favorite.
 */
import { buttonHover, clockStart } from '../../../components/button-hover.js';
import { followPointer } from '../../../components/pointer.js';

/** The Color and interaction round's button options. */
export const BUTTON_HOVERS = [
  { key: 'j', label: 'J · Hue keys from the clock, secondary opposite', start: 'clock-opposite' },
  { key: 'i', label: 'I · Hue keys from the clock', start: 'clock' },
  { key: 'h', label: 'H · Hue keys from a random point', start: 'random' },
  { key: 'k', label: 'K · Full OM gradient from green, secondary from violet', start: 'green-violet' },
  { key: 'g', label: 'G · Full OM gradient from green', start: 'green' },
  { key: 'e', label: 'E · Full OM gradient from green + pointer light', start: 'green' },
] as const;

// Violet in the full OM gradient's loop: the run from green goes teal, blue, violet,
// three of its nine steps (400px of 1200).
const VIOLET = 1 / 3;

/** Where the loop starts, as a fraction of one loop, for the current option. */
function startFor(solid: boolean) {
  const key = document.documentElement.dataset.btnHover || 'j';
  const start = BUTTON_HOVERS.find((o) => o.key === key)?.start ?? 'clock-opposite';
  if (start === 'green') return 0;
  if (start === 'green-violet') return solid ? 0 : VIOLET;
  if (start === 'random') return Math.random();
  if (start === 'clock') return clockStart(true);
  return clockStart(solid);
}

/** The component's button hover with the option's start, plus option E's pointer
 *  light (hidden unless E is picked). */
export function reviewButtons(selector = '.btn') {
  buttonHover(selector, { start: startFor });
  document.querySelectorAll<HTMLElement>(`${selector}.has-flow`).forEach((btn) => {
    const fill = btn.querySelector('.btn-flow--fill');
    if (!fill || fill.querySelector('.btn-flow__light')) return;
    fill.insertAdjacentHTML('beforeend', '<b class="btn-flow__light"></b>');
    followPointer(btn);
  });
}
