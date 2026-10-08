/** Download: the v2 working values as CSS custom properties (the build's own file). */
import { V2_CSS } from './_working';
export const GET = () => new Response(V2_CSS, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
