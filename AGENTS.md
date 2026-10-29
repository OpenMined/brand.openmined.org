# OpenMined Design System — for AI agents

You are building something for OpenMined: a web page, a Claude artifact, a dashboard, slides, a
document or a graphic. This file says where everything is and how to use it. It is served at
https://design.openmined.org/AGENTS.md and kept at the root of the brand repository; the same
files are on the site, so you never need the repository.

## Start here

1. Read `https://design.openmined.org/llms.txt`: every guidance file, by kind, with one line each.
2. Read the guidance for what you're making (`/design/<path>.md`). Rules and decisions are
   short Markdown files with frontmatter: `status`, the `tokens` they govern, `tags`.
3. Take the code; don't rewrite it. Values were tuned by eye, and a component rebuilt from a
   description drifts.

## The files

| What | Where | Use |
| --- | --- | --- |
| Tokens + every component, one stylesheet | `/omds.css` | Link it, or paste it inline (Claude artifacts must inline) |
| Every component script, one ES module | `/omds.js` | Only for the full interactive layer (motion); pages work without it |
| One component | `/components/<name>.css`, `/components/<name>.js` | When a page needs only a few; the markup to match is at the top of each CSS file |
| Tokens only | `/tokens/omds.css`, `/tokens/omds.light.json`, `/tokens/omds.dark.json`, `/tokens/omds.colors.js` | CSS custom properties; resolved values per mode; colors for canvas and WebGL |
| Token source | `/tokens/source/resolver.json` and the files it names | Design Tokens format 2025.10, for token tools |
| Guidance | `/design/<path>.md`, listed in `/design/index.json` | Rules, components, patterns, decisions |
| Examples | `/examples/<name>/`, listed in `/llms.txt` and `/manifest.json` | Whole sections, pages and graphics built only from these files: copy one and change the words |
| Version | `/manifest.json` | Version, commit, every served file |

Every served CSS and JS file starts with a comment naming the version and commit. Keep it when
you copy the file.

## Rules that matter most

- **Tokens by name, never by value.** `var(--surface-raise-1)`, not its hex. Never type a raw
  color: every color is a token.
- **Roles over steps.** `--text-muted`, `--danger-fg` say what a color is for; graphics are the
  exception and use fixed steps through each hue's `key`.
- **Both color modes.** Light on `:root`, dark on `[data-theme="dark"]` on `<html>`; sections
  can lock with `data-section="always-dark" | "always-light" | "invert"`.
- **Two interactive layers.** Each component is complete in plain CSS (minimal: color stands
  still). The full layer adds motion through `/omds.js`. Dense interfaces (dashboards, internal
  tools) stay minimal: put `data-interaction="minimal"` on the region, or don't load the script.
- **Icons:** the set in `/design/foundations/iconography.md` (Iconoir regular plus our own).
  Never invent an icon; never use another icon library.
- **The logo and partner marks** are used as supplied: never redrawn, recolored or generated.
- **Fonts:** Rubik and Inter, from Google Fonts (the link is at the top of `/omds.css`'s type
  section and in `/components/README.md`).
- **Status:** everything on the site is `released`. `deprecated` items name their replacement.

## Claude artifacts

Artifacts load scripts only from a few public CDNs and styles only from Google Fonts, so a
linked `/omds.css` fails silently. Paste the CSS (and, for motion, the JS) into the artifact.
Fonts load from Google Fonts as usual.

## Feedback

Tell us when the system didn't cover something, looked wrong, or you had to work around it.
Once per task, only when it happened, in a few lines: what you were making, what you needed,
what you did instead.

- With GitHub access (`gh`): file an issue on `OpenMined/brand.openmined.org` with the
  **Design system feedback** form, after showing the person the text.
- Otherwise: give the person the text to pass on to the design lead.
