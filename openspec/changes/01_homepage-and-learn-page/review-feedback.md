# Review Feedback — Task 3.2 (Configure routing)
## Status: FAIL
## Findings

### codestyle-reviewer
- **Severity**: Medium
- **Finding**: Test name in `app.spec.ts` ("should inject ThemeService and expose theme name for tui-root") is misleading — the test only checks a DOM attribute, not ThemeService injection.
- **Fix**: Rename to `'should set tuiTheme attribute on tui-root based on theme signal'`

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Warning
- **Finding**: Test name in `app.spec.ts` is misleading — implies testing a service contract but only tests a rendered attribute.
- **Fix**: Rename to something accurate, e.g. `'should render tui-root with light theme attribute by default'`

- **Severity**: Warning
- **Finding**: Two E2E smoke tests deleted ("should render the app root element", "should render the Taiga UI root"). No E2E test now verifies fundamental DOM scaffolding renders.
- **Fix**: Retain at least one structural smoke assertion, e.g. `expect(page.locator('tui-root')).toBeAttached()`

- **Severity**: Warning
- **Finding**: `app.routes.ts` has no wildcard (`**`) route. Unknown URLs render blank page.
- **Fix**: Add `{ path: '**', redirectTo: '' }`

- **Severity**: Suggestion
- **Finding**: `provideRouter(routes)` is bare — adding `withComponentInputBinding()` avoids boilerplate later.
- **Fix**: `provideRouter(routes, withComponentInputBinding())` in `app.config.ts`

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — Misleading test name in app.spec.ts
- **Decision**: Fix
- **Reasoning**: The test name says "should inject ThemeService and expose theme name for tui-root" but the test body only checks that `tui-root` has a `tuitheme="light"` attribute. It does not assert anything about ThemeService injection. A misleading test name actively hurts maintainability because a future developer reading the test suite will have wrong expectations about what is covered. This is a trivial rename with zero risk. Will fix.

#### architect-reviewer — Misleading test name (duplicate of above)
- **Decision**: Fix
- **Reasoning**: Same finding as codestyle-reviewer. Both reviewers independently flagged it, which reinforces that the name is genuinely confusing. Will address together with the codestyle fix above. The architect's suggested name ("should render tui-root with light theme attribute by default") is slightly more precise about what the test actually verifies, so I will use a name close to that.

#### architect-reviewer — Deleted E2E smoke tests leave no DOM scaffolding verification
- **Decision**: Accept (no change)
- **Reasoning**: The existing `smoke.spec.ts` still verifies the app loads (checks page title). The `navigation.spec.ts` journey test navigates to `/`, asserts the header is visible, clicks links, and verifies URLs. If the app root or `tui-root` failed to render, every one of these tests would fail. Adding a standalone assertion for `tui-root` being attached is exactly the kind of "test framework plumbing, not behavior" test that our test guidelines explicitly prohibit. The scaffolding is implicitly covered by every E2E journey that loads the app. No action needed.

#### architect-reviewer — No wildcard route causes blank page on unknown URLs
- **Decision**: Fix
- **Reasoning**: This is a real usability bug. If a user navigates to a non-existent URL (e.g., `/typo`), they see a blank page with no feedback. Adding `{ path: '**', redirectTo: '' }` is a one-line change with no risk that provides correct fallback behavior. This is standard Angular routing practice and should have been included from the start.

#### Low-severity / Nitpick findings
- **architect-reviewer suggestion (withComponentInputBinding)**: Defer. This is a forward-looking convenience feature, not a current requirement. Adding it now would be speculative — no route currently uses input binding. It can be added when the first route parameter is needed, at which point a test will drive it. Adding unused configuration contradicts the "minimal code" TDD principle.

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed fixes were applied correctly. No new findings.
- **codestyle-reviewer**: No issues found. Test name fix verified correct.
- **security-reviewer**: No issues found.
- **performance-reviewer**: No issues found.
- **architect-reviewer**: No issues found. Both fixes (test rename + wildcard route) verified correct.
