/**
 * SVG ALLOWLIST — every partner mark passes through this before it enters the repo, and
 * the check (tools/logos/check-tools.mjs, in `npm run lint`) runs it over every file
 * already here. Other apps that serve these files (admin.openmined.org's brand_marks)
 * run the same rules again on their side.
 *
 * An SVG is a script vector, so this is an allowlist, not a blocklist: the output is
 * rebuilt from the elements and attributes named below and nothing else.
 *   - Editor noise (comments, the XML declaration, <metadata>, <desc>, <title>, and
 *     sodipodi:/inkscape: elements and attributes) is dropped.
 *   - Simple class styles (`.a{fill:#123}`) are moved onto the elements that use them;
 *     anything else in a <style> stops the file.
 *   - Anything else outside the allowlist stops the file with the reason, so a person
 *     looks at it: scripts, foreignObject, images, <use>, links, animation, DOCTYPE,
 *     entities, CDATA, any href, event attributes, data:/javascript: anywhere, and in a
 *     value: any function but colors, transforms and url(#id), quotes, CSS escapes and
 *     comments, and characters outside printable ASCII.
 * The drawing itself (paths, shapes, gradients, clip paths, transforms) is kept exactly.
 */

export const MAX_BYTES = 64 * 1024;

const ELEMENTS = new Set([
  'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline', 'line',
  'defs', 'linearGradient', 'radialGradient', 'stop', 'clipPath', 'mask',
  // Blur only (Google's 2025 G shades with it). No other filter primitive: feImage loads
  // files, and the rest aren't used by any mark.
  'filter', 'feGaussianBlur',
]);
/** Dropped with everything inside them. */
const DROP = new Set(['metadata', 'desc', 'title']);

const PAINT = ['fill', 'fill-rule', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-dasharray', 'stroke-dashoffset',
  'opacity', 'clip-rule', 'stop-color', 'stop-opacity', 'clip-path', 'mask', 'transform', 'mask-type'];
const ATTRS = new Set([
  ...PAINT,
  'xmlns', 'viewBox', 'width', 'height', 'version', 'id', 'class', 'preserveAspectRatio',
  'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'points',
  'offset', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'clipPathUnits',
  'maskUnits', 'maskContentUnits', 'overflow',
  'filter', 'filterUnits', 'primitiveUnits', 'color-interpolation-filters', 'stdDeviation', 'in', 'result', 'edgeMode',
  'role', 'aria-label', 'aria-hidden', 'focusable',
]);
/** Style properties that may move from a class rule or style="" onto an attribute. */
const STYLE_PROPS = new Set(PAINT);

/** Editor and exporter leftovers with no effect on the drawing: dropped. (`clipPath` as an
 *  attribute isn't valid SVG, so browsers ignore it; the clip-path attribute is the real one.) */
const NS_NOISE = /^(sodipodi:|inkscape:|xmlns:(sodipodi|inkscape|dc|cc|rdf|svg|xlink|serif|sketch|figma)$|serif:|sketch:|data-name$|xml:space$|enable-background$|style-ignored$|jetway-hooks?(-id)?$|clipPath$)/;

/** The only functions a value may call: colors, transforms and a same-file url(#id). */
const FUNCTIONS = new Set(['url', 'rgb', 'rgba', 'hsl', 'hsla', 'matrix', 'translate', 'scale', 'rotate', 'skewx', 'skewy']);

const bad = (why) => { throw new Error(why); };

/** The canonical value check. admin.openmined.org's svg-allowlist.ts copies this function. */
function checkValue(name, value) {
  const v = value.trim();
  if (/javascript:|data:|vbscript:/i.test(v)) bad(`${name} has a script or data URI`);
  if (/&/.test(v)) bad(`${name} has an entity or character reference`);
  if (/[<>"`']/.test(v)) bad(`${name} has markup characters or a quote`);
  // Escapes and comments could hide a function name or a URL from the checks below.
  if (/\\/.test(v)) bad(`${name} has a CSS escape`);
  if (/\/\*|\*\//.test(v)) bad(`${name} has a CSS comment`);
  if (/[^\t\n\r\x20-\x7e]/.test(v)) bad(`${name} has a character outside printable ASCII`);
  // Every function call must be on the allowlist; a bare "(" (no name in front) is refused too.
  for (const f of v.matchAll(/([A-Za-z-]*)\s*\(/g)) {
    if (!FUNCTIONS.has(f[1].toLowerCase())) bad(`${name} uses ${f[1] || 'a bare'}() which isn't allowed`);
  }
  if (/url\s*\(/i.test(v) && !/^url\(#[\w.:-]+\)$/.test(v)) bad(`${name} has url() pointing outside the file`);
  if (/expression|@import/i.test(v)) bad(`${name} has CSS that isn't a plain value`);
  return v;
}

/** `.a{fill:#123;stroke:none}` rules → { a: {fill: '#123', stroke: 'none'} }. Anything else throws. */
function parseClassStyles(css) {
  const rules = {};
  const body = css.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let used = 0;
  for (const m of body.matchAll(re)) {
    used += m[0].length;
    const selectors = m[1].split(',').map((s) => s.trim());
    for (const sel of selectors) if (!/^\.[\w-]+$/.test(sel)) bad(`<style> has a selector that isn't a single class: ${sel}`);
    const decls = parseDecls(m[2], '<style>');
    for (const sel of selectors) Object.assign((rules[sel.slice(1)] ||= {}), decls);
  }
  if (body.replace(re, '').trim()) bad('<style> has something other than class rules');
  return rules;
}

function parseDecls(text, where) {
  const out = {};
  for (const part of text.split(';')) {
    if (!part.trim()) continue;
    const i = part.indexOf(':');
    if (i < 0) bad(`${where} has a malformed declaration`);
    const prop = part.slice(0, i).trim().toLowerCase();
    const val = part.slice(i + 1).trim();
    if ((prop === 'isolation' && val === 'isolate') || (prop === 'mix-blend-mode' && val === 'normal') || prop === 'enable-background') continue;
    if (!STYLE_PROPS.has(prop)) bad(`${where} sets ${prop}, which isn't allowed`);
    out[prop] = checkValue(`${where} ${prop}`, val);
  }
  return out;
}

const TOKEN = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<![\s\S]*?>|<\/?[^>]*>|[^<]+/g;
const TAG = /^<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>$/;
const ATTR = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

/** Clean an SVG by the allowlist. Returns the rebuilt file, or throws with the reason. */
export function sanitizeSvg(input) {
  const src = String(input);
  if (Buffer.byteLength(src, 'utf8') > MAX_BYTES) bad(`it is over ${MAX_BYTES / 1024} KB`);

  // First pass: collect <style> class rules (they apply to elements anywhere in the file).
  let classes = {};
  for (const m of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    const css = m[1].replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, '');
    for (const [k, v] of Object.entries(parseClassStyles(css))) Object.assign((classes[k] ||= {}), v);
  }

  const out = [];
  const stack = [];
  let dropping = 0;
  let sawRoot = false;
  const tokens = src.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '').match(TOKEN) || [];
  for (const tok of tokens) {
    if (tok.startsWith('<!--')) continue;
    if (tok.startsWith('<?')) { if (/^<\?xml\s/.test(tok) && !sawRoot) continue; bad('it has a processing instruction'); }
    if (tok.startsWith('<!')) bad(/DOCTYPE|ENTITY/i.test(tok) ? 'it has a DOCTYPE or entity declaration' : 'it has CDATA or a declaration');
    if (!tok.startsWith('<')) {
      if (dropping) continue;
      if (tok.trim()) bad('it has text content');
      continue;
    }
    const m = tok.match(TAG);
    if (!m) bad(`it has a tag that can't be read: ${tok.slice(0, 40)}`);
    const [, closing, rawName, attrText, selfClose] = m;
    const name = rawName;
    const local = name.includes(':') ? name.split(':')[0] : null;
    if (closing) {
      if (dropping) { if (stack.pop() === name) dropping--; continue; }
      const open = stack.pop();
      if (open !== name) bad(`tags don't match: </${name}> closes <${open}>`);
      if (open !== null) out.push(`</${name}>`);
      continue;
    }
    if (dropping) { if (!selfClose) { stack.push(name); dropping++; } continue; }
    if (DROP.has(name) || local === 'sodipodi' || local === 'inkscape' || local === 'rdf') {
      if (!selfClose) { stack.push(name); dropping++; }
      continue;
    }
    if (!ELEMENTS.has(name)) bad(`it has a <${name}> element, which isn't allowed`);
    if (!sawRoot && name !== 'svg') bad('the root element isn\'t <svg>');
    sawRoot = true;

    const attrs = new Map();
    let classList = [];
    let style = {};
    for (const a of attrText.matchAll(ATTR)) {
      const an = a[1];
      const av = a[2] ?? a[3] ?? '';
      if (/^on/i.test(an)) bad(`<${name}> has an event attribute (${an})`);
      if (/href$/i.test(an)) {
        // A gradient may inherit another gradient in the same file (href="#id"); no other link.
        if (!/^(linearGradient|radialGradient)$/.test(name) || !/^#[\w.:-]+$/.test(av.trim())) bad(`<${name}> has a link (${an})`);
        attrs.set('href', av.trim());
        continue;
      }
      if (an === 'xmlns:xlink') continue;
      if (NS_NOISE.test(an)) continue;
      if (an === 'style') { style = parseDecls(av, `<${name}> style`); continue; }
      if (an === 'class') { classList = av.trim().split(/\s+/).filter(Boolean); continue; }
      if (!ATTRS.has(an)) bad(`<${name}> has a ${an} attribute, which isn't allowed`);
      if (an === 'xmlns' && av !== 'http://www.w3.org/2000/svg') bad('the SVG namespace is wrong');
      attrs.set(an, checkValue(`<${name}> ${an}`, av));
    }
    // CSS order: presentation attributes, then class rules, then style="" win.
    const merged = new Map(attrs);
    for (const c of classList) for (const [k, v] of Object.entries(classes[c] || {})) merged.set(k, v);
    for (const [k, v] of Object.entries(style)) merged.set(k, v);
    if (name === 'svg' && !merged.has('xmlns')) merged.set('xmlns', 'http://www.w3.org/2000/svg');
    const attrOut = [...merged].map(([k, v]) => ` ${k}="${v}"`).join('');
    out.push(`<${name}${attrOut}${selfClose ? '/' : ''}>`);
    if (!selfClose) stack.push(name);
  }
  if (!sawRoot) bad('it has no <svg> element');
  if (stack.length) bad('it has unclosed tags');
  return out.join('') + '\n';
}
