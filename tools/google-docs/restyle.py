#!/usr/bin/env python3
"""
restyle.py — apply OMDS named styles to an EXISTING Google Doc, in place.

  python3 restyle.py <DOC_ID or URL> [--entity openmined] [--no-margins]

Redefines Normal text / Title / Subtitle / Heading 1–6 (font, size, color, spacing)
on every tab and sets 1" margins. Content is untouched. Text that carries *direct*
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
    a = ap.parse_args()
    m = re.search(r"/d/([\w-]+)", a.doc)
    doc_id = m.group(1) if m else a.doc
    n = om.apply_styles(om.Docs(a.entity), doc_id, margins=not a.no_margins)
    print(f"applied {n} requests → {om.url(doc_id)}")


if __name__ == "__main__":
    main()
