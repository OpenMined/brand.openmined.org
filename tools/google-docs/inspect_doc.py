#!/usr/bin/env python3
"""
inspect_doc.py — show a Doc's named styles next to the OMDS map and flag the diffs.

  python3 inspect_doc.py <DOC_ID or URL> [--entity openmined] [--readonly]

--readonly uses {entity}/google-refresh-token (documents.readonly) instead of the
write token — handy for docs this tool did not create.
"""
import argparse
import re

import omds_docs as om


def hexcolor(ts):
    c = (ts.get("foregroundColor") or {}).get("color", {}).get("rgbColor")
    if c is None:
        return "—"
    return "#%02x%02x%02x" % tuple(round(c.get(k, 0) * 255) for k in ("red", "green", "blue"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("doc")
    ap.add_argument("--entity", default="openmined")
    ap.add_argument("--readonly", action="store_true")
    a = ap.parse_args()
    m = re.search(r"/d/([\w-]+)", a.doc)
    doc_id = m.group(1) if m else a.doc

    d = om.Docs(a.entity)
    if a.readonly:  # swap in the readonly bundle's token
        d = om.Docs.__new__(om.Docs); d.entity = a.entity
        import json, urllib.request, urllib.parse
        cid = om.sec_get(a.entity, "google-oauth-client-id") or om.sec_get(a.entity, "marketing-client-id")
        cs = om.sec_get(a.entity, "google-oauth-client-secret") or om.sec_get(a.entity, "marketing-client-secret")
        rt = om.sec_get(a.entity, "google-refresh-token")
        tok = json.load(urllib.request.urlopen(urllib.request.Request(
            "https://oauth2.googleapis.com/token",
            data=urllib.parse.urlencode({"client_id": cid, "client_secret": cs, "refresh_token": rt,
                                         "grant_type": "refresh_token"}).encode())))["access_token"]
        d.h = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}

    doc = d.get(doc_id)
    want = om.build_style_map(); want.pop("_meta")
    tabs = doc.get("tabs") or [{"documentTab": doc, "tabProperties": {"title": "(legacy)"}}]
    print(f"{doc.get('title')}  ·  {len(tabs)} tab(s)")
    for t in tabs:
        dt = t["documentTab"]
        ds = dt.get("documentStyle", {})
        print(f"\n[tab] {t['tabProperties'].get('title')}  margins T/B/L/R = "
              + "/".join(str((ds.get(k) or {}).get("magnitude", "?")) for k in ("marginTop", "marginBottom", "marginLeft", "marginRight"))
              + f"  header={'yes' if ds.get('defaultHeaderId') else 'no'} footer={'yes' if ds.get('defaultFooterId') else 'no'}")
        print(f"{'style':12} {'have':38} {'omds':38} diff")
        for s in dt["namedStyles"]["styles"]:
            typ = s["namedStyleType"]; ts, ps = s.get("textStyle", {}), s.get("paragraphStyle", {})
            f = ts.get("weightedFontFamily", {})
            have = (f.get("fontFamily", "?"), f.get("weight", "?"), (ts.get("fontSize") or {}).get("magnitude", "?"), hexcolor(ts), ps.get("lineSpacing", "?"))
            w = want[typ]
            omds = (w["font"], w["weight"], w["pt"], w["color"], w["line"])
            diff = [n for n, (x, y) in zip(("font", "weight", "pt", "color", "lh"), zip(have, omds)) if str(x).lower() != str(y).lower() and not (n == "lh" and x != "?" and abs(float(x) - y) < 1)]
            fmt = lambda v: f"{v[0]} {v[1]} {v[2]}pt {v[3]} lh{v[4]}"
            print(f"{typ:12} {fmt(have):38} {fmt(omds):38} {','.join(diff) or '✓'}")
        # first few paragraphs of text for orientation
        body = [("".join(e.get("textRun", {}).get("content", "") for e in el["paragraph"].get("elements", [])).strip(),
                 el["paragraph"].get("paragraphStyle", {}).get("namedStyleType", ""))
                for el in dt["body"]["content"] if "paragraph" in el]
        body = [b for b in body if b[0]][:6]
        for txt, st in body:
            print(f"   {st:12} {txt[:70]}")


if __name__ == "__main__":
    main()
