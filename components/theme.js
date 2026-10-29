/**
 * Color mode (design/behaviors/color-modes.md): the page's light or dark mode
 * on <html data-theme>, remembered per browser, starting from the system's
 * setting. A switch (control.css .switch) with data-theme-toggle flips it and
 * shows the mode (on = dark). Safe to call again.
 *
 *   <button type="button" class="switch" role="switch" aria-checked="false" aria-label="Dark mode" data-theme-toggle>
 *     <span class="switch__knob"></span>
 *   </button>
 *
 *   import { themeInit, themeToggle } from './theme.js';
 *   themeInit();            // as early as possible (in <head>, to avoid a flash)
 *   themeToggle();          // every [data-theme-toggle]
 */
const KEY = 'omds-theme';
const html = () => document.documentElement;
const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const set = v => { try { localStorage.setItem(KEY, v); } catch { /* private mode: not remembered */ } };

export function themeInit() {
  const stored = get();
  const system = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html().setAttribute('data-theme', stored === 'dark' || stored === 'light' ? stored : system);
}

const sync = () => document.querySelectorAll('[data-theme-toggle]').forEach(el =>
  el.setAttribute('aria-checked', String(html().getAttribute('data-theme') === 'dark')));

export function themeToggle(selector = '[data-theme-toggle]') {
  if (!html().hasAttribute('data-theme')) themeInit();
  document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.themeReady) return;
    el.dataset.themeReady = '1';
    el.addEventListener('click', () => {
      const next = html().getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html().setAttribute('data-theme', next);
      set(next);
      sync();
    });
  });
  sync();
}
