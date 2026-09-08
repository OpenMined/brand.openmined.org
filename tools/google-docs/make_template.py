#!/usr/bin/env python3
"""
make_template.py — create (or refresh in place) an OMDS-styled Google Doc template.

  python3 make_template.py <template> [--doc DOC_ID] [--entity openmined]
                           [--logo-url URL | --no-logo] [--title "..."]

Templates: blank · meeting-notes · memo · letterhead
  --doc      update an existing doc's named styles + margins in place (content kept;
             header/footer/body only written on first creation). Use after a token
             change to re-sync a template already in the gallery.

Prints the doc URL. Submitting to the org Template gallery is a UI step (Docs →
Template gallery → <org> → Submit template) — there is no API for it.
"""
from __future__ import annotations

import argparse
import sys
import urllib.request

import omds_docs as om

TEMPLATES = {
    "blank": {
        "title": "OpenMined — Blank",
        "body": [],
        "footer": True, "logo": False,
    },
    "meeting-notes": {
        "title": "OpenMined — Meeting Notes",
        "body": [
            ("title", "Meeting title"),
            ("subtitle", "Date · Attendees · Recording link"),
            ("h2", "Agenda"),
            ("ol", "First topic"), ("ol", "Second topic"),
            ("h2", "Notes"),
            ("p", "Decisions and discussion, one paragraph per topic."),
            ("h2", "Action items"),
            ("todo", "Owner — what, by when"), ("todo", "Owner — what, by when"),
        ],
        "footer": True, "logo": False,
    },
    "memo": {
        "title": "OpenMined — Memo",
        "body": [
            ("title", "Memo title"),
            ("subtitle", "To · From · Date"),
            ("h1", "Summary"),
            ("p", "Two or three sentences: what this is, what you're asking for."),
            ("h1", "Context"),
            ("p", "Why now. What changed."),
            ("h1", "Recommendation"),
            ("p", "The proposal, plainly."),
            ("h1", "Next steps"),
            ("ul", "Step, owner, date"),
        ],
        "footer": True, "logo": False,
    },
    "letterhead": {
        "title": "OpenMined — Letterhead",
        "body": [
            ("p", "Date"),
            ("p", "Recipient name\nTitle, Organization\nAddress"),
            ("p", "Dear ____,"),
            ("p", "Body."),
            ("p", "Sincerely,"),
            ("p", "Name\nTitle, OpenMined Foundation"),
        ],
        "footer": True, "logo": True,
    },
}

NAMED = {"title": "TITLE", "subtitle": "SUBTITLE", "h1": "HEADING_1", "h2": "HEADING_2",
         "h3": "HEADING_3", "h4": "HEADING_4", "h5": "HEADING_5", "h6": "HEADING_6"}
BULLETS = {"ul": "BULLET_DISC_CIRCLE_SQUARE", "ol": "NUMBERED_DECIMAL_ALPHA_ROMAN", "todo": "BULLET_CHECKBOX"}

FOOTER_TEXT = "OpenMined Foundation · openmined.org"


def body_requests(blocks) -> list[dict]:
    """insertText + named-style + bullet requests for a fresh doc (index 1 = start)."""
    if not blocks:
        return []
    text, idx, styles, lists = "", 1, [], []
    run = None  # (preset, start, end)
    for kind, t in blocks:
        start, end = idx, idx + len(t) + 1
        styles.append((start, end, NAMED.get(kind, "NORMAL_TEXT")))
        if kind in BULLETS:
            if run and run[0] == BULLETS[kind]:
                run = (run[0], run[1], end)
            else:
                if run:
                    lists.append(run)
                run = (BULLETS[kind], start, end)
        elif run:
            lists.append(run); run = None
        text += t + "\n"
        idx = end
    if run:
        lists.append(run)
    reqs = [{"insertText": {"location": {"index": 1}, "text": text}}]
    reqs += [{"updateParagraphStyle": {"range": {"startIndex": s, "endIndex": e},
                                       "paragraphStyle": {"namedStyleType": st}, "fields": "namedStyleType"}}
             for s, e, st in styles]
    reqs += [{"createParagraphBullets": {"range": {"startIndex": s, "endIndex": e}, "bulletPreset": p}}
             for p, s, e in lists]
    return reqs


def logo_ok(url: str) -> bool:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD")) as r:
            return r.status == 200 and r.headers.get("Content-Type", "").startswith("image/")
    except Exception:
        return False


def header_footer(docs: om.Docs, doc_id: str, style_map: dict, logo_url: str | None, footer: bool):
    """Create header (logo) and footer (subtle one-liner). Two round-trips: IDs come from the first."""
    subtle = style_map["_meta"]["subtle"]
    create = []
    if logo_url:
        create.append({"createHeader": {"type": "DEFAULT"}})
    if footer:
        create.append({"createFooter": {"type": "DEFAULT"}})
    if not create:
        return
    replies = docs.batch(doc_id, create).get("replies", [])
    fill = []
    for rep in replies:
        if "createHeader" in rep:
            hid = rep["createHeader"]["headerId"]
            h_pt = 22
            fill.append({"insertInlineImage": {
                "location": {"segmentId": hid, "index": 0}, "uri": logo_url,
                "objectSize": {"height": om._pt(h_pt), "width": om._pt(round(h_pt * om.LOGO_ASPECT, 1))}}})
            fill.append({"updateParagraphStyle": {
                "range": {"segmentId": hid, "startIndex": 0, "endIndex": 1},
                "paragraphStyle": {"spaceBelow": om._pt(12)}, "fields": "spaceBelow"}})
        if "createFooter" in rep:
            fid = rep["createFooter"]["footerId"]
            fill.append({"insertText": {"location": {"segmentId": fid, "index": 0}, "text": FOOTER_TEXT}})
            fill.append({"updateTextStyle": {
                "range": {"segmentId": fid, "startIndex": 0, "endIndex": len(FOOTER_TEXT)},
                "textStyle": {"fontSize": om._pt(9), "foregroundColor": om._rgb(subtle)},
                "fields": "fontSize,foregroundColor"}})
    docs.batch(doc_id, fill)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("template", choices=sorted(TEMPLATES))
    ap.add_argument("--doc", help="existing doc ID to refresh styles on (no content written)")
    ap.add_argument("--entity", default="openmined")
    ap.add_argument("--title")
    ap.add_argument("--logo-url", default=om.DEFAULT_LOGO_URL)
    ap.add_argument("--no-logo", action="store_true")
    a = ap.parse_args()

    spec = TEMPLATES[a.template]
    style_map = om.build_style_map()
    docs = om.Docs(a.entity)

    if a.doc:
        n = om.apply_styles(docs, a.doc, style_map)
        print(f"refreshed {n} style requests → {om.url(a.doc)}")
        return

    doc_id = docs.create(a.title or spec["title"])
    reqs = om.named_style_requests(style_map) + [om.document_style_request()] + body_requests(spec["body"])
    docs.batch(doc_id, reqs)

    logo = None
    if spec["logo"] and not a.no_logo:
        if logo_ok(a.logo_url):
            logo = a.logo_url
        else:
            print(f"warn: logo URL not serving an image yet ({a.logo_url}); header skipped. "
                  f"Re-run with --logo-url once the brand site deploys public/logos/raster/.", file=sys.stderr)
    header_footer(docs, doc_id, style_map, logo, spec["footer"])
    print(om.url(doc_id))


if __name__ == "__main__":
    main()
