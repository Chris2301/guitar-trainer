# Review Feedback — Task 1.4 (CTA button to learn page)
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: The `.cta [tuiButton]` attribute selector overrides all Taiga UI buttons within `.cta`, making `appearance="accent"` meaningless. If more buttons are added, they'll unintentionally inherit the orange gradient.
- **Fix**: Target the specific CTA button using `[data-testid='cta-learn']` instead of `[tuiButton]` to scope the styling.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: The SCSS block overrides Taiga UI's internal rendering (background, padding, font-size, color) with hardcoded values and `#fff`. The theme already maps `--tui-background-accent-2` to the orange palette when `appearance="accent"` is used. This hand-rolled gradient fights against Taiga UI's theming system and will break if Taiga UI changes its rendering.
- **Fix**: Remove the `.cta [tuiButton]` block entirely. The `appearance="accent"` attribute already routes to the orange palette via `_theme.scss`. If a gradient is required, introduce it as a CSS custom property override in `_theme.scss`. Replace hardcoded `#fff` with a Taiga UI token.

- **Severity**: Low
- **Finding**: Test assertion `expect(cta.getAttribute('href')).toBe('/learn')` is fragile — Angular's router resolves `href` only after router outlet and LocationStrategy run. With `provideRouter([])` (empty route table), resolution is non-deterministic.
- **Fix**: Either add the `/learn` route to the test's `provideRouter()` config, or assert `routerLink` directly using Angular's `By.directive` approach.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — `.cta [tuiButton]` selector too broad
- **Decision**: Fix
- **Reasoning**: This is a valid finding. The `[tuiButton]` attribute selector inside `.cta` will match any Taiga UI button placed in that container in the future. While there is currently only one button, this is a maintainability trap that is trivial to fix now. The suggested fix of targeting `[data-testid='cta-learn']` is reasonable, though I would prefer a dedicated CSS class (e.g., `.cta__button`) over coupling styles to a test ID. Using `data-testid` for styling blurs the separation between testing hooks and styling hooks. This will be addressed together with the architect finding below, since both concern the same SCSS block.

#### architect-reviewer — Hand-rolled gradient overrides Taiga UI theming
- **Decision**: Fix
- **Reasoning**: This is the most important finding and it is correct. Looking at `_theme.scss`, `--tui-background-accent-2` is already mapped to the orange palette (`$accent-orange`) for both light and dark themes. The `appearance="accent"` attribute on the Taiga button routes to this token. The current SCSS block on lines 60-70 of `home.scss` overrides background, color, padding, and font-size with hardcoded values, which:
  1. Defeats the purpose of using `appearance="accent"` in the template.
  2. Hardcodes `#fff` for text color, which will not adapt to dark theme if accent-2 ever uses a lighter background.
  3. Overrides padding and font-size, which should be controlled by Taiga's button sizing system (the `size` input).
  4. Will break silently if Taiga UI changes its internal DOM or CSS custom property structure.

  The fix is to remove the entire `.cta [tuiButton]` block and rely on Taiga's built-in theming. If a gradient effect is truly needed for visual flair, it should be introduced as a custom property override in `_theme.scss` (e.g., overriding `--tui-background-accent-2` with a gradient), not as a component-level override. However, a solid orange button is likely sufficient for an MVP, so I will remove the overrides entirely and let Taiga handle it.

#### architect-reviewer — Fragile `href` assertion in unit test
- **Decision**: Fix
- **Reasoning**: Although marked Low severity, this is worth fixing alongside the other changes since we are already touching this component. The test uses `provideRouter([])` with an empty route table, so the `href` attribute resolution depends on Angular's internal behavior for unknown routes. Asserting `routerLink` via the element attribute (`cta.getAttribute('routerLink')`) or adding a stub route to the test config is more robust. Since this is a small, low-risk change that improves test reliability, it makes sense to include it in the refactor pass.

#### Low-severity / Nitpick findings
- The single Low finding (fragile href assertion) will be addressed as described above, since we are already modifying the component and test files for the Medium findings. The cost of fixing it is minimal and it prevents a flaky test.

---

## Cycle 2 Review (after refactor)

### codestyle-reviewer
No issues found. Previous finding (broad `[tuiButton]` selector) confirmed fixed — SCSS override block removed entirely.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
No issues found. Both previous findings confirmed fixed:
1. Hand-rolled gradient SCSS block removed — `.cta` now contains only layout properties.
2. Test assertion changed from `getAttribute('href')` to `getAttribute('routerLink')`.

## Engineer Assessment (Cycle 2)

### Overall Decision: ACCEPT

### Reasoning
All four reviewers returned no issues on re-review. The two Medium findings and one Low finding from cycle 1 were all correctly addressed: the SCSS override block was removed entirely (letting Taiga UI's `appearance="accent"` handle theming), and the test assertion was changed to assert `routerLink` directly instead of relying on router `href` resolution. No refactoring needed.
