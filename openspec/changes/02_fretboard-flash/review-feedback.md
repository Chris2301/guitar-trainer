# Review Feedback — Task 3.3: ProgressionService Integration
## Status: PASS
## Findings

### codestyle-reviewer
No issues found.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: Test "should provide notes that belong to the current progression pool" uses reference equality via `toContain` on the live internal pool. If `drawNote` ever returns a copy instead of the same reference, the test breaks without a real regression.
- **Fix**: Assert via value equality (`pool.some(p => p.string === note.string && p.fret === note.fret)`) instead of reference equality.

- **Severity**: Medium
- **Finding**: Pool-expansion test mocks `Math.random` with a fixed divisor based on initial pool size. The mock doesn't accurately model "each note drawn exactly once" and is fragile under pool size or expansion timing changes.
- **Fix**: Use `vi.spyOn(progression, 'drawNote').mockImplementation(...)` to return each open string note in sequence instead of mocking `Math.random`.

- **Severity**: Low
- **Finding**: `GameStateService` is `@Injectable()` without `providedIn` — its `OnDestroy` lifecycle is tied to the providing component. No guard against accidental `providedIn: 'root'`.
- **Fix**: Add a JSDoc comment noting that `GameStateService` must remain component-provided.

- **Severity**: Low
- **Finding**: Tests use `vi.*` (Vitest API) — should confirm Vitest is the configured test runner.
- **Fix**: Verify `vitest` configuration exists. No change needed if confirmed.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — Reference equality via toContain on live internal pool
- **Decision**: Fix
- **Reasoning**: This is a valid fragility concern. The test on line 367 relies on `toContain` which uses reference equality (`===`). Today this works because `drawNote()` returns the exact object from the internal `this.pool` array, and `getCurrentPool()` returns the same array. However, if `drawNote` or `getCurrentPool` ever returns a defensive copy (a reasonable refactor), the test would fail even though the behavior is correct. The fix is simple — use value-based comparison via `pool.some(p => p.string === note.string && p.fret === note.fret)` — and introduces no new complexity. The same concern applies to the test on line 413 ("should continue the game loop after pool expansion with notes from the expanded pool") which also uses `toContain` on the pool. Both should be fixed.

#### architect-reviewer — Math.random mock in pool-expansion test is fragile
- **Decision**: Defer
- **Reasoning**: The reviewer suggests mocking `drawNote` directly, but that would defeat the purpose of this test. The test on line 370 is an integration test that verifies pool expansion is triggered when notes are drawn through `GameStateService.start()` and `nextNote()` — the whole point is that `drawNote` actually executes and calls `markNoteAsShown`, which triggers `expandPool`. Mocking `drawNote` would bypass the exact integration path being tested. The `Math.random` mock is admittedly fragile (it assumes knowledge of the pool size and the `Math.floor(Math.random() * length)` formula), but the alternative of mocking `drawNote` would make this a unit test, not an integration test, and we already have unit tests for `ProgressionService` in isolation. The current approach works and tests the real integration path. If the pool size or random selection algorithm changes, the test will need updating, but that is an acceptable maintenance cost for an integration test of this nature.

#### Low-severity / Nitpick findings
- **JSDoc on GameStateService**: Will address during the refactor pass. Adding a brief comment costs nothing and prevents a future mistake. This is good defensive documentation.
- **Vitest confirmation**: Verified. The project uses `@angular/build:unit-test` (Angular v21 default which uses Vitest) and `vitest ^4.0.8` is listed in `package.json`. No change needed.

## Re-review (Cycle 2)
### Status: PASS
All four reviewers confirmed the fixes were applied correctly:
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: Both `toContain` assertions replaced with value-based comparison. JSDoc added. `Math.random` mock unchanged (deferred). All verified correct.

### Engineer Assessment (Cycle 2)
### Overall Decision: ACCEPT
Both Fix findings have been correctly addressed. No new issues raised. The deferred finding (Math.random mock) remains acceptable as-is per the cycle 1 reasoning.
