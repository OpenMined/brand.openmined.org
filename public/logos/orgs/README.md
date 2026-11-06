# Organization logos

The registry of organizations OpenMined works with: affiliations, partners, press.
Their logos are trademarks of their owners, used to name them; OpenMined's tokens
don't apply. `orgs.json` is the source of truth.

## Files (per organization)

- `logo.svg` (`color`): the logo in its owner's colors, as supplied. Never recolored.
- `logo-mono.svg` (`mono`): a checked one-color file in `currentColor`, so it takes the
  text color and follows the mode. Only where the owner's mark has a clean one-color
  form: not for detailed seals or multi-color marks.
- `roles`: what the organization is to OpenMined (`partner`, `press`).

## Showing them

*Logos in a group all follow the mode, or all sit on white*: logos shown together take one
treatment. An organization can follow the color mode only with a `mono` file; without one
it sits on a white plate, as supplied, and so does every logo in its group. A group that
follows the mode asks for each logo with `orgMono()` (`src/lib/orgs.ts`); the build stops
on one without, and says how to bring its one-color file in.

## Adding one

    npm run logos:import -- <slug> --name "Name" --color logo.svg --mono logo-mono.svg --role partner

The color file is copied as supplied. The one-color file is checked
(`tools/logos/mono.mjs`): only one color comes in, white parts (knockouts) and second
colors stop it, masks and clip paths keep their own fills. Every build checks every
`mono` file again. Prefer the owner's own one-color file; record where files came from
in `--source`.
