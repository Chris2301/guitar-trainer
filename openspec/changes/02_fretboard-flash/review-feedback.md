# Review Feedback — Task 6.2: Playwright test: game loop — note appears, answer appears on fretboard, next note
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Low
- **Finding**: Duplicate assertion — `page.getByTestId('note-marker')` is asserted as not visible at line 16 (IDLE state) and again at line 31 (after SHOW_NOTE), which is redundant since the marker wouldn't appear between those two points.
- **Fix**: Remove the duplicate assertion at line 31 and its comment.

- **Severity**: Nitpick
- **Finding**: Variable name `noteStillShown` is awkward.
- **Fix**: Rename to something more descriptive like `noteAfterMarkerAppears`, or inline the assertion.

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Critical
- **Finding**: Test waits against real production timers (5s SHOW_NOTE + 3s SHOW_ANSWER = 8s minimum wall-clock time per run). On CI with retries, this could burn 24s on one test.
- **Fix**: Make timer durations injectable via an InjectionToken with test-overridable values, or expose a query parameter for fast mode. Reduce E2E timeout ceilings accordingly.

- **Severity**: Low
- **Finding**: `page.getByTestId('note-marker')` is called 4 times before being assigned to a variable at line 35. Inconsistent with the pattern used for `startButton` and `noteDisplay`.
- **Fix**: Hoist the `noteMarker` locator assignment to before the IDLE-state assertions.

- **Severity**: Low
- **Finding**: `textContent()` uses non-null assertion `!` without guard, which could produce misleading error messages.
- **Fix**: Add a null check or use `expect(noteDisplay).toHaveText(...)` with regex.

### architect-reviewer
- **Severity**: Medium
- **Finding**: Test relies on hardcoded wall-clock delays tied to game's internal timing constants (~5s + ~3s). If those constants change, the test becomes silently wrong or flaky.
- **Fix**: Expose timing constants as test-overridable values (e.g. query parameter or injectable token) so tests can control game pace.

- **Severity**: Low
- **Finding**: Partial overlap with `fretboard-flash-theme.spec.ts` in the IDLE-to-SHOW_NOTE transition. Both tests click start and assert note visibility.
- **Fix**: Extract shared game-start sequence into a helper. Not urgent at current scale.

- **Severity**: Low
- **Finding**: `VALID_NOTES` constant defined at module level could be shared with future tests.
- **Fix**: Move to a shared helpers file when a second usage site appears.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding

#### performance-reviewer — Real timer waits cause 8s+ E2E test runtime (Critical)
- **Decision**: Accept
- **Reasoning**: The proposed fix (injectable timer durations or query-parameter fast mode) introduces production code complexity solely to speed up one E2E test. The 8s wall-clock time is well within normal bounds for an E2E test that validates a real-time game loop — Playwright tests routinely wait for animations, network calls, and timed transitions. Even with 3 retries the worst case is ~24s, which is not a CI bottleneck for a project of this scale with a small E2E suite. The test already uses Playwright's built-in `timeout` option on assertions, which is the idiomatic way to handle timed waits. Adding an InjectionToken or query parameter to bypass real timers would mean the E2E test no longer validates the actual user experience, which defeats the purpose of testing the game loop end-to-end. If the timer count or total test time becomes a real CI problem in the future, this can be revisited. The severity is overstated — this is a Low concern, not Critical.

#### architect-reviewer — Hardcoded delays coupled to internal timing constants (Medium)
- **Decision**: Accept
- **Reasoning**: This is the same underlying concern as the performance-reviewer finding. The test does not hardcode the exact timer values — it uses Playwright assertion timeouts (7000ms for a 5000ms timer, 5000ms for a 3000ms timer) that provide generous margins. If someone changes the production timer constants, the E2E test would either still pass (if the new values are shorter) or fail visibly (if they are longer than the Playwright timeouts), which is the correct behavior — the test acts as a regression guard. The risk of "silent wrongness" is low because the test verifies observable UI state transitions, not internal timer values. Making timers injectable adds indirection to a simple service for marginal test benefit. At the current scale (one game, two timer constants), this is not worth the added complexity.

#### Low-severity / Nitpick findings
- **Locator hoisting** (performance-reviewer, Low): Reasonable cleanup. The `noteMarker` locator should be hoisted to match the pattern used for `startButton` and `noteDisplay`. Will address if a refactor round happens.
- **Duplicate marker assertion** (codestyle-reviewer, Low): The assertion at line 31 is not truly redundant — it explicitly documents that during SHOW_NOTE state the marker is not yet visible, which is a distinct logical checkpoint from the IDLE state assertion at line 16. Acceptable to keep for readability as a demo-oriented test.
- **`noteStillShown` naming** (codestyle-reviewer, Nitpick): Minor style preference. The current name is clear enough in context.
- **Non-null assertion on `textContent()`** (performance-reviewer, Low): Valid point but low risk — if `textContent()` returns null, the test fails anyway, just with a less descriptive error. Could be improved with `toHaveText()` but not urgent.
- **Shared game-start helper** (architect-reviewer, Low): Agreed with the reviewer's own note — not urgent at current scale. Apply when a second usage site appears.
- **Shared `VALID_NOTES`** (architect-reviewer, Low): Same — defer until reuse is needed.

None of these Low/Nitpick findings warrant a refactor pass on their own.
