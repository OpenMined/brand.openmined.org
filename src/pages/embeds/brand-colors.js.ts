/** /embeds/brand-colors.js — the colors the <om-*> embeds draw with, generated from the
 *  v2 token build (src/lib/serve.ts, brandColorsJs). Same exports as v1's hand-kept file. */
import { brandColorsJs, respond } from '../../lib/serve';
export const GET = () => respond(brandColorsJs(), 'js');
