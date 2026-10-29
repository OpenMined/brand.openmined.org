/** /tokens/omds.* — the v2 token build (src/tokens/v2/), stamped. v1's files at
 *  /tokens/tokens.css etc. stay as they were (public/tokens, copied at prebuild). */
import type { GetStaticPaths } from 'astro';
import { read, respond, stamped } from '../../lib/serve';

const FILES: Record<string, string> = {
  'omds.css': 'tokens.css', 'omds.light.json': 'tokens.light.json', 'omds.dark.json': 'tokens.dark.json', 'omds.colors.js': 'brand-colors.js',
};
export const getStaticPaths = (() => Object.keys(FILES).map(file => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET = ({ params }: { params: { file: string } }) => {
  const ext = params.file.split('.').pop()!;
  const text = read(`src/tokens/v2/${FILES[params.file]}`);
  return respond(ext === 'json' ? text : stamped(text, ext as 'css' | 'js'), ext);
};
