#!/usr/bin/env python3
"""
omds_docs — OpenMined Design System → Google Docs named styles.

Reads the canonical token CSS in this repo (src/tokens/{tokens,global,typography}.css)
and turns it into Google Docs API requests that (re)define a document's *named
styles* — Normal text, Title, Subtitle, Heading 1–6 — plus page margins, header
and footer. Because it writes the named-style DEFINITIONS (not per-paragraph
formatting), everything a person later types with those styles is on-brand, and
Format → Paragraph styles in the Docs UI reflects OMDS.

Fonts, weights, line-heights, colors and paragraph spacing come from the CSS.
The only Docs-specific judgment call is the point-size scale (web px sizes are a
display scale; a Doc is a page) — see DOC_PT below, and the README.

Stdlib only. Credentials via `sec` (Passport): {entity}/google-docs-token, falling
back to {entity}/google-refresh-token. The Docs API accepts the drive.file scope
for docs this app created; restyling arbitrary existing docs needs `documents`.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

REPO = pathlib.Path(__file__).resolve().parents[2]
TOKENS_DIR = REPO / "src" / "tokens"
SEC = str(pathlib.Path.home() / ".local/bin/sec")
DOCS = "https://docs.googleapis.com/v1/documents"

# Where the raster logo lives once the brand site deploys (Docs can't inline SVG).
# Source: public/logos/raster/*.png (rendered from the canonical SVGs with rsvg-convert).
DEFAULT_LOGO_URL = "https://design.openmined.org/logos/raster/OpenMined-Logo-Dark.png"
DEFAULT_ICON_URL = "https://design.openmined.org/logos/raster/OpenMined-Icon.png"
ICON_PT = 71.25  # the templates' first-page header mark (square)
LOGO_ASPECT = 300 / 76  # canonical SVG viewBox

# ── The one Docs-specific decision: point sizes per named style ─────────────
# Web headings (61/47/36/27px) are a display scale for screens; on a page they
# read as posters. These are OpenMined's *print* sizes — the calibration Bennett
# set in the 2025 gallery templates (OpenMined Doc / Pageless / Letterhead / Bet
# Idea: 10pt body, 26pt title, 20/16 H1/H2), adopted as canon 2026-09-08.
# Subtitle and H6 were undefined in those templates (Docs fell back to Arial);
# Subtitle follows the web ratio (.text-subtitle 21px ÷ body 16px × 10pt ≈ 13pt).
# Everything else (family, weight, line-height, color, spacing) derives from CSS.
DOC_PT = {
    "TITLE": 26, "SUBTITLE": 13,
    "HEADING_1": 20, "HEADING_2": 16, "HEADING_3": 14, "HEADING_4": 12,
    "HEADING_5": 11, "HEADING_6": 10,
    "NORMAL_TEXT": 10,
}
PAGE_MARGIN_PT = 72  # 1 inch


# ── Minimal CSS reader ──────────────────────────────────────────────────────
def _strip_comments(css: str) -> str:
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


def _rules(css: str):
    """Yield (selector, {prop: value}) for top-level rules; skips @-blocks."""
    css = _strip_comments(css)
    i, n = 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0:
            break
        sel = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            depth += {"{": 1, "}": -1}.get(css[k], 0)
            k += 1
        body = css[j + 1:k - 1]
        i = k
        if sel.startswith("@"):
            continue  # @media / @keyframes — screen-only concerns
        decls = {}
        for d in body.split(";"):
            if ":" in d:
                p, v = d.split(":", 1)
                decls[p.strip()] = v.strip()
        for s in sel.split(","):
            yield s.strip(), decls


def load_css() -> dict:
    """Return {'vars': {--name: literal}, 'rules': {selector: {prop: value}}} (light mode)."""
    vars_, rules = {}, {}
    for f in ("tokens.css", "global.css", "typography.css"):
        for sel, decls in _rules((TOKENS_DIR / f).read_text()):
            if sel == ":root":
                vars_.update(decls)          # first :root block = light defaults
            elif sel.startswith("[data-theme") or sel.startswith("[data-section"):
                continue                     # dark / section overrides: not for paper
            else:
                rules.setdefault(sel, {}).update(decls)

    def resolve(v: str, depth=0) -> str:
        m = re.fullmatch(r"var\((--[\w-]+)\)", v.strip())
        if m and depth < 10:
            return resolve(vars_[m.group(1)], depth + 1)
        return v.strip()

    return {"vars": {k: resolve(v) for k, v in vars_.items()}, "rules": rules}


def _px(v: str) -> float:
    return float(re.match(r"([\d.]+)px", v).group(1))


def _family(v: str) -> str:
    return v.split(",")[0].strip().strip("'\"")


def _rgb(hex_: str) -> dict:
    h = hex_.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return {"color": {"rgbColor": {"red": r, "green": g, "blue": b}}}


# ── OMDS → Docs style map ───────────────────────────────────────────────────
def build_style_map(css: dict | None = None) -> dict:
    """
    Returns {namedStyleType: {"font", "weight", "pt", "line", "color", "above", "below"}}.
    Sizes from DOC_PT; everything else from the CSS. Spacing uses the .prose rhythm
    scaled by (NORMAL pt / body px) so paragraph rhythm keeps its web proportions.
    """
    css = css or load_css()
    V, R = css["vars"], css["rules"]

    def rule(*sels):
        out = {}
        for s in sels:
            out.update(R.get(s, {}))
        return out

    def var(v):  # resolve var() refs inside rule values
        m = re.fullmatch(r"var\((--[\w-]+)\)", v.strip())
        return V[m.group(1)] if m else v.strip()

    body = rule("body")
    scale = DOC_PT["NORMAL_TEXT"] / _px(body["font-size"])       # pt per web px
    sp = lambda tok: round(_px(V[tok]) * scale, 1)                # spacing token → pt
    lh = lambda r, d="1.5": round(float(r.get("line-height", d)) * 100)

    headline, body_c, subtle = V["--text-headline"], V["--text-body"], V["--text-subtle"]
    # token names (semantic → palette) for documentation; values stay resolved above
    raw = {}
    for f in ("tokens.css",):
        for sel, decls in _rules((TOKENS_DIR / f).read_text()):
            if sel == ":root":
                raw.update(decls)
    tok = lambda name: {"semantic": name, "palette": raw.get(name, "").strip()}
    TOK = {headline: tok("--text-headline"), body_c: tok("--text-body"), subtle: tok("--text-subtle")}

    # prose rhythm (global.css .prose scope) — margin-top / margin-bottom tokens
    p_rule = rule(".prose p")
    h23 = rule(".prose h2", ".prose h3")
    h456 = rule(".prose h4", ".prose h5", ".prose h6")
    p_below = sp(re.search(r"--[\w-]+", p_rule["margin-bottom"]).group(0))
    h23_above = sp(re.search(r"--[\w-]+", h23["margin-top"]).group(0))
    h23_below = sp(re.search(r"--[\w-]+", h23["margin-bottom"]).group(0))
    h456_above = sp(re.search(r"--[\w-]+", h456["margin-top"]).group(0))
    h456_below = sp(re.search(r"--[\w-]+", h456["margin-bottom"]).group(0))

    def heading(tag, prose_override=None, above=h23_above, below=h23_below, color=headline):
        r = rule(tag)
        if prose_override:
            r = {**r, **rule(prose_override)}
        return {
            "font": _family(r["font-family"]), "weight": int(r.get("font-weight", "400")),
            "line": lh(r, "1.2"), "color": color, "above": above, "below": below,
        }

    subtitle = rule(".text-subtitle")
    m = {
        "NORMAL_TEXT": {
            "font": _family(body["font-family"]), "weight": int(body["font-weight"]),
            "line": lh(body), "color": body_c, "above": 0, "below": p_below,
        },
        "TITLE":     {**heading("h1"), "above": 0, "below": sp("--spacing-S")},
        "SUBTITLE":  {
            "font": _family(subtitle["font-family"]), "weight": int(subtitle["font-weight"]),
            "line": lh(subtitle, "1.4"), "color": var(subtitle["color"]),
            "above": 0, "below": sp("--spacing-3XL"),
        },
        "HEADING_1": heading("h1"),
        "HEADING_2": heading("h2"),
        "HEADING_3": heading("h3"),
        "HEADING_4": heading("h4", ".prose h4", h456_above, h456_below),
        "HEADING_5": heading("h5", ".prose h5", h456_above, h456_below),
        "HEADING_6": heading("h6", ".prose h6", h456_above, h456_below),
    }
    for k, v in m.items():
        v["pt"] = DOC_PT[k]
    m["_meta"] = {"subtle": subtle, "headline": headline, "body": body_c, "scale": scale, "tokens": TOK,
                  "margin_pt": PAGE_MARGIN_PT}
    return m


def to_json(style_map: dict | None = None) -> dict:
    """Machine-readable spec of the Docs named styles — published at /tokens/google-docs.json."""
    import datetime
    m = style_map or build_style_map()
    meta = m["_meta"]
    order = ["NORMAL_TEXT", "TITLE", "SUBTITLE", "HEADING_1", "HEADING_2", "HEADING_3",
             "HEADING_4", "HEADING_5", "HEADING_6"]
    label = {"NORMAL_TEXT": "Normal text", "TITLE": "Title", "SUBTITLE": "Subtitle",
             **{f"HEADING_{i}": f"Heading {i}" for i in range(1, 7)}}
    styles = {}
    for k in order:
        s = m[k]
        t = meta["tokens"][s["color"]]
        styles[k] = {
            "label": label[k],
            "fontFamily": s["font"], "fontWeight": s["weight"], "fontSizePt": s["pt"],
            "lineSpacingPercent": s["line"],
            "color": {"hex": s["color"], "token": t["semantic"], "palette": t["palette"]},
            "spaceAbovePt": s["above"], "spaceBelowPt": s["below"],
            "alignment": "CENTER" if k in ("TITLE", "SUBTITLE") else "START",
            "keepWithNext": k != "NORMAL_TEXT",
        }
    return {
        "$schema": "https://design.openmined.org/tokens/google-docs.schema.json",
        "name": "OpenMined Design System — Google Docs named styles",
        "generated": datetime.date.today().isoformat(),
        "generator": "tools/google-docs/omds_docs.py",
        "sources": ["src/tokens/tokens.css", "src/tokens/global.css", "src/tokens/typography.css"],
        "fonts": {"display": "Rubik", "text": "Inter", "note": "Both are Google Fonts; available in the Docs font picker without add-ons."},
        "page": {"marginPt": meta["margin_pt"], "size": "LETTER"},
        "footer": {"text": "OpenMined Foundation · openmined.org", "fontSizePt": 9, "color": {"hex": meta["subtle"], "token": "--text-subtle"}},
        "webToPrintScale": round(meta["scale"], 4),
        "namedStyles": styles,
    }


# ── Docs API request builders ───────────────────────────────────────────────
def _pt(v: float) -> dict:
    return {"magnitude": v, "unit": "PT"}


def named_style_requests(style_map: dict, tab_id: str | None = None) -> list[dict]:
    reqs = []
    for typ, s in style_map.items():
        if typ.startswith("_"):
            continue
        is_heading = typ != "NORMAL_TEXT"
        ns = {
            "namedStyleType": typ,
            "textStyle": {
                "weightedFontFamily": {"fontFamily": s["font"], "weight": s["weight"]},
                "fontSize": _pt(s["pt"]),
                "foregroundColor": _rgb(s["color"]),
                "bold": False, "italic": False, "underline": False,
            },
            "paragraphStyle": {
                # Title + Subtitle centered (the doc's masthead, and the logo in the page header
                # sits in a Title-styled paragraph); body and Heading 1–6 left. Bennett 2026-09-08.
                "alignment": "CENTER" if typ in ("TITLE", "SUBTITLE") else "START",
                "lineSpacing": s["line"],
                "spaceAbove": _pt(s["above"]),
                "spaceBelow": _pt(s["below"]),
                "keepWithNext": is_heading,
                "keepLinesTogether": is_heading,
                "avoidWidowAndOrphan": True,
            },
        }
        fields = ("namedStyleType,textStyle.weightedFontFamily,textStyle.fontSize,textStyle.foregroundColor,"
                  "textStyle.bold,textStyle.italic,textStyle.underline,"
                  "paragraphStyle.alignment,paragraphStyle.lineSpacing,paragraphStyle.spaceAbove,paragraphStyle.spaceBelow,"
                  "paragraphStyle.keepWithNext,paragraphStyle.keepLinesTogether,"
                  "paragraphStyle.avoidWidowAndOrphan")
        req = {"namedStyle": ns, "fields": fields}
        if tab_id:
            req["tabId"] = tab_id
        reqs.append({"updateNamedStyle": req})
    return reqs


def document_style_request(tab_id: str | None = None, margin_pt: float = PAGE_MARGIN_PT) -> dict:
    req = {
        "documentStyle": {k: _pt(margin_pt) for k in ("marginTop", "marginBottom", "marginLeft", "marginRight")},
        "fields": "marginTop,marginBottom,marginLeft,marginRight",
    }
    if tab_id:
        req["tabId"] = tab_id
    return {"updateDocumentStyle": req}


# ── Google auth + API ───────────────────────────────────────────────────────
def sec_get(entity: str, name: str) -> str:
    r = subprocess.run([SEC, "get", entity, name], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ""


class Docs:
    def __init__(self, entity: str = "openmined"):
        cid = sec_get(entity, "google-oauth-client-id") or sec_get(entity, "marketing-client-id")
        sec = sec_get(entity, "google-oauth-client-secret") or sec_get(entity, "marketing-client-secret")
        rt = sec_get(entity, "google-docs-token") or sec_get(entity, "google-refresh-token")
        if not (cid and sec and rt):
            sys.exit(f"Missing {entity} OAuth client or google-docs-token / google-refresh-token in sec.")
        req = urllib.request.Request(
            "https://oauth2.googleapis.com/token",
            data=urllib.parse.urlencode({"client_id": cid, "client_secret": sec,
                                         "refresh_token": rt, "grant_type": "refresh_token"}).encode(),
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        with urllib.request.urlopen(req) as r:
            self.h = {"Authorization": f"Bearer {json.load(r)['access_token']}",
                      "Content-Type": "application/json"}
        self.entity = entity

    def _call(self, url: str, payload: dict | None = None, method: str | None = None):
        data = json.dumps(payload).encode() if payload is not None else None
        rq = urllib.request.Request(url, data=data, headers=self.h, method=method)
        try:
            with urllib.request.urlopen(rq) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            if e.code == 403 and "insufficient" in body.lower():
                sys.exit(f"403 insufficient scope. Restyling a doc this tool didn't create needs the "
                         f"`documents` scope on {self.entity}/google-docs-token — re-mint with "
                         f"`python3 .claude/scripts/docs-write-oauth.py {self.entity}` (dreamland).\n{body}")
            sys.exit(f"HTTP {e.code} {url}\n{body}")

    def create(self, title: str) -> str:
        return self._call(DOCS, {"title": title})["documentId"]

    def get(self, doc_id: str, tabs: bool = True) -> dict:
        q = "?includeTabsContent=true" if tabs else ""
        return self._call(f"{DOCS}/{doc_id}{q}")

    def batch(self, doc_id: str, requests: list[dict]) -> dict:
        if not requests:
            return {}
        return self._call(f"{DOCS}/{doc_id}:batchUpdate", {"requests": requests})


def tab_ids(doc: dict) -> list[str]:
    """All tab IDs in a document (depth-first), or [] for a legacy single-tab doc."""
    out = []

    def walk(tabs):
        for t in tabs or []:
            out.append(t["tabProperties"]["tabId"])
            walk(t.get("childTabs"))

    walk(doc.get("tabs"))
    return out


def apply_styles(docs: Docs, doc_id: str, style_map: dict | None = None, margins: bool = True) -> int:
    """Redefine named styles (+ margins) on every tab of an existing doc. Content untouched."""
    style_map = style_map or build_style_map()
    doc = docs.get(doc_id)
    reqs = []
    for tid in tab_ids(doc) or [None]:
        reqs += named_style_requests(style_map, tid)
        if margins:
            reqs.append(document_style_request(tid))
    docs.batch(doc_id, reqs)
    return len(reqs)


def add_icon_header(docs: Docs, doc_id: str, icon_url: str = DEFAULT_ICON_URL, size_pt: float = ICON_PT) -> bool:
    """First-page header carrying the OpenMined mark, centered, as in the gallery templates.
    No-op if the doc already has a first-page header. Returns True if created."""
    doc = docs.get(doc_id)
    tab = (doc.get("tabs") or [{"documentTab": doc, "tabProperties": {}}])[0]
    ds = tab["documentTab"]["documentStyle"]
    tid = tab["tabProperties"].get("tabId")
    if ds.get("firstPageHeaderId"):
        return False
    t = {"tabId": tid} if tid else {}
    # The API can only *create* DEFAULT headers; a first-page header is materialised by
    # Docs itself when useFirstPageHeaderFooter flips on. Flip, re-read, and use it if
    # it appeared — otherwise fall back to the default header (mark on every page).
    docs.batch(doc_id, [{"updateDocumentStyle": {
        "documentStyle": {"useFirstPageHeaderFooter": True, "marginHeader": _pt(36)},
        "fields": "useFirstPageHeaderFooter,marginHeader", **t}}])
    doc = docs.get(doc_id)
    ds = (doc.get("tabs") or [{"documentTab": doc}])[0]["documentTab"]["documentStyle"]
    hid = ds.get("firstPageHeaderId")
    if not hid:
        # No first-page header → the mark goes in the default header (every page) and the
        # first-page flag must come back off, or page 1 would render an empty header.
        docs.batch(doc_id, [{"updateDocumentStyle": {"documentStyle": {"useFirstPageHeaderFooter": False},
                                                     "fields": "useFirstPageHeaderFooter", **t}}])
        hid = ds.get("defaultHeaderId")
    if not hid:
        rep = docs.batch(doc_id, [{"createHeader": {"type": "DEFAULT",
                                   **({"sectionBreakLocation": {"index": 0, "tabId": tid}} if tid else {})}}])
        hid = rep["replies"][0]["createHeader"]["headerId"]
    loc = {"segmentId": hid, "index": 0, **t}
    docs.batch(doc_id, [
        {"insertInlineImage": {"location": loc, "uri": icon_url, "objectSize": {"height": _pt(size_pt), "width": _pt(size_pt)}}},
        {"updateParagraphStyle": {"range": {"segmentId": hid, "startIndex": 0, "endIndex": 1, **t},
                                  "paragraphStyle": {"namedStyleType": "TITLE", "alignment": "CENTER", "spaceBelow": _pt(3)},
                                  "fields": "namedStyleType,alignment,spaceBelow"}},
    ])
    return True


def url(doc_id: str) -> str:
    return f"https://docs.google.com/document/d/{doc_id}/edit"


if __name__ == "__main__":  # `python3 omds_docs.py [--json [PATH]]` → print / write the style map
    if len(sys.argv) > 1 and sys.argv[1] == "--json":
        out = json.dumps(to_json(), indent=2) + "\n"
        if len(sys.argv) > 2:
            pathlib.Path(sys.argv[2]).write_text(out); print(f"wrote {sys.argv[2]}")
        else:
            print(out)
        sys.exit(0)
    m = build_style_map()
    meta = m.pop("_meta")
    print(f"scale {meta['scale']:.4f} pt/px · headline {meta['headline']} · body {meta['body']} · subtle {meta['subtle']}")
    for k, v in m.items():
        print(f"{k:12} {v['font']:6} {v['weight']}  {v['pt']:>4}pt  lh {v['line']}%  {v['color']}  ↑{v['above']} ↓{v['below']}")
