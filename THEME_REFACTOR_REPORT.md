# Theme portability correction — implementation and verification report

The semantic architecture is implemented and the **original Weboltrix theme is
restored**. The application remains Tailwind utility-first. No assets, project
data, copy, layout structure, breakpoints, spacing, typography or animation timing
were intentionally changed. This report supersedes the earlier centralization report.

**Acceptance status: browser verification completed on 4 November 2026.**
Original remains active. The corrected state checks, focus checks, screenshot
comparisons and redirect investigation passed for the tested scope. No production
regression fix was required. See [the final verification report](THEME_VERIFICATION_REPORT.md)
for current results and explicit coverage limits.

## Why the previous architecture failed

A centralized pigment is not a visual role. Mapping white simultaneously to page
text, pale cards, selected backgrounds, borders and glows meant that changing one
pigment changed incompatible jobs. The same problem affected ivory/black/ink.

There were also inheritance and state problems:

- A full custom-property alias resolved on the root did not automatically
  recompute when its RGB input changed in a nested section.
- Changing a nested variable did not change an inherited, already-computed
  foreground on its ancestor.
- Selected text and the separate sliding selection thumb did not share a pair.
- Muted text, control rings and dim labels could retain insufficient opacity in
  a new theme even when their solid pigment was appropriate.
- Media text and ordinary page text need separate contexts; photographs retain
  their original pixels when the website theme changes.

## Architecture and files

The long-term theme editing interface is exactly:

1. `src/theme/palette.css`: foundational RGB pigments and reusable full colors.
2. `src/theme/assignments.css`: semantic pairs, contexts, state assignments,
   gradients/effects, alpha inputs and targeted overrides.

Both contain the portable authoring contract as comments. A theme author does not
need JSX or Tailwind configuration to recolor the existing website.

`src/theme/tailwind.js` is a stable build-time adapter. It exposes semantic utility
names and preserves opacity modifiers, arbitrary opacity, responsive variants and
existing shadow geometry. `tailwind.config.js` imports it. The original stylesheet
and JSX still own structural styling. `src/main.jsx` retains the theme imports
introduced in the first refactor. No runtime theme switcher, theme engine or new
dependency was introduced.

The value flow is **pigments → semantic roles → optional local assignments →
existing Tailwind utilities / existing regular CSS / SVG / GSAP endpoints**.

### Role families

| Purpose | Actual inputs |
| --- | --- |
| Page and ordinary text | `--canvas-rgb`, `--heading-rgb`, `--content-rgb` |
| Transparent layers and recessed areas | `--layer-rgb`, `--recess-rgb` |
| Contrasting callouts/cards | `--emphasis-rgb`, `--emphasis-panel-rgb`, `--on-emphasis-rgb`, `--on-emphasis-soft-rgb`, `--emphasis-content-rgb` |
| Primary actions | `--action-rgb`, `--action-bright-rgb`, `--action-foreground-rgb`, `--action-hover-rgb`, `--action-hover-foreground-rgb` |
| Counter-actions inside light regions | `--inverse-action-rgb`, `--inverse-action-alt-rgb`, `--inverse-hover-rgb`, `--inverse-foreground-rgb`, `--inverse-heading-rgb` |
| Selected controls and sliding thumbs | `--selection-rgb`, `--selection-bright-rgb`, `--on-selection-rgb`, `--on-selection-alt-rgb` |
| Focus indicators | `--focus-outline-rgb`, `--focus-ring-rgb`, `--focus-ring-alpha-floor` |
| Borders/progress/icons | `--line-rgb`, `--contrast-line-rgb`, `--signal-rgb` |
| Image overlays and text | `--scrim-rgb`, `--media-heading-rgb`, `--media-content-rgb`, `--media-layer-rgb`, `--media-badge-surface` |
| Opaque panels | `--surface-panel-rgb`, `--surface-raised-rgb`, `--surface-recessed-rgb`, `--surface-control-idle-rgb`, `--surface-control-active-rgb` and related surface inputs |
| Color effects | `--glow-rgb`, `--ambient-rgb`, `--shadow-rgb` |
| Deliberately independent regions | `--footer-*`, `--cta-*` |

These are reusable visual responsibilities, not separate palettes for every
component. Existing `data-color-scope`, `data-color-key` and `data-color-part`
hooks provide local control without duplicating an entire theme per component.
Full-color aliases rebind at every scope boundary. Footer, CTA and media contexts
also reapply the foreground property explicitly.

The original alpha floors are zero. Alternate themes can strengthen muted text,
borders, media washes and focus rings without editing `/60` or `/[0.055]` in JSX.
Dim-label and scroll-text alpha endpoints are now theme inputs too. Their original
values (.16, .2, .35, .45 and .6 where used) remain unchanged in Theme A; animation
positions, visibility endpoints, durations, easing and scroll logic remain.

The build adapter deliberately avoids defining a color named `glow` that would
collide with Tailwind's `shadow-glow` geometry utility. The floating action's
white hover is represented by `hover:bg-action-bright`.

## Coverage

The migration covers ordinary/contrasting sections, cards, primary and secondary
actions, navigation, forms, selectors, tabs and sliders, Footer, CTASection,
project galleries, all active case studies, gradients, alpha layers, shadows,
glows, separators, CSS/SVG artwork, text strokes, and color-related GSAP endpoints.

Examples of the retained workflow are `text-content/60`, `bg-selection`,
`text-on-selection`, `focus-visible:outline-focus-outline`, and
`bg-[color:var(--cta-primary-surface)]`. Non-color utilities remain in place.
Existing regular CSS was not converted to another styling system.

The static audit examined 47 source files: no legacy pigment-purpose utilities,
`--color-*` consumers, hex values or numeric RGB literals remain outside the theme
integration. Dormant components were also migrated, but components not mounted by
active routes do not have browser-rendered coverage.

## Actual verification

The final results are in [THEME_VERIFICATION_REPORT.md](THEME_VERIFICATION_REPORT.md)
and `tests/theme-portability/results/verification-summary.json`.

- All three prior theme builds share unchanged application source; Original CSS
  hashes and application-source hash remain identical to that build proof.
- The corrected browser matrix completed 240 route/theme/viewport samples.
- Baseline and Original have zero settled computed-color or interaction-state
  regressions. Existing approved low contrast remains identical.
- Navy and Light each passed 5,873 normal text checks, 9,973 interactive text
  checks and 162 focus/control/placeholder checks without flagged contrast failures.
- 136 native Chrome pseudo-state comparisons validated the corrected projections.
- 96 screenshots were captured; all 24 Baseline/Original pairs have zero differing
  pixels at 1440/768/390px. Screenshots use reduced motion/frozen CSS animation.
- The redirect's intermittent auto-margin strings did not reflect movement:
  bounding rectangles, settled comparisons and screenshots matched exactly.
- Global, scoped and individual-action override probes passed and restored values.
- The prior production build and static audits passed; no application code changed
  during this final verification, so an additional production rebuild was unnecessary.

The browser initialization failure was worked around using installed headless
Chrome with explicit user permission. Its four isolated temporary profiles and
obsolete one-use audit scripts were removed. The corrected harness and repeatable
runner are retained. Chromium-only, image-pixel/backdrop compositing, continuous
animation and unexercised interaction limits are documented in the final report.

## Exceptions

- Photos, raster logos, screenshots and other fixed asset pixels are unchanged.
  The portable theme controls their surrounding surfaces, badges and scrims;
  it cannot recolor the content of those assets. Brand backing is configurable.
- `transparent`, `currentColor`, `none`, and black alpha-mask stops retain their
  rendering semantics. Black in an alpha mask is coverage, not a visible pigment.
- Existing grayscale/brightness filters and native browser rendering remain.
- An original `bg-black/52` utility emitted no CSS. Its media badge now has the
  explicit semantic `--media-badge-surface`, transparent in Original and a dark
  scrim in the fixtures, preserving the old appearance while making it portable.
- Original low contrast was preserved rather than redesigned.

## Future theme authoring

Give another AI **only the complete palette.css and assignments.css** with this
instruction:

> Return complete replacements for these two files for the requested theme.
> Preserve all token names, selectors, derived formulas and gradient geometry.
> Add pigments as needed and map every semantic surface/foreground, action,
> selection, media and footer/CTA pair deliberately. Coordinate muted alpha,
> focus rings, dim text, borders, shadows and glows. Keep fixed-image overlays
> readable. Do not request component or Tailwind changes. Target AA contrast
> against actual composited surfaces and list any verification assumptions.

Replace the two production files and build. A coherent theme still requires
choosing coherent pairs; the architecture cannot make arbitrary incompatible
values accessible automatically. The comments in both files provide the required
pairing information without depending on this report.

### Practical targeted edits

Change the global page identity by editing the `canvas`, `heading` and `content`
inputs together, then coordinate the other independent pairs. Do not map every
white/black usage to a new pigment indiscriminately.

For an independent CTA region, change these root inputs in assignments.css:

```css
--cta-base-rgb: var(--rgb-neutral-013);
--cta-mid-rgb: var(--rgb-neutral-020);
--cta-heading-rgb: var(--rgb-white);
--cta-content-rgb: var(--rgb-white);
```

For only its primary button, add an intentional override in assignments.css:

```css
[data-color-scope="cta"] [data-color-part="primary-action"] {
  --cta-primary-surface: rgb(var(--rgb-ivory));
  --cta-primary-text: rgb(var(--rgb-neutral-005));
  --cta-primary-hover: rgb(var(--rgb-white));
  --action-hover-foreground-rgb: var(--rgb-neutral-005);
}
```

For a particular service card's primary action, scope RGB role inputs to
`[data-color-scope="service-card"][data-color-key="Business"]`. Full aliases
recompute there. For a custom inherited text override, reapply `color` at the
boundary as explained inside assignments.css. These are examples only; none of
these temporary customization examples was applied to the final theme.

## Verification sign-off

No confirmed regression remains open. The original theme is active; alternate
palettes exist only as verification fixtures/builds. See the final report for
reproduction commands, screenshot links, cleanup and limits.

## Complete modified-file inventory

Paths below are relative to the project root. The inventory includes the carried
forward first refactor because the entire change remains uncommitted.

| Existing file | Necessary change |
| --- | --- |
| `src/components/AboutHero.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/AboutPrinciples.jsx` | Semantic GSAP colors and configurable dim-label alpha; original timing/values retained. |
| `src/components/AboutStory.jsx` | Semantic text/stroke/fill colors and configurable dim-text alpha; original timing/values retained. |
| `src/components/Addons.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/BeforeAfter.jsx` | Media color context and independent focus-ring role; slider behavior retained. |
| `src/components/CTASection.jsx` | Independent CTA surface/action/text roles and brand/context hooks. |
| `src/components/ContactEnquiry.jsx` | Semantic form/focus/selected roles; sliding selector shares selection pair. |
| `src/components/ContactHero.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/DetailedBreakdown.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/FaqSection.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/FeaturedWork.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/FeaturedWorkReveal.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/Featuredworkaccordion.jsx` | Media context, semantic badges and preserved originally unsupported opacity behavior. |
| `src/components/Footer.jsx` | Footer surface, wordmark, inherited foreground and contextual roles. |
| `src/components/HeroShowcase.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/IconMark.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/Layout.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/Navbar.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/PageHero.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ProcessHero.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ProcessQuality.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ProcessSteps.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ProcessTimeline.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ProjectCard.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ProjectRow .jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/SectionHeading.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ServiceCard.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/ServicesHero.jsx` | Semantic card/tab roles; selected text and sliding thumb now share selection pair. |
| `src/components/WhatsAppFloat.jsx` | Primary action/foreground and exact white hover role. |
| `src/components/WhoItsFor.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/WorkHero.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/components/WorkProjects.css` | Existing CSS retains geometry; colors and dim counter alpha use theme inputs. |
| `src/components/WorkProjects.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/hooks/useSiteMotion.js` | Existing motion color/shadow endpoints reference semantic aliases. |
| `src/main.jsx` | Imports the two global CSS theme files alongside the existing stylesheet. |
| `src/pages/About.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/pages/CaseStudy.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/pages/Home.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/pages/Services.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/pages/Work.jsx` | Replaces pigment-purpose colors with semantic utility/CSS/SVG references and retains/adds minimal color hooks. |
| `src/styles.css` | Existing CSS and @apply declarations use semantic values; structural rules retained. |
| `tailwind.config.js` | Connects semantic colors, opacity-aware backgrounds, focus and shadows to the adapter. |

| Added/global/test/documentation file | Purpose |
| --- | --- |
| `src/theme/palette.css` | Portable foundational pigments and author guidance. |
| `src/theme/assignments.css` | Portable semantic/context/state mappings and author guidance. |
| `src/theme/tailwind.js` | Stable build-time Tailwind adapter. |
| `src/theme/README.md` | Usage and verification guide; not required for theme generation. |
| `scripts/verify-theme.mjs` | Static role/consumer/fixture contract validation. |
| `scripts/verify-theme-portability.mjs` | Only-two-file build proof, restoration and local audit server. |
| `scripts/verify-theme-states.cjs` | Original compiled interactive-rule equivalence check. |
| `tests/theme-portability/audit.html` | Local test harness UI; not production code. |
| `tests/theme-portability/audit.js` | Computed styles, contrast, interactions and override-isolation inspection. |
| `tests/theme-portability/results/verification-summary.json` | Honest retained results and pending verification limitations. |
| `tests/theme-fixtures/navy/palette.css` | Dark-blue verification pigments. |
| `tests/theme-fixtures/navy/assignments.css` | Dark-blue verification role mapping. |
| `tests/theme-fixtures/light/palette.css` | Light-blue verification pigments. |
| `tests/theme-fixtures/light/assignments.css` | Light-blue verification role mapping. |
| `THEME_REFACTOR_REPORT.md` | This report, superseding the earlier architecture report. |

Verification-only additions: `scripts/run-theme-browser-verification.mjs`,
`tests/theme-portability/capture.mjs`, `tests/theme-portability/native-states.mjs`,
`THEME_VERIFICATION_REPORT.md`, and the final JSON/PNG evidence under
`tests/theme-portability/results`. The existing audit inspector gained projected-rule
assertions and bounding-rectangle diagnostics. No production source changed during sign-off.
