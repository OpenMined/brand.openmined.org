# Changing the design system

How feedback comes in, how it's reviewed, and how a change is made. The design lead owns the
review; anyone can file feedback.

## Feedback comes in

- **Issues** with the *Design system feedback* form (`.github/ISSUE_TEMPLATE/feedback.yml`),
  filed by people or by AI tools (the OMDS skill files them with `gh` after showing the person).
- **Sent to the design lead** by people without GitHub; the design lead files them.
- **Local changes** found by the census (`npm run census`): a project's stamped copy of a file
  compared with what the system served at that commit. The census reads the stamp the served
  files already carry and the skill's one-line record, `omds-version.txt`. The reason for a
  change comes through feedback.

## The weekly review

Once a week the design lead goes through what's new (an AI session can do the sorting):

1. **Sort** each item to the layer it touches: a value, a role, a rule, a component, an example,
   or the skill's instructions. Merge duplicates. Note who else hit it (`npm run census`: the
   projects using it, and the local changes in their copies).
2. **Decide** for each: change the system, keep it local to the project, or not now.
3. **For a change to a value or role,** run `npm run impact -- <token>` first and look at what it
   lists (pages and examples, both modes) before and after. The call is made with that in front
   of you.
4. **Close the loop** on the issue: the commit, or why it stays local, or when it comes back.
5. Update `design/coverage.md` when something moves from *not yet* to *next*, or ships, and the
   medium's file in `design/media/` (its level, what it pulls in, its gaps and `updated` date)
   when a change reaches it (`npm run impact` lists them).

## Releases and versions

The version is the package version (`package.json`): every served file carries it in its stamp
and `/manifest.json` reports it. It changes on every release to `main` (every production
deploy), by semantic versioning:

- **patch**: a retuned value, reworded guidance, a fix that changes no name;
- **minor**: a new token, component, rule, example or medium; a deprecation;
- **major**: a token or class renamed or removed (the log line names old → new).

**No version for the site's own pages.** A deploy that changes only how the site presents
things (its pages' layout, tables, wording on a page) and no file a project uses (tokens,
`omds.css`, `omds.js`, components, icons, logos, embeds, guidance in `/design/`, starters)
goes out without a new version: its log line sits under the current version, and the
stamp's commit says what's live. A version tells projects and the skill that something
they use changed; a page-only change has nothing to tell them.

`design/log.md` is the release notes. Each release is tagged `v<version>`. The OMDS skill
compares a project's recorded version (`omds-version.txt`) with the manifest's and says when
a newer release exists; it never judges by commit, which changes with every deploy. v2
launches as `2.0.0`.

## Making a change

- **Values** in `tokens/` (`npm run tokens`); **rules and words** in `design/`; **components** in
  `components/`. Never in a page.
- New or changed values and files start as `draft` (`npm run dev` and `npm run build:review` show
  them; `npm run build` refuses them) and become `released` when decided.
- Every decided change gets a **decision record** (`design/decisions/YYYY-MM-DD-slug.md`, never
  edited later: a changed decision gets a new record) and a **line in `design/log.md`**.
- **A contributor proposes; the design lead decides.** Where a change sets or changes a rule,
  draft its record (`status: draft`, the **Decision** line reading "Proposed; awaiting the
  design lead.") and leave anything unsettled as *Open:* in the guidance. The design lead
  decides, writes their role and the date on the **Decision** line, and releases the record
  with the change. A change that sets no rule needs only its log line.
- `npm run tokens:check` (schemas, generated files, contrast promises) and `npm run lint` (no raw
  colors; every component class in use is defined, `tools/classes/`) must pass; CI runs both.
- Copy uses roles, not names (the design lead, the brand owner); names appear only in
  `design/log.md`.
- **Main copy states the rule; it doesn't cite decisions.** Foundations, patterns, components and
  medium files say what is true now; the page's Decisions section carries the why. Rules
  (`guidelines/`, `behaviors/`) may close with their decision.
- **No other brands in copy.** Don't name other companies' design systems or sites as
  precedent ("as X does"); say what we do. Tools and sources we actually use (Google Fonts,
  Tabler, Lucide, Claude) and tool and organization marks are named as they are.
