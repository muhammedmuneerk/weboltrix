# Portable color themes

The production editing interface is **palette.css + assignments.css**. Send both
complete files to a theme author. Their comments contain the role contract,
contrast pairs, alpha rules, inheritance rules and targeted-edit examples.
Keep every variable/selector/formula; change pigment values and semantic inputs.

- `palette.css`: RGB pigments and reusable exact solid/alpha colors.
- `assignments.css`: independent surface/foreground pairs, actions, selections,
  image contexts, footer/CTA contexts, effects, dim-text alpha endpoints and
  contextual overrides. This is where a whole new theme is coordinated.
- `tailwind.js`: build-time adapter, not a theme editing file. Keeps Tailwind
  colors, `/NN`, `/[0.NN]`, variants and shadow geometry available as utilities.

For example, `text-content/60`, `bg-selection`, `text-on-selection`,
`focus-visible:outline-signal`, and `bg-[color:var(--cta-primary-surface)]`
remain Tailwind utilities. Layout/spacing/type classes remain in JSX.
Existing ordinary CSS remains ordinary CSS with semantic value references.

## Safe authoring workflow

1. Copy both current CSS files.
2. Add/change pigments in palette; map canvas/heading/content and the independent
   emphasis, action, inverse-action, selection and media pairs in assignments.
3. Coordinate all opaque panels, transparent washes, footer/CTA, shadows/glows,
   focus/edges, muted alpha floors and dim-label opacity. Test actual composites.
4. Preserve role names, selectors, derived alias formulas and gradient geometry.
5. Replace only the two production CSS files, run the static check and build,
   then inspect all routes and states at mobile/tablet/desktop sizes.

Do not blindly recolor `white`, `black` or `ivory`. A light page may still require
white text on a blue button, white badges over photos and a dark CTA/footer.
There is no runtime switcher or alternate theme loaded by the application.

## Targeted edits

The existing `data-color-scope`, `data-color-key` and `data-color-part` hooks let
assignments.css address an intentional region or action. Reusable roles are not
isolated component palettes. Derived full-color aliases rebind at scope boundaries.
If changing inherited text, explicitly set `color: rgb(var(--heading-rgb))` there;
a descendant variable alone does not recalculate an ancestor's computed color.

```css
/* Example only: independent service-card primary action. */
[data-color-scope="service-card"][data-color-key="Business"] {
  --action-rgb: var(--rgb-ivory);
  --action-foreground-rgb: var(--rgb-neutral-005);
  --action-hover-rgb: var(--rgb-white);
}
/* Independent CTA primary action, including its hover pair. */
[data-color-scope="cta"] [data-color-part="primary-action"] {
  --cta-primary-surface: rgb(var(--rgb-ivory));
  --cta-primary-text: rgb(var(--rgb-neutral-005));
  --cta-primary-hover: rgb(var(--rgb-white));
  --action-hover-foreground-rgb: var(--rgb-neutral-005);
}
```

## Verification

`node scripts/verify-theme.mjs` checks token completeness, fixture compatibility
and absence of legacy pigment-purpose consumers. It is not a contrast test.

`node scripts/verify-theme-portability.mjs` builds the historical baseline and
Original/Navy/Light bundles. Only the two theme CSS files change between the
three theme builds. Source hashes prove this; `finally` restores Original.
Open `http://127.0.0.1:5183/__audit`, then **Run complete comparison**. The local
harness checks 1440/768/390px, six main routes, ten active case studies and four
legacy-slug fallbacks. It measures computed colors/layout, text composites and
projected CSS hover/active/focus states, plus real local React selections.
`--serve-only` serves already built fixtures without rebuilding.

Fixtures in `tests/theme-fixtures` are test-only complete copies of the two-file
interface. They are never imported by the app. Results and build proofs are
written to ignored `.cache/theme-portability`; retained evidence is documented
in `THEME_REFACTOR_REPORT.md`.

Contrast checks use 4.5:1 for ordinary text, 3:1 for large text and measured
control/focus edges. Conservative gradient-stop combinations can overestimate
worst cases. Image pixels, blur, all continuous animation frames, native browser
focus painting and unexercised form flows still require human review. The
Original has approved low-contrast text; preserving it is intentional, not an AA
certification. See the report for exact measured results and limitations.

Final browser verification passed for the tested Chromium scope; see
`THEME_VERIFICATION_REPORT.md` and
`tests/theme-portability/results/verification-summary.json`.
The corrected state projections were checked against native Chrome states, and
24 Baseline/Original screenshot pairs were pixel-identical. The original theme's
existing low contrast and the report's coverage limits remain explicit.
Use `node scripts/run-theme-browser-verification.mjs` with the existing audit
server to reproduce; `--capture-only` captures comparisons and `--states-only`
checks native pseudo-states. These runs reuse build fixtures, restore the test
server to Original and remove their isolated Chrome profile.
