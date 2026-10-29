/**
 * Card colorflow (behaviors/color-moves): on hover or keyboard focus a
 * card fades in a small colorflow across its lower third, in its hue's two-tone
 * stops (--gradient-two-tone-<hue>-base / -darker / -companion / -lighter, read
 * on the card, so the color mode and data-section apply). The hue is the card's
 * data-hover-hue, the one its icon takes. No markup ahead of time: the flow's
 * canvas is made on enter (src/scripts/gl/renderer.ts, one WebGL context for the
 * page) and removed once it has faded out, so at most two exist at once, one
 * fading in and one out. Pointer devices only; reduced motion shows a still
 * frame. Look: src/styles/card-flow.css.
 */
import { place, cssColors, type Placement, type Unit } from './renderer';

const ROLES = ['base', 'darker', 'companion', 'lighter'];
/** Longer than the fade-out in card-flow.css, so the canvas goes after it's faded. */
const REMOVE_MS = 600;

/** `unitOf` picks the flow for a card when it's entered (null: none); `speedOf`
 *  its speed (1 = the unit's own pace). */
export function cardFlows(cards: Iterable<HTMLElement>, unitOf: (card: HTMLElement) => Unit | null, speedOf: (card: HTMLElement) => number = () => 1) {
  if (!matchMedia('(hover: hover)').matches) return;
  for (const card of cards) {
    let p: Placement | null = null, unit: Unit | null = null, timer = 0;
    const show = () => {
      const u = unitOf(card), hue = card.dataset.hoverHue;
      if (!u || !hue) return;
      clearTimeout(timer);
      const colors = cssColors(card, ROLES.map((r) => `--gradient-two-tone-${hue}-${r}`));
      const speed = speedOf(card);
      if (p && unit === u) { p.recolor(colors); p.setSpeed(speed); }
      else { p?.remove(); p = place(card, u, colors, 'card-flow', speed); unit = u; }
      const el = p?.el;
      // Next frame, so the fade starts from opacity 0.
      if (el) requestAnimationFrame(() => el.classList.add('is-on'));
    };
    const hide = () => {
      if (!p) return;
      p.el.classList.remove('is-on');
      timer = window.setTimeout(() => { p?.remove(); p = null; unit = null; }, REMOVE_MS);
    };
    card.addEventListener('pointerenter', show);
    card.addEventListener('pointerleave', hide);
    card.addEventListener('focusin', show);
    card.addEventListener('focusout', hide);
  }
}
