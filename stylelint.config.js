/**
 * OMDS — stylelint enforcement gate
 * ════════════════════════════════════════════════════════════════════
 * P0 of "enforce via vibe": raw color values are UN-SHIPPABLE on brand
 * surfaces. tokens.css is the single place literal palette values may
 * live; every other file must reference a design token via var(--…).
 *
 * Three rules, deliberately minimal — a focused gate stays high-signal
 * for both humans and AI agents. We do NOT extend stylelint-config-standard
 * on purpose: its ~40 stylistic rules would bury the one rule that matters
 * (no raw colors) under noise on this hand-authored token system.
 *
 *   1. color-no-hex   — no #rrggbb anywhere
 *   2. color-named    — no `red`/`blue`/… named colors anywhere
 *   3. strict-value   — color properties must be a var() token, which also
 *                       closes the rgb()/hsl() literal bypass
 * ════════════════════════════════════════════════════════════════════
 */

// `/color$/` matches color, background-color, border-*-color, outline-color,
// caret-color, text-decoration-color, column-rule-color — but NOT color-scheme.
//
// box-shadow is intentionally NOT here: the 1px-ring hack (`box-shadow: 0 0 0
// 1px var(--token)`) tokenizes the color but can't be a single var(), so it
// would false-positive. color-no-hex + color-named still police shadow colors;
// the only residual gap is an rgb()/hsl() literal inside a shadow (rare).
const COLOR_PROPS = ['/color$/', 'fill', 'stroke'];

// Bare CSS-wide keywords that are legal on color properties and carry no value.
const ALLOWED_KEYWORDS = [
  'currentColor', 'transparent', 'inherit', 'initial', 'unset', 'revert', 'none',
];

export default {
  ignoreFiles: [
    'dist/**',
    '.astro/**',
    // The palette IS the raw-value source of truth — literal hex is correct here.
    'src/tokens/tokens.css',
    // WebGL tuning tooling with its own local control-panel palette — not a
    // brand surface. Known, tracked exception (see CLAUDE.md › Enforcement).
    'src/pages/diamond/**',
    'src/pages/stream/**',
  ],

  // Lint <style> blocks inside .astro components/pages.
  overrides: [
    { files: ['**/*.astro'], customSyntax: 'postcss-html' },
  ],

  plugins: ['stylelint-declaration-strict-value'],

  rules: {
    'color-no-hex': [true, {
      message:
        'OMDS: no raw hex. Use a token — e.g. var(--color-teal-600), var(--surface-background-default), var(--text-body). Literal palette values live only in src/tokens/tokens.css.',
    }],

    'color-named': ['never', {
      message: 'OMDS: no named colors. Use a design token via var(--…).',
    }],

    'scale-unlimited/declaration-strict-value': [
      COLOR_PROPS,
      {
        ignoreKeywords: ALLOWED_KEYWORDS,
        ignoreFunctions: false, // disallow rgb()/hsl()/etc. literals — only var() passes
        disableFix: true,
        message:
          'OMDS: color properties must reference a design token — use var(--…) from tokens.css, not a literal value.',
      },
    ],
  },
};
