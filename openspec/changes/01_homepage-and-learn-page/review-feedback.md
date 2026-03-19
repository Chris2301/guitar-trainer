# Review Feedback — Task 2.2 (Create LearnComponent with placeholder text)
## Status: NEEDS ASSESSMENT
## Findings

### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: `@keyframes fadeInUp` is duplicated verbatim in both `learn.scss` and `home.scss`. The animation name, timing values, and transform are identical. As more pages are added this will drift.
- **Fix**: Move `@keyframes fadeInUp` into a shared `_animations.scss` partial under `frontend/src/app/theme/` and `@use` it from both component stylesheets.

- **Severity**: Medium
- **Finding**: The heading uses `<h1>` but HomeComponent uses `<h2>` for its primary visible heading. If both pages are reachable under a shared shell with a global `<h1>`, the learn page would have two `<h1>` elements — a heading hierarchy violation affecting screen readers and SEO.
- **Fix**: Audit whether the shell/layout component renders an `<h1>`. If it does, downgrade to `<h2>` here. If no global `<h1>` exists, the current usage is correct.

- **Severity**: Low
- **Finding**: The placeholder text hardcodes English. The spec requires i18n support in three languages (NL, DE, EN). HomeComponent's text is also hardcoded, so this is not a regression.
- **Fix**: No action needed now — i18n is a separate task (4.3). Track for later.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — Duplicated @keyframes fadeInUp in learn.scss and home.scss
- **Decision**: Fix
- **Reasoning**: Verified that the `@keyframes fadeInUp` block is identical in both `home.scss` (lines 8-17) and `learn.scss` (lines 3-12) — same name, same timing, same transform values. This is a real duplication issue. With task 3.x still ahead (shared header, more pages), this will only get worse. Extracting to a shared `_animations.scss` partial under `frontend/src/app/theme/` is a small, low-risk refactor that follows the existing pattern (both files already `@use '../theme/variables'`). The fix is straightforward and prevents drift.

#### architect-reviewer — Heading hierarchy violation with duplicate h1 elements
- **Decision**: Fix
- **Reasoning**: Confirmed that `app.html` renders a global `<h1 class="visually-hidden">Guitar Trainer</h1>` wrapping the router-outlet. The learn page adds a second `<h1>Learn</h1>`, resulting in two h1 elements on the page. The home page correctly uses `<h2>` for its primary heading. This is a real accessibility issue — screen readers announce document structure based on heading hierarchy, and two h1 elements is a WCAG violation. The fix is trivial: change `<h1>` to `<h2>` in `learn.html` and adjust the corresponding SCSS class name if needed. No risk.

#### Low-severity / Nitpick findings
- The hardcoded English text finding is accepted as-is. It is not a regression (home page does the same), and i18n is explicitly scoped to task 4.3. No action needed now.

---

## Cycle 2 Review (after refactor)

### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
No issues found. Both previous findings confirmed fixed: shared `_animations.scss` partial created and used by both components, heading downgraded to `<h2>`, all test selectors updated.

## Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT

### Reasoning
All four reviewers returned no issues on re-review. Both Medium findings from cycle 1 were correctly addressed across all affected files. No new issues introduced.
