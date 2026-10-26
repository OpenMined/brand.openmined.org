/**
 * Card tilt (components/hover-card.md): on hover a card leans away under the
 * pointer, in 3D. Set as a distortion, not an angle, so cards of any size read
 * alike: at full pointer travel the near edge looks --card-tilt-keystone %
 * longer than the far edge on a 320px card, easing on larger cards (× (size /
 * 320) ^ --card-tilt-falloff, size = the longer side); each axis takes the
 * angle that gives that keystone at its own length under the perspective, and
 * --card-tilt-max caps thin cards. The same math as the page reviews' port of
 * openmined.org's card tilt (PORT in its Base.astro). CSS reads --card-tilt-x/-y;
 * pointer devices only, never under reduced motion.
 */
export function cardTilt(card: HTMLElement) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let latest: PointerEvent | null = null, raf = 0;
  const paint = () => {
    raf = 0;
    const e = latest, r = card.getBoundingClientRect();
    if (!e || !r.width || !r.height) return;
    const cs = getComputedStyle(card);
    const max = parseFloat(cs.getPropertyValue('--card-tilt-max')) || 0;
    if (!max) return;
    const persp = parseFloat(cs.getPropertyValue('--card-tilt-perspective')) || 1000;
    const k = ((parseFloat(cs.getPropertyValue('--card-tilt-keystone')) || 0) / 100) *
      (Math.max(r.width, r.height) / 320) ** (parseFloat(cs.getPropertyValue('--card-tilt-falloff')) || 0);
    // Edges at ±len/2 under rotation a: keystone = len·sin a / (persp − len/2·sin a).
    const angle = (len: number) => Math.min(max, (Math.asin(Math.min(1, (2 * k * persp) / (len * (2 + k)))) * 180) / Math.PI);
    // Pointer position within the card, -1 … 1; the card presses away under it.
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    card.style.setProperty('--card-tilt-y', `${(nx * angle(r.width)).toFixed(2)}deg`);
    card.style.setProperty('--card-tilt-x', `${(-ny * angle(r.height)).toFixed(2)}deg`);
    // The fast track only while tracking; on leave the card settles on the usual ease.
    card.style.setProperty('--card-tilt-transition', 'var(--card-tilt-track)');
  };
  card.addEventListener('pointermove', (e) => { latest = e; if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
  card.addEventListener('pointerleave', () => {
    latest = null;
    ['--card-tilt-x', '--card-tilt-y', '--card-tilt-transition'].forEach((p) => card.style.removeProperty(p));
  });
}
