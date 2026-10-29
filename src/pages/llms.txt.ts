/** /llms.txt — the entry point for AI tools (llmstxt.org): what this is, where every
 *  file is, every guidance file by kind with its one-line description. */
import { DOCS } from '../lib/design';
import { EXAMPLES } from '../lib/examples';
import { HOST, STAMP, respond } from '../lib/serve';

const KINDS: [string, string][] = [
  ['overview', 'Start here'], ['foundations/', 'Foundations'], ['components/', 'Components'], ['patterns/', 'Patterns'],
  ['behaviors/', 'Behaviors'], ['guidelines/', 'Guidelines'], ['decisions/', 'Decisions'],
];
const line = (d: (typeof DOCS)[number]) => `- [${d.title}](${HOST}/design/${d.path}): ${d.description}${d.status === 'deprecated' ? ' (deprecated)' : ''}`;

export const GET = () => {
  const out = [
    '# OpenMined Design System',
    '',
    "> OpenMined's shared source for how it looks: tokens (colors, type, spacing, surfaces), components as plain CSS and JavaScript, guidance and decisions, icons, logos and graphics. For web pages, Claude artifacts, dashboards, slides, documents and graphics.",
    '',
    `Read ${HOST}/AGENTS.md first: which files to take, the rules that matter most, Claude artifacts, and how to give feedback. Take the code as it is; don't rebuild it from a description. ${STAMP}.`,
    '',
    '## Files',
    '',
    `- [AGENTS.md](${HOST}/AGENTS.md): how to use the system as an AI agent`,
    `- [omds.css](${HOST}/omds.css): tokens and every component, one stylesheet`,
    `- [omds.js](${HOST}/omds.js): every component script, one ES module (the full interactive layer)`,
    `- [Tokens](${HOST}/tokens/omds.css): CSS custom properties, light and dark; resolved values in [light](${HOST}/tokens/omds.light.json) and [dark](${HOST}/tokens/omds.dark.json)`,
    `- [Token source](${HOST}/tokens/source/resolver.json): Design Tokens format 2025.10, for token tools`,
    `- [Components](${HOST}/components/README.md): one CSS file per component, the markup at the top of each`,
    `- [Claude artifact starter](${HOST}/starter/artifact.html): one self-contained file, everything inlined ([with motion](${HOST}/starter/artifact-full.html))`,
    `- [Brand graphics](${HOST}/embeds/single/om-stream.js): the <om-*> web components as one file each (om-diamond.js, om-stream.js, om-mesh.js in /embeds/single/)`,
    `- [Icons](${HOST}/icons/set/index.json): the icon set, one SVG per name`,
    `- [Guidance index](${HOST}/design/index.json): every guidance file with its type, status, tags and tokens`,
    `- [Manifest](${HOST}/manifest.json): version, commit and every served file`,
  ];
  for (const [prefix, label] of KINDS) {
    const docs = DOCS.filter(d => (prefix === 'overview' ? ['overview.md', 'coverage.md'].includes(d.path) : d.path.startsWith(prefix)) && d.status !== 'draft')
      .sort((a, b) => a.path.localeCompare(b.path));
    if (!docs.length) continue;
    out.push('', `## ${label}`, '', ...docs.map(line));
  }
  out.push('', '## Examples', '', 'Self-contained pages built only from the served files. Open one and copy its source.', '',
    ...EXAMPLES.map(e => `- [${e.title}](${HOST}/examples/${e.slug}/): ${e.description}`));
  return respond(out.join('\n') + '\n', 'txt');
};
