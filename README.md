# OpenMined Brand Reference

Canonical brand tokens, UI primitives, and logo assets for all OpenMined projects. An Astro site at the repo root deploys as a living reference at **brand.openmined.org**.

## Run the brand reference locally

```bash
npm install && npm run dev
```

## Use in a project

Brand assets sync as a local copy into the consuming project's `src/brand/` — not installed as a package. Logo SVGs are served from `public/logos/`. Record the brand repo commit SHA in `src/brand/brand-version.txt` as the sync audit trail.

See `CLAUDE.md` for sync approaches, usage rules, and the color mode system.

## Peer dependency

Projects must load **ionicons** in their base layout (CDN for development, self-hosted for production).
