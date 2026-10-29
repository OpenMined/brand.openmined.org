/**
 * Tabs (components/tabs.css, design/components/tabs.md): shows the selected
 * tab's panel and hides the rest, wires the ARIA ids and the arrow keys (left,
 * right, Home, End). Panels pair with tabs in order. Safe to call again.
 *
 *   import { tabs } from './tabs.js';
 *   tabs();                 // every [data-tabs]
 */
let n = 0;
export function tabs(selector = '[data-tabs]') {
  document.querySelectorAll(selector).forEach(root => {
    if (root.dataset.tabsReady) return;
    root.dataset.tabsReady = '1';
    const list = [...root.querySelectorAll(':scope > .tabs__list > .tabs__tab')];
    const panels = [...root.querySelectorAll(':scope > .tabs__panel')];
    const base = root.id || `tabs-${++n}`;
    const select = (i, focus) => list.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (panels[j]) panels[j].hidden = !on;
      if (on && focus) t.focus();
    });
    list.forEach((t, i) => {
      t.id ||= `${base}-tab-${i}`;
      if (panels[i]) {
        panels[i].id ||= `${base}-panel-${i}`;
        panels[i].setAttribute('aria-labelledby', t.id);
        panels[i].tabIndex = 0;
        t.setAttribute('aria-controls', panels[i].id);
      }
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: list.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        select((k + list.length) % list.length, true);
      });
    });
    select(Math.max(0, list.findIndex(t => t.getAttribute('aria-selected') === 'true')));
  });
}
