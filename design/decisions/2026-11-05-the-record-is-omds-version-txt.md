---
type: Decision
title: "The record is omds-version.txt, written on any copy"
description: "The OpenMined skill's record of the version in a project is named omds-version.txt and is written whenever the skill copies files in, the whole system or one part. On the person's yes it may also add one line to a project's existing instructions file. Replaces 2026-11-04 on the file's name, on when it's written and on what else the skill writes; the rest stands."
status: released
date: 2026-11-05
tags: [overview]
---

**Context.** The 2026-11-04 decision kept the skill's record, `brand-version.txt`, written on full adoption only, and nothing else written. Two things came up as the v2 skill was planned. The name doesn't say which system the record belongs to, and a project may carry more than one brand; the census then has to read every file to tell a v1 project from a v2 one. And the record exists because a copy's provenance should be findable, which is as true of one component copied in as of the whole system. Separately, a skill is consulted only when a model decides to consult it, while a project's own instructions file is read every session by anyone, with or without the plugin; a pointer there is the one thing that reaches every later session.

**Decision.** Design lead, 2026-11-05.
- **The file is `omds-version.txt`**, one line, the stamp's words: `OpenMined Design System <version> · <commit> · <source>`, where the source is where the files were read from (the site, or a local build of the repository). The skill updates the line when it brings in a newer version.
- **It is written whenever the skill copies files into a project**, the whole system or one part. Not for a hosted link, which is traceable by itself.
- **The census reads the line, not the name:** a file with the stamp's words is v2 under either name; a `brand-version.txt` without them is v1's. Projects that wrote the old name during the test rounds need no change.
- **The skill writes nothing else on its own.** On whole-system adoption it offers one line for the project's instructions file (`CLAUDE.md` or `AGENTS.md`): *This project uses the OpenMined Design System: read https://design.openmined.org/AGENTS.md before changing styles.* It appends the line only on the person's yes, only to a file that already exists, and never creates one.
- The rest of 2026-11-04 and 2026-11-02 stands: no `omds.json`; the stamp stays on every served file and is kept when a file is copied; local changes are found by comparing stamped copies; reasons come through feedback.

**Alternatives.** Keep `brand-version.txt`: it collides with any other brand a project carries and leaves v1 and v2 telling apart by content. The project's dependency list: there is no package. No pointer: the evidence is that on-demand skills are often not invoked, and the system then reaches only the sessions that call it.

**Revisit when.** The system is published as a package, whose version the project's own dependency list would record.
