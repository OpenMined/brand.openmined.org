/**
 * MENU (components/menu.css, design/components/menu.md). Needs anchor.js. Each
 * .menu[popover] is placed below the button that opens it (popovertarget) and follows it on
 * scroll; on open, focus goes to the current or checked item, else the first; the arrow keys,
 * Home and End move between items, Tab closes it; a click on a pick-one item
 * (role="menuitemradio") checks it, shows it in the button's .menu__current (its dot and name),
 * closes the menu and sends "menupick" with its value. The button's aria-expanded follows. The browser opens and closes it (Escape, a click outside).
 * Safe to call again.
 *
 *   import { menus } from './menu.js';
 *   menus();                // every .menu[popover]
 *   menu.addEventListener('menupick', (e) => e.detail.value);
 */
import { anchor } from './anchor.js';

export function menus(list = '.menu[popover]') {
  if (typeof list === 'string') list = document.querySelectorAll(list);
  for (const menu of list) {
    if (menu.dataset.menuReady || !menu.id) continue;
    const opener = document.querySelector(`[popovertarget="${menu.id}"]`);
    if (!opener) continue;
    menu.dataset.menuReady = '1';
    opener.setAttribute('aria-expanded', 'false');
    const items = () => [...menu.querySelectorAll('.menu__item:not([disabled])')];
    // The current value, shown in the button: every option's dot and name, stacked (CSS shows only
    // the checked one), so the button is as wide as the longest and a pick never moves it.
    const current = opener.querySelector('.menu__current');
    const picks = [...menu.querySelectorAll('.menu__item[role="menuitemradio"]')];
    if (current && picks.length) {
      current.replaceChildren(...picks.map((item) => {
        const v = document.createElement('span');
        for (const n of [item.querySelector('.status-dot'), item.querySelector('.menu__name')]) {
          if (!n) continue;
          const c = n.cloneNode(true);
          if (c.classList.contains('menu__name')) c.className = '';
          v.append(c);
        }
        return v;
      }));
    }
    const show = () => {
      if (!current) return;
      picks.forEach((item, i) => current.children[i]?.toggleAttribute('data-current', item.getAttribute('aria-checked') === 'true'));
    };
    show();
    let stop = null;
    menu.addEventListener('toggle', (e) => {
      const open = e.newState === 'open';
      opener.setAttribute('aria-expanded', String(open));
      if (open) {
        stop = anchor(menu, opener, { side: 'bottom', align: 'start', overhang: 0 });
        const all = items();
        (all.find((i) => i.matches('[aria-current]:not([aria-current="false"]), [aria-checked="true"]')) ?? all[0])?.focus();
      } else { stop?.(); stop = null; }
    });
    opener.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && !menu.matches(':popover-open')) { e.preventDefault(); menu.showPopover(); }
    });
    menu.addEventListener('keydown', (e) => {
      const all = items();
      const i = all.indexOf(document.activeElement);
      const go = (n) => { e.preventDefault(); all[(n + all.length) % all.length]?.focus(); };
      if (e.key === 'ArrowDown') go(i + 1);
      else if (e.key === 'ArrowUp') go(i - 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(all.length - 1);
      else if (e.key === 'Tab') menu.hidePopover();
    });
    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.menu__item[role="menuitemradio"]');
      if (!item) return;
      for (const i of items()) if (i.getAttribute('role') === 'menuitemradio') i.setAttribute('aria-checked', String(i === item));
      show();
      menu.dispatchEvent(new CustomEvent('menupick', { detail: { value: item.value ?? item.dataset.value } }));
      menu.hidePopover();
      opener.focus();
    });
  }
}
