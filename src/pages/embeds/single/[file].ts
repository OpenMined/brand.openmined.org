/** /embeds/single/<name>.js — each <om-*> embed as one file, its colors inlined: paste it
 *  into a Claude artifact or anywhere that can't load a second file (src/lib/serve.ts). */
import type { GetStaticPaths } from 'astro';
import { respond, singleEmbed, walk } from '../../../lib/serve';

export const getStaticPaths = (() =>
  walk('public/embeds', f => /^om-.*\.js$/.test(f)).map(file => ({ params: { file } }))) satisfies GetStaticPaths;

export const GET = async ({ params }: { params: { file: string } }) => respond(await singleEmbed(params.file), 'js');
