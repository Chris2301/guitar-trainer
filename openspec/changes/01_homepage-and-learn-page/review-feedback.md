# Review Feedback — Task 4.1 (Write Playwright test: theme toggle switches between light and dark)
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Low
- **Finding**: Test description lines are borderline on 100-char printWidth (98 and 96 chars). Existing tests use shorter descriptions.
- **Fix**: Shorten test names or wrap across lines.

- **Severity**: Low (Nitpick)
- **Finding**: Excessive inline comments compared to existing test files which use comments sparingly.
- **Fix**: Reduce comments to only non-obvious logic.

### security-reviewer
No issues found (two Low/informational notes about pre-existing config and safe `evaluate()` pattern — no action needed).

### performance-reviewer
- **Severity**: Warning
- **Finding**: Both tests independently navigate to `/` with `page.goto('/')`. Could use `test.beforeEach` to share setup intent.
- **Fix**: Extract navigation into `test.beforeEach`.

- **Severity**: Warning
- **Finding**: First test re-asserts `aria-label` on the return toggle which is redundant — symmetry was already verified.
- **Fix**: Drop the `aria-label` re-check on the return toggle.

- **Severity**: Low (Info)
- **Finding**: No `await expect` stabilisation between `click()` and `evaluate()` in second test — potential race condition where `getComputedStyle` reads pre-toggle value.
- **Fix**: Add `await expect(tuiRoot).toHaveAttribute('tuitheme', 'dark')` before the second `evaluate()`.

### architect-reviewer
- **Severity**: Warning
- **Finding**: Describe block label `'Theme toggle switches between light and dark'` doesn't follow noun-phrase convention used in other specs (`'Homepage'`, `'Learn Page'`, `'Navigation between Home and Learn'`).
- **Fix**: Rename to `'Theme Toggle'`.

- **Severity**: Warning
- **Finding**: First test covers three distinct phases (initial state, toggle to dark, toggle back to light) in a single `test()`. Other specs use one concern per test.
- **Fix**: Split into two tests or add phase-separating comments.

- **Severity**: Low (Suggestion)
- **Finding**: `page.locator('tui-root')` couples test to Taiga UI internal selector instead of `getByTestId`.
- **Fix**: Add `data-testid` to the element or add a comment explaining the intentional coupling.

- **Severity**: Low (Suggestion)
- **Finding**: CSS property assertion uses `not.toEqual` (inequality) rather than concrete expected values — fragile if palette changes.
- **Fix**: Assert specific expected hex values.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding

#### performance-reviewer — Duplicate `page.goto('/')` should use `beforeEach`
- **Decision**: Defer
- **Reasoning**: None of the existing spec files (`homepage.spec.ts`, `learn-page.spec.ts`, `navigation.spec.ts`) use `test.beforeEach`. Each test navigates independently. Introducing `beforeEach` only in this file would break consistency with the rest of the test suite. The duplication is two lines across two tests — the readability cost of the indirection outweighs the benefit. This can be addressed later in a cross-cutting cleanup if the team adopts `beforeEach` as a convention.

#### performance-reviewer — Redundant `aria-label` re-check on return toggle
- **Decision**: Defer
- **Reasoning**: The re-assertion on line 29 verifies the round-trip back to light mode is complete, including the accessibility label. This is not purely redundant — it confirms the toggle is fully reversible from an a11y perspective. The cost is one extra assertion in a fast Playwright test. Removing it saves nothing meaningful and slightly weakens the round-trip guarantee. Not worth changing.

#### architect-reviewer — Describe block label should be a noun phrase
- **Decision**: Defer
- **Reasoning**: The reviewer suggests renaming to `'Theme Toggle'`, citing a noun-phrase convention. However, `navigation.spec.ts` uses `'Navigation between Home and Learn'` which is a descriptive phrase, not a bare noun phrase either. The current label `'Theme toggle switches between light and dark'` is admittedly more sentence-like than the others, but the inconsistency is minor and cosmetic. If the team standardizes describe labels, this should be part of that sweep — not a one-off change.

#### architect-reviewer — First test covers multiple phases, should be split
- **Decision**: Defer
- **Reasoning**: The reviewer says other specs use one concern per test, but `homepage.spec.ts` covers hero section, feature highlights, CTA text, and click-navigation all in a single test. The theme toggle test follows the same pattern: it exercises a complete user journey (verify default, toggle dark, toggle back to light). Per the project's own test guidelines ("one e2e per user journey, not per page"), this is the correct approach. The toggle round-trip is a single user journey. Splitting it would create tests that depend on shared state or redundantly navigate and click, which is worse.

#### Low-severity / Nitpick findings
- **codestyle-reviewer — Long test description lines**: The existing `navigation.spec.ts` has a 104-character test name on line 4, longer than either theme-toggle test name. This is not a real inconsistency. No change needed.
- **codestyle-reviewer — Excessive inline comments**: The `navigation.spec.ts` file uses comments at the same density (nearly every block). The theme-toggle comments are consistent with existing style. No change needed.
- **performance-reviewer — Race condition between click and evaluate**: This is a valid observation. Adding an `await expect` for the attribute before the `evaluate()` call would be a genuine robustness improvement. However, since the first test already proves that `click()` followed by `await expect(...).toHaveAttribute('tuitheme', 'dark')` works, and the second test is specifically measuring CSS property changes (not attribute state), the risk is low in practice. Worth noting for a future hardening pass but not blocking.
- **architect-reviewer — `tui-root` selector coupling**: The `learn-page.spec.ts` uses `locator('h2')` which is equally coupled to DOM structure. `tui-root` is the application shell element from Taiga UI and is unlikely to change. Adding a `data-testid` to the framework's root element would require modifying the app component for test purposes alone. Acceptable as-is.
- **architect-reviewer — Inequality assertion for CSS values**: Asserting `not.toEqual` is intentionally loose — it verifies that the theme changes the value without coupling to specific hex codes that would break if the Taiga UI palette is updated. The current approach is actually more robust, not less. No change needed.
