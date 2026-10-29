/** /manifest.json — version, commit and every file the site serves for people and
 *  agents (src/lib/serve.ts). */
import { DOCS } from '../lib/design';
import { ICONS } from '../lib/icons';
import { HOST, SHA, VERSION, respond, walk } from '../lib/serve';

export const GET = () => respond(JSON.stringify({
  name: 'OpenMined Design System', version: VERSION, commit: SHA, host: HOST,
  entry: { agents: '/AGENTS.md', llms: '/llms.txt' },
  bundles: { css: '/omds.css', js: '/omds.js' },
  tokens: { css: '/tokens/omds.css', light: '/tokens/omds.light.json', dark: '/tokens/omds.dark.json', colors: '/tokens/omds.colors.js', source: walk('tokens', f => f.endsWith('.json')).map(f => `/tokens/source/${f}`) },
  components: walk('components', f => /\.(css|js|md)$/.test(f)).map(f => `/components/${f}`),
  design: { index: '/design/index.json', files: DOCS.map(d => `/design/${d.path}`).sort() },
  icons: { index: '/icons/set/index.json', count: Object.keys(ICONS).length },
  embeds: walk('public/embeds', f => f.endsWith('.js')).map(f => `/embeds/${f}`),
  feedback: 'https://github.com/OpenMined/brand.openmined.org/issues/new?template=feedback.yml',
}, null, 2), 'json');
