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
- **Finding**: `getRandomNote` now has a hidden side effect — calling it auto-marks the returned note as shown and may silently trigger pool expansion. The method name implies a pure read operation. A caller who calls `getRandomNote` in a loop for statistical sampling (as the existing test on line 60 does) will unintentionally advance the pool and alter internal state as a side effect of what looks like a query. Rename to `drawNote` or `nextNote` to signal state advancement, or add a JSDoc comment documenting the side effect.
- **Fix**: Rename `getRandomNote` to `drawNote` or `nextNote` to make the side effect self-documenting.

- **Severity**: Medium
- **Finding**: The test "should trigger pool expansion when getRandomNote completes showing all pool notes" does not actually call `getRandomNote`. It calls `markNoteAsShown` directly, so it does not test the integration path it claims to test. The test title is misleading.
- **Fix**: Rename the test to "should expand pool when all notes marked via markNoteAsShown" to match what it actually does.

- **Severity**: Low
- **Finding**: `expandPool` at max fret clears `shownNoteKeys` but does not change `currentFret` or `pool`. The asymmetry is intentional but only explained by a comment. No code change required — documentation note.
- **Fix**: No change needed; comment is sufficient.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — getRandomNote has hidden side effect, should be renamed
- **Decision**: Fix
- **Reasoning**: This is a valid finding. `getRandomNote` sounds like a pure query but it mutates internal state (marks as shown, may trigger pool expansion). The statistical test on line 60-68 calls it 50 times in a loop, which will cause multiple pool expansions as a side effect — the test still passes by coincidence because expansion adds more notes, but it is testing different behavior than intended. Renaming to `drawNote` or `nextNote` is cheap, improves API clarity, and prevents future misuse. The rename is low-risk and the method is not yet consumed by many callers since this is a new service.

#### architect-reviewer — misleading test title for pool expansion via getRandomNote
- **Decision**: Fix
- **Reasoning**: The test at line 77 claims to test pool expansion "when getRandomNote completes showing all pool notes" but calls `markNoteAsShown` directly. The title is misleading. Renaming the test to accurately describe what it does is trivial and improves test maintainability. Additionally, once `getRandomNote` is renamed to `drawNote`, this test's describe block name should also be updated.

#### Low-severity / Nitpick findings
- The Low finding about `expandPool` behavior at max fret is acknowledged as a documentation-only note. No code change needed — the existing comment on line 73 is sufficient. Will not address.

## Re-review (Cycle 2)
### Status: PASS
All 4 reviewers confirmed fixes were correctly applied. No new issues found.
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: Both fixes verified — `getRandomNote` renamed to `drawNote` throughout, misleading test title corrected
