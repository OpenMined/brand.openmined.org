/**
 * Line flow: color in motion for diagram lines (behaviors/color-moves, exploring).
 *
 * A soft pulse travels along every SVG path marked `data-flow`, in the path's
 * own direction. The pulse is the link-hover trick drawn on a line: a band 1px
 * wider than the line on each side, in the line's own stroke (color, gradient
 * or gray), fading transparent → opaque → transparent. SVG gradients can't
 * follow a curve, so the fade is built from nested dashes, all centered on the
 * pulse, each shorter than the last: they stack to full strength at the center
 * and thin out toward the ends. Five dashes, each setting its own opacity so
 * the stack reaches the strengths in LEVELS (equal opacities make a bulge, near
 * full strength most of the way), the steps STEP of the even spacing long. (Slices laid
 * end to end showed a hatched seam at every join.)
 *
 * Highlight: a path that sets `--flow-tone` (its hue's highlight,
 * --gradient-highlight-<hue>) pulses in the highlight alone,
 * transparent → opaque → transparent, drawn over every line in its group:
 * the line lit up, moving along it. `--flow-tone` is a color or a gradient (`url(#id)`): a line that
 * drains to gray passes a gradient of its highlight shaped like its own.
 * Lines without it pulse in their own stroke, on top.
 *
 * Each slice is a shallow clone of its path (same class, style and scoped
 * attribute), so its color follows the mode with the line. Paths are staggered
 * so the pulses never march in step. Offscreen figures stop; reduced motion
 * leaves the lines still.
 *
 * Tuning, per path or on any ancestor: data-flow-speed (units per second),
 * data-flow-length (pulse length, units), data-flow-rest (seconds between
 * pulses), data-flow-peak (opacity at the pulse's center; 0.9, or TONE_PEAK
 * for a highlight).
 */
/** The stacked strength of each step, from the pulse's end in, as shares of its
 *  peak: with a highlight's 0.8, 0.15 → 0.28 → 0.49 → 0.65 → 0.80. One dash per
 *  step, tuned by eye (Kyle, 2026-10-27): small steps at the faint end, where the
 *  eye sees a step as a bigger change, and the tails holding some strength. */
const LEVELS = [0.15, 0.28, 0.49, 0.65, 0.8].map((v) => v / 0.8);
/** Each step's length as a share of the even spacing (steps filling the whole
 *  pulse): 0.75, 4.2 units each side of a 56-unit pulse (16.8 of ramp at each
 *  end), and the center holds full strength for 22.4. */
const STEP = 0.75;
/** Peak opacity of a highlight (its own data-flow-peak wins). */
const TONE_PEAK = 0.8;

type Flow = { slices: SVGPathElement[]; lens: number[]; W: number; len: number; period: number; speed: number; phase: number; resting: boolean };

const num = (el: Element, key: string, fallback: number) => {
  const v = el.closest(`[data-flow-${key}]`)?.getAttribute(`data-flow-${key}`);
  return v ? Number(v) : fallback;
};

/** Each nested dash's own opacity, outermost first, so the dashes stacked
 *  reach LEVELS × peak. */
const alphasFor = (peak: number) => {
  let below = 0;
  return LEVELS.map((share) => {
    const t = share * peak, a = 1 - (1 - t) / (1 - below);
    below = t;
    return a;
  });
};

export function lineFlow(root: ParentNode = document) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => {
    const paths = [...svg.querySelectorAll<SVGPathElement>('path[data-flow]')];
    if (!paths.length || 'flowing' in svg.dataset) return;
    svg.dataset.flowing = '';

    const flows: Flow[] = paths.map((p, i) => {
      const len = p.getTotalLength();
      const cs = getComputedStyle(p);
      const tone = Boolean(cs.getPropertyValue('--flow-tone').trim());
      // A highlight stays semi-transparent over its line.
      const speed = num(p, 'speed', 36), W = num(p, 'length', 56), rest = num(p, 'rest', 3.5), peak = num(p, 'peak', tone ? TONE_PEAK : 0.9);
      const width = parseFloat(cs.strokeWidth) + 2;
      const alphas = alphasFor(peak);
      const n = LEVELS.length;
      const lens = alphas.map((_, j) => W * (1 - STEP * j / n));
      const slices = lens.map((d, j) => {
        const s = p.cloneNode(false) as SVGPathElement;
        s.removeAttribute('data-flow'); s.removeAttribute('marker-end'); s.removeAttribute('marker-start');
        s.setAttribute('aria-hidden', 'true');
        s.style.opacity = String(alphas[j]);
        s.style.strokeWidth = `${width}px`;
        s.style.strokeLinecap = 'butt';
        s.style.strokeDasharray = `${d} ${len + W * 4}`;
        if (tone) s.style.stroke = 'var(--flow-tone)';
        return s;
      });
      // A highlight pulse goes over every flowing line in its group, so no line
      // drawn later covers it; an own-color pulse sits on its line.
      if (tone) [...p.parentNode!.querySelectorAll(':scope > path[data-flow]')].at(-1)!.after(...slices);
      else p.after(...slices);
      // Golden-ratio stagger: neighbors never pulse together.
      const period = (len + W) / speed + rest;
      return { slices, lens, W, len, period, speed, phase: ((i * 0.618) % 1) * period, resting: false };
    });

    let raf = 0, visible = false;
    const frame = (t: number) => {
      const sec = t / 1000;
      for (const f of flows) {
        // The pulse's head runs from the path's start to past its end, then rests.
        const head = ((sec + f.phase) % f.period) * f.speed;
        // Past the end the pulse is out of sight: place it there once, then
        // leave it untouched until the next one starts.
        const resting = head > f.len + f.W;
        if (resting && f.resting) continue;
        f.resting = resting;
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
