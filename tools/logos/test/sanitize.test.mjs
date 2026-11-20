// node --test tools/logos/test — the allowlist against hostile SVGs and real-world editor output.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeSvg, MAX_BYTES } from '../sanitize.mjs';

const ok = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="#0A66C2"/></svg>';

test('keeps a plain drawing as it is', () => {
  assert.equal(sanitizeSvg(ok), ok + '\n');
});

const hostile = {
  script: '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
  onload: '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><path d="M0 0"/></svg>',
  onclickUpper: '<svg xmlns="http://www.w3.org/2000/svg"><path ONCLICK="x()" d="M0 0"/></svg>',
  foreignObject: '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><div/></foreignObject></svg>',
  image: '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://x.test/a.png"/></svg>',
  use: '<svg xmlns="http://www.w3.org/2000/svg"><use href="#a"/></svg>',
  xlinkHref: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path xlink:href="https://x.test" d="M0 0"/></svg>',
  anchor: '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><path d="M0 0"/></a></svg>',
  dataUri: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url(data:image/png;base64,AAAA)"/></svg>',
  jsInFill: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="javascript:alert(1)"/></svg>',
  cssUrl: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:url(https://x.test/a)"/></svg>',
  styleImport: '<svg xmlns="http://www.w3.org/2000/svg"><style>@import url(https://x.test/a.css);</style><path d="M0 0"/></svg>',
  styleTagSelector: '<svg xmlns="http://www.w3.org/2000/svg"><style>path{fill:red}</style><path d="M0 0"/></svg>',
  styleBackground: '<svg xmlns="http://www.w3.org/2000/svg"><style>.a{background:url(x)}</style><path class="a" d="M0 0"/></svg>',
  doctype: '<!DOCTYPE svg [<!ENTITY x "y">]><svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>',
  entityRef: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="&x;"/></svg>',
  charRef: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="jav&#x61;script:x"/></svg>',
  cdata: '<svg xmlns="http://www.w3.org/2000/svg"><![CDATA[<script>x</script>]]></svg>',
  pi: '<svg xmlns="http://www.w3.org/2000/svg"><?xml-stylesheet href="x.css"?><path d="M0 0"/></svg>',
  animate: '<svg xmlns="http://www.w3.org/2000/svg"><animate attributeName="href" to="javascript:x"/></svg>',
  set: '<svg xmlns="http://www.w3.org/2000/svg"><set attributeName="onload" to="x"/></svg>',
  text: '<svg xmlns="http://www.w3.org/2000/svg"><text>hi</text></svg>',
  strayText: '<svg xmlns="http://www.w3.org/2000/svg">hello<path d="M0 0"/></svg>',
  wrongNs: '<svg xmlns="http://www.w3.org/1999/xhtml"><path d="M0 0"/></svg>',
  notSvg: '<html><body/></html>',
  unclosed: '<svg xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0"/></svg>',
  unknownAttr: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" onbegin="x" z="1"/></svg>',
  feImage: '<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feImage href="https://x.test/a.png"/></filter></svg>',
  feTurbulence: '<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feTurbulence/></filter></svg>',
  filterExternal: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" filter="url(https://x.test/f.svg#f)"/></svg>',
  gradientExternal: '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a" href="https://x.test/g.svg#b"/></defs></svg>',
  pathHrefLocal: '<svg xmlns="http://www.w3.org/2000/svg"><path href="#a" d="M0 0"/></svg>',
  quoteBreak: `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill='a"onload="x'/></svg>`,
  // url() and other functions, hidden or not.
  urlUpper: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="URL(https://x.test/a)"/></svg>',
  urlSpace: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:url (https://x.test/a)"/></svg>',
  urlEscapedName: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:u\\72l(https://x.test/a)"/></svg>',
  urlEscapedParen: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:url\\28 https://x.test/a)"/></svg>',
  urlUnicodeEscape: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:\\000075rl(https://x.test/a)"/></svg>',
  urlCommentInName: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:url/**/(https://x.test/a)"/></svg>',
  urlCommentInside: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url(/**/https://x.test/a)"/></svg>',
  urlCommentAfterHash: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url(#a/**/)"/></svg>',
  urlHashThenExternal: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url(#a) url(https://x.test/b)"/></svg>',
  urlQuoted: `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url('https://x.test/a')"/></svg>`,
  urlQuotedHash: `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="url('#a')"/></svg>`,
  urlFullwidth: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="ｕｒｌ(https://x.test/a)"/></svg>',
  urlZeroWidth: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="u​rl(https://x.test/a)"/></svg>',
  imageSet: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:image-set(https://x.test/a 1x)"/></svg>',
  cssVar: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:var(--x)"/></svg>',
  cssAttr: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" style="fill:attr(data-x)"/></svg>',
  cssEnv: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="env(x)"/></svg>',
  bareParen: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="(https://x.test/a)"/></svg>',
  classStyleEscape: '<svg xmlns="http://www.w3.org/2000/svg"><style>.a{fill:u\\rl(https://x.test/a)}</style><path class="a" d="M0 0"/></svg>',
  classStyleComment: '<svg xmlns="http://www.w3.org/2000/svg"><style>.a{fill:url/**/(https://x.test/a)}</style><path class="a" d="M0 0"/></svg>',
  transformExpression: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" transform="expression(alert(1))"/></svg>',
  big: `<svg xmlns="http://www.w3.org/2000/svg"><path d="${'M0 0 '.repeat(MAX_BYTES / 4)}"/></svg>`,
};
for (const [name, svg] of Object.entries(hostile)) {
  test(`refuses: ${name}`, () => assert.throws(() => sanitizeSvg(svg)));
}

test('drops editor noise and moves class styles onto the elements', () => {
  const inkscape = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Adobe Illustrator -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sodipodi="x" data-name="Layer 1" viewBox="0 0 10 10" xml:space="preserve">
  <defs><style>.cls-1{fill:#ff0000;}.cls-2,.cls-3{fill:#00f}</style></defs>
  <title>Logo</title><metadata><rdf:RDF/></metadata><sodipodi:namedview id="n"/>
  <path class="cls-1" d="M0 0h5v5z"/><path class="cls-2" fill="#000" d="M5 5h5v5z" style="opacity:.5"/>
</svg>`;
  assert.equal(
    sanitizeSvg(inkscape),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><defs></defs><path d="M0 0h5v5z" fill="#ff0000"/><path fill="#00f" d="M5 5h5v5z" opacity=".5"/></svg>\n',
  );
});

test('keeps gradients and clip paths referenced inside the file', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#00f"/></linearGradient><clipPath id="c"><rect width="2" height="2"/></clipPath></defs><path clip-path="url(#c)" fill="url(#g)" d="M0 0h2v2H0z"/></svg>';
  assert.equal(sanitizeSvg(svg), svg + '\n');
});

test('a gradient may inherit a gradient in the same file', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="a"><stop offset="0" stop-color="#f00"/></linearGradient><linearGradient id="b" xlink:href="#a" x1="0"/></defs></svg>';
  assert.equal(sanitizeSvg(svg), '<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a"><stop offset="0" stop-color="#f00"/></linearGradient><linearGradient id="b" href="#a" x1="0"/></defs></svg>\n');
});

test('a blur filter in the same file is kept', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="k" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1"/></filter></defs><path d="M0 0" filter="url(#k)"/></svg>';
  assert.equal(sanitizeSvg(svg), svg + '\n');
});

test('values may still call colors, transforms and a same-file url(#id)', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" fill="rgb(1, 2, 3)" stroke="hsla(0, 0%, 0%, .5)" transform="matrix(1 0 0 1 0 0) translate(2 3) scale(1.5) rotate(45) skewX(2) skewY(3)"/><path d="M0 0" fill="url(#a)"/></svg>';
  assert.equal(sanitizeSvg(svg), svg + '\n');
});
