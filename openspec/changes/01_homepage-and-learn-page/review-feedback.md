# Review Feedback — Task 1.5 (Styling: bunny.net-inspired color palette, typography, spacing)
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: Inconsistent padding shorthand in `.hero` — uses `padding: gt.$section-padding` then overrides with `padding-top: 6rem; padding-bottom: 6rem;`
- **Fix**: Use `padding: 6rem 1.5rem;` directly and remove the overrides

- **Severity**: Medium
- **Finding**: Magic numbers scattered through home.scss (font-sizes, spacings) without variable references
- **Fix**: Extract commonly used values into `_variables.scss`

- **Severity**: Low
- **Finding**: Hardcoded animation delays per nth-child instead of using SCSS `@for` loop
- **Fix**: Use `@for` loop for consistency with `.fade-in` utility pattern

- **Severity**: Low
- **Finding**: CTA wrapped in `<section>` but contains only a single link
- **Fix**: Change to `<div>` or add semantic structure

- **Severity**: Low
- **Finding**: Inline hardcoded `#0a3050` in dark theme gradient instead of using `gt.$dark-elevation-2`
- **Fix**: Use `#{gt.$dark-elevation-2}` for consistency

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Medium
- **Finding**: No `prefers-reduced-motion` guard — page fires 6 CSS animations simultaneously on first paint, violating WCAG 2.1 AA (2.3.3)
- **Fix**: Add `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }` to `styles.scss`

- **Severity**: Low
- **Finding**: Card hover transitions `box-shadow` which triggers paint on every frame
- **Fix**: Accept at current scale (4 cards) or use pseudo-element opacity pattern

- **Severity**: Low
- **Finding**: CTA shine effect transitions `left` property (triggers reflow) instead of `transform: translateX()`
- **Fix**: Replace `left` transition with `transform: translateX()` for compositor-only animation

### architect-reviewer
- **Severity**: Medium
- **Finding**: CTA button replaced Taiga UI `tuiButton` with fully custom-styled anchor, deviating from project's Taiga UI component library decision
- **Fix**: Either document the deviation with a comment explaining why (shine effect not achievable via Taiga UI API), or layer the shine effect on top of Taiga UI's button

- **Severity**: Medium
- **Finding**: `fadeInUp` keyframe defined globally in `styles.scss` but referenced in encapsulated `home.scss` — fragile coupling. `.fade-in` utility class is dead code.
- **Fix**: Move `@keyframes fadeInUp` into `home.scss` directly. Remove unused `.fade-in` utility class.

- **Severity**: Medium
- **Finding**: Raw hex `#0a3050` in dark theme gradient bypasses `_variables.scss` single-source-of-truth
- **Fix**: Replace with `#{gt.$dark-elevation-2}`

- **Severity**: Low
- **Finding**: Dark theme card shadows hardcoded inline instead of using SCSS variables
- **Fix**: Add `$card-shadow-dark` and `$card-shadow-hover-dark` to `_variables.scss`

- **Severity**: Low
- **Finding**: Emoji icons accessibility handled correctly with `aria-hidden="true"` — no action needed
- **Fix**: No change required

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — Inconsistent padding shorthand in `.hero`
- **Decision**: Fix
- **Reasoning**: The current code sets `padding: gt.$section-padding` (which is `5rem 1.5rem`) and then immediately overrides the top/bottom with `padding-top: 6rem; padding-bottom: 6rem;`. This is confusing — the shorthand value is effectively dead for its vertical component. Replacing with `padding: 6rem 1.5rem` is a one-line fix that improves clarity. The same pattern repeats in the mobile breakpoint with `$section-padding-mobile` overridden by `4rem`. Straightforward cleanup.

#### codestyle-reviewer — Magic numbers without variable references
- **Decision**: Fix
- **Reasoning**: Values like `font-size: 2rem`, `font-size: 1.2rem`, `font-size: 0.95rem`, `gap: 2rem`, `padding: 2rem` appear repeatedly in `home.scss` without corresponding variables in `_variables.scss`. The project already established the pattern of extracting sizing values (see `$hero-font-size`, `$subtitle-font-size`). Extracting the most-repeated values (heading size, card padding, icon size) keeps the variables file as the single source of truth and makes future theme adjustments easier. The key values to extract are feature heading size, card padding, and feature description size.

#### performance-reviewer — No `prefers-reduced-motion` guard
- **Decision**: Fix
- **Reasoning**: This is a legitimate accessibility concern. The page fires multiple `fadeInUp` animations on load plus hover transitions on cards and CTA. Users who have configured reduced motion in their OS should not be subjected to these. Adding a `@media (prefers-reduced-motion: reduce)` rule in `styles.scss` is minimal effort (3-4 lines) and addresses WCAG 2.1 AA criterion 2.3.3. This is the right place to fix it globally rather than per-component.

#### architect-reviewer — CTA button replaced Taiga UI `tuiButton` with custom anchor
- **Decision**: Accept
- **Reasoning**: The project spec in `project.md` explicitly calls for "shine-effect op hover" on buttons. Taiga UI's button API does not support injecting pseudo-element-based shine animations. Wrapping a Taiga UI button and overriding its styles to add the shine pseudo-element would be more fragile than a clean custom implementation. The current CTA button is a single, self-contained styled anchor with clear purpose. The deviation is justified by the design requirement. Adding a comment to document this decision is worthwhile and can be done during refactor.

#### architect-reviewer — `fadeInUp` keyframe globally defined but used in encapsulated component; `.fade-in` is dead code
- **Decision**: Fix
- **Reasoning**: This is a real issue on two fronts. First, `home.scss` uses `animation: fadeInUp` which only works because Angular's `ViewEncapsulation.Emulated` does not encapsulate keyframe names — this is an implementation detail that could break if encapsulation changes. Moving the keyframe into `home.scss` makes the dependency explicit. Second, the `.fade-in` utility class in `styles.scss` is unused (the component uses inline `animation` declarations with manual delays instead). Dead code violates the project's code quality rules ("No dead code"). Both should be cleaned up.

#### architect-reviewer — Raw hex `#0a3050` in dark theme gradient bypasses `_variables.scss`
- **Decision**: Fix
- **Reasoning**: The variable `$dark-elevation-2: #0a3050` already exists in `_variables.scss`. Using the raw hex in `_theme.scss` line 81 is an oversight — it defeats the single-source-of-truth pattern the variables file establishes. This is a one-character fix (replace the hex with the variable reference). Both the codestyle-reviewer and architect-reviewer flagged this independently, which confirms it is a real inconsistency.

#### Low-severity / Nitpick findings
- **Hardcoded animation delays per nth-child**: Will fix during refactor since we are already touching the animation code (moving keyframes into `home.scss`). Using an `@for` loop is cleaner and scales if more cards are added.
- **CTA wrapped in `<section>`**: Will not fix. The CTA is a visually distinct section of the page with its own background. Using `<section>` is semantically acceptable for a thematic grouping, even if it contains a single element. Changing to `<div>` would be equally valid but not meaningfully better.
- **Inline `#0a3050` in dark theme gradient**: Already addressed above as part of the architect-reviewer Medium finding.
- **Card hover `box-shadow` triggers paint**: Accept at current scale (4 cards). The reviewer themselves noted this is acceptable.
- **CTA shine effect uses `left` instead of `transform`**: Will fix during refactor since we are already touching the CTA button styles. Using `transform: translateX()` is a compositor-only operation and the fix is straightforward.
- **Dark theme card shadows as SCSS variables**: Will fix since we are already adding variables to `_variables.scss` for the magic numbers finding. Adding `$card-shadow-dark` and `$card-shadow-hover-dark` is consistent with the existing `$card-shadow` / `$card-shadow-hover` pattern.

---

## Cycle 2 Review (after refactor)

### codestyle-reviewer
No issues found. All previous findings confirmed fixed: padding shorthand consistent, magic numbers extracted to variables, animation delays use `@for` loop, hex replaced with variable reference.

### security-reviewer
No issues found.

### performance-reviewer
No issues found. `prefers-reduced-motion` guard correctly applied. CTA shine effect now uses `transform: translateX()` instead of `left`.

### architect-reviewer
No issues found. All previous findings confirmed fixed: CTA deviation documented with comment, `fadeInUp` moved to component, `.fade-in` dead code removed, raw hex replaced with variable, dark theme shadows use SCSS variables.

## Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT

### Reasoning
All four reviewers returned no issues on re-review. All 5 Medium findings and 4 Low findings marked for fixing in cycle 1 were correctly addressed. No new issues introduced.
