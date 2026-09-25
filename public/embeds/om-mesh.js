/**
 * OMDS — <om-mesh> portable brand embed
 * ════════════════════════════════════════════════════════════════════
 * The animated gradient map: the site's CTA field (openmined.org
 * /images/cta-gradient-bg.png) rebuilt as a live WebGL mesh. Eight color
 * points ring the box in spectrum order — gold top, orange top-left, red
 * and violet down the left, blue and teal along the bottom, green and lime
 * up the right — and blend toward a mixed center, exactly as the raster
 * does. Each point drifts on its own noise track, the field warps with the
 * same simplex flow as <om-stream>, and the cursor pulls it gently.
 *
 *   <script type="module" src="https://design.openmined.org/embeds/om-mesh.js"></script>
 *   <om-mesh style="position:absolute; inset:0"></om-mesh>
 *
 * Attributes (all optional):
 *   colors="#f8c073,#f79763,…"     eight hex stops, spectrum order (gold, orange,
 *                                  red, violet, blue, teal, green, lime); fewer
 *                                  are resampled to eight
 *   speed="1"                      animation speed multiplier, 0–3
 *   depth="0"                      0–1, off by default. Colors pass over and
 *                                  under each other: near ones cover far ones,
 *                                  far ones recede into `haze`
 *   sheen="0"                      0–1, off by default. The depth read as a
 *                                  rolling surface lit from the top left; only
 *                                  ever lightens
 *   haze="#f5f4f7"                 the ground far colors fall back toward —
 *                                  the page background, so it flips with the mode
 *   mode="smooth"                  smooth | overlap | layers | clouds. Overlap:
 *                                  each color claims territory and pushes into
 *                                  its neighbors along moving borders. Layers:
 *                                  soft-edged color shapes layered by a changing
 *                                  depth. Clouds: layers whose edges are crisp
 *                                  in places and fading in others, and whose
 *                                  opacity breathes — covering or mixing
 *   edge="0.5"                     0–1, how crisp the borders are (crisp parts
 *                                  only, in clouds)
 *   drift="0.22"                   0–0.4, how far each color wanders from home
 *   flow="0.13"                    0–0.3, the simplex flow warp (as <om-stream>)
 *   size="1"                       0.5–1.8, shape size (layers, clouds)
 *   cover="4"                      0–12, how firmly a nearer shape wins where
 *                                  shapes overlap: low mixes, high covers
 *   soft="0.5"                     0–1, share of each cloud edge that fades
 *   billow="1"                     0–3, how rippled cloud edges are
 *   opacity="0.55"                 0–0.96, a cloud's thinnest opacity (clouds)
 *
 * Every attribute can change at any time; the field updates live. Size it with CSS: it fills its box, and the field stretches
 * with it, like the raster did.
 * Reduced-motion visitors get one still frame.
 * ════════════════════════════════════════════════════════════════════
 */

import { PALETTE, resample } from './brand-colors.js';

const P = PALETTE;
const DEFAULT = [P.gold, P.orange, P.red, P.violet, P.blue, P.teal, P.green, P.lime];
const DEFAULT_DEPTH = 0;
const DEFAULT_SHEEN = 0;
const DEFAULT_HAZE = '#f5f4f7'; // far colors recede toward this; set it to the page ground
const MODES = { smooth: 0, overlap: 1, layers: 2, clouds: 3 };
// Every tunable number: attribute, range, default, and the uniform it feeds
// (speed has none — it scales the clock). Exposed on the element class
// (OmMesh.PARAMS) so a tuning panel can build its sliders from the same table.
const PARAMS = {
  speed:   { min: 0,   max: 3,    def: 1,    u: null },
  edge:    { min: 0,   max: 1,    def: 0.5,  u: 'uEdge' },
  drift:   { min: 0,   max: 0.4,  def: 0.22, u: 'uDrift' },
  flow:    { min: 0,   max: 0.3,  def: 0.13, u: 'uWarp' },
  size:    { min: 0.5, max: 1.8,  def: 1,    u: 'uSize' },
  cover:   { min: 0,   max: 12,   def: 4,    u: 'uCover' },
  soft:    { min: 0,   max: 1,    def: 0.5,  u: 'uSoft' },
  billow:  { min: 0,   max: 3,    def: 1,    u: 'uBillow' },
  opacity: { min: 0,   max: 0.96, def: 0.55, u: 'uOpMin' },
};

const VS_SOURCE = [
  'attribute vec2 aPos;',
  'varying vec2 vUV;',
  'void main() { vUV = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }',
].join('\n');

const FS_SOURCE = [
  'precision highp float;',
  'varying vec2 vUV;',
  'uniform float uTime; uniform vec2 uMouse; uniform float uMouseStr;',
  'uniform vec3 uColors[8];',
  'uniform float uDepth, uSheen; uniform vec3 uHaze;',
  'uniform float uMode, uEdge;',
  'uniform float uDrift, uWarp, uSize, uCover, uSoft, uBillow, uOpMin;',
  // Point homes, read off the raster (y up). Spectrum order, matching uColors.
  'const float spread   = 0.25;',   // shape size for layers and clouds (the field uses reach())
  'const float driftSpd = 0.16;',
  'const float warpSpd  = 0.14;',
  'const float pullStr  = 0.18;',   // cursor pull
  'vec3 mod289v3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }',
  'vec2 mod289v2(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }',
  'vec3 permute(vec3 x){ return mod289v3(((x*34.0)+10.0)*x); }',
  'float snoise(vec2 v){',
  '  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
  '  vec2 i = floor(v + dot(v, C.yy));',
  '  vec2 x0 = v - i + dot(i, C.xx);',
  '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);',
  '  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;',
  '  i = mod289v2(i);',
  '  vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));',
  '  vec3 m = max(0.5 - vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)), 0.0);',
  '  m = m*m; m = m*m;',
  '  vec3 x = 2.0*fract(p*C.www) - 1.0;',
  '  vec3 h = abs(x) - 0.5;',
  '  vec3 ox = floor(x + 0.5);',
  '  vec3 a0 = x - ox;',
  '  m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);',
  '  vec3 g; g.x = a0.x*x0.x + h.x*x0.y; g.yz = a0.yz*x12.xz + h.yz*x12.yw;',
  '  return 130.0 * dot(m, g);',
  '}',
  // Point homes and reach, fitted to the site's gradient raster (2026-09-25):
  // the placement that best reproduces its color distribution with the
  // palette's own stops (mean ΔE .052 → .023 frozen). Some sit just outside
  // the box, so a color reaches in from the edge as the raster's do.
  'vec2 home(int i) {',
  '  if (i == 0) return vec2(0.71, 1.07);', // gold
  '  if (i == 1) return vec2(0.03, 1.18);', // orange
  '  if (i == 2) return vec2(0.06, 0.39);', // red
  '  if (i == 3) return vec2(-0.05, -0.09);', // violet
  '  if (i == 4) return vec2(0.06, -0.03);', // blue
  '  if (i == 5) return vec2(0.53, -0.11);', // teal
  '  if (i == 6) return vec2(0.61, -0.25);', // green
  '  return vec2(1.12, 0.48);', // lime
  '}',
  'float reach(int i) {',
  '  if (i == 0) return 0.30;', // gold
  '  if (i == 1) return 0.10;', // orange
  '  if (i == 2) return 0.24;', // red
  '  if (i == 3) return 0.11;', // violet
  '  if (i == 4) return 0.24;', // blue
  '  if (i == 5) return 0.21;', // teal
  '  if (i == 6) return 0.25;', // green
  '  return 0.26;', // lime
  '}',
  // Depth: each point gets a z that drifts over time. Near points (z > 0)
  // take over and cover far ones instead of averaging with them.
  'const float zSpd     = 0.11;',
  'const float zPush    = 2.6;',    // how strongly near covers far, at depth 1
  'const float hazeAmt  = 0.30;',   // far colors fall back toward the page ground
  'const float lift     = 0.10;',   // near colors come forward a little brighter
  // Sheen: a rolling surface lit from the top left — the points' depth,
  // blurred wide so it swells rather than creasing at color seams, plus a
  // slow swell of its own. Only ever lightens: dark shading muddies a gradient.
  'const vec3  lightDir = vec3(-0.45, 0.55, 0.70);',
  'const float relief   = 0.35;',   // surface steepness
  'const float gloss    = 0.38;',   // sheen strength, at sheen 1
  'vec2 C[8]; float Z[8];',
  // Color (rgb) and depth (a) of the field at p. Points are placed once per
  // pixel in main; the sheen samples this three times to find the slope.
  'vec4 field(vec2 p) {',
  '  vec3 acc = vec3(0.0); float zacc = 0.0; float wsum = 0.0;',
  '  float sharp = 1.0 + uDepth * 1.2;',
  '  for (int i = 0; i < 8; i++) {',
  '    vec2 d = p - C[i];',
  '    float rc = reach(i);',
  '    float w = exp(-dot(d, d) * sharp / (2.0 * rc * rc) + Z[i] * zPush * uDepth);',
  '    acc += uColors[i] * w; zacc += Z[i] * w; wsum += w;',
  '  }',
  '  wsum = max(wsum, 1e-5);',
  '  return vec4(acc / wsum, zacc / wsum);',
  '}',
  'float height(vec2 p, float t) {',
  '  float zacc = 0.0; float wsum = 0.0;',
  '  for (int i = 0; i < 8; i++) {',
  '    vec2 d = p - C[i];',
  '    float w = exp(-dot(d, d) / (2.0 * 0.45 * 0.45));',
  '    zacc += Z[i] * w; wsum += w;',
  '  }',
  '  return zacc / max(wsum, 1e-5) + 0.6 * snoise(p * 1.6 + vec2(t * 0.09, -t * 0.06));',
  '}',
  // Mode 1, overlap: each point claims territory and pushes into its
  // neighbours. A sharpened softmax of the same weights — a power diagram
  // whose borders move as each point's z swells and recedes. Regions keep a
  // little of the smooth field inside, so they are not flat fills.
  'vec3 overlapField(vec2 p, vec3 base) {',
  '  float sharp = mix(2.0, 26.0, uEdge);',
  '  float lw[8]; float mx = -1e9;',
  '  for (int i = 0; i < 8; i++) {',
  '    vec2 d = p - C[i];',
  '    float rc = reach(i);',
  '    lw[i] = (-dot(d, d) / (2.0 * rc * rc) + Z[i] * 0.9) * sharp;',
  '    mx = max(mx, lw[i]);',
  '  }',
  '  vec3 acc = vec3(0.0); float wsum = 0.0;',
  '  for (int i = 0; i < 8; i++) {',
  '    float w = exp(lw[i] - mx);',
  '    acc += uColors[i] * w; wsum += w;',
  '  }',
  '  return mix(acc / wsum, base, 0.3);',
  '}',
  // Shapes over the smooth field, composited WITHOUT a strict stacking order
  // (weighted blended order-independent transparency, McGuire & Bavoil 2013).
  // A ranked back-to-front stack swaps two shapes in a single frame when their
  // z values cross, so an overlap visibly pops. Here each shape's color is
  // weighted by exp(cover · z): where shapes overlap, the nearer dominates
  // in proportion to how much nearer it is, and a crossing passes smoothly
  // through an even mix. Coverage is order-independent by construction.
  'vec3 composite(vec3 base, vec3 cs[8], float al[8]) {',
  '  vec3 acc = vec3(0.0); float wsum = 0.0; float clear = 1.0;',
  '  for (int i = 0; i < 8; i++) {',
  '    float w = al[i] * exp(uCover * Z[i]);',
  '    acc += cs[i] * w; wsum += w; clear *= 1.0 - al[i];',
  '  }',
  '  vec3 over = wsum > 1e-5 ? acc / wsum : base;',
  '  return mix(over, base, clear);',
  '}',
  // Mode 2, layers: each point is a soft-edged shape; near shapes grow a
  // little, and one color visibly passes over another.
  'vec3 layerField(vec2 p, vec3 base) {',
  '  float ew = mix(0.22, 0.012, uEdge);',
  '  vec3 cs[8]; float al[8];',
  '  for (int i = 0; i < 8; i++) {',
  '    float R = spread * 1.25 * uSize * (1.0 + 0.3 * Z[i]);',
  '    al[i] = (1.0 - smoothstep(R - ew, R + ew, length(p - C[i]))) * 0.88;',
  '    cs[i] = mix(uColors[i], base, 0.18);',
  '  }',
  '  return composite(base, cs, al);',
  '}',
  // Mode 3, clouds: layers whose character varies. Along each shape's
  // boundary a slow noise decides where the edge is crisp and where it fades
  // (Edge sets how crisp "crisp" is); each cloud's opacity breathes, so it
  // sometimes covers what is beneath and sometimes mixes with it; and the
  // boundaries billow rather than run as smooth curves.
  'vec3 cloudField(vec2 p, vec3 base, float t) {',
  '  float crispW = mix(0.08, 0.004, uEdge);',
  '  vec3 cs[8]; float al[8];',
  '  for (int i = 0; i < 8; i++) {',
  '    float fi = float(i) * 3.17;',
  // soft share: where the threshold sits on the noise decides how much of
  // each edge fades (1) versus stays crisp (0).
  '    float sc = mix(0.85, -0.85, uSoft);',
  '    float soft = smoothstep(sc - 0.4, sc + 0.4, snoise(p * 1.6 + vec2(fi * 2.3, t * 0.16)));',
  '    float ew = mix(crispW, 0.26, soft);',
  '    float billow = uBillow * (0.055 * snoise(p * 3.2 + vec2(t * 0.22, fi))',
  '                           + 0.025 * snoise(p * 6.5 - vec2(fi, t * 0.3)));',
  '    float R = spread * 1.2 * uSize * (1.0 + 0.3 * Z[i]);',
  '    float a = 1.0 - smoothstep(R - ew, R + ew, length(p - C[i]) + billow);',
  '    float op = mix(uOpMin, 0.96, 0.5 + 0.5 * snoise(vec2(fi + 13.0, t * 0.12)));',
  '    al[i] = a * op;',
  '    cs[i] = mix(uColors[i], base, 0.15);',
  '  }',
  '  return composite(base, cs, al);',
  '}',
  'void main() {',
  '  float t = uTime;',
  '  vec2 p = vUV;',
  // Two octaves: a broad swell, and a finer layer that travels, as the stream flows.
  '  p += uWarp * vec2(snoise(p * 1.3 + vec2(0.0,  t * warpSpd)),',
  '                      snoise(p * 1.3 + vec2(7.3, -t * warpSpd)));',
  '  p += uWarp * 0.45 * vec2(snoise(p * 3.1 + vec2(-t * warpSpd * 1.6, 3.0)),',
  '                             snoise(p * 3.1 + vec2(11.0, t * warpSpd * 1.3)));',
  '  vec2 md = p - uMouse;',
  '  p -= md * pullStr * exp(-dot(md, md) / 0.06) * uMouseStr;',
  '  for (int i = 0; i < 8; i++) {',
  '    float fi = float(i) * 3.17;',
  '    C[i] = home(i) + uDrift * vec2(snoise(vec2(fi, t * driftSpd)),',
  '                                  snoise(vec2(fi + 41.0, t * driftSpd)));',
  '    Z[i] = snoise(vec2(fi + 90.0, t * zSpd));',
  '  }',
  '  vec4 f = field(p);',
  '  vec3 color = f.rgb;',
  '  float z = f.a;',
  '  if (uMode > 2.5) color = cloudField(p, color, t);',
  '  else if (uMode > 1.5) color = layerField(p, color);',
  '  else if (uMode > 0.5) color = overlapField(p, color);',
  // Atmosphere: far recedes into the ground, near steps forward.
  '  color = mix(color, uHaze, uDepth * hazeAmt * clamp(0.5 - 0.5 * z, 0.0, 1.0));',
  '  color = mix(color, vec3(1.0), uDepth * lift * max(z, 0.0));',
  '  if (uSheen > 0.0) {',
  '    const float e = 0.01;',
  '    float h0 = height(p, t);',
  '    float hx = height(p + vec2(e, 0.0), t) - h0;',
  '    float hy = height(p + vec2(0.0, e), t) - h0;',
  '    vec3 n = normalize(vec3(-hx / e * relief, -hy / e * relief, 1.0));',
  '    vec3 L = normalize(lightDir);',
  '    float facing = max(dot(n, L) - L.z, 0.0);',
  '    color = mix(color, vec3(1.0), uSheen * gloss * smoothstep(0.0, 0.45, facing));',
  '  }',
  // Dither: a smooth 8-bit field bands without it.
  '  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);',
  '  color += (n - 0.5) / 255.0;',
  '  gl_FragColor = vec4(color, 1.0);',
  '}',
].join('\n');

// Flat vec3[8] upload, so a `colors` change repaints without a recompile.
function toStops(hexes) {
  const out = new Float32Array(24);
  resample(hexes, 8).forEach((hex, i) => {
    const h = hex.replace('#', '');
    for (let c = 0; c < 3; c++) out[i * 3 + c] = parseInt(h.substring(c * 2, c * 2 + 2), 16) / 255;
  });
  return out;
}

function createShader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('om-mesh shader error:', gl.getShaderInfoLog(s));
    gl.deleteShader(s); return null;
  }
  return s;
}

class OmMesh extends HTMLElement {
  // The parameter table, readable by pages without importing the module:
  // customElements.get('om-mesh').PARAMS
  static PARAMS = PARAMS;

  static get observedAttributes() { return ['colors', 'depth', 'sheen', 'haze', 'mode', ...Object.keys(PARAMS)]; }

  attributeChangedCallback() {
    if (!this._booted) return;
    this._readAttrs();
    if (!this._rafId) this._drawFrame();
  }

  _readAttrs() {
    this._stops = this._readStops();
    const num = (name, d) => { const v = parseFloat(this.getAttribute(name)); return Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : d; };
    this._depth = num('depth', DEFAULT_DEPTH);
    this._sheen = num('sheen', DEFAULT_SHEEN);
    this._haze = toStops([this.getAttribute('haze') || DEFAULT_HAZE]).subarray(0, 3);
    this._mode = MODES[this.getAttribute('mode')] ?? 0;
    this._p = {};
    for (const [k, d] of Object.entries(PARAMS)) {
      const v = parseFloat(this.getAttribute(k));
      this._p[k] = Number.isFinite(v) ? Math.min(Math.max(v, d.min), d.max) : d.def;
    }
    this._speed = this._p.speed;
  }

  _readStops() {
    const attr = this.getAttribute('colors');
    const hexes = attr ? attr.split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT;
    return toStops(hexes.length ? hexes : DEFAULT);
  }

  connectedCallback() {
    if (this._booted) return;
    this._booted = true;

    this._readAttrs();
    this._static = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    this._mx = 0.5; this._my = 0.5; this._smx = 0.5; this._smy = 0.5;
    this._mouseStr = 0; this._tMouseStr = 0;
    this._visible = true; this._rafId = null; this._elapsed = 0; this._lastTs = null;

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML =
      '<style>:host{display:block;position:relative;overflow:hidden}' +
      'canvas{position:absolute;inset:0;display:block;width:100%;height:100%}</style>' +
      '<canvas></canvas>';
    this._canvas = root.querySelector('canvas');

    this._initGL();
    this._bindEvents();
    this._ro = new ResizeObserver(() => this._applySize());
    this._ro.observe(this);
    this._applySize();
    this._start();
  }

  disconnectedCallback() {
    this._destroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._io) this._io.disconnect();
    if (this._ro) this._ro.disconnect();
    if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
    if (this._onMove) document.removeEventListener('mousemove', this._onMove);
    if (this._gl && this._prog) this._gl.deleteProgram(this._prog);
  }

  _initGL() {
    const gl = this._canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { console.error('om-mesh: WebGL not supported'); return; }
    const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('om-mesh link error:', gl.getProgramInfoLog(prog)); return;
    }
    gl.useProgram(prog);
    this._gl = gl; this._prog = prog;

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this._u = {
      time: gl.getUniformLocation(prog, 'uTime'),
      mouse: gl.getUniformLocation(prog, 'uMouse'),
      mouseStr: gl.getUniformLocation(prog, 'uMouseStr'),
      colors: gl.getUniformLocation(prog, 'uColors'),
      depth: gl.getUniformLocation(prog, 'uDepth'),
      sheen: gl.getUniformLocation(prog, 'uSheen'),
      haze: gl.getUniformLocation(prog, 'uHaze'),
      mode: gl.getUniformLocation(prog, 'uMode'),
      params: Object.entries(PARAMS).filter(([, d]) => d.u).map(([k, d]) => [k, gl.getUniformLocation(prog, d.u)]),
    };
  }

  // The field is soft, so it renders at up to 1× CSS pixels regardless of DPR.
  _applySize() {
    if (this._destroyed || !this._gl) return;
    const r = this.getBoundingClientRect();
    this._canvas.width = Math.max(1, Math.round(r.width));
    this._canvas.height = Math.max(1, Math.round(r.height));
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    this._drawFrame();
  }

  _bindEvents() {
    if (this._static) return;
    const FALLOFF_PX = 300;
    this._onMove = (e) => {
      const r = this.getBoundingClientRect();
      this._mx = (e.clientX - r.left) / r.width;
      this._my = 1.0 - (e.clientY - r.top) / r.height;
      const outside = Math.max(0, r.top - e.clientY, e.clientY - r.bottom, r.left - e.clientX, e.clientX - r.right);
      this._tMouseStr = Math.max(0, 1 - outside / FALLOFF_PX);
    };
    document.addEventListener('mousemove', this._onMove, { passive: true });
  }

  _drawFrame() {
    if (this._destroyed || !this._gl) return;
    const gl = this._gl, u = this._u;
    this._mouseStr += (this._tMouseStr - this._mouseStr) * 0.04;
    this._smx += (this._mx - this._smx) * 0.05;
    this._smy += (this._my - this._smy) * 0.05;
    gl.uniform1f(u.time, this._elapsed);
    gl.uniform2f(u.mouse, this._smx, this._smy);
    gl.uniform1f(u.mouseStr, this._mouseStr);
    gl.uniform3fv(u.colors, this._stops);
    gl.uniform1f(u.depth, this._depth);
    gl.uniform1f(u.sheen, this._sheen);
    gl.uniform3fv(u.haze, this._haze);
    gl.uniform1f(u.mode, this._mode);
    for (const [k, loc] of u.params) gl.uniform1f(loc, this._p[k]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  _start() {
    if (this._static) { this._drawFrame(); return; }

    const loop = (ts) => {
      if (this._destroyed || !this._gl) return;
      if (!this._visible || document.hidden) { this._rafId = null; return; }
      if (this._lastTs !== null) this._elapsed += ((ts - this._lastTs) / 1000) * this._speed;
      this._lastTs = ts;
      this._drawFrame();
      this._rafId = requestAnimationFrame(loop);
    };
    const resume = () => {
      if (!this._rafId && !this._destroyed) { this._lastTs = null; this._rafId = requestAnimationFrame(loop); }
    };

    this._io = new IntersectionObserver((entries) => {
      this._visible = entries[0].isIntersecting;
      if (this._visible) resume();
    }, { threshold: 0 });
    this._io.observe(this);

    this._onVisibility = () => { if (!document.hidden) resume(); };
    document.addEventListener('visibilitychange', this._onVisibility);

    resume();
  }
}

if (!customElements.get('om-mesh')) customElements.define('om-mesh', OmMesh);
