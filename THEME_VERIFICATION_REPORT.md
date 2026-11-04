# Browser verification — 4 November 2026

**PASS for the tested scope. Original remains active. No application regression
was found and no production JSX, CSS, Tailwind configuration, theme assignments,
assets or interaction code was changed during this verification.**

The two browser-control integrations could not initialize. With the user's
permission, the existing harness ran in installed headless Chrome using isolated
temporary profiles and the existing Baseline/Original/Navy/Light build bundles.
No theme rebuild or architecture changes were needed.

## Results

The corrected harness completed **240 samples**: four builds × 20 URLs ×
1440/768/390px. This covers all six main pages, ten active case studies and four
legacy-slug redirects. The Original theme matches its baseline's computed colors
and interactive CSS states with **zero settled regressions**.

| Check, per theme | Baseline | Original | Navy | Light |
| --- | ---: | ---: | ---: | ---: |
| Normal text checks | 5,873 | 5,873 | 5,873 | 5,873 |
| Normal contrast flags | 1,636 | 1,636 | 0 | 0 |
| Interactive text checks | 9,973 | 9,973 | 9,973 | 9,973 |
| Interactive contrast flags | 1,842 | 1,842 | 0 | 0 |
| Focus/control/placeholder checks | 162 | 162 | 162 | 162 |
| Focus/control/placeholder flags | 12 | 12 | 0 | 0 |

The Original flags are the approved baseline's existing low contrast; they were
preserved. Counts include repeated shared elements across routes and widths.
Targets were 4.5:1 for ordinary text/placeholders and 3:1 for large text and measured
focus/control edges. Backgrounds/alpha/gradients were composited conservatively.

For each build, the harness exercised 1,912 hover, 1,912 active and 1,912 focus
projections plus 132 real local React selections. The repaired stylesheet walker
now projects 87 baseline / 88 current interaction rules. Focus rings are measured
from the browser's resolved painted shadow color, not an unresolved custom value.
A further **136 native Chrome pseudo-state comparisons passed**, confirming that
representative hover/active/focus rendering matches those projections.

The 162 focus/control checks comprise 72 rings, 74 outlines, 12 placeholders and
four control borders. No disabled controls were encountered in the sampled states.

## Screenshot comparisons

Captured **96 viewport screenshots** covering six main page headers, the home CTA,
and the legacy redirect across all four builds and three widths. Every one of the
**24 baseline-versus-Original pairs was pixel-identical: zero differing pixels**.
The Navy and Light contact sheets were visually inspected for coordinated page,
card, button, media and CTA surfaces/foregrounds.

Screenshots use reduced motion and frozen CSS animation/transitions for a stable
comparison. Normal-motion startup and interactions were used in the main audit.
The pixel result applies to the captured views, not every frame of every animation.

- [Desktop contact sheet](tests/theme-portability/results/comparison-1440.png)
- [Tablet contact sheet](tests/theme-portability/results/comparison-768.png)
- [Mobile contact sheet](tests/theme-portability/results/comparison-390.png)
- [Machine-readable results](tests/theme-portability/results/verification-summary.json)
- [Native state results](tests/theme-portability/results/native-state-results.json)
- [Screenshot comparisons and geometry](tests/theme-portability/results/screenshot-results.json)

## Legacy redirect margin investigation

`/work/todo-app` resolves to `/work` as intended. Initial inspection reproduced six
intermittent computed margin differences on grid containers (0px versus 72.5px in
this Chrome viewport). **All affected bounding rectangles were identical** between
Baseline and Original, including x/y/width/height. Inline styles were unchanged.
Settled comparisons had no differences. Direct `/work` and redirect container
geometry matched, and redirect screenshots matched pixel-for-pixel at all widths.

This was a computed auto-margin reporting discrepancy without an observed layout
shift. No layout or application fix was justified or made.

## Preservation and cleanup

Original palette/assignment hashes match the saved build proof. The non-theme
application source hash also matches the previously verified builds, preserving
the proof that only palette.css and assignments.css differ between themes.
Global/scoped/individual-action override probes still pass and restore their values.

Removed obsolete one-use migration/audit patch scripts, superseded audit data and
all four temporary Chrome profiles. Kept the reusable audit runner, fixtures,
baseline/build bundles, final raw results and screenshot evidence. Future runs
restore the test server to Original and clean up their isolated profile.

## Remaining limits

No confirmed regression remains open. This is Chromium verification, not a
cross-browser accessibility certification. Fixed image pixels, every backdrop-filter
composite, every continuous animation frame, all drag/scroll positions, native
OS rendering, external links and actual form submissions were not exhaustively
tested. Original low-contrast styling remains intentionally unchanged.

To reproduce without rebuilding the themes, run the existing audit server with
`node scripts/verify-theme-portability.mjs --serve-only`, then use:

```text
node scripts/run-theme-browser-verification.mjs
node scripts/run-theme-browser-verification.mjs --capture-only
node scripts/run-theme-browser-verification.mjs --states-only
```
