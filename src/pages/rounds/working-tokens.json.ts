/** Download: the working favorites as W3C design tokens (one set per mode). */
import { tokensJson } from './_working';
export const GET = () => new Response(tokensJson(), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
