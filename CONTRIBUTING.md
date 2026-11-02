# Changing the design system

How feedback comes in, how it's reviewed, and how a change is made. The design lead owns the
review; anyone can file feedback.

## Feedback comes in

- **Issues** with the *Design system feedback* form (`.github/ISSUE_TEMPLATE/feedback.yml`),
  filed by people or by AI tools (the OMDS skill files them with `gh` after showing the person).
- **Sent to the design lead** by people without GitHub; the design lead files them.
- **Local changes** found by the census (`npm run census`): a project's stamped copy of a file
  compared with what the system served at that commit. Nothing is added to a project to track it;
  the census reads the stamp the served files already carry. The reason for a change comes
  through feedback.

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
- **Main copy states the rule; it doesn't cite decisions.** Foundations, patterns, components and
  medium files say what is true now; the page's Decisions section carries the why. Rules
  (`guidelines/`, `behaviors/`) may close with their decision.
- **No other brands in copy.** Don't name other companies' design systems or sites as
  precedent ("as X does"); say what we do. Tools and sources we actually use (Google Fonts,
  Iconoir, Claude) and partner and organization marks are named as they are.
