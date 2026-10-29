# Changing the design system

How feedback comes in, how it's reviewed, and how a change is made. The design lead owns the
review; anyone can file feedback.

## Feedback comes in

- **Issues** with the *Design system feedback* form (`.github/ISSUE_TEMPLATE/feedback.yml`),
  filed by people or by AI tools (the OMDS skill files them with `gh` after showing the person).
- **Sent to the design lead** by people without GitHub; the design lead files them.
- **Local changes** recorded by projects in their `omds.json` (`overrides`, each with a reason),
  found by the census.

## The weekly review

Once a week the design lead goes through what's new (an AI session can do the sorting):

1. **Sort** each item to the layer it touches: a value, a role, a rule, a component, an example,
   or the skill's instructions. Merge duplicates. Note who else hit it (`npm run census`, the
   `omds.json` overrides).
2. **Decide** for each: change the system, keep it local to the project, or not now.
3. **For a change to a value or role,** run `npm run impact -- <token>` first and look at what it
   lists (pages and examples, both modes) before and after. The call is made with that in front
   of you.
4. **Close the loop** on the issue: the commit, or why it stays local, or when it comes back.
5. Update `design/coverage.md` when something moves from *not yet* to *next*, or ships, and the
   medium's file in `design/media/` (its level, what it pulls in, its gaps and `updated` date)
   when a change reaches it (`npm run impact` lists them).

## Making a change

- **Values** in `tokens/` (`npm run tokens`); **rules and words** in `design/`; **components** in
  `components/`. Never in a page.
- New or changed values and files start as `draft` (`npm run dev` and `npm run build:review` show
  them; `npm run build` refuses them) and become `released` when decided.
- Every decided change gets a **decision record** (`design/decisions/YYYY-MM-DD-slug.md`, never
  edited later: a changed decision gets a new record) and a **line in `design/log.md`**.
- `npm run tokens:check` (schemas, generated files, contrast promises) and `npm run lint` (no raw
  colors) must pass; CI runs both.
- Copy uses roles, not names (the design lead, the brand owner); names appear only in
  `design/log.md`.
