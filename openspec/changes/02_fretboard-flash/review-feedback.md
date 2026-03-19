# Review Feedback — Task 5.3: Visual styling of note marker (color, size, animation)
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Low
- **Finding**: Blank lines between `@keyframes` percentage selectors are inconsistent with existing animation style in `_animations.scss`
- **Fix**: Remove blank lines between keyframe selectors

- **Severity**: Low
- **Finding**: Test helper `collectAllCssRules()` name is overly generic for its single use case
- **Fix**: Rename to something more descriptive like `collectAllStyleSheetRules()`

- **Severity**: Low
- **Finding**: Test description "should define a @keyframes..." wording could be clearer
- **Fix**: Minor rewording suggestion

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Low
- **Finding**: Signal `note()` is read 3 times in the template (once in `@if`, twice for `.x` and `.y`). Minor inefficiency.
- **Fix**: Use `@let n = note()` to cache the signal value in the template

- **Severity**: Low
- **Finding**: 70% keyframe omits explicit `opacity: 1` — clarity issue, not correctness
- **Fix**: Add `opacity: 1` at the 70% keyframe

- **Severity**: Low
- **Finding**: `collectAllCssRules()` scans all stylesheets on each test invocation without caching
- **Fix**: Cache result or scope scan

### architect-reviewer
- **Severity**: Medium
- **Finding**: Border color `rgba(255, 255, 255, 0.9)` is hardcoded rather than using a CSS custom property, inconsistent with the design token pattern used for glow and accent color
- **Fix**: Add `--gt-marker-border` to `_theme.scss` and reference it in the component

- **Severity**: Medium
- **Finding**: Glow color raw `rgba()` values are copy-pasted in `_theme.scss` instead of referencing SCSS variables from `_variables.scss`, following the `$card-shadow` pattern
- **Fix**: Define `$marker-glow-light` and `$marker-glow-dark` SCSS variables in `_variables.scss`

- **Severity**: Low
- **Finding**: `@keyframes note-marker-appear` is in the component SCSS while `fadeInUp` is in `_animations.scss` — inconsistency in animation placement policy
- **Fix**: Either move to `_animations.scss` or document the policy

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### architect-reviewer — Hardcoded border color instead of CSS custom property
- **Decision**: Fix
- **Reasoning**: The component already uses `var(--gt-accent)` for background and `var(--gt-marker-glow)` for box-shadow, so the hardcoded `rgba(255, 255, 255, 0.9)` border is a genuine inconsistency. In dark mode the white border may be fine, but in light mode a white border on a potentially light background is questionable. Adding `--gt-marker-border` to `_theme.scss` is a small, low-risk change that completes the design token pattern already in use. No new complexity introduced.

#### architect-reviewer — Glow color raw rgba values copy-pasted in _theme.scss
- **Decision**: Fix
- **Reasoning**: The existing pattern in `_theme.scss` is clear: raw color values live in `_variables.scss` as SCSS variables (e.g., `$card-shadow`, `$card-shadow-dark`), and `_theme.scss` references them. The `--gt-marker-glow` values bypass this pattern by inlining raw `rgba()` values directly. This is a real consistency issue and easy to fix by adding `$marker-glow` and `$marker-glow-dark` variables. Low risk, no new complexity.

#### Low-severity / Nitpick findings
- **codestyle-reviewer — Blank lines between keyframe selectors**: Will fix. The existing `_animations.scss` uses no blank lines between keyframe selectors. Removing the blank lines in the component SCSS is a trivial consistency fix.
- **codestyle-reviewer — Test helper name `collectAllCssRules()`**: Will not fix. The name is clear enough in context and renaming it adds no meaningful value. The function is private to the test file.
- **codestyle-reviewer — Test description wording**: Will not fix. The current wording is understandable. Subjective preference.
- **performance-reviewer — Signal read 3 times in template**: Will fix. Using `@let` to cache the signal value is a clean one-liner improvement that follows Angular best practices and avoids redundant signal reads.
- **performance-reviewer — Missing explicit opacity at 70% keyframe**: Will not fix. The browser correctly interpolates `opacity` between 0% and 100% keyframes. Adding it would be purely cosmetic documentation in CSS, not a correctness issue.
- **performance-reviewer — `collectAllCssRules()` scans all stylesheets without caching**: Will not fix. This is a test helper that runs in a test environment with minimal stylesheets. Optimizing test utility performance is unnecessary overhead.
- **architect-reviewer — Animation placement inconsistency**: Will not fix. `fadeInUp` is a global reusable animation used across multiple components. `note-marker-appear` is component-specific (it includes `translate(-50%, -50%)` offsets tied to the marker's positioning). Keeping component-specific animations co-located with the component is the correct scoping decision. No policy documentation needed at this scale.

## Re-Review (Cycle 2)
- **codestyle-reviewer**: PASS — blank lines between keyframe selectors removed correctly
- **security-reviewer**: PASS — no security changes to re-evaluate
- **performance-reviewer**: PASS — `@let n = note()` caching applied correctly
- **architect-reviewer**: FAIL — `--gt-marker-border` uses raw `rgba()` in `_theme.scss` instead of a SCSS variable in `_variables.scss`. The glow fix (`$marker-glow`) was applied correctly, but the border value was not extracted to a variable following the same pattern.

### Engineer Assessment (Cycle 2)
### Overall Decision: REFACTOR
### Reasoning per finding

#### architect-reviewer — Border value not extracted to SCSS variable
- **Decision**: Fix
- **Reasoning**: The original finding asked for a CSS custom property (done) but the pattern established by the glow fix in this same PR is to also back it with a SCSS variable in `_variables.scss`. The `$marker-glow` / `$marker-glow-dark` pattern was correctly applied for the glow, but the border was left as raw `rgba()` in `_theme.scss`. This is a minor inconsistency within the same PR. Adding `$marker-border` to `_variables.scss` and referencing it is trivial.

## Re-Review (Cycle 3)
- **architect-reviewer**: PASS — `$marker-border` variable added to `_variables.scss`, both theme blocks in `_theme.scss` now reference `#{gt.$marker-border}`. No raw `rgba()` literal remains.

### Engineer Assessment (Cycle 3)
### Overall Decision: ACCEPT
