#!/usr/bin/env node
/**
 * Contrast check (lab research 2026-10-28, feedback and deployment audit): every color
 * pair the guidance promises a ratio for (tools/contrast/pairs.json), in both modes, from
 * the token build (src/tokens/v2/tokens.{light,dark}.json). Fails on a pair under its
 * minimum; an accepted exception (named by its decision) fails only under its floor.
 *
 *   node tools/contrast/check.mjs           check (exit 1 on a failure)
 *   node tools/contrast/check.mjs --report  every pair with its ratio
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CFG = JSON.parse(readFileSync(join(ROOT, 'tools/contrast/pairs.json'), 'utf8'));
const MODES = Object.fromEntries(['light', 'dark'].map(m => [m, JSON.parse(readFileSync(join(ROOT, `src/tokens/v2/tokens.${m}.json`), 'utf8'))]));
const report = process.argv.includes('--report');

const lum = hex => {
  const c = hex.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const expand = names => names.flatMap(n => n.includes('{hue}') ? CFG.hues.map(h => n.replace('{hue}', h)) : n.includes('{status}') ? CFG.statuses.map(s => n.replace('{status}', s)) : [n]);
const hex = (mode, name) => {
  const e = MODES[mode][`--${name}`];
  if (!e) throw new Error(`contrast: no token --${name}`);
  if (!/^#[0-9a-f]{6}$/i.test(e.resolved)) throw new Error(`contrast: --${name} is not a plain color (${e.resolved})`);
  return e.resolved;
};

const fails = [], lines = [];
for (const rule of CFG.rules) {
  const accepted = new Set(rule.accepted?.pairs ?? []);
  for (const fg of expand(rule.fg)) for (const bg of expand(rule.bg)) for (const mode of ['light', 'dark']) {
    const r = ratio(hex(mode, fg), hex(mode, bg));
    const isAccepted = accepted.has(`${fg}/${bg}`);
    const min = isAccepted ? rule.accepted.floor : rule.min;
    const ok = r >= min - 1e-9;
    if (report) lines.push(`${ok ? ' ' : '✖'} ${mode.padEnd(5)} ${`--${fg}`.padEnd(18)} on ${`--${bg}`.padEnd(18)} ${r.toFixed(2)}${isAccepted ? `  (accepted ≥ ${min}, ${rule.accepted.decision})` : ''}`);
    if (!ok) fails.push(`${rule.name}: --${fg} on --${bg} (${mode}) is ${r.toFixed(2)}:1, needs ${min}:1 (${isAccepted ? rule.accepted.decision : rule.source})`);
  }
}
if (report) console.log(lines.join('\n'));
if (fails.length) { console.error(`✖ contrast: ${fails.length} pair(s) below their promise\n  ${fails.join('\n  ')}`); process.exit(1); }
console.log(`✓ contrast: every documented pair holds in both modes`);
