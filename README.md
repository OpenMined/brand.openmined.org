# OpenMined Design System

The source for how OpenMined looks: tokens, guidance and decisions, components as plain CSS
and JavaScript, icons, logos, graphics and examples. An Astro site at the repo root builds
**design.openmined.org**, which serves all of it for people and AI agents.

**Using the system?** Start at https://design.openmined.org, or point an AI tool at
https://design.openmined.org/llms.txt (agents: `AGENTS.md`). You don't need this repository.

## Work on it locally

```bash
npm install
npm run dev            # http://localhost:4321
npm run tokens         # rebuild src/tokens/v2/ after editing tokens/
npm run lint           # the color gate
npm run build          # production: fails on any draft token or guidance file
npm run build:review   # the same, with drafts shown
```

## Where things live

| What | Source | Served at |
| --- | --- | --- |
| Values | `tokens/` (Design Tokens 2025.10), built into `src/tokens/v2/` | `/tokens/omds.*`, `/omds.css` |
| Rules, decisions, words on the pages | `design/` | `/design/*.md` |
| Components | `components/` | `/components/*`, `/omds.css`, `/omds.js` |
| Icons | `icons/set.json` (+ `public/icons/`, Iconoir) | `/icons/set/*` |
| Logos, partner and org marks | `public/logos/` | `/logos/*` |
| Brand graphics (`<om-*>`) | `public/embeds/` | `/embeds/*` |
| Examples | `src/pages/examples/` | `/examples/*` |

`CLAUDE.md` has the working rules for this repo. Feedback on the system: the
**Design system feedback** issue form.

v1 is tagged `v1.0.0`; its served files (`/tokens/tokens.css` and the rest) stay at their old
paths for existing projects. The review rounds and page reviews are tagged `rounds-archive`.
