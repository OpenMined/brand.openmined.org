/** Diagrams — color helpers for the figures (src/diagrams/): highlights and draining lines. */

/** The highlight of a palette hue: the brighter part of a moving line (foundations/highlight). */
export const tone = (hue: string) => `var(--gradient-highlight-${hue})`;

/** A gradient stop: an offset along the line (0–1), a color, and its opacity. */
export type Stop = { offset: number; color: string; opacity?: number };

/** Gradient stops for a line that drains to gray from `at` (0–1), and for its
 *  highlight pulse, which turns gray with it. Both are plain SVG gradients
 *  rendered with the page: no script decides a color. */
export function drainStops(color: string, tone: string, at: number): { line: Stop[]; tone: Stop[] } {
  const gray = 'var(--diagram-connector)';
  return {
    line: [{ offset: 0, color }, { offset: at, color }, { offset: 1, color: gray }],
    tone: [{ offset: 0, color: tone }, { offset: at, color: tone }, { offset: 1, color: gray }],
  };
}

/** A stop's inline style. */
export const stopStyle = (s: Stop) => `stop-color:${s.color}${s.opacity === undefined ? '' : `;stop-opacity:${s.opacity}`}`;
