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
 *   speed="1"                      animation speed multiplier
 *   depth="0"                      0–1, off by default. Colors pass over and
 *                                  under each other: near ones cover far ones,
 *                                  far ones recede into `haze`
 *   sheen="0"                      0–1, off by default. The depth read as a
 *                                  rolling surface lit from the top left; only
 *                                  ever lightens
 *   haze="#f5f4f7"                 the ground far colors fall back toward —
 *                                  the page background, so it flips with the mode
 *
 * `colors`, `depth`, `sheen` and `haze` can change at any time; the field
 * updates live. Size it with CSS: it fills its box, and the field stretches
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
  // Point homes, read off the raster (y up). Spectrum order, matching uColors.
  'const float spread   = 0.25;',   // blend radius — how far each color reaches
  'const float drift    = 0.22;',   // how far a point wanders from home
  'const float driftSpd = 0.16;',
  'const float warpAmp  = 0.13;',   // simplex flow, as <om-stream>
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
  'vec2 home(int i) {',
  '  if (i == 0) return vec2(0.56, 0.99);', // gold
  '  if (i == 1) return vec2(0.02, 0.98);', // orange
  '  if (i == 2) return vec2(0.03, 0.55);', // red
  '  if (i == 3) return vec2(0.08, 0.14);', // violet
  '  if (i == 4) return vec2(0.26, 0.00);', // blue
  '  if (i == 5) return vec2(0.72, 0.00);', // teal
  '  if (i == 6) return vec2(0.98, 0.22);', // green
  '  return vec2(1.00, 0.70);',             // lime
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
  '    float w = exp(-dot(d, d) * sharp / (2.0 * spread * spread) + Z[i] * zPush * uDepth);',
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
  'void main() {',
  '  float t = uTime;',
  '  vec2 p = vUV;',
  // Two octaves: a broad swell, and a finer layer that travels, as the stream flows.
  '  p += warpAmp * vec2(snoise(p * 1.3 + vec2(0.0,  t * warpSpd)),',
  '                      snoise(p * 1.3 + vec2(7.3, -t * warpSpd)));',
  '  p += warpAmp * 0.45 * vec2(snoise(p * 3.1 + vec2(-t * warpSpd * 1.6, 3.0)),',
  '                             snoise(p * 3.1 + vec2(11.0, t * warpSpd * 1.3)));',
  '  vec2 md = p - uMouse;',
  '  p -= md * pullStr * exp(-dot(md, md) / 0.06) * uMouseStr;',
  '  for (int i = 0; i < 8; i++) {',
  '    float fi = float(i) * 3.17;',
  '    C[i] = home(i) + drift * vec2(snoise(vec2(fi, t * driftSpd)),',
  '                                  snoise(vec2(fi + 41.0, t * driftSpd)));',
  '    Z[i] = snoise(vec2(fi + 90.0, t * zSpd));',
  '  }',
  '  vec4 f = field(p);',
  '  vec3 color = f.rgb;',
  '  float z = f.a;',
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
  static get observedAttributes() { return ['colors', 'depth', 'sheen', 'haze']; }

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
    const sp = parseFloat(this.getAttribute('speed'));
    this._speed = Number.isFinite(sp) ? sp : 1;
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
