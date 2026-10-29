/** /omds.css — tokens and every component in one stylesheet (src/lib/serve.ts). */
import { omdsCss, respond } from '../lib/serve';
export const GET = () => respond(omdsCss(), 'css');
