/**
 * Code copy (components/code-copy.css, design/components/code-block.md): adds a
 * copy button to each code block. Safe to call again.
 *
 *   import { codeCopy } from './code-copy.js';
 *   codeCopy();             // every pre.code-block
 */
const ICON = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const COPY = ICON('<path d="M19.4 20H9.6a.6.6 0 0 1-.6-.6V9.6a.6.6 0 0 1 .6-.6h9.8a.6.6 0 0 1 .6.6v9.8a.6.6 0 0 1-.6.6Z"/><path d="M15 9V4.6a.6.6 0 0 0-.6-.6H4.6a.6.6 0 0 0-.6.6v9.8a.6.6 0 0 0 .6.6H9"/>');
const CHECK = ICON('<path d="M5 13l4 4L19 7"/>');
export function codeCopy(selector = 'pre.code-block') {
  document.querySelectorAll(selector).forEach(pre => {
    if (pre.querySelector('.code-block__copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-block__copy';
    btn.innerHTML = COPY;
    btn.setAttribute('aria-label', 'Copy code');
    btn.title = 'Copy code';
    let timer = 0;
    btn.addEventListener('click', async () => {
      const text = (pre.querySelector('code') ?? pre).textContent.trim();
      try { await navigator.clipboard.writeText(text); } catch { return; }
      btn.innerHTML = CHECK; btn.classList.add('is-copied'); btn.setAttribute('aria-label', 'Copied');
      clearTimeout(timer);
      timer = setTimeout(() => { btn.innerHTML = COPY; btn.classList.remove('is-copied'); btn.setAttribute('aria-label', 'Copy code'); }, 2000);
    });
    pre.append(btn);
  });
}
