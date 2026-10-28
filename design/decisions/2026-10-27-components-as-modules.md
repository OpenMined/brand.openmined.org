---
type: Decision
title: "Components are plain CSS and JavaScript modules"
description: "The v2 components live in components/ as one CSS file per component and one small ES module per moving part, with bare class names and the ideal markup as reference; no framework, no loader."
status: working
date: 2026-10-27
tags: [interface]
---

**Context.** Every v2 component existed only inside the brand site's own styles (`site.css`, the shared hover stylesheets, one script for buttons, fields and cards). An agent or a teammate building a page had nothing clean to copy, and copying by eye lets values tuned by hand drift. The sites that will use the system are of every kind (Astro, plain HTML, HubSpot, Webflow, Claude artifacts), and some of their markup can't be edited.

**Decision.** Design lead, 2026-10-27.
- **Platform-agnostic.** A component is its CSS, its script if it moves, and an example of the ideal markup (at the top of its CSS file). No Astro or other framework components as the source; the brand site's Astro wrappers only render that markup.
- **Modular.** One CSS file per component, one ES module per moving part (the button hover is its own module, apart from the button's look), so a page loads only what it uses and a move can be dropped or swapped alone. Shared helpers (`pointer.js`, `two-tone.js`) are plain imports.
- **Standard protocol, no loader.** `<link>`/`@import` for CSS, `import` for scripts. Each script exports one function that takes a selector (so it can reach markup it can't change), does nothing until called and is safe to call again (content added later). Each follows reduced motion itself.
- **Bare class names** (`.btn`, `.ctl`, `.hcard`), not prefixed.
- **Lives at `components/`** at the repo root, beside `tokens/` and `design/`.

**Alternatives.** One CSS file and one runtime script: simpler to load, but every page carries every move and nothing can be dropped alone. Astro components as the source: convenient on Astro sites, translated by hand everywhere else. Web components (custom elements): right for self-contained graphics like `<om-diamond>`, wrong for buttons and fields, since they need markup changes a vendor's form doesn't allow. Prefixed classes (`.om-btn`): safer next to other systems' classes, but openmined.org moves onto these anyway.

**Consequences.** `site.css` keeps only the guide's own layout. The page reviews use the component's button hover; their other copies stay until the reviews go. `components/demo.html` renders every component with nothing but the tokens and these files. How each site takes them (hosted versioned URLs, a copy with the commit recorded, inlined into an artifact) is chosen per site; the files are the same for all three.

**Revisit when.** A team asks for an npm package, or a component needs a framework's state to work.
