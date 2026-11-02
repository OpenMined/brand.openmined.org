/**
 * Click to copy, for this site. Any element with data-copy copies a value on click,
 * or on Enter or Space when it has keyboard focus:
 *   data-copy="--surface-raise-1"                  that text
 *   data-copy                                       the element's own text
 *   data-copy-light="#c9acff" data-copy-dark="…"    the value for the mode in view
 * One tooltip serves them all, so an element needs no design of its own: "Copy to
 * clipboard" on hover and keyboard focus, "Copied" for a moment after copying, then
 * it fades. The cursor is the pointer (site.css). Screen readers hear "Copied"
 * and the value. Safe to call again: each element is set up once.
 */
const COPIED_MS = 1200;
let tip: HTMLElement | null = null;
let live: HTMLElement | null = null;
let timer = 0;

const valueOf = (el: HTMLElement) => {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const byMode = dark ? el.dataset.copyDark : el.dataset.copyLight;
  return (byMode ?? el.dataset.copy ?? '') || el.textContent?.trim() || '';
};

const place = (el: HTMLElement) => {
  if (!tip) return;
  const r = el.getBoundingClientRect();
  const above = r.top > 40;
  tip.style.left = `${r.left + r.width / 2}px`;
  tip.style.top = `${above ? r.top : r.bottom}px`;
  tip.classList.toggle('is-below', !above);
};

const show = (el: HTMLElement, text: string) => {
  if (!tip) return;
  tip.textContent = text;
  place(el);
  tip.classList.add('is-on');
};

const hide = () => { tip?.classList.remove('is-on'); };

const copy = async (el: HTMLElement) => {
  const value = valueOf(el);
  if (!value) return;
  try { await navigator.clipboard.writeText(value); } catch { return; }
  show(el, 'Copied');
  if (live) live.textContent = `Copied ${value}`;
  clearTimeout(timer);
  timer = window.setTimeout(hide, COPIED_MS);
};

export function copyOnClick(selector = '[data-copy], [data-copy-light]') {
  if (!tip) {
    tip = Object.assign(document.createElement('div'), { className: 'copy-tip' });
    tip.setAttribute('aria-hidden', 'true');
    live = Object.assign(document.createElement('p'), { className: 'visually-hidden' });
    live.setAttribute('aria-live', 'polite');
    document.body.append(tip, live);
    window.addEventListener('scroll', hide, { passive: true });
  }
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (el.dataset.copyReady) return;
    el.dataset.copyReady = '';
    if (!el.matches('a, button')) { el.tabIndex = 0; el.setAttribute('role', 'button'); }
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', `Copy ${valueOf(el)}`);
    const hint = () => { clearTimeout(timer); show(el, 'Copy to clipboard'); };
    el.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') hint(); });
    el.addEventListener('pointerleave', () => { if (tip?.textContent !== 'Copied') hide(); });
    el.addEventListener('focus', () => { if (el.matches(':focus-visible')) hint(); });
    el.addEventListener('blur', hide);
    el.addEventListener('click', () => copy(el));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(el); } });
  });
}
