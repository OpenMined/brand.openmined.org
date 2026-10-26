/**
 * Shared WebGL renderer (behaviors/color-moves, exploring).
 *
 * One WebGL context and one animation loop for the whole page, drawing any
 * number of short-lived placements: a hover card's colorflow, and later any
 * other small graphic that comes and goes. Each placement is a plain 2D canvas
 * inside its target; every frame the renderer draws the placement's unit into
 * its own (hidden) WebGL canvas and copies the result across. 2D canvases are
 * cheap to make and drop, so placements are created on demand and removed when
 * done; the WebGL context is made once, on first use, and kept.
 *
 * A unit is an animation: a fragment shader and how many color stops it takes
 * (units/). The renderer only supplies uTime (seconds), uRes (device pixels),
 * uDpr (device pixels per CSS pixel), uSeed (0–1, per placement) and uColors (the stops, linear 0–1 sRGB), so a
 * unit can be any structure. Standalone embeds (public/embeds/) stay their own
 * thing; a unit can be wrapped as one later.
 *
 * Reduced motion: a placement draws one still frame. The loop runs only while
 * an animated placement exists; the browser pauses it in a hidden tab.
 */
export type Unit = { id: string; stops: number; frag: string };
export type Placement = { el: HTMLCanvasElement; remove(): void; recolor(colors: Float32Array): void; setSpeed(speed: number): void };

const VS = 'attribute vec2 aPos; varying vec2 vUV; void main() { vUV = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }';
const MAX_DPR = 2;

type Prog = { prog: WebGLProgram; time: WebGLUniformLocation | null; res: WebGLUniformLocation | null; dpr: WebGLUniformLocation | null; seed: WebGLUniformLocation | null; colors: WebGLUniformLocation | null };
type Live = { el: HTMLCanvasElement; ctx: CanvasRenderingContext2D; unit: Unit; colors: Float32Array; seed: number; speed: number; w: number; h: number; dpr: number; still: boolean; drawn: boolean; ro: ResizeObserver };

let gl: WebGLRenderingContext | null = null;
let glCanvas: HTMLCanvasElement | null = null;
let failed = false;
const programs = new Map<string, Prog>();
const live = new Set<Live>();
let raf = 0;
const t0 = performance.now();

function setup(g: WebGLRenderingContext) {
  const buf = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, buf);
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
  g.clearColor(0, 0, 0, 0);
}

function context(): WebGLRenderingContext | null {
  if (gl || failed) return gl;
  glCanvas = document.createElement('canvas');
  gl = glCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) { failed = true; return null; }
  setup(gl);
  // A lost context (GPU reset, too many contexts elsewhere) is rebuilt on restore;
  // programs are recompiled on next use.
  glCanvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); programs.clear(); });
  glCanvas.addEventListener('webglcontextrestored', () => { if (gl) { setup(gl); live.forEach((p) => (p.drawn = false)); kick(); } });
  return gl;
}

function compile(g: WebGLRenderingContext, type: number, src: string) {
  const s = g.createShader(type)!;
  g.shaderSource(s, src); g.compileShader(s);
  if (!g.getShaderParameter(s, g.COMPILE_STATUS)) { console.error('gl renderer:', g.getShaderInfoLog(s)); return null; }
  return s;
}

function program(g: WebGLRenderingContext, unit: Unit): Prog | null {
  const have = programs.get(unit.id);
  if (have) return have;
  const vs = compile(g, g.VERTEX_SHADER, VS), fs = compile(g, g.FRAGMENT_SHADER, unit.frag);
  if (!vs || !fs) return null;
  const prog = g.createProgram()!;
  g.attachShader(prog, vs); g.attachShader(prog, fs); g.linkProgram(prog);
  if (!g.getProgramParameter(prog, g.LINK_STATUS)) { console.error('gl renderer:', g.getProgramInfoLog(prog)); return null; }
  const p = { prog, time: g.getUniformLocation(prog, 'uTime'), res: g.getUniformLocation(prog, 'uRes'), dpr: g.getUniformLocation(prog, 'uDpr'), seed: g.getUniformLocation(prog, 'uSeed'), colors: g.getUniformLocation(prog, 'uColors') };
  programs.set(unit.id, p);
  return p;
}

function draw(p: Live, time: number) {
  const g = context();
  if (!g || !glCanvas || !p.w || !p.h || g.isContextLost()) return;
  const pr = program(g, p.unit);
  if (!pr) return;
  // The WebGL canvas only grows; each placement draws into its bottom-left corner.
  if (glCanvas.width < p.w || glCanvas.height < p.h) {
    glCanvas.width = Math.max(glCanvas.width, p.w);
    glCanvas.height = Math.max(glCanvas.height, p.h);
  }
  g.useProgram(pr.prog);
  const aPos = g.getAttribLocation(pr.prog, 'aPos');
  g.enableVertexAttribArray(aPos);
  g.vertexAttribPointer(aPos, 2, g.FLOAT, false, 0, 0);
  g.viewport(0, 0, p.w, p.h);
  g.clear(g.COLOR_BUFFER_BIT);
  g.uniform1f(pr.time, time);
  g.uniform2f(pr.res, p.w, p.h);
  g.uniform1f(pr.dpr, p.dpr);
  g.uniform1f(pr.seed, p.seed);
  g.uniform3fv(pr.colors, p.colors);
  g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  // Copied in the same frame, so the drawing buffer is still intact.
  p.ctx.clearRect(0, 0, p.w, p.h);
  p.ctx.drawImage(glCanvas, 0, glCanvas.height - p.h, p.w, p.h, 0, 0, p.w, p.h);
  p.drawn = true;
}

function frame(now: number) {
  raf = 0;
  const time = (now - t0) / 1000;
  let animated = false;
  live.forEach((p) => {
    if (p.still) { if (!p.drawn) draw(p, 12 + p.seed * 40); }
    else { draw(p, time * p.speed + p.seed * 40); animated = true; }
  });
  if (animated) raf = requestAnimationFrame(frame);
}

function kick() { if (!raf && live.size) raf = requestAnimationFrame(frame); }

/** Put a unit into `target` as a canvas (class `className`). Colors: `unit.stops`
 *  sRGB triples, 0–1 (see cssColors). `speed` scales its time (2 = twice as fast).
 *  Remove it when it's done. */
export function place(target: HTMLElement, unit: Unit, colors: Float32Array, className = '', speed = 1): Placement | null {
  if (!context()) return null;
  const el = document.createElement('canvas');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  target.append(el);
  const p: Live = {
    el, ctx: el.getContext('2d')!, unit, colors, seed: Math.random(), speed, w: 0, h: 0, dpr: 1,
    still: matchMedia('(prefers-reduced-motion: reduce)').matches, drawn: false,
    ro: new ResizeObserver(() => {
      const dpr = p.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      p.w = el.width = Math.round(el.clientWidth * dpr);
      p.h = el.height = Math.round(el.clientHeight * dpr);
      p.drawn = false; kick();
    }),
  };
  p.ro.observe(el);
  live.add(p);
  kick();
  return {
    el,
    remove() { p.ro.disconnect(); live.delete(p); el.remove(); },
    recolor(c) { p.colors = c; p.drawn = false; kick(); },
    setSpeed(n) { p.speed = n; },
  };
}

/** Token colors as the stops a unit takes: each CSS custom property resolved on
 *  `el` (so the color mode and any data-section apply), as sRGB 0–1. */
export function cssColors(el: HTMLElement, names: string[]): Float32Array {
  const probe = document.createElement('span');
  probe.style.display = 'none';
  el.append(probe);
  const out = new Float32Array(names.length * 3);
  names.forEach((n, i) => {
    probe.style.color = `var(${n})`;
    const c = getComputedStyle(probe).color;
    const v = (c.match(/[\d.]+/g) ?? []).map(Number);
    // rgb(255, 0, 0) → 0–255; color(srgb 1 0 0) → 0–1.
    const scale = c.startsWith('color(') ? 1 : 1 / 255;
    out.set([v[0] * scale, v[1] * scale, v[2] * scale].map((x) => x || 0), i * 3);
  });
  probe.remove();
  return out;
}
