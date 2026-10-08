/** Download: the v2 working values, resolved per mode (the build's own JSON). */
import LIGHT from '../../tokens/v2/tokens.light.json';
import DARK from '../../tokens/v2/tokens.dark.json';
export const GET = () => new Response(JSON.stringify({ light: LIGHT, dark: DARK }, null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
