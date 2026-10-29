/** /omds.js — every component script as one ES module (src/lib/serve.ts). */
import { omdsJs, respond } from '../lib/serve';
export const GET = async () => respond(await omdsJs(), 'js');
