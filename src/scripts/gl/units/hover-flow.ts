/**
 * Hover flow units: small colorflows for interactive states (a hover card's
 * lower third), inspired by the home page's colorflow (<om-stream>) but built
 * for a short, wide strip and a single hue: four stops, the hue's two-tone
 * (base, darker, companion, lighter), cycled. One structure, a ribbon: a thick
 * soft band near the bottom edge, mostly its top half showing, color moving
 * along it. Two wave heights to compare:
 *
 *   ribbon        mild wave (0.13 of the strip's height)
 *   ribbon-wave   strong wave (0.26), the overall curve plainly visible (the working favorite)
 *
 * Coordinates: u runs across the card, 0–1 (the band's overall shape and color,
 * the same on any card); X runs across in units of 110 CSS pixels (the ripples,
 * the same size on any card); y from 0 at the bottom of the strip to 1 at its top.
 * Output is premultiplied; the strip's own fade and opacity are CSS.
 */
import type { Unit } from '../renderer';

const HEAD = `
precision highp float;
varying vec2 vUV;
uniform float uTime, uSeed, uDpr;
uniform vec2 uRes;
uniform vec3 uColors[4];
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
// The four stops, cycled: t in any range, one full cycle per 1.0.
vec3 tone(float t) {
  float s = fract(t) * 4.0, i = floor(s), f = smoothstep(0.0, 1.0, fract(s));
  vec3 a = i < 1.0 ? uColors[0] : i < 2.0 ? uColors[1] : i < 3.0 ? uColors[2] : uColors[3];
  vec3 b = i < 1.0 ? uColors[1] : i < 2.0 ? uColors[2] : i < 3.0 ? uColors[3] : uColors[0];
  return mix(a, b, f);
}
`;

// The flow's pace: twice its first-built speed (Kyle, 2026-10-26).
const COORDS = `
  float u = vUV.x;
  float X = vUV.x * uRes.x / (uDpr * 110.0);
  float y = vUV.y;
  float t = uTime * 2.0 + uSeed * 50.0;
`;

// The band both units share. Its shape is one mild sine wave across the card's
// width, whatever the card's size (u, 0–1), drifting slowly, like the home page
// colorflow's curve; small ripples (in CSS pixels, X) vary it. It's thick and
// centered near the strip's bottom edge, so mostly its top half shows. Color
// runs across the width through the two-tone, slowly. d: distance from the
// center in half-widths (negative below).
const BAND = `
float bandD(float u, float X, float y, float t) {
  float cy = 0.14 + WAVE * sin(u * 5.0 - t * 0.35)
           + 0.035 * snoise(vec2(X * 0.35 - t * 0.12, t * 0.08));
  float hw = 0.55 + 0.05 * snoise(vec2(X * 0.25 + 7.0 - t * 0.1, t * 0.06));
  return (y - cy) / hw;
}
vec3 bandColor(float u, float t, float d) {
  return tone(u * 0.5 - t * 0.06 + d * 0.04);
}
// A faint streak along the band, not blotches.
float bandTexture(float X, float t, float d) {
  return 0.92 + 0.08 * snoise(vec2(X * 0.6 - t * 0.2, d * 1.2));
}
`;

/** A ribbon with the overall wave's height `wave` (in strip heights). */
const ribbon = (id: string, wave: number): Unit => ({
  id, stops: 4, frag: `#define WAVE ${wave.toFixed(3)}\n` + HEAD + BAND + `
void main() {${COORDS}
  float d = bandD(u, X, y, t);
  float a = exp(-d * d * 0.9) * bandTexture(X, t, d);
  gl_FragColor = vec4(bandColor(u, t, d) * a, a);
}`,
});

export const RIBBON = ribbon('hover-flow-ribbon', 0.13);
export const RIBBON_WAVE = ribbon('hover-flow-ribbon-wave', 0.26);

export const HOVER_FLOWS: Record<string, Unit> = { ribbon: RIBBON, 'ribbon-wave': RIBBON_WAVE };
