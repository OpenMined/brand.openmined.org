/**
 * COLOR ROUND — controls, URL state, and the hover layer.
 *
 * State lives on <html> as data-p / data-a / data-l / data-theme, set
 * before paint by the inline script in index.astro. This module only
 * changes those attributes and mirrors them into the URL, so any
 * combination is a link that can be passed back and forth for review.
 */

import { initAdjust, SCOPES, SLIDERS } from './_adjust';

const html = document.documentElement;
const AXES = ['p', 'a', 'l'] as const;
type Axis = (typeof AXES)[number];

/* ── URL sync ─────────────────────────────────────────────────────── */
function writeUrl() {
  const q = new URLSearchParams(location.search);
  for (const k of AXES) q.set(k, html.dataset[k] ?? '');
  q.delete('gr'); // retired: the gradient follows the palette
  q.set('t', html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  history.replaceState(null, '', `${location.pathname}?${q}${location.hash}`);
}

/* ── Dropdowns ────────────────────────────────────────────────────────
   A button plus a listbox, so each option can carry a description a
   native <select> can't show. Keyboard: Enter/Space/↓ opens, ↑↓ move,
   Enter selects, Esc closes and returns focus to the button. */
const dds = [...document.querySelectorAll<HTMLElement>('[data-dd]')];

function paintDds() {
  dds.forEach(dd => {
    const axis = dd.dataset.dd as Axis;
    const opts = [...dd.querySelectorAll<HTMLElement>('[role="option"]')];
    opts.forEach(o => o.setAttribute('aria-selected', String(o.dataset.v === html.dataset[axis])));
    const cur = opts.find(o => o.dataset.v === html.dataset[axis]);
    dd.querySelector('.dd__val')!.textContent = cur?.dataset.label ?? '';
  });
}

function close(dd: HTMLElement, focus = false) {
  const btn = dd.querySelector<HTMLButtonElement>('.dd__btn')!;
  dd.querySelector<HTMLElement>('.dd__list')!.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
  if (focus) btn.focus();
}

function open(dd: HTMLElement) {
  dds.forEach(o => o !== dd && close(o));
  const list = dd.querySelector<HTMLElement>('.dd__list')!;
  list.hidden = false;
  dd.querySelector('.dd__btn')!.setAttribute('aria-expanded', 'true');
  (list.querySelector<HTMLElement>('[aria-selected="true"]') ?? list.querySelector<HTMLElement>('[role="option"]'))?.focus();
}

function choose(dd: HTMLElement, opt: HTMLElement) {
  html.dataset[dd.dataset.dd as Axis] = opt.dataset.v!;
  paintDds(); writeUrl(); close(dd, true);
}

dds.forEach(dd => {
  const btn = dd.querySelector<HTMLButtonElement>('.dd__btn')!;
  const opts = () => [...dd.querySelectorAll<HTMLElement>('[role="option"]')];
  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close(dd) : open(dd)));
  btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); open(dd); } });
  dd.addEventListener('click', e => {
    const o = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (o) choose(dd, o);
  });
  dd.addEventListener('keydown', e => {
    const o = (e.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (!o) return;
    const list = opts(), i = list.indexOf(o);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[Math.min(i + 1, list.length - 1)].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[Math.max(i - 1, 0)].focus(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(dd, o); }
    else if (e.key === 'Escape') { e.preventDefault(); close(dd, true); }
    else if (e.key === 'Tab') close(dd);
  });
});

document.addEventListener('click', e => {
  dds.forEach(dd => { if (!dd.contains(e.target as Node)) close(dd); });
  // Compare cards jump to that palette in context without a reload.
  const j = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-jump]');
  if (j) {
    e.preventDefault();
    html.dataset.p = j.dataset.jump!;
    paintDds(); writeUrl();
    document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' });
  }
});

// ThemeToggle flips data-theme itself; follow it into the URL.
new MutationObserver(writeUrl).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
paintDds(); writeUrl();

/* ── Tooltip ──────────────────────────────────────────────────────── */
const tip = document.querySelector<HTMLElement>('.tip')!;
const tipB = tip.querySelector('b')!;
const tipS = tip.querySelector('span')!;

function place(e: PointerEvent) {
  const w = tip.offsetWidth, h = tip.offsetHeight;
  const x = e.clientX + w + 24 > innerWidth ? e.clientX - w - 24 : e.clientX;
  const y = e.clientY + h + 24 > innerHeight ? e.clientY - h - 24 : e.clientY;
  tip.style.left = `${x}px`; tip.style.top = `${y}px`;
}

document.addEventListener('pointermove', e => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-tip]');
  if (!el) { if (!tip.dataset.owner) tip.hidden = true; return; }
  const [t, v] = el.dataset.tip!.split('|');
  tipB.textContent = t; tipS.textContent = v ?? '';
  tip.hidden = false; place(e);
});

/* ── Line chart crosshair ─────────────────────────────────────────── */
document.querySelectorAll<HTMLElement>('[data-line]').forEach(box => {
  const d = JSON.parse(box.dataset.line!) as { x: string[]; s: string[]; v: number[][]; px: number[]; w: number };
  const svg = box.querySelector('svg')!;
  const xl = svg.querySelector<SVGLineElement>('.line__x')!;
  const dots = [...svg.querySelectorAll<SVGCircleElement>('.line__dot')];
  const paths = [...svg.querySelectorAll<SVGPathElement>('.line__path')];
  const vb = svg.viewBox.baseVal;

  box.addEventListener('pointermove', e => {
    const r = svg.getBoundingClientRect();
    const f = (e.clientX - r.left) / r.width;
    let i = 0; d.px.forEach((p, k) => { if (Math.abs(p - f) < Math.abs(d.px[i] - f)) i = k; });
    const x = d.px[i] * vb.width;
    xl.setAttribute('x1', String(x)); xl.setAttribute('x2', String(x));
    dots.forEach((c, k) => {
      // Read the point back off the path so dot and line can never disagree.
      const seg = paths[k].getAttribute('d')!.split(/[ML]/).filter(Boolean)[i].split(',');
      c.setAttribute('cx', seg[0]); c.setAttribute('cy', seg[1]);
    });
    box.classList.add('is-hover');
    tip.dataset.owner = 'line';
    tipB.textContent = d.x[i];
    tipS.innerHTML = d.s.map((s, k) =>
      `<span class="tip__row"><i style="background:var(--series-${k + 1})"></i>${s}<em>${d.v[k][i]}</em></span>`).join('');
    tip.hidden = false; place(e);
  });
  box.addEventListener('pointerleave', () => {
    box.classList.remove('is-hover'); delete tip.dataset.owner; tip.hidden = true;
  });
});

/* ── Gradient map tuning (temporary review controls) ─────────────── */
// Labels, steps and which modes use each parameter. Ranges and defaults come
// from the embed itself (PARAMS), so the sliders can't drift from it.
const TUNE: Record<string, { label: string; step: number; modes?: string[] }> = {
  speed:   { label: 'Speed', step: 0.05 },
  drift:   { label: 'Drift', step: 0.01 },
  flow:    { label: 'Flow', step: 0.01 },
  edge:    { label: 'Edge', step: 0.05, modes: ['overlap', 'layers', 'clouds'] },
  size:    { label: 'Size', step: 0.05, modes: ['layers', 'clouds'] },
  cover:   { label: 'Cover', step: 0.5, modes: ['layers', 'clouds'] },
  soft:    { label: 'Soft share', step: 0.05, modes: ['clouds'] },
  billow:  { label: 'Billow', step: 0.1, modes: ['clouds'] },
  opacity: { label: 'Min opacity', step: 0.05, modes: ['clouds'] },
};

document.querySelectorAll<HTMLElement>('[data-tune]').forEach(async panel => {
  const mesh = panel.parentElement!.querySelector('om-mesh')!;
  // Read off the element class: Vite can't import from /public.
  await customElements.whenDefined('om-mesh');
  const PARAMS = (customElements.get('om-mesh') as unknown as { PARAMS: Record<string, { min: number; max: number; def: number }> }).PARAMS;
  const modes = [...panel.querySelectorAll<HTMLButtonElement>('[data-mode]')];
  const host = panel.querySelector<HTMLElement>('[data-sliders]')!;
  const fmt = (v: number, step: number) => v.toFixed(step < 0.1 ? 2 : 1);

  const rows = Object.entries(TUNE).map(([k, t]) => {
    const d = PARAMS[k];
    const cur = parseFloat(mesh.getAttribute(k) ?? '');
    const v = Number.isFinite(cur) ? cur : d.def;
    const label = document.createElement('label');
    label.innerHTML = `<span>${t.label}</span><input type="range" min="${d.min}" max="${d.max}" step="${t.step}" value="${v}"><output>${fmt(v, t.step)}</output>`;
    const input = label.querySelector('input')!, out = label.querySelector('output')!;
    input.addEventListener('input', () => { mesh.setAttribute(k, input.value); out.value = fmt(Number(input.value), t.step); });
    host.append(label);
    return { k, t, input, label };
  });

  const paint = () => {
    const m = mesh.getAttribute('mode') ?? 'smooth';
    modes.forEach(b => b.setAttribute('aria-checked', String(b.dataset.mode === m)));
    rows.forEach(r => { const off = !!r.t.modes && !r.t.modes.includes(m); r.input.disabled = off; r.label.classList.toggle('is-off', off); });
  };
  modes.forEach(b => b.addEventListener('click', () => { mesh.setAttribute('mode', b.dataset.mode!); paint(); }));

  // The current look as element attributes, ready to paste back.
  const copy = panel.querySelector<HTMLButtonElement>('[data-copy]')!;
  copy.addEventListener('click', async () => {
    const attrs = [`mode="${mesh.getAttribute('mode') ?? 'smooth'}"`, ...rows.map(r => `${r.k}="${r.input.value}"`)].join(' ');
    try { await navigator.clipboard.writeText(attrs); copy.textContent = 'Copied'; }
    catch { window.prompt('Copy these settings:', attrs); }
    setTimeout(() => { copy.textContent = 'Copy settings'; }, 1500);
  });
  paint();
});

/* ── Mode adjust panel ────────────────────────────────────────────── */

{
  const panel = document.querySelector<HTMLElement>('[data-adj]')!;
  const openBtn = document.querySelector<HTMLButtonElement>('[data-adj-open]')!;
  const data = JSON.parse(document.getElementById('pal-data')!.textContent!);
  const follow = () => (window as unknown as { __omFollow?: () => void }).__omFollow?.();
  const adj = initAdjust(data, () => { follow(); render(); });
  const other = (m: 'light' | 'dark') => (m === 'light' ? 'dark' : 'light');

  panel.innerHTML = `
    <div class="adj__head"><b>Mode adjust</b><button type="button" class="adj__x" data-adj-close aria-label="Close">×</button></div>
    <p class="adj__mode"></p>
    <div class="adj__seg" role="radiogroup" aria-label="Scope">${SCOPES.map(sc => `<button type="button" role="radio" data-scope="${sc.id}">${sc.label}</button>`).join('')}</div>
    <div class="adj__sliders">${SLIDERS.map(sl => `<label><span>${sl.label}</span><input type="range" data-k="${sl.k}" min="${sl.min}" max="${sl.max}" step="${sl.step}"><output></output></label>`).join('')}</div>
    <div class="adj__actions">
      <button type="button" data-adj-compare aria-pressed="false">Show original</button>
      <button type="button" data-adj-reset>Reset this mode</button>
      <button type="button" data-adj-copy>Copy settings</button>
    </div>
    <p class="adj__other"></p>
    <table class="adj__audit"><thead><tr><th>Hue</th><th>Text</th><th>Key</th><th>Label</th></tr></thead><tbody></tbody></table>
    <p class="adj__note">Live contrast in this mode. Text: fg on its worst surface (4.5). Key: vs base (3.0). Label: on solid (4.5).</p>`;

  const inputs = [...panel.querySelectorAll<HTMLInputElement>('input[data-k]')];
  const scopes = [...panel.querySelectorAll<HTMLButtonElement>('[data-scope]')];

  function render() {
    if (panel.hidden) return;
    const m = adj.mode(), a = adj.state[m];
    panel.querySelector('.adj__mode')!.innerHTML = `Adjusting <b>${m}</b> mode${m === 'dark' ? ' — the reference; usually left at zero' : ' — dark is the reference'}.`;
    inputs.forEach(inp => {
      const sl = SLIDERS.find(x => x.k === inp.dataset.k)!;
      inp.value = String(a[sl.k]);
      (inp.nextElementSibling as HTMLOutputElement).value = sl.fmt(a[sl.k]);
    });
    scopes.forEach(b => b.setAttribute('aria-checked', String(b.dataset.scope === a.scope)));
    panel.querySelector('.adj__other')!.textContent = `${other(m)[0].toUpperCase() + other(m).slice(1)} mode: ${adj.describe(adj.state[other(m)])}`;
    const cmp = panel.querySelector<HTMLButtonElement>('[data-adj-compare]')!;
    cmp.setAttribute('aria-pressed', String(adj.showOriginal));
    cmp.textContent = adj.showOriginal ? 'Show adjusted' : 'Show original';
    panel.querySelector('tbody')!.innerHTML = adj.audit().map(r =>
      `<tr><td>${r.hue}</td>${[[r.fg, 4.5], [r.key, 3], [r.label, 4.5]].map(([v, min]) => `<td class="${v < min ? 'bad' : ''}">${v.toFixed(2)}</td>`).join('')}</tr>`).join('');
  }

  inputs.forEach(inp => inp.addEventListener('input', () => {
    // Read first: leaving "show original" re-renders the panel from state.
    const v = Number(inp.value);
    if (adj.showOriginal) adj.showOriginal = false;
    adj.set(adj.mode(), { [inp.dataset.k!]: v });
  }));
  scopes.forEach(b => b.addEventListener('click', () => { if (adj.showOriginal) adj.showOriginal = false; adj.set(adj.mode(), { scope: b.dataset.scope! }); }));
  panel.querySelector('[data-adj-compare]')!.addEventListener('click', () => { adj.showOriginal = !adj.showOriginal; });
  panel.querySelector('[data-adj-reset]')!.addEventListener('click', () => adj.reset(adj.mode()));
  const copy = panel.querySelector<HTMLButtonElement>('[data-adj-copy]')!;
  copy.addEventListener('click', async () => {
    const text = `${adj.copyText()}\n${location.href}`;
    try { await navigator.clipboard.writeText(text); copy.textContent = 'Copied'; } catch { window.prompt('Copy these settings:', text); }
    setTimeout(() => { copy.textContent = 'Copy settings'; }, 1500);
  });

  const setOpen = (open: boolean) => { panel.hidden = !open; openBtn.setAttribute('aria-expanded', String(open)); if (open) render(); };
  openBtn.addEventListener('click', () => setOpen(panel.hidden));
  panel.querySelector('[data-adj-close]')!.addEventListener('click', () => { setOpen(false); openBtn.focus(); });
  // The panel edits whichever mode is on screen; follow the toggle.
  new MutationObserver(render).observe(html, { attributes: true, attributeFilter: ['data-theme', 'data-p'] });
  // Arriving with offsets in the link: open the panel so they're visible.
  if (new URLSearchParams(location.search).has('ml') || new URLSearchParams(location.search).has('md')) setOpen(true);
}
