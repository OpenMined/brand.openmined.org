/**
 * COLOR ROUND — controls, URL state, and the hover layer.
 *
 * State lives on <html> as data-p / data-a / data-gr / data-theme, set
 * before paint by the inline script in index.astro. This module only
 * changes those attributes and mirrors them into the URL, so any
 * combination is a link that can be passed back and forth for review.
 */

const html = document.documentElement;
const AXES = ['p', 'a'] as const;
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
