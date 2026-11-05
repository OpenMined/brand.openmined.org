/**
 * DIAGRAM — box-and-arrow diagrams (design/patterns/diagrams.md; components/diagram.css).
 *
 *   import { diagrams, diagramPath, diagramSvg } from './diagram.js';
 *   diagrams();                       // every .dia and .dia-flat on the page
 *   diagramPath([[0, 0], [100, 0], [100, 60]], { both: false });   // path data, at build or by hand
 *   diagramSvg(document.querySelector('.dia-flat'));                // a standalone SVG file's text
 *
 * diagrams(selector) does two things, and is safe to call again:
 * - Draws every path[data-points] ("x,y x,y …", start to tip): straight runs,
 *   every bend rounded at the large radius (10), and the arrowhead, two legs at
 *   45° to the line reaching 6px back and 6px to each side (two sides of a
 *   square, turned 45°), at the line's own width. data-both puts a head at the
 *   start too (a two-way line). A line starts on the box it leaves and its tip
 *   stops 4px short of the box it reaches: give the points so.
 * - Once the fonts have loaded, checks that text stays inside its node. A flat
 *   node's line of text (SVG text never wraps) must end 10px inside the outline;
 *   a full node's text must fit its card. Anything over is marked data-overflow
 *   (drawn in the danger color) and named in the console, to fix in the layout.
 *
 * diagramSvg(svg) copies a flat diagram with the styles it has now (the current
 * mode's colors, the fonts by name, caps written out) onto each element, on the
 * figure frame's surface as its background, so the file opens the same in Figma, Illustrator, Keynote or a document. Run it in the
 * mode you want to save.
 *
 * Nothing here moves; pulses along lines are line-flow.js.
 */
const RADIUS = 10, HEAD = 6, PAD = 10;

const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
const n2 = (n) => Math.round(n * 100) / 100;
const head = (t, v) => {
  const n = [-v[1], v[0]];
  const a = [t[0] - HEAD * v[0] + HEAD * n[0], t[1] - HEAD * v[1] + HEAD * n[1]];
  const b = [t[0] - HEAD * v[0] - HEAD * n[0], t[1] - HEAD * v[1] - HEAD * n[1]];
  return ` M${n2(a[0])},${n2(a[1])} L${n2(t[0])},${n2(t[1])} L${n2(b[0])},${n2(b[1])}`;
};

/** Path data for a line through `points` ([[x, y], …], start to tip). */
export function diagramPath(points, { both = false } = {}) {
  let d = `M${n2(points[0][0])},${n2(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i], u = unit(points[i - 1], p), v = unit(p, points[i + 1]);
    const sweep = u[0] * v[1] - u[1] * v[0] > 0 ? 1 : 0;
    d += ` L${n2(p[0] - u[0] * RADIUS)},${n2(p[1] - u[1] * RADIUS)} A${RADIUS},${RADIUS} 0 0 ${sweep} ${n2(p[0] + v[0] * RADIUS)},${n2(p[1] + v[1] * RADIUS)}`;
  }
  const t = points[points.length - 1];
  d += ` L${n2(t[0])},${n2(t[1])}` + head(t, unit(points[points.length - 2], t));
  if (both) d += head(points[0], unit(points[1], points[0]));
  return d;
}

const parse = (s) => s.trim().split(/\s+/).map((p) => p.split(',').map(Number));

function check(root) {
  root.querySelectorAll('[data-overflow]').forEach((el) => el.removeAttribute('data-overflow'));
  root.querySelectorAll('.dia-box').forEach((g) => {
    const frame = g.querySelector('.dia-box__frame');
    if (!frame) return;
    const f = frame.getBBox();
    g.querySelectorAll('text').forEach((t) => {
      const b = t.getBBox(), over = b.x + b.width - (f.x + f.width - PAD);
      if (over > 0.5) { t.dataset.overflow = ''; console.warn(`Diagram: "${t.textContent}" runs ${over.toFixed(1)}px into its node's padding; break the line sooner.`); }
    });
  });
  root.querySelectorAll('.dia-node').forEach((n) => {
    if (n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1) {
      n.dataset.overflow = '';
      console.warn(`Diagram: the text of "${n.querySelector('.dia-node__title')?.textContent ?? 'a node'}" doesn't fit its card; make the card taller or the text shorter.`);
    }
  });
}

/** Draws the lines of every diagram matching `selector`, and checks its text fits. */
export function diagrams(selector = '.dia, .dia-flat') {
  const roots = [...document.querySelectorAll(selector)];
  roots.forEach((root) => root.querySelectorAll('path[data-points]').forEach((p) => {
    p.setAttribute('d', diagramPath(parse(p.dataset.points), { both: p.hasAttribute('data-both') }));
  }));
  (document.fonts?.ready ?? Promise.resolve()).then(() => roots.forEach(check));
}

const PROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'font-family', 'font-size', 'font-weight', 'letter-spacing', 'opacity'];

/** A flat diagram as a standalone SVG file's text, with its current styles written onto each element. */
export function diagramSvg(svg) {
  const copy = svg.cloneNode(true);
  const src = [svg, ...svg.querySelectorAll('*')], out = [copy, ...copy.querySelectorAll('*')];
  src.forEach((el, i) => {
    const cs = getComputedStyle(el), o = out[i];
    PROPS.forEach((p) => { const v = cs.getPropertyValue(p); if (v && v !== 'normal' && v !== 'none' || p === 'fill' || p === 'stroke') o.setAttribute(p, v); });
    if (el.tagName === 'rect') ['rx', 'ry'].forEach((p) => { const v = parseFloat(cs.getPropertyValue(p)); if (v) o.setAttribute(p, String(v)); });
    if (el.tagName === 'text' && cs.textTransform === 'uppercase') o.textContent = el.textContent.toUpperCase();
    o.removeAttribute('class'); o.removeAttribute('style'); o.removeAttribute('data-points'); o.removeAttribute('data-both'); o.removeAttribute('data-overflow');
  });
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const { x, y, width, height } = svg.viewBox.baseVal;
  const frame = svg.closest('.fig');
  if (frame) {
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries({ x, y, width, height, fill: getComputedStyle(frame).backgroundColor }).forEach(([k, v]) => bg.setAttribute(k, String(v)));
    copy.prepend(bg);
  }
  copy.setAttribute('width', String(width)); copy.setAttribute('height', String(height));
  return `<?xml version="1.0" encoding="UTF-8"?>\n${copy.outerHTML}`;
}
