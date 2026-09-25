/** DIAGRAM ROUND — small geometry helpers shared by every figure. */

export const f = (n: number) => +n.toFixed(1);

/** n evenly spaced values from a to b inclusive. */
export const spread = (n: number, a: number, b: number) =>
  Array.from({ length: n }, (_, i) => f(n === 1 ? (a + b) / 2 : a + (i * (b - a)) / (n - 1)));

/** A cubic from (x0,y0) to (x1,y1) leaving and arriving horizontally —
 *  the soft fan every convergence uses. `k` is how far the handles reach. */
export const hcurve = (x0: number, y0: number, x1: number, y1: number, k = 0.5) => {
  const d = (x1 - x0) * k;
  return `M${f(x0)},${f(y0)} C${f(x0 + d)},${f(y0)} ${f(x1 - d)},${f(y1)} ${f(x1)},${f(y1)}`;
};

/** An arc segment of a circle, degrees clockwise from 12 o'clock. */
export const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${f(x0)},${f(y0)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)},${f(y1)}`;
};
