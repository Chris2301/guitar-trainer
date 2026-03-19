# Review Feedback
## Status: FAIL
## Findings
### codestyle-reviewer
- **Severity**: Low
- **Finding**: Missing "should be created" test for NoteDataService — project convention present in other services.
- **Fix**: Add `it('should be created', () => { expect(service).toBeTruthy(); });` as the first test.

- **Severity**: Low
- **Finding**: Inconsistent variable naming in test file. Lines 75 and 83 use single-letter `n` while most loops use `note`.
- **Fix**: Rename `n` to `note` in both places for consistency.

### security-reviewer
No issues found.

### performance-reviewer
No issues found.

### architect-reviewer
- **Severity**: Medium
- **Finding**: `NoteDataService` is an `@Injectable` wrapping a pure filter over a static constant. No HTTP, async, or shared mutable state. The three methods are plain functions on `FRET_NOTES`. Wrapping in a service adds a layer without earning its complexity.
- **Fix**: Export the three filter functions directly from `note-data.ts` or a sibling `note-data.utils.ts`. If a service boundary is desired for future testability or because `ProgressionService` (task 1.3) will depend on it, keep the service but document the rationale.

- **Severity**: Medium
- **Finding**: Test at line 72–79 ("should return the same notes as manual filtering") duplicates the implementation verbatim — tautological test that asserts `Array.filter` equals `Array.filter`.
- **Fix**: Replace with a concrete, value-based assertion: pick a specific range (e.g., frets 2–4), enumerate exact expected `{ string, fret, note }` tuples from domain knowledge, and assert against those.

- **Severity**: Low
- **Finding**: Test at lines 137–145 ("should return an empty array for a fret with no natural notes") derives its expected value from the same dataset it tests. The comment says fret 11 has no natural notes but the test never verifies that belief.
- **Fix**: Assert the concrete value directly: `expect(result.length).toBe(0)` if correct, or remove the misleading comment.

- **Severity**: Low
- **Finding**: Barrel export in `index.ts` exports `FRET_NOTES` (large static array) at the feature boundary. Consumers who only need the service will pull in the dataset.
- **Fix**: Only export what external consumers need. Keep `FRET_NOTES` package-private if nothing outside the feature folder needs it directly.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding

#### architect-reviewer — NoteDataService wraps pure functions unnecessarily
- **Decision**: Accept (keep service)
- **Reasoning**: The reviewer's observation is technically correct -- the methods are pure filters over static data. However, the reviewer themselves note that if `ProgressionService` (task 1.3, the very next task) will depend on it, keeping the service is justified. Looking at the task list, `ProgressionService` will indeed consume note data, and injecting `NoteDataService` into it is the standard Angular pattern for DI-based composition and testability. The service costs almost nothing in complexity (20 lines, no state). Refactoring to free functions now and then potentially wrapping them again later would be churn. No change needed.

#### architect-reviewer — Tautological test duplicates implementation
- **Decision**: Fix
- **Reasoning**: This is a valid Medium-severity finding. The test at lines 72-79 literally copies the filter logic from the service and asserts that the service produces the same result. If the implementation has a bug, the test has the same bug. This test provides zero regression protection. It should be replaced with a concrete, value-based assertion using domain knowledge (e.g., assert exact notes expected in frets 2-4).

#### Low-severity / Nitpick findings
- **codestyle-reviewer -- Missing "should be created" test**: Will not fix. Our own test guidelines explicitly state "never write tests that only check something exists". A `should be created` test verifies Angular DI works, not our business logic. Adding it would contradict the project's testing philosophy.
- **codestyle-reviewer -- Inconsistent variable naming (`n` vs `note`)**: Will fix while addressing the tautological test, since line 75 is inside that test. Line 83 will also be updated for consistency. Low effort, improves readability.
- **architect-reviewer -- Fret 11 test derives expected value from dataset**: Will fix. I confirmed fret 11 has zero natural notes across all strings. The test should simply assert `expect(result.length).toBe(0)` rather than deriving the expected value from `FRET_NOTES`. This is a quick, valuable improvement to test clarity.
- **architect-reviewer -- Barrel export of FRET_NOTES**: Will fix. No external consumer currently needs `FRET_NOTES` directly -- they should go through the service. Removing it from the barrel export is a one-line change that improves encapsulation.

## Re-review (Cycle 2)
### Status: PASS
All 4 reviewers confirmed fixes were correctly applied. No new issues found.
- **codestyle-reviewer**: No issues found — variable naming fix verified
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: All three fixes (#2 tautological test, #3 fret 11 assertion, #4 barrel export) verified as correct
