# Review Feedback
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
- **Finding**: `note` field on `FretNote` is typed as `string` but the design spec and interface comment document it as a union `'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'`. Using `string` gives no compiler protection against invalid note names.
- **Fix**: Narrow the type to a literal union: `export type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';` and use it in the interface.

- **Severity**: Low
- **Finding**: The barrel `index.ts` exports `FretNote` and `FRET_NOTES` as public API before any consumer exists. Acceptable as forward-looking but should be re-evaluated when components are added.
- **Fix**: No action needed now. Re-evaluate when feature is complete.

- **Severity**: Low
- **Finding**: Magic numbers `1.5`, `3`, and `94` in `fretXPosition()` have no named constants.
- **Fix**: Extract to named constants like `OPEN_NOTE_X`, `FRET_START_X`, `FRET_X_RANGE`.

- **Severity**: Low
- **Finding**: In `note-data.spec.ts` line 122, `.sort()` mutates the `expected` array in-place (shared test data).
- **Fix**: Shallow-copy before sorting: `[...expectedNaturalNotes[s]].sort(...)`.

## Engineer Assessment
### Overall Decision: REFACTOR
### Reasoning per finding
#### architect-reviewer — `note` field typed as `string` instead of literal union
- **Decision**: Fix
- **Reasoning**: This is a legitimate type-safety gap. The comment on line 3 of `note-data.ts` already documents the intended constraint as `'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'`, but the actual TypeScript type is `string`, so the compiler cannot enforce it. The `CHROMATIC_SCALE` is already declared `as const`, and the `NATURAL_NOTES` set contains exactly these seven values, so narrowing the type is straightforward and low-risk. Introducing a `NaturalNote` type alias also improves readability for downstream consumers (components, stores) that will use `FretNote`. The fix is small, adds no new complexity, and delivers real compile-time safety. Worth doing now.

#### Low-severity / Nitpick findings
- **Barrel export before consumers exist** (Low): Accept as-is. The reviewer themselves noted no action needed. Barrel files are standard Angular convention and having them ready is fine.
- **Magic numbers in `fretXPosition()`** (Low): Defer. These position values are explicitly documented in the function comment as approximate values that "will be fine-tuned later." Extracting them to named constants now adds indirection for values that are likely to change. Once the fretboard visual is finalized and the numbers are stable, extracting constants would be more meaningful. Not worth the churn now.
- **`.sort()` mutating shared test data** (Low): Fix alongside the Medium finding since we will already be touching the files. The `expectedNaturalNotes` object is used in multiple test assertions within the same `describe` block, and while the current test order happens to work, in-place mutation of shared test data is a latent bug that could cause flaky tests if test order changes or new tests reference the same data. The fix is a single spread operator and costs nothing.

## Re-review (Cycle 2)
### Status: PASS
All 4 reviewers confirmed fixes were correctly applied. No new issues found.
- **codestyle-reviewer**: No issues found
- **security-reviewer**: No issues found
- **performance-reviewer**: No issues found
- **architect-reviewer**: Both fixes (NaturalNote type + .sort() spread) verified as correct
