/**
 * Button hover: color in motion (src/styles/button-hover.css). Adds the glow and
 * fill layers to each button and moves the pointer light. Skips disabled buttons,
 * pressed toggles (aria-pressed) and buttons that already draw their own layers
 * (the motion round's .mbtn). Exploring.
 */
const LAYER = (k: string, light = false) =>
  `<span class="btn-flow btn-flow--${k}" aria-hidden="true"><i></i><i></i><i></i>${light ? '<b class="btn-flow__light"></b>' : ''}</span>`;

export function buttonHover(selector = '.btn') {
  document.querySelectorAll<HTMLElement>(selector).forEach((btn) => {
    if (btn.classList.contains('has-flow') || btn.classList.contains('mbtn') || btn.matches('[disabled], [aria-disabled="true"], [aria-pressed]')) return;
    btn.classList.add('has-flow');
    // The fill covers the button's own border, whatever its width.
    btn.style.setProperty('--flow-inset', `-${getComputedStyle(btn).borderTopWidth}`);
    btn.insertAdjacentHTML('afterbegin', LAYER('glow') + LAYER('fill', true));
    // The light eases toward the pointer each frame, so it trails a little.
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const step = () => {
      x += (tx - x) * 0.15; y += (ty - y) * 0.15;
      btn.style.setProperty('--mx', `${x}px`); btn.style.setProperty('--my', `${y}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(step) : 0;
    };
    btn.addEventListener('pointerenter', (e) => { const r = btn.getBoundingClientRect(); x = tx = e.clientX - r.left; y = ty = e.clientY - r.top; step(); });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(step);
    });
  });
}
