/**
 * STAT CARD — work in progress (design/wip/stat-card.md; look: stat-card.css). The full layer:
 * the hover card's tilt and colorflow on each stat card, the flow green for good news and red
 * for bad (from its change), unless the card sets data-hover-hue. The color change itself is
 * CSS, so the minimal layer has it without this. Safe to call again.
 *
 *   import { statCards } from './stat-card.js';
 *   statCards();            // every .stat-card
 */
import { cardFlows } from '../card-flow.js';
import { cardTilt } from '../tilt.js';

export function statCards(cards = '.stat-card') {
  if (typeof cards === 'string') cards = document.querySelectorAll(cards);
  const ready = [];
  for (const card of cards) {
    if (card.dataset.statCardReady) continue;
    card.dataset.statCardReady = '1';
    if (!card.dataset.hoverHue) card.dataset.hoverHue = card.querySelector('.stat-card__change--bad') ? 'red' : 'green';
    // Tilt only outside the minimal layer (the CSS ignores it there, but don't track the pointer).
    if (!card.closest('[data-interaction="minimal"]')) cardTilt(card);
    ready.push(card);
  }
  cardFlows(ready);
}
