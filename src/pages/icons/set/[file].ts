/** /icons/set/<name>.svg — every icon in the v2 set at 24px with its stroke, ready to
 *  inline (src/lib/icons.ts); /icons/set/index.json lists them. Partner marks are fills. */
import type { GetStaticPaths } from 'astro';
import { ICONS, iconSvg } from '../../../lib/icons';
import { respond } from '../../../lib/serve';

export const getStaticPaths = (() => [
  ...Object.keys(ICONS).map(name => ({ params: { file: `${name}.svg` } })),
  { params: { file: 'index.json' } },
]) satisfies GetStaticPaths;

export const GET = ({ params }: { params: { file: string } }) => {
  if (params.file === 'index.json') return respond(JSON.stringify({
    about: 'The OpenMined icon set: Iconoir regular plus our own drawings and partner marks. Use only these names. Each SVG is drawn on a 24 grid in currentColor at 24px with a 2px stroke. At another size set width and height, and keep the drawn line at 2px: stroke-width 2 up to 24px, then 48 ÷ size (1.5 at 32px, 1 at 48px), set on the svg element (--icon-stroke).',
    icons: Object.entries(ICONS).map(([name, e]) => ({ name, url: `/icons/set/${name}.svg`, source: e.src, style: e.style ?? 'line' })),
  }, null, 2), 'json');
  return new Response(iconSvg(params.file.replace(/\.svg$/, ''), { size: 24 }), { headers: { 'Content-Type': 'image/svg+xml' } });
};
