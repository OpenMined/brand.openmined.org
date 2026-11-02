---
type: Decision
title: "Usage is traced from the files, not a record in the project"
description: "Nothing is added to a project to track it. The census reads the stamp every served file carries, links to the site and the system's own names, and finds local changes by comparing a stamped copy with what was served at its commit. omds.json is dropped from the plan."
status: released
date: 2026-11-02
tags: [overview]
---

**Context.** To know who uses the system, at which version, and where a project departs from it, the plan was for the OpenMined skill to write an `omds.json` in each ongoing project: the version, the files taken, and each local change with its reason. It was never built. Teams own their repositories, and a file that exists only for the design system's bookkeeping is one they didn't ask for and have to keep up to date.

**Decision.** Design lead, 2026-11-02.
- **Nothing is added to a project to track it.** No `omds.json`, and no `brand-version.txt` for v2.
- **The stamp is the record.** Every CSS and JS file the site serves starts with `OpenMined Design System <version> · <commit>`. A project that keeps the first line of what it copies can be traced.
- **The census reads what projects already carry** (`npm run census`, the OpenMined organization's repositories): the stamp; code that loads files from design.openmined.org; the system's own token, embed and class names, for parts taken by hand or a copy that lost its stamp; and v1's `brand-version.txt`.
- **Local changes are found, not declared.** For each stamped copy the census compares the file with what the system served at the commit in its stamp. Lines the project added or changed are its local changes. Leaving parts out isn't a change.
- **Reasons come through feedback.** A comparison shows that something changed, not why. "I had to work around the system" is a choice on the feedback form.

**Alternatives.** A record file in each project (`omds.json`): it carries the reasons, but it adds a file to every repository, and a record kept by hand falls out of date. A package registry: there's no package yet, and it would only count projects that install it.

**Revisit when.** The system is published as a package, which would make dependents countable, or teams ask for a record of their own.
