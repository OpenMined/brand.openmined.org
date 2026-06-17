/**
 * OMDS — <om-stream> portable brand embed
 * ════════════════════════════════════════════════════════════════════
 * A framework-agnostic WebGL ribbon rendered in the brand gradient.
 * Drop it on any page:
 *
 *   <script type="module" src="https://design.openmined.org/embeds/om-stream.js"></script>
 *   <om-stream></om-stream>
 *
 * Attributes (all optional):
 *   gradient="stream"              named gradient from brand-colors.js (resampled to 6 stops)
 *   colors="#b73d56,#f8c073,…"     explicit hex stops (overrides gradient)
 *   aspect-ratio="2.42"            box aspect ratio
 *   crop-top="0.28"                fraction trimmed off the top
 *   crop-bottom="0.01"             fraction trimmed off the bottom
 *   rot-speed="0"                  gradient rotation speed
 *   rot-axis="along"               along | across | spiral
 *
 * Each element is independent and cleans itself up on removal. Colors come
 * from brand-colors.js — never hand-typed here.
 * ════════════════════════════════════════════════════════════════════
 */

import { resolveGradient, resample } from './brand-colors.js';

const VS_SOURCE = [
  'attribute vec2 aPos;',
  'varying vec2 vUV;',
  'void main() { vUV = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }',
].join('\n');

const FS_TEMPLATE = [
  'precision highp float;',
  'varying vec2 vUV;',
  'uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;',
  'uniform float uMouseStr;',
  'uniform float uRotSpeed, uRotAlong, uRotAcross;',
  'const float clusters   = 2.0;',
  'const float alongMix   = 0.46;',
  'const float acrossMix  = 0.11;',
  'const float alphaPow   = 0.65;',
  'const float opacity    = 1.0;',
  'const float softness   = 0.69;',
  'const float outerSoft  = 0.84;',
  'const float sat        = 1.32;',
  'const float flowSpeed  = 0.119;',
  'const float colorNoise = 0.4;',
  'const float baseWidth  = 0.1;',
  'const float curveY1    = 0.72;',
  'const float curveY2    = 0.19;',
  'const float turb       = 0.67;',
  'const float attractStr = 0.04;',
  'const float rippleAmp  = 0.022;',
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
  'float bezier1D(float t, float p0, float p1, float p2, float p3) {',
  '  float u = 1.0 - t;',
  '  return u*u*u*p0 + 3.0*u*u*t*p1 + 3.0*u*t*t*p2 + t*t*t*p3;',
  '}',
  'float getCenterY(float x) {',
  '  float t = x;',
  '  for (int i = 0; i < 6; i++) {',
  '    float ex = bezier1D(t, -0.05, 0.30, 0.70, 1.05);',
  '    float dex = 3.0*(1.0-t)*(1.0-t)*0.35 + 6.0*(1.0-t)*t*0.40 + 3.0*t*t*0.35;',
  '    t -= (ex - x) / max(dex, 0.001);',
  '    t = clamp(t, 0.0, 1.0);',
  '  }',
  '  return bezier1D(t, 0.25, curveY1, curveY2, 0.32);',
  '}',
  'float getHalfWidth(float x) {',
  '  float sq = 1.0 - 0.55 * exp(-((x-0.45)*(x-0.45)) / 0.035);',
  '  return baseWidth * sq * (1.0 - 0.25 * x);',
  '}',
  'vec3 sampleGrad(float t) {',
  '  t = clamp(t, 0.0, 1.0);',
  '  vec3 colors[6];',
  '  colors[0] = {{G0}};',
  '  colors[1] = {{G1}};',
  '  colors[2] = {{G2}};',
  '  colors[3] = {{G3}};',
  '  colors[4] = {{G4}};',
  '  colors[5] = {{G5}};',
  '  float stops[6];',
  '  stops[0] = 0.000; stops[1] = 0.333; stops[2] = 0.500;',
  '  stops[3] = 0.667; stops[4] = 0.833; stops[5] = 1.000;',
  '  vec3 c = colors[0];',
  '  float pS = stops[0];',
  '  for (int i = 1; i < 6; i++) {',
  '    float s = stops[i];',
  '    float f = clamp((t - pS) / max(s - pS, 0.001), 0.0, 1.0);',
  '    c = mix(c, colors[i], f * step(pS, t));',
  '    pS = s;',
  '  }',
  '  return c;',
  '}',
  'void main() {',
  '  vec2 uv = vUV;',
  '  float aspect = uRes.x / uRes.y;',
  '  float x = uv.x, y = uv.y;',
  '  float flow = uTime * flowSpeed;',
  '  float centerNoise = snoise(vec2(x * 1.8 + 0.3 - flow, uTime * 0.10)) * 0.028 * turb',
  '                    + snoise(vec2(x * 4.5 + 5.0 - flow * 1.5, uTime * 0.14 + 3.0)) * 0.014 * turb;',
  '  float mdx = x - uMouse.x;',
  '  float bendY = (uMouse.y - getCenterY(x)) * attractStr * exp(-(mdx*mdx) / 0.03) * uMouseStr;',
  '  float mDistSq = (x-uMouse.x)*(x-uMouse.x) + (y-uMouse.y)*(y-uMouse.y);',
  '  float ripple = rippleAmp * exp(-mDistSq / 0.020) * snoise(vec2(x*10.0 - uTime*0.4, y*10.0)) * uMouseStr;',
  '  float ambient = snoise(vec2(x*8.0 - uTime*0.3, y*6.0 + uTime*0.15)) * 0.005 * turb',
  '                + snoise(vec2(x*12.0 + uTime*0.2, y*10.0 - uTime*0.1)) * 0.003 * turb;',
  '  float centerY = getCenterY(x) + centerNoise + bendY + ripple + ambient;',
  '  float hw = getHalfWidth(x);',
  '  hw += (snoise(vec2(x*3.0 + 10.0 - flow, uTime*0.12 + 7.0)) * 0.010',
  '       + snoise(vec2(x*6.0 - uTime*0.08 - flow*1.5, 20.0)) * 0.004) * turb;',
  '  hw = max(hw, 0.01);',
  '  float dist = (y - centerY) / hw;',
  '  float gauss = exp(-(dist*dist) / (2.0 * softness * softness));',
  '  float outerG = exp(-(dist*dist) / (2.0 * outerSoft * outerSoft));',
  '  float alpha = mix(outerG, gauss, 0.5);',
  '  float aN = snoise(vec2(x*5.0 - flow*1.5, y*5.0*aspect + uTime*0.03)) * 0.08;',
  '  alpha = clamp(alpha + aN * alpha, 0.0, 1.0);',
  '  alpha = pow(alpha, alphaPow);',
  '  alpha *= smoothstep(0.0, 0.03, alpha);',
  '  float vPos = clamp(dist * 0.5 + 0.5, 0.0, 1.0);',
  '  float vNoise = snoise(vec2(x*3.0 - flow*2.0 + 20.0, y*4.0*aspect - uTime*0.04)) * colorNoise;',
  '  vPos = clamp(vPos + vNoise, 0.0, 1.0);',
  '  float tAlong  = x * alongMix  + uTime * uRotSpeed * uRotAlong;',
  '  float tAcross = vPos * acrossMix + uTime * uRotSpeed * uRotAcross;',
  '  float gradT = (tAlong + tAcross) * clusters;',
  '  vec3 color = sampleGrad(gradT);',
  '  float lum = dot(color, vec3(0.299, 0.587, 0.114));',
  '  color = mix(vec3(lum), color, sat);',
  '  gl_FragColor = vec4(color * (alpha * opacity), alpha * opacity);',
  '}',
].join('\n');

function hexToVec3Literal(hex) {
  const h = hex.replace('#', '');
  const r = (parseInt(h.substring(0, 2), 16) / 255).toFixed(4);
  const g = (parseInt(h.substring(2, 4), 16) / 255).toFixed(4);
  const b = (parseInt(h.substring(4, 6), 16) / 255).toFixed(4);
  return 'vec3(' + r + ',' + g + ',' + b + ')';
}

function buildFSSource(gradient) {
  let src = FS_TEMPLATE;
  for (let i = 0; i < 6; i++) {
    src = src.replace('{{G' + i + '}}', hexToVec3Literal(gradient[i] || '#ffffff'));
  }
  return src;
}

function createShader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('om-stream shader error:', gl.getShaderInfoLog(s));
    gl.deleteShader(s); return null;
  }
  return s;
}

function numAttr(el, name, fallback) {
  const v = parseFloat(el.getAttribute(name));
  return Number.isFinite(v) ? v : fallback;
}

class OmStream extends HTMLElement {
  connectedCallback() {
    if (this._booted) return;
    this._booted = true;

    const colorsAttr = this.getAttribute('colors');
    const hexes = colorsAttr
      ? colorsAttr.split(',').map((s) => s.trim()).filter(Boolean)
      : resolveGradient(this.getAttribute('gradient') || 'stream');

    this._cfg = {
      aspectRatio: numAttr(this, 'aspect-ratio', 2.420),
      cropTop:     numAttr(this, 'crop-top', 0.28),
      cropBottom:  numAttr(this, 'crop-bottom', 0.01),
      rotSpeed:    numAttr(this, 'rot-speed', 0),
      rotAxis:     this.getAttribute('rot-axis') || 'along',
      gradient:    resample(hexes, 6),
    };

    this._mx = -9999; this._my = -9999; this._smx = -9999; this._smy = -9999;
    this._mouseActive = false; this._mouseStr = 0; this._tMouseStr = 0;
    this._visible = true; this._gl = null; this._prog = null; this._uniforms = {};
    this._rafId = null; this._ro = null; this._io = null; this._destroyed = false;
    this._elapsed = 0; this._lastTs = null;

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML =
      '<style>:host{position:relative;width:100%;overflow:hidden;display:block}' +
      '.se-inner{position:absolute;left:0;right:0}' +
      'canvas{display:block;width:100%;height:100%}</style>' +
      '<div class="se-inner"><canvas></canvas></div>';
    this._inner = root.querySelector('.se-inner');
    this._canvas = root.querySelector('canvas');

    this._applyCrop();
    this._initGL();
    this._bindEvents();
    this._initResize();
    this._start();
  }

  disconnectedCallback() {
    this._destroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._io) this._io.disconnect();
    if (this._ro) this._ro.disconnect();
    if (this._resizeFn) window.removeEventListener('resize', this._resizeFn);
    if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
    document.removeEventListener('mousemove', this._onMove);
    if (this._gl && this._prog) this._gl.deleteProgram(this._prog);
  }

  _applyCrop() {
    const ct = this._cfg.cropTop, cb = this._cfg.cropBottom, ar = this._cfg.aspectRatio;
    this.style.aspectRatio = String(ar);
    const scale = 1 / Math.max(1 - ct - cb, 0.01);
    this._inner.style.top = (-ct * 100 * scale).toFixed(3) + '%';
    this._inner.style.height = (100 * scale).toFixed(3) + '%';
  }

  _initGL() {
    const gl = this._canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) { console.error('om-stream: WebGL not supported'); return; }
    this._gl = gl;

    const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, buildFSSource(this._cfg.gradient));
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('om-stream link error:', gl.getProgramInfoLog(prog)); return;
    }
    gl.useProgram(prog);
    this._prog = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u = this._uniforms;
    u.time = gl.getUniformLocation(prog, 'uTime');
    u.res = gl.getUniformLocation(prog, 'uRes');
    u.mouse = gl.getUniformLocation(prog, 'uMouse');
    u.mouseStr = gl.getUniformLocation(prog, 'uMouseStr');
    u.rotSpeed = gl.getUniformLocation(prog, 'uRotSpeed');
    u.rotAlong = gl.getUniformLocation(prog, 'uRotAlong');
    u.rotAcross = gl.getUniformLocation(prog, 'uRotAcross');
  }

  _applySize() {
    if (this._destroyed || !this._gl) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this._inner.offsetWidth, h = this._inner.offsetHeight;
    this._canvas.width = Math.round(w * dpr);
    this._canvas.height = Math.round(h * dpr);
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    this._drawFrame();
  }

  _initResize() {
    this._applySize();
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(() => this._applySize());
      this._ro.observe(this._inner);
    } else {
      this._resizeFn = () => this._applySize();
      window.addEventListener('resize', this._resizeFn);
    }
  }

  _bindEvents() {
    const FALLOFF_PX = 500;
    this._onMove = (e) => {
      if (this._destroyed) return;
      this._mouseActive = true;
      const r = this._inner.getBoundingClientRect();
      this._mx = (e.clientX - r.left) / r.width;
      this._my = 1.0 - (e.clientY - r.top) / r.height;
      const cr = this.getBoundingClientRect();
      const above = cr.top - e.clientY;
      const below = e.clientY - cr.bottom;
      const outside = Math.max(0, above, below);
      this._tMouseStr = Math.max(0, 1 - outside / FALLOFF_PX);
    };
    document.addEventListener('mousemove', this._onMove, { passive: true });
  }

  _drawFrame() {
    if (this._destroyed || !this._gl) return;
    const t = this._elapsed;
    const gl = this._gl, u = this._uniforms;

    this._mouseStr += (this._tMouseStr - this._mouseStr) * 0.06;
    if (this._mouseActive) {
      this._smx += (this._mx - this._smx) * 0.08;
      this._smy += (this._my - this._smy) * 0.08;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.time, t);
    gl.uniform2f(u.res, this._canvas.width, this._canvas.height);
    gl.uniform2f(u.mouse, this._smx, this._smy);
    gl.uniform1f(u.mouseStr, this._mouseStr);
    const ra = this._cfg.rotAxis;
    gl.uniform1f(u.rotSpeed, this._cfg.rotSpeed);
    gl.uniform1f(u.rotAlong, (ra === 'along' || ra === 'spiral') ? 1.0 : 0.0);
    gl.uniform1f(u.rotAcross, (ra === 'across' || ra === 'spiral') ? 1.0 : 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  _start() {
    this._elapsed = 0;
    this._lastTs = null;

    const loop = (ts) => {
      if (this._destroyed || !this._gl) return;
      if (!this._visible || document.hidden) { this._rafId = null; return; }
      if (this._lastTs !== null) this._elapsed += (ts - this._lastTs) / 1000.0;
      this._lastTs = ts;
      this._drawFrame();
      this._rafId = requestAnimationFrame(loop);
    };

    if (window.IntersectionObserver) {
      this._io = new IntersectionObserver((entries) => {
        this._visible = entries[0].isIntersecting;
        if (this._visible && !this._rafId) { this._lastTs = null; this._rafId = requestAnimationFrame(loop); }
      }, { threshold: 0 });
      this._io.observe(this);
    }

    this._onVisibility = () => {
      if (document.hidden) { this._visible = false; }
      else { this._visible = true; if (!this._rafId && !this._destroyed) { this._lastTs = null; this._rafId = requestAnimationFrame(loop); } }
    };
    document.addEventListener('visibilitychange', this._onVisibility);

    this._rafId = requestAnimationFrame(loop);
  }
}

if (!customElements.get('om-stream')) customElements.define('om-stream', OmStream);
