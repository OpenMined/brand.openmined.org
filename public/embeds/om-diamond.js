/**
 * OMDS — <om-diamond> portable brand embed
 * ════════════════════════════════════════════════════════════════════
 * A framework-agnostic WebGL diamond rendered in the brand gradient.
 * Drop it on any page:
 *
 *   <script type="module" src="https://design.openmined.org/embeds/om-diamond.js"></script>
 *   <om-diamond></om-diamond>
 *
 * Attributes (all optional):
 *   gradient="spectrum"            named gradient from brand-colors.js
 *   colors="#f8c073,#52a8c5,…"     explicit hex stops (overrides gradient)
 *
 * Size it however you like — it defaults to a 1:1 square and fills its box.
 * Each element is independent (multiple per page is fine) and cleans itself
 * up on removal. Colors come from brand-colors.js — never hand-typed here.
 * ════════════════════════════════════════════════════════════════════
 */

import { resolveGradient } from './brand-colors.js';

const VS = [
  'attribute vec2 aPos;',
  'varying vec2 vUV;',
  'void main(){ vUV = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }',
].join('\n');

const FS = [
  'precision highp float;',
  'varying vec2 vUV;',
  'uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;',
  'uniform vec3 uGC[10]; uniform float uGS[10]; uniform float uGN;',
  'uniform float uClusters, uWrap;',
  'uniform float uAlongFlow, uAcrossFlow, uRadial;',
  'uniform float uFlowSpeed, uFlowAngle, uColorNoise;',
  'uniform float uSize, uRoundness;',
  'uniform float uSoftness, uNoiseAmp, uNoiseScale, uNoiseSpeed, uAmbient;',
  'uniform float uAlphaPow, uOpacity, uSaturation, uTurbulence;',
  'uniform float uAttract, uRipple;',
  'vec3 mod289v3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }',
  'vec2 mod289v2(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }',
  'vec3 permute(vec3 x){ return mod289v3(((x*34.0)+10.0)*x); }',
  'float snoise(vec2 v){',
  '  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
  '  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);',
  '  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);',
  '  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289v2(i);',
  '  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));',
  '  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);',
  '  m=m*m; m=m*m;',
  '  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5;',
  '  vec3 ox=floor(x+0.5); vec3 a0=x-ox;',
  '  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);',
  '  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;',
  '  return 130.0*dot(m,g);',
  '}',
  'vec3 sampleGrad(float t){',
  '  t=uWrap>0.5?fract(t):clamp(t,0.0,1.0);',
  '  vec3 c=uGC[0]; float pS=uGS[0];',
  '  for(int i=1;i<10;i++){',
  '    if(float(i)>=uGN)break;',
  '    float s=uGS[i]; float f=clamp((t-pS)/max(s-pS,0.001),0.0,1.0);',
  '    c=mix(c,uGC[i],f*step(pS,t)); pS=s;',
  '  } return c;',
  '}',
  'void main(){',
  '  float aspect=uRes.x/uRes.y;',
  '  float cx=(vUV.x-0.5)*aspect; float cy=vUV.y-0.5;',
  '  float s707=0.7071067811865476;',
  '  float rx=cx*s707+cy*s707; float ry=cy*s707-cx*s707;',
  '  float halfSide=uSize*s707; float r=uRoundness*halfSide;',
  '  vec2 q=abs(vec2(rx,ry))-(halfSide-r);',
  '  float d=length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;',
  '  float len=length(vec2(cx,cy));',
  '  float ns=uNoiseScale,nsp=uNoiseSpeed;',
  '  float edgeN=snoise(vec2(cx*ns+uTime*nsp*0.3,cy*ns-uTime*nsp*0.2))*uNoiseAmp',
  '            +snoise(vec2(cx*ns*2.1+5.0-uTime*nsp*0.4,cy*ns*2.1+uTime*nsp*0.3))*uNoiseAmp*0.5',
  '            +snoise(vec2(cx*ns*4.3+10.0+uTime*nsp*0.2,cy*ns*4.3-uTime*nsp*0.5))*uNoiseAmp*0.25;',
  '  float mx=(uMouse.x-0.5)*aspect; float my=uMouse.y-0.5;',
  '  float mDistSq=(cx-mx)*(cx-mx)+(cy-my)*(cy-my);',
  '  float ripple=uRipple*exp(-mDistSq/0.02)*snoise(vec2(cx*10.0-uTime*0.4,cy*10.0));',
  '  float attract=uAttract*exp(-mDistSq/0.06);',
  '  float ambient=(snoise(vec2(cx*8.0-uTime*0.3,cy*6.0+uTime*0.15))*0.005',
  '               +snoise(vec2(cx*12.0+uTime*0.2,cy*10.0-uTime*0.1))*0.003)*uAmbient;',
  '  float dMod=d-edgeN-ripple-attract-ambient;',
  '  float outside=max(dMod,0.0);',
  '  float soft2=2.0*uSoftness*uSoftness;',
  '  float alpha=exp(-(outside*outside)/max(soft2,1e-8));',
  '  float aN=snoise(vec2(cx*5.0+uTime*0.03,cy*5.0-uTime*0.02))*0.08;',
  '  alpha=clamp(alpha+aN*alpha,0.0,1.0);',
  '  alpha=pow(max(alpha,1e-6),uAlphaPow);',
  '  alpha*=smoothstep(0.0,0.03,alpha);',
  '  float flow=uTime*uFlowSpeed;',
  '  float angRad=uFlowAngle*3.14159265/180.0;',
  '  float fdx=cos(angRad),fdy=sin(angRad);',
  '  float halfSize=max(uSize,0.01);',
  '  float tAlong=(cx*fdx+cy*fdy)/(halfSize*2.0)+0.5;',
  '  float tAcross=(-cx*fdy+cy*fdx)/(halfSize*2.0)+0.5;',
  '  float tRadial=len/halfSize;',
  '  float cNoise=snoise(vec2(cx*3.0-flow*2.0+20.0,cy*4.0-uTime*0.04))*uColorNoise;',
  '  float turbN=snoise(vec2(cx*4.0-uTime*0.1,cy*4.0+uTime*0.08))*uTurbulence*0.3;',
  '  float gradT=(tAlong*uAlongFlow+tAcross*uAcrossFlow+tRadial*uRadial+cNoise+turbN)*uClusters+flow;',
  '  vec3 color=sampleGrad(gradT);',
  '  float lum=dot(color,vec3(0.299,0.587,0.114));',
  '  color=mix(vec3(lum),color,uSaturation);',
  '  gl_FragColor=vec4(color*(alpha*uOpacity),alpha*uOpacity);',
  '}',
].join('\n');

// Visual tuning (geometry/motion, not color) — the locked-in brand look.
const SHADER = {
  clusters: 1, wrap: true,
  alongFlow: 0.43, acrossFlow: 0.25, radial: 0,
  colorNoise: 0, flowSpeed: 0.06, flowAngle: 332,
  size: 0.30, roundness: 0.15,
  softness: 0.04, noiseAmp: 0.025, noiseScale: 3.0,
  noiseSpeed: 0.3, ambient: 0.5,
  alphaPow: 2.0, opacity: 1.0,
  saturation: 1.08, turbulence: 0.33,
  attract: 0.013, ripple: 0.019,
};

function hexToGL(hex) {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function prepareGradient(colors, wrap) {
  const n = colors.length;
  if (!n) return { colors: [[1, 1, 1]], stops: [0.5], count: 1 };
  const total = colors.reduce((s, c) => s + c.weight, 0) || 1;
  const outC = [], outS = [];
  if (wrap) {
    let cum = 0;
    for (let i = 0; i < n && i < 9; i++) { outC.push(hexToGL(colors[i].hex)); outS.push(cum / total); cum += colors[i].weight; }
    outC.push(hexToGL(colors[0].hex)); outS.push(1.0);
  } else {
    const raw = []; let cum = 0;
    for (let i = 0; i < n && i < 10; i++) { raw.push(cum + colors[i].weight / 2); cum += colors[i].weight; }
    const first = raw[0], last = raw[raw.length - 1], range = last - first || 1;
    for (let i = 0; i < raw.length; i++) { outC.push(hexToGL(colors[i].hex)); outS.push((raw[i] - first) / range); }
  }
  return { colors: outC, stops: outS, count: outC.length };
}

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('om-diamond shader:', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

class OmDiamond extends HTMLElement {
  connectedCallback() {
    if (this._booted) return;
    this._booted = true;

    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML =
      '<style>:host{display:block;position:relative;aspect-ratio:1/1;overflow:hidden}' +
      'canvas{position:absolute;inset:0;width:100%;height:100%;display:block}</style>' +
      '<canvas></canvas>';
    this._canvas = root.querySelector('canvas');

    const colorsAttr = this.getAttribute('colors');
    const hexes = colorsAttr
      ? colorsAttr.split(',').map((s) => s.trim()).filter(Boolean)
      : resolveGradient(this.getAttribute('gradient'));
    this._colors = hexes.map((hex) => ({ hex, weight: 1 }));

    this._mx = 0.5; this._my = 0.5; this._smx = 0.5; this._smy = 0.5;
    this._elapsed = 0; this._lastTs = null;
    this._visible = true; this._rafId = null; this._destroyed = false;
    this._gl = null; this._u = null;

    this._initGL();
    this._bindEvents();
    this._start();
  }

  disconnectedCallback() {
    this._destroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._io) this._io.disconnect();
    if (this._ro) this._ro.disconnect();
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('visibilitychange', this._onVis);
    if (this._gl && this._prog) this._gl.deleteProgram(this._prog);
  }

  _initGL() {
    const gl = this._canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this._gl = gl;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('om-diamond link:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);
    this._prog = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {};
    ['uTime', 'uRes', 'uMouse', 'uGN', 'uClusters', 'uWrap',
      'uAlongFlow', 'uAcrossFlow', 'uRadial', 'uFlowSpeed', 'uFlowAngle', 'uColorNoise',
      'uSize', 'uRoundness', 'uSoftness', 'uNoiseAmp', 'uNoiseScale', 'uNoiseSpeed', 'uAmbient',
      'uAlphaPow', 'uOpacity', 'uSaturation', 'uTurbulence', 'uAttract', 'uRipple',
    ].forEach((n) => { u[n] = gl.getUniformLocation(prog, n); });
    for (let i = 0; i < 10; i++) {
      u['uGC' + i] = gl.getUniformLocation(prog, 'uGC[' + i + ']');
      u['uGS' + i] = gl.getUniformLocation(prog, 'uGS[' + i + ']');
    }
    this._u = u;

    this._applySize();
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(() => this._applySize());
      this._ro.observe(this);
    }
  }

  _applySize() {
    if (!this._gl) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.offsetWidth, h = this.offsetHeight;
    this._canvas.width = Math.round(w * dpr);
    this._canvas.height = Math.round(h * dpr);
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
  }

  _bindEvents() {
    this._onMove = (e) => {
      if (this._destroyed) return;
      const r = this.getBoundingClientRect();
      this._mx = (e.clientX - r.left) / r.width;
      this._my = 1.0 - (e.clientY - r.top) / r.height;
    };
    this._onLeave = () => { if (!this._destroyed) { this._mx = 0.5; this._my = 0.5; } };
    document.addEventListener('mousemove', this._onMove, { passive: true });
    this.addEventListener('mouseleave', this._onLeave, { passive: true });
  }

  _start() {
    this._visible = true;
    const loop = (ts) => {
      if (this._destroyed) return;
      if (!this._visible || document.hidden) { this._rafId = null; return; }
      if (this._lastTs !== null) this._elapsed += (ts - this._lastTs) / 1000.0;
      this._lastTs = ts;

      this._smx += (this._mx - this._smx) * 0.08;
      this._smy += (this._my - this._smy) * 0.08;

      const gl = this._gl, u = this._u;
      if (gl && u) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const s = SHADER;
        const g = prepareGradient(this._colors, s.wrap);
        gl.uniform1f(u.uTime, this._elapsed);
        gl.uniform2f(u.uRes, this._canvas.width, this._canvas.height);
        gl.uniform2f(u.uMouse, this._smx, this._smy);
        gl.uniform1f(u.uGN, g.count);
        for (let i = 0; i < 10; i++) {
          if (i < g.count) { gl.uniform3fv(u['uGC' + i], g.colors[i]); gl.uniform1f(u['uGS' + i], g.stops[i]); }
        }
        gl.uniform1f(u.uClusters, s.clusters);
        gl.uniform1f(u.uWrap, s.wrap ? 1 : 0);
        gl.uniform1f(u.uAlongFlow, s.alongFlow);
        gl.uniform1f(u.uAcrossFlow, s.acrossFlow);
        gl.uniform1f(u.uRadial, s.radial);
        gl.uniform1f(u.uFlowSpeed, s.flowSpeed);
        gl.uniform1f(u.uFlowAngle, s.flowAngle);
        gl.uniform1f(u.uColorNoise, s.colorNoise);
        gl.uniform1f(u.uSize, s.size);
        gl.uniform1f(u.uRoundness, s.roundness);
        gl.uniform1f(u.uSoftness, s.softness);
        gl.uniform1f(u.uNoiseAmp, s.noiseAmp);
        gl.uniform1f(u.uNoiseScale, s.noiseScale);
        gl.uniform1f(u.uNoiseSpeed, s.noiseSpeed);
        gl.uniform1f(u.uAmbient, s.ambient);
        gl.uniform1f(u.uAlphaPow, s.alphaPow);
        gl.uniform1f(u.uOpacity, s.opacity);
        gl.uniform1f(u.uSaturation, s.saturation);
        gl.uniform1f(u.uTurbulence, s.turbulence);
        gl.uniform1f(u.uAttract, s.attract);
        gl.uniform1f(u.uRipple, s.ripple);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      this._rafId = requestAnimationFrame(loop);
    };

    if (window.IntersectionObserver) {
      this._io = new IntersectionObserver((entries) => {
        this._visible = entries[0].isIntersecting;
        if (this._visible && !this._rafId) { this._lastTs = null; this._rafId = requestAnimationFrame(loop); }
      }, { threshold: 0 });
      this._io.observe(this);
    }
    this._onVis = () => {
      if (document.hidden) { this._visible = false; }
      else { this._visible = true; if (!this._rafId && !this._destroyed) { this._lastTs = null; this._rafId = requestAnimationFrame(loop); } }
    };
    document.addEventListener('visibilitychange', this._onVis);

    this._rafId = requestAnimationFrame(loop);
  }
}

if (!customElements.get('om-diamond')) customElements.define('om-diamond', OmDiamond);
