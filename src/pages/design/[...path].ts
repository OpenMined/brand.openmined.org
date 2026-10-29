/** /design/<path>.md — every guidance file as Markdown, frontmatter included, the
 *  same files the pages are built from; /design/index.json lists them with their
 *  type, status, tags and the tokens each governs (src/lib/serve.ts, src/lib/design.ts). */
import type { GetStaticPaths } from 'astro';
import { DOCS } from '../../lib/design';
import { HOST, SHA, VERSION, read, respond, walk } from '../../lib/serve';

export const getStaticPaths = (() => [
  ...walk('design', f => f.endsWith('.md')).map(path => ({ params: { path } })),
  { params: { path: 'index.json' } },
]) satisfies GetStaticPaths;

const day = (d: unknown) => (d instanceof Date ? d.toISOString() : d ? String(d) : undefined)?.slice(0, 10);
const index = () => JSON.stringify({
  version: VERSION, commit: SHA,
  files: [...DOCS].filter(d => d.status !== 'draft').sort((a, b) => a.path.localeCompare(b.path)).map(d => ({
    path: d.path, url: `${HOST}/design/${d.path}`, type: d.type, title: d.title, description: d.description,
    status: d.status, tags: d.tags, tokens: d.tokens, ...(d.data.date ? { date: day(d.data.date) } : {}),
  })),
}, null, 2);

export const GET = ({ params }: { params: { path: string } }) =>
  params.path === 'index.json' ? respond(index(), 'json') : respond(read(`design/${params.path}`), 'md');
