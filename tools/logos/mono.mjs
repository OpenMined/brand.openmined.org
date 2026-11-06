/**
 * ONE-COLOR LOGO RULES — shared by the importer (tools/logos/import-org.mjs) and the
 * build (src/lib/orgs.ts), so a one-color organization logo is checked the same way
 * when it comes in and every time the site builds.
 *
 * A one-color file draws only in currentColor, so it takes the color of the text
 * around it and follows the mode. Masks and clip paths are geometry, not paint: they
 * keep their own fills (a luminance mask needs white to show anything; turning that
 * white into currentColor or none hides the whole drawing, as happened to one mark).
 */

/** Masks, clip paths and gradient/defs blocks: geometry or shading, never repainted. */
const PROTECTED = /<(mask|clipPath|defs|linearGradient|radialGradient|filter)\b[\s\S]*?<\/\1>/g;
const COLOR_ATTR = /\b(fill|stroke)\s*=\s*"([^"]*)"/g;
const COLOR_STYLE = /\b(fill|stroke)\s*:\s*([^;"]+)/g;
const SAFE = /^(none|currentColor|inherit|transparent|url\(.*\))$/i;
const WHITE = /^(#fff(fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))$/i;

const strip = (svg) => svg.replace(/<\?xml[^>]*>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();

/** Everything wrong with a file meant to be one color. Empty means it passes. */
export function monoProblems(svg) {
  const s = strip(svg);
  const out = [];
  if (!/^<svg\b/.test(s)) out.push('not an SVG');
  if (/<image\b/.test(s)) out.push('it embeds an image');
  if (/<style\b/.test(s)) out.push('it has a <style> block');
  for (const m of s.matchAll(/<mask\b[\s\S]*?<\/mask>/g)) {
    const alpha = /mask-type\s*:\s*alpha/.test(m[0]);
    if (!alpha && !/(fill|stroke)\s*[=:]\s*"?\s*(#fff(fff)?|white)\b/i.test(m[0])) out.push('a mask has no white in it, so it hides what it masks');
  }
  const painted = s.replace(PROTECTED, '');
  const colors = [...painted.matchAll(COLOR_ATTR), ...painted.matchAll(COLOR_STYLE)].map((m) => m[2].trim()).filter((c) => !SAFE.test(c));
  if (colors.length) out.push(`it paints in ${[...new Set(colors)].join(', ')}, not only currentColor`);
  if (!/currentColor/.test(painted)) out.push('nothing in it uses currentColor');
  return out;
}

/**
 * Turn a drawing that is one color into a one-color file. Refuses, with the reason,
 * what it can't decide: white parts (knockouts), more than one color (unless the
 * caller says they're one color, e.g. two near-identical navies), images, styles.
 */
export function toMono(svg, { oneColor = false } = {}) {
  let s = strip(svg);
  if (/<image\b/.test(s)) throw new Error('it embeds an image: a one-color file must be vector');
  if (/<style\b/.test(s)) throw new Error('it has a <style> block: inline the styles first');
  const kept = [];
  s = s.replace(PROTECTED, (m) => { kept.push(m); return `\u0000${kept.length - 1}\u0000`; });
  const seen = [...s.matchAll(COLOR_ATTR), ...s.matchAll(COLOR_STYLE)].map((m) => m[2].trim()).filter((c) => !SAFE.test(c));
  const whites = seen.filter((c) => WHITE.test(c));
  if (whites.length) throw new Error('it has white parts: those are knockouts one color can\'t paint (draw them as a cut-out first)');
  const distinct = [...new Set(seen.map((c) => c.toLowerCase()))];
  if (distinct.length > 1 && !oneColor) throw new Error(`it draws in ${distinct.length} colors (${distinct.join(', ')}); pass --one-color if they are one color in the mark`);
  s = s.replace(COLOR_ATTR, (m, a, c) => (SAFE.test(c.trim()) ? m : `${a}="currentColor"`))
    .replace(COLOR_STYLE, (m, a, c) => (SAFE.test(c.trim()) ? m : `${a}:currentColor`));
  // Shapes with no fill of their own inherit the root's; make that currentColor.
  s = s.replace(/^<svg\b[^>]*>/, (open) => {
    let o = open.replace(/\s(width|height|class)="[^"]*"/g, '');
    if (/\sfill="[^"]*"/.test(o)) { if (!/\sfill="(none|currentColor)"/.test(o)) o = o.replace(/\sfill="[^"]*"/, ' fill="currentColor"'); }
    else o = o.replace(/^<svg\b/, '<svg fill="currentColor"');
    return o;
  });
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[+i]);
  const problems = monoProblems(s);
  if (problems.length) throw new Error(problems.join('; '));
  return s + '\n';
}
