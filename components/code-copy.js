/**
 * Code copy (components/code-copy.css, design/components/code-block.md): adds a
 * copy button to each code block. Safe to call again.
 *
 *   import { codeCopy } from './code-copy.js';
 *   codeCopy();             // every pre.code-block
 */
const COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 20H9.6a.6.6 0 0 1-.6-.6V9.6a.6.6 0 0 1 .6-.6h9.8a.6.6 0 0 1 .6.6v9.8a.6.6 0 0 1-.6.6Z"/><path d="M15 9V4.6a.6.6 0 0 0-.6-.6H4.6a.6.6 0 0 0-.6.6v9.8a.6.6 0 0 0 .6.6H9"/></svg>';
export function codeCopy(selector = 'pre.code-block') {
  document.querySelectorAll(selector).forEach(pre => {
    if (pre.querySelector('.code-block__copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-block__copy';
    btn.innerHTML = `${COPY}<span>Copy</span>`;
    btn.setAttribute('aria-label', 'Copy code');
    btn.addEventListener('click', async () => {
      const text = (pre.querySelector('code') ?? pre).textContent.trim();
      try { await navigator.clipboard.writeText(text); } catch { return; }
      btn.lastElementChild.textContent = 'Copied';
      setTimeout(() => { btn.lastElementChild.textContent = 'Copy'; }, 2000);
    });
    pre.append(btn);
  });
}
