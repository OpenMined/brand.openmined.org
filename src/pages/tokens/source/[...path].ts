/** /tokens/source/… — the token source in the open Design Tokens format (2025.10):
 *  resolver.json and the files it names, for token tools (src/lib/serve.ts). */
import type { GetStaticPaths } from 'astro';
import { read, respond, walk } from '../../../lib/serve';

export const getStaticPaths = (() =>
  walk('tokens', f => f.endsWith('.json')).map(path => ({ params: { path } }))) satisfies GetStaticPaths;

export const GET = ({ params }: { params: { path: string } }) => respond(read(`tokens/${params.path}`), 'json');
