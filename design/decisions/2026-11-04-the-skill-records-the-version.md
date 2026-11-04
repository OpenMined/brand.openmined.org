---
type: Decision
title: "The skill records the version in the project"
description: "The OpenMined skill keeps writing brand-version.txt when it brings the system into a project, as it did for v1: one line naming the version, the commit and where the files came from. It replaces the 2026-11-02 decision on this point; the rest of that decision stands."
status: released
date: 2026-11-04
tags: [overview]
---

**Context.** The 2026-11-02 decision (*Usage is traced from the files*) added nothing to a project to track it, `brand-version.txt` included, and made the stamp the record. But the stamp is only on files the site serves. When the site can't be reached, the skill takes the system from a clone of the repository or from GitHub, and those files carry no stamp. The skill has written `brand-version.txt` since v1, as its audit trail, and the teams that use it already have the file.

**Decision.** Design lead, 2026-11-04.
- **The skill writes `brand-version.txt`** at the project's root when it brings the whole system in (full adoption), as in v1: one line, the stamp's words, `OpenMined Design System <version> · <commit> · <source>`, where the source is the site, a clone (with its branch) or GitHub.
- **It updates the line** when it brings in a newer version, and writes nothing else.
- **The stamp stays** on every served file and is kept when a file is copied. The census reads both: the stamp for each copied file, `brand-version.txt` for the project as a whole (a file without the line is v1's).
- The rest of the 2026-11-02 decision stands: no `omds.json`; local changes are found by comparing stamped copies; reasons come through feedback.

**Alternatives.** No record, as decided on 2026-11-02: copies from a clone or GitHub couldn't be placed, and the skill would drop a step teams already know.

**Revisit when.** The system is published as a package, whose version the project's own dependency list would record.
