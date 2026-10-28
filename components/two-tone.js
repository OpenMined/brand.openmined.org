/**
 * TWO-TONE — the moving two-tone gradients colored icons and hover cards draw
 * their strokes with (design/foundations/two-tone.md, behaviors/color-moves).
 * One SVG gradient per hue, #tt-<hue>, read from its tokens' stops
 * (--gradient-two-tone-<hue>-base, -darker, -companion, -lighter: mode-aware).
 * Bottom left → top right, repeating every 96 units of the 24 grid (4× the icon,
 * so the band never fits inside it), slid one period per 4s. Paused under
 * reduced motion, followed live.
 *
 *   import { twoTone } from './two-tone.js';
 *   twoTone();   // once per page; safe to call again
 */
export const HUES = ['violet', 'blue', 'teal', 'green', 'amber', 'red'];
const STOPS = ['base', 'darker', 'companion', 'lighter', 'base'];

/** The gradients as an SVG string, for pages that render it themselves. */
export function twoToneDefsSvg(hues = HUES) {
  const grad = (h) => `<linearGradient id="tt-${h}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="96" y2="0" spreadMethod="repeat" gradientTransform="rotate(-45 12 12)">${STOPS.map((r, i) => `<stop offset="${i / (STOPS.length - 1)}" style="stop-color:var(--gradient-two-tone-${h}-${r})"/>`).join('')}<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="96 0" dur="4s" repeatCount="indefinite" additive="sum"/></linearGradient>`;
  return `<svg class="two-tone-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>${hues.map(grad).join('')}</defs></svg>`;
}

let watching = false;
/** SMIL ignores prefers-reduced-motion: pause every set of gradients by hand. */
export function pauseWithReducedMotion() {
  const rm = matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => document.querySelectorAll('.two-tone-defs').forEach((d) => (rm.matches ? d.pauseAnimations() : d.unpauseAnimations()));
  sync();
  if (!watching) { watching = true; rm.addEventListener('change', sync); }
}

/** Puts the gradients on the page (end of <body>) unless they are there already. */
export function twoTone() {
  if (!document.querySelector('.two-tone-defs')) document.body.insertAdjacentHTML('beforeend', twoToneDefsSvg());
  pauseWithReducedMotion();
}
