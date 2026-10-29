/** /AGENTS.md — the repo's AGENTS.md, served (the site is the entry point). */
import { read, respond } from '../lib/serve';
export const GET = () => respond(read('AGENTS.md'), 'md');
