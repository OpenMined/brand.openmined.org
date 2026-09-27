/** Download: the working favorites as CSS custom properties. */
import { tokensCss } from './_working';
export const GET = () => new Response(tokensCss(), { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
