/**
 * LINK CARD — the tilt (tilt.js; link-card.css; design/components/link-card.md;
 * exploring). Safe to call again.
 *
 *   import { linkCards } from './link-card.js';
 *   linkCards();             // every .lcard
 */
import { cardTilt } from './tilt.js';

const ready = new WeakSet();

/** @param {string} [selector] */
export function linkCards(selector = '.lcard') {
  document.querySelectorAll(selector).forEach((card) => {
    if (ready.has(card)) return;
    ready.add(card);
    cardTilt(card);
  });
}
