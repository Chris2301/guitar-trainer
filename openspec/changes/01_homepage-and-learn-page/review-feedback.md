# Review Feedback — Task 2.1 (Playwright test: learn page placeholder content)
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
- **Finding**: The test asserts `exercise-slot` elements exist, but the spec (`specs/ui/spec.md`) only requires "placeholder content indicating training exercises will be available soon." The `exercise-slot` assertion over-specifies structure beyond what the spec requires.
- **Fix**: Remove the `exercise-slot` assertion. The spec only requires placeholder content to be visible, not a list of exercise slots.

- **Severity**: Medium
- **Finding**: The test description says "correct structure for future training exercises" but the spec scenario is simply "placeholder content is shown." The homepage test stays close to spec language — this test should do the same.
- **Fix**: Trim the test to match spec intent: verify the page loads at `/learn`, a section is visible, a heading containing "Learn" is present, and a paragraph containing "training exercises" is visible.

- **Severity**: Low
- **Finding**: The `page.goto('/learn')` call has no explicit `waitUntil` option. Consistent with homepage test pattern, but noted for robustness.
- **Fix**: If flakiness appears, add `waitUntil: 'networkidle'`. Not urgent.

**Note on "Critical" DOM mismatch findings**: The reviewer flagged that the test's `data-testid` attributes and `h1` heading don't match the current component. These are NOT bugs — this is TDD RED phase. The test defines the contract that task 2.2 (Create LearnComponent) must fulfill. The test is intentionally written to fail against the current state.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — exercise-slot assertion over-specifies beyond spec
- **Decision**: Fix
- **Reasoning**: The spec scenario for the learn page says "placeholder content is shown indicating that training exercises will be available soon." It does not mention a list of exercise slots, exercise categories, or any repeated structural elements. The `exercise-slot` assertion invents a DOM contract that has no basis in the requirement. This matters because in TDD RED phase, the test defines the contract for the next implementation step (task 2.2). An over-specified test forces the implementer to build structure the spec never asked for, which adds unnecessary complexity and couples the test to an arbitrary design decision. Removing the `exercise-slot` assertion keeps the test honest to the spec. This is a valid Medium finding and should be fixed.

#### architect-reviewer — test description does not match spec language
- **Decision**: Fix
- **Reasoning**: The current test name is "should display placeholder content with correct structure for future training exercises." The phrase "correct structure for future training exercises" implies structural assertions that go beyond the spec. The homepage test uses a name that closely mirrors its spec scenario ("should display hero, features and CTA linking to learn page"). This test should follow the same convention: describe what the user sees, not what the DOM structure looks like. A name like "should display placeholder content indicating training exercises coming soon" or similar would be more aligned with the spec. This is a straightforward rename with no risk, and it improves clarity for anyone reading test output. Fixing this alongside the exercise-slot removal is natural.

#### architect-reviewer — no explicit waitUntil on page.goto
- **Decision**: Accept (no change needed)
- **Reasoning**: This is a Low severity finding and the reviewer themselves note it is not urgent. The homepage test uses the same pattern without `waitUntil`, so both tests are consistent. Playwright's default `waitUntil: 'load'` is sufficient for a static SPA. Adding `networkidle` prematurely can actually slow tests down and introduce flakiness in CI environments where background requests (analytics, health checks) may keep the network busy. If flakiness appears later, this can be revisited then.

#### Low-severity / Nitpick findings
- The `waitUntil` finding is the only low-severity item. It will not be addressed now because it is speculative (no flakiness observed), the current pattern is consistent with the homepage test, and premature optimization of test configuration adds noise without value.

---

## Cycle 2 Review (after refactor)

### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
No issues found. Both previous findings confirmed fixed: exercise-slot assertion removed, test description updated to match spec language.

## Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT

### Reasoning
All four reviewers returned no issues on re-review. Both Medium findings from cycle 1 were correctly addressed. No new issues introduced.
