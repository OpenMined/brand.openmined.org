/** /components/<file> — each component file as in the repo's components/ (src/lib/serve.ts). */
import type { GetStaticPaths } from 'astro';
import { read, respond, stamped, walk } from '../../lib/serve';

export const getStaticPaths = (() =>
  walk('components', f => /\.(css|js|md)$/.test(f)).map(file => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET = ({ params }: { params: { file: string } }) => {
  const ext = params.file.split('.').pop()!;
  const text = read(`components/${params.file}`);
  return respond(ext === 'md' ? text : stamped(text, ext as 'css' | 'js'), ext);
};
