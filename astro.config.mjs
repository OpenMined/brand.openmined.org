import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://design.openmined.org',
  vite: {
    resolve: {
      alias: {
        '@tokens': path.join(root, 'src/tokens'),
        '@brand':  path.join(root, 'src/components'),
        // v2 components (CSS and plain JS modules), the source at the repo root.
        '@components': path.join(root, 'components'),
      },
    },
  },
});
