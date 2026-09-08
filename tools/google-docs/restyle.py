#!/usr/bin/env python3
"""
restyle.py — apply OMDS named styles to an EXISTING Google Doc, in place.

  python3 restyle.py <DOC_ID or URL> [--entity openmined] [--no-margins] [--no-lists] [--icon [URL]] [--footer [TITLE]]

Redefines Normal text / Title / Subtitle / Heading 1–6 (font, size, color, spacing)
on every tab, sets 1" margins, and gives list items their rhythm (body leading
inside an item, a small gap between items, the paragraph gap after the list). --icon adds the templates' first-page header
(the OpenMined mark, centered) if the doc has none. Content is untouched. Text that carries *direct*
formatting (a hand-picked font on a heading) keeps it — select it and use
Format → Clear formatting (⌘\\) to fall back to the named style.

Needs the `documents` scope on {entity}/google-docs-token for docs this tool did
not create (see docs-write-oauth.py in dreamland).
"""
import argparse
import re

import omds_docs as om


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("doc", help="document ID or docs.google.com URL")
    ap.add_argument("--entity", default="openmined")
    ap.add_argument("--no-margins", action="store_true")
    ap.add_argument("--no-lists", action="store_true", help="skip the per-item list spacing pass")
    ap.add_argument("--icon", nargs="?", const=om.DEFAULT_ICON_URL, help="add the first-page icon header (optional custom PNG URL)")
    ap.add_argument("--footer", nargs="?", const="", help="pages 2+: title right-aligned + a line for page numbers (optional custom title)")
    a = ap.parse_args()
    m = re.search(r"/d/([\w-]+)", a.doc)
    doc_id = m.group(1) if m else a.doc
    docs = om.Docs(a.entity)
    n = om.apply_styles(docs, doc_id, margins=not a.no_margins, lists=not a.no_lists)
    if a.icon:
        print("icon header:", "added" if om.add_icon_header(docs, doc_id, a.icon) else "already present")
    if a.footer is not None:
        made = om.add_running_footer(docs, doc_id, a.footer or None)
        print("running footer:", "added — now click its second line and Insert → Page numbers (number, ' of ', page count)" if made else "already present")
    print(f"applied {n} requests → {om.url(doc_id)}")


if __name__ == "__main__":
    main()
