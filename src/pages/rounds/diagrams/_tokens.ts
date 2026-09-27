/**
 * DIAGRAM ROUND — working color values.
 *
 * The working favorites live in ../_working.ts, which every round reads so
 * the diagrams, the working-favorites page and its downloads can't disagree.
 * This file adds the one helper only the diagrams need.
 */
export { TOKEN_CSS } from '../_working';

/** The nine gradient stops as CSS values, for spreading along a node column. */
export const SPEC = Array.from({ length: 9 }, (_, i) => `var(--spec-${i + 1})`);

/** A color at position t (0–1) along the gradient, mixed in OKLCH between
 *  its two nearest stops — so a column of nodes walks the brand gradient
 *  without inventing a single value. `from`/`to` pick a sub-range of stops. */
export function along(t: number, from = 0, to = 8): string {
  const x = from + t * (to - from), i = Math.min(Math.floor(x), to - 1), f = x - i;
  if (f < 0.02) return SPEC[i];
  if (f > 0.98) return SPEC[i + 1];
  return `color-mix(in oklch, ${SPEC[i]}, ${SPEC[i + 1]} ${Math.round(f * 100)}%)`;
}
