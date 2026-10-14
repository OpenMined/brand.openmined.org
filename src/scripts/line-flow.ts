/**
 * Line flow: color in motion for diagram lines (behaviors/color-moves, exploring).
 *
 * A soft pulse travels along every SVG path marked `data-flow`, in the path's
 * own direction. The pulse is the link-hover trick drawn on a line: a band 1px
 * wider than the line on each side, in the line's own stroke (color, gradient
 * or gray), fading transparent → opaque → transparent. SVG gradients can't
 * follow a curve, so the fade is built from nested dashes, all centered on the
 * pulse, each shorter than the last and faint: they stack to full strength at
 * the center and thin out toward the ends. (Slices laid end to end showed a
 * hatched seam at every join.)
 *
 * Each slice is a shallow clone of its path (same class, style and scoped
 * attribute), so its color follows the mode with the line. Paths are staggered
 * so the pulses never march in step. Offscreen figures stop; reduced motion
 * leaves the lines still.
 *
 * Tuning, per path or on any ancestor: data-flow-speed (units per second),
 * data-flow-length (pulse length, units), data-flow-rest (seconds between
 * pulses), data-flow-peak (opacity at the pulse's center).
 */
const SLICES = 16;

type Flow = { slices: SVGPathElement[]; lens: number[]; W: number; period: number; speed: number; phase: number };

const num = (el: Element, key: string, fallback: number) => {
  const v = el.closest(`[data-flow-${key}]`)?.getAttribute(`data-flow-${key}`);
  return v ? Number(v) : fallback;
};

export function lineFlow(root: ParentNode = document) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => {
    const paths = [...svg.querySelectorAll<SVGPathElement>('path[data-flow]')];
    if (!paths.length || svg.dataset.flowing) return;
    svg.dataset.flowing = '';

    const flows: Flow[] = paths.map((p, i) => {
      const len = p.getTotalLength();
      const speed = num(p, 'speed', 36), W = num(p, 'length', 56), rest = num(p, 'rest', 3.5), peak = num(p, 'peak', 0.9);
      const width = parseFloat(getComputedStyle(p).strokeWidth) + 2;
      // Each dash's own opacity, so all of them stacked reach the peak.
      const a = 1 - (1 - peak) ** (1 / SLICES);
      const lens = Array.from({ length: SLICES }, (_, j) => W * (SLICES - j) / SLICES);
      const slices = lens.map((d) => {
        const s = p.cloneNode(false) as SVGPathElement;
        s.removeAttribute('data-flow'); s.removeAttribute('marker-end'); s.removeAttribute('marker-start');
        s.setAttribute('aria-hidden', 'true');
        s.style.opacity = String(a);
        s.style.strokeWidth = `${width}px`;
        s.style.strokeLinecap = 'butt';
        s.style.strokeDasharray = `${d} ${len + W * 4}`;
        return s;
      });
      p.after(...slices);
      // Golden-ratio stagger: neighbors never pulse together.
      const period = (len + W) / speed + rest;
      return { slices, lens, W, period, speed, phase: ((i * 0.618) % 1) * period };
    });

    let raf = 0, visible = false;
    const frame = (t: number) => {
      const sec = t / 1000;
      for (const f of flows) {
        // The pulse's head runs from the path's start to past its end, then rests.
        const head = ((sec + f.phase) % f.period) * f.speed;
        f.slices.forEach((s, j) => { s.style.strokeDashoffset = String(-(head - (f.W + f.lens[j]) / 2)); });
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }).observe(svg);
  });
}
