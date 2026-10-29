/**
 * Table of contents (components/toc.css, design/components/toc.md): marks the
 * link of the section being read (aria-current), as the page scrolls. Safe to
 * call again.
 *
 *   import { toc } from './toc.js';
 *   toc();                  // every .toc
 */
export function toc(selector = '.toc') {
  document.querySelectorAll(selector).forEach(nav => {
    if (nav.dataset.tocReady) return;
    nav.dataset.tocReady = '1';
    const links = [...nav.querySelectorAll('.toc__link[href^="#"]')];
    const targets = links.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    if (!targets.length) return;
    const mark = () => {
      // The current section: the last heading above a line a third down the window.
      const line = window.innerHeight / 3;
      let i = 0;
      targets.forEach((t, j) => { if (t.getBoundingClientRect().top <= line) i = j; });
      links.forEach((a, j) => (j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    };
    let raf = 0;
    window.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
    mark();
  });
}
