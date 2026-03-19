# Review Feedback — Task 6.1: Playwright test: navigation from Learn page to Fretboard Flash
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Low
- **Finding**: Function signature breaks `{ page }` across two lines, inconsistent with other tests that use single-line format
- **Fix**: Put `async ({ page }) => {` on one line

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: Test starts at `/` and clicks `nav-learn` to reach `/learn`, duplicating navigation already covered in `navigation.spec.ts` and `homepage.spec.ts`. The subject of this test is Learn → Fretboard Flash, not homepage → Learn.
- **Fix**: Start with `page.goto('/learn')` instead of navigating from homepage.

- **Severity**: Medium
- **Finding**: Test asserts `fretboard-flash-page`, `start-button`, and `fretboard-wrapper` visibility on the game page, overlapping with assertions already in `fretboard-flash-theme.spec.ts`. Navigation journey tests should verify URL arrival and one sentinel element, not detailed page content.
- **Fix**: Limit destination assertions to `toHaveURL` and one sentinel element (e.g. `fretboard-flash-page`). Leave element-level checks to dedicated page tests.

- **Severity**: Low
- **Finding**: Deletion of `learn-page.spec.ts` is appropriate — the new file covers its intent.
- **Fix**: No action needed.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### codestyle-reviewer — Function signature line break inconsistency
- **Decision**: Fix
- **Reasoning**: Trivial to fix while making the other changes, and it brings the file in line with the formatting convention used in every other test file in the project. Will address during refactor.

#### architect-reviewer — Test duplicates homepage-to-Learn navigation
- **Decision**: Fix
- **Reasoning**: This is a valid Medium finding. The test is titled "navigates from Learn page to Fretboard Flash" but it starts at `/` and clicks through to `/learn`, which is the exact journey already covered by both `navigation.spec.ts` (line 19: click Learn link, assert `/learn` URL) and `homepage.spec.ts` (line 26-27: click CTA, assert `/learn` URL). Starting at `page.goto('/learn')` makes the test faster, more focused on its actual subject, and eliminates redundant coverage. This directly aligns with the project guideline "One e2e per user journey, not per page."

#### architect-reviewer — Redundant destination page assertions
- **Decision**: Fix
- **Reasoning**: This is a valid Medium finding. After navigating to `/learn/fretboard-flash`, the test asserts visibility of `fretboard-flash-page`, `start-button`, and `fretboard-wrapper`. The theme test (`fretboard-flash-theme.spec.ts`) already thoroughly verifies `fretboard-flash-page` and `start-button` visibility (lines 7-8, 18-19). A navigation journey test should confirm arrival (URL check + one sentinel element) and stop there. Asserting detailed page content couples this test to the destination page's internal structure, making it brittle and duplicative. The fix is to keep only `toHaveURL` and the `fretboard-flash-page` sentinel assertion, removing `start-button` and `fretboard-wrapper` checks.

#### Low-severity / Nitpick findings
- The `learn-page.spec.ts` deletion acknowledgment (architect-reviewer, Low) requires no action. The codestyle line-break finding will be addressed as part of the refactor since the cost is zero.

## Re-Review (Cycle 2)
- **codestyle-reviewer**: PASS — function signature reformatted to single line
- **security-reviewer**: PASS — no security changes to re-evaluate
- **performance-reviewer**: PASS — no performance changes to re-evaluate
- **architect-reviewer**: PASS — test now starts at `/learn`, redundant destination assertions removed, only sentinel element retained

### Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT
