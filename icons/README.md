# The v2 icon set

`set.json` is the list of every icon v2 uses. Components ask for a **name**
(`<Icon name="flash" />`); the entry decides the drawing. `src/lib/icons.ts` is the one
lookup (the brand site, the page reviews, the Icons page), and a name missing here fails
the build. The Icons page (`/icons/#set`) is a view of this file.

```json
"icons": {
  "flash":      { "src": "tabler", "file": "bolt", "style": "line", "status": "proposed" },
  "lock":       { "src": "lucide", "style": "line", "status": "proposed" },
  "check-solid": { "src": "own", "style": "solid", "status": "approved", "note": "why" },
  "github":     { "src": "tool", "style": "solid", "status": "proposed" }
},
"live": {
  "zap": { "use": "flash", "match": "exact" }
}
```

- `src`: `tabler`, the default (`node_modules/@tabler/icons/icons/outline/<file>.svg`, scaled
  to Lucide's size by `src/lib/icons.ts`), `lucide` (`node_modules/lucide-static/icons/<file>.svg`),
  `own` (`public/icons/<name>.svg`), `tool` (`public/logos/tools/<name>/icon.svg`). Add
  `"file"` when the library's name differs from ours.
- `style`: `line` (default) or `solid`, for a filled icon chosen as an exception. Tool
  marks are always `solid` (the build checks).
- `status`: `proposed` until reviewed, then `approved`.
- `live`: each icon on openmined.org's style guide (`src/pages/icons/_live-icons.json`,
  a snapshot) and the set icon replacing it; `null` keeps the live drawing.

## Reviewing, one icon at a time

- **Approve:** set `"status": "approved"` (add a `note` if there's a reason worth keeping).
- **Swap the drawing:** change `src` and `file` to another Tabler or Lucide icon. Start from
  Tabler; keep a family that shares parts (shields and locks, status marks, arrows) together.
- **Point a live icon somewhere else:** change its `live.<name>.use`.
- **Use our own drawing:** `npm run icons:import -- <file.svg> <name>`. It writes
  `public/icons/<name>.svg`, switches the entry to `own` and marks it `proposed`. Every use
  of that name changes. Add `--solid` for a filled icon, `--note "why"`, `--dry-run` to look first.
- **Keep a live drawing:** `npm run icons:import -- live:<live-name> <name>` also points
  that live icon at it.

Then add a line to `design/log.md`; a choice that sets a rule gets a decision record.

## Upgrading a library

Both libraries are pinned to an exact version in `package.json`. To upgrade, install the new
version, open the *Set* table on the Icons page and compare it with production: an upgrade
can redraw an icon in the set. Note any redrawn icon in the log line.

## What an own drawing must be

A 24 grid; `currentColor` only; no `stroke-width` on its shapes (the set sets the stroke by
size: 2 up to 24px, then a 2px line); no fills on a line icon. The importer produces this
and stops, with the reason, on what needs drawing by hand: white knockouts (the solid check's
tick is one; redraw it as a cut-out) and second colors. The build checks it again.

Brand logos don't come in this way: they're tool marks, used as supplied, and always fills.
