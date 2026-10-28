/**
 * HOVER CARD — the pointer light, sized to the card, and the tilt (tilt.js; hover-card.css;
 * design/components/hover-card.md; exploring). Puts the two-tone gradients the
 * icon needs on the page (two-tone.js). Safe to call again.
 *
 *   import { hoverCards } from './hover-card.js';
 *   hoverCards();            // every .hcard
 */
import { followPointer } from './pointer.js';
import { twoTone } from './two-tone.js';
import { cardTilt } from './tilt.js';

export { cardTilt };

const ready = new WeakSet();

/** @param {string} [selector] */
export function hoverCards(selector = '.hcard') {
  twoTone();
  document.querySelectorAll(selector).forEach((card) => {
    if (ready.has(card)) return;
    ready.add(card);
    followPointer(card);
    cardTilt(card);
    // The card's width, for the light sized to the card (--cw).
    card.addEventListener('pointerenter', () => card.style.setProperty('--cw', `${card.offsetWidth}px`));
  });
}
