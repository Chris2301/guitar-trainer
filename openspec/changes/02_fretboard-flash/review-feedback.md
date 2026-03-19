# Review Feedback
## Status: FAIL
## Findings
### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: `ProgressionService` is `providedIn: 'root'` but carries mutable game state (`currentFret`, `pool`, `shownNoteKeys`). Because it is a root singleton, that state persists across Angular navigation. If the user navigates away and returns, the service retains the previous session's progression — unless `reset()` is explicitly called by the component on init.
- **Fix**: Either (a) scope the service to the feature component by moving to `@Component({ providers: [ProgressionService] })`, giving automatic teardown on destroy, or (b) keep root scope but document that the game component must call `reset()` in `ngOnInit`. Option (a) is safer.

- **Severity**: Medium
- **Finding**: `getRandomNote()` has no guard for an empty pool. If `pool` is ever empty, `pool[index]` returns `undefined` and the caller gets a silent null-dereference at runtime.
- **Fix**: Add a guard: `if (this.pool.length === 0) { throw new Error('ProgressionService: pool is empty'); }`

- **Severity**: Low
- **Finding**: The `MAX_FRET` constant is defined as a module-level `const` inside the service file. This duplicates the upper bound already encoded in `note-data.ts` (frets 0–15). If data is extended, `MAX_FRET` must be updated in two places.
- **Fix**: Export `MAX_FRET` from `note-data.ts` or derive it from `FRET_NOTES`.

- **Severity**: Low
- **Finding**: The test "should not expand beyond fret 15" fast-forwards through 15 iterations with large pools. Could be tested more efficiently with spies.
- **Fix**: Consider using `spyOn(noteDataService, 'getNotesOnFret').and.returnValue([])` to isolate the boundary check.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — Root-scoped service with mutable game state
- **Decision**: Fix
- **Reasoning**: This is a real and practical bug. The service is `providedIn: 'root'`, so if the user navigates to Fretboard Flash, progresses to fret 5, navigates away, and comes back, they will resume at fret 5 with the old pool instead of starting fresh. Option (a) — scoping the service to the game component via `@Component({ providers: [...] })` — is the cleanest fix. It gives automatic teardown, eliminates the need for the consumer to remember to call `reset()`, and the service has no reason to be a root singleton since no other feature needs it. This also aligns with the design doc which describes it as a game-session-scoped concern. The `reset()` method can be kept for in-session restarts but is no longer the primary lifecycle mechanism. Worth fixing now before Task 3.4 integrates it into the page component.

#### architect-reviewer — getRandomNote() has no guard for empty pool
- **Decision**: Fix
- **Reasoning**: This is a valid defensive programming concern. While the pool is initialized in the constructor and `expandPool` only replaces it with non-empty results from `getNotesUpToFret`, the failure mode (returning `undefined` silently) is worse than throwing an explicit error. The guard is a single line and makes the contract explicit. If a future refactor or test setup creates a scenario with an empty pool, a clear error is far better than a downstream `Cannot read property 'note' of undefined`. Low effort, high clarity — worth fixing.

#### Low-severity / Nitpick findings
- **MAX_FRET duplication** (Low): Will defer. The constant `15` is also hardcoded in the `generateFretNotes` loop in `note-data.ts`, so the duplication already exists in more than one form. Deriving it from `FRET_NOTES` adds a runtime computation for a value that is fundamentally a design constant. For a ~50-note dataset this is not a maintenance risk yet. Can be addressed if/when the fret range becomes configurable.
- **Test efficiency for fret-15 boundary test** (Low): Will not address. The current test is an integration-style test that exercises the real expansion path end-to-end, which gives higher confidence than a spy-based unit test. It runs in milliseconds against in-memory data. The test is readable and correct — optimizing it would reduce coverage confidence for no meaningful performance gain.

## Re-review (Cycle 2)
### Status: PASS
All 4 reviewers confirmed fixes were correctly applied. No new issues found.
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: Both fixes verified — `providedIn: 'root'` removed, empty pool guard added with test coverage
