/**
 * /starter/artifact.html and /starter/artifact-full.html — one self-contained HTML
 * file to start a Claude artifact (or any page that can't load other files): the
 * tokens and every component inlined, fonts from Google Fonts (which artifacts
 * allow), the color mode following the system. -full also inlines every script
 * (the full interactive layer); the plain one is the minimal layer, no script for
 * motion. Replace the body; keep the head.
 */
import type { GetStaticPaths } from 'astro';
import { HOST, STAMP, omdsCss, omdsStartJs, respond } from '../../lib/serve';

export const getStaticPaths = (() => [{ params: { file: 'artifact.html' } }, { params: { file: 'artifact-full.html' } }]) satisfies GetStaticPaths;

export const GET = async ({ params }: { params: { file: string } }) => {
  const full = params.file === 'artifact-full.html';
  const js = full ? await omdsStartJs() : '';
  const html = `<!doctype html>
<!--
  OpenMined Design System starter for Claude artifacts (${STAMP}).
  Everything is inlined: Claude artifacts can't load our files by URL, only Google Fonts.
  ${full ? 'Full interactive layer: every component script is inlined at the end of <body>.' : 'Minimal interactive layer: no script for motion. For the full layer use ' + HOST + '/starter/artifact-full.html.'}
  Use the components' markup (${HOST}/components/README.md, examples at ${HOST}/examples/).
  Every color is a token: var(--surface-raise-1), var(--text-body); never type a hex.
  Feedback: if the system didn't cover something you needed, say what, and what you did instead,
  so it can be passed to the design lead (${HOST}/AGENTS.md, "Feedback").
-->
<html lang="en" data-theme="light"${full ? '' : ' data-interaction="minimal"'}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="omds" content="${STAMP}">
<title>OpenMined</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Rubik:wght@400&display=swap">
<script>(() => { let s = null; try { s = localStorage.getItem('omds-theme'); } catch {} document.documentElement.setAttribute('data-theme', s === 'dark' || s === 'light' ? s : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); })();</script>
<style>
${omdsCss()}
/* ── this page ── */
.page { padding-block: var(--spacing-5xl); display: grid; gap: var(--spacing-2xl); }
.page h1 { margin: 0; }
.actions { display: flex; flex-wrap: wrap; gap: var(--spacing-md); }
</style>
</head>
<body>
<main class="container page">
  <h1>Title</h1>
  <p class="text-lead measure">One sentence about what this is.</p>
  <div class="card-grid">
    <div class="card"><h2 class="card__title">A card</h2><p>Content grouped on a raised level.</p></div>
    <div class="card"><h2 class="card__title">Status</h2><p><span class="status-chip status-chip--success">On track</span></p></div>
    <div class="card"><h2 class="card__title">A number</h2><p class="h3 tabular">1,284</p></div>
  </div>
  <div class="actions"><button class="btn btn--solid">Primary action</button><button class="btn">Secondary</button></div>
</main>
${full ? `<script type="module">\n${js}</script>` : ''}
</body>
</html>
`;
  return respond(html, 'html');
};
