# Review Feedback — Task 6.3: Playwright test: progression — pool expands after open notes
## Status: PASS
## Findings

### codestyle-reviewer
- **Severity**: Nitpick
- **Finding**: Multiple sequential `fastForward()` calls (5000 + 3000) could be combined into a single `fastForward(8000)` for readability.
- **Fix**: Combine into `await page.clock.fastForward(8000)`.

- **Severity**: Nitpick
- **Finding**: Side-effect invocation of `this.currentNote()` in computed signal is unconventional, though commented.
- **Fix**: Consider exposing `currentFret` as a signal on `ProgressionService`.

- **Severity**: Nitpick
- **Finding**: Visually-hidden CSS pattern may duplicate a project utility class.
- **Fix**: Check if project has a shared `.visually-hidden` utility.

### security-reviewer
No issues found.

### performance-reviewer
- **Severity**: Medium
- **Finding**: The `currentFret` computed signal reads `this.currentNote()` as a side-effect dependency, then calls `this.progression.getCurrentFret()` which is a plain method (not a signal). This creates a subtle reactivity gap — the computed only reflects a new fret on the next note draw, not immediately when expansion happens.
- **Fix**: Expose `currentFret` as a `signal<number>` inside `ProgressionService` and update it directly in `expandPool()` and `reset()`.

- **Severity**: Medium
- **Finding**: In the E2E test, if `fastForward` does not flush Angular's change detection synchronously, `noteDisplay.textContent()` may read stale DOM, causing potential non-deterministic failures.
- **Fix**: After each `fastForward` pair, add an assertion to ensure Angular has re-rendered before reading `noteDisplay.textContent()` in the next iteration.

- **Severity**: Nitpick
- **Finding**: `FRET_1_ONLY_NOTES` encodes domain knowledge not derived from the same source of truth. If data changes, the test constant will silently diverge.
- **Fix**: Add a comment explaining why F and C are fret-1-exclusive.

### architect-reviewer
- **Severity**: Medium
- **Finding**: `FRET_1_ONLY_NOTES` is an implicit contract with the domain model. If note data changes, the test could silently become weaker or produce false positives.
- **Fix**: Instead of inferring expansion from note names, read the `current-fret` test ID directly and exit the loop when it changes from `'0'` to something higher.

- **Severity**: Medium
- **Finding**: Two `fastForward` calls per cycle (5000 + 3000) are magic numbers with no reference to the source constants. If timings change in `GameStateService`, the test loop silently becomes incorrect.
- **Fix**: Add a comment referencing where the constants come from, or import them.

- **Severity**: Low
- **Finding**: The loop bound of 60 iterations is not justified. If pool composition changes, this could become flaky.
- **Fix**: Document why 60 was chosen (coupon collector problem for 6 items).

- **Severity**: Low
- **Finding**: `currentFret` computed signal uses `currentNote()` as a side-channel reactive dependency — a non-obvious pattern.
- **Fix**: Consider exposing `getCurrentFret()` as a signal on `ProgressionService`.

## Engineer Assessment
### Overall Decision: ACCEPT
### Reasoning per finding

#### performance-reviewer — currentFret reactivity gap via plain method
- **Decision**: Accept
- **Reasoning**: The claimed reactivity gap does not manifest in practice. The call chain is: `drawNote()` calls `markNoteAsShown()` which calls `expandPool()` (updating `this.currentFret`) — all synchronously — before `GameStateService` calls `_currentNote.set(newNote)`. So when the `currentNote` signal changes and the computed re-evaluates, `getCurrentFret()` already returns the updated fret value. The pattern is unconventional but functionally correct. Making `currentFret` a signal in `ProgressionService` is a cleaner design, but it is an improvement, not a bug fix. The same suggestion appears as a Low/Nitpick from two other reviewers, reinforcing that this is a style preference rather than a correctness issue. Deferring to a future cleanup task.

#### performance-reviewer — stale DOM reads in E2E after fastForward
- **Decision**: Accept
- **Reasoning**: Playwright's `page.clock.fastForward()` with fake timers fires pending `setTimeout` callbacks synchronously, which triggers Angular zone-based change detection. The loop already calls `await expect(noteDisplay).toBeVisible()` each iteration, which uses Playwright's auto-waiting and retry mechanism. The test has been passing reliably. This is a theoretical concern without evidence of actual flakiness. If non-deterministic failures appear in CI, this would be the first place to investigate, but adding speculative stabilization now is premature.

#### architect-reviewer — FRET_1_ONLY_NOTES implicit contract with domain model
- **Decision**: Accept
- **Reasoning**: The suggestion to watch `current-fret` test ID changing from `'0'` to a higher value is valid, but the test already does exactly this on line 50-51 (`expect(finalFret).toBeGreaterThanOrEqual(1)`). The `FRET_1_ONLY_NOTES` check is a secondary, complementary assertion that confirms expansion through a different observable (the actual notes appearing), making the test stronger. The domain data (open string notes, fret 1 notes) is musically fundamental and extremely unlikely to change. The existing comment block at lines 1-9 already documents the reasoning. The cost of this coupling is very low.

#### architect-reviewer — magic numbers 5000 and 3000 in fastForward calls
- **Decision**: Accept
- **Reasoning**: The test already has a comment on line 44 explaining the values: "Advance through SHOW_NOTE (5s) then SHOW_ANSWER (3s) to reach next cycle". E2E tests run in a separate process and cannot import TypeScript constants from the Angular app without adding build tooling complexity. The existing comment is sufficient documentation. If the timings change in `GameStateService`, the E2E test would visibly fail (notes would not advance), making the breakage obvious rather than silent.

#### Low-severity / Nitpick findings
- **codestyle — combine fastForward calls**: Accept as-is. Two separate calls mirror the two distinct game phases (SHOW_NOTE then SHOW_ANSWER), making the test more readable and debuggable. Combining them obscures the two-phase structure.
- **codestyle — currentNote() side-effect in computed**: Accept as-is. Already addressed in the Medium finding reasoning above. Deferred to future cleanup.
- **codestyle — visually-hidden CSS duplication**: Accept as-is. Worth checking but not blocking. If a shared utility exists, it can be adopted in a future cleanup.
- **performance — FRET_1_ONLY_NOTES comment**: Accept as-is. The existing comment block at lines 1-9 of the test already explains why F and C are fret-1-exclusive.
- **architect — loop bound of 60 not justified**: Accept as-is. The test already has a comment on line 29-30 explaining the coupon collector reasoning.
- **architect — currentNote() side-channel dependency**: Accept as-is. Same as the codestyle and performance findings on this topic. Deferred.
